
/// <reference path="IRenderData.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="IHardwareBuffer.ts" />
/// <reference path="IRenderDataCollection.ts" />
/// <reference path="ISkeleton.ts" />
/// <reference path="IRect3d.ts" />
/// <reference path="ISphere.ts" />
/// <reference path="IMeshSubset.ts" />
/// <reference path="ISceneNode.ts" />
/// <reference path="ISceneModel.ts" />
/// <reference path="ISkin.ts" />

module akra {
	export enum EMeshOptions {
		HB_READABLE = <int>EHardwareBufferFlags.READABLE,
		RD_ADVANCED_INDEX = <int>ERenderDataOptions.ADVANCED_INDEX
	};
	
	export enum EMeshCloneOptions {
		GEOMETRY_ONLY = 0x00,   /*<! copy only geometry*/
		SHARED_GEOMETRY = 0x01  /*<! use shared geometry*/
	};
	
	export interface IMesh extends IEventProvider {
		/** notify, when one of substets added or removed shadow */
		shadowed: ISignal<{ (pMesh: IMesh, pSubset: IMeshSubset, bShadow: boolean): void; }>;

		getName(): string;
		getData(): IRenderDataCollection;
		getLength(): uint; /*<! number of submeshes in. */
		getBoundingBox(): IRect3d;
		getBoundingSphere(): ISphere;

		/**
		 * Return TRUE if after last update mesh geometry was changed.
		 */
		isGeometryChanged(): boolean;
		isSkinned(): boolean;

		getShadow(): boolean;
		setShadow(bValue: boolean): void;

		getOptions(): int;
		getEngine(): IEngine;

		destroy(): void;
		clone(iCloneOptions: int): IMesh;

		createSubset(sName: string, ePrimType: EPrimitiveTypes, eOptions?: int);
		freeSubset(sName: string): boolean;
		getSubset(sMesh: string): IMeshSubset;
		getSubset(i: uint): IMeshSubset;
		appendSubset(sName: string, pData: IRenderData): IMeshSubset;

		setSkin(pSkin: ISkin): void;
		createSkin(): ISkin;

		calculateBoundingBox(): boolean;
		calculateBoundingSphere(): boolean;

		isReadyForRender(): boolean;

		/** Updtae all submeshes(apply bone matricie for skinned submeshes) */
		update(): boolean;
	}
	
}
