/**
 * @file
 * @author Ivan Popov
 * @email vantuziast@gmail.com
 */

/**
 * @ctor
 * Constructor
 */
function ShaderBlend (pEngine) {

    this._pEngine = pEngine;
    this._pDevice = pEngine.pDevice;

    this._pSet = [];
    this._pBreakers = [];
    this._pCompilied = [];


    this._sActivator = '';
}
;

ShaderBlend.prototype._prepareShaderFragment = function (id, pFrag, sPrefix) {
    var pBreakers = this._pBreakers;
    var i, j, n, tmp;

    var pFlags;
    var eType = (pFrag.type == a.Shader.VERTEX ? a.Shader.VERT : a.Shader.PIXL);

    pFrag.applyPrefix(sPrefix);
    pFrag.applyConstants();

    pFlags = pFrag.flags;
    for (i = 0; i < pFlags.length; ++i) {
        tmp = pFlags[i];
        n = tmp.size;
        if (n) {
            for (j = 0; j < n; ++j) {
                pBreakers.push([eType, tmp, j]);
            }
        }
        else {
            pBreakers.push([eType, tmp, null]);
        }
    }
};

ShaderBlend.prototype.appendShader = function (pShader) {

    var pSet = this._pSet;
    var pBreakers = this._pBreakers;

    var id = pShader.id = pSet.length;
    var sPrefix = 's' + id + '_';
    var pVertex, pPixel, pFlags;

    pBreakers.push([-1, id, pShader._sName]);
    pSet.push(pShader);

    pVertex = pShader.vertex;
    pPixel = pShader.pixel;

    this._prepareShaderFragment(id, pVertex, sPrefix);
    this._prepareShaderFragment(id, pPixel, sPrefix);

    /*
     //небольшой хак, чтобы избежать дублежа varying переменных
     for (i in pVarying) {
     if (this._pUsedVarying[i]) continue;
     this._sVaryingList += 'varying ' + pVarying[i] + ' ' + i + ';\n';
     this._pUsedVarying[i] = 1;
     }*/

    var sActivator = this.genEmptyActivator();
    for (var n = this._sActivator.length; n < sActivator.length; ++n) {
        this._sActivator += '0';
    }

    TRACE("Shader program '" + pShader.name + "' is loaded.");
};

