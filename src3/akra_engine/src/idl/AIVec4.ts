// AIVec4 interface
// [write description here...]


/// <reference path="AIVec2.ts" />
/// <reference path="AIVec3.ts" />
/// <reference path="AIColorValue.ts" />

interface AIVec4Constructor {
	();
	(fValue: float);
	(v4fVec: AIVec4);
	(pArray: float[]);
	(fValue: float, v3fVec: AIVec3);
	(v2fVec1: AIVec2, v2fVec2: AIVec2);
	(v3fVec: AIVec3, fValue: float);
	(fValue1: float, fValue2: float, v2fVec: AIVec2);
	(fValue1: float, v2fVec: AIVec2, fValue2: float);
	(v2fVec: AIVec2 ,fValue1: float, fValue2: float);
	(fValue1: float, fValue2: float, fValue3: float, fValue4: float);
}


interface AIVec4 {
	x: float;
	y: float;
	z: float;
	w: float;

    /*represents two-component vector from original vector*/
    xx: AIVec2;
    /*represents two-component vector from original vector*/
    xy: AIVec2;
    /*represents two-component vector from original vector*/
    xz: AIVec2;
    /*represents two-component vector from original vector*/
    xw: AIVec2;
    /*represents two-component vector from original vector*/
    yx: AIVec2;
    /*represents two-component vector from original vector*/
    yy: AIVec2;
    /*represents two-component vector from original vector*/
    yz: AIVec2;
    /*represents two-component vector from original vector*/
    yw: AIVec2;
    /*represents two-component vector from original vector*/
    zx: AIVec2;
    /*represents two-component vector from original vector*/
    zy: AIVec2;
    /*represents two-component vector from original vector*/
    zz: AIVec2;
    /*represents two-component vector from original vector*/
    zw: AIVec2;
    /*represents two-component vector from original vector*/
    wx: AIVec2;
    /*represents two-component vector from original vector*/
    wy: AIVec2;
    /*represents two-component vector from original vector*/
    wz: AIVec2;
    /*represents two-component vector from original vector*/
    ww: AIVec2;

