/// <reference path="Material" />
define(["require", "exports", "material/Material", "material/FlexMaterial", "data/VertexDeclaration", "data/Usage", "data/VertexElement"], function(require, exports, __Material__, __FlexMaterial__, __VertexDeclaration__, __Usage__, __VE__) {
    var Material = __Material__;
    var FlexMaterial = __FlexMaterial__;

    var VertexDeclaration = __VertexDeclaration__;
    var Usage = __Usage__;
    var VE = __VE__;

    /** @const */
    exports.VERTEX_DECL = VertexDeclaration.normalize([
        VE.custom(Usage.MATERIAL, AEDataTypes.FLOAT, 17),
        VE.custom(Usage.DIFFUSE, AEDataTypes.FLOAT, 4, 0),
        VE.custom(Usage.AMBIENT, AEDataTypes.FLOAT, 4, 16),
        VE.custom(Usage.SPECULAR, AEDataTypes.FLOAT, 4, 32),
        VE.custom(Usage.EMISSIVE, AEDataTypes.FLOAT, 4, 48),
        VE.custom(Usage.SHININESS, AEDataTypes.FLOAT, 1, 64)
    ]);

    function create(sName, pMat) {
        if (typeof sName === "undefined") { sName = null; }
        if (typeof pMat === "undefined") { pMat = null; }
        return new Material(sName, pMat);
    }

    /** @deprecated Flex material will be removed from core with closest release.*/
    function _createFlex(sName, pData) {
        return new FlexMaterial(sName, pData);
    }
});
