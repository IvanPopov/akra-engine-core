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

	    pSubMesh.hasShadow = false;

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

	    pSubMesh.hasShadow = false;

	    if((<core.Engine>pEngine).isDepsLoaded()){
	    	pSubMesh.renderMethod.effect.addComponent("akra.system.mesh_texture");
	    }
	    else {
	    	pScene.getManager().getEngine().bind(SIGNAL(depsLoaded), () => {
	    		pSubMesh.renderMethod.effect.addComponent("akra.system.mesh_texture");
	    	});
	    }

	    var pMatrial: IMaterial = pSubMesh.renderMethod.surfaceMaterial.material;
	    pMatrial.diffuse = Color.ORANGE;
	    pMatrial.ambient = new Color(0.7, 0., 0., 1.);
		pMatrial.specular = new Color(1., 0.7, 0. ,1);
		pMatrial.emissive = new Color(0., 0., 0., 1.);
	    pMatrial.shininess = 30.;


	    var pSceneModel: ISceneModel = pScene.createModel("quad");
	    pSceneModel.mesh = pMesh;

	    return pSceneModel;
	}

	export function basis(pScene, eOptions?: int): ISceneModel {
	    var pMesh: IMesh, pSubMesh: IMeshSubset, pMaterial: IMaterial;
	    var iPos: int, iNorm: int;
	    var pEngine: IEngine = pScene.getManager().getEngine();

	    pMesh = model.createMesh(pEngine, "basis", eOptions || EMeshOptions.HB_READABLE);
	    iNorm = pMesh.data.allocateData([VE_VEC3("NORMAL")], new Float32Array([1,0,0]));

	    function createAxis(sName: string, pCoords: Float32Array, pColor: IColor): void {
	        pSubMesh = pMesh.createSubset(sName, EPrimitiveTypes.LINELIST);
	        
	        iPos = pSubMesh.data.allocateData([VE_VEC3("POSITION")], pCoords);
	        pSubMesh.data.allocateIndex([VE_FLOAT("INDEX0")],   new Float32Array([0,1]));
	        pSubMesh.data.allocateIndex([VE_FLOAT("INDEX1")],   new Float32Array([0,0]));
	        pSubMesh.data.index(iPos, "INDEX0");
	        pSubMesh.data.index(iNorm, "INDEX1");

	        //pSubMesh.applyFlexMaterial(sName + '-color');
	        pMaterial = pSubMesh.material;//pSubMesh.getFlexMaterial(sName + '-color');
	        pMaterial.emissive = pColor;
	        pMaterial.ambient = pColor;
	        pMaterial.diffuse = pColor;
	        pMaterial.shininess = 100.;

	        pSubMesh.hasShadow = false;

	        if((<core.Engine>pEngine).isDepsLoaded()){
		    	pSubMesh.effect.addComponent("akra.system.mesh_texture");
		    }
		    else {
		    	pScene.getManager().getEngine().bind(SIGNAL(depsLoaded), () => {
		    		pSubMesh.effect.addComponent("akra.system.mesh_texture");
		    	});
		    }
	    }

	    createAxis('basis::X-axis', new Float32Array([0,0,0, 1,0,0]), Color.RED);
	    createAxis('basis::Y-axis', new Float32Array([0,0,0, 0,1,0]), Color.GREEN);
	    createAxis('basis::Z-axis', new Float32Array([0,0,0, 0,0,1]), Color.BLUE);

	    var pSceneModel: ISceneModel = pScene.createModel("basis");
	    pSceneModel.mesh = pMesh;

	    return pSceneModel;
	}
}

#endif