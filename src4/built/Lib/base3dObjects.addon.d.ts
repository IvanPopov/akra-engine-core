/// <reference path="akra.d.ts" />
declare module akra.addons {
    function createSceneSurface(pScene: akra.IScene3d, nCell?: number): akra.ISceneModel;
    function createSceneSurface(pScene: akra.IScene3d, nCellW?: number, nCellH?: number): akra.ISceneModel;
    function createQuad(pScene: akra.IScene3d, fSize?: number): akra.ISceneModel;
    function basis(pScene: akra.IScene3d, eOptions?: number, fSize?: number): akra.ISceneModel;
    function bone(pJoint: akra.IJoint): akra.ISceneModel;
    function lineCube(pScene: akra.IScene3d, eOptions?: number): akra.ISceneModel;
}
