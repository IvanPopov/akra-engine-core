#ifndef COLLADA_TS
#define COLLADA_TS

#include "ICollada.ts"


#include "IMesh.ts"
#include "IRenderDataCollection.ts"

#include "animation/AnimationTrack.ts"
#include "animation/Animation.ts"

#include "math/math.ts"
#include "io/files.ts"
#include "util/util.ts"

module akra.collada {
    
    export function createLoader(pModel?: IModel): IColladaLoader;

	 /* COMMON FUNCTIONS
     ------------------------------------------------------
     */
    
    function getSupportedFormat(sSemantic: string): IColladaUnknownFormat[];
    function calcFormatStride(pFormat: IColladaUnknownFormat[]): int;
    
    // polygon index convertion
    
    function polygonToTriangles(pXML: Node, iStride: int): uint[];
    function polylistToTriangles(pXML: Node, iStride: int): uint[];
    function trifanToTriangles(pXML: Node, iStride: int): uint[];
    function tristripToTriangles(pXML: Node, iStride: int): uint[];
    
    // data convertion

    function parseBool(sValue: string): bool;
    function retrieve(pSrc: any[], pDst: any[], iStride?: int, iFrom?: int, iCount?: int, iOffset?: int, iLen?: int): uint;

    function string2Array(sData: string, ppData: any[], fnConv: (data: string) => any, iFrom?: uint): uint;
    function string2IntArray(sData: string, ppData: int[], iFrom?: uint): uint;
    function string2FloatArray(sData: string, ppData: float[], iFrom?: uint): uint;
    function string2BoolArray(sData: string, ppData: bool[], iFrom?: uint): uint;
    function string2StringArray(sData: string, ppData: string[], iFrom?: uint): uint;


    // additional
    
    function printArray(pArr: any[], nRow: uint, nCol: uint): string;
    function sortArrayByProperty(pData: any[], sProperty: string): any[];
    function lastElement(pData: any[]): any;

    //xml
    
    function eachNode(pXML: Node, fnCallback: IXMLExplorer, nMax?: uint): void;
    function eachChild(pXML: Node, fnCallback: IXMLExplorer): void;
    function eachByTag(pXML: Node, sTag: string, fnCallback: IXMLExplorer, nMax?: uint): void;
    function firstChild(pXML: Node, sTag: string): Node;
    function stringData(pXML: Node): string;
    function attr(pXML: Node, sName: string): string;

    // Akra convertions functions
    // -------------------------------------------------------

    function findNode(pNodes: IColladaNode[], sNode?: string, fnNodeCallback?: (pNode: IColladaNode) => void): IColladaNode;

    



    // globals

    var pSupportedVertexFormat: IColladaUnknownFormat[] = [
        {name : ["X"], type : ["float"]},
        {name : ["Y"], type : ["float"]},
        {name : ["Z"], type : ["float"]}
    ];

    var pSupportedTextureFormat: IColladaUnknownFormat[] = [
        {name : ["S"], type : ["float"]},
        {name : ["T"], type : ["float"]},
        {name : ["P"], type : ["float"]}
    ];

    var pSupportedWeightFormat: IColladaUnknownFormat[] = [
        {name : ["WEIGHT"], type : ["float"]}
    ];

    var pSupportedJointFormat: IColladaUnknownFormat[] = [
        {name : ["JOINT"], type : ["Name", "IDREF"]}
    ];

    var pSupportedInvBindMatrixFormat: IColladaUnknownFormat[] = [
        {name : ["TRANSFORM"], type : ["float4x4"]}
    ];

    var pSupportedInterpolationFormat: IColladaUnknownFormat[] = [
        {name : ["INTERPOLATION"], type : ["Name"]}
    ];

    var pSupportedInputFormat: IColladaUnknownFormat[] = [
        {name : ["TIME"], type : ["float"]}
    ];

    var pSupportedOutputFormat: IColladaUnknownFormat[] = [
        {name : ["TRANSFORM", "X", "ANGLE", null], type : ["float4x4", "float"]},
        {name : ["Y"], type : ["float"]},
        {name : ["Z"], type : ["float"]}
    ];

