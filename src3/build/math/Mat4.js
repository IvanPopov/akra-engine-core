/// <reference path="../idl/common.d.ts" />
/// <reference path="../idl/AIMat4.ts" />
define(["require", "exports", "generate", "logger", "conv"], function(require, exports, __gen__, __logger__, __conv__) {
    var gen = __gen__;
    
    var logger = __logger__;
    var conv = __conv__;

    var sqrt = math.sqrt;
    var abs = math.abs;
    var clamp = math.clamp;

    var sin = math.sin;
    var cos = math.cos;
    var max = math.max;
    var tan = math.tan;

    var Vec3 = math.Vec3;
    var Mat3 = math.Mat3;
    var Quat4 = math.Quat4;
    var Vec4 = math.Vec4;

    var pBuffer;
    var iElement;

    var Mat4 = (function () {
        function Mat4(f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13, f14, f15, f16) {
            var n = arguments.length;

            if (n === 2) {
                if (isBoolean(arguments[1])) {
                    if (arguments[1]) {
                        this.data = arguments[0];
                    } else {
                        this.data = new Float32Array(16);
                        this.set(arguments[0]);
                    }
                } else {
                    this.data = new Float32Array(16);
                    this.set(arguments[0], arguments[1]);
                }
            } else {
                this.data = new Float32Array(16);

                switch (n) {
                    case 1:
                        if (arguments[0] instanceof Mat3) {
                            this.set(arguments[0], vec3(0.));
                        } else {
                            this.set(arguments[0]);
                        }
                        break;
                    case 4:
                        this.set(arguments[0], arguments[1], arguments[2], arguments[3]);
                        break;
                    case 16:
                        this.set(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9], arguments[10], arguments[11], arguments[12], arguments[13], arguments[14], arguments[15]);
                        break;
                    default:
                        break;
                }
            }
        }
        Mat4.prototype.set = function (f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13, f14, f15, f16) {
            var nArgumentsLength = arguments.length;
            var pData = this.data;

            if (nArgumentsLength === 0) {
                pData[__11] = pData[__12] = pData[__13] = pData[__14] = pData[__21] = pData[__22] = pData[__23] = pData[__24] = pData[__31] = pData[__32] = pData[__33] = pData[__34] = pData[__41] = pData[__42] = pData[__43] = pData[__44] = 0.;

                return this;
            }

            if (nArgumentsLength === 1) {
                if (isFloat(arguments[0])) {
                    var fValue = arguments[0];

                    pData[__11] = fValue;
                    pData[__12] = 0.;
                    pData[__13] = 0.;
                    pData[__14] = 0.;

                    pData[__21] = 0.;
                    pData[__22] = fValue;
                    pData[__23] = 0.;
                    pData[__24] = 0.;

                    pData[__31] = 0.;
                    pData[__32] = 0.;
                    pData[__33] = fValue;
                    pData[__34] = 0.;

                    pData[__41] = 0.;
                    pData[__42] = 0.;
                    pData[__43] = 0.;
                    pData[__44] = fValue;
                } else if (arguments[0] instanceof Vec4) {
                    var v4fVec = arguments[0];

                    pData[__11] = v4fVec.x;
                    pData[__12] = 0.;
                    pData[__13] = 0.;
                    pData[__14] = 0.;

                    pData[__21] = 0.;
                    pData[__22] = v4fVec.y;
                    pData[__23] = 0.;
                    pData[__24] = 0.;

                    pData[__31] = 0.;
                    pData[__32] = 0.;
                    pData[__33] = v4fVec.z;
                    pData[__34] = 0.;

                    pData[__41] = 0.;
                    pData[__42] = 0.;
                    pData[__43] = 0.;
                    pData[__44] = v4fVec.w;
                } else if (isDef(arguments[0].data)) {
                    var pMatrixData = arguments[0].data;
                    if (pMatrixData.length == 16) {
                        //Mat4
                        pData.set(pMatrixData);
                    } else {
                        //Mat3
                        pData[__11] = pMatrixData[__a11];
                        pData[__12] = pMatrixData[__a12];
                        pData[__13] = pMatrixData[__a13];

                        pData[__21] = pMatrixData[__a21];
                        pData[__22] = pMatrixData[__a22];
                        pData[__23] = pMatrixData[__a23];

                        pData[__31] = pMatrixData[__a31];
                        pData[__32] = pMatrixData[__a32];
                        pData[__33] = pMatrixData[__a33];

                        pData[__41] = 0.;
                        pData[__42] = 0.;
                        pData[__43] = 0.;
                        pData[__44] = 1.;
                    }
                } else {
                    //array
                    var pArray = arguments[0];

                    if (pArray.length === 4) {
                        pData[__11] = pArray[0];
                        pData[__12] = 0.;
                        pData[__13] = 0.;
                        pData[__14] = 0.;

                        pData[__21] = 0.;
                        pData[__22] = pArray[1];
                        pData[__23] = 0.;
                        pData[__24] = 0.;

                        pData[__31] = 0.;
                        pData[__32] = 0.;
                        pData[__33] = pArray[2];
                        pData[__34] = 0.;

                        pData[__41] = 0.;
                        pData[__42] = 0.;
                        pData[__43] = 0.;
                        pData[__44] = pArray[3];
                    } else {
                        //length == 16
                        pData[__11] = pArray[__11];
                        pData[__12] = pArray[__12];
                        pData[__13] = pArray[__13];
                        pData[__14] = pArray[__14];

                        pData[__21] = pArray[__21];
                        pData[__22] = pArray[__22];
                        pData[__23] = pArray[__23];
                        pData[__24] = pArray[__24];

                        pData[__31] = pArray[__31];
                        pData[__32] = pArray[__32];
                        pData[__33] = pArray[__33];
                        pData[__34] = pArray[__34];

                        pData[__41] = pArray[__41];
                        pData[__42] = pArray[__42];
                        pData[__43] = pArray[__43];
                        pData[__44] = pArray[__44];
                    }
                }
            } else if (nArgumentsLength == 2) {
                var pMatrixData = arguments[0];
                var v3fTranslation = arguments[1];

                pData[__11] = pMatrixData[__a11];
                pData[__12] = pMatrixData[__a12];
                pData[__13] = pMatrixData[__a13];
                pData[__14] = v3fTranslation.x;

                pData[__21] = pMatrixData[__a21];
                pData[__22] = pMatrixData[__a22];
                pData[__23] = pMatrixData[__a23];
                pData[__24] = v3fTranslation.y;

                pData[__31] = pMatrixData[__a31];
                pData[__32] = pMatrixData[__a32];
                pData[__33] = pMatrixData[__a33];
                pData[__34] = v3fTranslation.z;

                pData[__41] = 0.;
                pData[__42] = 0.;
                pData[__43] = 0.;
                pData[__44] = 1.;
            } else if (nArgumentsLength == 4) {
                if (isFloat(arguments[0])) {
                    pData[__11] = arguments[0];
                    pData[__12] = 0;
                    pData[__13] = 0;
                    pData[__14] = 0;

                    pData[__21] = 0;
                    pData[__22] = arguments[1];
                    pData[__23] = 0;
                    pData[__24] = 0;

                    pData[__31] = 0;
                    pData[__32] = 0;
                    pData[__33] = arguments[2];
                    pData[__34] = 0;

                    pData[__41] = 0;
                    pData[__42] = 0;
                    pData[__43] = 0;
                    pData[__44] = arguments[3];
                } else if (arguments[0] instanceof Vec4) {
                    var v4fColumn1 = arguments[0];
                    var v4fColumn2 = arguments[1];
                    var v4fColumn3 = arguments[2];
                    var v4fColumn4 = arguments[3];

                    pData[__11] = v4fColumn1.x;
                    pData[__12] = v4fColumn2.x;
                    pData[__13] = v4fColumn3.x;
                    pData[__14] = v4fColumn4.x;

                    pData[__21] = v4fColumn1.y;
                    pData[__22] = v4fColumn2.y;
                    pData[__23] = v4fColumn3.y;
                    pData[__24] = v4fColumn4.y;

                    pData[__31] = v4fColumn1.z;
                    pData[__32] = v4fColumn2.z;
                    pData[__33] = v4fColumn3.z;
                    pData[__34] = v4fColumn4.z;

                    pData[__41] = v4fColumn1.w;
                    pData[__42] = v4fColumn2.w;
                    pData[__43] = v4fColumn3.w;
                    pData[__44] = v4fColumn4.w;
                } else {
                    //arrays
                    var pColumn1 = arguments[0];
                    var pColumn2 = arguments[1];
                    var pColumn3 = arguments[2];
                    var pColumn4 = arguments[3];

                    pData[__11] = pColumn1[0];
                    pData[__12] = pColumn2[0];
                    pData[__13] = pColumn3[0];
                    pData[__14] = pColumn4[0];

                    pData[__21] = pColumn1[1];
                    pData[__22] = pColumn2[1];
                    pData[__23] = pColumn3[1];
                    pData[__24] = pColumn4[1];

                    pData[__31] = pColumn1[2];
                    pData[__32] = pColumn2[2];
                    pData[__33] = pColumn3[2];
                    pData[__34] = pColumn4[2];

                    pData[__41] = pColumn1[3];
                    pData[__42] = pColumn2[3];
                    pData[__43] = pColumn3[3];
                    pData[__44] = pColumn4[3];
                }
            } else {
                //nArgumentsLength === 16
                pData[__11] = arguments[__11];
                pData[__12] = arguments[__12];
                pData[__13] = arguments[__13];
                pData[__14] = arguments[__14];

                pData[__21] = arguments[__21];
                pData[__22] = arguments[__22];
                pData[__23] = arguments[__23];
                pData[__24] = arguments[__24];

                pData[__31] = arguments[__31];
                pData[__32] = arguments[__32];
                pData[__33] = arguments[__33];
                pData[__34] = arguments[__34];

                pData[__41] = arguments[__41];
                pData[__42] = arguments[__42];
                pData[__43] = arguments[__43];
                pData[__44] = arguments[__44];
            }
            return this;
        };

        Mat4.prototype.identity = function () {
            var pData = this.data;

            pData[__11] = 1.;
            pData[__12] = 0.;
            pData[__13] = 0.;
            pData[__14] = 0.;

            pData[__21] = 0.;
            pData[__22] = 1.;
            pData[__23] = 0.;
            pData[__24] = 0.;

            pData[__31] = 0.;
            pData[__32] = 0.;
            pData[__33] = 1.;
            pData[__34] = 0.;

            pData[__41] = 0.;
            pData[__42] = 0.;
            pData[__43] = 0.;
            pData[__44] = 1.;

            return this;
        };

        Mat4.prototype.add = function (m4fMat, m4fDestination) {
            if (!isDef(m4fDestination)) {
                m4fDestination = this;
            }

            var pData1 = this.data;
            var pData2 = m4fMat.data;
            var pDataDestination = m4fDestination.data;

            pDataDestination[__11] = pData1[__11] + pData2[__11];
            pDataDestination[__12] = pData1[__12] + pData2[__12];
            pDataDestination[__13] = pData1[__13] + pData2[__13];
            pDataDestination[__14] = pData1[__14] + pData2[__14];

            pDataDestination[__21] = pData1[__21] + pData2[__21];
            pDataDestination[__22] = pData1[__22] + pData2[__22];
            pDataDestination[__23] = pData1[__23] + pData2[__23];
            pDataDestination[__24] = pData1[__24] + pData2[__24];

            pDataDestination[__31] = pData1[__31] + pData2[__31];
            pDataDestination[__32] = pData1[__32] + pData2[__32];
            pDataDestination[__33] = pData1[__33] + pData2[__33];
            pDataDestination[__34] = pData1[__34] + pData2[__34];

            pDataDestination[__41] = pData1[__41] + pData2[__41];
            pDataDestination[__42] = pData1[__42] + pData2[__42];
            pDataDestination[__43] = pData1[__43] + pData2[__43];
            pDataDestination[__44] = pData1[__44] + pData2[__44];

            return m4fDestination;
        };

        Mat4.prototype.subtract = function (m4fMat, m4fDestination) {
            if (!isDef(m4fDestination)) {
                m4fDestination = this;
            }

            var pData1 = this.data;
            var pData2 = m4fMat.data;
            var pDataDestination = m4fDestination.data;

            pDataDestination[__11] = pData1[__11] - pData2[__11];
            pDataDestination[__12] = pData1[__12] - pData2[__12];
            pDataDestination[__13] = pData1[__13] - pData2[__13];
            pDataDestination[__14] = pData1[__14] - pData2[__14];

            pDataDestination[__21] = pData1[__21] - pData2[__21];
            pDataDestination[__22] = pData1[__22] - pData2[__22];
            pDataDestination[__23] = pData1[__23] - pData2[__23];
            pDataDestination[__24] = pData1[__24] - pData2[__24];

            pDataDestination[__31] = pData1[__31] - pData2[__31];
            pDataDestination[__32] = pData1[__32] - pData2[__32];
            pDataDestination[__33] = pData1[__33] - pData2[__33];
            pDataDestination[__34] = pData1[__34] - pData2[__34];

            pDataDestination[__41] = pData1[__41] - pData2[__41];
            pDataDestination[__42] = pData1[__42] - pData2[__42];
            pDataDestination[__43] = pData1[__43] - pData2[__43];
            pDataDestination[__44] = pData1[__44] - pData2[__44];

            return m4fDestination;
        };

        Mat4.prototype.multiply = function (m4fMat, m4fDestination) {
            if (!isDef(m4fDestination)) {
                m4fDestination = this;
            }

            var pData1 = this.data;
            var pData2 = m4fMat.data;
            var pDataDestination = m4fDestination.data;

            //кешируем значения матриц для ускорения
            var a11 = pData1[__11], a12 = pData1[__12], a13 = pData1[__13], a14 = pData1[__14];
            var a21 = pData1[__21], a22 = pData1[__22], a23 = pData1[__23], a24 = pData1[__24];
            var a31 = pData1[__31], a32 = pData1[__32], a33 = pData1[__33], a34 = pData1[__34];
            var a41 = pData1[__41], a42 = pData1[__42], a43 = pData1[__43], a44 = pData1[__44];

            var b11 = pData2[__11], b12 = pData2[__12], b13 = pData2[__13], b14 = pData2[__14];
            var b21 = pData2[__21], b22 = pData2[__22], b23 = pData2[__23], b24 = pData2[__24];
            var b31 = pData2[__31], b32 = pData2[__32], b33 = pData2[__33], b34 = pData2[__34];
            var b41 = pData2[__41], b42 = pData2[__42], b43 = pData2[__43], b44 = pData2[__44];

            pDataDestination[__11] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            pDataDestination[__12] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            pDataDestination[__13] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            pDataDestination[__14] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

            pDataDestination[__21] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            pDataDestination[__22] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            pDataDestination[__23] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            pDataDestination[__24] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

            pDataDestination[__31] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            pDataDestination[__32] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            pDataDestination[__33] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            pDataDestination[__34] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

            pDataDestination[__41] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            pDataDestination[__42] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            pDataDestination[__43] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            pDataDestination[__44] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

            return m4fDestination;
        };

        /** inline */ Mat4.prototype.multiplyLeft = function (m4fMat, m4fDestination) {
            if (!isDef(m4fDestination)) {
                m4fDestination = this;
            }
            return m4fMat.multiply(this, m4fDestination);
        };

        Mat4.prototype.multiplyVec4 = function (v4fVec, v4fDestination) {
            if (!isDef(v4fDestination)) {
                v4fDestination = v4fVec;
            }

            var pData = this.data;

            var x = v4fVec.x, y = v4fVec.y, z = v4fVec.z, w = v4fVec.w;

            v4fDestination.x = pData[__11] * x + pData[__12] * y + pData[__13] * z + pData[__14] * w;
            v4fDestination.y = pData[__21] * x + pData[__22] * y + pData[__23] * z + pData[__24] * w;
            v4fDestination.z = pData[__31] * x + pData[__32] * y + pData[__33] * z + pData[__34] * w;
            v4fDestination.w = pData[__41] * x + pData[__42] * y + pData[__43] * z + pData[__44] * w;

            return v4fDestination;
        };

        Mat4.prototype.transpose = function (m4fDestination) {
            var pData = this.data;

            if (!isDef(m4fDestination)) {
                var a12 = pData[__12], a13 = pData[__13], a14 = pData[__14];
                var a23 = pData[__23], a24 = pData[__24];
                var a34 = pData[__34];

                pData[__12] = pData[__21];
                pData[__13] = pData[__31];
                pData[__14] = pData[__41];

                pData[__21] = a12;
                pData[__23] = pData[__32];
                pData[__24] = pData[__42];

                pData[__31] = a13;
                pData[__32] = a23;
                pData[__34] = pData[__43];

                pData[__41] = a14;
                pData[__42] = a24;
                pData[__43] = a34;

                return this;
            }

            var pDataDestination = m4fDestination.data;

            pDataDestination[__11] = pData[__11];
            pDataDestination[__12] = pData[__21];
            pDataDestination[__13] = pData[__31];
            pDataDestination[__14] = pData[__41];

            pDataDestination[__21] = pData[__12];
            pDataDestination[__22] = pData[__22];
            pDataDestination[__23] = pData[__32];
            pDataDestination[__24] = pData[__42];

            pDataDestination[__31] = pData[__13];
            pDataDestination[__32] = pData[__23];
            pDataDestination[__33] = pData[__33];
            pDataDestination[__34] = pData[__43];

            pDataDestination[__41] = pData[__14];
            pDataDestination[__42] = pData[__24];
            pDataDestination[__43] = pData[__34];
            pDataDestination[__44] = pData[__44];

            return m4fDestination;
        };

        Mat4.prototype.determinant = function () {
            var pData = this.data;

            var a11 = pData[__11], a12 = pData[__12], a13 = pData[__13], a14 = pData[__14];
            var a21 = pData[__21], a22 = pData[__22], a23 = pData[__23], a24 = pData[__24];
            var a31 = pData[__31], a32 = pData[__32], a33 = pData[__33], a34 = pData[__34];
            var a41 = pData[__41], a42 = pData[__42], a43 = pData[__43], a44 = pData[__44];

            return a41 * a32 * a23 * a14 - a31 * a42 * a23 * a14 - a41 * a22 * a33 * a14 + a21 * a42 * a33 * a14 + a31 * a22 * a43 * a14 - a21 * a32 * a43 * a14 - a41 * a32 * a13 * a24 + a31 * a42 * a13 * a24 + a41 * a12 * a33 * a24 - a11 * a42 * a33 * a24 - a31 * a12 * a43 * a24 + a11 * a32 * a43 * a24 + a41 * a22 * a13 * a34 - a21 * a42 * a13 * a34 - a41 * a12 * a23 * a34 + a11 * a42 * a23 * a34 + a21 * a12 * a43 * a34 - a11 * a22 * a43 * a34 - a31 * a22 * a13 * a44 + a21 * a32 * a13 * a44 + a31 * a12 * a23 * a44 - a11 * a32 * a23 * a44 - a21 * a12 * a33 * a44 + a11 * a22 * a33 * a44;
        };

        Mat4.prototype.inverse = function (m4fDestination) {
            if (!isDef(m4fDestination)) {
                m4fDestination = this;
            }

            var pData = this.data;
            var pDataDestination = m4fDestination.data;

            // Cache the matrix values (makes for huge speed increases!)
            var a11 = pData[__11], a12 = pData[__12], a13 = pData[__13], a14 = pData[__14];
            var a21 = pData[__21], a22 = pData[__22], a23 = pData[__23], a24 = pData[__24];
            var a31 = pData[__31], a32 = pData[__32], a33 = pData[__33], a34 = pData[__34];
            var a41 = pData[__41], a42 = pData[__42], a43 = pData[__43], a44 = pData[__44];

            var b00 = a11 * a22 - a12 * a21;
            var b01 = a11 * a23 - a13 * a21;
            var b02 = a11 * a24 - a14 * a21;
            var b03 = a12 * a23 - a13 * a22;
            var b04 = a12 * a24 - a14 * a22;
            var b05 = a13 * a24 - a14 * a23;
            var b06 = a31 * a42 - a32 * a41;
            var b07 = a31 * a43 - a33 * a41;
            var b08 = a31 * a44 - a34 * a41;
            var b09 = a32 * a43 - a33 * a42;
            var b10 = a32 * a44 - a34 * a42;
            var b11 = a33 * a44 - a34 * a43;

            var fDeterminant = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

            if (fDeterminant === 0.) {
                //debug_assert(false,"обращение матрицы с нулевым детеминантом:\n"
                //                + this.toString());
                //чтоб все не навернулось
                return m4fDestination.set(1.);
            }

            var fInverseDeterminant = 1 / fDeterminant;

            pDataDestination[__11] = (a22 * b11 - a23 * b10 + a24 * b09) * fInverseDeterminant;
            pDataDestination[__12] = (-a12 * b11 + a13 * b10 - a14 * b09) * fInverseDeterminant;
            pDataDestination[__13] = (a42 * b05 - a43 * b04 + a44 * b03) * fInverseDeterminant;
            pDataDestination[__14] = (-a32 * b05 + a33 * b04 - a34 * b03) * fInverseDeterminant;

            pDataDestination[__21] = (-a21 * b11 + a23 * b08 - a24 * b07) * fInverseDeterminant;
            pDataDestination[__22] = (a11 * b11 - a13 * b08 + a14 * b07) * fInverseDeterminant;
            pDataDestination[__23] = (-a41 * b05 + a43 * b02 - a44 * b01) * fInverseDeterminant;
            pDataDestination[__24] = (a31 * b05 - a33 * b02 + a34 * b01) * fInverseDeterminant;

            pDataDestination[__31] = (a21 * b10 - a22 * b08 + a24 * b06) * fInverseDeterminant;
            pDataDestination[__32] = (-a11 * b10 + a12 * b08 - a14 * b06) * fInverseDeterminant;
            pDataDestination[__33] = (a41 * b04 - a42 * b02 + a44 * b00) * fInverseDeterminant;
            pDataDestination[__34] = (-a31 * b04 + a32 * b02 - a34 * b00) * fInverseDeterminant;

            pDataDestination[__41] = (-a21 * b09 + a22 * b07 - a23 * b06) * fInverseDeterminant;
            pDataDestination[__42] = (a11 * b09 - a12 * b07 + a13 * b06) * fInverseDeterminant;
            pDataDestination[__43] = (-a41 * b03 + a42 * b01 - a43 * b00) * fInverseDeterminant;
            pDataDestination[__44] = (a31 * b03 - a32 * b01 + a33 * b00) * fInverseDeterminant;

            return m4fDestination;
        };

        /** inline */ Mat4.prototype.trace = function () {
            var pData = this.data;
            return pData[__11] + pData[__22] + pData[__33] + pData[__44];
        };

        Mat4.prototype.isEqual = function (m4fMat, fEps) {
            if (typeof fEps === "undefined") { fEps = 0.; }
            var pData1 = this.data;
            var pData2 = m4fMat.data;

            if (fEps === 0.) {
                if (pData1[__11] !== pData2[__11] || pData1[__12] !== pData2[__12] || pData1[__13] !== pData2[__13] || pData1[__14] !== pData2[__14] || pData1[__21] !== pData2[__21] || pData1[__22] !== pData2[__22] || pData1[__23] !== pData2[__23] || pData1[__24] !== pData2[__24] || pData1[__31] !== pData2[__31] || pData1[__32] !== pData2[__32] || pData1[__33] !== pData2[__33] || pData1[__34] !== pData2[__34] || pData1[__41] !== pData2[__41] || pData1[__42] !== pData2[__42] || pData1[__43] !== pData2[__43] || pData1[__44] !== pData2[__44]) {
                    return false;
                }
            } else {
                if (abs(pData1[__11] - pData2[__11]) > fEps || abs(pData1[__12] - pData2[__12]) > fEps || abs(pData1[__13] - pData2[__13]) > fEps || abs(pData1[__14] - pData2[__14]) > fEps || abs(pData1[__21] - pData2[__21]) > fEps || abs(pData1[__22] - pData2[__22]) > fEps || abs(pData1[__23] - pData2[__23]) > fEps || abs(pData1[__24] - pData2[__24]) > fEps || abs(pData1[__31] - pData2[__31]) > fEps || abs(pData1[__32] - pData2[__32]) > fEps || abs(pData1[__33] - pData2[__33]) > fEps || abs(pData1[__34] - pData2[__34]) > fEps || abs(pData1[__41] - pData2[__41]) > fEps || abs(pData1[__42] - pData2[__42]) > fEps || abs(pData1[__43] - pData2[__43]) > fEps || abs(pData1[__44] - pData2[__44]) > fEps) {
                    return false;
                }
            }
            return true;
        };

        Mat4.prototype.isDiagonal = function (fEps) {
            if (typeof fEps === "undefined") { fEps = 0.; }
            var pData = this.data;

            if (fEps === 0.) {
                if (pData[__12] !== 0. || pData[__13] !== 0. || pData[__14] != 0. || pData[__21] !== 0. || pData[__23] !== 0. || pData[__24] != 0. || pData[__31] !== 0. || pData[__32] !== 0. || pData[__34] != 0. || pData[__41] !== 0. || pData[__42] !== 0. || pData[__43] != 0.) {
                    return false;
                }
            } else {
                if (abs(pData[__12]) > fEps || abs(pData[__13]) > fEps || abs(pData[__14]) > fEps || abs(pData[__21]) > fEps || abs(pData[__23]) > fEps || abs(pData[__24]) > fEps || abs(pData[__31]) > fEps || abs(pData[__32]) > fEps || abs(pData[__34]) > fEps || abs(pData[__41]) > fEps || abs(pData[__42]) > fEps || abs(pData[__43]) > fEps) {
                    return false;
                }
            }
            return true;
        };

        Mat4.prototype.toMat3 = function (m3fDestination) {
            if (!isDef(m3fDestination)) {
                m3fDestination = new Mat3();
            }

            var pData = this.data;
            var pDataDestination = m3fDestination.data;

            pDataDestination[__a11] = pData[__11];
            pDataDestination[__a12] = pData[__12];
            pDataDestination[__a13] = pData[__13];

            pDataDestination[__a21] = pData[__21];
            pDataDestination[__a22] = pData[__22];
            pDataDestination[__a23] = pData[__23];

            pDataDestination[__a31] = pData[__31];
            pDataDestination[__a32] = pData[__32];
            pDataDestination[__a33] = pData[__33];

            return m3fDestination;
        };

        Mat4.prototype.toQuat4 = function (q4fDestination) {
            if (!isDef(q4fDestination)) {
                q4fDestination = new Quat4();
            }

            var pData = this.data;

            var a11 = pData[__11], a12 = pData[__12], a13 = pData[__13];
            var a21 = pData[__21], a22 = pData[__22], a23 = pData[__23];
            var a31 = pData[__31], a32 = pData[__32], a33 = pData[__33];

            var x2 = ((a11 - a22 - a33) + 1.) / 4.;
            var y2 = ((a22 - a11 - a33) + 1.) / 4.;
            var z2 = ((a33 - a11 - a22) + 1.) / 4.;
            var w2 = ((a11 + a22 + a33) + 1.) / 4.;

            var fMax = max(x2, max(y2, max(z2, w2)));

            if (fMax == x2) {
                //максимальная компонента берется положительной
                var x = sqrt(x2);

                q4fDestination.x = x;
                q4fDestination.y = (a21 + a12) / 4. / x;
                q4fDestination.z = (a31 + a13) / 4. / x;
                q4fDestination.w = (a32 - a23) / 4. / x;
            } else if (fMax == y2) {
                //максимальная компонента берется положительной
                var y = sqrt(y2);

                q4fDestination.x = (a21 + a12) / 4. / y;
                q4fDestination.y = y;
                q4fDestination.z = (a32 + a23) / 4. / y;
                q4fDestination.w = (a13 - a31) / 4. / y;
            } else if (fMax == z2) {
                //максимальная компонента берется положительной
                var z = sqrt(z2);

                q4fDestination.x = (a31 + a13) / 4. / z;
                q4fDestination.y = (a32 + a23) / 4. / z;
                q4fDestination.z = z;
                q4fDestination.w = (a21 - a12) / 4. / z;
            } else {
                //максимальная компонента берется положительной
                var w = sqrt(w2);

                q4fDestination.x = (a32 - a23) / 4. / w;
                q4fDestination.y = (a13 - a31) / 4. / w;
                q4fDestination.z = (a21 - a12) / 4. / w;
                q4fDestination.w = w;
            }

            return q4fDestination;
        };

        Mat4.prototype.toRotationMatrix = function (m4fDestination) {
            if (!isDef(m4fDestination)) {
                m4fDestination = new Mat4();
            }

            var pData = this.data;
            var pDataDestination = m4fDestination.data;

            pDataDestination[__11] = pData[__11];
            pDataDestination[__12] = pData[__12];
            pDataDestination[__13] = pData[__13];
            pDataDestination[__14] = 0.;

            pDataDestination[__21] = pData[__21];
            pDataDestination[__22] = pData[__22];
            pDataDestination[__23] = pData[__23];
            pDataDestination[__24] = 0.;

            pDataDestination[__31] = pData[__31];
            pDataDestination[__32] = pData[__32];
            pDataDestination[__33] = pData[__33];
            pDataDestination[__34] = 0.;

            pDataDestination[__41] = 0.;
            pDataDestination[__42] = 0.;
            pDataDestination[__43] = 0.;
            pDataDestination[__44] = 1.;

            return m4fDestination;
        };

        Mat4.prototype.toString = function (iFixed) {
            if (typeof iFixed === "undefined") { iFixed = 2; }
            var pData = this.data;

            return '[' + pData[__11].toFixed(iFixed) + ", " + pData[__12].toFixed(iFixed) + ', ' + pData[__13].toFixed(iFixed) + ', ' + pData[__14].toFixed(iFixed) + ',\n' + pData[__21].toFixed(iFixed) + ", " + pData[__22].toFixed(iFixed) + ', ' + pData[__23].toFixed(iFixed) + ', ' + pData[__24].toFixed(iFixed) + ',\n' + pData[__31].toFixed(iFixed) + ", " + pData[__32].toFixed(iFixed) + ', ' + pData[__33].toFixed(iFixed) + ', ' + pData[__34].toFixed(iFixed) + ',\n' + pData[__41].toFixed(iFixed) + ", " + pData[__42].toFixed(iFixed) + ', ' + pData[__43].toFixed(iFixed) + ', ' + pData[__44].toFixed(iFixed) + ']';
        };

        Mat4.prototype.toArray = function (pDest) {
            if (typeof pDest === "undefined") { pDest = new Array(16); }
            //TODO: too slow :(
            return conv.retrieve(this.data, pDest, 1, 0, 16) && pDest;
        };

        Mat4.prototype.rotateRight = function (fAngle, v3fAxis, m4fDestination) {
            var pData = this.data;

            var x = v3fAxis.x, y = v3fAxis.y, z = v3fAxis.z;
            var fLength = Math.sqrt(x * x + y * y + z * z);

            if (fLength === 0.) {
                logger.assert(false, "попытка вращения вокруг оси нулевой длины. Угол " + fAngle + ". Ось " + v3fAxis.toString());
                if (isDef(m4fDestination)) {
                    m4fDestination.set(this);
                } else {
                    m4fDestination = this;
                }
                return m4fDestination;
            }

            var fInvLength = 1. / fLength;

            x *= fInvLength;
            y *= fInvLength;
            z *= fInvLength;

            var a11 = pData[__11], a12 = pData[__12], a13 = pData[__13];
            var a21 = pData[__21], a22 = pData[__22], a23 = pData[__23];
            var a31 = pData[__31], a32 = pData[__32], a33 = pData[__33];

            var fSin = sin(fAngle);
            var fCos = cos(fAngle);
            var fTmp = 1. - fCos;

            //build Rotation matrix
            var b11 = fCos + fTmp * x * x, b12 = fTmp * x * y - fSin * z, b13 = fTmp * x * z + fSin * y;
            var b21 = fTmp * y * z + fSin * z, b22 = fCos + fTmp * y * y, b23 = fTmp * y * z - fSin * x;
            var b31 = fTmp * z * x - fSin * y, b32 = fTmp * z * y + fSin * x, b33 = fCos + fTmp * z * z;

            if (!isDef(m4fDestination)) {
                pData[__11] = a11 * b11 + a12 * b21 + a13 * b31;
                pData[__12] = a11 * b12 + a12 * b22 + a13 * b32;
                pData[__13] = a11 * b13 + a12 * b23 + a13 * b33;

                pData[__21] = a21 * b11 + a22 * b21 + a23 * b31;
                pData[__22] = a21 * b12 + a22 * b22 + a23 * b32;
                pData[__23] = a21 * b13 + a22 * b23 + a23 * b33;

                pData[__31] = a31 * b11 + a32 * b21 + a33 * b31;
                pData[__32] = a31 * b12 + a32 * b22 + a33 * b32;
                pData[__33] = a31 * b13 + a32 * b23 + a33 * b33;

                return this;
            }

            var pDataDestination = m4fDestination.data;

            pDataDestination[__11] = a11 * b11 + a12 * b21 + a13 * b31;
            pDataDestination[__12] = a11 * b12 + a12 * b22 + a13 * b32;
            pDataDestination[__13] = a11 * b13 + a12 * b23 + a13 * b33;
            pDataDestination[__14] = pData[__14];

            pDataDestination[__21] = a21 * b11 + a22 * b21 + a23 * b31;
            pDataDestination[__22] = a21 * b12 + a22 * b22 + a23 * b32;
            pDataDestination[__23] = a21 * b13 + a22 * b23 + a23 * b33;
            pDataDestination[__24] = pData[__24];

            pDataDestination[__31] = a31 * b11 + a32 * b21 + a33 * b31;
            pDataDestination[__32] = a31 * b12 + a32 * b22 + a33 * b32;
            pDataDestination[__33] = a31 * b13 + a32 * b23 + a33 * b33;
            pDataDestination[__34] = pData[__34];

            pDataDestination[__41] = pData[__41];
            pDataDestination[__42] = pData[__42];
            pDataDestination[__43] = pData[__43];
            pDataDestination[__44] = pData[__44];

            return m4fDestination;
        };

        Mat4.prototype.rotateLeft = function (fAngle, v3fAxis, m4fDestination) {
            var pData = this.data;

            var x = v3fAxis.x, y = v3fAxis.y, z = v3fAxis.z;
            var fLength = Math.sqrt(x * x + y * y + z * z);

            if (fLength === 0.) {
                logger.assert(false, "попытка вращения вокруг оси нулевой длины. Угол " + fAngle + ". Ось " + v3fAxis.toString());
                if (isDef(m4fDestination)) {
                    m4fDestination.set(this);
                } else {
                    m4fDestination = this;
                }
                return m4fDestination;
            }

            var fInvLength = 1. / fLength;

            x *= fInvLength;
            y *= fInvLength;
            z *= fInvLength;

            var a11 = pData[__11], a12 = pData[__12], a13 = pData[__13], a14 = pData[__14];
            var a21 = pData[__21], a22 = pData[__22], a23 = pData[__23], a24 = pData[__24];
            var a31 = pData[__31], a32 = pData[__32], a33 = pData[__33], a34 = pData[__34];

            var fSin = sin(fAngle);
            var fCos = cos(fAngle);
            var fTmp = 1. - fCos;

            //build Rotation matrix
            var b11 = fCos + fTmp * x * x, b12 = fTmp * x * y - fSin * z, b13 = fTmp * x * z + fSin * y;
            var b21 = fTmp * y * z + fSin * z, b22 = fCos + fTmp * y * y, b23 = fTmp * y * z - fSin * x;
            var b31 = fTmp * z * x - fSin * y, b32 = fTmp * z * y + fSin * x, b33 = fCos + fTmp * z * z;

            if (!isDef(m4fDestination)) {
                pData[__11] = b11 * a11 + b12 * a21 + b13 * a31;
                pData[__12] = b11 * a12 + b12 * a22 + b13 * a32;
                pData[__13] = b11 * a13 + b12 * a23 + b13 * a33;
                pData[__14] = b11 * a14 + b12 * a24 + b13 * a34;

                pData[__21] = b21 * a11 + b22 * a21 + b23 * a31;
                pData[__22] = b21 * a12 + b22 * a22 + b23 * a32;
                pData[__23] = b21 * a13 + b22 * a23 + b23 * a33;
                pData[__24] = b21 * a14 + b22 * a24 + b23 * a34;

                pData[__31] = b31 * a11 + b32 * a21 + b33 * a31;
                pData[__32] = b31 * a12 + b32 * a22 + b33 * a32;
                pData[__33] = b31 * a13 + b32 * a23 + b33 * a33;
                pData[__34] = b31 * a14 + b32 * a24 + b33 * a34;

                return this;
            }

            var pDataDestination = m4fDestination.data;

            pDataDestination[__11] = b11 * a11 + b12 * a21 + b13 * a31;
            pDataDestination[__12] = b11 * a12 + b12 * a22 + b13 * a32;
            pDataDestination[__13] = b11 * a13 + b12 * a23 + b13 * a33;
            pDataDestination[__14] = b11 * a14 + b12 * a24 + b13 * a34;

            pDataDestination[__21] = b21 * a11 + b22 * a21 + b23 * a31;
            pDataDestination[__22] = b21 * a12 + b22 * a22 + b23 * a32;
            pDataDestination[__23] = b21 * a13 + b22 * a23 + b23 * a33;
            pDataDestination[__24] = b21 * a14 + b22 * a24 + b23 * a34;

            pDataDestination[__31] = b31 * a11 + b32 * a21 + b33 * a31;
            pDataDestination[__32] = b31 * a12 + b32 * a22 + b33 * a32;
            pDataDestination[__33] = b31 * a13 + b32 * a23 + b33 * a33;
            pDataDestination[__34] = b31 * a14 + b32 * a24 + b33 * a34;

            pDataDestination[__41] = pData[__41];
            pDataDestination[__42] = pData[__42];
            pDataDestination[__43] = pData[__43];
            pDataDestination[__44] = pData[__44];

            return m4fDestination;
        };

        /** inline */ Mat4.prototype.setTranslation = function (v3fTranslation) {
            var pData = this.data;

            pData[__14] = v3fTranslation.x;
            pData[__24] = v3fTranslation.y;
            pData[__34] = v3fTranslation.z;

            return this;
        };

        /** inline */ Mat4.prototype.getTranslation = function (v3fTranslation) {
            if (!isDef(v3fTranslation)) {
                v3fTranslation = new Vec3();
            }

            var pData = this.data;

            v3fTranslation.x = pData[__14];
            v3fTranslation.y = pData[__24];
            v3fTranslation.z = pData[__34];

            return v3fTranslation;
        };

        Mat4.prototype.translateRight = function (v3fTranslation, m4fDestination) {
            var pData = this.data;

            var x = v3fTranslation.x, y = v3fTranslation.y, z = v3fTranslation.z;

            if (!isDef(m4fDestination)) {
                pData[__14] = pData[__11] * x + pData[__12] * y + pData[__13] * z + pData[__14];
                pData[__24] = pData[__21] * x + pData[__22] * y + pData[__23] * z + pData[__24];
                pData[__34] = pData[__31] * x + pData[__32] * y + pData[__33] * z + pData[__34];
                pData[__44] = pData[__41] * x + pData[__42] * y + pData[__43] * z + pData[__44];

                //строго говоря последнюю строчку умножать не обязательно, так как она должна быть -> 0 0 0 1
                return this;
            }

            var pDataDestination = m4fDestination.data;

            //кешируем матрицу вращений
            var a11 = pData[__11], a12 = pData[__12], a13 = pData[__13];
            var a21 = pData[__11], a22 = pData[__22], a23 = pData[__23];
            var a31 = pData[__11], a32 = pData[__32], a33 = pData[__33];
            var a41 = pData[__11], a42 = pData[__42], a43 = pData[__43];

            pDataDestination[__11] = a11;
            pDataDestination[__12] = a12;
            pDataDestination[__13] = a13;
            pDataDestination[__14] = a11 * x + a12 * y + a13 * z + pData[__14];

            pDataDestination[__21] = a21;
            pDataDestination[__22] = a22;
            pDataDestination[__23] = a23;
            pDataDestination[__24] = a21 * x + a22 * y + a23 * z + pData[__24];

            pDataDestination[__31] = a31;
            pDataDestination[__32] = a32;
            pDataDestination[__33] = a33;
            pDataDestination[__34] = a31 * x + a32 * y + a33 * z + pData[__34];

            pDataDestination[__41] = a41;
            pDataDestination[__42] = a42;
            pDataDestination[__43] = a43;
            pDataDestination[__44] = a41 * x + a42 * y + a43 * z + pData[__44];

            return m4fDestination;
        };

        Mat4.prototype.translateLeft = function (v3fTranslation, m4fDestination) {
            var pData = this.data;

            var x = v3fTranslation.x, y = v3fTranslation.y, z = v3fTranslation.z;

            if (!isDef(m4fDestination)) {
                pData[__14] = x + pData[__14];
                pData[__24] = y + pData[__24];
                pData[__34] = z + pData[__34];
                return this;
            }

            var pDataDestination = m4fDestination.data;

            pDataDestination[__11] = pData[__11];
            pDataDestination[__12] = pData[__12];
            pDataDestination[__13] = pData[__13];
            pDataDestination[__14] = x + pData[__14];

            pDataDestination[__21] = pData[__21];
            pDataDestination[__22] = pData[__22];
            pDataDestination[__23] = pData[__23];
            pDataDestination[__24] = y + pData[__24];

            pDataDestination[__31] = pData[__31];
            pDataDestination[__32] = pData[__32];
            pDataDestination[__33] = pData[__33];
            pDataDestination[__34] = z + pData[__34];

            pDataDestination[__41] = pData[__41];
            pDataDestination[__42] = pData[__42];
            pDataDestination[__43] = pData[__43];
            pDataDestination[__44] = pData[__44];

            return m4fDestination;
        };

        Mat4.prototype.scaleRight = function (v3fScale, m4fDestination) {
            var pData = this.data;

            var x = v3fScale.x, y = v3fScale.y, z = v3fScale.z;

            if (!isDef(m4fDestination)) {
                pData[__11] *= x;
                pData[__12] *= y;
                pData[__13] *= z;

                pData[__21] *= x;
                pData[__22] *= y;
                pData[__23] *= z;

                pData[__31] *= x;
                pData[__32] *= y;
                pData[__33] *= z;

                //скейлить эти компоненты необязательно, так как там должны лежать нули
                pData[__41] *= x;
                pData[__42] *= y;
                pData[__43] *= z;

                return this;
            }

            var pDataDestination = m4fDestination.data;

            pDataDestination[__11] = pData[__11] * x;
            pDataDestination[__12] = pData[__12] * y;
            pDataDestination[__13] = pData[__13] * z;
            pDataDestination[__14] = pData[__14];

            pDataDestination[__21] = pData[__21] * x;
            pDataDestination[__22] = pData[__22] * y;
            pDataDestination[__23] = pData[__23] * z;
            pDataDestination[__24] = pData[__24];

            pDataDestination[__31] = pData[__31] * x;
            pDataDestination[__32] = pData[__32] * y;
            pDataDestination[__33] = pData[__33] * z;
            pDataDestination[__34] = pData[__34];

            //скейлить эти компоненты необязательно, так как там должны лежать нули
            pDataDestination[__41] = pData[__41] * x;
            pDataDestination[__42] = pData[__42] * y;
            pDataDestination[__43] = pData[__43] * z;
            pDataDestination[__44] = pData[__44];

            return m4fDestination;
        };

        Mat4.prototype.scaleLeft = function (v3fScale, m4fDestination) {
            var pData = this.data;

            var x = v3fScale.x, y = v3fScale.y, z = v3fScale.z;

            if (!isDef(m4fDestination)) {
                pData[__11] *= x;
                pData[__12] *= x;
                pData[__13] *= x;
                pData[__14] *= x;

                pData[__21] *= y;
                pData[__22] *= y;
                pData[__23] *= y;
                pData[__24] *= y;

                pData[__31] *= z;
                pData[__32] *= z;
                pData[__33] *= z;
                pData[__34] *= z;

                return this;
            }

            var pDataDestination = m4fDestination.data;

            pDataDestination[__11] = pData[__11] * x;
            pDataDestination[__12] = pData[__12] * x;
            pDataDestination[__13] = pData[__13] * x;
            pDataDestination[__14] = pData[__14] * x;

            pDataDestination[__21] = pData[__21] * y;
            pDataDestination[__22] = pData[__22] * y;
            pDataDestination[__23] = pData[__23] * y;
            pDataDestination[__24] = pData[__24] * y;

            pDataDestination[__31] = pData[__31] * z;
            pDataDestination[__32] = pData[__32] * z;
            pDataDestination[__33] = pData[__33] * z;
            pDataDestination[__34] = pData[__34] * z;

            pDataDestination[__41] = pData[__41];
            pDataDestination[__42] = pData[__42];
            pDataDestination[__43] = pData[__43];
            pDataDestination[__44] = pData[__44];

            return m4fDestination;
        };

        /** inline */ Mat4.prototype.decompose = function (q4fRotation, v3fScale, v3fTranslation) {
            this.getTranslation(v3fTranslation);
            var m3fRotScale = this.toMat3(Mat3.temp());
            return m3fRotScale.decompose(q4fRotation, v3fScale);
        };

        Mat4.prototype.row = function (iRow, v4fDestination) {
            if (!isDef(v4fDestination)) {
                v4fDestination = new Vec4();
            }

            var pData = this.data;

            switch (iRow) {
                case 1:
                    v4fDestination.x = pData[__11];
                    v4fDestination.y = pData[__12];
                    v4fDestination.z = pData[__13];
                    v4fDestination.w = pData[__14];
                    break;
                case 2:
                    v4fDestination.x = pData[__21];
                    v4fDestination.y = pData[__22];
                    v4fDestination.z = pData[__23];
                    v4fDestination.w = pData[__24];
                    break;
                case 3:
                    v4fDestination.x = pData[__31];
                    v4fDestination.y = pData[__32];
                    v4fDestination.z = pData[__33];
                    v4fDestination.w = pData[__34];
                    break;
                case 4:
                    v4fDestination.x = pData[__41];
                    v4fDestination.y = pData[__42];
                    v4fDestination.z = pData[__43];
                    v4fDestination.w = pData[__44];
                    break;
            }

            return v4fDestination;
        };

        Mat4.prototype.column = function (iColumn, v4fDestination) {
            if (!isDef(v4fDestination)) {
                v4fDestination = new Vec4();
            }

            var pData = this.data;

            switch (iColumn) {
                case 1:
                    v4fDestination.x = pData[__11];
                    v4fDestination.y = pData[__21];
                    v4fDestination.z = pData[__31];
                    v4fDestination.w = pData[__41];
                    break;
                case 2:
                    v4fDestination.x = pData[__12];
                    v4fDestination.y = pData[__22];
                    v4fDestination.z = pData[__32];
                    v4fDestination.w = pData[__42];
                    break;
                case 3:
                    v4fDestination.x = pData[__13];
                    v4fDestination.y = pData[__23];
                    v4fDestination.z = pData[__33];
                    v4fDestination.w = pData[__43];
                    break;
                case 4:
                    v4fDestination.x = pData[__14];
                    v4fDestination.y = pData[__24];
                    v4fDestination.z = pData[__34];
                    v4fDestination.w = pData[__44];
                    break;
            }

            return v4fDestination;
        };

        Mat4.prototype.unproj = function (v, v4fDestination) {
            if (!isDef(v4fDestination)) {
                v4fDestination = new Vec4();
            }

            var pData = this.data;
            var v3fScreen = v;
            var x, y, z;

            if (this.isOrthogonalProjection()) {
                //orthogonal projection case
                z = (v3fScreen.z - pData[__34]) / pData[__33];
                y = (v3fScreen.y - pData[__24]) / pData[__22];
                x = (v3fScreen.x - pData[__14]) / pData[__11];
            } else {
                //frustum case
                z = -pData[__34] / (pData[__33] + v3fScreen.z);
                y = -(v3fScreen.y + pData[__23]) * z / pData[__22];
                x = -(v3fScreen.x + pData[__13]) * z / pData[__11];
            }

            v4fDestination.x = x;
            v4fDestination.y = y;
            v4fDestination.z = z;
            v4fDestination.w = 1.;

            return v4fDestination;
        };

        Mat4.prototype.unprojZ = function (fZ) {
            var pData = this.data;

            if (this.isOrthogonalProjection()) {
                //orthogonal projection case
                return (fZ - pData[__34]) / pData[__33];
            } else {
                //pData[__43] === -1
                //frustum case
                return -pData[__34] / (pData[__33] + fZ);
            }
        };

        /** inline */ Mat4.prototype.isOrthogonalProjection = function () {
            // var pData: Float32Array = this.data;
            // if(pData[__44] === 1){
            // 	//orthogonal projection
            // 	return true;
            // }
            // else{
            // 	//pData[__43] === -1
            // 	//frustum projection
            // 	return false;
            // }
            return ((this.data[__44] === 1) ? true : false);
        };

        Mat4.fromYawPitchRoll = function () {
            var fYaw = 0.0, fPitch = 0.0, fRoll = 0.0, m4fDestination = null;

            if (arguments.length <= 2) {
                //Vec3 + m4fDestination
                var v3fVec = arguments[0];

                fYaw = v3fVec.x;
                fPitch = v3fVec.y;
                fRoll = v3fVec.z;

                m4fDestination = arguments[1];
            } else {
                fYaw = arguments[0];
                fPitch = arguments[1];
                fRoll = arguments[2];
                m4fDestination = arguments[3];
            }

            if (!isDef(m4fDestination)) {
                m4fDestination = new Mat4();
            }

            var pDataDestination = m4fDestination.data;

            var fSin1 = Math.sin(fYaw);
            var fSin2 = Math.sin(fPitch);
            var fSin3 = Math.sin(fRoll);

            var fCos1 = Math.cos(fYaw);
            var fCos2 = Math.cos(fPitch);
            var fCos3 = Math.cos(fRoll);

            pDataDestination[__11] = fCos1 * fCos3 + fSin1 * fSin2 * fSin3;
            pDataDestination[__12] = fCos3 * fSin1 * fSin2 - fCos1 * fSin3;
            pDataDestination[__13] = fCos2 * fSin1;
            pDataDestination[__14] = 0.;

            pDataDestination[__21] = fCos2 * fSin3;
            pDataDestination[__22] = fCos2 * fCos3;
            pDataDestination[__23] = -fSin2;
            pDataDestination[__24] = 0.;

            pDataDestination[__31] = fCos1 * fSin2 * fSin3 - fCos3 * fSin1;
            pDataDestination[__32] = fSin1 * fSin3 + fCos1 * fCos3 * fSin2;
            pDataDestination[__33] = fCos1 * fCos2;
            pDataDestination[__34] = 0.;

            pDataDestination[__41] = 0.;
            pDataDestination[__42] = 0.;
            pDataDestination[__43] = 0.;
            pDataDestination[__44] = 1.;

            return m4fDestination;
        };

        Mat4.fromXYZ = function (fX, fY, fZ, m4fDestination) {
            if (arguments.length <= 2) {
                //Vec3 + m4fDestination
                var v3fVec = arguments[0];
                return Mat4.fromYawPitchRoll(v3fVec.y, v3fVec.x, v3fVec.z, arguments[1]);
            } else {
                //fX fY fZ m4fDestination
                var fX = arguments[0];
                var fY = arguments[1];
                var fZ = arguments[2];

                return Mat4.fromYawPitchRoll(fY, fX, fZ, arguments[3]);
            }
        };

        Mat4.frustum = function (fLeft, fRight, fBottom, fTop, fNear, fFar, m4fDestination) {
            if (!isDef(m4fDestination)) {
                m4fDestination = new Mat4();
            }

            var pDataDestination = m4fDestination.data;

            var fRL = fRight - fLeft;
            var fTB = fTop - fBottom;
            var fFN = fFar - fNear;

            pDataDestination[__11] = 2. * fNear / fRL;
            pDataDestination[__12] = 0.;
            pDataDestination[__13] = (fRight + fLeft) / fRL;
            pDataDestination[__14] = 0.;

            pDataDestination[__21] = 0.;
            pDataDestination[__22] = 2. * fNear / fTB;
            pDataDestination[__23] = (fTop + fBottom) / fTB;
            pDataDestination[__24] = 0.;

            pDataDestination[__31] = 0.;
            pDataDestination[__32] = 0.;
            pDataDestination[__33] = -(fFar + fNear) / fFN;
            pDataDestination[__34] = -2. * fFar * fNear / fFN;

            pDataDestination[__41] = 0.;
            pDataDestination[__42] = 0.;
            pDataDestination[__43] = -1.;
            pDataDestination[__44] = 0.;

            return m4fDestination;
        };

        Mat4.perspective = /** inline */ function (fFovy, fAspect, fNear, fFar, m4fDestination) {
            var fTop = fNear * tan(fFovy / 2.);
            var fRight = fTop * fAspect;

            return Mat4.frustum(-fRight, fRight, -fTop, fTop, fNear, fFar, m4fDestination);
        };

        Mat4.orthogonalProjectionAsymmetric = function (fLeft, fRight, fBottom, fTop, fNear, fFar, m4fDestination) {
            if (!isDef(m4fDestination)) {
                m4fDestination = new Mat4();
            }

            var pDataDestination = m4fDestination.data;

            var fRL = fRight - fLeft;
            var fTB = fTop - fBottom;
            var fFN = fFar - fNear;

            pDataDestination[__11] = 2. / fRL;
            pDataDestination[__12] = 0.;
            pDataDestination[__13] = 0.;
            pDataDestination[__14] = -(fRight + fLeft) / fRL;

            pDataDestination[__21] = 0.;
            pDataDestination[__22] = 2. / fTB;
            pDataDestination[__23] = 0.;
            pDataDestination[__24] = -(fTop + fBottom) / fTB;

            pDataDestination[__31] = 0.;
            pDataDestination[__32] = 0.;
            pDataDestination[__33] = -2. / fFN;
            pDataDestination[__34] = -(fFar + fNear) / fFN;

            pDataDestination[__41] = 0.;
            pDataDestination[__42] = 0.;
            pDataDestination[__43] = 0.;
            pDataDestination[__44] = 1.;

            return m4fDestination;
        };

        Mat4.orthogonalProjection = /** inline */ function (fWidth, fHeight, fNear, fFar, m4fDestination) {
            var fRight = fWidth / 2.;
            var fTop = fHeight / 2.;
            return Mat4.orthogonalProjectionAsymmetric(-fRight, fRight, -fTop, fTop, fNear, fFar, m4fDestination);
        };

        Mat4.lookAt = function (v3fEye, v3fCenter, v3fUp, m4fDestination) {
            if (!isDef(m4fDestination)) {
                m4fDestination = new Mat4(1.);
            }

            var fEyeX = v3fEye.x, fEyeY = v3fEye.y, fEyeZ = v3fEye.z;
            var fCenterX = v3fCenter.x, fCenterY = v3fCenter.y, fCenterZ = v3fCenter.z;
            var fUpX = v3fUp.x, fUpY = v3fUp.y, fUpZ = v3fUp.z;

            var fLength;
            var fInvLength;

            if (fEyeX === fCenterX && fEyeY === fCenterY && fEyeZ === fCenterZ) {
                return m4fDestination;
            }

            var fXNewX, fXNewY, fXNewZ;
            var fYNewX, fYNewY, fYNewZ;
            var fZNewX, fZNewY, fZNewZ;

            //ось Z направлена на наблюдателя
            fZNewX = fEyeX - fCenterX;
            fZNewY = fEyeY - fCenterY;
            fZNewZ = fEyeZ - fCenterZ;

            fLength = sqrt(fZNewX * fZNewX + fZNewY * fZNewY + fZNewZ * fZNewZ);
            fInvLength = 1. / fLength;

            //новая ось Z
            fZNewX = fZNewX * fInvLength;
            fZNewY = fZNewY * fInvLength;
            fZNewZ = fZNewZ * fInvLength;

            //новая ось X
            fXNewX = fUpY * fZNewZ - fUpZ * fZNewY;
            fXNewY = fUpZ * fZNewX - fUpX * fZNewZ;
            fXNewZ = fUpX * fZNewY - fUpY * fZNewX;

            fLength = sqrt(fXNewX * fXNewX + fXNewY * fXNewY + fXNewZ * fXNewZ);
            if (fLength) {
                fInvLength = 1. / fLength;

                fXNewX = fXNewX * fInvLength;
                fXNewY = fXNewY * fInvLength;
                fXNewZ = fXNewZ * fInvLength;
            }

            //новая ось Y
            fYNewX = fZNewY * fXNewZ - fZNewZ * fXNewY;
            fYNewY = fZNewZ * fXNewX - fZNewX * fXNewZ;
            fYNewZ = fZNewX * fXNewY - fZNewY * fXNewX;

            //нормировать ненужно, так как было векторное умножение двух ортонормированных векторов
            //положение камеры в новых осях
            var fEyeNewX = fEyeX * fXNewX + fEyeY * fXNewY + fEyeZ * fXNewZ;
            var fEyeNewY = fEyeX * fYNewX + fEyeY * fYNewY + fEyeZ * fYNewZ;
            var fEyeNewZ = fEyeX * fZNewX + fEyeY * fZNewY + fEyeZ * fZNewZ;

            var pDataDestination = m4fDestination.data;

            //lookAt matrix === camera view matrix
            //почему новый базис записывается по строкам?
            //это сзязано с тем, что это получающаяся матрица -
            //это viewMatrix камеры, а на эту матрицу умножается при рендеринге, то есть
            //модель должна испытать преобразования противоположные тем, которые испытывает камера
            //то есть вращение в другую сторону(базис по строкам) и сдвиг в противоположную сторону
            pDataDestination[__11] = fXNewX;
            pDataDestination[__12] = fXNewY;
            pDataDestination[__13] = fXNewZ;
            pDataDestination[__14] = -fEyeNewX;

            pDataDestination[__21] = fYNewX;
            pDataDestination[__22] = fYNewY;
            pDataDestination[__23] = fYNewZ;
            pDataDestination[__24] = -fEyeNewY;

            pDataDestination[__31] = fZNewX;
            pDataDestination[__32] = fZNewY;
            pDataDestination[__33] = fZNewZ;
            pDataDestination[__34] = -fEyeNewZ;

            pDataDestination[__41] = 0.;
            pDataDestination[__42] = 0.;
            pDataDestination[__43] = 0.;
            pDataDestination[__44] = 1.;

            return m4fDestination;
        };

        Mat4.temp = function (f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13, f14, f15, f16) {
            iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
            var p = pBuffer[iElement++];
            return p.set.apply(p, arguments);
        };
        return Mat4;
    })();

    pBuffer = gen.array(256, Mat4);
    iElement = 0;

    
    return Mat4;
});
//# sourceMappingURL=Mat4.js.map
