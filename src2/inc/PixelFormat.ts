#ifndef PIXELFORMAT_TS
#define PIXELFORMAT_TS

module akra {
	export enum EPixelFormats {
        UNKNOWN = 0,          /*Unknown pixel format.*/
        
        L8 = 1,               /*8-bit pixel format, all bits luminance.*/
        BYTE_L = L8,   
        L16 = 2,              /*16-bit pixel format, all bits luminance.*/
        SHORT_L = L16, 
        A8 = 3,               /*8-bit pixel format, all bits alpha.*/
        BYTE_A = A8,   
        A4L4 = 4,             /*8-bit pixel format, 4 bits alpha, 4 bits luminance.*/
        BYTE_LA = 5,          /*2 byte pixel format, 1 byte luminance, 1 byte alpha*/
        
        R5G6B5 = 6,           /*16-bit pixel format, 5 bits red, 6 bits green, 5 bits blue.*/
        B5G6R5 = 7,           /*16-bit pixel format, 5 bits red, 6 bits green, 5 bits blue.*/
        R3G3B2 = 31,           /*8-bit pixel format, 2 bits blue, 3 bits green, 3 bits red.*/
        A4R4G4B4 = 8,         /*16-bit pixel format, 4 bits for alpha, red, green and blue.*/
        A1R5G5B5 = 9,         /*16-bit pixel format, 5 bits for blue, green, red and 1 for alpha.*/
        R8G8B8 = 10,           /*24-bit pixel format, 8 bits for red, green and blue.*/
        B8G8R8 = 11,           /*24-bit pixel format, 8 bits for blue, green and red.*/
        A8R8G8B8 = 12,         /*32-bit pixel format, 8 bits for alpha, red, green and blue.*/
        A8B8G8R8 = 13,         /*32-bit pixel format, 8 bits for blue, green, red and alpha.*/
        B8G8R8A8 = 14,         /*32-bit pixel format, 8 bits for blue, green, red and alpha.*/
        R8G8B8A8 = 28,         /*32-bit pixel format, 8 bits for red, green, blue and alpha.*/
        
        X8R8G8B8 = 26,         /*32-bit pixel format, 8 bits for red, 8 bits for green, 8 bits for blue like A8R8G8B8, but alpha will get discarded*/
        X8B8G8R8 = 27,         /*32-bit pixel format, 8 bits for blue, 8 bits for green, 8 bits for red like A8B8G8R8, but alpha will get discarded*/
        
        BYTE_RGB = R8G8B8,      /*3 byte pixel format, 1 byte for red, 1 byte for green, 1 byte for blue*/
        BYTE_BGR = B8G8R8,      /*3 byte pixel format, 1 byte for blue, 1 byte for green, 1 byte for red*/
        BYTE_BGRA = B8G8R8A8,   /*4 byte pixel format, 1 byte for blue, 1 byte for green, 1 byte for red and one byte for alpha*/
        BYTE_RGBA = R8G8B8A8,   /*4 byte pixel format, 1 byte for red, 1 byte for green, 1 byte for blue, and one byte for alpha*/
        
        A2R10G10B10 = 15,      /*32-bit pixel format, 2 bits for alpha, 10 bits for red, green and blue.*/
        A2B10G10R10 = 16,      /*32-bit pixel format, 10 bits for blue, green and red, 2 bits for alpha.*/
        
        DXT1 = 17,             /*DDS (DirectDraw Surface) DXT1 format.*/
        DXT2 = 18,             /*DDS (DirectDraw Surface) DXT2 format.*/
        DXT3 = 19,             /*DDS (DirectDraw Surface) DXT3 format.*/
        DXT4 = 20,             /*DDS (DirectDraw Surface) DXT4 format.*/
        DXT5 = 21,             /*DDS (DirectDraw Surface) DXT5 format.*/
        
        FLOAT16_R = 32,        /*16-bit pixel format, 16 bits (float) for red*/
        FLOAT16_RGB = 22,      /*48-bit pixel format, 16 bits (float) for red, 16 bits (float) for green, 16 bits (float) for blue*/
        FLOAT16_RGBA = 23,     /*64-bit pixel format, 16 bits (float) for red, 16 bits (float) for green, 16 bits (float) for blue, 16 bits (float) for alpha*/    
        FLOAT32_R = 33,        /*32-bit pixel format, 32 bits (float) for red*/
        FLOAT32_RGB = 24,      /*96-bit pixel format, 32 bits (float) for red, 32 bits (float) for green, 32 bits (float) for blue*/
        FLOAT32_RGBA = 25,     /*128-bit pixel format, 32 bits (float) for red, 32 bits (float) for green, 32 bits (float) for blue, 32 bits (float) for alpha*/
        FLOAT16_GR = 35,       /*32-bit, 2-channel s10e5 floating point pixel format, 16-bit green, 16-bit red*/
        FLOAT32_GR = 36,       /*64-bit, 2-channel floating point pixel format, 32-bit green, 32-bit red*/ 
        
        DEPTH = 29,            /*Float Depth texture format*/
        DEPTH_BYTE = 44,       /*Byte Depth texture format */
        
        SHORT_RGBA = 30,       /*64-bit pixel format, 16 bits for red, green, blue and alpha*/
        SHORT_GR = 34,         /*32-bit pixel format, 16-bit green, 16-bit red*/
        SHORT_RGB = 37,        /*48-bit pixel format, 16 bits for red, green and blue*/
        
        PVRTC_RGB2 = 38,       /*PVRTC (PowerVR) RGB 2 bpp.*/
        PVRTC_RGBA2 = 39,      /*PVRTC (PowerVR) RGBA 2 bpp.*/
        PVRTC_RGB4 = 40,       /*PVRTC (PowerVR) RGB 4 bpp.*/
        PVRTC_RGBA4 = 41,      /*PVRTC (PowerVR) RGBA 4 bpp.*/
        
        R8 = 42,               /*8-bit pixel format, all bits red.*/
        RG8 = 43,              /*16-bit pixel format, 8 bits red, 8 bits green.*/
        TOTAL = 45    
    };

    export interface PixelFormatList {
    	[index: int]: EPixelFormats;
    }


    /**
     * Flags defining some on/off properties of pixel formats
     */
    export enum  EPixelFormatFlags {
        // This format has an alpha channel
        HASALPHA        = 0x00000001,      
        // This format is compressed. This invalidates the values in elemBytes,
        // elemBits and the bit counts as these might not be fixed in a compressed format.
        COMPRESSED    = 0x00000002,
        // This is a floating point format
        FLOAT           = 0x00000004,         
        // This is a depth format (for depth textures)
        DEPTH           = 0x00000008,
        // Format is in native endian. Generally true for the 16, 24 and 32 bits
        // formats which can be represented as machine integers.
        NATIVEENDIAN    = 0x00000010,
        // This is an intensity format instead of a RGB one. The luminance
        // replaces R,G and B. (but not A)
        LUMINANCE       = 0x00000020
    }

    /** Pixel component format */
    export enum EPixelComponentTypes
    {
        BYTE = 0,    /*Byte per component (8 bit fixed 0.0..1.0)*/
        SHORT = 1,   /*Short per component (16 bit fixed 0.0..1.0))*/
        FLOAT16 = 2, /*16 bit float per component*/
        FLOAT32 = 3, /*32 bit float per component*/
        COUNT = 4    /*Number of pixel types*/
    };

    export enum EFilters {
        NEAREST,
        LINEAR,
        BILINEAR,
        BOX,
        TRIANGLE,
        BICUBIC
    };
}

#endif
