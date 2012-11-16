#ifndef IHARDWAREBUFFER_TS
#define IHARDWAREBUFFER_TS

#include "IHardwareObject.ts"

module akra {

	export enum EBufferFlags {
		MANY_UPDATES = 0,
		MANY_DRAWS,
		READABLE,
		RAM_BACKUP,
		SOFTWARE,
		ALIGNMENT
	}

	export interface IHardwareBuffer extends IHardwareObject {
		activate(): void;
		deactivate(): void;

		setData(size: uint, usage: int): void;
		setData(data: ArrayBufferView, usage: int): void;
		setData(data: ArrayBuffer, usage: int): void;

		setSubData(offset: uint, data: ArrayBufferView): void;
		setSubData(offset: uint, data: ArrayBuffer): void;

		getParameter(eParam: int): any;
	}

}

#endif

