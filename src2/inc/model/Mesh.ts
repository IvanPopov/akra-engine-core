#ifndef RENDERDATACOLLECTION_TS
#define RENDERDATACOLLECTION_TS

#include "IMesh.ts"
#include "IReferenceCounter.ts"
#include "ISkeleton.ts"
#include "IRec3d.ts"
#include "ISphere.ts"
#include "IEngine.ts"
#include "IMaterial.ts"
#include "IVertexData.ts"
#include "IMeshSubset.ts"
#include "ISkin.ts"

#include "Material.ts"

module akra.model {

	export class Mesh implements IMesh extends ReferenceCounter{
        private _sName: string;
        private _pFlexMaterials: IMaterial[] = null;
        private _pBuffer: IReferenceCounter = null;
        private _pEngine: IEngine;
        private _eOptions: int = 0;
        private _pSkeleton: ISekelton = null;
        private _pBoundingBox: IRec3d = null;
        private _pBoundingSphere: ISphere = null;

        constructor(pEngine: IEngine, eOptions: int, sName: string, pDataBuffer: IReferenceCounter){
            this._sName = sName || null;
            this._pEngine = pEngine;
            this.setup(sName, eOptions, pDataBuffer);
        }

        inline get flexMaterials(): IMaterial[] {
            return this._pFlexMaterials;
        }

        inline get name(): string{
            return this._sName;
        }

        inline get data(): IReferenceCounter{
            return this._pBuffer;
        }

        inline get buffer(): IReferenceCounter{
            return this._pBuffer;
        }

        inline get skeleton(): ISekelton{
            return this._pSkeleton;
        }

        inline set skeleton(pSkeleton: ISkeleton){
            this._pSkeleton = pSkeleton;
        }

        setSkeleton(pSkeleton: ISkeleton): void {
            this.skeleton = pSkeleton;
        }

        getOptions(): int {
            return this._eOptions;
        }

        getEngine(): IEngine {
            return this._pEngine;
        }

        drawSubset(iSubset: int): void {
            this._pBuffer.draw(iSubset);
        }

        draw(): void {
            for (var i: int = 0; i < this.length; i++) {
                this[i].draw();
            };
        }

        isReadyForRender(): bool {
            for (var i: int = 0; i < this.length; ++ i) {
                if (!this[i].isReadyForRender()) {
                    return false;
                }
            }
            
            return true;
        }

        setup(sName: string, eOptions: int, pDataBuffer: IReferenceCounter): bool {
            debug_assert(this._pBuffer === null, 'mesh already setuped.');

            if (!pDataBuffer) {
                this._pBuffer = new a.RenderDataBuffer(this._pEngine);
                this._pBuffer.setup(eOptions);
            }
            else {
                debug_assert (pDataBuffer.getEngine() === this.getEngine(), 
                    'you can not use a buffer with a different context');
                
                this._pBuffer = pDataBuffer;
                eOptions |= pDataBuffer.getOptions();
            }
            
            this._pBuffer.addRef();
            this._eOptions = eOptions || 0;
            this._sName = sName || 'unknown';

            return true;
        }

        createSubset(sName: , ePrimType: EPrimitiveTypes, eOptions: int) {
            var pSubset, pSubMesh;
            //TODO: modify options and create options for data dactory.
            pSubset = this._pBuffer.getEmptyRenderData(ePrimType, eOptions);
            pSubset.addRef();

            if (!pSubset) {
                return null;
            }

            pSubMesh = new MeshSubset(this, pSubset, sName);
            this.push(pSubMesh);
            return pSubMesh;
        }

        // replaceFlexMaterials(pFlexMaterials:): void {
        //     this._pFlexMaterials = pFlexMaterials;
        // }

        freeSubset(sName: string): bool {
            debug_error("Метод freeSubset не реализован");
            return false;
        }

        getFlexMaterial(iMaterial: uint): IMaterial;
        getFlexMaterial(sName: string): IMaterial;
        getFlexMaterial(arg) {
            if (!this._pFlexMaterials) {
                return null;
            }

            if (typeof arguments[0] === 'number') {
                return this._pFlexMaterials[arguments[0]] || null;
            }
            else {
                for (var i = 0, pMaterials = this._pFlexMaterials; i < pMaterials.length; ++ i) {
                    if (pMaterials[i].name === <string>arguments[0]) {
                        return pMaterials[i];
                    }
                }
            }

            return null;
        }

