/**
 * Frame structure.
 * @ctor
 */
function Frame (sName) {
    /** @type String */
    this.sName = sName;
    /** @type Matrix */
    this.m4fTransformationMatrix = Mat4.identity(new Matrix4);
    /** @type MeshContainer */
    this.pMeshContainer = null;
    /** @type Frame */
    this.pFrameSibling = null;
    /** @type Frame */
    this.pFrameFirstChild = null;

    /** @type Number */
    this.iFrameIndex = 0;
    /** @type Number */
    this.iParentIndex = 0;
}

a.Frame = Frame;

a.computeFrameBoundingSphere = function (pFrame, pSphere) {
    pSphere.clear();
    var pMeshContainer = pFrame.pMeshContainer;
    if (pMeshContainer) {
        if (!a.computeMeshConatinerBoudingSphere(pMeshContainer, pSphere)) {
            return false;
        }
    }

    var pNextSphere = new a.Sphere();
    if (pFrame.pFrameSibling !== null) {
        if (!a.computeFrameBoundingSphere(pFrame.pFrameSibling, pNextSphere)) {
            return false;
        }
        a.computeGeneralizingSphere(pSphere, pNextSphere);
    }
    if (pFrame.pFrameFirstChild !== null) {
        pNextSphere.clear();
        if (!a.computeFrameBoundingSphere(pFrame.pFrameFirstChild, pNextSphere)) {
            return false;
        }
        a.computeGeneralizingSphere(pSphere, pNextSphere);
    }
    return true;
};