ShaderBlend.prototype._buildProgram = function (sActivator) {
    var pCompilied = this._pCompilied;
    var pBreakers = this._pBreakers;
    var pSet = this._pSet;
    var pCur, eType;
    var pVertex, pPixel, pFlag, pVarys, pVary,
        pAttrs, pUnis, pAttr, pUni;
    var pDevice = this._pDevice;
    var pShader, pProgram;

    var i, k, len, id;

    var pCode = [
        [
            //vertex       a.Shader.VERT
            '', //global a.Shader.GLOB
            '', //decl   a.Shader.DECL
            '' //main   a.Shader.MAIN
        ],
        [
            //pixel        a.Shader.PIXL
            '', //global
            '', //decl
            '' //main
        ]
    ];

    pCompilied[sActivator] = pCur = [
        pDevice.createProgram(), //shader program
        {}, //a.Shader.ATTR
        {}, //a.Shader.UNI
        {}      //a.Shader.VARY
    ];

    for (i = 0, len = sActivator.length; i < len; ++i) {
        if (sActivator[i] != '0' && pBreakers[i]) {

            eType = pBreakers[i][0];
            if (eType < 0) { //not a shader flag
                id = pBreakers[i][1];
                pVertex = pSet[id].vertex;
                pPixel = pSet[id].pixel;

                //vertex attributes
                pAttrs = pVertex.attrs;
                for (k = 0; k < pAttrs.length; ++k) {
                    pAttr = pAttrs[k];
                    if (!pCur[a.Shader.ATTR][pAttr.name]) {
                        pCode[a.Shader.VERT][a.Shader.DECL] += pAttr.str() + '\n';
                        pCur[a.Shader.ATTR][pAttr.name] = pAttr;
                    }
                }
                //console.log('vertex attributes');
                //vertex uniforms
                pUnis = pVertex.uniforms;
                for (k = 0; k < pUnis.length; ++k) {
                    pUni = pUnis[k];
                    if (!pCur[a.Shader.UNI][pUni.name]) {
                        pCode[a.Shader.VERT][a.Shader.DECL] += pUni.str() + '\n';
                        pCur[a.Shader.UNI][pUni.name] = pUni;
                    }
                }
                //console.log('vertex uniforms');
                //vertex varyings
                pVarys = pVertex.varyings;
                for (k = 0; k < pVarys.length; ++k) {
                    pVary = pVarys[k];
                    if (!pCur[a.Shader.VARY][pVary.name]) {
                        pCode[a.Shader.VERT][a.Shader.GLOB] += 'varying ' + pVary.str() + '\n';
                        pCode[a.Shader.PIXL][a.Shader.GLOB] += 'varying ' + pVary.str() + '\n';
                        pCur[a.Shader.VARY][pVary.name] = pVary;
                    }
                }
                //console.log('vertex varyings');
                //pixel uniforms
                var pPixlUni = {};
                pUnis = pPixel.uniforms;
                for (k = 0; k < pUnis.length; ++k) {
                    pUni = pUnis[k];
                    if (!pCur[a.Shader.UNI][pUni.name] || !pPixlUni[pUni.name]) {
                        pCode[a.Shader.PIXL][a.Shader.DECL] += pUni.str() + '\n';
                        pCur[a.Shader.UNI][pUni.name] = pUni;
                        pPixlUni[pUni.name] = true;
                    }
                }

                //console.log('pixel uniforms');
                //pixel varyings
                pVarys = pPixel.varyings;
                for (k = 0; k < pVarys.length; ++k) {
                    pVary = pVarys[k];
                    if (!pCur[a.Shader.VARY][pVary.name]) {
                        pCode[a.Shader.PIXL][a.Shader.GLOB] += pVary.str() + '\n';
                        pCur[a.Shader.VARY][pVary.name] = pVary;
                    }
                }
                //console.log('pixel uniforms');
                //add vertex sections
                pCode[a.Shader.VERT][a.Shader.GLOB] += pVertex.globalCode;
                pCode[a.Shader.VERT][a.Shader.MAIN] += pVertex.mainCode;

                //add pixel section
                pCode[a.Shader.PIXL][a.Shader.GLOB] += pPixel.globalCode;
                pCode[a.Shader.PIXL][a.Shader.MAIN] += pPixel.mainCode;
            }
            else {
                pFlag = pBreakers[i][1];
                pCode[eType][a.Shader.GLOB] = pFlag.str(pBreakers[i][2]) +
                    '\n' + pCode[eType][a.Shader.GLOB];
            }
        }
    }

    pCur.push(this._finalCode(a.Shader.VERT, pCode[a.Shader.VERT]));
    pCur.push(this._finalCode(a.Shader.PIXL, pCode[a.Shader.PIXL]));

    pProgram = pCur[0];

    for (var n = 0; n < 2; ++n) {
        pShader = pDevice.createShader(n ? pDevice.FRAGMENT_SHADER :
                                           pDevice.VERTEX_SHADER);
        pDevice.shaderSource(pShader, pCur[n + 4]);
        pDevice.compileShader(pShader);

        if (!pDevice.getShaderParameter(pShader, pDevice.COMPILE_STATUS)) {
            if (1) {//a.isDebug
                //console.log(pCur);
                var pDbgWin = new a.DebugWindow('shader errors:');
                var pLines = pCur[n + 4].split('\n'), z = 1;
                pCur[n + 4] = '';
                for (var i in pLines) {
                    pCur[n + 4] += '\n' + (z < 10 ? '0' + z : z) + ' | ' + pLines[i];
                    z++;
                }
                pDbgWin.print('<div style="background: #FCC"><pre>' + pDevice.getShaderInfoLog(pShader) +
                                  '</pre></div>' + '<pre style="background-color: #EEE;">' + pCur[n + 4] +
                                  '</pre>');
            }
            else {
                error(pDevice.getShaderInfoLog(pShader));
            }
            return false;
        }

        pDevice.attachShader(pProgram, pShader);
    }

    pDevice.linkProgram(pProgram);

    for (var sName in pCur[2]) {
        pUni = pCur[2][sName];
        if (pUni.eClass == a.ParameterDesc.Class.STRUCT) {
            TODO('get uniforms location from struct unifroms');
        }
        else {
            pUni._pLocation = this._pDevice.getUniformLocation(pCur[0], sName);
        }
    }

    return pCur;

};


ShaderBlend.prototype.getUniformLocation = function (sName, sActivator) {
    sActivator = sActivator || this._sActivator;

    var pCur;
    if (!(pCur = this._pCompilied[sActivator])) {
        return null;
    }

    return (pCur[2][sName]? pCur[2][sName]._pLocation: -1);
}

ShaderBlend.prototype.uniformList = function (sActivator) {
    sActivator = sActivator || this._sActivator;

    var pCur;
    if (!(pCur = this._pCompilied[sActivator])) {
        return null;
    }

    return pCur[2];
}

ShaderBlend.prototype.program = function (sActivator) {
    sActivator = sActivator || this._sActivator;
    return this._pCompilied[sActivator][0];
}

ShaderBlend.prototype._finalCode = function (eType, pCode) {
    if (eType == a.Shader.VERT) {
        return (pCode[a.Shader.GLOB] + pCode[a.Shader.DECL] +
            '\nvoid main(void) {\nvec4 vertex = vec4(0., 0., 0., 0.);\n' +
            pCode[a.Shader.MAIN] + '\ngl_Position = vertex;\n}');
    }
    else {
        return ('#ifdef GL_ES\nprecision highp float;\n#endif\n' +
            pCode[a.Shader.GLOB] + pCode[a.Shader.DECL] +
            '\nvoid main(void) {\nvec4 color = vec4(0., 0., 0., 1.);\n' +
            pCode[a.Shader.MAIN] + '\ngl_FragColor = color;\n}');
    }
}

