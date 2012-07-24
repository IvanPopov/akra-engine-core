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

    this._isMonospace = true;
    this._nFontWidth = -1; //ширина шрифта имеет силу только для моноспейсовых шрифтов, иначе -1

    this._pFontMetrics = null;//объект содержащий метрику шрифта

    this._pLetterMap = {}; //карта, в которой хранятся соответствия между буквами и текстурными координатами;
    this._nLettersX = 0; //количество букв, которое лежит в текстуре по оси Х
    this._nLettersY = 0; //количество букв, которое лежит в текстуре по оси Y

    this._nTotalFontSize = 0; //полный размер шрифта (от высшей точки самого высокого знака до самой нижней точки ничнего)
                                //он больше полного размера шрифта
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
    else{
        this._sBold = 'normal';
    }
    //////////////////////////////////////
    if (this._isItalic) {
        this._sItalic = 'italic';
    }
    else{
        this._sItalic = 'normal';
    }
    //////////////////////////////////////

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

PROPERTY(Font3D,'fontSize',
    function(){
        'use strict';
        return this._nFontSize;
    }
);

PROPERTY(Font3D,'totalFontSize',
    function(){
        'use strict';
        return this._nTotalFontSize;
    }
);

PROPERTY(Font3D,'fontWidth',
    function(){
        'use strict';
        return this._nFontWidth;
    }
);

PROPERTY(Font3D,'isMonospace',
    function(){
        'use strict';
        return this._isMonospace;
    }
);

PROPERTY(Font3D,'context',
    function(){
        'use strict';
        return this._pContext;
    }
);

PROPERTY(Font3D,'fontMetrics',
    function(){
        'use strict';
        return this._pFontMetrics;
    }
);

Font3D.prototype._rasterize = function() {
    'use strict';

    var pLetterMap = this._pLetterMap;

    var nLetters = 128;//пока только английские символы
    
    var pTextCanvas = document.createElement('canvas');
    //document.body.appendChild(pTextCanvas);
    var pContext2D = this._pContext =pTextCanvas.getContext('2d');

    pContext2D.fillStyle = this._sFontColor;

    var sFont = "";
    sFont += this._sItalic + " ";
    sFont += this._sBold + " ";
    sFont += this._sFontSize + " ";
    sFont += this._sFontFamily;

    pContext2D.font = sFont;

    var pFontMetrics = this._pFontMetrics = this._getFontMetrics(this._sItalic,this._sBold,this._nFontSize,this._sFontFamily);
    this._nTotalFontSize = pFontMetrics.fontMetrics.maxHeight;

    trace(pFontMetrics);

    this._monospaceTest();
    var pTextureSizes = this._defineTextureSizes();
    if(pTextureSizes.nTextureWidth == -1 || pTextureSizes.nTextureHeight == -1){
        return;
    }

    var nTextureWidth = pTextureSizes.nTextureWidth;
    var nTextureHeight = pTextureSizes.nTextureHeight;

    ////////////set the sizes of the canvas/////
    pTextCanvas.width = nTextureWidth;
    pTextCanvas.height = nTextureHeight;
    pContext2D.font = sFont;//снова выставляем шрифт так как он слетает
    pContext2D.textBaseline = 'top';//y в fillText соответствует выравниванию верхнему краю
    pContext2D.textAlignment = 'start';
    ////////////////////////////////////////////
    
    var nVerticalStep = Math.ceilingPowerOfTwo(this._nTotalFontSize);
    var nLineNumber = pTextureSizes.nTextureHeight/nVerticalStep;
    var j=0;
    var nStartIndex;
    var nCurrentLineWidth;

    var relativeWidth;
    var relativeHeight = this._nTotalFontSize/nTextureHeight;

    for(var i=0;i<nLineNumber;i++){
        nCurrentLineWidth = 0;
        nStartIndex = j;

        var iPositionY = i*nVerticalStep;

        for(j=nStartIndex;j<nLetters;j++){

            var sChar = String.fromCharCode(j);

            var iPositionX = nCurrentLineWidth;
            var iCenterOffsetX = -pFontMetrics.lettersMetrics[sChar].left;//так как некоторые буквы заезжают за левый край,
                                                                        //то такое смещение должно решить эту проблему;
            
            var nWidth = pFontMetrics.lettersMetrics[sChar].width;
            relativeWidth = (nWidth-1)/nTextureWidth;

            nCurrentLineWidth += nWidth;
            if(nCurrentLineWidth > nTextureWidth){
                j--;
                break;
            }
            pContext2D.fillText(sChar,iPositionX + iCenterOffsetX,iPositionY,nWidth);
            pLetterMap[sChar] = [iPositionX/nTextureWidth,iPositionY/nTextureHeight, relativeWidth, relativeHeight];
        }
        if(j == nLetters){
            break;
        }
    }

    var pImageData = pContext2D.getImageData(0, 0, pTextCanvas.width, pTextCanvas.height);

    //this.flipY(true);
    this.createTexture(nTextureWidth,nTextureHeight,0,a.IFORMAT.RGBA8,a.ITYPE.UNSIGNED_BYTE,new Uint8Array(pImageData.data));
    // this.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.NEAREST);
    // this.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.NEAREST);
    this.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
    this.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);
};

