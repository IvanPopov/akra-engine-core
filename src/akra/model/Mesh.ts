/// <reference path="../idl/IMesh.ts" />
/// <reference path="../idl/IReferenceCounter.ts" />
/// <reference path="../idl/ISkeleton.ts" />
/// <reference path="../idl/IRect3d.ts" />
/// <reference path="../idl/ISphere.ts" />
/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IMaterial.ts" />
/// <reference path="../idl/IVertexData.ts" />
/// <reference path="../idl/IMeshSubset.ts" />
/// <reference path="../idl/ISkin.ts" />
/// <reference path="../idl/IRenderDataCollection.ts" />
/// <reference path="../idl/ISceneNode.ts" />
/// <reference path="../idl/ISceneModel.ts" />

/// <reference path="Skin.ts" />
/// <reference path="MeshSubset.ts" />

/// <reference path="../material/materials.ts" />
/// <reference path="../util/ReferenceCounter.ts" />
/// <reference path="../events.ts" />

/// <reference path="../guid.ts" />

module akra.model {
	import VE = data.VertexElement;
	import DeclUsages = data.Usages;
	import Color = color.Color;

	class ShadowedSignal extends Signal<IMesh> {

		constructor(pViewport: IMesh) {
			super(pViewport, EEventTypes.UNICAST);
		}

		emit(pSubMesh: IMeshSubset, bShadow: boolean): void {

			var pMesh: Mesh = <Mesh>this.getSender();

			pMesh._setShadow(bShadow)
			//debug.log("Mesh(" + pMesh.getName() + ")::ShadowSignal()", ", shadow = " + bShadow);
			if (!bShadow) {
				for (var i: int = 0; i < pMesh.getLength(); ++i) {
					if (pMesh.getSubset(i).getShadow()) {
						pMesh._setShadow(true);
						break;
					}
				}
			}

			super.emit(pSubMesh, bShadow);
		}
	}

	class Mesh extends util.ReferenceCounter implements IMesh {
		guid: uint = guid();

		shadowed: ISignal<{ (pMesh: IMesh, pSubset: IMeshSubset, bShadow: boolean): void; }>;

		private _sName: string;
		private _pBuffer: IRenderDataCollection = null;
		private _pEngine: IEngine;
		private _eOptions: int = 0;

		private _pBoundingBox: IRect3d = new geometry.Rect3d();
		private _pBoundingSphere: ISphere = new geometry.Sphere();

		private _pSubMeshes: IMeshSubset[] = [];
		private _bShadow: boolean = true;

		private _bBoundgingBoxChanged: boolean = false;
		private _bBoundingSphereChanged: boolean = false;
		private _bGeometryChanged: boolean = false;
		

		constructor(pEngine: IEngine, eOptions: int, sName: string, pDataBuffer: IRenderDataCollection) {
			super();
			this.setupSignals();

			this._sName = sName || null;
			this._pEngine = pEngine;
			this.setup(sName, eOptions, pDataBuffer);
		}

		protected setupSignals(): void {
			this.shadowed = this.shadowed || new ShadowedSignal(this);
		}

		final isGeometryChanged(): boolean {
			return this._bGeometryChanged;
		}

		final getLength(): uint {
			return this._pSubMeshes.length;
		}

		final getName(): string {
			return this._sName;
		}

		final getData(): IRenderDataCollection {
			return this._pBuffer;
		}

		getBoundingBox(): IRect3d {
			if (this._bBoundgingBoxChanged) {
				logger.assert(this.calculateBoundingBox(), "could not compute bounding box for mesh");
			}

			return this._pBoundingBox;
		}

		getBoundingSphere(): ISphere {
			if (this._bBoundingSphereChanged) {
				logger.assert(this.calculateBoundingSphere(), "could not compute bounding sphere for mesh");
			}

			return this._pBoundingSphere;
		}

		getShadow(): boolean {
			return this._bShadow;
		}

		setShadow(bValue: boolean): void {
			for (var i: int = 0; i < this._pSubMeshes.length; ++i) {
				this._pSubMeshes[i].setShadow(bValue);
			}
		}

		final getOptions(): int {
			return this._eOptions;
		}

		final getEngine(): IEngine {
			return this._pEngine;
		}


		final isReadyForRender(): boolean {
			for (var i: int = 0; i < this._pSubMeshes.length; ++i) {
				if (this._pSubMeshes[i].isReadyForRender()) {
					return true;
				}
			}

			return false;
		}

