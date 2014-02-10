/// <reference path="IMaterial.ts" />
/// <reference path="ITexture.ts" />
var akra;
(function (akra) {
    (function (ESurfaceMaterialTextures) {
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE0"] = 0] = "TEXTURE0";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE1"] = 1] = "TEXTURE1";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE2"] = 2] = "TEXTURE2";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE3"] = 3] = "TEXTURE3";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE4"] = 4] = "TEXTURE4";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE5"] = 5] = "TEXTURE5";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE6"] = 6] = "TEXTURE6";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE7"] = 7] = "TEXTURE7";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE8"] = 8] = "TEXTURE8";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE9"] = 9] = "TEXTURE9";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE10"] = 10] = "TEXTURE10";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE11"] = 11] = "TEXTURE11";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE12"] = 12] = "TEXTURE12";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE13"] = 13] = "TEXTURE13";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE14"] = 14] = "TEXTURE14";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["TEXTURE15"] = 15] = "TEXTURE15";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["DIFFUSE"] = ESurfaceMaterialTextures.TEXTURE0] = "DIFFUSE";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["AMBIENT"] = ESurfaceMaterialTextures.TEXTURE1] = "AMBIENT";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["SPECULAR"] = ESurfaceMaterialTextures.TEXTURE2] = "SPECULAR";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["EMISSIVE"] = ESurfaceMaterialTextures.TEXTURE3] = "EMISSIVE";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["NORMAL"] = ESurfaceMaterialTextures.TEXTURE4] = "NORMAL";
        ESurfaceMaterialTextures[ESurfaceMaterialTextures["EMISSION"] = ESurfaceMaterialTextures.EMISSIVE] = "EMISSION";
    })(akra.ESurfaceMaterialTextures || (akra.ESurfaceMaterialTextures = {}));
    var ESurfaceMaterialTextures = akra.ESurfaceMaterialTextures;
    ;
})(akra || (akra = {}));
//# sourceMappingURL=ISurfaceMaterial.js.map
