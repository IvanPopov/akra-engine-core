#ifndef COLLADA_TS
#define COLLADA_TS

#include "ICollada.ts"


#include "IMesh.ts"
#include "IRenderDataCollection.ts"

#include "IAnimationTrack.ts"

#include "math/math.ts"
#include "io/files.ts"

// module akra {
//     export interface ICollada {
//         load(): void;
//         parse(): bool;
//     }
// }

module akra.collada {
    // helper functions
    
    function COLLADATranslateMatrix(pXML: Node): IMat4;
    function COLLADARotateMatrix(pXML: Node): IMat4;
    function COLLADAScaleMatrix(pXML: Node): IMat4;
    function COLLADAData(pXML: Node): any;
    function COLLADAGetSourceData(pXML: Node): string;

    // common
    // -----------------------------------------------------------
    
    function COLLADATransform(pXML: Node): IColladaTransform;
    function COLLADANewParam(pXML: Node): IColladaNewParam;
    function COLLADAAsset(pXML: Node): IColladaAsset;
    function COLLADALibrary(pXML: Node, pTemplate: IColladaLibraryTemplate): IColladaEntry;

    // geometry

    function COLLADAAccessor(pXML: Node): IColladaAccessor;
    function COLLADAInput(pXML: Node, iOffset?: int): IColladaInput;
    function COLLADATechniqueCommon(pXML: Node): IColladaTechniqueCommon;
    function COLLADASource(pXML: Node): IColladaSource;
    function COLLADAVertices(pXML: Node): IColladaVertices;
    function COLLADAJoints(pXML: Node): IColladaJoints;
    function COLLADAPolygons(pXML: Node, sType: string): IColladaPolygons;
    function COLLADAVertexWeights(pXML: Node): IColladaVertexWeights;
    function COLLADAMesh(pXML: Node): IColladaMesh;
    function COLLADAGeometrie(pXML: Node): IColladaGeometrie;
    function COLLADASkin(pXML: Node): IColladaSkin;
    function COLLADAController(pXML: Node): IColladaController;

    // images
    // 
	function COLLADAImage(pXML: Node): IColladaImage;

    // effects
    
    function COLLADASurface(pXML: Node): IColladaSurface;
    function COLLADATexture(pXML: Node): IColladaTexture;
    function COLLADASampler2D(pXML: Node): IColladaSampler2D;
    function COLLADAPhong(pXML: Node): IColladaPhong;
    function COLLADAEffectTechnique(pXML: Node): IColladaEffectTechnique;
    function COLLADAProfileCommon(pXML: Node): IColladaProfileCommon;
    function COLLADAEffect(pXML: Node): IColladaEffect;

    //materials
    
    function COLLADAMaterial(pXML: Node): IColladaMaterial;

    // scene

    function COLLADANode(pXML: Node, iDepth?: uint): IColladaNode;
    function COLLADAVisualScene(pXML: Node): IColladaVisualScene;
    function COLLADABindMaterial(pXML: Node): IColladaBindMaterial;
    function COLLADAInstanceEffect(pXML: Node): IColladaInstanceEffect;
    function COLLADAInstanceController(pXML: Node): IColladaInstanceController;
    function COLLADAInstanceGeometry(pXML: Node): IColladaInstanceGeometry;

    // directly load <visual_scene> from <instance_visual_scene> from <scene>.
    function COLLADAScene(pXML: Node): IColladaVisualScene;

    // animation
     
    function COLLADAAnimationSampler(pXML: Node): IColladaAnimationSampler;
    function COLLADAAnimationChannel(pXML: Node): IColladaAnimationChannel;
    function COLLADAAnimation(pXML: Node): IColladaAnimation;


	 /* COMMON FUNCTIONS
     ------------------------------------------------------
     */
    
     // collada mapping

    function source(sUrl: string): IColladaEntry;
    function link(sId: string, pTarget: IColladaEntry): void;
    function target(sPath: string): IColladaTarget;

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

    //animation 
    
    function buildAnimationTrack(pChannel: IColladaAnimationChannel): IAnimationTrack;
    function buildAnimationTrackList(pAnimationData: IColladaAnimation): IAnimationTrack[];
    function buildAnimation(pAnimationData: IColladaAnimation): IAnimation;
    function buildAnimations(pAnimations: IColladaAnimation[], pAnimationsList?: IAnimation[]): IAnimation[];

    // common
    
