/// <reference path="../../idl/ICollada.ts" />


/// <reference path="../../idl/IMesh.ts" />
/// <reference path="../../idl/IRenderDataCollection.ts" />

/// <reference path="../../animation/Track.ts" />
/// <reference path="../../animation/Animation.ts" />
/// <reference path="../../animation/Controller.ts" />
/// <reference path="../../animation/Blend.ts" />

/// <reference path="../../scene/Node.ts" />

/// <reference path="../ResourcePoolItem.ts" />

/// <reference path="../../math/math.ts" />
/// <reference path="../../io/io.ts" />
/// <reference path="../../conv/conv.ts" />
/// <reference path="../../logger.ts" />
/// <reference path="../../debug.ts" />
/// <reference path="../pool.ts" />

module akra.pool.resources {
	import Mat4 = math.Mat4;
	import Mat3 = math.Mat3;

	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;

	import Color = color.Color;
	import VE = data.VertexElement;


	/* COMMON FUNCTIONS
	------------------------------------------------------
	*/

	//function getSupportedFormat(sSemantic: string): IColladaUnknownFormat[];
	//function calcFormatStride(pFormat: IColladaUnknownFormat[]): int;


	// additional

	//function printArray(pArr: any[], nRow: uint, nCol: uint): string;
	//function sortArrayByProperty(pData: any[], sProperty: string): any[];

	//xml

	//function stringData(pXML: Element): string;
	//function attr(pXML: Element, sName: string): string;
	//function firstChild(pXML: Element, sTag?: string): Element;




	// globals

	var pSupportedVertexFormat: IColladaUnknownFormat[];
	var pSupportedTextureFormat: IColladaUnknownFormat[];
	var pSupportedColorFormat: IColladaUnknownFormat[];
	var pSupportedWeightFormat: IColladaUnknownFormat[];
	var pSupportedJointFormat: IColladaUnknownFormat[];
	var pSupportedInvBindMatrixFormat: IColladaUnknownFormat[];
	var pSupportedInterpolationFormat: IColladaUnknownFormat[];
	var pSupportedInputFormat: IColladaUnknownFormat[];
	var pSupportedOutputFormat: IColladaUnknownFormat[];
	var pSupportedTangentFormat: IColladaUnknownFormat[];

	var pFormatStrideTable: IColladaFormatStrideTable;

	export class Collada extends ResourcePoolItem implements ICollada {
		static DEFAULT_OPTIONS: IColladaLoadOptions = {
			wireframe: false,
			shadows: true,
			animation: { pose: true },
			scene: true,
			extractPoses: true,
			skeletons: [],
			images: { flipY: false }
		};

		private static SCENE_TEMPLATE: IColladaLibraryTemplate[] = [
			{ lib: 'library_images', element: 'image' },
			{ lib: 'library_effects', element: 'effect' },
			{ lib: 'library_materials', element: 'material' },
			{ lib: 'library_geometries', element: 'geometry' },
			{ lib: 'library_controllers', element: 'controller' },
			{ lib: 'library_cameras', element: 'camera' },
			{ lib: 'library_lights', element: 'light' },
			{ lib: 'library_visual_scenes', element: 'visual_scene' }
		];

		private static ANIMATION_TEMPLATE: IColladaLibraryTemplate[] = [
			{ lib: 'library_animations', element: 'animation' }
		];

		private static COLLADA_MATERIAL_NAMES: string[] = [
			"emission",
			"ambient",
			"diffuse",
			"shininess",
			"reflective",
			"reflectivity",
			"transparent",
			"transparency",
			"specular"
		];


		//=======================================================================================

		private _pModel: IModel = null;
		private _pOptions: IColladaLoadOptions = {};

		private _pLinks: IColladaLinkMap = {};
		private _pLib: IColladaLibraryMap = {};
		private _pMeshCache: IMap<IMesh> = {};
		private _pMaterialCache: IMap<IColladaPhong> = {};

		private _pAsset: IColladaAsset = null;
		private _pVisualScene: IColladaVisualScene = null;
		private _pAnimations: IColladaAnimation[] = [];

		private _sFilename: string = null;

		private _pXMLDocument: Document = null;
		private _pXMLRoot: Element = null;

		private _iByteLength: uint = 0;

		getModelFormat(): EModelFormats {
			return EModelFormats.COLLADA;
		}

		// polygon index convertion

		getOptions(): IColladaLoadOptions {
			return this._pOptions;
		}

		getByteLength(): uint {
			return this._iByteLength;
		}

		_setByteLength(iByteLength: uint): void {
			this._iByteLength = iByteLength;
		}

		constructor() {
			super();

		}

		isShadowsEnabled(): boolean {
			return this._pOptions.shadows;
		}

		private trifanToTriangles(pXML: Element, iStride: int): uint[] {
			var pFans2Tri: uint[] = [0, 0, 0];
			var pData: uint[] = [];
			var tmp: uint[] = new Array(iStride), n: uint;
			var pIndexes: uint[] = [];

			this.eachByTag(pXML, "p", function (pXMLData) {
				n = conv.stoia(stringData(pXMLData), pData);

				for (var i: int = 0; i < 3; i++) {
					conv.retrieve(pData, tmp, iStride, i, 1);
					for (var j: int = 0; j < iStride; ++j) {
						pIndexes.push(tmp[j]);
					}
				}


				for (var i: int = 3, m = n / iStride; i < m; i++) {
					pFans2Tri[1] = i - 1;
					pFans2Tri[2] = i;
					for (var j: int = 0; j < pFans2Tri.length; ++j) {
						for (var k: int = 0; k < iStride; ++k) {
							pIndexes.push(pData[pFans2Tri[j] * iStride + k]);
						}
					}
				}

				//filling changes back to COLLADA
				//removing <p /> elements from <trifan /> element
				pXML.removeChild(pXMLData);
			});

			return pIndexes;
		}

		private polygonToTriangles(pXML: Element, iStride: int): uint[] {
			//TODO для невыпуклых многоугольников с самоперечечениями работать будет не верно
			return this.trifanToTriangles(pXML, iStride);
		}

		private tristripToTriangles(pXML: Element, iStride: int): uint[] {
			var pStrip2Tri: uint[] = [0, 0, 0];
			var pData: uint[] = [];
			var tmp: uint[] = new Array(iStride), n;
			var pIndexes: uint[] = [];

			this.eachByTag(pXML, "p", function (pXMLData) {
				n = conv.stoia(stringData(pXMLData), pData);

				for (var i: int = 0; i < 3; i++) {
					conv.retrieve(pData, tmp, iStride, i, 1);
					for (var j: int = 0; j < iStride; ++j) {
						pIndexes.push(tmp[j]);
					}
				}

				for (var i: int = 3, m = n / iStride; i < m; i++) {
					pStrip2Tri[0] = i - 1;
					pStrip2Tri[1] = i - 2;
					pStrip2Tri[2] = i;
					for (var j: int = 0; j < pStrip2Tri.length; ++j) {
						for (var k: int = 0; k < iStride; ++k) {
							pIndexes.push(pData[pStrip2Tri[j] * iStride + k]);
						}
					}
				}

				//filling changes back to COLLADA
				//removing <p /> elements from <tristrip /> element
				pXML.removeChild(pXMLData);
			});

			return pIndexes;
		}

		private polylistToTriangles(pXML: Element, iStride: int): uint[] {
			var pXMLvcount: Element = firstChild(pXML, "vcount");
			var pXMLp: Element = firstChild(pXML, "p");
			var pVcount: uint[] = new Array(parseInt(attr(pXML, "count")));
			var pData: uint[],
				pIndexes: uint[];
			var n: uint, h: int = 0;
			var tmp = new Array(128);
			var buf = new Array(256);
			var pPoly2Tri = [0, 0, 0];

			conv.stoia(stringData(pXMLvcount), pVcount);

			var nElements: uint = 0,
				nTotalElement: uint = 0;

			for (var i: int = 0; i < pVcount.length; i++) {
				nElements += pVcount[i];
				nTotalElement += (pVcount[i] - 2) * 3;
			}

			pIndexes = new Array(iStride * nTotalElement);
			pData = new Array(iStride * nElements);

			conv.stoia(stringData(pXMLp), pData);

			for (var i: int = 0, m = 0; i < pVcount.length; i++) {
				n = conv.retrieve(pData, tmp, iStride, m, pVcount[i]);

				for (var j: int = 0; j < 3; j++) {
					conv.retrieve(tmp, buf, iStride, j, 1);
					for (var k: int = 0; k < iStride; ++k) {
						pIndexes[h++] = buf[k];
					}
				}

				for (var x: int = 3, t = n / iStride; x < t; x++) {
					pPoly2Tri[1] = x - 1;
					pPoly2Tri[2] = x;
					for (var j: int = 0; j < pPoly2Tri.length; ++j) {
						for (var k: int = 0; k < iStride; ++k) {
							pIndexes[h++] = pData[(m + pPoly2Tri[j]) * iStride + k];
						}
					}
				}

				m += pVcount[i];
			}

			//filling changes back to COLLADA
			//removing <p />, <vcount /> elements from <polylist /> element
			pXML.removeChild(pXMLvcount);
			pXML.removeChild(pXMLp);

			return pIndexes;
		}

		//xml

		private eachNode(pXMLList: NodeList, fnCallback: IXMLExplorer, nMax?: uint): void {
			var n: int = pXMLList.length, i: int;
			nMax = (isNumber(nMax) ? (nMax < n ? nMax : n) : n);

			n = 0;
			i = 0;

			while (n < pXMLList.length) {
				//skip text nodes
				if (pXMLList[n++].nodeType === Node.TEXT_NODE) {
					continue;
				}

				var pXMLData: Element = <Element>pXMLList[n - 1];
				fnCallback.call(this, pXMLData, pXMLData.nodeName);

				i++;

				if (nMax === i) {
					break;
				}
			}
		}

		private eachChild(pXML: Element, fnCallback: IXMLExplorer): void {
			this.eachNode(pXML.childNodes, fnCallback);
		}

		private eachByTag(pXML: Element, sTag: string, fnCallback: IXMLExplorer, nMax?: uint): void {
			this.eachNode(pXML.getElementsByTagName(sTag), fnCallback, nMax);
		}


		// akra additional functions

		private findNode(pNodes: IColladaNode[], sNode: string = null, fnNodeCallback: (pNode: IColladaNode) => void = null): IColladaNode {
			var pNode: IColladaNode = null;
			var pRootJoint: IColladaNode = null;

			for (var i = pNodes.length - 1; i >= 0; i--) {
				pNode = pNodes[i];

				if (pNode === null) {
					continue;
				}

				if (sNode && "#" + pNode.id === sNode) {
					return pNode;
				}

				if (!isNull(fnNodeCallback)) {
					if (fnNodeCallback.call(this, pNode) === false) {
						break;
					}
				}

				if (pNode.childNodes) {
					pRootJoint = this.findNode(pNode.childNodes, sNode, fnNodeCallback);

					if (!isNull(pRootJoint)) {
						return pRootJoint;
					}
				}
			}

			return null;
		}


		// helper functions

		private COLLADATranslateMatrix(pXML: Element): IMat4 {
			var pData: float[] = new Array(3);

			conv.stofa(stringData(pXML), pData);

			return (Vec3.temp(pData)).toTranslationMatrix();
		}

		private COLLADARotateMatrix(pXML: Element): IMat4 {
			var pData: float[] = new Array(4);

			conv.stofa(stringData(pXML), pData);

			return (new Mat4(1)).rotateLeft(pData[3] * math.RADIAN_RATIO, Vec3.temp(pData[0], pData[1], pData[2]));
		}

		private COLLADAScaleMatrix(pXML: Element): IMat4 {
			var pData: float[] = new Array(3);

			conv.stofa(stringData(pXML), pData);

			return new Mat4(pData[0], pData[1], pData[2], 1.0);
		}

		private COLLADAData(pXML: Element): any {
			var sName: string = pXML.nodeName;
			var sData: string = stringData(pXML);

			switch (sName) {
				case "boolean":
					return conv.stoa<boolean[]>(sData, 1, "boolean");

				case "int":
					return conv.stoa<int[]>(sData, 1, "int");

				case "float":
					return conv.stoa<float[]>(sData, 1, "float");

				case "float2":
					return conv.stoa<float[]>(sData, 2, "float");

				case "float3":
					return conv.stoa<float[]>(sData, 3, "float");

				case "float4":
				case "color":
					return conv.stoa<float[]>(sData, 4, "float");

				case "rotate":
					return this.COLLADARotateMatrix(pXML);

				case "translate":
					return this.COLLADATranslateMatrix(pXML);

				case "scale":
					return this.COLLADAScaleMatrix(pXML);

				case "bind_shape_matrix":
				case "matrix":
					return (new Mat4(<Float32Array><any>conv.stoa<float[]>(sData, 16, "float"), true)).transpose();

				case "float_array":
					return conv.stoa<float[]>(sData, parseInt(attr(pXML, "count")), "float", true);

				case "int_array":
					return conv.stoa<int[]>(sData, parseInt(attr(pXML, "count")), "int", true);

				case "bool_array":
					return conv.stoa<boolean[]>(sData, parseInt(attr(pXML, "count")), "boolean", true);

				case "Name_array":
				case "name_array":
				case "IDREF_array":
					return conv.stoa<string[]>(sData, parseInt(attr(pXML, "count")), "string", true);

				case "sampler2D":
					return this.COLLADASampler2D(pXML);

				case "surface":
					return this.COLLADASurface(pXML);

				default:
					debug.error("unsupported COLLADA data type <" + sName + " />");
			}

			//return null;
		}

