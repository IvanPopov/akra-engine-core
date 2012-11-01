var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../../../akra.ts" />
var akra;
(function (akra) {
    (function (core) {
        (function (pool) {
            (function (resources) {
                var ShaderProgram = (function (_super) {
                    __extends(ShaderProgram, _super);
                    function ShaderProgram() {
                        _super.apply(this, arguments);

                    }
                    return ShaderProgram;
                })(pool.ResourcePoolItem);
                resources.ShaderProgram = ShaderProgram;                
            })(pool.resources || (pool.resources = {}));
            var resources = pool.resources;
        })(core.pool || (core.pool = {}));
        var pool = core.pool;
    })(akra.core || (akra.core = {}));
    var core = akra.core;
})(akra || (akra = {}));
