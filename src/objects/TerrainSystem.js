/**
 * @file
 * @brief Terrain class.
 * @author aldore
 * @email svhost@inbox.ru
 **/


/**
 * @property Terrain()
 * Конструктор класса Terrain
 * @memberof Timer
 **/


/**
 * Terrain Class
 * @ctor
 * Constructor of Terrain class
 * @param pDevice указатель на девайс который будет использует этот объект
 **/




function Terrain (pEngine) {

    this._pEngine = pEngine;
    this._pDevice = pEngine.pDevice;

    this._pRootNode = null;  //указатель на корень графа сцены

    this._pWorldExtents = new a.Rect3d();
    this._v3fWorldSize = new Vec3();
    this._v3fMapScale = new Vec3();
    this._iSectorCountX;  //количество секций по иксу
    this._iSectorCountY;  //количество секций по игрику
    this._pSectorArray = null; //массив подчиненный секций


	this._pDataFactory = new a.RenderDataBuffer(this._pEngine);
	this._pDataFactory.dataType = a.RenderData;
	this._pDataFactory.setup(a.RenderDataBuffer.VB_READABLE);

	this._v2fSectorSize = new Vec2();

    this._iSectorShift;
    this._iSectorUnits; //Количество секторов по осям
    this._iSectorVerts;

    this._iTableWidth; //размер карты высот
    this._iTableHeight; //размер карты высот
    this._pHeightTable = null;  //Таблица(карта высот)
    this._pv3fNormalTable = null; //Таблица нормалей

	this._pMegaTexures = null; //отоброжаемые куски текстуры

	this._fScale = 1.33;
	this._fLimit = 0.03;


};

Terrain.prototype.tableWidth = function () {
    return this._iTableWidth;
};
Terrain.prototype.tableHeight = function () {
    return this._iTableHeight;
};
Terrain.prototype.mapScale = function () {
    return this._v3fMapScale;
};
Terrain.prototype.worldExtents = function () {
    return this._pWorldExtents;
};

Terrain.prototype.worldSize = function()
{
	return this._v3fWorldSize;
}

Terrain.prototype.lodErrorScale = function () {
    return this._fScale;
};
Terrain.prototype.lodRatioLimit = function () {
    return this._fLimit;
};
Terrain.prototype.sectorShift = function () {
    return this._iSectorShift;
};
Terrain.sSectorVertex = function () {
  ///&???
};
Terrain.prototype.elevationData = function () {
    this.fMinElevation;
    this.fMaxElevation;
    this.fMinNormalZ;
    this.fMaxNormalZ;
    this.fStrength;
};
Terrain.prototype.terrainTextureData = function () {
    this.pImage;
    this.fUvScale;
    this.pElevation = new this.elevationData();
};
Terrain.prototype.sample_data = function () {
    this.iColor;
    this.fScale;
};

Terrain.prototype.getDataFactory=function()
{
	return this._pDataFactory;
}

Terrain.prototype.getSectorCountX=function()
{
	return this._iSectorCountX;
}

Terrain.prototype.getSectorCountY=function()
{
	return this._iSectorCountY;
}

/**
 * @property create(SceneNode pRootNode, Texture pHeightMap, const cRect3d worldExtents, int iShift, Function fnCallBack)
 * @memberof Terrain
 * @param pRootNode
 * @param fnCallBack функция которую нужно вызвать после создания
 * @return bool
 **/
//iShiftX - количество сектионов по иксу
//iShiftY - количесвто сектионов по Y
//iShift - количество вершин в сектионе

