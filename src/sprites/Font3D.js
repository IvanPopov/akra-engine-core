/**
 * @file
 * @brief файл содержит класс Font3D и методы необходимые для растеризации шрифта
 * @author Igor Karateev
 * @email iakarateev@gmail.com
 */

/**
 * @ctor
 */
function Font3D (pEngine,iSize, sColor, sFontFamily, isBold, isItalic) {
    'use strict';
    A_CLASS;
    iSize = ifndef(iSize,12);
    sColor = ifndef(sColor,'#000000');
    sFontFamily = ifndef(sFontFamily,'times');
    isBold = ifndef(isBold,false);
    isItalic = ifndef(isItalic,false);

    this._isBold = isBold;
    this._isItalic = isItalic;

    this._sBold = null;
    this._sItalic = null;

    this._pLetterMap = {}; //карта, в которой хранятся соответствия между буквами и текстурными координатами;
    this._iLettersX = 0; //количество букв, которое лежит в текстуре по оси Х
    this._iLettersY = 0; //количество букв, которое лежит в текстуре по оси Y
    //////////////////////////////////////
    this._iFontSize = iSize;
    this._sFontSize = String(iSize) + 'px';
    //////////////////////////////////////
    if (sColor[0] != '#') {
        this._sFontColor = '#' + sColor;
    }
    else {
        this._sFontColor = sColor;
    }
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
    this._rasterize();
};

EXTENDS(Font3D,a.Texture);

Font3D.prototype._rasterize = function() {
    'use strict';

    var nLetters = 128;//пока только английские символы
    var iLettersX = this._iLettersX = Math.ceilingPowerOfTwo(Math.sqrt(nLetters));
    var iLettersY = this._iLettersY = Math.ceilingPowerOfTwo(nLetters/iLettersX);
    //домножаем на размер шрифта
    var iTextureSizeX = Math.ceil(iLettersX * this._iFontSize);
    var iTextureSizeY = Math.ceil(iLettersY * this._iFontSize); 
    trace(iLettersX,iLettersY,nLetters);
    
    var pTextCanvas = document.createElement('canvas');
    pTextCanvas.width  = iTextureSizeX;
    pTextCanvas.height = iTextureSizeY;
    var pContext2D = pTextCanvas.getContext('2d');

    pContext2D.fillStyle = this._sFontColor;

    var sFont = "";
    if(this._isBold){
        sFont += this._sBold + " ";
    }
    if(this._isItalic){
        sFont += this._sItalic + " ";
    }
    sFont += this._sFontSize + " " + this._sFontFamily
    pContext2D.font = sFont;

    for(var i=0;i<nLetters;i++){
        var sChar = String.fromCharCode(i);
        var iPositionX = (i%iLettersX)*this._iFontSize;
        var iPositionY = (Math.floor(i/iLettersX))*this._iFontSize;
        //trace(iPositionX,iPositionY);
        pContext2D.fillText(sChar,iPositionX,iPositionY,this._iFontSize);
    }

    var imageData = pContext2D.getImageData(0, 0, pTextCanvas.width, pTextCanvas.height);

    //this.flipY(true);
    this.createTexture(iTextureSizeX,iTextureSizeY,0,a.IFORMAT.RGBA8,a.ITYPE.UNSIGNED_BYTE,new Uint8Array(imageData.data));
    this.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
    this.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);

    this._generateLetterMap();
};

/**
 * генерируем карту соответствий букв и текстурных координат
 */
Font3D.prototype._generateLetterMap = function() {
    'use strict';
    var pLetterMap = this._pLetterMap;
    var nLetters = 128;//пока только английские буквы

    var iLettersX = this._iLettersX;
    var iLettersY = this._iLettersY

    for(var i=0;i<nLetters;i++){
        var sChar = String.fromCharCode(i);
        // if(sChar == '!'){
        //     trace('!',i,iLettersX,iLettersY,(i%iLettersX)/iLettersX,Math.floor(i/iLettersX)/iLettersY);
        // }
        pLetterMap[sChar] = [(i%iLettersX)/iLettersX,(Math.floor(i/iLettersX) - 0.75)/iLettersY];
    }
};

PROPERTY(Font3D,'letterMap',
    function(){
        'use strict';
        return this._pLetterMap;
    }
)

A_NAMESPACE(Font3D);