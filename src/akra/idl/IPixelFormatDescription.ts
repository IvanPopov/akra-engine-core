/// <reference path="EPixelFormats.ts" />

module akra {
    export interface IPixelFormatDescription {
        /* Name of the format, as in the enum */
        name: string;
        /* Number of bytes one element (colour value) takes. */
        elemBytes: uint;
        /* Pixel format flags, see enum PixelFormatFlags for the bit field
        * definitions
        */
        flags: uint;
        /** Component type
            */
        componentType: EPixelComponentTypes;
        /** Component count
            */
        componentCount: uint;
        /* Number of bits for red(or luminance), green, blue, alpha
        */
        rbits: uint;
        gbits: uint;
        bbits: uint;
        abits: uint; /*, ibits, dbits, ... */

        /* Masks and shifts as used by packers/unpackers */
        rmask: uint;
        gmask: uint;
        bmask: uint;
        amask: uint;

        rshift: uint;
        gshift: uint;
        bshift: uint;
        ashift: uint;
    }
}