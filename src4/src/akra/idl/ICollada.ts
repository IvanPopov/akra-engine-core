// supported only 4.1 ver.

/// <reference path="IModel.ts" />
/// <reference path="ISkeleton.ts" />
/// <reference path="IModel.ts" />
/// <reference path="IEngine.ts" />
/// <reference path="IMesh.ts" />
/// <reference path="IMap.ts" />
/// <reference path="IAnimation.ts" />
/// <reference path="IAnimationController.ts" />

//=============================================
// COLLADA LOAD OPTIONS
//=============================================

module akra {
	interface ICollada extends IModel {
		options: IColladaLoadOptions;
	
		getAsset(): IColladaAsset;
		getAnimations(): IColladaAnimation[];
		getAnimation(i: int): IColladaAnimation;
	
		getFilename(): string;
		getBasename(): string;
		
		isVisualSceneLoaded(): boolean;
		isAnimationLoaded(): boolean;
	
		attachToScene(pNode: ISceneNode): IModelEntry;
		attachToScene(pScene: IScene3d): IModelEntry;
	
		extractAnimations(): IAnimation[];
		extractAnimation(i: int): IAnimation;
		
		parse(sXMLData: string, pOptions?: IColladaLoadOptions): boolean;
		loadResource(sFilename?: string, pOptions?: IColladaLoadOptions): boolean;
	}
	
	interface IColladaCache {
		meshMap: IMeshMap;
		sharedBuffer: IRenderDataCollection;
	}
	
	interface IColladaAnimationLoadOptions {
		pose?: boolean;
	}
	
	interface IColladaImageLoadOptions {
		flipY?: boolean;
	}
	
	interface IColladaLoadOptions extends IModelLoadOptions {
		/** Add nodes, that visualize joints in animated models. */
		drawJoints?: boolean;
		/** Convert all meshed to wireframe. */
		wireframe?: boolean;
		shadows?: boolean;
		/** 
		 * Use common buffer for all data 
		 * @deprecated
		 */
		sharedBuffer?: boolean;
	
		animation?: IColladaAnimationLoadOptions;
		scene?: boolean;
		extractPoses?: boolean;
		skeletons?: ISkeleton[];
	
		images?: IColladaImageLoadOptions;
	
		name?: string;
	
		/** @debug */
		debug?: boolean; /*remove me*/
	}
	
	// xml
	
	interface IXMLExplorer {
		(pXML: Element, sName?: string): void;
	}
	
	//----------------------
	
	interface IColladaTarget {
		value: number;
		object?: IColladaEntry;
		source?: IColladaEntry;
	}
	
	interface IColladaEntry {
		id?: string;
		sid?: string;
		name?: string;
	}
	
	interface IColladaEntryMap {
		[id: string]: IColladaEntry;
	}
	
	interface IColladaLibrary extends IColladaEntry {
		[element: string]: IColladaEntryMap;
	}
	
	interface IColladaEffectLibrary extends IColladaLibrary {
		effect: { [id: string]: IColladaEffect; };
	}
	
	interface IColladaEntryLoader {
		(pXML: Element): IColladaEntry;
	}
	
	
	interface IColladaUnknownFormat {
		name: string[];
		type: string[];
	}
	
	/** Stride for collada formats, discretized at 32 bits. */
	interface IColladaFormatStrideTable {
		[format: string]: uint;
	}
	
	interface IColladaLinkMap {
		[link: string]: any;
	}
	
	interface IColladaLibraryMap {
		[library: string]: IColladaLibrary;
	}
	
	interface IColladaLibraryTemplate {
		lib: string; 				   /** library tag name.*/
		element: string;			   /** element in liibrary. */
		loader: string;				/** loader function */
	}
	
	
	//=============================================
	// COLLADA NODES / VISUAL SCENE AND COMMON
	//=============================================
	
	interface IColladaArray extends IColladaEntry {
		[i: uint]: any;
	}	
	
	interface IColladaUnit extends IColladaEntry {
		name: string;
		meter: float;
	}
	
	interface IColladaContributor extends IColladaEntry {
		author?: string;
		authoringTool?: string;
		comments?: string;
		copyright?: string;
		sourceData?: any;
	}
	
	interface IColladaAsset extends IColladaEntry {
		unit: IColladaUnit;
		upAxis: string;
		title?: string;
		subject?: string; 
		created: string;
		modified: string;
		keywords?: string[];
		contributor?: IColladaContributor;
	}
	