Terrain.prototype.create = function (pRootNode, pHeightMap,worldExtents, iShift, iShiftX,iShiftY,sSurfaceTextures)
{
	//Основные параметры
    this._iSectorShift = iShift;
    this._iSectorUnits = 1 << iShift;
    this._iSectorVerts = this._iSectorUnits + 1;

    this._pRootNode = pRootNode;

	this._pWorldExtents=new a.Rect3d(worldExtents.fX0, worldExtents.fX1,worldExtents.fY0, worldExtents.fY1, worldExtents.fZ0, worldExtents.fZ1)
	this._pWorldExtents.normalize();
	this._v3fWorldSize = this._pWorldExtents.size();

    this._iSectorCountX = 1<<iShiftX;//this._iTableWidth >> this._iSectorShift;
	this._iSectorCountY = 1<<iShiftY;//this._iTableHeight >> this._iSectorShift;

	this._iTableWidth  = this._iSectorCountX*this._iSectorUnits;
	this._iTableHeight = this._iSectorCountY*this._iSectorUnits;


	this._v2fSectorSize.set(this._v3fWorldSize.x / this._iSectorCountX, this._v3fWorldSize.y / this._iSectorCountY);

	this._v3fMapScale.x = this._v3fWorldSize.x / this._iTableWidth;
	this._v3fMapScale.y = this._v3fWorldSize.y / this._iTableHeight;
	this._v3fMapScale.z = this._v3fWorldSize.z / 255.0;


	//Мегатекстурные параметры
	pPathInfoMega=new a.Pathinfo(sSurfaceTextures);

	console.log("Мега текстура")
	this._pMegaTexures = new a.MegaTexture(this._pEngine,this,sSurfaceTextures);
	console.log("Мега текстура созадна")
    // convert the height map to
    // data stored in local tables
	console.log("Высоты и нормали")
    this.buildHeightAndNormalTables(pHeightMap);
	console.log("Высоты и нормали созданы")

	console.log("Сектора")
    return this.allocateSectors();
	console.log("Сектора созданы")
}



Terrain.prototype.findSection = function(iX,iY)
{
	var pSection = null;

	if (iX >=0 && iX<this._iSectorCountX
		&& iY >=0 && iY<this._iSectorCountY)
	{
		pSection =this._pSectorArray[(iY*this._iSectorCountX)+iX];
	}
	else
	{
		// if we had additional cRoamTerrain objects,
		// we could reach out here to link with neighbors
	}

	return pSection;
}
/**
 * @property allocateSectors()
 * @memberof Terrain
 * @return bool
 **/
Terrain.prototype.allocateSectors = function () {
    /*this._pSectorArray =
     new cTerrainSection[
     this._iSectorCountX*this._iSectorCountY];*/
    this._pSectorArray = new Array(this._iSectorCountX * this._iSectorCountY);

    // create the sector objects themselves
    for (var y = 0; y < this._iSectorCountY; ++y) {
        for (var x = 0; x < this._iSectorCountX; ++x) {
            //cVector2 sectorPos(
            v2fSectorPos = new Vec2();
			v2fSectorPos.set(
                this._pWorldExtents.fX0 + (x * this._v2fSectorSize.x),
                this._pWorldExtents.fY0 + (y * this._v2fSectorSize.y));

            //cRect2d r2fSectorRect(
            r2fSectorRect = new a.Rect2d();
            r2fSectorRect.set(
                v2fSectorPos.x, v2fSectorPos.x + this._v2fSectorSize.x,
                v2fSectorPos.y, v2fSectorPos.y + this._v2fSectorSize.y);

            iXPixel = x << this._iSectorShift;
            iYPixel = y << this._iSectorShift;

            iIndex = (y * this._iSectorCountX) + x;
            this._pSectorArray[iIndex] = new a.TerrainSection(this._pEngine);
            if (!this._pSectorArray[iIndex].create(
                this._pRootNode,
                this,
                x, y,
                iXPixel, iYPixel,
                this._iSectorVerts,
                this._iSectorVerts,
                r2fSectorRect)) {
                return false;
            }
        }
    }

    return true;
}

/**
 * @property setRenderMethod(RenderMethod pRenderMethod)
 * @memberof Terrain
 * @param pRenderMethod
 **/
Terrain.prototype.setRenderMethod = function (pRenderMethod) {
    this._pRenderMethod = null;
    this._pRenderMethod = pRenderMethod;
    if (this._pRenderMethod) {
        this._pRenderMethod.addRef();
    }
}

//
// Here we convert the height map data into
// floating point height and surface normals.
// each is stored within a table of values
// within the terrain system class
//

/**
 * @property buildHeightAndNormalTables(Texture pTexture)
 * @memberof Terrain
 * @param pTexture
 **/
