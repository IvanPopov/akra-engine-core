define(["require", "exports"], function(require, exports) {
    

    var isDef = type.isDef;

    var Singleton = (function () {
        function Singleton() {
            if (isDef(Singleton._instance))
                throw new Error("Singleton class may be created only one time.");

            Singleton._instance = this;
        }
        Singleton.getInstance = function () {
            if (Singleton._instance === null) {
                Singleton._instance = new ((this).constructor)();
            }

            return Singleton._instance;
        };
        Singleton._instance = null;
        return Singleton;
    })();

    
    return Singleton;
});
//# sourceMappingURL=Singleton.js.map
