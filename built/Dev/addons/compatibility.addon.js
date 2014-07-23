/// <reference path="../../../built/Lib/akra.d.ts" />
var akra;
(function (akra) {
    (function (addons) {
        (function (compatibility) {
            var pRequirements = null;
            var iTotal = 0;
            var extIgnoreList = [];

            function require(pReq) {
                pRequirements[pReq.name.toUpperCase()] = pReq;
                pReq.flag = 1 << iTotal++;
            }

            function or() {
                iTotal--;
            }

            function check(sName) {
                akra.debug.assert(akra.isDefAndNotNull(pRequirements[sName.toUpperCase()]), "Could not check unknown requirement.");
                return pRequirements[sName.toUpperCase()].done;
            }

            function isCompatible() {
                var i = 0xFFFFFFFF;

                for (var sName in pRequirements) {
                    var pReq = pRequirements[sName];

                    if (!pReq.done) {
                        i &= ~pReq.flag;
                    } else {
                        i |= pReq.flag;
                    }
                }

                return (i >>> 0) === 0xFFFFFFFF;
            }

            function checkWebGLExtension(extension) {
                if (extIgnoreList.indexOf(extension) !== -1)
                    return;
                require({
                    name: extension,
                    desc: extension + " WebGL extension",
                    done: akra.webgl.hasExtension(extension),
                    link: "http://www.khronos.org/registry/webgl/extensions/" + extension + "/"
                });
            }

            function buildLog() {
                var s = "\n";

                for (var sName in pRequirements) {
                    var pReq = pRequirements[sName];

                    var sNew = " Check " + pReq.desc;
                    s += sNew;

                    for (var n = sNew.length; n < 64; ++n) {
                        s += ".";
                    }

                    s += check(sName) ? "[   OK   ]" : "[ FAILED ] \t" + (pReq.link || "");
                    s += "\n";
                }

                return s;
            }

            function throwError(sMesg, id) {
                if (akra.isString(id)) {
                    var e = document.getElementById(id);
                    e.style.display = "block";
                    e.getElementsByClassName("error")[0].innerHTML = sMesg + "<br /><small>See console log for details.</small>";
                }

                throw new Error(sMesg);
            }

            var ERRORS = {
                NO_WEBGL: "WebGL not supported.",
                NON_COMPATIBLE: "Your browser is not compatible with Akra Engine."
            };

            function ignoreWebGLExtension(extension) {
                extIgnoreList.push(extension);
            }
            compatibility.ignoreWebGLExtension = ignoreWebGLExtension;

            function requireWebGLExtension(extension) {
                checkWebGLExtension(extension);
            }
            compatibility.requireWebGLExtension = requireWebGLExtension;

            /**
            * @param id View element with @id if compatibility tests failed.
            */
            function verify(id) {
                if (typeof id === "undefined") { id = null; }
                pRequirements = {};

                require({
                    name: "WebGL",
                    done: akra.webgl.isEnabled(),
                    desc: "WebGL API",
                    link: "https://developer.mozilla.org/en-US/docs/Web/WebGL"
                });

                if (!check("webgl")) {
                    throwError(ERRORS.NO_WEBGL, id);
                    return false;
                }

                //checkWebGLExtension(webgl.WEBGL_COMPRESSED_TEXTURE_S3TC);
                //checkWebGLExtension(webgl.WEBGL_DEPTH_TEXTURE);
                //checkWebGLExtension(webgl.OES_TEXTURE_FLOAT);
                //checkWebGLExtension(webgl.OES_ELEMENT_INDEX_UINT);
                //checkWebGLExtension(webgl.OES_STANDARD_DERIVATIVES);
                require({
                    name: "LocalFileSystem",
                    desc: "LocalFileSystem API",
                    link: "https://developer.mozilla.org/en-US/docs/Web/API/LocalFileSystem",
                    done: akra.info.api.getFileSystem()
                });

                or();

                require({
                    name: "Webstorage",
                    desc: "Webstorage API",
                    link: "https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage",
                    done: akra.info.api.getLocalStorage()
                });

                require({
                    name: "WebWorkers",
                    desc: "WebWorkers API",
                    link: "https://developer.mozilla.org/en-US/docs/Web/API/Worker",
                    done: akra.info.api.getWebWorker()
                });

                if (!isCompatible()) {
                    akra.logger.log(buildLog());
                    throwError(ERRORS.NON_COMPATIBLE, id);
                    return false;
                }

                return true;
            }
            compatibility.verify = verify;

            function log() {
                return buildLog();
            }
            compatibility.log = log;
        })(addons.compatibility || (addons.compatibility = {}));
        var compatibility = addons.compatibility;
    })(akra.addons || (akra.addons = {}));
    var addons = akra.addons;
})(akra || (akra = {}));