Terrain.prototype.buildHeightAndNormalTables = function (pImage) {
    var pColor = new Uint8Array(4);

    this._pHeightTable = null;
    this._pv3fNormalTable = null;


    var iMaxY = this._iTableHeight;
    var iMaxX = this._iTableWidth;
    var x, y;

	console.log("buildHeightAndNormalTables0");

    this._pHeightTable = new Array(iMaxX * iMaxY); //float
    this._pv3fNormalTable = new Array(iMaxX * iMaxY);
    for (var i = 0; i < iMaxX * iMaxY; i++) {
        this._pv3fNormalTable[i] = new Vec3();
    }

	console.log("buildHeightAndNormalTables1");
    // first, build a table of heights
    if (pImage.isResourceLoaded()) 
	{
        var fHeight;
        for (y = 0; y < iMaxY; y++)
		{
            for (x = 0; x < iMaxX; x++) 
			{
                pImage.tex2D(x/iMaxX, y/iMaxY, pColor);
                fHeight = pColor[0]; // Red value
                fHeight = (fHeight * this._v3fMapScale.z) + this._pWorldExtents.fZ0;
                this._pHeightTable[(y * iMaxX) + x] = fHeight;
            }
        }
    }

	console.log("buildHeightAndNormalTables2");

    // create a normal map texture
    var temp = new a.Texture(this._pEngine);

    // how much to scale the normals?
    var fScale = (this._iTableWidth * this._pWorldExtents.sizeZ()) / this._pWorldExtents.sizeX();

    // convert our height map into a
    // texture of surface normals

	console.log("buildHeightAndNormalTables3")

    temp.generateNormalMap(pImage, 0, fScale);
	console.log("buildHeightAndNormalTables4")
	temp.resize(iMaxX,iMaxY);
	console.log("buildHeightAndNormalTables5")
	var pColorData=new Uint8Array(4*iMaxY*iMaxX);
	temp.getPixelRGBA(0, 0,iMaxX,iMaxY, pColorData);
	console.log("buildHeightAndNormalTables6")
	//console.log(pColorData);
	var i=0;
    for (y = 0; y < iMaxY; y++) 
	{
        for (x = 0; x < iMaxX; x++) 
		{       
			i++;

            this._pv3fNormalTable[(y * iMaxX) + x].x = pColorData[((y * iMaxX) + x)*4+0] - 127.5;
            this._pv3fNormalTable[(y * iMaxX) + x].y = pColorData[((y * iMaxX) + x)*4+1] - 127.5;
            this._pv3fNormalTable[(y * iMaxX) + x].z = pColorData[((y * iMaxX) + x)*4+2] - 127.5;
            this._pv3fNormalTable[(y * iMaxX) + x].normalize();
			//console.log(this._pv3fNormalTable[(y * iMaxX) + x].x,
			//	this._pv3fNormalTable[(y * iMaxX) + x].y,
			//	this._pv3fNormalTable[(y * iMaxX) + x].Z)
			//console.log("norm->",this._pv3fNormalTable[(y * iMaxX) + x].x = pColorData[((y * iMaxX) + x)*4+0],
			//	this._pv3fNormalTable[(y * iMaxX) + x].x = pColorData[((y * iMaxX) + x)*4+1],
			//	this._pv3fNormalTable[(y * iMaxX) + x].x = pColorData[((y * iMaxX) + x)*4+2]);
        }
    }
	console.log("buildHeightAndNormalTables7")
    temp.releaseTexture();
	console.log("buildHeightAndNormalTables8")

};

/**
 * @property readWorldHeight(int iMapX, int iMapY)
 * @memberof Terrain
 * @param iMapX
 * @param iMapY
 * @return float
 **/

var kdjfkdjf=0;
Terrain.prototype.readWorldHeight = function () {
    if (arguments.length == 2) {
        var iMapX = arguments[0];
        var iMapY = arguments[1];
        if (iMapX >= this._iTableWidth) {
            iMapX = this._iTableWidth - 1;
        }
        if (iMapY >= this._iTableHeight) {
            iMapY = this._iTableHeight - 1;
        }

		return this._pHeightTable[(iMapY * this._iTableWidth) + iMapX];
    }
    else {
        var iMapIndex = arguments[0];
        debug_assert(iMapIndex < this._iTableWidth * this._iTableHeight, "invalid index");
        return this._pHeightTable[iMapIndex];
    }
};

