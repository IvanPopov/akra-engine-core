#ifndef ISTRINGDICTIONARY_TS
#define ISTRINGDICTIONARY_TS

module akra {
	export interface IStringDictionary {
		add(sEntry: string): uint;
		index(sEntry: string): uint;
		findEntry(iIndex: string): string;
	}
}

#endif