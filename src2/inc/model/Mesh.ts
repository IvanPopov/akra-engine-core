#ifndef MESH_TS
#define MESH_TS

#include "IMesh.ts"
#include "IReferenceCounter.ts"
#include "ISkeleton.ts"
#include "IRect3d.ts"
#include "ISphere.ts"
#include "IEngine.ts"
#include "IMaterial.ts"
#include "IVertexData.ts"
#include "IMeshSubset.ts"
#include "ISkin.ts"
#include "IRenderDataCollection.ts"
#include "ISceneNode.ts"
#include "ISceneModel.ts"

#include "Skin.ts"

#include "MeshSubset.ts"
#include "material/Material.ts"
#include "util/ReferenceCounter.ts"
#include "events/events.ts"

module akra.model {

	class Mesh implements IMesh extends util.ReferenceCounter {
        private _sName: string;
        private _pFlexMaterials: IMaterial[] = null;
        private _pBuffer: IRenderDataCollection = null;
        private _pEngine: IEngine;
        private _eOptions: int = 0;
        private _pSkeleton: ISkeleton = null;
        private _pBoundingBox: IRect3d = null;
        private _pBoundingSphere: ISphere = null;
        private _pSubMeshes: IMeshSubset[] = [];
        private _bShadow: bool = true;
        
        inline get length(): uint {
            return this._pSubMeshes.length;
        }

        inline get flexMaterials(): IMaterial[] {
            return this._pFlexMaterials;
        }

        inline get name(): string{
            return this._sName;
        }

        inline get data(): IRenderDataCollection {
            return this._pBuffer;
        }

        inline get skeleton(): ISkeleton {
            return this._pSkeleton;
        }

        inline set skeleton(pSkeleton: ISkeleton){
            this._pSkeleton = pSkeleton;
        }

        inline get boundingBox(): IRect3d {
            if (isNull(this._pBoundingBox)) {
                if (!this.createBoundingBox()) {
                    WARNING("could not compute bounding box fo mesh");
                }
            }

            return this._pBoundingBox;
        }

        inline get boundingSphere(): ISphere {
            if (isNull(this._pBoundingSphere)) {
                if (!this.createBoundingSphere()) {
                    WARNING("could not compute bounding sphere for mesh");
                }
            }

            return this._pBoundingSphere;
        }

