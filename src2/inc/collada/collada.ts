#ifndef COLLADA_TS
#define COLLADA_TS

#include "ICollada.ts"

module akra.collada {

	function COLLADAImage(pXML: Node): IColladaImage;
	function COLLADAEffect(pXML: Node): IColladaEffect;
	function COLLADAMaterial(pXML: Node): IColladaMaterial;
	function COLLADAGeometrie(pXML: Node): IColladaGeometrie;
	function COLLADAController(pXML: Node): IColladaController;
	function COLLADAVisualScene(pXML: Node): IColladaVisualScene;


	 /* COMMON FUNCTIONS
     ------------------------------------------------------
     */


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

    var pSupportedJointFormat: IColladaUnknownFormat = [
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

    var pSceneTemplate: IColladaLibraryTemplate = [
        {lib : 'library_images', 		element : 'image', 			loader : COLLADAImage},
        {lib : 'library_effects', 		element : 'effect', 		loader : COLLADAEffect},
        {lib : 'library_materials', 	element : 'material', 		loader : COLLADAMaterial},
        {lib : 'library_geometries', 	element : 'geometry', 		loader : COLLADAGeometrie},
        {lib : 'library_controllers', 	element : 'controller', 	loader : COLLADAController},
        {lib : 'library_visual_scenes', element : 'visual_scene', 	loader : COLLADAVisualScene}
    ];

    var pAnimationTemplate = [
        {lib : 'library_animations', element : 'animation', loader : COLLADAAnimation}
    ];

    

	export function load(pEngine: IEngine, pOptions?: IColladaLoadOptions): bool {

		var pLinks: IColladaLinkMap = {};
    	var pLib: IColladaLibraryMap = {};
    	var pCache: IColladaCache = {
    		mesh: { [name: string]: IMesh; };
    		sharedBuffer: IRenderDataCollection
    	}

		return false;
	}
}

#endif