	interface IColladaInstance extends IColladaEntry {
		url?: string;
	}
	
	interface IColladaAnnotate extends IColladaEntry {
		name: string;
		value: string;
	}
	
	interface IColladaNewParam extends IColladaEntry {
		sid: string;
		annotate: IColladaAnnotate;
		semantics: string;
		modifier: string;
		value: any;
		type: string;
	}
	
	interface IColladaNewParamMap {
		[sid: string]: IColladaNewParam;
	}
	
	interface IColladaParam extends IColladaEntry {
		name: string;
		type: string;
	}
	
	interface IColladaAccessor extends IColladaEntry {
		source?: string;
		data: IColladaArray;
		count: int;
		stride: int;
		params: IColladaParam[];
	}
	
	
	interface IColladaTechniqueCommon extends IColladaEntry {
		accessor: IColladaAccessor;
		perspective: IColladaPerspective;
	}
	
	
	interface IColladaSource extends IColladaEntry {
		name: string;
	
		array: Object;
		techniqueCommon: IColladaTechniqueCommon;
	}
	
	interface IColladaInput extends IColladaEntry {
		semantics: string;
		source: IColladaSource;
		offset: int;
		set: string;
	
		array?: any[];
		//arrayId?: string;
		accessor?: IColladaAccessor;
	}
	
	interface IColladaTransform extends IColladaEntry {
		transform: string; /* transform name: rotate, translate, scale or matrix */
		value: any;
	}
	
	interface IColladaRotate extends IColladaTransform {
		value: IVec4;
	}
	
	interface IColladaTranslate extends IColladaTransform {
		value: IVec3;
	}
	
	interface IColladaScale extends IColladaTransform {
		value: IVec3;
	}
	
	interface IColladaMatrix extends IColladaTransform {
		value: IMat4;
	}
	
	interface IColladaVertices extends IColladaEntry {
		inputs: { [semantics: string]: IColladaInput; };
	}
	
	interface IColladaJoints extends IColladaEntry {
		inputs: { [input: string]: IColladaInput; };
	
	}
	
	interface IColladaPolygons extends IColladaEntry {
		name: string;
	
		inputs: IColladaInput[];
		p: uint[];
		material: string;
	
		type?: EPrimitiveTypes;
	
		count: uint;
	}
	
	interface IColladaMesh extends IColladaEntry {
		sources: IColladaSource[];
		polygons: IColladaPolygons[];
	}
	
	interface IColladaConvexMesh extends IColladaEntry {
		//TODO: IColladaConvexMesh
	}
	
	interface IColladaSpline extends IColladaEntry {
		//TODO: IColladaSpline
	}
	
	interface IColladaGeometrie extends IColladaEntry {
		name: string;
	
		mesh: IColladaMesh;
		convexMesh: IColladaConvexMesh;
		spline: IColladaSpline;
	}
	
	interface IColladaMorph extends IColladaEntry {
		//TODO: IColladaMorph
	}
	
	interface IColladaVertexWeights extends IColladaEntry { 
		count: int;
		inputs: IColladaInput[];
		weightInput: IColladaInput;
		vcount: uint[];
		v: int[];
	}	
	
	interface IColladaSkin extends IColladaEntry {
		shapeMatrix: IMat4;
		sources: IColladaSource[];
		geometry: IColladaGeometrie;
		joints: IColladaJoints;
		vertexWeights: IColladaVertexWeights;
	}
	
	interface IColladaController extends IColladaEntry {
		name: string;
	
		skin: IColladaSkin;
		morph: IColladaMorph;
	}
	
	interface IColladaImage extends IColladaEntry {
		name: string;
		
		data: any;
		path: string;
	
		format?: string;
		depth?: int;
		height?: int;
		width?: int;
	}
	
	//effects
	
	interface IColladaSurface extends IColladaEntry {
		initFrom: string;
	}
	
	interface IColladaSampler2D extends IColladaEntry {
		source: string;
		wrapS: string;
		wrapT: string;
		minFilter: string;
		mipFilter: string;
		magFilter: string;
	}
	
	interface IColladaTexture extends IColladaEntry {
		texcoord: string;
		sampler: IColladaNewParam;
		surface: IColladaNewParam;
		image: IColladaImage;
	}
	
	
	interface IColladaInstanceEffect extends IColladaInstance {
		parameters: Object;
		techniqueHint: IStringMap;
		effect: IColladaEffect;
	}
	
	
	interface IColladaPhong extends IColladaEntry {
		diffuse: IColorValue;
		specular: IColorValue;
		ambient: IColorValue;
		emissive: IColorValue;
		shininess: float;
		
