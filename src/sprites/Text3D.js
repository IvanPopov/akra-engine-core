/**
 * @file
 * @brief реализация поддержки двумерных скриптов в трехмерном пространстве
 * @author Igor Karateev
 * @email iakarateev@gmail.com
 */

/**
 * @ctor
 */
function Text3D(pEngine,pFont){
	'use strict';
	A_CLASS;

	STATIC(pDrawRoutine,DrawRoutineText3D);

	this._initializeRenderMethod();

	this._pFont = pFont;
	this._v4fBackgroundColor = new Vec4(0.);
	this._v4fFontColor = new Vec4(0.);

	this._fDistanceMultiplier = 1.;

	this._nLineQuantity = 0;
	this._nLineLength = 0;
	this._nPixelLineLingth = 0;

	this.setGeometry(2,2);
	//this.setProgram(statics.pTextProg);
	this.drawRoutine = statics.pDrawRoutine;
};

EXTENDS(Text3D,a.Sprite);

PROPERTY(Text3D,'backgroundColor',
	function(){
		'use strict';
		return this._v4fBackgroundColor;
	},
	function(v4fBackgroundColor){
		'use strict';
		this._v4fBackgroundColor.set(v4fBackgroundColor);
	}
);

PROPERTY(Text3D,'fontColor',
	function(){
		'use strict';
		return this._v4fFontColor;
	},
	function(v4fFontColor){
		'use strict';
		this._v4fFontColor.set(v4fFontColor);
	}
);

PROPERTY(Text3D,'fixedSize',
	function(){
		'use strict';
		return (this._fDistanceMultiplier == 0.) ? true : false;
	},
	function(isFixed){
		'use strict';
		this._fDistanceMultiplier = (isFixed) ? 0. : 1.;
	}
);

Text3D.prototype._initializeRenderMethod = function() {
	'use strict';
	
	var pEngine = this._pEngine;

	var pMethod = pEngine.pDisplayManager.renderMethodPool().findResource(".render_text3d");
	if(!pMethod){
		pMethod = pEngine.pDisplayManager.renderMethodPool().createResource(".render_text3d");

		this.addRenderMethod(pMethod, ".render_text3d");
    	this.switchRenderMethod(".render_text3d");

    	var pEffect = pEngine.pDisplayManager.effectPool().createResource(".render_text3d");

    	pEffect.create();
	    pEffect.use("akra.system.text3d");
	    pEffect.use("akra.system.prepareForDeferredShading");

	    pMethod.effect = pEffect;
	}
	else{
		this.addRenderMethod(pMethod, ".render_text3d");
		this.switchRenderMethod(".render_text3d");
	} 
};

/**
 * @param sString строка с текстом
 */
