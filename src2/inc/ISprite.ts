#ifndef ISPRITE_TS
#define ISPRITE_TS

#include "ISceneObject.ts"

module akra {
	IFACE(ITexture);

	export interface ISprite extends ISceneObject {
		setTexture(pTex: ITexture): void;
	}
}

#endif