    var pSupportedTangentFormat: IColladaUnknownFormat[] = [
        {name : ["X"], type : ["float"]},
        {name : ["Y"], type : ["float"]},
        {name : ["X"], type : ["float"]},
        {name : ["Y"], type : ["float"]},
        {name : ["X"], type : ["float"]},
        {name : ["Y"], type : ["float"]},
        {name : ["X"], type : ["float"]},
        {name : ["Y"], type : ["float"]},
        {name : ["X"], type : ["float"]},
        {name : ["Y"], type : ["float"]}
    ];

    var pFormatStrideTable: IColladaFormatStrideTable = <IColladaFormatStrideTable> {
        "float"    : 1,
        "float2"   : 2,
        "float3"   : 3,
        "float4"   : 4,
        "float3x3" : 9,
        "float4x4" : 16,
        "int"      : 1,
        "name"     : 1,
        "Name"     : 1,
        "IDREF"    : 1
    };

    var pConvFormats: IColladaConvertionTable = {
        "int"    : { type: Int32Array, 		converter: string2IntArray 		},
        "float"  : { type: Float32Array, 	converter: string2FloatArray	},
        "bool"   : { type: Array, 			converter: string2BoolArray		},
        "string" : { type: Array, 			converter: string2StringArray	}
    };

  

    class ColladaLoader implements IColladaLoader {

        constructor (pModel?: IModel);

        isValid(): bool;
        setModel(pModel: IModel): void;
        destroy(): void;

        parse(sXMLData: string, pOptions?: IColladaLoadOptions): bool;
        load(sFilename: string, fnCallback?: IColladaLoadCallback, pOptions?: IColladaLoadOptions): void;

        // helper functions
    
        private COLLADATranslateMatrix(pXML: Node): IMat4;
        private COLLADARotateMatrix(pXML: Node): IMat4;
        private COLLADAScaleMatrix(pXML: Node): IMat4;
        private COLLADAData(pXML: Node): any;
        private COLLADAGetSourceData(pXML: Node): string;

        // common
        // -----------------------------------------------------------
        
        private COLLADATransform(pXML: Node): IColladaTransform;
        private COLLADANewParam(pXML: Node): IColladaNewParam;
        private COLLADAAsset(pXML: Node): IColladaAsset;
        private COLLADALibrary(pXML: Node, pTemplate: IColladaLibraryTemplate): IColladaLibrary;

        // geometry

        private COLLADAAccessor(pXML: Node): IColladaAccessor;
        private COLLADAInput(pXML: Node, iOffset?: int): IColladaInput;
        private COLLADATechniqueCommon(pXML: Node): IColladaTechniqueCommon;
        private COLLADASource(pXML: Node): IColladaSource;
        private COLLADAVertices(pXML: Node): IColladaVertices;
        private COLLADAJoints(pXML: Node): IColladaJoints;
        private COLLADAPolygons(pXML: Node, sType: string): IColladaPolygons;
        private COLLADAVertexWeights(pXML: Node): IColladaVertexWeights;
        private COLLADAMesh(pXML: Node): IColladaMesh;
        private COLLADAGeometrie(pXML: Node): IColladaGeometrie;
        private COLLADASkin(pXML: Node): IColladaSkin;
        private COLLADAController(pXML: Node): IColladaController;

        // images
        // 
        private COLLADAImage(pXML: Node): IColladaImage;

        // effects
        
        private COLLADASurface(pXML: Node): IColladaSurface;
        private COLLADATexture(pXML: Node): IColladaTexture;
        private COLLADASampler2D(pXML: Node): IColladaSampler2D;
        private COLLADAPhong(pXML: Node): IColladaPhong;
        private COLLADAEffectTechnique(pXML: Node): IColladaEffectTechnique;
        private COLLADAProfileCommon(pXML: Node): IColladaProfileCommon;
        private COLLADAEffect(pXML: Node): IColladaEffect;

        //materials
        
        private COLLADAMaterial(pXML: Node): IColladaMaterial;

        // scene

        private COLLADANode(pXML: Node, iDepth?: uint): IColladaNode;
        private COLLADAVisualScene(pXML: Node): IColladaVisualScene;
        private COLLADABindMaterial(pXML: Node): IColladaBindMaterial;
        private COLLADAInstanceEffect(pXML: Node): IColladaInstanceEffect;
        private COLLADAInstanceController(pXML: Node): IColladaInstanceController;
        private COLLADAInstanceGeometry(pXML: Node): IColladaInstanceGeometry;

        // directly load <visual_scene> from <instance_visual_scene> from <scene>.
        private COLLADAScene(pXML: Node): IColladaVisualScene;

