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

  name: "letters",
  description: "Analyses a puzzle's letters.",

  evaluate: function(words, user, puzzle) {
    return new Promise((resolve, reject) => {
      let length = 0;
      let lengthHorizontal = 0;
      let lengthVertical = 0;
      let vowels = 0;
      let vowelsHorizontal = 0;
      let vowelsVertical = 0;
      let consonants = 0;
      let consonantsHorizontal = 0;
      let consonantsVertical = 0;
      let frequency= {};
      let frequencyVowel= {};
      let frequencyConsonant= {};
      let frequencyHorizontal = {};
      let frequencyVertical = {};

      for (const word of words.keys()) {
        const info = words.get(word);

        length += word.length;

        let wordVowels = 0;
        let wordConsonants = 0;
        for (const letter of info.letters) {
          if (letter) {
            frequency[letter] = (frequency[letter] || 0) + 1;

            if (["A", "E", "I", "O", "U"].indexOf(letter) >= 0) {
              frequencyVowel[letter] = (frequencyVowel[letter] || 0) + 1;
              ++wordVowels;
            }
            else {
              frequencyConsonant[letter] = (frequencyConsonant[letter] || 0) + 1;
              ++wordConsonants;
            }
          }
        }

        for (const clue of info.clues) {
          if (clue.horizontal) {
            lengthHorizontal += word.length;
            vowelsHorizontal += wordVowels;
            consonantsHorizontal += wordConsonants;
          }
          if (clue.vertical) {
            lengthVertical += word.length;
            vowelsVertical += wordVowels;
            consonantsVertical += wordConsonants;
          }
        }

        vowels += wordVowels;
        consonants += wordConsonants;
      }

      puzzle.statistics = puzzle.statistics || {};

      puzzle.statistics.letters = {
        description: "letters in puzzle",
        possible: puzzle.size.rows * puzzle.size.columns,
        total: length,
        horizontal: lengthHorizontal,
        vertical: lengthVertical,
        vowels: {
          description: "vowels in puzzle",
          total: vowels,
          horizontal: vowelsHorizontal,
          vertical: vowelsVertical
        },
        consonants: {
          description: "consonants in puzzle",
          total: consonants,
          horizontal: consonantsHorizontal,
          vertical: consonantsVertical
        },
        ratios: {
          consonantsToVowels: {
            description: "ratio of consonants to vowels in puzzle",
            total: consonants / vowels,
            horizontal: consonantsHorizontal / vowelsHorizontal,
            vertical: consonantsVertical / vowelsVertical,
          }
        }
      };

      puzzle.history.push({
        event: "statistics",
        subevent: "puzzle letters",
        username: "crucible",
        auto: true,
        date: new Date()
      });

      puzzle.save()
        .then(saved => {
            resolve(`processed ${length} letters`);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};