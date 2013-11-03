#ifndef OBJ_TS
#define OBJ_TS

#include "IObj.ts"

#define OBJ_DEBUG true

#if OBJ_DEBUG == true
#define OBJ_PRINT(context, ...) LOG("[OBJ [" + context.findResourceName() + "]]", __VA_ARGS__)
#define OBJ_WARNING(context, ...) debug_warning("[OBJ [" + context.findResourceName() + "]]", __VA_ARGS__)
#else
#define OBJ_PRINT(context, ...) 
#define OBJ_WARNING(context, ...) 
#endif


module akra.core.pool.resources {
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
	            j ++;
	        }
	    }

	    return j;
	};

	var temp: float[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

	export class Obj extends ResourcePoolItem implements IObj {
		private _sFilename: string = null;
        private _iByteLength: uint = 0;
        private _pOptions: IObjLoadOptions = null;

        private _pVertices: float[] = [];
        private _pNormals: float[] = [];
        private _pTextureCoords: float[] = [];

        private _pVertexIndexes: float[] = [];
        private _pTexcoordIndexes: float[] = [];
        private _pNormalIndexes: float[] = [];


        //flexible vertex format
        private _iFVF: int = 0;


        public inline get modelFormat(): EModelFormats {
            return EModelFormats.OBJ;
        }

        public inline getFilename(): string {
            return this._sFilename;
        }

        private inline setFilename(sName: string): void {
            this._sFilename = sName;
        }

        public inline getBasename(): string {
            return path.info(this._pOptions.name || this._sFilename || "unknown").basename;
        }

        public inline get byteLength(): uint {
            return this._iByteLength;
        }

        public inline get options(): IObjLoadOptions {
            return this._pOptions;
        }

		private setOptions(pOptions: IObjLoadOptions): void {
            if (isNull(pOptions)) {
                pOptions = Obj.DEFAULT_OPTIONS;
            }

            for (var i in Obj.DEFAULT_OPTIONS) {
                if (isDef(pOptions[i])) {
                    continue;
                }

                pOptions[i] = Obj.DEFAULT_OPTIONS[i];
            }
            
            this._pOptions = pOptions;
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
                pScene = pNode.scene;

            }
            else {
                //attaching collada scene to new node, that is child of scene root
                pScene = <IScene3d>parent;
                pNode = pScene.getRootNode();
            }

            pRoot = pScene._createModelEntry(this);
            pRoot.create();
            pRoot.name = this.getBasename();
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

		    console.log(pVerticesData, pNormalsData)

		    var pVertexIndicesData: Float32Array = new Float32Array(this._pVertexIndexes);
		    var pNormalIndicesData:Float32Array = new Float32Array(this._pNormalIndexes);
		    var pTexcoordIndicesData:Float32Array = new Float32Array(this._pTexcoordIndexes);

		   	var iPos: uint = 0,
		    	iNorm: uint = 0,
		    	iTexcoord: uint = 0;

		    var pEngine: IEngine = this.getEngine();

		    pMesh = model.createMesh(pEngine, this.getBasename(), EMeshOptions.HB_READABLE);
	    	pSubMesh = pMesh.createSubset(this.getBasename(), EPrimitiveTypes.TRIANGLELIST);

	    	iPos = pSubMesh.data.allocateData([VE_VEC3('POSITION')], pVerticesData);
		    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX0')], pVertexIndicesData);
		    pSubMesh.data.index(iPos, 'INDEX0');
		    // console.log(pVerticesData, pVertexIndicesData);

		    if (this.hasNormals()) {
			    iNorm = pSubMesh.data.allocateData([VE_VEC3('NORMAL')], pNormalsData);
			    
			    if (this._pNormalIndexes.length > 0) {
			    	pSubMesh.data.allocateIndex([VE_FLOAT('INDEX1')], pNormalIndicesData);
				    pSubMesh.data.index(iNorm, 'INDEX1');
				    // console.log(pNormalsData, pNormalIndicesData);
			    }
			    else {
			    	OBJ_PRINT(this, "normal index was replaced with vertex index");
			    	pSubMesh.data.allocateIndex([VE_FLOAT('INDEX1')], pVertexIndicesData);
			    	pSubMesh.data.index(iNorm, 'INDEX1');
			    }
		    }

		    if (this.hasTexcoords()) {
		    	OBJ_PRINT(this, "model have texture coordinates");
		    	iTexcoord = pSubMesh.data.allocateData([VE_VEC2('TEXCOORD0')], pTexcoordsData);
			    pSubMesh.data.allocateIndex([VE_FLOAT('INDEX2')], pTexcoordIndicesData);
			    pSubMesh.data.index('TEXCOORD0', 'INDEX2');
			    // console.log(pTexcoordsData, pTexcoordIndicesData);
		    }
		    else {
		    	OBJ_PRINT(this, "model does not have any texture coordinates");
		    }

		    pSubMesh.shadow = this.options.shadows;
		    pSubMesh.renderMethod.effect.addComponent("akra.system.mesh_texture");

		    var pMatrial: IMaterial = pSubMesh.renderMethod.surfaceMaterial.material;
		    pMatrial.diffuse = new Color(0.7, 0., 0., 1.);
		    pMatrial.ambient = new Color(0., 0., 0., 1.);
			pMatrial.specular = new Color(0.7, 0., 0. ,1);
			pMatrial.emissive = new Color(0., 0., 0., 1.);
		    pMatrial.shininess = 30.;

		    var pSceneModel: ISceneModel = pRoot.scene.createModel(this.getBasename());
		    pSceneModel.setInheritance(ENodeInheritance.ALL);
	    	pSceneModel.mesh = pMesh;

		    pSubMesh.wireframe(true);

	    	pSceneModel.attachToParent(pRoot);
        }

        uploadVertexes(pPositions: Float32Array, pIndexes: Float32Array = null): void {
        	
        	for (var i: int = 0; i < pPositions.length; ++ i) {
        		this._pVertices[i] = pPositions[i];
        	}

        	if (!isNull(pIndexes)) {
        		for (var i: int = 0; i < pIndexes.length; ++ i) {
        			this._pVertexIndexes[i] = pIndexes[i];
        		}
        	}

        	this.calcDeps();

        	this.notifyRestored();
        	this.notifyLoaded();
        }

		parse(sData: string, pOptions: IObjLoadOptions = null): bool {
			if (isNull(sData)) {
                debug_error("must be specified obj content.");
                return false;
            }

            OBJ_PRINT(this, "parsing started...");
            this.setOptions(pOptions);

            var pLines: string[] = sData.split("\n");

            for (var i: int = 0; i < pLines.length; ++ i) {
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
            for (var i: int = 0; i < this._pVertexIndexes.length; ++ i) {
            	this._pVertexIndexes[i] --;
            }

            for (var i: int = 0; i < this._pNormalIndexes.length; ++ i) {
            	this._pNormalIndexes[i] --;
            }

            for (var i: int = 0; i < this._pTexcoordIndexes.length; ++ i) {
            	this._pTexcoordIndexes[i] --;
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
            	OBJ_PRINT(this, "calculation normals....")
            	this.calcNormals();
            }
		}

		private calcVertexIndices(): void {
			for (var i = 0; i < this._pVertices.length; ++i) {
		        this._pVertexIndexes[i] = i;
		    }
		}

		private calcNormals(useSmoothing: bool = true): void {
			var v = new Array(3), 
				p: IVec3 = new Vec3, 
				q: IVec3 = new Vec3, 
				i, j, 
				n: IVec3 = new Vec3, 
				k;

		    for (i = 0; i < this._pVertices.length; ++i) {
		        this._pNormals[i] = 0.;
		    }

		    for (i = 0; i < this._pVertexIndexes.length; i += 3) {
		        for (k = 0; k < 3; ++k) {

		            j = this._pVertexIndexes[i + k] * 3;
		            v[k] = vec3([this._pVertices[j], this._pVertices[j + 1], this._pVertices[j + 2]]);
		        }

		        v[1].subtract(v[2], p);
		        v[0].subtract(v[2], q);
		        p.cross(q, n);
		        n.normalize();
		        // n.negate();

		        for (k = 0; k < 3; ++k) {
		            j = this._pVertexIndexes[i + k] * 3;
		            this._pNormals[j] = n.x;
		            this._pNormals[j + 1] = n.y;
		            this._pNormals[j + 2] = n.z;
		        }
		    }

		//    if (useSmoothing) {
		//        for (i = 0; i < this._pVertexIndexes.length; i += 3) {
		//            for (k = 0; k < 3; ++k) {
		//                j = this._pVertexIndexes[i + k] * 3;
		//                Vec3.set(this._pNormals[j], this._pNormals[j + 1], this._pNormals[j + 2], n);
		//                Vec3.normalize(n);
		//                this._pNormals[j] = n[0];
		//                this._pNormals[j + 1] = n[1];
		//                this._pNormals[j + 2] = n[2];
		//                //a.log(this._pNormals[j] + " : " + this._pNormals[j + 1] + " : " + this._pNormals[j + 2]);
		//            }
		//        }
		//    }

			SET_ALL(this._iFVF, EObjFVF.NORMAL);
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
;
			var iX: uint = this.options.axis.x.index;
			var iY: uint = this.options.axis.y.index;
			var iZ: uint = this.options.axis.z.index;

			var iXSign: int = this.options.axis.x.inverse? -1: 1;
			var iYSign: int = this.options.axis.y.inverse? -1: 1;
			var iZSign: int = this.options.axis.z.inverse? -1: 1;
		    
			s = s.replace("\r", "");

		    //List of Vertices, with (x,y,z[,w]) coordinates, w is optional.
		    if (ch == ' ') {
		        pm = s.match(Obj.VERTEX_REGEXP);
		        debug_assert(!isNull(pm), "invalid line detected: <" + s + ">");
		        regExpResultToFloatArray(pm, temp, 0);
		        this._pVertices.push(iXSign * temp[iX], iYSign * temp[iY], iZSign * temp[iZ]);
		        SET_ALL(this._iFVF, EObjFVF.XYZ);
		    }

		    //Texture coordinates, in (u,v[,w]) coordinates, w is optional.
		    else if (ch == 't') {
		        pm = s.match(Obj.TEXCOORD_REGEXP);
		    	debug_assert(!isNull(pm), "invalid line detected: <" + s + "> (" + Obj.TEXCOORD_REGEXP.toString() + ")");
		       	regExpResultToFloatArray(pm, this._pTextureCoords);
		        SET_ALL(this._iFVF, EObjFVF.UV);
		    }
		    //Normals in (x,y,z) form; normals might not be unit.	
		    else if (ch == 'n') {
		        pm = s.match(Obj.NORMAL_REGEXP);
		    	debug_assert(!isNull(pm), "invalid line detected: <" + s + ">");
		        regExpResultToFloatArray(pm, temp, 0);
		        this._pNormals.push(iXSign * temp[iX], iYSign * temp[iY], iZSign * temp[iZ]);
		        SET_ALL(this._iFVF, EObjFVF.NORMAL);
		    }
		}

		inline hasTexcoords(): bool {
			return (this._iFVF & EObjFVF.UV) != 0;
		}

		inline hasNormals(): bool {
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
		        
		        regExpResultToFloatArray(pm, temp, 0);
		        
		        this._pVertexIndexes.push(temp[0], temp[2], temp[4]);
		        this._pTexcoordIndexes.push(temp[1], temp[3], temp[5]);
		    }
		    //vertex / normal
		    else if (!this.hasTexcoords() && this.hasNormals()) {
		        pm = s.match(Obj.VERTEX_NORMAL_FACE_REGEXP);
		        debug_assert(!isNull(pm), "invalid line detected: <" + s + ">");
		        // if (!pm) {
		        //     this._isObjectHasNormals = false;
		        //     this._readFaceInfo(s);
		        //     return;
		        // }
		        regExpResultToFloatArray(pm, temp, 0);
		        this._pVertexIndexes.push(temp[0], temp[2], temp[4]);
		        this._pNormalIndexes.push(temp[1], temp[3], temp[5]);
		    }
		    //vertex / texcoord / normal
		    else if (this.hasTexcoords() && this.hasNormals()) {
		        pm = s.match(Obj.VERTEX_UV_NORMAL_FACE_REGEXP);
		        debug_assert(!isNull(pm), "invalid line detected: <" + s + ">");
		        regExpResultToFloatArray(pm, temp, 0);
		        this._pVertexIndexes.push(temp[0], temp[3], temp[6]);
		        this._pTexcoordIndexes.push(temp[1], temp[4], temp[7]);
		        this._pNormalIndexes.push(temp[2], temp[5], temp[8]);
		    }
		    //vertex only
		    else {
		        pm = s.match(
		            /^f[\s]+([\d]+)[\s]+([\d]+)[\s]+([\d]+)[\s]*$/i);
		        debug_assert(!isNull(pm), "invalid line detected: <" + s + ">");
		        regExpResultToFloatArray(pm, temp, 0);
		        this._pVertexIndexes.push(temp[0], temp[1], temp[2]);
		    }
		};


		loadResource(sFilename: string = null, pOptions: IObjLoadOptions = null): bool {
            if (isNull(sFilename)) {
                sFilename = this.findResourceName();
            }

            if (this.isResourceLoaded()) {
                OBJ_WARNING(this, "obj model already loaded");
                return false;
            }

            var pModel: Obj = this;

            this.setFilename(sFilename);
            
            this.notifyDisabled();
            this.notifyUnloaded();

            var pFile: IFile = io.fopen(sFilename);

            pFile.open(function (err, meta): void {
                //FIXME: setuop byteLength correctly..
                (<any>pModel)["_iByteLength"] = meta.size || 0;
            });
        
            pFile.read(function (pErr: Error, sXML: string) {
                if (!isNull(pErr)) {
                    ERROR(pErr);
                }

                pModel.notifyRestored();
           
                if (pModel.parse(sXML, pOptions)) {
                    OBJ_PRINT(pModel, "resource loaded");
                    pModel.notifyLoaded();
                }
            });

            return true;
        }

        static DEFAULT_OPTIONS: IObjLoadOptions = {
            shadows         : true,
            axis: {
            	x: {index: 0, inverse: false},
            	y: {index: 1, inverse: false},
            	z: {index: 2, inverse: false}
            }
        };
	}
}

#endif

