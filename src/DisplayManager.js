/**
 * @file
 * @brief file contains DisplayManager class
 * @author reinor
 */

function findPosX (pObj) {
    var curleft = 0;
    if (pObj.offsetParent) {
        while (1) {
            curleft += pObj.offsetLeft;
            if (!pObj.offsetParent) {
                break;
            }
            pObj = pObj.offsetParent;
        }
    } else if (pObj.x) {
        curleft += pObj.x;
    }
    return curleft;
}
;

function findPosY (pObj) {
    var curtop = 0;
    if (pObj.offsetParent) {
        while (1) {
            curtop += pObj.offsetTop;
            if (!pObj.offsetParent) {
                break;
            }
            pObj = pObj.offsetParent;
        }
    } else if (pObj.y) {
        curtop += pObj.y;
    }
    return curtop;
}
;

function Font2D (iSize, sColor, sFontFamily, isBold, isItalic) {

    iSize = iSize || 12;
    sColor = sColor || '#000000';
    sFontFamily = sFontFamily || 'times';
    isBold = isBold || false;
    isItalic = isItalic || false;

    //////////////////////////////////////
    this._sFontSize = String(iSize) + 'px';
    //////////////////////////////////////
    if (sColor[0] != '#') {
        this._sFontColor = '#' + sColor;
    }
    else {
        this._sFontColor = sColor;
    }
    //////////////////////////////////////
    this._sFontFamily = sFontFamily;
    //////////////////////////////////////
    if (isBold) {
        this._sBold = 'bold';
    }
    else {
        this._sBold = 'normal';
    }
    //////////////////////////////////////
    if (isItalic) {
        this._sItalic = 'italic';
    }
    else {
        this._sItalic = 'normal';
    }
//////////////////////////////////////
}
;

function String2D (iX, iY, pFont, sStr, pDiv) {
    pFont = pFont || new a.Font2D();

    var pSpan = document.createElement('span');

    pSpan.style.position = 'absolute';
    pSpan.style.left = String(iX) + 'px';
    pSpan.style.top = String(iY) + 'px';

    pSpan.style.fontSize = pFont._sFontSize;
    pSpan.style.color = pFont._sFontColor;
    pSpan.style.fontFamily = pFont._sFontFamily;
    pSpan.style.fontWeight = pFont._sBold;
    pSpan.style.fontStyle = pFont._sItalic;

    pSpan.style.webkitUserSelect = 'none';
    pSpan.style.mozUserSelect = 'none';

    pSpan.innerHTML = sStr;

    pDiv.appendChild(pSpan);

    this._pSpan = pSpan;
    this._pLastSpan = pSpan;
}
;

String2D.prototype.append = function (sStr, pFont) {
    if (pFont != undefined) {
        var pStyle = this._pLastSpan.style;
        if (pStyle.fontSize != pFont._sFontSize ||
            pStyle.color != pFont._sFontColor ||
            pStyle.fontFamily != pFont._sFontFamily ||
            pStyle.fontWeight != pFont._sFontWeight ||
            pStyle.fontStyle != pFont._sFontStyle) {

            this._addSpan(sStr, pFont);
        }
        else {
            this._pLastSpan.innerHTML += sStr;
        }
    }
    else {
        this._pLastSpan.innerHTML += sStr;
    }
};

String2D.prototype._addSpan = function (sStr, pFont) {
    var pSpan = document.createElement('span');

    pSpan.style.fontSize = pFont._sFontSize;
    pSpan.style.color = pFont._sFontColor;
    pSpan.style.fontFamily = pFont._sFontFamily;
    pSpan.style.fontWeight = pFont._sBold;
    pSpan.style.fontStyle = pFont._sItalic;

    pSpan.style.webkitUserSelect = 'none';
    pSpan.style.mozUserSelect = 'none';

    pSpan.innerHTML = sStr;

    this._pSpan.appendChild(pSpan);
    this._pLastSpan = pSpan;
};

String2D.prototype.hide = function () {
    this._pSpan.style.visibility = 'hidden';
};
String2D.prototype.show = function () {
    this._pSpan.style.visibility = 'visible';
};

String2D.prototype.clear = function () {
    this._pSpan.innerHTML = null;
    this._pLastSpan = this._pSpan;
};

