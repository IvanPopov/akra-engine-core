
import Material = require("material/Material");
import FlexMaterial = require("material/FlexMaterial");

import VertexDeclaration = require("data/VertexDeclaration");
import Usage = require("data/Usage");
import VE = require("data/VertexElement");

/** @const */
export var VERTEX_DECL: AIVertexDeclaration = VertexDeclaration.normalize(
    [
        VE.custom(Usage.MATERIAL, AEDataTypes.FLOAT, 17),
        VE.custom(Usage.DIFFUSE, AEDataTypes.FLOAT, 4, 0),
        VE.custom(Usage.AMBIENT, AEDataTypes.FLOAT, 4, 16),
        VE.custom(Usage.SPECULAR, AEDataTypes.FLOAT, 4, 32),
        VE.custom(Usage.EMISSIVE, AEDataTypes.FLOAT, 4, 48),
        VE.custom(Usage.SHININESS, AEDataTypes.FLOAT, 1, 64)
    ]);


function create(sName: string = null, pMat: AIMaterial = null): AIMaterial {
    return new Material(sName, pMat);
}

/** @deprecated Flex material will be removed from core with closest release.*/
function _createFlex(sName: string, pData: AIVertexData): AIMaterial {
    return new FlexMaterial(sName, pData);
}
