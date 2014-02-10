/// <reference path="../common.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../idl/IMat3.ts" />
/// <reference path="math.ts" />
/// <reference path="../gen/generate.ts" />
/// <reference path="matrixIndecies.ts" />
var akra;
(function (akra) {
    (function (math) {
        /** Imports need for increase performance in Debug build */
        var __a11 = akra.math.__a11;
        var __a12 = akra.math.__a12;
        var __a13 = akra.math.__a13;
        var __a21 = akra.math.__a21;
        var __a22 = akra.math.__a22;
        var __a23 = akra.math.__a23;
        var __a31 = akra.math.__a31;
        var __a32 = akra.math.__a32;
        var __a33 = akra.math.__a33;

        var __11 = akra.math.__11;
        var __12 = akra.math.__12;
        var __13 = akra.math.__13;
        var __14 = akra.math.__14;
        var __21 = akra.math.__21;
        var __22 = akra.math.__22;
        var __23 = akra.math.__23;
        var __24 = akra.math.__24;
        var __31 = akra.math.__31;
        var __32 = akra.math.__32;
        var __33 = akra.math.__33;
        var __34 = akra.math.__34;
        var __41 = akra.math.__41;
        var __42 = akra.math.__42;
        var __43 = akra.math.__43;
        var __44 = akra.math.__44;

        var pBuffer;
        var iElement;

        var Mat3 = (function () {
            function Mat3(f1, f2, f3, f4, f5, f6, f7, f8, f9) {
                var nArgumentsLength = arguments.length;

                this.data = new Float32Array(9);

                switch (nArgumentsLength) {
                    case 1:
                        this.set(arguments[0]);
                        break;
                    case 3:
                        this.set(arguments[0], arguments[1], arguments[2]);
                        break;
                    case 9:
                        this.set(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                        break;
                    default:
                        break;
                }
            }
            Mat3.prototype.set = function (f1, f2, f3, f4, f5, f6, f7, f8, f9) {
                var pData = this.data;

                //без аргументов инициализируется нулями
                var n = arguments.length;
                if (n == 0) {
                    pData[__a11] = pData[__a12] = pData[__a13] = 0;
                    pData[__a21] = pData[__a22] = pData[__a23] = 0;
                    pData[__a31] = pData[__a32] = pData[__a33] = 0;
                }
                if (n == 1) {
                    if (akra.isFloat(arguments[0])) {
                        var nValue = arguments[0];

                        pData[__a11] = nValue;
                        pData[__a12] = 0;
                        pData[__a13] = 0;

                        pData[__a21] = 0;
                        pData[__a22] = nValue;
                        pData[__a23] = 0;

                        pData[__a31] = 0;
                        pData[__a32] = 0;
                        pData[__a33] = nValue;
                    } else if (akra.isDef(arguments[0].data)) {
                        var pElements = arguments[0].data;

                        if (pElements.length === 9) {
                            //Mat3
                            pData[__a11] = pElements[__a11];
                            pData[__a12] = pElements[__a12];
                            pData[__a13] = pElements[__a13];

                            pData[__a21] = pElements[__a21];
                            pData[__a22] = pElements[__a22];
                            pData[__a23] = pElements[__a23];

                            pData[__a31] = pElements[__a31];
                            pData[__a32] = pElements[__a32];
                            pData[__a33] = pElements[__a33];
                        } else {
                            //Mat4
                            pData[__a11] = pElements[__11];
                            pData[__a12] = pElements[__12];
                            pData[__a13] = pElements[__13];

                            pData[__a21] = pElements[__21];
                            pData[__a22] = pElements[__22];
                            pData[__a23] = pElements[__23];

                            pData[__a31] = pElements[__31];
                            pData[__a32] = pElements[__32];
                            pData[__a33] = pElements[__33];
                        }
                    } else if (arguments[0] instanceof akra.math.Vec3) {
                        var v3fVec = arguments[0];

                        //диагональ
                        pData[__a11] = v3fVec.x;
                        pData[__a12] = 0;
                        pData[__a13] = 0;

                        pData[__a21] = 0;
                        pData[__a22] = v3fVec.y;
                        pData[__a23] = 0;

                        pData[__a31] = 0;
                        pData[__a32] = 0;
                        pData[__a33] = v3fVec.z;
                    } else {
                        var pArray = arguments[0];

                        if (pElements.length == 3) {
                            //ложим диагональ
                            pData[__a11] = pArray[0];
                            pData[__a12] = 0;
                            pData[__a13] = 0;

                            pData[__a21] = 0;
                            pData[__a22] = pArray[1];
                            pData[__a23] = 0;

                            pData[__a31] = 0;
                            pData[__a32] = 0;
                            pData[__a33] = pArray[2];
                        } else {
                            pData[__a11] = pArray[__a11];
                            pData[__a12] = pArray[__a12];
                            pData[__a13] = pArray[__a13];

                            pData[__a21] = pArray[__a21];
                            pData[__a22] = pArray[__a22];
                            pData[__a23] = pArray[__a23];

                            pData[__a31] = pArray[__a31];
                            pData[__a32] = pArray[__a32];
                            pData[__a33] = pArray[__a33];
                        }
                    }
                } else if (n == 3) {
                    if (akra.isFloat(arguments[0])) {
                        //выставляем диагональ
                        pData[__a11] = arguments[0];
                        pData[__a12] = 0;
                        pData[__a13] = 0;

                        pData[__a21] = 0;
                        pData[__a22] = arguments[1];
                        pData[__a23] = 0;

                        pData[__a31] = 0;
                        pData[__a32] = 0;
                        pData[__a33] = arguments[2];
                    } else {
                        var pData1, pData2, pData3;
                        if (arguments[0] instanceof akra.math.Vec3) {
                            var v3fVec1 = arguments[0];
                            var v3fVec2 = arguments[1];
                            var v3fVec3 = arguments[2];

                            //ложим по столбцам
                            pData[__a11] = v3fVec1.x;
                            pData[__a12] = v3fVec2.x;
                            pData[__a13] = v3fVec3.x;

                            pData[__a21] = v3fVec1.y;
                            pData[__a22] = v3fVec2.y;
                            pData[__a23] = v3fVec3.y;

                            pData[__a31] = v3fVec1.z;
                            pData[__a32] = v3fVec2.z;
                            pData[__a33] = v3fVec3.z;
                        } else {
                            var pVec1 = arguments[0];
                            var pVec2 = arguments[1];
                            var pVec3 = arguments[2];

                            //ложим по столбцам
                            pData[__a11] = pVec1[0];
                            pData[__a12] = pVec2[0];
                            pData[__a13] = pVec3[0];

                            pData[__a21] = pVec1[1];
                            pData[__a22] = pVec2[1];
                            pData[__a23] = pVec3[1];

                            pData[__a31] = pVec1[2];
                            pData[__a32] = pVec2[2];
                            pData[__a33] = pVec3[2];
                        }
                    }
                } else if (n == 9) {
                    //просто числа
                    pData[__a11] = arguments[__a11];
                    pData[__a12] = arguments[__a12];
                    pData[__a13] = arguments[__a13];

                    pData[__a21] = arguments[__a21];
                    pData[__a22] = arguments[__a22];
                    pData[__a23] = arguments[__a23];

                    pData[__a31] = arguments[__a31];
                    pData[__a32] = arguments[__a32];
                    pData[__a33] = arguments[__a33];
                }

                return this;
            };

            Mat3.prototype.identity = function () {
                var pData = this.data;

                pData[__a11] = 1.;
                pData[__a12] = 0.;
                pData[__a13] = 0.;

                pData[__a21] = 0.;
                pData[__a22] = 1.;
                pData[__a23] = 0.;

                pData[__a31] = 0.;
                pData[__a32] = 0.;
                pData[__a33] = 1.;

                return this;
            };

            Mat3.prototype.add = function (m3fMat, m3fDestination) {
                if (!akra.isDef(m3fDestination)) {
                    m3fDestination = this;
                }

                var pData1 = this.data;
                var pData2 = m3fMat.data;
                var pDataDestination = m3fDestination.data;

                pDataDestination[__a11] = pData1[__a11] + pData2[__a11];
                pDataDestination[__a12] = pData1[__a12] + pData2[__a12];
                pDataDestination[__a13] = pData1[__a13] + pData2[__a13];

                pDataDestination[__a21] = pData1[__a21] + pData2[__a21];
                pDataDestination[__a22] = pData1[__a22] + pData2[__a22];
                pDataDestination[__a23] = pData1[__a23] + pData2[__a23];

                pDataDestination[__a31] = pData1[__a31] + pData2[__a31];
                pDataDestination[__a32] = pData1[__a32] + pData2[__a32];
                pDataDestination[__a33] = pData1[__a33] + pData2[__a33];

                return m3fDestination;
            };

            Mat3.prototype.subtract = function (m3fMat, m3fDestination) {
                if (!akra.isDef(m3fDestination)) {
                    m3fDestination = this;
                }

                var pData1 = this.data;
                var pData2 = m3fMat.data;
                var pDataDestination = m3fDestination.data;

                pDataDestination[__a11] = pData1[__a11] - pData2[__a11];
                pDataDestination[__a12] = pData1[__a12] - pData2[__a12];
                pDataDestination[__a13] = pData1[__a13] - pData2[__a13];

                pDataDestination[__a21] = pData1[__a21] - pData2[__a21];
                pDataDestination[__a22] = pData1[__a22] - pData2[__a22];
                pDataDestination[__a23] = pData1[__a23] - pData2[__a23];

                pDataDestination[__a31] = pData1[__a31] - pData2[__a31];
                pDataDestination[__a32] = pData1[__a32] - pData2[__a32];
                pDataDestination[__a33] = pData1[__a33] - pData2[__a33];

                return m3fDestination;
            };

            Mat3.prototype.multiply = function (m3fMat, m3fDestination) {
                var pData1 = this.data;
                var pData2 = m3fMat.data;

                if (!akra.isDef(m3fDestination)) {
                    m3fDestination = this;
                }
                var pDataDestination = m3fDestination.data;

                // Cache the matrix values (makes for huge speed increases!)
                var a11 = pData1[__a11], a12 = pData1[__a12], a13 = pData1[__a13];
                var a21 = pData1[__a21], a22 = pData1[__a22], a23 = pData1[__a23];
                var a31 = pData1[__a31], a32 = pData1[__a32], a33 = pData1[__a33];

                var b11 = pData2[__a11], b12 = pData2[__a12], b13 = pData2[__a13];
                var b21 = pData2[__a21], b22 = pData2[__a22], b23 = pData2[__a23];
                var b31 = pData2[__a31], b32 = pData2[__a32], b33 = pData2[__a33];

                pDataDestination[__a11] = a11 * b11 + a12 * b21 + a13 * b31;
                pDataDestination[__a12] = a11 * b12 + a12 * b22 + a13 * b32;
                pDataDestination[__a13] = a11 * b13 + a12 * b23 + a13 * b33;

                pDataDestination[__a21] = a21 * b11 + a22 * b21 + a23 * b31;
                pDataDestination[__a22] = a21 * b12 + a22 * b22 + a23 * b32;
                pDataDestination[__a23] = a21 * b13 + a22 * b23 + a23 * b33;

                pDataDestination[__a31] = a31 * b11 + a32 * b21 + a33 * b31;
                pDataDestination[__a32] = a31 * b12 + a32 * b22 + a33 * b32;
                pDataDestination[__a33] = a31 * b13 + a32 * b23 + a33 * b33;

                return m3fDestination;
            };

            Mat3.prototype.multiplyVec3 = function (v3fVec, v3fDestination) {
                var pData = this.data;

                if (!akra.isDef(v3fDestination)) {
                    v3fDestination = v3fVec;
                }

                var x = v3fVec.x, y = v3fVec.y, z = v3fVec.z;

                v3fDestination.x = pData[__a11] * x + pData[__a12] * y + pData[__a13] * z;
                v3fDestination.y = pData[__a21] * x + pData[__a22] * y + pData[__a23] * z;
                v3fDestination.z = pData[__a31] * x + pData[__a32] * y + pData[__a33] * z;

                return v3fDestination;
            };

            Mat3.prototype.transpose = function (m3fDestination) {
                var pData = this.data;
                if (!akra.isDef(m3fDestination)) {
                    //быстрее будет явно обработать оба случая
                    var a12 = pData[__a12], a13 = pData[__a13], a23 = pData[__a23];

                    pData[__a12] = pData[__a21];
                    pData[__a13] = pData[__a31];

                    pData[__a21] = a12;
                    pData[__a23] = pData[__a32];

                    pData[__a31] = a13;
                    pData[__a32] = a23;

                    return this;
                }

                var pDataDestination = m3fDestination.data;

                pDataDestination[__a11] = pData[__a11];
                pDataDestination[__a12] = pData[__a21];
                pDataDestination[__a13] = pData[__a31];

                pDataDestination[__a21] = pData[__a12];
                pDataDestination[__a22] = pData[__a22];
                pDataDestination[__a23] = pData[__a32];

                pDataDestination[__a31] = pData[__a13];
                pDataDestination[__a32] = pData[__a23];
                pDataDestination[__a33] = pData[__a33];

                return m3fDestination;
            };

            Mat3.prototype.determinant = function () {
                var pData = this.data;

                var a11 = pData[__a11], a12 = pData[__a12], a13 = pData[__a13];
                var a21 = pData[__a21], a22 = pData[__a22], a23 = pData[__a23];
                var a31 = pData[__a31], a32 = pData[__a32], a33 = pData[__a33];

                return a11 * (a22 * a33 - a23 * a32) - a12 * (a21 * a33 - a23 * a31) + a13 * (a21 * a32 - a22 * a31);
            };

            Mat3.prototype.inverse = function (m3fDestination) {
                if (!akra.isDef(m3fDestination)) {
                    m3fDestination = this;
                }

                var pData = this.data;
                var pDataDestination = m3fDestination.data;

                var a11 = pData[__a11], a12 = pData[__a12], a13 = pData[__a13];
                var a21 = pData[__a21], a22 = pData[__a22], a23 = pData[__a23];
                var a31 = pData[__a31], a32 = pData[__a32], a33 = pData[__a33];

                var A11 = a22 * a33 - a23 * a32;
                var A12 = a21 * a33 - a23 * a31;
                var A13 = a21 * a32 - a22 * a31;

                var A21 = a12 * a33 - a13 * a32;
                var A22 = a11 * a33 - a13 * a31;
                var A23 = a11 * a32 - a12 * a31;

                var A31 = a12 * a23 - a13 * a22;
                var A32 = a11 * a23 - a13 * a21;
                var A33 = a11 * a22 - a12 * a21;

                var fDeterminant = a11 * A11 - a12 * A12 + a13 * A13;

                if (fDeterminant == 0.) {
                    akra.logger.error("обращение матрицы с нулевым детеминантом:\n", this.toString());

                    return m3fDestination.set(1.);
                    //чтоб все не навернулось
                }

                var fInverseDeterminant = 1. / fDeterminant;

                pDataDestination[__a11] = A11 * fInverseDeterminant;
                pDataDestination[__a12] = -A21 * fInverseDeterminant;
                pDataDestination[__a13] = A31 * fInverseDeterminant;

                pDataDestination[__a21] = -A12 * fInverseDeterminant;
                pDataDestination[__a22] = A22 * fInverseDeterminant;
                pDataDestination[__a23] = -A32 * fInverseDeterminant;

                pDataDestination[__a31] = A13 * fInverseDeterminant;
                pDataDestination[__a32] = -A23 * fInverseDeterminant;
                pDataDestination[__a33] = A33 * fInverseDeterminant;

                return m3fDestination;
            };

            Mat3.prototype.isEqual = function (m3fMat, fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                var pData1 = this.data;
                var pData2 = m3fMat.data;

                if (fEps == 0) {
                    if (pData1[__a11] != pData2[__a11] || pData1[__a12] != pData2[__a12] || pData1[__a13] != pData2[__a13] || pData1[__a21] != pData2[__a21] || pData1[__a22] != pData2[__a22] || pData1[__a23] != pData2[__a23] || pData1[__a31] != pData2[__a31] || pData1[__a32] != pData2[__a32] || pData1[__a33] != pData2[__a33]) {
                        return false;
                    }
                } else {
                    if (Math.abs(pData1[__a11] - pData2[__a11]) > fEps || Math.abs(pData1[__a12] - pData2[__a12]) > fEps || Math.abs(pData1[__a13] - pData2[__a13]) > fEps || Math.abs(pData1[__a21] - pData2[__a21]) > fEps || Math.abs(pData1[__a22] - pData2[__a22]) > fEps || Math.abs(pData1[__a23] - pData2[__a23]) > fEps || Math.abs(pData1[__a31] - pData2[__a31]) > fEps || Math.abs(pData1[__a32] - pData2[__a32]) > fEps || Math.abs(pData1[__a33] - pData2[__a33]) > fEps) {
                        return false;
                    }
                }
                return true;
            };

            Mat3.prototype.isDiagonal = function (fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                var pData = this.data;

                if (fEps == 0) {
                    if (pData[__a12] != 0 || pData[__a13] != 0 || pData[__a21] != 0 || pData[__a23] != 0 || pData[__a31] != 0 || pData[__a32] != 0) {
                        return false;
                    }
                } else {
                    if (Math.abs(pData[__a12]) > fEps || Math.abs(pData[__a13]) > fEps || Math.abs(pData[__a21]) > fEps || Math.abs(pData[__a23]) > fEps || Math.abs(pData[__a31]) > fEps || Math.abs(pData[__a32]) > fEps) {
                        return false;
                    }
                }

                return true;
            };

            Mat3.prototype.toMat4 = function (m4fDestination) {
                if (!akra.isDef(m4fDestination)) {
                    m4fDestination = new akra.math.Mat4();
                }

                var pData = this.data;
                var pDataDestination = m4fDestination.data;

                pDataDestination[__11] = pData[__a11];
                pDataDestination[__12] = pData[__a12];
                pDataDestination[__13] = pData[__a13];
                pDataDestination[__14] = 0;

                pDataDestination[__21] = pData[__a21];
                pDataDestination[__22] = pData[__a22];
                pDataDestination[__23] = pData[__a23];
                pDataDestination[__24] = 0;

                pDataDestination[__31] = pData[__a31];
                pDataDestination[__32] = pData[__a32];
                pDataDestination[__33] = pData[__a33];
                pDataDestination[__34] = 0;

                pDataDestination[__41] = 0;
                pDataDestination[__42] = 0;
                pDataDestination[__43] = 0;
                pDataDestination[__44] = 1;

                return m4fDestination;
            };

            Mat3.prototype.toQuat4 = function (q4fDestination) {
                if (!akra.isDef(q4fDestination)) {
                    q4fDestination = new akra.math.Quat4();
                }

                var pData = this.data;

                var a11 = pData[__a11], a12 = pData[__a12], a13 = pData[__a13];
                var a21 = pData[__a21], a22 = pData[__a22], a23 = pData[__a23];
                var a31 = pData[__a31], a32 = pData[__a32], a33 = pData[__a33];

                var x2 = ((a11 - a22 - a33) + 1) / 4;
                var y2 = ((a22 - a11 - a33) + 1) / 4;
                var z2 = ((a33 - a11 - a22) + 1) / 4;
                var w2 = ((a11 + a22 + a33) + 1) / 4;

                var fMax = Math.max(x2, Math.max(y2, Math.max(z2, w2)));

                if (fMax == x2) {
                    //максимальная компонента берется положительной
                    var x = Math.sqrt(x2);

                    q4fDestination.x = x;
                    q4fDestination.y = (a21 + a12) / 4 / x;
                    q4fDestination.z = (a31 + a13) / 4 / x;
                    q4fDestination.w = (a32 - a23) / 4 / x;
                } else if (fMax == y2) {
                    //максимальная компонента берется положительной
                    var y = Math.sqrt(y2);

                    q4fDestination.x = (a21 + a12) / 4 / y;
                    q4fDestination.y = y;
                    q4fDestination.z = (a32 + a23) / 4 / y;
                    q4fDestination.w = (a13 - a31) / 4 / y;
                } else if (fMax == z2) {
                    //максимальная компонента берется положительной
                    var z = Math.sqrt(z2);

                    q4fDestination.x = (a31 + a13) / 4 / z;
                    q4fDestination.y = (a32 + a23) / 4 / z;
                    q4fDestination.z = z;
                    q4fDestination.w = (a21 - a12) / 4 / z;
                } else {
                    //максимальная компонента берется положительной
                    var w = Math.sqrt(w2);

                    q4fDestination.x = (a32 - a23) / 4 / w;
                    q4fDestination.y = (a13 - a31) / 4 / w;
                    q4fDestination.z = (a21 - a12) / 4 / w;
                    q4fDestination.w = w;
                }

                return q4fDestination;
            };

            Mat3.prototype.toString = function () {
                var pData = this.data;
                return '[' + pData[__a11] + ', ' + pData[__a12] + ', ' + pData[__a13] + ',\n' + +pData[__a21] + ', ' + pData[__a22] + ', ' + pData[__a23] + ',\n' + +pData[__a31] + ', ' + pData[__a32] + ', ' + pData[__a33] + ']';
            };

            Mat3.prototype.decompose = function (q4fRotation, v3fScale) {
                //изначально предполагаем, что порядок умножения был rot * scale
                var m3fRotScale = this;
                var m3fRotScaleTransposed = this.transpose(Mat3.temp());
                var isRotScale = true;

                //понадобятся если порядок умножения был другим
                var m3fScaleRot = null, m3fScaleRotTransposed = null;

                //было отражение или нет
                var scaleSign = (m3fRotScale.determinant() >= 0.) ? 1 : -1;

                var m3fResult = Mat3.temp();

                //first variant rot * scale
                // (rot * scale)T * (rot * scale) =
                // scaleT * rotT * rot * scale = scaleT *rot^-1 * rot * scale =
                // scaleT * scale
                m3fRotScaleTransposed.multiply(m3fRotScale, m3fResult);
                if (!m3fResult.isDiagonal(1e-4)) {
                    //предположение было неверным
                    isRotScale = false;

                    //просто переобозначения чтобы не было путаницы
                    m3fScaleRot = m3fRotScale;
                    m3fScaleRotTransposed = m3fRotScaleTransposed;

                    //second variant scale * rot
                    // (scale * rot) * (scale * rot)T =
                    // scale * rot * rotT * scaleT = scale *rot * rot^-1 * scaleT =
                    // scale * scaleT
                    m3fScaleRot.multiply(m3fScaleRotTransposed, m3fResult);
                }

                var pResultData = m3fResult.data;

                var x = akra.math.sqrt(pResultData[__a11]);
                var y = akra.math.sqrt(pResultData[__a22]) * scaleSign;
                var z = akra.math.sqrt(pResultData[__a33]);

                v3fScale.x = x;
                v3fScale.y = y;
                v3fScale.z = z;

                var m3fInverseScale = Mat3.temp(1. / x, 1. / y, 1. / z);

                if (isRotScale) {
                    m3fRotScale.multiply(m3fInverseScale, Mat3.temp()).toQuat4(q4fRotation);
                    return true;
                } else {
                    m3fInverseScale.multiply(m3fScaleRot, Mat3.temp()).toQuat4(q4fRotation);

                    //debug_assert(false, "порядок умножения scale rot в данный момент не поддерживается");
                    return false;
                }
            };

            Mat3.prototype.row = function (iRow, v3fDestination) {
                if (!akra.isDef(v3fDestination)) {
                    v3fDestination = new akra.math.Vec3();
                }

                var pData = this.data;

                switch (iRow) {
                    case 1:
                        v3fDestination.x = pData[__a11];
                        v3fDestination.y = pData[__a12];
                        v3fDestination.z = pData[__a13];
                        break;
                    case 2:
                        v3fDestination.x = pData[__a21];
                        v3fDestination.y = pData[__a22];
                        v3fDestination.z = pData[__a23];
                        break;
                    case 3:
                        v3fDestination.x = pData[__a31];
                        v3fDestination.y = pData[__a32];
                        v3fDestination.z = pData[__a33];
                        break;
                }

                return v3fDestination;
            };

            Mat3.prototype.column = function (iColumn, v3fDestination) {
                if (!akra.isDef(v3fDestination)) {
                    v3fDestination = new akra.math.Vec3();
                }

                var pData = this.data;

                switch (iColumn) {
                    case 1:
                        v3fDestination.x = pData[__a11];
                        v3fDestination.y = pData[__a21];
                        v3fDestination.z = pData[__a31];
                        break;
                    case 2:
                        v3fDestination.x = pData[__a12];
                        v3fDestination.y = pData[__a22];
                        v3fDestination.z = pData[__a32];
                        break;
                    case 3:
                        v3fDestination.x = pData[__a13];
                        v3fDestination.y = pData[__a23];
                        v3fDestination.z = pData[__a33];
                        break;
                }

                return v3fDestination;
            };

            Mat3.fromYawPitchRoll = function (fYaw, fPitch, fRoll, m3fDestination) {
                if (arguments.length <= 2) {
                    //Vec3 + m3fDestination
                    var v3fVec = arguments[0];

                    fYaw = v3fVec.x;
                    fPitch = v3fVec.y;
                    fRoll = v3fVec.z;

                    m3fDestination = arguments[1];
                }

                if (!akra.isDef(m3fDestination)) {
                    m3fDestination = new Mat3();
                }

                var pDataDestination = m3fDestination.data;

                var fSin1 = Math.sin(fYaw);
                var fSin2 = Math.sin(fPitch);
                var fSin3 = Math.sin(fRoll);

                var fCos1 = Math.cos(fYaw);
                var fCos2 = Math.cos(fPitch);
                var fCos3 = Math.cos(fRoll);

                pDataDestination[__a11] = fCos1 * fCos3 + fSin1 * fSin2 * fSin3;
                pDataDestination[__a12] = fCos3 * fSin1 * fSin2 - fCos1 * fSin3;
                pDataDestination[__a13] = fCos2 * fSin1;

                pDataDestination[__a21] = fCos2 * fSin3;
                pDataDestination[__a22] = fCos2 * fCos3;
                pDataDestination[__a23] = -fSin2;

                pDataDestination[__a31] = fCos1 * fSin2 * fSin3 - fCos3 * fSin1;
                pDataDestination[__a32] = fSin1 * fSin3 + fCos1 * fCos3 * fSin2;
                pDataDestination[__a33] = fCos1 * fCos2;

                return m3fDestination;
            };

            Mat3.fromXYZ = function (fX, fY, fZ, m3fDestination) {
                if (arguments.length <= 2) {
                    //Vec3 + m3fDestination
                    var v3fVec = arguments[0];
                    return Mat3.fromYawPitchRoll(v3fVec.y, v3fVec.x, v3fVec.z, arguments[1]);
                } else {
                    //fX fY fZ m3fDestination
                    //var fX: float = arguments[0];
                    //var fY: float = arguments[1];
                    //var fZ: float = arguments[2];
                    return Mat3.fromYawPitchRoll(fY, fX, fZ, arguments[3]);
                }
            };

            Mat3.temp = function (f1, f2, f3, f4, f5, f6, f7, f8, f9) {
                iElement = (iElement === pBuffer.length - 1 ? 0 : iElement);
                var p = pBuffer[iElement++];
                return p.set.apply(p, arguments);
            };
            return Mat3;
        })();
        math.Mat3 = Mat3;

        pBuffer = akra.gen.array(256, Mat3);
        iElement = 0;
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
//# sourceMappingURL=Mat3.js.map
