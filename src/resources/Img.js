/**
 * @file
 * @brief Img class.
 * @author xoma
 * @email xoma@odserve.org
 * Класс для работы с изображениями и их загрузкой, будет служить как хранилище для данных в классе текстура.
 **/


/**
 * @typedef
 */
Define(a.PaletteEntry(), function () {
    Uint8Array(4);
});

/**
 * @def
 */
Define(peRed, __[0]);
Define(peGreen, __[1]);
Define(peBlue, __[2]);
Define(peFlags, __[3]);

/**
 * @def
 */
Define(R, __[0]);
Define(G, __[1]);
Define(B, __[2]);
Define(A, __[3]);


Define(Float32(v), function () {
    Float32Array([v])
});
Define(a.Float32, Float32);

/**
 * Color constructors
 */
/**
 * @typedef
 */
Define(a.Color4i(), function () {
    Uint8Array(4);
});
/**
 * @typedef
 */
Define(a.Color3i(), function () {
    Uint8Array(3);
});
/**
 * @typedef
 */
Define(a.Color4f(), function () {
    Float32Array(4);
});
/**
 * @typedef
 */
Define(a.Color3f(), function () {
    Float32Array(3);
});
/**
 * @typedef
 */
Define(a.Color, a.Color4i);
/**
 * @typedef
 */
Define(a.ColorValue, a.Color4f);
/**
 * @typedef
 */
Define(a.Color4f(r, g, b, a), function () {
    Float32Array([r, g, b, a]);
});
/**
 * @typedef
 */
Define(a.Color4f(c, a), function () {
    Float32Array([c, c, c, a]);
});
/**
 * @typedef
 */
Define(a.Color4f(r, g, b), function () {
    Float32Array([r, g, b, 1.0]);
});
/**
 * @typedef
 */
Define(a.Color4f(c), function () {
    Float32Array([c, c, c, c]);
});
/**
 * @typedef
 */
Define(a.Color4i(r, g, b, a), function () {
    Uint8Array([r, g, b, a]);
});
/**
 * @typedef
 */
Define(a.Color4i(c, a), function () {
    Uint8Array([c, c, c, a]);
});
/**
 * @typedef
 */
Define(a.Color4i(r, g, b), function () {
    Uint8Array([r, g, b, 1.0]);
});
/**
 * @typedef
 */
Define(a.Color4i(c), function () {
    Uint8Array([c, c, c, c]);
});

/**
 * @typedef
 */
Define(a.Color3f(r, g, b), function () {
    Float32Array([r, g, b]);
});
/**
 * @typedef
 */
Define(a.Color3f(c), function () {
    Float32Array([c, c, c]);
});
/**
 * @typedef
 */
Define(a.Color3i(r, g, b), function () {
    Uint8Array([r, g, b]);
});
/**
 * @typedef
 */
Define(a.Color3i(c), function () {
    Uint8Array([c, c, c]);
});

/**
 * 4 component color class methods.
 */
Define(a.Color4.set(c2, c1), function () {
    c1.R = c2.R;
    c1.G = c2.G;
    c1.B = c2.B;
    c1.A = c2.A;
});

Define(a.Color4.val(v, c), function () {
    c.R = c.G = c.B = c.A = v;
});

Define(a.Color4.val(r, g, b, c), function () {
    c.R = r;
    c.G = g;
    c.B = b;
});

Define(a.Color4.val(r, g, b, a, c), function () {
    c.R = r;
    c.G = g;
    c.B = b;
    c.A = a;
});


/**
 * 3 components color class methods.
 */

Define(a.Color3.set(c2, c1), function () {
    c1.R = c2.R;
    c1.G = c2.G;
    c1.B = c2.B;
});

Define(a.Color3.val(v, c), function () {
    c.R = c.G = c.B = v;
});

Define(a.Color3.val(r, g, b, c), function () {
    c.R = r;
    c.G = g;
    c.B = b;
});

Define(DDS_MAGIC,0x20534444);
//  DDS_header.dwFlags
Define(DDSD_CAPS,0x00000001);
Define(DDSD_HEIGHT,0x00000002);
Define(DDSD_WIDTH,0x00000004);
Define(DDSD_PITCH,0x00000008);
Define(DDSD_PIXELFORMAT,0x00001000);
Define(DDSD_MIPMAPCOUNT,0x00020000);
Define(DDSD_LINEARSIZE,0x00080000);
Define(DDSD_DEPTH,0x00800000);

Define(DDS_HEADER_FLAGS_TEXTURE,DDSD_CAPS|DDSD_HEIGHT|DDSD_WIDTH|DDSD_PIXELFORMAT);
Define(DDS_HEADER_FLAGS_MIPMAP,DDSD_MIPMAPCOUNT);
Define(DDS_HEADER_FLAGS_VOLUME,DDSD_DEPTH);
Define(DDS_HEADER_FLAGS_PITCH,DDSD_PITCH);
Define(DDS_HEADER_FLAGS_LINEARSIZE,DDSD_LINEARSIZE);

//  DDS_header.ddspf.dwFlags
Define(DDPF_ALPHAPIXELS,0x00000001);
Define(DDPF_ALPHA,0x00000002);
Define(DDPF_FOURCC,0x00000004);
Define(DDPF_PALETTEINDEXED4,0x00000008);
Define(DDPF_PALETTEINDEXEDTO8,0x00000010);
Define(DDPF_PALETTEINDEXED8,0x00000020);
Define(DDPF_RGB,0x00000040);
Define(DDPF_COMPRESSED,0x00000080);
Define(DDPF_RGBTOYUV,0x00000100);
Define(DDPF_YUV,0x00000200);
Define(DDPF_ZBUFFER,0x00000400);
Define(DDPF_PALETTEINDEXED1,0x00000800);
Define(DDPF_PALETTEINDEXED2,0x00001000);
Define(DDPF_ZPIXELS,0x00002000);
Define(DDPF_STENCILBUFFER,0x00004000);
Define(DDPF_ALPHAPREMULT, 0x00008000);
Define(DDPF_LUMINANCE,0x00020000);
Define(DDPF_BUMPLUMINANCE,0x00040000);
Define(DDPF_BUMPDUDV,0x00080000);

//  DDS_header.dwCaps2
Define(DDSCAPS2_CUBEMAP,0x200);
Define(DDSCAPS2_CUBEMAP_POSITIVEX,0x400);
Define(DDSCAPS2_CUBEMAP_NEGATIVEX,0x800);
Define(DDSCAPS2_CUBEMAP_POSITIVEY,0x1000);
Define(DDSCAPS2_CUBEMAP_NEGATIVEY,0x2000);
Define(DDSCAPS2_CUBEMAP_POSITIVEZ,0x4000);
Define(DDSCAPS2_CUBEMAP_NEGATIVEZ,0x8000);
Define(DDSCAPS2_VOLUME,0x200000);

//DDS_header10.dwMiscFlag
Define(RESOURCE_MISC_GENERATE_MIPS, 					0x1);
Define(RESOURCE_MISC_SHARED,                            0x2);
Define(RESOURCE_MISC_TEXTURECUBE,                       0x4);
Define(RESOURCE_MISC_DRAWINDIRECT_ARGS,                 0x10);
Define(RESOURCE_MISC_BUFFER_ALLOW_RAW_VIEWS,            0x20);
Define(RESOURCE_MISC_BUFFER_STRUCTURED,                 0x40);
Define(RESOURCE_MISC_RESOURCE_CLAMP,                    0x80);
Define(RESOURCE_MISC_SHARED_KEYEDMUTEX,                 0x100);
Define(RESOURCE_MISC_GDI_COMPATIBLE,                    0x200);
Define(RESOURCE_MISC_SHARED_NTHANDLE,                   0x800);
Define(RESOURCE_MISC_RESTRICTED_CONTENT,                0x1000);
Define(RESOURCE_MISC_RESTRICT_SHARED_RESOURCE,          0x2000);
Define(RESOURCE_MISC_RESTRICT_SHARED_RESOURCE_DRIVER,   0x4000); 




Define(DDS_FOURCC,DDPF_FOURCC);
Define(DDS_RGB,DDPF_RGB);
Define(DDS_RGBA,DDPF_RGB|DDPF_ALPHAPIXELS);



//  DDS_header.ddspf.dwFourCC
Define(D3DFMT_DX10,0x30315844);
Define(D3DFMT_DXT1,0x31545844);
Define(D3DFMT_DXT2,0x32545844);
Define(D3DFMT_DXT3,0x33545844);
Define(D3DFMT_DXT4,0x34545844);
Define(D3DFMT_DXT5,0x35545844);
/**
 * Img Class
 * @ctor
 * Constructor of Img class
 **/

function Img(pEngine)
{
	Img.superclass.constructor.apply(this, arguments);
	Enum([			
            Volume=0,
			CubeMap,            
            MipMaps
         ], eImgFlags, a.Img);
	this._iFlags=0; //Что картинка содержит, анимацию, кубичесую текстуру, мип мапы и тд.
    this._pData=new Array(0); //Многомерный массив с частями картинки. Иерархия 1-анимация, 2-кубемап, 3-мипмап, 4-биты самой картинки	
    this._iWidth=0; //Ширина изображение
    this._iHeight=0; //Высота изображения
    this._eFormat=0; //Формат картинки
	Enum([			
            POSITIVEX=0,
			NEGATIVEX,	
			POSITIVEY,	
			NEGATIVEY,	
			POSITIVEZ,	
			NEGATIVEZ
         ], eImgCubeFlags, a.Img);
	this._iCubeFlags=0;
};

a.extend(Img, a.ResourcePoolItem);

Define(a.ImageManager(pEngine), function () {
    a.ResourcePool(pEngine, a.Img);
});
/**
 * Создание ресурса.
 * @treturn Boolean result
 */
Img.prototype.createResource = function () {
    // innitialize the resource (called once)
    debug_assert(!this.isResourceCreated(),
                 "The resource has already been created.");

    // signal that the resource is now created,
    // but has not been enabled
    this.notifyCreated();
    this.notifyDisabled();
    return (true);
};

/**
 * Уничтожение ресурса
 * @treturn Boolean result
 */
Img.prototype.destroyResource = function () {
    // destroy the resource
    //
    // we permit redundant calls to destroy, so there are no asserts here
    //
    if (this.isResourceCreated()) {
        // disable the resource
        this.disableResource();

        this.releaseImg();

        this.notifyUnloaded();
        this.notifyDestroyed();

        return (true);
    }

    return (false);
};


Img.prototype.releaseImg=function()
{
	this._iFlags=0;
    this._pData=null;
    this._iWidth=0;
    this._iHeight=0;
    this._eFormat=0; 
	this._iCubeFlags=0;
}


/**
 * Восстановить ресурс.
 * Prepare the resource for use (create any volatile memory objects needed).
 * @treturn Boolean result
 */
Img.prototype.restoreResource = function () {
    debug_assert(this.isResourceCreated(),
                 "The resource has not been created.");

    this.notifyRestored();
    return (true);
};

/**
 * Purge the resource from device-dependant memory.
 * @treturn Boolean result
 */
Img.prototype.disableResource = function () {
    debug_assert(this.isResourceCreated(),
                 "The resource has not been created.");

    this.notifyDisabled();
    return(true);
};

