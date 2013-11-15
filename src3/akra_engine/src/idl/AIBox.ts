// AIBox interface
// [write description here...]

interface AIBox {
	width: uint;
	height: uint;
	depth: uint;

	left: uint;
	top: uint;
	right: uint;
	bottom: uint;
	front: uint;
	back: uint;

	contains(pDest: AIBox): boolean;
	isEqual(pDest: AIBox): boolean;
	setPosition(iLeft: uint, iTop: uint, iWidth: uint, iHeight: uint, iFront?: uint, iDepth?: uint): void;

	toString(): string;
}

