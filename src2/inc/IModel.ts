#ifndef IMODEL_TS
#define IMODEL_TS

#include "ICollada.ts"

module akra {
    IFACE(IAnimationBase);
    IFACE(IAnimationBaseController);
    IFACE(ISceneNode);
    IFACE(IScene3d);
    IFACE(ISkeleton);
    IFACE(IMesh);

    export enum EModelFormats {
        UNKNOWN,
        COLLADA = 0x1000,
        OBJ = 0x2000
    }

    export interface IModelLoadOptions {

    }

    export interface IModel extends IResourcePoolItem {
        byteLength: uint;

        modelFormat: EModelFormats;

        loadResource(sFilename?: string, pOptions?: IModelLoadOptions): bool;
        attachToScene(pNode: ISceneNode): IModelEntry;
        attachToScene(pScene: IScene3d): IModelEntry;
    }
}

#endif

    // totalAnimations: uint;
    // totalMeshes: uint;
    // node: ISceneNode;

    // getAnimation(iAnim: uint): IAnimationBase;
    // setAnimation(iAnim: uint, pAnimation: IAnimationBase): void;
    // addAnimation(pAnimation: IAnimationBase): void;

    // getAnimationController(): IAnimationController;

    // getMesh(iMesh: uint): IMesh;
    // addMesh(pMesh: IMesh): void;

    // addNode(pNode: ISceneNode): void;

    // addSkeleton(pSkeleton: ISkeleton): void;
    
    // addToScene(pScene: IScene3d): bool;
 //    attachToScene(pNode: ISceneNode): bool;

    // getRootNodes(): ISceneNode[];

    // loadResource(sFilename?: string, pOptions?: IColladaLoadOptions, fnCallback?: (pModel: IModel) => void): bool;
    // loadAnimation(sFilename: string): bool;

    // //instead old method: applyShadow();
    // _setup(): bool;

    // _notifyFileLoaded(): uint;
    // _notifyFileLoad(): uint;
    // _totalFiles(): uint;