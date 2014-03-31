/// <reference path="akra.d.ts" />
declare module akra.addons {
    function createSceneSurface(pScene: IScene3d, nCell?: number): ISceneModel;
    function createSceneSurface(pScene: IScene3d, nCellW?: number, nCellH?: number): ISceneModel;
    function createQuad(pScene: IScene3d, fSize?: number, v2UV?: IVec2): ISceneModel;
    function basis(pScene: IScene3d, eOptions?: number, fSize?: number): ISceneModel;
    function bone(pJoint: IJoint): ISceneModel;
    function lineCube(pScene: IScene3d, eOptions?: number): ISceneModel;
}
