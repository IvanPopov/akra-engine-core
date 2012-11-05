#ifndef IBUFFERDATAMODIFIER_TS
#define IBUFFERDATAMODIFIER_TS

module akra {
	export interface IBufferDataModifier {
		(pData: ArrayBufferView): void;
	}
}

#endif