		private setup(sName: string, eOptions: int, pDataCollection?: IRenderDataCollection): boolean {
			debug.assert(this._pBuffer === null, "mesh already setuped.");

			if (isNull(pDataCollection)) {
				this._pBuffer = this._pEngine.createRenderDataCollection(eOptions);
			}
			else {
				debug.assert(pDataCollection.getEngine() === this.getEngine(),
					"you can not use a buffer with a different context");

				this._pBuffer = pDataCollection;
				eOptions |= pDataCollection.getOptions();
			}

			this._pBuffer.addRef();
			this._eOptions = eOptions || 0;
			this._sName = sName || config.unknown.name;

			return true;
		}

		createSubset(sName: string, ePrimType: EPrimitiveTypes, eOptions: int = 0): IMeshSubset {
			var pData: IRenderData;
			//TODO: modify options and create options for data factory.
			pData = this._pBuffer.getEmptyRenderData(ePrimType/*EPrimitiveTypes.POINTLIST*/, eOptions);
			pData.addRef();

			if (isNull(pData)) {
				return null;
			}

			return this.appendSubset(sName, pData);
		}

		appendSubset(sName: string, pData: IRenderData): IMeshSubset {
			debug.assert(pData.getBuffer() === this._pBuffer, "invalid data used");

			var pSubMesh: IMeshSubset = new MeshSubset(this, pData, sName);
			this._pSubMeshes.push(pSubMesh);

			pSubMesh.shadowed.connect(this.shadowed);
			pSubMesh.transformed.connect(this, this._notifyGeometryChanged);

			this._notifyGeometryChanged();

			return pSubMesh;
		}

		// mark, that mesh geometry changed
		_notifyGeometryChanged(): void {
			this._bBoundgingBoxChanged = true;
			this._bBoundingSphereChanged = true;
			this._bGeometryChanged = true;
		}


		freeSubset(sName: string): boolean {
			debug.error("Метод freeSubset не реализован");
			return false;
		}

		destroy(): void {
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
				for (var i = 0; i < this.getLength(); ++i) {
					if (this._pSubMeshes[i].getName() == <string>arguments[0]) {
						return this._pSubMeshes[i];
					}
				}
			}

			return null;
		}

