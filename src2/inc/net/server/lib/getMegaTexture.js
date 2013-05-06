var Canvas 	= require('canvas');
var Image 	= Canvas.Image;
var fs 		= require('fs');
var path 	= require('path');

var iMaxCountCanvas = 100;

var pImgMG = new Image;

//массив канвасов
var pCanvasMG = {};
//массив контекстов канвасов
var pCtx = {};
//даты последнего обращения к канвасу
var pDateCanvas = {}
var iArrayCanvasLen = 0;

//стек запросов на части картинок
var pStack = Array(6);
for (var i = 0; i < 6; i++) {
    pStack[i] = Array();
}



function deleteForCanvas(sName) {
    delete pCanvasMG[sName];
    delete pCtx[sName];
    delete pDateCanvas[sName];
}

//удаление кавасов после минуты не обращения к нему, раз в 10 секунд
function clearCanvasArray() {
    tNow = new Date();
    for (i in pCanvasMG) {
        if (tNow - pDateCanvas[i] > 60000) {
            deleteForCanvas(i);
            iArrayCanvasLen--;
        }
    }
}

setInterval(clearCanvasArray, 10000);

//очистка стека запросов каждые 5 секунд
var tUpdate = new Date();

function clearStack() {
    tNow = new Date();
    if (tNow - tUpdate > 5000) {
        pStack.length = 0;
        tUpdate = tNow;
    }
}

setInterval(processingStack, 1);

function fetchCanvasData(pCt, pParam, nBytePerCount) {
	var data = pCt.getImageData(pParam.x, pParam.y, pParam.width, pParam.height).data;
	//var cache = pCt.cache[pParam.x + "_" + pParam.y + "_" + pParam.width + "_" + pParam.height] || null;
    
    // if (cache) {
    // 	return cache;
    // }
   
	pBufMG = pCt.buffer = new Uint8Array(pParam.width * pParam.height * nBytePerCount);

    if (nBytePerCount == 3) {
        for (var i = 0, k = 0; i < data.length; i += 3, k += 4) {
            pBufMG[i] = data[k];
            pBufMG[i + 1] = data[k + 1];
            pBufMG[i + 2] = data[k + 2];
        }
    } else {
        for (var i = 0; i < data.length; i++) {
            pBufMG[i] = data[i];
        }
    }

    return pBufMG;
}

//обрабатывает очередь запросов
function processingStack() {
    var i;

    for (i = 0; i < 6; i++) {
        if (pStack[i].length != 0) {
            break;
        }
    }

    if (i == 6) {
        return;
    }

    var pParam = pStack[i].pop();

    nBytePerCount = 3;

    if (pParam.eType == 0x1908) {
        nBytePerCount = 4;
    }

    var pBufMG = null;
    var pCa, pCt;

    iImageNumberX = Math.floor(pParam.x / 1024);
    iImageNumberY = Math.floor(pParam.y / 1024);
    pParam.x %= 1024;
    pParam.y %= 1024;
    sCanvasName = "_" + pParam.iSizeX + "x" + pParam.iSizeY + "_" + iImageNumberX + "_" + iImageNumberY;



    if (!pCanvasMG[sCanvasName]) {

        if (iArrayCanvasLen > iMaxCountCanvas) {
            var nCount = 0
            for (i in pCanvasMG) {
                
                deleteForCanvas(i);
                iArrayCanvasLen--;
                nCount++;

                if (nCount > iMaxCountCanvas / 4) {
                    break;
                }
            }
        }

        iArrayCanvasLen++;
        pCanvasMG[sCanvasName] = new Canvas(1024, 1024);//pParam.iSizeX, pParam.iSizeY
        pCa = pCanvasMG[sCanvasName];
        pCtx[sCanvasName] = pCa.getContext('2d');
        pCt = pCtx[sCanvasName];
        //pCt.cache = {};
        pDateCanvas[sCanvasName] = new Date();
    } 
    else {
        pCt = pCtx[sCanvasName];
        pDateCanvas[sCanvasName] = new Date();

        //console.log("from buffer:: open canvas", sCanvasName/*, pBufMG*/);
        pParam.fnCallback(null, fetchCanvasData(pCt, pParam, nBytePerCount));
        
        return;
    }

    var src = path.normalize(__dirname + "/../../data/" + pParam.sName + "/" + pParam.iSizeX + "x" + pParam.iSizeY + "/diffuse/" + iImageNumberX + "_" + iImageNumberY + ".png");

    pImgMG.onload = function () {
        //console.log("Succes!!!",src,iSizeX,iSizeY,x,y,width,height);
        pCt.drawImage(pImgMG, 0, 0);
        
        pParam.fnCallback(null, fetchCanvasData(pCt, pParam, nBytePerCount));
    }

    pImgMG.onerror = function (err) {
        console.error(
        	err.message, 
        	"\n\tpath: " + src, 
        	"\n\tparams: " + pParam.iSizeX, pParam.iSizeY, pParam.x, pParam.y, pParam.width, pParam.height);
        pParam.fnCallback(err, null);
    }

    
    pImgMG.src = src;
}


