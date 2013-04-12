#ifndef TERRAIN_TS
#define TERRAIN_TS

#include "ITerrain.ts"
#include "core/pool/resources/Texture.ts"
#include "render/RenderDataCollection.ts"
#include "geometry/Rect3d.ts"
#include "terrain/MegaTexture.ts"
#include "scene/SceneObject.ts"
#include "terrain/TerrainSection.ts"
#include "IEffect.ts"
#include "IViewport.ts"
#include "IRenderTechnique.ts"

module akra.terrain {

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
		private _iSectorUnits: uint; 
		protected _iSectorVerts: uint;

		//размер карты высот
		protected _iTableWidth: uint; 
		//размер карты высот
		protected _iTableHeight: uint; 
		//Таблица(карта высот)
		private _pHeightTable: float[] = null;  

		private _pNormalMap: ITexture = null;
		private _pNormalImage: IImg = null;
		private _pTempNormalColor: IColor = new Color();

		//отоброжаемые куски текстуры
		private _pMegaTexures: IMegaTexture = null; 

		protected _fScale: float = 0.0;
		protected _fLimit: float = 0.0;

		protected _pDefaultRenderMethod: IRenderMethod = null;
		protected _pRenderMethod: IRenderMethod = null;



		constructor(pScene: IScene3d, eType: EEntityTypes = EEntityTypes.TERRAIN) {
			super(pScene, eType);
			this._pEngine = pScene.getManager().getEngine();
			this._pDataFactory = render.createRenderDataCollection(this._pEngine, ERenderDataBufferOptions.VB_READABLE);
		}

		inline get dataFactory(): IRenderDataCollection{
			return this._pDataFactory;
		};

		inline get tessellationScale(): float{
			return this._fScale;
		};

		inline set tessellationScale(fScale: float){
			this._fScale = fScale;
		};

		inline get tessellationLimit(): float{
			return this._fLimit;
		};

		inline set tessellationLimit(fLimit: float){
			this._fLimit = fLimit;
		};

		inline get worldExtents(): IRect3d{
			return this._pWorldExtents;
		};

		inline get worldSize(): IVec3{
			return this._v3fWorldSize;
		};

		inline get mapScale(): IVec3{
			return this._v3fMapScale;
		};

		inline get sectorCountX(): uint{
			return this._iSectorCountX;
		};

		inline get sectorCountY(): uint{
			return this._iSectorCountY;
		};

		inline get sectorSize(): IVec2{
			return this._v2fSectorSize;
		};

		inline get tableWidth(): uint{
			return this._iTableWidth;
		};

		inline get tableHeight(): uint{
			return this._iTableHeight;
		};

		inline get sectorShift(): uint{
			return this._iSectorShift;
		};

		protected _initSystemData(): bool {
			if(isNull(this._pDefaultRenderMethod)){
				var pMethod: IRenderMethod = null, 
					pEffect: IEffect = null;
			    var pEngine: IEngine = this._pEngine,
			    	pRmgr: IResourcePoolManager = pEngine.getResourceManager();
			    
			    pMethod = <IRenderMethod>pRmgr.renderMethodPool.findResource(".terrain_render");
			    
			    if (!isNull(pMethod)) {
			        this._pDefaultRenderMethod = pMethod;
			        return true;
			    }

			    pEffect = pRmgr.createEffect(".terrain_render");
			    pEffect.addComponent("akra.system.terrain");

			    pMethod = pRmgr.createRenderMethod(".terrain_render");
			    pMethod.effect = pEffect;

			    this._pDefaultRenderMethod = pMethod;
			}

		    return true;
		}

		init(pMap: IImageMap, worldExtents: IRect3d, iShift: uint, iShiftX: uint, iShiftY: uint, sSurfaceTextures: string, pRootNode?: ISceneNode = null): bool {
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
				debug_error("Can not alloacte terrain sections");
				return false;
			}

			this.computeBoundingBox();

			//Мегатекстурные параметры
			this._pMegaTexures = new MegaTexture(this._pEngine, this, sSurfaceTextures);

