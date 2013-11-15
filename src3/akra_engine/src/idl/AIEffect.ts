// AIEffect interface
// [write description here...]


/// <reference path="AIAFXComponent.ts" />

interface AIEffect extends AIResourcePoolItem {
	totalComponents: uint;
	totalPasses: uint;

	isEqual(pEffect: AIEffect): boolean;
	isReplicated(): boolean;
	isMixid(): boolean;
	isParameterUsed(pParam: any, iPass?: uint): boolean;

	replicable(bValue: boolean): void;
	miscible(bValue: boolean): void;

	addComponent(iComponentHandle: int, iShift?: int, iPass?: uint): boolean;
	addComponent(pComponent: AIAFXComponent, iShift?: int, iPass?: uint): boolean;
	addComponent(sComponent: string, iShift?: int, iPass?: uint): boolean;

	delComponent(iComponentHandle: int, iShift?: int, iPass?: uint): boolean;
	delComponent(sComponent: string, iShift?: int, iPass?: uint): boolean;
	delComponent(pComponent: AIAFXComponent, iShift?: int, iPass?: uint): boolean;

	hasComponent(sComponent: string, iShift?: int, iPass?: int): boolean;

	activate(iShift?: int): boolean;
	deactivate(): boolean;

	findParameter(pParam: any, iPass?: uint): any;
}