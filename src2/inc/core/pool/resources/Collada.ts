#ifndef COLLADA_TS
#define COLLADA_TS

#include "ICollada.ts"


#include "IMesh.ts"
#include "IRenderDataCollection.ts"

#include "animation/AnimationTrack.ts"
#include "animation/Animation.ts"

#include "../ResourcePoolItem.ts"

#include "math/math.ts"
#include "io/files.ts"
#include "util/util.ts"

module akra.core.pool.resources {

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

  

    export class Collada extends ResourcePoolItem implements ICollada {

        constructor ();

        attachToScene(pNode: ISceneNode): bool;

        // parse(sXMLData: string, pOptions?: IColladaLoadOptions): bool;
        // load(sFilename: string, fnCallback?: IColladaLoadCallback, pOptions?: IColladaLoadOptions): void;

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
        
        private buildAssetTransform(pNode: ISceneNode, pAsset?: IColladaAsset): ISceneNode;

        // materials & meshes
        
        private buildMaterials(pMesh: IMesh, pMeshNode: IColladaNode): IMesh;
        private buildSkeleton(pSkeletonsList: string[]): ISkeleton;
        private buildMesh(pGeometryInstance: IColladaInstanceGeometry): IMesh;
        private buildSkinMesh(pControllerInstance: IColladaInstanceController): IMesh;

        private buildMeshInstance(pGeometries: IColladaInstanceGeometry[], pSceneNode?: ISceneNode): IMesh[];
        private buildSkinMeshInstance(pControllers: IColladaInstanceController[], pSceneNode?: ISceneNode): IMesh[];
        private buildMeshes(): IMesh[];

        // scene
        
        private buildSceneNode(pNode: IColladaNode, pParentNode: ISceneNode): ISceneNode;
        private buildJointNode(pNode: IColladaNode, pParentNode: ISceneNode): IJoint;
        private buildNodes(pNodes: IColladaNode[], pParentNode?: ISceneNode): ISceneNode;
        private buildScene(pRootNode: ISceneNode): ISceneNode[];

        private buildInititalPose(pNodes: IColladaNode[], pSkeleton: ISkeleton): IAnimation;
        private buildInitialPoses(pPoseSkeletons?: ISkeleton[]): IAnimation[];

        // additional

        private buildComplete(): void;

        //---------------------------

        private setOptions(pUserOptions: IColladaLoadOptions): void;
        private setXMLRoot(pXML: Node): void;
        private getXMLRoot(): Node;

        private isJointsVisualizationNeeded(): bool;
        private isVisualSceneLoaded(): bool;
        private isSceneNeeded(): bool;
        private isAnimationNeeded(): bool;
        private isPoseExtractionNeeded(): bool;
        private getSkeletonsOutput(): ISkeleton[];
        private getVisualScene(): IColladaVisualScene;
        private getAsset(): IColladaAsset;

        private isLibraryLoaded(sLib: string): bool;
        private isLibraryExists(sLib: string): bool;
        private getLibrary(sLib: string): IColladaLibrary;

        private checkLibraries(pXML: Node, pTemplates: IColladaLibraryTemplate[]): void;
        private readLibraries(pXML: Node, pTemplates: IColladaLibraryTemplate[]): void;


        static DEFAULT_OPTIONS: IColladaLoadOptions = {
            drawJoints      : false,
            wireframe       : false,
            sharedBuffer    : false,
            animation       : { pose: true },
            scene           : true,
            extractPoses    : true,
            skeletons       : null
        };

        private static SCENE_TEMPLATE: IColladaLibraryTemplate[] = [
            {lib : 'library_images',        element : 'image',          loader : "COLLADAImage"         },
            {lib : 'library_effects',       element : 'effect',         loader : "COLLADAEffect"        },
            {lib : 'library_materials',     element : 'material',       loader : "COLLADAMaterial"      },
            {lib : 'library_geometries',    element : 'geometry',       loader : "COLLADAGeometrie"     },
            {lib : 'library_controllers',   element : 'controller',     loader : "COLLADAController"    },
            {lib : 'library_visual_scenes', element : 'visual_scene',   loader : "COLLADAVisualScene"   }
        ];

