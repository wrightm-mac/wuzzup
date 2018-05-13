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
const user = require('./models/user');
const helper = require('./lib/helper');


function loginUser(req, data) {
  req.session.user = {
    id: data._id,
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    username: data.username,
    roles: data.roles,
    login: true,
    token: helper.id()
  };

  return req.session.user;
}


/**
  Creates a new user.
*/
router.post('/register', (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;

  let passwordHash = helper.hash(password);
  let userHash = helper.id();

  console.log("/login/register [first-name=%s][last-name=%s][email=%s][password=%s][hash=%s]", firstName, lastName, email, password, passwordHash);

  let newUser = new user.model({
    firstname: firstName,
    lastname: lastName,
    roles: ["user"],
    hash: userHash,
    email: email,
    password: passwordHash
  });

  newUser.save(helper.responder(res, (data) => {
    console.log("saved new user! (%o)", data);

    if (data) {
      return loginUser(req, data);
    }
    else {
      res.status(406);
    }
  }));
});


/**
  Creates a logged-in session.
*/
router.post('/', (req, res) => {
  let email = req.body.email;
  let hash = helper.hash(req.body.password);

  user.model.findOne({email: email})
    .where({password: hash})
    .where({suspended: false})
    .where({deleted: false})
    .select("firstname lastname email username roles")
    .then(user => {
      if (user) {
        req.session.user = user;
        res.send(user);
      }
      else {
        res.status(406);
        res.send({
          status: 406,
          message: "unacceptable"
        });
      }
    }).
    catch(error => {
      helper.dumpError();
      res.status(500);
      res.send({message: "something has gone wrong"});
    });
});

/**
  Deletes a logged-in session.
*/
router.delete('/', (req, res) => {
  console.log("router:delete");

  delete req.session.user;

  helper.sendOk(res, { message: "user logout"});
});

module.exports = router;