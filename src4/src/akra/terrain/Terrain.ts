/// <reference path="../idl/ITerrain.ts" />
/// <reference path="../idl/IEffect.ts" />
/// <reference path="../idl/IRenderTechnique.ts" />
/// <reference path="../idl/IViewport.ts" />

/// <reference path="../pool/resources/Texture.ts" />
/// <reference path="../data/RenderDataCollection.ts" />
/// <reference path="../geometry/Rect3d.ts" />
/// <reference path="../scene/SceneObject.ts" />
/// <reference path="../render/Screen.ts" />
/// <reference path="../config/config.ts" />
/// <reference path="../math/math.ts" />

/// <reference path="MegaTexture.ts" />
/// <reference path="TerrainSection.ts" />

module akra.terrain {
	import Vec2 = math.Vec2;
	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;

	export class Terrain extends scene.SceneObject implements ITerrain {
		protected _pEngine: IEngine = null;
		// private _pDevice = null;

		protected _pWorldExtents: IRect3d = new geometry.Rect3d();
		private _v3fWorldSize: IVec3 = new Vec3();
		private _v3fMapScale: IVec3 = new Vec3();
		//количество секций по иксу
		protected _iSectorCountX: uint;  
		//количество секций по игрику
		protected _iSectorCountY: uint; 
		//массив подчиненный секций 
		protected _pSectorArray: ITerrainSection[] = null; 


		protected _pDataFactory: IRenderDataCollection = null;

		protected _v2fSectorSize: IVec2 = new Vec2();

		protected _iSectorShift: uint;
		//Количество секторов по осям
		protected _iSectorUnits: uint; 
		protected _iSectorVerts: uint;

		//размер карты высот
		protected _iTableWidth: uint; 
		//размер карты высот
		protected _iTableHeight: uint; 
		//Таблица(карта высот)
		protected _pHeightTable: Float32Array = null;  

		private _pNormalMapTexture: ITexture = null;
		private _pNormalMapImage: IImg = null;

		private _pBaseNormalTexture: ITexture = null;
		private _pBaseNormalImage: IImg = null;
		
		private _pHeightMapTexture: ITexture = null;

		private _pTempNormalColor: IColor = new color.Color();

		//отоброжаемые куски текстуры
		private _pMegaTexures: IMegaTexture = null; 
		protected _bUseVertexNormal: boolean = false;

		protected _pDefaultRenderMethod: IRenderMethod = null;
		protected _pRenderMethod: IRenderMethod = null;
		protected _pDefaultScreen: IRenderableObject = null;

		private _fMaxHeight: float = 0.;
		private _f2DDiagonal: float = 0.;

		protected _isCreate: boolean = false;
		protected _bManualMegaTextureInit: boolean = false;
		protected _bShowMegaTexture: boolean = true;
		protected _bMegaTextureCreated: boolean = false;
		protected _sSurfaceTextures: string = "";

		constructor(pScene: IScene3d, eType: EEntityTypes = EEntityTypes.TERRAIN) {
			super(pScene, eType);
			this._pEngine = pScene.getManager().getEngine();
			this._pDataFactory = data.createRenderDataCollection(this._pEngine, ERenderDataBufferOptions.VB_READABLE);

			if (config.terrain.useMegaTexture) {
				this._pMegaTexures = new MegaTexture(this._pEngine);
			}
		}

		get dataFactory(): IRenderDataCollection{
			return this._pDataFactory;
		}

		get worldExtents(): IRect3d{
			return this._pWorldExtents;
		}

		get worldSize(): IVec3{
			return this._v3fWorldSize;
		}

		get mapScale(): IVec3{
			return this._v3fMapScale;
		}

		get sectorCountX(): uint{
			return this._iSectorCountX;
		}

		get sectorCountY(): uint{
			return this._iSectorCountY;
		}

		get sectorSize(): IVec2{
			return this._v2fSectorSize;
		}

		get tableWidth(): uint{
			return this._iTableWidth;
		}

		get tableHeight(): uint{
			return this._iTableHeight;
		}

		get sectorShift(): uint{
			return this._iSectorShift;
		}

		get maxHeight(): float{
			return this._fMaxHeight;
		}

		get terrain2DLength(): float{
			return this._f2DDiagonal;
		}

