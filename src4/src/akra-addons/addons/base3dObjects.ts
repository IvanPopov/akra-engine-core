/// <reference path="../../../built/Lib/akra.d.ts" />


module akra.addons {
	import VE = data.VertexElement;
	import Usage = data.Usages;
	import Color = color.Color;


	export interface ISimpleGeometry {
		vertices: float[];
		type: EPrimitiveTypes;
		normals?: float[];
		texcoords?: float[];
		indices?: uint[];
	}

	function createModelFromMesh(pScene: IScene3d, pMesh: IMesh, name?: string): ISceneModel {
		var pSceneModel: ISceneModel = pScene.createModel(name || pMesh.getName() || config.defaultName);
		pSceneModel.setMesh(pMesh);

		return pSceneModel;
	}

	export function createSimpleMeshFromUnknownData(pEngine: IEngine, name: string, pDecl: IVertexDeclaration, pData: Float32Array, eType: EPrimitiveTypes, pIndices?: Uint16Array, pMaterial?: IMaterial): IMesh {
		pDecl = data.VertexDeclaration.normalize(pDecl);

		var pMesh: IMesh = null;
		var pSubMesh: IMeshSubset = null;

		pMesh = model.createMesh(pEngine, name, EMeshOptions.HB_READABLE);
		pSubMesh = pMesh.createSubset(name + "-subset_1", eType, ERenderDataBufferOptions.RD_SINGLE_INDEX);

		pSubMesh.getData().allocateData(pDecl, pData);

		if (isDefAndNotNull(pIndices)) {
			pSubMesh.getData().allocateIndex(null, <Uint16Array><any>pIndices);
		}

		if (pEngine.isLoaded()) {
			pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
		}
		else {
			pEngine.depsLoaded.connect(() => {
				pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
			});
		}

		if (isDefAndNotNull(pMaterial)) {
			pSubMesh.getRenderMethod().getSurfaceMaterial().getMaterial().set(pMaterial);
		}

		return pMesh;
	}

	export function createSimpleMeshFromSimpleGeometry(pEngine: IEngine, pGeometry: ISimpleGeometry, pMaterial?: IMaterial, name?: string): IMesh {

		name = name || config.defaultName;

		var pDeclData: IVertexElementInterface[] = [];
		var iByteLength: uint = 0;
		var pLoop = { vertices: Usage.POSITION, normals: Usage.NORMAL, texcoords: "TEXCOORD0" };

		Object.keys(pLoop).forEach((sProperty: string) => {
			if (isDefAndNotNull(pGeometry[sProperty])) {
				var sSemantics = pLoop[sProperty]
				pDeclData.push(sSemantics === "TEXCOORD0" ? VE.float2(sSemantics) : VE.float3(sSemantics));

				if (!isArrayBuffer(pGeometry[sProperty])) {
					pGeometry[sProperty] = <any>new Float32Array(pGeometry[sProperty]);
				}

				iByteLength += (<Float32Array><any>pGeometry[sProperty]).byteLength;
				return;
			}

			pGeometry[sProperty] = null;
		});

		var pData = new Float32Array(iByteLength);
		var pDecl = data.VertexDeclaration.normalize(pDeclData);
		var iStride: uint = pDecl.stride / Float32Array.BYTES_PER_ELEMENT;

		for (var i = 0; i < pGeometry.vertices.length / 3; i++) {
			var i3 = i * 3;
			var i2 = i * 2;
			var n = i * iStride;
			var e = 0;

			pData[n + (e++)] = pGeometry.vertices[i3];
			pData[n + (e++)] = pGeometry.vertices[i3 + 1];
			pData[n + (e++)] = pGeometry.vertices[i3 + 2];

			if (!isNull(pGeometry.normals)) {
				pData[n + (e++)] = pGeometry.normals[i3];
				pData[n + (e++)] = pGeometry.normals[i3 + 1];
				pData[n + (e++)] = pGeometry.normals[i3 + 2];
			}

			if (!isNull(pGeometry.texcoords)) {
				pData[n + (e++)] = pGeometry.texcoords[i2];
				pData[n + (e++)] = pGeometry.texcoords[i2 + 1];
			}
		}


		if (isDefAndNotNull(pGeometry.indices)) {
			if (!isArrayBuffer(pGeometry.indices)) {
				pGeometry.indices = <any>new Uint16Array(pGeometry.indices);
			}
		}

		return createSimpleMeshFromUnknownData(pEngine, name, pDecl, pData, pGeometry.type, <any>pGeometry.indices, pMaterial);
	}

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