Font3D.prototype._getFontMetrics = function(sStyle,sWeight,nSize,sFontFamily) {
    'use strict';
    if(arguments.length < 4){
        error('not enough arguments in function getFontMetrics');
        return;
    }

    var sFont = sStyle + " " + sWeight + " " + nSize + "px" + " " + sFontFamily;

    var pCanvas = document.createElement('canvas');
    //document.body.appendChild(pCanvas);
    pCanvas.width = 2.*nSize; //растеризуем по одной букве
    pCanvas.height = 2.*nSize;//вдвое больших размеров должно хватить
    var pContext2D = this._pContext =pCanvas.getContext('2d');
    pContext2D.font = sFont;
    pContext2D.textBaseline = 'top';//y в fillText соответствует выравниванию верхнему краю
    pContext2D.textAlign = 'start';

    var nOffsetX = Math.ceil(nSize/2.);//чтобы буква рисовалась примерно в центре
    var nOffsetY = Math.ceil(nSize/2.);

    var nLetters = 128;//пока только английские символы

    var pLettersMetrics = {};

    var nWidth;
    var nHeight;
    var nMaxLeft,nMaxRight,nMaxTop,nMaxBottom;
    for(var i=0;i<nLetters;i++){
        var sChar = String.fromCharCode(i);
        nWidth = pContext2D.measureText(sChar).width;
        nHeight = nSize;

        nMaxLeft = 0;
        nMaxRight = nWidth-1;

        nMaxTop = 0;
        nMaxBottom = 0;

        if(nWidth == 0){
            //непечатные символы
            pLettersMetrics[sChar] = {'left' : 0,'top' : 0,'right' : 0, 'bottom' : 0, 'width' : 0, 'height' : 0};
            continue;
        }
        else{
            pLettersMetrics[sChar] = {'left' : nMaxLeft,'top' : nMaxTop,'right' : nMaxRight, 'bottom' : nMaxBottom,
             'width' : nMaxRight - nMaxLeft + 1, 'height' : nMaxBottom - nMaxTop + 1};
        }
        pContext2D.fillText(sChar,nOffsetX,nOffsetY);//рисуем в центре канваса 
        var pImageData = pContext2D.getImageData(0, 0, pCanvas.width, pCanvas.height);
        for(var iY=0;iY<pCanvas.height;iY++){
            for(var iX=0;iX<pCanvas.width;iX++){
                var alpha = pImageData.data[4*(iY*pCanvas.width + iX) + 3];//альфа компонента
                if(alpha != 0){
                    var iRealX = iX - nOffsetX;
                    var iRealY = iY - nOffsetY;

                    /**
                     * так как выравнивание выставлено top, то
                     * nMaxTop всегда 0
                     */
                    if(iRealX < nMaxLeft){
                        nMaxLeft = iRealX;
                    }
                    else if(iRealX > nMaxRight){
                        nMaxRight = iRealX;
                    }
                    else if(iRealY > nMaxBottom){
                        nMaxBottom = iRealY;
                    }
                    if(sChar == 's'){
                        if(alpha < 1.)
                        trace('non 1');
                    }
                }
            }
        }
        pLettersMetrics[sChar].left = nMaxLeft;
        pLettersMetrics[sChar].right = nMaxRight;
        pLettersMetrics[sChar].top = nMaxTop;
        pLettersMetrics[sChar].bottom = nMaxBottom;
        pLettersMetrics[sChar].width = nMaxRight - nMaxLeft + 1;
        pLettersMetrics[sChar].height = nMaxBottom - nMaxTop + 1;
        pContext2D.clearRect(0, 0, pCanvas.width, pCanvas.height);  
    }

    nMaxRight = 0;
    nMaxBottom = 0;
    nMaxLeft = 0;
    nMaxTop = 0;

    for(var sChar in pLettersMetrics){
        var pMetrics = pLettersMetrics[sChar];
        if(pMetrics.right > nMaxRight){
            nMaxRight = pMetrics.right;
        }
        if(pMetrics.left < nMaxLeft){
            nMaxLeft = pMetrics.left;
        }
        if(pMetrics.bottom > nMaxBottom){
            nMaxBottom = pMetrics.bottom;
        }
        if(pMetrics.top < nMaxTop){
            nMaxTop = pMetrics.top;
        }
    }
    var pFontMetrics = {'maxLeft' : nMaxLeft, 'maxTop' : nMaxTop,'maxRight' : nMaxRight, 'maxBottom' : nMaxBottom,
     'maxWidth' : nMaxRight - nMaxLeft + 1, 'maxHeight' : nMaxBottom - nMaxTop + 1};
    return {'lettersMetrics' : pLettersMetrics,'fontMetrics' : pFontMetrics};
};