        // animation
         
        private COLLADAAnimationSampler(pXML: Node): IColladaAnimationSampler;
        private COLLADAAnimationChannel(pXML: Node): IColladaAnimationChannel;
        private COLLADAAnimation(pXML: Node): IColladaAnimation;

        
         // collada mapping

        private source(sUrl: string): IColladaEntry;
        private link(sId: string, pTarget: IColladaEntry): void;
        private target(sPath: string): IColladaTarget;

        //animation 
    
        private buildAnimationTrack(pChannel: IColladaAnimationChannel): IAnimationTrack;
        private buildAnimationTrackList(pAnimationData: IColladaAnimation): IAnimationTrack[];
        private buildAnimation(pAnimationData: IColladaAnimation): IAnimation;
        private buildAnimations(pAnimations: IColladaAnimation[], pAnimationsList?: IAnimation[]): IAnimation[];

        // common
        
        private buildAssetTransform(pNode: ISceneNode, pAsset: IColladaAsset): ISceneNode;

        // materials & meshes
        
        private buildMaterials(pMesh: IMesh, pMeshNode: IColladaNode): IMesh;
        private buildSkeleton(pSkeletonsList: string[]): ISkeleton;
        private buildMesh(pMeshNode: IColladaNode): IMesh;
        private buildSkinMesh(pSkinMeshNode: IColladaNode): IMesh;

        private buildInstance(pInstances: IColladaInstance[], fnBuilder: (pNode: IColladaNode) => any, pSceneNode: ISceneNode, bAttach?: bool): any[];
        private buildMeshes(): IMesh[];

        // scene
        
        private buildSceneNode(pNode: IColladaNode): ISceneNode;
        private buildJointNode(pNode: IColladaNode): IJoint;
        private buildNodes(pNodes: IColladaNode[], pParentNode?: ISceneNode): ISceneNode;
        private buildScene(): ISceneNode[];

        private buildInititalPose(pNodes: IColladaNode[], pSkeleton: ISkeleton): IAnimation;
        private buildInitialPoses(pPoseSkeletons: ISkeleton[]): IAnimation[];

        // additional

        private setOptions(pUserOptions: IColladaLoadOptions): void;

        private lock(): void;
        private unlock(): void;
        private isLocked(): bool;
        private reset(): void;

        private isVisualSceneLoaded(): bool;
        private isSceneNeeded(): bool;
        private isAnimationNeeded(): bool;
        private isPoseExtractionNeeded(): bool;
        private getSkeletonsOutput(): ISkeleton[];
        private getVisualScene(): IColladaVisualScene;

        private isLibraryLoaded(sLib: string): bool;
        private getLibrary(sLib: string): IColladaLibrary;

        private readLibraries(pXML: Node, pTemplates: IColladaLibraryTemplate[]): void;
        private emitError(sError: string, fnCallback?: IColladaLoadCallback): void;

        static DEFAULT_OPTIONS: IColladaLoadOptions = {
            model           : null,
            drawJoints      : false,
            wireframe       : false,
            sharedBuffer    : false,
            animation       : { pose: true },
            scene           : true,
            extractPoses    : true,
            skeletons       : null
        };

        private static SCENE_TEMPLATE: IColladaLibraryTemplate[] = [
            {lib : 'library_images',        element : 'image',          loader : (<any>ColladaLoader.prototype).COLLADAImage},
            {lib : 'library_effects',       element : 'effect',         loader : (<any>ColladaLoader.prototype).COLLADAEffect},
            {lib : 'library_materials',     element : 'material',       loader : (<any>ColladaLoader.prototype).COLLADAMaterial},
            {lib : 'library_geometries',    element : 'geometry',       loader : (<any>ColladaLoader.prototype).COLLADAGeometrie},
            {lib : 'library_controllers',   element : 'controller',     loader : (<any>ColladaLoader.prototype).COLLADAController},
            {lib : 'library_visual_scenes', element : 'visual_scene',   loader : (<any>ColladaLoader.prototype).COLLADAVisualScene}
        ];

        private static ANIMATION_TEMPLATE: IColladaLibraryTemplate[] = [
            {lib : 'library_animations', element : 'animation', loader : (<any>ColladaLoader.prototype).COLLADAAnimation}
        ];

        //=======================================================================================
        
