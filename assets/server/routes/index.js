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
const config = require('./lib/config');
const helper = require('./lib/helper');
const puzzle = require('./models/puzzle');
const chalk = require("chalk");


router.get(["/", "/index.html"], function(req, res) {
  const page = req.query["page"] || 0;

  console.log(chalk.yellow("index") + "(page=%d)", page);

  puzzle.model.find()
    .skip(page * config.settings.main.pagesize)
    .limit(config.settings.main.pagesize)
    .sort("-updatedAt")
    .select("hash email namez description size updatedAt createdAt")
    .exec()
    .then(function(data) {
      res.render("index", {data: data});
    })
    .catch(function(error) {
      helper.dumpError(error);
      res.render("error", {error: error});
    });
});

router.get(["/", "/:view.html"], function(req, res) {
  const view = req.params.view;

  console.log(chalk.yellow("view") + "(%s)", view);

  res.render(view, {
    data: {}
  });
});

router.get("/:id", function(req, res) {
  console.log("router.get (id) [id=%s]", req.params.id);

  let lookup = req.params.id;

  cv.model.findOne({ hash: lookup }, (err, data) => {
    res.render("view", {
      submenu: "viewer",
      cv: data
    });
  });
});

router.put('/:email', (req, res) => {
  if (req.params.email === req.session.user.email) {
    const payload = req.body;

    cv.model.findOne({ email: req.params.email }, (err, data) => {
        data = data || new cv.model({
          email: req.params.email,
        });

        data = Object.assign(data, {
          _id: data._id,
          hash: data.hash || helper.id(),
          blurb: {
            items: (payload.blurb.items || []).map(item => {
              return {
                _id: item._id,
                header: item.header || "",
                content: item.content || "",
                visible: true
              }
            })
          },
          personal: {
            title: payload.personal.title || "Personal",
            items: (payload.personal.items || []).map(item => {
              return {
                _id: item._id,
                name: item.name || "",
                value: item.value || "",
                visible: true
              }
            })
          },
          education: {
            title: payload.education.title || "Education",
            items: (payload.education.items || []).map(item => {
              return {
                _id: item._id,
                school: item.name || "",
                course: item.course || "",
                grade: item.grade || "",
                graduation: new Date(item.graduation),
                visible: true
              }
            })
          },
          employment: {
            title: payload.employment.title || "Employment",
            items: (payload.employment.items || []).map(item => {
              return {
                _id: item._id,
                name: item.name || "",
                title: item.title || "",
                from: new Date(item.from),
                to: new Date(item.to),
                description: item.description || "",
                descriptionvisible: true,
                visible: true
              }
            })
          },
          styling: ((stored = [], fresh = []) => {
            let merged = [];

            for (let store of stored) {
              const selector = store.split(":")[0];

              let found = fresh.find(value => selector === value.split(":")[0]);
              if (! found) {
                merged.push(store);
              }
            }

            return merged.concat(fresh);
          })(data.styling, payload.styling)
        });

        data.save(helper.responder(res, saved => {
          return {
            success: true,
            email: saved.email,
            hash: saved.hash
          };
        }));
    });
  }
  else {
    helper.sendCode(res, 404, {
      status: 404,
      message: "forbidden"
    });
  }
});

module.exports = router;
