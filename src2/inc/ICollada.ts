#ifndef ICOLLADA_TS
#define ICOLLADA_TS

module akra {
	IFACE(ISkeleton);
	IFACE(IModel);
	IFACE(IEngine);

	export interface IColladaLoadCallback {
		(pModel: IModel): void;
	}

	export interface IColladaAnimationLoadOptions {
		load: bool;
		pose?: bool;
	}

	export interface IColladaLoadOptions {
    	success: IColladaLoadCallback;

    	file?: string;
    	content?: string;
    	modelResource: IModel;

    	/** Add nodes, that visualize joints in animated models. */
    	drawJoints?: bool;
    	/** Convert all meshed to wireframe. */
    	wireframe?: bool;
    	/** 
    	 * Use common buffer for all data 
    	 * @deprecated
    	 */
    	sharedBuffer?: bool;

    	animation?: IColladaAnimationLoadOptions;
    	scene?: bool;
    	extractPoses?: bool;
    	skeletons: ISkeleton[];
    }


    //----------------------
    
    export interface IColladaNode {

    }

    export interface IColladaNodeLoader {
    	(pNode: Node): IColladaNode;
    }

    export interface IColladaLibrary {

    }

    export interface IColladaUnknownFormat {
    	name: string[];
    	type: string[];
    }

    /** Stride for collada formats, discretized at 32 bits. */
    export interface IColladaFormatStrideTable {
    	[format: string]: uint;
    }

    export interface IColladaConverter {
    	(data: string, output: any[], from: int): uint;
    }

    export interface IColladaConvertionTable {
    	[type: string]: { type: any; converter: IColladaConverter; }
    }

    export interface IColladaLinkMap {
    	[link: string]: any;
    }

    export interface IColladaLibraryMap {
    	[library: string]: IColladaLibrary;
    }

    export interface IColladaLibraryTemplate {
    	lib: string; 		/** library tag name.*/
    	element: string;	/** element in liibrary. */
    	loader: IColladaNodeLoader; /** loader function */
    }

    //----
    
    export interface IColladaImage extends IColladaNode {
    	id: string;
    	name: string;
    	depth: int;
    	data: any;
    	path: string;
    }

    export interface IColladaTechniqueValue extends IColladaNode {

    }

    export interface IColladaPhong extends IColladaNode, IMaterial {

    }

    export interface IColladaEffectTechnique extends IColladaNode {
    	sid: string;
    	type: string;
    	value: IColladaNode;
    }

    export interface IColladaNewParam extends IColladaNode {
    	sid: string;
    	annotate: string;
    	semantics: string;
    	modifier: string;
    	value: any;
    	type: string;
    }

    export interface IColladaProfileCommon extends IColladaNode {
    	technique: IColladaEffectTechnique;
    	newParam: { [name: string]: IColladaNewParam; }
    }

    export interface IColladaEffect extends IColladaNode {
    	id: string;
    	profileCommon: IColladaProfileCommon;
    }

}

#endif
