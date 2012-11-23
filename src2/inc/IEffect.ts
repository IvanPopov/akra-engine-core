#ifndef IEFFECT_TS
#define IEFFECT_TS

module akra {
		
	IFACE(IAFXComponent);

	export interface IEffect extends IResourcePoolItem {
		totalComponents: uint;
		totalPasses: uint;

		isEqual(pEffect: IEffect): bool;
		isReplicated(): bool;
		isMixid(): bool;
		isParameterUsed(pParam: any, iPass?: uint): bool;

		create(): void;
		replicable(bValue: bool): void;
		miscible(bValue: bool): void;

		getComponent(i: int): IAFXComponent;
		addComponent(iComponentHandle: int, nShift?: uint, isSet?: bool): bool;
		addComponent(pComponent: IAFXComponent, nShift?: uint, isSet?: bool): bool;
		addComponent(sComponent: string, nShift?: uint, isSet?: bool): bool;
		delComponent(iComponentHandle: int, nShift?: uint, isSet?: bool): bool;
		delComponent(sComponent: string, nShift?: uint, isSet?: bool): bool;
		delComponent(pComponent: IAFXComponent, nShift?: uint, isSet?: bool): bool;

		findParameter(pParam: any, iPass?: uint): any;
	}
}

#endif