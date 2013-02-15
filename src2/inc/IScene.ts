#ifndef ISCENE_TS
#define ISCENE_TS

#include "IEventProvider.ts"
#include "ISceneManager.ts"

module akra {
	export enum ESceneTypes {
		TYPE_3D,
		TYPE_2D
	}

	export interface IScene extends IEventProvider {
		type: ESceneTypes;

		getManager(): ISceneManager;
	}
}

#endif