String2D.prototype.toString = function () {
    return this._pSpan.innerHTML;
};

String2D.prototype.edit = function (sStr) {
    this._pSpan.innerHTML = sStr;
    this._pLastSpan = this._pSpan;
}

/**
 * DisplayMangar class
 * @ctor
 */
function DisplayManager (pEngine) {


    this._pEngine = pEngine;
    this._pDevice = pEngine.pDevice;
    this._pCanvas = pEngine.pCanvas;
    this._pResourceManager = pEngine.pResourceManager;

    this._bEnabled = false;
    this._bClearEachFrame = true;

    // device-bound resource pools
    this._texturePool = new a.TextureManager(pEngine);
    this._texturePool.initialize(16);

    this._surfaceMaterialPool = new a.SurfaceMaterialManager(pEngine);
    this._surfaceMaterialPool.initialize(16);

    this._effectPool = new a.EffectResourceManager(pEngine);
    this._effectPool.initialize(16);

    this._renderMethodPool = new a.RenderMethodManager(pEngine);
    this._renderMethodPool.initialize(16);

    this._vertexBufferPool = new a.VertexBufferManager(pEngine);
    this._vertexBufferPool.initialize(16);

    this._indexBufferPool = new a.IndexBufferManager(pEngine);
    this._indexBufferPool.initialize(16);

    this._modelPool = new a.ModelManager(pEngine);
    this._modelPool.initialize(16);
        
    this._imagePool = new a.ImageManager(pEngine);
    this._imagePool.initialize(16);

    this._videoBufferPool = new a.VideoBufferManager(pEngine);
    this._videoBufferPool.initialize(16);

    this._shaderProgramPool = new a.ShaderProgramManager(pEngine);
    this._shaderProgramPool.initialize(1);

    this._componentPool = new a.ComponentManager(pEngine);
    this._componentPool.initialize(10);

    // device-bound resources
    this._pFontTexture = null;

    this._renderQueue = new a.RenderQueue(pEngine);

    this._pTextDiv = null;

}
;

DisplayManager.prototype.texturePool = function () {
    INLINE();
    return this._texturePool;
};

DisplayManager.prototype.surfaceMaterialPool = function () {
    INLINE();
    return this._surfaceMaterialPool;
};

DisplayManager.prototype.vertexBufferPool = function () {
    INLINE();
    return this._vertexBufferPool;
};

DisplayManager.prototype.videoBufferPool = function () {
    INLINE();
    return this._videoBufferPool;
};

DisplayManager.prototype.shaderProgramPool = function () {
    INLINE();
    return this._shaderProgramPool;
}

DisplayManager.prototype.indexBufferPool = function () {
    INLINE();
    return this._indexBufferPool;
};

DisplayManager.prototype.effectPool = function () {
    INLINE();
    return this._effectPool;
};

DisplayManager.prototype.renderMethodPool = function () {
    INLINE();
    return this._renderMethodPool;
};

DisplayManager.prototype.componentPool = function () {
    INLINE();
    return this._componentPool;
};

DisplayManager.prototype.modelPool = function () {
    INLINE();
    return this._modelPool;
};

DisplayManager.prototype.imagePool = function () {
    INLINE();
    return this._imagePool;
};

DisplayManager.prototype.queue = function () {
    INLINE();
    return this._renderQueue;
};

DisplayManager.prototype.enable = function () {
    INLINE();
    this._bEnabled = true;
};

DisplayManager.prototype.disable = function () {
    INLINE();
    this._bEnabled = false;
};

DisplayManager.prototype.enableFrameClearing = function (isCleared) {
    INLINE();
    this._bClearEachFrame = isCleared;
};

//draw2DText functions

DisplayManager.prototype.draw2DText = function (iX, iY, pFont, sStr) {
    INLINE();
    return (new a.String2D(iX, iY, pFont, sStr, this._pTextDiv));
};

DisplayManager.prototype.getTextLayer = function() {
    return this._pTextDiv;
};

/**
 * initialize display manager
 * register device resources
 * @treturn Boolean always return true
 */
DisplayManager.prototype.initialize = function () {

    this._pDevice.clearColor(0.5, 0.5, 0.5, 1.0);
    this._pDevice.clearStencil(0.);
    this._pDevice.clearDepth(1.0);

    this.registerDeviceResources();
    this.initText2Dlayer();
    return true;
};