    /*represents three-component vector from original vector*/
    xxx: AIVec3;
    /*represents three-component vector from original vector*/
    xxy: AIVec3;
    /*represents three-component vector from original vector*/
    xxz: AIVec3;
    /*represents three-component vector from original vector*/
    xxw: AIVec3;
    /*represents three-component vector from original vector*/
    xyx: AIVec3;
    /*represents three-component vector from original vector*/
    xyy: AIVec3;
    /*represents three-component vector from original vector*/
    xyz: AIVec3;
    /*represents three-component vector from original vector*/
    xyw: AIVec3;
    /*represents three-component vector from original vector*/
    xzx: AIVec3;
    /*represents three-component vector from original vector*/
    xzy: AIVec3;
    /*represents three-component vector from original vector*/
    xzz: AIVec3;
    /*represents three-component vector from original vector*/
    xzw: AIVec3;
    /*represents three-component vector from original vector*/
    xwx: AIVec3;
    /*represents three-component vector from original vector*/
    xwy: AIVec3;
    /*represents three-component vector from original vector*/
    xwz: AIVec3;
    /*represents three-component vector from original vector*/
    xww: AIVec3;
    /*represents three-component vector from original vector*/
    yxx: AIVec3;
    /*represents three-component vector from original vector*/
    yxy: AIVec3;
    /*represents three-component vector from original vector*/
    yxz: AIVec3;
    /*represents three-component vector from original vector*/
    yxw: AIVec3;
    /*represents three-component vector from original vector*/
    yyx: AIVec3;
    /*represents three-component vector from original vector*/
    yyy: AIVec3;
    /*represents three-component vector from original vector*/
    yyz: AIVec3;
    /*represents three-component vector from original vector*/
    yyw: AIVec3;
    /*represents three-component vector from original vector*/
    yzx: AIVec3;
    /*represents three-component vector from original vector*/
    yzy: AIVec3;
    /*represents three-component vector from original vector*/
    yzz: AIVec3;
    /*represents three-component vector from original vector*/
    yzw: AIVec3;
    /*represents three-component vector from original vector*/
    ywx: AIVec3;
    /*represents three-component vector from original vector*/
    ywy: AIVec3;
    /*represents three-component vector from original vector*/
    ywz: AIVec3;
    /*represents three-component vector from original vector*/
    yww: AIVec3;
    /*represents three-component vector from original vector*/
    zxx: AIVec3;
    /*represents three-component vector from original vector*/
    zxy: AIVec3;
    /*represents three-component vector from original vector*/
    zxz: AIVec3;
    /*represents three-component vector from original vector*/
    zxw: AIVec3;
    /*represents three-component vector from original vector*/
    zyx: AIVec3;
    /*represents three-component vector from original vector*/
    zyy: AIVec3;
    /*represents three-component vector from original vector*/
    zyz: AIVec3;
    /*represents three-component vector from original vector*/
    zyw: AIVec3;
    /*represents three-component vector from original vector*/
    zzx: AIVec3;
    /*represents three-component vector from original vector*/
    zzy: AIVec3;
    /*represents three-component vector from original vector*/
    zzz: AIVec3;
    /*represents three-component vector from original vector*/
    zzw: AIVec3;
    /*represents three-component vector from original vector*/
    zwx: AIVec3;
    /*represents three-component vector from original vector*/
    zwy: AIVec3;
    /*represents three-component vector from original vector*/
    zwz: AIVec3;
    /*represents three-component vector from original vector*/
    zww: AIVec3;
    /*represents three-component vector from original vector*/
    wxx: AIVec3;
    /*represents three-component vector from original vector*/
    wxy: AIVec3;
    /*represents three-component vector from original vector*/
    wxz: AIVec3;
    /*represents three-component vector from original vector*/
    wxw: AIVec3;
    /*represents three-component vector from original vector*/
    wyx: AIVec3;
    /*represents three-component vector from original vector*/
    wyy: AIVec3;
    /*represents three-component vector from original vector*/
    wyz: AIVec3;
    /*represents three-component vector from original vector*/
    wyw: AIVec3;
    /*represents three-component vector from original vector*/
    wzx: AIVec3;
    /*represents three-component vector from original vector*/
    wzy: AIVec3;
    /*represents three-component vector from original vector*/
    wzz: AIVec3;
    /*represents three-component vector from original vector*/
    wzw: AIVec3;
    /*represents three-component vector from original vector*/
    wwx: AIVec3;
    /*represents three-component vector from original vector*/
    wwy: AIVec3;
    /*represents three-component vector from original vector*/
    wwz: AIVec3;
    /*represents three-component vector from original vector*/
    www: AIVec3;