			return true;
		}

		findSection(iX: uint, iY: uint) {
			var pSection: ITerrainSection = null;

			if (iX >= 0 && iX < this._iSectorCountX
			        && iY >= 0 && iY < this._iSectorCountY) {
			    pSection = this._pSectorArray[(iY * this._iSectorCountX) + iX];
			}
			else {
			    // if we had additional cRoamTerrain objects,
			    // we could reach out here to link with neighbors
			}

			return pSection;
		}

		protected _allocateSectors(): bool {
			var v2fSectorPos: IVec2 = new Vec2();
			var r2fSectorRect: IRect2d = new geometry.Rect2d();

			this._pSectorArray = new Array(this._iSectorCountX * this._iSectorCountY);

			// create the sector objects themselves
			for (var y: uint = 0; y < this._iSectorCountY; ++y) {
			    for (var x: uint = 0; x < this._iSectorCountX; ++x) {
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
		        pSection._createRenderable();

		        pSection.getRenderable().renderMethod = pRenderMethod;

		        this.connect(pSection.getRenderable().getTechnique(), SIGNAL(render), SLOT(_onRender), EEventTypes.UNICAST);
		    }
		}

		protected _buildHeightAndNormalTables(pImageHightMap: IImg, pImageNormalMap: IImg): void {
			    var fHeight: float = 0;
			    var iComponents: uint = 4;
			    this._pHeightTable = null;


			    var iMaxY: uint = this._iTableHeight;
			    var iMaxX: uint = this._iTableWidth;

			    //trace("Terraim Map Size ", iMaxX, iMaxY);

			    var pColorData: Uint8Array = new Uint8Array(4 * iMaxY * iMaxX);
			    this._pHeightTable = new Array(iMaxX * iMaxY); /*float*/

			    // first, build a table of heights
			    if (pImageHightMap.isResourceLoaded()) {
			        if(pImageHightMap.width !== iMaxX && pImageHightMap.height !== iMaxY){
			        	WARNING("Размеры карты высот не совпадают с другими размерами. Нужно: " + 
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
			    }
			    else {
			        WARNING("Карта высот не загружена")
			    }

			    if (pImageNormalMap.isResourceLoaded()) {
			    	this._pNormalMap = this._pEngine.getResourceManager().createTexture(".terrain-normal-texture" + sid());
			        this._pNormalMap.loadImage(pImageNormalMap);
			        this._pNormalImage = pImageNormalMap;
			    }
			    else {
			        WARNING("Карта нормалей не загружена")
			    }
		}

		readWorldHeight(iIndex: uint): float;
		readWorldHeight(iMapX: uint, iMapY: uint): float;
		readWorldHeight(iMapX: any, iMapY?: uint): float {
			if (arguments.length == 2) {
			    if (iMapX >= this._iTableWidth) {
			        iMapX = this._iTableWidth - 1;
			    }
			    if (iMapY >= this._iTableHeight) {
			        iMapY = this._iTableHeight - 1;
			    }

			    return this._pHeightTable[(iMapY * this._iTableWidth) + iMapX];
			}
			else {
			    var iMapIndex: uint = iMapX;
			    ASSERT(iMapIndex < this._iTableWidth * this._iTableHeight, "invalid index");
			    return this._pHeightTable[iMapIndex];
			}
		}

		protected _tableIndex(iMapX: uint, iMapY: uint): uint {
			// clamp to the table dimensions
			if (iMapX >= this._iTableWidth) {
			    iMapX = this._iTableWidth - 1;
			}
			if (iMapY >= this._iTableHeight) {
			    iMapY = this._iTableHeight - 1;
			}

			return (iMapY * this._iTableWidth) + iMapX;
		}

		readWorldNormal(v3fNormal: IVec3, iMapX: uint, iMapY: uint): IVec3{
			if (iMapX >= this._pNormalImage.width) {
			    iMapX = this._pNormalImage.width - 1;
			}
			if (iMapY >= this._pNormalImage.height) {
			    iMapY = this._pNormalImage.height - 1;
			}


			// var iOffset: uint = this._pNormalImage.getPixelRGBA(iMapX, iMapY, 1, 1, this._pTempNormalColor)
			this._pNormalImage.getColorAt(this._pTempNormalColor, iMapX, iMapY);
			v3fNormal.set(this._pTempNormalColor.r,
			              this._pTempNormalColor.g,
			              this._pTempNormalColor.b)
			return v3fNormal;
		}

		calcWorldHeight(fWorldX: float, fWorldY: float): float {
			var fMapX: float = (fWorldX - this._pWorldExtents.x0) / this._pWorldExtents.sizeX();
			var fMapY: float = (fWorldY - this._pWorldExtents.y0) / this._pWorldExtents.sizeY();

			return this._calcMapHeight(fMapX, fMapY);
		}

		calcWorldNormal(v3fNormal: IVec3, fWorldX: float, fWorldY: float): IVec3 {
			var fMapX: float = (fWorldX - this._pWorldExtents.x0) / this._pWorldExtents.sizeX();
			var fMapY: float = (fWorldY - this._pWorldExtents.y0) / this._pWorldExtents.sizeY();

			return this._calcMapNormal(v3fNormal, fMapX, fMapY);
		}

		/**
		 * Вычисляет высоту в координатах от 0 до 1
		 */
		protected _calcMapHeight(fMapX: float, fMapY: float): float {
		    var fTempMapX: float = fMapX * (this._iTableWidth - 1);
		    var fTempMapY: float = fMapY * (this._iTableHeight - 1);

		    var iMapX0: int = math.floor(fTempMapX);
		    var iMapY0: int = math.floor(fTempMapY);

		    fTempMapX -= iMapX0;
		    fTempMapY -= iMapY0;

		    iMapX0 = math.clamp(iMapX0, 0, this._iTableWidth - 1);
		    iMapY0 = math.clamp(iMapY0, 0, this._iTableHeight - 1);

		    var iMapX1: int = math.clamp(iMapX0 + 1, 0, this._iTableWidth - 1);
		    var iMapY1: int = math.clamp(iMapY0 + 1, 0, this._iTableHeight - 1);

		    // read 4 map values
		    var fH0: float = this.readWorldHeight(iMapX0, iMapY0);
		    var fH1: float = this.readWorldHeight(iMapX1, iMapY0);
		    var fH2: float = this.readWorldHeight(iMapX0, iMapY1);
		    var fH3: float = this.readWorldHeight(iMapX1, iMapY1);

		    var fAvgLo: float = (fH1 * fTempMapX) + (fH0 * (1.0 - fTempMapX));
		    var fAvgHi: float = (fH3 * fTempMapX) + (fH2 * (1.0 - fTempMapX));

		    return (fAvgHi * fTempMapY) + (fAvgLo * (1.0 - fTempMapY));
		}

		/**
		 * Вычисляет нормаль в координатах от 0 до 1
		 */
		protected _calcMapNormal(v3fNormal: IVec3, fMapX: float, fMapY: float): IVec3 {
		    var fTempMapX: float = fMapX * (this._pNormalMap.width - 1);
	        var fTempMapY: float = fMapY * (this._pNormalMap.height - 1);
	        //console.log(fTempMapX,fTempMapY)


	        var iMapX0: uint = math.floor(fTempMapX);
	        var iMapY0: uint = math.floor(fTempMapY);

	        fTempMapX -= iMapX0;
	        fTempMapY -= iMapY0;

	        iMapX0 = math.clamp(iMapX0, 0, this._pNormalMap.width - 1);
	        iMapY0 = math.clamp(iMapY0, 0, this._pNormalMap.height - 1);

	        var iMapX1: uint = math.clamp(iMapX0 + 1, 0, this._pNormalMap.width - 1);
	        var iMapY1: uint = math.clamp(iMapY0 + 1, 0, this._pNormalMap.height - 1);

	        // read 4 map values
	        var v3fH0: IVec3 = math.vec3();
	        this.readWorldNormal(v3fH0, iMapX0, iMapY0);

	        var v3fH1: IVec3 = math.vec3();
	        this.readWorldNormal(v3fH1, iMapX1, iMapY0);

	        var v3fH2: IVec3 = math.vec3();
	        this.readWorldNormal(v3fH2, iMapX0, iMapY1);

	        var v3fH3: IVec3 = math.vec3();
	        this.readWorldNormal(v3fH3, iMapX1, iMapY1);

	        var v3fAvgLo: IVec3 = math.vec3();
	        v3fAvgLo.set(v3fH1.scale(fTempMapX));
	        v3fAvgLo.add(v3fH0.scale(1.0 - fTempMapX));

	        var v3fAvgHi: IVec3 = math.vec3();
	        v3fAvgHi.set(v3fH3.scale(fTempMapX))
	        v3fAvgHi.add(v3fH2.scale(1.0 - fTempMapX));

	        v3fNormal.set(v3fAvgHi.scale(fTempMapY));
	        v3fNormal.add(v3fAvgLo.scale(1.0 - fTempMapY));
	        v3fNormal.normalize();

	        return v3fNormal;
		}

		protected _generateTerrainImage(pTerrainImage: IImg, pTextureList: any, iTextureCount: int): void {
			CRITICAL_ERROR("нехуй");
		    var bSuccess: bool = false;
		    var x: int, y: int, i: int;

		    var iImage_width: int = pTerrainImage.width;
		    var iImage_height: int = pTerrainImage.height;

		    var fUStep: float = 1.0 / (iImage_width - 1);
		    var fVStep: float = 1.0 / (iImage_height - 1);

		    //sample_data* pSamples = new sample_data[iTextureCount];
		    var pSamples: ITerrainSampleData[] = new Array(iTextureCount);

		    // lock all the textures we need
		    // pTerrainImage.lock();
		    /*for (i = 0; i < iTextureCount; ++i) {
		        pTextureList[i].pImage.lock();
		    }*/

		    // step through and generate each pixel
		    for (y = 0; y < iImage_height; ++y) {
		        for (x = 0; x < iImage_width; ++x) {
		            var fU: float = x * fUStep;
		            var fV: float = y * fVStep;


		            var fTotalBlend: float = 0.0;
		            var fMap_height: float = this._calcMapHeight(fU, fV);
		            var v3fNormal: IVec3 = new Vec3();
		            this._calcMapNormal(v3fNormal, fU, fV);

		            // examine each elevation set
		            for (i = 0; i < iTextureCount; ++i) {
		                // how much of this texture do we want?
		                var fElevationScale: float = 0.0;
		                var fSlopeScale: float = 0.0;

		                if (fMap_height >= pTextureList[i].elevation.minElevation
		                    && fMap_height <= pTextureList[i].elevation.maxElevation) {
		                    var fSpan: float = pTextureList[i].elevation.maxElevation - pTextureList[i].elevation.minElevation;
		                    fElevationScale = fMap_height - pTextureList[i].elevation.minElevation;
		                    fElevationScale *= 1.0 / fSpan;
		                    fElevationScale -= 0.5;
		                    fElevationScale *= 2.0;
		                    fElevationScale *= fElevationScale;
		                    fElevationScale = 1.0 - fElevationScale;
		                }

		                if (v3fNormal.z >= pTextureList[i].elevation.minNormalZ
		                    && v3fNormal.z <= pTextureList[i].elevation.maxNormalZ) {
		                    var fSpan: float = pTextureList[i].elevation.maxNormalZ - pTextureList[i].elevation.minNormalZ;
		                    fSlopeScale = v3fNormal.z - pTextureList[i].elevation.minNormalZ;
		                    fSlopeScale *= 1.0 / fSpan;
		                    fSlopeScale -= 0.5;
		                    fSlopeScale *= 2.0;
		                    fSlopeScale *= fSlopeScale;
		                    fSlopeScale = 1.0 - fSlopeScale;
		                }
		                pSamples[i] = {
		                	fScale: 0, 
		                	iColor: 0
		                }
		                pSamples[i].fScale = pTextureList[i].elevation.strength * fElevationScale * fSlopeScale;
		                fTotalBlend += pSamples[i].fScale;

		                //pTextureList[i] = new cTerrain.terrainTextureData()
		                pTextureList[i].pImage.sampleColor(
		                    fU * pTextureList[i].fUvScale,
		                    fV * pTextureList[i].fUvScale,
		                    pSamples[i].iColor);
		            }

		            // balance the data (so they add up to 1.0f)
		            var fBlendScale: float = 1.0 / fTotalBlend;

		            // now compute the actual color
		            var fRed: float = 0.0;
		            var fGreen: float = 0.0;
		            var fBlue: float = 0.0;
		            var fAlpha: float = 0.0;

		            for (i = 0; i < iTextureCount; ++i) {
		                var fScale: float = pSamples[i].fScale * fBlendScale;

		                fBlue += ( pSamples[i].iColor & 0xff) * fScale;
		                fGreen += ((pSamples[i].iColor >> 8) & 0xff) * fScale;
		                fRed += ((pSamples[i].iColor >> 16) & 0xff) * fScale;
		                fAlpha += ((pSamples[i].iColor >> 24) & 0xff) * fScale;
		            }

		            var fR: float = math.clamp(fRed, 0.0, 255.0)   / 255.;
		            var fG: float = math.clamp(fGreen, 0.0, 255.0) / 255.;
		            var fB: float = math.clamp(fBlue, 0.0, 255.0)  / 255.;
		            var fA: float = math.clamp(fAlpha, 0.0, 255.0) / 255.;

		            this._pTempNormalColor.set(fR, fG, fB, fA);
		            pTerrainImage.setColorAt(this._pTempNormalColor, x, y);
		        }
		    }

		    // unlock all the images
		    /*pTerrainImage.unlock();
		    for (i = 0; i < iTextureCount; ++i) {
		        pTextureList[i].pImage.unlock();
		    }*/
		}

		protected _computeWeight(fValue: float, fMinExtent: float, fMaxExtent: float): float {
			CRITICAL_ERROR("нехуй");
		    var fWeight: float = 0.0;

		    if (fValue >= fMinExtent && fValue <= fMaxExtent) {

		        var fSpan: float = fMaxExtent - fMinExtent;
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
		        fWeight = 1.0 - math.absoluteValue(fWeight);
		        fWeight = math.clamp(fWeight, 0.001, 1.0);
		    }

		    return fWeight;
		}


		//Как сварить борщ
		protected _generateBlendImage(pBlendImage, pElevationData, iElevationDataCount: int, fnCallback) {
			//Ингредиенты

			//1 кг говядины (мякоть или на косточке)
			//500 г картофеля
			//300 г свежей капусты
			//400 г свеклы
			//200 г моркови
			//200 г лука
			//3 ст.л. томатной пасты
			//1 ч.л. уксуса 6%
			//2-3 зубчика чеснока
			//2-3 лавровых листа
			//соль
			//перец
			//растительное масло
			//зелень по вкусу
			CRITICAL_ERROR("нехуй");
		    var bSuccess: bool = false;
		    var x: int, y: int, i: int;

		    var pColor: Uint8Array = new Uint8Array(4);

		    ASSERT(pBlendImage != null, "pBlendImage is not valid");

		    //Мясо залить водой, варить 1.5 часа.
		    iElevationDataCount = math.min(iElevationDataCount, 4);

		    // Затем мясо нарезать небольшими кусочками.
		    var iImg_width: int = pBlendImage.getWidth();
		    var iImg_height: int = pBlendImage.getHeight();

		    // Добавить в бульон.
		    // Лук мелко покрошить.
		    var fUStep: float = 1.0 / (iImg_width - 1);
		    var fVStep: float = 1.0 / (iImg_height - 1);

		    // Морковь натереть на средней терке.
		    // Капусту нашинковать тонкой соломкой.
		    // Свеклу нарезать тонкой соломкой.
		    var v4fMask: IVec4[] = new Array(4);

		    v4fMask[0] = new Vec4();
		    v4fMask[0].set(1.0, 0.0, 0.0, 0.0);

		    v4fMask[1] = new Vec4();
		    v4fMask[1].set(0.0, 1.0, 0.0, 0.0);

		    v4fMask[2] = new Vec4();
		    v4fMask[2].set(0.0, 0.0, 1.0, 0.0);

		    v4fMask[3] = new Vec4();
		    v4fMask[3].set(0.0, 0.0, 0.0, 1.0);

		    for (y = 0; y < iImg_height; y++) {
		        for (x = 0; x < iImg_width; x++) {
		            var fTotalBlend: float = 0.0;
		            var v4fBlendFactors: IVec4 = new Vec4();
		            v4fBlendFactors.set(0.0, 0.0, 0.0, 0.0);
		            if (iElevationDataCount == 3) {
		                v4fBlendFactors.w = 255;
		            }

		            // Свеклу обжарить на растительном масле.
		            var fU: float = x * fUStep;
		            var fV: float = y * fVStep;
		            var fMap_height: float = this._calcMapHeight(fU, fV);

		            var v3fNormal: IVec3 = new Vec3();
		            var v4fTemp: IVec4 = new Vec4();
		            this._calcMapNormal(v3fNormal, fU, fV);

		            // Добавить уксус и томатную пасту (если паста густая, 
		            //	добавить немного воды), тушить 5-7 минут.
		            // 
		            for (i = 0; i < iElevationDataCount; ++i) {
		                // На растительном масле обжарить лук.
		                var fElevationScale: float = this._computeWeight(fMap_height,
		                                                         pElevationData[i].fMinElevation,
		                                                         pElevationData[i].fMaxElevation);

		                // Добавить морковь, обжарить.
		                var fSlopeScale: float = this._computeWeight(v3fNormal.z,
		                                                     pElevationData[i].fMinNormalZ, pElevationData[i].fMaxNormalZ);

		                // Картофель нарезать кубиками или брусочками.
		                // В кипящий бульон добавить картофель, посолить.
		                var fScale: float = pElevationData[i].fStrength * fElevationScale * fSlopeScale;

		                // Когда бульон закипит, добавить капусту. Варить на небольшом огне 5 минут.
		                // Добавить свеклу, варить еще около 10 минут.
		                v4fTemp.set(v4fMask[i]);
		                v4fTemp.scale(fScale)
		                v4fBlendFactors.add(v4fTemp);
		                //v4fBlendFactors += v4fMask[i] * fScale;

		                // Добавить лук и морковь.
		                fTotalBlend += fScale;
		            }

		            // Следом добавить лавровый лист. Если необходимо, посолить, поперчить.
		            var fBlendScale: float = 255.0 / fTotalBlend;

		            // Добавить чеснок, выдавленный через чеснокодавку.
					// Убрать с огня, дать настояться 15-20 минут. 
		            // by the blend fScale
		            v4fBlendFactors.scale(fBlendScale)

		            // Готовый борщ разлить по тарелкам, добавить сметану и посыпать зеленью.
		            pColor[0] = math.clamp(v4fBlendFactors.x, 0.0, 255.0);
		            pColor[1] = math.clamp(v4fBlendFactors.y, 0.0, 255.0);
		            pColor[2] = math.clamp(v4fBlendFactors.z, 0.0, 255.0);
		            pColor[3] = math.clamp(v4fBlendFactors.w, 0.0, 255.0);
		            //так как текстура перевернута
		            pBlendImage.setPixelRGBA(x, iImg_height - y - 1, pColor); 
		        }
		    }
		    // Приятного аппетита!
		}
		//Спасибо большое за рецепт. Все изложено по порядку, думаю очень вкусно получится. Завтра приготовлю мужу на обед.
		//спасибо, очень вкусно получилось, хотя борщ варила первый раз.



		
		protected _setTessellationParameters(fScale: float, fLimit: float) {
		    this._fScale = fScale;
		    this._fLimit = fLimit;
		}

		/**
		 * Подготовка терраина к рендерингу.
		 */
		prepareForRender(pViewport: IViewport): void {
			this._pMegaTexures.prepareForRender(pViewport);
		}
		/**
		 * Сброс параметров.
		 */
		reset(): void {

		}
		/**
		 * Обработка пользовательского ввода.
		 */
		readUserInput(): void {
			/*//+
			if (this._pEngine.pKeymap.isKeyPress(a.KEY.ADD)) 
			{
			    this._fLimit += 0.0001;
			}
			//-
			else if (this._pEngine.pKeymap.isKeyPress(a.KEY.SUBTRACT)) 
			{
			    this._fLimit -= 0.0001;
			}

			//*
			if (this._pEngine.pKeymap.isKeyPress(a.KEY.MULTIPLY)) 
			{
			    this._fScale += 0.0001;
			}
			// /
			else if (this._pEngine.pKeymap.isKeyPress(a.KEY.DIVIDE))  
			{
			    this._fScale -= 0.0001;
			}*/


			if (this._fLimit < 0.001) {
			    this._fLimit = 0.001;
			}
			if (this._fScale < 0.001) {
			    this._fScale = 0.001;
			}

			document.getElementById('setinfo4').innerHTML = "fScale1 " + this._fScale;
			document.getElementById('setinfo5').innerHTML = "fLimit1 " + this._fLimit;
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
		}

		_onRender(pTechnique: IRenderTechnique, iPass: uint): void {
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			pPass.setTexture("TEXTURE6", this._pNormalMap);
			pPass.setSamplerTexture("S_NORMAL", "TEXTURE6");

			this._pMegaTexures.applyForRender(pPass);
		}
	}
}

#endif