        private static ANIMATION_TEMPLATE: IColladaLibraryTemplate[] = [
            {lib : 'library_animations',    element : 'animation',      loader : "COLLADAAnimation"     }
        ];

        //=======================================================================================
        
        private _pModel: IModel = null;
        private _pOptions: IColladaLoadOptions = null;

        private _pLinks: IColladaLinkMap = {};
        private _pLib: IColladaLibraryMap = {};
        private _pCache: IColladaCache = { meshMap: {}, sharedBuffer: null };

        private _pAsset: IColladaAsset = null;
        private _pVisualScene: IColladaVisualScene = null;

        private _sBasename: string = "unknown";

        private _pXMLRoot: Node = null;


    
        constructor () {
            super();

        }


         // common
        
        private buildAssetTransform(pNode: ISceneNode, pAsset: IColladaAsset = null): ISceneNode {
            pAsset = pAsset || this.getAsset();

            if (isDefAndNotNull(pAsset)) {
                var fUnit: float = pAsset.unit.meter;
                var sUPaxis: string = pAsset.upAxis;

                pNode.localScale = vec3(fUnit);

                if (sUPaxis.toUpperCase() == "Z_UP") {
                    //pNode.addRelRotation([1, 0, 0], -.5 * Math.PI);
                    pNode.addRelRotationByEulerAngles(0, -.5 * math.PI, 0);
                }
            }

            return pNode;   
        }

        // materials & meshes
        
        // private buildMaterials(pMesh: IMesh, pMeshNode: IColladaNode): IMesh;
        // private buildSkeleton(pSkeletonsList: string[]): ISkeleton;
        // private buildMesh(pGeometryInstance: IColladaInstanceGeometry): IMesh {

        // }

        private buildSkinMesh(pControllerInstance: IColladaInstanceController): IMesh {
            var pController: IColladaController = pControllerInstance.controller;
            var pMaterials: IColladaBindMaterial = pControllerInstance.material;

            var pSkinData: IColladaSkin = pController.skin;

            //skin data
            var pBoneList: string[] = <string[]>pSkinData.joints.inputs["JOINT"].array;
            var pBoneOffsetMatrices: IMat4[] = <IMat4[]>pSkinData.joints.inputs["INV_BIND_MATRIX"].array;
            
            var m4fBindMatrix: IMat4 = pSkinData.shapeMatrix;
            var pVertexWeights: IColladaVertexWeights = pSkinData.vertexWeights;

            var pGeometry: IColladaGeometrie = pSkinData.geometry;

            var pMesh: IMesh;
            var pSkeleton: ISkeleton;
            var pSkin: ISkin;

            pSkeleton = this.buildSkeleton(pControllerInstance.skeletons);
            pMesh = this.buildMesh({geometry : pGeometry, material : pMaterials});

            pSkin = pMesh.createSkin();
            pSkin.setBindMatrix(m4fBindMatrix);
            pSkin.setBoneNames(pBoneList);
            pSkin.setBoneOffsetMatrices(pBoneOffsetMatrices);
            pSkin.setSkeleton(pSkeleton);

            if (!pSkin.setVertexWeights(
                <uint[]>pVertexWeights.vcount,
                new Float32Array(pVertexWeights.v),
                new Float32Array(pVertexWeights.weightInput.array))) {
                ERROR("cannot set vertex weight info to skin");
            }

            pMesh.setSkeleton(pSkeleton);
            pSkeleton.attachMesh(pMesh);

            return pMesh;            
        }


        private buildSkinMeshInstance(pControllers: IColladaInstanceController[], pSceneNode: ISceneModel = null): IMesh[] {
            var pMesh: IMesh = null;
            var pMeshList: IMesh[] = [];

            for (var m: int = 0; m < pControllers.length; ++m) {
                pMesh = this.buildSkinMesh(pControllers[m]);
                pMeshList.push(pMesh);

                debug_assert(isDefAndNotNull(pMesh), "cannot find instance <" + pControllers[m].url + ">\"s data");

                if (!isNull(pSceneNode)) {
                    pSceneNode.mesh = pMesh;
                }
            }

            return pMeshList;
        }

