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


$.extend({
  storage: {
    cache: function(name, url, extra) {
      return new Promise(function(resolve, reject) {
        if ($.storage.exists(name)) {
          console.log("$.storage.cache(name=%s): fetching from localstorage", name);
          resolve($.storage.get(name));
        }
        else {
          if (url) {
            console.log("$.storage.cache(name=%s): fetch from url '%s'", name, url);
            $.ajax({
              url: url,
              dataType: "json"
            })
            .then(function(data) {
              $.storage.set(name, data, {url: url});
              resolve(data);
            })
            .catch(function(error) {
              console.error("$.storage.cache(): error(%o)", error);
              reject(error);
            });
          }
          else {
            console.log("$.storage.cache(name=%s): no url - no data", name, url);
            resolve(null);
          }
        }
      });
    },

    set: function(name, value, extra) {
      localStorage[name] = JSON.stringify($.extend(extra || {}, {
        name: name,
        page: location.pathname,
        date: new Date(),
        value: value
      }));
    },

    get: function(name) {
      if (localStorage[name]) {
        return JSON.parse(localStorage[name]).value;
      }
    },

    meta: function(name) {
      if (localStorage[name]) {
        return JSON.parse(localStorage[name]);
      }
    },

    exists: function(name) {
      return localStorage[name] !== undefined;
    },

    remove: function(name) {
      localStorage.removeItem(name);
    },

    all: function() {
      const packets = [];

      for (let index = 0; index < localStorage.length; ++index) {
        const packet = localStorage[localStorage.key(index)];
        const data = JSON.parse(packet);
        data.size = packet.length;
        packets.push(data);
      }

      return packets;
    }
  }
});
