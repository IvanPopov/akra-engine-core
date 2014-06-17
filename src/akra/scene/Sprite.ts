/// <reference path="../idl/ISprite.ts" />
/// <reference path="../idl/ISpriteManager.ts" />

/// <reference path="SceneObject.ts" />

/// <reference path="../render/RenderableObject.ts" />

module akra.scene {
	import VE = data.VertexElement;

	export class SpriteManager implements ISpriteManager {
		private _pEngine: IEngine;
		private _pSprites: ISprite[] = [];
		private _pDataFactory: IRenderDataCollection;

		constructor (pEngine: IEngine) {
			this._pDataFactory = pEngine.createRenderDataCollection(EHardwareBufferFlags.READABLE);
		}

		_allocateSprite(pSprite: ISprite): IRenderData {
			var pDataSubset: IRenderData = 
				this._pDataFactory.getEmptyRenderData(EPrimitiveTypes.TRIANGLESTRIP, ERenderDataBufferOptions.RD_SINGLE_INDEX);

			this._pSprites.push(pSprite);

			return pDataSubset;
		}
	}

	export class Sprite extends SceneObject implements ISprite {

		protected _pManager: ISpriteManager;
		protected _pRenderable: IRenderableObject;

		getTotalRenderable(): uint {
			return 1;
		}

		getSpriteManager(): ISpriteManager {
			return this._pManager;
		}

		constructor(pScene: IScene3d) {
			super(pScene, EEntityTypes.SPRITE);

			var pEngine: IEngine = pScene.getManager().getEngine();
			var pRsmgr: IResourcePoolManager = pEngine.getResourceManager();
			var pManager: ISpriteManager = pEngine.getSpriteManager();
			var pRenderer: IRenderer = pEngine.getRenderer();
			var pRenderable: IRenderableObject = new render.RenderableObject(ERenderableTypes.SPRITE);
			
			pRenderable._setup(pRenderer);

			var iGuid: uint = this.guid;
			var pRenderMethod: IRenderMethod = pRenderable.getRenderMethod();
			var pEffect: IEffect = pRenderMethod.getEffect();

			pEffect.addComponent("akra.system.mesh_texture");

			pRenderable.getTechnique().setMethod(pRenderMethod);
			pRenderable.getTechnique().render.connect((pTech: IRenderTechnique, iPass: int, pRenderable: IRenderableObject, pSceneObject: ISceneObject, pViewport: IViewport) => {
				pTech.getPass(iPass).setUniform("USE_EMISSIVE_ALPHA", true);
			});

			this._pManager = pManager;
			this._pRenderable = pRenderable;

			this.create(2, 2);
		}

		create(fSizeX: float = 2, fSizeY: float = 2): boolean {
			super.create();
			//3 vertex  + 3 normals + 2 texcoords
			var pGeometryData = new Float32Array(4 * 8);

			for (var i = 0; i < 4; i ++) {
				//-1, -1, -1, 1, 1, -1, 1, 1
				//0, 0, 0, 1, 1, 0, 1, 1
				var signX: int = math.floor(i / 2) * 2 - 1;
				var signY: int = (i % 2) * 2 - 1;

				pGeometryData[8 * i    ] = signX * fSizeX / 2;
				pGeometryData[8 * i + 1] = signY * fSizeY / 2;
				pGeometryData[8 * i + 2] = 0;

				pGeometryData[8 * i + 3] = (signX + 1) / 2;
				pGeometryData[8 * i + 4] = (signY + 1) / 2;

				pGeometryData[8 * i + 5] = 0;
				pGeometryData[8 * i + 6] = 0;
				pGeometryData[8 * i + 7] = 1;
			}

			var fMaxSize = (fSizeX > fSizeY) ? fSizeX : fSizeY;

			this.accessLocalBounds().set(fMaxSize, fMaxSize, fMaxSize);
			
			var pData: IRenderData = this.getSpriteManager()._allocateSprite(this);
			
			pData.allocateData(data.VertexDeclaration.normalize([VE.float3('POSITION'), VE.float2('TEXCOORD0'), VE.float3('NORMAL')]), pGeometryData);

			this._pRenderable._setRenderData(pData);
			
			return true;
		}

		setTexture(pTex: ITexture): void {
			var pSurfaceMaterial: ISurfaceMaterial = this._pRenderable.getSurfaceMaterial();
			pSurfaceMaterial.setTexture(ESurfaceMaterialTextures.EMISSIVE, pTex, 0);

			(<IColor>pSurfaceMaterial.getMaterial().emissive).set(0.);
			(<IColor>pSurfaceMaterial.getMaterial().diffuse).set(0.);
			(<IColor>pSurfaceMaterial.getMaterial().ambient).set(0.);
			(<IColor>pSurfaceMaterial.getMaterial().specular).set(0.);

			this._pRenderable.wireframe(true);
		}

		getRenderable(): IRenderableObject {
			return this._pRenderable;
		}		
	}
}

