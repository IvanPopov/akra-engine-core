


function Collada(pEngine, sFilename) {
    Enum([
        STATE_UNKNOWN = 0x00,
        STATE_LOADED
    ], COLLADA_STATES, a.Collada);

    this._eState = a.Collada.STATE_UNKNOWN;
    this._fnCallback = null;

    this._pColladaRoot = null;

    //cache
    this._pCache = {};

    if (sFilename) {
        this.load(sFilename);
    }
};

Collada.prototype.load = function (sFilename) {
    var me = this;
    a.fopen(sFilename).read(function (sXMLData) {
        var pParser = new DOMParser();
        var pXMLRootNode = pParser.parseFromString(sXMLData, "application/xml");
        var pXMLCollada = pXMLRootNode;//.getElementsByTagName('COLLADA')[0];

        me._pColladaRoot = pXMLCollada;
        me._emitEvent(a.Collada.STATE_LOADED);
    });
};

Collada.prototype.isLoaded = function () {
    return TEST_BIT(this._eFlags, a.Collada.STATE_LOADED);
};

Collada.prototype._emitEvent = function (eEvent) {
    if (this._fnCallback) {
        this._fnCallback(eEvent, this);
    }
};

Collada.prototype.getMesh = function (sId) {
    if (this._pCache[sId]) {
        return this._pMeshes[sId];
    }

    var pMeshData = a.xml2json(this._pColladaRoot.getElementById(sId)).toObj().mesh;

    if (!pMeshData) {
        return this._pCache[sId] = null;
    }

    for (var i in pMeshData.source) {
        var pDecl = [];
        var pTechnique = pMeshData.source[i].technique_common;
        var pFloatArray = pMeshData.source[i].float_array

        debug_assert('#' + pFloatArray['@id'] === pTechnique.accessor['@source'],
            'accessor не пренадлежит данным в меше..');

        for (var j = 0; j < Number(pTechnique.accessor['@stride']); j++) {
            var pParam = pTechnique.accessor.param[j];
                //pDecl
            trace(pParam);
        };
    }

    return pMeshData;
};



PROPERTY(Collada, 'onload', null, function (fnCallback) {
    this._fnCallback = fnCallback;

    if (this.isLoaded()) {
        this._emitEvent(a.Collada.STATE_LOADED);
    }
});


a.Collada = Collada;