		private COLLADAGetSourceData(pSource: IColladaSource, pFormat: IColladaUnknownFormat[]): IColladaArray {

			logger.assert(isDefAndNotNull(pSource), "<source /> with expected format ", pFormat, " not founded");

			var nStride: uint = calcFormatStride(pFormat);
			var pTech: IColladaTechniqueCommon = pSource.techniqueCommon;

			logger.assert(isDefAndNotNull(pTech), "<source /> with id <" + pSource.id + "> has no <technique_common />");

			var pAccess: IColladaAccessor = pTech.accessor;
			var isFormatSupported: boolean;

			debug.assert((pAccess.stride <= nStride), pAccess.stride + " / " + nStride);

			logger.assert(pAccess.stride <= nStride,
				"<source /> width id" + pSource.id + " has unsupported stride: " + pAccess.stride);

			var fnUnsupportedFormatError = function (): void {
				logger.log("expected format: ", pFormat);
				logger.log("given format: ", pAccess.params);
				logger.error("accessor of <" + pSource.id + "> has unsupported format");
			}

			for (var i: int = 0; i < pAccess.params.length; ++i) {

				isFormatSupported = false;

				//finding name in format names..
				for (var f: int = 0; f < pFormat[i].name.length; ++f) {
					if ((pAccess.params[i].name || "").toLowerCase() == (pFormat[i].name[f] || "").toLowerCase()) {
						isFormatSupported = true;
					}
				}

				if (!isFormatSupported) {
					fnUnsupportedFormatError();
				}


				isFormatSupported = false;

				for (var f: int = 0; f < pFormat[i].type.length; ++f) {
					if (pAccess.params[i].type.toLowerCase() == pFormat[i].type[f].toLowerCase()) {
						isFormatSupported = true;
					}
				}

				if (!isFormatSupported) {
					fnUnsupportedFormatError();
				}

			}

			return pAccess.data;
		}


		// common
		// -----------------------------------------------------------

		private COLLADATransform(pXML: Element, id?: string): IColladaTransform {
			var pTransform: IColladaTransform = {
				sid: attr(pXML, "sid"),
				transform: String(pXML.nodeName),
				value: null
			};

			if (isString(id) && isDefAndNotNull(pTransform.sid)) {
				this.link(id + "/" + pTransform.sid, pTransform);
			}
			else {
				this.link(id + "/" + pTransform.transform, pTransform);
			}

			var v4f: IVec4,
				m4f: IMat4;
			var pData: float[];

			switch (pTransform.transform) {
				case "rotate":

					pData = new Array(4);
					conv.stofa(stringData(pXML), pData);
					v4f = new Vec4(pData);
					v4f.w *= math.RADIAN_RATIO; /* to radians. */
					pTransform.value = v4f;

					break;

				case "translate":
				case "scale":

					pData = new Array(3);
					conv.stofa(stringData(pXML), pData);
					pTransform.value = new Vec3(pData);
					break;

				case "matrix":

					m4f = new Mat4;
					conv.stofa(stringData(pXML), <float[]><any>m4f.data);
					m4f.transpose();
					pTransform.value = m4f;

					break;

				default:
					logger.error("unsupported transform detected: " + pTransform.transform);
			}


			return pTransform;
		}

		private COLLADANewParam(pXML: Element): IColladaNewParam {
			var pParam: IColladaNewParam = {
				sid: attr(pXML, "sid"),
				annotate: null,
				semantics: null,
				modifier: null,
				value: null,
				type: null
			};

			this.eachChild(pXML, (pXMLData: Element, sName?: string) => {
				switch (sName) {
					case "semantic":
						pParam.semantics = stringData(pXMLData);
						break;

					case "modifier":
						pParam.modifier = stringData(pXMLData);

					case "annotate":

						pParam.annotate = {
							name: attr(pXMLData, "name"),
							value: stringData(pXMLData)
						};

					case "float":
					case "float2":
					case "float3":
					case "float4":
					case "surface":
					case "sampler2D":
						pParam.type = sName;
						pParam.value = this.COLLADAData(pXMLData);
						break;

					default:
						pParam.value = this.COLLADAData(pXMLData);
				}
			});

			this.link(pParam.sid, pParam);

			return pParam;
		}

		private COLLADAAsset(pXML: Element = firstChild(this.getXMLRoot(), "asset")): IColladaAsset {
			var pAsset: IColladaAsset = {
				unit: {
					meter: 1.0,
					name: "meter"
				},

				upAxis: "Y_UP",
				title: null,
				created: null,
				modified: null,

				contributor: {
					author: null,
					authoringTool: null,
					comments: null,
					copyright: null,
					sourceData: null
				}
			};

			this.eachChild(pXML, (pXMLNode: Element, sName?: string) => {
				var sValue: string = stringData(pXMLNode);

				switch (sName) {
					case "up_axis":
						pAsset.upAxis = sValue;
						break;

					case "created":
						pAsset.created = sValue;
						break;

					case "modified":
						pAsset.modified = sValue;
						break;

					case "title":
						pAsset.title = sValue;
						break;

					case "contributor":
						//TODO contributor
						break;

					case "unit":
						pAsset.unit.meter = parseFloat(attr(pXMLNode, "meter"));
						pAsset.unit.name = attr(pXMLNode, "name");
						break;
				}
			});

			return this._pAsset = pAsset;
		}

		private COLLADALibrary(pXML: Element, pTemplate: IColladaLibraryTemplate): IColladaLibrary {
			if (!isDefAndNotNull(pXML)) {
				return null;
			}

			var pLib: IColladaLibrary = <IColladaLibrary>{};
			var pData: IColladaEntry;
			var sTag: string = pTemplate.element;
			var iAutoId: int = 0;

			pLib[sTag] = {};

			debug.info("read library <" + sTag + "/>");

			this.eachChild(pXML, (pXMLData: Element, sName?: string): void => {
				if (sTag !== sName) {
					return;
				}

				switch (sTag) {
					case 'image':
						pData = this.COLLADAImage(pXMLData);
						break;
					case 'effect':
						pData = this.COLLADAEffect(pXMLData);
						break;
					case 'material':
						pData = this.COLLADAMaterial(pXMLData);
						break;
					case 'geometry':
						pData = this.COLLADAGeometrie(pXMLData);
						break;
					case 'controller':
						pData = this.COLLADAController(pXMLData);
						break;
					case 'camera':
						pData = this.COLLADACamera(pXMLData);
						break;
					case 'light':
						pData = this.COLLADALight(pXMLData);
						break;
					case 'visual_scene':
						pData = this.COLLADAVisualScene(pXMLData);
						break;
					case 'animation':
						pData = this.COLLADAAnimation(pXMLData);
						break;
				}

				if (isNull(pData)) {
					return;
				}

				pLib[sTag][attr(pXMLData, 'id') || (sTag + "_" + (iAutoId++))] = pData;
			});

			return pLib;
		}


		// geometry

		private COLLADAAccessor(pXML: Element): IColladaAccessor {
			var pAccessor: IColladaAccessor = {
				data: <IColladaArray>this.source(attr(pXML, "source")),
				count: parseInt(attr(pXML, "count")),
				stride: parseInt(attr(pXML, "stride") || "1"),
				params: [],

				xml: pXML
			};


			this.eachChild(pXML, (pXMLData: Element, sName?: string) => {
				pAccessor.params.push({
					name: attr(pXMLData, "name"),
					type: attr(pXMLData, "type")
				});
			});

			return pAccessor;
		}

		//dangerous: the default offset is 0, but collada required this attribute
		private COLLADAInput(pXML: Element, iOffset: int = 0): IColladaInput {
			var pInput: IColladaInput = {
				semantics: attr(pXML, "semantic"),
				source: <IColladaSource>this.source(attr(pXML, "source")),
				offset: -1,
				set: attr(pXML, "set"),
				xml: pXML
			};

			if (!isNull(attr(pXML, "offset"))) {
				pInput.offset = parseInt(attr(pXML, "offset"));
			}

			if (isInt(iOffset) && pInput.offset === -1) {
				pInput.offset = iOffset;
			}

			debug.assert(isInt(pInput.offset) && pInput.offset >= 0, "invalid offset detected");

			return pInput;
		}

		private COLLADATechniqueCommon(pXML: Element): IColladaTechniqueCommon {
			var pTechniqueCommon: IColladaTechniqueCommon = {
				accessor: null,
				perspective: null
			};

			this.eachChild(pXML, (pXMLData: Element, sName?: string) => {
				switch (sName) {
					case "accessor":
						pTechniqueCommon.accessor = this.COLLADAAccessor(pXMLData);
						break;
					case "perspective":
						pTechniqueCommon.perspective = this.COLLADAPerspective(pXMLData);
						break;
				}
			});

			return pTechniqueCommon;
		}

		private COLLADASource(pXML: Element): IColladaSource {
			var pSource: IColladaSource = {
				id: attr(pXML, "id"),
				name: attr(pXML, "name"),
				array: {},
				techniqueCommon: null,

				xml: pXML
			};

			this.link(pSource);

			this.eachChild(pXML, (pXMLData: Element, sName?: string) => {
				var pColladaArray: IColladaArray;
				var id: string;

				switch (sName.toLowerCase()) {
					case "int_array":
					case "bool_array":
					case "float_array":
					case "idref_array":
					case "name_array":
						pColladaArray = <IColladaArray>this.COLLADAData(pXMLData);

						id = attr(pXMLData, "id");
						pSource.array[id] = pColladaArray;

						this.link(id, pColladaArray);

						break;
					case "technique_common":
						pSource.techniqueCommon = this.COLLADATechniqueCommon(pXMLData);
						break;
				}
			});

			return pSource;
		}

		private COLLADAVertices(pXML: Element): IColladaVertices {
			var pVertices: IColladaVertices = {
				id: attr(pXML, "id"),
				inputs: {}
			};


			this.eachByTag(pXML, "input", function (pXMLData) {
				var sSemantic: string = attr(pXMLData, "semantic");
				pVertices.inputs[sSemantic] = this.COLLADAInput(pXMLData);
			});


			debug.assert(isDefAndNotNull(pVertices.inputs["POSITION"]),
				"semantics POSITION must be in the <vertices /> tag");

			this.link(pVertices);

			return pVertices;
		}

		private COLLADAJoints(pXML: Element): IColladaJoints {
			var pJoints: IColladaJoints = {
				inputs: {}
			};

			var pMatrixArray: IMat4[];
			var iCount: int;
			var pInvMatrixArray: Float32Array;

			this.eachByTag(pXML, "input", (pXMLData: Element): void => {
				switch (attr(pXMLData, "semantic")) {
					case "JOINT":
						pJoints.inputs["JOINT"] = this.COLLADAInput(pXMLData);
						break;

					case "INV_BIND_MATRIX":
						pJoints.inputs["INV_BIND_MATRIX"] = this.COLLADAInput(pXMLData);


						//console.log(pJoints.inputs["INV_BIND_MATRIX"]);

						break;

					default:
						logger.error("semantics are different from JOINT/INV_BIND_MATRIX is not supported in the <joints /> tag");
				}
			});


			for (var sInput in pJoints.inputs) {
				this.prepareInput(pJoints.inputs[sInput]);

				if (sInput === "INV_BIND_MATRIX") {

					pInvMatrixArray = new Float32Array(pJoints.inputs[sInput].array);
					iCount = pInvMatrixArray.length / 16;
					pMatrixArray = new Array<IMat4>(iCount);

					for (var j: uint = 0, n: uint = 0; j < pInvMatrixArray.length; j += 16) {
						pMatrixArray[n++] =
						(new Mat4(
							new Float32Array(pInvMatrixArray.buffer, j * Float32Array.BYTES_PER_ELEMENT, 16), true)
							).transpose();
					}

					pJoints.inputs[sInput].array = pMatrixArray;
				}
			}

			return pJoints;
		}

		//this means, that all inputs in polygons tag has same index.
		static isSingleIndexedPolygons(pPolygons: IColladaPolygons): boolean {
			for (var i: uint = 0; i < pPolygons.inputs.length; ++i) {
				if (i != pPolygons.inputs.length - 1 && pPolygons.inputs[i].offset !== pPolygons.inputs[i + 1].offset) {
					return false;
				}
			}

			return true;
		}

		private COLLADAPolygons(pXML: Element, sType: string): IColladaPolygons {
			var pPolygons: IColladaPolygons = {
				inputs: [],								/*потоки данных*/
				p: null,								/*индексы*/
				material: attr(pXML, "material"),		/*идентификатор материала*/
				name: null,								/*имя (встречается редко, не используется)*/
				count: parseInt(attr(pXML, "count")),	/*полное число индексов*/

				xml: pXML
			};

			var iOffset: int = 0, n: uint = 0;
			var iCount: int = parseInt(attr(pXML, "count"));
			var iStride: int = 0;

			//filling changes back to COLLADA
			//preparing origin node
			var pOriginPolygons: Element = this.isCOLLADAChangesTracingEnabled() ? <Element>pXML.cloneNode(true) : null;

			this.eachByTag(pXML, "input", (pXMLData: Element): void => {
				pPolygons.inputs.push(this.COLLADAInput(pXMLData, iOffset));
				iOffset++;
			});

			sortArrayByProperty(pPolygons.inputs, "iOffset");

			for (var i: uint = 0; i < pPolygons.inputs.length; ++i) {
				var pInput: IColladaInput = <IColladaInput>pPolygons.inputs[i];
				iStride = math.max(pInput.offset + 1, iStride);
			}

			debug.assert(iStride > 0, "Invalid offset detected.");

			switch (sType) {
				case "polylist":
					pPolygons.p = this.polylistToTriangles(pXML, iStride);
					break;

				case "polygons":
					pPolygons.p = this.polygonToTriangles(pXML, iStride);

					this.eachByTag(pXML, "ph", (pXMLData: Element): void => {
						debug.error("unsupported polygon[polygon] subtype founded: <ph>");
					});

					break;

				case "triangles":
					pPolygons.p = new Array(3 * iCount * iStride);

					this.eachByTag(pXML, "p", (pXMLData: Element): void => {
						n += conv.stoia(stringData(pXMLData), pPolygons.p, n);
					});

					break;
				case "trifans":
					pPolygons.p = this.trifanToTriangles(pXML, iStride);
					break;

				case "tristrips":
					pPolygons.p = this.tristripToTriangles(pXML, iStride);
					break;

				default:
					logger.error("unsupported polygon[" + sType + "] type founded");
			}

			if (sType !== "triangles") {
				//filling changes back to COLLADA

				pXML.tagName = "triangles";
				pXML.setAttribute("count", String(pPolygons.p.length / 3));

				var pXMLp: Element = <Element>conv.parseHTML("<p></p>")[0];
				pXMLp.textContent = pPolygons.p.join(" ");
				pXMLp.removeAttribute("xmlns"); //to clerify output

				pXML.appendChild(pXMLp);

				this.COLLADANodeChanged(pOriginPolygons, pXML);

				//end of chages
			}

			if (!isDef(pPolygons.type)) {
				pPolygons.type = EPrimitiveTypes.TRIANGLELIST;
			}

			return pPolygons;
		}