/**
 * Сохранить картинку
 * @tparam
 * @treturn Boolean Результат.
 */
 
// save the resource to a file (or NULL to use the resource name)
Img.prototype.saveResource = function (sFilename) {
    var pBaseTexture;
    var isOk;

    if (!sFilename) {
        var pString = this.findResourceName();

        if (pString) {
            sFilename = pString;
        }
    }

    pBaseTexture = this.getTexture();
    isOk = false;
    /*TODO: SaveTextureToFile(...)*/
    TODO('Texture::saveResource()');
    /*
     var isOk = a.SaveTextureToFile(filename,
     D3DXIFF_DDS,
     baseTexture,
     m_pPalette);*/
    return (isOk);
};


/**
 * Load the resource from a file.
 * @tpram sFilename Имя текстуры (или NULL, что бы использовать имя ресурса).
 * @treturn Boolean Результат.
 */
 





//Длинна блока в пикселях(getDivSize на getDivSize);
Img.prototype.getDivSize=function()
{
    if(this._eFormat==a.IFORMAT.RGB_DXT1||this._eFormat==a.IFORMAT.RGBA_DXT1
        ||this._eFormat==a.IFORMAT.RGBA_DXT2||this._eFormat==a.IFORMAT.RGBA_DXT3
        ||this._eFormat==a.IFORMAT.RGBA_DXT4||this._eFormat==a.IFORMAT.RGBA_DXT5)
    {
        return 4;
    }
    else
    {
        return 1;
    }
}


//Размер блока в байтах
Img.prototype.getBlockBytes=function()
{

    if(this._eFormat==a.IFORMAT.RGBA_DXT2||this._eFormat==a.IFORMAT.RGBA_DXT3
        ||this._eFormat==a.IFORMAT.RGBA_DXT4||this._eFormat==a.IFORMAT.RGBA_DXT5)
        {
        return 16;
    }
    if(this._eFormat==a.IFORMAT.RGB_DXT1||this._eFormat==a.IFORMAT.RGBA_DXT1)
    {
        return 8;
    }
    else if(this._eFormat==a.IFORMAT.RGBA8||this._eFormat==a.IFORMAT.BGRA8)
    {
        return 4;
    }
    else if(this._eFormat==a.IFORMAT.BGR8||this._eFormat==a.IFORMAT.RGB8)
    {
        return 3;
    }
    else if(this._eFormat==a.IFORMAT.RGBA4||this._eFormat==a.IFORMAT.BGRA4
        ||this._eFormat==a.IFORMAT.RGB5_A1||this._eFormat==a.IFORMAT.BGR5_A1
        ||this._eFormat==a.IFORMAT.RGB565||this._eFormat==a.IFORMAT.BGR565)
        {
        return 2;
    }
    else
    {
        return 0;
    }
}




Img.prototype.getWidth=function(iMipLevel)
{

	if(iMipLevel==undefined||iMipLevel ==0)
	{
    	return this._iWidth;
	}
	else
	{
		debug_assert(iMipLevel<this.getMipLevels(), "Запрашивается размер митмап которого нет");
		return this._iWidth/(1<<iMipLevel);
	}
}

Img.prototype.getHeight=function(iMipLevel)
{
	if(iMipLevel==undefined||iMipLevel==0)
	{
    	return this._iHeight;
	}
	else
	{
		debug_assert(iMipLevel<this.getMipLevels(), "Запрашивается размер митмапа которого нет");
		return this._iHeight/(1<<iMipLevel);
	}
}

Img.prototype.getMipLevels=function()
{

	if(TEST_BIT(this._iFlags,a.Img.MipMaps))
    {	
		if(TEST_BIT(this._iFlags,a.Img.CubeMap))
		{
			return this._pData[0][Math.lowestBitSet(this._iCubeFlags)].length;
		}
		else
		{
			return this._pData[0][0].length;
		}
	}
	return undefined;
}

Img.prototype.getCubeFlags=function()
{
	if(TEST_BIT(this._iFlags,a.Img.CubeMap))
	{
		return this._iCubeFlags;
	}
	return undefined;
}

Img.prototype.getVolumeLevels=function()
{
	if(TEST_BIT(this._iFlags,a.Img.Volume))
	{
		return  this._pData.length;
	}
	return undefined;
}

Img.prototype.getData = function (iMipLevel,eCubeFlag,iVolumeLevel)
{
    if(iMipLevel==undefined)
	{
		iMipLevel=0;
	}	
	if(this.getMipLevels()==undefined)
	{
		debug_assert(iMipLevel==0,"Запрашивается мипмап, которого нет");
	}
	else
	{
		debug_assert(iMipLevel<this.getMipLevels(),"Запрашивается мипмап, которого нет");
	}
	
	if(eCubeFlag==undefined)
	{
		eCubeFlag=0;		
	}
	if(TEST_BIT(this._iFlags,a.Img.CubeMap))
	{
		debug_assert(TEST_BIT(this._iCubeFlags,eCubeFlag),"Запрашивается часть кубической текстуры которой нет, которого нет");
	}
	else
	{
		debug_assert(eCubeFlag==0,"Запрашивается часть кубической текстуры которой нет, которого нет");
	}
	if(iVolumeLevel==undefined)
	{
		iVolumeLevel=0;
	}
	if(TEST_BIT(this._iFlags,a.Img.Volume))
	{		
		debug_assert(iVolumeLevel<this.getVolumeLevels(),"Запрашивается часть объемной картинки, которой нет");
	}
	else
	{
		debug_assert(iVolumeLevel==0,"Запрашивается часть объемной картинки, которой нет");
	}	
	
	return this._pData[iVolumeLevel][eCubeFlag][iMipLevel];
    
}

Img.prototype.isCompressed=function()
{
    if(this._eFormat==a.IFORMAT.RGB_DXT1||this._eFormat==a.IFORMAT.RGBA_DXT1
        ||this._eFormat==a.IFORMAT.RGBA_DXT2||this._eFormat==a.IFORMAT.RGBA_DXT3
        ||this._eFormat==a.IFORMAT.RGBA_DXT4||this._eFormat==a.IFORMAT.RGBA_DXT5)
        {
        return true;
    }
    else
    {
        return false;
    }

}

Img.prototype.isAlpha=function()
{
    if(this._eFormat==a.IFORMAT.RGBA_DXT1||this._eFormat==a.IFORMAT.RGBA_DXT2
        ||this._eFormat==a.IFORMAT.RGBA_DXT3
        ||this._eFormat==a.IFORMAT.RGBA_DXT4||this._eFormat==a.IFORMAT.RGBA_DXT5
        ||this._eFormat==a.IFORMAT.RGBA8||this._eFormat==a.IFORMAT.BGRA8
        ||this._eFormat==a.IFORMAT.RGBA4||this._eFormat==a.IFORMAT.BGRA4
        ||this._eFormat==a.IFORMAT.RGB5_A1||this._eFormat==a.IFORMAT.BGR5_A1)
        {
        return true;
    }
    else
    {
        return false;
    }
}

Img.prototype.getFormat=function()
{
    return this._eFormat;
}


Img.prototype.getFormatShort=function()
{
    if(this._eFormat==a.IFORMAT.RGBA_DXT2||this._eFormat==a.IFORMAT.RGBA_DXT3
        ||this._eFormat==a.IFORMAT.RGBA_DXT4||this._eFormat==a.IFORMAT.RGBA_DXT5
        ||this._eFormat==a.IFORMAT.RGB_DXT1||this._eFormat==a.IFORMAT.RGBA_DXT1)
        {
        return this._eFormat;
    }
    else if(this._eFormat==a.IFORMAT.RGBA8||this._eFormat==a.IFORMAT.BGRA8
        ||this._eFormat==a.IFORMAT.RGBA4||this._eFormat==a.IFORMAT.BGRA4
        ||this._eFormat==a.IFORMAT.RGB5_A1||this._eFormat==a.IFORMAT.BGR5_A1)
        {
        return a.IFORMATSHORT.RGBA;
    }
    else if(this._eFormat==a.IFORMAT.BGR8||this._eFormat==a.IFORMAT.RGB8
        ||this._eFormat==a.IFORMAT.RGB565||this._eFormat==a.IFORMAT.BGR565)
        {
        return a.IFORMATSHORT.RGB;
    }
    else
    {
        return null;
    }
}


Img.prototype.getType=function()
{
    if(this._eFormat==a.IFORMAT.RGB_DXT1||this._eFormat==a.IFORMAT.RGBA_DXT1
        ||this._eFormat==a.IFORMAT.RGBA_DXT2||this._eFormat==a.IFORMAT.RGBA_DXT3
        ||this._eFormat==a.IFORMAT.RGBA_DXT4||this._eFormat==a.IFORMAT.RGBA_DXT5)
        {
        return null;
    }
    else if(this._eFormat==a.IFORMAT.BGR8||this._eFormat==a.IFORMAT.RGB8
        ||this._eFormat==a.IFORMAT.RGBA8||this._eFormat==a.IFORMAT.BGRA8)
        {
        return a.ITYPE.UNSIGNED_BYTE;
    }
    else if(this._eFormat==a.IFORMAT.RGBA4||this._eFormat==a.IFORMAT.BGRA4)
    {
        return a.ITYPE.UNSIGNED_SHORT_4_4_4_4;
    }
    else if(this._eFormat==a.IFORMAT.RGB5_A1||this._eFormat==a.IFORMAT.BGR5_A1)
    {
        return a.ITYPE.UNSIGNED_SHORT_5_5_5_1;
    }
    else if(this._eFormat==a.IFORMAT.RGB565||this._eFormat==a.IFORMAT.BGR565)
    {
        return a.ITYPE.UNSIGNED_SHORT_5_6_5;
    }
    else
    {

        return null;
    }
}

/**
 * @property create(Int iWidth,Int iHeight,Int iMipLevels,Enumeration eFormat)
 * Создание пустой картинки
 * @memberof Img
 * @param iWidth ширина
 * @param iHeight высота
 * @param iMipLevels количество мип мапов
 * @param eFormat формат
 **/