/**
 * @property tableIndex(int iMapX, int iMapY)
 * @memberof Terrain
 * @param iMapX
 * @param iMapY
 * @return int
 **/
Terrain.prototype.tableIndex = function (iMapX, iMapY) {
    // clamp to the table dimensions
    if (iMapX >= this._iTableWidth) {
        iMapX = this._iTableWidth - 1;
    }
    if (iMapY >= this._iTableHeight) {
        iMapY = this._iTableHeight - 1;
    }

    return (iMapY * this._iTableWidth) + iMapX;
};

/**
 * @property readWorldNormal(int iMapX, int iMapY)
 * @memberof Terrain
 * @param iMapX
 * @param iMapY
 * @return vec3f
 **/
Terrain.prototype.readWorldNormal = function (iMapX, iMapY) {
    if (iMapX >= this._iTableWidth) {
        iMapX = this._iTableWidth - 1;
    }
    if (iMapY >= this._iTableHeight) {
        iMapY = this._iTableHeight - 1;
    }

    return this._pv3fNormalTable[(iMapY * this._iTableWidth) + iMapX];
};

/**
 * @property calcWorldHeight(float fWorldX, float fWorldY)
 * @memberof Terrain
 * @param fWorldX
 * @param fWorldY
 * @return float
 **/
Terrain.prototype.calcWorldHeight = function (fWorldX, fWorldY) {
    fMapX = (fWorldX - this._pWorldExtents.fX0) / this._pWorldExtents.sizeX();
    fMapY = (fWorldY - this._pWorldExtents.fY0) / this._pWorldExtents.sizeY();

    return this.calcMapHeight(fMapX, fMapY);
};

/**
 * @property calcWorldNormal(v3f v3fNormal, float fWorldX, float fWorldY)
 * @memberof Terrain
 * @param v3fNormal
 * @param fWorldX
 * @param fWorldY
 **/
Terrain.prototype.calcWorldNormal = function (v3fNormal, fWorldX, fWorldY) {
    fMapX = (fWorldX - this._pWorldExtents.fX0) / this._pWorldExtents.sizeX();
    fMapY = (fWorldY - this._pWorldExtents.fY0) / this._pWorldExtents.sizeY();

    this.calcMapNormal(v3fNormal, fMapX, fMapY);
};

/**
 * @property calcMapHeight(float fMapX, float fMapY)
 * @memberof Terrain
 * @param fMapX
 * @param fMapY
 * @return float
 **/
Terrain.prototype.calcMapHeight = function (fMapX, fMapY) {
    var fTempMapX = fMapX * (this._iTableWidth - 1);
    var fTempMapY = fMapY * (this._iTableHeight - 1);

    var iMapX0 = Math.floor(fTempMapX);
    var iMapY0 = Math.floor(fTempMapY);

    fTempMapX -= iMapX0;
    fTempMapY -= iMapY0;

    iMapX0 = Math.clamp(iMapX0, 0, this._iTableWidth - 1);
    iMapY0 = Math.clamp(iMapY0, 0, this._iTableHeight - 1);

    var iMapX1 = Math.clamp(iMapX0 + 1, 0, this._iTableWidth - 1);
    var iMapY1 = Math.clamp(iMapY0 + 1, 0, this._iTableHeight - 1);

    // read 4 map values
    var fH0 = this.readWorldHeight(iMapX0, iMapY0);
    var fH1 = this.readWorldHeight(iMapX1, iMapY0);
    var fH2 = this.readWorldHeight(iMapX0, iMapY1);
    var fH3 = this.readWorldHeight(iMapX1, iMapY1);

    var fAvgLo = (fH1 * fTempMapX) + (fH0 * (1.0 - fTempMapX));
    var fAvgHi = (fH3 * fTempMapX) + (fH2 * (1.0 - fTempMapX));

    return (fAvgHi * fTempMapY) + (fAvgLo * (1.0 - fTempMapY));
};

