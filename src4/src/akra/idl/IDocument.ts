
/// <reference path="AIUnique.ts" />
/// <reference path="IMap.ts" />
/// <reference path="IFrame.ts" />

module akra {
	enum EDocumentEntry {
	    k_Unknown,
	
	    k_Instance,
	    k_Controller,
	    k_Animation,
	    k_AnimationBlend,
	    k_AnimationContainer,
	    k_SceneNode
	}
	
	enum EDocumentFormat {
	    JSON,
	    BINARY_JSON
	}
	
	interface IEntry {
	    guid?: int;
	}
	
	interface IDataEntry extends IEntry {
	    type: EDocumentEntry;
	    extra?: any;
	}
	
	interface ILibraryEntry extends IEntry {
	    data: AIUnique;
	    entry: IDataEntry;
	}
	
	interface ILibrary {
	    [guid: int]: ILibraryEntry;
	}
	
	
	interface IContributor {
	    author?: string;
	    authoringTool?: string;
	    comments?: string;
	    copyright?: string;
	    sourceData?: any;
	}
	
	interface IUnit {
	    name: string;
	    meter: float;
	}
	
	interface IAsset {
	    unit: IUnit;
	    upAxis: string;
	    title?: string;
	    subject?: string;
	    created: string;
	    modified: string;
	    keywords: string[];
	    contributor?: IContributor;
	}
	
	interface IAnimationFrameEntry {
	    time: float;
	    weight: float;
	    matrix: float[];
	    type: int;
	}
	
	interface IAnimationTrackEntry {
	    interpolation: EAnimationInterpolations;
	    keyframes: IAnimationFrameEntry[];
	    targetName: string;
	    target: int /* ISceneNodeInstance (pointer to  ISceneNodeI)*/;
	}
	
	interface IAnimationTargetEntry {
	    target: int /* ISceneNodeInstance (pointer to  ISceneNodeI)*/;
	    name: string;
	}
	
	interface IAnimationBaseEntry extends IDataEntry {
	    name: string;
	    targets: IAnimationTargetEntry[];
	    //additional information abtout position on animation graph
	    extra: {
	        graph?: { x: int; y: int; };
	    };
	}
	
	interface IAnimationEntry extends IAnimationBaseEntry {
	    tracks: IAnimationTrackEntry[];
	}
	
	interface IAnimationBlendElementEntry {
	    animation: int /* IAnimationBaseInstance(pointer to  IAnimationBase)*/;
	    weight: float;
	    mask: IMap<float>;
	    // acceleration: float;
	}
	
	interface IAnimationBlendEntry extends IAnimationBaseEntry {
	    animations: IAnimationBlendElementEntry[];
	}
	
	interface IAnimationContainerEntry extends IAnimationBaseEntry {
	    enable: boolean;
	    startTime: float;
	    speed: float;
	    loop: boolean;
	    animation: int /* IAnimationBaseInstance(pointer to  IAnimationBase)*/;
	    reverse: boolean;
	    pause: boolean;
	    leftInfinity: boolean;
	    rightInfinity: boolean;
	}
	
	interface IControllerEntry extends IDataEntry {
	    animations: int /* IAnimationBaseInstance(pointer to  IAnimationBase)*/[];
	    options: int;
	    name: string;
	}
	
	
	interface IDocument {
	    asset?: IAsset;
	    library: IDataEntry[];
	    scenes: int /* ISceneInstance(pointer to  IScene)*/[];
	}
	
}
