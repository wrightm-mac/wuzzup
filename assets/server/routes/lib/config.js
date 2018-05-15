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

const sha = require('./hash/sha');


module.exports = {
    site: {
      title: "wuzzup",
      id: {
          name: "wuzzup.com",
          version: 0.1,
      },

      get hash() {
          let hasher = new sha("SHA-1", "TEXT");
          hasher.update(`${this.id.name}+${this.id.version}`);

          return hasher.getHash("HEX");
      },

      map: [{
        name: "puzzles",
        path: "/index.html",
        children: [
          {path: "/", name: "puzzles"},
          {path: "/puzzle/play.html", name: "play"}
        ]
      }, {
        name: "create",
        roles: ["user"],
        path: "/create.html",
        children: [
          {path: "/puzzle/edit.html", name: "edit"}
        ]
      }, {
        name: "about",
        path: "/about.html"
      }, {
        name: "admin",
        path: "/admin.html",
        roles: ["admin"],
        class: "header-nav-admin"
      }],
    },
    mongo: {
        host: process.env.NODE_MONGO_HOST || '127.0.0.1',
        port: process.env.NODE_MONGO_PORT || '27017',
        db: "wuzzup",
        get url() {
            return `mongodb://${this.host}:${this.port}/${this.db}`;
        }
    },
    settings: {
      main: {
        pagesize: 20
      }
    }
};