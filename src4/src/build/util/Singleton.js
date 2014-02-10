/// <reference path="../common.ts" />
var akra;
(function (akra) {
    (function (util) {
        var Singleton = (function () {
            function Singleton() {
                var _this = this;
                var _constructor = _this.constructor;

                if (_constructor._instance != null) {
                    throw new Error("Singleton class may be created only one time.");
                }

                _constructor._instance = this;
            }
            Singleton._instance = null;
            return Singleton;
        })();
        util.Singleton = Singleton;
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
//# sourceMappingURL=Singleton.js.map
