/// <reference path="../idl/IDocument.ts" />
/// <reference path="../idl/IMap.ts" />
/// <reference path="../idl/IAnimationContainer.ts" />
/// <reference path="../idl/IAnimationBlend.ts" />

/// <reference path="../logger.ts" />
/// <reference path="../debug.ts" />
/// <reference path="../conv/conv.ts" />
/// <reference path="../math/math.ts" />
/// <reference path="../io/io.ts" />

/// <reference path="../animation/Frame.ts" />
/// <reference path="../animation/Track.ts" />
/// <reference path="../animation/Animation.ts" />
/// <reference path="../animation/Blend.ts" />
/// <reference path="../animation/Container.ts" />

/// <reference path="../material/materials.ts" />

module akra.exchange {
	import Mat4 = math.Mat4;

	export class Importer {

		private _pDocument: IDocument = null;
		private _pLibrary: ILibrary = <ILibrary><any>{};

		constructor(private _pEngine: IEngine) {

		}

		final getEngine(): IEngine {
			return this._pEngine;
		}

		/**  */ getDocument(): IDocument {
			return this._pDocument;
		}

		/**  */ getLibrary(): ILibrary {
			return this._pLibrary;
		}

		///**  */ getLibrary(): I

		import(pData: string, eFormat?: EDocumentFormat): Importer;
		import(pData: Object, eFormat?: EDocumentFormat): Importer;
		import(pData: ArrayBuffer, eFormat?: EDocumentFormat): Importer;
		import(pData: Blob, eFormat?: EDocumentFormat): Importer;
		import(pData: any, eFormat: EDocumentFormat = EDocumentFormat.JSON): Importer {
			if (eFormat !== EDocumentFormat.JSON && eFormat !== EDocumentFormat.BINARY_JSON) {
				logger.critical("TODO: Add support for all formats");
			}

			if (eFormat === EDocumentFormat.JSON) {
				this.loadDocument(this.importFromJSON(pData));
			}
			else if (eFormat === EDocumentFormat.BINARY_JSON) {
				this.loadDocument(this.importFromBinaryJSON(<ArrayBuffer>pData));
			}

			return this;
		}

		loadDocument(pDocument: IDocument): Importer {
			this._pDocument = pDocument;
			this.updateLibrary();
			return this;
		}


		protected importFromBinaryJSON(pData: ArrayBuffer): IDocument {
			return io.undump(pData);
		}

		protected importFromJSON(pData): IDocument {
			var sData: string = null;

			if (isArrayBuffer(pData)) {
				sData = conv.abtos(<ArrayBuffer>pData);
			}
			else if (isString(pData)) {
				sData = <string>pData;
			}
			else if (isBlob(pData)) {
				logger.critical("TODO: Blob support!");
			}
			else {
				return <IDocument>pData;
			}

			return JSON.parse(sData);/*<IDocument>util.parseJSON(sData);*/
		}

		protected updateLibrary(): void {
			var pDocument: IDocument = this.getDocument();
			var pLibrary: ILibrary = this.getLibrary();

			for (var i: int = 0; i < pDocument.library.length; ++i) {
				var pEntry: IDataEntry = pDocument.library[i];
				var iGuid: int = pEntry.guid;

				pLibrary[iGuid] = { guid: iGuid, data: null, entry: pEntry };
			};
		}


		protected findEntries(eType: EDocumentEntry, fnCallback: (pEntry: ILibraryEntry, n?: uint) => boolean): void {
			var pLibrary: ILibrary = this.getLibrary();
			var i: uint = 0;

			for (var iGuid in pLibrary) {
				var pEntry: ILibraryEntry = pLibrary[iGuid];

				if (!isNull(pEntry.entry) && pEntry.entry.type === eType) {
					if (fnCallback.call(this, pEntry, i++) === false) {
						return;
					}
				}
			}
		}