         private buildMeshInstance(pGeometries: IColladaInstanceGeometry[], pSceneNode: ISceneModel = null): IMesh[] {
            var pMesh: IMesh = null;
            var pMeshList: IMesh[] = [];

            for (var m: int = 0; m < pGeometries.length; ++m) {
                pMesh = this.buildMesh(pGeometries[m]);
                pMeshList.push(pMesh);

                debug_assert(isDefAndNotNull(pMesh), "cannot find instance <" + pGeometries[m].url + ">\"s data");

                if (!isNull(pSceneNode)) {
                    pSceneNode.mesh = pMesh;
                }
            }

            return pMeshList;
        }

        private buildMeshes(): IMesh[] {
            var pScene: IColladaVisualScene = this.getVisualScene();
            var pMeshes: IMesh[] = [];

            findNode(pScene.nodes, null, function (pNode: IColladaNode) {
                var pModelNode: ISceneNode = pNode.constructedNode;
                
                if (isNull(pModelNode)) {
                    debug_error("you must call buildScene() before call buildMeshes() or file corrupt");
                    return;
                }

                if (pNode.controller.length == 0 && pNode.geometry.length == 0) {
                    return;
                }

                if (scene.isModel(pModelNode)) {
                    pModelNode = pModelNode.scene.createModel(".joint-to-model-link-" + sid());
                    pModelNode.attachToParent(pNode.constructedNode);
                }

                pMeshes.insert(<IMesh[]>this.buildSkinMeshInstance(pNode.controller));
                pMeshes.insert(<IMesh[]>this.buildMeshInstance(pNode.geometry, pModelNode));
            });

            return pMeshes;
        }
        
        // scene

        private buildSceneNode(pNode: IColladaNode, pParentNode: ISceneNode): ISceneNode {
            var pSceneNode: ISceneNode = pNode.constructedNode;
            var pScene: IScene3d = pParentNode.scene;

            if (isDefAndNotNull(pSceneNode)) {
                return pSceneNode;
            }
            
            //FIXME: предпологаем, что мы никогда не аттачим контроллеры к узлам,
            // где они найдены, а аттачим  их к руту скелета, на который они ссылаются
            if (pNode.geometry.length > 0) {   /*pNode.pController.length ||*/
                pSceneNode = pScene.createModel();
            }
            else {
                pSceneNode = pScene.createNode();
            }

            pSceneNode.attachToParent(pParentNode);
        

            return pSceneNode;
        }
        
        private buildJointNode(pNode: IColladaNode, pParentNode: ISceneNode): IJoint {
            var pJointNode: IJoint = <IJoint>pNode.constructedNode;
            var sJointSid: string = pNode.sid;
            var sJointName: string = pNode.id;
            var pSkeleton: ISkeleton;

            debug_assert(isDefAndNotNull(pParentNode), "parent node is null");

            if (isDefAndNotNull(pJointNode)) {
                return pJointNode;
            }

            if (isNull(pParentNode)) {
                return null;
            }

            pJointNode = pParentNode.scene.createJoint();
            pJointNode.boneName = sJointSid;
            pJointNode.attachToParent(pParentNode);

#ifdef DEBUG
            if (this.isJointsVisualizationNeeded()) {
                //draw joints
                // var pSceneNode: ISceneModel = pEngine.appendMesh(
                //     pEngine.pCubeMesh.clone(a.Mesh.GEOMETRY_ONLY | a.Mesh.SHARED_GEOMETRY),
                //     pJointNode);
                // pSceneNode.name = sJointName + '[joint]';
                // pSceneNode.setScale(0.02);
                CRITICAL("TODO: visualize joints...");
            }
#endif

            return pJointNode;
        }
        
