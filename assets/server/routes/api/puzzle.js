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


/**
  Gets all puzzles.
*/
router.get('/', function(req, res, next) {
  puzzle.model.find()
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      helper.dumpError(error);
      res.status(500);
      res.send({
        status: 500,
        message: "something has gone wrong"
      });
    });
});

/**
  Gets an identified puzzle.

  :id - puzzle's identifier.
*/
router.get('/:hash', (req, res) => {
  puzzle.model.findOne({hash: req.params.hash})
    .then(data => {
      if (data) {
        res.send(data);
      }
      else {
        res.status(404);
        res.send({
          status: "404",
          message: "not found"
        });
      }
    })
    .catch(error => {
      helper.dumpError(error);
      res.status(500);
      res.send({
        status: 500,
        message: "something has gone wrong"
      });
    });
});

/**
  Adds a new puzzle.
*/
router.post('/', (req, res) => {
  let data = req.body;
  data.email = req.session.user.email;
  data.hash = helper.id();

  const record = new puzzle.model(data);
  record.save()
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      helper.dumpError(error);
      res.status(500);
      res.send({
        status: 500,
        message: "something has gone wrong"
      });
    });
});

/**
  Updates an identified puzzle.

  :id - puzzle's identifier.
*/
router.put('/:id', (req, res) => {
  //puzzle.model.findByIdAndUpdate(req.params.id, req.body, helper.responder(res));
});

/**
  Deletes an identified puzzle.

  :id - puzzle's identifier.
*/
router.delete('/:id', (req, res) => {
  // puzzle.model.findByIdAndRemove(req.params.id, helper.responder(res));
});

module.exports = router;