/**
 * @file
 * @brief file contains SystemInfo class realization
 * @author reinor
 */

function BrowserInfo () {
    this.sBrowser = null;
    this.sVersion = null;
    this.sOS = null;
    this._sVersionSearch = null;
    this.dataBrowser = [
        {
            string:    navigator.userAgent,
            subString: "Chrome",
            identity:  "Chrome"
        },
        {
            string:        navigator.userAgent,
            subString:     "OmniWeb",
            versionSearch: "OmniWeb/",
            identity:      "OmniWeb"
        },
        {
            string:        navigator.vendor,
            subString:     "Apple",
            identity:      "Safari",
            versionSearch: "Version"
        },
        {
            prop:          window.opera,
            identity:      "Opera",
            versionSearch: "Version"
        },
        {
            string:    navigator.vendor,
            subString: "iCab",
            identity:  "iCab"
        },
        {
            string:    navigator.vendor,
            subString: "KDE",
            identity:  "Konqueror"
        },
        {
            string:    navigator.userAgent,
            subString: "Firefox",
            identity:  "Firefox"
        },
        {
            string:    navigator.vendor,
            subString: "Camino",
            identity:  "Camino"
        },
        {        // for newer Netscapes (6+)
            string:    navigator.userAgent,
            subString: "Netscape",
            identity:  "Netscape"
        },
        {
            string:        navigator.userAgent,
            subString:     "MSIE",
            identity:      "Explorer",
            versionSearch: "MSIE"
        },
        {
            string:        navigator.userAgent,
            subString:     "Gecko",
            identity:      "Mozilla",
            versionSearch: "rv"
        },
        {         // for older Netscapes (4-)
            string:        navigator.userAgent,
            subString:     "Mozilla",
            identity:      "Netscape",
            versionSearch: "Mozilla"
        }
    ];

    this.dataOS = [
        {
            string:    navigator.platform,
            subString: "Win",
            identity:  "Windows"
        },
        {
            string:    navigator.platform,
            subString: "Mac",
            identity:  "Mac"
        },
        {
            string:    navigator.userAgent,
            subString: "iPhone",
            identity:  "iPhone/iPod"
        },
        {
            string:    navigator.platform,
            subString: "Linux",
            identity:  "Linux"
        }
    ];

    this.init();
}

BrowserInfo.prototype.init = function () {
    this.sBrowser = this._searchString(this.dataBrowser) || "An unknown browser";
    this.sVersion = this._searchVersion(navigator.userAgent)
        || this._searchVersion(navigator.appVersion)
        || "an unknown version";
    this.sOS = this._searchString(this.dataOS) || "an unknown OS";
};

BrowserInfo.prototype._searchString = function (sDataBrowser) {
    for (var i = 0; i < sDataBrowser.length; i++) {
        var sData = sDataBrowser[i].string;
        var dataProp = sDataBrowser[i].prop;
        this._sVersionSearch = sDataBrowser[i].versionSearch || sDataBrowser[i].identity;
        if (sData) {
            if (sData.indexOf(sDataBrowser[i].subString) != -1) {
                return sDataBrowser[i].identity;
            }
        }
        else if (dataProp) {
            return sDataBrowser[i].identity;
        }
    }
    return null;
};

BrowserInfo.prototype._searchVersion = function (sData) {
    var iStartIndex = sData.indexOf(this._sVersionSearch);

    if (iStartIndex == -1) {
        return null;
    }

    iStartIndex = sData.indexOf('/', iStartIndex + 1);
    if (iStartIndex == -1) {
        return null;
    }

    var iEndIndex = sData.indexOf(' ', iStartIndex + 1);

    if (iEndIndex == -1) {
        iEndIndex = sData.indexOf(';', iStartIndex + 1);
        if (iEndIndex == -1) {
            return null;
        }
        return sData.slice(iStartIndex + 1);
    }
    else {
        return sData.slice(iStartIndex + 1, iEndIndex);
    }
};

Object.defineProperty(BrowserInfo.prototype, "name", {
    get: function () {
        return this.sBrowser;
    }
});
Object.defineProperty(BrowserInfo.prototype, "version", {
    get: function () {
        return this.sVersion;
    }
});

Object.defineProperty(BrowserInfo.prototype, "os", {
    get: function () {
        return this.sOS;
    }
});


window.URL = window.URL ? window.URL : window.webkitURL ? window.webkitURL : null;
window.BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder || window.BlobBuilder;
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame;