Img.prototype.create=function(iWidth,iHeight,eFormat,iFlags,nVolume)
{
    var pBuffer;
	var nTemp=0;
    this._eFormat=eFormat;
    this._iWidth=Math.ceil(iWidth/this.getDivSize())*this.getDivSize();
    this._iHeight=Math.ceil(iHeight/this.getDivSize())*this.getDivSize();
	
	this._pData=null;
	
	//Заполняем динамическую часть
	nTemp=1;
	if(TEST_BIT(iFlags,a.Img.Volume)&&nVolume>0&&nVolume!=undefined)
	{
		SET_BIT(this._iFlags,a.Img.Volume);
		nTemp=nVolume;		
	}	
	this._pData=new Array(nTemp);
	
	//Запоняем кубическую часть
	nTemp=1;
	if(TEST_BIT(iFlags,a.Img.CubeMap))
	{
		SET_BIT(this._iFlags,a.Img.CubeMap);
		nTemp=6;
	}	
	for(var i=0;i<this._pData.length;i++)
	{
		this._pData[i]=new Array(nTemp);
	}
	
    //Заполняем мипмапы
	nTemp=1;
	if(TEST_BIT(iFlags,a.Img.MipMaps))
	{
		SET_BIT(this._iFlags,a.Img.MipMaps);
		nTemp=Math.ceil(Math.max(Math.log(this._iWidth)/Math.LN2,Math.log(this._iHeight)/Math.LN2))+1;
	}	
	
	for(var i=0;i<this._pData.length;i++)
	{
		for(var k=0; k<this._pData[i].length;k++)
		{
			this._pData[i][k]=new Array(nTemp);
		}
	}	
	
    //и вот наконец сами данные
	for(var i=0;i<this._pData.length;i++)
	{
		for(var k=0; k<this._pData[i].length;k++)
		{
			for(var l=0;l<this._pData[i][k].length;l++)
			{
				this._pData[i][k][l]=new ArrayBuffer((Math.ceil(iWidth/this.getDivSize())*Math.ceil(iHeight/this.getDivSize())*this.getBlockBytes())>>>(l*2));
			}
		}
	};
 
	this.notifyLoaded();
    return true;
}


Img.prototype.loadResource = function (sFileName) 
{

    if (!sFileName) {
        var sResourceName = this.findResourceName();
        if (sResourceName) {
            sFileName = sResourceName;
        }
    }   
    var me = this;
    this.load(sFileName,
                      function () 
					  {                          
                          me.notifyLoaded();
                      }
    );
};



/**
 * @property load(String sFileName, Function fnCallback)
 * Загрузка картинки по указанному пути
 * @memberof Img
 * @param sFileName путь, откуда будет грузиться картинка
 * @param fnCallback функция которая вызовется после успешной загрузки
 **/
Img.prototype.load=function(sFileName, fnCallBack)
{
	
    var me = this;
	var nMipMap=1; //количество мипмапов
	var nCubeMap=1;    //количесвто картинок образующих кубе ма
	var nVolume=1;

	
    a.fopen(sFileName, 'rb').onread = function(pData)
    {

        var iOffset=0;
        var isOk=false;
        var pData8 =new Uint8Array(pData);
        var pDataTemp;
		me._iFlags=0;
		
        //Определение типа формата и умеем ли мы его разбирать		
        var dwMagic =(new Uint32Array(pData,0,1))[0];
        if(dwMagic==DDS_MAGIC) //DDS
        {
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
            var pDDSHeader=new Uint32Array(pData,4,31);
            var header={};
            header.dwSize=pDDSHeader[0];
            header.dwFlags=pDDSHeader[1];
            header.dwHeight=pDDSHeader[2];
            header.dwWidth=pDDSHeader[3];
            header.dwPitchOrLinearSize=pDDSHeader[4];
            header.dwDepth=pDDSHeader[5];
            header.dwMipMapCount=pDDSHeader[6];
            header.dwReserved1=[];
            header.dwReserved1[0]=pDDSHeader[7];
            header.dwReserved1[1]=pDDSHeader[8];
            header.dwReserved1[2]=pDDSHeader[9];
            header.dwReserved1[3]=pDDSHeader[10];
            header.dwReserved1[4]=pDDSHeader[11];
            header.dwReserved1[5]=pDDSHeader[12];
            header.dwReserved1[6]=pDDSHeader[13];
            header.dwReserved1[7]=pDDSHeader[14];
            header.dwReserved1[8]=pDDSHeader[15];
            header.dwReserved1[9]=pDDSHeader[16];
            header.dwReserved1[10]=pDDSHeader[17];
            //Считываем DDS_PIXELFORMAT внутри dds header
            //DDS_PIXELFORMAT ddspf;
            header.ddspf={};
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
            header.ddspf.dwSize=pDDSHeader[18];
            header.ddspf.dwFlags=pDDSHeader[19];
            header.ddspf.dwFourCC=pDDSHeader[20];
            header.ddspf.dwRGBBitCount=pDDSHeader[21];
            header.ddspf.dwRBitMask=pDDSHeader[22];
            header.ddspf.dwGBitMask=pDDSHeader[23];
            header.ddspf.dwBBitMask=pDDSHeader[24];
            header.ddspf.dwABitMask=pDDSHeader[25];
            header.dwCaps=pDDSHeader[26];						
            header.dwCaps2=pDDSHeader[27];
			header.dwCaps3=pDDSHeader[28];
            header.dwCaps4=pDDSHeader[29];
            header.dwReserved2=pDDSHeader[30];
			iOffset+=128;
			
            if(header.dwSize!=124)
                debug_error("Размер заголовка DDS всегда должэен равняться 124");
            if(!(header.dwFlags&DDSD_CAPS))
                debug_error("Флаг DDSD_CAPS в заголовке DDS всегда должен быть");
            if(!(header.dwFlags&DDSD_HEIGHT))
                debug_error("Флаг DDSD_HEIGHT в заголовке DDS всегда должен быть");
            if(!(header.dwFlags&DDSD_WIDTH))
                debug_error("Флаг DDSD_WIDTH в заголовке DDS всегда должен быть");
            if(!(header.dwFlags&DDSD_PIXELFORMAT))
                debug_error("Флаг DDSD_PIXELFORMAT в заголовке DDS всегда должен быть");
            me._iWidth=header.dwWidth;
            me._iHeight=header.dwHeight;

            //console.log("Количесвто мип мапов по файлу(удалить):"+header.dwMipMapCount);
			
			if(header.dwFlags&DDSD_MIPMAPCOUNT)
			{
				SET_BIT(me._iFlags,a.Img.MipMaps);
				nMipMap=header.dwMipMapCount;
			}
			else
			{
				nMipMap=1;
			}
        
            //console.log("Количесвто мип мапов(удалить):"+nMipMap);
			if(TEST_BIT(me._iFlags,a.Img.MipMaps)&&((me._iWidth>>>(nMipMap-1))!=1||(me._iHeight>>>(nMipMap-1))!=1))
			{
				warning("Количество мипмапов не такое чтобы уменьшить размер картинки до 1x1"
					+nMipMap+","+me._iWidth+"x"+me._iHeight+")");
				
			}           

            if(header.ddspf.dwSize!=0x20)
            {
                debug_error("Размер DDS_PIXELFORMAT всегда должен равняться 32")
            }

            if(header.ddspf.dwFlags&DDPF_FOURCC)
            {
                if(header.ddspf.dwFourCC==D3DFMT_DXT1)
                {
                    me._eFormat=a.IFORMAT.RGBA_DXT1;
                }
                else if(header.ddspf.dwFourCC==D3DFMT_DXT2)
                {
                    me._eFormat=a.IFORMAT.RGBA_DXT2;
                }
                else if(header.ddspf.dwFourCC==D3DFMT_DXT3)
                {
                    me._eFormat=a.IFORMAT.RGBA_DXT3;
                }
                else if(header.ddspf.dwFourCC==D3DFMT_DXT4)
                {
                    me._eFormat=a.IFORMAT.RGBA_DXT4;
                }
                else if(header.ddspf.dwFourCC==D3DFMT_DXT5)
                {
                    me._eFormat=a.IFORMAT.RGBA_DXT5;
                }
                else if(header.ddspf.dwFourCC==D3DFMT_DX10)
                {
                    var pDDS10Header=new Uint32Array(pData,128,5);
					var header10={};
					header10.dxgiFormat=pDDS10Header[0];
					header10.resourceDimension=pDDS10Header[1];
					header10.miscFlag=pDDS10Header[2];
					header10.arraySize=pDDS10Header[3];
					header10.reserved=pDDS10Header[4];
					
					debug_error("Формат D3DFMT_DX10 не поддерживается");
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
					iOffset+=20;
                }
                else
                {
                    debug_error("Флаг DDPF_FOURCC стоит, а подходящего dwFourCC нет");
                }
            }
            
			
			if(header.ddspf.dwFlags&DDPF_RGB)
            {
				if(me._eFormat==a.IFORMAT.RGBA_DXT1||me._eFormat==a.IFORMAT.RGBA_DXT2||
					me._eFormat==a.IFORMAT.RGBA_DXT3||me._eFormat==a.IFORMAT.RGBA_DXT4||
					me._eFormat==a.IFORMAT.RGBA_DXT5)
				{
					debug_error("Флаг DDPF_RGB стоит при сжатом формате картинки");
				}
				
                if(header.ddspf.dwFlags&DDPF_ALPHAPIXELS)
                {
                    if(header.ddspf.dwRGBBitCount==32&&header.ddspf.dwRBitMask==0x00ff0000&&
                        header.ddspf.dwGBitMask==0x0000ff00&&header.ddspf.dwBBitMask==0x000000ff&&
                        header.ddspf.dwABitMask==0xff000000) //DDSPF_A8R8G8B8
                        {
                        me._eFormat=a.IFORMAT.BGRA8;
                    }
                    else if(header.ddspf.dwRGBBitCount==16&&header.ddspf.dwRBitMask==0x00007c00&&
                        header.ddspf.dwGBitMask==0x000003e0&&header.ddspf.dwBBitMask==0x0000001f&&
                        header.ddspf.dwABitMask==0x00008000) //DDSPF_A1R5G5B5
                        {
                        me._eFormat=a.IFORMAT.BGR5_A1;
                    }
                    else if(header.ddspf.dwRGBBitCount==16&&header.ddspf.dwRBitMask==0x00000f00&&
                        header.ddspf.dwGBitMask==0x000000f0&&header.ddspf.dwBBitMask==0x0000000f&&
                        header.ddspf.dwABitMask==0x0000f000) //DDSPF_A4R4G4B4
                        {
                        me._eFormat=a.IFORMAT.BGRA4;
                    }
					else if(header.ddspf.dwRGBBitCount==32&&header.ddspf.dwRBitMask==0x000000ff&&
                        header.ddspf.dwGBitMask==0x0000ff00&&header.ddspf.dwBBitMask==0x00ff0000&&
                        header.ddspf.dwABitMask==0xff000000) //DDSPF_A8R8G8B8
                        {
                        me._eFormat=a.IFORMAT.RGBA8;
                    }
                    else
                    {
                        debug_error("Флаг DDS_RGBA стоит, а подходящего формата не найдено");
                    }
                }
                else
                {
                    if(header.ddspf.dwRGBBitCount==24&&header.ddspf.dwRBitMask==0x00ff0000&&
                        header.ddspf.dwGBitMask==0x0000ff00&&header.ddspf.dwBBitMask==0x000000ff&&
                        header.ddspf.dwABitMask==0x00000000) //DDSPF_R8G8B8
                        {
                        me._eFormat=a.IFORMAT.BGR8;
                    }
                    else if(header.ddspf.dwRGBBitCount==16&&header.ddspf.dwRBitMask==0x0000f800&&
                        header.ddspf.dwGBitMask==0x000007e0&&header.ddspf.dwBBitMask==0x0000001f&&
                        header.ddspf.dwABitMask==0x00000000) //DDSPF_R5G6B5
                        {
                        me._eFormat=a.IFORMAT.BGR565;
                    }
                    else
                    {
                        debug_error("Флаг DDS_RGB стоит, а подходящего формата не найдено");
                    }
                }
            }
			
			if((!header.ddspf.dwFlags&DDPF_RGB)&&(!header.ddspf.dwFlags&DDPF_FOURCC))
            {
                debug_error("Флаги DDPF_RGB или DDPF_FOURCC не выставлены, остальные являются устаревшими");
            }
			
			nCubeMap=1;
			me._iCubeFlags=0;
			if(header.dwCaps2&DDSCAPS2_CUBEMAP)
			{
				nCubeMap=0;
				SET_BIT(me._iFlags,a.Img.CubeMap);
				if(header.dwCaps2&DDSCAPS2_CUBEMAP_POSITIVEX)
				{
					nCubeMap++;
					SET_BIT(me._iCubeFlags,a.Img.POSITIVEX);
				}
				if(header.dwCaps2&DDSCAPS2_CUBEMAP_NEGATIVEX)
				{
					nCubeMap++;
					SET_BIT(me._iCubeFlags,a.Img.NEGATIVEX);
				}
				if(header.dwCaps2&DDSCAPS2_CUBEMAP_POSITIVEY)
				{
					nCubeMap++;
					SET_BIT(me._iCubeFlags,a.Img.POSITIVEY);
				}
				if(header.dwCaps2&DDSCAPS2_CUBEMAP_NEGATIVEY)
				{
					nCubeMap++;
					SET_BIT(me._iCubeFlags,a.Img.NEGATIVEY);
				}
				if(header.dwCaps2&DDSCAPS2_CUBEMAP_POSITIVEZ)
				{
					nCubeMap++;
					SET_BIT(me._iCubeFlags,a.Img.POSITIVEZ);
				}
				if(header.dwCaps2&DDSCAPS2_CUBEMAP_NEGATIVEZ)
				{
					nCubeMap++;
					SET_BIT(me._iCubeFlags,a.Img.NEGATIVEZ);
				}
				debug_assert(nCubeMap!=0,
                 "Выставлен фдлаг с кубической текстурой, а самих текстур нету");
			}							
			
            isOk=true;
        }
        else
        {
            trace(sFileName);
            debug_error("Данный тип графического файла не поддерживается("+dwMagic+")");
            isOk=false;
        }
        //console.log("Формат картинки(удалить) "+me._eFormat);

		
		
  
        if(me.isCompressed())
        {
			if(!header.dwFlags&DDS_HEADER_FLAGS_LINEARSIZE)
            {
                debug_error("У сжатой текстуры не выставлен флаг DDS_HEADER_FLAGS_LINEARSIZE в заголовке");
            }
		}
		
		var iX=me._iWidth;
		var iY=me._iHeight;
		var iSizeData=(Math.ceil(iX/me.getDivSize())*Math.ceil(iY/me.getDivSize()))*me.getBlockBytes();

		if(iSizeData!=header.dwPitchOrLinearSize)
		{
			warning("Несовпадают размеры картинки вычисленный и в файле("+iSizeData+","+header.dwPitchOrLinearSize+")");
		}
		if(!header.dwFlags&DDS_HEADER_FLAGS_LINEARSIZE)
		{
			debug_error("У сжатой текстуры не выставлен флаг DDS_HEADER_FLAGS_LINEARSIZE в заголовке");
		}
		
		if(TEST_BIT(me._iFlags,a.Img.CubeMap))
		{
			me._pData=new Array(nVolume);
			for(k=0;k<nVolume;k++)
			{
				me._pData[k]=new Array(6);
				for(l=0;l<6;l++)
				{
					if(TEST_BIT(me._iCubeFlags,a.Img.POSITIVEX+l))
					{
						me._pData[k][l]=new Array(nMipMap);
					}
				}
			}
		
			for(k=0;k<nVolume;k++)
			{		
				//console.log("Уровень",k);
				
				for(l=0;l<6;l++)
				{
					if(TEST_BIT(me._iCubeFlags,a.Img.POSITIVEX+l))
					{
						//console.log("Куб",l);
						iX=me._iWidth;
						iY=me._iHeight;
						iSizeData=(Math.ceil(iX/me.getDivSize())*Math.ceil(iY/me.getDivSize()))*me.getBlockBytes();    
					
						for(var b=0;b<nMipMap;b++)
						{
							//console.log("МипМап",b);
							me._pData[k][l][b]=new ArrayBuffer(iSizeData);
							pDataTemp=new Uint8Array(me._pData[k][l][b]);
							for(var a=0;a<iSizeData;a++)
							{
								pDataTemp[a]=pData8[a+iOffset];
							}
							
							
							iOffset+=iSizeData;
							iX=Math.ceil(iX/2);
							iY=Math.ceil(iY/2);
							iSizeData=Math.ceil((iX*iY)/(me.getDivSize()*me.getDivSize()))*me.getBlockBytes();
						}
					}
				}
					
			}
        }  
		else
		{
			me._pData=new Array(nVolume);
			for(k=0;k<nVolume;k++)
			{
				me._pData[k]=new Array(6);
				
				me._pData[k][0]=new Array(nMipMap);
				
			}
		
			for(k=0;k<nVolume;k++)
			{		
				//console.log("Уровень",k);				
				//console.log("Картинка",0);
				iX=me._iWidth;
				iY=me._iHeight;
				iSizeData=(Math.ceil(iX/me.getDivSize())*Math.ceil(iY/me.getDivSize()))*me.getBlockBytes();    
			
				for(var b=0;b<nMipMap;b++)
				{
					//console.log("МипМап",b);
					me._pData[k][0][b]=new ArrayBuffer(iSizeData);
					pDataTemp=new Uint8Array(me._pData[k][0][b]);
					for(var a=0;a<iSizeData;a++)
					{
						pDataTemp[a]=pData8[a+iOffset];
					}
					
					
					iOffset+=iSizeData;
					iX=Math.ceil(iX/2);
					iY=Math.ceil(iY/2);
					iSizeData=Math.ceil((iX*iY)/(me.getDivSize()*me.getDivSize()))*me.getBlockBytes();
				}					
			}
		}
		//console.log("Результат: Общая длинна",iOffset,"iFlags", me._iFlags, "iCubeFlags",me._iCubeFlags);
       

        if(fnCallBack)
        {
            fnCallBack(isOk);
        }
    };
};


