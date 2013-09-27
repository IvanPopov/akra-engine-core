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

    export interface IViewport extends IEventProvider, IClickable {
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

        hide(bValue?: bool): void;

        startFrame(): void;
        renderObject(pRenderable: IRenderableObject): void;
        endFrame(): void;

        clear(iBuffers?: uint, cColor?: IColor, fDepth?: float, iStencil?: uint): void;

        enableSupportFor3DEvent(iType: int): int;
        is3DEventSupported(eType: E3DEventTypes): bool;
        touch(): void;

        pick(x: uint, y: uint): IRIDPair;

        getObject(x: uint, y: uint): ISceneObject;
        getRenderable(x: uint, y: uint): IRenderableObject;

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
        /**
         * Is mouse under the viewport?
         */
        isMouseCaptured(): bool;

        _clearUpdatedFlag(): void;
        _updateImpl(): void;

        _getNumRenderedPolygons(): uint;
        _updateDimensions(pDimensions: IRect2d): void;

        _getViewportState(): IViewportState;
        _setTarget(pTarget: IRenderTarget): void;


        signal viewportDimensionsChanged(): void;
        signal viewportCameraChanged(): void;
        signal render(pTechnique: IRenderTechnique, iPass: int, pRenderable: IRenderableObject, pSceneObject: ISceneObject);
    }
}

#endif