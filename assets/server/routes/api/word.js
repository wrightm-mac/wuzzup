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
const word = require('../models/word');


const selectfields = "hash word count occurs createdAt updatedAt";


router.get('/', (req, res) => {
  const search = req.query["search"];
  const criteria = search ? {word: search} : null;

  query.find(word.model, req, res, criteria, selectfields);
});

router.get('/user/:username', (req, res) => {
  query.find(word.model, req, res, {"occurs.username": req.params.username}, selectfields);
});

router.get('/:id', (req, res) => {
  query.findOne(word.model, req, res, {_id: req.params.id}, selectfields);
});

router.get('/hash/:hash', (req, res) => {
  query.findOne(word.model, req, res, {hash: req.params.hash}, selectfields);
});

router.get('/lookup/:search', (req, res) => {
  query.findOne(word.model, req, res, {word: req.params.search}, selectfields);
});

router.get('/puzzle/:id', (req, res) => {
  query.find(word.model, req, res, {
    "occurs.puzzleId": req.params.id
  }, selectfields);
});

router.post('/', (req, res) => {
  query.notImplemented(res, "POST not supported");
});

router.put('/:id', (req, res) => {
  query.notImplemented(res, "PUT not supported");
});

router.delete('/:id', (req, res) => {
  query.notImplemented(res, "DELETE not supported");
});

module.exports = router;