/*function checkFileSystem() {
 if (window.requestFileSystem) {
 // Attempt to create a folder to test if we can.
 window.requestFileSystem(TEMPORARY, 512, function(fs) {
 fs.root.getDirectory('slidestestquotaforfsfolder', {
 create: true
 }, function(dirEntry) {
 dirEntry.remove(); // If successfully created, just delete it.
 //('feature-filesystem');
 }, function(e) {
 if (e.code == FileError.QUOTA_EXCEEDED_ERR) {
 //('feature-filesystem-quota');
 }
 });
 });
 } else {
 //('feature-no-filesystem');
 }
 };*/


function ApiInfo () {
    this.webgl = (window.WebGLRenderingContext || this.checkWebGL() ? true : false);
    this.webAudio = (window.AudioContext && window.webkitAudioContext ? true : false);
    this.file = (window.File && window.FileReader && window.FileList && window.Blob ? true : false);
    this.fileSystem = (this.file && window.URL && window.requestFileSystem ? true : false);
    this.webWorker = (typeof(Worker) !== "undefined");
    this.transferableObjects = (this.webWorker && this.chechTransferableObjects() ? true : false);
    this.localStorage = (typeof(localStorage) !== 'undefined');
}


ApiInfo.prototype.checkWebGL = function () {
    try {
        var pCanvas = document.createElement('canvas');
        var pContext = pCanvas.getContext('webgl') ||
            pCanvas.getContext('experimental-webgl');
        if (pContext) {
            delete pContext;
            return true
        }
    }
    catch (e) {}
    return false;
};

ApiInfo.prototype.chechTransferableObjects = function () {
    var pWorker = new Worker(BUILD_PATH('EmptyThread.thread.js', '/sources/files/threads/'));//FIXME
    pWorker.postMessage = pWorker.webkitPostMessage || pWorker.postMessage;

    var ab = new ArrayBuffer(1);
    try {
        pWorker.postMessage(ab, [ab]);
    }
    catch (e) {
        debug_print('transferable objects not supported in your browser...');
    }

    pWorker.terminate();

    if (ab.byteLength) {
        return false
    }

    return true;
};