Img.prototype.getPixelRGBA=function(iX,iY,pPixel,iMipLevel,eCubeFlag,iVolumeLevel)
{
	if(iMipLevel==undefined)
	{
		iMipLevel=0;
	}
	else
	{
		debug_assert(TEST_BIT(this._iFlags,a.Img.MipMaps),"Запрашиваются мипмапы, а их нет");
		debug_assert(iMipLevel<this.getMipMapLevels(),"Запрашивается мипмап, которого нет");
	}
	
	if(eCubeFlag==undefined)
	{
		debug_assert(!TEST_BIT(this._iFlags,a.Img.CubeMap),"Не выставлена часть кубической картинки");
		eCubeFlag=0;		
	}
	else
	{
		debug_assert(TEST_BIT(this._iFlags,a.Img.CubeMap),"Выставлена часть кубической куртинки, хотя картинка не является кубической");
		debug_assert(TEST_BIT(this._iCubeFlags,eCubeFlag),"Запрашивается часть кубической текстуры которой нет, которого нет");
	}
	
	if(iVolumeLevel==undefined)
	{
		iVolumeLevel=0;
	}
	else
	{
		debug_assert(TEST_BIT(this._iFlags,a.Img.Volume),"Запрашивается часть объемной картинки, а картинка не объемная");
		debug_assert(iVolumeLevel<this.getVolumeLevels(),"Запрашивается часть объемной картинки, которой нет");
	}
	
	return this._getPixelRGBA(iX,iY,pPixel,iMipLevel,eCubeFlag,iVolumeLevel);
}

/**
 * @property getPixelRGBA(Int iX,Int iY,Uint8Array(4) pPixel)
 * Получить пиксель в формате RGBA
 * @memberof Img
 * @param iX иксовая коорлината пикселя
 * @param iY игриковая коорлината пикселя
 * @param pPixel массив куда положить цвета пикселя
 * @return Uint8Array(4) тот же массив с цветами пикселя
 **/
