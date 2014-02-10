/// <reference path="Material.ts" />
/// <reference path="../data/VertexDeclaration.ts" />
/// <reference path="../data/Usage.ts" />
var akra;
(function (akra) {
    (function (material) {
        var VE = akra.data.VertexElement;
        var VertexDeclaration = akra.data.VertexDeclaration;
        var Usage = akra.data.Usages;

        /** @const */
        material.VERTEX_DECL = VertexDeclaration.normalize([
            VE.custom(Usage.MATERIAL, 5126 /* FLOAT */, 17),
            VE.custom(Usage.DIFFUSE, 5126 /* FLOAT */, 4, 0),
            VE.custom(Usage.AMBIENT, 5126 /* FLOAT */, 4, 16),
            VE.custom(Usage.SPECULAR, 5126 /* FLOAT */, 4, 32),
            VE.custom(Usage.EMISSIVE, 5126 /* FLOAT */, 4, 48),
            VE.custom(Usage.SHININESS, 5126 /* FLOAT */, 1, 64)
        ]);

        function create(sName, pMat) {
            if (typeof sName === "undefined") { sName = null; }
            if (typeof pMat === "undefined") { pMat = null; }
            return new akra.material.Material(sName, pMat);
        }
        material.create = create;
    })(akra.material || (akra.material = {}));
    var material = akra.material;
})(akra || (akra = {}));
//# sourceMappingURL=materials.js.map
