/*



*/


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
