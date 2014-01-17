var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="../../idl/IAFXComposer.ts" />
        /// <reference path="../../idl/IParser.ts" />
        /// <reference path="../../idl/IFile.ts" />
        /// <reference path="../../idl/parser/IParser.ts" />
        /// <reference path="../../io/io.ts" />
        /// <reference path="../../config/config.ts" />
        /// <reference path="../../common.ts" />
        /// <reference path="../../util/EffectParser.ts" />
        /// <reference path="../ResourcePoolItem.ts" />
        (function (resources) {
            var EffectData = (function (_super) {
                __extends(EffectData, _super);
                function EffectData() {
                    _super.apply(this, arguments);
                    var _pFile = null
                    var _pSyntaxTree = null
                }
                Object.defineProperty(EffectData.prototype, "byteLength", {
                    get: function () {
                        return this._pFile ? this._pFile.byteLength : 0;
                    },
                    enumerable: true,
                    configurable: true
                });

                EffectData.prototype.loadResource = function (sFileName) {
                    var reExt = /^(.+)(\.afx|\.abf|\.fx)$/;
                    var pRes = reExt.exec(sFileName);

                    if (isNull(pRes)) {
                        logger.error("Bad effect file extension. Only .afx, .fx, .abf are available");
                        return;
                    }

                    var isBinary = pRes[pRes.length - 1] === ".abf";
                    var pComposer = this.getManager().getEngine().getComposer();

                    if (!config.AFX_ENABLE_TEXT_EFFECTS) {
                        if (!isBinary) {
                            logger.error("You can load text effect-files only in debug-mode");
                            return;
                        }
                    }

                    if (isBinary) {
                        var pFile = this._pFile = io.fopen(sFileName, "r+b");

                        pFile.read(function (err, pData) {
                            if (err) {
                                logger.error("Can not read file");
                            } else {
                                _this._initFromBinaryData(pData, sFileName);
                            }
                        });

                        return true;
                    }

                    if (config.AFX_ENABLE_TEXT_EFFECTS) {
                        //text only
                        var pFile = this._pFile = io.fopen(sFileName, "r+t");

                        pFile.read(function (pErr, sData) {
                            if (!isNull(pErr)) {
                                ERROR("Can not load .afx file: '" + sFileName + "'");
                            } else {
                                util.parser.setParseFileName(sFileName);
                                util.parser.parse(sData, me._initFromParsedEffect, me);
                            }
                        });
                    }

                    return true;
                };

                EffectData.prototype._initFromParsedEffect = function (eCode, sFileName) {
                    if (eCode === EParserCode.k_Error) {
                        return;
                    }

                    this._pSyntaxTree = util.parser.getSyntaxTree();

                    var pComposer = this.getManager().getEngine().getComposer();

                    if (pComposer._loadEffectFromSyntaxTree(this._pSyntaxTree, sFileName)) {
                        this.notifyLoaded();
                    }
                };

                EffectData.prototype._initFromBinaryData = function (pData, sFileName) {
                    // var pComposer: IAFXComposer = this.getManager().getEngine().getComposer();
                    // pComposer._loadEffectFromBinary(this._pSyntaxTree, sFileName);
                };
                return EffectData;
            })(ResourcePoolItem);
            resources.EffectData = EffectData;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
