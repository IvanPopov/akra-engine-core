#ifndef CODEC_TS
#define CODEC_TS

#include "PixelFormat.ts"
#include "bf/bitflags.ts"
#include "math/math.ts"
#include "IColor.ts"
#include "PixelBox.ts"


#define DDS_MAGIC 0x20534444


//  DDS_header.dwFlags
#define DDSD_CAPS 0x00000001
#define DDSD_HEIGHT 0x00000002
#define DDSD_WIDTH 0x00000004
#define DDSD_PITCH 0x00000008
#define DDSD_PIXELFORMAT 0x00001000
#define DDSD_MIPMAPCOUNT 0x00020000
#define DDSD_LINEARSIZE 0x00080000
#define DDSD_DEPTH 0x00800000


//  DDS_header.ddspf.dwFlags
#define DDPF_ALPHAPIXELS 0x00000001
#define DDPF_ALPHA 0x00000002
#define DDPF_FOURCC 0x00000004
#define DDPF_PALETTEINDEXED4 0x00000008
#define DDPF_PALETTEINDEXEDTO8 0x00000010
#define DDPF_PALETTEINDEXED8 0x00000020
#define DDPF_RGB 0x00000040
#define DDPF_COMPRESSED 0x00000080
#define DDPF_RGBTOYUV 0x00000100
#define DDPF_YUV 0x00000200
#define DDPF_ZBUFFER 0x00000400
#define DDPF_PALETTEINDEXED1 0x00000800
#define DDPF_PALETTEINDEXED2 0x00001000
#define DDPF_ZPIXELS 0x00002000
#define DDPF_STENCILBUFFER 0x00004000
#define DDPF_ALPHAPREMULT 0x00008000
#define DDPF_LUMINANCE 0x00020000
#define DDPF_BUMPLUMINANCE 0x00040000
#define DDPF_BUMPDUDV 0x00080000 

//  DDS_header.dwCaps2
#define DDSCAPS2_CUBEMAP 0x200
#define DDSCAPS2_CUBEMAP_POSITIVEX 0x400
#define DDSCAPS2_CUBEMAP_NEGATIVEX 0x800
#define DDSCAPS2_CUBEMAP_POSITIVEY 0x1000
#define DDSCAPS2_CUBEMAP_NEGATIVEY 0x2000
#define DDSCAPS2_CUBEMAP_POSITIVEZ 0x4000
#define DDSCAPS2_CUBEMAP_NEGATIVEZ 0x8000
#define DDSCAPS2_VOLUME 0x200000 

//DDS_header10.dwMiscFlag
#define RESOURCE_MISC_GENERATE_MIPS 0x1
#define RESOURCE_MISC_SHARED 0x2
#define RESOURCE_MISC_TEXTURECUBE 0x4
#define RESOURCE_MISC_DRAWINDIRECT_ARGS 0x10
#define RESOURCE_MISC_BUFFER_ALLOW_RAW_VIEWS 0x20
#define RESOURCE_MISC_BUFFER_STRUCTURED 0x40
#define RESOURCE_MISC_RESOURCE_CLAMP 0x80
#define RESOURCE_MISC_SHARED_KEYEDMUTEX 0x100
#define RESOURCE_MISC_GDI_COMPATIBLE 0x200
#define RESOURCE_MISC_SHARED_NTHANDLE 0x800
#define RESOURCE_MISC_RESTRICTED_CONTENT 0x1000
#define RESOURCE_MISC_RESTRICT_SHARED_RESOURCE 0x2000
#define RESOURCE_MISC_RESTRICT_SHARED_RESOURCE_DRIVER 0x4000 
#define DDS_FOURCC DDPF_FOURCC
#define DDS_RGB DDPF_RGB
#define DDS_RGBA DDPF_RGB | DDPF_ALPHAPIXELS 

//  DD_Sheader.ddspf.dwFourCC
#define D3DFMT_DX10 0x30315844
#define D3DFMT_DXT1 0x31545844
#define D3DFMT_DXT2 0x32545844
#define D3DFMT_DXT3 0x33545844
#define D3DFMT_DXT4 0x34545844
#define D3DFMT_DXT5 0x35545844

