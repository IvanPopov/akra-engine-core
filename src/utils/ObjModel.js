/**
 * @file
 * @author Ivan Popov
 * @brief Loader for .obj files.
 */

//надо загружать в потоке!

//SPEC: http://www.martinreddy.net/gfx/3d/OBJ.spec

/**
 a = {};
 Include('sources/files/');
 Include('sources/math/Matrix.js');
 Include('sources/resources/pool/');
 Include('sources/resources/buffers/');
 Include('sources/model/');
 Include('sources/resources/ModelResource.js');
 Include('sources/utils/ObjModel.js');

 a.loadMeshFromOBJ(null, '/media/models/teapot.obj', 0, function () {

 });

 */

function ObjModel () {
    this._pVertices = [];
    this._pNormals = [];
    this._pFaces = [];
    this._pTextureCoords = [];
    this._pIndexes = [];
    this._pTextureIndexes = [];
    this._pNormalIndexes = [];
    this._isObjectHasUV = false;
    this._isObjectHasNormals = false;
    this._isPolyReaded = false;
    this._pModel = {};
}


ObjModel.prototype.load = function (sFilename, fnCallback) {
    if (!sFilename) {
        return;
    }

    var me = this;
    a.fopen(sFilename).read(function (pData) {
                                me.parse(pData);
                                if (!me._pIndexes.length) {
                                    me._fillIndexes();
                                }

                                if (!me._pNormals.length) {
                                    me.calcNormals();
                                }

                                me._isObjectHasNormals = true;

                                if (me._pTextureCoords.length) {
                                    me._isObjectHasUV = true;
                                }

                                fnCallback.call(me, true);
                            },
                            function () {
                                fnCallback.call(me, false);
                            });
};
ObjModel.prototype.hasNormals = function () {
    return this._isObjectHasNormals;
}
ObjModel.prototype.hasTexCoords = function () {
    return this._isObjectHasUV;
}
ObjModel.prototype.parse = function (pData) {
    var c, p = 0;

    pData = pData.split('\n');

    while (p != pData.length) {

        c = pData[p].charAt(0);
        switch (c) {
            case 'v':
                if (this._isPolyReaded) {
                    this._fillInObjectInfo();
                }
                this._readVertexInfo(pData[p]);
                break;
            case 'f':
                this._readFaceInfo(pData[p]);
                break;
        }

        p++;
    }
};

ObjModel.prototype._fillIndexes = function () {
    for (var i = 0; i < this._pVertices.length; ++i) {
        this._pIndexes[i] = i;
    }
};
ObjModel.prototype._readVertexInfo = function (s) {
    var ch = s.charAt(1), pm;
    //List of Vertices, with (x,y,z[,w]) coordinates, w is optional.
    if (ch == ' ') {
        pm = s.match(
            /^v[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)([\s]+[-+]?[\d]*[\.|\,]?[\de-]*?)?[\s]*$/i);
        this._correctIndex(pm);
        this._pVertices.push(pm[1], pm[2], pm[3]);
    }
    //Texture coordinates, in (u,v[,w]) coordinates, w is optional.
    else if (ch == 't') {
        pm = s.match(
            /^vt[\s]+([-+]?[\d]*[\.|\,][\d]*?)[\s]+([-+]?[\d]*[\.|\,][\d]*?)[\s]*.*$/i);
        this._correctIndex(pm);
        this._pTextureCoords.push(pm[1], pm[2]);
        this._isObjectHasUV = true;
    }
    //Normals in (x,y,z) form; normals might not be unit.	
    else if (ch == 'n') {
        pm = s.match(
            /^vn[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]*$/i);
        this._correctIndex(pm);
        this._pNormals.push(pm[1], pm[2], pm[3]);
        this._isObjectHasNormals = true;
    }

};
ObjModel.prototype._correctIndex = function (pm, d) {
    d = d || 0;
    for (var i = 1; i < pm.length; ++i) {
        if (pm[i]) {
            pm[i] = parseFloat(pm[i].replace(/,/g, ".")) - d;
        }
    }
};
ObjModel.prototype._readFaceInfo = function (s) {

    var pm;
    if (this._isObjectHasUV && !this._isObjectHasNormals) {
        pm = s.match(
            /^f[\s]+([\d]+)\/([\d]*)[\s]+([\d]+)\/([\d]*)[\s]+([\d]+)\/([\d]*)[\s]*$/i);
        this._correctIndex(pm, 1);
        this._pIndexes.push(pm[1], pm[3], pm[5]);
        this._pTextureIndexes.push(pm[2], pm[4], pm[6]);
    }
    else if (!this._isObjectHasUV && this._isObjectHasNormals) {
        pm = s.match(
            /^f[\s]+([\d]+)\/\/([\d]*)[\s]+([\d]+)\/\/([\d]*)[\s]+([\d]+)\/\/([\d]*)[\s]*$/i);
        if (!pm) {
            this._isObjectHasNormals = false;
            this._readFaceInfo(s);
            return;
        }
        this._correctIndex(pm, 1);
        this._pIndexes.push(pm[1], pm[3], pm[5]);
        this._pNormalIndexes.push(pm[2], pm[4], pm[6]);
    }
    else if (this._isObjectHasUV && this._isObjectHasNormals) {
        pm = s.match(
            /^f[\s]+([\d]+)\/([\d]*)\/([\d]*)[\s]+([\d]+)\/([\d]*)\/([\d]*)[\s]+([\d]+)\/([\d]*)\/([\d]*)[\s]*$/i);
        this._correctIndex(pm, 1);
        this._pIndexes.push(pm[1], pm[4], pm[7]);
        this._pTextureIndexes.push(pm[2], pm[5], pm[8]);
        this._pNormalIndexes.push(pm[3], pm[6], pm[9]);
    }
    else {
        pm = s.match(
            /^f[\s]+([\d]+)[\s]+([\d]+)[\s]+([\d]+)[\s]*$/i);
        this._correctIndex(pm, 1);

        this._pIndexes.push(pm[1], pm[2], pm[3]);
    }
    this._pFaces.push(pm.slice(1));
    this._isPolyReaded = true;
};
ObjModel.prototype._fillInObjectInfo = function (model) {

};

