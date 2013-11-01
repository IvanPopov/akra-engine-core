#ifndef UTILSIMPLEGEOMETRYOBJCTS_TS
#define UTILSIMPLEGEOMETRYOBJCTS_TS

#include "scene/Scene3d.ts"
#include "model/Mesh.ts"

module akra.util {
        export function createSceneSurface(pScene: IScene3d, nCell?: uint): ISceneModel;
        export function createSceneSurface(pScene: IScene3d, nCellW?: uint, nCellH?: uint): ISceneModel;

        export function createQuad(pScene: IScene3d, fSize?: float): ISceneModel;


        export function createSceneSurface(pScene: IScene3d, nCellW?: uint = 10, nCellH?: uint = nCellW): ISceneModel {
                if(nCellW % 2 === 0) {
                        nCellW += 1;
                }

                if(nCellH % 2 === 0) {
                        nCellH += 1;
                }

            var nScaleX: uint = nCellW - 1;
            var nScaleY: uint = nCellH - 1;

            var pMesh: IMesh = null, 
                    pSubMesh: IMeshSubset = null;
            var iPos: uint = 0;
            var pVerticesData: Float32Array = new Float32Array((nCellW + nCellH) * 6);

            var fStepX: float = 1.0 / (nCellW - 1);
            var fStepY: float = 1.0 / (nCellH - 1);
            var n: uint = 0;

            for (var z: uint = 0; z < nCellH; ++ z) {
                pVerticesData[n]        = (-.5) * nScaleX;
                pVerticesData[n + 2]    = (z * fStepY -.5) * nScaleY;
                n += 3;
                
                pVerticesData[n]        = (.5) * nScaleX;
                pVerticesData[n + 2]    = (z * fStepY -.5) * nScaleY;
                n += 3;
            }

            for (var x: uint = 0; x < nCellW; ++ x) {
                pVerticesData[n]        = (x * fStepX -.5)  * nScaleX;
                pVerticesData[n + 2]    = (-.5) * nScaleY;
                n += 3;

                pVerticesData[n]        = (x * fStepX -.5) * nScaleX;
                pVerticesData[n + 2]    = (.5) * nScaleY;
                n += 3;
            }



            var pVertexIndicesData: Float32Array = new Float32Array((nCellW + nCellH) * 2);

            n = 0;
            for (var z: uint = 0; z < nCellH; ++ z) {            
                pVertexIndicesData[n ++]   = z * 2;
                pVertexIndicesData[n ++]   = z * 2 + 1;
            };

            for (var x: uint = 0; x < nCellW; ++ x) {
                pVertexIndicesData[n ++]   = nCellH * 2 + x * 2;
                pVertexIndicesData[n ++]   = nCellH * 2 + x * 2 + 1; 
            };

            var pEngine: IEngine = pScene.getManager().getEngine();

            pMesh = model.createMesh(pEngine, 'scene-surface', EMeshOptions.HB_READABLE);
            pSubMesh = pMesh.createSubset('scene-surface::main', EPrimitiveTypes.LINELIST);
            pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);
            pSubMesh.data.allocateIndex([VE_FLOAT('INDEX_POSITION')], pVertexIndicesData);
            pSubMesh.data.index('POSITION', 'INDEX_POSITION');

            pSubMesh.shadow = false;

            if((<core.Engine>pEngine).isDepsLoaded()){
                    pSubMesh.renderMethod.effect.addComponent("akra.system.plane");
            }
            else {
                    pScene.getManager().getEngine().bind(SIGNAL(depsLoaded), () => {
                            pSubMesh.renderMethod.effect.addComponent("akra.system.plane");
                    });
            }

            var pSceneModel: ISceneModel = pScene.createModel("scene-surface");
            pSceneModel.mesh = pMesh;

