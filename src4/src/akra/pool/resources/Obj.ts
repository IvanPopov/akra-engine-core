/// <reference path="../../idl/IObj.ts" />

/// <reference path="../ResourcePoolItem.ts" />

/// <reference path="../../debug.ts" />
/// <reference path="../../config/config.ts" />

/// <reference path="../../io/io.ts" />

module akra.pool.resources {
	import Mat4 = math.Mat4;
	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;

	import VE = data.VertexElement;
	import Color = color.Color;

	export enum EObjFVF {
		XYZ = 0x01,
		NORMAL = 0x02,
		UV = 0x04
	}

	function regExpResultToFloatArray(pSrc: string[], ppDest: float[], iFrom: int = -1): uint {
		//i = 1 ==> regexp result starts from original value, like: ("1 2 3").match(/([1-9])/i) = ["1 2 3", "1", "2", "3"];
		var j: uint = 0;

		//writing into end of dest array
		if (iFrom < 0) {
			iFrom = ppDest.length;
		}

		for (var i = 1; i < pSrc.length; ++i) {
			if (pSrc[i]) {
				ppDest[iFrom + j] = parseFloat(pSrc[i].replace(/,/g, "."));
				j++;
			}
		}

		return j;
	};



	export class Obj extends ResourcePoolItem implements IObj {
		private _sFilename: string = null;
		private _iByteLength: uint = 0;
		private _pOptions: IObjLoadOptions = <any>{};

		private _pVertices: float[] = [];
		private _pNormals: float[] = [];
		private _pTextureCoords: float[] = [];

		private _pVertexIndexes: float[] = [];
		private _pTexcoordIndexes: float[] = [];
		private _pNormalIndexes: float[] = [];


		//flexible vertex format
		private _iFVF: int = 0;


		getModelFormat(): EModelFormats {
			return EModelFormats.OBJ;
		}

		getByteLength(): uint {
			return this._iByteLength;
		}

		getOptions(): IObjLoadOptions {
			return this._pOptions;
		}

		getFilename(): string {
			return this._sFilename;
		}

		getBasename(): string {
			return path.parse(this._pOptions.name || this._sFilename || "unknown").getBaseName();
		}

		private setFilename(sName: string): void {
			this._sFilename = sName;
		}

		setOptions(pOptions: IObjLoadOptions): void {
			if (isNull(pOptions)) {
				pOptions = Obj.DEFAULT_OPTIONS;
			}

			for (var i in Obj.DEFAULT_OPTIONS) {
				this._pOptions[i] = pOptions[i] || this._pOptions[i] || Obj.DEFAULT_OPTIONS[i];
			}
		}

		attachToScene(pScene: IScene3d): IModelEntry;
		attachToScene(pNode: ISceneNode): IModelEntry;
		attachToScene(parent): IModelEntry {
			var pScene: IScene3d;
			var pNode: ISceneNode;
			var pRoot: IModelEntry;

			if (isNull(parent)) {
				return null;
			}

			if (parent instanceof scene.Node) {
				//attach collada scene to give node
				pNode = <ISceneNode>parent;
				pScene = pNode.getScene();

			}
			else {
				//attaching collada scene to new node, that is child of scene root
				pScene = <IScene3d>parent;
				pNode = pScene.getRootNode();
			}

			pRoot = pScene._createModelEntry(this);
			pRoot.create();
			pRoot.setName(this.getBasename());
			pRoot.setInheritance(ENodeInheritance.ALL);

			if (!pRoot.attachToParent(pNode)) {
				return null;
			}

			this.buildMesh(pRoot);

			return pRoot;
		}

