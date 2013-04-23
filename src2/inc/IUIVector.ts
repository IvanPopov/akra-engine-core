#ifndef IUIVECTOR_TS
#define IUIVECTOR_TS

#include "IUIComponent.ts"

module akra {
	IFACE(IVec2);
	IFACE(IVec3);
	IFACE(IVec4);

	export interface IUIVector extends IUIComponent {
		readonly x: IUILabel;
		readonly y: IUILabel;
		readonly z: IUILabel;
		readonly w: IUILabel;

		readonly totalComponents: uint;

		value: any;
		
		toVec2(): IVec2;
		toVec3(): IVec3;
		toVec4(): IVec4;

		setVec2(v: IVec2): void;
		setVec3(v: IVec3): void;
		setVec4(v: IVec4): void;

		isEditable(): bool;
		editable(bValue?: bool): void;
	}
}

#endif
