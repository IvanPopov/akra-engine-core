// AIDocument interface
// [write description here...]

/// <reference path="AIUnique.ts" />
/// <reference path="AIMap.ts" />
/// <reference path="AIFrame.ts" />

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

interface AIDataEntry extends AIEntry {
    type: AEDocumentEntry;
    extra?: any;
}

interface AILibraryEntry extends AIEntry {
    data: AIUnique;
    entry: AIDataEntry;
}

interface AILibrary {
    [guid: int]: AILibraryEntry;
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
    target: int /* ISceneNodeInstance (pointer to  ISceneNodeI)*/;
}

interface AIAnimationTargetEntry {
    target: int /* ISceneNodeInstance (pointer to  ISceneNodeI)*/;
    name: string;
}

interface AIAnimationBaseEntry extends AIDataEntry {
    name: string;
    targets: AIAnimationTargetEntry[];
    //additional information abtout position on animation graph
    extra: {
        graph?: { x: int; y: int; };
    };
}

interface AIAnimationEntry extends AIAnimationBaseEntry {
    tracks: AIAnimationTrackEntry[];
}

interface AIAnimationBlendElementEntry {
    animation: int /* IAnimationBaseInstance(pointer to  IAnimationBase)*/;
    weight: float;
    mask: AIMap<float>;
    // acceleration: float;
}

interface AIAnimationBlendEntry extends AIAnimationBaseEntry {
    animations: AIAnimationBlendElementEntry[];
}

interface AIAnimationContainerEntry extends AIAnimationBaseEntry {
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

interface AIControllerEntry extends AIDataEntry {
    animations: int /* IAnimationBaseInstance(pointer to  IAnimationBase)*/[];
    options: int;
    name: string;
}


interface AIDocument {
    asset?: AIAsset;
    library: AIDataEntry[];
    scenes: int /* ISceneInstance(pointer to  IScene)*/[];
}
