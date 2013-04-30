function TerrainROAM_SWEEP (pEngine)
{
	A_CLASS;
	this._pInnerRenderableObject=new a.RenderableObject(pEngine)
}
EXTENDS(TerrainROAM_SWEEP, a.TerrainROAM);



TerrainROAM_SWEEP.prototype.create = function (pRootNode, pHeightMap,worldExtents, iShift, iShiftX,iShiftY,sSurfaceTextures)
{
	var pMethod = this._pEngine.pDisplayManager.renderMethodPool().createResource(".terrain_sweep");
	this._pInnerRenderableObject.addRenderMethod(pMethod, ".terrain_sweep");


	var pEffect = this._pEngine.pDisplayManager.effectPool().createResource(".terrain_sweep");
	pEffect.create();
	pEffect.use("akra.system.terrain_sweep");
	pMethod.effect = pEffect;

	var pEngine=this._pEngine;
	var pBuffer = pEngine.pDisplayManager.vertexBufferPool().createResource(".VERTEXBUFFER_TERRAIN");
	debug_assert(pBuffer.create(0, FLAG(a.VBufferBase.RamBackupBit)),
		"Cannot create system vertex buffer");

	var pData = pBuffer.getEmptyVertexData(4, [VE_FLOAT2('POSITION')]);
	pData.setData((new Float32Array([-1,-1,-1,1,1,-1,1,1])), 'POSITION');
	this._pVertexDataSweep = pData;

	var bResult = TerrainROAM.prototype.create.call(this, pRootNode, pHeightMap,worldExtents, iShift, iShiftX,iShiftY,sSurfaceTextures);
	return bResult;
}

TerrainROAM_SWEEP.prototype.buildHeightAndNormalTables = function (pImageHightMap, pImageNormalMap) {
	var fHeight = 0;
	var iComponents = 4;
	this._pHeightTable = null;


	var iMaxY = this._iTableHeight;
	var iMaxX = this._iTableWidth;

	trace("Terrain HeightMap Size ", iMaxX, iMaxY);


	this._pHeightTable = new Array(iMaxX * iMaxY); //float

	var temp = new a.Texture(this._pEngine);

	// first, build a table of heights
	if (pImageHightMap.isResourceLoaded())
	{
		var iBitPerComponents=pImageHightMap.getBitPerComponents(0)

		this._v3fMapScale.z = this._v3fWorldSize.z / Math.pow(2,iBitPerComponents);


		if(iBitPerComponents>8&&pImageHightMap.getWidth()==iMaxX && pImageHightMap.getHeight()==iMaxY)
		{

			var pColor=new Uint32Array(4)
			if(pImageHightMap.isLumiance())
			{
				for (i = 0; i < iMaxY * iMaxX; i++)
				{
					pImageHightMap.getPixelLA(i%pImageHightMap.getWidth(),Math.floor(i/pImageHightMap.getWidth()),pColor)
					fHeight = pColor[0];
					fHeight = (fHeight * this._v3fMapScale.z) + this._pWorldExtents.fZ0;
					this._pHeightTable[i] = fHeight;
				}


			}
			else
			{
				for (i = 0; i < iMaxY * iMaxX; i++)
				{
					pImageHightMap.getPixelRGBA(i%pImageHightMap.getWidth(),Math.floor(i/pImageHightMap.getWidth()),pColor)
					fHeight = pColor[0];
					fHeight = (fHeight * this._v3fMapScale.z) + this._pWorldExtents.fZ0;
					this._pHeightTable[i] = fHeight;
				}
			}
		}
		else
		{
			if(iBitPerComponents>8)
			{
				warning("Потеря точности в карте высот из-за ресайза");
			}

			var pColorData = new Uint8Array(4 * iMaxY * iMaxX);
			temp.uploadImage(pImageHightMap);
			//###########################

			this.sweeping(temp)

			temp.resize(iMaxX, iMaxY);

			temp.getPixelRGBA(0, 0, iMaxX, iMaxY, pColorData);
			iComponents = temp.numElementsPerPixel;
			for (i = 0; i < iMaxY * iMaxX; i++) {
				fHeight = pColorData[i * iComponents + 0];
				fHeight = (fHeight * this._v3fMapScale.z) + this._pWorldExtents.fZ0;
				this._pHeightTable[i] = fHeight;
			}
		}
	}
	else {
		warning("Карта высот не загружена")
	}

	if (pImageNormalMap.isResourceLoaded()) {
		temp.uploadImage(pImageNormalMap);
	}
	else {
		warning("Карта высот не загружена")
	}

	this._pNormalMap = temp
};

