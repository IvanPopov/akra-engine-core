#ifndef IOEXPORTER_TS
#define IOEXPORTER_TS

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

	export class Exporter {
		static VERSION = "0.0.1";
		static UP_AXIS: string = "Y_UP";
		static TOOL: string = "Akra Engine exporter";

		protected _pLibrary: ILibrary = <ILibrary><any>{};
		protected _pDocument: IDocument = null;

		//записаны ли сцены в документе?
		protected _bScenesWrited: bool = false;
		
		//assset
		protected _sTitle: string = null;
		protected _sSubject: string = null;
		protected _pKeywords: string[] = null;

		//contributor
		protected _sAuthor: string = null;
		protected _sComments: string = null;
		protected _sCopyright: string = null;
		protected _sSourceData: string = null;

		inline writeAnimation(pAnimation: IAnimationBase): void {
			switch (pAnimation.type) {
				case EAnimationTypes.ANIMATION:
					this.makeEntry(EDocumentEntry.k_Animation, pAnimation);
					break;
				case EAnimationTypes.BLEND:
					this.makeEntry(EDocumentEntry.k_AnimationBlend, pAnimation);
					break;
				case EAnimationTypes.CONTAINER:
					this.makeEntry(EDocumentEntry.k_AnimationContainer, pAnimation);
					break;
				default:
					CRITICAL("unknown animation detected!");
			}	
		}

		inline writeController(pController: IAnimationController): void {
			this.makeEntry(EDocumentEntry.k_Controller, pController);
		}

		clear(): void {
			this._bScenesWrited = false;
			this._pLibrary = <ILibrary><any>{};
		}

		inline findLibraryEntry(iGuid: int): ILibraryEntry {
			return this._pLibrary[iGuid];
		}

		inline findEntry(iGuid: int): IDataEntry {
			return this.findLibraryEntry(iGuid).entry;
		}

		inline findEntryData(iGuid: int): any {
			return this.findLibraryEntry(iGuid).data;
		}

		protected inline isSceneWrited(): bool {
			return this._bScenesWrited;
		}

		protected inline isEntryExists(iGuid: int): bool {
			return isDefAndNotNull(this._pLibrary[iGuid]);
		}

		protected makeEntry(eType: EDocumentEntry, pData: IUnique): void {
			if (!this.isEntryExists(pData.getGuid())) {
				this.writeEntry(eType, {guid: pData.getGuid(), data: pData, entry: null});
			}
		}

		protected writeEntry(eType: EDocumentEntry, pEntry: ILibraryEntry): void {
			if (isDefAndNotNull(pEntry.entry)) {
				return ;
			}

			ASSERT(this.encodeEntry(eType, pEntry), "cannot encode entry with type: " + eType);
			this._pLibrary[pEntry.guid] = pEntry;
			pEntry.entry.guid = pEntry.guid;
		}

		protected encodeEntry(eType: EDocumentEntry, pEntry: ILibraryEntry): bool {
			switch (eType) {
				case EDocumentEntry.k_Controller:
					pEntry.entry = this.encodeControllerEntry(<IAnimationController>pEntry.data);
					break;
				case EDocumentEntry.k_Animation:
					pEntry.entry = this.encodeAnimationEntry(<IAnimation>pEntry.data);
					break;
				case EDocumentEntry.k_AnimationBlend:
					pEntry.entry = this.encodeAnimationBlendEntry(<IAnimationBlend>pEntry.data);
					break;
				case EDocumentEntry.k_AnimationContainer:
					pEntry.entry = this.encodeAnimationContainerEntry(<IAnimationContainer>pEntry.data);
					break;
				default:
					WARNING("unknown entry type detected: " + eType);
			}

			return isDefAndNotNull(pEntry.entry);
		}

		protected encodeAnimationBaseEntry(pAnimation: IAnimationBase): IDataEntry {
			var pEntry: IAnimationBaseEntry = {
				name: pAnimation.name,
				targets: [],
				type: EDocumentEntry.k_Unknown,
				extra: null
			}

			var pTargets: IAnimationTarget[] = pAnimation.getTargetList();

			for (var i = 0; i < pTargets.length; ++ i) {
				if (this.isSceneWrited()) {
					CRITICAL("TODO: scene writed");
				}

				pEntry.targets.push({name: pTargets[i].name, target: null});
			}

			return pEntry;
		}

		protected encodeAnimationFrameEntry(pFrame: IAnimationFrame): IAnimationFrameEntry {
			var pEntry: IAnimationFrameEntry = {
				time: pFrame.time,
				weight: pFrame.weight,
				matrix: []
			};

			for (var i = 0; i < pFrame.matrix.data.length; ++ i) {
				pEntry.matrix.push(pFrame.matrix.data[i]);
			}

			return pEntry;
		}

		protected encodeAnimationTrack(pTrack: IAnimationTrack): IAnimationTrackEntry {
			var pEntry: IAnimationTrackEntry = {
				interpolation: 0, /*TODO: real interpolation mode*/
				keyframes: [],
				targetName: pTrack.targetName,
				target: null
			};

			if (this.isSceneWrited()) {
				CRITICAL("TODO: write track target");
			}

			for (var i: int = 0; i < pTrack.totalFrames; ++ i) {
				var pFrame: IAnimationFrameEntry = this.encodeAnimationFrameEntry(pTrack.getKeyFrame(i));
				pEntry.keyframes.push(pFrame);
			};

			return pEntry;
		}

		protected encodeAnimationEntry(pAnimation: IAnimation): IDataEntry {
			var pEntry: IAnimationEntry = <IAnimationEntry>this.encodeAnimationBaseEntry(pAnimation);
			pEntry.tracks = [];
			pEntry.type = EDocumentEntry.k_Animation;

			for (var i: int = 0; i < pAnimation.totalTracks; ++ i) {
				var pTrack: IAnimationTrackEntry = this.encodeAnimationTrack(pAnimation.getTrack(i));
				pEntry.tracks.push(pTrack);
			};

			return pEntry;
		}

		protected encodeAnimationContainerEntry(pContainer: IAnimationContainer): IDataEntry {
			var pAnimation: IAnimationBase = pContainer.getAnimation();

			var pEntry: IAnimationContainerEntry = <IAnimationContainerEntry>this.encodeAnimationBaseEntry(pContainer);

			pEntry.enable = pContainer.isEnabled();
			pEntry.startTime = pContainer.getStartTime();
			pEntry.speed = pContainer.getSpeed();
			pEntry.loop = pContainer.inLoop();
			pEntry.reverse = pContainer.isReversed();
			pEntry.pause = pContainer.isPaused();
			pEntry.leftInfinity = pContainer.inLeftInfinity();
			pEntry.rightInfinity = pContainer.inRightInfinity();

			pEntry.animation = pAnimation.getGuid();
			pEntry.type = EDocumentEntry.k_AnimationContainer;

			this.writeAnimation(pAnimation);

			return pEntry;
		}

		protected encodeAnimationBlendEntry(pBlend: IAnimationBlend): IDataEntry {
			var pEntry: IAnimationBlendEntry = <IAnimationBlendEntry>this.encodeAnimationBaseEntry(pBlend);
			
			pEntry.animations = []
			pEntry.type = EDocumentEntry.k_AnimationBlend;

			for (var i = 0, n: int = pBlend.totalAnimations; i < n; ++ i) {
				var pAnimation: IAnimationBase = pBlend.getAnimation(i);

				var pBlendElement: IAnimationBlendElementEntry = {
					animation: pAnimation.getGuid(),
					weight: pBlend.getAnimationWeight(i),
					// acceleration: pBlend.getAnimationAcceleration(i),
					mask: pBlend.getAnimationMask(i)
				};
				
				this.writeAnimation(pAnimation);
				pEntry.animations.push(pBlendElement);
			}


			return pEntry;
		}

		protected encodeControllerEntry(pController: IAnimationController): IDataEntry {
			var pEntry: IControllerEntry = {
				type: EDocumentEntry.k_Controller,

				animations: [],
				options: 0,
				name: pController.name
			};

			for (var i = 0, n: int = pController.totalAnimations; i < n; ++ i) {
				var pAnimation: IAnimationBase = pController.getAnimation(i);
				this.writeAnimation(pAnimation);
				pEntry.animations.push(pAnimation.getGuid());
			}

			return pEntry;
		}


		protected toolInfo(): string {
			return [
				Exporter.TOOL, 
				"Version " + Exporter.VERSION,
				"Browser " + info.browser.name + ", " + info.browser.version + " (" + info.browser.os + ")"
				].join(";");
		}

		protected createUnit(): IUnit  {
			return {
				name: "meter",
				meter: 1.
			}
		}

		protected createContributor(): IContributor {
			return {
				author: this._sAuthor,
				authoringTool: this.toolInfo(),
				comments: this._sComments,
				copyright: this._sCopyright,
				sourceData: this._sSourceData
			}
		}

		protected createAsset(): IAsset {
			return {
				unit: this.createUnit(),
				upAxis: Exporter.UP_AXIS,
				title: this._sTitle,
				subject: this._sSubject,
				created: Exporter.getDate(),
				modified: Exporter.getDate(),
				contributor: this.createContributor(),
				keywords: this._pKeywords
			}
		}

		createDocument(): IDocument {
			var pDocument: IDocument  = {
				asset: this.createAsset(),
				library: [],
				scenes: null
			}

			var pLibrary: ILibrary = this._pLibrary;

			for (var iGuid in pLibrary) {
				var pLibEntry: ILibraryEntry = pLibrary[iGuid];
				pDocument.library.push(pLibEntry.entry);
			}

			return pDocument;
		}

		export(eFormat: EDocumentFormat = EDocumentFormat.JSON): Blob {
			var pDocument: IDocument = this.createDocument();
			
			if (eFormat === EDocumentFormat.JSON) {
				return Exporter.exportAsJSON(pDocument);
			}
			else if (eFormat === EDocumentFormat.BINARY_JSON) {
				return Exporter.exportAsJSONBinary(pDocument);
			}

			return null;
		}

		saveAs(sName: string, eFormat?: EDocumentFormat): void {
			saveAs(this.export(eFormat), sName);
		}

		static exportAsJSON(pDocument: IDocument): Blob {
			return new Blob([JSON.stringify(pDocument/*, null, "\t"*/)], {type: "application/json;charset=utf-8"});
		}

		static exportAsJSONBinary(pDocument: IDocument): Blob {
			return new Blob([io.dump(pDocument)], {type: "application/octet-stream"});
		}

		static protected inline getDate(): string {
			return (new Date()).toString();
		}
	}
}

#endif

