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
	this._pFont = pFont;
};

EXTENDS(Text3D,a.Sprite);

/**
 * @param sString строка с текстом
 */
Text3D.prototype.setText = function(sString){
	'use strict';
	for(var i=0;i<sString.length;i++){
		sString.charCodeAt(i);
	}
};

A_NAMESPACE(Text3D);