		isCreate(): boolean {
			return this._isCreate;
		}

		get megaTexture(): IMegaTexture {
			return this._pMegaTexures;
		}

		get manualMegaTextureInit(): boolean {
			return this._bManualMegaTextureInit;
		}

		set manualMegaTextureInit(bManual: boolean) {
			this._bManualMegaTextureInit = bManual;
		}

		get showMegaTexture(): boolean {
			return this._bShowMegaTexture;
		}

		set showMegaTexture(bShow: boolean) {
			this._bShowMegaTexture = bShow;
		}

		protected _initSystemData(): boolean {
			var pEngine: IEngine = this._pEngine,
			    pRmgr: IResourcePoolManager = pEngine.getResourceManager();

			if(isNull(this._pDefaultRenderMethod)){
				var pMethod: IRenderMethod = null, 
					pEffect: IEffect = null;
			    
			    pMethod = <IRenderMethod>pRmgr.renderMethodPool.findResource(".terrain_render");
			    
			    if (!isNull(pMethod)) {
			        this._pDefaultRenderMethod = pMethod;
			        return true;
			    }

			    pEffect = pRmgr.createEffect(".terrain_render");
			    pEffect.addComponent("akra.system.terrain");

			    pMethod = pRmgr.createRenderMethod(".terrain_render");
			    pMethod.effect = pEffect;
			    pMethod.surfaceMaterial = pRmgr.createSurfaceMaterial(".terrain_render");
			    var pMat: IMaterial = pMethod.surfaceMaterial.material;
			    pMat.name = "terrain";

			    pMat.shininess = 30;
			    (<IColor>pMat.emissive).set(0);
			    (<IColor>pMat.specular).set(1);



			    this._pDefaultRenderMethod = pMethod;
			}

			if(isNull(this._pDefaultScreen)){
				this._pDefaultScreen = new render.Screen(pEngine.getRenderer());

				var pMethod: IRenderMethod = null, 
					pEffect: IEffect = null;

				pMethod = <IRenderMethod>pRmgr.renderMethodPool.findResource(".terrain_generate_normal");

				if(isNull(pMethod)){
					pEffect = pRmgr.createEffect(".terrain_generate_normal");
					pEffect.addComponent("akra.system.generateNormalMapByHeightMap");

					pMethod = pRmgr.createRenderMethod(".terrain_generate_normal");
			    	pMethod.effect = pEffect;
				}

				this._pDefaultScreen.addRenderMethod(pMethod, ".terrain_generate_normal");

				this._pDefaultScreen.getTechnique(".terrain_generate_normal").render.connect(this, this._onGenerateNormalRender);
			}

		    return true;
		}

		init(pMap: IImageMap, worldExtents: IRect3d, iShift: uint, iShiftX: uint, iShiftY: uint, sSurfaceTextures: string, pRootNode: ISceneNode = null): boolean {
			if(!isNull(pRootNode)) {
				if(!this.attachToParent(pRootNode)) {
					return false;
				}
			}

			this._initSystemData();
			//Основные параметры
			this._iSectorShift = iShift;
			this._iSectorUnits = 1 << iShift;
			this._iSectorVerts = this._iSectorUnits + 1;

			this._pWorldExtents = new geometry.Rect3d(worldExtents.x0, worldExtents.x1, worldExtents.y0, worldExtents.y1,
			                                   worldExtents.z0, worldExtents.z1)
			this._pWorldExtents.normalize();
			this._v3fWorldSize = this._pWorldExtents.size(this._v3fWorldSize);

			//this._iTableWidth >> this._iSectorShift;
			this._iSectorCountX = 1 << iShiftX;
			//this._iTableHeight >> this._iSectorShift;
			this._iSectorCountY = 1 << iShiftY;

			this._iTableWidth = this._iSectorCountX * this._iSectorUnits + 1;
			this._iTableHeight = this._iSectorCountY * this._iSectorUnits + 1;


			this._v2fSectorSize.set(this._v3fWorldSize.x / this._iSectorCountX, this._v3fWorldSize.y / this._iSectorCountY);

			this._v3fMapScale.x = this._v3fWorldSize.x / this._iTableWidth;
			this._v3fMapScale.y = this._v3fWorldSize.y / this._iTableHeight;
			this._v3fMapScale.z = this._v3fWorldSize.z;

			// convert the height map to
			// data stored in local tables
			this._buildHeightAndNormalTables(pMap["height"], pMap["normal"]);

			for (var sImgMap in pMap) {
			    if (pMap[sImgMap].destroyResource) {
			        pMap[sImgMap].destroyResource();
			    }
			}

			if(!this._allocateSectors()){
				debug.error("Can not alloacte terrain sections");
				return false;
			}

			this.computeBoundingBox();

			if (config.terrain.useMegaTexture) {
				this._sSurfaceTextures = sSurfaceTextures;
				if (!this._bManualMegaTextureInit) {
					//Мегатекстурные параметры
					this.initMegaTexture(sSurfaceTextures);
				}
			}

			this._isCreate = true;

			return true;
		}

