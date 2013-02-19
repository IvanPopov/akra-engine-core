var Canvas = require('canvas')
var Image = Canvas.Image
var fs = require('fs');

var iMaxCountCanvas=100;

var pImgMG = new Image;

//массив канвасов
var pCanvasMG={};
//массив контекстов канвасов
var pCtx = {};
//даты последнего обращения к канвасу
var pDateCanvas={}
var iArrayCanvasLen=0;

//стек запросов на части картинок
var pStack=Array(6);
for(var i=0;i<6;i++)
{
	pStack[i]=Array();
}



function deleteForCanvas(sName)
{
	delete pCanvasMG[sName];
	delete pCtx[sName] ;
	delete pDateCanvas[sName];
}

//удаление кавасов после минуты не обращения к нему, раз в 10 секунд
function clearCanvasArray()
{
	tNow=new Date();
	for (i in pCanvasMG)
	{
		if (tNow-pDateCanvas[i]>60000)
		{
		deleteForCanvas(i);
		iArrayCanvasLen--;
		}
	}
}
setInterval(clearCanvasArray,10000);

//очистка стека запросов каждые 5 секунд
var tUpdate=new Date();
function clearStack()
{
	tNow=new Date();
	if(tNow-tUpdate>5000)
	{
		pStack.length=0;
		tUpdate=tNow;
		return	
	}
}

setInterval(processingStack,1);

//обрабатывает очередь запросов
function processingStack()
{
	var i;

	for(i=0;i<6;i++)
	{ 
		if(pStack[i].length!=0)
		{
			break;
		}
	}

	if(i==6)
	{
		return;
	}

	var pParam=pStack[i].pop();
	
	nBytePerCount=3;

	if(pParam.eType==0x1908)
	{
		nBytePerCount=4;
	}

	var pBufMG=new Uint8Array(pParam.width*pParam.height*nBytePerCount);
	var pCa,pCt;

	iImageNumberX=Math.floor(pParam.x/1024);
	iImageNumberY=Math.floor(pParam.y/1024);
	pParam.x%=1024;
	pParam.y%=1024;
	sCanvasName="_"+pParam.iSizeX+"x"+pParam.iSizeY+"_"+iImageNumberX+"_"+iImageNumberY;


	
	if (!pCanvasMG[sCanvasName])
	{

		if (iArrayCanvasLen>iMaxCountCanvas)
		{
			var nCount=0
			for (i in pCanvasMG)
			{
				deleteForCanvas(i);
				iArrayCanvasLen--;
				nCount++;
				if(nCount> iMaxCountCanvas/4)
				{
					break;
				}
			}

		}

		iArrayCanvasLen++;
		pCanvasMG[sCanvasName]=new Canvas(pParam.iSizeX,pParam.iSizeY);
		pCa=pCanvasMG[sCanvasName];
		pCtx[sCanvasName]=pCa.getContext('2d');
		pCt=pCtx[sCanvasName];
		pDateCanvas[sCanvasName]=new Date();

	}
	else
	{
		pCt=pCtx[sCanvasName];
		pDateCanvas[sCanvasName]=new Date();
		var data = pCt.getImageData(pParam.x,pParam.y,pParam.width,pParam.height).data;
		if( nBytePerCount==3)
		{
			for(var i =0,k=0; i<data.length;i+=3,k+=4)
			{
				pBufMG[i]=data[k];
				pBufMG[i+1]=data[k+1];
				pBufMG[i+2]=data[k+2];			
			}
		}
		else
		{
			for(var i =0; i<data.length;i++)
			{
				pBufMG[i]=data[i];						
			}
		}
		//console.log("open canvas",sCanvasName,pBufMG)
		pParam.fnCallback(pBufMG)
		return;
	}

	pImgMG.onload=function()
	{
		//console.log("Succes!!!",src,iSizeX,iSizeY,x,y,width,height);
		pCt.drawImage(pImgMG,0, 0);
	  var data = pCt.getImageData(pParam.x,pParam.y,pParam.width,pParam.height).data;
		if( nBytePerCount==3)
		{
			for(var i =0,k=0; i<data.length;i+=3,k+=4)
			{
				pBufMG[i]=data[k];
				pBufMG[i+1]=data[k+1];
				pBufMG[i+2]=data[k+2];			
			}
		}
		else
		{
			for(var i =0; i<data.length;i++)
			{
				pBufMG[i]=data[i];						
			}
		}
		//console.log("open image",sCanvasName,pBufMG)
		pParam.fnCallback(pBufMG)

	}
	
	pImgMG.onerror=function(err)
	{
		console.log("Error!!!",src, pParam.iSizeX,pParam.iSizeY, pParam.x,pParam.y, pParam.width,pParam.height);
		throw err;
	}

	var src="/home/sc07kvm/servers/"+pParam.sName+"/"+pParam.iSizeX+"x"+pParam.iSizeY+"/diffuse/"+iImageNumberX+"_"+iImageNumberY+".png"
	//console.log("open image src");
	pImgMG.src = src;	


}



module.exports=function(fnCallback,sName,iSizeX,iSizeY,x,y,width,height,eType)
{
	var pParam={};
	pParam.fnCallback=fnCallback;
	pParam.sName=sName;
	pParam.iSizeX=iSizeX;
	pParam.iSizeY=iSizeY;
	pParam.x=x;
	pParam.y=y;
	pParam.width=width;
	pParam.height=height;
	pParam.eType=eType;

	iLod=Math.round(Math.log(Math.sqrt(iSizeX*iSizeY)/1024)/Math.LN2)
	
	for( var i in pStack[iLod])
	{
		var pObj=pStack[iLod][i]
		if (pObj.x==x && pObj.y==y && pObj.iSizeX==iSizeX && pObj.iSizeY==iSizeY &&
			pObj.width==width && pObj.height==height &&  pObj.eType	== eType)
			return;
	}	
	
	if(pStack[iLod].length>1024)
	{
		pStack[iLod].splice(0,256);
	}
	
	pStack[iLod].push(pParam);
	return;

	nBytePerCount=3;

	if(eType==0x1908)
	{
		nBytePerCount=4;
	}

	var pBufMG=new Uint8Array(width*height*nBytePerCount);


	pImgMG.onload=function()
	{
		//console.log("Succes!!!",src,iSizeX,iSizeY,x,y,width,height);
		pCanvasMG.width=pImgMG.width;
		pCanvasMG.height=pImgMG.height;	  	
		pCtx.drawImage(pImgMG,0, 0);
	  	var data = pCtx.getImageData(x,y,width,height).data;
		if( nBytePerCount==3)
		{
			for(var i =0,k=0; i<data.length;i+=3,k+=4)
			{
				pBufMG[i]=data[k];
				pBufMG[i+1]=data[k+1];
				pBufMG[i+2]=data[k+2];			
			}
		}
		else
		{
			for(var i =0; i<data.length;i++)
			{
				pBufMG[i]=data[i];						
			}
		}
		fnCallback(pBufMG)

	}
	
	pImgMG.onerror=function(err)
	{
		console.log("Error!!!",src,iSizeX,iSizeY,x,y,width,height);
		throw err;
	}

	var src="/home/sc07kvm/servers/"+sName+"/"+iSizeX+"x"+iSizeY+".png"
	pImgMG.src = src;	
};