a.browser = new BrowserInfo();
a.info = {


                     /**
                      * Canvas info.
                      * @tparam String/CanvasElement id Canvas identifier.
                      * @treturn Object Canvas parameters.
                      */
                     canvas: function (id) {
                         var pCanvas = (typeof id == 'string' ? document.getElementById(id) : id);
                         return {
                             width:  (pCanvas.width ? pCanvas.width : pCanvas.style.width),
                             height: (pCanvas.height ? pCanvas.height : pCanvas.style.height),
                             id:     pCanvas.id
                         };
                     },
    browser:         a.browser,
                             /**
                              * Screen info.
                              */
                             screen: {
                                 width:  function () {
                                     return screen.width
                                 },
                                 height: function () {
                                     return screen.height;
                                 }
                             },

    uri:  a.uri(document.location.href),
    path: {
        modules: HOME_DIR
    },
    is:   {

                /**
                 * show status - online or offline
                 * @treturn Boolean true if online otherwise flase
                 */
                online: function () {
                    return navigator.onLine;
                },
                        /**
                         * perform test on mobile device
                         * @treturn Boolean true if mobile otherwise flase
                         */
                        mobile: (/mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i)
                            .test(navigator.userAgent.toLowerCase()),
        linux:          a.browser.os == 'Linux',
        windows:        a.browser.os == 'Windows',
        mac:            a.browser.os == 'Mac',
        iPhone:         a.browser.os == 'iPhone'
    },

    support: {

    },

    graphics: {
        /**
        * Returns maximum size of 2D texture.
        * @treturn Integer
        */
        maxTextureSize: function (pContext) {
        return pContext.getParameter(pContext.MAX_TEXTURE_SIZE);
        },

        /**
        * Return maximum size of cube map texture.
        * @treturn Integer
        */
        maxCubeMapTextureSize: function (pContext) {
        return pContext.getParameter(pContext.MAX_CUBE_MAP_TEXTURE_SIZE);
        },

        /**
        * returns maximum size of viewport
        * @treturn Integer
        */
        maxViewPortSize: function (pContext) {
         return pContext.getParameter(pContext.MAX_VIEWPORT_DIMS);
        },

        /**
        * returns number of bits for stencil buffer
        * @treturn Integer
        */
        stencilBits: function (pContext) {
         return pContext.getParameter(pContext.STENCIL_BITS);
        },

        /**
        * returns array contains bits depth of each color [r,g,b]
        * @treturn Array
        */
        colorBits: function (pContext) {
        return [
           pContext.getParameter(pContext.RED_BITS),
           pContext.getParameter(pContext.GREEN_BITS),
           pContext.getParameter(pContext.BLUE_BITS)
        ];
        },

        /**
        * Returns number of bits for alpha.
        * @treturn Integer
        */
        alphaBits: function (pContext) {
           return pContext.getParameter(pContext.ALPHA_BITS);
        },

        /**
        * Returns number of bits for depth buffer.
        * @treturn Integer
        */
        depthBits: function (pContext) {
           return pContext.getParameter(pContext.DEPTH_BITS);
        },

         /**
          * Returns multisample type.
          * @treturn Float
          */
         multisampleType: function (pContext) {
             return pContext.getParameter(pContext.SAMPLE_COVERAGE_VALUE);
         },

         /**
          * returns maximum quantity of textures that can be used in fragment shader
          * @treturn Integer
          */
         maxTextureImageUnits: function (pContext) {
              return pContext.getParameter(pContext.MAX_TEXTURE_IMAGE_UNITS);
         },

        maxVertexAttributes: function (pContext) {
            return 16;
        },

        /**
         * Returns maximum quantity of textures that can be used in
         * vertex shader.
         * @treturn Integer
         */
        maxVertexTextureImageUnits: function (pContext) {
            return pContext.getParameter(pContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        },

        /**
        * Returns maximum quantity of textures that can be used in
        * vertex and fragment.
        * shaders simultaneously
        * @treturn Integer
        */
        maxCombinedTextureImageUnits: function (pContext) {
            return pContext.getParameter(pContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        },

       /**
        * Returns using glsl version.
        * @treturn Float
        */
       shaderVersion: function (pContext) {
           var sVersion = (pContext.getParameter(pContext.SHADING_LANGUAGE_VERSION));
           var iTmp = sVersion.indexOf(sVersion.match(/\d/)[0]);
           return parseFloat(sVersion.substr(iTmp));
       },

        getExtention: function (pContext, eExtention) {
            var pExtentions, sExtention, result = false, pExp;

            pExtentions = pContext.getSupportedExtensions();

            switch (eExtention) {
                case a.EXTENTIONS.TEXTURE_FLOAT:
                    pExp = 'texture_float';
                    break;
                case a.EXTENTIONS.TEXTURE_HALF_FLOAT:
                    pExp = 'texture_half_float';
                    break;
                case a.EXTENTIONS.COMPRESSED_TEXTURES:
                    pExp = 'compressed_texture';
                    break;
                case a.EXTENTIONS.STANDART_DERIVATIVES:
                    pExp = 'standard_derivatives';
                    break;
                default:
                    return null;
            }

            for (var i in pExtentions) {
                sExtention = pExtentions[i];
                if (sExtention.search(pExp) != -1) {
                    result = pContext.getExtension(sExtention);
                    trace('extension successfuly loaded: ' + sExtention);
                }
            }

            return result;
        },

        checkFormat: function (pContext, eFormat) {
            switch (eFormat) {
                case a.IFORMAT.RGB_DXT1:
                case a.IFORMAT.RGBA_DXT1:
                case a.IFORMAT.RGBA_DXT2:
                case a.IFORMAT.RGBA_DXT3:
                case a.IFORMAT.RGBA_DXT4:
                case a.IFORMAT.RGBA_DXT5:
                    for (var i in pContext) {
                        if (typeof pContext[i] == 'number'
                            && pContext[i] == eFormat) {
                            return true;
                        }
                    }
                    return false;
                case a.IFORMAT.RGB8:
                case a.IFORMAT.RGBA8:
                case a.IFORMAT.RGBA4:
                case a.IFORMAT.RGB5_A1:
                case a.IFORMAT.RGB565:
                    return true;
                default:
                    return false;
            }
        }
    }
};

a.info.support.api = new ApiInfo();


Object.defineProperty(a.info.is, "online", {
    get: function () {
        return navigator.onLine;
    }
});

Object.defineProperty(a.info.support, "webgl", {
    get: function () {
        return a.info.support.api.webgl;
    }
});

Object.defineProperty(a.info.support, "webAudio", {
    get: function () {
        return a.info.support.api.webAudio;
    }
});

Object.defineProperty(a.info.support, "fs", {
    get: function () {
        return a.info.support.api.fileSystem;
    }
});

Object.defineProperty(a.info.screen, "width", {
    get: function () {
        return screen.width
    }
});

Object.defineProperty(a.info.screen, "height", {
    get: function () {
        return screen.height;
    }
});

