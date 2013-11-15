// AISprite interface
// [write description here...]

/// <reference path="AISceneObject.ts" />


/// <reference path="AITexture.ts" />

interface AISprite extends AISceneObject {
	setTexture(pTex: AITexture): void;
}