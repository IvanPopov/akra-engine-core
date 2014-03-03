/// <reference path="../idl/IAnimationBlend.ts" />

/// <reference path="Base.ts" />
/// <reference path="Frame.ts" />

module akra.animation {
	export class Blend extends Base implements IAnimationBlend {
		weightUpdated: ISignal<{ (pBlend: IAnimationBlend, iAnim: int, fWeight: float): void; }>;
		durationUpdated: ISignal<{ (pBlend: IAnimationBlend, fDuration: float): void; }>;

		public duration: float = 0;

		private _pAnimationList: IAnimationElement[] = [];

		constructor(sName?: string) {
			super(EAnimationTypes.BLEND, sName);
		}

		protected setupSignals(): void {
			this.weightUpdated = this.weightUpdated || <any> new Signal(this);
			this.durationUpdated = this.durationUpdated || <any> new Signal(this);

			super.setupSignals();
		}

		getTotalAnimations(): int {
			return this._pAnimationList.length;
		}

		play(fRealTime: float): void {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
			var n: int = pAnimationList.length;

			for (var i: int = 0; i < n; ++i) {

				pAnimationList[i].realTime = fRealTime;
				pAnimationList[i].time = fRealTime * pAnimationList[i].acceleration;
			}

			this.played.emit(fRealTime);
		}

		stop(): void {
			this.stoped.emit(0.);
		}

		attach(pTarget: ISceneNode): void {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;

			for (var i: int = 0; i < pAnimationList.length; ++i) {
				var pAnim: IAnimationBase = pAnimationList[i].animation;
				pAnim.attach(pTarget);
				this.grab(pAnim, true);
			}
		}

		addAnimation(pAnimation: IAnimationBase, fWeight?: float, pMask?: IMap<float>): int {
			debug.assert(isDef(pAnimation), 'animation must be setted.');

			this._pAnimationList.push(null);
			var iAnimation: int = this._pAnimationList.length - 1;

			if (this.setAnimation(iAnimation, pAnimation, fWeight, pMask)) {
				return iAnimation;
			}

			return -1;
		}

		setAnimation(iAnimation: int, pAnimation: IAnimationBase, fWeight: float = 1.0, pMask: IMap<float> = null): boolean {
			debug.assert(iAnimation <= this._pAnimationList.length, 'invalid animation slot: ' + iAnimation + '/' + this._pAnimationList.length);

			var pPointer: IAnimationElement = this._pAnimationList[iAnimation];
			var pAnimationList: IAnimationElement[] = this._pAnimationList;

			if (!pAnimation) {
				if (isDefAndNotNull(pAnimationList[iAnimation])) {
					pAnimationList[iAnimation] = null;
					this.updateDuration();
					return true;
				}

				return false;
			}

			if (!pPointer) {
				pPointer = {
					animation: pAnimation,
					weight: fWeight,
					mask: pMask,
					acceleration: 1.0,
					time: 0.0,
					realTime: 0.0
				};

				if (Container.isContainer(pAnimation) || Blend.isBlend(pAnimation)) {
					(<IAnimationBlend>pAnimation).durationUpdated.connect(this, this._onDurationUpdate);
				}

				if (iAnimation == this._pAnimationList.length) {
					pAnimationList.push(pPointer);
				}
				else {
					pAnimationList[iAnimation] = pPointer;
				}
			}
			else {
				return false;
			}

			this.grab(pAnimation);
			this.updateDuration();

			return true;
		}

		swapAnimations(i: int, j: int): boolean {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
			var pPointerA: IAnimationElement = pAnimationList[i];
			var pPointerB: IAnimationElement = pAnimationList[j];

			if (!isDefAndNotNull(pPointerA) || !isDefAndNotNull(pPointerB)) {
				return false;
			}

			pAnimationList[i] = pPointerB;
			pAnimationList[j] = pPointerA;

			return true;
		}

		removeAnimation(i: int): boolean {
			if (this.setAnimation(i, null)) {
				this._pAnimationList.splice(i, 1);
				return true;
			}

			return false;
		}

