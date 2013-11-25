
/// <reference path="ISceneObject.ts" />


/// <reference path="ITexture.ts" />

module akra {
	interface ISprite extends ISceneObject {
		setTexture(pTex: ITexture): void;
	}
}
