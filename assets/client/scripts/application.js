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
    fragment: function(callback) {
        $("div [data-fragment]").each(function() {
            $(this).fragment(callback);
        });

        return this;
    },

    redirect: function(url) {
        $(location).attr('href', url);
    },

    showWaiting: function() {
        if (!$("body .waitGraphic").exists()) {
            $("body").append("<div>", { id: "waitGraphic" });
        }
    },

    hideWaiting: function() {
        $("body #waitGraphic").remove();
    },

    events: {
      publish: function(name, args) {
        $("body").trigger(name, args);
      },

      subscribe: function(name, callback) {
        $("body").on(name, callback);
      }
    }
});


$.fn.extend({
    exists: function() {
      return (this.length > 0);
    },

    hidden: function() {
      return $(this).css("display") === "none";
    },

    showing: function() {
      return !this.hidden();
    },

    tag: function() {
      return this.prop("tagName");
    },

    enterkey: function(callback) {
        $(this).keypress(function(event) {
            if (event.which == 13) {
                callback.call(this, event);
                return false;
            }
        });
    },

    // ---------------------------------------------------------------------//

    // Custom controls...

    toggleSwitch: function(config = {}) {
      const $this = $(this).html("");

      const $control = $("<div>", { class: "uiToggleSwitch" })
                        .click(function() {
                          setValue(! $(this).data("val"));
                        })
                        .data("val", config.value || false)
                        .appendTo($this);
      const $toggle = $("<div>", { class: "uiToggleSwitchLatch"}).appendTo($control);

      function setValue(value) {
        let oldValue = $control.data("val");
        $control.data("val", value);

        if (value) {
          $control.addClass("uiToggleSwitchOn");
          $toggle.addClass("uiToggleSwitchLatchOn");
        }
        else {
          $control.removeClass("uiToggleSwitchOn");
          $toggle.removeClass("uiToggleSwitchLatchOn");
        }

        if (config.change && (value !== oldValue)) {
          config.change.call($control, value);
        }
    }

      $this.val = function() {
        return $control.data("val");
      }

      setValue(config.value);

      return $this;
    }
});


$(function() {
  $(document)
    .ajaxStart(function () {
      $.showWaiting();
    })
    .ajaxStop(function () {
      $.hideWaiting();
    })
});