        constructor(pEngine: IEngine, eOptions: int, sName: string, pDataBuffer: IRenderDataCollection) {
            super();

            this._sName = sName || null;
            this._pEngine = pEngine;
            this.setup(sName, eOptions, pDataBuffer);
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

        _drawSubset(iSubset: int): void {
            this._pBuffer._draw(iSubset);
        }

        _draw(): void {
            for (var i: int = 0; i < this.length; i++) {
                this._pSubMeshes[i]._draw();
            };
        }

        isReadyForRender(): bool {
            for (var i: int = 0; i < this._pSubMeshes.length; ++ i) {
                if (!this._pSubMeshes[i].isReadyForRender()) {
                    return false;
                }
            }
            
            return true;
        }

        private setup(sName: string, eOptions: int, pDataCollection?: IRenderDataCollection): bool {
            debug_assert(this._pBuffer === null, "mesh already setuped.");

            if (isNull(pDataCollection)) {
                this._pBuffer = this._pEngine.createRenderDataCollection(eOptions);
            }
            else {
                debug_assert (pDataCollection.getEngine() === this.getEngine(), 
                    "you can not use a buffer with a different context");
                
                this._pBuffer = pDataCollection;
                eOptions |= pDataCollection.getOptions();
            }
            
            this._pBuffer.addRef();
            this._eOptions = eOptions || 0;
            this._sName = sName || UNKNOWN_NAME;

            return true;
        }

        createSubset(sName: string, ePrimType: EPrimitiveTypes, eOptions: int = 0): IMeshSubset {
            var pData: IRenderData;
            //TODO: modify options and create options for data dactory.
            pData = this._pBuffer.getEmptyRenderData(ePrimType/*EPrimitiveTypes.POINTLIST*/, eOptions);
            pData.addRef();

            if (isNull(pData)) {
                return null;
            }
            
            return this.appendSubset(sName, pData);
        }

        appendSubset(sName: string, pData: IRenderData): IMeshSubset {
            debug_assert(pData.buffer === this._pBuffer, "invalid data used");

            var pSubMesh: IMeshSubset = new MeshSubset(this, pData, sName);
            this._pSubMeshes.push(pSubMesh);


            this.connect(pSubMesh, SIGNAL(shadow), SLOT(shadow), EEventTypes.UNICAST);

            return pSubMesh;
        }

        replaceFlexMaterials(pFlexMaterials: IMaterial[]): void {
            this._pFlexMaterials = pFlexMaterials;
        }

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

        addFlexMaterial(sName: string = 'unknown', pMaterialData: IMaterial = null): bool {
            var pMaterial: IMaterial;
            var pMaterialId: int;

            debug_assert(arguments.length < 7, "only base material supported now...");
            //debug_assert(this.getFlexMaterial(sName) === null, 'material with name <' + sName + '> already exists');

            pMaterial = this.getFlexMaterial(sName);

            if (pMaterial) {
                if (pMaterialData) {
                   pMaterial.set(pMaterialData); 
                }
                return true;
            }

            if (!this._pFlexMaterials) {
                this._pFlexMaterials = [];
            }

            pMaterialId = this._pFlexMaterials.length;
            pMaterial = material._createFlex(
                sName, 
                this._pBuffer._allocateData(material.VERTEX_DECL, null)
            );

            if (!pMaterialData) {
                pMaterialData = material.create(null, material.DEFAULT)
            }

            pMaterial.set(pMaterialData);   
            //pMaterial.id = pMaterialId;
            this._pFlexMaterials.push(pMaterial);

            return true;
        }

        setFlexMaterial(iMaterial: int): bool;
        setFlexMaterial(csName: string): bool;
        setFlexMaterial(iMaterial): bool {
            var bResult: bool = true;
            for (var i: int = 0; i < this.length; ++ i) {
                if (!this._pSubMeshes[i].setFlexMaterial(<int>iMaterial)) {
                    WARNING("cannot set material<" + iMaterial + "> for mesh<" + this.name + 
                        "> subset<" + this._pSubMeshes[i].name + ">");
                    bResult = false;
                }
            }

            return bResult;
        }

        destroy(): void {
            this._pFlexMaterials = null;
            this._pSubMeshes = null;
            this._pBuffer.destroy(/*this*/);
        }

        getSubset(sName: string): IMeshSubset;
        getSubset(n: uint): IMeshSubset;
        getSubset(n: any): IMeshSubset {
            if (isInt(arguments[0])) {
                return this._pSubMeshes[arguments[0]] || null;
            }
            else {
                for (var i = 0; i < this.length; ++ i) {
                    if (this._pSubMeshes[i].name == <string>arguments[0]) {
                        return this._pSubMeshes[i];
                    }
                }
            }

            return null;
        }

        setSkin(pSkin: ISkin): void {
            for (var i = 0; i < this.length; ++ i) {
                this._pSubMeshes[i].setSkin(pSkin);
            }
        }

        createSkin(): ISkin {
            var pSkin: ISkin = createSkin(this);
            return pSkin;
        }

        clone(iCloneOptions: int): IMesh {
            var pClone: IMesh = null;
            var pRenderData: IRenderData;
            var pSubMesh: IMeshSubset;

            if (iCloneOptions & EMeshCloneOptions.SHARED_GEOMETRY) {
                pClone = this.getEngine().createMesh(this.name, this.getOptions(), this.data);
                
                for (var i = 0; i < this.length; ++ i) {
                    pRenderData = this._pSubMeshes[i].data;
                    pRenderData.addRef();
                    pClone.appendSubset(this._pSubMeshes[i].name, pRenderData);
                }

                pClone.replaceFlexMaterials(this.flexMaterials);

                //trace('created clone', pClone);
            }
            else {
                //TODO: clone mesh data.
            }

            if (iCloneOptions & EMeshCloneOptions.GEOMETRY_ONLY) {
                return pClone;
            }
            else {
                //TODO: clone mesh shading
            }

            return pClone;
        }

        createAndShowSubBoundingBox(): void {
            for(var i = 0; i < this.length; i++) {
                var pSubMesh: IMeshSubset = this.getSubset(i);
                if (pSubMesh.createBoundingBox()) {
                    if (!pSubMesh.showBoundingBox()) {
                        ERROR("could not show sub bounding box");
                    }
                }
                else {
                    ERROR("could not create sub bounding box.");
                }
                //console.log("SubMesh" + i);
            }
        }

        createAndShowSubBoundingSphere(): void {
            for(var i = 0; i < this.length; i ++) {
                var pSubMesh: IMeshSubset = this.getSubset(i);
                pSubMesh.createBoundingSphere();
                pSubMesh.showBoundingSphere();
                //console.log("SubMesh" + i);
            }
        }

        createBoundingBox(): bool {
            var pVertexData: IVertexData;
            var pSubMesh: IMeshSubset;
            var pNewBoundingBox: IRect3d;
            var pTempBoundingBox: IRect3d;
            var i: int;

            pNewBoundingBox = new geometry.Rect3d();
            pTempBoundingBox = new geometry.Rect3d();

            pSubMesh = this.getSubset(0);
            pVertexData = pSubMesh.data._getData(DeclUsages.POSITION);
            
            if(isNull(pVertexData)) {
                return false;
            }

            if(geometry.computeBoundingBox(pVertexData, pNewBoundingBox)== false)
                return false;

            if (pSubMesh.isSkinned()) {
                pNewBoundingBox.transform(pSubMesh.skin.getBindMatrix());    
                pNewBoundingBox.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName));    
            }

