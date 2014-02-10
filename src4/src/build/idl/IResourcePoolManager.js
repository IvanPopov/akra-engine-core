/// <reference path="IManager.ts" />
/// <reference path="IEngine.ts" />
/// <reference path="IResourceCode.ts" />
/// <reference path="IResourcePool.ts" />
/// <reference path="IResourceWatcherFunc.ts" />
/// <reference path="IResourcePoolItem.ts" />
/// <reference path="IRenderMethod.ts" />
/// <reference path="ITexture.ts" />
/// <reference path="IVertexBuffer.ts" />
/// <reference path="IModel.ts" />
/// <reference path="ISurfaceMaterial.ts" />
/// <reference path="IEffect.ts" />
/// <reference path="IShaderProgram.ts" />
/// <reference path="IModel.ts" />
/// <reference path="IObj.ts" />
/** Семейства ресурсов */
var akra;
(function (akra) {
    (function (EResourceFamilies) {
        EResourceFamilies[EResourceFamilies["VIDEO_RESOURCE"] = 0] = "VIDEO_RESOURCE";
        EResourceFamilies[EResourceFamilies["AUDIO_RESOURCE"] = 1] = "AUDIO_RESOURCE";
        EResourceFamilies[EResourceFamilies["GAME_RESOURCE"] = 2] = "GAME_RESOURCE";
        EResourceFamilies[EResourceFamilies["TOTAL_RESOURCE_FAMILIES"] = 3] = "TOTAL_RESOURCE_FAMILIES";
    })(akra.EResourceFamilies || (akra.EResourceFamilies = {}));
    var EResourceFamilies = akra.EResourceFamilies;
    ;

    /** Члены семейства видео ресурсов */
    (function (EVideoResources) {
        EVideoResources[EVideoResources["TEXTURE_RESOURCE"] = 0] = "TEXTURE_RESOURCE";
        EVideoResources[EVideoResources["VIDEOBUFFER_RESOURCE"] = 1] = "VIDEOBUFFER_RESOURCE";
        EVideoResources[EVideoResources["VERTEXBUFFER_RESOURCE"] = 2] = "VERTEXBUFFER_RESOURCE";
        EVideoResources[EVideoResources["INDEXBUFFER_RESOURCE"] = 3] = "INDEXBUFFER_RESOURCE";
        EVideoResources[EVideoResources["EFFECT_RESOURCE"] = 4] = "EFFECT_RESOURCE";
        EVideoResources[EVideoResources["RENDERMETHOD_RESOURCE"] = 5] = "RENDERMETHOD_RESOURCE";
        EVideoResources[EVideoResources["MODEL_RESOURCE"] = 6] = "MODEL_RESOURCE";
        EVideoResources[EVideoResources["EFFECTFILEDATA_RESOURCE"] = 7] = "EFFECTFILEDATA_RESOURCE";
        EVideoResources[EVideoResources["IMAGE_RESOURCE"] = 8] = "IMAGE_RESOURCE";
        EVideoResources[EVideoResources["SURFACEMATERIAL_RESOURCE"] = 9] = "SURFACEMATERIAL_RESOURCE";
        EVideoResources[EVideoResources["SHADERPROGRAM_RESOURCE"] = 10] = "SHADERPROGRAM_RESOURCE";
        EVideoResources[EVideoResources["COMPONENT_RESOURCE"] = 11] = "COMPONENT_RESOURCE";
        EVideoResources[EVideoResources["EFFECTDATA_RESOURCE"] = 12] = "EFFECTDATA_RESOURCE";
        EVideoResources[EVideoResources["TOTAL_VIDEO_RESOURCES"] = 13] = "TOTAL_VIDEO_RESOURCES";
    })(akra.EVideoResources || (akra.EVideoResources = {}));
    var EVideoResources = akra.EVideoResources;
    ;

    (function (EAudioResources) {
        EAudioResources[EAudioResources["TOTAL_AUDIO_RESOURCES"] = 0] = "TOTAL_AUDIO_RESOURCES";
    })(akra.EAudioResources || (akra.EAudioResources = {}));
    var EAudioResources = akra.EAudioResources;
    ;

    (function (EGameResources) {
        EGameResources[EGameResources["TOTAL_GAME_RESOURCES"] = 0] = "TOTAL_GAME_RESOURCES";
    })(akra.EGameResources || (akra.EGameResources = {}));
    var EGameResources = akra.EGameResources;
    ;

    
})(akra || (akra = {}));
//# sourceMappingURL=IResourcePoolManager.js.map
