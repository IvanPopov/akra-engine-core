/// <reference path="Base.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (animation) {
        var List = (function (_super) {
            __extends(List, _super);
            function List() {
                _super.apply(this, arguments);
            }
            List.isList = function (pAnimation) {
                return pAnimation.getType() === 1 /* LIST */;
            };
            return List;
        })(akra.animation.Base);
        animation.List = List;
    })(akra.animation || (akra.animation = {}));
    var animation = akra.animation;
})(akra || (akra = {}));
//# sourceMappingURL=List.js.map