        addFlexMaterial(sName: string, pMaterialData: IMaterial): bool {
            var pMaterial: IFlexMaterial;
            var pMaterialId: int;

            debug_assert(arguments.length < 7, "only base material supported now...");
            //debug_assert(this.getFlexMaterial(sName) === null, 'material with name <' + sName + '> already exists');

            sName = sName || 'unknown';

            pMaterial = this.getFlexMaterial(sName);

            if (pMaterial) {
                if (pMaterialData) {
                   pMaterial.value = pMaterialData; 
                }
                return true;
            }

            if (!this._pFlexMaterials) {
                this._pFlexMaterials = [];
            }

            pMaterialId = this._pFlexMaterials.length;
            pMaterial = new material.FlexMaterial(
                sName, 
                this._pBuffer._allocateData(material.VERTEX_DECL, null)
            );

            if (!pMaterialData) {
                pMaterialData = new Material(material.DEFAULT)
            }

            pMaterial.value = pMaterialData;   
            pMaterial.id = pMaterialId;
            this._pFlexMaterials.push(pMaterial);
            return true;
        }

        setFlexMaterial(iMaterial: int): bool {
            var bResult: bool = true;
            for (var i: int = 0; i < this.length; ++ i) {
                if (!this[i].setFlexMaterial(iMaterial)) {
                    warning('cannot set material<' + iMaterial + '> for mesh<' + this.name + 
                        '> subset<' + this[i].name + '>');
                    bResult = false;
                }
            }

            return bResult;
        }

        destroy(): void {
            this._pFlexMaterials = null;
            this._pBuffer.destroy(this);
        }

        destructor(): void {
            this.destroy();
        }

        getSubset(): IMeshSubset {
            if (typeof arguments[0] === 'number') {
                return this[arguments[0]];
            }
            else {
                for (var i = 0; i < this.length; ++ i) {
                    if (this[i]._sName === arguments[0]) {
                        return this[i];
                    }
                }
            }
            return null;
        }

        setSkin(pSkin: ISkin): void {
            for (var i = 0; i < this.length; ++ i) {
                this[i].setSkin(pSkin);
            };
        }

        clone(eCloneOptions: EMeshCloneOptions) {
            var pClone: IMesh = null;
            var pRenderData: IReferenceCounter;
            var pSubMesh: IMeshSubset;

            if (eCloneOptions & a.Mesh.SHARED_GEOMETRY) {
                pClone = new Mesh(this.getEngine(), this.getOptions(), this.name, this.data);
                
                for (var i = 0; i < this.length; ++ i) {
                    pRenderData = this[i].data;
                    pRenderData.addRef();
                    pSubMesh = new MeshSubset(this, pRenderData, this[i].name);
                    pClone.push(pSubMesh);
                }

                pClone.replaceFlexMaterials(this.flexMaterials);

                //trace('created clone', pClone);
            }
            else {
                //TODO: clone mesh data.
            }

            if (eCloneOptions & EMeshCloneOptions.GEOMETRY_ONLY) {
                return pClone;
            }
            else {
                //TODO: clone mesh shading
            }

            return pClone;
        }

        createAndShowSubBoundingBox(): void {
            for(i=0;i<this.length;i++)
            {
                pSubMesh=this.getSubset(i);
                pSubMesh.createBoundingBox();
                pSubMesh.showBoundingBox();
                //console.log("SubMesh" + i);
            }
        }

        createAndShowSubBoundingSphere(): void {
            for(i=0;i<this.length;i++)
            {
                pSubMesh=this.getSubset(i);
                pSubMesh.createBoundingSphere();
                pSubMesh.showBoundingSphere();
                //console.log("SubMesh" + i);
            }
        }

        createBoundingBox(): bool {
            var pVertexData: IVertexData;
            var pSubMesh: IMeshSubset;
            var pNewBoundingBox: IRec3d;
            var pTempBoundingBox: IRec3d;
            var i: int;

            pNewBoundingBox = new geometry.Rect3d();
            pTempBoundingBox = new geometry.Rect3d();

            pSubMesh = this.getSubset(0);
            pVertexData = pSubMesh.data.getData(DeclUsages.POSITION);
            
            if(isNull(pVertexData)) {
                return false;

            }

            if(a.computeBoundingBox(pVertexData, pNewBoundingBox)== false)
                return false;

            if (pSubMesh.isSkinned()) {
                pNewBoundingBox.transform(pSubMesh.skin.getBindMatrix());    
                pNewBoundingBox.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName));    
            }

