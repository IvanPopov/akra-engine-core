/// <reference path="../../idl/IAFXComposer.ts" />
/// <reference path="../../idl/IFile.ts" />
/// <reference path="../../idl/parser/IParser.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="../../io/io.ts" />
        /// <reference path="../../config/config.ts" />
        /// <reference path="../../common.ts" />
        /// <reference path="../../fx/EffectParser.ts" />
        /// <reference path="../ResourcePoolItem.ts" />
        (function (resources) {
            var EffectData = (function (_super) {
                __extends(EffectData, _super);
                function EffectData() {
                    _super.apply(this, arguments);
                    this._pFile = null;
                    this._pSyntaxTree = null;
                }
                EffectData.prototype.getByteLength = function () {
                    return this._pFile ? this._pFile.getByteLength() : 0;
                };

                EffectData.prototype.loadResource = function (sFileName) {
                    var _this = this;
                    var reExt = /^(.+)(\.afx|\.abf|\.fx)$/;
                    var pRes = reExt.exec(sFileName);

                    if (akra.isNull(pRes)) {
                        akra.logger.error("Bad effect file extension. Only .afx, .fx, .abf are available");
                        return;
                    }

                    var isBinary = pRes[pRes.length - 1] === ".abf";
                    var pComposer = this.getManager().getEngine().getComposer();

                    if (!akra.config.AFX_ENABLE_TEXT_EFFECTS) {
                        //binary only
                        if (!isBinary) {
                            akra.logger.error("You can load text effect-files only in debug-mode");
                            return;
                        }
                    }

                    if (isBinary) {
                        var pFile = this._pFile = akra.io.fopen(sFileName, "r+b");

                        pFile.read(function (err, pData) {
                            if (err) {
                                akra.logger.error("Can not read file");
                            } else {
                                _this._initFromBinaryData(pData, sFileName);
                            }
                        });

                        return true;
                    }

                    if (akra.config.AFX_ENABLE_TEXT_EFFECTS) {
                        //text only
                        var pFile = this._pFile = akra.io.fopen(sFileName, "r+t");
                        var me = this;

                        pFile.read(function (pErr, sData) {
                            if (!akra.isNull(pErr)) {
                                akra.logger.error("Can not load .afx file: '" + sFileName + "'");
                            } else {
                                akra.fx.effectParser.setParseFileName(sFileName);
                                akra.fx.effectParser.parse(sData, me._initFromParsedEffect, me);
                            }
                        });
                    }

                    return true;
                };

                EffectData.prototype._initFromParsedEffect = function (eCode, sFileName) {
                    if (eCode === 2 /* k_Error */) {
                        return;
                    }

                    this._pSyntaxTree = akra.fx.effectParser.getSyntaxTree();

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
            })(akra.pool.ResourcePoolItem);
            resources.EffectData = EffectData;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=EffectData.js.map
