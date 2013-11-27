// AICollada interface
// Collada model loader.
// supported only 4.1 ver.

/// <reference path="AIModel.ts" />
/// <reference path="AISkeleton.ts" />
/// <reference path="AIModel.ts" />
/// <reference path="AIEngine.ts" />
/// <reference path="AIMesh.ts" />
/// <reference path="AIMap.ts" />
/// <reference path="AIAnimation.ts" />
/// <reference path="AIAnimationController.ts" />

//=============================================
// COLLADA LOAD OPTIONS
//=============================================

interface AICollada extends AIModel {
	options: AIColladaLoadOptions;

	getAsset(): AIColladaAsset;
	getAnimations(): AIColladaAnimation[];
	getAnimation(i: int): AIColladaAnimation;

	getFilename(): string;
	getBasename(): string;
	
	isVisualSceneLoaded(): boolean;
	isAnimationLoaded(): boolean;

	attachToScene(pNode: AISceneNode): AIModelEntry;
	attachToScene(pScene: AIScene3d): AIModelEntry;

	extractAnimations(): AIAnimation[];
	extractAnimation(i: int): AIAnimation;
	
	parse(sXMLData: string, pOptions?: AIColladaLoadOptions): boolean;
	loadResource(sFilename?: string, pOptions?: AIColladaLoadOptions): boolean;
}

interface AIColladaCache {
	meshMap: AIMeshMap;
	sharedBuffer: AIRenderDataCollection;
}

interface AIColladaAnimationLoadOptions {
	pose?: boolean;
}

interface AIColladaImageLoadOptions {
	flipY?: boolean;
}

interface AIColladaLoadOptions extends AIModelLoadOptions {
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

	animation?: AIColladaAnimationLoadOptions;
	scene?: boolean;
	extractPoses?: boolean;
	skeletons?: AISkeleton[];

	images?: AIColladaImageLoadOptions;

	name?: string;

	/** @debug */
	debug?: boolean; /*remove me*/
}

// xml

interface AIXMLExplorer {
	(pXML: Element, sName?: string): void;
}

//----------------------

interface AIColladaTarget {
	value: number;
	object?: AIColladaEntry;
	source?: AIColladaEntry;
}

interface AIColladaEntry {
	id?: string;
	sid?: string;
	name?: string;
}

interface AIColladaEntryMap {
	[id: string]: AIColladaEntry;
}

interface AIColladaLibrary extends AIColladaEntry {
	[element: string]: AIColladaEntryMap;
}

interface AIColladaEffectLibrary extends AIColladaLibrary {
	effect: { [id: string]: AIColladaEffect; };
}

interface AIColladaEntryLoader {
	(pXML: Element): AIColladaEntry;
}


interface AIColladaUnknownFormat {
	name: string[];
	type: string[];
}

/** Stride for collada formats, discretized at 32 bits. */
interface AIColladaFormatStrideTable {
	[format: string]: uint;
}

interface AIColladaLinkMap {
	[link: string]: any;
}

interface AIColladaLibraryMap {
	[library: string]: AIColladaLibrary;
}

interface AIColladaLibraryTemplate {
	lib: string; 				   /** library tag name.*/
	element: string;			   /** element in liibrary. */
	loader: string;				/** loader function */
}


//=============================================
// COLLADA NODES / VISUAL SCENE AND COMMON
//=============================================

interface AIColladaArray extends AIColladaEntry {
	[i: uint]: any;
}	

interface AIColladaUnit extends AIColladaEntry {
	name: string;
	meter: float;
}

interface AIColladaContributor extends AIColladaEntry {
	author?: string;
	authoringTool?: string;
	comments?: string;
	copyright?: string;
	sourceData?: any;
}

interface AIColladaAsset extends AIColladaEntry {
	unit: AIColladaUnit;
	upAxis: string;
	title?: string;
	subject?: string; 
	created: string;
	modified: string;
	keywords?: string[];
	contributor?: AIColladaContributor;
}

interface AIColladaInstance extends AIColladaEntry {
	url?: string;
}

interface AIColladaAnnotate extends AIColladaEntry {
	name: string;
	value: string;
}