Text3D.prototype.setText = function(sString){
	'use strict';
	var pFont = this._pFont;
	//trace('is Monospace',pFont.isMonospace);
	var pLetterMap = pFont.letterMap;
	var pFontMetrics = pFont.fontMetrics;
	var pMeasureContext = pFont.context;
	var nLineLength = 0;
	var nMaxLineLength = 0;
	var nPixelLength = 0;
	var nMaxPixelLength = 0;

	var nLineQuantity = 1;

	var pLinesInfo = [];

	for(var i=0;i<sString.length;i++){
		var sChar = sString[i];
		if(sChar == '\n'){

			nMaxLineLength = (nLineLength > nMaxLineLength) ? nLineLength : nMaxLineLength;
			nMaxPixelLength = (nPixelLength > nMaxPixelLength) ? nPixelLength : nMaxPixelLength;
			pLinesInfo.push({'nLetters' : nLineLength, 'nPixelLength' : nPixelLength});


			nLineLength = 0;
			nPixelLength = 0;
			nLineQuantity++;
		}
		else{
			nLineLength++;
			//длина в пикселях
			nPixelLength += pFontMetrics.lettersMetrics[sChar].typographicalWidth;
		}
	}

	nMaxLineLength = (nLineLength > nMaxLineLength) ? nLineLength : nMaxLineLength;
	nMaxPixelLength = (nPixelLength > nMaxPixelLength) ? nPixelLength : nMaxPixelLength;
	pLinesInfo.push({'nLetters' : nLineLength, 'nPixelLength' : nPixelLength});

	this._nLineQuantity = nLineQuantity;
	this._nLineLength = nMaxLineLength;
	this._nPixelLineLingth = nMaxPixelLength;


	var fAveragePixelsWidthPerLetter = nMaxPixelLength/nMaxLineLength;


	//веделяем память под все данные,
	//т.е указатели на строки и на данные в строках,
	//которая чудесным образом совпадает с длинной строки + 1 (+1 так как в начальной строке нет \n)
	
	var nTotalRequiredData = (sString.length + 1)
			+ nLineQuantity*nMaxLineLength //хранится инфа, 
			+ (sString.length - nLineQuantity + 1);

	var pStringData = new Float32Array(4*nTotalRequiredData);

	// var nOffset = nLineQuantity*4;
	
	// var nLine = 0;//номер линии (отсчет с нуля)
	// var nStartDataOffset = nLineQuantity;//номер откуда начинаются данные первой линии

	// var sChar;


	var nCurrentIndex = 0;//указывает на текущую букву
	var nStringDataOffset = nLineQuantity;
	var nLetterInfoOffset = nLineQuantity + nMaxLineLength*nLineQuantity;

	for(var i=0;i<pLinesInfo.length;i++){
		var pLine = pLinesInfo[i];
		var nCurrentPixelLength = 0;
		pStringData[4*i    ] = nStringDataOffset;
		pStringData[4*i + 1] = nLetterInfoOffset;
		pStringData[4*i + 2] = pLine.nPixelLength;


		for(var j=0;j<nMaxLineLength;j++){
			if(j<pLine.nLetters){
				var sChar = sString[nCurrentIndex];	
				var pLetterMetrics = pFontMetrics.lettersMetrics[sChar];
				//trace(sChar,pLetterMetrics,nMaxLineLength);
				var nTypographicalWidth = pLetterMetrics.typographicalWidth;

				var nStartPosition = Math.floor(nCurrentPixelLength/fAveragePixelsWidthPerLetter);
				var nEndPosition = Math.floor((nCurrentPixelLength 
											+ nTypographicalWidth - 1)/fAveragePixelsWidthPerLetter);

				var fPixelStartPosition = nCurrentPixelLength%fAveragePixelsWidthPerLetter;
				var fPixelEndPosition = (nCurrentPixelLength + nTypographicalWidth - 1)
											%fAveragePixelsWidthPerLetter;

				//trace(sChar,fPixelStartPosition,fPixelEndPosition,nTypographicalWidth,nCurrentPixelLength);

				var nCurrentPosition = nStartPosition;

				var nPositions = nEndPosition - nStartPosition + 1;
				//trace('positions',nPositions,'start',nStartPosition,'end',nEndPosition);
				var nLetterStartPosition = 0;
				var nLetterEndPosition = 0;
				var nStartIndex = 0;
				if(fPixelStartPosition != 0){
					var nCurrentDataPosition = nLineQuantity 
						+ i*nMaxLineLength + nStartPosition;
					if(pStringData[4*nCurrentDataPosition + 1] != 0){
						nStartIndex = 1;
						nLetterStartPosition = fAveragePixelsWidthPerLetter - fPixelStartPosition;
					}
				}
				nLetterEndPosition = 
					(nLetterStartPosition + fAveragePixelsWidthPerLetter < nTypographicalWidth) ?
						nLetterStartPosition + fAveragePixelsWidthPerLetter : nTypographicalWidth;

				for(var k=nStartIndex;k < nPositions;k++){
					var nCurrentDataPosition = nLineQuantity 
						+ i*nMaxLineLength + nStartPosition + k;

					//trace(nLetterStartPosition,nLetterEndPosition,nCurrentDataPosition);

					pStringData[4*nCurrentDataPosition    ] = j;
					pStringData[4*nCurrentDataPosition + 1] = nTypographicalWidth;
					pStringData[4*nCurrentDataPosition + 2] = nLetterStartPosition;
					pStringData[4*nCurrentDataPosition + 3] = nLetterEndPosition;
					
					nLetterStartPosition += fAveragePixelsWidthPerLetter;
					nLetterEndPosition = 
					(nLetterStartPosition + fAveragePixelsWidthPerLetter < nTypographicalWidth) ?
						nLetterStartPosition + fAveragePixelsWidthPerLetter : nTypographicalWidth;

				}

				//заполняем данные о букве

				var pLetterMetrics = pFontMetrics.lettersMetrics[sChar];
				var pLetterData = pLetterMap[sChar];
				nCurrentDataPosition = nLetterInfoOffset + 2*j;

				for(var k=0;k<4;k++){
					pStringData[4*nCurrentDataPosition + k] = pLetterData[k];
				}

				nCurrentDataPosition++;
				pStringData[4*nCurrentDataPosition    ] = pLetterMetrics.typographicalWidth;
				pStringData[4*nCurrentDataPosition + 1] = pLetterMetrics.left;
				pStringData[4*nCurrentDataPosition + 2] = pLetterMetrics.right;


				nCurrentPixelLength += nTypographicalWidth;

				nCurrentIndex++;
			}
			else{



				var nStartPosition = Math.ceil(nCurrentPixelLength/fAveragePixelsWidthPerLetter);
				var fPixelStartPosition = nCurrentPixelLength%fAveragePixelsWidthPerLetter;
				// if(fPixelStartPosition != 0){
				// 	nStartPosition++;
				// 	nCurrentPixelLength = nStartPosition*fAveragePixelsWidthPerLetter;
				// }

				var nCurrentDataPosition = nLineQuantity + 
						i*nMaxLineLength + nStartPosition;

				pStringData[4*nCurrentDataPosition] = -1;

				//trace('else',i,j,nCurrentDataPosition);

				nCurrentPixelLength += fAveragePixelsWidthPerLetter;//так данные о буквах идут по 2 vec4
			}
		}

		nStringDataOffset += nMaxLineLength;
		nLetterInfoOffset += pLine.nLetters*2;
		nCurrentIndex++;//пропускаем \n
	}


	// var pIndex = new Float32Array(4);
	// for(var i=0;i<4;i++){
	// 	pIndex[i] = i;
	// }

	var pTextData = this._pRenderData.getData('STRING_DATA');

	if (pTextData) {
		pTextData.setData(pStringData, 'STRING_DATA');
	}
	else {
		this._pRenderData.allocateData(VE_VEC4('STRING_DATA'), pStringData);
	}
	// this._pRenderData.allocateIndex(VE_FLOAT('INDEX1'),pIndex);
	// this._pRenderData.index(this._pRenderData.getDataLocation('STRING_DATA'),'INDEX1');
	//trace(pStringData);
};