    /*represents four-component vector from original vector*/
    xxxx: AIVec4;
    /*represents four-component vector from original vector*/
    xxxy: AIVec4;
    /*represents four-component vector from original vector*/
    xxxz: AIVec4;
    /*represents four-component vector from original vector*/
    xxxw: AIVec4;
    /*represents four-component vector from original vector*/
    xxyx: AIVec4;
    /*represents four-component vector from original vector*/
    xxyy: AIVec4;
    /*represents four-component vector from original vector*/
    xxyz: AIVec4;
    /*represents four-component vector from original vector*/
    xxyw: AIVec4;
    /*represents four-component vector from original vector*/
    xxzx: AIVec4;
    /*represents four-component vector from original vector*/
    xxzy: AIVec4;
    /*represents four-component vector from original vector*/
    xxzz: AIVec4;
    /*represents four-component vector from original vector*/
    xxzw: AIVec4;
    /*represents four-component vector from original vector*/
    xxwx: AIVec4;
    /*represents four-component vector from original vector*/
    xxwy: AIVec4;
    /*represents four-component vector from original vector*/
    xxwz: AIVec4;
    /*represents four-component vector from original vector*/
    xxww: AIVec4;
    /*represents four-component vector from original vector*/
    xyxx: AIVec4;
    /*represents four-component vector from original vector*/
    xyxy: AIVec4;
    /*represents four-component vector from original vector*/
    xyxz: AIVec4;
    /*represents four-component vector from original vector*/
    xyxw: AIVec4;
    /*represents four-component vector from original vector*/
    xyyx: AIVec4;
    /*represents four-component vector from original vector*/
    xyyy: AIVec4;
    /*represents four-component vector from original vector*/
    xyyz: AIVec4;
    /*represents four-component vector from original vector*/
    xyyw: AIVec4;
    /*represents four-component vector from original vector*/
    xyzx: AIVec4;
    /*represents four-component vector from original vector*/
    xyzy: AIVec4;
    /*represents four-component vector from original vector*/
    xyzz: AIVec4;
    /*represents four-component vector from original vector*/
    xyzw: AIVec4;
    /*represents four-component vector from original vector*/
    xywx: AIVec4;
    /*represents four-component vector from original vector*/
    xywy: AIVec4;
    /*represents four-component vector from original vector*/
    xywz: AIVec4;
    /*represents four-component vector from original vector*/
    xyww: AIVec4;
    /*represents four-component vector from original vector*/
    xzxx: AIVec4;
    /*represents four-component vector from original vector*/
    xzxy: AIVec4;
    /*represents four-component vector from original vector*/
    xzxz: AIVec4;
    /*represents four-component vector from original vector*/
    xzxw: AIVec4;
    /*represents four-component vector from original vector*/
    xzyx: AIVec4;
    /*represents four-component vector from original vector*/
    xzyy: AIVec4;
    /*represents four-component vector from original vector*/
    xzyz: AIVec4;
    /*represents four-component vector from original vector*/
    xzyw: AIVec4;
    /*represents four-component vector from original vector*/
    xzzx: AIVec4;
    /*represents four-component vector from original vector*/
    xzzy: AIVec4;
    /*represents four-component vector from original vector*/
    xzzz: AIVec4;
    /*represents four-component vector from original vector*/
    xzzw: AIVec4;
    /*represents four-component vector from original vector*/
    xzwx: AIVec4;
    /*represents four-component vector from original vector*/
    xzwy: AIVec4;
    /*represents four-component vector from original vector*/
    xzwz: AIVec4;
    /*represents four-component vector from original vector*/
    xzww: AIVec4;
    /*represents four-component vector from original vector*/
    xwxx: AIVec4;
    /*represents four-component vector from original vector*/
    xwxy: AIVec4;
    /*represents four-component vector from original vector*/
    xwxz: AIVec4;
    /*represents four-component vector from original vector*/
    xwxw: AIVec4;
    /*represents four-component vector from original vector*/
    xwyx: AIVec4;
    /*represents four-component vector from original vector*/
    xwyy: AIVec4;
    /*represents four-component vector from original vector*/
    xwyz: AIVec4;
    /*represents four-component vector from original vector*/
    xwyw: AIVec4;
    /*represents four-component vector from original vector*/
    xwzx: AIVec4;
    /*represents four-component vector from original vector*/
    xwzy: AIVec4;
    /*represents four-component vector from original vector*/
    xwzz: AIVec4;
    /*represents four-component vector from original vector*/
    xwzw: AIVec4;
    /*represents four-component vector from original vector*/
    xwwx: AIVec4;
    /*represents four-component vector from original vector*/
    xwwy: AIVec4;
    /*represents four-component vector from original vector*/
    xwwz: AIVec4;
    /*represents four-component vector from original vector*/
    xwww: AIVec4;
    /*represents four-component vector from original vector*/
    yxxx: AIVec4;
    /*represents four-component vector from original vector*/
    yxxy: AIVec4;
    /*represents four-component vector from original vector*/
    yxxz: AIVec4;
    /*represents four-component vector from original vector*/
    yxxw: AIVec4;
    /*represents four-component vector from original vector*/
    yxyx: AIVec4;
    /*represents four-component vector from original vector*/
    yxyy: AIVec4;
    /*represents four-component vector from original vector*/
    yxyz: AIVec4;
    /*represents four-component vector from original vector*/
    yxyw: AIVec4;
    /*represents four-component vector from original vector*/
    yxzx: AIVec4;
    /*represents four-component vector from original vector*/
    yxzy: AIVec4;
    /*represents four-component vector from original vector*/
    yxzz: AIVec4;
    /*represents four-component vector from original vector*/
    yxzw: AIVec4;
    /*represents four-component vector from original vector*/
    yxwx: AIVec4;
    /*represents four-component vector from original vector*/
    yxwy: AIVec4;
    /*represents four-component vector from original vector*/
    yxwz: AIVec4;
    /*represents four-component vector from original vector*/
    yxww: AIVec4;
    /*represents four-component vector from original vector*/
    yyxx: AIVec4;
    /*represents four-component vector from original vector*/
    yyxy: AIVec4;
    /*represents four-component vector from original vector*/
    yyxz: AIVec4;
    /*represents four-component vector from original vector*/
    yyxw: AIVec4;
    /*represents four-component vector from original vector*/
    yyyx: AIVec4;
    /*represents four-component vector from original vector*/
    yyyy: AIVec4;
    /*represents four-component vector from original vector*/
    yyyz: AIVec4;
    /*represents four-component vector from original vector*/
    yyyw: AIVec4;
    /*represents four-component vector from original vector*/
    yyzx: AIVec4;
    /*represents four-component vector from original vector*/
    yyzy: AIVec4;
    /*represents four-component vector from original vector*/
    yyzz: AIVec4;
    /*represents four-component vector from original vector*/
    yyzw: AIVec4;
    /*represents four-component vector from original vector*/
    yywx: AIVec4;
    /*represents four-component vector from original vector*/
    yywy: AIVec4;
    /*represents four-component vector from original vector*/
    yywz: AIVec4;
    /*represents four-component vector from original vector*/
    yyww: AIVec4;
    /*represents four-component vector from original vector*/
    yzxx: AIVec4;
    /*represents four-component vector from original vector*/
    yzxy: AIVec4;
    /*represents four-component vector from original vector*/
    yzxz: AIVec4;
    /*represents four-component vector from original vector*/
    yzxw: AIVec4;
    /*represents four-component vector from original vector*/
    yzyx: AIVec4;
    /*represents four-component vector from original vector*/
    yzyy: AIVec4;
    /*represents four-component vector from original vector*/
    yzyz: AIVec4;
    /*represents four-component vector from original vector*/
    yzyw: AIVec4;
    /*represents four-component vector from original vector*/
    yzzx: AIVec4;
    /*represents four-component vector from original vector*/
    yzzy: AIVec4;
    /*represents four-component vector from original vector*/
    yzzz: AIVec4;
    /*represents four-component vector from original vector*/
    yzzw: AIVec4;
    /*represents four-component vector from original vector*/
    yzwx: AIVec4;
    /*represents four-component vector from original vector*/
    yzwy: AIVec4;
    /*represents four-component vector from original vector*/
    yzwz: AIVec4;
    /*represents four-component vector from original vector*/
    yzww: AIVec4;
    /*represents four-component vector from original vector*/
    ywxx: AIVec4;
    /*represents four-component vector from original vector*/
    ywxy: AIVec4;
    /*represents four-component vector from original vector*/
    ywxz: AIVec4;
    /*represents four-component vector from original vector*/
    ywxw: AIVec4;
    /*represents four-component vector from original vector*/
    ywyx: AIVec4;
    /*represents four-component vector from original vector*/
    ywyy: AIVec4;
    /*represents four-component vector from original vector*/
    ywyz: AIVec4;
    /*represents four-component vector from original vector*/
    ywyw: AIVec4;
    /*represents four-component vector from original vector*/
    ywzx: AIVec4;
    /*represents four-component vector from original vector*/
    ywzy: AIVec4;
    /*represents four-component vector from original vector*/
    ywzz: AIVec4;
    /*represents four-component vector from original vector*/
    ywzw: AIVec4;
    /*represents four-component vector from original vector*/
    ywwx: AIVec4;
    /*represents four-component vector from original vector*/
    ywwy: AIVec4;
    /*represents four-component vector from original vector*/
    ywwz: AIVec4;
    /*represents four-component vector from original vector*/
    ywww: AIVec4;
    /*represents four-component vector from original vector*/
    zxxx: AIVec4;
    /*represents four-component vector from original vector*/
    zxxy: AIVec4;
    /*represents four-component vector from original vector*/
    zxxz: AIVec4;
    /*represents four-component vector from original vector*/
    zxxw: AIVec4;
    /*represents four-component vector from original vector*/
    zxyx: AIVec4;
    /*represents four-component vector from original vector*/
    zxyy: AIVec4;
    /*represents four-component vector from original vector*/
    zxyz: AIVec4;
    /*represents four-component vector from original vector*/
    zxyw: AIVec4;
    /*represents four-component vector from original vector*/
    zxzx: AIVec4;
    /*represents four-component vector from original vector*/
    zxzy: AIVec4;
    /*represents four-component vector from original vector*/
    zxzz: AIVec4;
    /*represents four-component vector from original vector*/
    zxzw: AIVec4;
    /*represents four-component vector from original vector*/
    zxwx: AIVec4;
    /*represents four-component vector from original vector*/
    zxwy: AIVec4;
    /*represents four-component vector from original vector*/
    zxwz: AIVec4;
    /*represents four-component vector from original vector*/
    zxww: AIVec4;
    /*represents four-component vector from original vector*/
    zyxx: AIVec4;
    /*represents four-component vector from original vector*/
    zyxy: AIVec4;
    /*represents four-component vector from original vector*/
    zyxz: AIVec4;
    /*represents four-component vector from original vector*/
    zyxw: AIVec4;
    /*represents four-component vector from original vector*/
    zyyx: AIVec4;
    /*represents four-component vector from original vector*/
    zyyy: AIVec4;
    /*represents four-component vector from original vector*/
    zyyz: AIVec4;
    /*represents four-component vector from original vector*/
    zyyw: AIVec4;
    /*represents four-component vector from original vector*/
    zyzx: AIVec4;
    /*represents four-component vector from original vector*/
    zyzy: AIVec4;
    /*represents four-component vector from original vector*/
    zyzz: AIVec4;
    /*represents four-component vector from original vector*/
    zyzw: AIVec4;
    /*represents four-component vector from original vector*/
    zywx: AIVec4;
    /*represents four-component vector from original vector*/
    zywy: AIVec4;
    /*represents four-component vector from original vector*/
    zywz: AIVec4;
    /*represents four-component vector from original vector*/
    zyww: AIVec4;
    /*represents four-component vector from original vector*/
    zzxx: AIVec4;
    /*represents four-component vector from original vector*/
    zzxy: AIVec4;
    /*represents four-component vector from original vector*/
    zzxz: AIVec4;
    /*represents four-component vector from original vector*/
    zzxw: AIVec4;
    /*represents four-component vector from original vector*/
    zzyx: AIVec4;
    /*represents four-component vector from original vector*/
    zzyy: AIVec4;
    /*represents four-component vector from original vector*/
    zzyz: AIVec4;
    /*represents four-component vector from original vector*/
    zzyw: AIVec4;
    /*represents four-component vector from original vector*/
    zzzx: AIVec4;
    /*represents four-component vector from original vector*/
    zzzy: AIVec4;
    /*represents four-component vector from original vector*/
    zzzz: AIVec4;
    /*represents four-component vector from original vector*/
    zzzw: AIVec4;
    /*represents four-component vector from original vector*/
    zzwx: AIVec4;
    /*represents four-component vector from original vector*/
    zzwy: AIVec4;
    /*represents four-component vector from original vector*/
    zzwz: AIVec4;
    /*represents four-component vector from original vector*/
    zzww: AIVec4;
    /*represents four-component vector from original vector*/
    zwxx: AIVec4;
    /*represents four-component vector from original vector*/
    zwxy: AIVec4;
    /*represents four-component vector from original vector*/
    zwxz: AIVec4;
    /*represents four-component vector from original vector*/
    zwxw: AIVec4;
    /*represents four-component vector from original vector*/
    zwyx: AIVec4;
    /*represents four-component vector from original vector*/
    zwyy: AIVec4;
    /*represents four-component vector from original vector*/
    zwyz: AIVec4;
    /*represents four-component vector from original vector*/
    zwyw: AIVec4;
    /*represents four-component vector from original vector*/
    zwzx: AIVec4;
    /*represents four-component vector from original vector*/
    zwzy: AIVec4;
    /*represents four-component vector from original vector*/
    zwzz: AIVec4;
    /*represents four-component vector from original vector*/
    zwzw: AIVec4;
    /*represents four-component vector from original vector*/
    zwwx: AIVec4;
    /*represents four-component vector from original vector*/
    zwwy: AIVec4;
    /*represents four-component vector from original vector*/
    zwwz: AIVec4;
    /*represents four-component vector from original vector*/
    zwww: AIVec4;
    /*represents four-component vector from original vector*/
    wxxx: AIVec4;
    /*represents four-component vector from original vector*/
    wxxy: AIVec4;
    /*represents four-component vector from original vector*/
    wxxz: AIVec4;
    /*represents four-component vector from original vector*/
    wxxw: AIVec4;
    /*represents four-component vector from original vector*/
    wxyx: AIVec4;
    /*represents four-component vector from original vector*/
    wxyy: AIVec4;
    /*represents four-component vector from original vector*/
    wxyz: AIVec4;
    /*represents four-component vector from original vector*/
    wxyw: AIVec4;
    /*represents four-component vector from original vector*/
    wxzx: AIVec4;
    /*represents four-component vector from original vector*/
    wxzy: AIVec4;
    /*represents four-component vector from original vector*/
    wxzz: AIVec4;
    /*represents four-component vector from original vector*/
    wxzw: AIVec4;
    /*represents four-component vector from original vector*/
    wxwx: AIVec4;
    /*represents four-component vector from original vector*/
    wxwy: AIVec4;
    /*represents four-component vector from original vector*/
    wxwz: AIVec4;
    /*represents four-component vector from original vector*/
    wxww: AIVec4;
    /*represents four-component vector from original vector*/
    wyxx: AIVec4;
    /*represents four-component vector from original vector*/
    wyxy: AIVec4;
    /*represents four-component vector from original vector*/
    wyxz: AIVec4;
    /*represents four-component vector from original vector*/
    wyxw: AIVec4;
    /*represents four-component vector from original vector*/
    wyyx: AIVec4;
    /*represents four-component vector from original vector*/
    wyyy: AIVec4;
    /*represents four-component vector from original vector*/
    wyyz: AIVec4;
    /*represents four-component vector from original vector*/
    wyyw: AIVec4;
    /*represents four-component vector from original vector*/
    wyzx: AIVec4;
    /*represents four-component vector from original vector*/
    wyzy: AIVec4;
    /*represents four-component vector from original vector*/
    wyzz: AIVec4;
    /*represents four-component vector from original vector*/
    wyzw: AIVec4;
    /*represents four-component vector from original vector*/
    wywx: AIVec4;
    /*represents four-component vector from original vector*/
    wywy: AIVec4;
    /*represents four-component vector from original vector*/
    wywz: AIVec4;
    /*represents four-component vector from original vector*/
    wyww: AIVec4;
    /*represents four-component vector from original vector*/
    wzxx: AIVec4;
    /*represents four-component vector from original vector*/
    wzxy: AIVec4;
    /*represents four-component vector from original vector*/
    wzxz: AIVec4;
    /*represents four-component vector from original vector*/
    wzxw: AIVec4;
    /*represents four-component vector from original vector*/
    wzyx: AIVec4;
    /*represents four-component vector from original vector*/
    wzyy: AIVec4;
    /*represents four-component vector from original vector*/
    wzyz: AIVec4;
    /*represents four-component vector from original vector*/
    wzyw: AIVec4;
    /*represents four-component vector from original vector*/
    wzzx: AIVec4;
    /*represents four-component vector from original vector*/
    wzzy: AIVec4;
    /*represents four-component vector from original vector*/
    wzzz: AIVec4;
    /*represents four-component vector from original vector*/
    wzzw: AIVec4;
    /*represents four-component vector from original vector*/
    wzwx: AIVec4;
    /*represents four-component vector from original vector*/
    wzwy: AIVec4;
    /*represents four-component vector from original vector*/
    wzwz: AIVec4;
    /*represents four-component vector from original vector*/
    wzww: AIVec4;
    /*represents four-component vector from original vector*/
    wwxx: AIVec4;
    /*represents four-component vector from original vector*/
    wwxy: AIVec4;
    /*represents four-component vector from original vector*/
    wwxz: AIVec4;
    /*represents four-component vector from original vector*/
    wwxw: AIVec4;
    /*represents four-component vector from original vector*/
    wwyx: AIVec4;
    /*represents four-component vector from original vector*/
    wwyy: AIVec4;
    /*represents four-component vector from original vector*/
    wwyz: AIVec4;
    /*represents four-component vector from original vector*/
    wwyw: AIVec4;
    /*represents four-component vector from original vector*/
    wwzx: AIVec4;
    /*represents four-component vector from original vector*/
    wwzy: AIVec4;
    /*represents four-component vector from original vector*/
    wwzz: AIVec4;
    /*represents four-component vector from original vector*/
    wwzw: AIVec4;
    /*represents four-component vector from original vector*/
    wwwx: AIVec4;
    /*represents four-component vector from original vector*/
    wwwy: AIVec4;
    /*represents four-component vector from original vector*/
    wwwz: AIVec4;
    /*represents four-component vector from original vector*/
    wwww: AIVec4;

