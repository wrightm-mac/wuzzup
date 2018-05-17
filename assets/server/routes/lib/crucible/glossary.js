/* ----------------------------------------------------------------------------

                            BSD 3-Clause License

                        Copyright (c) 2018, wrightm-mac
                            All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

  * Neither the name of the copyright holder nor the names of its
    contributors may be used to endorse or promote products derived from
    this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

----------------------------------------------------------------------------- */

const helper = require('../helper');

const word = require('../..//models/word');


module.exports = {

  name: "glossary",
  description: "Updates the global collection of words.",

  evaluate: function(words, user, puzzle) {
    return new Promise((resolve, reject) => {
      const date = new Date();

      let count = 0;
      for (const text of words.keys()) {
        ++count;
        word.model.findOne({word: text})
          .then(dbword => {
            const info = words.get(text);

            if (dbword) {
              dbword.count += info.count;
            }
            else {
              dbword = new word.model({
                hash: helper.id(),
                word: text,
                count: info.count,
                occurences: []
              });
            }

            for (const clue of info.clues) {
              dbword.occurs.push({
                clue: clue.clue,
                horizontal: clue.horizontal,
                vertical: clue.vertical,
                userId: user._id,
                username: user.username,
                puzzleId: puzzle._id,
                mode: puzzle.mode,
                date: date
              });
            }

            dbword.save().catch(error => { reject(error); });
          })
          .catch(error => {
            reject(error);
          });
      }

      Promise.all([user.save(), puzzle.save()])
        .then(allsaved => {
          resolve(`processed ${count} words`);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}