ObjModel.prototype.getVertices = function () {
    return this._pVertices;
};
ObjModel.prototype.getNormals = function () {
    return this._pNormals;
};
ObjModel.prototype.getIndexes = function () {
    return this._pIndexes;
};
ObjModel.prototype.getFaces = function () {
    return this._pFaces;
};

/*
ObjModel.prototype.updateData = function (vertices, normals, indexes) {
    this._pVertices = vertices;
    this._pIndexes = indexes;
    this._pNormals = normals;
};
*/
ObjModel.prototype.calcNormals = function (useSmoothing) {
    useSmoothing = useSmoothing || true;
    var v = new Array(3), p = new Vector3, q = new Vector3, i, j, n = new Vector3, k;

    for (i = 0; i < this._pVertices.length; ++i) {
        this._pNormals[i] = 0.;
    }

    for (i = 0; i < this._pIndexes.length; i += 3) {

        for (k = 0; k < 3; ++k) {

            j = this._pIndexes[i + k] * 3;
            v[k] = Vec3.create([this._pVertices[j], this._pVertices[j + 1], this._pVertices[j + 2]]);
        }

        Vec3.subtract(v[1], v[2], p);
        Vec3.subtract(v[0], v[2], q);

        Vec3.cross(p, q, n);
        Vec3.normalize(n);

        for (k = 0; k < 3; ++k) {
            j = this._pIndexes[i + k] * 3;
            this._pNormals[j] = n[0];
            this._pNormals[j + 1] = n[1];
            this._pNormals[j + 2] = n[2];
        }
    }

//    if (useSmoothing) {
//        for (i = 0; i < this._pIndexes.length; i += 3) {
//            for (k = 0; k < 3; ++k) {
//                j = this._pIndexes[i + k] * 3;
//                Vec3.set(this._pNormals[j], this._pNormals[j + 1], this._pNormals[j + 2], n);
//                Vec3.normalize(n);
//                this._pNormals[j] = n[0];
//                this._pNormals[j + 1] = n[1];
//                this._pNormals[j + 2] = n[2];
//                //a.log(this._pNormals[j] + " : " + this._pNormals[j + 1] + " : " + this._pNormals[j + 2]);
//            }
//        }
//    }

    this._isObjectHasNormals = true;
};

