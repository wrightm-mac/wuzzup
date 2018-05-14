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
  const id = req.query["id"];

  if (id) {
    puzzle.model.findOne({hash: id})
      .then(puzzle => {
        res.render("puzzle/edit", {
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
});

router.get(["/play.html"], (req, res) => {
  const id = req.query["id"];

  if (id) {
    puzzle.model.findOne({hash: id})
      .then(puzzle => {
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
  const data = req.body;

  console.log("POST:/puzzle(%o)", data);

  const created = new puzzle.model({
    email: req.session.user.email,
    hash: helper.id(),
    size: data.size,
    name: data.name,
    description: data.description,
    anchors: data.anchors,
    tags: data.tags,
    deleted: false,
  });

  created.save()
    .then(saved => {
      if (saved) {
        res.json(saved);
      }
    }).
    catch(error => {
      helper.dumpError(error);
      res.render("error", {
        message: "something has gone wrong"
      });
    });
});

router.put("/", (req, res) => {
  const data = req.body;

  console.log("PUT:/puzzle(%o)", data);

  puzzle.model.findOne({hash: data.hash || "xxxx-xxxx-xxxx"})
    .then(puzzle => {
      if (puzzle) {
        puzzle.name = data.name;
        puzzle.description = data.description;
        puzzle.anchors = data.anchors;
        puzzle.tags = data.tags;
        puzzle.deleted = data.deleted || false;

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
      else {
        res.status(404)
          .json({
            status: 404,
            message: "puzzle not found - can't update"
          });
      }
    }).
    catch(error => {
      helper.dumpError(error);
      res.render("error", {
        message: "something has gone wrong"
      });
    });
});

module.exports = router;