interface AIColladaNewParam extends AIColladaEntry {
	sid: string;
	annotate: AIColladaAnnotate;
	semantics: string;
	modifier: string;
	value: any;
	type: string;
}

interface AIColladaNewParamMap {
	[sid: string]: AIColladaNewParam;
}

interface AIColladaParam extends AIColladaEntry {
	name: string;
	type: string;
}

interface AIColladaAccessor extends AIColladaEntry {
	source?: string;
	data: AIColladaArray;
	count: int;
	stride: int;
	params: AIColladaParam[];
}


interface AIColladaTechniqueCommon extends AIColladaEntry {
	accessor: AIColladaAccessor;
	perspective: AIColladaPerspective;
}


interface AIColladaSource extends AIColladaEntry {
	name: string;

	array: Object;
	techniqueCommon: AIColladaTechniqueCommon;
}

interface AIColladaInput extends AIColladaEntry {
	semantics: string;
	source: AIColladaSource;
	offset: int;
	set: string;

	array?: any[];
	//arrayId?: string;
	accessor?: AIColladaAccessor;
}

interface AIColladaTransform extends AIColladaEntry {
	transform: string; /* transform name: rotate, translate, scale or matrix */
	value: any;
}

interface AIColladaRotate extends AIColladaTransform {
	value: AIVec4;
}

interface AIColladaTranslate extends AIColladaTransform {
	value: AIVec3;
}

interface AIColladaScale extends AIColladaTransform {
	value: AIVec3;
}

interface AIColladaMatrix extends AIColladaTransform {
	value: AIMat4;
}

interface AIColladaVertices extends AIColladaEntry {
	inputs: { [semantics: string]: AIColladaInput; };
}

interface AIColladaJoints extends AIColladaEntry {
	inputs: { [input: string]: AIColladaInput; };

}

interface AIColladaPolygons extends AIColladaEntry {
	name: string;

	inputs: AIColladaInput[];
	p: uint[];
	material: string;

	type?: AEPrimitiveTypes;

	count: uint;
}

interface AIColladaMesh extends AIColladaEntry {
	sources: AIColladaSource[];
	polygons: AIColladaPolygons[];
}

interface AIColladaConvexMesh extends AIColladaEntry {
	//TODO: AIColladaConvexMesh
}

interface AIColladaSpline extends AIColladaEntry {
	//TODO: AIColladaSpline
}

interface AIColladaGeometrie extends AIColladaEntry {
	name: string;

	mesh: AIColladaMesh;
	convexMesh: AIColladaConvexMesh;
	spline: AIColladaSpline;
}

interface AIColladaMorph extends AIColladaEntry {
	//TODO: AIColladaMorph
}

interface AIColladaVertexWeights extends AIColladaEntry { 
	count: int;
	inputs: AIColladaInput[];
	weightInput: AIColladaInput;
	vcount: uint[];
	v: int[];
}	

interface AIColladaSkin extends AIColladaEntry {
	shapeMatrix: AIMat4;
	sources: AIColladaSource[];
	geometry: AIColladaGeometrie;
	joints: AIColladaJoints;
	vertexWeights: AIColladaVertexWeights;
}

interface AIColladaController extends AIColladaEntry {
	name: string;

	skin: AIColladaSkin;
	morph: AIColladaMorph;
}

interface AIColladaImage extends AIColladaEntry {
	name: string;
	
	data: any;
	path: string;

	format?: string;
	depth?: int;
	height?: int;
	width?: int;
}

//effects

interface AIColladaSurface extends AIColladaEntry {
	initFrom: string;
}

interface AIColladaSampler2D extends AIColladaEntry {
	source: string;
	wrapS: string;
	wrapT: string;
	minFilter: string;
	mipFilter: string;
	magFilter: string;
}

interface AIColladaTexture extends AIColladaEntry {
	texcoord: string;
	sampler: AIColladaNewParam;
	surface: AIColladaNewParam;
	image: AIColladaImage;
}


interface AIColladaInstanceEffect extends AIColladaInstance {
	parameters: Object;
	techniqueHint: AIStringMap;
	effect: AIColladaEffect;
}


interface AIColladaPhong extends AIColladaEntry {
	diffuse: AIColorValue;
	specular: AIColorValue;
	ambient: AIColorValue;
	emissive: AIColorValue;
	shininess: float;
	
