/// <reference path="../idl/IFrame.ts" />
/// <reference path="../math/math.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../debug.ts" />
    (function (animation) {
        var Quat4 = akra.math.Quat4;
        var Vec3 = akra.math.Vec3;
        var Mat4 = akra.math.Mat4;

        var pPositionBuffer;
        var iPositionElement;

        var pMatrixBuffer;
        var iMatrixElement;

        var Frame = (function () {
            function Frame(eType, fTime, fWeight) {
                if (typeof fTime === "undefined") { fTime = 0.0; }
                if (typeof fWeight === "undefined") { fWeight = 1.0; }
                this.type = eType;
                this.time = fTime;
                this.weight = fWeight;
            }
            Frame.prototype.reset = function () {
                this.weight = 0.0;
                this.time = 0.0;

                return this;
            };

            Frame.prototype.add = function (pFrame, isFirst) {
                akra.debug.error("You cannot use Frame class directly.");
                return this;
            };

            Frame.prototype.set = function (pFrame) {
                this.weight = pFrame.weight;
                this.time = pFrame.time;

                return this;
            };

            Frame.prototype.mult = function (fScalar) {
                this.weight *= fScalar;

                return this;
            };

            Frame.prototype.normilize = function () {
                akra.debug.error("You cannot use Frame class directly.");
                return this;
            };

            Frame.prototype.interpolate = function (pStartFrame, pEndFrame, fBlend) {
                akra.debug.error("You cannot use Frame class directly.");
                return this;
            };
            return Frame;
        })();
        animation.Frame = Frame;

        //complex world position frame
        var PositionFrame = (function (_super) {
            __extends(PositionFrame, _super);
            function PositionFrame(fTime, pMatrix, fWeight) {
                _super.call(this, 1 /* SPHERICAL */);
                this.matrix = null;
                this.rotation = new Quat4;
                this.scale = new Vec3;
                this.translation = new Vec3;

                switch (arguments.length) {
                    case 0:
                        this.matrix = new Mat4;
                        return;
                    case 3:
                        this.weight = fWeight;
                    case 2:
                        this.matrix = pMatrix;
                    case 1:
                        this.time = fTime;
                }
                ;

                akra.logger.assert(this.matrix.decompose(this.rotation, this.scale, this.translation), "could not decompose matrix");
            }
            PositionFrame.prototype.toMatrix = function () {
                return this.rotation.toMat4(this.matrix).setTranslation(this.translation).scaleRight(this.scale);
            };

            PositionFrame.prototype.reset = function () {
                _super.prototype.reset.call(this);

                this.rotation.x = this.rotation.y = this.rotation.z = 0;
                this.rotation.w = 1.0;

                this.translation.x = this.translation.y = this.translation.z = 0;

                this.scale.x = this.scale.y = this.scale.z = 0;

                return this;
            };

            PositionFrame.prototype.set = function (pFrame) {
                _super.prototype.set.call(this, pFrame);

                this.rotation.set(pFrame.rotation);
                this.scale.set(pFrame.scale);
                this.translation.set(pFrame.translation);

                return this;
            };

            /**
            * Adding frame data with own weight.
            * @note Frame must be normilized after this modification!
            */
            PositionFrame.prototype.add = function (pFrame, isFirst) {
                var fWeight = pFrame.weight;

                //only lerp supported
                this.scale.x += pFrame.scale.x * fWeight;
                this.scale.y += pFrame.scale.y * fWeight;
                this.scale.z += pFrame.scale.z * fWeight;

                //only lerp supported
                this.translation.x += pFrame.translation.x * fWeight;
                this.translation.y += pFrame.translation.y * fWeight;
                this.translation.z += pFrame.translation.z * fWeight;

                this.weight += fWeight;

                if (isFirst) {
                    this.rotation.set(pFrame.rotation);
                    return this;
                }

                switch (this.type) {
                    case 0 /* LINEAR */:
                        this.rotation.mix(pFrame.rotation, fWeight / this.weight);
                        break;
                    case 1 /* SPHERICAL */:
                        this.rotation.smix(pFrame.rotation, fWeight / this.weight);
                        break;
                }

                return this;
            };

            PositionFrame.prototype.normilize = function () {
                var fScalar = 1.0 / this.weight;

                this.scale.x *= fScalar;
                this.scale.y *= fScalar;
                this.scale.z *= fScalar;

                this.translation.x *= fScalar;
                this.translation.y *= fScalar;
                this.translation.z *= fScalar;

                return this;
            };

            PositionFrame.prototype.interpolate = function (pStartFrame, pEndFrame, fBlend) {
                pStartFrame.translation.mix(pEndFrame.translation, fBlend, this.translation);
                pStartFrame.scale.mix(pEndFrame.scale, fBlend, this.scale);

                switch (pStartFrame.type) {
                    case 0 /* LINEAR */:
                        pStartFrame.rotation.mix(pEndFrame.rotation, fBlend, this.rotation);
                        break;
                    case 1 /* SPHERICAL */:
                        pStartFrame.rotation.smix(pEndFrame.rotation, fBlend, this.rotation);
                        break;
                }

                return this;
            };

            PositionFrame.temp = function () {
                iPositionElement = (iPositionElement === pPositionBuffer.length - 1 ? 0 : iPositionElement);

                //var p = pPositionBuffer[iPositionElement++];
                //return p.set.apply(p, arguments);
                return pPositionBuffer[iPositionElement++].reset();
            };
            return PositionFrame;
        })(Frame);
        animation.PositionFrame = PositionFrame;

        var MatrixFrame = (function (_super) {
            __extends(MatrixFrame, _super);
            function MatrixFrame(fTime, pMatrix, fWeight) {
                _super.call(this, 0 /* LINEAR */);
                this.matrix = null;

                switch (arguments.length) {
                    case 0:
                        this.matrix = new Mat4;
                        return;
                    case 3:
                        this.weight = fWeight;
                    case 2:
                        this.matrix = pMatrix;
                    case 1:
                        this.time = fTime;
                }
                ;
            }
            MatrixFrame.prototype.reset = function () {
                _super.prototype.reset.call(this);
                this.matrix.set(0.);

                return this;
            };

            MatrixFrame.prototype.set = function (pFrame) {
                _super.prototype.set.call(this, pFrame);

                //FIXME: расписать побыстрее
                this.matrix.set(pFrame.matrix);

                return this;
            };

            MatrixFrame.prototype.toMatrix = function () {
                return this.matrix;
            };

            MatrixFrame.prototype.add = function (pFrame, isFirst) {
                var pMatData = pFrame.matrix.data;
                var fWeight = pFrame.weight;
                var pResData = this.matrix.data;

                for (var i = 0; i < 16; ++i) {
                    pResData[i] += pMatData[i] * fWeight;
                }

                this.weight += fWeight;
                return this;
            };

            MatrixFrame.prototype.normilize = function () {
                var fScalar = 1.0 / this.weight;
                this.matrix.scaleLeft(fScalar);

                return this;
            };

            MatrixFrame.prototype.interpolate = function (pStartFrame, pEndFrame, fBlend) {
                akra.debug.assert(this.type === 0 /* LINEAR */, "only LERP interpolation supported for matrix frames");

                var pResultData = this.matrix.data;
                var pStartData = pStartFrame.matrix.data;
                var pEndData = pEndFrame.matrix.data;
                var fBlendInv = 1. - fBlend;

                for (var i = 0; i < 16; i++) {
                    pResultData[i] = pEndData[i] * fBlend + pStartData[i] * fBlendInv;
                }

                return this;
            };

            MatrixFrame.temp = function () {
                iMatrixElement = (iMatrixElement === pMatrixBuffer.length - 1 ? 0 : iMatrixElement);

                //var p = pMatrixBuffer[iMatrixElement++];
                //return p.set.apply(p, arguments);
                return pMatrixBuffer[iMatrixElement++].reset();
            };
            return MatrixFrame;
        })(Frame);
        animation.MatrixFrame = MatrixFrame;

        pPositionBuffer = akra.gen.array(4 * 4096, PositionFrame);
        iPositionElement = 0;

        pMatrixBuffer = akra.gen.array(4 * 4096, MatrixFrame);
        iMatrixElement = 0;
    })(akra.animation || (akra.animation = {}));
    var animation = akra.animation;
})(akra || (akra = {}));
//# sourceMappingURL=Frame.js.map