DisplayManager.prototype.initText2Dlayer = function () {
    var x = findPosX(this._pCanvas);
    var y = findPosY(this._pCanvas);

    var pDiv = document.createElement('div');
    pDiv.setAttribute('id', 'akra-canvas-overlay');

    var pStyle = pDiv.style;

    //TODO: implement over SystemInfo
    pStyle.width = String(this._pCanvas.width) + 'px';
    pStyle.height = String(this._pCanvas.height) + 'px';

    var iBorder = 0;
    if (this._pCanvas.style.border != "none") {
        iBorder = parseInt(this._pCanvas.style.border);
    }

    pStyle.position = 'absolute';

    pStyle.left = String(x + iBorder) + 'px';
    pStyle.top = String(y + iBorder) + 'px';

    pStyle.overflow = 'hidden';
    pStyle.whiteSpace = 'nowrap';

    if (this._pCanvas.style.zIndex) {
        pStyle.zIndex = this._pCanvas.style.zIndex + 1;
    }
    else {
        pStyle.zIndex = 2;
    }

    document.body.appendChild(pDiv);

    this._pTextDiv = pDiv;
}

/**
 * unregister device resources
 */
DisplayManager.prototype.destroy = function () {
    this.unregisterDeviceResources();
};

//clear depth, stencil and color
DisplayManager.prototype.clearRenderSurface = function () {
    //const D3DPRESENT_PARAMETERS& pd3dpp = TheGameHost.presentParams();
    if (this._pDevice) {
        //this._pDevice.clearStencil(0.);
        //this._pDevice.clearDepth(1.0);
        this._pDevice.clear(this._pDevice.COLOR_BUFFER_BIT
                                | this._pDevice.DEPTH_BUFFER_BIT | this._pDevice.STENCIL_BUFFER_BIT);
        //DWORD flags = D3DCLEAR_TARGET | D3DCLEAR_ZBUFFER;

        /*if (pd3dpp.AutoDepthStencilFormat == D3DFMT_D15S1
         || pd3dpp.AutoDepthStencilFormat == D3DFMT_D24S8
         || pd3dpp.AutoDepthStencilFormat == D3DFMT_D24X4S4 ){
         flags |= D3DCLEAR_STENCIL;
         }

         pd3dDevice->Clear( 0, NULL, flags, D3DCOLOR_ARGB(0,127,127,127), 1.0f, 0 );
         }*/
    }
};

/**
 * clear only depth and stencil buffers
 */
DisplayManager.prototype.clearDepthBuffer = function () {
    //const D3DPRESENT_PARAMETERS& pd3dpp = TheGameHost.presentParams();

    if (this._pDevice) {
        //this._pDevice.clearColor(0.5, 0.5, 0.5, 1.0);
        //this._pDevice.clearStencil(0.);
        //this._pDevice.clearDepth(1.0);
        this._pDevice.clear(this._pDevice.DEPTH_BUFFER_BIT | this._pDevice.STENCIL_BUFFER_BIT);
        //DWORD flags = D3DCLEAR_TARGET | D3DCLEAR_ZBUFFER;

        /*if (pd3dpp.AutoDepthStencilFormat == D3DFMT_D15S1
         || pd3dpp.AutoDepthStencilFormat == D3DFMT_D24S8
         || pd3dpp.AutoDepthStencilFormat == D3DFMT_D24X4S4 ){
         flags |= D3DCLEAR_STENCIL;
         }

         pd3dDevice->Clear( 0, NULL, flags, D3DCOLOR_ARGB(0,127,127,127), 1.0f, 0 );
         }*/
    }
//not implemeted yet
};

/**
 * clear render screen
 */
DisplayManager.prototype.clearScreen = function () {
    if (this._pDevice) {
        // clear the backbuffer
        this.clearRenderSurface();

        // display it
        //pDevice.present(0,0,0,0);
    }
};

/**
 * register device resources
 */
