/// <reference path="../../../build/akra.d.ts" />

module akra.addons {
	import VE = data.VertexElement;
	import Color = color.Color;

	export function createSceneSurface(pScene: IScene3d, nCell?: uint): ISceneModel;
	export function createSceneSurface(pScene: IScene3d, nCellW?: uint, nCellH?: uint): ISceneModel;

	export function createSceneSurface(pScene: IScene3d, nCellW: uint = 10, nCellH: uint = nCellW): ISceneModel {
		if (nCellW % 2 === 0) {
			nCellW += 1;
		}

		if (nCellH % 2 === 0) {
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

		for (var z: uint = 0; z < nCellH; ++z) {
			pVerticesData[n] = (-.5) * nScaleX;
			pVerticesData[n + 2] = (z * fStepY - .5) * nScaleY;
			n += 3;

			pVerticesData[n] = (.5) * nScaleX;
			pVerticesData[n + 2] = (z * fStepY - .5) * nScaleY;
			n += 3;
		}

		for (var x: uint = 0; x < nCellW; ++x) {
			pVerticesData[n] = (x * fStepX - .5) * nScaleX;
			pVerticesData[n + 2] = (-.5) * nScaleY;
			n += 3;

			pVerticesData[n] = (x * fStepX - .5) * nScaleX;
			pVerticesData[n + 2] = (.5) * nScaleY;
			n += 3;
		}



		var pVertexIndicesData: Float32Array = new Float32Array((nCellW + nCellH) * 2);

		n = 0;
		for (var z: uint = 0; z < nCellH; ++z) {
			pVertexIndicesData[n++] = z * 2;
			pVertexIndicesData[n++] = z * 2 + 1;
		};

		for (var x: uint = 0; x < nCellW; ++x) {
			pVertexIndicesData[n++] = nCellH * 2 + x * 2;
			pVertexIndicesData[n++] = nCellH * 2 + x * 2 + 1;
		};

		var pEngine: IEngine = pScene.getManager().getEngine();

		pMesh = model.createMesh(pEngine, 'scene-surface', EMeshOptions.HB_READABLE);
		pSubMesh = pMesh.createSubset('scene-surface::main', EPrimitiveTypes.LINELIST);
		pSubMesh.getData().allocateData([VE.float3('POSITION')], pVerticesData);
		pSubMesh.getData().allocateIndex([VE.float('INDEX_POSITION')], pVertexIndicesData);
		pSubMesh.getData().index('POSITION', 'INDEX_POSITION');

		pSubMesh.setShadow(false);

		if ((<core.Engine>pEngine).isDepsLoaded()) {
			pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.plane");
		}
		else {
			pScene.getManager().getEngine().depsLoaded.connect(() => {
				pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.plane");
			});
		}

		var pSceneModel: ISceneModel = pScene.createModel("scene-surface");
		pSceneModel.setMesh(pMesh);

		return pSceneModel;
	}

	export function createQuad(pScene: IScene3d, fSize: float = 20.): ISceneModel {
		var pMesh: IMesh = null,
			pSubMesh: IMeshSubset = null;

		var pVerticesData: Float32Array = new Float32Array([
			-fSize, 0., -fSize,
			fSize, 0., -fSize,
			-fSize, 0., fSize,
			fSize, 0., fSize
		]);
		var pNormalsData: Float32Array = new Float32Array([
			0., 1., 0.
		]);
		var pVertexIndicesData: Float32Array = new Float32Array([
			0., 1., 2., 3.
		]);

		var pNormalIndicesData: Float32Array = new Float32Array([
			0., 0., 0., 0.
		]);

		var iPos: uint = 0,
			iNorm: uint = 0;

		var pEngine: IEngine = pScene.getManager().getEngine();

		pMesh = model.createMesh(pEngine, 'quad', EMeshOptions.HB_READABLE);
		pSubMesh = pMesh.createSubset('quad::main', EPrimitiveTypes.TRIANGLESTRIP);

		iPos = pSubMesh.getData().allocateData([VE.float3('POSITION')], pVerticesData);
		pSubMesh.getData().allocateIndex([VE.float('INDEX0')], pVertexIndicesData);
		pSubMesh.getData().index('POSITION', 'INDEX0');

		iNorm = pSubMesh.getData().allocateData([VE.float3('NORMAL')], pNormalsData);
		pSubMesh.getData().allocateIndex([VE.float('INDEX1')], pNormalIndicesData);

		pSubMesh.getData().index('NORMAL', 'INDEX1');

		pSubMesh.setShadow(false);

		if (pEngine.isDepsLoaded()) {
			pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
		}
		else {
			pScene.getManager().getEngine().depsLoaded.connect(() => {
				pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
			});
		}

		var pMatrial: IMaterial = pSubMesh.getRenderMethod().getSurfaceMaterial().getMaterial();
		pMatrial.diffuse = new Color(color.LIGHT_GRAY);
		pMatrial.ambient = new Color(0.7, 0.7, 0.7, 1.);
		pMatrial.specular = new Color(0.7, 0.7, 0.7, 1);
		pMatrial.emissive = new Color(0., 0., 0., 1.);
		pMatrial.shininess = 30.;

		var pSceneModel: ISceneModel = pScene.createModel("quad");
		pSceneModel.setMesh(pMesh);

		return pSceneModel;
	}

	export function basis(pScene: IScene3d, eOptions: int = EMeshOptions.HB_READABLE, fSize: float = 1.): ISceneModel {
		var pMesh: IMesh, pSubMesh: IMeshSubset, pMaterial: IMaterial;
		var iPos: int, iNorm: int;
		var pEngine: IEngine = pScene.getManager().getEngine();

		pMesh = model.createMesh(pEngine, "basis", eOptions);
		iNorm = pMesh.getData().allocateData([VE.float3("NORMAL")], new Float32Array([1, 0, 0]));

		function createAxis(sName: string, pCoords: Float32Array, pColor: IColor): void {
			pSubMesh = pMesh.createSubset(sName, EPrimitiveTypes.LINELIST);

			iPos = pSubMesh.getData().allocateData([VE.float3("POSITION")], pCoords);
			pSubMesh.getData().allocateIndex([VE.float("INDEX0")], new Float32Array([0, 1]));
			pSubMesh.getData().allocateIndex([VE.float("INDEX1")], new Float32Array([0, 0]));

			pSubMesh.getData().index(iPos, "INDEX0");
			pSubMesh.getData().index(iNorm, "INDEX1");

			pMaterial = pSubMesh.getMaterial();
			pMaterial.emissive = pColor;
			pMaterial.ambient = pColor;
			pMaterial.diffuse = pColor;
			pMaterial.shininess = 100.;

			pSubMesh.setShadow(false);

			if (pEngine.isDepsLoaded()) {
				pSubMesh.getEffect().addComponent("akra.system.mesh_texture");
			}
			else {
				pScene.getManager().getEngine().depsLoaded.connect(() => {
					pSubMesh.getEffect().addComponent("akra.system.mesh_texture");
				});
			}
		}

		createAxis('basis::X-axis', new Float32Array([0, 0, 0, 1 * fSize, 0, 0]), new Color(color.RED));
		createAxis('basis::Y-axis', new Float32Array([0, 0, 0, 0, 1 * fSize, 0]), new Color(color.GREEN));
		createAxis('basis::Z-axis', new Float32Array([0, 0, 0, 0, 0, 1 * fSize]), new Color(color.BLUE));

		var pSceneModel: ISceneModel = pScene.createModel("basis");
		pSceneModel.setMesh(pMesh);

		return pSceneModel;
	}

	export function bone(pJoint: IJoint): ISceneModel {

		var pScene: IScene3d = pJoint.getScene();
		var pParent: INode = <INode>pJoint.getParent();

		if (isNull(pParent)) {
			return null;
		}

		pParent.update();
		pJoint.update();

		var pMesh: IMesh, pSubMesh: IMeshSubset, pMaterial: IMaterial;
		var iPos: int, iNorm: int;
		var pEngine: IEngine = pScene.getManager().getEngine();
		var v: IVec3 = pJoint.getWorldPosition().subtract(pParent.getWorldPosition(), math.Vec3.temp());

		pMesh = model.createMesh(pEngine, "bone-" + pJoint.getName(), EMeshOptions.HB_READABLE);
		pSubMesh = pMesh.createSubset("bone", EPrimitiveTypes.LINELIST);

		pSubMesh.getData().allocateData([VE.float3("POSITION")], new Float32Array([0, 0, 0, v.x, v.y, v.z]));
		pSubMesh.getData().allocateIndex([VE.float("INDEX0")], new Float32Array([0, 1]));

		pSubMesh.getData().index("POSITION", "INDEX0");

		pMaterial = pSubMesh.getMaterial();
		(<IColor>pMaterial.emissive).set(Color.WHITE);

		pSubMesh.setShadow(false);

		if (pEngine.isDepsLoaded()) {
			pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
		}
		else {
			pScene.getManager().getEngine().depsLoaded.connect(() => {
				pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
			});
		}


		var pSceneModel: ISceneModel = pScene.createModel("bone-" + pJoint.getName());
		pSceneModel.setMesh(pMesh);

		return pSceneModel;
	}

	export function lineCube(pScene: IScene3d, eOptions?: int): ISceneModel {
		var pMesh: IMesh, pSubMesh: IMeshSubset, pMaterial: IMaterial;
		var iPos: int, iNorm: int;
		var pEngine: IEngine = pScene.getManager().getEngine();

		pMesh = model.createMesh(pEngine, "line-cube", eOptions || EMeshOptions.HB_READABLE);
		iNorm = pMesh.getData().allocateData([VE.float3("NORMAL")], new Float32Array([1, 0, 0]));

		pSubMesh = pMesh.createSubset("cube", EPrimitiveTypes.LINELIST);

		pSubMesh.getData().allocateAttribute([VE.float3("POSITION")], new Float32Array([
			//front
			-1, -1, -1,
			1, -1, -1,

			1, -1, -1,
			1, 1, -1,

			1, 1, -1,
			-1, 1, -1,

			-1, 1, -1,
			-1, -1, -1,

			//bottom
			-1, -1, 1,
			1, -1, 1,

			1, -1, 1,
			1, 1, 1,

			1, 1, 1,
			-1, 1, 1,

			-1, 1, 1,
			-1, -1, 1,


			//left
			-1, -1, -1,
			-1, 1, -1,

			-1, 1, -1,
			-1, 1, 1,

			-1, 1, 1,
			-1, -1, 1,

			-1, -1, 1,
			-1, -1, -1,

			//right
			1, -1, -1,
			1, 1, -1,

			1, 1, -1,
			1, 1, 1,

			1, 1, 1,
			1, -1, 1,

			1, -1, 1,
			1, -1, -1
		]));

		pMaterial = pSubMesh.getMaterial();
		(<IColor>pMaterial.emissive).set(1.);
		(<IColor>pMaterial.ambient).set(1.);
		(<IColor>pMaterial.diffuse).set(1.);
		pMaterial.shininess = 100.;

		pSubMesh.setShadow(false);

		if (pEngine.isDepsLoaded()) {
			pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
		}
		else {
			pScene.getManager().getEngine().depsLoaded.connect(() => {
				pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
			});
		}

		var pSceneModel: ISceneModel = pScene.createModel("line-cube");
		pSceneModel.setMesh(pMesh);

		return pSceneModel;
	}

}