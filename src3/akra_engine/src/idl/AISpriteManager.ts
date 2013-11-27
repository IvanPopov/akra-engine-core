// AISpriteManager interface
// [write description here...]


/// <reference path="AISprite.ts" />
/// <reference path="AIRenderData.ts" />

interface AISpriteManager {
	_allocateSprite(pSprite: AISprite): AIRenderData;
}