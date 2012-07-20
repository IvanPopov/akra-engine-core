/**
 * @file
 * @brief файл содержит класс Font3D и методы необходимые для растеризации шрифта
 * @author Igor Karateev
 * @email iakarateev@gmail.com
 */

/**
 * @ctor
 */
function Font3D (pEngine, nSize, sFontFamily, isBold, isItalic) {
    'use strict';
    A_CLASS;
    nSize = ifndef(nSize,12);
    sFontFamily = ifndef(sFontFamily,'times');
    isBold = ifndef(isBold,false);
    isItalic = ifndef(isItalic,false);

    this._isBold = isBold;
    this._isItalic = isItalic;

    this._sBold = null;
    this._sItalic = null;

    this._pLetterMap = {}; //карта, в которой хранятся соответствия между буквами и текстурными координатами;
    this._nLettersX = 0; //количество букв, которое лежит в текстуре по оси Х
    this._nLettersY = 0; //количество букв, которое лежит в текстуре по оси Y
    //////////////////////////////////////
    this._nFontSize = nSize;
    this._sFontSize = String(nSize) + 'px';
    //////////////////////////////////////
    
    //////////////////////////////////////
    this._sFontFamily = sFontFamily;
    //////////////////////////////////////
    if (this._isBold) {
        this._sBold = 'bold';
    }
    //////////////////////////////////////
    if (this._isItalic) {
        this._sItalic = 'italic';
    }
    //////////////////////////////////////
    //
    this._pContext = null;//2d конетекст необходимый для того чтобы измерать тест, написанный шрифтом
    this._rasterize();
};

EXTENDS(Font3D,a.Texture);

PROPERTY(Font3D,'letterMap',
    function(){
        'use strict';
        return this._pLetterMap;
    }
);

PROPERTY(Font3D,'size',
    function(){
        return this._nFontSize;
    }
);

PROPERTY(Font3D,'context',
    function(){
        return this._pContext;
    }
);

Font3D.prototype._rasterize = function() {
    'use strict';

    var pLetterMap = this._pLetterMap;

    var nLetters = 128;//пока только английские символы
    var nLettersX = this._nLettersX = Math.ceilingPowerOfTwo(Math.sqrt(nLetters));
    var nLettersY = this._nLettersY = Math.ceilingPowerOfTwo(nLetters/nLettersX);
    //домножаем на размер шрифта
    var nTextureSizeX = Math.ceil(nLettersX * this._nFontSize);
    var nTextureSizeY = Math.ceil(nLettersY * this._nFontSize); 
    //trace(iLettersX,iLettersY,nLetters);
    
    var pTextCanvas = document.createElement('canvas');
    pTextCanvas.width  = nTextureSizeX;
    pTextCanvas.height = nTextureSizeY;
    var pContext2D = this._pContext =pTextCanvas.getContext('2d');

    pContext2D.fillStyle = this._sFontColor;

    var sFont = "";
    if(this._isBold){
        sFont += this._sBold + " ";
    }
    if(this._isItalic){
        sFont += this._sItalic + " ";
    }
    sFont += this._sFontSize + " black";

    pContext2D.font = sFont;
    

    for(var i=0;i<nLetters;i++){
        var sChar = String.fromCharCode(i);

        var metrics = pContext2D.measureText(sChar);
        trace(sChar,metrics);

        var relativeWidth = metrics.width/nTextureSizeX;

        var iPositionX = (i%nLettersX)*this._nFontSize;
        var iPositionY = (Math.floor(i/nLettersX))*this._nFontSize;
        //trace(iPositionX,iPositionY);
        pContext2D.fillText(sChar,iPositionX,iPositionY,this._nFontSize);
        //заполняем карту соответствий
        pLetterMap[sChar] = [(i%nLettersX)/nLettersX,(Math.floor(i/nLettersX) - 0.75)/nLettersY,/*1./this._nLettersX*/relativeWidth,1./this._nLettersY];
        
    }
    var str = 'black';
    var metrics = pContext2D.measureText(str);
    trace(str,metrics);

    var imageData = pContext2D.getImageData(0, 0, pTextCanvas.width, pTextCanvas.height);

    //this.flipY(true);
    this.createTexture(nTextureSizeX,nTextureSizeY,0,a.IFORMAT.RGBA8,a.ITYPE.UNSIGNED_BYTE,new Uint8Array(imageData.data));
    this.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
    this.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);
};

A_NAMESPACE(Font3D);