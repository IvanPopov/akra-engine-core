var akra;
(function (akra) {
    function copy(pDst, iDstOffset, pSrc, iSrcOffset, nLength) {
        var dstU8 = new Uint8Array(pDst, iDstOffset, nLength);
        var srcU8 = new Uint8Array(pSrc, iSrcOffset, nLength);
        dstU8.set(srcU8);
    }
    akra.copy = copy;
    ;

    /** mem copy from beginning*/
    function copyfb(pDst, pSrc, nLength) {
        copy(pDst, 0, pSrc, 0, nLength);
    }
    akra.copyfb = copyfb;
})(akra || (akra = {}));
