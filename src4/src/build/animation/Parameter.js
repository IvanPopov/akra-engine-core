/// <reference path="../idl/IAnimationParameter.ts" />
/// <reference path="Frame.ts" />
var akra;
(function (akra) {
    (function (animation) {
        var Parameter = (function () {
            function Parameter() {
                this._pKeyFrames = [];
            }
            Parameter.prototype.getTotalFrames = function () {
                return this._pKeyFrames.length;
            };

            Parameter.prototype.getDuration = function () {
                return (this._pKeyFrames.last).time;
            };

            Parameter.prototype.getFirst = function () {
                return (this._pKeyFrames.first).time;
            };

            Parameter.prototype.keyFrame = function (pFrame) {
                var iFrame;

                var pKeyFrames = this._pKeyFrames;
                var nTotalFrames = pKeyFrames.length;

                if (nTotalFrames && (iFrame = this.findKeyFrame(pFrame.time)) >= 0) {
                    pKeyFrames.splice(iFrame, 0, pFrame);
                } else {
                    pKeyFrames.push(pFrame);
                }

                return true;
            };

            Parameter.prototype.getKeyFrame = function (iFrame) {
                akra.debug.assert(iFrame < this.getTotalFrames(), "iFrame must be less then number of total jey frames.");

                return this._pKeyFrames[iFrame];
            };

            Parameter.prototype.findKeyFrame = function (fTime) {
                var pKeyFrames = this._pKeyFrames;
                var nTotalFrames = pKeyFrames.length;

                if (pKeyFrames[nTotalFrames - 1].time == fTime) {
                    return nTotalFrames - 1;
                } else {
                    for (var i = nTotalFrames - 1; i >= 0; i--) {
                        if (pKeyFrames[i].time > fTime && pKeyFrames[i - 1].time <= fTime) {
                            return i - 1;
                        }
                    }
                }

                return -1;
            };

            Parameter.prototype.frame = function (fTime) {
                var iKey1 = 0, iKey2 = 0;
                var fScalar;
                var fTimeDiff;

                var pKeys = this._pKeyFrames;
                var nKeys = pKeys.length;
                var pFrame = akra.animation.PositionFrame.temp();

                akra.debug.assert(nKeys > 0, 'no frames :(');

                if (nKeys === 1) {
                    pFrame.set(pKeys[0]);
                } else {
                    //TODO: реализовать эвристики для бинарного поиска
                    if (fTime >= this._pKeyFrames[nKeys - 1].time) {
                        iKey1 = nKeys - 1;
                    } else {
                        var p = 0;
                        var q = nKeys - 1;

                        while (p < q) {
                            var s = (p + q) >> 1;
                            var fKeyTime = this._pKeyFrames[s].time;

                            if (fTime >= fKeyTime) {
                                if (fTime === fKeyTime || fTime < this._pKeyFrames[s + 1].time) {
                                    iKey1 = s;
                                    break;
                                }

                                p = s + 1;
                            } else {
                                q = s;
                            }
                        }
                    }

                    iKey2 = (iKey1 >= (nKeys - 1)) ? iKey1 : iKey1 + 1;

                    fTimeDiff = pKeys[iKey2].time - pKeys[iKey1].time;

                    if (!fTimeDiff) {
                        fTimeDiff = 1.;
                    }

                    fScalar = (fTime - pKeys[iKey1].time) / fTimeDiff;

                    pFrame.interpolate(this._pKeyFrames[iKey1], this._pKeyFrames[iKey2], fScalar);
                }

                pFrame.time = fTime;
                pFrame.weight = 1.0;

                return pFrame;
            };
            return Parameter;
        })();
        animation.Parameter = Parameter;

        function createParameter() {
            return new Parameter();
        }
        animation.createParameter = createParameter;
    })(akra.animation || (akra.animation = {}));
    var animation = akra.animation;
})(akra || (akra = {}));
//# sourceMappingURL=Parameter.js.map
