

/// <reference path="ISprite.ts" />
/// <reference path="IRenderData.ts" />

module akra {
	export interface ISpriteManager {
		_allocateSprite(pSprite: ISprite): IRenderData;
	}
}