module akra 
{

	interface IDDSPixelFormat{
		ddspf.dwSize :uint;
        ddspf.dwFlags :uint;
        ddspf.dwFourCC :uint;
        ddspf.dwRGBBitCount :uint;
        ddspf.dwRBitMask :uint;
        ddspf.dwGBitMask :uint;
        ddspf.dwBBitMask :uint;
        ddspf.dwABitMask :uint;
	}
	
	interface IDDSHeader{
		dwSize: uint;
        dwFlags: uint;
        dwHeight: uint;
        dwWidth: uint;
        dwPitchOrLinearSize: uint;
        dwDepth: uint;
        dwMipMapCount: uint;
        dwReserved1: uint[11];

        ddspf:IDDSPixelFormat;   

        dwCaps : uint;
        dwCaps2 : uint;
        dwCaps3 : uint;
        dwCaps4 : uint;
        dwReserved2 : uint;
	}

	export class DDSCodec extends ImageCodec implements IDDSCodec
	{
		private _sType:String="dds";
		private static _pInstance:DDSCodec:

		magicNumberToFileExt(pMagicNumber: Uint8Array):String
		{
			var dwMagic4:uint = (new Uint32Array(pMagicNumber, 0, 1))[0];
			if(DDS_MAGIC==dwMagic4)
			{
				return "dds";
			}

			return null;
		}

		/// Static method to startup and register the DDS codec
		static startup():void
		{
			if(!isDef(this._pInstance))
			{
				LOG(,"DDS codec registering");
				this._pInstance=new DDSCodec();
				Codec.registerCodec(this._pInstance);
			}
		}
		/// Static method to shutdown and unregister the DDS codec
		static shutdown():void
		{
			if(isDef(this._pInstance))
			{
				Codec.unRegisterCodec(this._pInstance);
				this._pInstance=undefined;
			}
		}

		getType():String 
    	{
        	return this._sType;
    	}

