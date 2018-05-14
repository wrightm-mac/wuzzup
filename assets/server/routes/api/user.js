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

const user = require('../models/user');


/**
  Gets all users.
*/
router.get('/', function(req, res) {
  user.model.find()
    .sort("email")
    .then(users => {
      res.json(users);
    }).
    catch(error => {
      helper.dumpError();
      res.status(error.status || 500)
        .json({
          status: error.status || 500,
          error: error.name || "unknown error",
          message: error.message
        });
    });
});

/**
  Gets an identified user.

  :hash - user's identifier.
*/
router.get('/:hash', (req, res) => {
  user.model.findOne({hash: req.params.hash})
    .then(user => {
      if (user) {
        res.json(user);
      }
      else {
        res.status(404)
          .json({
            status: "404",
            message: "not found"
          });
      }
    }).
    catch(error => {
      helper.dumpError();
      res.status(error.status || 500)
        .json({
          status: error.status || 500,
          error: error.name || "unknown error",
          message: error.message
        });
});
});

/**
  Adds a new user.
*/
router.post('/', (req, res) => {
  if (req.session.user.roles.includes("admin")) {
    const data = req.body;
    const newuser = new user.model({
      username: data.username,
      hash: helper.id(),
      email: data.email,
      username: data.username,
      password: helper.hash(data.password),
      roles: data.roles || ["user"],
      validated: data.validated || false,
      suspended: data.suspended || false,
      deleted: false
    });

    newuser.save()
      .then(user => {
        res.json(user);
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
  else {
    res.status(403)
      .json({
        status: 403,
        message: "forbidden"
      });
  }
});

/**
  Updates an identified user.

  :id - user's identifier.
*/
router.put('/:id', (req, res) => {
  console.log("PUT: /api/user");
  res.status(501)
    .json({
      status: 501,
      error: "not implemented"
    });
});

/**
  Deletes an identified user.

  :id - user's identifier.
*/
router.delete('/:id', (req, res) => {
  console.log("DELETE: /api/user");
  res.status(501)
    .json({
      status: 501,
      error: "not implemented"
    });
});

module.exports = router;