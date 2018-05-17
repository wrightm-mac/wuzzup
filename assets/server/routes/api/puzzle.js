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
const helper = require('../lib/helper');
const puzzle = require('../models/puzzle');



function find(req, res, query = {}) {
  if (req.query["published"] !== "all") {
    query.published = true;
  }
  if (req.query["mode"]) {
    query.mode = req.query["mode"];
  }
  if (req.query["hash"]) {
    query.hash = req.query["hash"];
  }
  if (req.query["name"]) {
    query.name = req.query["name"];
  }
  if (req.query["user"]) {
    query.username = req.query["user"];
  }
  if (! req.query["deleted"]) {
    query.deleted = false;
  }

  puzzle.model.find(query)
    .select("hash userId username name description tags size anchors alphas words history plays published publishedAt createdAt updatedAt")
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      helper.dumpError(error);
      res.status(error.status || 500)
        .json({
          status: error.status || 500,
          error: error.name || "unknown error",
          message: error.message
        });
    });
}

/**
  Gets all puzzles.
*/
router.get('/', function(req, res, next) {
  find(req, res, {});
});

/**
  Gets an identified puzzle.

  :id - puzzle's identifier.
*/
router.get('/:id', (req, res) => {
  const query = {
    _id: req.params.id
  };

  if (req.query["published"] !== "all") {
    query.published = true;
  }
  if (req.query["mode"]) {
    query.mode = req.query["mode"];
  }
  if (! req.query["deleted"]) {
    query.deleted = false;
  }

  puzzle.model.findOne(query)
    .select("hash username name description tags size anchors alphas words history plays published publishedAt createdAt updatedAt")
    .then(data => {
      if (data) {
        res.json(data);
      }
      else {
        res.status(404)
          .json({
            status: "404",
            message: "not found"
          });
      }
    })
    .catch(error => {
      helper.dumpError(error);
      res.status(error.status || 500)
        .json({
          status: error.status || 500,
          error: error.name || "unknown error",
          message: error.message
        });
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
  console.log("POST: /api/puzzle");
  res.status(501)
    .json({
      status: 501,
      error: "not implemented",
      message: "POST not supported"
    });
});

/**
  Updates an identified puzzle.

  :id - puzzle's identifier.
*/
router.put('/:id', (req, res) => {
  console.log("PUT: /api/puzzle");
  res.status(501)
    .json({
      status: 501,
      error: "not implemented",
      message: "PUT not supported"
    });
});

/**
  Deletes an identified puzzle.

  :id - puzzle's identifier.
*/
router.delete('/:id', (req, res) => {
  console.log("DELETE: /api/puzzle");
  res.status(501)
    .json({
      status: 501,
      error: "not implemented",
      message: "DELETE not supported"
    });
});

module.exports = router;