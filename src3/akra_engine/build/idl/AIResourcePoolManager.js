// AIResourcePoolManager interface
// [write description here...]
/// <reference path="AIManager.ts" />
/// <reference path="AIEngine.ts" />
/// <reference path="AIResourceCode.ts" />
/// <reference path="AIResourcePool.ts" />
/// <reference path="AIResourceWatcherFunc.ts" />
/// <reference path="AIResourcePoolItem.ts" />
/// <reference path="AIRenderMethod.ts" />
/// <reference path="AITexture.ts" />
/// <reference path="AIVertexBuffer.ts" />
/// <reference path="AIModel.ts" />
/// <reference path="AISurfaceMaterial.ts" />
/// <reference path="AIEffect.ts" />
/// <reference path="AIShaderProgram.ts" />
/// <reference path="AIModel.ts" />
/** Семейства ресурсов */
var AEResourceFamilies;
(function (AEResourceFamilies) {
    AEResourceFamilies[AEResourceFamilies["VIDEO_RESOURCE"] = 0] = "VIDEO_RESOURCE";
    AEResourceFamilies[AEResourceFamilies["AUDIO_RESOURCE"] = 1] = "AUDIO_RESOURCE";
    AEResourceFamilies[AEResourceFamilies["GAME_RESOURCE"] = 2] = "GAME_RESOURCE";
    AEResourceFamilies[AEResourceFamilies["TOTAL_RESOURCE_FAMILIES"] = 3] = "TOTAL_RESOURCE_FAMILIES";
})(AEResourceFamilies || (AEResourceFamilies = {}));
;

/** Члены семейства видео ресурсов */
var AEVideoResources;
(function (AEVideoResources) {
    AEVideoResources[AEVideoResources["TEXTURE_RESOURCE"] = 0] = "TEXTURE_RESOURCE";
    AEVideoResources[AEVideoResources["VIDEOBUFFER_RESOURCE"] = 1] = "VIDEOBUFFER_RESOURCE";
    AEVideoResources[AEVideoResources["VERTEXBUFFER_RESOURCE"] = 2] = "VERTEXBUFFER_RESOURCE";
    AEVideoResources[AEVideoResources["INDEXBUFFER_RESOURCE"] = 3] = "INDEXBUFFER_RESOURCE";
    AEVideoResources[AEVideoResources["EFFECT_RESOURCE"] = 4] = "EFFECT_RESOURCE";
    AEVideoResources[AEVideoResources["RENDERMETHOD_RESOURCE"] = 5] = "RENDERMETHOD_RESOURCE";
    AEVideoResources[AEVideoResources["MODEL_RESOURCE"] = 6] = "MODEL_RESOURCE";
    AEVideoResources[AEVideoResources["EFFECTFILEDATA_RESOURCE"] = 7] = "EFFECTFILEDATA_RESOURCE";
    AEVideoResources[AEVideoResources["IMAGE_RESOURCE"] = 8] = "IMAGE_RESOURCE";
    AEVideoResources[AEVideoResources["SURFACEMATERIAL_RESOURCE"] = 9] = "SURFACEMATERIAL_RESOURCE";
    AEVideoResources[AEVideoResources["SHADERPROGRAM_RESOURCE"] = 10] = "SHADERPROGRAM_RESOURCE";
    AEVideoResources[AEVideoResources["COMPONENT_RESOURCE"] = 11] = "COMPONENT_RESOURCE";
    AEVideoResources[AEVideoResources["EFFECTDATA_RESOURCE"] = 12] = "EFFECTDATA_RESOURCE";
    AEVideoResources[AEVideoResources["TOTAL_VIDEO_RESOURCES"] = 13] = "TOTAL_VIDEO_RESOURCES";
})(AEVideoResources || (AEVideoResources = {}));
;

var AEAudioResources;
(function (AEAudioResources) {
    AEAudioResources[AEAudioResources["TOTAL_AUDIO_RESOURCES"] = 0] = "TOTAL_AUDIO_RESOURCES";
})(AEAudioResources || (AEAudioResources = {}));
;

var AEGameResources;
(function (AEGameResources) {
    AEGameResources[AEGameResources["TOTAL_GAME_RESOURCES"] = 0] = "TOTAL_GAME_RESOURCES";
})(AEGameResources || (AEGameResources = {}));
;
//# sourceMappingURL=AIResourcePoolManager.js.map