		private COLLADAVertexWeights(pXML: Element): IColladaVertexWeights {
			var pVertexWeights: IColladaVertexWeights = {
				count: parseInt(attr(pXML, "count")),
				inputs: [],
				weightInput: null,
				vcount: null,
				v: null
			};

			var iOffset: int = 0;
			var pInput: IColladaInput;

			this.eachByTag(pXML, "input", (pXMLData: Element): void => {
				pInput = this.COLLADAInput(pXMLData, iOffset);

				if (pInput.semantics === "WEIGHT") {
					pVertexWeights.weightInput = pInput;
				}

				pVertexWeights.inputs.push(pInput);
				iOffset++;
			});

			var pVcountData: uint[],
				pVData: int[];

			pVcountData = new Array(pVertexWeights.count);
			conv.stoia(stringData(firstChild(pXML, "vcount")), pVcountData);
			pVertexWeights.vcount = pVcountData;


			var n: uint = 0;

			for (var i: int = 0; i < pVcountData.length; ++i) {
				n += pVcountData[i];
			}

			n *= pVertexWeights.inputs.length;

			logger.assert(pVertexWeights.inputs.length === 2,
				"more than 2 inputs in <vertex_weights/> not supported currently");

			pVData = new Array(n);
			conv.stoia(stringData(firstChild(pXML, "v")), pVData);
			pVertexWeights.v = pVData;

			return pVertexWeights;
		}

		private COLLADAMesh(pXML: Element): IColladaMesh {
			var pMesh: IColladaMesh = {
				sources: [],
				polygons: []
			};

			var id: string;
			var pPolygons: IColladaPolygons,
				pVertices: IColladaVertices,
				pPos: IColladaInput;

			this.eachChild(pXML, (pXMLData: Element, sName?: string) => {
				switch (sName) {
					case "source":
						pMesh.sources.push(this.COLLADASource(pXMLData));
						break;

					case "vertices":
						pVertices = this.COLLADAVertices(pXMLData);
						break;

					case "lines":
					case "linestrips":
					case "tristrips":
					case "trifans":
					case "triangles":
					case "polygons":
					case "polylist":
						pPolygons = this.COLLADAPolygons(pXMLData, sName);

						for (var i: int = 0; i < pPolygons.inputs.length; ++i) {
							pPos = null;

							if (pPolygons.inputs[i].semantics == "VERTEX") {
								if (pPolygons.inputs[i].source.id == pVertices.id) {
									pPos = pVertices.inputs["POSITION"];

									pPolygons.inputs[i].source = pPos.source;
									pPolygons.inputs[i].semantics = pPos.semantics;
								}
								else {
									logger.error("<input /> with semantic VERTEX must refer to <vertices /> tag in same mesh.");
								}
							}

							this.prepareInput(pPolygons.inputs[i]);
						}

						pMesh.polygons.push(pPolygons);
						break;
				}
			});

			return pMesh;
		}

		private static isCOLLADAMeshOptimized(pMesh: IColladaMesh): boolean {
			var pPolyGroup = pMesh.polygons;

			return !pPolyGroup.some((pPolygons: IColladaPolygons) => {
				return !Collada.isSingleIndexedPolygons(pPolygons);
			});
		}

		private optimizeCOLLADAMesh(pMesh: IColladaMesh): IColladaMesh {
			var pPolyGroup = pMesh.polygons;

			var pHashIndices: IIntMap = <any>{};
			//map: data semantics -> data(any[])
			var pUnpackedData: IMap<any[]> = <any>{};
			var pF32UnpackedData: IMap<any[]> = <any>{};
			var iLastIndex: uint = 0;

			pPolyGroup.forEach((pPolygons: IColladaPolygons, n) => {
				var pUnpackedIndices: number[] = [];
				//number of indexes
				var iStep = pPolygons.inputs.last.offset + 1;
				//total sets of indexes
				var iCount = pPolygons.p.length / iStep;

				//move along the sets of indices
				for (var i = 0; i < pPolygons.p.length; i += iStep) {

					//calculation string hash key for set of indices
					var sHash: string = "" + pPolygons.p[i];

					for (var t = 1; t < iStep; ++t) {
						sHash += "/" + pPolygons.p[i + t];
					}

					//check key in hash map
					if (sHash in pHashIndices) {
						pUnpackedIndices.push(pHashIndices[sHash]);
					}
					else {
						//moving along each index in set
						// set: [INDEX0(POSITION), INDEX1(NORMAL), ...]
						for (var j: int = 0; j < pPolygons.inputs.length; ++j) {
							var pInput: IColladaInput = pPolygons.inputs[j];

							//index value in current set
							var iIndex: uint = pPolygons.p[i + pInput.offset];

							//semantics of data for current index
							//	like: POSITION, NORMAL, ...
							var sSemantic: string = pInput.semantics;

							//number of components in data by current index
							//	for example: 3(typically) for POSITION, NORMAL
							//				 2 for UV
							var iStride: uint = pInput.accessor.stride;

							if (!isDefAndNotNull(pUnpackedData[sSemantic])) {
								pUnpackedData[sSemantic] = [];
							}

							//original cleaned data of <source /> linked with current <input />
							var pSrc: any[] = pInput.array;
							var pDest: any[] = pUnpackedData[sSemantic];

							//copy(unpack) data per component
							for (var k = 0; k < iStride; ++k) {
								pDest.push(pSrc[(iIndex * iStride) + k]);
							}
						}

						// add the newly created vertex to the list of indices
						pHashIndices[sHash] = iLastIndex;
						pUnpackedIndices.push(iLastIndex);

						// increment the counter
						iLastIndex += 1;
					}
				}

				//substitude all previous data with unpacked analogue

				//subst indices
				pPolygons.p = pUnpackedIndices;

				//filling changes back to COLLADA
				var pXMLPolygons = firstChild(pPolygons.xml, "p");
				var pOriginXMLPolygons: Element = this.isCOLLADAChangesTracingEnabled() ? <Element>pXMLPolygons.cloneNode(true) : null;;


				pXMLPolygons.textContent = pUnpackedIndices.join(" ");

				this.COLLADANodeChanged(pOriginXMLPolygons, pXMLPolygons);

			});

			Object.keys(pUnpackedData).forEach((sSemantics: string) => {
				//TODO: add support for non-float32 arrays
				pF32UnpackedData[sSemantics] = <any>(new Float32Array(pUnpackedData[sSemantics]));
			});

			//after all indexes recalculated, replacing data.
			pPolyGroup.forEach((pPolygons: IColladaPolygons, n) => {
				//subst data
				for (var j: int = 0; j < pPolygons.inputs.length; ++j) {
					var pInput: IColladaInput = pPolygons.inputs[j];

					pInput.offset = 0;
					pInput.array = pF32UnpackedData[pInput.semantics];

					//filling changes back to COLLADA

					var pOriginXMLInput: Element = this.isCOLLADAChangesTracingEnabled() ? <Element>pInput.xml.cloneNode(true) : null;


					pInput.xml.setAttribute("offset", String(0));


					this.COLLADANodeChanged(pOriginXMLInput, pInput.xml);


					var pXMLFloatArray = firstChild(pInput.source.xml, "float_array");


					var pOriginXMLFloatArray: Element = this.isCOLLADAChangesTracingEnabled() ? <Element>pXMLFloatArray.cloneNode(true) : null;


					pXMLFloatArray.textContent = pUnpackedData[pInput.semantics].join(" ");

					var iLength: uint = pUnpackedData[pInput.semantics].length;
					pXMLFloatArray.setAttribute("count", String(iLength));


					this.COLLADANodeChanged(pOriginXMLFloatArray, pXMLFloatArray);



					var pOriginXMLAccessor: Element = this.isCOLLADAChangesTracingEnabled() ? <Element>pInput.accessor.xml.cloneNode(true) : null;


					pInput.accessor.xml.setAttribute("count", String(iLength / pInput.accessor.stride));


					this.COLLADANodeChanged(pOriginXMLAccessor, pInput.accessor.xml);


					//pInput.source.xml.parentNode.removeChild(pInput.source.xml);
				}
			});

			return pMesh;
		}

		private COLLADANodeChanged(pBefore: Element, pAfter: Element): void {
			//console.log(pBefore, "==>", pAfter);
		}

		//надо ли отправлять варианты BEFORE и AFTER в функцию COLLADANodeChanged
		//для валидации
		private isCOLLADAChangesTracingEnabled(): boolean {
			return false;
		}

		private COLLADAGeometrie(pXML: Element): IColladaGeometrie {
			var pGeometrie: IColladaGeometrie = {
				id: attr(pXML, "id"),
				name: attr(pXML, "name"),
				mesh: null,
				convexMesh: null,
				spline: null,
			};

			var pXMLData: Element = firstChild(pXML);
			var sName: string = pXMLData.nodeName;

			if (sName == "mesh") {
				pGeometrie.mesh = this.COLLADAMesh(pXMLData);
			}

			this.link(pGeometrie);

			return pGeometrie;
		}

		private COLLADASkin(pXML: Element): IColladaSkin {
			var pSkin: IColladaSkin = {
				shapeMatrix: <IMat4>this.COLLADAData(firstChild(pXML, "bind_shape_matrix")),
				sources: [],
				geometry: <IColladaGeometrie>this.source(attr(pXML, "source")),
				joints: null,
				vertexWeights: null

				//TODO:  add other parameters to skin section
			}

			var pVertexWeights: IColladaVertexWeights,
				pInput: IColladaInput;

			this.eachChild(pXML, (pXMLData: Element, sName?: string) => {
				switch (sName) {
					case "source":
						pSkin.sources.push(this.COLLADASource(pXMLData));
						break;

					case "joints":
						pSkin.joints = this.COLLADAJoints(pXMLData);
						break;

					case "vertex_weights":
						pVertexWeights = this.COLLADAVertexWeights(pXMLData);

						for (var i = 0; i < pVertexWeights.inputs.length; ++i) {
							pInput = this.prepareInput(pVertexWeights.inputs[i]);
						}

						pSkin.vertexWeights = pVertexWeights;
						break;
				}
			});

			return pSkin;
		}

		private COLLADAController(pXML: Element): IColladaController {
			var pController: IColladaController = {
				name: attr(pXML, "name"),
				id: attr(pXML, "id"),
				skin: null,
				morph: null
			};

			var pXMLData: Element = firstChild(pXML, "skin");

			if (!isNull(pXMLData)) {
				pController.skin = this.COLLADASkin(pXMLData);
			}
			else {
				debug.warn("Founded controller without skin element!");
				return null;
			}

			this.link(pController);

			return pController;
		}

		// images

		private COLLADAImage(pXML: Element): IColladaImage {
			var pImage: IColladaImage = {
				id: attr(pXML, "id"),
				name: attr(pXML, "name"),

				format: attr(pXML, "format"),
				height: parseInt(attr(pXML, "height") || "-1"), /*-1 == auto detection*/
				width: parseInt(attr(pXML, "width") || "-1"),

				depth: 1, /*only 2D images supported*/
				data: null,
				path: null
			};

			var sFilename: string = this.getFilename();
			var sPath: string = null;
			var pXMLInitData: Element = firstChild(pXML, "init_from"),
				pXMLData: Element;

			if (isDefAndNotNull(pXMLInitData)) {
				sPath = stringData(pXMLInitData);

				//modify path to the textures relative to a given file
				// if (!isNull(sFilename)) {
				//     if (!path.info(sPath).isAbsolute()) {
				//         sPath = path.info(sFilename).dirname + "/" + sPath;
				//     }
				// }
				// console.log("collada deps image: ", path.normalize(sPath));
				// pImage.path = path.normalize(sPath);
				pImage.path = uri.resolve(sPath, sFilename);
				// console.log("collada deps image >>> ", pImage.path);
			}
			else if (isDefAndNotNull(pXMLData = firstChild(pXML, "data"))) {
				logger.error("image loading from <data /> tag unsupported yet.");
			}
			else {
				logger.error("image with id: " + pImage.id + " has no data.");
			}

			this.link(pImage);

			return pImage;
		}

		// effects

		private COLLADASurface(pXML: Element): IColladaSurface {
			var pSurface: IColladaSurface = {
				initFrom: stringData(firstChild(pXML, "init_from"))
				//, format: stringData(firstChild(pXML, "format"))
			}

			return pSurface;
		}

		private COLLADATexture(pXML: Element): IColladaTexture {
			if (!isDefAndNotNull(pXML)) {
				return null;
			}

			var pTexture: IColladaTexture = {
				texcoord: attr(pXML, "texcoord"),
				sampler: <IColladaNewParam>this.source(attr(pXML, "texture")),
				surface: null,
				image: null
			};

			if (!isNull(pTexture.sampler) && isDefAndNotNull(pTexture.sampler.value)) {
				pTexture.surface = <IColladaNewParam>this.source((<IColladaSampler2D>pTexture.sampler.value).source);
			}

			if (!isNull(pTexture.surface)) {
				var pImage: IColladaImage = <IColladaImage>this.source((<IColladaSurface>pTexture.surface.value).initFrom);
				pTexture.image = pImage;

				debug.info("Load texture " + pImage.path + ".");

				var pTex: ITexture = <ITexture>this.getManager().getTexturePool().loadResource(pImage.path);

				if (this.findRelatedResources(EResourceItemEvents.LOADED).indexOf(pTex) === -1) {
					this.sync(pTex, EResourceItemEvents.LOADED);
				}

				//FIX THIS
				pTex.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
				pTex.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR_MIPMAP_LINEAR);

				pTex.setWrapMode(ETextureParameters.WRAP_S, ETextureWrapModes.REPEAT);
				pTex.setWrapMode(ETextureParameters.WRAP_T, ETextureWrapModes.REPEAT);
			}

			return pTexture;
		}

		private COLLADASampler2D(pXML: Element): IColladaSampler2D {
			var pSampler: IColladaSampler2D = {
				source: stringData(firstChild(pXML, "source")),
				wrapS: stringData(firstChild(pXML, "wrap_s")),
				wrapT: stringData(firstChild(pXML, "wrap_t")),
				minFilter: stringData(firstChild(pXML, "minfilter")),
				mipFilter: stringData(firstChild(pXML, "mipfilter")),
				magFilter: stringData(firstChild(pXML, "magfilter"))
			};

			return pSampler;
		}

