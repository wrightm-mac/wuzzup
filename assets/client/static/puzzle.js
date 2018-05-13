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


$.fn.extend({
  /// Gives the row & column location of a cell in a table.
  pos: function() {
    const $this = $(this);

    return {
      column: $this[0].cellIndex,
      row: $this.closest("tr")[0].rowIndex
    };
  },

  /// Gives a cell at a location within a table.
  cell: function(row, column) {
    return $(`tr:eq(${column}) td:eq(${row})`, $(this));
  },

  /// Populates a table with puzzle grid squares.
  puzzle: function(config, settings) {
    const $table = $(this);

    if (arguments.length === 0) {
      return new PuzzleContainer();
    }

    function PuzzleContainer() {
      this.end = function() {
        return $table;
      }

      this.size = function() {
        const size = $table.data("size");
        return {
          columns: size.columns,
          rows: size.rows
        };
      }

      this.contents = function(anchorfunc) {
        let data = {
          size: $table.data("size"),
          anchors: findAnchors().map(function(anchor) {
            if (anchor.horizontal) {
              let letters = [];
              let found = false;
              for (let index = 0; index < anchor.horizontal.length; ++index) {
                const $cell = $table.cell(anchor.pos.column + index, anchor.pos.row);
                const letter = $(".puzzle-grid-letter", $cell).text();
                letters.push(letter);
                if (letter) {
                  found = true;
                }
              }
              if (found) {
                anchor.horizontal.letters = letters;
              }
            }
            if (anchor.vertical) {
              let letters = [];
              let found = false;
              for (let index = 0; index < anchor.vertical.length; ++index) {
                const $cell = $table.cell(anchor.pos.column, anchor.pos.row + index);
                const letter = $(".puzzle-grid-letter", $cell).text();
                letters.push(letter);
                if (letter) {
                  found = true;
                }
              }
              if (found) {
                anchor.vertical.letters = letters;
              }
            }

            if (anchorfunc) {
              anchorfunc.call($table, anchor);
            }

            return anchor;
          })
        };

        return data;
      }
    }

    config = $.extend({
      size: {
        columns: 13,
        rows: 13
      },
      editing: true,
      events: {
      }
    }, config, settings);

    $("tr", $table).remove();
    for (let row = 0; row < config.size.rows; ++row) {
      const $row = $("<tr>").appendTo($table);

      for (let column = 0; column < config.size.columns; ++column) {
        $("<td>", {class: "puzzle-grid-square puzzle-grid-black"})
          .appendTo($row);
      }
    }

    const size = {
      columns: Number.parseInt(config.size.columns),
      rows: Number.parseInt(config.size.rows)
    };
    $table.data("size", size);

    $table.unbind(".puzzle");
    $("body").unbind(".puzzle");

    if (config.anchors) {
      setTimeout(function() {
        $.each(config.anchors, function() {
          const anchor = {
            number: Number.parseInt(this.number),
            pos: {
              column: Number.parseInt(this.pos.column),
              row: Number.parseInt(this.pos.row)
            },
          };

          if (config.events && config.events.anchorload) {
            config.events.anchorload.call($table, this);
          }

          if (this.horizontal) {
            anchor.horizontal = {
              length: Number.parseInt(this.horizontal.length),
              letters: this.horizontal.letters
            };
          }
          if (this.vertical) {
            anchor.vertical = {
              length: Number.parseInt(this.vertical.length),
              letters: this.vertical.letters
            };
          }

          const $cell = $table.cell(anchor.pos.column, anchor.pos.row);
          const offset = $cell.offset();

          $("<div>", {class: "puzzle-grid-anchor"})
            .css({
              top:  offset.top,
              left: offset.left
            })
            .text(anchor.number)
            .appendTo($cell);

            function makeLetterInCell($cell, letter) {
              if (config.editing && letter) {
                let $letter = $(".puzzle-grid-letter", $cell);
                if ($letter.length) {
                  $letter.text(letter);
                }
                else {
                  const offset = $cell.offset();
                  $letter = $("<div>", {class: "puzzle-grid-letter"})
                            .css({
                              top:  offset.top,
                              left: offset.left
                            })
                            .text(letter)
                            .appendTo($cell);
                }
              }
            }

            if (anchor.horizontal) {
              for (let index = 0; index < anchor.horizontal.length; ++index) {
                const $cell = $table.cell(anchor.pos.column + index, anchor.pos.row)
                                .removeClass("puzzle-grid-black");
                if (anchor.horizontal.letters) {
                  makeLetterInCell($cell, anchor.horizontal.letters[index]);
                }
              }
            }
            if (anchor.vertical) {
              for (let index = 0; index < anchor.vertical.length; ++index) {
                const $cell = $table.cell(anchor.pos.column, anchor.pos.row + index)
                                .removeClass("puzzle-grid-black");
                if (anchor.vertical.letters) {
                  makeLetterInCell($cell, anchor.vertical.letters[index]);
                }
              }
            }
        });
      }, 0);
    }

    if (config.events.load) {
      setTimeout(function() {
        config.events.load.call($table, {
          type: "load",
          size: config.size,
          anchors: config.anchors || []
        })
      }, 0);
    }

    function isOpen(column, row) {
      if ((column >= 0) && (row >= 0)) {
        const $cell = $table.cell(column, row);
        return $cell.length && (!$cell.hasClass("puzzle-grid-black"));
      }
    }

    let highlighted = null;

    function highlight(column, row) {
      if (isOpen(column, row)) {
        let posX = column;
        while (isOpen(posX - 1, row)) { --posX; }
        let horizontal = [];
        while (isOpen(posX, row)) { horizontal.push($table.cell(posX++, row)); }

        let posY = row;
        while (isOpen(column, posY - 1)) { --posY; }
        let vertical = [];
        while (isOpen(column, posY)) { vertical.push($table.cell(column, posY++)); }

        highlighted = {
          horizontal: horizontal,
          vertical: vertical,
          all: horizontal.concat(vertical)
        };

        $.each(highlighted.all, function() {
          $(this).addClass("puzzle-grid-highlight");
        });
      }
    }

    function unhighlight() {
      if (highlighted) {
        $.each(highlighted.all, function() {
          $(this).removeClass("puzzle-grid-highlight");
        });

        highlighted = null;
      }
    }

    function findAnchors() {
      const size = $table.data("size");

      let anchors = [];
      let anchorNumber = 1;
      for (let row = 0; row < size.rows; ++row) {
        for (let column = 0; column < size.columns; ++column) {
          const $cell = $table.cell(column, row);
          $(".puzzle-grid-anchor", $cell).remove();

          const horizontal =  (isOpen(column, row) && (! isOpen(column - 1, row)) && isOpen(column + 1, row))
          const vertical = (isOpen(column, row) && (! isOpen(column, row - 1)) && isOpen(column, row + 1));
          if (horizontal || vertical) {
            const offset = $cell.offset();
            $("<div>", {class: "puzzle-grid-anchor"})
              .css({
                top:  offset.top,
                left: offset.left
              })
              .text(anchorNumber)
              .appendTo($cell);

            const anchor = {
              number: anchorNumber,
              pos: {
                column: column,
                row: row
              }
            };
            ++anchorNumber;

            if (horizontal) {
              let letters = [];
              let text = "";
              let found = false;
              let length;
              for (length = 0; isOpen(column + length, row); ++length) {
                const letter = $(".puzzle-grid-letter", $table.cell(column + length, row)).text();
                letters.push(letter);
                text += letter || "*";
                found = found || letter;
              }
              anchor.horizontal = {
                length: length
              }
              if (found) {
                anchor.horizontal.letters = letters;
                anchor.horizontal.text = text;
              }
            }

            if (vertical) {
              let letters = [];
              let text = "";
              let found = false;
              let length;
              for (length = 0; isOpen(column, row + length); ++length) {
                const letter = $(".puzzle-grid-letter", $table.cell(column, row + length)).text();
                letters.push(letter);
                text += letter || "*";
                found = found || letter;
              }
              anchor.vertical = {
                  length: length
              };
              if (found) {
                anchor.vertical.letters = letters;
                anchor.vertical.text = text;
              }
            }

            anchors.push(anchor);
          }
        }
      }

      return anchors;
    }

    function anchorsAt(anchors, pos) {
      let results = [];

      $.each(anchors, function() {
        const anchor = this;
        let target = {};
        if (anchor.horizontal) {
          if ((pos.row === anchor.pos.row)
                && (pos.column >= anchor.pos.column)
                && (pos.column < anchor.pos.column + anchor.horizontal.length)) {
            target.horizontal = true;
          }
        }
        if (anchor.vertical) {
          if ((pos.column === anchor.pos.column)
                && (pos.row >= anchor.pos.row)
                && (pos.row < anchor.pos.row + anchor.vertical.length)) {
            target.vertical = true;
          }
        }

        if (target.horizontal || target.vertical) {
            target.anchor = anchor;
            results.push(target);
        }
      });

      return results;
    }

    function getMirror($cell) {
      const pos = $cell.pos();

      const mirrorColumn = size.columns - pos.column - 1;
      const mirrorRow = size.rows - pos.row - 1;

      return $table.cell(mirrorColumn, mirrorRow);
    }

    $table.on("click.puzzle", "td.puzzle-grid-square", function() {
      if (config.editing) {
        const $this = $(this);
        const cell = $this.pos();

        unhighlight();

        $this.toggleClass("puzzle-grid-black");
        const $mirror = getMirror($this);
        const mirrorPos = $mirror.pos();
        if ((mirrorPos.column !== cell.column) || (mirrorPos.row !== cell.row)) {
          $mirror.toggleClass("puzzle-grid-black");
        }

        $("td.puzzle-grid-black .puzzle-grid-letter").remove();

        highlight(cell.column, cell.row);

        setTimeout(function() {
          const anchors = findAnchors();
          if (config.events.cell) {
            config.events.cell.call($table, {
              type: "cell",
              pos: cell,
              targets: anchorsAt(anchors, cell),
              anchors: anchors
            });
          }
        }, 0);
      }
    });

    let cursor = null;

    $("body").on("keypress.puzzle", function(event) {
      const $this = $(this);
      const $highlighted = $("td.puzzle-grid-square:hover");

      if ($highlighted.length) {
        const $table = $highlighted.closest("table");
        const $cell = cursor ? $table.cell(cursor.column, cursor.row) : $highlighted;
        let info;
        if (($cell.length) && (! $cell.hasClass("puzzle-grid-black"))) {
          const letter = event.key.toUpperCase();
          let $letter = $("div.puzzle-grid-letter", $cell);
          const pos = $cell.pos();
          if (letter === " ") {
            $letter.remove();
            info = {
              type: "letter"
            };
          }
          else if ((letter >= "A") && (letter <= "Z")) {
            if ($letter.length === 0) {
              const offset = $cell.offset();
              $letter = $("<div>", {class: "puzzle-grid-letter"})
                        .css({
                          top:  offset.top,
                          left: offset.left
                        })
                        .appendTo($cell);
            }
            $letter.text(letter);

            $cell.removeClass("puzzle-grid-cursor");

            if ((isOpen(pos.column + 1, pos.row)) && ((! cursor) || (cursor.direction === "horizontal"))) {
              $table.cell(pos.column + 1, pos.row).addClass("puzzle-grid-cursor");
              cursor = {
                column: pos.column + 1,
                row: pos.row,
                direction: "horizontal"
              };
            }
            else if ((isOpen(pos.column, pos.row + 1)) && ((! cursor) || (cursor.direction === "vertical"))) {
              $table.cell(pos.column, pos.row + 1).addClass("puzzle-grid-cursor");
              cursor = {
                column: pos.column,
                row: pos.row + 1,
                direction: "vertical"
              };
            }
            else {
              cursor = {direction: "stop"};
            }

            info = {
              type: "letter",
              letter: letter
            };
          }

          if (config.events.letter && info) {
            setTimeout(function() {
              info.anchors = findAnchors();
              info.pos = pos;
              info.targets = anchorsAt(info.anchors, pos);
              config.events.letter.call($table, info);
            }, 0);
          }

          return false;
        }
      }
    });

    $table.on("dblclick.puzzle", "td.puzzle-grid-square", function() {
      const $this = $(this);
    });

    $table.on("mouseenter.puzzle", "td.puzzle-grid-square", function() {
      cursor = null;
      $(".puzzle-grid-cursor", $table).removeClass("puzzle-grid-cursor");

      const $cell = $(this);
      const pos = $cell.pos();
      highlight(pos.column, pos.row);

      if (config.editing) {
        getMirror($cell).addClass("puzzle-grid-highlight-mirror");
      }
    });

    $table.on("mouseleave.puzzle", "td.puzzle-grid-square", function() {
      unhighlight();

      if (config.editing) {
        getMirror($(this)).removeClass("puzzle-grid-highlight-mirror");
      }
    });

    return new PuzzleContainer($table);
  }
});