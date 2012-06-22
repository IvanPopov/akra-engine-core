


function Collada(pEngine, sFilename) {
    Enum([
        STATE_UNKNOWN = 0x00,
        STATE_LOADED
    ], COLLADA_STATES, a.Collada);

    this._eState = a.Collada.STATE_UNKNOWN;
    this._fnCallback = null;

    

    if (sFilename) {
        this.load(sFilename);
    }
};

Collada.prototype.load = function (sFilename) {
    a.fopen(sFilename).read (function (sXMLData) {
        var pParser = new DOMParser();
        var pXMLRootNode = pParser.parseFromString(sXMLData, "application/xml");
        var pXMLCollada = pXMLRootNode.getElementsByTagName('COLLADA')[0];

        var begin = (new Date).getTime();
        var pSourceModel = a.xml2json(pXMLCollada).toObj();
        trace((new Date).getTime() - begin, 'ms needed for translating xml to json.');
        
        //if ()
     
    });
};

Collada.prototype.isLoaded = function () {
    return TEST_BIT(this._eFlags, a.Collada.STATE_LOADED);
};

Collada.prototype._event = function (eEvent) {
    this._fnCallback(eEvent, this);
};

PROPERTY(Collada, 'onload', null, function (fnCallback) {
    this._fnCallback = fnCallback;

    if (this.isLoaded()) {
        this._event(a.Collada.STATE_LOADED);
    }
});


a.Collada = Collada;