        private _pModel: IModel = null;
        private _pOptions: IColladaLoadOptions = null;

        private _pLinks: IColladaLinkMap = null;
        private _pLib: IColladaLibraryMap = null;
        private _pCache: IColladaCache = null;

        private _pAsset: IColladaAsset = null;
        private _pVisualScene: IColladaVisualScene = null;

        private _sBasename: string = null;


    
        constructor (pModel: IModel = null) {
            this.setModel(pModel);
        }

        // function buildSceneNode(pNode: IColladaNode): ISceneNode;
        // function buildJointNode(pNode: IColladaNode): IJoint;
        // function buildNodes(pNodes: IColladaNode[], pParentNode?: ISceneNode): ISceneNode;
        // function buildScene(pScene: IColladaVisualScene, pAsset: IColladaAsset): ISceneNode[];

        private buildInititalPose(pNodes: IColladaNode[], pSkeleton: ISkeleton): IAnimation {
            var sPose: string = "Pose-" + this._sBasename + "-" + pSkeleton.name;
            var pPose: IAnimation = animation.createAnimation(sPose);
            var pNodeList: ISceneNode[] = pSkeleton.getNodeList();
            var pNodeMap: ISceneNodeMap = {};
            var pTrack: IAnimationTrack;

            for (var i: int = 0; i < pNodeList.length; ++i) {
                pNodeMap[pNodeList[i].name] = pNodeList[i];
            }

            findNode(pNodes, null, function (pNode: IColladaNode) {
                var sJoint: string = pNode.sid;
                var sNodeId: string = pNode.id;

                if (!isDefAndNotNull(pNodeMap[sNodeId])) {
                    return;
                }

                pTrack = animation.createTrack(sJoint);
                pTrack.nodeName = sNodeId;
                pTrack.keyFrame(0.0, pNode.m4fTransform);

                pPose.push(pTrack);
            });

            // if (pModelResource && bExtractInitialPoses) {
            //     pModelResource.addAnimation(pPose);
            // }

            return pPose;
        }

        private buildInitialPoses(pPoseSkeletons: ISkeleton[] = null): IAnimation[] {
            pPoseSkeletons = pPoseSkeletons || this.getSkeletonsOutput();
            var pScene: IColladaVisualScene = this.getVisualScene();

            var pSkeleton: ISkeleton;
            var pPoses: IAnimation[] = [];

            for (var i: int = 0; i < pPoseSkeletons.length; ++i) {
                pSkeleton = pPoseSkeletons[i];
                // if (pSkeleton.name === "node-Bip001_Pelvis" || pSkeleton.name === "node-Bip001") {
                //     trace('skipping <node-Bip001_Pelvis> skeletom ...', '[' + sBasename + ']');

                //     trace(pSkeleton.getNodeList()[0].localMatrix().toQuat4().toYawPitchRoll(Vec3()).toString());

                //     continue;
                // }
                pPoses.push(this.buildInititalPose(pScene.nodes, pSkeleton));
            }

            return pPoses;
        }

        private readLibraries(pXML: Node, pTemplates: IColladaLibraryTemplate[]): void {
            var pLibraries: IColladaLibraryMap = this._pLib;
            
            for (var i: int = 0; i < pTemplates.length; i++) {
                var sLib: string = pTemplates[i].lib;

                pLibraries[sLib] = this.COLLADALibrary(firstChild(pXML, sLib), pTemplates[i]);
            }
        } 

        private emitError(sError: string, fnCallback: IColladaLoadCallback = null): void {
            if (isNull(fnCallback)) {
                ERROR(sError);
            }
            else {
                fnCallback(new Error(sError), null);
            }
        }

        private setOptions(pOptions: IColladaLoadOptions): void {
            if (isNull(pOptions)) {
                pOptions = ColladaLoader.DEFAULT_OPTIONS;
            }

            for (var i in DEFAULT_OPTIONS) {
                if (isDef(pOptions[i])) {
                    continue;
                }

                pOptions[i] = DEFAULT_OPTIONS[i];
            }

            this.setModel(pOptions.model || null);
            this._pOptions = pOptions;
        }

        private inline lock(): void {
            this._bLock = true;
        }

        private inline unlock(): void {
            this._bLock = false;
        }

        private inline isLocked(): bool {
            return this._bLock;
        }

        private inline isVisualSceneLoaded(): bool {
            return isDefAndNotNull(this._pVisualScene);
        }