            return pSceneModel;
        }

        export function createQuad(pScene: IScene3d, fSize?: float = 20.): ISceneModel {
                var pMesh: IMesh = null,
                        pSubMesh: IMeshSubset = null;

            var pVerticesData: Float32Array = new Float32Array([
                                                     -fSize, 0., -fSize,
                                                      fSize, 0., -fSize,
                                                     -fSize, 0.,  fSize,
                                                      fSize, 0.,  fSize
                                                 ]);
            var pNormalsData: Float32Array = new Float32Array([
                                                      0., 1., 0.
                                                ]);
            var pVertexIndicesData: Float32Array = new Float32Array([
                                                                0., 1. , 2., 3.
                                                      ]);

            var pNormalIndicesData:Float32Array = new Float32Array([
                                                          0., 0., 0., 0.
                                                      ]);

                   var iPos: uint = 0,
                    iNorm: uint = 0;

            var pEngine: IEngine = pScene.getManager().getEngine();

            pMesh = model.createMesh(pEngine, 'quad', EMeshOptions.HB_READABLE);
            pSubMesh = pMesh.createSubset('quad::main', EPrimitiveTypes.TRIANGLESTRIP);

            iPos = pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);
            pSubMesh.data.allocateIndex([VE_FLOAT('INDEX0')], pVertexIndicesData);
            pSubMesh.data.index('POSITION', 'INDEX0');

            iNorm = pSubMesh.data.allocateData([VE_VEC3('NORMAL')], pNormalsData);
            pSubMesh.data.allocateIndex([VE_FLOAT('INDEX1')], pNormalIndicesData);

            
            pSubMesh.data.index('NORMAL', 'INDEX1');

            pSubMesh.shadow = false;

            if((<core.Engine>pEngine).isDepsLoaded()){
                    pSubMesh.renderMethod.effect.addComponent("akra.system.mesh_texture");
            }
            else {
                    pScene.getManager().getEngine().bind(SIGNAL(depsLoaded), () => {
                            pSubMesh.renderMethod.effect.addComponent("akra.system.mesh_texture");
                    });
            }

            var pMatrial: IMaterial = pSubMesh.renderMethod.surfaceMaterial.material;
            pMatrial.diffuse = Color.LIGHT_GRAY;
            pMatrial.ambient = new Color(0.7, 0.7, 0.7, 1.);
                pMatrial.specular = new Color(0.7, 0.7, 0.7 ,1);
                pMatrial.emissive = new Color(0., 0., 0., 1.);
            pMatrial.shininess = 30.;


            var pSceneModel: ISceneModel = pScene.createModel("quad");
            pSceneModel.mesh = pMesh;

            return pSceneModel;
        }

        export function basis(pScene, eOptions: int = EMeshOptions.HB_READABLE, fSize: float = 1.): ISceneModel {
            var pMesh: IMesh, pSubMesh: IMeshSubset, pMaterial: IMaterial;
            var iPos: int, iNorm: int;
            var pEngine: IEngine = pScene.getManager().getEngine();

            pMesh = model.createMesh(pEngine, "basis", eOptions);
            iNorm = pMesh.data.allocateData([VE_VEC3("NORMAL")], new Float32Array([1,0,0]));

            function createAxis(sName: string, pCoords: Float32Array, pColor: IColor): void {
                pSubMesh = pMesh.createSubset(sName, EPrimitiveTypes.LINELIST);
                
                iPos = pSubMesh.data.allocateData([VE_VEC3("POSITION")], pCoords);
                pSubMesh.data.allocateIndex([VE_FLOAT("INDEX0")],   new Float32Array([0,1]));
                pSubMesh.data.allocateIndex([VE_FLOAT("INDEX1")],   new Float32Array([0,0]));

                pSubMesh.data.index(iPos, "INDEX0");
                pSubMesh.data.index(iNorm, "INDEX1");

                //pSubMesh.applyFlexMaterial(sName + '-color');
                //pSubMesh.getFlexMaterial(sName + '-color');
                pMaterial = pSubMesh.material;
                pMaterial.emissive = pColor;
                pMaterial.ambient = pColor;
                pMaterial.diffuse = pColor;
                pMaterial.shininess = 100.;

                pSubMesh.shadow = false;

                if((<core.Engine>pEngine).isDepsLoaded()){
                            pSubMesh.effect.addComponent("akra.system.mesh_texture");
                    }
                    else {
                            pScene.getManager().getEngine().bind(SIGNAL(depsLoaded), () => {
                                    pSubMesh.effect.addComponent("akra.system.mesh_texture");
                            });
                    }
            }

            createAxis('basis::X-axis', new Float32Array([0,0,0, 1 * fSize,0,0]), Color.RED);
            createAxis('basis::Y-axis', new Float32Array([0,0,0, 0,1 * fSize,0]), Color.GREEN);
            createAxis('basis::Z-axis', new Float32Array([0,0,0, 0,0,1 * fSize]), Color.BLUE);

            var pSceneModel: ISceneModel = pScene.createModel("basis");
            pSceneModel.mesh = pMesh;

            return pSceneModel;
        }

        export function bone(pJoint: IJoint): ISceneModel {

                var pScene: IScene3d = pJoint.scene;
                var pParent: INode = <INode>pJoint.parent;
                                        
                if (isNull(pParent)) {
                        return null;
                }

                pParent.update();
                pJoint.update();

                // return basis(pScene);

                var pMesh: IMesh, pSubMesh: IMeshSubset, pMaterial: IMaterial;
            var iPos: int, iNorm: int;
            var pEngine: IEngine = pScene.getManager().getEngine();
            var v: IVec3 = pJoint.worldPosition.subtract(pParent.worldPosition, vec3());

            pMesh = model.createMesh(pEngine, "bone-" + pJoint.name, EMeshOptions.HB_READABLE);
        pSubMesh = pMesh.createSubset("bone", EPrimitiveTypes.LINELIST);
        
        // pJoint.localOrientation.inverse(quat4()).multiplyVec3(v);

        // var s:IVec3 = pJoint.localScale;
        // v.x *= 1./s.x;
        // v.y *= 1./s.y;
        // v.z *= 1./s.z;

        // console.log(pJoint.name, "-->", pParent.name, pJoint.worldPosition.toString(), pParent.worldPosition.toString(), v.toString());
        
        pSubMesh.data.allocateData([VE_VEC3("POSITION")], new Float32Array([0,0,0, v.x, v.y, v.z]));
        pSubMesh.data.allocateIndex([VE_FLOAT("INDEX0")],   new Float32Array([0,1]));

        pSubMesh.data.index("POSITION", "INDEX0");

        pMaterial = pSubMesh.material;
        (<IColor>pMaterial.emissive).set(Color.WHITE);

        pSubMesh.shadow = false;

        pSubMesh.effect.addComponent("akra.system.mesh_texture");
            

            var pSceneModel: ISceneModel = pScene.createModel("bone-" + pJoint.name);
            pSceneModel.mesh = pMesh;

            return pSceneModel;
        }


        export function lineCube(pScene, eOptions?: int): ISceneModel {
                var pMesh: IMesh, pSubMesh: IMeshSubset, pMaterial: IMaterial;
            var iPos: int, iNorm: int;
            var pEngine: IEngine = pScene.getManager().getEngine();

            pMesh = model.createMesh(pEngine, "basis", eOptions || EMeshOptions.HB_READABLE);
            iNorm = pMesh.data.allocateData([VE_VEC3("NORMAL")], new Float32Array([1,0,0]));

            pSubMesh = pMesh.createSubset("cube", EPrimitiveTypes.LINELIST);

            pSubMesh.data.allocateAttribute([VE_VEC3("POSITION")], new Float32Array([
                    //front
                    -1,        -1,        -1,
                    1,        -1,        -1,

                    1,        -1,        -1,
                    1,        1,        -1,

                    1,        1,        -1,
                    -1,        1,        -1,

                    -1,        1,        -1,
                    -1,        -1,        -1,

                    //bottom
                    -1,        -1,        1,
                    1,        -1,        1,

                    1,        -1,        1,
                    1,        1,        1,

                    1,        1,        1,
                    -1,        1,        1,

                    -1,        1,        1,
                    -1,        -1,        1,


                    //left
                    -1,        -1,        -1,        
                    -1,        1,        -1,        

                    -1,        1,        -1,        
                    -1,        1,        1,        

                    -1,        1,        1,        
                    -1,        -1,        1,        

                    -1,        -1,        1,        
                    -1,        -1,        -1,        

                    //right
                    1,        -1,        -1,        
                    1,        1,        -1,        

                    1,        1,        -1,        
                    1,        1,        1,        

                    1,        1,        1,        
                    1,        -1,        1,        

                    1,        -1,        1,        
                    1,        -1,        -1
            ]));

            pMaterial = pSubMesh.material;
        (<IColor>pMaterial.emissive).set(1.);
        (<IColor>pMaterial.ambient).set(1.);
        (<IColor>pMaterial.diffuse).set(1.);
        pMaterial.shininess = 100.;

        pSubMesh.shadow = false;

             if((<core.Engine>pEngine).isDepsLoaded()){
                    pSubMesh.effect.addComponent("akra.system.mesh_texture");
            }
            else {
                    pScene.getManager().getEngine().bind(SIGNAL(depsLoaded), () => {
                            pSubMesh.effect.addComponent("akra.system.mesh_texture");
                    });
            }


            var pSceneModel: ISceneModel = pScene.createModel("basis");
            pSceneModel.mesh = pMesh;

            return pSceneModel;
        }

        // export  
        // function cube (pScene: IScene3d, eOptions?: int, fSize: float = 1.) {
        //     var pMesh: IMesh, pSubMesh: IMeshSubset;
        //     var iPos: int, iNorm: int;

        //     var pVerticesData = new Float32Array([
        //                                              -0.5, 0.5, 0.5,
        //                                              0.5, 0.5, 0.5,
        //                                              -0.5, -0.5, 0.5,
        //                                              0.5, -0.5, 0.5,
        //                                              -0.5, 0.5, -0.5,
        //                                              0.5, 0.5, -0.5,
        //                                              -0.5, -0.5, -0.5,
        //                                              0.5, -0.5, -0.5
        //                                          ]);

        //     for (var i: int = 0; i < pVerticesData.length; ++ i) {
        //             pVerticesData[i] *= fSize;
        //     }

        //     var pMapData = new Float32Array([
        //                                         0, 0, 0,
        //                                         1, 0, 0,
        //                                         0, 1, 0,
        //                                         1, 1, 0
        //                                     ]);

        //     var pNormalsData = new Float32Array([
        //                                             1.0, 0.0, 0.0,
        //                                             -1.0, 0.0, 0.0,
        //                                             0.0, 1.0, 0.0,
        //                                             0.0, -1.0, 0.0,
        //                                             0.0, 0.0, 1.0,
        //                                             0.0, 0.0, -1.0
        //                                         ]);
        //     var pVertexIndicesData = new Float32Array([
        //                                                   0, 2, 3, 0, 3, 1,//front
        //                                                   0, 1, 5, 0, 5, 4,//top
        //                                                   6, 7, 3, 6, 3, 2,//bottom
        //                                                   0, 4, 6, 0, 6, 2,//left
        //                                                   3, 7, 5, 3, 5, 1,//right
        //                                                   5, 7, 6, 5, 6, 4 //back
        //                                               ]);
        //     var pNormalIndicesData = new Float32Array([
        //                                                   4, 4, 4, 4, 4, 4,
        //                                                   2, 2, 2, 2, 2, 2,
        //                                                   3, 3, 3, 3, 3, 3,
        //                                                   1, 1, 1, 1, 1, 1,
        //                                                   0, 0, 0, 0, 0, 0,
        //                                                   5, 5, 5, 5, 5, 5
        //                                               ]);

        //     var pMapIndices = new Float32Array([
        //                                            0, 2, 3, 0, 3, 1,
        //                                            0, 2, 3, 0, 3, 1,
        //                                            0, 2, 3, 0, 3, 1,
        //                                            0, 2, 3, 0, 3, 1,
        //                                            0, 2, 3, 0, 3, 1,
        //                                            0, 2, 3, 0, 3, 1
        //                                        ]);

        //     var pSerialData = new Float32Array(pNormalIndicesData.length);

        //     for (var i = 0; i < pSerialData.length; i++) {
        //         pSerialData[i] = i % 3;
        //     };

        //     var iNorm, iPos, iMap;

        //     pMesh = new a.Mesh(pEngine, eOptions || a.Mesh.VB_READABLE, sName || 'cube');
        //     pSubMesh = pMesh.createSubset('cube::main');

        //     iPos  = pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);
        //     iNorm = pSubMesh.data.allocateData([VE_VEC3('NORMAL')], pNormalsData);
        //     iMap  = pSubMesh.data.allocateData([VE_VEC3('TEXCOORD0')], pMapData);

        //     pSubMesh.data.allocateIndex([VE_FLOAT('INDEX0')], pVertexIndicesData);
        //     pSubMesh.data.allocateIndex([VE_FLOAT('INDEX1')], pNormalIndicesData);
        //     pSubMesh.data.allocateIndex([VE_FLOAT('INDEX2')], pMapIndices);

        //     pSubMesh.data.index(iPos,  'INDEX0');
        //     pSubMesh.data.index(iNorm, 'INDEX1');
        //     pSubMesh.data.index(iMap,  'INDEX2');

        //     // pSubMesh.applyFlexMaterial('default');
        //     var pMat = pSubMesh.material;
            
        //     pMat.diffuse = new a.Color4f(0.5, 0., 0., 1.);
        //     pMat.ambient = new a.Color4f(0.7, 0., 0., 1.);
        //     pMat.specular = new a.Color4f(1., 0.7, 0. ,1);
        //     pMat.shininess = 30.;

        //     pSubMesh.effect.create();
        //     pSubMesh.effect.use("akra.system.mesh_texture");
        //     pSubMesh.effect.use("akra.system.prepareForDeferredShading");
        //     //trace(pSubMesh._pMap.toString());

        //     return pMesh;
        // }

}