/**
 * @property calcMapNormal(v3f v3fNormal, float fTempMapX, float fTempMapY)
 * @memberof Terrain
 * @param v3fNormal
 * @param fTempMapX
 * @param fTempMapY
 **/
Terrain.prototype.calcMapNormal = function (v3fNormal, fTempMapX, fTempMapY) {
    var fMapX = fTempMapX * (this._iTableWidth - 1);
    var fMapY = fTempMapY * (this._iTableHeight - 1);

    var iMapX0 = Math.floor(fMapX);
    var iMapY0 = Math.floor(fMapY);

    fMapX -= iMapX0;
    fMapY -= iMapY0;

    iMapX0 = Math.clamp(iMapX0, 0, this._iTableWidth - 1);
    iMapY0 = Math.clamp(iMapY0, 0, this._iTableHeight - 1);

    var iMapX1 = Math.clamp(iMapX0 + 1, 0, this._iTableWidth - 1);
    var iMapY1 = Math.clamp(iMapY0 + 1, 0, this._iTableHeight - 1);

    // read 4 map values
    v3fH0 = new Vec3();
	v3fH0.set(this.readWorldNormal(iMapX0, iMapY0));

    v3fH1 = new Vec3();
	v3fH1.set(this.readWorldNormal(iMapX1, iMapY0));

    v3fH2 = new Vec3();
	v3fH2.set(this.readWorldNormal(iMapX0, iMapY1));

    v3fH3 = new Vec3();
	v3fH3.set(this.readWorldNormal(iMapX1, iMapY1));

    v3fAvgLo = new Vec3();
	v3fAvgLo.add(v3fH1.scale(fMapX));
	v3fAvgLo.add(v3fH0.scale(1.0 - fMapX));

    v3fAvgHi = new Vec3();
	v3fAvgHi.add(v3fH3.scale(fMapX))
	v3fAvgHi.add(v3fH2.scale(1.0 - fMapX));

	v3fNormal.add(v3fAvgHi.scale(fMapY));
	v3fNormal.add(v3fAvgLo.scale(1.0 - fMapY));
	v3fNormal.normalize();
};


/**
 * @property generateTerrainImage(Image pTerrainImage, terrainTextureData pTextureList, int    iTextureCount)
 * @memberof Terrain
 * @param pTerrainImage
 * @param pTextureList
 * @param iTextureCount
 **/
