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

const chalk = require("chalk");

const config = require('./lib/config');
const helper = require('./lib/helper');

const dbuser = require('./models/user');
const puzzle = require('./models/puzzle');


router.get(["/", "/index.html"], function(req, res) {
  const page = req.query["page"] || 0;

  puzzle.model.find({published: true})
    .where({deleted: false})
    .skip(page * config.settings.main.pagesize)
    .limit(config.settings.main.pagesize)
    .sort("-updatedAt")
    .select("hash email username name description tags size updatedAt published publishedAt")
    .then(function(puzzles) {
      res.render("index", {
        puzzles
      });
    })
    .catch(function(error) {
      helper.dumpError(error);
      res.render("error", {error});
    });
});

router.get("/create.html", function(req, res) {
  puzzle.model.find({email: req.session.user.email})
    .where({deleted: false})
    .sort("-updatedAt")
    .then(puzzles => {
      res.render("create", {
        puzzles
      });
    })
    .catch(error => {
      helper.dumpError(error);
      res.render("error", {error});
    });
});

router.get("/user.html", function(req, res) {
  const user = req.session ? req.session.user : null;
  if (user) {
    const username = req.query["u"] || user.username;

    const query = {
      username: username,
      deleted: false
    };
    if (username !== user.username) {
      published: true
    }

    Promise.all([
      dbuser.model.findOne({username: username, deleted: false})
        .select("username createdAt gender status social"),
      puzzle.model.find(query)
        .limit(config.settings.main.pagesize)
        .sort("-updatedAt")
      ])
      .then(([user, puzzles]) => {
        res.render("user", {
          puzzles,
          user,
          allowedit: (username === user.username)
        });
      })
      .catch(error => {
        helper.dumpError(error);
        res.render("error", {error});
      });
  }
  else {
    res.render("user");
  }
});

router.get("/:view.html", function(req, res) {
  const view = req.params.view;

  res.render(view);
});

module.exports = router;
