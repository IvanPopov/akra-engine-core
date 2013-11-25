

/// <reference path="ISprite.ts" />
/// <reference path="IRenderData.ts" />

module akra {
	interface ISpriteManager {
		_allocateSprite(pSprite: ISprite): IRenderData;
	}
}