		_onDurationUpdate(pAnimation: IAnimationBase, fDuration: float): void {
			this.updateDuration();
		}

		protected updateDuration(): void {
			var fWeight: float = 0;
			var fSumm: float = 0;
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
			var n: int = pAnimationList.length;

			for (var i: int = 0; i < n; ++i) {
				if (pAnimationList[i] === null) {
					continue;
				}

				fSumm += pAnimationList[i].weight * pAnimationList[i].animation.getDuration();
				fWeight += pAnimationList[i].weight;
			}

			if (fWeight === 0) {
				this.duration = 0;
			}
			else {

				this.duration = fSumm / fWeight;

				for (var i: int = 0; i < n; ++i) {
					if (pAnimationList[i] === null) {
						continue;
					}

					pAnimationList[i].acceleration = pAnimationList[i].animation.getDuration() / this.duration;
					//trace(pAnimationList[i].animation.name, '> acceleration > ', pAnimationList[i].acceleration);
				}
			}

			this.durationUpdated.emit(this.duration);
		}

		getAnimationIndex(sName: string): int {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;

			for (var i: int = 0; i < pAnimationList.length; i++) {
				if (pAnimationList[i].animation.getName() === sName) {
					return i;
				}
			};

			return -1;
		}


		getAnimation(sName: string): IAnimationBase;
		getAnimation(iAnimation: int): IAnimationBase;
		getAnimation(indexOrName): IAnimationBase {
			var iAnimation: int = isString(indexOrName) ? this.getAnimationIndex(indexOrName) : <int>indexOrName;
			return this._pAnimationList[iAnimation].animation;
		}

		getAnimationWeight(iAnimation: int): float;
		getAnimationWeight(sName: string): float;
		getAnimationWeight(indexOrName): float {
			var iAnimation: int = <int>indexOrName;
			if (isString(indexOrName)) {
				iAnimation = this.getAnimationIndex(indexOrName);
			}

			return this._pAnimationList[iAnimation].weight;
		}

		setWeights(...pWeight: float[]): boolean {
			var fWeight: float;
			var isModified: boolean = false;
			var pAnimationList: IAnimationElement[] = this._pAnimationList;

			for (var i: int = 0; i < arguments.length; ++i) {
				fWeight = arguments[i];

				if (fWeight < 0 || fWeight === null || !pAnimationList[i]) {
					continue;
				}

				if (pAnimationList[i].weight !== fWeight) {
					pAnimationList[i].weight = fWeight;
					isModified = true;
				}
			}

			if (isModified) {
				this.updateDuration();
			}

			return true;
		}

		setWeightSwitching(fWeight: float, iAnimationFrom: int, iAnimationTo: int): boolean {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
			var isModified: boolean = false;
			var fWeightInv: float = 1. - fWeight;

			if (!pAnimationList[iAnimationFrom] || !pAnimationList[iAnimationTo]) {
				return false;
			}

			if (pAnimationList[iAnimationFrom].weight !== fWeightInv) {
				pAnimationList[iAnimationFrom].weight = fWeightInv;
				isModified = true;
			}

			if (pAnimationList[iAnimationTo].weight !== fWeight) {
				pAnimationList[iAnimationTo].weight = fWeight;
				isModified = true;
			}

			if (isModified) {
				this.updateDuration();
			}

			return true;
		}

		setAnimationWeight(fWeight: float): boolean;
		setAnimationWeight(iAnimation: int, fWeight: float): boolean;
		setAnimationWeight(sName: string, fWeight: float): boolean;
		setAnimationWeight(indexOrNameOrWeight, fWeight?: float): boolean {
			var pAnimationList = this._pAnimationList;

			if (arguments.length === 1) {
				fWeight = arguments[0];

				for (var i = 0; i < pAnimationList.length; i++) {
					pAnimationList[i].weight = fWeight;
					this.weightUpdated.emit(i, fWeight);
				}

				this.updateDuration();
			}
			else {
				var iAnimation: int = isString(indexOrNameOrWeight) ? this.getAnimationIndex(indexOrNameOrWeight) : <int>indexOrNameOrWeight;

				//trace('set weight for animation: ', iAnimation, 'to ', fWeight);
				if (pAnimationList[iAnimation].weight !== fWeight) {
					pAnimationList[iAnimation].weight = fWeight;
					this.updateDuration();
					this.weightUpdated.emit(iAnimation, fWeight);
				}
			}

			return true;
		}

