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
                var Model = (function (_super) {
                    __extends(Model, _super);
                    function Model() {
                        _super.apply(this, arguments);

                    }
                    return Model;
                })(pool.ResourcePoolItem);
                resources.Model = Model;                
            })(pool.resources || (pool.resources = {}));
            var resources = pool.resources;
        })(core.pool || (core.pool = {}));
        var pool = core.pool;
    })(akra.core || (akra.core = {}));
    var core = akra.core;
})(akra || (akra = {}));
