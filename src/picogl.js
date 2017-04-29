///////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)
//
// Copyright (c) 2017 Tarek Sherif
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
///////////////////////////////////////////////////////////////////////////////////

(function() {
    "use strict";

    /**
        Global PicoGL module. For convenience, all WebGL enums are stored
        as properties of PicoGL (e.g. PicoGL.FLOAT, PicoGL.ONE_MINUS_SRC_ALPHA).
        
        @namespace PicoGL
        @prop {string} version Current PicoGL version.
        @prop {object} TEXTURE_INTERNAL_FORMAT Map of framebuffer texture formats to internal formats.
        @prop {object} TYPE_SIZE Map of data types to sizes in bytes.
        @prop {object} WEBGL_INFO WebGL context information.
        @prop {object} TEXTURE_UNIT_MAP Map of texture unit indices to GL enums, e.g. 0 => gl.TEXTURE0.
    */
    var PicoGL = window.PicoGL = {
        version: "<%= VERSION %>"
    };

    (function() {
        // Absorb all GL enums for convenience
        var canvas = document.createElement("canvas");
        var gl = canvas.getContext("webgl2");
        
        if (!gl) {
            return;
        }

        for (var enumName in gl) {
            if (enumName.match(/^[A-Z0-9_]+$/) && typeof(gl[enumName]) === "number") {
                PicoGL[enumName] = gl[enumName];
            }
        }

        PicoGL.TEXTURE_INTERNAL_FORMAT = {};
        var UNSIGNED_BYTE = PicoGL.TEXTURE_INTERNAL_FORMAT[gl.UNSIGNED_BYTE] = {};
        UNSIGNED_BYTE[gl.RED] = gl.R8;
        UNSIGNED_BYTE[gl.RG] = gl.RG8;
        UNSIGNED_BYTE[gl.RGBA] = gl.RGBA;

        var UNSIGNED_SHORT = PicoGL.TEXTURE_INTERNAL_FORMAT[gl.UNSIGNED_SHORT] = {};
        UNSIGNED_SHORT[gl.DEPTH_COMPONENT] = gl.DEPTH_COMPONENT16;

        // TODO(Tarek): Add other format combinations
        var FLOAT = PicoGL.TEXTURE_INTERNAL_FORMAT[gl.FLOAT] = {};
        FLOAT[gl.RED] = gl.R16F;
        FLOAT[gl.RG] = gl.RG16F;
        FLOAT[gl.RGBA] = gl.RGBA16F;
        FLOAT[gl.DEPTH_COMPONENT] = gl.DEPTH_COMPONENT32F;

        PicoGL.TYPE_SIZE = {};
        PicoGL.TYPE_SIZE[gl.BYTE]              = 1;
        PicoGL.TYPE_SIZE[gl.UNSIGNED_BYTE]     = 1;
        PicoGL.TYPE_SIZE[gl.SHORT]             = 2;
        PicoGL.TYPE_SIZE[gl.UNSIGNED_SHORT]    = 2;
        PicoGL.TYPE_SIZE[gl.INT]               = 4;
        PicoGL.TYPE_SIZE[gl.UNSIGNED_INT]      = 4;
        PicoGL.TYPE_SIZE[gl.FLOAT]             = 4;

        PicoGL.WEBGL_INFO = {};
        PicoGL.WEBGL_INFO.MAX_TEXTURE_UNITS = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        PicoGL.WEBGL_INFO.MAX_UNIFORM_BUFFERS = gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS);

        PicoGL.TEXTURE_UNIT_MAP = new Array(PicoGL.WEBGL_INFO.MAX_TEXTURE_UNITS);

        for (var i = 0, len = PicoGL.TEXTURE_UNIT_MAP.length; i < len; ++i) {
            PicoGL.TEXTURE_UNIT_MAP[i] = gl["TEXTURE" + i];
        }

    })();



    PicoGL.DUMMY_OBJECT = {};

    /**
        Create a PicoGL app. The app is the primary entry point to PicoGL. It stores
        the canvas, the WebGL context and all WebGL state.

        @function PicoGL.createApp
        @param {DOMElement} canvas The canvas on which to create the WebGL context.
        @param {Object} [contextAttributes] Context attributes to pass when calling getContext().
    */
    PicoGL.createApp = function(canvas, contextAttributes) {
        return new PicoGL.App(canvas, contextAttributes);
    };

    PicoGL.compileShader = function(gl, shader, source) {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            var i, lines;

            console.error(gl.getShaderInfoLog(shader));
            lines = source.split("\n");
            for (i = 0; i < lines.length; ++i) {
                console.error((i + 1) + ":", lines[i]);
            }
        }
    };

})();