TerrainROAM_SWEEP.prototype.sweeping = function(pTexHightMap)
{
	debug_assert(pTexHightMap, 'Cannot sweeping, because texture not created.');

	var pDevice = this._pEngine.pDevice;
	var pRenderer = this._pEngine.shaderManager();


	var pDestinationTexture = new a.Texture(this._pEngine);
	pDestinationTexture.createTexture(pTexHightMap.width, pTexHightMap.height, 0, a.IFORMATSHORT.RGBA, a.ITYPE.UNSIGNED_BYTE, [null]);
	pDestinationTexture.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
	pDestinationTexture.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);
	pDestinationTexture.applyParameter(a.TPARAM.MAG_FILTER, a.TFILTER.NEAREST);
	pDestinationTexture.applyParameter(a.TPARAM.MIN_FILTER, a.TFILTER.NEAREST);


	pTexHightMap.applyParameter(a.TPARAM.WRAP_S, a.TWRAPMODE.CLAMP_TO_EDGE);
	pTexHightMap.applyParameter(a.TPARAM.WRAP_T, a.TWRAPMODE.CLAMP_TO_EDGE);

	this._pInnerRenderableObject.switchRenderMethod(".terrain_sweep");

	var pVertexData = this._pVertexDataSweep;

	var pSnapshot = this._pInnerRenderableObject._pActiveSnapshot;

	pRenderer.switchRenderStage(a.RenderStage.DEFAULT);
	pRenderer.setViewport(0, 0, pDestinationTexture.width, pDestinationTexture.height);
	pRenderer.activateFrameBuffer();

	pRenderer.applyFrameBufferTexture(pDestinationTexture);
	this._pInnerRenderableObject.startRender();

	for (var i = 0; i < this._pInnerRenderableObject.totalPasses(); i++) {
		// trace("Pass #" + i);
		this._pInnerRenderableObject.activatePass(i);

		pSnapshot.applyTextureBySemantic("HEIGHT_MAP", pTexHightMap);
		pSnapshot.setParameterBySemantic("START_UV",[0.5,0.5]);
		pSnapshot.setParameterBySemantic("CELL_COUNT",[this._iSectorCountX,this._iSectorCountY]);
		pSnapshot.setParameterBySemantic("INV_TEXTURE_SIZES",[1./pTexHightMap.width,1./pTexHightMap.height]);
		pSnapshot.setParameterBySemantic("TERRAIN_SCALE",this._v3fWorldSize);
		pSnapshot.setParameterBySemantic("IS_X",1);
		pSnapshot.applyVertexData(pVertexData, a.PRIMTYPE.TRIANGLESTRIP);
		var pEntry = this._pInnerRenderableObject.renderPass();
		this._pInnerRenderableObject.deactivatePass();
	}

	this._pInnerRenderableObject.finishRender();
	pRenderer.deactivateFrameBuffer();
	//console.log("!")
	pRenderer.processRenderStage();
	pDevice.flush();
	//console.log("calcX")

	var pTempData = new Uint8Array(4 * pDestinationTexture.width * pDestinationTexture.height);
	pDestinationTexture.getPixelRGBA(0, 0, pDestinationTexture.width, pDestinationTexture.height, pTempData);
	var pSweepMapX= new Float32Array(pTempData.buffer);
	//console.log(pSweepMapX)

	pRenderer.switchRenderStage(a.RenderStage.DEFAULT);
	pRenderer.setViewport(0, 0, pDestinationTexture.width, pDestinationTexture.height);
	pRenderer.activateFrameBuffer();

	pRenderer.applyFrameBufferTexture(pDestinationTexture);
	this._pInnerRenderableObject.startRender();

	for (var i = 0; i < this._pInnerRenderableObject.totalPasses(); i++) {
		// trace("Pass #" + i);
		this._pInnerRenderableObject.activatePass(i);
		pSnapshot.applyTextureBySemantic("HEIGHT_MAP", pTexHightMap);
		pSnapshot.setParameterBySemantic("START_UV",[0.5,0.5]);
		pSnapshot.setParameterBySemantic("CELL_COUNT",[this._iSectorCountX,this._iSectorCountY]);
		pSnapshot.setParameterBySemantic("INV_TEXTURE_SIZES",[1./pTexHightMap.width,1./pTexHightMap.height]);
		pSnapshot.setParameterBySemantic("TERRAIN_SCALE",this._v3fWorldSize);
		pSnapshot.setParameterBySemantic("IS_X",0);

		pSnapshot.applyVertexData(pVertexData, a.PRIMTYPE.TRIANGLESTRIP);
		var pEntry = this._pInnerRenderableObject.renderPass();
		console.log(pEntry.pProgramm)
		this._pInnerRenderableObject.deactivatePass();
	}

	this._pInnerRenderableObject.finishRender();
	pRenderer.deactivateFrameBuffer();
	//console.log("!")
	pRenderer.processRenderStage();
	pDevice.flush();
	//console.log("calcY")

	pTempData = new Uint8Array(4 * pDestinationTexture.width * pDestinationTexture.height);
	pDestinationTexture.getPixelRGBA(0, 0, pDestinationTexture.width, pDestinationTexture.height, pTempData);
	var pSweepMapY= new Float32Array(pTempData.buffer);
	//console.log(pSweepMapY)
	//console.log("startDraw")

	var pCanvas = document.getElementById('canvasSWIP');
	var p2D = pCanvas.getContext("2d");
	var pDataCanvas = p2D.getImageData(0, 0, pDestinationTexture.width, pDestinationTexture.height);


	p2D.strokeStyle = "#00f"; //цвет линий
	p2D.lineWidth = 1;


	var xCellCount=16;
	var yCellCount=16;
	var fScale=2;
	pCanvas.width=pDestinationTexture.width*fScale;
	pCanvas.height=pDestinationTexture.height*fScale;

	p2D.beginPath();/*
	for(k=0;k<pDestinationTexture.height;k++)
	{
		for(l=0;l<pDestinationTexture.width;l++)
		{

			iColor=Math.abs(Math.round(pSweepMapX[pDestinationTexture.width*k+l]))///(pDestinationTexture.width/16)*255)+128;
			//iColor=Math.round(pSweepMapY[pDestinationTexture.width*k+l]/4*255);
			pDataCanvas.data[(pDestinationTexture.width*k+l)*4+0]=iColor;
			pDataCanvas.data[(pDestinationTexture.width*k+l)*4+1]=iColor;
			pDataCanvas.data[(pDestinationTexture.width*k+l)*4+2]=iColor;
			pDataCanvas.data[(pDestinationTexture.width*k+l)*4+3]=255;
		}
	}
	console.log(pSweepMapY[Math.round(pDestinationTexture.width*pDestinationTexture.height/2+pDestinationTexture.height/2)])
	p2D.putImageData(pDataCanvas, 0, 0);*/




	for( k=0;k<this._iSectorCountY;k++)
	{
		for(l=0;l<this._iSectorCountX;l++)
		{
			console.log(k,l)
			xStart=(pDestinationTexture.width/this._iSectorCountX)*l;
			xEnd  =(pDestinationTexture.width/this._iSectorCountX)*(l+1);
			yStart=(pDestinationTexture.height/this._iSectorCountY)*k;
			yEnd  =(pDestinationTexture.height/this._iSectorCountY)*(k+1);

			p2D.strokeRect(xStart*fScale, yStart*fScale, (xEnd-xStart)*fScale,(yEnd-yStart)*fScale);

			fXShift=(pDestinationTexture.width/this._iSectorCountX)*(l+0.5)*fScale;
			fYShift=(pDestinationTexture.height/this._iSectorCountY)*(k+0.5)*fScale;

			//for (var y=yStart;y<yEnd;y+=(yEnd-yStart)/(yCellCount))
			for (var y=yStart;y<yEnd;y+=pDestinationTexture.height/(this._iSectorCountY*yCellCount))
			{
				fXOld=pSweepMapX[Math.round(y*pDestinationTexture.width+xStart)]+fXShift;
				fYOld=pSweepMapY[Math.round(y*pDestinationTexture.width+xStart)]+fYShift;
				p2D.moveTo(fXOld,fYOld);
				for(var x=xStart; x<xEnd;x++)
				{
					fX=pSweepMapX[Math.round(y*pDestinationTexture.width+x)]+fXShift;
					fY=pSweepMapY[Math.round(y*pDestinationTexture.width+x)]+fYShift;

					p2D.lineTo(fX,fY);
				}
			}


			y=yEnd-1;
			fXOld=pSweepMapX[Math.round(y*pDestinationTexture.width+xStart)]+fXShift;
			fYOld=pSweepMapY[Math.round(y*pDestinationTexture.width+xStart)]+fYShift;
			p2D.moveTo(fXOld,fYOld);
			for(var x=xStart; x<xEnd;x++)
			{
				fX=pSweepMapX[Math.round(y*pDestinationTexture.width+x)]+fXShift;
				fY=pSweepMapY[Math.round(y*pDestinationTexture.width+x)]+fYShift;

				p2D.lineTo(fX,fY);
			}


			for (var x=xStart;x<xEnd;x+=pDestinationTexture.width/(this._iSectorCountX*xCellCount))
			{
				fXOld=pSweepMapX[Math.round(yStart*pDestinationTexture.width+x)]+fXShift;
				fYOld=pSweepMapY[Math.round(yStart*pDestinationTexture.width+x)]+fYShift;
				p2D.moveTo(fXOld,fYOld);
				for(var y=yStart; y<yEnd;y++)
				{
					fX=pSweepMapX[Math.round(y*pDestinationTexture.width+x)]+fXShift;
					fY=pSweepMapY[Math.round(y*pDestinationTexture.width+x)]+fYShift;
					p2D.lineTo(fX,fY);
				}
			}

			x=xEnd-1;
			fXOld=pSweepMapX[Math.round(x+yStart*pDestinationTexture.width)]+fXShift;
			fYOld=pSweepMapY[Math.round(x+yStart*pDestinationTexture.width)]+fYShift;
			p2D.moveTo(fXOld,fYOld);
			for(var y=yStart; y<yEnd;y++)
			{
				fX=pSweepMapX[Math.round(y*pDestinationTexture.width+x)]+fXShift;
				fY=pSweepMapY[Math.round(y*pDestinationTexture.width+x)]+fYShift;
				p2D.lineTo(fX,fY);
			}



		}
	}

	p2D.stroke();
	//console.log("endDraw")
	alert(1)
	return true;
}

a.TerrainROAM_SWEEP=TerrainROAM_SWEEP;