    function buildAssetTransform(pNode: ISceneNode, pAsset: IColladaAsset): ISceneNode;

    // materials & meshes
    
    function buildMaterials(pMesh: IMesh, pMeshNode: IColladaNode): IMesh;
    function buildSkeleton(pSkeletonsList): ISkeleton;
    function buildMesh(pMeshNode: IColladaNode): IMesh;
    function buildSkinMesh(pSkinMeshNode: IColladaNode): IMesh;

    function buildInstance(pInstances: IColladaInstance[], fnBuilder: (pNode: IColladaNode) => any, pSceneNode: ISceneNode, bAttach?: bool): any[];
    function buildMeshes(pScene: IColladaVisualScene): IMesh[];

    // scene
    
    function buildSceneNode(pNode: IColladaNode): ISceneNode;
    function buildJointNode(pNode: IColladaNode): IJoint;
    function buildNodes(pNodes: IColladaNode[], pParentNode?: ISceneNode): ISceneNode;
    function buildScene(pScene: IColladaVisualScene, pAsset: IColladaAsset): ISceneNode[];

    function buildInititalPose(pNodes: IColladaNode[], pSkeleton: ISkeleton): IAnimation;
    function buildInitialPoses(pScene: IColladaVisualScene, pPoseSkeletons: ISkeleton[]): IAnimation[];

    // additional
    
    function readLibraries(pXML: Node, pTemplates: IColladaLibraryTemplate[], ppLibraries: IColladaLibraryMap): void;

    function emitError(sError: string, pOptions: IColladaLoadOptions): bool;
    export function parse(sXMLData: string, pEngine: IEngine, pOptions: IColladaLoadOptions): bool;
    export function load(pEngine: IEngine, pOptions: IColladaLoadOptions): void;

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

    var pSceneTemplate: IColladaLibraryTemplate[] = [
        {lib : 'library_images', 		element : 'image', 			loader : COLLADAImage},
        {lib : 'library_effects', 		element : 'effect', 		loader : COLLADAEffect},
        {lib : 'library_materials', 	element : 'material', 		loader : COLLADAMaterial},
        {lib : 'library_geometries', 	element : 'geometry', 		loader : COLLADAGeometrie},
        {lib : 'library_controllers', 	element : 'controller', 	loader : COLLADAController},
        {lib : 'library_visual_scenes', element : 'visual_scene', 	loader : COLLADAVisualScene}
    ];

    var pAnimationTemplate: IColladaLibraryTemplate[] = [
        {lib : 'library_animations', element : 'animation', loader : COLLADAAnimation}
    ];

    // function buildSceneNode(pNode: IColladaNode): ISceneNode;
    // function buildJointNode(pNode: IColladaNode): IJoint;
    // function buildNodes(pNodes: IColladaNode[], pParentNode?: ISceneNode): ISceneNode;
    // function buildScene(pScene: IColladaVisualScene, pAsset: IColladaAsset): ISceneNode[];

