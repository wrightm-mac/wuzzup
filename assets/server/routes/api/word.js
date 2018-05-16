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

const word = require('../models/word');


/**
  Gets all words.
*/
router.get('/', function(req, res, next) {
  const search = req.query["search"];
  const query = search ? {word: search} : null;

  word.model.find(query)
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
});

/**
  Gets an identified word.

  :id - word's identifier.
*/
router.get('/:hash', (req, res) => {
  word.model.findOne({hash: req.params.hash})
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

router.post('/', (req, res) => {
  console.log("POST: /api/word");
  res.status(501)
    .json({
      status: 501,
      error: "not implemented",
      message: "POST not supported"
    });
});

router.put('/:id', (req, res) => {
  console.log("PUT: /api/word");
  res.status(501)
    .json({
      status: 501,
      error: "not implemented",
      message: "PUT not supported"
    });
});

router.delete('/:id', (req, res) => {
  console.log("DELETE: /api/word");
  res.status(501)
    .json({
      status: 501,
      error: "not implemented",
      message: "DELETE not supported"
    });
});

module.exports = router;