		private buildMesh(pRoot: ISceneNode): void {
			var pMesh: IMesh = null,
				pSubMesh: IMeshSubset = null;

			var pVerticesData: Float32Array = new Float32Array(this._pVertices);
			var pNormalsData: Float32Array = new Float32Array(this._pNormals);
			var pTexcoordsData: Float32Array = new Float32Array(this._pTextureCoords);

			// console.log(pVerticesData, pNormalsData)

			var pVertexIndicesData: Float32Array = new Float32Array(this._pVertexIndexes);
			var pNormalIndicesData: Float32Array = new Float32Array(this._pNormalIndexes);
			var pTexcoordIndicesData: Float32Array = new Float32Array(this._pTexcoordIndexes);

			var iPos: uint = 0,
				iNorm: uint = 0,
				iTexcoord: uint = 0;

			var pEngine: IEngine = this.getEngine();

			pMesh = model.createMesh(pEngine, this.getBasename(), EMeshOptions.HB_READABLE);
			pSubMesh = pMesh.createSubset(this.getBasename(), EPrimitiveTypes.TRIANGLELIST);


			iPos = pSubMesh.getData().allocateData([VE.float3('POSITION')], pVerticesData);
			pSubMesh.getData().allocateIndex([VE.float('INDEX0')], pVertexIndicesData);
			pSubMesh.getData().index(iPos, 'INDEX0');
			// console.log(pVerticesData, pVertexIndicesData);

			if (this.hasNormals()) {
				iNorm = pSubMesh.getData().allocateData([VE.float3('NORMAL')], pNormalsData);

				if (this._pNormalIndexes.length > 0) {
					pSubMesh.getData().allocateIndex([VE.float('INDEX1')], pNormalIndicesData);
					pSubMesh.getData().index(iNorm, 'INDEX1');
					// console.log(pNormalsData, pNormalIndicesData);
				}
				else {
					logger.log("[OBJ [" + this.findResourceName() + "]]", "normal index was replaced with vertex index");
					pSubMesh.getData().allocateIndex([VE.float('INDEX1')], pVertexIndicesData);
					pSubMesh.getData().index(iNorm, 'INDEX1');
				}
			}

			if (this.hasTexcoords()) {
				logger.log("[OBJ [" + this.findResourceName() + "]]", "model have texture coordinates");
				iTexcoord = pSubMesh.getData().allocateData([VE.float2('TEXCOORD0')], pTexcoordsData);
				pSubMesh.getData().allocateIndex([VE.float('INDEX2')], pTexcoordIndicesData);
				pSubMesh.getData().index('TEXCOORD0', 'INDEX2');
				// console.log(pTexcoordsData, pTexcoordIndicesData);
			}
			else {
				logger.log("[OBJ [" + this.findResourceName() + "]]", "model does not have any texture coordinates");
			}

			pSubMesh.setShadow(this.getOptions().shadows);
			pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");

			var pMatrial: IMaterial = pSubMesh.getRenderMethod().getSurfaceMaterial().getMaterial();
			pMatrial.diffuse = new Color(0.7, 0., 0., 1.);
			pMatrial.ambient = new Color(0., 0., 0., 1.);
			pMatrial.specular = new Color(0.7, 0., 0., 1);
			pMatrial.emissive = new Color(0., 0., 0., 1.);
			pMatrial.shininess = 30.;

			var pSceneModel: ISceneModel = pRoot.getScene().createModel(this.getBasename());
			pSceneModel.setInheritance(ENodeInheritance.ALL);
			pSceneModel.setMesh(pMesh);

			pSubMesh.wireframe(true);

			pSceneModel.attachToParent(pRoot);
		}

		uploadVertexes(pPositions: Float32Array, pIndexes: Float32Array = null): void {

			for (var i: int = 0; i < pPositions.length; ++i) {
				this._pVertices[i] = pPositions[i];
			}

			if (!isNull(pIndexes)) {
				for (var i: int = 0; i < pIndexes.length; ++i) {
					this._pVertexIndexes[i] = pIndexes[i];
				}
			}

			this.calcDeps();

			this.notifyRestored();
			this.notifyLoaded();
		}

		parse(sData: string, pOptions: IObjLoadOptions = null): boolean {
			if (isNull(sData)) {
				debug.error("must be specified obj content.");
				return false;
			}

			logger.log("[OBJ [" + this.findResourceName() + "]]", "parsing started...");
			this.setOptions(pOptions);

			var pLines: string[] = sData.split("\n");

			for (var i: int = 0; i < pLines.length; ++i) {
				//current line
				var sLine: string = pLines[i];
				//first character
				var c: string = sLine.charAt(0);

				switch (c) {
					case 'v': this.readVertexInfo(sLine); break;
					case 'f': this.readFaceInfo(sLine); break;
				}
			}

			//fixing indices, all indices starts from 1.....
			for (var i: int = 0; i < this._pVertexIndexes.length; ++i) {
				this._pVertexIndexes[i]--;
			}

			for (var i: int = 0; i < this._pNormalIndexes.length; ++i) {
				this._pNormalIndexes[i]--;
			}

			for (var i: int = 0; i < this._pTexcoordIndexes.length; ++i) {
				this._pTexcoordIndexes[i]--;
			}
			//end of index fix


			this.calcDeps();


			return true;
		}