Terrain.prototype.generateTerrainImage = function (pTerrainImage, pTextureList, iTextureCount) {
    var bSuccess = false;
    var x, y, i;

    var iImage_width = pTerrainImage.getWidth();
    var iImage_height = pTerrainImage.getHeight();

    var fUStep = 1.0 / (iImage_width - 1);
    var fVStep = 1.0 / (iImage_height - 1);

    //sample_data* pSamples = new sample_data[iTextureCount];
    var pSamples = new Array(iTextureCount);

    // lock all the textures we need
    pTerrainImage.lock();
    for (i = 0; i < iTextureCount; ++i) {
        pTextureList[i].pImage.lock();
    }

    // step through and generate each pixel
    for (y = 0; y < iImage_height; ++y) {
        for (x = 0; x < iImage_width; ++x) {
            var fU = x * fUStep;
            var fV = y * fVStep;


            var fTotalBlend = 0.0;
            var fMap_height = this.calcMapHeight(fU, fV);
            var v3fNormal = new Vec3();
            this.calcMapNormal(v3fNormal, fU, fV);

            // examine each elevation set
            for (i = 0; i < iTextureCount; ++i) {
                // how much of this texture do we want?
                var fElevationScale = 0.0;
                var fSlopeScale = 0.0;

                if (fMap_height >= pTextureList[i].elevation.minElevation
                    && fMap_height <= pTextureList[i].elevation.maxElevation) {
                    var fSpan = pTextureList[i].elevation.maxElevation - pTextureList[i].elevation.minElevation;
                    fElevationScale = fMap_height - pTextureList[i].elevation.minElevation;
                    fElevationScale *= 1.0 / fSpan;
                    fElevationScale -= 0.5;
                    fElevationScale *= 2.0;
                    fElevationScale *= fElevationScale;
                    fElevationScale = 1.0 - fElevationScale;
                }

                if (v3fNormal.z >= pTextureList[i].elevation.minNormalZ
                    && v3fNormal.z <= pTextureList[i].elevation.maxNormalZ) {
                    var fSpan = pTextureList[i].elevation.maxNormalZ - pTextureList[i].elevation.minNormalZ;
                    fSlopeScale = v3fNormal.z - pTextureList[i].elevation.minNormalZ;
                    fSlopeScale *= 1.0 / fSpan;
                    fSlopeScale -= 0.5;
                    fSlopeScale *= 2.0;
                    fSlopeScale *= fSlopeScale;
                    fSlopeScale = 1.0 - fSlopeScale;
                }
                pSamples[i] = new this.sample_data()
                pSamples[i].fScale = pTextureList[i].elevation.strength * fElevationScale * fSlopeScale;
                fTotalBlend += pSamples[i].fScale;

                //pTextureList[i] = new cTerrain.terrainTextureData()
                pTextureList[i].pImage.sampleColor(
                    fU * pTextureList[i].fUvScale,
                    fV * pTextureList[i].fUvScale,
                    pSamples[i].iColor);
            }

            // balance the data (so they add up to 1.0f)
            var fBlendScale = 1.0 / fTotalBlend;

            // now compute the actual color
            var fRed = 0.0;
            var fGreen = 0.0;
            var fBlue = 0.0;
            var fAlpha = 0.0;

            for (i = 0; i < iTextureCount; ++i) {
                var fScale = pSamples[i].fScale * fBlendScale;

                fBlue += ( pSamples[i].iColor & 0xff) * fScale;
                fGreen += ((pSamples[i].iColor >> 8) & 0xff) * fScale;
                fRed += ((pSamples[i].iColor >> 16) & 0xff) * fScale;
                fAlpha += ((pSamples[i].iColor >> 24) & 0xff) * fScale;
            }

            var iR = Math.clamp(fRed, 0.0, 255.0);
            var iG = Math.clamp(fGreen, 0.0, 255.0);
            var iB = Math.clamp(fBlue, 0.0, 255.0);
            var iA = Math.clamp(fAlpha, 0.0, 255.0);

            var iColor = (iA << 24) + (fR << 16) + (iG << 8) + iB;

            pTerrainImage.setColor(x, y, iColor);
        }
    }

    // unlock all the images
    pTerrainImage.unlock();
    for (i = 0; i < iTextureCount; ++i) {
        pTextureList[i].pImage.unlock();
    }
}


/**
 * @property computeWeight(float fValue, float fMinExtent, float fMaxExtent)
 * @memberof Terrain
 * @param fValue
 * @param fMinExtent
 * @param fMaxExtent
 * @return float
 **/
Terrain.prototype.computeWeight = function (fValue, fMinExtent, fMaxExtent) {
    var fWeight = 0.0;

    if (fValue >= fMinExtent && fValue <= fMaxExtent) {

        var fSpan = fMaxExtent - fMinExtent;
        fWeight = fValue - fMinExtent;

        // convert to a 0-1 range value
        // based on its distance to the midpoint
        // of the range extents
        fWeight *= 1.0 / fSpan;
        fWeight -= 0.5;
        fWeight *= 2.0;

        // square the result for non-linear falloff
        fWeight *= fWeight;

        // invert and bound-check the result
        fWeight = 1.0 - Math.absoluteValue(fWeight);
        fWeight = Math.clamp(fWeight, 0.001, 1.0);
    }

    return fWeight;
}

/**
 * @property generateBlendImage(Image pBlendImage, elevationData pElevationData, int    iElevationDataCount,fnCallback)
 * @memberof Terrain
 * @param pBlendTexture
 * @param pElevationData
 * @param iElevationDataCount
 * @param fnCallback функция которая вызовется после генерирования текстуры смешивания
 **/
