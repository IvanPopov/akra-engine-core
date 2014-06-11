
/// <reference path="ISceneObject.ts" />


/// <reference path="ITexture.ts" />

module akra {
	export interface ISprite extends ISceneObject {
		setTexture(pTex: ITexture): void;
	}
}
