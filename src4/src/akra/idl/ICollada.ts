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
	export interface ICollada extends IModel {
		getOptions(): IColladaLoadOptions;
		setOptions(pOptions: IColladaLoadOptions): void;
	
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


	export interface IColladaCache {
		meshMap: IMeshMap;
		sharedBuffer: IRenderDataCollection;
	}
	
	export interface IColladaAnimationLoadOptions {
		pose?: boolean;
	}
	
	export interface IColladaImageLoadOptions {
		flipY?: boolean;
	}
	
	export interface IColladaLoadOptions extends IModelLoadOptions {
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
	
	export interface IXMLExplorer {
		(pXML: Element, sName?: string): void;
	}
	
	//----------------------
	
	export interface IColladaTarget {
		value: number;
		object?: IColladaEntry;
		source?: IColladaEntry;
	}
	
	export interface IColladaEntry {
		id?: string;
		sid?: string;
		name?: string;
	}
	
	export interface IColladaEntryMap {
		[id: string]: IColladaEntry;
	}
	
	export interface IColladaLibrary extends IColladaEntry {
		//[element: string]: IColladaEntryMap;
		/** Real type is IColladaEntryMap, but typescript don`t allow to fo this */
		[element: string]: any;
	}
	
	export interface IColladaEffectLibrary extends IColladaLibrary {
		effect: { [id: string]: IColladaEffect; };
	}
	
	export interface IColladaEntryLoader {
		(pXML: Element): IColladaEntry;
	}
	
	
	export interface IColladaUnknownFormat {
		name: string[];
		type: string[];
	}
	
	/** Stride for collada formats, discretized at 32 bits. */
	export interface IColladaFormatStrideTable {
		[format: string]: uint;
	}
	
	export interface IColladaLinkMap {
		[link: string]: any;
	}
	
	export interface IColladaLibraryMap {
		[library: string]: IColladaLibrary;
	}
	
	export interface IColladaLibraryTemplate {
		lib: string; 				   /** library tag name.*/
		element: string;			   /** element in liibrary. */
	}
	
	
	//=============================================
	// COLLADA NODES / VISUAL SCENE AND COMMON
	//=============================================
	
	export interface IColladaArray extends IColladaEntry {
		[i: uint]: any;
	}	
	
	export interface IColladaUnit extends IColladaEntry {
		name: string;
		meter: float;
	}
	
	export interface IColladaContributor extends IColladaEntry {
		author?: string;
		authoringTool?: string;
		comments?: string;
		copyright?: string;
		sourceData?: any;
	}
	
	export interface IColladaAsset extends IColladaEntry {
		unit: IColladaUnit;
		upAxis: string;
		title?: string;
		subject?: string; 
		created: string;
		modified: string;
		keywords?: string[];
		contributor?: IColladaContributor;
	}
	
	export interface IColladaInstance extends IColladaEntry {
		url?: string;
	}
	
	export interface IColladaAnnotate extends IColladaEntry {
		name: string;
		value: string;
	}
	
	export interface IColladaNewParam extends IColladaEntry {
		sid: string;
		annotate: IColladaAnnotate;
		semantics: string;
		modifier: string;
		value: any;
		type: string;
	}
	
	export interface IColladaNewParamMap {
		[sid: string]: IColladaNewParam;
	}
	
	export interface IColladaParam extends IColladaEntry {
		name: string;
		type: string;
	}
	
	export interface IColladaAccessor extends IColladaEntry {
		source?: string;
		data: IColladaArray;
		count: int;
		stride: int;
		params: IColladaParam[];
	}
	
	
	export interface IColladaTechniqueCommon extends IColladaEntry {
		accessor: IColladaAccessor;
		perspective: IColladaPerspective;
	}
	
	
	export interface IColladaSource extends IColladaEntry {
		name: string;
	
		array: Object;
		techniqueCommon: IColladaTechniqueCommon;
	}
	
	export interface IColladaInput extends IColladaEntry {
		semantics: string;
		source: IColladaSource;
		offset: int;
		set: string;
	
		array?: any[];
		//arrayId?: string;
		accessor?: IColladaAccessor;
	}
	
	export interface IColladaTransform extends IColladaEntry {
		transform: string; /* transform name: rotate, translate, scale or matrix */
		value: any;
	}
	
	export interface IColladaRotate extends IColladaTransform {
		value: IVec4;
	}
	
	export interface IColladaTranslate extends IColladaTransform {
		value: IVec3;
	}
	
	export interface IColladaScale extends IColladaTransform {
		value: IVec3;
	}
	
	export interface IColladaMatrix extends IColladaTransform {
		value: IMat4;
	}
	
	export interface IColladaVertices extends IColladaEntry {
		inputs: { [semantics: string]: IColladaInput; };
	}
	
	export interface IColladaJoints extends IColladaEntry {
		inputs: { [input: string]: IColladaInput; };
	
	}
	
	export interface IColladaPolygons extends IColladaEntry {
		name: string;
	
		inputs: IColladaInput[];
		p: uint[];
		material: string;
	
		type?: EPrimitiveTypes;
	
		count: uint;
	}
	
	export interface IColladaMesh extends IColladaEntry {
		sources: IColladaSource[];
		polygons: IColladaPolygons[];
	}
	
	export interface IColladaConvexMesh extends IColladaEntry {
		//TODO: IColladaConvexMesh
	}
	
	export interface IColladaSpline extends IColladaEntry {
		//TODO: IColladaSpline
	}
	
	export interface IColladaGeometrie extends IColladaEntry {
		name: string;
	
		mesh: IColladaMesh;
		convexMesh: IColladaConvexMesh;
		spline: IColladaSpline;
	}
	
	export interface IColladaMorph extends IColladaEntry {
		//TODO: IColladaMorph
	}
	
	export interface IColladaVertexWeights extends IColladaEntry { 
		count: int;
		inputs: IColladaInput[];
		weightInput: IColladaInput;
		vcount: uint[];
		v: int[];
	}	
	
	export interface IColladaSkin extends IColladaEntry {
		shapeMatrix: IMat4;
		sources: IColladaSource[];
		geometry: IColladaGeometrie;
		joints: IColladaJoints;
		vertexWeights: IColladaVertexWeights;
	}
	
	export interface IColladaController extends IColladaEntry {
		name: string;
	
		skin: IColladaSkin;
		morph: IColladaMorph;
	}
	
	export interface IColladaImage extends IColladaEntry {
		name: string;
		
		data: any;
		path: string;
	
		format?: string;
		depth?: int;
		height?: int;
		width?: int;
	}
	
	//effects
	
	export interface IColladaSurface extends IColladaEntry {
		initFrom: string;
	}
	
	export interface IColladaSampler2D extends IColladaEntry {
		source: string;
		wrapS: string;
		wrapT: string;
		minFilter: string;
		mipFilter: string;
		magFilter: string;
	}
	
	export interface IColladaTexture extends IColladaEntry {
		texcoord: string;
		sampler: IColladaNewParam;
		surface: IColladaNewParam;
		image: IColladaImage;
	}
	
	
	export interface IColladaInstanceEffect extends IColladaInstance {
		parameters: Object;
		techniqueHint: IStringMap;
		effect: IColladaEffect;
	}
	
	
	export interface IColladaPhong extends IColladaEntry {
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
	
	export interface IColladaEffectTechnique extends IColladaEntry {
		sid: string;
		type: string;
		value: IColladaEntry;
	}
	
	export interface IColladaProfileCommon extends IColladaEntry {
		technique: IColladaEffectTechnique;
		newParam: IColladaNewParamMap;
	}
	
	export interface IColladaEffect extends IColladaEntry {
		profileCommon: IColladaProfileCommon;
	}
	
	// materials
	
	export interface IColladaMaterial extends IColladaEntry {
		name: string;
		
		instanceEffect: IColladaInstanceEffect;
	}
	
	
	
	export interface IColladaTechniqueValue extends IColladaEntry {
	
	}
	
	
	export interface IColladaBindVertexInput extends IColladaEntry {
		semantics: string;
		inputSemantic: string;
		inputSet: int;
	}
	
	export interface IColladaBindVertexInputMap {
		[semantics: string]: IColladaBindVertexInput;
	}
	
	export interface IColladaInstanceMaterial extends IColladaInstance {
		symbol: string;
		target: string;
		vertexInput: IColladaBindVertexInputMap;
		material: IColladaMaterial;
	}
	
	export interface IColladaInstanceCamera extends IColladaInstance {
		camera: IColladaCamera;
	}
	
	export interface IColladaInstanceLight extends IColladaInstance {
		light: IColladaLight;
	}
	
	export interface IColladaBindMaterial extends IColladaEntry {
		/** Real type IColladaInstanceMaterial, but typescript don`t allow to do this */
		//[index/*symbol*/: string]: IColladaInstanceMaterial;
		[index/*symbol*/: string]: any;
	}
	
	export interface IColladaInstanceGeometry extends IColladaInstance {
		geometry: IColladaGeometrie;
		material: IColladaBindMaterial;
	}
	
	
	export interface IColladaInstanceController extends IColladaInstance {
		controller: IColladaController;
		material: IColladaBindMaterial;
		skeletons: string[];
	}
	
	export interface IColladaPerspective extends IColladaEntry {
		xfov: float;
		yfov: float;
		znear: float;
		zfar: float;
		aspect: float;
	}
	
	export interface IColladaOptics extends IColladaEntry {
		techniqueCommon: IColladaTechniqueCommon;
	}
	
	
	export interface IColladaCamera extends IColladaEntry {
		optics: IColladaOptics;
	}
	
	export interface IColladaLight extends IColladaEntry {
	
	}
	
	export interface IColladaNode extends IColladaEntry {
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
	
	
	export interface IColladaVisualScene extends IColladaEntry {
		name: string;
	
		nodes: IColladaNode[];
	}
	
	
	
	/// animation
	
	export interface IColladaAnimationSampler extends IColladaEntry {
		inputs: { [semantics: string]: IColladaInput; };
	}
	
	export interface IColladaAnimationChannel extends IColladaEntry {
		target: IColladaTarget;
		sampler: IColladaAnimationSampler;
	}
	
	export interface IColladaAnimation extends IColladaEntry {
		name: string;
	
		sources: IColladaSource[];
		samplers: IColladaAnimationSampler[];
		channels: IColladaAnimationChannel[];
	
		animations?: IColladaAnimation[];
	}
	
	
	export interface IColladaScene {
	
	}
	
	export interface IColladaDocument {
		asset?: IColladaAsset;
	
		libEffects?: IColladaEffectLibrary;
		libMaterials?: IColladaLibrary;
		libGeometries?: IColladaLibrary;
		libVisualScenes?: IColladaLibrary;
		libAnimations?: IColladaLibrary;
	
		scene?: IColladaScene;
	}
	
	export interface IColladaAnimationClip extends IColladaEntry {
		name?: string;
		start: float;
		end: float;
	}
}
