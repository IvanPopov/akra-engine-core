#ifndef IOIMPORTER_TS
#define IOIMPORTER_TS

#include "IDocument.ts"
#include "info/info.ts"

#include "IAnimationFrame.ts"
#include "IAnimationTrack.ts"
#include "IAnimation.ts"
#include "IAnimationBlend.ts"
#include "IAnimationContainer.ts"
#include "IAnimationController.ts"

#include "io/Packer.ts"
#include "io/save.ts"

#include "util/util.ts"


module akra.io {
	export class Importer {
		
		private _pDocument: IDocument = null;

		constructor (private pEngine: IEngine) {
			
		}

		inline getEngine(): IEngine {
			return this._pEngine;
		}

		inline getDocument(): IDocument {
			return this._pDocument;
		}

		//inline getLibrary(): I

		import(pData: string, eFormat?: EDocumentFormat): void;
		import(pData: Object, eFormat?: EDocumentFormat): void;
		import(pData: ArrayBuffer, eFormat?: EDocumentFormat): void;
		import(pData: Blob, eFormat?: EDocumentFormat): void;
		import(pData: any, eFormat: EDocumentFormat = EDocumentFormat.JSON): void {
			if (eFormat !== EDocumentFormat.JSON) {
				CRITICAL("TODO: Add support for all formats");
			}

			this._pDocument = this.importFromJSON(pData);
		}

		protected importFromJSON(pData): IDocument {
			var sData: string = null;
			
			if (isArrayBuffer(pData)) {
				sData = util.abtos(<ArrayBuffer>pData);
			}
			else if (isString(sData)) {
				sData = <string>pData;
			}
			else if(isBlob(pData)) {
				CRITICAL("TODO: Blob support!");
			}
			else {
				return <IDocument>pData;
			}

			return <IDocument>util.parseJSON(sData);
		}

		protected findEntries(eType: EDocumentEntry, fnCallback: (pEntry: ILibraryEntry, n?: uint) => bool): void {
			var pLibrary: ILibrary = this._pLibrary;
			var i: uint = 0;

			for (var iGuid in pLibrary) {
				var pEntry: ILibraryEntry = pLibrary[iGuid];
				
				if (!isNull(pEntry.entry) && pEntry.entry.type === eType) {
					if (fnCallback.call(this, pEntry, i ++) === false) {
						return;
					}
				}
			}
		}

		protected findEntryByIndex(eType: EDocumentEntry, i: uint): ILibraryEntry {
			var pEntry: ILibraryEntry = null;
			this.findEntries(eType, (pLibEntry: ILibraryEntry, n?: uint) => {
				pEntry = pLibEntry;

				if (i === n) {
					return;
				}
			});

			return pEntry;
		}

		protected find(eType: EDocumentEntry, fnCallback: (pData: any, n?: uint) => bool): void {
			this.findEntries(eType, (pEntry: ILibraryEntry, n?: uint): bool => {
				if (fnCallback.call(this, pEntry.data, n) === false) {
					return;
				}
			});
		}

		protected inline findByIndex(eType: EDocumentEntry, i: uint = 0): any {
			return this.findEntryByIndex(eType, i).data;
		}

		protected inline findFirst(eType: EDocumentEntry): any {
			return this.findByIndex(eType, 0);
		}

		getController(iContrller: int = 0): IAnimationController {
			return <IAnimationController>this.decodeEntry(this.findEntryByIndex(EDocumentEntry.k_Controller, iContrller).entry);
		}

		protected decodeEntry(pEntry: IDataEntry): any {
			if (isNull(pEntry)) {
				return null;
			}

			switch(pEntry.type) {
				case EDocumentEntry.k_Controller:
					return this.decodeControllerEntry(<IControllerEntry>pEntry);
				case EDocumentEntry.k_Animation:
					return this.decodeAnimationEntry(<IAnimationEntry>pEntry);
					break;
				case EDocumentEntry.k_AnimationBlend:
					return this.decodeAnimationBlendEntry(<IAnimationBlendEntry>pEntry);
					break;
				case EDocumentEntry.k_AnimationContainer:
					return this.decodeAnimationContanerEntry(<IAnimationContainerEntry>pEntry);
					break;
			}
			WARNING("USED UNKNOWN TYPE FOR DECODING!!");
			return null;
		}

		protected decodeEntryList(pEntryList: IDataEntry[], fnCallback: (pData: any) => void): void {
			if (isNull(pEntryList)) {
				return null;
			}

			for (var i: int = 0; i < pEntryList.length; ++ i) {
				fnCallback.call(this, this.decodeEntry(pEntryList[i]));
			}
		}

		protected decodeAnimationFrame(pEntry: IAnimationFrameEntry): IAnimationFrame {
			var pFrame: IAnimationFrame = animation.createFrame(pEntry.time, pEntry.matrix, pEntry.weight);
			return pFrame;
		}

		protected decodeAnimationTrack(pEntry: IAnimationTrackEntry): IAnimationTrack {
			var pTrack: IAnimationTrack = animation.createTrack(pEntry.targetName);

			//TODO: decode base entry
			//TODO: set interpolation mode
			//TODO: set target
			
			for (var i: int = 0; i < pTrack.keyframes.length; ++ i) {
				pTrack.keyFrame(this.decodeAnimationFrame(pAnimation.tracks[i])); 
			};

			return pTrack;
		}

		protected decodeAnimationEntry(pEntry: IAnimationEntry): IAnimation {
			var pAnimation: IAnimation = animation.createAnimation(pEntry.name);
			//TODO: load read targets!!

			for (var i: int = 0; i < pAnimation.tracks.length; ++ i) {
				pAnimation.push(this.decodeAnimationTrack(pAnimation.tracks[i])); 
			};

			return pAnimation;
		}

		protected decodeAnimationBlendEntry(pEntry: IAnimationBlendEntry): IAnimationBlend {
			var pBlend: IAnimationBlend = animation.createBlend(pEntry.name);

			//TODO: decode base entry!
			//TODO: set targets

			for (var i: int = 0; i < pEntry.animations.length; ++ i) {
				var pElement: IAnimationBlendElement = pEntry.animations[i];
				
				var pAnimation: IAnimationBase = this.decodeEntry(pElement.animation);
				var fWeight: float = pElement.weight;
				var pMask: FloatMap = pElement.mask;
				// var fAcceleration: float = pEntry.acceleration;
				
				pBlend.setAnimation(i, pAnimation);
				pBlend.setAnimationWeight(i, fWeight);
				pBlend.setAnimationMask(i, pMask);
			};

			return pBlend;
		}

		protected decodeAnimationContanerEntry(pEntry: IAnimationContainerEntry): IAnimationContainer {
			var pAnimation: IAnimationBase = this.decodeEntry(pEntry.animation);
			var pContainer: IAnimationContainer = animation.createContainer(pAnimation, pEntry.name);

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
			var pController: IAnimationController = animation.createController(pEntry.options);
			
			this.decodeEntryList(pEntry.animations, (pAnimation: IAnimationBase) => {
				pController.addAnimation(pAnimation);
			});

			return pController;
		}
	}
}

#endif