    function buildInititalPose(pNodes: IColladaNode[], pSkeleton: ISkeleton): IAnimation {
        var sPose: string = "Pose-" + sBasename + "-" + pSkeleton.name;
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

            pTrack = animation.createAnimationTrack(sJoint);
            pTrack.nodeName = sNodeId;
            pTrack.keyFrame(0.0, pNode.m4fTransform);

            pPose.push(pTrack);
        });

        // if (pModelResource && bExtractInitialPoses) {
        //     pModelResource.addAnimation(pPose);
        // }

        return pPose;
    }

    function buildInitialPoses(pScene: IColladaVisualScene, pPoseSkeletons: ISkeleton[]): IAnimation[] {
        var pSkeleton: ISkeleton;
        var pPoses: IAnimation[] = [];

        for (var i: int = 0; i < pPoseSkeletons.length; ++i) {
            pSkeleton = pPoseSkeletons[i];
            // if (pSkeleton.name === "node-Bip001_Pelvis" || pSkeleton.name === "node-Bip001") {
            //     trace('skipping <node-Bip001_Pelvis> skeletom ...', '[' + sBasename + ']');

            //     trace(pSkeleton.getNodeList()[0].localMatrix().toQuat4().toYawPitchRoll(Vec3()).toString());

            //     continue;
            // }
            pPoses.push(buildInititalPose(pScene.nodes, pSkeleton));
        }

        return pPoses;
    }

    function readLibraries(pXML: Node, pTemplates: IColladaLibraryTemplate[], ppLibraries: IColladaLibraryMap): void {
        for (var i: int = 0; i < pTemplates.length; i++) {
            var sLib: string = pTemplates[i].lib;

            ppLibraries[sLib] = COLLADALibrary(firstChild(pXML, sLib), pTemplates[i]);
        }
    } 

    function emitError(sError: string, pOptions: IColladaLoadOptions): bool {
        if (isNull(pOptions.callback)) {
            ERROR(sError);
        }
        else {
            pOptions.callback(new Error(sError), null);
        }

        return false;
    }

    export function parse(sXMLData: string, pEngine: IEngine, pOptions: IColladaLoadOptions): bool {
        
        var pLinks: IColladaLinkMap = {};
        var pLib: IColladaLibraryMap = {};
        var pCache: IColladaCache = {
            meshMap: {},
            sharedBuffer: null
        };


        if (isNull(sXMLData)) {
            sXMLData = pOptions.content;

            if (isDefAndNotNull(sXMLData)) {
                return emitError("must be specified collada content.", pOptions);
            }

        }

        if (isNull(pOptions.model)) {
            return emitError("you must specify model, that will be loaded.", pOptions);
        }

        var pParser: DOMParser = new DOMParser();
        var pXMLDocument: Document = pParser.parseFromString(sXMLData, "application/xml");
        var pXMLRoot: Node = pXMLDocument.getElementsByTagName("COLLADA")[0];

        var pAsset: IColladaAsset;
        var m4fRootTransform: IMat4;
        var pVisualScene: IColladaVisualScene;
        var pSkeletons: ISkeleton[], 
            pSkeleton: ISkeleton;
        var pPoses: IAnimation[];

        var pSceneOutput: ISceneNode[] = null;
        var pAnimationOutput: IAnimation[] = null;
        var pMeshOutput: IMesh[] = null;
        var pInitialPosesOutput: IAnimation[] = null;


        readLibraries(pXMLRoot, pSceneTemplate, pLib);

        pAsset = COLLADAAsset(firstChild(pXMLRoot, "asset"));
        pVisualScene = COLLADAScene(firstChild(pXMLRoot, "scene"));

        if (!isNull(pVisualScene) && pOptions.scene === true) {
            pSceneOutput = buildScene(pVisualScene, pAsset);
            pMeshOutput = buildMeshes(pVisualScene);
        }

        if (pOptions.extractPoses === true) {
            pInitialPosesOutput = buildInitialPoses(pVisualScene, pOptions.skeletons);
        }

        if (isDefAndNotNull(pOptions.animation)) {
            readLibraries(pXMLRoot, pAnimationTemplate, pLib);

            if (isDefAndNotNull(pLib["library_animations"])) {
                pAnimationOutput = 
                    buildAnimations((<IColladaAnimation>pLib['library_animations']).animations);
            }

            //дополним анимации начальными позициями костей
            if (pOptions.extractPoses === true) {
                pSkeletons = pOptions.skeletons || [];

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
                        buildScene(pVisualScene, pAsset);
                    }

                    eachByTag(pXMLRoot, "skeleton", function (pXML: Node) {
                        pSkeletons.push(buildSkeleton([stringData(pXML)]));
                    });
                }

                */

                pPoses = buildInitialPoses(pVisualScene, pSkeletons);

                for (var i: int = 0; i < pAnimationOutput.length; ++ i) {
                    for (var j: int = 0; j < pPoses.length; ++ j) {
                        pAnimationOutput[i].extend(pPoses[j]);
                    }
                }
            }
        }

        if (!isNull(pOptions.callback)) {
            pOptions.callback(null, pOptions.model);
        }

        return true;
    }

	export function load(pEngine: IEngine, pOptions: IColladaLoadOptions): void {

        if (isNull(pOptions.file)) {
            debug_assert(!isNull(pOptions.content), "must be specified file or xml content for loading.");
            
            if (!this.parse(null, pEngine, pOptions)) {
                emitError("cannot parse collada content", pOptions);
            }
        }

        io.fopen(pOptions.file).read(function(pErr: Error, sContent: string) {
            if (pErr) {
                emitError("could not read collada file: " + pOptions.file, pOptions);
            }

            if (!this.parse(sContent, pEngine, pOptions)) {
                emitError("cannot parse collada content", pOptions);
            }
        });
	}
}

#endif