		private COLLADAPhong(pXML: Element): IColladaPhong {
			var pMat: IColladaPhong = {
				diffuse: new Color(0.),
				specular: new Color(0.),
				ambient: new Color(0.),
				emissive: new Color(0.),
				shininess: .5 / 128.,

				reflective: new Color(0.),
				reflectivity: 0.0,
				transparent: new Color(0.),
				transparency: 1.0,

				indexOfRefraction: 0.0,

				textures: {
					diffuse: null,
					specular: null,
					ambient: null,
					emissive: null,
					normal: null,
					shininess: null
				},

				material: null,

				xml: pXML
			};

			var pXMLData: Element;
			var pList: string[] = Collada.COLLADA_MATERIAL_NAMES;

			for (var i: int = 0; i < pList.length; i++) {
				var csComponent: string = pList[i];

				pXMLData = firstChild(pXML, csComponent);

				//emission --> emissive
				//emission does not exists in akra engine materials

				if (csComponent === "emission") {
					csComponent = "emissive";
				}

				if (pXMLData) {
					this.eachChild(pXMLData, (pXMLData: Element, sName?: string) => {

						switch (sName) {
							case "float":
								pMat[csComponent] = <float>this.COLLADAData(pXMLData);
								break;

							case "color":
								pMat[csComponent].set(<IColorValue>this.COLLADAData(pXMLData));
								break;

							case "texture":
								pMat.textures[csComponent] = this.COLLADATexture(pXMLData);
						}
					});

				}
			}

			// correct shininess
			//pMat.shininess *= 10.0;

			return pMat;
		}

		private COLLADAEffectTechnique(pXML: Element): IColladaEffectTechnique {
			var pTech: IColladaEffectTechnique = {
				sid: attr(pXML, "sid"),
				type: null,
				value: null
			};

			var pValue: Element = firstChild(pXML);
			var pMat: IColladaPhong = null;

			pTech.type = pValue.nodeName;

			switch (pTech.type) {
				//FIXME: at now, all materials draws similar..
				case "blinn":
				case "lambert":
					//debug.warn("<blinn /> or <lambert /> material interprated as phong");
				case "phong":
					pMat = this.COLLADAPhong(pValue);
					break;

				default:
					logger.error("unsupported technique <" + pTech.type + " /> founded");
			}


			//normalize shininess value
			switch (pTech.type) {
				case "phong":
					debug.assert(pMat.shininess <= 128. && pMat.shininess >= 0., "Invalid shininess value in collada phong material(" + pMat.name + ") - " + pMat.shininess + ". Expected value in the range from 0. to 128.");
					pMat.shininess = math.clamp(pMat.shininess, 0., 128.) / 128.;
					break;
				case "blinn":

					if (!(pMat.shininess <= 1. && pMat.shininess >= 0.)) {
						debug.warn("Invalid shininess value in collada blinn material(" + pMat.name + ") - " + pMat.shininess + ". Expected value in the range from 0. to 1..");
					}
					pMat.shininess = math.clamp(pMat.shininess, 0., 1.);
					break;
				//debug.assert(pMat.shininess <= 1. && pMat.shininess >= 0., "Invalid shininess value in collada blinn material(" + pMat.name + ") - " + pMat.shininess + ". Expected value in the range from 0. to 1..");
				//pMat.shininess = math.clamp(pMat.shininess, 0., 1.);
				//break;
			}

			pTech.value = pMat;
			//finding normal maps like this
			/*
				<technique profile=​"OpenCOLLADA3dsMax">​
					<bump bumptype=​"HEIGHTFIELD">​
					  <texture texture=​"Default_Material_normals2_png-sampler" texcoord=​"CHANNEL1">​</texture>​
					</bump>​
				</technique>​
			*/

			var pXMLExtra: Element = firstChild(pXML, "extra");

			if (isDefAndNotNull(pXMLExtra)) {
				var pXMLTech: Element = firstChild(pXMLExtra, "technique");
				if (isDefAndNotNull(pXMLTech)) {
					var pXMLBump: Element = firstChild(pXMLTech, "bump");
					if (isDefAndNotNull(pXMLBump) && attr(pXMLBump, "bumptype") === "HEIGHTFIELD") {
						(<IColladaPhong>pTech.value).textures.normal = this.COLLADATexture(firstChild(pXMLBump, "texture"));
					}
				}
			}

			this.link(pTech.sid, pTech);

			return pTech;
		}

		private COLLADAProfileCommon(pXML: Element): IColladaProfileCommon {
			var pProfile: IColladaProfileCommon = {
				technique: null,
				newParam: {}
			};

			this.eachByTag(pXML, "newparam", (pXMLData: Element): void => {
				pProfile.newParam[attr(pXMLData, "sid")] = this.COLLADANewParam(pXMLData);
			})

			pProfile.technique = this.COLLADAEffectTechnique(firstChild(pXML, "technique"));

			return pProfile;
		}

		private COLLADAEffect(pXML: Element): IColladaEffect {
			var pEffect: IColladaEffect = {
				id: attr(pXML, "id"),
				profileCommon: null
			};

			this.eachChild(pXML, (pXMLData: Element, sName?: string) => {
				switch (sName.toLowerCase()) {
					case "profile_common":
						pEffect.profileCommon = this.COLLADAProfileCommon(pXMLData);
						pEffect.profileCommon.technique.value.name = pEffect.id;
						break;
					default:
						debug.warn("<" + sName + " /> unsupported in effect section");
				}
			});

			this.link(pEffect);

			return pEffect;
		}


		//materials

		private COLLADAMaterial(pXML: Element): IColladaMaterial {
			var pMaterial: IColladaMaterial = {
				id: attr(pXML, "id"),
				name: attr(pXML, "name"),
				instanceEffect: this.COLLADAInstanceEffect(firstChild(pXML, "instance_effect")),

				xml: pXML
			};

			this.link(pMaterial);

			return pMaterial;
		}

		// scene

		private COLLADANode(pXML: Element, iDepth: uint = 0): IColladaNode {
			var pNode: IColladaNode = {
				id: attr(pXML, "id"),
				sid: attr(pXML, "sid"),
				name: attr(pXML, "name") || "unknown",
				type: attr(pXML, "type"),
				layer: attr(pXML, "layer"),
				transform: new Mat4(1),
				geometry: [],
				controller: [],
				childNodes: [],
				camera: [],
				depth: iDepth,
				transforms: [],
				constructedNode: null /*<! узел, в котором будет хранится ссылка на реальный игровой нод, построенный по нему*/
			};

			var m4fMatrix: IMat4;
			var sType: string;
			var id: string, sid: string;

			this.link(pNode);

			this.eachChild(pXML, (pXMLData: Element, sName?: string) => {
				switch (sName) {
					case "rotate":
					case "matrix":
					case "translate":
					case "scale":
						pNode.transforms.push(this.COLLADATransform(pXMLData, pNode.id));
						pNode.transform.multiply(<IMat4>this.COLLADAData(pXMLData));
						break;

					case "instance_geometry":
						pNode.geometry.push(this.COLLADAInstanceGeometry(pXMLData));
						break;

					case "instance_controller":
						pNode.controller.push(this.COLLADAInstanceController(pXMLData));
						break;

					case "instance_camera":
						pNode.camera.push(this.COLLADAInstanceCamera(pXMLData));
						break;

					case "node":
						pNode.childNodes.push(this.COLLADANode(pXMLData, iDepth + 1));
						break;
				}
			});

			//TODO: do not load empty nodes..
			// if (!pNode.pGeometry.length && 
			//     !pNode.pController.length && 
			//     !pNode.pChildNodes.length) {
			//     return null;
			// }

			return pNode;
		}

		private COLLADAVisualScene(pXML: Element): IColladaVisualScene {
			var pNode: IColladaNode;
			var pScene: IColladaVisualScene = {
				id: attr(pXML, "id"),
				name: attr(pXML, "name"),
				nodes: []
			};

			this.link(pScene);

			this.eachChild(pXML, (pXMLData: Element, sName?: string) => {
				switch (sName) {
					case "node":
						pNode = this.COLLADANode(pXMLData);

						if (isDefAndNotNull(pNode)) {
							pScene.nodes.push(pNode);
						}

						break;
				}
			});

			debug.info("visual scene loaded.");

			return pScene;
		}

		private COLLADABindMaterial(pXML: Element): IColladaBindMaterial {
			if (!isDefAndNotNull(pXML)) {
				return null;
			}

			var pMaterials: IColladaBindMaterial = {};
			var pMat: IColladaInstanceMaterial = null;
			var pSourceMat: IColladaMaterial = null;
			var pTech: Element = firstChild(pXML, "technique_common");

			this.eachByTag(pTech, "instance_material", (pInstMat: Element): void => {

				pSourceMat = <IColladaMaterial>this.source(attr(pInstMat, "target"));

				pMat = {
					// url         : pSourceMat.instanceEffect.url,
					target: attr(pInstMat, "target"),
					symbol: attr(pInstMat, "symbol"),
					material: pSourceMat,
					vertexInput: <IColladaBindVertexInputMap>{}
				};

				this.eachByTag(pInstMat, "bind_vertex_input", (pXMLVertexInput: Element): void => {
					var sInputSemantic: string = attr(pXMLVertexInput, "input_semantic");

					if (sInputSemantic !== "TEXCOORD") {
						logger.error("unsupported vertex input semantics founded: " + sInputSemantic);
					}


					var sSemantic: string = attr(pXMLVertexInput, "semantic");
					var iInputSet: int = parseInt(attr(pXMLVertexInput, "input_set"));

					pMat.vertexInput[sSemantic] = {
						semantics: sSemantic,
						inputSet: iInputSet,
						inputSemantic: sInputSemantic
					};
				});

				pMaterials[pMat.symbol] = pMat;
			});

			return pMaterials;
		}

		private COLLADAInstanceEffect(pXML: Element): IColladaInstanceEffect {
			var pInstance: IColladaInstanceEffect = {
				parameters: {},
				techniqueHint: <IMap<string>>{},
				effect: null
			};

			/*
				Exmaple for <instance_effect /> :
			
				<instance_effect url="CarPaint">
					<technique_hint profile="CG" platform="PS3" ref="precalc_texture"/>
					<setparam ref="diffuse_color">
						<float3> 0.3 0.25 0.85 </float3>
					</setparam>
				</instance_effect>
			*/

			pInstance.effect = <IColladaEffect>this.source(attr(pXML, "url"));

			this.eachByTag(pXML, "technique_hint", (pXMLData: Element): void => {
				pInstance.techniqueHint[attr(pXMLData, "platform")] = attr(pXMLData, "ref");
				debug.warn("<technique_hint /> used, but will be ignored!");
			});

			this.eachByTag(pXML, "setparam", (pXMLData: Element): void => {
				//can be any type
				pInstance.parameters[attr(pXMLData, "ref")] = <any>this.COLLADAData(pXMLData);
				debug.warn("<setparam /> used, but will be ignored!");
			});

			return pInstance;
		}

		private COLLADAInstanceController(pXML: Element): IColladaInstanceController {
			var pInst: IColladaInstanceController = {
				controller: <IColladaController>this.source(attr(pXML, "url")),
				material: <IColladaBindMaterial>this.COLLADABindMaterial(firstChild(pXML, "bind_material")),
				skeletons: []
			};

			this.eachByTag(pXML, "skeleton", (pXMLData: Element): void => {
				//cut # symbol from skeleton name
				pInst.skeletons.push(stringData(pXMLData).substr(1));
			});

			return pInst;
		}

		private COLLADAInstanceGeometry(pXML: Element): IColladaInstanceGeometry {
			var pInst: IColladaInstanceGeometry = {
				geometry: <IColladaGeometrie>this.source(attr(pXML, "url")),
				material: <IColladaBindMaterial>this.COLLADABindMaterial(firstChild(pXML, "bind_material"))
			};

			return pInst;
		}

		private COLLADAInstanceCamera(pXML: Element): IColladaInstanceCamera {
			var pInst: IColladaInstanceCamera = {
				camera: <IColladaCamera>this.source(attr(pXML, "url"))
			};

			return pInst;
		}

		private COLLADAInstanceLight(pXML: Element): IColladaInstanceLight {
			var pInst: IColladaInstanceLight = {
				light: <IColladaLight>this.source(attr(pXML, "url"))
			};

			return pInst;
		}

		// directly load <visual_scene> from <instance_visual_scene> from <scene>.
		private COLLADAScene(pXML: Element = firstChild(this.getXMLRoot(), "scene")): IColladaVisualScene {
			var pXMLData: Element = firstChild(pXML, "instance_visual_scene");
			var pScene: IColladaVisualScene = <IColladaVisualScene>this.source(attr(pXMLData, "url"));

			if (isNull(pXMLData) || isNull(pScene)) {
				debug.warn("model has no visual scenes.");
			}

			return this._pVisualScene = pScene;
		}

		//camera

		private COLLADAPerspective(pXML: Element): IColladaPerspective {
			var pPerspective: IColladaPerspective = {
				xfov: parseFloat(stringData(firstChild(pXML, "xfov")) || "60.") * math.RADIAN_RATIO,
				yfov: parseFloat(stringData(firstChild(pXML, "yfov")) || "60.") * math.RADIAN_RATIO,
				aspect: parseFloat(stringData(firstChild(pXML, "aspect")) || (4. / 3.).toString()),
				znear: parseFloat(stringData(firstChild(pXML, "znear")) || ".1"),
				zfar: parseFloat(stringData(firstChild(pXML, "zfar")) || "500."),
			}

			return pPerspective;
		}

		private COLLADAOptics(pXML: Element): IColladaOptics {
			var pOptics: IColladaOptics = {
				techniqueCommon: this.COLLADATechniqueCommon(firstChild(pXML, "technique_common"))
			}

			return pOptics;
		}

		private COLLADACamera(pXML: Element): IColladaCamera {
			var pCamera: IColladaCamera = {
				optics: null,
				id: attr(pXML, "id")
			};

			pCamera.optics = this.COLLADAOptics(firstChild(pXML, "optics"));

			this.link(pCamera);

			return pCamera;
		}

		//light

		private COLLADALight(pXML: Element): IColladaLight {
			return null;
		}

		// animation

		private COLLADAAnimationSampler(pXML: Element): IColladaAnimationSampler {
			var pSampler: IColladaAnimationSampler = {
				inputs: {},
				id: attr(pXML, "id")
			};


			var pInput: IColladaInput;
			var sSemantic: string;

			this.link(pSampler);

			this.eachByTag(pXML, "input", (pXMLData: Element): void => {
				sSemantic = attr(pXMLData, "semantic");

				switch (sSemantic) {
					case "INPUT":
					case "OUTPUT":
					case "INTERPOLATION":
					case "IN_TANGENT":
					case "OUT_TANGENT":
						pInput = this.prepareInput(this.COLLADAInput(pXMLData));
						pSampler.inputs[sSemantic] = pInput;
						break;

					default:
						debug.error("semantics are different from OUTPUT/INTERPOLATION/IN_TANGENT/OUT_TANGENT is not supported in the <sampler /> tag");
				}
			});

			return pSampler;
		}

