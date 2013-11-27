// AIVec2 interface
// [write description here...]


interface AIVec2Constructor {
	();
	(fValue: float);
	(v2fVec: AIVec2);
	(pArray: float[]);
	(fValue1: float, fValue2: float);
}


interface AIVec2 {
	x: float;
	y: float;

    /*represents two-component vector from original vector*/
    xx: AIVec2;
    /*represents two-component vector from original vector*/
    xy: AIVec2;
    /*represents two-component vector from original vector*/
    yx: AIVec2;
    /*represents two-component vector from original vector*/
    yy: AIVec2;
	
	set(): AIVec2;
	set(fValue: float): AIVec2;
	set(v2fVec: AIVec2): AIVec2;
	set(pArray: float[]): AIVec2;
	set(fValue1: float, fValue2: float): AIVec2;

	clear(): AIVec2;

	add(v2fVec: AIVec2, v2fDestination?: AIVec2): AIVec2;
	subtract(v2fVec: AIVec2, v2fDestination?: AIVec2): AIVec2;
	dot(v2fVec: AIVec2): float;

	isEqual(v2fVec: AIVec2, fEps?: float): boolean;
	isClear(fEps?: float): boolean;

	negate(v2fDestination?: AIVec2): AIVec2;
	scale(fScale: float, v2fDestination?: AIVec2): AIVec2;
	normalize(v2fDestination?: AIVec2): AIVec2;
	length(): float;
	lengthSquare(): float;
	

	direction(v2fVec: AIVec2, v2fDestination?: AIVec2): AIVec2;

	mix(v2fVec: AIVec2, fA: float, v2fDestination?: AIVec2): AIVec2;

	toString(): string;
}


declare var vec2: AIVec2Constructor;