	set(): AIVec4;
	set(fValue: float): AIVec4;
	set(v4fVec: AIVec4): AIVec4;
	set(c4fColor: AIColorValue): AIVec4;
	set(pArray: float[]): AIVec4;
	set(fValue: float, v3fVec: AIVec3): AIVec4;
	set(v2fVec1: AIVec2, v2fVec2: AIVec2): AIVec4;
	set(v3fVec: AIVec3, fValue: float): AIVec4;
	set(fValue1: float, fValue2: float, v2fVec: AIVec2): AIVec4;
	set(fValue1: float, v2fVec: AIVec2, fValue2: float): AIVec4;
	set(v2fVec: AIVec2, fValue1: float, fValue2: float): AIVec4;
	set(fValue1: float, fValue2: float, fValue3: float, fValue4: float): AIVec4;

	clear(): AIVec4;

	add(v4fVec: AIVec4, v4fDestination?: AIVec4): AIVec4;
	subtract(v4fVec: AIVec4, v4fDestination?: AIVec4): AIVec4;
	dot(v4fVec: AIVec4): float;

	isEqual(v4fVec: AIVec4, fEps?: float): boolean;
	isClear(fEps?: float): boolean;

	negate(v4fDestination?: AIVec4): AIVec4;
	scale(fScale: float, v4fDestination?: AIVec4): AIVec4;
	normalize(v4fDestination?: AIVec4): AIVec4;
	length(): float;
	lengthSquare(): float;

	direction(v4fVec: AIVec4, v4fDestination?: AIVec4): AIVec4;

	mix(v4fVec: AIVec4, fA: float, v4fDestination?: AIVec4): AIVec4;

	toString(): string;
};