DisplayManager.prototype.registerDeviceResources = function () {
    debug_print("Registering Video Device Resources\n");
    this._texturePool.registerResourcePool(
        new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                           a.ResourcePoolManager.TextureResource));
    this._vertexBufferPool.registerResourcePool(
        new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                           a.ResourcePoolManager.VertexBufferResource));
    this._indexBufferPool.registerResourcePool(
        new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                           a.ResourcePoolManager.IndexBufferResource));
    this._effectPool.registerResourcePool(
        new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                           a.ResourcePoolManager.RenderResource));
    this._renderMethodPool.registerResourcePool(
        new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                           a.ResourcePoolManager.RenderSetResource));
    this._modelPool.registerResourcePool(
        new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                           a.ResourcePoolManager.ModelResource));
    this._imagePool.registerResourcePool(
            new a.ResourceCode(a.ResourcePoolManager.VideoResource,
            a.ResourcePoolManager.ImageResource));
    this._surfaceMaterialPool.registerResourcePool(
        new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                           a.ResourcePoolManager.SMaterialResource));
    this._videoBufferPool.registerResourcePool(
        new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                           a.ResourcePoolManager.VideoBufferResource));
    this._shaderProgramPool.registerResourcePool(
        new a.ResourceCode(a.ResourcePoolManager.VideoResource,
            a.ResourcePoolManager.ShaderProgramResource));
    this._componentPool.registerResourcePool(
        new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                           a.ResourcePoolManager.ComponentResource));
};

/**
 * unregister device resources
 */
DisplayManager.prototype.unregisterDeviceResources = function () {
    debug_print("Unregistering Video Device Resources\n");
    this._texturePool.unregisterResourcePool();
    this._vertexBufferPool.unregisterResourcePool();
    this._videoBufferPool.unregisterResourcePool();
    this._indexBufferPool.unregisterResourcePool();
    this._effectPool.unregisterResourcePool();
    this._renderMethodPool.unregisterResourcePool();
    this._modelPool.unregisterResourcePool();
    this._imagePool.unregisterResourcePool();
    this._surfaceMaterialPool.unregisterResourcePool();
    this._shaderProgramPool.unregisterResourcePool();
};

/**
 * load font texture
 * @treturn Boolean always returns true
 */
DisplayManager.prototype.createDeviceResources = function () {
    //    this._pFontTexture = this._texturePool.
    //        loadResource("media\\textures\\font.tga");

    return true;
};
/**
 * destroy device resources
 * @treturn Boolean always returns true
 */
DisplayManager.prototype.destroyDeviceResources = function () {
    // first disable...
    this.disableDeviceResources();

    safe_release(this._pFontTexture);

    // then destroy...
    debug_print("Destroying Video Device Resources\n");
    this._pResourceManager.destroyResourceFamily(a.ResourcePoolManager.VideoResource);

    return true;
};

/**
 * restore device resources
 * @treturn Boolean always returns true
 */
DisplayManager.prototype.restoreDeviceResources = function () {
    debug_print("Restoring Video Device Resources\n");
    this._pResourceManager.restoreResourceFamily(a.ResourcePoolManager.VideoResource);
    return true;
};

/**
 * disable device resources
 * @treturn Boolean always returns true
 */
DisplayManager.prototype.disableDeviceResources = function () {
    debug_print("Disabling Video Device Resources\n");
    this._pResourceManager.disableResourceFamily(a.ResourcePoolManager.VideoResource);
    return true;
};

/**
 * begin render session
 * set size of render window
 * clearing render surface if needed
 */
DisplayManager.prototype.beginRenderSession = function () {

    this.setViewPort(0, 0, this._pEngine.pCanvas.width, this._pEngine.pCanvas.height);

    // clear screen if requested
    if (this._bClearEachFrame) {
        this.clearRenderSurface();
    }

    this.setDefaultRenderStates();
    this._renderQueue.reset();

    return true;
};

/**
 * sets vieport size; fX0,fY0 - sets upper-left point of viewport
 * @tparam fX0 - sets init x coordinate
 * @tparam fY0 - sets init y coordinate
 * @tparam fXSize - x size of viewport
 * @tparam fYSize - y size of vieport
 */

DisplayManager.prototype.setViewPort = function (fX0, fY0, fXSize, fYSize) {
    this._pDevice.viewport(fX0, fY0, fXSize, fYSize);
};

/**
 * ends render session
 * @treturn Boolean always return true
 */