Img.prototype._getPixelRGBA=function(iX,iY,pPixel,iMipLevel,eCubeFlag,iVolumeLevel)
{
	var iOffset;
    var pColor;
    var iOffset;
    if(this._eFormat==a.IFORMAT.BGRA8)
    {
        iOffset=(iY*this.getWidth(iMipLevel)+iX)*this.getBlockBytes();
        pColor=(new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1))[0];
        //pPixel[0]=this._pData[0][iOffset+2];
        pPixel[0]=(pColor&0x00FF0000)>>>16;
        //pPixel[1]=this._pData[0][iOffset+1];
        pPixel[1]=(pColor&0x0000FF00)>>>8;
        //pPixel[2]=this._pData[0][iOffset+0];
        pPixel[2]=(pColor&0x000000FF);
        //pPixel[3]=this._pData[0][iOffset+3];
        pPixel[3]=(pColor&0xFF000000)>>>24;
    }
    else if(this._eFormat==a.IFORMAT.RGBA8)
    {
        iOffset=(iY*this.getWidth(iMipLevel)+iX)*this.getBlockBytes();
        pColor=(new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1))[0];

        pPixel[0]=(pColor&0x000000FF);
        pPixel[1]=(pColor&0x0000FF00)>>>8;
        pPixel[2]=(pColor&0x00FF0000)>>>16;
        pPixel[3]=(pColor&0xFF000000)>>>24;
    }
    else if(this._eFormat==a.IFORMAT.BGR5_A1)
    {
        iOffset=(iY*this.getWidth(iMipLevel)+iX)*this.getBlockBytes();
        pColor=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1))[0];
        pPixel[0]=((pColor&0x7c00)>>>10)*7;
        //pPixel[1]=this._pData[0][iOffset+1];
        pPixel[1]=((pColor&0x03e0)>>>5)*7;
        //pPixel[2]=this._pData[0][iOffset+0];
        pPixel[2]=(pColor&0x001f)*7;
        //pPixel[3]=this._pData[0][iOffset+3];
        pPixel[3]=((pColor&0x8000)>>>15)*255;
    }
    else if(this._eFormat==a.IFORMAT.RGB5_A1)
    {
        iOffset=(iY*this.getWidth(iMipLevel)+iX)*this.getBlockBytes();
        pColor=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1))[0];

        pPixel[0]=(pColor&0x001f)*7;
        //pPixel[1]=this._pData[0][iOffset+1];
        pPixel[1]=((pColor&0x03e0)>>>5)*7;
        //pPixel[2]=this._pData[0][iOffset+0];
        pPixel[2]=((pColor&0x7c00)>>>10)*7;
        //pPixel[3]=this._pData[0][iOffset+3];
        pPixel[3]=((pColor&0x8000)>>>15)*255;
    }
    else if(this._eFormat==a.IFORMAT.BGRA4)
    {
        iOffset=(iY*this.getWidth(iMipLevel)+iX)*this.getBlockBytes();
        pColor=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1))[0];
        //pPixel[0]=this._pData[0][iOffset+2];
        pPixel[0]=((pColor&0x0F00)>>>8)*15;
        //pPixel[1]=this._pData[0][iOffset+1];
        pPixel[1]=((pColor&0x00F0)>>>4)*15;
        //pPixel[2]=this._pData[0][iOffset+0];
        pPixel[2]=((pColor&0x000F))*15;
        //pPixel[3]=this._pData[0][iOffset+3];
        pPixel[3]=((pColor&0xF000)>>>12)*15;
    }
    else if(this._eFormat==a.IFORMAT.RGBA4)
    {
        iOffset=(iY*this.getWidth(iMipLevel)+iX)*this.getBlockBytes();
        pColor=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1))[0];

        pPixel[0]=((pColor&0x000F))*15;
        pPixel[1]=((pColor&0x00F0)>>>4)*15;
        pPixel[2]=((pColor&0x0F00)>>>8)*15;
        pPixel[3]=((pColor&0xF000)>>>12)*15;
    }
    else if(this._eFormat==a.IFORMAT.BGR8)
    {
        iOffset=(iY*this.getWidth(iMipLevel)+iX)*this.getBlockBytes();
        pColor=(new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,3));
        pPixel[0]=pColor[2];
        pPixel[1]=pColor[1];
        pPixel[2]=pColor[0];
        pPixel[3]=255;
    }
    else if(this._eFormat==a.IFORMAT.BGR8)
    {
        iOffset=(iY*this.getWidth(iMipLevel)+iX)*this.getBlockBytes();
        pColor=(new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,3));
        pPixel[0]=pColor[0];
        pPixel[1]=pColor[1];
        pPixel[2]=pColor[2];
        pPixel[3]=255;
    }
    else if(this._eFormat==a.IFORMAT.BGR565)
    {
        iOffset=(iY*this.getWidth(iMipLevel)+iX)*this.getBlockBytes();
        pColor=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1))[0];
        pPixel[0]=((pColor&0xf800)>>>11)*7;
        pPixel[1]=((pColor&0x07e0)>>>5)*3;
        pPixel[2]=((pColor&0x001f))*7;
        pPixel[3]=255;
    }
    else if(this._eFormat==a.IFORMAT.RGB565)
    {
        iOffset=(iY*this.getWidth(iMipLevel)+iX)*this.getBlockBytes();
        pColor=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1))[0];
        pPixel[0]=((pColor&0x001f))*7;
        pPixel[1]=((pColor&0x07e0)>>>5)*3;
        pPixel[2]=((pColor&0xf800)>>>11)*7;
        pPixel[3]=255;
    }
    else if(this._eFormat==a.IFORMAT.RGBA_DXT1)
    {
        iOffset=(Math.ceil(this.getWidth(iMipLevel)/this.getDivSize())*Math.floor(iY/this.getDivSize())+Math.floor(iX/this.getDivSize()))*this.getBlockBytes();


        var pColor0=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1))[0];

        var pColor1=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+2,1))[0];

        pColor=(new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+4,1))[0];

        var iX0=iX%this.getDivSize();
        var iY0=iY%this.getDivSize();

        var iCode=(pColor>>>(2*(this.getDivSize()*iY0+iX0)))&3;

        //console.log(iCode,pColor,(2*(this.getDivSize()*iY0+iX0)));
        if(pColor0>pColor1)
        {
            if(iCode==0)
            {
                pPixel[0]=((pColor0&0xf800)>>>11)*8;
                pPixel[1]=((pColor0&0x07e0)>>>5)*4;
                pPixel[2]=((pColor0&0x001f))*8;
                pPixel[3]=255;
            }
            else if(iCode==1)
            {
                pPixel[0]=((pColor1&0xf800)>>>11)*8;
                pPixel[1]=((pColor1&0x07e0)>>>5)*4;
                pPixel[2]=((pColor1&0x001f))*8;
                pPixel[3]=255;
            }
            else if(iCode==2)
            {
                pPixel[0]=((2*(pColor0&0xf800)>>>11)*8+((pColor1&0xf800)>>>11)*8)/3;
                pPixel[1]=((2*(pColor0&0x07e0)>>>5)*4+((pColor1&0x07e0)>>>5)*4)/3;
                pPixel[2]=((2*(pColor0&0x001f))*8+((pColor1&0x001f))*8)/3;
                pPixel[3]=255;
            }
            else if(iCode==3)
            {
                pPixel[0]=((2*(pColor1&0xf800)>>>11)*8+((pColor0&0xf800)>>>11)*8)/3;
                pPixel[1]=((2*(pColor1&0x07e0)>>>5)*4+((pColor0&0x07e0)>>>5)*4)/3;
                pPixel[2]=((2*(pColor1&0x001f))*8+((pColor0&0x001f))*8)/3;
                pPixel[3]=255;
            }
        }
        else
        {
            if(iCode==0)
            {
                pPixel[0]=((pColor0&0xf800)>>>11)*8;
                pPixel[1]=((pColor0&0x07e0)>>>5)*4;
                pPixel[2]=((pColor0&0x001f))*8;
                pPixel[3]=255;
            }
            else if(iCode==1)
            {
                pPixel[0]=((pColor1&0xf800)>>>11)*8;
                pPixel[1]=((pColor1&0x07e0)>>>5)*4;
                pPixel[2]=((pColor1&0x001f))*8;
                pPixel[3]=255;
            }
            else if(iCode==2)
            {
                pPixel[0]=(((pColor0&0xf800)>>>11)*8+((pColor1&0xf800)>>>11)*8)/2;
                pPixel[1]=(((pColor0&0x07e0)>>>5)*4+((pColor1&0x07e0)>>>5)*4)/2;
                pPixel[2]=(((pColor0&0x001f))*8+((pColor1&0x001f))*8)/2;
                pPixel[3]=255;
            }
            else if(iCode==3)
            {
                pPixel[0]=0;
                pPixel[1]=0;
                pPixel[2]=0;
                pPixel[3]=0;
            }
        }

    }
    else if(this._eFormat==a.IFORMAT.RGB_DXT1)
    {
        iOffset=(Math.ceil(this.getWidth((iMipLevel))/this.getDivSize())*Math.floor(iY/this.getDivSize())+Math.floor(iX/this.getDivSize()))*this.getBlockBytes();


        var pColor0=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1))[0];

        var pColor1=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+2,1))[0];

        pColor=(new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+4,1))[0];

        var iX0=iX%this.getDivSize();
        var iY0=iY%this.getDivSize();

        var iCode=(pColor>>>(2*(this.getDivSize()*iY0+iX0)))&3;

        //console.log(iCode,pColor,(2*(this.getDivSize()*iY0+iX0)));
        if(pColor0>pColor1)
        {
            if(iCode==0)
            {
                pPixel[0]=((pColor0&0xf800)>>>11)*8;
                pPixel[1]=((pColor0&0x07e0)>>>5)*4;
                pPixel[2]=((pColor0&0x001f))*8;
                pPixel[3]=255;
            }
            else if(iCode==1)
            {
                pPixel[0]=((pColor1&0xf800)>>>11)*8;
                pPixel[1]=((pColor1&0x07e0)>>>5)*4;
                pPixel[2]=((pColor1&0x001f))*8;
                pPixel[3]=255;
            }
            else if(iCode==2)
            {
                pPixel[0]=((2*(pColor0&0xf800)>>>11)*8+((pColor1&0xf800)>>>11)*8)/3;
                pPixel[1]=((2*(pColor0&0x07e0)>>>5)*4+((pColor1&0x07e0)>>>5)*4)/3;
                pPixel[2]=((2*(pColor0&0x001f))*8+((pColor1&0x001f))*8)/3;
                pPixel[3]=255;
            }
            else if(iCode==3)
            {
                pPixel[0]=((2*(pColor1&0xf800)>>>11)*8+((pColor0&0xf800)>>>11)*8)/3;
                pPixel[1]=((2*(pColor1&0x07e0)>>>5)*4+((pColor0&0x07e0)>>>5)*4)/3;
                pPixel[2]=((2*(pColor1&0x001f))*8+((pColor0&0x001f))*8)/3;
                pPixel[3]=255;
            }
        }
        else
        {
            if(iCode==0)
            {
                pPixel[0]=((pColor0&0xf800)>>>11)*8;
                pPixel[1]=((pColor0&0x07e0)>>>5)*4;
                pPixel[2]=((pColor0&0x001f))*8;
                pPixel[3]=255;
            }
            else if(iCode==1)
            {
                pPixel[0]=((pColor1&0xf800)>>>11)*8;
                pPixel[1]=((pColor1&0x07e0)>>>5)*4;
                pPixel[2]=((pColor1&0x001f))*8;
                pPixel[3]=255;
            }
            else if(iCode==2)
            {
                pPixel[0]=(((pColor0&0xf800)>>>11)*8+((pColor1&0xf800)>>>11)*8)/2;
                pPixel[1]=(((pColor0&0x07e0)>>>5)*4+((pColor1&0x07e0)>>>5)*4)/2;
                pPixel[2]=(((pColor0&0x001f))*8+((pColor1&0x001f))*8)/2;
                pPixel[3]=255;
            }
            else if(iCode==3)
            {
                pPixel[0]=0;
                pPixel[1]=0;
                pPixel[2]=0;
                pPixel[3]=255;
            }
        }

    }
    else if(this._eFormat==a.IFORMAT.RGBA_DXT2)
    {
        iOffset=(Math.ceil(this.getWidth(iMipLevel)/this.getDivSize())*Math.floor(iY/this.getDivSize())+Math.floor(iX/this.getDivSize()))*this.getBlockBytes();


        /*var pColor0=(new Uint16Array(this._pData[0],iOffset,1))[0];
		var pColor1=(new Uint16Array(this._pData[0],iOffset+2,1))[0];
		pColor=(new Uint32Array(this._pData[0],iOffset+4,1))[0];

		var pAlpha=new Uint8Array(this._pData[0],iOffset+8,8);*/

        var pColor0=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+8,1))[0];
        var pColor1=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+10,1))[0];
        pColor=(new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+12,1))[0];

        var pAlpha=new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,8);

        var iX0=iX%this.getDivSize();
        var iY0=iY%this.getDivSize();

        var iCode=(pColor>>>(2*(this.getDivSize()*iY0+iX0)))&3;

        pPixel[3]=((pAlpha[Math.floor((this.getDivSize()*iY0+iX0)/2)]>>>4*(((this.getDivSize()*iY0+iX0)%2)))&0xF)*15;
        if(iCode==0)
        {
            pPixel[0]=((pColor0&0xf800)>>>11)*8;
            pPixel[1]=((pColor0&0x07e0)>>>5)*4;
            pPixel[2]=((pColor0&0x001f))*8;

        }
        else if(iCode==1)
        {
            pPixel[0]=((pColor1&0xf800)>>>11)*8;
            pPixel[1]=((pColor1&0x07e0)>>>5)*4;
            pPixel[2]=((pColor1&0x001f))*8;
        }
        else if(iCode==2)
        {
            pPixel[0]=((2*(pColor0&0xf800)>>>11)*8+((pColor1&0xf800)>>>11)*8)/3;
            pPixel[1]=((2*(pColor0&0x07e0)>>>5)*4+((pColor1&0x07e0)>>>5)*4)/3;
            pPixel[2]=((2*(pColor0&0x001f))*8+((pColor1&0x001f))*8)/3;
        }
        else if(iCode==3)
        {
            pPixel[0]=((2*(pColor1&0xf800)>>>11)*8+((pColor0&0xf800)>>>11)*8)/3;
            pPixel[1]=((2*(pColor1&0x07e0)>>>5)*4+((pColor0&0x07e0)>>>5)*4)/3;
            pPixel[2]=((2*(pColor1&0x001f))*8+((pColor0&0x001f))*8)/3;
        }
        pPixel[0]=pPixel[0]*255/pPixel[3];
        pPixel[1]=pPixel[1]*255/pPixel[3];
        pPixel[2]=pPixel[2]*255/pPixel[3];
    }
    else if(this._eFormat==a.IFORMAT.RGBA_DXT3)
    {
        iOffset=(Math.ceil(this.getWidth((iMipLevel))/this.getDivSize())*Math.floor(iY/this.getDivSize())+Math.floor(iX/this.getDivSize()))*this.getBlockBytes();


        /*var pColor0=(new Uint16Array(this._pData[0],iOffset,1))[0];
		var pColor1=(new Uint16Array(this._pData[0],iOffset+2,1))[0];
		pColor=(new Uint32Array(this._pData[0],iOffset+4,1))[0];

		var pAlpha=new Uint8Array(this._pData[0],iOffset+8,8);*/

        var pColor0=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+8,1))[0];
        var pColor1=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+10,1))[0];
        pColor=(new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+12,1))[0];

        var pAlpha=new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,8);

        var iX0=iX%this.getDivSize();
        var iY0=iY%this.getDivSize();

        var iCode=(pColor>>>(2*(this.getDivSize()*iY0+iX0)))&3;

        if(iCode==0)
        {
            pPixel[0]=((pColor0&0xf800)>>>11)*8;
            pPixel[1]=((pColor0&0x07e0)>>>5)*4;
            pPixel[2]=((pColor0&0x001f))*8;
            pPixel[3]=((pAlpha[Math.floor((this.getDivSize()*iY0+iX0)/2)]>>>4*(((this.getDivSize()*iY0+iX0)%2)))&0xF)*15;
        }
        else if(iCode==1)
        {
            pPixel[0]=((pColor1&0xf800)>>>11)*8;
            pPixel[1]=((pColor1&0x07e0)>>>5)*4;
            pPixel[2]=((pColor1&0x001f))*8;
            pPixel[3]=((pAlpha[Math.floor((this.getDivSize()*iY0+iX0)/2)]>>>4*(((this.getDivSize()*iY0+iX0)%2)))&0xF)*15;
        }
        else if(iCode==2)
        {
            pPixel[0]=((2*(pColor0&0xf800)>>>11)*8+((pColor1&0xf800)>>>11)*8)/3;
            pPixel[1]=((2*(pColor0&0x07e0)>>>5)*4+((pColor1&0x07e0)>>>5)*4)/3;
            pPixel[2]=((2*(pColor0&0x001f))*8+((pColor1&0x001f))*8)/3;
            pPixel[3]=((pAlpha[Math.floor((this.getDivSize()*iY0+iX0)/2)]>>>4*(((this.getDivSize()*iY0+iX0)%2)))&0xF)*15;
        }
        else if(iCode==3)
        {
            pPixel[0]=((2*(pColor1&0xf800)>>>11)*8+((pColor0&0xf800)>>>11)*8)/3;
            pPixel[1]=((2*(pColor1&0x07e0)>>>5)*4+((pColor0&0x07e0)>>>5)*4)/3;
            pPixel[2]=((2*(pColor1&0x001f))*8+((pColor0&0x001f))*8)/3;
            pPixel[3]=((pAlpha[Math.floor((this.getDivSize()*iY0+iX0)/2)]>>>4*(((this.getDivSize()*iY0+iX0)%2)))&0xF)*15;
        }
    }
    else if(this._eFormat==a.IFORMAT.RGBA_DXT4)
    {
        iOffset=(Math.ceil(this.getWidth(iMipLevel)/this.getDivSize())*Math.floor(iY/this.getDivSize())+Math.floor(iX/this.getDivSize()))*this.getBlockBytes();

        var pColor0=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+8,1))[0];
        var pColor1=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+10,1))[0];
        pColor=(new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+12,1))[0];

        var pAlpha0=(new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1))[0];
        var pAlpha1=(new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+1,1))[0];
        var pAlpha=new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+2,6);

        var iX0=iX%this.getDivSize();
        var iY0=iY%this.getDivSize();

        var iCode=(pColor>>>(2*(this.getDivSize()*iY0+iX0)))&3;
        var iAlphaCode;
        switch(iY0*this.getDivSize()+iX0)
        {
            case 0:
                iAlphaCode=(pAlpha[0]&0x7);
                break;
            case 1:
                iAlphaCode=(pAlpha[0]&0x38)>>>3;
                break;
            case 2:
                iAlphaCode=((pAlpha[0]&0xC0)>>6)+((pAlpha[1]&0x01)<<2);
                break;
            case 3:
                iAlphaCode=((pAlpha[1]&0x0E)>>>1);
                break;
            case 4:
                iAlphaCode=((pAlpha[1]&0x70)>>>4);
                break;
            case 5:
                iAlphaCode=((pAlpha[1]&0x80)>>>7)+((pAlpha[2]&0x03)<<1);
                break;
            case 6:
                iAlphaCode=(pAlpha[2]&0x1C)>>>2;
                break;
            case 7:
                iAlphaCode=(pAlpha[2]&0xE0)>>>5;
                break;
            case 8:
                iAlphaCode=(pAlpha[3]&0x7);
                break;
            case 9:
                iAlphaCode=(pAlpha[3]&0x38)>>>3;
                break;
            case 10:
                iAlphaCode=((pAlpha[3]&0xC0)>>6)+((pAlpha[4]&0x01)<<2);
                break;
            case 11:
                iAlphaCode=((pAlpha[4]&0x0E)>>>1);
                break;
            case 12:
                iAlphaCode=((pAlpha[4]&0x70)>>>4);
                break;
            case 13:
                iAlphaCode=((pAlpha[4]&0x80)>>>7)+((pAlpha[5]&0x03)<<1);
                break;
            case 14:
                iAlphaCode=(pAlpha[5]&0x1C)>>>2;
                break;
            case 15:
                iAlphaCode=(pAlpha[5]&0xE0)>>>5;
                break;
        }
        if(pAlpha0>pAlpha1)
        {

            if(iAlphaCode==0)
            {
                pPixel[3]=pAlpha0;
            }
            else if(iAlphaCode==1)
            {
                pPixel[3]=pAlpha1;
            }
            else if(iAlphaCode==2)
            {
                pPixel[3]=(6*pAlpha0+1*pAlpha1)/7;
            }
            else if(iAlphaCode==3)
            {
                pPixel[3]=(5*pAlpha0+2*pAlpha1)/7;
            }
            else if(iAlphaCode==4)
            {
                pPixel[3]=(4*pAlpha0+3*pAlpha1)/7;
            }
            else if(iAlphaCode==5)
            {
                pPixel[3]=(3*pAlpha0+4*pAlpha1)/7;
            }
            else if(iAlphaCode==6)
            {
                pPixel[3]=(2*pAlpha0+5*pAlpha1)/7;
            }
            else if(iAlphaCode==7)
            {
                pPixel[3]=(1*pAlpha0+6*pAlpha1)/7;
            }
        }
        else
        {
            if(iAlphaCode==0)
            {
                pPixel[3]=pAlpha0;
            }
            else if(iAlphaCode==1)
            {
                pPixel[3]=pAlpha1;
            }
            else if(iAlphaCode==2)
            {
                pPixel[3]=(4*pAlpha0+1*pAlpha1)/5;
            }
            else if(iAlphaCode==3)
            {
                pPixel[3]=(3*pAlpha0+2*pAlpha1)/5;
            }
            else if(iAlphaCode==4)
            {
                pPixel[3]=(2*pAlpha0+3*pAlpha1)/5;
            }
            else if(iAlphaCode==5)
            {
                pPixel[3]=(1*pAlpha0+4*pAlpha1)/5;
            }
            else if(iAlphaCode==6)
            {
                pPixel[3]=0;
            }
            else if(iAlphaCode==7)
            {
                pPixel[3]=1;
            }
        }

        if(iCode==0)
        {
            pPixel[0]=((pColor0&0xf800)>>>11)*8;
            pPixel[1]=((pColor0&0x07e0)>>>5)*4;
            pPixel[2]=((pColor0&0x001f))*8;
        }
        else if(iCode==1)
        {
            pPixel[0]=((pColor1&0xf800)>>>11)*8;
            pPixel[1]=((pColor1&0x07e0)>>>5)*4;
            pPixel[2]=((pColor1&0x001f))*8;
        }
        else if(iCode==2)
        {
            pPixel[0]=((2*(pColor0&0xf800)>>>11)*8+((pColor1&0xf800)>>>11)*8)/3;
            pPixel[1]=((2*(pColor0&0x07e0)>>>5)*4+((pColor1&0x07e0)>>>5)*4)/3;
            pPixel[2]=((2*(pColor0&0x001f))*8+((pColor1&0x001f))*8)/3;
        }
        else if(iCode==3)
        {
            pPixel[0]=((2*(pColor1&0xf800)>>>11)*8+((pColor0&0xf800)>>>11)*8)/3;
            pPixel[1]=((2*(pColor1&0x07e0)>>>5)*4+((pColor0&0x07e0)>>>5)*4)/3;
            pPixel[2]=((2*(pColor1&0x001f))*8+((pColor0&0x001f))*8)/3;
        }
        pPixel[0]=pPixel[0]*255/pPixel[3];
        pPixel[1]=pPixel[1]*255/pPixel[3];
        pPixel[2]=pPixel[2]*255/pPixel[3];
    }
    else if(this._eFormat==a.IFORMAT.RGBA_DXT5)
    {
        iOffset=(Math.ceil(this.getWidth(iMipLevel)/this.getDivSize())*Math.floor(iY/this.getDivSize())+Math.floor(iX/this.getDivSize()))*this.getBlockBytes();

        var pColor0=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+8,1))[0];
        var pColor1=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+10,1))[0];
        pColor=(new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+12,1))[0];

        var pAlpha0=(new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1))[0];
        var pAlpha1=(new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+1,1))[0];
        var pAlpha=new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset+2,6);

        var iX0=iX%this.getDivSize();
        var iY0=iY%this.getDivSize();

        var iCode=(pColor>>>(2*(this.getDivSize()*iY0+iX0)))&3;
        var iAlphaCode;
        switch(iY0*this.getDivSize()+iX0)
        {
            case 0:
                iAlphaCode=(pAlpha[0]&0x7);
                break;
            case 1:
                iAlphaCode=(pAlpha[0]&0x38)>>>3;
                break;
            case 2:
                iAlphaCode=((pAlpha[0]&0xC0)>>6)+((pAlpha[1]&0x01)<<2);
                break;
            case 3:
                iAlphaCode=((pAlpha[1]&0x0E)>>>1);
                break;
            case 4:
                iAlphaCode=((pAlpha[1]&0x70)>>>4);
                break;
            case 5:
                iAlphaCode=((pAlpha[1]&0x80)>>>7)+((pAlpha[2]&0x03)<<1);
                break;
            case 6:
                iAlphaCode=(pAlpha[2]&0x1C)>>>2;
                break;
            case 7:
                iAlphaCode=(pAlpha[2]&0xE0)>>>5;
                break;
            case 8:
                iAlphaCode=(pAlpha[3]&0x7);
                break;
            case 9:
                iAlphaCode=(pAlpha[3]&0x38)>>>3;
                break;
            case 10:
                iAlphaCode=((pAlpha[3]&0xC0)>>6)+((pAlpha[4]&0x01)<<2);
                break;
            case 11:
                iAlphaCode=((pAlpha[4]&0x0E)>>>1);
                break;
            case 12:
                iAlphaCode=((pAlpha[4]&0x70)>>>4);
                break;
            case 13:
                iAlphaCode=((pAlpha[4]&0x80)>>>7)+((pAlpha[5]&0x03)<<1);
                break;
            case 14:
                iAlphaCode=(pAlpha[5]&0x1C)>>>2;
                break;
            case 15:
                iAlphaCode=(pAlpha[5]&0xE0)>>>5;
                break;
        }
        if(pAlpha0>pAlpha1)
        {

            if(iAlphaCode==0)
            {
                pPixel[3]=pAlpha0;
            }
            else if(iAlphaCode==1)
            {
                pPixel[3]=pAlpha1;
            }
            else if(iAlphaCode==2)
            {
                pPixel[3]=(6*pAlpha0+1*pAlpha1)/7;
            }
            else if(iAlphaCode==3)
            {
                pPixel[3]=(5*pAlpha0+2*pAlpha1)/7;
            }
            else if(iAlphaCode==4)
            {
                pPixel[3]=(4*pAlpha0+3*pAlpha1)/7;
            }
            else if(iAlphaCode==5)
            {
                pPixel[3]=(3*pAlpha0+4*pAlpha1)/7;
            }
            else if(iAlphaCode==6)
            {
                pPixel[3]=(2*pAlpha0+5*pAlpha1)/7;
            }
            else if(iAlphaCode==7)
            {
                pPixel[3]=(1*pAlpha0+6*pAlpha1)/7;
            }
        }
        else
        {
            if(iAlphaCode==0)
            {
                pPixel[3]=pAlpha0;
            }
            else if(iAlphaCode==1)
            {
                pPixel[3]=pAlpha1;
            }
            else if(iAlphaCode==2)
            {
                pPixel[3]=(4*pAlpha0+1*pAlpha1)/5;
            }
            else if(iAlphaCode==3)
            {
                pPixel[3]=(3*pAlpha0+2*pAlpha1)/5;
            }
            else if(iAlphaCode==4)
            {
                pPixel[3]=(2*pAlpha0+3*pAlpha1)/5;
            }
            else if(iAlphaCode==5)
            {
                pPixel[3]=(1*pAlpha0+4*pAlpha1)/5;
            }
            else if(iAlphaCode==6)
            {
                pPixel[3]=0;
            }
            else if(iAlphaCode==7)
            {
                pPixel[3]=1;
            }
        }

        if(iCode==0)
        {
            pPixel[0]=((pColor0&0xf800)>>>11)*8;
            pPixel[1]=((pColor0&0x07e0)>>>5)*4;
            pPixel[2]=((pColor0&0x001f))*8;
        }
        else if(iCode==1)
        {
            pPixel[0]=((pColor1&0xf800)>>>11)*8;
            pPixel[1]=((pColor1&0x07e0)>>>5)*4;
            pPixel[2]=((pColor1&0x001f))*8;
        }
        else if(iCode==2)
        {
            pPixel[0]=((2*(pColor0&0xf800)>>>11)*8+((pColor1&0xf800)>>>11)*8)/3;
            pPixel[1]=((2*(pColor0&0x07e0)>>>5)*4+((pColor1&0x07e0)>>>5)*4)/3;
            pPixel[2]=((2*(pColor0&0x001f))*8+((pColor1&0x001f))*8)/3;
        }
        else if(iCode==3)
        {
            pPixel[0]=((2*(pColor1&0xf800)>>>11)*8+((pColor0&0xf800)>>>11)*8)/3;
            pPixel[1]=((2*(pColor1&0x07e0)>>>5)*4+((pColor0&0x07e0)>>>5)*4)/3;
            pPixel[2]=((2*(pColor1&0x001f))*8+((pColor0&0x001f))*8)/3;
        }
    }
    return pPixel;
}


