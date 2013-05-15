#ifndef IVIEWPORT_TS
#define IVIEWPORT_TS

#include "IViewportState.ts"

module akra {

    IFACE(IRect2d);
    IFACE(IColor);
    IFACE(IRenderTarget);
    IFACE(ICamera);
    IFACE(IRenderableObject);

    export enum EViewportTypes {
        DEFAULT = -1,
        DSVIEWPORT = 1,
        SHADOWVIEWPORT = 2
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

        update(): void;
        destroy(): void;

        startFrame(): void;
        renderObject(pRenderable: IRenderableObject): void;
        endFrame(): void;

        clear(iBuffers?: uint, cColor?: IColor, fDepth?: float, iStencil?: uint): void;

        getTarget(): IRenderTarget;
        getCamera(): ICamera;
        setCamera(pCamera: ICamera): bool;

        setDimensions(fLeft: float, fTop: float, fWidth: float, fHeight: float): bool;
        setDimensions(pRect: IRect2d): bool;

        getActualDimensions(): IRect2d;

        projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3;

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

        signal viewportDimensionsChanged(): void;
        signal viewportCameraChanged(): void;
    }
}

#endif