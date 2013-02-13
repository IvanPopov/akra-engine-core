#ifndef EFFECT_TS
#define EFFECT_TS

#include "IEffect.ts"
#include "../ResourcePoolItem.ts"

module akra.core.pool.resources {
	export class Effect implements IEffect extends ResourcePoolItem {
		totalComponents: uint;
		totalPasses: uint;

		isEqual(pEffect: IEffect): bool {return false;}
		isReplicated(): bool {return false;}
		isMixid(): bool {return false;}
		isParameterUsed(pParam: any, iPass?: uint): bool {return false;}

		create(): void {return;}
		replicable(bValue: bool): void {return;}
		miscible(bValue: bool): void {return;}

		getComponent(i: int): IAFXComponent {return null;}
		addComponent(iComponentHandle: int, nShift?: uint, isSet?: bool): bool;
		addComponent(pComponent: IAFXComponent, nShift?: uint, isSet?: bool): bool;
		addComponent(sComponent: string, nShift?: uint, isSet?: bool): bool;
		addComponent(sComponent: any, nShift?: uint, isSet?: bool): bool  {return false;}
		delComponent(iComponentHandle: int, nShift?: uint, isSet?: bool): bool;
		delComponent(sComponent: string, nShift?: uint, isSet?: bool): bool;
		delComponent(pComponent: IAFXComponent, nShift?: uint, isSet?: bool): bool;
		delComponent(pComponent: any, nShift?: uint, isSet?: bool): bool {return false;}

		findParameter(pParam: any, iPass?: uint): any {return null;}
	}
}

#endif