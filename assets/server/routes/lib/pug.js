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

function isLoggedIn(req) {
  return req.session && req.session.user;
}

function mapLink(path, map) {
  if (path === map.path) {
    return map.name;
  }

  for (const child of map.children || []) {
    if (((typeof(child.path) === "string") && (child.path === path))
        || ((typeof(child.path) === "object") &&  child.path.test(path))) {
      return child.name;
    }
  }
}

function nameFromPath(path, map) {
  for (const item of map) {
    const name = mapLink(path, item);
    if (name) {
      return name;
    }
  }
}

function mapItemVisible(session, item) {
    // An item without any roles should always be visible...
    if (! item.roles) {
        return true;
    }

    // The session will only have a user if it's logged in - so hide all links
    // that have a defined role from all non-login views...
    if (! (session.user)) {
        return;
    }

    for (let userRole of session.user.roles || []) {
        for (let itemRole of item.roles) {
            if (userRole === itemRole) {
                return true;
            }
        }
    }
}

class Id {

    constructor() {
        this.current = Math.round(Math.random() * 10000);
    }

    next() {
        return ++this.current;
    }

    prev() {
        return this.current;
    }
}

const dateformat = {
  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],

  shortMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],

  longMonths: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],

  shortTime: function(date) {
    return `${date.getHours()}:${date.getMinutes()}`;
  },

  prettyDateTime: function(date) {
    return `${this.days[date.getMonth()]} ${date.getDate()} ${this.shortMonths[date.getMonth()]} ${date.getFullYear()}`
            + " " + this.shortTime(date);
  },

  shortMonthYear: function(date) {
    return `${this.shortMonths[date.getMonth()]} ${date.getFullYear()}`;
  },

  longMonthYear: function(date) {
    return `${this.longMonths[date.getMonth()]} ${date.getFullYear()}`;
  }
};

module.exports = {
  isLoggedIn,
  mapLink,
  nameFromPath,
  mapItemVisible,
  id: new Id(),
  dateformat
};