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

var mongoose = require("mongoose");


const PuzzleAnchorContentSchema = new mongoose.Schema({
  length: {
    type: Number,
    required: true
  },
  letters: {
    type: [String],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  clue: String
});

const PuzzleAnchorSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  pos: {
    type: {
      column: {
        type: Number,
        required: true
      },
      row: {
        type: Number,
        required: true
      }
    },
    required: true
  },
  horizontal: PuzzleAnchorContentSchema,
  vertical: PuzzleAnchorContentSchema
});

const PuzzleSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    index: true,
    trim: true,
    lowercase: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  mode: {                             // <----------- enum: "cross" || "alpha"
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  size: {
    type: {
      columns: Number,
      rows: Number
    },
    required: true
  },
  anchors: [PuzzleAnchorSchema],      // <----------- for crosswords
  alphas: [],                         // <----------- for alpha-puzzles
  tags: [String],
  published: {
    type: Boolean,
    required: true
  },
  publishedAt: Date,
  plays: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true
    },
    username: {
      type: String,
      index: true,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  }],
  words: [{
    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true
    },
    word: {
      type: String,
      index: true,
      required: true
    }
  }],
  statistics: {
    anchors: {},
    words: {},
    letters: {}
  },
  deleted: {
    type: Boolean,
    required: true
  },
  history: [{
    event: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    },
    username: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    auto: Boolean,
    subevent: String
  }]
}, { timestamps: true });

module.exports = {
    schema: PuzzleSchema,
    model: mongoose.model("Puzzle", PuzzleSchema)
};