		private calcDeps(): void {
			//FIXME: crete model with out indices, instead using pseudo indices like 0, 1, 2, 3....
			//fill indices, if not presented
			if (this._pVertexIndexes.length === 0) {
				this.calcVertexIndices();
			}

			if (!this._pNormals.length) {
				logger.log("[OBJ [" + this.findResourceName() + "]]", "calculation normals....")
				this.calcNormals();
			}
		}

		private calcVertexIndices(): void {
			for (var i = 0; i < this._pVertices.length; ++i) {
				this._pVertexIndexes[i] = i;
			}
		}

		private calcNormals(useSmoothing: boolean = true): void {
			var v: IVec3[] = new Array<IVec3>(3),
				p: IVec3 = new Vec3,
				q: IVec3 = new Vec3,
				n: IVec3 = new Vec3;
			var i: int, j: int, k: int;

			for (i = 0; i < this._pVertices.length; ++i) {
				this._pNormals[i] = 0.;
			}

			var pNormalsWeights: Float32Array = new Float32Array(this._pNormals.length / 3);

			for (i = 0; i < this._pVertexIndexes.length; i += 3) {
				for (k = 0; k < 3; ++k) {

					j = this._pVertexIndexes[i + k] * 3;
					v[k] = Vec3.temp([this._pVertices[j], this._pVertices[j + 1], this._pVertices[j + 2]]);
				}

				v[1].subtract(v[2], p);
				v[0].subtract(v[2], q);
				p.cross(q, n);
				n.normalize();
				n.negate();

				for (k = 0; k < 3; ++k) {
					var r = this._pVertexIndexes[i + k];
					pNormalsWeights[r]++;
					j = r * 3;
					this._pNormals[j] += n.x;
					this._pNormals[j + 1] += n.y;
					this._pNormals[j + 2] += n.z;
				}
			}

			for (i = 0; i < pNormalsWeights.length; i++) {
				j = i * 3;
				//console.log(pNormalsWeights[i]);
				n.set(this._pNormals[j], this._pNormals[j + 1], this._pNormals[j + 2]).scale(1 / pNormalsWeights[i]).normalize();

				this._pNormals[j] = n.x;
				this._pNormals[j + 1] = n.y;
				this._pNormals[j + 2] = n.z;
			}

			this._iFVF = bf.setAll(this._iFVF, EObjFVF.NORMAL);
		}

		static VERTEX_REGEXP: RegExp = /^v[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)([\s]+[-+]?[\d]*[\.|\,]?[\de-]*?)?[\s]*$/i;
		
		//provide only {U, V} pairs, 3D textures unsupported :(
		static TEXCOORD_REGEXP: RegExp = /^vt[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]*.*$/i;

		static NORMAL_REGEXP: RegExp = /^vn[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]+([-+]?[\d]*[\.|\,]?[\de-]*?)[\s]*$/i;

		readVertexInfo(s: string): void {
			//<s> - current line
			//second character of line <s>
			var ch: string = s.charAt(1);
			//results of regexp matching
			var pm: string[];

			var v: IVec4;

			s = s.replace("\r", "");

			//List of Vertices, with (x,y,z[,w]) coordinates, w is optional.
			if (ch == ' ') {
				pm = s.match(Obj.VERTEX_REGEXP);
				debug.assert(!isNull(pm), "invalid line detected: <" + s + ">");
				regExpResultToFloatArray(pm, Obj.row, 0);

				this._pVertices.push(Obj.row[0], Obj.row[1], Obj.row[2]);

				this._iFVF = bf.setAll(this._iFVF, EObjFVF.XYZ);
			}

			//Texture coordinates, in (u,v[,w]) coordinates, w is optional.
			else if (ch == 't') {
				pm = s.match(Obj.TEXCOORD_REGEXP);
				debug.assert(!isNull(pm), "invalid line detected: <" + s + "> (" + Obj.TEXCOORD_REGEXP.toString() + ")");
				regExpResultToFloatArray(pm, this._pTextureCoords);
				this._iFVF = bf.setAll(this._iFVF, EObjFVF.UV);
			}
			//Normals in (x,y,z) form; normals might not be unit.	
			else if (ch == 'n') {
				pm = s.match(Obj.NORMAL_REGEXP);
				debug.assert(!isNull(pm), "invalid line detected: <" + s + ">");
				regExpResultToFloatArray(pm, Obj.row, 0);
				this._pNormals.push(Obj.row[0], Obj.row[1], Obj.row[2]);
				this._iFVF = bf.setAll(this._iFVF, EObjFVF.NORMAL);
			}
		}