/**
 * @property convert(Enumeration eFormat)
 * Конвертирование картинки из одного формата в другой
 * @memberof Img
 * @param eFormat в какой формат нужно конвертить
 * @return Boolean удалось или не конвертнуть
 **/
Img.prototype.convert = function(eFormat)
{
    var iLength;    
	var iOffset;
    var iColor1;
    var iColor2;
    var iColor3;
    var iColor4;
    var pOldBuffer;
    var pNewBuffer;
    var pNewData;
	var pPixel=new Uint8Array(4);

	var nMipMap=this.getMipLevels();
	if(nMipMap==undefined)
	{
		nMipMap=1;
	}	
	var nVolume=this.getVolumeLevels();
	if(nVolume==undefined)
	{
		nVolume=1;
	}
	var iCubeFlags=this._iCubeFlags;	
	if(!TEST_BIT(this._iFlags,a.Img.CubeMap))
	{
		iCubeFlags=1;
	}

    if(this._eFormat==eFormat)//и так в нужном формате
    {
        return 1;
    }
	
    if(this._eFormat==a.IFORMAT.BGR8)
    {
        if(eFormat==a.IFORMAT.RGB8)
        {
			for(k=0;k<nVolume;k++)
			{					
				for(l=0;l<6;l++)
				{
					if(TEST_BIT(iCubeFlags,a.Img.POSITIVEX+l))
					{
						for(var m=0;m<nMipMap;m++)
						{
							iLength=this._pData[k][l][b].length;
							pNewBuffer=new Uint8Array(this._pData[k][l][b]);
							for(var b=0;b<iLength;b+=3)
							{
								iColor1=pNewBuffer[b];
								pNewBuffer[b]=pNewBuffer[b+2];
								pNewBuffer[b+2]=iColor1;
							}
						}
					}
				}
			}
			this._eFormat=a.IFORMAT.RGB8;
            return 1;
        }
        else if(eFormat==a.IFORMAT.RGBA8)
        {
            pNewData= new Array(nVolume);
            for(k=0;k<nVolume;k++)
			{		
				pNewData[k]= new Array(6);
				for(l=0;l<6;l++)
				{
					if(TEST_BIT(iCubeFlags,a.Img.POSITIVEX+l))
					{
						pNewData[k][l]= new Array(nMipMap);
						for(var m=0;m<nMipMap;m++)
						{
							iLength=this._pData[k][l][m].length;
							pNewData[k][l][m]=new ArrayBuffer(iLength*4/3);
							pNewBuffer=new Uint8Array(pNewData[k][l][m]);
							pOldBuffer=new Uint8Array(this._pData[k][l][m]);
							for(var b=0, d=0;b<iLength;b+=3,d+=4)
							{
								pNewBuffer[d]=pOldBuffer[b+2];
								pNewBuffer[d+1]=pOldBuffer[b+1];
								pNewBuffer[d+2]=pOldBuffer[b];
								pNewBuffer[d+3]=256;
							}
						}
					}
				}
            }
            this._pData=pNewData;
			this._eFormat=a.IFORMAT.RGBA8;
            return 1;
        }
        else if(eFormat==a.IFORMAT.BGRA8)
        {
            pNewData= new Array(nVolume);
            for(k=0;k<nVolume;k++)
			{		
				pNewData[k]= new Array(6);
				for(l=0;l<6;l++)
				{
					if(TEST_BIT(iCubeFlags,a.Img.POSITIVEX+l))
					{
						pNewData[k][l]= new Array(nMipMap);
						for(var m=0;m<nMipMap;m++)
						{
							iLength=this._pData[k][l][m].length;
							pNewData[k][l][m]=new ArrayBuffer(iLength*4/3);
							pNewBuffer=new Uint8Array(pNewData[k][l][m]);
							pOldBuffer=new Uint8Array(this._pData[k][l][m]);
							for(var b=0, d=0;b<iLength;b+=3,d+=4)
							{
								pNewBuffer[d]=pOldBuffer[b];
								pNewBuffer[d+1]=pOldBuffer[b+1];
								pNewBuffer[d+2]=pOldBuffer[b+2];
								pNewBuffer[d+3]=256;
							}
						}
					}
				}
            }
            this._pData=pNewData;
			this._eFormat=a.IFORMAT.BGRA8;
            return 1;
        }
        else if(eFormat==a.IFORMAT.RGBA4)
        {
            pNewData= new Array(nVolume);
            for(k=0;k<nVolume;k++)
			{		
				pNewData[k]= new Array(6);
				for(l=0;l<6;l++)
				{
					if(TEST_BIT(iCubeFlags,a.Img.POSITIVEX+l))
					{
						pNewData[k][l]= new Array(nMipMap);
						for(var m=0;m<nMipMap;m++)
						{
							iLength=this._pData[k][l][m].length;
							pOldBuffer=new Uint8Array(this._pData[k][l][m]);
							pNewData[k][l][m]=new ArrayBuffer(iLength*2/3);
							pNewBuffer=new Uint16Buffer(pNewData[k][l][m]);
							for(var b=0,d=0;b<iLength;b+=3,d+=1)
							{
								pNewBuffer[d]=0;
								pNewBuffer[d]|=(pOldBuffer[b+2]/16)<<12;
								pNewBuffer[d]|=(pOldBuffer[b+1]/16)<<8;
								pNewBuffer[d]|=(pOldBuffer[b]/16)<<4;
								pNewBuffer[d]|=15;
							}
						}
					}
				}
            }
            this._pData=pNewData;
			this._eFormat=a.IFORMAT.RGBA4;
            return 1;
        }
        else
        {
            debug_error("Перевод из формата "+this._eFormat+" в " +eFormat +" не поддерживается");
            return 0;
        }
    }
    else if(this._eFormat==a.IFORMAT.RGBA_DXT5||this._eFormat==a.IFORMAT.RGBA_DXT4||
		this._eFormat==a.IFORMAT.RGBA_DXT3||this._eFormat==a.IFORMAT.RGBA_DXT2||
		this._eFormat==a.IFORMAT.RGBA_DXT1||this._eFormat==a.IFORMAT.RGB_DXT1)
    {
		
        if(eFormat==a.IFORMAT.RGBA8)
        {
        	//console.log("a.IFORMAT.RGBA8",nVolume,iCubeFlags,nMipMap);
        	pNewData= new Array(nVolume);
            for(k=0;k<nVolume;k++)
			{		
				pNewData[k]= new Array(6);
				for(l=0;l<6;l++)
				{
					if(TEST_BIT(iCubeFlags,a.Img.POSITIVEX+l))
					{
						pNewData[k][l]= new Array(nMipMap);
						for(var m=0;m<nMipMap;m++)
						{
							iHeight=this.getHeight(m,l,k);
							iWidth=this.getWidth(m,l,k);
							iLength=iWidth*iHeight*4;
							pNewData[k][l][m]=new ArrayBuffer(iLength);
							pNewBuffer=new Uint8Array(pNewData[k][l][m]);							
							for(var y=0;y<iHeight;y++)
							{
								for(var x=0;x<iWidth;x++)
								{
									iOffset=(y*iWidth+x)*4;
									
									this._getPixelRGBA(x,y,pPixel,m,l,k);
									pNewBuffer[iOffset+0]=pPixel[0];
									pNewBuffer[iOffset+1]=pPixel[1];
									pNewBuffer[iOffset+2]=pPixel[2];
									pNewBuffer[iOffset+3]=pPixel[3];
								}
							}
						}
					}
				}
            }
			this._pData=pNewData;
			this._eFormat=a.IFORMAT.RGBA8;
            return 1;
        }
		if(eFormat==a.IFORMAT.RGB8)
        {
        	var iHeight;
			var iWidth;
			pNewData= new Array(nVolume);
            for(k=0;k<nVolume;k++)
			{		
				pNewData[k]= new Array(6);
				for(l=0;l<6;l++)
				{
					if(TEST_BIT(iCubeFlags,a.Img.POSITIVEX+l))
					{
						pNewData[k][l]= new Array(nMipMap);
						for(var m=0;m<nMipMap;m++)
						{
							iHeight=this.getHeight(m,l,k);
							iWidth=this.getWidth(m,l,k);
							iLength=iWidth*iHeight*3;
							pNewData[k][l][m]=new ArrayBuffer(iLength);
							pNewBuffer=new Uint8Array(pNewData[k][l][m]);
							for(var y=0;y<iHeight;y++)
							{
								for(var x=0;x<iWidth;x++)
								{
									iOffset=(y*iWidth+x)*3;									
									this._getPixelRGBA(x,y,pPixel,m,l,k);
									pNewBuffer[iOffset+0]=pPixel[0];
									pNewBuffer[iOffset+1]=pPixel[1];
									pNewBuffer[iOffset+2]=pPixel[2];
								}
							}
						}
					}
				}
            }
			this._pData=pNewData;
			this._eFormat=a.IFORMAT.RGB8;
            return 1;
        }
        else
        {
            debug_error("Перевод из формата "+this._eFormat+" в " +eFormat +" не поддерживается");
            return 0;
        }
    }



    debug_error("Перевод из формата "+this._eFormat+" в " +eFormat +" не поддерживается");
    return 0;
}




