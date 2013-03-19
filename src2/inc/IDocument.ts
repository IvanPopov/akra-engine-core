#ifndef IDOCUMENT_TS
#define IDOCUMENT_TS

#define ISceneNodeInstance IInstance
#define IAnimationBaseInstance IInstance
#define ISceneInstance IInstance



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

	export interface IEntry {
		guid: int;
	}

	export interface IDataEntry {
		type: EDocumentEntry;
	}

	export interface IInstance extends Number {
		
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
		duration: float;
	}

	export interface IAnimationEntry extends IAnimationBaseEntry {
		tracks: IAnimationTrackEntry[];
	}

	export interface IAnimationBlendElementEntry {
		animation: IAnimationBaseInstance;
		weight: float;
		mask: FloatMap;
		acceleration: float;
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
	}

	export interface IDocument {
		asset?: IAsset;
		library: IDataEntry[];
		scenes: ISceneInstance[];
	}


}

#endif