ShaderBlend.prototype.genEmptyActivator = function () {
    var pBreakers = this._pBreakers;
    var sActivator = '';
    for (var i = 0; i < pBreakers.length; ++i) {
        sActivator += '0';
    }
    return sActivator;
}

ShaderBlend.prototype.deactivate = function (sName, nValue) {
    TODO('deactivate [shader fragment / flag]');
}

ShaderBlend.prototype.activate = function (sName, nValue) {
    --nValue;

    var sActivator = this._sActivator;
    var pBreakers = this._pBreakers;

    for (var i = 0; i < pBreakers.length; ++i) {

        if (pBreakers[i][0] >= 0) { //is flag

            if (pBreakers[i][1]._sName == sName && ((nValue !== undefined &&
                pBreakers[i][2] == nValue) || nValue === undefined)) {
                sActivator = sActivator.replaceAt(i, '1');
            }
        }
        else if (!nValue) { //is shader
            if (pBreakers[i][2] == sName) {
                sActivator = sActivator.replaceAt(i, '1');
            }
        }

    }
    this._sActivator = sActivator;
};

ShaderBlend.prototype.hasUniform = function (sName, sActivator) {
    sActivator = sActivator || this._sActivator;

    var pCur;
    if (!(pCur = this._pCompilied[sActivator])) {
        return null;
    }

    return pCur[2][sName];
};

/**
 * Принудительная сборка программы.
 * @tparam String sActivator Шейдерный ключ.
 */
ShaderBlend.prototype.forcedAssemble = function (sActivator) {
    sActivator = sActivator || this._sActivator;

    var pCompilied = this._pCompilied;
    if (!pCompilied[sActivator]) {
        this._buildProgram(sActivator);
        return true;
    }

    return false;
}

ShaderBlend.prototype.useProgram = function (sActivator) {
    sActivator = sActivator || this._sActivator;

    var pCompilied = this._pCompilied;
    var pCur;

    if (!(pCur = pCompilied[sActivator])) {
        pCur = this._buildProgram(sActivator);
    }
    else {
        //TRACE('Шейдер с ключом ' + sActivator + ' уже собран.');
    }


    if (a.Shader.pLastShaderProgram !== pCur[0]) {
        this._pDevice.useProgram(pCur[0]);
    }

};

ShaderBlend.prototype.loadCollection = function (sServerUri, sCollection, fnCallback, sPath) {
    sPath = sPath || '';
    sPath += (sPath.length ? '/' : '');

    fnCallback = fnCallback || function (isOk, sErr) {
        if (!isOk) {
            error('Shader collection loading error.\n' + sErr);
        }
    };


    var pCollFile = new a.SynchroFile(sServerUri);
    var me = this;

    pCollFile.open(sCollection, function (e) {
        if (!a.SynchroFile.isPrimaryEvent(e)) {
            return;
        }

        if (e == a.SynchroFile.EVENT_FIRST_READING) {

            var pCollection = arguments[1];

            if (pCollection.type != "collection" ||
                pCollection.name === undefined) {

                warning("Unable to load the collection.");
                fnCallback(0);
            }


            var pShaderList = pCollection.data;
            var pCollData = new Array(pShaderList.length);

            var fnCheckFin = function () {
                for (var i = 0; i < pCollData.length; ++i) {
                    if (!pCollData[i]) {
                        return;
                    }
                }

                for (var i = 0; i < pCollData.length; ++i) {

                    me.appendShader((new a.Shader)
                                        .undump(new a.BinReader(pCollData[i])));
                }

                fnCallback(1);
            };

            for (var i = 0; i < pShaderList.length; ++i) {
                var pFile = new SynchroFile(sServerUri,
                                            a.SynchroFile.TYPE_ARRAY_BUFFER);
                var sShaderPath = (sPath.length ? sPath :
                    a.File.getPath(sCollection)) + pShaderList[i];

                pFile.i = i;
                pFile.open(sShaderPath, function (e) {

                    if (!a.SynchroFile.isPrimaryEvent(e)) {
                        return;
                    }

                    if (e == a.SynchroFile.EVENT_FIRST_READING) {
                        pCollData[this.i] = arguments[1];
                        fnCheckFin();
                    }
                    else if (e == a.SynchroFile.EVENT_FAILURE) {
                        fnCallback(0, 'Cannot load shader resource: ' +
                            sShaderPath + '.');
                    }

                })
            }
        }
        else if (e == a.SynchroFile.EVENT_FAILURE) {
            fnCallback(0, 'Cannot load shader collection resource: ' +
                sServerUri + sCollection + '.');
        }
    }, a.SynchroFile.FORMAT_JSON);
};

a.Shader.pLastShaderProgram = null;
a.ShaderBlend = ShaderBlend;