Terrain.prototype.generateBlendImage = function (pBlendImage, pElevationData, iElevationDataCount, fnCallback) {
    var bSuccess = false;
    var x, y, i;

    var pColor = new Uint8Array(4);

    debug_assert(pBlendImage != null, "pBlendImage is not valid");

    // make sure there are no more than 4 structures
    iElevationDataCount = Math.min(iElevationDataCount, 4);

    // get the blend image dimensions
    var iImg_width = pBlendImage.getWidth();
    var iImg_height = pBlendImage.getHeight();

    // compute the step values for uv
    // coordinates across the image
    var fUStep = 1.0 / (iImg_width - 1);
    var fVStep = 1.0 / (iImg_height - 1);

    // these 4 mask values control
    // which color component of the
    // blend image we write to
    v4fMask = new Array(4);

    v4fMask[0] = new Vec4();
	v4fMask[0].set(1.0, 0.0, 0.0, 0.0);

    v4fMask[1] = new Vec4();
	v4fMask[1].set(0.0, 1.0, 0.0, 0.0);

    v4fMask[2] = new Vec4();
	v4fMask[2].set(0.0, 0.0, 1.0, 0.0);

    v4fMask[3] = new Vec4();
	v4fMask[3].set(0.0, 0.0, 0.0, 1.0);

    for (y = 0; y < iImg_height; y++) 
	{
        for (x = 0; x < iImg_width; x++) 
		{
			var fTotalBlend = 0.0;
			var v4fBlendFactors = new Vec4();
			v4fBlendFactors.set(0.0, 0.0, 0.0, 0.0);
			if (iElevationDataCount == 3) 
			{
				v4fBlendFactors.w = 255;
			}

			// get the elevation and surface v3fNormal
			var fU = x * fUStep;
			var fV = y * fVStep;
			var fMap_height = this.calcMapHeight(fU, fV);

			var v3fNormal = new Vec3();
			var v4fTemp = new Vec4();
			this.calcMapNormal(v3fNormal, fU, fV);

			// examine each elevationData structure
			// a compute a weight for each one
			for (i = 0; i < iElevationDataCount; ++i) {
				// compute a weight based on elevation
				var fElevationScale = this.computeWeight(fMap_height,
														 pElevationData[i].fMinElevation,
														 pElevationData[i].fMaxElevation);

				// compute a weight based on slope
				var fSlopeScale = this.computeWeight(v3fNormal.z,
													 pElevationData[i].fMinNormalZ, pElevationData[i].fMaxNormalZ);

				// combine the two with the relative
				// strength of this surface type
				var fScale = pElevationData[i].fStrength * fElevationScale * fSlopeScale;

				// write the result to the proper
				// channel of the blend factor Vector
				v4fTemp.set(v4fMask[i]);
				v4fTemp.scale(fScale)
				v4fBlendFactors.add(v4fTemp);
				//v4fBlendFactors += v4fMask[i] * fScale;

				// and remember the total weight
				fTotalBlend += fScale;
			}

			// balance the data (so they add up to 255)
			var fBlendScale = 255.0 / fTotalBlend;

			// now compute the actual color by
			// multiplying each channel
			// by the blend fScale
			v4fBlendFactors.scale(fBlendScale)

			// clamp and convert to color values
			pColor[0] = Math.clamp(v4fBlendFactors.x, 0.0, 255.0);
			pColor[1] = Math.clamp(v4fBlendFactors.y, 0.0, 255.0);
			pColor[2] = Math.clamp(v4fBlendFactors.z, 0.0, 255.0);
			pColor[3] = Math.clamp(v4fBlendFactors.w, 0.0, 255.0);
			pBlendImage.setPixelRGBA(x, iImg_height - y - 1, pColor); //так как текстура перевернута
        }
    }
}


/**
 * @property setTessellationParameters(float fVScale, float fVLimit)
 * @memberof Terrain
 * @param fVScale
 * @param fVLimit
 **/
Terrain.prototype.setTessellationParameters = function (fScale, fLimit)
{
    this._fScale = fScale;
    this._fLimit = fLimit;
}


/**
 * @property computeErrorMetricOfGrid(int iXVerts, int iYVerts, int iXStep, int iYStep, int iXOffset, int iYOffset)
 * @memberof Terrain
 * @param iXVerts
 * @param iYVerts
 * @param iXStep
 * @param iYStep
 * @param iXOffset
 * @param iYOffset
 * @return float
 **/

