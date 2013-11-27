var pBuffers = {};
module.exports=function(fnCallback, sName, iSizeX, iSizeY, x, y, width, height, eType)
{	
	var sBuffer = width + "x" + height;
	var pBuf = pBuffers[sBuffer];
	
	if (!pBuf) {
		pBuf = pBuffers[sBuffer] = new Buffer(width * height * 3);
	}
	
	var iLevel = 0;
	//console.log(sName,iSizeX,iSizeY,x,y,width,height,eType);
	
	if(iSizeX==65536)
	{
		for(var i=0;i<width*height;i++)
		{
			pBuf[i*3+0]=255;
			pBuf[i*3+1]=255;
			pBuf[i*3+2]=255;
			
		}

		iLevel = 7;
		
	}
	else if(iSizeX==32768)
	{
		for(var i=0;i<width*height;i++)
		{
			pBuf[i*3+0]=255;
			pBuf[i*3+1]=255;
			pBuf[i*3+2]=0;
			
		}

		iLevel = 6;
		
	}
	else if(iSizeX==16384)
	{
		for(var i=0;i<width*height;i++)
		{
			pBuf[i*3+0]=255;
			pBuf[i*3+1]=0;
			pBuf[i*3+2]=255;
			
		}
		iLevel = 5;
	}
	else if(iSizeX==8192)
	{
		for(var i=0;i<width*height;i++)
		{
			pBuf[i*3+0]=0;
			pBuf[i*3+1]=255;
			pBuf[i*3+2]=255;
			
		}

		iLevel = 4;
		
	}
	else if(iSizeX==4096)
	{
		for(var i=0;i<width*height;i++)
		{
			pBuf[i*3+0]=0;
			pBuf[i*3+1]=0;
			pBuf[i*3+2]=255;
			
		}
		iLevel = 3;
	}
	else if(iSizeX==2048)
	{
		for(var i=0;i<width*height;i++)
		{
			pBuf[i*3+0]=190;
			pBuf[i*3+1]=0;
			pBuf[i*3+2]=0;
			
		}
		iLevel = 2;
	}
	// else if(iSizeX == 1024){
	// 	for(var i=0;i<width*height;i++)
	// 	{
	// 		pBuf[i*3+0]=127;
	// 		pBuf[i*3+1]=127;
	// 		pBuf[i*3+2]=0;
			
	// 	}
	// 	iLevel = 1;
	// }
	else
	{
		for(var i=0;i<width*height;i++)
		{
			pBuf[i*3+0]=0;
			pBuf[i*3+1]=255;
			pBuf[i*3+2]=0;
			
		}
		// console.log("i never must be here");
		iLevel = 1;
	}	
	// console.log(iLevel);
	fnCallback(null, pBuf);
};
