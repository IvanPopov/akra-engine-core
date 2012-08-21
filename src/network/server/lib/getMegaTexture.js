module.exports=function(sName,iSizeX,iSizeY,x,y,width,height,eType)
{
	var pBuf=new Uint8Array(width*height*3)
	if(iSizeX>32000)
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
	
	return pBuf;
};