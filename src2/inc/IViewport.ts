#ifndef IVIEWPORT_TS
#define IVIEWPORT_TS

module akra {

    IFACE(IRect2d);
    IFACE(IColor);
    IFACE(IRenderTarget);

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

        signal updateDimensions(pDimensions: IRect2d): void;
        signal update(): void;

        clear(iBuffers?: uint, cColor?: IColor, iDepth?: float): void;

        getTarget(): IRenderTarget;
        getCamera(): ICamera;
        setCamera(pCamera: ICamera): bool;

        setDimensions(fLeft: float, fTop: float, fWidth: float, fHeight: float): bool;
        setDimensions(pRect: IRect2d): bool;

        getActualDimensions(): IRect2d;

        //iBuffers=FBT_COLOUR|FBT_DEPTH
        setClearEveryFrame(isClear: bool, iBuffers?: uint): void;
        getClearEveryFrame(): bool;

        setAutoUpdated(bValue?: bool): void;
        isAutoUpdated(): bool;

        isUpdated(): bool;
        clearUpdatedFlag(): void;
        getNumRenderedFaces(): uint;
    }
}

#endif