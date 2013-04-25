#ifndef IDOCUMENT_TS
#define IDOCUMENT_TS

#define ISceneNodeInstance int
#define IAnimationBaseInstance int
#define ISceneInstance int

#include "IUnique.ts"

module akra {
	export enum EDocumentEntry {
		k_Unknown,

		k_Instance,
		k_Controller,
		k_Animation,
		k_AnimationBlend,
		k_AnimationContainer,
		k_SceneNode
	}

	export enum EDocumentFormat {
		JSON,
		BINARY_JSON
	}

	export interface IEntry {
		guid?: int;
	}

	export interface IDataEntry extends IEntry {
		type: EDocumentEntry;
		extra?: any;
	}

	export interface ILibraryEntry extends IEntry {
		data: IUnique;
		entry: IDataEntry;
	}

	export interface ILibrary {
		[guid: int]: ILibraryEntry;
	}


	export interface IContributor {
        author?: string;
        authoringTool?: string;
        comments?: string;
        copyright?: string;
        sourceData?: any;
    }

    export interface IUnit {
        name: string;
        meter: float;
    }

	export interface IAsset {
		unit: IUnit;
        upAxis: string;
        title?: string;
        subject?: string; 
        created: string;
        modified: string;
        keywords: string[];
        contributor?: IContributor;
	}

	export interface IAnimationFrameEntry {
		time: float;
		weight: float;
		matrix: float[];
	}

	export interface IAnimationTrackEntry {
		interpolation: EAnimationInterpolations;
		keyframes: IAnimationFrameEntry[];
		targetName: string;
		target: ISceneNodeInstance;
	}

	export interface IAnimationTargetEntry {
		target: ISceneNodeInstance;
		name: string;
	}

	export interface IAnimationBaseEntry extends IDataEntry {
		name: string;
		targets: IAnimationTargetEntry[];
		//additional information abtout position on animation graph
		extra: {
			graph?: { x: int; y: int; };
		};
	}

	export interface IAnimationEntry extends IAnimationBaseEntry {
		tracks: IAnimationTrackEntry[];
	}

	export interface IAnimationBlendElementEntry {
		animation: IAnimationBaseInstance;
		weight: float;
		mask: FloatMap;
		// acceleration: float;
	}

	export interface IAnimationBlendEntry extends IAnimationBaseEntry {
		animations: IAnimationBlendElementEntry[];
	}

	export interface IAnimationContainerEntry extends IAnimationBaseEntry {
		enable: bool;
		startTime: float;
		speed: float;
		loop: bool;
		animation: IAnimationBaseInstance;
		reverse: bool;
		pause: bool;
		leftInfinity: bool;
		rightInfinity: bool;
	}

	export interface IControllerEntry extends IDataEntry {
		animations: IAnimationBaseInstance[];
		options: int;
		name: string;
	}


	export interface IDocument {
		asset?: IAsset;
		library: IDataEntry[];
		scenes: ISceneInstance[];
	}


}

#endif
