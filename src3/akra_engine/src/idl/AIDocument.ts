// AIDocument interface
// [write description here...]

#define ISceneNodeInstance int
#define IAnimationBaseInstance int
#define ISceneInstance int

/// <reference path="AIUnique.ts" />

module akra {
enum AEDocumentEntry {
	k_Unknown,

	k_Instance,
	k_Controller,
	k_Animation,
	k_AnimationBlend,
	k_AnimationContainer,
	k_SceneNode
}

enum AEDocumentFormat {
	JSON,
	BINARY_JSON
}

interface AIEntry {
	guid?: int;
}

interface IDataEntry extends AIEntry {
	type: AEDocumentEntry;
	extra?: any;
}

interface ILibraryEntry extends AIEntry {
	data: AIUnique;
	entry: IDataEntry;
}

interface AILibrary {
	[guid: int]: ILibraryEntry;
}


interface AIContributor {
	author?: string;
	authoringTool?: string;
	comments?: string;
	copyright?: string;
	sourceData?: any;
}

interface AIUnit {
	name: string;
	meter: float;
}

interface AIAsset {
	unit: AIUnit;
	upAxis: string;
	title?: string;
	subject?: string; 
	created: string;
	modified: string;
	keywords: string[];
	contributor?: AIContributor;
}

interface AIAnimationFrameEntry {
	time: float;
	weight: float;
	matrix: float[];
	type: int;
}

interface AIAnimationTrackEntry {
	interpolation: AEAnimationInterpolations;
	keyframes: AIAnimationFrameEntry[];
	targetName: string;
	target: ISceneNodeInstance;
}

interface AIAnimationTargetEntry {
	target: ISceneNodeInstance;
	name: string;
}

interface IAnimationBaseEntry extends IDataEntry {
	name: string;
	targets: AIAnimationTargetEntry[];
	//additional information abtout position on animation graph
	extra: {
		graph?: { x: int; y: int; };
	};
}

interface IAnimationEntry extends IAnimationBaseEntry {
	tracks: AIAnimationTrackEntry[];
}

interface AIAnimationBlendElementEntry {
	animation: IAnimationBaseInstance;
	weight: float;
	mask: FloatMap;
	// acceleration: float;
}

interface IAnimationBlendEntry extends IAnimationBaseEntry {
	animations: AIAnimationBlendElementEntry[];
}

interface IAnimationContainerEntry extends IAnimationBaseEntry {
	enable: boolean;
	startTime: float;
	speed: float;
	loop: boolean;
	animation: IAnimationBaseInstance;
	reverse: boolean;
	pause: boolean;
	leftInfinity: boolean;
	rightInfinity: boolean;
}

interface IControllerEntry extends IDataEntry {
	animations: IAnimationBaseInstance[];
	options: int;
	name: string;
}


interface AIDocument {
	asset?: AIAsset;
	library: IDataEntry[];
	scenes: ISceneInstance[];
}


}

#endif