Font3D.prototype._monospaceTest = function() {
    'use strict';
    var nBaseWidth = this._pFontMetrics.fontMetrics.maxWidth;

    var pLettersMetrics = this._pFontMetrics.lettersMetrics;
    for(var sChar in pLettersMetrics){
        if(pLettersMetrics[sChar].width != 0 && pLettersMetrics[sChar].width != nBaseWidth){
            this._isMonospace = true;
        }
    }

    if(this._isMonospace){
        this._nFontWidth = nBaseWidth;
    }
};

Font3D.prototype._defineTextureSizes = function(){
    'use strict';
    var nMaxTextureSize = a.info.graphics.maxTextureSize(this._pEngine.getDevice());
    var nLetters = 128;//пока только английские символы

    var nFontTotalWidth = 0;

    var pLettersMetrics = this._pFontMetrics.lettersMetrics;

    for(var sChar in pLettersMetrics){
        nFontTotalWidth += pLettersMetrics[sChar].width;
    }

    var nTextureWidth = Math.ceilingPowerOfTwo(nFontTotalWidth); //размеры текстуры кратны двойке, для того чтобы ставить линейные фильтры
    var nTextureHeight = Math.ceilingPowerOfTwo(this._nFontSize);
    var nVerticalStep = nTextureHeight;

    while(nTextureWidth > nMaxTextureSize){
        nTextureWidth /= 2;
        nTextureHeight *=2;
    }

    if(nTextureWidth < 1. || nTextureHeight > nMaxTextureSize){
        error("слишком большой размер шрифта для растеризации");
        return {'nTextureWidth' : -1,'nTextureHeight' : -1};
    }

    //проверяем влезет ли в текущий размер текстуры весь текст
    
    var nLineNumber = nTextureHeight/nVerticalStep;
    var j = 0;
    var nStartIndex;
    var nCurrentLineWidth;
    for(var i=0;i<nLineNumber;i++){
        nCurrentLineWidth = 0;
        nStartIndex = j;
        for(j=nStartIndex;j<nLetters;j++){
            var sChar = String.fromCharCode(i);
            nCurrentLineWidth += pLettersMetrics[sChar].width;
            if(nCurrentLineWidth > nTextureWidth){
                j--;
                break;
            }
        }
        if(j == nLetters){
            break;
        }
    }
    if(j<nLetters){
        nTextureHeight*=2;
        //этого должно хватить, так как размер изначально площадь текстуры была такой чтобы все влезло
        //поэтому такого увеличения размера точно должно хватить
        if(nTextureHeight > nMaxTextureSize){
            return {'nTextureWidth' : -1,'nTextureHeight' : -1};
        }
    }
    return {'nTextureWidth' : nTextureWidth,'nTextureHeight' : nTextureHeight};
};

A_NAMESPACE(Font3D);