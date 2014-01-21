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
				this._pDataFactory.getEmptyRenderData(EPrimitiveTypes.TRIANGLESTRIP, 0);

			this._pSprites.push(pSprite);

			return pDataSubset;
		}
	}

	export class Sprite extends SceneObject implements ISprite {

		protected _pManager: ISpriteManager;
		protected _pRenderable: IRenderableObject;

		 get totalRenderable(): uint { return 1; }
		 get manager(): ISpriteManager { return this._pManager; }

		constructor(pScene: IScene3d) {
			super(pScene, EEntityTypes.SPRITE);

			var pEngine: IEngine = pScene.getManager().getEngine();
			var pRsmgr: IResourcePoolManager = pEngine.getResourceManager();
			var pManager: ISpriteManager = pEngine.getSpriteManager();
			var pRenderer: IRenderer = pEngine.getRenderer();
			var pRenderable: IRenderableObject = new render.RenderableObject(ERenderableTypes.SPRITE);
			
			pRenderable._setup(pRenderer);

			var iGuid: uint = this.guid;
			var pRenderMethod: IRenderMethod = pRenderable.renderMethod;
			var pEffect: IEffect = pRenderMethod.effect;

			pEffect.addComponent("akra.system.mesh_texture");

			pRenderable.getTechnique().setMethod(pRenderMethod);

			this._pManager = pManager;
			this._pRenderable = pRenderable;

			this.create(2, 2);
		}

		create(fSizeX: float = 2, fSizeY: float = 2): boolean {
			super.create();
			//4 vertex * (4 coords + 3 texcoords)
			var pGeometry = new Float32Array(4 * 4);
			var pTexCoords = new Float32Array(4 * 3);
			var pNormals = new Float32Array([0., 0., 1., 0.]);

			for (var i = 0; i < 4; i ++) {
				//-1, -1, -1, 1, 1, -1, 1, 1
				//0, 0, 0, 1, 1, 0, 1, 1
				var signX: int = math.floor(i / 2) * 2 - 1;
				var signY: int = (i % 2) * 2 - 1;

				pGeometry[4 * i    ] = signX * fSizeX / 2;
				pGeometry[4 * i + 1] = signY * fSizeY / 2;
				pGeometry[4 * i + 2] = 0;
				pGeometry[4 * i + 3] = 0;

				pTexCoords[3 * i + 0] = (signX + 1) / 2;
				pTexCoords[3 * i + 1] = (signY + 1) / 2;
				pTexCoords[3 * i + 2] = 0;
			}

			var fMaxSize = (fSizeX > fSizeY) ? fSizeX : fSizeY;

			this.accessLocalBounds().set(fMaxSize, fMaxSize, fMaxSize);
			
			var pData: IRenderData = this.manager._allocateSprite(this);
			
			pData.allocateData([VE.float4("POSITION")], pGeometry);
			pData.allocateData([VE.float3("TEXCOORD0")], pTexCoords);
			pData.allocateData([VE.float4("NORMAL")], pNormals);
			pData.allocateIndex([VE.float('INDEX0')], new Float32Array([0,1,2,3]));
			pData.allocateIndex([VE.float('INDEX1')], new Float32Array([0,1,2,3]));
			pData.allocateIndex([VE.float('INDEX2')], new Float32Array([0,0,0,0]));
			pData.index('POSITION', 'INDEX0');
			pData.index('TEXCOORD0', 'INDEX1');
			pData.index('NORMAL', 'INDEX2');

			this._pRenderable._setRenderData(pData);
			
			return true;
		}

		setTexture(pTex: ITexture): void {
			var pSurfaceMaterial: ISurfaceMaterial = this._pRenderable.surfaceMaterial;
			pSurfaceMaterial.setTexture(ESurfaceMaterialTextures.EMISSIVE, pTex, 0);

			(<IColor>pSurfaceMaterial.material.emissive).set(0.);
			(<IColor>pSurfaceMaterial.material.diffuse).set(0.);
			(<IColor>pSurfaceMaterial.material.ambient).set(0.);
			(<IColor>pSurfaceMaterial.material.specular).set(0.);

			this._pRenderable.wireframe(true);
		}

		getRenderable(): IRenderableObject {
			return this._pRenderable;
		}		
	}
}

