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

		addComponent(iComponentHandle: int, iShift?: int, isSet?: bool): bool;
		addComponent(pComponent: IAFXComponent, iShift?: int, isSet?: bool): bool;
		addComponent(sComponent: string, iShift?: int, isSet?: bool): bool;

		delComponent(iComponentHandle: int, iShift?: int): bool;
		delComponent(sComponent: string, iShift?: int): bool;
		delComponent(pComponent: IAFXComponent, iShift?: int): bool;

		findParameter(pParam: any, iPass?: uint): any;
	}
}

#endif