DisplayManager.prototype.endRenderSession = function () {
    this._pDevice.flush();
    return true;
};

/**
 * sets defult render states
 */

DisplayManager.prototype.setDefaultRenderStates = function () {

    this._pDevice.setRenderState(a.renderStateType.SRCBLEND, a.BLEND.ONE);
    this._pDevice.setRenderState(a.renderStateType.DESTBLEND, a.BLEND.ONE);
    this._pDevice.setRenderState(a.renderStateType.CULLMODE, a.CULLMODE.CCW);

    //pDevice.setRenderState(D3DRS_SHADEMODE, D3DSHADE_GOURAUD);
    //lighting in shader
    this._pDevice.setRenderState(a.renderStateType.DITHERENABLE, false);

    this._pDevice.setRenderState(a.renderStateType.ZENABLE, true);
    this._pDevice.setRenderState(a.renderStateType.ZWRITEENABLE, true);
    this._pDevice.setRenderState(a.renderStateType.ZFUNC, a.CMPFUNC.LESS);

// initialize the world transform matrix as the identity

//var world = Mat4.create();
//Mat4.identity(world);

//var view = Mat4.create();
//Mat4.identity(view);

//var projection = Mat4.create();
//Mat4.identity(projection);
//this._pDevice.setTransform(D3DTS_WORLD , (D3DMATRIX*)&matrix);
//this._pDevice.setTransform(D3DTS_VIEW , (D3DMATRIX*)&matrix);
//this._pDevice.setTransform(D3DTS_PROJECTION  , (D3DMATRIX*)&matrix);
};

/**
 * class TLVertex represents vertices that have a transformed position,
 * diffuse color, specular color, and texture coordinates
 * By default fX,fY,fZ,fTu,fTv = 0., fW = 1.0
 * v4fSpecular,v4fColor = a.Color4f(0,0,0,1)
 * @ctor
 */
function TLVertex () {
    this.fX = 0.;
    this.fY = 0.;
    this.fZ = 0.;
    this.fW = 1.;

    this.v4fSpecular = new a.Color4f(0., 0., 0., 1.);
    this.v4fColor = new a.Color4f(0., 0., 0., 1.);

    this.fTu = 0.;
    this.fTv = 0.;
}

Object.defineProperty(TLVertex.prototype, "v4fSpecular", {
    set: function (value) {
        this.v4fSpecular[0] = value[0],
            this.v4fSpecular[1] = value[1], this.v4fSpecular[2] = value[2],
            this.v4fSpecular[3] = value[3];
    },
    get: function () {
        return this.v4fSpecular;
    }
});

Object.defineProperty(TLVertex.prototype, "v4fColor", {
    set: function (value) {
        this.v4fColor[0] = value[0],
            this.v4fColor[1] = value[1], this.v[2] = value[2],
            this.v4fColor[3] = value[3];
    },
    get: function () {
        return this.v4fColor;
    }
});

a.TLVertex = TLVertex;

/**
 * draw string sText with kegel fSize on screen with initial position (iX,iY)
 * @tparam Int iX
 * @tparam Int iY
 * @tparam String sText
 * @tparam Float fSize
 */