		protected findEntryByIndex(eType: EDocumentEntry, i: uint): ILibraryEntry {
			var pEntry: ILibraryEntry = null;
			this.findEntries(eType, (pLibEntry: ILibraryEntry, n?: uint): boolean => {
				pEntry = pLibEntry;

				if (i === n) {
					return false;
				}
			});

			return pEntry;
		}

		protected find(eType: EDocumentEntry, fnCallback: (pData: any, n?: uint) => boolean): void {
			this.findEntries(eType, (pEntry: ILibraryEntry, n?: uint): boolean => {
				if (fnCallback.call(this, pEntry.data, n) === false) {
					return;
				}
			});
		}

		protected /**  */ findByIndex(eType: EDocumentEntry, i: uint = 0): any {
			return this.findEntryByIndex(eType, i).data;
		}

		protected /**  */ findFirst(eType: EDocumentEntry): any {
			return this.findByIndex(eType, 0);
		}

		getController(iContrller: int = 0): IAnimationController {
			return <IAnimationController>this.decodeEntry(this.findEntryByIndex(EDocumentEntry.k_Controller, iContrller).entry);
		}

		getMaterials(): IMaterial[]{
			var pMaterials: IMaterial[] = [];

			this.findEntries(EDocumentEntry.k_Material, (pEntry: ILibraryEntry): boolean => {
				pMaterials.push(<IMaterial>this.decodeEntry(pEntry.entry));
				return true;
			});

			return pMaterials;
		}

		protected decodeEntry(pEntry: IDataEntry): any {
			if (isNull(pEntry)) {
				return null;
			}

			var pData: any = this.getLibrary()[pEntry.guid].data;

			if (!isNull(pData)) {
				return pData;
			}

			switch (pEntry.type) {
				case EDocumentEntry.k_Controller:
					pData = this.decodeControllerEntry(<IControllerEntry>pEntry);
					break;
				case EDocumentEntry.k_Animation:
					pData = this.decodeAnimationEntry(<IAnimationEntry>pEntry);
					break;
				case EDocumentEntry.k_AnimationBlend:
					pData = this.decodeAnimationBlendEntry(<IAnimationBlendEntry>pEntry);
					break;
				case EDocumentEntry.k_AnimationContainer:
					pData = this.decodeAnimationContainerEntry(<IAnimationContainerEntry>pEntry);
					break;

				case EDocumentEntry.k_Material:
					pData = this.decodeMaterialEntry(<IMaterialEntry>pEntry);
					break;
			}

			if (!isNull(pData)) {
				this.registerData(pEntry.guid, pData);
				return pData;
			}

			logger.warn("USED UNKNOWN TYPE FOR DECODING!!", pEntry.type);
			return null;
		}

		protected registerData(iGuid: int, pData: any): void {
			var pLibEntry: ILibraryEntry = this.getLibrary()[iGuid];
			pLibEntry.data = pData;
		}

		protected decodeInstance(iGuid: int): any {
			var pLibEntry: ILibraryEntry = this.getLibrary()[iGuid];

			if (!isNull(pLibEntry.data)) {
				return pLibEntry.data;
			}

			return this.decodeEntry(pLibEntry.entry);
		}

		protected decodeEntryList(pEntryList: IDataEntry[], fnCallback: (pData: any) => void): void {
			if (isNull(pEntryList)) {
				return;
			}

			for (var i: int = 0; i < pEntryList.length; ++i) {
				fnCallback.call(this, this.decodeEntry(pEntryList[i]));
			}
		}

		protected decodeInstanceList(pInstances: int[], fnCallback: (pData: any, n?: int) => void): void {
			for (var i: int = 0; i < pInstances.length; ++i) {
				fnCallback.call(this, this.decodeInstance(pInstances[i]), i);
			}
		}

		protected decodeMaterialEntry(pEntry: IMaterialEntry): IMaterial {
			var pMaterial: IMaterial = material.create();

			pMaterial.name = pEntry.name;
			pMaterial.transparency = pEntry.transparency;
			pMaterial.shininess = pEntry.shininess;

			this.decodeColorEntry(pEntry.diffuse, pMaterial.diffuse);
			this.decodeColorEntry(pEntry.specular, pMaterial.specular);
			this.decodeColorEntry(pEntry.emissive, pMaterial.emissive);

			return pMaterial;
		}

