
#include "util/testutils.ts"
#include "akra.ts"

module akra{
	

	test("img tests", () => {
		var pEngine:IEngine=createEngine();
		var pRsMg:IResourcePoolManager=pEngine.getResourceManager();
		console.log("=cerate resouces=>>");
		var pImg:IImg=pRsMg.createImg("img");
		var pTex:webgl.WebGLInternalTexture=<webgl.WebGLInternalTexture>pRsMg.createTexture("tex");
		console.log("=cerate resouces=<<");
		//shouldBeTrue("create");
		//ok(isDefAndNotNull(pImg));

		var fnDraw:Function=function(isResult)
		{
			


			var iX:uint;
			var iY:uint;
			var pCanvas: HTMLCanvasElement;
			var pDiv:HTMLDivElement;
			var pInnerDiv:HTMLDivElement;
			var pContext:CanvasRenderingContext2D;
			var pImageData:ImageData;
			var pData:Uint8Array;
			var pColor:IColor=new Color();
			var iMap;

			
			console.log(pImg.width>0,pImg.height>0,pImg.numMipMaps)
			
			pDiv=<HTMLDivElement>document.createElement("div");			
			pDiv=<HTMLDivElement>document.body.appendChild(pDiv);
			pDiv.style.position="relative";
			pDiv.style.margin="5px";

			pCanvas=<HTMLCanvasElement>document.createElement("canvas");		
			pCanvas=<HTMLCanvasElement>pDiv.appendChild(pCanvas);

			pInnerDiv=<HTMLDivElement>document.createElement("div");			
			pInnerDiv=<HTMLDivElement>pDiv.appendChild(pInnerDiv);
			pInnerDiv.style.position="absolute";
			pInnerDiv.style.left="0";
			pInnerDiv.style.top="0";
			pInnerDiv.style.fontWeight="bold";
			pInnerDiv.style.color="#FF0000"
			pInnerDiv.innerHTML="Image";

			pCanvas.width=pImg.width;
			pCanvas.height=pImg.height;
			pContext = <CanvasRenderingContext2D>pCanvas.getContext('2d');			
			pImageData=pContext.getImageData(0, 0, pCanvas.width, pCanvas.height);
			pData=pImageData.data;


			for(iY=0;iY<pImg.height;iY++)
			{
				for(iX=0;iX<pImg.width;iX++)
				{
					pImg.getColorAt(pColor,iX,iY);
					
					pData[(iY*pImg.width+iX)*4+0]=pColor.r*255;
					pData[(iY*pImg.width+iX)*4+1]=pColor.g*255;
					pData[(iY*pImg.width+iX)*4+2]=pColor.b*255;
					pData[(iY*pImg.width+iX)*4+3]=pColor.a*255;	
					
				}
			}
			pContext.putImageData(pImageData, 0, 0);
			shouldBeTrue("load image");
			console.log("load image");




			pTex.loadImage(pImg);
			var pPixBuffer:webgl.WebGLPixelBuffer=<webgl.WebGLPixelBuffer>pTex.getBuffer();
			
	
			var pPixBox:IPixelBox=new pixelUtil.PixelBox(pPixBuffer.width,pPixBuffer.height,1,EPixelFormats.A8B8G8R8);
			var iSizeInBytes: int = pixelUtil.getMemorySize(pPixBox.width, pPixBox.height, 1, pPixBox.format);
			pPixBox.data=new Uint8Array(iSizeInBytes);



			pPixBuffer.blitToMemory(pPixBox);

			pDiv=<HTMLDivElement>document.createElement("div");			
			pDiv=<HTMLDivElement>document.body.appendChild(pDiv);
			pDiv.style.position="relative";
			pDiv.style.margin="5px";

			pCanvas=<HTMLCanvasElement>document.createElement("canvas");		
			pCanvas=<HTMLCanvasElement>pDiv.appendChild(pCanvas);

			pInnerDiv=<HTMLDivElement>document.createElement("div");			
			pInnerDiv=<HTMLDivElement>pDiv.appendChild(pInnerDiv);
			pInnerDiv.style.position="absolute";
			pInnerDiv.style.left="0";
			pInnerDiv.style.top="0";
			pInnerDiv.style.fontWeight="bold";
			pInnerDiv.style.color="#FF0000"
			pInnerDiv.innerHTML="Texture";


			pCanvas.width=pPixBox.width;
			pCanvas.height=pPixBox.height;
			pContext = <CanvasRenderingContext2D>pCanvas.getContext('2d');			
			pImageData=pContext.getImageData(0, 0, pCanvas.width, pCanvas.height);
			pData=pImageData.data;

			

			for(iY=0;iY<pPixBox.height;iY++)
			{
				for(iX=0;iX<pPixBox.width;iX++)
				{
					
					pPixBox.getColorAt(pColor,iX,iY);
					pData[(iY*pPixBox.width+iX)*4+0]=pColor.r*255;
					pData[(iY*pPixBox.width+iX)*4+1]=pColor.g*255;
					pData[(iY*pPixBox.width+iX)*4+2]=pColor.b*255;
					pData[(iY*pPixBox.width+iX)*4+3]=pColor.a*255;	
					
				}
			}
			pContext.putImageData(pImageData, 0, 0);

			console.log("load texture");

			ok(isResult && pImg.width>0 && pImg.height>0);

		}
		pImg.load("data/logo_ABGR.dds",fnDraw);

		


	});
}