/**
 * @property setPixelRGBA(Int iX,Int iY,Uint8Array(4) pPixel)
 * Получить пиксель в формате RGBA
 * @memberof Img
 * @param iX иксовая коорлината пикселя
 * @param iY игриковая коорлината пикселя
 * @param pPixel массив куда положить цвета пикселя
 * @return Uint8Array(4) тот же массив с цветами пикселя
 **/
 Img.prototype.setPixelRGBA=function(iX,iY,pPixel,iMipLevel,eCubeFlag,iVolumeLevel)
{
	if(iMipLevel==undefined)
	{
		iMipLevel=0;
	}
	else
	{
		debug_assert(TEST_BIT(this._iFlags,a.Img.MipMaps),"Запрашиваются мипмапы, а их нет");
		debug_assert(iMipLevel<this.getMipMapLevels(),"Запрашивается мипмап, которого нет");
	}
	
	if(eCubeFlag==undefined)
	{
		debug_assert(!TEST_BIT(this._iFlags,a.Img.CubeMap),"Не выставлена часть кубической картинки");
		eCubeFlag=0;		
	}
	else
	{
		debug_assert(TEST_BIT(this._iFlags,a.Img.CubeMap),"Выставлена часть кубической куртинки, хотя картинка не является кубической");
		debug_assert(TEST_BIT(this._iCubeFlags,eCubeFlag),"Запрашивается часть кубической текстуры которой нет, которого нет");
	}
	
	if(iVolumeLevel==undefined)
	{
		iVolumeLevel=0;
	}
	else
	{
		debug_assert(TEST_BIT(this._iFlags,a.Img.Volume),"Запрашивается часть объемной картинки, а картинка не объемная");
		debug_assert(iVolumeLevel<this.getVolumeLevels(),"Запрашивается часть объемной картинки, которой нет");
	}
	
	return this._setPixelRGBA(iX,iY,pPixel,iMipLevel,eCubeFlag,iVolumeLevel);
}

