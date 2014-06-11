/// <reference path="../idl/IAnimationBase.ts" />
/// <reference path="../idl/ISceneNode.ts" />
/// <reference path="../idl/IPositionFrame.ts" />
/// <reference path="../idl/IAnimationTrack.ts" />

/// <reference path="../config/config.ts" />
/// <reference path="../events.ts" />

/// <reference path="../scene/Joint.ts" />

module akra.animation {
	import Joint = scene.Joint;

	export interface IMap<IAnimationTarget> {
		[index: string]: IAnimationTarget;
	}

	export class Base implements IAnimationBase {
		guid: uint = guid();

		played: ISignal<{ (pBase: IAnimationBase, fRealTime: float): void; }>;
		stoped: ISignal<{ (pBase: IAnimationBase, fRealTime: float): void; }>;
		renamed: ISignal<{ (pBase: IAnimationBase, sName: float): void; }>;

		protected _pTargetMap: IMap<IAnimationTarget> = {};
		protected _pTargetList: IAnimationTarget[] = [];

		protected _fDuration: float = 0.0;
		//first ever frame time of all targets
		protected _fFirst: float = MAX_UINT32;
		protected _sName: string;

		protected _eType: EAnimationTypes;

		public extra: any = null;

		constructor(eType: EAnimationTypes, sName: string = null) {
			this.setupSignals();

			this._sName = sName || ("animation-" + "-" + this.guid);
			this._eType = eType;
		}

		protected setupSignals(): void {
			this.played = this.played || new Signal(this);
			this.stoped = this.stoped || new Signal(this);
			this.renamed = this.renamed || new Signal(this);
		}

		getType(): EAnimationTypes {
			return this._eType;
		}

		getDuration(): float {
			return this._fDuration;
		}

		getFirst(): float {
			return this._fFirst;
		}

		setDuration(fValue: float): void {
			// LOG("new duration(", this.name, ") > " + fValue);
			this._fDuration = fValue;
		}

		getName(): string {
			return this._sName;
		}

		setName(sName: string): void {
			if (sName == this._sName) {
				return;
			}

			this._sName = sName;
			this.renamed.emit(sName);
		}

		play(fRealTime: float): void {
			this.played.emit(fRealTime);
		}

		stop(fRealTime: float): void {
			this.stoped.emit(fRealTime);
		}

		isAttached(): boolean {
			if (this._pTargetList.length) {
				return isDefAndNotNull(this._pTargetList[0].target);
			}

			return false;
		}

		attach(pTarget: ISceneNode): void {
			debug.error("method AnimationBase::attach() must be overwritten.");
		}

		frame(sName: string, fRealTime: float): IPositionFrame {
			return null;
		}

		apply(fRealTime: float): boolean {
			var pTargetList: IAnimationTarget[] = this._pTargetList;
			var pTarget: ISceneNode = null;
			var pFrame: IPositionFrame = null;
			var pTransform: IMat4 = null;
			var bAffected: boolean = false;

			for (var i = 0; i < pTargetList.length; ++i) {
				pFrame = this.frame(pTargetList[i].name, fRealTime);
				pTarget = pTargetList[i].target;

				if (!pFrame || !pTarget) {
					continue;
				}

				pTransform = pFrame.toMatrix();
				pTarget.setLocalMatrix(pTransform);
				bAffected = true;
			}
			// console.log(bAffected);
			return bAffected;
		}

		addTarget(sName: string, pTarget: ISceneNode = null): IAnimationTarget {
			//pTarget = pTarget || null;

			var pPointer: IAnimationTarget = this._pTargetMap[sName];

			if (pPointer) {
				pPointer.target = pTarget || pPointer.target || null;
				return pPointer;
			}

			pPointer = {
				target: pTarget,
				index: this._pTargetList.length,
				name: sName
			};

			this._pTargetList.push(pPointer);
			this._pTargetMap[sName] = pPointer;

			return pPointer;
		}

		setTarget(sName: string, pTarget: ISceneNode): IAnimationTarget {

			var pPointer: IAnimationTarget = this._pTargetMap[sName];
			pPointer.target = pTarget;
			return pPointer;
		}

		getTarget(sTargetName: string): IAnimationTarget {
			return this._pTargetMap[sTargetName];
		}

		getTargetList(): IAnimationTarget[] {
			return this._pTargetList;
		}

		getTargetByName(sName: string): IAnimationTarget {
			return this._pTargetMap[sName];
		}

		targetNames(): string[] {
			var pTargets: IAnimationTarget[] = this._pTargetList;
			var pTargetNames: string[] = [];

			for (var i = 0; i < pTargets.length; ++i) {
				pTargetNames.push(pTargets[i].name);
			}

			return pTargetNames;
		}

		targetList(): ISceneNode[] {
			var pTargets: IAnimationTarget[] = this._pTargetList;
			var pTargetList: ISceneNode[] = [];

			for (var i = 0; i < pTargets.length; ++i) {
				pTargetList.push(pTargets[i].target);
			}

			return pTargetList;
		}

		jointList(): IJoint[] {
			var pTargets: IAnimationTarget[] = this._pTargetList;
			var pJointList: IJoint[] = [];

			for (var i = 0; i < pTargets.length; ++i) {
				if (Joint.isJoint(pTargets[i].target)) {
					pJointList.push(<IJoint>pTargets[i].target);
				}
			}

			return pJointList;
		}

		grab(pAnimationBase: IAnimationBase, bRewrite: boolean = true): void {

			var pAdoptTargets: IAnimationTarget[] = pAnimationBase.getTargetList();

			for (var i = 0; i < pAdoptTargets.length; ++i) {

				if (!pAdoptTargets[i].target) {
					//warning('cannot grab target <' + pAdoptTargets[i].name + '>, becaus "target" is null');
					continue;
				}

				if (bRewrite || !this.getTarget(pAdoptTargets[i].name)) {
					this.addTarget(pAdoptTargets[i].name, pAdoptTargets[i].target);
				}
			}

			this._fFirst = math.min(this.getFirst(), pAnimationBase.getFirst());
		}

		createAnimationMask(): IMap<float> {
			var pTargets: string[] = this.targetNames();
			var pMask: IMap<float> = <IMap<float>>{};

			for (var i = 0; i < pTargets.length; ++i) {
				pMask[pTargets[i]] = 1.0;
			}

			return pMask;
		}


		toString(): string {

			if (config.DEBUG) {
				var s = "\n";
				s += "name         : " + this.getName() + "\n";
				s += "duration     : " + this.getDuration() + " sec\n";
				s += "total targets: " + this.targetList().length.toString() + "\n";
				return s;
			}

			return null;
		}
	} 
}