	reflective: AIColorValue;
	reflectivity: float;
	transparent: AIColorValue;
	transparency: float;

	indexOfRefraction: float;

	//------------------
	textures?: {
		diffuse: AIColladaTexture;
		specular: AIColladaTexture;
		ambient: AIColladaTexture;
		emissive: AIColladaTexture;
		//additional, from oppen collada export
		normal: AIColladaTexture;
	};
}

interface AIColladaEffectTechnique extends AIColladaEntry {
	sid: string;
	type: string;
	value: AIColladaEntry;
}

interface AIColladaProfileCommon extends AIColladaEntry {
	technique: AIColladaEffectTechnique;
	newParam: AIColladaNewParamMap;
}

interface AIColladaEffect extends AIColladaEntry {
	profileCommon: AIColladaProfileCommon;
}

// materials

interface AIColladaMaterial extends AIColladaEntry {
	name: string;
	
	instanceEffect: AIColladaInstanceEffect;
}



interface AIColladaTechniqueValue extends AIColladaEntry {

}


interface AIColladaBindVertexInput extends AIColladaEntry {
	semantics: string;
	inputSemantic: string;
	inputSet: int;
}

interface AIColladaBindVertexInputMap {
	[semantics: string]: AIColladaBindVertexInput;
}

interface AIColladaInstanceMaterial extends AIColladaInstance {
	symbol: string;
	target: string;
	vertexInput: AIColladaBindVertexInputMap;
	material: AIColladaMaterial;
}

interface AIColladaInstanceCamera extends AIColladaInstance {
	camera: AIColladaCamera;
}

interface AIColladaInstanceLight extends AIColladaInstance {
	light: AIColladaLight;
}

interface AIColladaBindMaterial extends AIColladaEntry {
	[symbol: string]: AIColladaInstanceMaterial;
}

interface AIColladaInstanceGeometry extends AIColladaInstance {
	geometry: AIColladaGeometrie;
	material: AIColladaBindMaterial;
}


interface AIColladaInstanceController extends AIColladaInstance {
	controller: AIColladaController;
	material: AIColladaBindMaterial;
	skeletons: string[];
}

interface AIColladaPerspective extends AIColladaEntry {
	xfov: float;
	yfov: float;
	znear: float;
	zfar: float;
	aspect: float;
}

interface AIColladaOptics extends AIColladaEntry {
	techniqueCommon: AIColladaTechniqueCommon;
}


interface AIColladaCamera extends AIColladaEntry {
	optics: AIColladaOptics;
}

interface AIColladaLight extends AIColladaEntry {

}

interface AIColladaNode extends AIColladaEntry {
	sid: string;
	name: string;
	type: string;
	layer: string;

	transform: AIMat4;
	geometry: AIColladaInstanceGeometry[];
	controller: AIColladaInstanceController[];
	camera: AIColladaInstanceCamera[];

	childNodes: AIColladaNode[];
	depth: int;
	transforms: AIColladaTransform[];

	constructedNode: AISceneNode;
}


interface AIColladaVisualScene extends AIColladaEntry {
	name: string;

	nodes: AIColladaNode[];
}



/// animation

interface AIColladaAnimationSampler extends AIColladaEntry {
	inputs: { [semantics: string]: AIColladaInput; };
}

interface AIColladaAnimationChannel extends AIColladaEntry {
	target: AIColladaTarget;
	sampler: AIColladaAnimationSampler;
}

interface AIColladaAnimation extends AIColladaEntry {
	name: string;

	sources: AIColladaSource[];
	samplers: AIColladaAnimationSampler[];
	channels: AIColladaAnimationChannel[];

	animations?: AIColladaAnimation[];
}


interface AIColladaScene {

}

interface AIColladaDocument {
	asset?: AIColladaAsset;

	libEffects?: AIColladaEffectLibrary;
	libMaterials?: AIColladaLibrary;
	libGeometries?: AIColladaLibrary;
	libVisualScenes?: AIColladaLibrary;
	libAnimations?: AIColladaLibrary;

	scene?: AIColladaScene;
}

interface AIColladaAnimationClip extends AIColladaEntry {
	name?: string;
	start: float;
	end: float;
}




