

/// <reference path="IAFXComponent.ts" />

module akra {
	export interface IEffect extends IResourcePoolItem {
		getTotalComponents(): uint;
		getTotalPasses(): uint;
	
		isEqual(pEffect: IEffect): boolean;
		isReplicated(): boolean;
		isMixid(): boolean;
		isParameterUsed(pParam: any, iPass?: uint): boolean;
	
		replicable(bValue: boolean): void;
		miscible(bValue: boolean): void;
	
		addComponent(iComponentHandle: int, iShift?: int, iPass?: uint): boolean;
		addComponent(pComponent: IAFXComponent, iShift?: int, iPass?: uint): boolean;
		addComponent(sComponent: string, iShift?: int, iPass?: uint): boolean;
	
		delComponent(iComponentHandle: int, iShift?: int, iPass?: uint): boolean;
		delComponent(sComponent: string, iShift?: int, iPass?: uint): boolean;
		delComponent(pComponent: IAFXComponent, iShift?: int, iPass?: uint): boolean;
	
		hasComponent(sComponent: string, iShift?: int, iPass?: int): boolean;
	
		activate(iShift?: int): boolean;
		deactivate(): boolean;
	
		findParameter(pParam: any, iPass?: uint): any;
	}
}