		hasTexcoords(): boolean {
			return (this._iFVF & EObjFVF.UV) != 0;
		}

		hasNormals(): boolean {
			return (this._iFVF & EObjFVF.NORMAL) != 0;
		}

		static VERTEX_UV_FACE_REGEXP = /^f[\s]+([\d]+)\/([\d]*)[\s]+([\d]+)\/([\d]*)[\s]+([\d]+)\/([\d]*)[\s]*$/i;
		static VERTEX_NORMAL_FACE_REGEXP = /^f[\s]+([\d]+)\/\/([\d]*)[\s]+([\d]+)\/\/([\d]*)[\s]+([\d]+)\/\/([\d]*)[\s]*$/i;
		static VERTEX_UV_NORMAL_FACE_REGEXP =
		/^f[\s]+([\d]+)\/([\d]*)\/([\d]*)[\s]+([\d]+)\/([\d]*)\/([\d]*)[\s]+([\d]+)\/([\d]*)\/([\d]*)[\s]*$/i;



		readFaceInfo(s: string): void {
			//results of regexp matching
			var pm: string[];

			// vertex / texcoord
			if (this.hasTexcoords() && !this.hasNormals()) {
				pm = s.match(Obj.VERTEX_UV_FACE_REGEXP);

				regExpResultToFloatArray(pm, Obj.row, 0);

				this._pVertexIndexes.push(Obj.row[0], Obj.row[2], Obj.row[4]);
				this._pTexcoordIndexes.push(Obj.row[1], Obj.row[3], Obj.row[5]);
			}
			//vertex / normal
			else if (!this.hasTexcoords() && this.hasNormals()) {
				pm = s.match(Obj.VERTEX_NORMAL_FACE_REGEXP);
				debug.assert(!isNull(pm), "invalid line detected: <" + s + ">");
				// if (!pm) {
				//     this._isObjectHasNormals = false;
				//     this._readFaceInfo(s);
				//     return;
				// }
				regExpResultToFloatArray(pm, Obj.row, 0);
				this._pVertexIndexes.push(Obj.row[0], Obj.row[2], Obj.row[4]);
				this._pNormalIndexes.push(Obj.row[1], Obj.row[3], Obj.row[5]);
			}
			//vertex / texcoord / normal
			else if (this.hasTexcoords() && this.hasNormals()) {
				pm = s.match(Obj.VERTEX_UV_NORMAL_FACE_REGEXP);
				debug.assert(!isNull(pm), "invalid line detected: <" + s + ">");
				regExpResultToFloatArray(pm, Obj.row, 0);
				this._pVertexIndexes.push(Obj.row[0], Obj.row[3], Obj.row[6]);
				this._pTexcoordIndexes.push(Obj.row[1], Obj.row[4], Obj.row[7]);
				this._pNormalIndexes.push(Obj.row[2], Obj.row[5], Obj.row[8]);
			}
			//vertex only
			else {
				pm = s.match(
					/^f[\s]+([\d]+)[\s]+([\d]+)[\s]+([\d]+)[\s]*$/i);
				debug.assert(!isNull(pm), "invalid line detected: <" + s + ">");
				regExpResultToFloatArray(pm, Obj.row, 0);
				this._pVertexIndexes.push(Obj.row[0], Obj.row[1], Obj.row[2]);
			}
		}


		loadResource(sFilename: string = null, pOptions: IObjLoadOptions = null): boolean {
			if (isNull(sFilename)) {
				sFilename = this.findResourceName();
			}

			if (this.isResourceLoaded()) {
				debug.warn("[OBJ::" + this.findResourceName() + "]", "obj model already loaded");
				return false;
			}

			this.setFilename(sFilename);

			this.notifyDisabled();
			this.notifyUnloaded();

			var pFile: IFile = io.fopen(sFilename);

			pFile.open(function (err, meta): void {
				//FIXME: setuop byteLength correctly..
				(<any>this)["_iByteLength"] = meta.size || 0;
			});

			pFile.read((pErr: Error, sXML: string): void => {
				if (!isNull(pErr)) {
					logger.error(pErr);
				}

				this.notifyRestored();

				if (this.parse(sXML, pOptions)) {
					debug.log("[OBJ::" + this.findResourceName() + "]", "resource loaded");
					this.notifyLoaded();
				}
			});

			return true;
		}

		static DEFAULT_OPTIONS: IObjLoadOptions = {
			shadows: true
		}

		private static row: float[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	}
}

