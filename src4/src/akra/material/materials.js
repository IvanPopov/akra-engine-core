var akra;
(function (akra) {
    /// <reference path="Material.ts" />
    /// <reference path="FlexMaterial.ts" />
    /// <reference path="../data/VertexDeclaration.ts" />
    /// <reference path="../data/Usage.ts" />
    (function (material) {
        var VE = data.VertexElement;
        var VertexDeclaration = data.VertexDeclaration;
        var Usage = data.Usages;

        /** @const */
        material.VERTEX_DECL = VertexDeclaration.normalize([
            VE.custom(Usage.MATERIAL, akra.EDataTypes.FLOAT, 17),
            VE.custom(Usage.DIFFUSE, akra.EDataTypes.FLOAT, 4, 0),
            VE.custom(Usage.AMBIENT, akra.EDataTypes.FLOAT, 4, 16),
            VE.custom(Usage.SPECULAR, akra.EDataTypes.FLOAT, 4, 32),
            VE.custom(Usage.EMISSIVE, akra.EDataTypes.FLOAT, 4, 48),
            VE.custom(Usage.SHININESS, akra.EDataTypes.FLOAT, 1, 64)
        ]);

        function create(sName, pMat) {
            if (typeof sName === "undefined") { sName = null; }
            if (typeof pMat === "undefined") { pMat = null; }
            return new material.Material(sName, pMat);
        }
        material.create = create;

        /** @deprecated Flex material will be removed from core with closest release.*/
        function _createFlex(sName, pData) {
            return new material.FlexMaterial(sName, pData);
        }
        material._createFlex = _createFlex;
    })(akra.material || (akra.material = {}));
    var material = akra.material;
})(akra || (akra = {}));