#endif


// var pMesh: IMesh;
//                         var pEngine: IEngine = this.getEngine();

//                         var pVerticesData = new Float32Array([
//                                         -0.5, 0.5, 0.5,
//                                         0.5, 0.5, 0.5,
//                                         -0.5, -0.5, 0.5,
//                                         0.5, -0.5, 0.5,
//                                         -0.5, 0.5, -0.5,
//                                         0.5, 0.5, -0.5,
//                                         -0.5, -0.5, -0.5,
//                                         0.5, -0.5, -0.5
//                     ]);

//                         var pVertexIndicesData = new Float32Array([
//                                         0, 2, 3, 0, 3, 1,        /*front*/
//                                         0, 1, 5, 0, 5, 4,        /*top*/
//                                         6, 7, 3, 6, 3, 2,        /*bottom*/
//                                         0, 4, 6, 0, 6, 2,        /*left*/
//                                         3, 7, 5, 3, 5, 1,        /*right*/
//                                         5, 7, 6, 5, 6, 4         /*back*/
//                                 ]);

//                         var pNormalsData = new Float32Array([
//                                         1.0, 0.0, 0.0,
//                                         -1.0, 0.0, 0.0,
//                                         0.0, 1.0, 0.0,
//                                         0.0, -1.0, 0.0,
//                                         0.0, 0.0, 1.0,
//                                         0.0, 0.0, -1.0
//                     ]);

