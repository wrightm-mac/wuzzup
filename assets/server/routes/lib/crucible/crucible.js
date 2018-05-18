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

const chalk = require("chalk");

const helper = require('../helper');

const user = require('../..//models/user');
const puzzle = require('../../models/puzzle');

const glossary = require('./glossary');
const anchors = require('./anchors');
const letters = require('./letters');
const words = require('./words');
const updatedocs = require('./updatedocs');


const analysers = [
  glossary,
  anchors,
  words,
  letters
];

const updaters = [
  updatedocs
];


function getPuzzleWords(puzzle) {
  const words = new Map();

  function setWord(word, horizontal, vertical) {
    if (word.text && word.text.length) {
      const text = word.text.toLowerCase();
      const info = words.get(text) || {
        count: 0,
        letters: word.letters,
        clues: []
      };

      info.count += 1;
      info.clues.push({
        clue: word.clue,
        horizontal: horizontal,
        vertical: vertical
      });

      words.set(text, info);
    }
  }

  for (const anchor of puzzle.anchors) {
    if (anchor.horizontal) {
      setWord(anchor.horizontal, true, false);
    }
    if (anchor.vertical) {
      setWord(anchor.vertical, false, true);
    }
  }

  return words;
}

function startProcessor(processor, user, puzzle) {
  processor.evaluate(getPuzzleWords(puzzle), user, puzzle)
    .then(log => {
      console.info(chalk.yellow.bold("crucible.processor") + "('%s'): done - '%s'", chalk.green.bold(processor.name), log);
    })
    .catch(error => {
      console.error(chalk.red.bold("crucible.processor") + "('%s'): error", chalk.green.bold(processor.name));
      helper.dumpError(error);
    });
}

function runProcessorList(processorlist, userId, puzzleId) {
  for (const processor of processorlist) {
    console.info(chalk.yellow.bold("crucible.processor") + "('%s', '%s')", chalk.green.bold(processor.name), chalk.green.bold(processor.description));

    Promise.all([user.model.findById(userId), puzzle.model.findById(puzzleId)])
      .then(([user, puzzle]) => {
        startProcessor(processor, user, puzzle);
      })
      .catch(error => {
        helper.dumpError(error);
      });
  }
}

function process(userId, puzzleId) {
  console.info(chalk.yellow.bold("crucible.process") + "(userId=%s, puzzleId=%s)", userId, puzzleId);

  setTimeout(function() {
    console.info(chalk.yellow.bold("crucible.processor") + "('" + chalk.yellow.bold("analysers") + "')");
    runProcessorList(analysers, userId, puzzleId);
  }, 0);

  setTimeout(function() {
    console.info(chalk.yellow.bold("crucible.processor") + "('" + chalk.yellow.bold("updaters") + "')");
    runProcessorList(updaters, userId, puzzleId);
  }, 10 * 1000);
}

module.exports = {
  enqueue: function(user, puzzle) {
    console.info(chalk.yellow.bold("crucible.enqueue") + "(user=%s, puzzle=%s)", user, puzzle);

    setTimeout(function() {
      process(user, puzzle);
    }, 0);
  }
};