        private buildNodes(pNodes: IColladaNode[], pParentNode: ISceneNode = null): ISceneNode {
            if (isNull(pNodes)) {
                return null;
            }

            var pNode: IColladaNode = null;
            var pHierarchyNode: ISceneNode = null;
            var m4fLocalMatrix: IMat4 = null;

            for (var i: int = pNodes.length - 1; i >= 0; i--) {
                pNode = pNodes[i];

                if (!isDefAndNotNull(pNode)) {
                    continue;
                }

                if (pNode.type === "JOINT") {
                    pHierarchyNode = this.buildJointNode(pNode, pParentNode);
                }
                else {
                    pHierarchyNode = this.buildSceneNode(pNode, pParentNode);
                }

                pHierarchyNode.name = (pNode.id || pNode.name);
                pHierarchyNode.setInheritance(ENodeInheritance.ALL);

                //cache already constructed nodes
                pNode.constructedNode = pHierarchyNode;
                pHierarchyNode.localMatrix = pNode.transform;

                this.buildNodes(pNode.childNodes, pHierarchyNode);
            }

            return pHierarchyNode;
        }

        private buildScene(pRootNode: ISceneNode): ISceneNode[] {
            var pScene: IColladaVisualScene = this.getVisualScene();
            var pAsset: IColladaAsset = this.getAsset();

            var pNodes: ISceneNode[] = [];
            var pNode: IColladaNode = null;

            for (var i: int = 0; i < pScene.nodes.length; i++) {
                pNode = pScene.nodes[i];
                pNodes.push(this.buildNodes([pNode], pRootNode));
            }

            for (var i: int = 0; i < pNodes.length; i++) {
                pNodes[i] = this.buildAssetTransform(pNodes[i]);
            }

            return pNodes;
        }

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
                pTrack.targetName = sNodeId;
                pTrack.keyFrame(0.0, pNode.transform);