//                     var pNormalIndicesData = new Float32Array([
//                                         4, 4, 4, 4, 4, 4,
//                                         2, 2, 2, 2, 2, 2,
//                                         3, 3, 3, 3, 3, 3,
//                                         1, 1, 1, 1, 1, 1,
//                                         0, 0, 0, 0, 0, 0,
//                                         5, 5, 5, 5, 5, 5
//                                 ]);

//                         var pMapData = new Float32Array([
//                         0, 0, 0,
//                         1, 0, 0,
//                         0, 1, 0,
//                         1, 1, 0
//                     ]);

//                         //UV map
//                         /*-----------------------------------------------------*
//                      *        *        *        *        *        *        *
//                      *        *        *        *        *        *        *
//                      *        *        *        *        *        *        *
//                      *------------------------------------------------------*/


//                         var pMapData = new Float32Array([
//                         0, 0, 0,
//                         1, 0, 0,
//                         0, 1, 0,
//                         1, 1, 0
//                     ]);

//                         var pMapIndices = new Float32Array([
//                                         0, 2, 3, 0, 3, 1,
//                                         0, 2, 3, 0, 3, 1,
//                                         0, 2, 3, 0, 3, 1,
//                                         0, 2, 3, 0, 3, 1,
//                                         0, 2, 3, 0, 3, 1,
//                                         0, 2, 3, 0, 3, 1
//                 ]);

