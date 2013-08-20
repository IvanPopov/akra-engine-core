#ifndef IPOSITIONFRAME_TS
#define IPOSITIONFRAME_TS

#include "IFrame.ts"

module akra {
	IFACE(IQuat4);
	IFACE(IVec3);
	IFACE(IMat4);

	export interface IPositionFrame extends IFrame {
		readonly rotation: IQuat4;
		readonly scale: IVec3;
		readonly translation: IVec3;

		toMatrix(): IMat4;
	}
}

#endif

