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
const user = require('../models/user');


const selectfields = "hash username words plays createdAt updatedAt";

function setCriteria(req, criteria) {
  if (! req.query["deleted"]) {
    query.deleted = false;
  }

  return criteria;
}

function find(req, res, criteria = {}) {
  query.find(user.model, req, res, setCriteria(req, criteria), selectfields);
}

function findOne(req, res, criteria = {}) {
  query.findOne(user.model, req, res, setCriteria(req, criteria), selectfields);
}


/**
  Gets all users.
*/
router.get('/', function(req, res) {
  find(req, res);
});

/**
  Gets an identified user.

  :id - user's identifier.
*/
router.get('/:id', (req, res) => {
  findOne(req, res, {_id: req.params.id});
});

/**
  Gets a user by their hash.

  :hash - hash.
*/
router.get('/hash/:hash', (req, res) => {
  findOne(req, res, {
    hash: req.params.hash
  });
});

/**
  Gets a user by username.

  :username - username.
*/
router.get('/lookup/:username', (req, res) => {
  findOne(req, res, {username: req.params.username});
});

/**
  Gets a user by a tag that they've used.


  :tag- tag.
*/
router.get('/tag/:tags', (req, res) => {
  find(req, res, {
    "tags.tag": req.params.tag
  });
});

/**
  Gets a user by a word that they've used.

  :word- word.
*/
router.get('/word/:words', (req, res) => {
  find(req, res, {
    "words.word": req.params.word
  });
});

/**
  Adds a new user.
*/
router.post('/', (req, res) => {
  query.notImplemented(res, "POST not supported");
});

/**
  Updates an identified user.

  :id - user's identifier.
*/
router.put('/:id', (req, res) => {
  query.notImplemented(res, "PUT not supported");;
});

/**
  Deletes an identified user.

  :id - user's identifier.
*/
router.delete('/:id', (req, res) => {
  query.notImplemented(res, "DELETE not supported");
});

module.exports = router;