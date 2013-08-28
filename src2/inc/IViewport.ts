#ifndef IVIEWPORT_TS
#define IVIEWPORT_TS

#include "IViewportState.ts"

module akra {

    IFACE(IRect2d);
    IFACE(IColor);
    IFACE(IRenderTarget);
    IFACE(ICamera);
    IFACE(IRenderableObject);

    export interface IDepthRange{
        min: float;
        max: float;
    };

    export enum EViewportTypes {
        DEFAULT = -1,
        DSVIEWPORT = 1,
        SHADOWVIEWPORT = 2,
        COLORVIEWPORT,
        TEXTUREVIEWPORT
    }

    export enum E3DEventTypes {
        CLICK = 0x01
    }

    export interface IViewport extends IEventProvider {
        left: float;
        top: float;
        width: float;
        height: float;

        //in pixels
        actualLeft: uint;
        actualTop: uint;
        actualWidth: uint;
        actualHeight: uint;

        zIndex: int;

        backgroundColor: IColor;
        depthClear: float;

        readonly type: EViewportTypes;

        update(): void;
        destroy(): void;

        startFrame(): void;
        renderObject(pRenderable: IRenderableObject): void;
        endFrame(): void;

        clear(iBuffers?: uint, cColor?: IColor, fDepth?: float, iStencil?: uint): void;

        enableSupportFor3DEvent(eType: E3DEventTypes): bool;

        getTarget(): IRenderTarget;
        getCamera(): ICamera;
        setCamera(pCamera: ICamera): bool;
        getDepth(x: uint, y: uint): float;
        getDepthRange(): IDepthRange;

        setDimensions(fLeft: float, fTop: float, fWidth: float, fHeight: float): bool;
        setDimensions(pRect: IRect2d): bool;

        getActualDimensions(): IRect2d;

        projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3;
        unprojectPoint(x: uint, y: uint, v3fDestination?: IVec3): IVec3;
        unprojectPoint(pPos: IPoint, v3fDestination?: IVec3): IVec3;

        //iBuffers=FBT_COLOUR|FBT_DEPTH
        setClearEveryFrame(isClear: bool, iBuffers?: uint): void;
        getClearEveryFrame(): bool;
        getClearBuffers(): uint;

        setDepthParams(bDepthTest: bool, bDepthWrite: bool, eDepthFunction: ECompareFunction): void;
        setCullingMode(eCullingMode: ECullingMode): void;

        setAutoUpdated(bValue?: bool): void;
        isAutoUpdated(): bool;

        isUpdated(): bool;

        _clearUpdatedFlag(): void;
        _updateImpl(): void;

        _getNumRenderedPolygons(): uint;
        _updateDimensions(pDimensions: IRect2d): void;

        _getViewportState(): IViewportState;
        _setTarget(pTarget: IRenderTarget): void;


        signal viewportDimensionsChanged(): void;
        signal viewportCameraChanged(): void;
        signal render(pTechnique: IRenderTechnique, iPass: int, pRenderable: IRenderableObject, pSceneObject: ISceneObject);

        signal click(x: uint, y: uint): void;
    }
}

#endif