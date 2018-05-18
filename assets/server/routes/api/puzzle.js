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

const router = require('express').Router();
const query = require('../lib/query');

const puzzle = require('../models/puzzle');


const selectfields = "hash userId username name description tags size anchors alphas words history plays published publishedAt createdAt updatedAt";

function setCriteria(req, criteria) {
  if (req.query["published"] !== "all") {
    criteria.published = true;
  }
  if (req.query["mode"]) {
    criteria.mode = req.query["mode"];
  }
  if (req.query["hash"]) {
    criteria.hash = req.query["hash"];
  }
  if (req.query["name"]) {
    criteria.name = req.query["name"];
  }
  if (req.query["user"]) {
    criteria.username = req.query["user"];
  }
  if (! req.query["deleted"]) {
    criteria.deleted = false;
  }

  return criteria;
}

function find(req, res, criteria = {}) {
  query.find(puzzle.model, req, res, setCriteria(req, criteria), selectfields);
}

function findOne(req, res, criteria = {}) {
  query.findOne(puzzle.model, req, res, setCriteria(req, criteria), selectfields);
}


/**
  Gets all puzzles.
*/
router.get('/', (req, res) => {
  find(req, res);
});

/**
  Gets an identified puzzle.

  :id - puzzle's identifier.
*/
router.get('/:id', (req, res) => {
  findOne(req, res, {_id: req.params.id});
});

/**
  Gets a puzzle by its hash.

  :hash - hash.
*/
router.get('/hash/:hash', (req, res) => {
  findOne(req, res, {
    hash: req.params.hash
  });
});

/**
  Gets all puzzles containing word.

  :word - word.
*/
router.get('/word/:word', (req, res) => {
  find(req, res, {
    "words.word": req.params.word
  });
});

/**
  Gets all puzzles with specific tags.

  Split multiple tags with '+' eg: one+two+three. All tags must match.

  :tag - tag.
*/
router.get('/tag/:tags', (req, res) => {
  find(req, res, {
    tags: {$all: req.params.tags.split("+")}
  });
});

/**
  Gets all puzzles played by specific user.

  :username - username.
*/
router.get('/play/:username', (req, res) => {
  find(req, res, {
    "plays.user": req.params.username
  });
});

/**
  Adds a new puzzle.
*/
router.post('/', (req, res) => {
  query.notImplemented(res, "POST not supported");
});

/**
  Updates an identified puzzle.

  :id - puzzle's identifier.
*/
router.put('/:id', (req, res) => {
  query.notImplemented(res, "PUT not supported");
});

/**
  Deletes an identified puzzle.

  :id - puzzle's identifier.
*/
router.delete('/:id', (req, res) => {
  query.notImplemented(res, "DELETE not supported");
});

module.exports = router;