            for(i = 1; i < this.length; i++) {

                pSubMesh = this.getSubset(i);
                pVertexData = pSubMesh.data._getData(DeclUsages.POSITION);
                //trace(pSubMesh.name);
                
                if(!pVertexData) {
                    return false;
                }
                
                if(geometry.computeBoundingBox(pVertexData, pTempBoundingBox) == false) {
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
                pNewBoundingBox.z1 = Math.max(pNewBoundingBox.z1, pTempBoundingBox.z1);
            }

            this._pBoundingBox = pNewBoundingBox;
            return true;
        }

        deleteBoundingBox(): bool {
            this._pBoundingBox = null;
            return true;
        }

        showBoundingBox(): bool {
            var pSubMesh: IMeshSubset;
            var pMaterial: IMaterial;
            var iData: int;
            var pPoints: float[], pIndexes: uint[];

            if(isNull(this._pBoundingBox)) {
                if (!this.createBoundingBox()) {
                    return false;
                }
            }

            pPoints = new Array();
            pIndexes = new Array();

            geometry.computeDataForCascadeBoundingBox(this._pBoundingBox, pPoints, pIndexes, 0.1);

            pSubMesh = this.getSubset(".BoundingBox");
            
            if(!pSubMesh) {
                pSubMesh = this.createSubset(".BoundingBox", EPrimitiveTypes.LINELIST, EHardwareBufferFlags.STATIC);
                
                if(isNull(pSubMesh)) {
                    debug_error("could not create bounding box subset...");
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

                pSubMesh.effect.addComponent("akra.system.mesh_texture");
                pSubMesh.hasShadow = false;
            }
            else {
                pSubMesh.data._getData(DeclUsages.POSITION).setData(new Float32Array(pPoints), DeclUsages.POSITION);
            }

            pSubMesh.data.setRenderable(pSubMesh.data.getIndexSet(), true);
            return true;
        }

        hideBoundingBox(): bool {
            var pSubMesh: IMeshSubset = this.getSubset(".BoundingBox");
            
            if(!pSubMesh) {
                return false;
            }

            //TODO: hide bounding box!!
            pSubMesh.data.setRenderable(pSubMesh.data.getIndexSet(), false);
            return true;
        }

        isBoundingBoxVisible(): bool {
            var pSubMesh: IMeshSubset = this.getSubset(".BoundingBox");
            
            if(!pSubMesh) {
                return false;
            }

            return pSubMesh.data.isRenderable(pSubMesh.data.getIndexSet());
        }

        createBoundingSphere(): bool {
            var pVertexData: IVertexData;
            var pSubMesh: IMeshSubset;
            var pNewBoundingSphere: ISphere, 
                pTempBoundingSphere: ISphere;
            var i: int;

            pNewBoundingSphere = new geometry.Sphere();
            pTempBoundingSphere = new geometry.Sphere();


            pSubMesh = this.getSubset(0);
            pVertexData = pSubMesh.data._getData(DeclUsages.POSITION);
            
            if(!pVertexData) {
                return false;
            }


            if(geometry.computeBoundingSphere(pVertexData, pNewBoundingSphere) == false) {
                return false;
            }

            if (pSubMesh.isSkinned()) {
                pNewBoundingSphere.transform(pSubMesh.skin.getBindMatrix());    
                pNewBoundingSphere.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName));    
            }

            for(i = 1; i < this.length; i++) {

                pSubMesh = this.getSubset(i);
                pVertexData = pSubMesh.data._getData(DeclUsages.POSITION);
                
                if(isNull(pVertexData))
                    return false;

                if(geometry.computeBoundingSphere(pVertexData, pTempBoundingSphere) == false)
                    return false;


                if (pSubMesh.isSkinned()) {
                    pTempBoundingSphere.transform(pSubMesh.skin.getBindMatrix());    
                    pTempBoundingSphere.transform(pSubMesh.skin.getBoneOffsetMatrix(pSubMesh.skin.skeleton.root.boneName));    
                    // trace(pTempBoundingSphere.fRadius, '<<<');
                }


                geometry.computeGeneralizingSphere(pNewBoundingSphere, pTempBoundingSphere)
            }

            this._pBoundingSphere = pNewBoundingSphere;
            