    	decode(pData: Uint8Array, pImgData: IImageData):Uint8Array
    	{
    		var iOffset:uint=0;
    		var dwMagic4:uint = (new Uint32Array(pData, 0, 1))[0];
    		if(dwMagic4!=DDS_MAGIC)
    		{
    			CRITICAL_ERROR(,"This is not a DDS file! DDSCodec.decode");
    		}
    		//Считываем dds header
            /*typedef struct {
             DWORD           dwSize;
             DWORD           dwFlags;
             DWORD           dwHeight;
             DWORD           dwWidth;
             DWORD           dwPitchOrLinearSize;
             DWORD           dwDepth;
             DWORD           dwMipMapCount;
             DWORD           dwReserved1[11];
             DDS_PIXELFORMAT ddspf;
             DWORD           dwCaps;
             DWORD           dwCaps2;
             DWORD           dwCaps3;
             DWORD           dwCaps4;
             DWORD           dwReserved2;
             } DDS_HEADER;*/

    		var pDDSHeader:Uint32Array = new Uint32Array(pData, 4, 31);

    		var pHeader:IDDSHeader;

    		pHeader.dwSize = pDDSHeader[0];
            pHeader.dwFlags = pDDSHeader[1];
            pHeader.dwHeight = pDDSHeader[2];
            pHeader.dwWidth = pDDSHeader[3];
            pHeader.dwPitchOrLinearSize = pDDSHeader[4];
            pHeader.dwDepth = pDDSHeader[5];
            pHeader.dwMipMapCount = pDDSHeader[6];
            pHeader.dwReserved1[0] = pDDSHeader[7];
            pHeader.dwReserved1[1] = pDDSHeader[8];
            pHeader.dwReserved1[2] = pDDSHeader[9];
            pHeader.dwReserved1[3] = pDDSHeader[10];
            pHeader.dwReserved1[4] = pDDSHeader[11];
            pHeader.dwReserved1[5] = pDDSHeader[12];
            pHeader.dwReserved1[6] = pDDSHeader[13];
            pHeader.dwReserved1[7] = pDDSHeader[14];
            pHeader.dwReserved1[8] = pDDSHeader[15];
            pHeader.dwReserved1[9] = pDDSHeader[16];
            pHeader.dwReserved1[10] = pDDSHeader[17];
            /*struct DDS_PIXELFORMAT {
             DWORD dwSize;
             DWORD dwFlags;
             DWORD dwFourCC;
             DWORD dwRGBBitCount;
             DWORD dwRBitMask;
             DWORD dwGBitMask;
             DWORD dwBBitMask;
             DWORD dwABitMask;
             };*/
            pHeader.ddspf.dwSize = pDDSHeader[18];
            pHeader.ddspf.dwFlags = pDDSHeader[19];
            pHeader.ddspf.dwFourCC = pDDSHeader[20];
            pHeader.ddspf.dwRGBBitCount = pDDSHeader[21];
            pHeader.ddspf.dwRBitMask = pDDSHeader[22];
            pHeader.ddspf.dwGBitMask = pDDSHeader[23];
            pHeader.ddspf.dwBBitMask = pDDSHeader[24];
            pHeader.ddspf.dwABitMask = pDDSHeader[25];
            pHeader.dwCaps = pDDSHeader[26];
            pHeader.dwCaps2 = pDDSHeader[27];
            pHeader.dwCaps3 = pDDSHeader[28];
            pHeader.dwCaps4 = pDDSHeader[29];
            pHeader.dwReserved2 = pDDSHeader[30];
            iOffset += 128;
            if (pHeader.dwSize != 124) {
                    ERROR(,"Размер заголовка DDS всегда должэен равняться 124");
            }
            if(pHeader.ddspf.dwSize!= 32){
            	ERROR(,"Размер DDS_PIXELFORMAT всегда должен равняться 32");
            }
            if (!(pHeader.dwFlags & DDSD_CAPS)) {
                ERROR(,"Флаг DDSD_CAPS в заголовке DDS всегда должен быть");
            }
            if (!(pHeader.dwFlags & DDSD_HEIGHT)) {
                ERROR(,"Флаг DDSD_HEIGHT в заголовке DDS всегда должен быть");
            }
            if (!(pHeader.dwFlags & DDSD_WIDTH)) {
                ERROR(,"Флаг DDSD_WIDTH в заголовке DDS всегда должен быть");
            }
            if (!(pHeader.dwFlags & DDSD_PIXELFORMAT)) {
                ERROR(,"Флаг DDSD_PIXELFORMAT в заголовке DDS всегда должен быть");
            }

            pImgData.width=pHeader.dwWidth;
            pImgData.height=pHeader.dwHeight;
            pImgData.depth=1;
            var nFace:uint=1;

            if (pHeader.dwFlags & DDSD_MIPMAPCOUNT) {
                pImgData.nMipMap = pHeader.dwMipMapCount;
                if ((me._iWidth >>> (nMipMap - 1)) != 1 || (me._iHeight >>> (nMipMap - 1)) != 1) {
                WARNING(,"Количество мипмапов не такое чтобы уменьшить размер картинки до 1x1"
                            + nMipMap + "," + me._iWidth + "x" + me._iHeight + ")");

            	}
            }
            else{
                pImgData.nMipMap = 0;
            }
            

            pImgData.flags=0;

            if (pHeader.dwCaps2 & DDSCAPS2_CUBEMAP)
			{
				imgData.flags |= CUBEMAP;
				nFace=0;
                if (pHeader.dwCaps2 & DDSCAPS2_CUBEMAP_POSITIVEX) {
                    nFace++;
                    pImgData.cubeFlags|=POSITIVEX;
                }
                if (pHeader.dwCaps2 & DDSCAPS2_CUBEMAP_NEGATIVEX) {
                    nFace++;
                    pImgData.cubeFlags|=NEGATIVEX;
                }
                if (pHeader.dwCaps2 & DDSCAPS2_CUBEMAP_POSITIVEY) {
                    nFace++;
                    pImgData.cubeFlags|=POSITIVEY;
                }
                if (pHeader.dwCaps2 & DDSCAPS2_CUBEMAP_NEGATIVEY) {
                    nFace++;
                    pImgData.cubeFlags|=NEGATIVEY;
                }
                if (pHeader.dwCaps2 & DDSCAPS2_CUBEMAP_POSITIVEZ) {
                    nFace++;
                    pImgData.cubeFlags|=POSITIVEZ;
                }
                if (pHeader.dwCaps2 & DDSCAPS2_CUBEMAP_NEGATIVEZ) {
                    nFace++;
                    pImgData.cubeFlags|=NEGATIVEZ;
                }

                if(nFace==0){
                	WARNING(,"Выставлен фдлаг с кубической текстурой, а самих текстур нету");
                }
			}
			
			if (pHeader.dwCaps2 & DDSCAPS2_VOLUME)
			{
				imgData.flags |= 3D_TEXTURE;
				imgData.depth = pHeader.dwDepth;
			}

			var eSourceFoemat:EPixelFormat=UNKNOWN;
			if (pHeader.ddspf.dwFlags & DDPF_FOURCC) {
				if (pHeader.ddspf.dwFourCC == D3DFMT_DXT1) {
				    eSourceFoemat = DXT1;
				}
				else if (pHeader.ddspf.dwFourCC == D3DFMT_DXT2) {
				    eSourceFoemat = DXT1;
				}
				else if (pHeader.ddspf.dwFourCC == D3DFMT_DXT3) {
				    eSourceFoemat = DXT3;
				}
				else if (pHeader.ddspf.dwFourCC == D3DFMT_DXT4) {
				    eSourceFoemat = DXT4;
				}
				else if (pHeader.ddspf.dwFourCC == D3DFMT_DXT5) {
				    eSourceFoemat = DXT5;
				}
				else if (pHeader.ddspf.dwFourCC == D3DFMT_DX10) {
				    var pDDS10Header:Uint32Array = new Uint32Array(pData, 128, 5);
				    var header10:Object = {};
				    header10.dxgiFormat = pDDS10Header[0];
				    header10.resourceDimension = pDDS10Header[1];
				    header10.miscFlag = pDDS10Header[2];
				    header10.arraySize = pDDS10Header[3];
				    header10.reserved = pDDS10Header[4];

				    CRITICAL_ERROR(,"Формат D3DFMT_DX10 не поддерживается");
				    /*console.log("dxgiFormat",header10.dxgiFormat);
				     console.log("resourceDimension",header10.resourceDimension);					
				     nCubeMap=1;
				     if(header10.miscFlag&RESOURCE_MISC_TEXTURECUBE)
				     {
				     nCubeMap=header10.arraySize;
				     }

				     if(nCubeMap!=6)
				     {
				     warning("Количество частей кубической текстуру не равно 6",nCubeMap);						
				     }*/
				    iOffset += 20;
				}
				else if(pHeader.ddspf.dwFourCC == D3DFMT_R16F)
				{
					eSourceFoemat=FLOAT16_R;
				}
				else if(pHeader.ddspf.dwFourCC == D3DFMT_G16R16F)
				{
					eSourceFoemat=FLOAT16_GR;
				}
				else if(pHeader.ddspf.dwFourCC == D3DFMT_A16B16G16R16F)
				{
					eSourceFoemat=FLOAT16_RGBA;
				}
				else if(pHeader.ddspf.dwFourCC == D3DFMT_R32F)
				{
					eSourceFoemat=FLOAT32_R;
				}
				else if(pHeader.ddspf.dwFourCC == D3DFMT_G32R32F)
				{
					eSourceFoemat=FLOAT32_GR;
				}
				else if(pHeader.ddspf.dwFourCC == D3DFMT_A32B32G32R32F)
				{
					eSourceFoemat=FLOAT32_RGBA;
				}
				else {
				    CRITICAL_ERROR(,"Флаг DDPF_FOURCC стоит, а подходящего dwFourCC нет");
				}
			}
			else if(pHeader.ddspf.dwFlags & DDPF_RGB)
			{
				var iAMask=pHeader.ddspf.dwFlags & DDPF_ALPHAPIXELS ? header.pixelFormat.alphaMask:0;
				for (var ePF:ePixelFormat = PUNKNOWN + 1; ePF < PCOUNT; ePF++)
				{

					if (PixelUtil.getNumElemBits(ePF) == pHeader.ddspf.dwRGBBitCount)
					{
						var pTestMasks:uint[4]=PixelUtil.getBitMasks(ePF);
						var pTestBits:uint[4]=PixelUtil.getBitDepths(ePF);

						if (pTestMasks[0] == dwRBitMask && pTestMasks[1] == dwGBitMask &&
							pTestMasks[2] == dwBBitMask && 
							// for alpha, deal with 'X8' formats by checking bit counts
							(pTestMasks[3] == iAMask || (iAMask == 0 && pTestBits[3] == 0)))
						{
							return ePF;
						}
					}

				}
				CRITICAL_ERROR(, "Cannot determine pixel format. DDSCodec.decode");
			}
			


			if (PixelUtil.isCompressed(eSourceFormat))
			{				
				imgData.flags |= COMPRESSED;
				if (!pHeader.dwFlags & DDS_HEADER_FLAGS_LINEARSIZE) {
                    CRITICAL_ERROR(,"У сжатой текстуры не выставлен флаг DDS_HEADER_FLAGS_LINEARSIZE в заголовке");
                }
			}
			else
			{
				if (pHeader.dwFlags & DDS_HEADER_FLAGS_LINEARSIZE) {
                	CRITICAL_ERROR("У несжатой текстуры выставлен флаг DDS_HEADER_FLAGS_LINEARSIZE в заголовке");
            	}
			}

			imgData.format = eSourceFormat;
			var pOutput:Uint8Array=new Uint8Array(imgData.size)
			var iOutputOffset:uint=0;

			for(var i:uint;i<nFace;i++)
			{
				var iWidth:uint=pImgData.width;
				var iHeight:uint=pImgData.height;
				var iDepth:uint=pImgData.depth;

				for(iMip:uint;iMip<=imgData.nMipMaps;iMip++)
				{
					var iDstPitch:uint;
					
					if(PixelUtil.isCompressed(imgData.format))
					{
						var iDXTSize:uint=PixelUtil.getMemorySize(iWidth, iHeight, iDepth, pImgData.format);
						for(var a:uint=0;a<iDstPitch;a++)
						{
							pOutput[a+iOutputOffset]=pData[iOffset+a];

						}
						iOffset+=iDXTSize;
						iOutputOffset+=iDXTSize;

					}
					else
					{
						iDstPitch=iWidth*PixelUtil.getNumElemBytes(imgData.format);
						var iSrcPitch:uint=0;
						if (pHeader.dwFlags & DDSD_PITCH)
						{
							iSrcPitch = pHeader.dwPitchOrLinearSize / Math.max(1, iMip * 2);
						}
						else
						{
							// assume same as final pitch
							iSrcPitch = iDstPitch;
						}
						if (iSrcPitch<iDstPitch)
						{
							WARNING(,"Странный размер питча у картинки")
						}
												
						for (var z:uint = 0; z < pImgData.depth; z++)
						{
							for (var y:uint = 0; y < pImgData.height; y++)
							{
								
								for(var a:uint=0;a<iDstPitch;a++)
								{
									pOutput[a+iOutputOffset]=pData[iOffset+a];
								}
								iOutputOffset = iOutputOffset + iDstPitch;
								iOffset=iOffset+iSrcPitch;
							}
						}

					}
					if(iWidth!=1)
					{
						iWidth=Math.floor(iWidth/2);
					}
					if(iHeight!=1)
					{
						iHeight=Math.floor(iHeight/2);
					}
					if(iDepth!=1)
					{
						iDepth=Math.floor(iDepth/2);
					}
				}
			}
			return pOutput;
		}



	}





}



	#endif