Img.prototype._setPixelRGBA=function(iX,iY,pPixel,iMipLevel,eCubeFlag,iVolumeLevel)
{
    var iOffset;
    var pColor;
    var iOffset;
    if(this._eFormat==a.IFORMAT.BGRA8)
    {
        iOffset=(iY*this._iWidth+iX)*this.getBlockBytes();
        pColor=(new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1));
        pColor[0]=0;
        pColor[0]|=pPixel[0]<<16;
        pColor[0]|=pPixel[1]<<8;
        pColor[0]|=pPixel[2];
        pColor[0]|=pPixel[3]<<24;
    }
    else if(this._eFormat==a.IFORMAT.RGBA8)
    {
        iOffset=(iY*this._iWidth+iX)*this.getBlockBytes();
        pColor=(new Uint32Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1));
        pColor[0]=0;
        pColor[0]|=pPixel[0];
        pColor[0]|=pPixel[1]<<8;
        pColor[0]|=pPixel[2]<<16;
        pColor[0]|=pPixel[3]<<24;
    }
    else if(this._eFormat==a.IFORMAT.BGR5_A1)
    {
        iOffset=(iY*this._iWidth+iX)*this.getBlockBytes();
        pColor=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1));
        pColor=0;
        pColor|=[0](pPixel[0]/7)<<10;
        pColor|=[0](pPixel[1]/7)<<5;
        pColor|=[0](pPixel[2]/7);
        pColor|=[0](pPixel[3]/255)<<15;
    }
    else if(this._eFormat==a.IFORMAT.RGB5_A1)
    {
        iOffset=(iY*this._iWidth+iX)*this.getBlockBytes();
        pColor=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1));

        pColor[0]=0;
        pColor[0]|=(pPixel[0]/7);
        pColor[0]|=(pPixel[1]/7)<<5;
        pColor[0]|=(pPixel[2]/7)<<10;
        pColor[0]|=(pPixel[3]/255)<<15;
    }
    else if(this._eFormat==a.IFORMAT.BGRA4)
    {
        iOffset=(iY*this._iWidth+iX)*this.getBlockBytes();
        pColor=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1));

        pColor[0]=0;
        pColor[0]|=(pPixel[0]/15)<<8;
        pColor[0]|=(pPixel[1]/15)<<4;
        pColor[0]|=(pPixel[2]/15);
        pColor[0]|=(pPixel[3]/15)<<12;

    }
    else if(this._eFormat==a.IFORMAT.RGBA4)
    {
        iOffset=(iY*this._iWidth+iX)*this.getBlockBytes();
        pColor=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1));

        pColor[0]=0;
        pColor[0]|=(pPixel[0]/15);
        pColor[0]|=(pPixel[1]/15)<<4;
        pColor[0]|=(pPixel[2]/15)<<8;
        pColor[0]|=(pPixel[3]/15)<<12;
    }
    else if(this._eFormat==a.IFORMAT.RGB8)
    {
        iOffset=(iY*this._iWidth+iX)*this.getBlockBytes();
        pColor=(new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,3));
        pColor[0]=pPixel[0];
        pColor[1]=pPixel[1];
        pColor[2]=pPixel[2];
    }
    else if(this._eFormat==a.IFORMAT.BGR8)
    {
        iOffset=(iY*this._iWidth+iX)*this.getBlockBytes();
        pColor=(new Uint8Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,3));
        pColor[2]=pPixel[2];
        pColor[1]=pPixel[1];
        pColor[0]=pPixel[0];
    }
    else if(this._eFormat==a.IFORMAT.BGR565)
    {
        iOffset=(iY*this._iWidth+iX)*this.getBlockBytes();
        pColor=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1));
        pColor[0]=0;
        pColor[0]|=(pPixel[0]/7)<<11;
        pColor[0]|=(pPixel[1]/3)<<5;
        pColor[0]|=(pPixel[2]/7);

    }
    else if(this._eFormat==a.IFORMAT.RGB565)
    {
        iOffset=(iY*this._iWidth+iX)*this.getBlockBytes();
        pColor=(new Uint16Array(this._pData[iVolumeLevel][eCubeFlag][iMipLevel],iOffset,1));
        pColor[0]=0;
        pColor[0]|=(pPixel[0]/7);
        pColor[0]|=(pPixel[1]/3)<<5;
        pColor[0]|=(pPixel[2]/7)<<11;
    }
    else
    {
        debug_error("Установка цвета в такой формат не поддерживается");
    }
}


/**
 * Сгенерировать шум перлина
 */
Img.prototype.generatePerlinNoise = function (fScale, iOctaves, fFalloff) 
{

    var pPerlin = new PerlinNoise();
    var pColor = new Uint8Array(4);

    debug_assert(this._pData!=null,"Картинка еще не cоздана");
	debug_assert(this._iFlags==0,"Картинка не является простой");
	
    for (var y = 0; y < this.getHeight(); y++) 
	{
		for (var x = 0; x < this.getWidth(); x++) 
		{
			var fX = x;
			var fY = y;

			var fAccum = 0;
			var fFrequency = fScale;//*2.0f;
			var fAmplitude = 1.0;

			for (var i = 0; i < iOctaves; ++i) 
			{
				fAccum += pPerlin.noise(fX, fY, fFrequency) * fAmplitude;
				fAmplitude *= fFalloff;
				fFrequency *= 2.0;
			}

			fAccum = Math.clamp(fAccum, -1.0, 1.0);
			fAccum *= 0.5;
			fAccum += 0.5;

			fAccum *= 255;

			pColor[0] = fAccum; // Red value
			pColor[1] = fAccum; // Green value
			pColor[2] = fAccum; // Blue value
			pColor[3] = 255;//fAccum; // Alpha value
			this._setPixelRGBA(x, y, pColor,0,0,0);
		}
	}        
};

/**
 * Сгенерировать рандомный шум.
 * @param iChannel номер канала
 * @treturn Boolean Результат.
 */
Img.prototype.randomChannelNoise = function (iChannel, iMinRange, iMaxRange) 
{
    debug_assert(iChannel < 4, "invalid image channel");
    debug_assert(this._pData!=null,"Картинка еще не cоздана");
	debug_assert(this._iFlags==0,"Картинка не является простой");
	
	var pColor = new Uint8Array(4);    
	var iNoise;
	var iHeight=this.getHeight();
	var iWidth=this.getWidth()
	for (var y = 0; y < iHeight; y++) 
	{
		for (var x = 0; x < iWidth; x++) 
		{
			this._getPixelRGBA(x, y, pColor,0,0,0);
			iNoise = iMinRange + Math.random() * (iMaxRange - iMinRange);
			pColor[iChannel] = iNoise;
			this._setPixelRGBA(x, y, pColor,0,0,0);
		}
	}       
    
}

a.Img = Img;

















