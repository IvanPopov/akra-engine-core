/// <reference path="IEventProvider.ts" />
var akra;
(function (akra) {
    (function (EDependenceStatuses) {
        EDependenceStatuses[EDependenceStatuses["NOT_LOADED"] = 0] = "NOT_LOADED";
        EDependenceStatuses[EDependenceStatuses["INITIALIZATION"] = 1] = "INITIALIZATION";
        EDependenceStatuses[EDependenceStatuses["CHECKING"] = 2] = "CHECKING";
        EDependenceStatuses[EDependenceStatuses["LOADING"] = 3] = "LOADING";
        EDependenceStatuses[EDependenceStatuses["UNPACKING"] = 4] = "UNPACKING";
        EDependenceStatuses[EDependenceStatuses["LOADED"] = 5] = "LOADED";
    })(akra.EDependenceStatuses || (akra.EDependenceStatuses = {}));
    var EDependenceStatuses = akra.EDependenceStatuses;
})(akra || (akra = {}));
//# sourceMappingURL=IDeps.js.map
