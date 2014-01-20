var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (pool) {
        /// <reference path="../../idl/IObj.ts" />
        /// <reference path="../ResourcePoolItem.ts" />
        /// <reference path="../../debug.ts" />
        /// <reference path="../../config/config.ts" />
        /// <reference path="../../io/io.ts" />
        (function (resources) {
            (function (EObjFVF) {
                EObjFVF[EObjFVF["XYZ"] = 0x01] = "XYZ";
                EObjFVF[EObjFVF["NORMAL"] = 0x02] = "NORMAL";
                EObjFVF[EObjFVF["UV"] = 0x04] = "UV";
            })(resources.EObjFVF || (resources.EObjFVF = {}));
            var EObjFVF = resources.EObjFVF;

            function regExpResultToFloatArray(pSrc, ppDest, iFrom) {
                if (typeof iFrom === "undefined") { iFrom = -1; }
                //i = 1 ==> regexp result starts from original value, like: ("1 2 3").match(/([1-9])/i) = ["1 2 3", "1", "2", "3"];
                var j = 0;

                if (iFrom < 0) {
                    iFrom = ppDest.length;
                }

                for (var i = 1; i < pSrc.length; ++i) {
                    if (pSrc[i]) {
                        ppDest[iFrom + j] = parseFloat(pSrc[i].replace(/,/g, "."));
                        j++;
                    }
                }

                return j;
            }
            ;

            var Obj = (function (_super) {
                __extends(Obj, _super);
                function Obj() {
                    _super.apply(this, arguments);
                    this._sFilename = null;
                    this._iByteLength = 0;
                    this._pOptions = null;
                    this._pVertices = [];
                    this._pNormals = [];
                    this._pTextureCoords = [];
                    this._pVertexIndexes = [];
                    this._pTexcoordIndexes = [];
                    this._pNormalIndexes = [];
                    //flexible vertex format
                    this._iFVF = 0;
                }
                Object.defineProperty(Obj.prototype, "modelFormat", {
                    get: function () {
                        return akra.EModelFormats.OBJ;
                    },
                    enumerable: true,
                    configurable: true
                });

                Obj.prototype.getFilename = function () {
                    return this._sFilename;
                };

                Obj.prototype.setFilename = function (sName) {
                    this._sFilename = sName;
                };

                Obj.prototype.getBasename = function () {
                    return akra.path.info(this._pOptions.name || this._sFilename || "unknown").basename;
                };

                Object.defineProperty(Obj.prototype, "byteLength", {
                    get: function () {
                        return this._iByteLength;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Obj.prototype, "options", {
                    get: function () {
                        return this._pOptions;
                    },
                    enumerable: true,
                    configurable: true
                });

                Obj.prototype.setOptions = function (pOptions) {
                    if (akra.isNull(pOptions)) {
                        pOptions = Obj.DEFAULT_OPTIONS;
                    }

                    for (var i in Obj.DEFAULT_OPTIONS) {
                        if (akra.isDef(pOptions[i])) {
                            continue;
                        }

                        pOptions[i] = Obj.DEFAULT_OPTIONS[i];
                    }

                    this._pOptions = pOptions;
                };

                Obj.prototype.attachToScene = function (parent) {
                    var pScene;
                    var pNode;
                    var pRoot;

                    if (akra.isNull(parent)) {
                        return null;
                    }

                    if (parent instanceof scene.Node) {
                        //attach collada scene to give node
                        pNode = parent;
                        pScene = pNode.scene;
                    } else {
                        //attaching collada scene to new node, that is child of scene root
                        pScene = parent;
                        pNode = pScene.getRootNode();
                    }

                    pRoot = pScene._createModelEntry(this);
                    pRoot.create();
                    pRoot.name = this.getBasename();
                    pRoot.setInheritance(akra.ENodeInheritance.ALL);

                    if (!pRoot.attachToParent(pNode)) {
                        return null;
                    }

                    this.buildMesh(pRoot);

                    return pRoot;
                };

                Obj.prototype.buildMesh = function (pRoot) {
                    var pMesh = null, pSubMesh = null;

                    var pVerticesData = new Float32Array(this._pVertices);
                    var pNormalsData = new Float32Array(this._pNormals);
                    var pTexcoordsData = new Float32Array(this._pTextureCoords);

                    // console.log(pVerticesData, pNormalsData)
                    var pVertexIndicesData = new Float32Array(this._pVertexIndexes);
                    var pNormalIndicesData = new Float32Array(this._pNormalIndexes);
                    var pTexcoordIndicesData = new Float32Array(this._pTexcoordIndexes);

                    var iPos = 0, iNorm = 0, iTexcoord = 0;

                    var pEngine = this.getEngine();

                    pMesh = model.createMesh(pEngine, this.getBasename(), akra.EMeshOptions.HB_READABLE);
                    pSubMesh = pMesh.createSubset(this.getBasename(), akra.EPrimitiveTypes.TRIANGLELIST);

                    iPos = pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);
                    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX0')], pVertexIndicesData);
                    pSubMesh.data.index(iPos, 'INDEX0');

                    if (this.hasNormals()) {
                        iNorm = pSubMesh.data.allocateData([VE_VEC3('NORMAL')], pNormalsData);

                        if (this._pNormalIndexes.length > 0) {
                            pSubMesh.data.allocateIndex([VE_FLOAT('INDEX1')], pNormalIndicesData);
                            pSubMesh.data.index(iNorm, 'INDEX1');
                            // console.log(pNormalsData, pNormalIndicesData);
                        } else {
                            OBJ_PRINT(this, "normal index was replaced with vertex index");
                            pSubMesh.data.allocateIndex([VE_FLOAT('INDEX1')], pVertexIndicesData);
                            pSubMesh.data.index(iNorm, 'INDEX1');
                        }
                    }

                    if (this.hasTexcoords()) {
                        OBJ_PRINT(this, "model have texture coordinates");
                        iTexcoord = pSubMesh.data.allocateData([VE_VEC2('TEXCOORD0')], pTexcoordsData);
                        pSubMesh.data.allocateIndex([VE_FLOAT('INDEX2')], pTexcoordIndicesData);
                        pSubMesh.data.index('TEXCOORD0', 'INDEX2');
                        // console.log(pTexcoordsData, pTexcoordIndicesData);
                    } else {
                        OBJ_PRINT(this, "model does not have any texture coordinates");
                    }

                    pSubMesh.shadow = this.options.shadows;
                    pSubMesh.renderMethod.effect.addComponent("akra.system.mesh_texture");

                    var pMatrial = pSubMesh.renderMethod.surfaceMaterial.material;
                    pMatrial.diffuse = new Color(0.7, 0., 0., 1.);
                    pMatrial.ambient = new Color(0., 0., 0., 1.);
                    pMatrial.specular = new Color(0.7, 0., 0., 1);
                    pMatrial.emissive = new Color(0., 0., 0., 1.);
                    pMatrial.shininess = 30.;

                    var pSceneModel = pRoot.scene.createModel(this.getBasename());
                    pSceneModel.setInheritance(akra.ENodeInheritance.ALL);
                    pSceneModel.mesh = pMesh;

                    pSubMesh.wireframe(true);

                    pSceneModel.attachToParent(pRoot);
                };

                Obj.prototype.uploadVertexes = function (pPositions, pIndexes) {
                    if (typeof pIndexes === "undefined") { pIndexes = null; }
                    for (var i = 0; i < pPositions.length; ++i) {
                        this._pVertices[i] = pPositions[i];
                    }

                    if (!akra.isNull(pIndexes)) {
                        for (var i = 0; i < pIndexes.length; ++i) {
                            this._pVertexIndexes[i] = pIndexes[i];
                        }
                    }

                    this.calcDeps();

                    this.notifyRestored();
                    this.notifyLoaded();
                };

                Obj.prototype.parse = function (sData, pOptions) {
                    if (typeof pOptions === "undefined") { pOptions = null; }
                    if (akra.isNull(sData)) {
                        akra.debug.error("must be specified obj content.");
                        return false;
                    }

                    OBJ_PRINT(this, "parsing started...");
                    this.setOptions(pOptions);

                    var pLines = sData.split("\n");

                    for (var i = 0; i < pLines.length; ++i) {
                        //current line
                        var sLine = pLines[i];

                        //first character
                        var c = sLine.charAt(0);

                        switch (c) {
                            case 'v':
                                this.readVertexInfo(sLine);
                                break;
                            case 'f':
                                this.readFaceInfo(sLine);
                                break;
                        }
                    }

                    for (var i = 0; i < this._pVertexIndexes.length; ++i) {
                        this._pVertexIndexes[i]--;
                    }

                    for (var i = 0; i < this._pNormalIndexes.length; ++i) {
                        this._pNormalIndexes[i]--;
                    }

                    for (var i = 0; i < this._pTexcoordIndexes.length; ++i) {
                        this._pTexcoordIndexes[i]--;
                    }

                    //end of index fix
                    this.calcDeps();

                    return true;
                };

                Obj.prototype.calcDeps = function () {
                    if (this._pVertexIndexes.length === 0) {
                        this.calcVertexIndices();
                    }

                    if (!this._pNormals.length) {
                        OBJ_PRINT(this, "calculation normals....");
                        this.calcNormals();
                    }
                };

                Obj.prototype.calcVertexIndices = function () {
                    for (var i = 0; i < this._pVertices.length; ++i) {
                        this._pVertexIndexes[i] = i;
                    }
                };

                Obj.prototype.calcNormals = function (useSmoothing) {
                    if (typeof useSmoothing === "undefined") { useSmoothing = true; }
                    var v = new Array(3), p = new Vec3(), q = new Vec3(), i, j, n = new Vec3(), k;

                    for (i = 0; i < this._pVertices.length; ++i) {
                        this._pNormals[i] = 0.;
                    }

                    var pNormalsWeights = new Float32Array(this._pNormals.length / 3);

                    for (i = 0; i < this._pVertexIndexes.length; i += 3) {
                        for (k = 0; k < 3; ++k) {
                            j = this._pVertexIndexes[i + k] * 3;
                            v[k] = vec3([this._pVertices[j], this._pVertices[j + 1], this._pVertices[j + 2]]);
                        }

                        v[1].subtract(v[2], p);
                        v[0].subtract(v[2], q);
                        p.cross(q, n);
                        n.normalize();

                        for (k = 0; k < 3; ++k) {
                            var r = this._pVertexIndexes[i + k];
                            pNormalsWeights[r]++;
                            j = r * 3;
                            this._pNormals[j] += n.x;
                            this._pNormals[j + 1] += n.y;
                            this._pNormals[j + 2] += n.z;
                        }
                    }

                    for (i = 0; i < pNormalsWeights.length; i++) {
                        j = i * 3;
                        console.log(pNormalsWeights[i]);
                        n.set(this._pNormals[j], this._pNormals[j + 1], this._pNormals[j + 2]).scale(1 / pNormalsWeights[i]).normalize();

                        this._pNormals[j] = n.x;
                        this._pNormals[j + 1] = n.y;
                        this._pNormals[j + 2] = n.z;
                    }

                    akra.bf.setAll(this._iFVF, EObjFVF.NORMAL);
                };

                Obj.prototype.readVertexInfo = function (s) {
                    //<s> - current line
                    //second character of line <s>
                    var ch = s.charAt(1);

                    //results of regexp matching
                    var pm;
                    ;
                    var iX = this.options.axis.x.index;
                    var iY = this.options.axis.y.index;
                    var iZ = this.options.axis.z.index;

                    var iXSign = this.options.axis.x.inverse ? -1 : 1;
                    var iYSign = this.options.axis.y.inverse ? -1 : 1;
                    var iZSign = this.options.axis.z.inverse ? -1 : 1;

                    s = s.replace("\r", "");

                    if (ch == ' ') {
                        pm = s.match(Obj.VERTEX_REGEXP);
                        akra.debug.assert(!akra.isNull(pm), "invalid line detected: <" + s + ">");
                        regExpResultToFloatArray(pm, Obj.row, 0);
                        this._pVertices.push(iXSign * Obj.row[iX], iYSign * Obj.row[iY], iZSign * Obj.row[iZ]);
                        akra.bf.setAll(this._iFVF, EObjFVF.XYZ);
                    } else if (ch == 't') {
                        pm = s.match(Obj.TEXCOORD_REGEXP);
                        akra.debug.assert(!akra.isNull(pm), "invalid line detected: <" + s + "> (" + Obj.TEXCOORD_REGEXP.toString() + ")");
                        regExpResultToFloatArray(pm, this._pTextureCoords);
                        akra.bf.setAll(this._iFVF, EObjFVF.UV);
                    } else if (ch == 'n') {
                        pm = s.match(Obj.NORMAL_REGEXP);
                        akra.debug.assert(!akra.isNull(pm), "invalid line detected: <" + s + ">");
                        regExpResultToFloatArray(pm, Obj.row, 0);
                        this._pNormals.push(iXSign * Obj.row[iX], iYSign * Obj.row[iY], iZSign * Obj.row[iZ]);
                        akra.bf.setAll(this._iFVF, EObjFVF.NORMAL);
                    }
                };

                Obj.prototype.hasTexcoords = function () {
                    return (this._iFVF & EObjFVF.UV) != 0;
                };

                Obj.prototype.hasNormals = function () {
                    return (this._iFVF & EObjFVF.NORMAL) != 0;
                };

                Obj.prototype.readFaceInfo = function (s) {
                    //results of regexp matching
                    var pm;

                    if (this.hasTexcoords() && !this.hasNormals()) {
                        pm = s.match(Obj.VERTEX_UV_FACE_REGEXP);

                        regExpResultToFloatArray(pm, Obj.row, 0);

                        this._pVertexIndexes.push(Obj.row[0], Obj.row[2], Obj.row[4]);
                        this._pTexcoordIndexes.push(Obj.row[1], Obj.row[3], Obj.row[5]);
                    } else if (!this.hasTexcoords() && this.hasNormals()) {
                        pm = s.match(Obj.VERTEX_NORMAL_FACE_REGEXP);
                        akra.debug.assert(!akra.isNull(pm), "invalid line detected: <" + s + ">");

                        // if (!pm) {
                        //     this._isObjectHasNormals = false;
                        //     this._readFaceInfo(s);
                        //     return;
                        // }
                        regExpResultToFloatArray(pm, Obj.row, 0);
                        this._pVertexIndexes.push(Obj.row[0], Obj.row[2], Obj.row[4]);
                        this._pNormalIndexes.push(Obj.row[1], Obj.row[3], Obj.row[5]);
                    } else if (this.hasTexcoords() && this.hasNormals()) {
                        pm = s.match(Obj.VERTEX_UV_NORMAL_FACE_REGEXP);
                        akra.debug.assert(!akra.isNull(pm), "invalid line detected: <" + s + ">");
                        regExpResultToFloatArray(pm, Obj.row, 0);
                        this._pVertexIndexes.push(Obj.row[0], Obj.row[3], Obj.row[6]);
                        this._pTexcoordIndexes.push(Obj.row[1], Obj.row[4], Obj.row[7]);
                        this._pNormalIndexes.push(Obj.row[2], Obj.row[5], Obj.row[8]);
                    } else {
                        pm = s.match(/^f[\s]+([\d]+)[\s]+([\d]+)[\s]+([\d]+)[\s]*$/i);
                        akra.debug.assert(!akra.isNull(pm), "invalid line detected: <" + s + ">");
                        regExpResultToFloatArray(pm, Obj.row, 0);
                        this._pVertexIndexes.push(Obj.row[0], Obj.row[1], Obj.row[2]);
                    }
                };

                Obj.prototype.loadResource = function (sFilename, pOptions) {
                    if (typeof sFilename === "undefined") { sFilename = null; }
                    if (typeof pOptions === "undefined") { pOptions = null; }
                    var _this = this;
                    if (akra.isNull(sFilename)) {
                        sFilename = this.findResourceName();
                    }

                    if (this.isResourceLoaded()) {
                        akra.debug.warn("[OBJ::" + this.findResourceName() + "]", "obj model already loaded");
                        return false;
                    }

                    this.setFilename(sFilename);

                    this.notifyDisabled();
                    this.notifyUnloaded();

                    var pFile = akra.io.fopen(sFilename);

                    pFile.open(function (err, meta) {
                        //FIXME: setuop byteLength correctly..
                        (this)["_iByteLength"] = meta.size || 0;
                    });

                    pFile.read(function (pErr, sXML) {
                        if (!akra.isNull(pErr)) {
                            akra.logger.error(pErr);
                        }

                        _this.notifyRestored();

                        if (_this.parse(sXML, pOptions)) {
                            akra.debug.log("[OBJ::" + _this.findResourceName() + "]", "resource loaded");
                            _this.notifyLoaded();
                        }
                    });

                    return true;
                };
                Obj.VERTEX_REGEXP = /^v[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)([\s]+[-+]?[\d]*[\.|\,]?[\de-]*?)?[\s]*$/i;

                Obj.TEXCOORD_REGEXP = /^vt[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]*.*$/i;
                Obj.NORMAL_REGEXP = /^vn[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]*$/i;

                Obj.VERTEX_UV_FACE_REGEXP = /^f[\s]+([\d]+)\/([\d]*)[\s]+([\d]+)\/([\d]*)[\s]+([\d]+)\/([\d]*)[\s]*$/i;
                Obj.VERTEX_NORMAL_FACE_REGEXP = /^f[\s]+([\d]+)\/\/([\d]*)[\s]+([\d]+)\/\/([\d]*)[\s]+([\d]+)\/\/([\d]*)[\s]*$/i;
                Obj.VERTEX_UV_NORMAL_FACE_REGEXP = /^f[\s]+([\d]+)\/([\d]*)\/([\d]*)[\s]+([\d]+)\/([\d]*)\/([\d]*)[\s]+([\d]+)\/([\d]*)\/([\d]*)[\s]*$/i;

                Obj.DEFAULT_OPTIONS = {
                    shadows: true,
                    axis: {
                        x: { index: 0, inverse: false },
                        y: { index: 1, inverse: false },
                        z: { index: 2, inverse: false }
                    }
                };

                Obj.row = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                return Obj;
            })(pool.ResourcePoolItem);
            resources.Obj = Obj;
        })(pool.resources || (pool.resources = {}));
        var resources = pool.resources;
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
