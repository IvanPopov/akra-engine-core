interface String {
	toUTF8(): string;
	fromUTF8(): string;
	
	md5(): string;
	sha1(): string;
	crc32(): string;
	replaceAt(n: int, s: string);
}

interface Array {
    last: any;
    first: any;
    el(i :int): any;
    clear(): any[];
    swap(i: int, j: int): any[];
    insert(elements: any[]): any[];
}

interface Number {
	toHex(length: int): string;
	printBinary(isPretty?: bool);
}

