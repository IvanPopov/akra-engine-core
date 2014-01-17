module akra {
    export function copy(pDst: ArrayBuffer, iDstOffset: number, pSrc: ArrayBuffer, iSrcOffset: number, nLength: number): void {
        var dstU8 = new Uint8Array(pDst, iDstOffset, nLength);
        var srcU8 = new Uint8Array(pSrc, iSrcOffset, nLength);
        dstU8.set(srcU8);
    }

    /** mem copy from beginning*/
    export function copyfb(pDst: ArrayBuffer, pSrc: ArrayBuffer, nLength: number): void {
        copy(pDst, 0, pSrc, 0, nLength);
    }
}