/**
 * @param {Function} fnCallback Callback for remote procedure.
 * @param {String} sName Path to texture
 * @param {Number} iSizeX texture width.
 * @param {Number} iSizeY texture height.
 * @param {Number} x Read from.
 * @param {Number} y Read from.
 * @param {Number} width Read block with width.
 * @param {Number} height Read block with height.
 * @param {Number} eType GL format for responsed image block.
 */
module.exports = function (fnCallback, sName, iSizeX, iSizeY, x, y, width, height, eType) {
    // if (Math.random() * 10 - 5 < 0) {
    // 	return;
    // }
    
    //zero LOD level is 1024 x 1024
    if (iSizeX < 1024) iSizeX = 1024;
    if (iSizeY < 1024) iSizeY = 1024;

    var pParam = {};

    pParam.fnCallback = fnCallback;
    pParam.sName = sName;
    pParam.iSizeX = iSizeX;
    pParam.iSizeY = iSizeY;
    pParam.x = x;
    pParam.y = y;
    pParam.width = width;
    pParam.height = height;
    pParam.eType = eType;

    //current LOD levels
    iLod = Math.round(Math.log(Math.sqrt(iSizeX * iSizeY) / 1024) / Math.LN2);


    for (var i in pStack[iLod]) {
        var pObj = pStack[iLod][i]
        if (pObj.x == x && pObj.y == y && pObj.iSizeX == iSizeX && pObj.iSizeY == iSizeY && pObj.width == width && pObj.height == height && pObj.eType == eType) {
        	//texture already used
        	return;
        }
    }

    //no need LODS less then 256
    if (pStack[iLod].length > 1024) {
        pStack[iLod].splice(0, 256);
    }

    pStack[iLod].push(pParam);
};



// module.exports=function(fnCallback, sName, iSizeX, iSizeY, x, y, width, height, eType)
// {
// 	var pBuf=new Uint8Array(width*height*3);
// 	var iLevel = 0;
// 	//console.log(sName,iSizeX,iSizeY,x,y,width,height,eType);
	
// 	if(iSizeX==65536)
// 	{
// 		for(var i=0;i<width*height;i++)
// 		{
// 			pBuf[i*3+0]=255;
// 			pBuf[i*3+1]=255;
// 			pBuf[i*3+2]=255;
			
// 		}

// 		iLevel = 7;
		
// 	}
// 	else if(iSizeX==32768)
// 	{
// 		for(var i=0;i<width*height;i++)
// 		{
// 			pBuf[i*3+0]=255;
// 			pBuf[i*3+1]=255;
// 			pBuf[i*3+2]=0;
			
// 		}

// 		iLevel = 6;
		
// 	}
// 	else if(iSizeX==16384)
// 	{
// 		for(var i=0;i<width*height;i++)
// 		{
// 			pBuf[i*3+0]=255;
// 			pBuf[i*3+1]=0;
// 			pBuf[i*3+2]=255;
			
// 		}
// 		iLevel = 5;
// 	}
// 	else if(iSizeX==8192)
// 	{
// 		for(var i=0;i<width*height;i++)
// 		{
// 			pBuf[i*3+0]=0;
// 			pBuf[i*3+1]=255;
// 			pBuf[i*3+2]=255;
			
// 		}

// 		iLevel = 4;
		
// 	}
// 	else if(iSizeX==4096)
// 	{
// 		for(var i=0;i<width*height;i++)
// 		{
// 			pBuf[i*3+0]=0;
// 			pBuf[i*3+1]=0;
// 			pBuf[i*3+2]=255;
			
// 		}
// 		iLevel = 3;
// 	}
// 	else if(iSizeX==2048)
// 	{
// 		for(var i=0;i<width*height;i++)
// 		{
// 			pBuf[i*3+0]=190;
// 			pBuf[i*3+1]=0;
// 			pBuf[i*3+2]=0;
			
// 		}
// 		iLevel = 2;
// 	}
// 	// else if(iSizeX == 1024){
// 	// 	for(var i=0;i<width*height;i++)
// 	// 	{
// 	// 		pBuf[i*3+0]=127;
// 	// 		pBuf[i*3+1]=127;
// 	// 		pBuf[i*3+2]=0;
			
// 	// 	}
// 	// 	iLevel = 1;
// 	// }
// 	else
// 	{
// 		for(var i=0;i<width*height;i++)
// 		{
// 			pBuf[i*3+0]=0;
// 			pBuf[i*3+1]=255;
// 			pBuf[i*3+2]=0;
			
// 		}
// 		// console.log("i never must be here");
// 		iLevel = 1;
// 	}	
// 	// console.log(iLevel);
// 	fnCallback(null, pBuf);
// };