Text3D.prototype.setDistanceMultiplier = function(fMultiplier) {
	'use strict';
	if(fMultiplier < 0){
		err("значение множителя не может быть меньше нуля");
		return;
	}
	this._fDistanceMultiplier = fMultiplier;
};

A_NAMESPACE(Text3D);

function DrawRoutineText3D(pSnapshot){
	'use strict';

	//text unifoms

	pSnapshot.setParameterBySemantic('LINE_LENGTH',this._nLineLength);
	pSnapshot.setParameterBySemantic('LINE_QUANTITY',this._nLineQuantity);
	pSnapshot.setParameterBySemantic('START_INDEX',this._pRenderData.getDataLocation('STRING_DATA')/4.);

	pSnapshot.setParameterBySemantic('SPRITE_PIXEL_SIZES',[this._nPixelLineLingth,
		this._pFont.fontMetrics.fontMetrics.height*this._nLineQuantity]);

	//set screen parameters (ограничивают максимальный размер текста на экране размером шрифта)
	pSnapshot.setParameterBySemantic('CANVAS_SIZE',[this._pEngine.pCanvas.width,this._pEngine.pCanvas.height]);
	pSnapshot.setParameterBySemantic('FONT_SIZE',this._pFont.totalFontSize);
	pSnapshot.setParameterBySemantic('DISTANCE_MULTIPLIER',this._fDistanceMultiplier);

	//set font colors
	pSnapshot.setParameterBySemantic('BACKGROUND_COLOR',this._v4fBackgroundColor);
	pSnapshot.setParameterBySemantic('FONT_COLOR',this._v4fFontColor);
	//
	pSnapshot.applyTextureBySemantic("FONT_TEXTURE", this._pFont);
	pSnapshot.setParameterBySemantic("TEXT_DATA",this._pEngine.spriteManager()._pDataFactory.buffer);

}