            return true;
        }

        deleteBoundingSphere(): bool {
            this._pBoundingSphere = null;
            return true;
        }

        showBoundingSphere(): bool {
            var pSubMesh : IMeshSubset, pMaterial: IMaterial;
            var iData: int;
            var pPoints: float[], pIndexes: uint[];

            if(!this._pBoundingSphere) {
                if (!this.createBoundingSphere()) {
                    return false;
                }
            }

            pPoints = new Array();
            pIndexes = new Array();

            geometry.computeDataForCascadeBoundingSphere(this._pBoundingSphere, pPoints, pIndexes);

            pSubMesh = this.getSubset(".BoundingSphere");
            
            if(!pSubMesh) {
                pSubMesh = this.createSubset(".BoundingSphere", EPrimitiveTypes.LINELIST, EHardwareBufferFlags.STATIC);
                
                if(isNull(pSubMesh))
                    return false;

                iData=pSubMesh.data.allocateData(
                    [VE_FLOAT3(DeclUsages.POSITION)],
                    new Float32Array(pPoints));

                pSubMesh.data.allocateIndex([VE_FLOAT(DeclUsages.INDEX0)], new Float32Array(pIndexes));
                pSubMesh.data.index(iData, DeclUsages.INDEX0);

                // pSubMesh.applyFlexMaterial(".MaterialBoundingSphere");
                // //pSubMesh.getFlexMaterial(".MaterialBoundingSphere");
                pMaterial = pSubMesh.material;
                pMaterial.emissive = new Color(1.0, 1.0, 1.0, 1.0);
                pMaterial.diffuse  = new Color(1.0, 1.0, 1.0, 1.0);
                pMaterial.ambient  = new Color(1.0, 1.0, 1.0, 1.0);
                pMaterial.specular = new Color(1.0, 1.0, 1.0, 1.0);

                pSubMesh.effect.addComponent("akra.system.mesh_texture");
                pSubMesh.hasShadow = false;
            }
            else {
                pSubMesh.data._getData(DeclUsages.POSITION).setData(new Float32Array(pPoints), DeclUsages.POSITION);
            }

            pSubMesh.data.setRenderable(pSubMesh.data.getIndexSet(), true);

            return true;
        }

        hideBoundingSphere(): bool {
            var pSubMesh: IMeshSubset;
            
            pSubMesh = this.getSubset(".BoundingSphere");
            
            if(!pSubMesh) {
                return false;
            }

            pSubMesh.data.setRenderable(pSubMesh.data.getIndexSet(), false);
            return true;
        }

        isBoundingSphereVisible(): bool {
            var pSubMesh: IMeshSubset = this.getSubset(".BoundingSphere");
            
            if(!pSubMesh) {
                return false;
            }

            return pSubMesh.data.isRenderable(pSubMesh.data.getIndexSet());
        }

        inline get hasShadow(): bool {
            return this._bShadow;
        }

        set hasShadow(bValue: bool) {
            for (var i: int = 0; i < this._pSubMeshes.length; ++ i) {
                this._pSubMeshes[i].hasShadow = bValue;
            }            
        }

        toSceneModel(pParent: ISceneNode, sName: string = null): ISceneModel {
            if (isNull(pParent)) {
                return null;
            }

            var pSceneModel: ISceneModel = pParent.scene.createModel(sName);
            
            if (!pSceneModel.create()) {
                return null;
            }

            pSceneModel.mesh = this;
            pSceneModel.attachToParent(pParent);

            return pSceneModel;
        }

        update(): bool {
            var isOk: bool = false;

            for (var i: uint = 0; i < this.length; ++ i) {
                isOk = this._pSubMeshes[i].update() ? true : isOk;
            }
            if(isOk){
                for (var i: uint = 0; i < this.length; ++ i) {
                	if(this._pSubMeshes[i].isSkinned){
                    	this._pSubMeshes[i]._calculateSkin();
                	}
                }
            }

            return isOk;
        }

        CREATE_EVENT_TABLE(Mesh);
        signal shadow(pSubMesh: IMeshSubset, bShadow: bool): void {

            this._bShadow = bShadow;

            if (!bShadow) {
                for (var i: int = 0; i < this._pSubMeshes.length; ++ i) {
                    if (this._pSubMeshes[i].hasShadow) {
                        this._bShadow = true;
                        break;
                    }
                }
            }

            EMIT_BROADCAST(shadow, _CALL(pSubMesh, bShadow));
        }

	}

    export function createMesh(pEngine: IEngine, sName: string = null, eOptions: int = 0, pDataBuffer: IRenderDataCollection = null): IMesh {
        return new Mesh(pEngine, eOptions, sName, pDataBuffer);
    }
}

#endif