		private COLLADAAnimationChannel(pXML: Element): IColladaAnimationChannel {
			var pChannel: IColladaAnimationChannel = {
				sampler: <IColladaAnimationSampler>this.source(attr(pXML, "source")),
				target: this.target(attr(pXML, "target"))
			};


			if (isNull(pChannel.target) || isNull(pChannel.target.object)) {
				debug.warn("cound not setup animation channel for <" + attr(pXML, "target") + ">");
				return null;
			}

			return pChannel;
		}


		private COLLADAAnimation(pXML: Element): IColladaAnimation {
			var pAnimation: IColladaAnimation = {
				id: attr(pXML, "id"),
				name: attr(pXML, "name"),
				sources: [],
				samplers: [],
				channels: [],
				animations: []
			};

			var pChannel: IColladaAnimationChannel;
			var pSubAnimation: IColladaAnimation;

			this.link(pAnimation);

			this.eachChild(pXML, (pXMLData: Element, sName?: string) => {
				switch (sName) {
					case "source":
						pAnimation.sources.push(this.COLLADASource(pXMLData));
						break;

					case "sampler":
						pAnimation.samplers.push(this.COLLADAAnimationSampler(pXMLData));
						break;

					case "channel":
						pChannel = this.COLLADAAnimationChannel(pXMLData);

						if (isDefAndNotNull(pChannel)) {
							//this guard for skipping channels with unknown targets
							pAnimation.channels.push(pChannel);
						}

						break;
					case "animation":
						pSubAnimation = this.COLLADAAnimation(pXMLData);

						if (isDefAndNotNull(pSubAnimation)) {
							pAnimation.animations.push(pSubAnimation);
						}
				}
			});

			if (pAnimation.channels.length == 0 && pAnimation.animations.length == 0) {
				debug.warn("animation with id \"" + pAnimation.id + "\" skipped, because channels/sub animation are empty");
				return null;
			}

			debug.assert(pXML.parentNode === firstChild(this.getXMLRoot(), "library_animations"),
				"sub animations not supported");

			this._pAnimations.push(pAnimation);

			return pAnimation;
		}

		// collada mapping

		private source(sUrl: string): IColladaEntry {
			if (sUrl.charAt(0) !== "#") {
				sUrl = "#" + sUrl;
			}

			var pElement: IColladaEntry = this._pLinks[sUrl];

			if (!isDefAndNotNull(pElement)) {
				debug.warn("cannot find element with id: " + sUrl + (<any>new Error).stack.split("\n").slice(1).join("\n"));
			}

			return pElement || null;
		}


		private link(el: any, pTarget?: IColladaEntry): void {
			var sId: string;

			if (!isString(arguments[0])) {
				pTarget = <IColladaEntry>arguments[0];
				sId = pTarget.id;
			}
			else {
				sId = <string>arguments[0];
			}

			this._pLinks["#" + sId] = pTarget;
		}

		//astroBoy_newSkeleton_root/rotateY.ANGLE
		//pObject.source: IColladaEntry = astroBoy_newSkeleton_root
		//pSource: IColladaTransform = source(astroBoy_newSkeleton_root/rotateY)
		//pSource: IColladaTransform = {
		//    sid: string;  //rotateY
		//    value: IVec4; //<0 1 0 -4.56752>
		//    name: string; //rotate
		//  }
		//
		//sValue: string = "ANGLE"
		//pObject.object: IColladaTransform = pSource;
		//
		private target(sPath: string): IColladaTarget {
			var pObject: IColladaTarget = { value: null };
			var pSource: IColladaTransform;

			var pMatches: string[];
			var sValue: string;

			var iPos: int;
			var jPos: int = 0;

			iPos = sPath.lastIndexOf("/");

			if (iPos >= 0) {
				pObject.source = this.source(sPath.substr(0, iPos));
			}

			iPos = sPath.lastIndexOf(".");

			if (iPos < 0) {
				iPos = sPath.indexOf("(");
				jPos = -1;
			}

			if (iPos < 0) {
				pObject.object = this.source(sPath);
				return pObject;
			}

			pSource = <IColladaTransform>this.source(sPath.substr(0, iPos));
			sValue = sPath.substr(iPos + jPos + 1);
			pObject.object = pSource;

			if (!pSource) {
				return null;
			}

			switch (sValue) {
				case "X":
					pObject.value = (<IVec4>pSource.value).x;
					break;
				case "Y":
					pObject.value = (<IVec4>pSource.value).y;
					break;
				case "Z":
					pObject.value = (<IVec4>pSource.value).z;
					break;
				case "W":
					pObject.value = (<IVec4>pSource.value).w;
					break;
				case "ANGLE":
					pObject.value = (<IVec4>pSource.value).w;
					//<rotate sid="rotateY">0 1 0 -4.56752</rotate>
					break;
			}

			if (isDefAndNotNull(pObject.value)) {
				return pObject;
			}

			pMatches = sValue.match(/^\((\d+)\)$/);

			if (pMatches) {
				pObject.value = Number(pMatches[1]);
			}

			pMatches = sValue.match(/^\((\d+)\)\((\d+)\)$/)

			if (pMatches) {
				//trace(pMatches, '--->',  Number(pMatches[2]) * 4 + Number(pMatches[1]));
				//pObject.value = Number(pMatches[2]) * 4 + Number(pMatches[1]);
				pObject.value = Number(pMatches[1]) * 4 + Number(pMatches[2]);
			}

			debug.assert(isDefAndNotNull(pObject.value), "unsupported target value founded: " + sValue);

			return pObject;
		}

		// //animation 

		private buildAnimationTrack(pChannel: IColladaAnimationChannel): IAnimationTrack {
			var sNodeId: string = pChannel.target.source.id;
			var sJoint: string = this.source(sNodeId).sid || null;
			var pTrack: IAnimationTrack = null;
			var pSampler: IColladaAnimationSampler = pChannel.sampler;

			debug.assert(isDefAndNotNull(pSampler), "could not find sampler for animation channel");

			var pInput: IColladaInput = pSampler.inputs["INPUT"];
			var pOutput: IColladaInput = pSampler.inputs["OUTPUT"];
			var pInterpolation: IColladaInput = pSampler.inputs["INTERPOLATION"];

			var pTimeMarks: float[] = pInput.array;
			var pOutputValues: float[] = pOutput.array;
			var pFloatArray: Float32Array;

			var pTransform: IColladaTransform = <IColladaTransform>pChannel.target.object
			var sTransform: string = pTransform.transform;
			var v4f: IVec4;
			var pValue: any;
			var nMatrices: uint;

			// if (sJoint == null) {
			//     warning('node\'s <' + pChannel.pTarget.pSource.id + '> "sid" attribute is null');
			// }

			switch (sTransform) {
				case "translate":
					// pTrack = new a.AnimationTranslation(sJoint);

					// for (var i = 0, v3f = new Array(3), n; i < pTimeMarks.length; ++ i) {
					//     n = i * 3;
					//     v3f.X = pOutputValues[i * 3];
					//     v3f.Y = pOutputValues[i * 3 + 1];
					//     v3f.Z = pOutputValues[i * 3 + 2];
					//     pTrack.keyFrame(pTimeMarks[i], [v3f.X, v3f.Y, v3f.Z]);
					// };
					logger.critical("TODO: implement animation translation");
					//TODO: implement animation translation
					break;
				case "rotate":
					// v4f = pTransform.pValue;
					// pTrack = new a.AnimationRotation(sJoint, [v4f[1], v4f[2], v4f[3]]);

					// debug.assert(pOutput.pAccessor.iStride === 1, 
					//     "matrix modification supported only for one parameter modification");

					// for (var i = 0; i < pTimeMarks.length; ++ i) {
					//     pTrack.keyFrame(pTimeMarks[i], pOutputValues[i] / 180.0 * math.PI);
					// };
					logger.critical("TODO: implement animation rotation");
					//TODO: implement animation rotation
					break;
				case "matrix":
					pValue = pChannel.target.value;
					if (isNull(pValue)) {
						pTrack = animation.createTrack(sJoint);
						nMatrices = pOutputValues.length / 16;
						pFloatArray = new Float32Array(pOutputValues);

						debug.assert(nMatrices % 1 === 0.0,
							"incorrect output length of transformation data (" + pFloatArray.length + ")");

						for (var i: int = 0; i < nMatrices; i++) {
							var pFrame: IPositionFrame = new animation.PositionFrame(
								pTimeMarks[i],
								(new Mat4(pFloatArray.subarray(i * 16, i * 16 + 16), true)).transpose());
							pTrack.keyFrame(pFrame);
						}


						// i=0;
						// var m = (new Mat4(pFloatArray.subarray(i * 16, i * 16 + 16), true));
						// trace(sFilename,sNodeId,m.toString());
					}
					else {
						// pTrack = new a.AnimationMatrixModification(sJoint, pValue);

						// for (var i = 0; i < pTimeMarks.length; ++i) {
						//     pTrack.keyFrame(pTimeMarks[i], pOutputValues[i]);
						// }
						logger.critical("TODO: implement animation matrix modification");
					}
					break;
				default:
					debug.error("unsupported animation typed founeed: " + sTransform);
			}

			if (!isNull(pTrack)) {
				pTrack.setTargetName(sNodeId);
			}

			return pTrack;
		}

		private buildAnimationTrackList(pAnimationData: IColladaAnimation): IAnimationTrack[] {
			var pSubAnimations: IColladaAnimation[] = pAnimationData.animations;
			var pSubTracks: IAnimationTrack[];
			var pTrackList: IAnimationTrack[] = [];
			var pTrack: IAnimationTrack;
			var pChannels: IColladaAnimationChannel[] = pAnimationData.channels;

			for (var i: int = 0; i < pChannels.length; ++i) {
				pTrack = this.buildAnimationTrack(pChannels[i]);
				pTrackList.push(pTrack);
			}


			if (isDefAndNotNull(pSubAnimations)) {
				for (var i: int = 0; i < pSubAnimations.length; ++i) {
					pSubTracks = this.buildAnimationTrackList(pSubAnimations[i]);
					pTrackList = pTrackList.concat(pSubTracks);
				}
			}

			return pTrackList;
		}

		private buildAnimation(pAnimationData: IColladaAnimation): IAnimation {

			var pTracks: IAnimationTrack[] = this.buildAnimationTrackList(pAnimationData);
			var sAnimation: string = pAnimationData.name || pAnimationData.id || null;
			var pAnimation: IAnimation = animation.createAnimation(sAnimation || this.getBasename());

			for (var i: int = 0; i < pTracks.length; i++) {
				pAnimation.push(pTracks[i]);
			}

			return pAnimation;
		}

		private buildAnimations(pAnimationsList: IAnimation[]= []): IAnimation[] {
			var pAnimations: IColladaAnimation[] = this.getAnimations();

			if (isNull(pAnimations)) {
				return null;
			}

			for (var i: int = 0; i < pAnimations.length; ++i) {
				var pAnimation: IAnimation = this.buildAnimation(pAnimations[i]);

				pAnimationsList.push(pAnimation);
			}

			return pAnimationsList;
		}

		// common

		private buildAssetTransform(pNode: ISceneNode, pAsset: IColladaAsset = null): ISceneNode {
			pAsset = pAsset || this.getAsset();

			if (isDefAndNotNull(pAsset)) {
				var fUnit: float = pAsset.unit.meter;
				var sUPaxis: string = pAsset.upAxis;

				pNode.setLocalScale(Vec3.temp(fUnit));

				if (sUPaxis.toUpperCase() == "Z_UP") {
					//pNode.addRelRotation([1, 0, 0], -.5 * math.PI);
					pNode.addRelRotationByEulerAngles(0, -.5 * math.PI, 0);
				}
			}

			return pNode;
		}

		private buildDeclarationFromAccessor(sSemantic: string, pAccessor: IColladaAccessor): IVertexElementInterface[] {
			var pDecl: IVertexElementInterface[] = [];

			for (var i: int = 0; i < pAccessor.params.length; ++i) {
				var sUsage: string = pAccessor.params[i].name;
				var sType: string = pAccessor.params[i].type;

				logger.assert(sType === "float", "Only float type supported for construction declaration from accessor");

				pDecl.push(VE.float(sUsage));
			}

			pDecl.push(VE.custom(sSemantic, EDataTypes.FLOAT, pAccessor.params.length, 0));

			debug.info("Automatically constructed declaration: ", data.VertexDeclaration.normalize(pDecl).toString());

			return pDecl;
		}


		// materials & meshes

		private buildDefaultMaterials(pMesh: IMesh): IMesh {
			var pDefaultMaterial: IMaterial = material.create();

			for (var j: int = 0; j < pMesh.getLength(); ++j) {
				var pSubMesh: IMeshSubset = pMesh.getSubset(j);
				pSubMesh.getMaterial().set(pDefaultMaterial);
				pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");
			}

			return pMesh;
		}