//                         var pColorData = new Float32Array([
//                                         1.0, 0.0, 0.0, /*red*/
//                                         0.0, 1.0, 0.0, /*green*/
//                                         0.0, 0.0, 1.0, /*blue*/

//                                         1.0, 1.0, 0.0, /*orange*/
//                                         1.0, 0.0, 1.0, /*purple*/
//                                         0.0, 1.0, 1.0  /*turquoise*/
//                                 ]);

//                         var pColorIndices = pNormalIndicesData;
//                         var pSerialData = new Float32Array(pNormalIndicesData.length);

//                     for (var i = 0; i < pSerialData.length; i++) {
//                         pSerialData[i] = i % 3;
//                     };

//                     var iNorm: int, 
//                             iPos: int, 
//                             iMap: int,
//                             iColor: int;

//                     pMesh = model.createMesh(pEngine, "cube", eOptions || EMeshOptions.HB_READABLE);
//                     pSubMesh = pMesh.createSubset();


//                 iPos  = pSubMesh.data.allocateData([VE_VEC3("POSITION")], pVerticesData);
//                     iNorm = pSubMesh.data.allocateData([VE_VEC3("NORMAL")], pNormalsData);
//                     iMap  = pSubMesh.data.allocateData([VE_VEC3("TEXCOORD0")], pMapData);
//                     iColor  = pSubMesh.data.allocateData([VE_VEC3("COLOR0")], pColorData);