/*Terrain.prototype.computeErrorMetricOfGrid = function (iXVerts, iYVerts, iXStep, iYStep, iXOffset, iYOffset) {
    var fResult = 0.0;
    var iTotalRows = iYVerts - 1;
    var iTotalCells = iXVerts - 1;

    var iStartVert = (iYOffset * this._iTableWidth) + iXOffset;
    var iLineStep = iYStep * this._iTableWidth;

    var fInvXStep = 1.0 / iXStep;
    var fInvYStep = 1.0 / iYStep;

    for (var j = 0; j < iTotalRows; ++j) {
        var iIndexA = iStartVert;
        var iIndexB = iStartVert + iLineStep;
        var fCornerA = this.readWorldHeight(iIndexA);
        var fCornerB = this.readWorldHeight(iIndexB);

        for (var i = 0; i < iTotalCells; ++i) {
            // compute 2 new corner vertices
            var iIndexC = iIndexA + iXStep;
            var iIndexD = iIndexB + iXStep;

            // grab 2 new corner height values
            var fCornerC = this.readWorldHeight(iIndexC);
            var fCornerD = this.readWorldHeight(iIndexD);

            // setup the step values for
            // both triangles of this cell
            var fStepX0 = (fCornerD - fCornerA) * fInvXStep;
            var fStepY0 = (fCornerB - fCornerA) * fInvYStep;
            var fStepX1 = (fCornerB - fCornerC) * fInvXStep;
            var fStepY1 = (fCornerD - fCornerC) * fInvYStep;

            // find the max error for all points
            // covered by the two triangles
            var iSubIndex = iIndexA;
            for (var y = 0; y < iYStep; ++y) {
                for (var x = 0; x < iXStep; ++x) {
                    var fTrueHeight = this.readWorldHeight(iSubIndex);
                    ++iSubIndex;

                    var fIntepolatedHeight;

                    if (y < (iXStep - x)) {
                        fIntepolatedHeight = fCornerA + (fStepX0 * x) + (fStepY0 * y);
                    }
                    else {
                        fIntepolatedHeight = fCornerC + (fStepX1 * x) + (fStepY1 * y);
                    }

                    var fDelta = Math.absoluteValue(fTrueHeight - fIntepolatedHeight);

                    fResult = Math.maximum(fResult, fDelta);

                }
                iSubIndex = iIndexA + (y * this._iTableWidth);
            }

            // save the corners for the next cell
            iIndexA = iIndexC;
            iIndexB = iIndexD;
            fCornerA = fCornerC;
            fCornerB = fCornerD;
        }

        iStartVert += iLineStep;
    }

    return fResult;
}

*/



//Подготовка терраина к рендерингу, а имменно, выичсление координат камеры над терраином, закладка новых частей текстру в мегатекстуру
Terrain.prototype.prepareForRender= function()
{
	this._pMegaTexures.prepareForRender();
}

//Применение параметров для рендеринга, коготрые зависят от самого терраина
Terrain.prototype.applyForRender= function()
{
	this._pMegaTexures.applyForRender();
}

Terrain.prototype.reset=function()
{

}

/**
 * @property readUserInput()
 * @memberof Terrain
 **/
Terrain.prototype.readUserInput = function ()
{
    //
    // allow the user to adjust tesselation params
    //
    if (this._pEngine.pKeymap.isKeyPress(a.KEY.ADD)) //+
    {
		this._fLimit += 0.0001;
    }
    else if (this._pEngine.pKeymap.isKeyPress(a.KEY.SUBTRACT)) //-
    {
		this._fLimit -= 0.0001;
    }

    if (this._pEngine.pKeymap.isKeyPress(a.KEY.MULTIPLY)) //*
    {
		this._fScale += 0.0001;
    }
    else if (this._pEngine.pKeymap.isKeyPress(a.KEY.DIVIDE))  // /
    {
		this._fScale -= 0.0001;
    }




    if (this._fLimit < 0.001)
	{
		this._fLimit = 0.001;
    }
    if (this._fScale < 0.001)
	{
		this._fScale = 0.001;
    }

	document.getElementById('setinfo4').innerHTML="fScale1 "+this._fScale;
	document.getElementById('setinfo5').innerHTML="fLimit1 "+this._fLimit;

}
a.Terrain = Terrain;