		private buildMaterials(pMesh: IMesh, pGeometryInstance: IColladaInstanceGeometry): IMesh {
			var pMaterials: IColladaBindMaterial = pGeometryInstance.material;
			var pEffects: IColladaEffectLibrary = <IColladaEffectLibrary>this.getLibrary("library_effects");

			if (isNull(pEffects) || isNull(pMaterials)) {
				return this.buildDefaultMaterials(pMesh);
			}

			// debug.time("Build materials #" + pGeometryInstance.geometry.id);

			for (var sMaterial in pMaterials) {
				var pMaterialInst: IColladaInstanceMaterial = pMaterials[sMaterial];
				var pInputMap: IColladaBindVertexInputMap = pMaterialInst.vertexInput;
				// URL --> ID (#somebody ==> somebody)
				var sEffectId: string = pMaterialInst.material.instanceEffect.effect.id;
				var pEffect: IColladaEffect = pEffects.effect[sEffectId];
				var pPhongMaterial: IColladaPhong = <IColladaPhong>pEffect.profileCommon.technique.value;
				var pMaterial: IMaterial = pPhongMaterial.material;

				if (isNull(pMaterial)) {
					pMaterial = material.create(sEffectId);
					pMaterial.set(<IMaterialBase>pPhongMaterial);
					pPhongMaterial.material = pMaterial;
					this.addMaterial(sEffectId, pPhongMaterial);
				}

				for (var j: int = 0; j < pMesh.getLength(); ++j) {
					var pSubMesh: IMeshSubset = pMesh.getSubset(j);

					if (pSubMesh.getMaterial().name === sMaterial) {
						//setup materials
						//pSubMesh.getMaterial().set(pMaterial);
						pSubMesh.getSurfaceMaterial().setMaterial(pMaterial);
						pSubMesh.getRenderMethod().getEffect().addComponent("akra.system.mesh_texture");

						//setup textures
						for (var sTextureType in pPhongMaterial.textures) {
							var pColladaTexture: IColladaTexture = pPhongMaterial.textures[sTextureType];

							if (isNull(pColladaTexture)) {
								continue;
							}

							var pInput: IColladaBindVertexInput = pInputMap[pColladaTexture.texcoord];

							if (!isDefAndNotNull(pInput)) {
								continue;
							}

							var sInputSemantics: string = pInputMap[pColladaTexture.texcoord].inputSemantic;
							var pColladaImage: IColladaImage = pColladaTexture.image;


							var pSurfaceMaterial: ISurfaceMaterial = pSubMesh.getSurfaceMaterial();
							var pTexture: ITexture = <ITexture>this.getManager().getTexturePool().findResource(pColladaImage.path);

							if (this.getImageOptions().flipY === true) {
								logger.error("TODO: flipY for image unsupported!");
							}

							var pMatches: string[] = sInputSemantics.match(/^(.*?\w)(\d+)$/i);
							var iTexCoord: int = (pMatches ? parseInt(pMatches[2]) : 0);


							var iTexture: int = <any>ESurfaceMaterialTextures[sTextureType.toUpperCase()] | 0;

							if (!isDef(iTexture)) {
								continue;
							}
							// logger.log(iTexture, sTextureType)
							pSurfaceMaterial.setTexture(iTexture, pTexture, iTexCoord);
							// logger.log(pSurfaceMaterial);
						}

						if (this.isWireframeEnabled()) {
							pSubMesh.wireframe(true);
						}
					}
				}
			}

			// debug.timeEnd("Build materials #" + pGeometryInstance.geometry.id);

			return pMesh;
		}


		private buildSkeleton(pSkeletonsList: string[]): ISkeleton {
			var pSkeleton: ISkeleton = null;

			pSkeleton = model.createSkeleton(pSkeletonsList[0]);

			for (var i: int = 0; i < pSkeletonsList.length; ++i) {
				var pJoint: IJoint = <IJoint>(<IColladaNode>this.source(pSkeletonsList[i])).constructedNode;

				logger.assert(scene.Joint.isJoint(pJoint), "skeleton node must be joint");

				pSkeleton.addRootJoint(pJoint);
			}

			this.addSkeleton(pSkeleton);
			return pSkeleton;
		}

		private buildMesh(pGeometryInstance: IColladaInstanceGeometry, isSkinned: boolean = false): IMesh {

			var pMesh: IMesh = null;
			var pGeometry: IColladaGeometrie = pGeometryInstance.geometry;
			var pNodeData: IColladaMesh;
			var sMeshName: string = pGeometry.id;

			//we cant optimize skinned mesh, because animation can be placed in file differen from current
			if (!isSkinned && !Collada.isCOLLADAMeshOptimized(pGeometry.mesh)) {
				pNodeData = this.optimizeCOLLADAMesh(pGeometry.mesh);
			}
			else {
				pNodeData = pGeometry.mesh;
			}

			if (isNull(pNodeData)) {
				return null;
			}

			if ((pMesh = this.findMesh(sMeshName))) {
				//mesh with same geometry data
				return this.buildMaterials(
					pMesh.clone(EMeshCloneOptions.GEOMETRY_ONLY | EMeshCloneOptions.SHARED_GEOMETRY),
					pGeometryInstance);
			}

			var iBegin: int = Date.now();

			pMesh = this.getEngine().createMesh(
				sMeshName,
				<int>(EMeshOptions.HB_READABLE), /*|EMeshOptions.RD_ADVANCED_INDEX,  0,*/
				null);

			var pPolyGroup: IColladaPolygons[] = pNodeData.polygons;
			var pMeshData: IRenderDataCollection = pMesh.getData();

			//creating subsets
			for (var i: int = 0; i < pPolyGroup.length; ++i) {
				pMesh.createSubset(pGeometry.id + "-submesh-" + i, pPolyGroup[i].type,
					Collada.isSingleIndexedPolygons(pPolyGroup[i]) ? ERenderDataBufferOptions.RD_SINGLE_INDEX : 0);
			}

			//TODO: correct check, that it is simple mesh.
			if (Collada.isSingleIndexedPolygons(pPolyGroup[0])) {
				var pVertexBuffer: IVertexBuffer = this.getManager().createVertexBuffer(sMeshName);

				var pDataMap: IMap<ArrayBufferView> = <any>{};
				var iByteLength: uint = 0;
				var pDeclElements: IVertexElementInterface[] = [];
				var pDeclaration: IVertexDeclaration = new data.VertexDeclaration();

				for (var i: int = 0; i < pPolyGroup.length; ++i) {
					var pPolygons: IColladaPolygons = pPolyGroup[i];

					for (var j: int = 0; j < pPolygons.inputs.length; ++j) {
						var pInput: IColladaInput = pPolygons.inputs[j];
						var sSemantic: string = pInput.semantics;

						if (sSemantic === "TEXCOORD") {
							sSemantic = "TEXCOORD0";
						}

						if (!isDefAndNotNull(pDataMap[sSemantic])) {
							pDataMap[sSemantic] = <ArrayBufferView><any>pInput.array;
							iByteLength += (<ArrayBufferView><any>pInput.array).byteLength;
							pDeclaration.append(VE.custom(sSemantic, EDataTypes.FLOAT, pInput.accessor.params.length));
						}
					}
				}


				pVertexBuffer.create(iByteLength, EHardwareBufferFlags.STATIC_READABLE);

				var pVertexData = pVertexBuffer.getEmptyVertexData(iByteLength / pDeclaration.stride, pDeclaration);

				for (var sSemantic in pDataMap) {
					if (!pVertexData.setData(pDataMap[sSemantic], sSemantic)) {
						debug.error("could not load data to buffer: " + sSemantic);
					}
				}

				for (var i = 0; i < pMesh.getLength(); ++i) {
					pMesh.getSubset(i).getData()._addData(pVertexData);
				}
			}
			else {
				//filling data for multiple indexes

				//	pUsedSemantics contains semantics of already added data.
				//	many <imput />'s are linked into same data, consequently, we must skip duplicates
				for (var i: int = 0, pUsedSemantics: IMap<boolean> = <IMap<boolean>>{}; i < pPolyGroup.length; ++i) {
					var pPolygons: IColladaPolygons = pPolyGroup[i];

					for (var j: int = 0; j < pPolygons.inputs.length; ++j) {
						var pInput: IColladaInput = pPolygons.inputs[j];
						var sSemantic: string = pInput.semantics;
						var pData: ArrayBufferView = <ArrayBufferView><any>pInput.array;
						var pDecl: IVertexElementInterface[];
						var pDataExt: Float32Array;

						//if (pMesh.buffer.getDataLocation(sSemantic) < 0) {
						if (!pUsedSemantics[sSemantic]) {
							pUsedSemantics[sSemantic] = true;

							switch (sSemantic) {
								case data.Usages.POSITION:
								case data.Usages.NORMAL:

									/*
									 Extend POSITION and NORMAL from {x,y,z} --> {x,y,z,w};
									 */

									pDataExt = new Float32Array((<Float32Array>pData).length / 3 * 4);

									for (var y = 0, n = 0, m = 0, l = (<Float32Array>pData).length / 3; y < l; y++, n++) {
										pDataExt[n++] = pData[m++];
										pDataExt[n++] = pData[m++];
										pDataExt[n++] = pData[m++];
									}

									pData = pDataExt;
									pDecl = [VE.float3(sSemantic), VE.end(16)];

									break;
								case data.Usages.TEXCOORD:
								case data.Usages.TEXCOORD1:
								case data.Usages.TEXCOORD2:
								case data.Usages.TEXCOORD3:
								case data.Usages.TEXCOORD4:
								case data.Usages.TEXCOORD5:
									//avoiding semantics collisions
									if (sSemantic === "TEXCOORD") {
										sSemantic = "TEXCOORD0";
									}

									pDecl = [VE.custom(sSemantic, EDataTypes.FLOAT, pInput.accessor.stride)];
									break;
								default:
									pDecl = this.buildDeclarationFromAccessor(sSemantic, pInput.accessor);
									debug.warn("unsupported semantics used: " + sSemantic);
							}

							pMeshData.allocateData(pDecl, pData);
						}
					}
				}
			}

			//add indices to data
			for (var i: int = 0; i < pPolyGroup.length; ++i) {
				var pPolygons: IColladaPolygons = pPolyGroup[i];

				//geometries
				var pSubMesh: IMeshSubset = pMesh.getSubset(i);
				var pSubMeshData: IRenderData = pSubMesh.getData();
				var pIndexDecl: IVertexDeclaration = null;


				//materials
				var pSurfaceMaterial: ISurfaceMaterial = null;
				var pSurfacePool: IResourcePool<ISurfaceMaterial> = null;

				if (pSubMeshData.useMultiIndex()) {
					pIndexDecl = data.VertexDeclaration.normalize(/* undefined */);

					for (var j: int = 0; j < pPolygons.inputs.length; ++j) {
						//number of index
						var iOffset: int = pPolygons.inputs[j].offset;
						//like: 
						//	<input semantic = "VERTEX" offset ="0"/ > has index semantics INDEX0
						//	<input semantic = "NORMAL" offset ="1"/ > has index semantics INDEX1
						var sIndexSemantic: string = data.Usages.INDEX + iOffset;

						//total number of offsets can be less then number of inputs
						//for example: 
						//	<input semantic = "VERTEX" offset ="0"/ >
						//	<input semantic = "VERTEX" offset ="0"/ >
						//
						// two <input />'s has same offset
						if (!pIndexDecl.hasSemantics(sIndexSemantic)) {
							pIndexDecl.append(VE.float(sIndexSemantic));
						}
					}

					pSubMeshData.allocateIndex(pIndexDecl, new Float32Array(pPolygons.p));

					for (var j: int = 0; j < pPolygons.inputs.length; ++j) {
						var sSemantic: string = pPolygons.inputs[j].semantics;
						var sIndexSemantics: string = data.Usages.INDEX + pPolygons.inputs[j].offset;

						pSubMeshData.index(sSemantic, sIndexSemantics);
					}
				}
				//single index case:
				else {
					debug.assert(pPolygons.inputs[0].offset === 0, "Single index with non-zero offset unsupported.");

					//alocate single index
					pSubMeshData.allocateIndex(null, new Uint32Array(pPolygons.p));
				}

				pSubMesh.getMaterial().name = pPolygons.material;
			}


			pMesh.setShadow(this.isShadowsEnabled());

			//adding all data to cahce data
			this.addMesh(pMesh);
			// debug.timeEnd("Build mesh #" + pGeometry.id);

			return this.buildMaterials(pMesh, pGeometryInstance);
		}

		private buildSkinMesh(pControllerInstance: IColladaInstanceController): IMesh {
			var pController: IColladaController = pControllerInstance.controller;
			var pMaterials: IColladaBindMaterial = pControllerInstance.material;

			var pSkinData: IColladaSkin = pController.skin;

			//skin data
			var pBoneList: string[] = <string[]>pSkinData.joints.inputs["JOINT"].array;
			var pBoneOffsetMatrices: IMat4[] = <IMat4[]>pSkinData.joints.inputs["INV_BIND_MATRIX"].array;

			var m4fBindMatrix: IMat4 = pSkinData.shapeMatrix;
			var pVertexWeights: IColladaVertexWeights = pSkinData.vertexWeights;

			var pGeometry: IColladaGeometrie = pSkinData.geometry;

			var pMesh: IMesh;
			var pSkeleton: ISkeleton;
			var pSkin: ISkin;

			pSkeleton = this.buildSkeleton(pControllerInstance.skeletons);
			pMesh = this.buildMesh({ geometry: pGeometry, material: pMaterials }, true);

			pSkin = pMesh.createSkin();

			pSkin.setBindMatrix(m4fBindMatrix);
			pSkin.setBoneNames(pBoneList);
			pSkin.setBoneOffsetMatrices(pBoneOffsetMatrices);

			if (!pSkin.setVertexWeights(
				<uint[]>pVertexWeights.vcount,
				new Float32Array(pVertexWeights.v),
				new Float32Array(pVertexWeights.weightInput.array))) {
				logger.error("cannot set vertex weight info to skin");
			}

			pMesh.setSkin(pSkin);
			pSkeleton.attachMesh(pMesh);

			return pMesh;
		}


		private buildSkinMeshInstance(pControllers: IColladaInstanceController[], pSceneNode: ISceneModel = null): IMesh[] {
			var pMesh: IMesh = null;
			var pMeshList: IMesh[] = [];

			for (var m: int = 0; m < pControllers.length; ++m) {
				pMesh = this.buildSkinMesh(pControllers[m]);
				pMeshList.push(pMesh);

				debug.assert(isDefAndNotNull(pMesh), "cannot find instance <" + pControllers[m].url + ">\"s data");

				if (!isNull(pSceneNode)) {
					pSceneNode.setMesh(pMesh);
				}
			}

			return pMeshList;
		}

		private buildMeshInstance(pGeometries: IColladaInstanceGeometry[], pSceneNode: ISceneModel = null): IMesh[] {
			var pMesh: IMesh = null;
			var pMeshList: IMesh[] = [];

			for (var m: int = 0; m < pGeometries.length; ++m) {
				pMesh = this.buildMesh(pGeometries[m]);
				pMeshList.push(pMesh);

				debug.assert(isDefAndNotNull(pMesh), "cannot find instance <" + pGeometries[m].url + ">\"s data");

				if (!isNull(pSceneNode)) {
					pSceneNode.setMesh(pMesh);
				}
			}

			return pMeshList;
		}

		private buildMeshByName(sName: string): IMesh {
			var pScene: IColladaVisualScene = this.getVisualScene();
			var pMesh: IMesh = null;

			this.findNode(pScene.nodes, null, (pNode: IColladaNode) => {
				var pModelNode: ISceneNode;

				if (pNode.controller.length == 0 && pNode.geometry.length == 0) {
					return;
				}

				//get controller/geometry only with wanted name

				//for (var i = 0; i < pNode.controller.length; ++i) {
				//	var pInstanceController: IColladaInstanceController = pNode.controller[i];

				//	if (isNull(sName) || pInstanceController.controller.name === sName) {
				//		pMesh = this.buildSkinMesh(pInstanceController);
				//		return false;
				//	}
				//}

				for (var i = 0; i < pNode.geometry.length; ++i) {
					var pInstanceGeometry: IColladaInstanceGeometry = pNode.geometry[i];
					if (isNull(sName) || pInstanceGeometry.geometry.name === sName) {
						pMesh = this.buildMesh(pInstanceGeometry);
						return false;
					}
				}
			});

			return pMesh;
		}