		setAnimationMask(iAnimation: int, pMask: IMap<float>): boolean;
		setAnimationMask(sName: string, pMask: IMap<float>): boolean;
		setAnimationMask(indexOrName, pMask: IMap<float>): boolean {
			var iAnimation: int = isString(indexOrName) ? this.getAnimationIndex(indexOrName) : <int>indexOrName;

			this._pAnimationList[iAnimation].mask = pMask;

			return true;
		}

		getAnimationMask(iAnimation: int): IMap<float>;
		getAnimationMask(sName: string): IMap<float>;
		getAnimationMask(indexOrName): IMap<float> {
			var iAnimation: int = isString(indexOrName) ? this.getAnimationIndex(indexOrName) : <int>indexOrName;

			return this._pAnimationList[iAnimation].mask;
		}

		getAnimationAcceleration(iAnimation: int): float;
		getAnimationAcceleration(sName: string): float;
		getAnimationAcceleration(indexOrName): float {
			var iAnimation: int = isString(indexOrName) ? this.getAnimationIndex(indexOrName) : <int>indexOrName;

			return this._pAnimationList[iAnimation].acceleration;
		}

		createAnimationMask(iAnimation?: int): IMap<float> {
			if (arguments.length === 0) {
				return super.createAnimationMask();
			}

			if (typeof arguments[0] === 'string') {
				iAnimation = this.getAnimationIndex(arguments[0]);
			}

			var pAnimation: IAnimationBase = this._pAnimationList[iAnimation].animation;
			return pAnimation.createAnimationMask();
		}

		frame(sName: string, fRealTime: float): IPositionFrame {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
			var pResultFrame: IPositionFrame = <IPositionFrame>PositionFrame.temp();
			var pFrame: IPositionFrame;
			var pMask: IMap<float>;
			var pPointer: IAnimationElement;
			var fAcceleration: float;

			var fBoneWeight: float;
			var fWeight: float;
			var iAnim: int = 0;


			for (var i: int = 0; i < pAnimationList.length; i++) {
				pPointer = pAnimationList[i];

				if (!pPointer) {
					continue;
				}

				fAcceleration = pPointer.acceleration;
				pMask = pPointer.mask;
				fBoneWeight = 1.0;

				//для того чтобы циклы используемые выше работали корректно
				if (fRealTime < pPointer.realTime) {
					pPointer.time = 0;
					pPointer.realTime = 0;
				}

				pPointer.time = pPointer.time + (fRealTime - pPointer.realTime) * fAcceleration;
				pPointer.realTime = fRealTime;

				if (pMask) {
					fBoneWeight = isDef(pMask[sName]) ? pMask[sName] : 1.0;
				}

				fWeight = fBoneWeight * pPointer.weight;

				if (fWeight > 0.0) {
					pFrame = pPointer.animation.frame(sName, pPointer.time);

					if (pFrame) {
						iAnim++;
						//first, if 1
						pResultFrame.add(pFrame.mult(fWeight), iAnim === 1);
					}
				}
			}

			if (pResultFrame.weight === 0.0) {
				return <IPositionFrame>null;
			}

			return <IPositionFrame>pResultFrame.normilize();
		}

		static isBlend(pAnimation: IAnimationBase): boolean {
			return pAnimation.getType() === EAnimationTypes.BLEND;
		}
	}

	export function createBlend(sName?: string): IAnimationBlend {
		return new Blend(sName);
	}
}