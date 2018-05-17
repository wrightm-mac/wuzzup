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

const user = require('../..//models/user');
const puzzle = require('../..//models/puzzle');
const word = require('../..//models/word');


module.exports = {

  name: "updatedocs",
  description: "Adds word-ids to user and puzzle documents.",

  evaluate: function(words, theuser, thepuzzle) {
    return new Promise((resolve, reject) => {
      word.model.find({"occurs.puzzleId": thepuzzle._id})
        .then(dbwords => {
          Promise.all([user.model.findById(theuser._id), puzzle.model.findById(thepuzzle._id)])
            .then(([dbuser, dbpuzzle]) => {
              dbpuzzle.words = [];
              for (const dbword of dbwords) {
                const wordindex = dbuser.words.findIndex(element => { return element.word === dbword.word });
                if (wordindex >= 0) {
                  const  temp = dbuser.words[wordindex];
                  dbuser.words.splice(wordindex, 1);
                  temp.puzzleIds.push(dbpuzzle._id);
                  dbuser.words.push(temp);
                }
                else {
                  dbuser.words.push({
                    word: dbword.word,
                    wordId: dbword._id,
                    puzzleIds: [dbpuzzle._id]
                  });
                }

                dbpuzzle.words.push({
                  word: dbword.word,
                  wordId: dbword._id
                });
              }

              Promise.all([dbuser.save(), dbpuzzle.save()])
                .then(saved => {
                  resolve(`added ${dbwords.length} words`);
                })
                .catch(error => {
                  reject(error);
                });
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}