/// <reference path="akra.d.ts" />
declare module akra.addons {
    interface ISimpleGeometry {
        vertices: number[];
        type: EPrimitiveTypes;
        normals?: number[];
        texcoords?: number[];
        indices?: number[];
    }
    function createSimpleMeshFromUnknownData(pEngine: IEngine, name: string, pDecl: IVertexDeclaration, pData: Float32Array, eType: EPrimitiveTypes, pIndices?: Uint16Array, pMaterial?: IMaterial): IMesh;
    function createSimpleMeshFromSimpleGeometry(pEngine: IEngine, pGeometry: ISimpleGeometry, pMaterial?: IMaterial, name?: string): IMesh;
    function createSceneSurface(pScene: IScene3d, nCell?: number): ISceneModel;
    function createSceneSurface(pScene: IScene3d, nCellW?: number, nCellH?: number): ISceneModel;
    function createQuad(pScene: IScene3d, fSize?: number, v2UV?: IVec2): ISceneModel;
    function basis(pScene: IScene3d, eOptions?: number, fSize?: number): ISceneModel;
    function bone(pJoint: IJoint): ISceneModel;
    function lineCube(pScene: IScene3d, eOptions?: number): ISceneModel;
    function cube(pScene: IScene3d): ISceneModel;
    function cylinder(pScene3d: IScene3d, radiusTop?: number, radiusBottom?: number, height?: number, segmentsRadius?: number, segmentsHeight?: number, openEnded?: boolean): ISceneModel;
    function trifan(pScene3d: IScene3d, radius?: number, segments?: number): ISceneModel;
}
