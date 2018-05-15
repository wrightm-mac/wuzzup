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
const puzzle = require('./models/puzzle');


router.get(["/edit.html"], (req, res) => {
  const user = req.session ? req.session.user : null;
  if (user) {
    const id = req.query["id"];
    if (id) {
      puzzle.model.findOne({hash: id})
        .where({deleted: false})
        .then(puzzle => {
          if (puzzle && (puzzle.email === user.email)) {
            res.render("puzzle/edit", {
              puzzle: puzzle
            });
          }
          else {
            res.render("error", {
              error: "not your puzzle"
            });
          }
        })
        .catch(error => {
          helper.dumpError(error);
          res.render("error", {
            message: "something has gone wrong"
          });
        });
    }
    else {
      // A new puzzle...
      res.render("puzzle/edit", {
        puzzle: {
          name: "New Puzzle",
          description: "Puzzle description.",
          size: {
            columns: 13,
            rows: 13
          },
          anchors: [],
          tags: []
        }
      });
    }
  }
  else {
    res.render("error", {
      error: "not logged in"
    });
  }
});

router.get(["/play.html"], (req, res) => {
  const id = req.query["id"];
  const user = req.session ? req.session.user : null;

  if (id) {
    puzzle.model.findOne({hash: id})
      .where({deleted: false})
      .then(puzzle => {
        puzzle.plays.push({
          user: user ? user.username : null,
          date: new Date()
        });
        puzzle.save().
        then(saved => {
          console.log("/puzzle/play.html - updated(%o)", saved);
        })
        .catch(error => {
          helper.dumpError(error);
        });

        res.render("puzzle/play", {
          puzzle: puzzle
        });
      })
      .catch(error => {
        helper.dumpError(error);
        res.render("error", {
          message: "something has gone wrong"
        });
      });
  }
  else {
    res.render("error", {
      message: "no puzzle"
    });
  }
});

router.post("/", (req, res) => {
  const user = req.session ? req.session.user : null;
  if (user) {
    const data = req.body;
    const created = new puzzle.model({
      email: user.email,
      username: user.username,
      hash: helper.id(),
      mode: "cross",
      size: data.size,
      name: data.name,
      description: data.description,
      anchors: data.anchors || [],
      alpha: data.alphas || [],
      tags: data.tags,
      published: false,
      plays: [],
      deleted: false,
      history: [{
        event: "create",
        user: user.email,
        date: new Date()
      }]
    });

    created.save()
      .then(saved => {
        if (saved) {
          res.json({
            status: 200,
            hash: saved.hash,
            mode: saved.mode,
            message: "success"
          });
        }
      }).
      catch(error => {
        helper.dumpError(error);
        res.status(error.status || 500)
          .json({
            status: error.status || 500,
            message: error.message || "something has gone wrong"
          });
      });
  }
  else {
    res.status(403)
      .json({
        status:403,
        message: "forbidden"
      });
  }
});

router.put("/", (req, res) => {
  const user = req.session ? req.session.user : null;
  if (user) {
    const data = req.body;
    puzzle.model.findOne({hash: data.hash || "xxxx-xxxx-xxxx"})
      .where({email: user.email})
      .where({deleted: false})
      .then(puzzle => {
        if (puzzle) {
          puzzle.mode = data.mode || "cross";
          puzzle.name = data.name;
          puzzle.description = data.description;
          puzzle.anchors = data.anchors || [];
          puzzle.alphas = data.alphas || [];
          puzzle.tags = data.tags;
          puzzle.deleted = puzzle.deleted || data.deleted || false;

          const date = new Date();
          puzzle.history.push({
            event: "update",
            user: user.email,
            date: date
          });

          if (data.published && (!puzzle.published)) {
            puzzle.published = true;
            puzzle.publishedAt = date;
            puzzle.history.push({
              event: "publish",
              user: user.email,
              date: date
            });
          }
          else {
            puzzle.published = false;
          }

          puzzle.save()
            .then(saved => {
              res.json({
                status: 200,
                hash: saved.hash,
                mode: saved.mode,
                message: "success"
              });
            })
            .catch(errorsave => {
              helper.dumpError(errorsave);
              res.status(500)
                .json({
                  status: 500,
                  message: "problem whilst updating"
                })
            });
        }
        else {
          res.status(404)
            .json({
              status: 404,
              message: "not found"
            });
        }
      }).
      catch(error => {
        helper.dumpError(error);
        res.status(error.status || 500)
          .json({
            status: error.status || 500,
            message: error.message || "something has gone wrong"
          });
      });
  }
  else {
    res.status(403)
      .json({
        status:403,
        message: "forbidden"
      });
  }
});

router.delete("/:id", (req, res) => {
  const user = req.session ? req.session.user : null;
  if (user) {
    puzzle.model.findOne({hash: req.params.id})
      .where({email: user.email})
      .where({deleted: false})
      .then(puzzle => {
        if (puzzle) {
          puzzle.deleted = true;
          puzzle.history.push({
            event: "delete",
            user: user.email,
            date: new Date()
          });

          puzzle.save()
            .then(saved => {
              res.json({
                status: 200,
                message: "success"
              });
            })
            .catch(errorsave => {
              helper.dumpError(errorsave);
              res.status(500)
                .json({
                  status: 500,
                  message: "problem whilst updating"
                })
            });
        }
      })
      .catch(error => {
        helper.dumpError(error);
        res.status(error.status || 500)
          .json({
            status: error.status || 500,
            message: error.message || "something has gone wrong"
          });
      });
  }
  else {
    res.status(403)
      .json({
        status:403,
        message: "forbidden"
      });
  }
});

module.exports = router;
