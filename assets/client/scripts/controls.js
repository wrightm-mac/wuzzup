/*






*/


$.extend({
  backdrop: function(show) {
    let $backdrop = $("div.standard-backdrop");

    if (show && (! $backdrop.length)) {
      $backdrop = $("<div>", {class: "standard-backdrop"}).appendTo($("body"));
    }

    if (show) {
      $backdrop.fadeIn(200);
    }
    else {
      $backdrop.fadeOut(150);
      $backdrop.empty();
    }

    return $backdrop;
  },

  wait: function(message) {
    if (message) {
      const $backdrop = $.backdrop(true);
      const $message = $("<div>", {class: "standard-wait-message"})
                        .text(message)
                        .appendTo($backdrop);
      $message.css({
        left:`${($(window).width() - $message.width()) / 2}px`,
        top: `${($(window).height() - $message.height()) / 2}px`
      })
  }
    else {
      $.backdrop(false);
    }
  },

  showdialog: function(config = {}) {
    config = $.extend({
      title: "The quick brown dog...",
      width: 500,
      height: 100,
      autoclose: true,
      showbubble: false,
      buttons: [
        "OK"
      ]
    }, config);

    let $dialog = $("div.standard-dialog");

    if (! $dialog.length)
    {
      $dialog = $("<div>", {class: "standard-dialog"})
                  .css({
                    left:`${($(window).width() - config.width) / 2}px`,
                    top: `${($(window).height() - config.height) / 2}px`,
                    "min-width": `${config.width}px`,
                    "min-height": `${config.height}px`
                  })
                  .appendTo($("body"));

      const $title = $("<div>", {class: "standard-dialog-title"}).appendTo($dialog);
      if (config.showbubble) {
        $("<div>", {class: "standard-clickable standard-dialog-title-bubble"}).appendTo($title);
      }
      $("<span>", {class: "standard-dialog-title-text"})
        .text(config.title)
        .appendTo($title);

      const $content = $("<div>", {class: "standard-dialog-content"}).appendTo($dialog);

      const $buttons  = $("<div>", {class: "standard-dialog-buttons"}).appendTo($dialog);
      for (const button in config.buttons)
      {
        $("<span>", {class: "standard-clickable standard-button standard-button-dialog"})
          .text(config.buttons[button])
          .appendTo($buttons);
      }

      $dialog.on("click", ".standard-clickable", function() {
        let allowclose = true;
        if (config.callback) {
          allowclose = (config.callback.call($content, $(this).text().toLowerCase(), $dialog, $content) !== false);
        }

        if (config.autoclose && allowclose) {
          $.hidedialog();
        }
      });

      $.backdrop(true);
      $dialog.fadeIn(250);
    }

    return $dialog;
  },

  hidedialog: function() {
    $.backdrop(false);
    $("div.standard-dialog").fadeOut(500, function() {
      $(this).remove();
    });
  },

  message: {
    basic: function(title, message, config) {
      config = $.extend({
        title: title,
        width: 360,
        buttons: ["OK"]
    }, config);

      $("<div>", {class: "standard-message-container"})
        .append($("<img>", {class: "standard-message-glyph", src: `/images/dialog/${config.glyph}.png`}))
        .append($("<div>", {class: "standard-message-text"}).html(message))
        .dialog(config);
    },

    error: function(title, message, config = {}) {
      config.glyph = "error";
      $.message.basic(title, message, config);
    },

    ask: function(title, message, config = {}) {
      config.glyph = "help";
      $.message.basic(title, message, config);
    },

    info: function(title, message, config = {}) {
      config.glyph = "info";
      $.message.basic(title, message, config);
    },

    power: function(title, message, config = {}) {
      config.glyph = "power";
      $.message.basic(title, message, config);
    },

    tick: function(title, message, config = {}) {
      config.glyph = "tick";
      $.message.basic(title, message, config);
    },
  }
});


$.fn.extend({
  dialog: function(config) {
    const $dialog = $.showdialog(config);
    $(".standard-dialog-content", $dialog).append($(this));
    $dialog.css({
      top: `${($(window).height() - $dialog.height()) / 2}px`,
      left: `${($(window).width() - $dialog.width()) / 2}px`
    });
  },

  dateinput: function(config) {
    console.log("$.fn.dateinput(%o)", config);

    const settings = $.extend({
      day: true,
      month: true,
      year: true,
      min: new Date(1900, 1, 1),
      max: new Date(2099, 12, 31),
      enabled: true
    }, config);

    settings.start = settings.start || new Date();

    const $container = $("<div>", {class: "ui-date-container"});

    if (settings.day) {
      const $day = $("<input>", {
        class: "ui-date-entry ui-date-day",
        type: "text",
        val: settings.start.getDate()
      }).appendTo($container);
    }
    if (settings.month) {
      if (settings.day) {
        $container.append($("<span>", {class: "ui-date-separator"}).text("-"));
      }
      const $month = $("<input>", {
        class: "ui-date-entry ui-date-month",
        type: "text",
        val: settings.start.getMonth()
      }).appendTo($container);
    }
    if (settings.year) {
      if (settings.day || settings.month) {
        $container.append($("<span>", {class: "ui-date-separator"}).text("-"));
      }
      const $year = $("<input>", {
        class: "ui-date-entry ui-date-year",
        type: "text",
        val: settings.start.getFullYear()
      }).appendTo($container);
    }

    const $this = $(this);
    $this.on("focusin", ".ui-date-entry", function(event) {
      console.log(".ui-date-entry.focusin(%o)", event);
    });
    $this.on("focusout", ".ui-date-entry", function(event) {
      console.log(".ui-date-entry.focusout(%o)", event);
    });
    $this.append($container);
    $this.on("keypress", ".ui-date-entry", function(event) {
      console.log(".ui-date-entry.keypress(%o)", event);

      if ((event.key <= "0") || (event.key >= "9")) {
        return false;
      }
    });
    $this.on("change", ".ui-date-entry", function(event) {
      console.log(".ui-date-entry.change(%o)", event);
    });

    $this.data("min", settings.min);
    $this.data("max", settings.max);
    $this.append($container);

    return $this;
  },

  date: function() {
    let $this = $(".ui-date-container", this);
    if ($this.length) {
      const min = $this.data("min");
      const max = $this.data("max");

      const day = Number.parseInt($(".ui-date-dayz", $this).val() || min.getDate());
      const month = Number.parseInt($(".ui-date-monthz", $this).val() || min.getMonth());
      const year = Number.parseInt($(".ui-date-yearz", $this).val() || min.getFullYear());
      return new Date(year, month, day);
    }
  }
});