/*DisplayManager.prototype.drawString = function(iX,iY,sText,fSize){

 var iVertexFVF = (D3DFVF_XYZRHW | D3DFVF_DIFFUSE |
 D3DFVF_SPECULAR | D3DFVF_TEX1 );

 var pVertex = GEN_ARRAY(a.TLVertex,4);

 var iSizeX = a.settings.canvas.width;
 var iSizeY = a.settings.canvas.height;

 var nPolySize=iSizeX/80;

 // make sure innitial values will be on screen
 if ((iY>=iSizeY) || (iY+PolySize>=iSizeY)
 || (iX>=iSizeX) || (iX+PolySize>=iSizeX))
 return;

 // First square
 pVertex[0].x = iX;
 pVertex[0].y = iY+nPolySize;
 pVertex[0].v4fSpecular = [1,1,1,1];
 pVertex[0].v4fColor = [1,1,1,1];

 pVertex[1].x = iX+nPolySize;
 pVertex[1].y = iY+nPolySize;
 pVertex[1].v4fSpecular = [1,1,1,1];
 pVertex[1].v4fColor = [1,1,1,1];

 pVertex[2].x = iX;
 pVertex[2].y = iY;
 pVertex[2].v4fSpecular = [1,1,1,1];
 pVertex[2].v4fColor = [1,1,1,1];

 pVertex[3].x = iX+nPolySize;
 pVertex[3].y = iY;
 pVertex[3].v4fSpecular = [1,1,1,1];
 pVertex[3].v4fColor = [1,1,1,1];


 this._pDevice.setTexture( 0, this._pFontTexture.getTexture());

 //TODO: setTextureStateStageState not implemented
 this._pDevice.setTextureStageState( 0, D3DTSS_COLORARG1, D3DTA_TEXTURE );
 this._pDevice.setTextureStageState( 0, D3DTSS_COLOROP,   D3DTOP_MODULATE );
 this._pDevice.setTextureStageState( 0, D3DTSS_COLORARG2, D3DTA_DIFFUSE);

 this._pDevice.setTextureStageState( 0, D3DTSS_ALPHAARG1, D3DTA_TEXTURE );
 this._pDevice.setTextureStageState( 0, D3DTSS_ALPHAOP,   D3DTOP_SELECTARG1);
 this._pDevice.setTextureStageState( 0, D3DTSS_ALPHAARG2, D3DTA_DIFFUSE);


 this._pDevice.setVertexShader(0);
 this._pDevice.setFVF(iVertexFVF);

 var iTotalLetters = sText.length;
 var iCode;

 for (var i=0; i < iTotalLetters; i++){

 iCode =  sText.charCodeAt(i);

 // if we are in range
 if (TLVertex[3].x < MaxX){

 if( iCode >= 97 && chr<=122 )
 iCode -= 32; //transformation to capital letters

 //only capital letters
 if( iCode > 32 && iCode < 96 ){
 var fXPos,fYPos;

 //texture 8x8

 iCode -= 32;
 fXPos=(chr&7);
 fYPos=(chr>>3)&7;

 var step = 0.125;//1/8
 fXPos *= step;
 fYPos = 1. - (fYPos * step);

 pVertex[0].tu = fXPos;
 pVertex[0].tv = fYPos - step;
 pVertex[1].tu = fXPos + step;
 pVertex[1].tv = fYPos - step;
 pVertex[2].tu = fXPos;
 pVertex[2].tv = fYPos;
 pVertex[3].tu = fXPos + step;
 pVertex[3].tv = fYPos;

 pDevice.drawPrimitiveUP(a.PRIMTYPE.TRIANGLESTRIP, 2, pVertex);
 }
 }

 // move to next poly
 pVertex[0].x += PolySize;
 pVertex[1].x += PolySize;
 pVertex[2].x += PolySize;
 pVertex[3].x += PolySize;
 }
 };*/

/**
 * get free element from render queue
 * @treturn RenderEntry
 */
DisplayManager.prototype.openRenderQueue = function () {
    return this._renderQueue.lockRenderEntry();
};

/**
 * put pEntry in render queue
 * @tparam RenderEntry pEntry
 */
DisplayManager.prototype.closeRenderQueue = function (pEntry) {
    this._renderQueue.unlockRenderEntry(pEntry);
};

/**
 * process render queue
 */
DisplayManager.prototype.processRenderQueue = function () {
    this._renderQueue.execute();
};

/**
 * TODO: checkResourceFormatSupport
 */
DisplayManager.prototype.checkResourceFormatSupport =
    function (fmt, resType, dwUsage) {

        //not implemented yet
        //function(D3DFORMAT fmt, D3DRESOURCETYPE resType, DWORD dwUsage){

        /*bool result = true;
         LPDIRECT3D9 pD3D = TheGameHost.d3dInterface();
         const D3DCAPS9& devCaps = TheGameHost.d3dCaps();
         const D3DSURFACE_DESC& displayDesc = TheGameHost.d3dsdBackBuffer();

         if (FAILED(
         pD3D->CheckDeviceFormat(
         devCaps.AdapterOrdinal,
         devCaps.DeviceType,
         displayDesc.Format,
         dwUsage,
         resType,
         fmt)))
         {
         result=false;
         }

         return result;*/
        return true;
    }

a.DisplayManager = DisplayManager;
a.String2D = String2D;
a.Font2D = Font2D;