        private inline getVisualScene(): IColladaVisualScene {
            return this._pVisualScene;
        }

        private inline isSceneNeeded(): bool {
            return this._pOptions.scene === true;
        }

        private inline getLibrary(sLib: string): IColladaLibrary {
            return this._pLib[sLib] || null;
        }

        private inline isLibraryLoaded(sLib: string): bool {
            return isDefAndNotNull(this._pLib[sLib]);
        }

        private reset(): void {
            this._pOptions = null;
            this._pLinks = {};
            this._pLib = {};
            this._pCache = { meshMap: {}, sharedBuffer: null };
            this._sBasename = "unknown";
        }

        setModel(pModel: IModel): void {
            if (!isNull(pModel)) {
                this._pModel = pModel;
            }
        }

        isValid(): bool {
            return this._pModel != null;
        }

        destroy(): void {
            CRITICAL('TODO: ColladaLoader::destroy()');
        }

        parse(sXMLData: string, pOptions: IColladaLoadOptions = null): bool {
                
            if (this.isLocked()) {
                this.emitError("TODO: loader is busy!");
                return false;
            }

            this.lock();
            this.setOptions(pOptions);

            if (isNull(sXMLData)) {
                this.emitError("must be specified collada content.");
                return false;
            }

            if (!this.isValid()) {
                this.emitError("you must specify model, that will be loaded.");
                return false;
            }

            var pParser: DOMParser = new DOMParser();
            var pXMLDocument: Document = pParser.parseFromString(sXMLData, "application/xml");
            var pXMLRoot: Node = pXMLDocument.getElementsByTagName("COLLADA")[0];

            var m4fRootTransform: IMat4;
            var pSkeletons: ISkeleton[], 
                pSkeleton: ISkeleton;
            var pPoses: IAnimation[];

            var pSceneOutput: ISceneNode[] = null;
            var pAnimationOutput: IAnimation[] = null;
            var pMeshOutput: IMesh[] = null;
            var pInitialPosesOutput: IAnimation[] = null;


            this.readLibraries(pXMLRoot, ColladaLoader.SCENE_TEMPLATE);

            this.COLLADAAsset(firstChild(pXMLRoot, "asset"));
            this.COLLADAScene(firstChild(pXMLRoot, "scene"));

            if (this.isVisualSceneLoaded() && this.isSceneNeeded()) {
                pSceneOutput = this.buildScene();
                pMeshOutput = this.buildMeshes();
            }

            if (this.isPoseExtractionNeeded()) {
                pInitialPosesOutput = this.buildInitialPoses();
            }

            if (this.isAnimationNeeded()) {
                this.readLibraries(pXMLRoot, ColladaLoader.ANIMATION_TEMPLATE);

                if (this.isLibraryLoaded("library_animations")) {
                    pAnimationOutput = 
                        this.buildAnimations((<IColladaAnimation>this.getLibrary("library_animations")).animations);
                }

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

                        eachByTag(pXMLRoot, "skeleton", function (pXML: Node) {
                            pSkeletons.push(this.buildSkeleton([stringData(pXML)]));
                        });
                    }

                    */

                    pPoses = this.buildInitialPoses(pSkeletons);

                    for (var i: int = 0; i < pAnimationOutput.length; ++ i) {
                        for (var j: int = 0; j < pPoses.length; ++ j) {
                            pAnimationOutput[i].extend(pPoses[j]);
                        }
                    }
                }
            }

            this.unlock();
            this.reset();

            return true;
        }

        load(sFilename: string, fnCallback: IColladaLoadCallback = null, pOptions: IColladaLoadOptions = null): void {


            if (isNull(sFilename)) {
                this.emitError("cannot parse collada content", fnCallback);
                return;
            }

            

            io.fopen(sFilename).read(function(pErr: Error, sContent: string) {
                if (pErr) {
                    this.emitError("could not read collada file: " + sFilename, fnCallback);
                    return;
                }

                if (!this.parse(sContent, pOptions)) {
                    this.emitError("cannot parse collada content", fnCallback);
                    return;
                }
                
                if (!isNull(fnCallback)) {
                    fnCallback(null, this._pModel);
                }
            
            });
        }
    }

    export function createLoader(pModel: IModel = null): IColladaLoader {
        return new ColladaLoader(pModel);
    }
}

#endif
