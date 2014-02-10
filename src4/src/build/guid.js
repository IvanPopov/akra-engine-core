var akra;
(function (akra) {
    var x = 0;
    function guid() {
        return ++x;
    }
    akra.guid = guid;
})(akra || (akra = {}));
//# sourceMappingURL=guid.js.map