		protected decodeColorEntry(pEntry: IColorEntry, pDest: IColor = new color.Color): IColor {
			return pDest.set(pEntry[0], pEntry[1], pEntry[2], pEntry[3]);
		}

		protected decodeAnimationFrame(pEntry: IAnimationFrameEntry): IPositionFrame {
			var pFrame: IPositionFrame = new animation.PositionFrame(pEntry.time, new Mat4(pEntry.matrix), pEntry.weight);
			//FIXME: avoid capability problems
			pFrame.type = isInt(pEntry.type) ? pEntry.type : EAnimationInterpolations.SPHERICAL;
			return pFrame;
		}

		protected decodeAnimationTrack(pEntry: IAnimationTrackEntry): IAnimationTrack {
			var pTrack: IAnimationTrack = animation.createTrack(pEntry.targetName);

			//TODO: decode base entry
			//TODO: set interpolation mode
			//TODO: set target

			for (var i: int = 0; i < pEntry.keyframes.length; ++i) {
				pTrack.keyFrame(this.decodeAnimationFrame(pEntry.keyframes[i]));
			};

			return pTrack;
		}

		protected decodeAnimationEntry(pEntry: IAnimationEntry): IAnimation {
			var pAnimation: IAnimation = animation.createAnimation(pEntry.name);

			pAnimation.extra = pEntry.extra;

			//TODO: load read targets!!

			for (var i: int = 0; i < pEntry.tracks.length; ++i) {
				pAnimation.push(this.decodeAnimationTrack(pEntry.tracks[i]));
			};

			return pAnimation;
		}

		protected decodeAnimationBlendEntry(pEntry: IAnimationBlendEntry): IAnimationBlend {
			var pBlend: IAnimationBlend = animation.createBlend(pEntry.name);

			pBlend.extra = pEntry.extra;

			//TODO: decode base entry!
			//TODO: set targets

			for (var i: int = 0; i < pEntry.animations.length; ++i) {
				var pElement: IAnimationBlendElementEntry = pEntry.animations[i];

				var pAnimation: IAnimationBase = <IAnimationBase>this.decodeInstance(pElement.animation);
				var fWeight: float = pElement.weight;
				var pMask: IMap<float> = pElement.mask;
				// var fAcceleration: float = pEntry.acceleration;

				pBlend.setAnimation(i, pAnimation);
				pBlend.setAnimationWeight(i, fWeight);
				pBlend.setAnimationMask(i, pMask);
			};

			return pBlend;
		}

		protected decodeAnimationContainerEntry(pEntry: IAnimationContainerEntry): IAnimationContainer {
			var pAnimation: IAnimationBase = this.decodeInstance(pEntry.animation);
			var pContainer: IAnimationContainer = animation.createContainer(pAnimation, pEntry.name);

			pContainer.extra = pEntry.extra;

			//TODO: decode base entry!
			//TODO: set targets

			if (!pEntry.enable) {
				pContainer.disable();
			}

			pContainer.setStartTime(pEntry.startTime);
			pContainer.setSpeed(pEntry.speed);
			pContainer.useLoop(pEntry.loop);
			pContainer.reverse(pEntry.reverse);
			pContainer.pause(pEntry.pause);
			pContainer.leftInfinity(pEntry.leftInfinity);
			pContainer.rightInfinity(pEntry.rightInfinity);

			return pContainer;
		}

		protected decodeControllerEntry(pEntry: IControllerEntry): IAnimationController {
			var pController: IAnimationController = this.getEngine().createAnimationController(pEntry.name, pEntry.options);
			pController.name = pEntry.name;

			this.decodeInstanceList(pEntry.animations, (pAnimation: IAnimationBase) => {
				pController.addAnimation(pAnimation);
			});

			return pController;
		}
	}
}

