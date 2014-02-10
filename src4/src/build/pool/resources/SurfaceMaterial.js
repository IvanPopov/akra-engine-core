/// <reference path="../../idl/ISurfaceMaterial.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="../ResourcePoolItem.ts" />
        /// <reference path="../../material/Material.ts" />
        /// <reference path="../../debug.ts" />
        /// <reference path="Texture.ts" />
        (function (resources) {
            var Material = akra.material.Material;
            var Mat4 = akra.math.Mat4;

            var SurfaceMaterial = (function (_super) {
                __extends(SurfaceMaterial, _super);
                function SurfaceMaterial() {
                    _super.call(this);
                    this._pMaterial = new Material;
                    this._nTotalTextures = 0;
                    this._iTextureFlags = 0;
                    this._iTextureMatrixFlags = 0;
                    this._pTextures = new Array(SurfaceMaterial.MAX_TEXTURES_PER_SURFACE);
                    this._pTexcoords = new Array(SurfaceMaterial.MAX_TEXTURES_PER_SURFACE);
                    this._pTextureMatrices = new Array(SurfaceMaterial.MAX_TEXTURES_PER_SURFACE);
                    //For acceleration of PassInpuBlend.setSurfaceMaterial and PassBlend.generateFXMaker
                    this._nTextureUpdates = 0;
                    this._nTexcoordUpdates = 0;

                    for (var i = 0; i < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE; ++i) {
                        this._pTexcoords[i] = i;
                    }
                }
                SurfaceMaterial.prototype.getTotalUpdatesOfTextures = function () {
                    return this._nTextureUpdates;
                };

                SurfaceMaterial.prototype.getTotalUpdatesOfTexcoords = function () {
                    return this._nTexcoordUpdates;
                };

                SurfaceMaterial.prototype.getTotalTextures = function () {
                    return this._nTotalTextures;
                };

                SurfaceMaterial.prototype.getTextureFlags = function () {
                    return this._iTextureFlags;
                };

                SurfaceMaterial.prototype.getTextureMatrixFlags = function () {
                    return this._iTextureMatrixFlags;
                };

                SurfaceMaterial.prototype.getMaterial = function () {
                    return this._pMaterial;
                };

                SurfaceMaterial.prototype.setMaterial = function (pMaterial) {
                    this._pMaterial.set(pMaterial);
                };

                SurfaceMaterial.prototype.createResource = function () {
                    this.notifyLoaded();
                    return _super.prototype.createResource.call(this);
                };

                SurfaceMaterial.prototype.setTexture = function (iIndex, texture, iTexcoord) {
                    if (typeof iTexcoord === "undefined") { iTexcoord = 0; }
                    //LOG(iIndex, pTexture, iTexcoord);
                    akra.debug.assert(iIndex < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE, "invalid texture slot");

                    var pRmgr = this.getManager();
                    var pTexture = null;

                    this._pTexcoords[iIndex] = iTexcoord;

                    if (iIndex !== iTexcoord) {
                        this._nTexcoordUpdates = 0;
                    }

                    this._nTextureUpdates++;

                    if (akra.isString(texture)) {
                        pTexture = this._pTextures[iIndex];

                        if (pTexture) {
                            //realise first
                            if (pTexture.release() == 0) {
                                this._pTextures[iIndex] = null;
                                //pTexture.destroyResource();
                            } else {
                                akra.debug.warn("cannot destroy resource...");
                            }

                            this._iTextureFlags = akra.bf.clearBit(this._iTextureFlags, iIndex);
                            --this._nTotalTextures;
                        }

                        this._pTextures[iIndex] = pRmgr.getTexturePool().loadResource(texture);

                        if (this._pTextures[iIndex]) {
                            this._iTextureFlags = akra.bf.setBit(this._iTextureFlags, iIndex);

                            ++this._nTotalTextures;

                            this.sync(this._pTextures[iIndex], 1 /* LOADED */);
                        }

                        return true;
                    } else if (texture instanceof akra.pool.resources.Texture) {
                        if (!this._pTextures[iIndex] || pTexture != this._pTextures[iIndex]) {
                            pTexture = texture;
                            if (this._pTextures[iIndex]) {
                                // realise first
                                // DisplayManager.texturePool().releaseResource(this._pTextures[iIndex]);
                                if (this._pTextures[iIndex].release() == 0) {
                                    // this._pTextureMatrices[iIndex].destroyResource();
                                    this._pTextures[iIndex] = null;
                                } else {
                                    akra.debug.warn("cannot destroy resource...");
                                }

                                this._iTextureFlags = akra.bf.clearBit(this._iTextureFlags, iIndex);
                                --this._nTotalTextures;
                            }

                            this._pTextures[iIndex] = pTexture;

                            this._pTextures[iIndex].addRef();
                            this._iTextureFlags = akra.bf.setBit(this._iTextureFlags, iIndex);
                            ++this._nTotalTextures;
                            this.sync(this._pTextures[iIndex], 1 /* LOADED */);
                            // var me = this;
                            // trace('me get texture :)');
                            // pTexture.setChangesNotifyRoutine(function() {
                            //                 if (pTexture.isResourceLoaded()) {
                            //                     trace(arguments);
                            //                     trace('Texture <', pTexture.findResourceName(), '> loaded');
                            //                     if (me.isResourceLoaded()) {
                            //                         trace('Surface material loaded too.')
                            //                     }
                            //                 }
                            //             });
                        }

                        return true;
                    } else if (akra.isNumber(texture)) {
                        if (!this._pTextures[iIndex] || this._pTextures[iIndex].getResourceHandle() != texture) {
                            if (this._pTextures[iIndex]) {
                                //TheGameHost.displayManager().texturePool().releaseResource(m_pTextures[index]);
                                if (this._pTextures[iIndex].release() === 0) {
                                    // this._pTextures[iIndex].destroyResource();
                                    this._pTextures[iIndex] = null;
                                } else {
                                    akra.debug.warn("cannot destroy resource...");
                                }

                                this._iTextureFlags = akra.bf.clearBit(this._iTextureFlags, iIndex);
                                --this._nTotalTextures;
                            }

                            this._pTextures[iIndex] = pRmgr.getTexturePool().getResource(texture);

                            if (this._pTextures[iIndex]) {
                                this._iTextureFlags = akra.bf.setBit(this._iTextureFlags, iIndex);
                                ++this._nTotalTextures;
                                this.sync(this._pTextures[iIndex], 1 /* LOADED */);
                            }
                        }

                        return true;
                    }

                    this._pTexcoords[iIndex] = iIndex;

                    return false;
                };

                SurfaceMaterial.prototype.setTextureMatrix = function (iIndex, m4fValue) {
                    akra.debug.assert(iIndex < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE, "invalid texture slot");

                    if (!m4fValue) {
                        this._pTextureMatrices[iIndex] = new Mat4();
                    } else {
                        this._pTextureMatrices[iIndex] = new Mat4(m4fValue);
                    }

                    this._iTextureFlags = akra.bf.setBit(this._iTextureMatrixFlags, iIndex);
                    return true;
                };

                SurfaceMaterial.prototype.isEqual = function (pSurfaceMaterial) {
                    if (this._nTotalTextures === pSurfaceMaterial.getTotalTextures() && this._iTextureFlags === pSurfaceMaterial.getTextureFlags() && this._iTextureMatrixFlags === pSurfaceMaterial.getTextureMatrixFlags()) {
                        if ((this._pMaterial && this._pMaterial.isEqual(pSurfaceMaterial.getMaterial())) || (pSurfaceMaterial.getMaterial() === null)) {
                            for (var i = 0; i < this._pTextures.length; i++) {
                                if (this._pTextures[i] !== pSurfaceMaterial.texture[i]) {
                                    return false;
                                }
                            }
                            ;

                            for (var i = 0; i < this._pTextureMatrices.length; ++i) {
                                for (var j = 0; j < this._pTextureMatrices[i].data.length; j++) {
                                    if (this._pTextureMatrices[i].data[j] !== pSurfaceMaterial.textureMatrix[i].data[j]) {
                                        return false;
                                    }
                                }
                            }

                            return true;
                        }
                    }

                    return false;
                };

                SurfaceMaterial.prototype.texture = function (iSlot) {
                    // debug.assert((iSlot >= 0 && iSlot < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE),
                    //            "invalid texture slot");
                    return this._pTextures[iSlot];
                };

                SurfaceMaterial.prototype.texcoord = function (iSlot) {
                    // debug.assert((iSlot >= 0 && iSlot < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE),
                    //            "invalid texture slot");
                    return this._pTexcoords[iSlot];
                };

                SurfaceMaterial.prototype.textureMatrix = function (iSlot) {
                    akra.debug.assert((iSlot >= 0 && iSlot < SurfaceMaterial.MAX_TEXTURES_PER_SURFACE), "invalid texture slot");
                    return this._pTextureMatrices[iSlot];
                };

                SurfaceMaterial.MAX_TEXTURES_PER_SURFACE = 16;
                return SurfaceMaterial;
            })(akra.pool.ResourcePoolItem);
            resources.SurfaceMaterial = SurfaceMaterial;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
//# sourceMappingURL=SurfaceMaterial.js.map
