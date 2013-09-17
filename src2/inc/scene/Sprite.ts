#ifndef SPRITE_TS
#define SPRITE_TS

#include "ISprite.ts"
#include "ISpriteManager.ts"
#include "SceneObject.ts"

module akra.scene {
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
		billboard: bool = false;

		protected _pManager: ISpriteManager;
		protected _pRenderable: IRenderableObject;

		inline get totalRenderable(): uint { return 1; }
		inline get manager(): ISpriteManager { return this._pManager; }

		constructor(pScene: IScene3d) {
			super(pScene, EEntityTypes.SPRITE);

			var pEngine: IEngine = pScene.getManager().getEngine();
			var pRsmgr: IResourcePoolManager = pEngine.getResourceManager();
			var pManager: ISpriteManager = pEngine.getSpriteManager();
			var pRenderer: IRenderer = pEngine.getRenderer();
			var pRenderable: IRenderableObject = new render.RenderableObject(ERenderDataTypes.SPRITE);
			
			pRenderable._setup(pRenderer);

			var iGuid: int = this.getGuid();
			var pRenderMethod: IRenderMethod = pRenderable.renderMethod;
			var pEffect: IEffect = pRenderMethod.effect;

			pEffect.addComponent("akra.system.mesh_texture");

			pRenderable.getTechnique().setMethod(pRenderMethod);

			this._pManager = pManager;
			this._pRenderable = pRenderable;

			this.create(2, 2);
		}

		inline isBillboard(): bool {
			return this.billboard;
		}

		create(fSizeX: float = 2, fSizeY: float = 2): bool {
			super.create();
			//4 vertex * (4 coords + 3 texcoords)
			var pGeometry = new Float32Array(4 * 4);
			var pTexCoords = new Float32Array(4 * 3);

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
			
			pData.allocateData([VE_FLOAT4("POSITION")], pGeometry);
			pData.allocateData([VE_FLOAT3("TEXCOORD0")], pTexCoords);
			pData.allocateIndex([VE_FLOAT('INDEX0')], new Float32Array([0,1,2,3]));
			pData.allocateIndex([VE_FLOAT('INDEX1')], new Float32Array([0,1,2,3]));
			pData.index('POSITION', 'INDEX0');
			pData.index('TEXCOORD0', 'INDEX1');

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

#endif