// AIVec3 interface
// [write description here...]

/// <reference path="AIVec2.ts" />
/// <reference path="AIMat4.ts" />

interface AIVec3Constructor {
    ();
    (fValue: float);
    (v3fVec: AIVec3);
    (pArray: float[]);
    (fValue: float, v2fVec: AIVec2);
    (v2fVec: AIVec2, fValue: float);
    (fValue1: float, fValue2: float, fValue3: float);
}


interface AIVec3 {
    x: float;
    y: float;
    z: float;

    /*represents two-component vector from original vector*/
    xx: AIVec2;
    /*represents two-component vector from original vector*/
    xy: AIVec2;
    /*represents two-component vector from original vector*/
    xz: AIVec2;
    /*represents two-component vector from original vector*/
    yx: AIVec2;
    /*represents two-component vector from original vector*/
    yy: AIVec2;
    /*represents two-component vector from original vector*/
    yz: AIVec2;
    /*represents two-component vector from original vector*/
    zx: AIVec2;
    /*represents two-component vector from original vector*/
    zy: AIVec2;
    /*represents two-component vector from original vector*/
    zz: AIVec2;

    /*represents three-component vector from original vector*/
    xxx: AIVec3;
    /*represents three-component vector from original vector*/
    xxy: AIVec3;
    /*represents three-component vector from original vector*/
    xxz: AIVec3;
    /*represents three-component vector from original vector*/
    xyx: AIVec3;
    /*represents three-component vector from original vector*/
    xyy: AIVec3;
    /*represents three-component vector from original vector*/
    xyz: AIVec3;
    /*represents three-component vector from original vector*/
    xzx: AIVec3;
    /*represents three-component vector from original vector*/
    xzy: AIVec3;
    /*represents three-component vector from original vector*/
    xzz: AIVec3;
    /*represents three-component vector from original vector*/
    yxx: AIVec3;
    /*represents three-component vector from original vector*/
    yxy: AIVec3;
    /*represents three-component vector from original vector*/
    yxz: AIVec3;
    /*represents three-component vector from original vector*/
    yyx: AIVec3;
    /*represents three-component vector from original vector*/
    yyy: AIVec3;
    /*represents three-component vector from original vector*/
    yyz: AIVec3;
    /*represents three-component vector from original vector*/
    yzx: AIVec3;
    /*represents three-component vector from original vector*/
    yzy: AIVec3;
    /*represents three-component vector from original vector*/
    yzz: AIVec3;
    /*represents three-component vector from original vector*/
    zxx: AIVec3;
    /*represents three-component vector from original vector*/
    zxy: AIVec3;
    /*represents three-component vector from original vector*/
    zxz: AIVec3;
    /*represents three-component vector from original vector*/
    zyx: AIVec3;
    /*represents three-component vector from original vector*/
    zyy: AIVec3;
    /*represents three-component vector from original vector*/
    zyz: AIVec3;
    /*represents three-component vector from original vector*/
    zzx: AIVec3;
    /*represents three-component vector from original vector*/
    zzy: AIVec3;
    /*represents three-component vector from original vector*/
    zzz: AIVec3;


    set(): AIVec3;
    set(fValue: float): AIVec3;
    set(v3fVec: AIVec3): AIVec3;
    set(pArray: float[]): AIVec3;
    set(fValue: float, v2fVec: AIVec2): AIVec3;
    set(v2fVec: AIVec2, fValue: float): AIVec3;
    set(fValue1: float, fValue2: float, fValue3: float): AIVec3;

    clear(): AIVec3;

    add(v3fVec: AIVec3, v3fDestination?: AIVec3): AIVec3;
    subtract(v3fVec: AIVec3, v3fDestination?: AIVec3): AIVec3;
    dot(v3fVec: AIVec3): float;
    cross(v3fVec: AIVec3, v3fDestination?: AIVec3): AIVec3;

    isEqual(v3fVec: AIVec3, fEps?: float): boolean;
    isClear(fEps?: float): boolean;

    negate(v3fDestination?: AIVec3): AIVec3;
    scale(fScale: float, v3fDestination?: AIVec3): AIVec3;
    scale(v3fScale: AIVec3, v3fDestination?: AIVec3): AIVec3;
    normalize(v3fDestination?: AIVec3): AIVec3;
    length(): float;
    lengthSquare(): float;

    direction(v3fVec: AIVec3, v3fDestination?: AIVec3): AIVec3;

    mix(v3fVec: AIVec3, fA: float, v3fDestination?: AIVec3): AIVec3;

    toString(): string;
    toArray(): float[];
    toTranslationMatrix(m4fDestination?: AIMat4);

    vec3TransformCoord(m4fTransformation: AIMat4, v3fDestination?: AIVec3): AIVec3;
}



declare var vec3: AIVec3Constructor;