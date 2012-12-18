#ifndef IRENDERER_TS
#define IRENDERER_TS

module akra {

    IFACE(IAFXComponent);
    IFACE(IAFXEffect);
    IFACE(IRenderableObject);
    IFACE(IRenderSnapshot);
    IFACE(ISceneObject);
    IFACE(IBufferMap);
    IFACE(IShaderProgram);
    IFACE(ISurfaceMaterial);
    IFACE(IVertexData);
    IFACE(IVertexBuffer);
    IFACE(ITexture);
    IFACE(IIndexBuffer);
    IFACE(IRenderResource);
    IFACE(IRenderEntry);
    IFACE(IFrameBuffer);
    IFACE(IViewport);
    IFACE(IColor);
    IFACE(IEngine);


	//API SPECIFIFC CONSTANTS

	export enum EPrimitiveTypes {
        POINTLIST = 0,
        LINELIST,
        LINELOOP,
        LINESTRIP,
        TRIANGLELIST,
        TRIANGLESTRIP,
        TRIANGLEFAN
    };

    // export enum EGLSpecifics {
    //     UNPACK_ALIGNMENT = 0x0CF5,
    //     PACK_ALIGNMENT = 0x0D05,
    //     UNPACK_FLIP_Y_WEBGL = 0x9240,
    //     UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241,
    //     CONTEXT_LOST_WEBGL = 0x9242,
    //     UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243,
    //     BROWSER_DEFAULT_WEBGL = 0x9244
    // };

    // export enum EBufferMasks {
    //     DEPTH_BUFFER_BIT               = 0x00000100,
    //     STENCIL_BUFFER_BIT             = 0x00000400,
    //     COLOR_BUFFER_BIT               = 0x00004000
    // };

    // export enum EBufferUsages {
    //     STREAM_DRAW = 0x88E0,
    //     STATIC_DRAW = 0x88E4,
    //     DYNAMIC_DRAW = 0x88E8
    // };

    // export enum EBufferTypes {
    //     ARRAY_BUFFER = 0x8892,
    //     ELEMENT_ARRAY_BUFFER = 0x8893,
    //     FRAME_BUFFER = 0x8D40,
    //     RENDER_BUFFER = 0x8D41
    // };

    // export enum EAttachmentTypes {
    //     COLOR_ATTACHMENT0 = 0x8CE0,
    //     DEPTH_ATTACHMENT = 0x8D00,
    //     STENCIL_ATTACHMENT = 0x8D20,
    //     DEPTH_STENCIL_ATTACHMENT = 0x821A
    // };

    // export enum ERenderStates {
    //     ZENABLE = 7,
    //     ZWRITEENABLE = 14,
    //     SRCBLEND = 19,
    //     DESTBLEND = 20,
    //     CULLMODE = 22,
    //     ZFUNC = 23,
    //     DITHERENABLE = 26,
    //     ALPHABLENDENABLE = 27,
    //     ALPHATESTENABLE
    // };

    // export enum EBlendModes {
    //     ZERO = 0,
    //     ONE = 1,
    //     SRCCOLOR = 0x0300,
    //     INVSRCCOLOR = 0x301,
    //     SRCALPHA = 0x0302,
    //     INVSRCALPHA = 0x0303,
    //     DESTALPHA = 0x0304,
    //     INVDESTALPHA = 0x0305,
    //     DESTCOLOR = 0x0306,
    //     INVDESTCOLOR = 0x0307,
    //     SRCALPHASAT = 0x0308
    // };

    // export enum ECmpFuncs {
    //     NEVER = 1,
    //     LESS = 2,
    //     EQUAL = 3,
    //     LESSEQUAL = 4,
    //     GREATER = 5,
    //     NOTEQUAL = 6,
    //     GREATEREQUAL = 7,
    //     ALWAYS = 8
    // };

    // export enum ECullModes {
    //     NONE = 0,
    //     CW = 0x404, //FRONT
    //     CCW = 0x0405, //BACK
    //     FRONT_AND_BACK = 0x0408
    // };

    //END OF API SPECIFIC

	// export enum ERenderStages {
	// 	SHADOWS = 2,
	// 	LIGHTING,
	// 	GLOBALPOSTEFFECTS,
	// 	DEFAULT
	// }

    export interface IRenderer {
        getEngine(): IEngine;

        debug(bValue?: bool): bool;
        enableAPITrace(): bool;
        
        isDebug(): bool;
        isValid(): bool;

        getError();

        clearFrameBuffer(iBuffer: int, cColor: IColor, iDepth: int): void;

        _disableAllTextureUnits(): void;
        _disableTextureUnitsFrom(iUnit: uint): void;

        _initRenderTargets(): void;
        _updateAllRenderTargets(): void;

        _setViewport(pViewport: IViewport): void;
        _getViewport(): IViewport;

    }
}

#endif