		reflective: IColorValue;
		reflectivity: float;
		transparent: IColorValue;
		transparency: float;
	
		indexOfRefraction: float;
	
		//------------------
		textures?: {
			diffuse: IColladaTexture;
			specular: IColladaTexture;
			ambient: IColladaTexture;
			emissive: IColladaTexture;
			//additional, from oppen collada export
			normal: IColladaTexture;
		};
	}
	
	interface IColladaEffectTechnique extends IColladaEntry {
		sid: string;
		type: string;
		value: IColladaEntry;
	}
	
	interface IColladaProfileCommon extends IColladaEntry {
		technique: IColladaEffectTechnique;
		newParam: IColladaNewParamMap;
	}
	
	interface IColladaEffect extends IColladaEntry {
		profileCommon: IColladaProfileCommon;
	}
	
	// materials
	
	interface IColladaMaterial extends IColladaEntry {
		name: string;
		
		instanceEffect: IColladaInstanceEffect;
	}
	
	
	
	interface IColladaTechniqueValue extends IColladaEntry {
	
	}
	
	
	interface IColladaBindVertexInput extends IColladaEntry {
		semantics: string;
		inputSemantic: string;
		inputSet: int;
	}
	
	interface IColladaBindVertexInputMap {
		[semantics: string]: IColladaBindVertexInput;
	}
	
	interface IColladaInstanceMaterial extends IColladaInstance {
		symbol: string;
		target: string;
		vertexInput: IColladaBindVertexInputMap;
		material: IColladaMaterial;
	}
	
	interface IColladaInstanceCamera extends IColladaInstance {
		camera: IColladaCamera;
	}
	
	interface IColladaInstanceLight extends IColladaInstance {
		light: IColladaLight;
	}
	
	interface IColladaBindMaterial extends IColladaEntry {
		[symbol: string]: IColladaInstanceMaterial;
	}
	
	interface IColladaInstanceGeometry extends IColladaInstance {
		geometry: IColladaGeometrie;
		material: IColladaBindMaterial;
	}
	
	
	interface IColladaInstanceController extends IColladaInstance {
		controller: IColladaController;
		material: IColladaBindMaterial;
		skeletons: string[];
	}
	
	interface IColladaPerspective extends IColladaEntry {
		xfov: float;
		yfov: float;
		znear: float;
		zfar: float;
		aspect: float;
	}
	
	interface IColladaOptics extends IColladaEntry {
		techniqueCommon: IColladaTechniqueCommon;
	}
	
	
	interface IColladaCamera extends IColladaEntry {
		optics: IColladaOptics;
	}
	
	interface IColladaLight extends IColladaEntry {
	
	}
	
	interface IColladaNode extends IColladaEntry {
		sid: string;
		name: string;
		type: string;
		layer: string;
	
		transform: IMat4;
		geometry: IColladaInstanceGeometry[];
		controller: IColladaInstanceController[];
		camera: IColladaInstanceCamera[];
	
		childNodes: IColladaNode[];
		depth: int;
		transforms: IColladaTransform[];
	
		constructedNode: ISceneNode;
	}
	
	
	interface IColladaVisualScene extends IColladaEntry {
		name: string;
	
		nodes: IColladaNode[];
	}
	
	
	
	/// animation
	
	interface IColladaAnimationSampler extends IColladaEntry {
		inputs: { [semantics: string]: IColladaInput; };
	}
	
	interface IColladaAnimationChannel extends IColladaEntry {
		target: IColladaTarget;
		sampler: IColladaAnimationSampler;
	}
	
	interface IColladaAnimation extends IColladaEntry {
		name: string;
	
		sources: IColladaSource[];
		samplers: IColladaAnimationSampler[];
		channels: IColladaAnimationChannel[];
	
		animations?: IColladaAnimation[];
	}
	
	
	interface IColladaScene {
	
	}
	
	interface IColladaDocument {
		asset?: IColladaAsset;
	
		libEffects?: IColladaEffectLibrary;
		libMaterials?: IColladaLibrary;
		libGeometries?: IColladaLibrary;
		libVisualScenes?: IColladaLibrary;
		libAnimations?: IColladaLibrary;
	
		scene?: IColladaScene;
	}
	
	interface IColladaAnimationClip extends IColladaEntry {
		name?: string;
		start: float;
		end: float;
	}
	
	
	
	
	
}