		private buildMeshes(): IMesh[] {
			var pScene: IColladaVisualScene = this.getVisualScene();
			var pMeshes: IMesh[] = [];

			this.findNode(pScene.nodes, null, function (pNode: IColladaNode) {
				var pModelNode: ISceneNode = pNode.constructedNode;

				if (isNull(pModelNode)) {
					debug.error("you must call buildScene() before call buildMeshes() or file corrupt");
					return;
				}

				if (pNode.controller.length == 0 && pNode.geometry.length == 0) {
					return;
				}

				if (!scene.SceneModel.isModel(pModelNode) && pNode.geometry.length > 0) {
					pModelNode = pModelNode.getScene().createModel(".joint-to-model-link-" + guid());
					pModelNode.attachToParent(pNode.constructedNode);
				}

				pMeshes.insert(<IMesh[]>this.buildSkinMeshInstance(pNode.controller));
				pMeshes.insert(<IMesh[]>this.buildMeshInstance(pNode.geometry, pModelNode));
			});

			return pMeshes;
		}

		// scene

		private buildSceneNode(pNode: IColladaNode, pParentNode: ISceneNode): ISceneNode {
			var pSceneNode: ISceneNode = pNode.constructedNode;
			var pScene: IScene3d = pParentNode.getScene();

			if (isDefAndNotNull(pSceneNode)) {
				return pSceneNode;
			}

			//FIXME: предпологаем, что мы никогда не аттачим контроллеры к узлам,
			// где они найдены, а аттачим  их к руту скелета, на который они ссылаются
			if (pNode.geometry.length > 0) {   /*pNode.pController.length ||*/
				pSceneNode = pScene.createModel();
			}
			else {
				pSceneNode = pScene.createNode();
			}

			logger.assert(pSceneNode.create(), "Can not initialize scene node!");

			pSceneNode.attachToParent(pParentNode);

			return pSceneNode;
		}

		private buildJointNode(pNode: IColladaNode, pParentNode: ISceneNode): IJoint {
			var pJointNode: IJoint = <IJoint>pNode.constructedNode;
			var sJointSid: string = pNode.sid;
			var sJointName: string = pNode.id;
			var pSkeleton: ISkeleton;

			debug.assert(isDefAndNotNull(pParentNode), "parent node is null");

			if (isDefAndNotNull(pJointNode)) {
				return pJointNode;
			}

			if (isNull(pParentNode)) {
				return null;
			}

			pJointNode = pParentNode.getScene().createJoint();

			logger.assert(pJointNode.create(), "Can not initialize joint node!");

			pJointNode.setBoneName(sJointSid);
			pJointNode.attachToParent(pParentNode);

			return pJointNode;
		}

		private buildCamera(pColladaInstanceCamera: IColladaInstanceCamera, pParent: ISceneNode): ICamera {
			var pColladaCamera: IColladaCamera = pColladaInstanceCamera.camera;
			var pCamera: ICamera = pParent.getScene().createCamera(pColladaCamera.name || pColladaCamera.id || null);

			pCamera.setInheritance(ENodeInheritance.ALL);
			pCamera.attachToParent(pParent);

			var pPerspective: IColladaPerspective = pColladaCamera.optics.techniqueCommon.perspective;



			if (!isNull(pPerspective)) {
				pCamera.setProjParams(pPerspective.xfov, pPerspective.aspect, pPerspective.znear,
					//FIX far plane distance
					pPerspective.zfar * (1 / this.getAsset().unit.meter));
			}

			return pCamera;
		}

		private buildNodes(pNodes: IColladaNode[], pParentNode: ISceneNode = null): ISceneNode {
			if (isNull(pNodes)) {
				return null;
			}

			var pNode: IColladaNode = null;
			var pHierarchyNode: ISceneNode = null;
			var m4fLocalMatrix: IMat4 = null;

			for (var i: int = pNodes.length - 1; i >= 0; i--) {
				pNode = pNodes[i];

				if (!isDefAndNotNull(pNode)) {
					continue;
				}

				if (pNode.type === "JOINT") {
					pHierarchyNode = this.buildJointNode(pNode, pParentNode);
				}
				else {
					pHierarchyNode = this.buildSceneNode(pNode, pParentNode);
				}

				pHierarchyNode.setName(pNode.id || pNode.name);
				pHierarchyNode.setInheritance(ENodeInheritance.ALL);

				//cache already constructed nodes
				pNode.constructedNode = pHierarchyNode;
				pHierarchyNode.setLocalMatrix(pNode.transform);

				this.buildNodes(pNode.childNodes, pHierarchyNode);

				if (pNode.camera.length > 0) {
					for (var c = 0; c < pNode.camera.length; ++c) {
						var pColladaCamera: IColladaInstanceCamera = pNode.camera[c];
						var pCamera: ICamera = this.buildCamera(pColladaCamera, pHierarchyNode);
					}
				}
			}

			return pHierarchyNode;
		}

		private buildScene(pRootNode: ISceneNode): ISceneNode[] {
			var pScene: IColladaVisualScene = this.getVisualScene();
			var pAsset: IColladaAsset = this.getAsset();

			var pNodes: ISceneNode[] = [];
			var pNode: IColladaNode = null;

			for (var i: int = 0; i < pScene.nodes.length; i++) {
				pNode = pScene.nodes[i];
				pNodes.push(this.buildNodes([pNode], pRootNode));
			}

			for (var i: int = 0; i < pNodes.length; i++) {
				pNodes[i] = this.buildAssetTransform(pNodes[i]);
			}

			return pNodes;
		}

		private buildInititalPose(pNodes: IColladaNode[], pSkeleton: ISkeleton): IAnimation {
			var sPose: string = "Pose-" + this.getBasename() + "-" + pSkeleton.getName();
			var pPose: IAnimation = animation.createAnimation(sPose);
			var pNodeList: ISceneNode[] = pSkeleton.getNodeList();
			var pNodeMap: IMap<ISceneNode> = {};
			var pTrack: IAnimationTrack;

			for (var i: int = 0; i < pNodeList.length; ++i) {
				pNodeMap[pNodeList[i].getName()] = pNodeList[i];
			}

			this.findNode(pNodes, null, function (pNode: IColladaNode) {
				var sJoint: string = pNode.sid;
				var sNodeId: string = pNode.id;

				if (!isDefAndNotNull(pNodeMap[sNodeId])) {
					return;
				}

				pTrack = animation.createTrack(sJoint);
				pTrack.setTargetName(sNodeId);
				pTrack.keyFrame(0.0, pNode.transform);

				pPose.push(pTrack);
			});

			return pPose;
		}

		private buildInitialPoses(pPoseSkeletons: ISkeleton[]= null): IAnimation[] {
			if (!this.isVisualSceneLoaded()) {
				this.COLLADAScene();
			}

			pPoseSkeletons = pPoseSkeletons || this.getSkeletonsOutput();

			if (isNull(pPoseSkeletons)) {
				return null;
			}

			var pScene: IColladaVisualScene = this.getVisualScene();
			var pSkeleton: ISkeleton;
			var pPoses: IAnimation[] = [];

			for (var i: int = 0; i < pPoseSkeletons.length; ++i) {
				pSkeleton = pPoseSkeletons[i];
				// if (pSkeleton.name === "node-Bip001_Pelvis" || pSkeleton.name === "node-Bip001") {
				//     trace('skipping <node-Bip001_Pelvis> skeleto, ...', '[' + sBasename + ']');

				//     trace(pSkeleton.getNodeList()[0].localMatrix().toQuat4().toYawPitchRoll(Vec3()).toString());

				//     continue;
				// }
				pPoses.push(this.buildInititalPose(pScene.nodes, pSkeleton));
			}
			// logger.log(pPoses);
			return pPoses;
		}

		// additional


		private buildComplete(): void {
			var pScene: IColladaVisualScene = this.getVisualScene();

			if (isNull(pScene)) {
				debug.warn("build complete, but visual scene not parsed correctly!");
				return;
			}

			//release all links to constructed nodes
			this.findNode(pScene.nodes, null, function (pNode: IColladaNode) {
				pNode.constructedNode = null;
			});
		}

		setOptions(pOptions: IColladaLoadOptions): void {
			if (isNull(pOptions)) {
				pOptions = {};
			}

			for (var i in Collada.DEFAULT_OPTIONS) {
				if (isDef(pOptions[i])) {
					this._pOptions[i] = pOptions[i];
				}
				else {
					this._pOptions[i] = isDef(this._pOptions[i]) ? this._pOptions[i] : Collada.DEFAULT_OPTIONS[i];
				}
			}
		}

		private setXMLDocument(pDocument: Document): void {
			this._pXMLDocument = pDocument;
		}

		private getXMLDocument(): Document {
			return this._pXMLDocument;
		}

		private setXMLRoot(pXML: Element): void {
			this._pXMLRoot = pXML;
		}

		private getXMLRoot(): Element {
			return this._pXMLRoot;
		}

		private findMesh(sName: string): IMesh {
			return this._pMeshCache[sName] || null;
		}

		private addMesh(pMesh: IMesh): void {
			this._pMeshCache[pMesh.getName()] = pMesh;
		}

		private findMaterial(sName: string): IColladaPhong {
			return this._pMaterialCache[sName] || null;
		}

		private addMaterial(sName: string, pMaterial: IColladaPhong): void {
			this._pMaterialCache[sName] = pMaterial;
		}

		private prepareInput(pInput: IColladaInput): IColladaInput {
			var pSupportedFormat: IColladaUnknownFormat[] = getSupportedFormat(pInput.semantics);
			debug.assert(isDefAndNotNull(pSupportedFormat), "unsupported semantic used <" + pInput.semantics + ">");

			pInput.array = <any[]><any>this.COLLADAGetSourceData(pInput.source, pSupportedFormat);
			pInput.accessor = pInput.source.techniqueCommon.accessor;

			return pInput;
		}

		public isVisualSceneLoaded(): boolean {
			return isDefAndNotNull(this._pVisualScene);
		}

		public isAnimationLoaded(): boolean {
			return this._pAnimations.length > 0;
		}

		private isSceneNeeded(): boolean {
			return this._pOptions.scene === true;
		}

		private isAnimationNeeded(): boolean {
			return isDefAndNotNull(this._pOptions.animation) && this._pOptions.animation !== false;
		}

		private isPoseExtractionNeeded(): boolean {
			return this._pOptions.extractPoses === true;
		}

		private isWireframeEnabled(): boolean {
			return this._pOptions.wireframe === true;
		}

		private getSkeletonsOutput(): ISkeleton[] {
			return this._pOptions.skeletons || null;
		}

		private addSkeleton(pSkeleton: ISkeleton): void {
			this._pOptions.skeletons.push(pSkeleton);
		}

		private getImageOptions(): IColladaImageLoadOptions {
			return this._pOptions.images;
		}

		private getVisualScene(): IColladaVisualScene {
			return this._pVisualScene;
		}

		public getAnimations(): IColladaAnimation[] {
			return this._pAnimations;
		}

		public getAnimation(i: int): IColladaAnimation {
			return this._pAnimations[i] || null;
		}

		public getAsset(): IColladaAsset {
			return this._pAsset;
		}

		private isLibraryLoaded(sLib: string): boolean {
			return isDefAndNotNull(this._pLib[sLib]);
		}

		private isLibraryExists(sLib: string): boolean {
			return !isNull(firstChild(this.getXMLRoot(), "library_animations"));
		}

		private getLibrary(sLib: string): IColladaLibrary {
			return this._pLib[sLib] || null;
		}

		public getBasename(): string {
			return path.parse(this._pOptions.name || this._sFilename || "unknown").getBaseName();
		}

		public getVersion(): string {
			return this._pXMLRoot.getAttribute("version") || null;
		}

		public getFilename(): string {
			return this._sFilename;
		}

		private setFilename(sName: string): void {
			this._sFilename = sName;
		}

		private readLibraries(pXML: Element, pTemplates: IColladaLibraryTemplate[]): void {
			var pLibraries: IColladaLibraryMap = this._pLib;

			for (var i: int = 0; i < pTemplates.length; i++) {
				var sLib: string = pTemplates[i].lib;
				pLibraries[sLib] = this.COLLADALibrary(firstChild(pXML, sLib), pTemplates[i]);
			}
		}

		private checkLibraries(pXML: Element, pTemplates: IColladaLibraryTemplate[]): void {
			var pLibraries: IColladaLibraryMap = this._pLib;

			for (var i: int = 0; i < pTemplates.length; i++) {
				var sLib: string = pTemplates[i].lib;

				if (isDefAndNotNull(firstChild(pXML, sLib))) {
					pLibraries[sLib] = null;
				}
			}
		}

		parse(sXMLData: string, pOptions: IColladaLoadOptions = null): boolean {
			if (isNull(sXMLData)) {
				debug.error("must be specified collada content.");
				return false;
			}

			// debug.time("parsed");

			var pParser: DOMParser = new DOMParser();
			var pXMLDocument: Document = pParser.parseFromString(sXMLData, "application/xml");
			var pXMLRoot: Element = <Element>pXMLDocument.getElementsByTagName("COLLADA")[0];

			this.setOptions(pOptions);
			this.setXMLDocument(pXMLDocument);
			this.setXMLRoot(pXMLRoot);

			this.checkLibraries(pXMLRoot, Collada.SCENE_TEMPLATE);
			this.checkLibraries(pXMLRoot, Collada.ANIMATION_TEMPLATE);

			this.readLibraries(pXMLRoot, Collada.SCENE_TEMPLATE);

			this.COLLADAAsset();
			this.COLLADAScene();

			if (this.isAnimationNeeded()) {
				this.readLibraries(pXMLRoot, Collada.ANIMATION_TEMPLATE);
			}

			// debug.timeEnd("parsed");

			return true;
		}