//FIXME: переписать создание меша из OBJ модели!!
a.loadMeshFromOBJ = function (pEngine, sFilename, eMeshOptions, fnCallback) {
    warn_assert(eMeshOptions == 0, 'loadMeshFromOBJ:: Опции еще не поддерживаются');
    var pModel = new a.ObjModel();
    pModel.load(sFilename, function (isLoaded) {
        if (!isLoaded) {
            fnCallback(null);
        }

        var name = a.pathinfo(sFilename).filename;
        var pMesh = new a.Mesh(pEngine);

        var sTempName = 'obj_model_' + name + '_' +  a.sid();

        var pVertexBuffer = pEngine.displayManager().vertexBufferPool().createResource(sTempName);
        var pIndexBuffer = pEngine.displayManager().indexBufferPool().createResource(sTempName);

        //console.log(sTempName);
        var pVertexDescription = [new a.VertexDeclaration(3, 'POSITION', a.DTYPE.FLOAT, a.DECLUSAGE.POSITION)];
        var pVertices = this.getVertices();
        var pIndexes = this.getIndexes();
        var pNormals = null;
        var pTexCoords = null;
        var iStride = 3;
        var count = pVertices.length / 3;
        var iElSize = a.getTypeSize(a.DTYPE.FLOAT);
        var nFaces = this.getFaces().length;

        if (this.hasNormals()) {
            pVertexDescription.push(new a.VertexDeclaration(3, 'NORMAL', a.DTYPE.FLOAT, a.DECLUSAGE.NORMAL));
            pNormals = this.getNormals();
            iStride += 3;
        }

        if (this.hasTexCoords()) {
            pVertexDescription.push(new a.VertexDeclaration(2, 'TEXCOORD', a.DTYPE.FLOAT, a.DECLUSAGE.TEXCOORD));
            pTexCoords = this.getTexCoords();
            iStride += 2;
        }

        if (!this.hasTexCoords()) {
            pVertexDescription.push(new a.VertexDeclaration(2, 'TEXCOORD', a.DTYPE.FLOAT, a.DECLUSAGE.TEXCOORD));
            pTexCoords = [];
            for (var i = 0; i < count / 100; ++ i) {
                for (var j = 0; j < 100; ++ j) {
                    pTexCoords.push(i / (count / 100));
                    pTexCoords.push(j / 100);
                }
            }
            iStride += 2;
        }


        var pData = new Float32Array(count * iStride);
        var i, j, n;

        for (i = 0, n = 0; i < count; ++ i) {
            for (var j = 0; j < 3; ++ j) {
                pData[n] = pVertices[i * 3 + j]; ++ n;
            }

            if (pNormals) {
                for (j = 0; j < 3; ++ j) {
                    pData[n] = pNormals[i * 3 + j]; ++ n;
                }
            }

            if (pTexCoords) {
                for (j = 0; j < 2; ++ j) {
                    pData[n] = pTexCoords[i * 3 + j]; ++ n;
                }
            }
        };
        //console.log(, iStride * iElSize, count * (iStride * iElSize), (new Float32Array(pData)).length);
        pVertexBuffer.create(count, iStride * iElSize, FLAG(a.VertexBuffer.RamBackupBit), pData);
        pVertexBuffer.setVertexDescription(pVertexDescription);
        /*
        var iShift = 0;

        pVertexBuffer.create(count, iStride * iElSize, FLAG(a.VertexBuffer.RamBackupBit), null);

        pVertexBuffer.setData(new Float32Array(pVertices), iShift, 3 * iElSize);
        iShift += 3 * iElSize;

        if (pNormals) {
            pVertexBuffer.setData(new Float32Array(pNormals), iShift, 3 * iElSize);
            iShift += 3 * iElSize;
        }

        if (pTexCoords) {
            pVertexBuffer.setData(new Float32Array(pTexCoords), iShift, 2 * iElSize);
        } */


        pIndexBuffer.create(a.PRIMTYPE.TRIANGLESTRIP, pIndexes.length, FLAG(a.IndexBuffer.RamBackupBit), pIndexes, 2);

        pMesh._nFaces = nFaces;
        pMesh._nVertices = count;
        pMesh._eOptions = eMeshOptions;
        pMesh._pVertexBuffer = pVertexBuffer;
        pMesh._pIndexBuffer = pIndexBuffer;
        pMesh._pVertexDeclaration = pVertexDescription;
        pMesh._pAreaTable = [new a.MeshArea(0, 0, nFaces, 0, count)];
        pMesh._nBytesPerVertex = iStride * iElSize;
        //console.log(pMesh);
        //throw null;

        fnCallback(pMesh);
    });
};

a.createFrameFromOBJMesh = function (pMesh, sName) {
    var pFrame = new a.Frame(sName);
    var pMeshContainer = new a.MeshContainer;
    pMeshContainer.create(sName, new a.MeshData(a.MESHDATATYPE.MESH, pMesh), null, null, null);

    pFrame.pMeshContainer = pMeshContainer;
    return pFrame;
};

a.ObjModel = ObjModel;

