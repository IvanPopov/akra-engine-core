// AIStringDictionary interface
// [write description here...]

module akra {
interface AIStringDictionary {
	add(sEntry: string): uint;
	index(sEntry: string): uint;
	findEntry(iIndex: string): string;
}
}
