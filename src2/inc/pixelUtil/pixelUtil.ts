#ifndef PIXELUTIL_TS
#define PIXELUTIL_TS

#include "PixelFormat.ts"
#include "bf/bitflags.ts"
#include "math/math.ts"
#include "IColor.ts"
#include "PixelBox.ts"

#define dynamic_cast_f32_ptr(uint8_data, n) (new Float32Array(uint8_data.buffer, uint8_data.byteOffset, n))
#define dynamic_cast_u16_ptr(uint8_data, n) (new Uint16Array(uint8_data.buffer, uint8_data.byteOffset, n))
#define dynamic_cast_u32_ptr(uint8_data, n) (new Uint32Array(uint8_data.buffer, uint8_data.byteOffset, n))
#define dynamic_cast_i8_ptr(uint8_data, n) (new Int8Array(uint8_data.buffer, uint8_data.byteOffset, n))
#define dynamic_cast_i16_ptr(uint8_data, n) (new Int16Array(uint8_data.buffer, uint8_data.byteOffset, n))
#define dynamic_cast_i32_ptr(uint8_data, n) (new Int32Array(uint8_data.buffer, uint8_data.byteOffset, n))

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


	function fillPixelFormats(pData: any[][]): IPixelFormatDescription[] {
		var pPixelFormats: IPixelFormatDescription[] = [];

		for (var i: int = 0; i < pData.length; ++ i) {
			var pEl: any[] = pData[i];
			pPixelFormats.push({
					name: 			<string>pEl[0],
					elemBytes: 		<uint>	pEl[1],
					flags: 			<uint>	pEl[2],
					componentType: 	<EPixelComponentTypes>pEl[3],
					componentCount: <uint>	pEl[4],
					
					rbits: <uint>pEl[5],
					gbits: <uint>pEl[6],
					bbits: <uint>pEl[7],
					abits: <uint>pEl[8],
					
					rmask: <uint>pEl[9],
					gmask: <uint>pEl[10],
					bmask: <uint>pEl[11],
					amask: <uint>pEl[12],

					rshift: <uint>pEl[13],
					gshift: <uint>pEl[14],
					bshift: <uint>pEl[15],
					ashift: <uint>pEl[16]
				});
		}

		return pPixelFormats;
	}

	var pPixelFormats: IPixelFormatDescription[] = fillPixelFormats([
		["PF_UNKNOWN",
        /* Bytes per element */
        0,
        /* Flags */
        0,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 0,
        /* rbits, gbits, bbits, abits */
        0, 0, 0, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
	//1-----------------------------------------------------------------------
        ["PF_L8",
        /* Bytes per element */
        1,
        /* Flags */
        EPixelFormatFlags.LUMINANCE | EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 1,
        /* rbits, gbits, bbits, abits */
        8, 0, 0, 0,
        /* Masks and shifts */
        0xFF, 0, 0, 0, 0, 0, 0, 0
        ],
	//2-----------------------------------------------------------------------
        ["PF_L16",
        /* Bytes per element */
        2,
        /* Flags */
        EPixelFormatFlags.LUMINANCE | EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.SHORT, 1,
        /* rbits, gbits, bbits, abits */
        16, 0, 0, 0,
        /* Masks and shifts */
        0xFFFF, 0, 0, 0, 0, 0, 0, 0
        ],
	//3-----------------------------------------------------------------------
        ["PF_A8",
        /* Bytes per element */
        1,
        /* Flags */
        EPixelFormatFlags.HASALPHA | EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 1,
        /* rbits, gbits, bbits, abits */
        0, 0, 0, 8,
        /* Masks and shifts */
        0, 0, 0, 0xFF, 0, 0, 0, 0
        ],
	//4-----------------------------------------------------------------------
        ["PF_A4L4",
        /* Bytes per element */
        1,
        /* Flags */
        EPixelFormatFlags.HASALPHA | EPixelFormatFlags.LUMINANCE | EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 2,
        /* rbits, gbits, bbits, abits */
        4, 0, 0, 4,
        /* Masks and shifts */
        0x0F, 0, 0, 0xF0, 0, 0, 0, 4
        ],
	//5-----------------------------------------------------------------------
        ["PF_BYTE_LA",
        /* Bytes per element */
        2,
        /* Flags */
        EPixelFormatFlags.HASALPHA | EPixelFormatFlags.LUMINANCE,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 2,
        /* rbits, gbits, bbits, abits */
        8, 0, 0, 8,
        /* Masks and shifts */
        0,0,0,0,0,0,0,0
        ],
	//6-----------------------------------------------------------------------
        ["PF_R5G6B5",
        /* Bytes per element */
        2,
        /* Flags */
        EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 3,
        /* rbits, gbits, bbits, abits */
        5, 6, 5, 0,
        /* Masks and shifts */
        0xF800, 0x07E0, 0x001F, 0,
        11, 5, 0, 0
        ],
	//7-----------------------------------------------------------------------
		["PF_B5G6R5",
        /* Bytes per element */
        2,
        /* Flags */
        EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 3,
        /* rbits, gbits, bbits, abits */
        5, 6, 5, 0,
        /* Masks and shifts */
        0x001F, 0x07E0, 0xF800, 0,
        0, 5, 11, 0
        ],
	//8-----------------------------------------------------------------------
        ["PF_A4R4G4B4",
        /* Bytes per element */
        2,
        /* Flags */
        EPixelFormatFlags.HASALPHA | EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 4,
        /* rbits, gbits, bbits, abits */
        4, 4, 4, 4,
        /* Masks and shifts */
        0x0F00, 0x00F0, 0x000F, 0xF000,
        8, 4, 0, 12
        ],
	//9-----------------------------------------------------------------------
        ["PF_A1R5G5B5",
        /* Bytes per element */
        2,
        /* Flags */
        EPixelFormatFlags.HASALPHA | EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 4,
        /* rbits, gbits, bbits, abits */
        5, 5, 5, 1,
        /* Masks and shifts */
        0x7C00, 0x03E0, 0x001F, 0x8000,
        10, 5, 0, 15,
        ],
	//10-----------------------------------------------------------------------
        ["PF_R8G8B8",
        /* Bytes per element */
        3,  /* 24 bit integer -- special*/
        /* Flags */
        EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 3,
        /* rbits, gbits, bbits, abits */
        8, 8, 8, 0,
        /* Masks and shifts */
        0xFF0000, 0x00FF00, 0x0000FF, 0,
        16, 8, 0, 0
        ],
	//11-----------------------------------------------------------------------
        ["PF_B8G8R8",
        /* Bytes per element */
        3,  /* 24 bit integer -- special*/
        /* Flags */
        EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 3,
        /* rbits, gbits, bbits, abits */
        8, 8, 8, 0,
        /* Masks and shifts */
        0x0000FF, 0x00FF00, 0xFF0000, 0,
        0, 8, 16, 0
        ],
	//12-----------------------------------------------------------------------
        ["PF_A8R8G8B8",
        /* Bytes per element */
        4,
        /* Flags */
        EPixelFormatFlags.HASALPHA | EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 4,
        /* rbits, gbits, bbits, abits */
        8, 8, 8, 8,
        /* Masks and shifts */
        0x00FF0000, 0x0000FF00, 0x000000FF, 0xFF000000,
        16, 8, 0, 24
        ],
	//13-----------------------------------------------------------------------
        ["PF_A8B8G8R8",
        /* Bytes per element */
        4,
        /* Flags */
        EPixelFormatFlags.HASALPHA | EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 4,
        /* rbits, gbits, bbits, abits */
        8, 8, 8, 8,
        /* Masks and shifts */
        0x000000FF, 0x0000FF00, 0x00FF0000, 0xFF000000,
        0, 8, 16, 24,
        ],
	//14-----------------------------------------------------------------------
        ["PF_B8G8R8A8",
        /* Bytes per element */
        4,
        /* Flags */
        EPixelFormatFlags.HASALPHA | EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 4,
        /* rbits, gbits, bbits, abits */
        8, 8, 8, 8,
        /* Masks and shifts */
        0x0000FF00, 0x00FF0000, 0xFF000000, 0x000000FF,
        8, 16, 24, 0
        ],
	//15-----------------------------------------------------------------------
        ["PF_A2R10G10B10",
        /* Bytes per element */
        4,
        /* Flags */
        EPixelFormatFlags.HASALPHA | EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 4,
        /* rbits, gbits, bbits, abits */
        10, 10, 10, 2,
        /* Masks and shifts */
        0x3FF00000, 0x000FFC00, 0x000003FF, 0xC0000000,
        20, 10, 0, 30
        ],
	//16-----------------------------------------------------------------------
        ["PF_A2B10G10R10",
        /* Bytes per element */
        4,
        /* Flags */
        EPixelFormatFlags.HASALPHA | EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 4,
        /* rbits, gbits, bbits, abits */
        10, 10, 10, 2,
        /* Masks and shifts */
        0x000003FF, 0x000FFC00, 0x3FF00000, 0xC0000000,
        0, 10, 20, 30
        ],
	//17-----------------------------------------------------------------------
        ["PF_DXT1",
        /* Bytes per element */
        0,
        /* Flags */
        EPixelFormatFlags.COMPRESSED | EPixelFormatFlags.HASALPHA,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 3, /* No alpha*/
        /* rbits, gbits, bbits, abits */
        0, 0, 0, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
	//18-----------------------------------------------------------------------
        ["PF_DXT2",
        /* Bytes per element */
        0,
        /* Flags */
        EPixelFormatFlags.COMPRESSED | EPixelFormatFlags.HASALPHA,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 4,
        /* rbits, gbits, bbits, abits */
        0, 0, 0, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
	//19-----------------------------------------------------------------------
        ["PF_DXT3",
        /* Bytes per element */
        0,
        /* Flags */
        EPixelFormatFlags.COMPRESSED | EPixelFormatFlags.HASALPHA,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 4,
        /* rbits, gbits, bbits, abits */
        0, 0, 0, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
	//20-----------------------------------------------------------------------
        ["PF_DXT4",
        /* Bytes per element */
        0,
        /* Flags */
        EPixelFormatFlags.COMPRESSED | EPixelFormatFlags.HASALPHA,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 4,
        /* rbits, gbits, bbits, abits */
        0, 0, 0, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
	//21-----------------------------------------------------------------------
        ["PF_DXT5",
        /* Bytes per element */
        0,
        /* Flags */
        EPixelFormatFlags.COMPRESSED | EPixelFormatFlags.HASALPHA,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 4,
        /* rbits, gbits, bbits, abits */
        0, 0, 0, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
	//22-----------------------------------------------------------------------
        ["PF_FLOAT16_RGB",
        /* Bytes per element */
        6,
        /* Flags */
        EPixelFormatFlags.FLOAT,
        /* Component type and count */
        EPixelComponentTypes.FLOAT16, 3,
        /* rbits, gbits, bbits, abits */
        16, 16, 16, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
	//23-----------------------------------------------------------------------
        ["PF_FLOAT16_RGBA",
        /* Bytes per element */
        8,
        /* Flags */
        EPixelFormatFlags.FLOAT | EPixelFormatFlags.HASALPHA,
        /* Component type and count */
        EPixelComponentTypes.FLOAT16, 4,
        /* rbits, gbits, bbits, abits */
        16, 16, 16, 16,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
	//24-----------------------------------------------------------------------
        ["PF_FLOAT32_RGB",
        /* Bytes per element */
        12,
        /* Flags */
        EPixelFormatFlags.FLOAT,
        /* Component type and count */
        EPixelComponentTypes.FLOAT32, 3,
        /* rbits, gbits, bbits, abits */
        32, 32, 32, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
	//25-----------------------------------------------------------------------
        ["PF_FLOAT32_RGBA",
        /* Bytes per element */
        16,
        /* Flags */
        EPixelFormatFlags.FLOAT | EPixelFormatFlags.HASALPHA,
        /* Component type and count */
        EPixelComponentTypes.FLOAT32, 4,
        /* rbits, gbits, bbits, abits */
        32, 32, 32, 32,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
	//26-----------------------------------------------------------------------
        ["PF_X8R8G8B8",
        /* Bytes per element */
        4,
        /* Flags */
        EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 3,
        /* rbits, gbits, bbits, abits */
        8, 8, 8, 0,
        /* Masks and shifts */
        0x00FF0000, 0x0000FF00, 0x000000FF, 0xFF000000,
        16, 8, 0, 24
        ],
	//27-----------------------------------------------------------------------
        ["PF_X8B8G8R8",
        /* Bytes per element */
        4,
        /* Flags */
        EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 3,
        /* rbits, gbits, bbits, abits */
        8, 8, 8, 0,
        /* Masks and shifts */
        0x000000FF, 0x0000FF00, 0x00FF0000, 0xFF000000,
        0, 8, 16, 24
        ],
	//28-----------------------------------------------------------------------
        ["PF_R8G8B8A8",
        /* Bytes per element */
        4,
        /* Flags */
        EPixelFormatFlags.HASALPHA | EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 4,
        /* rbits, gbits, bbits, abits */
        8, 8, 8, 8,
        /* Masks and shifts */
        0xFF000000, 0x00FF0000, 0x0000FF00, 0x000000FF,
        24, 16, 8, 0
        ],
	//29-----------------------------------------------------------------------
		["PF_FLOAT32_DEPTH",
        /* Bytes per element */
        4,
        /* Flags */
        EPixelFormatFlags.DEPTH,
        /* Component type and count */
        EPixelComponentTypes.FLOAT32, 1, /* ?*/
        /* rbits, gbits, bbits, abits */
        0, 0, 0, 0,
        /* Masks and shifts */
		0, 0, 0, 0, 0, 0, 0, 0
        ],
	//30-----------------------------------------------------------------------
		["PF_SHORT_RGBA",
		/* Bytes per element */
        8,
        /* Flags */
        EPixelFormatFlags.HASALPHA,
        /* Component type and count */
        EPixelComponentTypes.SHORT, 4,
        /* rbits, gbits, bbits, abits */
        16, 16, 16, 16,
        /* Masks and shifts */
		0, 0, 0, 0, 0, 0, 0, 0
        ],
	//31-----------------------------------------------------------------------
        ["PF_R3G3B2",
        /* Bytes per element */
        1,
        /* Flags */
        EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 3,
        /* rbits, gbits, bbits, abits */
        3, 3, 2, 0,
        /* Masks and shifts */
        0xE0, 0x1C, 0x03, 0,
        5, 2, 0, 0
        ],
	//32-----------------------------------------------------------------------
        ["PF_FLOAT16_R",
        /* Bytes per element */
        2,
        /* Flags */
        EPixelFormatFlags.FLOAT,
        /* Component type and count */
        EPixelComponentTypes.FLOAT16, 1,
        /* rbits, gbits, bbits, abits */
        16, 0, 0, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
	//33-----------------------------------------------------------------------
        ["PF_FLOAT32_R",
        /* Bytes per element */
        4,
        /* Flags */
        EPixelFormatFlags.FLOAT,
        /* Component type and count */
        EPixelComponentTypes.FLOAT32, 1,
        /* rbits, gbits, bbits, abits */
        32, 0, 0, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
	//34-----------------------------------------------------------------------
        ["PF_SHORT_GR",
        /* Bytes per element */
        4,
        /* Flags */
        EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.SHORT, 2,
        /* rbits, gbits, bbits, abits */
        16, 16, 0, 0,
        /* Masks and shifts */
        0x0000FFFF, 0xFFFF0000, 0, 0, 
		0, 16, 0, 0
        ],
	//35-----------------------------------------------------------------------
        ["PF_FLOAT16_GR",
        /* Bytes per element */
        4,
        /* Flags */
        EPixelFormatFlags.FLOAT,
        /* Component type and count */
        EPixelComponentTypes.FLOAT16, 2,
        /* rbits, gbits, bbits, abits */
        16, 16, 0, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
	//36-----------------------------------------------------------------------
        ["PF_FLOAT32_GR",
        /* Bytes per element */
        8,
        /* Flags */
        EPixelFormatFlags.FLOAT,
        /* Component type and count */
        EPixelComponentTypes.FLOAT32, 2,
        /* rbits, gbits, bbits, abits */
        32, 32, 0, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
	//37-----------------------------------------------------------------------
		["PF_SHORT_RGB",
		/* Bytes per element */
        6,
        /* Flags */
        0,
        /* Component type and count */
        EPixelComponentTypes.SHORT, 3,
        /* rbits, gbits, bbits, abits */
        16, 16, 16, 0,
        /* Masks and shifts */
		0, 0, 0, 0, 0, 0, 0, 0
        ],
    //38-----------------------------------------------------------------------
		["PF_PVRTC_RGB2",
        /* Bytes per element */
        0,
        /* Flags */
        EPixelFormatFlags.COMPRESSED,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 3,
        /* rbits, gbits, bbits, abits */
        0, 0, 0, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
    //39-----------------------------------------------------------------------
		["PF_PVRTC_RGBA2",
        /* Bytes per element */
        0,
        /* Flags */
        EPixelFormatFlags.COMPRESSED | EPixelFormatFlags.HASALPHA,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 4,
        /* rbits, gbits, bbits, abits */
        0, 0, 0, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
    //40-----------------------------------------------------------------------
		["PF_PVRTC_RGB4",
        /* Bytes per element */
        0,
        /* Flags */
        EPixelFormatFlags.COMPRESSED,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 3,
        /* rbits, gbits, bbits, abits */
        0, 0, 0, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
    //41-----------------------------------------------------------------------
		["PF_PVRTC_RGBA4",
        /* Bytes per element */
        0,
        /* Flags */
        EPixelFormatFlags.COMPRESSED | EPixelFormatFlags.HASALPHA,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 4,
        /* rbits, gbits, bbits, abits */
        0, 0, 0, 0,
        /* Masks and shifts */
        0, 0, 0, 0, 0, 0, 0, 0
        ],
    //42-----------------------------------------------------------------------
        ["PF_R8",
        /* Bytes per element */
        1,
        /* Flags */
        EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 1,
        /* rbits, gbits, bbits, abits */
        8, 0, 0, 0,
        /* Masks and shifts */
        0xFF0000, 0, 0, 0,
        0, 0, 0, 0
        ],
    //43-----------------------------------------------------------------------
        ["PF_RG8",
        /* Bytes per element */
        2,
        /* Flags */
        EPixelFormatFlags.NATIVEENDIAN,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 2,
        /* rbits, gbits, bbits, abits */
        8, 8, 0, 0,
        /* Masks and shifts */
        0xFF0000, 0x00FF00, 0, 0,
        8, 0, 0, 0
        ],
    //44-----------------------------------------------------------------------
        ["PF_DEPTH_BYTE",
        /* Bytes per element */
        1,
        /* Flags */
        EPixelFormatFlags.DEPTH,
        /* Component type and count */
        EPixelComponentTypes.BYTE, 1,
        /* rbits, gbits, bbits, abits */
        8, 0, 0, 0,
        /* Masks and shifts */
        0xFF, 0, 0, 0, 0, 0, 0, 0
        ],
    //45-----------------------------------------------------------------------    
        ["PF_DEPTH_SHORT",
        /* Bytes per element */
        2,
        /* Flags */
        EPixelFormatFlags.DEPTH,
        /* Component type and count */
        EPixelComponentTypes.SHORT, 1,
        /* rbits, gbits, bbits, abits */
        16, 0, 0, 0,
        /* Masks and shifts */
        0xFFFF, 0, 0, 0, 0, 0, 0, 0
        ],
    //46-----------------------------------------------------------------------    
        ["PF_DEPTH_INT",
        /* Bytes per element */
        4,
        /* Flags */
        EPixelFormatFlags.DEPTH,
        /* Component type and count */
        EPixelComponentTypes.INT, 1,
        /* rbits, gbits, bbits, abits */
        32, 0, 0, 0,
        /* Masks and shifts */
        0xFFFFFFFF, 0, 0, 0, 0, 0, 0, 0
        ],
    //47-----------------------------------------------------------------------   
        ["PF_DEPTH24STENCIL8",
        /* Bytes per element */
        4,
        /* Flags */
        EPixelFormatFlags.DEPTH|EPixelFormatFlags.STENCIL,
        /* Component type and count */
        EPixelComponentTypes.INT, 1,
        /* rbits, gbits, bbits, abits */
        24, 8, 0, 0,
        /* Masks and shifts */
        0x00FFFFFF, 0xFF000000, 0, 0,
        0, 24, 0, 0
        ],
	]);

    var _pColorValue: IColorValue = {r: 0., g: 0., b: 0., a: 1.};

	export module pixelUtil {
        export inline function getDescriptionFor(eFmt: EPixelFormats): IPixelFormatDescription {
            var ord: int = <int>eFmt;
            ASSERT(ord>=0 && ord<EPixelFormats.TOTAL,"getDescriptionFor:"+ord);

            return pPixelFormats[ord];
        }

		/** Returns the size in bytes of an element of the given pixel format.
         @return
               The size in bytes of an element. See Remarks.
         @remarks
               Passing PF_UNKNOWN will result in returning a size of 0 bytes.
        */
        export inline function getNumElemBytes(eFormat: EPixelFormats): uint {
        	return getDescriptionFor(eFormat).elemBytes;
        }

        /** Returns the size in bits of an element of the given pixel format.
          @return
               The size in bits of an element. See Remarks.
           @remarks
               Passing PF_UNKNOWN will result in returning a size of 0 bits.
        */
        export inline function getNumElemBits(eFormat: EPixelFormats): uint {
        	return getDescriptionFor(eFormat).elemBytes * 8;
        }



		/** Returns the size in memory of a region with the given extents and pixel
			format with consecutive memory layout.
			@param width
				The width of the area
			@param height
				The height of the area
			@param depth
				The depth of the area
			@param format
				The format of the area
		  	@return
		  		The size in bytes
			@remarks
				In case that the format is non-compressed, this simply returns
				width*height*depth*PixelUtil::getNumElemBytes(format). In the compressed
				case, this does serious magic.
		*/
		export function getMemorySize(iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats): uint {
			if(isCompressed(eFormat)) {
				switch(eFormat) {
					// DXT formats work by dividing the image into 4x4 blocks, then encoding each
					// 4x4 block with a certain number of bytes. 
					case EPixelFormats.DXT1:
						return Math.floor((iWidth + 3) / 4) * Math.floor((iHeight + 3) / 4) * 8 * iDepth;
					case EPixelFormats.DXT2:
					case EPixelFormats.DXT3:
					case EPixelFormats.DXT4:
					case EPixelFormats.DXT5:
						return Math.floor((iWidth + 3) / 4) * Math.floor((iHeight + 3) / 4) * 16 * iDepth;

	                // Size calculations from the PVRTC OpenGL extension spec
	                // http://www.khronos.org/registry/gles/extensions/IMG/IMG_texture_compression_pvrtc.txt
	                // Basically, 32 bytes is the minimum texture size.  Smaller textures are padded up to 32 bytes
	                case EPixelFormats.PVRTC_RGB2:
	                case EPixelFormats.PVRTC_RGBA2:
						ASSERT(iDepth == 1);
	                    return (math.max(<int>iWidth, 16) * math.max(<int>iHeight, 8) * 2 + 7) / 8;
	                case EPixelFormats.PVRTC_RGB4:
	                case EPixelFormats.PVRTC_RGBA4:
						ASSERT(iDepth == 1);
	                    return (math.max(<int>iWidth, 8) * math.max(<int>iHeight, 8) * 4 + 7) / 8;
					default:
						ERROR("Invalid compressed pixel format", "PixelUtil::getMemorySize");
				}
			}
			else {
				return iWidth * iHeight * iDepth * getNumElemBytes(eFormat);
			}
		}
		
        /** Returns the property flags for this pixel format
          @return
               A bitfield combination of PFF_HASALPHA, PFF_ISCOMPRESSED,
               PFF_FLOAT, PFF_DEPTH, PFF_NATIVEENDIAN, PFF_LUMINANCE
          @remarks
               This replaces the separate functions for formatHasAlpha, formatIsFloat, ...
        */
        export  inline function getFlags(eFormat: EPixelFormats): uint {
        	return getDescriptionFor(eFormat).flags;
        }

        /** Shortcut method to determine if the format has an alpha component */
        export inline function hasAlpha(eFormat: EPixelFormats): bool {
        	return (getFlags(eFormat) & EPixelFormatFlags.HASALPHA) > 0;
        }
        /** Shortcut method to determine if the format is floating point */
        export inline function isFloatingPoint(eFormat: EPixelFormats): bool {
        	return (getFlags(eFormat) & EPixelFormatFlags.FLOAT) > 0;
        }
        /** Shortcut method to determine if the format is compressed */
        export inline function isCompressed(eFormat: EPixelFormats): bool {
        	return (getFlags(eFormat) & EPixelFormatFlags.COMPRESSED) > 0;
        }
        /** Shortcut method to determine if the format is a depth format. */
        export inline function isDepth(eFormat: EPixelFormats): bool {
        	return (getFlags(eFormat) & EPixelFormatFlags.DEPTH) > 0;
        }
        /** Shortcut method to determine if the format is in native endian format. */
        export inline function isNativeEndian(eFormat: EPixelFormats): bool {
        	return (getFlags(eFormat) & EPixelFormatFlags.NATIVEENDIAN) > 0;
        }
        /** Shortcut method to determine if the format is a luminance format. */
        export inline function isLuminance(eFormat: EPixelFormats): bool {
        	return (getFlags(eFormat) & EPixelFormatFlags.LUMINANCE) > 0;
        }
		
		/** Return wether a certain image extent is valid for this image format.
			@param width
				The width of the area
			@param height
				The height of the area
			@param depth
				The depth of the area
			@param format
				The format of the area
			@remarks For non-compressed formats, this is always true. For DXT formats,
			only sizes with a width and height multiple of 4 and depth 1 are allowed.
		*/
		export function isValidExtent(iWidth: uint, iHeight: uint, iDepth: uint, eFormat: EPixelFormats): bool {
			if(isCompressed(eFormat)) {
				switch(eFormat) {
					case EPixelFormats.DXT1:
					case EPixelFormats.DXT2:
					case EPixelFormats.DXT3:
					case EPixelFormats.DXT4:
					case EPixelFormats.DXT5:
						return ((iWidth&3)==0 && (iHeight&3)==0 && iDepth==1);
					default:
						return true;
				}
			}
			else
			{
				return true;
			}
		}

        /** Gives the number of bits (RGBA) for a format. See remarks.          
          @remarks      For non-colour formats (dxt, depth) this returns [0,0,0,0].
        */
        export function getBitDepths(eFormat: EPixelFormats): int[] {
        	const des: IPixelFormatDescription = getDescriptionFor(eFormat);
        	var rgba: int[] = [];

	        rgba[0] = des.rbits;
	        rgba[1] = des.gbits;
	        rgba[2] = des.bbits;
	        rgba[3] = des.abits;

	        return rgba;
        }

		/** Gives the masks for the R, G, B and A component
		  @note			Only valid for native endian formats
        */
        export function getBitMasks(eFormat: EPixelFormats): uint[] {
        	const des: IPixelFormatDescription = getDescriptionFor(eFormat);
        	var rgba: uint[] = [];

	        rgba[0] = des.rmask;
	        rgba[1] = des.gmask;
	        rgba[2] = des.bmask;
	        rgba[3] = des.amask;

	        return rgba;
        }

		/** Gives the bit shifts for R, G, B and A component
		@note			Only valid for native endian formats
		*/
		export function getBitShifts(eFormat: EPixelFormats): uint[] {
			const des: IPixelFormatDescription = getDescriptionFor(eFormat);
        	var rgba: int[] = [];
        	
	        rgba[0] = des.rshift;
	        rgba[1] = des.gshift;
	        rgba[2] = des.bshift;
	        rgba[3] = des.ashift;

	        return rgba;
		}

        /** Gets the name of an image format
        */
        export inline function getFormatName(eSrcFormat: EPixelFormats): string {
        	return getDescriptionFor(eSrcFormat).name;
        }

        /** Returns wether the format can be packed or unpacked with the packColour()
        and unpackColour() functions. This is generally not true for compressed and
        depth formats as they are special. It can only be true for formats with a
        fixed element size.
          @return 
               true if yes, otherwise false
        */
        export function isAccessible(eSrcFormat: EPixelFormats): bool {
        	if (eSrcFormat == EPixelFormats.UNKNOWN)
	            return false;
	        var flags: uint = getFlags(eSrcFormat);
	        return !((flags & EPixelFormatFlags.COMPRESSED) || (flags & EPixelFormatFlags.DEPTH));
        }
        
        /** Returns the component type for a certain pixel format. Returns PCT_BYTE
            in case there is no clear component type like with compressed formats.
            This is one of PCT_BYTE, PCT_SHORT, PCT_FLOAT16, PCT_FLOAT32.
        */
        export inline function getComponentType(eFmt: EPixelFormats): EPixelComponentTypes {
        	return getDescriptionFor(eFmt).componentType;
        }
        
        /** Returns the component count for a certain pixel format. Returns 3(no alpha) or 
            4 (has alpha) in case there is no clear component type like with compressed formats.
         */
        export inline function getComponentCount(eFmt: EPixelFormats): uint {
        	return getDescriptionFor(eFmt).componentCount;
        }

        export inline function getComponentTypeBits(eFormat: EPixelFormats): uint {
            var eType: EPixelComponentTypes = getComponentType(eFormat);
            
            switch(eType) {
                case EPixelComponentTypes.BYTE:      return 8;   /*Byte per component (8 bit fixed 0.0..1.0)*/
                case EPixelComponentTypes.SHORT:     return 16;  /*Short per component (16 bit fixed 0.0..1.0))*/
                case EPixelComponentTypes.FLOAT16:   return 16;  /*16 bit float per component*/
                case EPixelComponentTypes.FLOAT32:   return 32;  /*32 bit float per component*/
            }

            return 0;
        }

        /** Gets the format from given name.
            @param  name            The string of format name
            @param  accessibleOnly  If true, non-accessible format will treat as invalid format,
                                    otherwise, all supported format are valid.
            @param  caseSensitive   Should be set true if string match should use case sensitivity.
            @return                The format match the format name, or PF_UNKNOWN if is invalid name.
        */
        export function getFormatFromName(sName: string, isAccessibleOnly: bool = false, isCaseSensitive: bool = false): EPixelFormats {
        	var tmp: string = sName;

	        if (!isCaseSensitive) {
	            // We are stored upper-case format names.
	            tmp = tmp.toUpperCase();
	        }

	        for (var i: int = 0; i < EPixelFormats.TOTAL; ++i) {
	            var ePf: EPixelFormats = <EPixelFormats>i;
	            if (!isAccessibleOnly || isAccessible(ePf)) {
	                if (tmp == getFormatName(ePf))
	                    return ePf;
	            }
	        }

	        return EPixelFormats.UNKNOWN;
        }

        /** Gets the BNF expression of the pixel-formats.
            @note                   The string returned by this function is intended to be used as a BNF expression
                                    to work with Compiler2Pass.
            @param  accessibleOnly  If true, only accessible pixel format will take into account, otherwise all
                                    pixel formats list in EPixelFormats enumeration will being returned.
            @return                A string contains the BNF expression.
        */
        export function getBNFExpressionOfPixelFormats(isAccessibleOnly: bool = false): string {
        	// Collect format names sorted by length, it's required by BNF compiler
	        // that similar tokens need longer ones comes first.
	        
	        var formatNames: Pair[] = new Pair[];
	        for (var i: uint = 0; i < EPixelFormats.TOTAL; ++i) {
	            var ePf: EPixelFormats = <EPixelFormats>(i);
	            if (!isAccessibleOnly || isAccessible(ePf))
	            {
	                var formatName: string = getFormatName(ePf);
	                formatNames.push({first: formatName.length, second: formatName});
	            }
	        }

	        // Populate the BNF expression in reverse order
	        var result: string = "";
	        // Note: Stupid M$ VC7.1 can't dealing operator!= with FormatNameMap::const_reverse_iterator.
	        for (var j in formatNames) {
	            if (!isEmpty(result))
	                result += " | ";
	            result += "'" + formatNames[j] + "'";
	        }

	        return result;
        }

        /** Returns the similar format but acoording with given bit depths.
            @param fmt      The original foamt.
            @param integerBits Preferred bit depth (pixel bits) for integer pixel format.
                            Available values: 0, 16 and 32, where 0 (the default) means as it is.
            @param floatBits Preferred bit depth (channel bits) for float pixel format.
                            Available values: 0, 16 and 32, where 0 (the default) means as it is.
            @return        The format that similar original format with bit depth according
                            with preferred bit depth, or original format if no conversion occurring.
        */
        export function getFormatForBitDepths(eFmt: EPixelFormats, iIntegerBits: uint, iFloatBits: uint): EPixelFormats {
        	switch (iIntegerBits) 
            {
	        case 16:
	            switch (eFmt) {
	            case EPixelFormats.R8G8B8:
	            case EPixelFormats.X8R8G8B8:
	                return EPixelFormats.R5G6B5;

	            case EPixelFormats.B8G8R8:
	            case EPixelFormats.X8B8G8R8:
	                return EPixelFormats.B5G6R5;

	            case EPixelFormats.A8R8G8B8:
	            case EPixelFormats.R8G8B8A8:
	            case EPixelFormats.A8B8G8R8:
	            case EPixelFormats.B8G8R8A8:
	                return EPixelFormats.A4R4G4B4;

	            case EPixelFormats.A2R10G10B10:
	            case EPixelFormats.A2B10G10R10:
	                return EPixelFormats.A1R5G5B5;

	            default:
	                // use original image format
	                break;
	            }
	            break;

	        case 32:
	            switch (eFmt) {
	            case EPixelFormats.R5G6B5:
	                return EPixelFormats.X8R8G8B8;

	            case EPixelFormats.B5G6R5:
	                return EPixelFormats.X8B8G8R8;

	            case EPixelFormats.A4R4G4B4:
	                return EPixelFormats.A8R8G8B8;

	            case EPixelFormats.A1R5G5B5:
	                return EPixelFormats.A2R10G10B10;

	            default:
	                // use original image format
	                break;
	            }
	            break;

	        default:
	            // use original image format
	            break;
	        }

	        switch (iFloatBits) {
	        case 16:
	            switch (eFmt) {
	            case EPixelFormats.FLOAT32_R:
	                return EPixelFormats.FLOAT16_R;

	            case EPixelFormats.FLOAT32_RGB:
	                return EPixelFormats.FLOAT16_RGB;

	            case EPixelFormats.FLOAT32_RGBA:
	                return EPixelFormats.FLOAT16_RGBA;

	            default:
	                // use original image format
	                break;
	            }
	            break;

	        case 32:
	            switch (eFmt) {
	            case EPixelFormats.FLOAT16_R:
	                return EPixelFormats.FLOAT32_R;

	            case EPixelFormats.FLOAT16_RGB:
	                return EPixelFormats.FLOAT32_RGB;

	            case EPixelFormats.FLOAT16_RGBA:
	                return EPixelFormats.FLOAT32_RGBA;

	            default:
	                // use original image format
	                break;
	            }
	            break;

	        default:
	            // use original image format
	            break;
	        }

	        return eFmt;
        }

        /** Pack a colour value to memory
        	@param colour	The colour
        	@param pf		Pixelformat in which to write the colour
        	@param dest		Destination memory location
        */
        export inline function packColour(cColour: IColor, ePf: EPixelFormats,  pDest: Uint8Array): void {
        	packColourFloat(cColour.r, cColour.g, cColour.b, cColour.a, ePf, pDest);
        }
        /** Pack a colour value to memory
        	@param r,g,b,a	The four colour components, range 0x00 to 0xFF
        	@param pf		Pixelformat in which to write the colour
        	@param dest		Destination memory location
        */
        export function packColourUint(r: uint, g: uint, b: uint, a: uint, ePf: EPixelFormats,  pDest: Uint8Array): void {
        	// if (arguments.length < 4) {
        	// 	var cColour: IColor = arguments[0];
        	// 	packColour(cColour.r, cColour.g, cColour.b, cColour.a, ePf, pDest);
        	// 	return;
        	// }

        	const des: IPixelFormatDescription = getDescriptionFor(ePf);
	        if(des.flags & EPixelFormatFlags.NATIVEENDIAN) {
	            // Shortcut for integer formats packing
	            var value: uint = 
	            	((bf.fixedToFixed(r, 8, des.rbits)<<des.rshift) & des.rmask) |
	                ((bf.fixedToFixed(g, 8, des.gbits)<<des.gshift) & des.gmask) |
	                ((bf.fixedToFixed(b, 8, des.bbits)<<des.bshift) & des.bmask) |
	                ((bf.fixedToFixed(a, 8, des.abits)<<des.ashift) & des.amask);
	            // And write to memory
	            bf.intWrite(pDest, des.elemBytes, value);
	        } else {
	            // Convert to float
	            packColourFloat(<float>r/255.0,<float>g/255.0,<float>b/255.0,<float>a/255.0, ePf, pDest);
	        }
        }
         /** Pack a colour value to memory
        	@param r,g,b,a	The four colour components, range 0.0f to 1.0f
        					(an exception to this case exists for floating point pixel
        					formats, which don't clamp to 0.0f..1.0f)
        	@param pf		Pixelformat in which to write the colour
        	@param dest		Destination memory location
        */
        export function packColourFloat(r: float, g: float, b: float, a: float, ePf: EPixelFormats,  pDest: Uint8Array): void {
        	// Catch-it-all here
	        const des: IPixelFormatDescription = getDescriptionFor(ePf);
	        if(des.flags & EPixelFormatFlags.NATIVEENDIAN) {
	            // Do the packing
	            //std::cerr << dest << " " << r << " " << g <<  " " << b << " " << a << std::endl;
	            const value: uint = ((bf.floatToFixed(r, des.rbits)<<des.rshift) & des.rmask) |
	                ((bf.floatToFixed(g, des.gbits)<<des.gshift) & des.gmask) |
	                ((bf.floatToFixed(b, des.bbits)<<des.bshift) & des.bmask) |
	                ((bf.floatToFixed(a, des.abits)<<des.ashift) & des.amask);
	            // And write to memory
	            bf.intWrite(pDest, des.elemBytes, value);
	        } else {
	            switch(ePf) {
	            case EPixelFormats.FLOAT32_R:
	                dynamic_cast_f32_ptr(pDest, 1)[0] = r;
	                break;
				case EPixelFormats.FLOAT32_GR:
					dynamic_cast_f32_ptr(pDest, 1)[0] = g;
					dynamic_cast_f32_ptr(pDest, 2)[1] = r;
					break;
	            case EPixelFormats.FLOAT32_RGB:
	                dynamic_cast_f32_ptr(pDest, 1)[0] = r;
	                dynamic_cast_f32_ptr(pDest, 2)[1] = g;
	                dynamic_cast_f32_ptr(pDest, 3)[2] = b;
	                break;
	            case EPixelFormats.FLOAT32_RGBA:
	                dynamic_cast_f32_ptr(pDest, 1)[0] = r;
	                dynamic_cast_f32_ptr(pDest, 2)[1] = g;
	                dynamic_cast_f32_ptr(pDest, 3)[2] = b;
	                dynamic_cast_f32_ptr(pDest, 4)[3] = a;
	                break;
	            case EPixelFormats.FLOAT16_R:
	                dynamic_cast_u16_ptr(pDest, 1)[0] = bf.floatToHalf(r);
	                break;
				case EPixelFormats.FLOAT16_GR:
					dynamic_cast_u16_ptr(pDest, 1)[0] = bf.floatToHalf(g);
					dynamic_cast_u16_ptr(pDest, 2)[1] = bf.floatToHalf(r);
					break;
	            case EPixelFormats.FLOAT16_RGB:
	                dynamic_cast_u16_ptr(pDest, 1)[0] = bf.floatToHalf(r);
	                dynamic_cast_u16_ptr(pDest, 2)[1] = bf.floatToHalf(g);
	                dynamic_cast_u16_ptr(pDest, 3)[2] = bf.floatToHalf(b);
	                break;
	            case EPixelFormats.FLOAT16_RGBA:
	                dynamic_cast_u16_ptr(pDest, 1)[0] = bf.floatToHalf(r);
	                dynamic_cast_u16_ptr(pDest, 2)[1] = bf.floatToHalf(g);
	                dynamic_cast_u16_ptr(pDest, 3)[2] = bf.floatToHalf(b);
	                dynamic_cast_u16_ptr(pDest, 4)[3] = bf.floatToHalf(a);
	                break;
	            case EPixelFormats.SHORT_RGB:
					dynamic_cast_u16_ptr(pDest, 1)[0] = bf.floatToFixed(r, 16);
	                dynamic_cast_u16_ptr(pDest, 2)[1] = bf.floatToFixed(g, 16);
	                dynamic_cast_u16_ptr(pDest, 3)[2] = bf.floatToFixed(b, 16);
	                break;
				case EPixelFormats.SHORT_RGBA:
					dynamic_cast_u16_ptr(pDest, 1)[0] = bf.floatToFixed(r, 16);
	                dynamic_cast_u16_ptr(pDest, 2)[1] = bf.floatToFixed(g, 16);
	                dynamic_cast_u16_ptr(pDest, 3)[2] = bf.floatToFixed(b, 16);
	                dynamic_cast_u16_ptr(pDest, 4)[3] = bf.floatToFixed(a, 16);
					break;
				case EPixelFormats.BYTE_LA:
					pDest[0] = bf.floatToFixed(r, 8);
	                pDest[1] = bf.floatToFixed(a, 8);
					break;
	            default:
	                // Not yet supported
	                ERROR(
	                    "pack to "+ getFormatName(ePf)+" not implemented",
	                    "PixelUtil::packColour");
	                break;
	            }
	        }
        }

        

        /** Unpack a colour value from memory
        	@param colour	The colour is returned here
        	@param pf		Pixelformat in which to read the colour
        	@param src		Source memory location
        */
        export function unpackColour(cColour: IColor, ePf: EPixelFormats,  pSrc: Uint8Array): void {
        	unpackColourFloat(cColour, ePf, pSrc);
        }
        /** Unpack a colour value from memory
        	@param r,g,b,a	The colour is returned here (as byte)
        	@param pf		Pixelformat in which to read the colour
        	@param src		Source memory location
        	@remarks 	This function returns the colour components in 8 bit precision,
        		this will lose precision when coming from PF_A2R10G10B10 or floating
        		point formats.  
        */
        export function unpackColourUint(rgba: IColorIValue, ePf: EPixelFormats,  pSrc: Uint8Array): void {
        	const des: IPixelFormatDescription = getDescriptionFor(ePf);
        	var r: uint = 0, g: uint = 0, b: uint = 0, a: uint = 0;
  
	        if(des.flags & EPixelFormatFlags.NATIVEENDIAN) {
	            // Shortcut for integer formats unpacking
	            const value: uint = bf.intRead(pSrc, des.elemBytes);
	            if(des.flags & EPixelFormatFlags.LUMINANCE) {
	                // Luminance format -- only rbits used
	                r = g = b = <uint>bf.fixedToFixed(
	                    (value & des.rmask) >> des.rshift, des.rbits, 8);
	            }
	            else {
	                r = <uint>bf.fixedToFixed((value & des.rmask)>>des.rshift, des.rbits, 8);
	                g = <uint>bf.fixedToFixed((value & des.gmask)>>des.gshift, des.gbits, 8);
	                b = <uint>bf.fixedToFixed((value & des.bmask)>>des.bshift, des.bbits, 8);
	            }
	            if(des.flags & EPixelFormatFlags.HASALPHA) {
	                a = <uint>bf.fixedToFixed((value & des.amask)>>des.ashift, des.abits, 8);
	            }
	            else {
	                a = 255; /* No alpha, default a component to full*/
	            }
	            
	        } else {
	            // Do the operation with the more generic floating point
	            var pRGBA: IColorValue = _pColorValue;
	            unpackColourFloat(pRGBA, ePf, pSrc);
	            

	            r = bf.floatToFixed(pRGBA.r, 8);
	            g = bf.floatToFixed(pRGBA.g, 8);
	            b = bf.floatToFixed(pRGBA.b, 8);
	            a = bf.floatToFixed(pRGBA.a, 8);
	        }

	        rgba[0] = r;
	        rgba[1] = g;
	        rgba[2] = b;
	        rgba[3] = a;
        }
        


        /** Unpack a colour value from memory
        	@param r,g,b,a	The colour is returned here (as float)
        	@param pf		Pixelformat in which to read the colour
        	@param src		Source memory location
        */
        export function unpackColourFloat(rgba: IColorValue, ePf: EPixelFormats,  pSrc: Uint8Array): void {
        	const des: IPixelFormatDescription = getDescriptionFor(ePf);
        	var r: float = 0., g: float = 0., b: float = 0., a: float = 0.;

	        if(des.flags & EPixelFormatFlags.NATIVEENDIAN) {
	            // Shortcut for integer formats unpacking
	            const value: uint = bf.intRead(pSrc, des.elemBytes);
                

	            if(des.flags & EPixelFormatFlags.LUMINANCE) 
                {
	                // Luminance format -- only rbits used
	                r = g = b = bf.fixedToFloat(
	                    (value & des.rmask)>>>des.rshift, des.rbits);
	            }
	            else {
	                r = bf.fixedToFloat((value & des.rmask) >>> des.rshift, des.rbits);
	                g = bf.fixedToFloat((value & des.gmask) >>> des.gshift, des.gbits);
	                b = bf.fixedToFloat((value & des.bmask) >>> des.bshift, des.bbits);
                    
	            }

	            if (des.flags & EPixelFormatFlags.HASALPHA) 
                {
                    
	                a = bf.fixedToFloat((value & des.amask) >>> des.ashift, des.abits);
	            }
	            else {
                    
	                a = 1.0; /* No alpha, default a component to full*/
	            }
                

	        } 
            else {
	            switch(ePf) {
	            case EPixelFormats.FLOAT32_R:
	                r = g = b = dynamic_cast_f32_ptr(pSrc, 1)[0];
	                a = 1.0;
	                break;
				case EPixelFormats.FLOAT32_GR:
					g = dynamic_cast_f32_ptr(pSrc, 1)[0];
					r = b = dynamic_cast_f32_ptr(pSrc, 2)[1];
					a = 1.0;
					break;
	            case EPixelFormats.FLOAT32_RGB:
	                r = dynamic_cast_f32_ptr(pSrc, 1)[0];
	                g = dynamic_cast_f32_ptr(pSrc, 2)[1];
	                b = dynamic_cast_f32_ptr(pSrc, 3)[2];
	                a = 1.0;
	                break;
	            case EPixelFormats.FLOAT32_RGBA:
	                r = dynamic_cast_f32_ptr(pSrc, 1)[0];
	                g = dynamic_cast_f32_ptr(pSrc, 2)[1];
	                b = dynamic_cast_f32_ptr(pSrc, 3)[2];
	                a = dynamic_cast_f32_ptr(pSrc, 4)[3];
	                break;
	            case EPixelFormats.FLOAT16_R:
	                r = g = b = bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 1))[0]);
	                a = 1.0;
	                break;
				case EPixelFormats.FLOAT16_GR:
					g = bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 1))[0]);
					r = b = bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 2))[1]);
					a = 1.0;
					break;
	            case EPixelFormats.FLOAT16_RGB:
	                r = bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 1))[0]);
	                g = bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 1))[1]);
	                b = bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 2))[2]);
	                a = 1.0;
	                break;
	            case EPixelFormats.FLOAT16_RGBA:
	                r = bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 1))[0]);
	                g = bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 2))[1]);
	                b = bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 3))[2]);
	                a = bf.halfToFloat((dynamic_cast_u16_ptr(pSrc, 4))[3]);
	                break;
				case EPixelFormats.SHORT_RGB:
					r = bf.fixedToFloat((dynamic_cast_u16_ptr(pSrc, 1))[0], 16);
	                g = bf.fixedToFloat((dynamic_cast_u16_ptr(pSrc, 2))[1], 16);
					b = bf.fixedToFloat((dynamic_cast_u16_ptr(pSrc, 3))[2], 16);
					a = 1.0;
					break;
				case EPixelFormats.SHORT_RGBA:
					r = bf.fixedToFloat((dynamic_cast_u16_ptr(pSrc, 1))[0], 16);
	                g = bf.fixedToFloat((dynamic_cast_u16_ptr(pSrc, 2))[1], 16);
					b = bf.fixedToFloat((dynamic_cast_u16_ptr(pSrc, 3))[2], 16);
					a = bf.fixedToFloat((dynamic_cast_u16_ptr(pSrc, 4))[3], 16);
					break;
				case EPixelFormats.BYTE_LA:
					r = g = b = bf.fixedToFloat((pSrc)[0], 8);
					a = bf.fixedToFloat((pSrc)[1], 8);
					break;
	            default:
	                // Not yet supported
	                ERROR(
	                    "unpack from "+ getFormatName(ePf) +" not implemented",
	                    "PixelUtil::unpackColour");
	                break;
	            }
	        }

	        rgba.r = r;
	        rgba.g = g;
	        rgba.b = b;
	        rgba.a = a;

        }
        
        /** Convert consecutive pixels from one format to another. No dithering or filtering is being done. 
         	Converting from RGB to luminance takes the R channel.  In case the source and destination format match,
         	just a copy is done.
         	@param	src			Pointer to source region
         	@param	srcFormat	Pixel format of source region
         	@param   dst			Pointer to destination region
         	@param	dstFormat	Pixel format of destination region
         */
        export function bulkPixelConversion(pSrc: Uint8Array, eSrcFormat: EPixelFormats, pDest: Uint8Array, eDstFormat: EPixelFormats, iCount: uint): void; 
        	

        /** Convert pixels from one format to another. No dithering or filtering is being done. Converting
          	from RGB to luminance takes the R channel. 
		 	@param	src			PixelBox containing the source pixels, pitches and format
		 	@param	dst			PixelBox containing the destination pixels, pitches and format
		 	@remarks The source and destination boxes must have the same
         	dimensions. In case the source and destination format match, a plain copy is done.
        */

        export function bulkPixelConversion(pSrc: IPixelBox, pDest: IPixelBox): void;

        export function bulkPixelConversion(pSrc: any, eSrcFormat: any, pDest?: any, eDstFormat?: any, iCount?: uint): void {
        	var src: IPixelBox = null,
        		dst: IPixelBox = null;

        	if (arguments.length > 2) {
	        	src = new PixelBox(iCount, 1, 1, <EPixelFormats>eSrcFormat, <Uint8Array>pSrc);
				dst = new PixelBox(iCount, 1, 1, <EPixelFormats>eDstFormat, <Uint8Array>pDest);
			}
            else
            {
                src = arguments[0];
                dst = arguments[1];
            }
            
            if(src.width !== dst.width || src.height !== dst.height || src.depth !== dst.depth){
                CRITICAL("Size dest and src pictures is different");
                return;
            }

			// Check for compressed formats, we don't support decompression, compression or recoding
			if(isCompressed(src.format) || isCompressed(dst.format)) {
				if(src.format == dst.format) {
					//_memcpy(dst.data.buffer, src.data.buffer, src.getConsecutiveSize());
					dst.data.set(src.data.subarray(0, src.getConsecutiveSize()));
					return;
				}
				else {
					ERROR("This method can not be used to compress or decompress images",
						"PixelUtil::bulkPixelConversion");
				}
			}
	        
            // The easy case
	        if(src.format == dst.format) {
	            // Everything consecutive?
	            if(src.isConsecutive() && dst.isConsecutive())
	            {
					//_memcpy(dst.data.buffer, src.data.buffer, src.getConsecutiveSize());
					dst.data.set(src.data.subarray(0, src.getConsecutiveSize()));
	                return;
	            }

	            var srcPixelSize: uint = getNumElemBytes(src.format);
	            var dstPixelSize: uint = getNumElemBytes(dst.format);

	            var srcptr: Uint8Array = src.data.subarray(
	                (src.left + src.top * src.rowPitch + src.front * src.slicePitch) * srcPixelSize);
	            var dstptr: Uint8Array = dst.data.subarray(
					+ (dst.left + dst.top * dst.rowPitch + dst.front * dst.slicePitch) * dstPixelSize);

	            // Calculate pitches+skips in bytes
	            var srcRowPitchBytes: uint = src.rowPitch * srcPixelSize;
	            //var size_t srcRowSkipBytes = src.getRowSkip()*srcPixelSize;
	            var srcSliceSkipBytes: uint = src.getSliceSkip() * srcPixelSize;

	            var dstRowPitchBytes: uint = dst.rowPitch * dstPixelSize;
	            //var size_t dstRowSkipBytes = dst.getRowSkip()*dstPixelSize;
	            var dstSliceSkipBytes: uint = dst.getSliceSkip() * dstPixelSize;

	            // Otherwise, copy per row
	            const rowSize: uint = src.width * srcPixelSize;

	            for(var z: int = src.front; z < src.back; z++) {
	                for(var y: int = src.top; y < src.bottom; y++) {
						//_memcpy(dstptr.buffer, srcptr.buffer, rowSize);
						dstptr.set(srcptr.subarray(0, rowSize));

	                    srcptr = srcptr.subarray(srcRowPitchBytes);
	                    dstptr = dstptr.subarray(dstRowPitchBytes);
	                }

	                srcptr = srcptr.subarray(srcSliceSkipBytes);
	                dstptr = dstptr.subarray(dstSliceSkipBytes);
	            }

	            return;
	        }



			// Converting to PF_X8R8G8B8 is exactly the same as converting to
			// PF_A8R8G8B8. (same with PF_X8B8G8R8 and PF_A8B8G8R8)
			if(dst.format == EPixelFormats.X8R8G8B8 || dst.format == EPixelFormats.X8B8G8R8)
            {
				// Do the same conversion, with EPixelFormats.A8R8G8B8, which has a lot of
				// optimized conversions
				var tempdst: IPixelBox = dst;
				tempdst.format = (dst.format == EPixelFormats.X8R8G8B8) ? EPixelFormats.A8R8G8B8  :EPixelFormats.A8B8G8R8;
				bulkPixelConversion(src, tempdst);
				return;
			}


			// Converting from EPixelFormats.X8R8G8B8 is exactly the same as converting from
			// EPixelFormats.A8R8G8B8, given that the destination format does not have alpha.
			if((src.format == EPixelFormats.X8R8G8B8||src.format == EPixelFormats.X8B8G8R8) && !hasAlpha(dst.format)) {
				// Do the same conversion, with EPixelFormats.A8R8G8B8, which has a lot of
				// optimized conversions
				var tempsrc: IPixelBox = src;
				tempsrc.format = src.format == EPixelFormats.X8R8G8B8 ? EPixelFormats.A8R8G8B8 : EPixelFormats.A8B8G8R8;
				bulkPixelConversion(tempsrc, dst);
				return;
			}

	        var srcPixelSize: uint = getNumElemBytes(src.format);
	        var dstPixelSize: uint = getNumElemBytes(dst.format);

	        var srcptr: Uint8Array = src.data.subarray(
	            (src.left + src.top * src.rowPitch + src.front * src.slicePitch) * srcPixelSize);
	        var dstptr: Uint8Array = dst.data.subarray(
	            (dst.left + dst.top * dst.rowPitch + dst.front * dst.slicePitch) * dstPixelSize);
			
			// Old way, not taking into account box dimensions
			//uint8 *srcptr = static_cast<uint8*>(src.data), *dstptr = static_cast<uint8*>(dst.data);

	        // Calculate pitches+skips in bytes
	        var srcRowSkipBytes: uint = src.getRowSkip() * srcPixelSize;
	        var srcSliceSkipBytes: uint = src.getSliceSkip() * srcPixelSize;
	        var dstRowSkipBytes: uint = dst.getRowSkip() * dstPixelSize;
	        var dstSliceSkipBytes: uint = dst.getSliceSkip() * dstPixelSize;

	        // The brute force fallback
	        // var r: float = 0, g: float = 0, b: float = 0, a: float = 1;
	        var rgba = _pColorValue;
	        for(var z: int = src.front; z < src.back; z ++) {
	            for(var y: int = src.top; y < src.bottom; y ++) {
	                for(var x: int = src.left; x < src.right; x ++) {
	                    unpackColourFloat(rgba, src.format, srcptr);
	                    packColourFloat(rgba.r, rgba.g, rgba.b, rgba.a, dst.format, dstptr);
	                    srcptr = srcptr.subarray(srcPixelSize);
	                    dstptr = dstptr.subarray(dstPixelSize);
	                }
	                srcptr = srcptr.subarray(srcRowSkipBytes);
	                dstptr = dstptr.subarray(dstRowSkipBytes);
	            }
	            srcptr = srcptr.subarray(srcSliceSkipBytes);
	            dstptr = dstptr.subarray(dstSliceSkipBytes);
	        }
        }

        export function calculateSizeForImage(nMipLevels: uint, nFaces: uint, 
                                              iWidth: uint, iHeight: uint, iDepth: uint,
                                              eFormat: EPixelFormats): uint {
            var iSize: uint = 0;
            var mip: uint = 0;
            
            for(mip = 0; mip <= nMipLevels; ++mip){
                iSize += getMemorySize(iWidth, iHeight, iDepth, eFormat) * nFaces;
                if(iWidth !== 1) iWidth /= 2;
                if(iHeight !== 1) iHeight /= 2;
                if(iDepth !== 1) iDepth /= 2;
            }

            return iSize;
        }
	}
}

#endif