		loadResource(sFilename: string = null, pOptions: IColladaLoadOptions = null): boolean {
			// debug.group("Collada %s", this.findResourceName());
			// debug.time("loaded " + this.findResourceName());

			if (isNull(sFilename)) {
				sFilename = this.findResourceName();
			}

			if (this.isResourceLoaded()) {
				debug.warn("collada model already loaded");
				return false;
			}

			var pModel: Collada = this;

			this.setFilename(sFilename);

			this.notifyDisabled();
			this.notifyUnloaded();

			var pFile: IFile = io.fopen(sFilename);

			pFile.open((err, meta): void => {
				//FIXME: setuop byteLength correctly..
				pModel._setByteLength(meta.size || 0);
			});

			pFile.read((e: Error, sXML: string): void => {
				if (!isNull(e)) {
					logger.error(e);
					return;
				}

				this.notifyRestored();

				if (this.parse(sXML, pOptions)) {
					// debug.timeEnd("loaded " + this.findResourceName());
					this.notifyLoaded();
				}
				//TODO: else....
			});

			return true;
		}

		//upload material into collada
		private uploadMaterial(sMaterial: string): boolean {
			var pPhongMaterial = this.findMaterial(sMaterial);

			if (isNull(pPhongMaterial)) {
				return false;
			}

			var pMaterial: IMaterial = pPhongMaterial.material;
			var pXML: Element = pPhongMaterial.xml;

			function replaceColor(pXML: Element, pColor: IColor): void {
				var pXMLColor: Element = firstChild(pXML, "color");

				if (!isDefAndNotNull(pXMLColor)) {
					pXMLColor = <Element>conv.parseHTML("<color />")[0];
					pXML.appendChild(pXMLColor);
				}

				pXMLColor.textContent = pColor.r + " " + pColor.g + " " + pColor.b + " " + pColor.a;
			}

			function replaceValue(pXML: Element, pValue: float): void {
				var pXMLColor: Element = firstChild(pXML, "float");

				if (!isDefAndNotNull(pXMLColor)) {
					pXMLColor = <Element>conv.parseHTML("<float />")[0];
					pXML.appendChild(pXMLColor);
				}

				pXMLColor.textContent = String(pValue);
			}

			replaceColor(firstChild(pXML, "specular"), pMaterial.specular);
			replaceColor(firstChild(pXML, "diffuse"), pMaterial.diffuse);
			replaceColor(firstChild(pXML, "ambient"), pMaterial.ambient);
			replaceColor(firstChild(pXML, "emission"), pMaterial.emissive);
			replaceValue(firstChild(pXML, "transparency"), pMaterial.transparency);
			replaceValue(firstChild(pXML, "shininess"), pXML.tagName === "phong"? pMaterial.shininess * 128.: pMaterial.shininess);

			
		}

		private syncMaterials(): void {
			Object.keys(this._pMaterialCache).forEach((sMaterial: string) => {
				this.uploadMaterial(sMaterial);
			});
		}

		extractUsedMaterials(): IMaterial[] {
			var pList: IMaterial[] = [];

			Object.keys(this._pMaterialCache).forEach((sName: string) => {
				pList.push(this._pMaterialCache[sName].material);
			});

			return pList;
		}

		toBlob(): Blob {

			this.syncMaterials();

			return new Blob([
				'<?xml version="1.0" encoding="utf-8"?>',
				'<COLLADA xmlns="http://www.collada.org/2008/03/COLLADASchema" version="' + (this.getVersion() || "1.5.0") + '">',
				(<any>this._pXMLRoot).innerHTML,
				'</COLLADA>'
			], { mime: "text/xml" });
		}

		extractMesh(sMeshName: string = null): IMesh {
			return this.buildMeshByName(sMeshName);
		}

		extractModel(pScene: IScene3d, sMeshName?: string): ISceneModel;
		extractModel(pNode: ISceneNode, sMeshName?: string): ISceneModel;
		extractModel(sMeshName?: string): ISceneModel;
		extractModel(parent?, name?: string): ISceneModel {
			var pScene: IScene3d;
			var pNode: ISceneNode;
			var pModel: ISceneModel;
			var sMeshName: string = null;

			if (isString(arguments[0])) {
				sMeshName = arguments[0];
				parent = arguments[1];
			}
			else {
				parent = arguments[0];
				sMeshName = arguments[1] || null;
			}

			pNode = this.getNodeByParent(parent);

			if (isNull(pNode)) {
				return null;
			}

			var pMesh: IMesh = this.extractMesh(sMeshName);

			if (!isNull(pMesh)) {
				pScene = pNode.getScene();
				pModel = pScene.createModel();
				pModel.setMesh(pMesh);

				this.buildAssetTransform(pModel);

				return pModel;
			}

			return null;
		}



		extractFullScene(pScene: IScene3d): IModelEntry;
		extractFullScene(pNode: ISceneNode): IModelEntry;
		extractFullScene(): IModelEntry;
		extractFullScene(parent?): IModelEntry {
			var pScene: IScene3d;
			var pNode: ISceneNode = this.getNodeByParent(parent);
			var pRoot: IModelEntry;

			var pSceneOutput: ISceneNode[] = null;
			var pMeshOutput: IMesh[] = null;

			if (isNull(pNode)) {
				return null;
			}

			pScene = pNode.getScene();

			pRoot = pScene._createModelEntry(this);
			pRoot.create();
			pRoot.setName(this.getBasename());
			pRoot.setInheritance(ENodeInheritance.ALL);

			if (!pRoot.attachToParent(pNode)) {
				debug.error("could not attach to parent node");
				return null;
			}

			if (this.isVisualSceneLoaded() && this.isSceneNeeded()) {
				pSceneOutput = this.buildScene(pRoot);
				pMeshOutput = this.buildMeshes();
			}

			//clear all links from collada nodes to scene nodes
			this.buildComplete();

			return pRoot;
		}



		extractAnimation(i: int): IAnimation {
			var pPoses: IAnimation[];
			var pSkeletons: ISkeleton[],
				pSkeleton: ISkeleton;
			var pAnimation: IAnimation = null;
			var pData: IColladaAnimation = this.getAnimation(i);

			if (!isNull(pData) && this.isAnimationNeeded() && this.isLibraryExists("library_animations")) {

				pAnimation = this.buildAnimation(pData);
				//дополним анимации начальными позициями костей
				if (this.isPoseExtractionNeeded()) {
					pSkeletons = this.getSkeletonsOutput() || [];

					pPoses = this.buildInitialPoses(pSkeletons);

					for (var j: int = 0; j < pPoses.length; ++j) {
						pAnimation.extend(pPoses[j]);
					}
				}
			}

			return pAnimation;
		}

		extractAnimations(): IAnimation[] {
			var pPoses: IAnimation[];
			var pSkeletons: ISkeleton[],
				pSkeleton: ISkeleton;
			var pAnimationOutput: IAnimation[] = null;

			if (this.isAnimationNeeded() && this.isLibraryExists("library_animations")) {

				pAnimationOutput = this.buildAnimations();
				//дополним анимации начальными позициями костей
				if (this.isPoseExtractionNeeded()) {
					pSkeletons = this.getSkeletonsOutput() || [];

					/*
	 
					// добавим к начальным позам, те, в которых находятся меши
					// в момент выгрузки
					if (!isNull(pMeshOutput)) {
						for (var i = 0; i < pMeshOutput.length; ++ i) {
							pSkeletons.push(pMeshOutput[i].skeleton);
						}
					}
					else {
						//необхоимо для посчета ссылочной информации
						if (isNull(pSceneOutput)) {
							this.buildScene();
						}

						this.eachByTag(pXMLRoot, "skeleton", function (pXML: Node) {
							pSkeletons.push(this.buildSkeleton([stringData(pXML)]));
						});
					}

					*/

					pPoses = this.buildInitialPoses(pSkeletons);

					for (var i: int = 0; i < pAnimationOutput.length; ++i) {
						for (var j: int = 0; j < pPoses.length; ++j) {
							pAnimationOutput[i].extend(pPoses[j]);
						}
					}
				}
			}

			return pAnimationOutput;
		}

		/**
		 * @deprecated Use Collada::extractFullScene() instead.
		 */
		attachToScene(pScene: IScene3d): IModelEntry;
		attachToScene(pNode: ISceneNode): IModelEntry;
		attachToScene(parent): IModelEntry {
			return this.extractFullScene(parent);
		}

		private getNodeByParent(pScene: IScene3d): ISceneNode;
		private getNodeByParent(pNode: ISceneNode): ISceneNode;
		private getNodeByParent(): ISceneNode;
		private getNodeByParent(parent?): ISceneNode {
			var pScene: IScene3d;
			var pNode: ISceneNode;

			if (isNull(parent)) {
				return null;
			}

			if (!isDef(parent)) {
				//get default scene, if parent not present
				parent = this.getManager().getEngine().getScene();
			}

			if (parent instanceof scene.Node) {
				//attach collada scene to give node
				pNode = <ISceneNode>parent;
			}
			else {
				//attaching collada scene to new node, that is child of scene root
				pScene = <IScene3d>parent;
				pNode = pScene.getRootNode();
			}

			return pNode;
		}


		static isColladaResource(pItem: IResourcePoolItem): boolean {
			return isModelResource(pItem) && (<IModel>pItem).getModelFormat() === EModelFormats.COLLADA;
		}

	}

	pSupportedVertexFormat = [
		{ name: ["X"], type: ["float"] },
		{ name: ["Y"], type: ["float"] },
		{ name: ["Z"], type: ["float"] }
	];

	pSupportedTextureFormat = [
		{ name: ["S"], type: ["float"] },
		{ name: ["T"], type: ["float"] },
		{ name: ["P"], type: ["float"] }
	];

	pSupportedColorFormat = [
		{ name: ["R"], type: ["float"] },
		{ name: ["G"], type: ["float"] },
		{ name: ["B"], type: ["float"] }
	];

	pSupportedWeightFormat = [
		{ name: ["WEIGHT"], type: ["float"] }
	];

	pSupportedJointFormat = [
		{ name: ["JOINT"], type: ["Name", "IDREF"] }
	];

	pSupportedInvBindMatrixFormat = [
		{ name: ["TRANSFORM"], type: ["float4x4"] }
	];

	pSupportedInterpolationFormat = [
		{ name: ["INTERPOLATION"], type: ["Name"] }
	];

	pSupportedInputFormat = [
		{ name: ["TIME"], type: ["float"] }
	];

	pSupportedOutputFormat = [
		{ name: ["TRANSFORM", "X", "ANGLE", null], type: ["float4x4", "float"] },
		{ name: ["Y"], type: ["float"] },
		{ name: ["Z"], type: ["float"] }
	];

	pSupportedTangentFormat = [
		{ name: ["X"], type: ["float"] },
		{ name: ["Y"], type: ["float"] },
		{ name: ["X"], type: ["float"] },
		{ name: ["Y"], type: ["float"] },
		{ name: ["X"], type: ["float"] },
		{ name: ["Y"], type: ["float"] },
		{ name: ["X"], type: ["float"] },
		{ name: ["Y"], type: ["float"] },
		{ name: ["X"], type: ["float"] },
		{ name: ["Y"], type: ["float"] }
	];

	pFormatStrideTable = <IColladaFormatStrideTable> {
		"float": 1,
		"float2": 2,
		"float3": 3,
		"float4": 4,
		"float3x3": 9,
		"float4x4": 16,
		"int": 1,
		"name": 1,
		"Name": 1,
		"IDREF": 1
	};

	/* COMMON FUNCTIONS
	------------------------------------------------------
	*/

	function getSupportedFormat(sSemantics: string): IColladaUnknownFormat[] {
		switch (sSemantics) {
			case "TEXTANGENT":
			case "TEXBINORMAL":
			case "VERTEX":
			case "NORMAL":
			case "TANGENT":
			case "BINORMAL":
			case "POSITION":
				return pSupportedVertexFormat;

			case "TEXCOORD":
				return pSupportedTextureFormat;

			case "WEIGHT":
				return pSupportedWeightFormat;

			case "JOINT":
				return pSupportedJointFormat;

			case "INV_BIND_MATRIX":
				return pSupportedInvBindMatrixFormat;

			case "INTERPOLATION":
				return pSupportedInterpolationFormat;

			case "IN_TANGENT":
				return pSupportedTangentFormat;

			case "INPUT":
				return pSupportedInputFormat;

			case "OUT_TANGENT":
				return pSupportedTangentFormat;

			case "OUTPUT":
				return pSupportedOutputFormat;
			case "COLOR":
				return pSupportedColorFormat;
			case "UV":
			case "MORPH_WEIGHT":
			case "MORPH_TARGET":
			case "LINEAR_STEPS":
			case "IMAGE":
			case "CONTINUITY":
				return null;
		}

		logger.error("unknown semantics founded: " + sSemantics);

		return null;
	}

	function calcFormatStride(pFormat: IColladaUnknownFormat[]): int {
		var iStride: int = 0;
		var s: string = null;

		for (var i: int = 0; i < pFormat.length; ++i) {
			s = pFormat[i].type[0];
			iStride += pFormatStrideTable[s];
		}

		return iStride;
	}

	// additional

	function printArray(pArr: any[], nRow: uint, nCol: uint): string {
		var s: string = "\n";

		for (var i = 0; i < pArr.length; ++i) {
			if (i % nCol == 0) {
				s += "  ";
			}

			s += pArr[i] + ", ";

			if ((i + 1) % nRow == 0) {
				s += '\n';
			}
		}

		return s;
	}

	function sortArrayByProperty(pData: any[], sProperty: string): any[] {
		var tmp: any;

		for (var i: int = pData.length - 1; i > 0; i--) {
			for (var j: int = 0; j < i; j++) {
				if (pData[j][sProperty] > pData[j + 1][sProperty]) {
					tmp = pData[j];
					pData[j] = pData[j + 1];
					pData[j + 1] = tmp;
				}
			}
		}

		return pData;
	}


	function stringData(pXML: Element): string {
		return (isDefAndNotNull(pXML) ? pXML.textContent : null);
	}

	function attr(pXML: Element, sName: string): string {
		return pXML.getAttribute(sName);

	}

	function firstChild(pXML: Element, sTag?: string): Element {
		if (isString(sTag)) {
			return <Element>pXML.getElementsByTagName(sTag)[0];
		}

		for (var i = 0; i < pXML.childNodes.length; i++) {
			if (pXML.childNodes[i].nodeType === Node.ELEMENT_NODE) {
				return <Element>pXML.childNodes[i];
			}
		}

		return null;
	}


	export function isModelResource(pItem: IResourcePoolItem): boolean {
		return pool.isVideoResource(pItem) && pItem.getResourceCode().getType() === EVideoResources.MODEL_RESOURCE;
	}
}