		var pVertexIndicesData: Uint16Array = new Uint16Array((nCellW + nCellH) * 2);

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
		pSubMesh = pMesh.createSubset('scene-surface::main', EPrimitiveTypes.LINELIST, ERenderDataBufferOptions.RD_SINGLE_INDEX);
		pSubMesh.getData().allocateData([VE.float3('POSITION')], pVerticesData);
		pSubMesh.getData().allocateIndex([VE.float('INDEX_POSITION')], pVertexIndicesData);
		//pSubMesh.getData().index('POSITION', 'INDEX_POSITION');

		pSubMesh.setShadow(false);

		if ((<core.Engine>pEngine).isLoaded()) {
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

	export function createQuad(pScene: IScene3d, fSize: float = 20., v2UV: IVec2 = Vec2.temp(1.)): ISceneModel {
		var pData: Float32Array = new Float32Array([
			-fSize, 0., -fSize, 0., 0., 0., 1., 0.,
			fSize, 0., -fSize, v2UV.x, 0., 0., 1., 0.,
			-fSize, 0., fSize, 0., v2UV.y, 0., 1., 0.,
			fSize, 0., fSize, v2UV.x, v2UV.y, 0., 1., 0.
		]);

		var pMatrial: IMaterial = material.create();
		pMatrial.diffuse = new Color(color.LIGHT_GRAY);
		pMatrial.ambient = new Color(0.7, 0.7, 0.7, 1.);
		pMatrial.specular = new Color(0.7, 0.7, 0.7, 1);
		pMatrial.emissive = new Color(0., 0., 0., 1.);
		pMatrial.shininess = 30. / 128.;

		var pMesh = createSimpleMeshFromUnknownData(
			pScene.getManager().getEngine(),
			"quad",
			<any>[VE.float3('POSITION'), VE.float2('TEXCOORD0'), VE.float3('NORMAL')],
			pData,
			EPrimitiveTypes.TRIANGLESTRIP,
			null,
			pMatrial);
		pMesh.setShadow(false);

		return createModelFromMesh(pScene, pMesh);
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

			if (pEngine.isLoaded()) {
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

		var pMesh: IMesh, pMaterial: IMaterial;
		var v: IVec3 = pJoint.getWorldPosition().subtract(pParent.getWorldPosition(), math.Vec3.temp());

		pMesh = createSimpleMeshFromSimpleGeometry(pScene.getManager().getEngine(), { vertices: [0, 0, 0, v.x, v.y, v.z], indices: [0, 1], type: EPrimitiveTypes.LINELIST }, null, "bone-" + pJoint.getName());

		pMaterial = pMesh.getSubset(0).getMaterial();
		(<IColor>pMaterial.emissive).set(Color.WHITE);

		pMesh.setShadow(false);

		return createModelFromMesh(pScene, pMesh);
	}

	export function lineCube(pScene: IScene3d, eOptions?: int): ISceneModel {
		var pMesh: IMesh, pMaterial: IMaterial;

		pMesh = createSimpleMeshFromSimpleGeometry(pScene.getManager().getEngine(), {
			vertices: [
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
			], type: EPrimitiveTypes.LINELIST
		}, null, "line-cube");

		pMaterial = pMesh.getSubset(0).getMaterial();
		(<IColor>pMaterial.emissive).set(1.);
		(<IColor>pMaterial.ambient).set(1.);
		(<IColor>pMaterial.diffuse).set(1.);
		pMaterial.shininess = 100.;

		pMesh.setShadow(false);

		return createModelFromMesh(pScene, pMesh);
	}

	export function cube(pScene: IScene3d): ISceneModel {
		var pEngine: IEngine = pScene.getManager().getEngine();

		var pMesh = createSimpleMeshFromSimpleGeometry(pEngine, {
			type: EPrimitiveTypes.TRIANGLELIST,

			vertices: [
				// Front face
				-1.0, -1.0, 1.0,
				1.0, -1.0, 1.0,
				1.0, 1.0, 1.0,
				-1.0, 1.0, 1.0,

				// Back face
				-1.0, -1.0, -1.0,
				-1.0, 1.0, -1.0,
				1.0, 1.0, -1.0,
				1.0, -1.0, -1.0,

				// Top face
				-1.0, 1.0, -1.0,
				-1.0, 1.0, 1.0,
				1.0, 1.0, 1.0,
				1.0, 1.0, -1.0,

				// Bottom face
				-1.0, -1.0, -1.0,
				1.0, -1.0, -1.0,
				1.0, -1.0, 1.0,
				-1.0, -1.0, 1.0,

			// Right face
				1.0, -1.0, -1.0,
				1.0, 1.0, -1.0,
				1.0, 1.0, 1.0,
				1.0, -1.0, 1.0,

				// Left face
				-1.0, -1.0, -1.0,
				-1.0, -1.0, 1.0,
				-1.0, 1.0, 1.0,
				-1.0, 1.0, -1.0,
			],
			normals: [
			// Front face
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0,

			// Back face
				0.0, 0.0, -1.0,
				0.0, 0.0, -1.0,
				0.0, 0.0, -1.0,
				0.0, 0.0, -1.0,

			// Top face
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0,

			// Bottom face
				0.0, -1.0, 0.0,
				0.0, -1.0, 0.0,
				0.0, -1.0, 0.0,
				0.0, -1.0, 0.0,

			// Right face
				1.0, 0.0, 0.0,
				1.0, 0.0, 0.0,
				1.0, 0.0, 0.0,
				1.0, 0.0, 0.0,

				// Left face
				-1.0, 0.0, 0.0,
				-1.0, 0.0, 0.0,
				-1.0, 0.0, 0.0,
				-1.0, 0.0, 0.0,
			],
			indices: [
				0, 1, 2, 0, 2, 3,    // Front face
				4, 5, 6, 4, 6, 7,    // Back face
				8, 9, 10, 8, 10, 11,  // Top face
				12, 13, 14, 12, 14, 15, // Bottom face
				16, 17, 18, 16, 18, 19, // Right face
				20, 21, 22, 20, 22, 23  // Left face
			]
		}, null, "cube");


		var pMat: IMaterial = pMesh.getSubset(0).getMaterial();
		pMat.diffuse.set(1.);
		pMat.shininess = 1.;

		return createModelFromMesh(pScene, pMesh);
	}

	export function cylinder(pScene3d: IScene3d, radiusTop: float = 2.5, radiusBottom: float = 2.5, height: float = 5, segmentsRadius: uint = 8, segmentsHeight: uint = 1, openEnded: boolean = true): ISceneModel {


		var heightHalf = height / 2;
		var segmentsX = segmentsRadius || 8;
		var segmentsY = segmentsHeight || 1;

		radiusTop = math.max(1e-10, radiusTop);
		radiusBottom = math.max(1e-10, radiusBottom);

		var x, y, vertices = [], uvs = [], normals = [], indices = [];

		for (y = 0; y <= segmentsY; y++) {

			var v = y / segmentsY;
			var radius = v * (radiusBottom - radiusTop) + radiusTop;

			for (x = 0; x <= segmentsX; x++) {

				var u = x / segmentsX;

				var xpos = radius * Math.sin(u * Math.PI * 2);
				var ypos = - v * height + heightHalf;
				var zpos = radius * Math.cos(u * Math.PI * 2);

				vertices.push(xpos, ypos, zpos);
				uvs.push(u, v);
			}
		}

		function vert(x, y): IVec3 {
			if (x > segmentsX) x = x % (segmentsX + 1);
			if (x < 0) x = (segmentsX + 1) + x;

			var n = (y * (segmentsX + 1) + x) * 3;
			return Vec3.temp(vertices[n], vertices[n + 1], vertices[n + 2]);
		}


		for (y = 0; y <= segmentsY; y++) {
			for (x = 0; x <= segmentsX; x++) {
				var V = vert(x, 0);

				var Vyu = vert(x, 1)
				
				var Vxl = vert(x - 1, 0);
				var Vxr = vert(x + 1, 0);

				var nl = Vxl.subtract(V, Vec3.temp()).cross(Vyu.subtract(V), Vec3.temp()).normalize();
				var nr = Vxr.subtract(V, Vec3.temp()).cross(Vyu.subtract(V), Vec3.temp()).normalize();

				var n = nl.add(nr).normalize();

				normals.push(n.x, n.y, n.z);
			}
		}


		for (y = 0; y < segmentsY; y++) {
			for (x = 0; x < segmentsX; x++) {
				var x0y0 = y * (segmentsX + 1) + x;
				var x1y0 = y * (segmentsX + 1) + x + 1;
				var x0y1 = (y + 1) * (segmentsX + 1) + x;
				var x1y1 = (y + 1) * (segmentsX + 1) + x + 1;

				indices.push(x0y0, x0y1, x1y1);
				indices.push(x0y0, x1y1, x1y0);
			}
		}
		
		return createModelFromMesh(pScene3d,
			createSimpleMeshFromSimpleGeometry(
				pScene3d.getManager().getEngine(),
				{
					type: EPrimitiveTypes.TRIANGLELIST,
					vertices: vertices,
					normals: normals,
					texcoords: uvs,
					indices: indices
				},
				material.create(),
				"cylinder"));
	}
}