//                     pSubMesh.data.allocateIndex([VE_FLOAT("INDEX0")], pVertexIndicesData);
//                     pSubMesh.data.allocateIndex([VE_FLOAT("INDEX1")], pNormalIndicesData);
//                     pSubMesh.data.allocateIndex([VE_FLOAT("INDEX2")], pMapIndices);
//                     pSubMesh.data.allocateIndex([VE_FLOAT("INDEX3")], pColorIndices);

//                     pSubMesh.data.index(iPos,   "INDEX0");
//                     pSubMesh.data.index(iNorm,  "INDEX1");
//                     pSubMesh.data.index(iMap,   "INDEX2");
//                     pSubMesh.data.index(iColor, "INDEX3");

//                     pSubMesh.shadow = false;

//                     if((<core.Engine>pEngine).isDepsLoaded()){
//                             pSubMesh.renderMethod.effect.addComponent("akra.system.mesh_texture");
//                     }
//                     else {
//                             pScene.getManager().getEngine().bind(SIGNAL(depsLoaded), () => {
//                                     pSubMesh.renderMethod.effect.addComponent("akra.system.mesh_texture");
//                             });
//                     }

//                     var pMatrial: IMaterial = pSubMesh.renderMethod.surfaceMaterial.material;

//                     pMatrial.diffuse = Color.LIGHT_GRAY;
//                     pMatrial.ambient = new Color(0.7, 0.7, 0.7, 1.);
//                         pMatrial.specular = new Color(0.7, 0.7, 0.7 ,1);
//                         pMatrial.emissive = new Color(0., 0., 0., 1.);
//                     pMatrial.shininess = 30.;


//                     var pSceneModel: ISceneModel = pScene.createModel("cube");
//                     pSceneModel.mesh = pMesh;

//                     return pSceneModel;