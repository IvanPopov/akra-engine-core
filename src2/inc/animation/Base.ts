#ifndef ANIMATIONBASE_TS
#define ANIMATIONBASE_TS

#include "IAnimationBase.ts"
#include "ISceneNode.ts"
#include "IAnimationFrame.ts"
#include "IAnimationTrack.ts"
#include "scene/Joint.ts"


module akra.animation {
	export interface IAnimationTargetMap {
		[index: string]: IAnimationTarget;
	}

	export class Base implements IAnimationBase {

		protected _pTargetMap: IAnimationTargetMap = {};
    	protected _pTargetList: IAnimationTarget[] = [];

    	protected _fDuration: float = 0.0;
		protected _sName: string;

		protected _eType: EAnimationTypes;

		constructor (eType: EAnimationTypes, sName: string = null) {
			this._sName = sName || ("animation-" + now() + "-" + this.getGuid());
			this._eType = eType;
		}

		inline get duration(): float{
			return this._fDuration;
		}

		inline set duration(fValue: float){
			LOG("new duration > " + fValue);
			this._fDuration = fValue;
		}

		inline get name(): string{
			return this._sName;
		};

		inline set name(sName: string){
			this._sName = sName;
		};


		inline play(fRealTime: float): void {
			this.played(fRealTime);
		}

		inline stop(fRealTime: float): void {
			this.stoped(fRealTime);
		}
		
		attach(pTarget: ISceneNode): void {
			debug_error("method AnimationBase::attach() must be overwritten.");
		}
		
		frame(sName: string, fRealTime: float): IAnimationFrame {
			return null;
		}

		apply(fRealTime: float): void {
			var pTargetList: IAnimationTarget[] = this._pTargetList;
		    var pTarget: ISceneNode = null;
		    var pFrame: IAnimationFrame = null;
		    var pTransform: IMat4 = null;

			for (var i = 0; i < pTargetList.length; ++ i) {
				pFrame = this.frame(pTargetList[i].name, fRealTime);
				pTarget = pTargetList[i].target;

				if (!pFrame || !pTarget) {
					continue;
				}

				pTransform = pFrame.toMatrix();
				pTarget.localMatrix.set(pTransform);
			};

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

		inline getTargetList(): IAnimationTarget[] {
			return this._pTargetList;
		}

		inline getTargetByName(sName: string): IAnimationTarget {
			return this._pTargetMap[sName];
		}

		targetNames(): string[] {
			var pTargets: IAnimationTarget[] = this._pTargetList;
			var pTargetNames: string[] = [];

			for (var i = 0; i < pTargets.length; ++ i) { 
				pTargetNames.push(pTargets[i].name);
			}

			return pTargetNames;
		}

		targetList(): ISceneNode[] {
			var pTargets: IAnimationTarget[] = this._pTargetList;
			var pTargetList: ISceneNode[] = [];

			for (var i = 0; i < pTargets.length; ++ i) { 
				pTargetList.push(pTargets[i].target);
			}

			return pTargetList;
		}

		jointList(): IJoint[] {
			var pTargets: IAnimationTarget[] = this._pTargetList;
			var pJointList: IJoint[] = [];

			for (var i = 0; i < pTargets.length; ++ i) { 
				if (scene.isJoint(pTargets[i].target)) {
					pJointList.push(<IJoint>pTargets[i].target);
				}
			}

			return pJointList;
		}

		grab(pAnimationBase: IAnimationBase, bRewrite: bool = true): void{

		    var pAdoptTargets: IAnimationTarget[] = pAnimationBase.getTargetList();

			for (var i = 0; i < pAdoptTargets.length; ++ i) {
				
				if (!pAdoptTargets[i].target) {
					//warning('cannot grab target <' + pAdoptTargets[i].name + '>, becaus "target" is null');
					continue;
				}

				if (bRewrite || !this.getTarget(pAdoptTargets[i].name)) {
					this.addTarget(pAdoptTargets[i].name, pAdoptTargets[i].target);
				}
			};
		}
		
		createAnimationMask(): FloatMap {
			var pTargets: string[] = this.targetNames();
		    var pMask: FloatMap = <FloatMap>{};

		    for (var i = 0; i < pTargets.length; ++ i) {
		    	pMask[pTargets[i]] = 1.0;
		    }

		    return pMask;
		}

#ifdef DEBUG
		toString(): string {
			var s = "\n";
			s += "name         : " + this.name + "\n";
			s += "duration     : " + this.duration + " sec\n";
			s += "total targets: " + this.targetList().length.toString() + "\n";
			return s;
		}
#endif

		CREATE_EVENT_TABLE(Base);
		BROADCAST(played, CALL(fRealTime));
		BROADCAST(stoped, CALL(fRealTime));
	} 
}

#endif