            for(i = 1; i < this.length; i++) {

                pSubMesh = this.getSubset(i);
                pVertexData = pSubMesh.data.getData(DeclUsages.POSITION);
                //trace(pSubMesh.name);
                
                if(!pVertexData) {
                    return false;
                }
                
                if(a.computeBoundingBox(pVertexData, pTempBoundingBox) == false) {
                    return false;
                }

                //trace('>>> before box >>');
                if (pSubMesh.isSkinned()) {
                    //trace('calc skinned box');
                    pTempBoundingBox.transform(pSubMesh.skin.getBindMatrix());     
                    pTempBoundingBox.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName)); 
                }
           // trace('<<< after box <<');

                pNewBoundingBox.x0 = Math.min(pNewBoundingBox.x0, pTempBoundingBox.x0);
                pNewBoundingBox.y0 = Math.min(pNewBoundingBox.y0, pTempBoundingBox.y0);
                pNewBoundingBox.z0 = Math.min(pNewBoundingBox.z0, pTempBoundingBox.z0);

                pNewBoundingBox.x1 = Math.max(pNewBoundingBox.x1, pTempBoundingBox.x1);
                pNewBoundingBox.y1 = Math.max(pNewBoundingBox.y1, pTempBoundingBox.y1);
                pNewBoundingBox.z1 = Math.max(pNewBoundingBox.z1, pTempBoundingBox.fZ1);
            }

            this._pBoundingBox = pNewBoundingBox;
            return true;
        }

        deleteBoundingBox(): bool {
            this._pBoundingBox = null;
            return true;
        }

        getBoundingBox(): IRec3d {
            if (!this._pBoundingBox) {
                this.createBoundingBox();
            }

            return this._pBoundingBox;
        }

        showBoundingBox(): bool {
            var pSubMesh: IMeshSubset;
            var pMaterial: IMaterial;
            var iData: int;
            var pPoints: Array, pIndexes: Array;

            if(isNull(this._pBoundingBox)) {
                return false;
            }

            pPoints = new Array();
            pIndexes = new Array();

            geometry.computeDataForCascadeBoundingBox(this._pBoundingBox,pPoints,pIndexes,0.1);

            pSubMesh = this.getSubset(".BoundingBox");
            
            if(!pSubMesh) {
                pSubMesh = this.createSubset(".BoundingBox", EPrimitiveTypes.LINELIST, EHardwareBufferFlags.STATIC);
                
                if(isNull(pSubMesh)) {
                    return false;
                }

                iData = pSubMesh.data.allocateData([VE_FLOAT3(DeclUsages.POSITION)], new Float32Array(pPoints));

                pSubMesh.data.allocateIndex([VE_FLOAT(DeclUsages.INDEX0)], new Float32Array(pIndexes));

                pSubMesh.data.index(iData, DeclUsages.INDEX0);

                // pSubMesh.applyFlexMaterial(".MaterialBoundingBox");
                pMaterial = pSubMesh.material;/*getFlexMaterial(".MaterialBoundingBox");*/
                pMaterial.emissive = new Color(1.0, 1.0, 1.0, 1.0);
                pMaterial.diffuse = new Color(1.0, 1.0, 1.0, 1.0);
                pMaterial.ambient = new Color(1.0, 1.0, 1.0, 1.0);
                pMaterial.specular = new Color(1.0, 1.0, 1.0, 1.0);

                pSubMesh.effect.create();
                pSubMesh.effect.use("akra.system.mesh_texture");
                pSubMesh.effect.use("akra.system.prepareForDeferredShading");
            }
            else {
                pSubMesh.data.getData(DeclUsages.POSITION).setData(new Float32Array(pPoints), DeclUsages.POSITION);
            }

            pSubMesh.data.setRenderable();
            return true;
        }

        hideBoundingBox(): bool {
            var pSubMesh: IMeshSubset;
            pSubMesh = this.getSubset(".BoundingBox");
            
            if(!pSubMesh) {
                return false;
            }

            return pSubMeshs.data.setRenderable(this.data.getIndexSet(), false);
        }

        createBoundingSphere(): bool {
            var pVertexData: IVertexData;
            var pSubMesh: IMeshSubset;
            var pNewBoundingSphere: ISphere, pTempBoundingSphere: ISphere;
            var i;

            pNewBoundingSphere = new geometry.Sphere();
            pTempBoundingSphere = new geometry.Sphere();


            pSubMesh = this.getSubset(0);
            pVertexData = pSubMesh.data.getData(DeclUsages.POSITION);
            
            if(!pVertexData) {
                return false;
            }


            if(geometry.computeBoundingSphere(pVertexData,pNewBoundingSphere) == false) {
                return false;
            }

            if (pSubMesh.isSkinned()) {
                pNewBoundingSphere.transform(pSubMesh.skin.getBindMatrix());    
                pNewBoundingSphere.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName));    
            }

            for(i = 1; i < this.length; i++) {

                pSubMesh = this.getSubset(i);
                pVertexData = pSubMesh.data.getData(DeclUsages.POSITION);
                
                if(isNull(pVertexData))
                    return false;

                if(geometry.computeBoundingSphere(pVertexData, pTempBoundingSphere)== false)
                    return false;


                if (pSubMesh.isSkinned()) {
                    pTempBoundingSphere.transform(pSubMesh.skin.getBindMatrix());    
                    pTempBoundingSphere.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName));    
                    // trace(pTempBoundingSphere.fRadius, '<<<');
                }


                geometry.computeGeneralizingSphere(pNewBoundingSphere, pTempBoundingSphere)
            }
            // trace(pNewBoundingSphere, '<<<<<<<<<<<<<<<<<<<<<<<<<')
            this._pBoundingSphere = pNewBoundingSphere;
            
            return true;
        }

        deleteBoundingSphere(): bool {
            this._pBoundingSphere = null;
            return true;
        }

        getBoundingSphere(): ISphere {
            return this._pBoundingSphere;
        }

        showBoundingSphere(): bool {
            var pSubMesh : IMeshSubset, pMaterial: IMaterial;
            var iData: int;
            var pPoints: Array, pIndexes: Array;

            if(!this._pBoundingSphere) {
                return false;
            }

            pPoints = new Array();
            pIndexes = new Array();

            geometry.computeDataForCascadeBoundingSphere(this._pBoundingSphere,pPoints,pIndexes);

            pSubMesh = this.getSubset(".BoundingSphere");
            
            if(!pSubMesh) {
                pSubMesh = this.createSubset(".BoundingSphere", EPrimitiveTypes.LINELIST, EHardwareBufferFlags.STATIC);
                
                if(isNull(pSubMesh))
                    return false;

                iData=pSubMesh.data.allocateData(
                    [VE_FLOAT3(DeclUsages.POSITION)],
                    new Float32Array(pPoints));

                pSubMesh.data.allocateIndex([VE_FLOAT(DeclUsage.INDEX0)], new Float32Array(pIndexes));
                pSubMesh.data.index(iData, DeclUsages.INDEX0);

                // pSubMesh.applyFlexMaterial(".MaterialBoundingSphere");
                pMaterial = pSubMesh.material;//pSubMesh.getFlexMaterial(".MaterialBoundingSphere");
                pMaterial.emissive = new Color(1.0, 0.0, 0.0, 1.0);
                pMaterial.diffuse  = new Color(1.0, 0.0, 0.0, 1.0);
                pMaterial.ambient  = new Color(1.0, 0.0, 0.0, 1.0);
                pMaterial.specular = new Color(1.0, 0.0, 0.0, 1.0);
            }
            else {
                pSubMesh.data.getData(DeclUsages.POSITION).setData(new Float32Array(pPoints),DeclUsages.POSITION);
            }

            pSubMesh.data.setRenderable();
            return true;
        }

        hideBoundingSphere(): bool {
            var pSubMesh: IMeshSubset;
            
            pSubMesh = this.getSubset(".BoundingSphere");
            
            if(!pSubMesh) {
                return false;
            }

            return pSubMeshs.data.setRenderable(this.data.getIndexSet(),false);
        }

	}
}

#endif