		initMegaTexture(sSurfaceTextures: string = this._sSurfaceTextures): void {
			if (config.terrain.useMegaTexture) {
				this._pMegaTexures.init(this, sSurfaceTextures);
			}
		}

		findSection(iX: uint, iY: uint) {
			var pSection: ITerrainSection = null;

			if (iX >= 0 && iX < this._iSectorCountX && 
				iY >= 0 && iY < this._iSectorCountY) {
			    pSection = this._pSectorArray[(iY * this._iSectorCountX) + iX];
			}
			else {
			    // if we had additional cRoamTerrain objects,
			    // we could reach out here to link with neighbors
			}

			return pSection;
		}

		protected _allocateSectors(): boolean {
			this._pSectorArray = new Array(this._iSectorCountX * this._iSectorCountY);

			// create the sector objects themselves
			for (var y: uint = 0; y < this._iSectorCountY; ++y) {
			    for (var x: uint = 0; x < this._iSectorCountX; ++x) {
			    	var v2fSectorPos: IVec2 = new Vec2();
					var r2fSectorRect: IRect2d = new geometry.Rect2d();

			        v2fSectorPos.set(
			            this._pWorldExtents.x0 + (x * this._v2fSectorSize.x),
			            this._pWorldExtents.y0 + (y * this._v2fSectorSize.y));

			        r2fSectorRect.set(
			            v2fSectorPos.x, v2fSectorPos.x + this._v2fSectorSize.x,
			            v2fSectorPos.y, v2fSectorPos.y + this._v2fSectorSize.y);

			        var iXPixel: uint = x << this._iSectorShift;
			        var iYPixel: uint = y << this._iSectorShift;
			        var iIndex: uint = (y * this._iSectorCountX) + x;

			        this._pSectorArray[iIndex] = this.scene.createTerrainSection();
			        this._pSectorArray[iIndex]._createRenderable();

			        if (!this._pSectorArray[iIndex]._internalCreate(
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

			this._setRenderMethod(this._pDefaultRenderMethod);

			return true;
		}

		protected _setRenderMethod(pRenderMethod: IRenderMethod): void {
		    this._pRenderMethod = pRenderMethod;
		    
		    if (this._pRenderMethod) {
		        this._pRenderMethod.addRef();
		    }

		    var pSection: ITerrainSection = null;

		    for (var i = 0; i < this._pSectorArray.length; i++) {
		        pSection = this._pSectorArray[i];

		        pSection.getRenderable().getTechnique().setMethod(this._pDefaultRenderMethod);
				pSection.getRenderable().getTechnique().render.connect(this, this._onRender);
		    }
		}

		protected _buildHeightAndNormalTables(pImageHightMap: IImg, pImageNormalMap: IImg): void {
			    var fHeight: float = 0;
			    var iComponents: uint = 4;
			    this._pHeightTable = null;


			    var iMaxY: uint = this._iTableHeight;
			    var iMaxX: uint = this._iTableWidth;

			    //var pColorData: Uint8Array = new Uint8Array(4 * iMaxY * iMaxX);
			    this._pHeightTable = new Float32Array(iMaxX * iMaxY); /*float*/

			    // first, build a table of heights
			    if (pImageHightMap.isResourceLoaded()) {
			        if(pImageHightMap.width !== iMaxX && pImageHightMap.height !== iMaxY){
			        	logger.warn("Размеры карты высот не совпадают с другими размерами. Нужно: " + 
			        			iMaxX + "x" + iMaxY + ". Есть: " + pImageHightMap.width + "x" + pImageHightMap.height);
			        	return;
			        }

			        for (var iY: uint = 0; iY < iMaxY; iY++) {
			        	for(var iX: uint = 0; iX < iMaxX; iX++){
			        		fHeight = pImageHightMap.getColorAt(this._pTempNormalColor, iX, iY).r;
			        		fHeight = (fHeight * this._v3fMapScale.z) + this._pWorldExtents.z0;

			        		this._pHeightTable[iY*iMaxX + iX] = fHeight;
			        	}
			        }

			        if(this._useVertexNormal()){
			        	this.computeBaseNormal(pImageHightMap);
			        }
			    }
			    else {
			        logger.warn("Height map not loaded")
			    }

			    if (pImageNormalMap.isResourceLoaded()) {
			    	this._pNormalMapTexture = this._pEngine.getResourceManager().createTexture(".terrain-normal-texture" + this.guid);
			        this._pNormalMapTexture.loadImage(pImageNormalMap);
			        this._pNormalMapImage = pImageNormalMap;
			    }
			    else {
			        logger.warn("Normal map not loaded")
			    }
		}

		readWorldHeight(iIndex: uint): float;
		readWorldHeight(iMapX: uint, iMapY: uint): float;
		readWorldHeight(iMapX: any, iMapY?: uint): float {
			if (arguments.length === 2) {
				var iFixedMapX: uint = iMapX, iFixedMapY: uint = iMapY;
				
			    if (iFixedMapX >= this._iTableWidth) {
			        iFixedMapX = this._iTableWidth - 1;
			    }
			    if (iFixedMapY >= this._iTableHeight) {
			        iFixedMapY = this._iTableHeight - 1;
			    }

			    return this._pHeightTable[(iFixedMapY * this._iTableWidth) + iFixedMapX];
			}
			else {
			    var iMapIndex: uint = iMapX;
			    logger.assert(iMapIndex < this._iTableWidth * this._iTableHeight, "invalid index");
			    return this._pHeightTable[iMapIndex];
			}
		}

		readWorldNormal(v3fNormal: IVec3, iMapX: uint, iMapY: uint): IVec3 {
			if (iMapX >= this._pBaseNormalImage.width) {
			    iMapX = this._pBaseNormalImage.width - 1;
			}
			if (iMapY >= this._pBaseNormalImage.height) {
			    iMapY = this._pBaseNormalImage.height - 1;
			}

			this._pBaseNormalImage.getColorAt(this._pTempNormalColor, iMapX, iMapY);
			v3fNormal.set(this._pTempNormalColor.r,
			              this._pTempNormalColor.g,
			              this._pTempNormalColor.b);

			return v3fNormal;
		}

		projectPoint(v3fCoord: IVec3, v3fDestenation: IVec3): boolean {
			var v4fTerrainCoord: IVec4 = Vec4.temp(v3fCoord, 1.);

		    v4fTerrainCoord = this.inverseWorldMatrix.multiplyVec4(v4fTerrainCoord);

		    if (v4fTerrainCoord.x < this.worldExtents.x0 || v4fTerrainCoord.x > this.worldExtents.x1 ||
		    	v4fTerrainCoord.y < this.worldExtents.y0 || v4fTerrainCoord.y > this.worldExtents.y1){

		    	return false;
		    }

		    var iMapX: uint = math.floor((v4fTerrainCoord.x - this.worldExtents.x0) / this.worldExtents.sizeX() * this.tableWidth);
		    var iMapY: uint = math.floor((v4fTerrainCoord.y - this.worldExtents.y0) / this.worldExtents.sizeY() * this.tableHeight);
		    var fHeight: float = this.readWorldHeight(iMapX, iMapY);

		    var v4fTempDestenation: IVec4 = Vec4.temp(v4fTerrainCoord.x, v4fTerrainCoord.y, fHeight, 1.);

		    v4fTempDestenation = this.worldMatrix.multiplyVec4(v4fTempDestenation);
		    v3fDestenation.set(v4fTempDestenation.x, v4fTempDestenation.y, v4fTempDestenation.z);

		    return true;
		}

		/**
		 * Подготовка терраина к рендерингу.
		 */
		prepareForRender(pViewport: IViewport): void {
			if (config.terrain.useMegaTexture) {
				if (this._bMegaTextureCreated && this._bShowMegaTexture) {
					this._pMegaTexures.prepareForRender(pViewport);
				}
			}
		}

		/**
		 * Сброс параметров.
		 */
		reset(): void {
		}

		protected computeBaseNormal(pImageHightMap: IImg): void {
			var pRmgr: IResourcePoolManager = this._pEngine.getResourceManager();

			this._pHeightMapTexture = pRmgr.createTexture(".terrain-hight-texture" + this.guid);
			this._pHeightMapTexture.loadImage(pImageHightMap);

			this._pBaseNormalTexture = pRmgr.createTexture(".terrain-base-normal-texture" + this.guid);
			this._pBaseNormalTexture.create(pImageHightMap.width, pImageHightMap.height, 1, null, 
											ETextureFlags.RENDERTARGET, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8A8);

			var pTarget: IRenderTarget = this._pBaseNormalTexture.getBuffer().getRenderTarget();
			pTarget.setAutoUpdated(false);

			var pViewport: IViewport = pTarget.addViewport(new render.Viewport(null, ".terrain_generate_normal"));
			pViewport.setDepthParams(false, false, 0);
			pViewport.setClearEveryFrame(false);

			pViewport.startFrame();
			pViewport.renderObject(this._pDefaultScreen);
			pViewport.endFrame();

			this._pBaseNormalImage = pRmgr.createImg(".terrain-base-normal-img" + this.guid);
			this._pBaseNormalTexture.convertToImage(this._pBaseNormalImage, false);
		}

		_tableIndex(iMapX: uint, iMapY: uint): uint {
			// clamp to the table dimensions
			if (iMapX >= this._iTableWidth) {
			    iMapX = this._iTableWidth - 1;
			}
			
			if (iMapY >= this._iTableHeight) {
			    iMapY = this._iTableHeight - 1;
			}

			return (iMapY * this._iTableWidth) + iMapX;
		}

		_useVertexNormal(): boolean {
			return this._bUseVertexNormal;
		}

		protected computeBoundingBox(): void {
			var fX0: float, fY0: float, fZ0: float,
				fX1: float, fY1: float, fZ1: float;

			fX0 = fY0 = fZ0 = MAX_FLOAT64;
			fX1 = fY1 = fZ1 = MIN_FLOAT64;

			for(var i: uint = 0; i < this._pSectorArray.length; i++) {
				var pSectionBox: IRect3d = this._pSectorArray[i].localBounds;

				fX0 = math.min(fX0, pSectionBox.x0);
				fY0 = math.min(fY0, pSectionBox.y0);
				fZ0 = math.min(fZ0, pSectionBox.z0);

				fX1 = math.max(fX1, pSectionBox.x1);
				fY1 = math.max(fY1, pSectionBox.y1);
				fZ1 = math.max(fZ1, pSectionBox.z1);
			}

			this.accessLocalBounds().set(fX0, fX1, fY0, fY1, fZ0, fZ1);

			this._fMaxHeight = fZ1 - fZ0;
			this._f2DDiagonal = math.sqrt((fX1 - fX0) * (fX1 - fX0) + (fY1 - fY0) * (fY1 - fY0));
		}

		_onRender(pTechnique: IRenderTechnique, iPass: uint): void {
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			pPass.setSamplerTexture("S_NORMAL_MAP", this._pNormalMapTexture);

			if (config.terrain.useMegaTexture) {
				if (this._bMegaTextureCreated && this._bShowMegaTexture) {
					this._pMegaTexures.applyForRender(pPass);
				}
				else {
					pPass.setUniform("S_TERRAIN", null);
					pPass.setForeign("nTotalLevels", 0);
				}
			}
			else {
				pPass.setForeign("nTotalLevels", 0);
			}
		}

		_onGenerateNormalRender(pTechnique: IRenderTechnique, iPass: uint): void {
			
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			pPass.setSamplerTexture("HEIGHT_SAMPLER", this._pHeightMapTexture);
			pPass.setUniform("STEPS", Vec2.temp(1./this._pHeightMapTexture.width, 1./this._pHeightMapTexture.height));
			pPass.setUniform("SCALE", this._v3fMapScale.z);
			pPass.setUniform("CHANNEL", 0);
		}
	}
}