		setSkin(pSkin: ISkin): void {
			for (var i = 0; i < this.getLength(); ++i) {
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
				pClone = this.getEngine().createMesh(this.getName(), this.getOptions(), this.getData());

				for (var i = 0; i < this.getLength(); ++i) {
					pRenderData = this._pSubMeshes[i].getData();
					pRenderData.addRef();
					pClone.appendSubset(this._pSubMeshes[i].getName(), pRenderData);
					pClone.getSubset(i).getMaterial().name = this._pSubMeshes[i].getMaterial().name;
				}
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

		isSkinned(): boolean {
			for (var i = 0; i < this._pSubMeshes.length; ++i) {
				if (this._pSubMeshes[i].isSkinned()) {
					return true;
				}
			}

			return false;
		}

		_createAndShowSubBoundingBox(): void {
			/*
			for (var i = 0; i < this.getLength(); i++) {
				var pSubMesh: model.MeshSubset = <model.MeshSubset>this.getSubset(i);
				if (pSubMesh.createBoundingBox()) {
					if (!pSubMesh._showBoundingBox()) {
						debug.error("could not show sub bounding box");
					}
				}
				else {
					debug.error("could not create sub bounding box.");
				}
			}
			*/
		}

		_createAndShowSubBoundingSphere(): void {
			/*
			for (var i = 0; i < this.getLength(); i++) {
				var pSubMesh: model.MeshSubset = <model.MeshSubset>this.getSubset(i);
				pSubMesh.createBoundingSphere();
				pSubMesh._showBoundingSphere();
			}
			*/
		}


		calculateBoundingBox(): boolean {
			var pSubsets: IMeshSubset[] = this._pSubMeshes;
			var pBB: IRect3d = this._pBoundingBox.set(pSubsets[0].getBoundingBox());

			for (var i = 1; i < pSubsets.length; ++i) {
				var pSubset: IMeshSubset = pSubsets[i];
				var pLocalBB: IRect3d = pSubset.getBoundingBox();

				pBB.x0 = math.min(pBB.x0, pLocalBB.x0);
				pBB.x1 = math.max(pBB.x1, pLocalBB.x1);

				pBB.y0 = math.min(pBB.y0, pLocalBB.y0);
				pBB.y1 = math.max(pBB.y1, pLocalBB.y1);

				pBB.z0 = math.min(pBB.z0, pLocalBB.z0);
				pBB.z1 = math.max(pBB.z1, pLocalBB.z1);
			}

			//debug.log("Mesh(" + this.getName() + ")::calculateBoundingBox()");

			this._bBoundgingBoxChanged = false;

			return true;
		}

		_showBoundingBox(): boolean {
			if (config.DEBUG) return false;
			/*
			var pSubMesh: IMeshSubset;
			var pMaterial: IMaterial;
			var iData: int;
			var pPoints: float[], pIndexes: uint[];

			if (isNull(this._pBoundingBox)) {
				if (!this.createBoundingBox()) {
					return false;
				}
			}

			pPoints = new Array();
			pIndexes = new Array();

			geometry.computeDataForCascadeBoundingBox(this._pBoundingBox, pPoints, pIndexes, 0.1);

			pSubMesh = this.getSubset(".BoundingBox");

			if (!pSubMesh) {
				pSubMesh = this.createSubset(".BoundingBox", EPrimitiveTypes.LINELIST, EHardwareBufferFlags.STATIC);

				if (isNull(pSubMesh)) {
					debug.error("could not create bounding box subset...");
					return false;
				}

				iData = pSubMesh.getData().allocateData([VE.float3(DeclUsages.POSITION)], new Float32Array(pPoints));

				pSubMesh.getData().allocateIndex([VE.float(DeclUsages.INDEX0)], new Float32Array(pIndexes));

				pSubMesh.getData().index(iData, DeclUsages.INDEX0);

				pMaterial = pSubMesh.getMaterial();
				pMaterial.emissive = new Color(1.0, 1.0, 1.0, 1.0);
				pMaterial.diffuse = new Color(1.0, 1.0, 1.0, 1.0);
				pMaterial.ambient = new Color(1.0, 1.0, 1.0, 1.0);
				pMaterial.specular = new Color(1.0, 1.0, 1.0, 1.0);

				pSubMesh.getEffect().addComponent("akra.system.mesh_texture");
				pSubMesh.setShadow(false);
			}
			else {
				pSubMesh.getData()._getData(DeclUsages.POSITION).setData(new Float32Array(pPoints), DeclUsages.POSITION);
			}

			pSubMesh.getData().setRenderable(pSubMesh.getData().getIndexSet(), true);
			return true;
			*/

			return false;
		}
		_hideBoundingBox(): boolean {
			if (config.DEBUG) return false;
			/*
			var pSubMesh: IMeshSubset = this.getSubset(".BoundingBox");

			if (!pSubMesh) {
				return false;
			}

			//TODO: hide bounding box!!
			pSubMesh.getData().setRenderable(pSubMesh.getData().getIndexSet(), false);
			return true;
			*/

			return false;
		}
		_isBoundingBoxVisible(): boolean {
			if (config.DEBUG) return false;

			/*
			var pSubMesh: IMeshSubset = this.getSubset(".BoundingBox");

			if (!pSubMesh) {
				return false;
			}

			return pSubMesh.getData().isRenderable(pSubMesh.getData().getIndexSet());
			*/

			return false;
		}

		calculateBoundingSphere(): boolean {

			var pSubsets: IMeshSubset[] = this._pSubMeshes;
			var pSphere: ISphere = this._pBoundingSphere;

			for (var i = 0; i < pSubsets.length; ++i) {
				var pSubset: IMeshSubset = pSubsets[i];
				var pLocalSphere: ISphere = pSubset.getBoundingSphere();

				if (pSubset.isSkinned()) {
					pLocalSphere.transform(pSubset.getSkin().getBindMatrix());
					pLocalSphere.transform(pSubset.getSkin().getBoneOffsetMatrix(pSubset.getSkin().getSkeleton().getRoot().getBoneName()));
				}

				if (i == 0) {
					pSphere.set(pLocalSphere);
					continue;
				}

				geometry.computeGeneralizingSphere(pSphere, pLocalSphere);
			}

			//debug.log("Mesh(" + this.getName() + ")::calculateBoundingSphere()");

			this._bBoundingSphereChanged = false;

			return true;

			var pVertexData: IVertexData;
			var pSubMesh: IMeshSubset;
			var pNewBoundingSphere: ISphere,
				pTempBoundingSphere: ISphere;
			var i: int;

			pNewBoundingSphere = new geometry.Sphere();
			pTempBoundingSphere = new geometry.Sphere();


			pSubMesh = this.getSubset(0);
			pVertexData = pSubMesh.getData()._getData(DeclUsages.POSITION);

			if (!pVertexData) {
				return false;
			}


			if (geometry.computeBoundingSphere(pVertexData, pNewBoundingSphere) == false) {
				return false;
			}

			if (pSubMesh.isSkinned()) {
				pNewBoundingSphere.transform(pSubMesh.getSkin().getBindMatrix());
				pNewBoundingSphere.transform(pSubMesh.getSkin().getBoneOffsetMatrix(pSubMesh.getSkin().getSkeleton().getRoot().getBoneName()));
			}

			for (i = 1; i < this.getLength(); i++) {

				pSubMesh = this.getSubset(i);
				pVertexData = pSubMesh.getData()._getData(DeclUsages.POSITION);

				if (isNull(pVertexData))
					return false;

				if (geometry.computeBoundingSphere(pVertexData, pTempBoundingSphere) == false)
					return false;


				if (pSubMesh.isSkinned()) {
					pTempBoundingSphere.transform(pSubMesh.getSkin().getBindMatrix());
					pTempBoundingSphere.transform(pSubMesh.getSkin().getBoneOffsetMatrix(pSubMesh.getSkin().getSkeleton().getRoot().getBoneName()));
					// trace(pTempBoundingSphere.fRadius, '<<<');
				}


				geometry.computeGeneralizingSphere(pNewBoundingSphere, pTempBoundingSphere)
			}

			this._pBoundingSphere = pNewBoundingSphere;
			
			return true;
		}

		deleteBoundingSphere(): boolean {
			this._pBoundingSphere = null;
			return true;
		}

		_showBoundingSphere(): boolean {
			if (config.DEBUG) return false;
			/*
			var pSubMesh: IMeshSubset, pMaterial: IMaterial;
			var iData: int;
			var pPoints: float[], pIndexes: uint[];

			if (!this._pBoundingSphere) {
				if (!this.createBoundingSphere()) {
					return false;
				}
			}

			pPoints = new Array();
			pIndexes = new Array();

			geometry.computeDataForCascadeBoundingSphere(this._pBoundingSphere, pPoints, pIndexes);

			pSubMesh = this.getSubset(".BoundingSphere");

			if (!pSubMesh) {
				pSubMesh = this.createSubset(".BoundingSphere", EPrimitiveTypes.LINELIST, EHardwareBufferFlags.STATIC);

				if (isNull(pSubMesh))
					return false;

				iData = pSubMesh.getData().allocateData(
					[VE.float3(DeclUsages.POSITION)],
					new Float32Array(pPoints));

				pSubMesh.getData().allocateIndex([VE.float(DeclUsages.INDEX0)], new Float32Array(pIndexes));
				pSubMesh.getData().index(iData, DeclUsages.INDEX0);

				pMaterial = pSubMesh.getMaterial();
				pMaterial.emissive = new Color(1.0, 1.0, 1.0, 1.0);
				pMaterial.diffuse = new Color(1.0, 1.0, 1.0, 1.0);
				pMaterial.ambient = new Color(1.0, 1.0, 1.0, 1.0);
				pMaterial.specular = new Color(1.0, 1.0, 1.0, 1.0);

				pSubMesh.getEffect().addComponent("akra.system.mesh_texture");
				pSubMesh.setShadow(false);
			}
			else {
				pSubMesh.getData()._getData(DeclUsages.POSITION).setData(new Float32Array(pPoints), DeclUsages.POSITION);
			}

			pSubMesh.getData().setRenderable(pSubMesh.getData().getIndexSet(), true);

			return true;
			*/

			return false;
		}

		_hideBoundingSphere(): boolean {
			if (config.DEBUG) return false;
			//var pSubMesh: IMeshSubset;

			//pSubMesh = this.getSubset(".BoundingSphere");

			//if (!pSubMesh) {
			//	return false;
			//}

			//pSubMesh.getData().setRenderable(pSubMesh.getData().getIndexSet(), false);
			//return true;

			return false;
		}

		_isBoundingSphereVisible(): boolean {
			//var pSubMesh: IMeshSubset = this.getSubset(".BoundingSphere");

			//if (!pSubMesh) {
			//	return false;
			//}

			//return pSubMesh.getData().isRenderable(pSubMesh.getData().getIndexSet());

			return false;
		}

		update(): boolean {
			var isOk: boolean = false;

			this._bGeometryChanged = false;

			for (var i: uint = 0; i < this._pSubMeshes.length; ++i) {
				isOk = this._pSubMeshes[i].update() ? true : isOk;
			}

			return isOk;
		}

		_setShadow(bValue: boolean): void {
			this._bShadow = bValue;
		}

		static ShadowedSignal = ShadowedSignal;
	}

	export function createMesh(pEngine: IEngine, sName: string = null, eOptions: int = 0, pDataBuffer: IRenderDataCollection = null): IMesh {
		return new Mesh(pEngine, eOptions, sName, pDataBuffer);
	}
}

