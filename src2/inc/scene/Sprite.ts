#ifndef SPRITE_TS
#define SPRITE_TS

#include "ISprite.ts"
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
		protected _pManager: ISpriteManager;
		protected _bGeometrySetted: bool = false;

		inline get manager(): ISpriteManager {
			return this._pManager;
		}

		constructor(pScene: IScene3d) {
			super(pScene, EEntityTypes.SPRITE);
			this._pManager: ISpriteManager = pScene.getManager().getEngine().getSpriteManager();
		}

		setGeometry(fSizeX: float, fSizeY: float): bool {
			ASSERT(!this._bGeometrySetted, "geometry already setted");

			var pGeometry: Float32Array = new Float32Array(12);/* 4 vertex * 3 coords = 12 */

			for (var i: int = 0; i < 4; ++ i) {
				var fSignX: float = math.floor(i / 2.) * 2. - 1.;
				var fSignY: float = (i % 2.) * 2. - 1.;

				pGeometry[3 * i] = fSignX * fSignX / 2.;
				pGeometry[3 * i + 1] = fSignY * fSizeY / 2.;
				pGeometry[3 * i + 2] = 0.;
			}

			var fMaxSize: float = (fSignX > fSignY) ? fSignX: fSignY;

			this.accessLocalBounds().set(fMaxSize, fMaxSize, fMaxSize);

			return this._setup([VE_VEC3("POSITION_OFFSET")], pGeometry);
		}
	}
}

#endif