                pPose.push(pTrack);
            });

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
                //     trace('skipping <node-Bip001_Pelvis> skeleto, ...', '[' + sBasename + ']');

                //     trace(pSkeleton.getNodeList()[0].localMatrix().toQuat4().toYawPitchRoll(Vec3()).toString());

                //     continue;
                // }
                pPoses.push(this.buildInititalPose(pScene.nodes, pSkeleton));
            }

            return pPoses;
        }

        // additional
        

        private buildComplete(): void {
            var pScene: IColladaVisualScene = this.getVisualScene();
            
            //release all links to constructed nodes
            findNode(pScene.nodes, null, function (pNode: IColladaNode) {
                pNode.constructedNode = null;
            });
        }

        private setOptions(pOptions: IColladaLoadOptions): void {
            if (isNull(pOptions)) {
                pOptions = Collada.DEFAULT_OPTIONS;
            }

            for (var i in Collada.DEFAULT_OPTIONS) {
                if (isDef(pOptions[i])) {
                    continue;
                }

                pOptions[i] = Collada.DEFAULT_OPTIONS[i];
            }

            this._pOptions = pOptions;
        }

        private setXMLRoot(pXML: Node): void {
            this._pXMLRoot = pXML;
        }

        private getXMLRoot(): Node {
            return this._pXMLRoot;
        }

        private inline isJointsVisualizationNeeded(): bool {
            return this._pOptions.drawJoints === true;
        }

        private inline isVisualSceneLoaded(): bool {
            return isDefAndNotNull(this._pVisualScene);
        }

        private inline isSceneNeeded(): bool {
            return this._pOptions.scene === true;
        }

         private inline isAnimationNeeded(): bool {
            return isDefAndNotNull(this._pOptions.animation);
        }

        private inline isPoseExtractionNeeded(): bool {
            return this._pOptions.extractPoses === true;
        }

        private inline getSkeletonsOutput(): ISkeleton[] {
            return this._pOptions.skeletons || null;
        }

        private inline getVisualScene(): IColladaVisualScene {
            return this._pVisualScene;
        }

        private inline getAsset(): IColladaAsset {
            return this._pAsset;
        }        

        private inline isLibraryLoaded(sLib: string): bool {
            return isDefAndNotNull(this._pLib[sLib]);
        }

        private inline isLibraryExists(sLib: string): bool {
            return false;
        }

        private inline getLibrary(sLib: string): IColladaLibrary {
            return this._pLib[sLib] || null;
        }

        private readLibraries(pXML: Node, pTemplates: IColladaLibraryTemplate[]): void {
            var pLibraries: IColladaLibraryMap = this._pLib;
            
            for (var i: int = 0; i < pTemplates.length; i++) {
                var sLib: string = pTemplates[i].lib;

                pLibraries[sLib] = this.COLLADALibrary(firstChild(pXML, sLib), pTemplates[i]);
            }
        } 

        private checkLibraries(pXML: Node, pTemplates: IColladaLibraryTemplate[]): void {
            var pLibraries: IColladaLibraryMap = this._pLib;

            for (var i: int = 0; i < pTemplates.length; i++) {
                var sLib: string = pTemplates[i].lib;

                if (isDefAndNotNull(firstChild(pXML, sLib))) {
                    pLibraries[sLib] = null;
                }
            }
        }

        private parse(sXMLData: string, pOptions: IColladaLoadOptions = null): bool {
            if (isNull(sXMLData)) {
                debug_error("must be specified collada content.");
                return false;
            }

            var pParser: DOMParser = new DOMParser();
            var pXMLDocument: Document = pParser.parseFromString(sXMLData, "application/xml");
            var pXMLRoot: Node = pXMLDocument.getElementsByTagName("COLLADA")[0];

            this.setOptions(pOptions);
            this.setXMLRoot(pXMLRoot);

            this.checkLibraries(pXMLRoot, Collada.SCENE_TEMPLATE);
            this.checkLibraries(pXMLRoot, Collada.ANIMATION_TEMPLATE);

            this.readLibraries(pXMLRoot, Collada.SCENE_TEMPLATE);

            this.COLLADAAsset(firstChild(pXMLRoot, "asset"));
            this.COLLADAScene(firstChild(pXMLRoot, "scene"));

            if (this.isAnimationNeeded()) {
                this.readLibraries(pXMLRoot, Collada.ANIMATION_TEMPLATE);
            }

            return true;
        }

        loadResource(sFilename: string = null, pOptions: IColladaLoadOptions = null): bool {
            if (isNull(sFilename)) {
                sFilename = this.findResourceName();
            }

            if (this.isResourceLoaded()) {
                WARNING("collada model already loaded");
                return false;
            }

            var pModel: IModel = this;

            pModel.notifyDisabled();

            io.fopen(sFilename).read(function (pErr: Error, sXML: string) {
                if (!isNull(pErr)) {
                    ERROR(pErr);
                }

                pModel.notifyRestored();
                
                if (this.parse(sXML, pOptions)) {
                    pModel.notifyLoaded();
                }
            });
        }

        attachToScene(pNode: ISceneNode): bool {
            var pSkeletons: ISkeleton[], 
                pSkeleton: ISkeleton;
            var pPoses: IAnimation[];
            var pRoot: ISceneNode;

            var pSceneOutput: ISceneNode[] = null;
            var pAnimationOutput: IAnimation[] = null;
            var pMeshOutput: IMesh[] = null;
            var pInitialPosesOutput: IAnimation[] = null;
            var pController: IAnimationController = null;


            if (isNull(pNode)) {
                return false;
            }

            if (this.isVisualSceneLoaded() && this.isSceneNeeded()) {
                pSceneOutput = this.buildScene(pNode);
                pMeshOutput = this.buildMeshes();
            }

            if (this.isPoseExtractionNeeded()) {
                pInitialPosesOutput = this.buildInitialPoses();
            }

            if (this.isAnimationNeeded() && this.isLibraryExists("library_animations")) {

                pAnimationOutput = 
                        this.buildAnimations((<IColladaAnimation>this.getLibrary("library_animations")).animations);

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

            this.buildComplete();

            pRoot = pNode.scene.createNode();
            pRoot.setInheritance(ENodeInheritance.ALL);

            if (!pRoot.attachToParent(pNode)) {
                return false;
            }

            if (!isNull(pController)) {
                //TODO: bind controller
            }

            return true;
        }
    }

   



}

#endif
