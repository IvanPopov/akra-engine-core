

module.exports=function(fnCallback, sName,iSizeX,iSizeY,x,y,width,height,eType)
{
	var pBuf=new Uint8Array(width*height*3)
	//console.log(sName,iSizeX,iSizeY,x,y,width,height,eType);
	
	if(iSizeX==65536)
	{
		for(var i=0;i<width*height;i++)
		{
			pBuf[i*3+0]=255;
			pBuf[i*3+1]=255;
			pBuf[i*3+2]=255;
			
		}
		
	}
	else if(iSizeX==32768)
	{
		for(var i=0;i<width*height;i++)
		{
			pBuf[i*3+0]=255;
			pBuf[i*3+1]=255;
			pBuf[i*3+2]=0;
			
		}
		
	}
	else if(iSizeX==16384)
	{
		for(var i=0;i<width*height;i++)
		{
			pBuf[i*3+0]=255;
			pBuf[i*3+1]=0;
			pBuf[i*3+2]=255;
			
		}
		
	}
	else if(iSizeX==8192)
	{
		for(var i=0;i<width*height;i++)
		{
			pBuf[i*3+0]=0;
			pBuf[i*3+1]=255;
			pBuf[i*3+2]=255;
			
		}
		
	}
	else if(iSizeX==4096)
	{
		for(var i=0;i<width*height;i++)
		{
			pBuf[i*3+0]=0;
			pBuf[i*3+1]=0;
			pBuf[i*3+2]=255;
			
		}
	}
	else if(iSizeX==2048)
	{
		for(var i=0;i<width*height;i++)
		{
			pBuf[i*3+0]=255;
			pBuf[i*3+1]=0;
			pBuf[i*3+2]=0;
			
		}
		
	}
	else
	{
		for(var i=0;i<width*height;i++)
		{
			pBuf[i*3+0]=0;
			pBuf[i*3+1]=255;
			pBuf[i*3+2]=0;
			
		}
	}	
	
	fnCallback(null, pBuf);
};