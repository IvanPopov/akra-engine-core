#ifndef ANIMATIONBASE_TS
#define ANIMATIONBASE_TS

#include "IAnimationBase.ts"
#include "INode.ts"
#include "IAnimationFrame.ts"
#include "IAnimationTrack.ts"
#include "scene/Joint.ts"


module akra.animation {
	export interface IAnimationTargetMap{
		[index: string]: IAnimationTarget;
	}

	export class AnimationBase implements IAnimationBase {

		private _pTargetMap: IAnimationTargetMap = {};
    	private _pTargetList: IAnimationTarget[] = [];

    	protected _fDuration: float = 0.0;
		private _sName: string;

		inline get duration(): float{
			return this._fDuration;
		}

		inline set duration(fValue: float){
			this._fDuration = fValue;
		}

		inline get name(): string{
			return this._sName;
		};

		inline set name(sName: string){
			this._sName = sName;
		};


		play(fRealTime: float): void {
			this.onplay(fRealTime);
		}

		stop(fRealTime: float): void {
			this.onstop(fRealTime);
		}
		
		attach(pTarget: INode): void {
			debug_error("method AnimationBase::bind() must be overwritten.");
		}
		
		frame(sName: string, fRealTime: float): IAnimationFrame {
			return null;
		}

		apply(fRealTime: float): void {
			var pTargetList: IAnimationTarget[] = this._pTargetList;
		    var pTarget: INode;
		    var pFrame: IAnimationFrame;
		    var pTransform;

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

		addTarget(sName: string, pTarget: INode = null): IAnimationTarget {
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

		setTarget(sName: string, pTarget: INode): IAnimationTarget {

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

		targetList(): INode[] {
			var pTargets: IAnimationTarget[] = this._pTargetList;
			var pTargetList: INode[] = [];

			for (var i = 0; i < pTargets.length; ++ i) { 
				pTargetList.push(pTargets[i].target);
			}

			return pTargetList;
		}

		jointList(): IJoint[] {
			var pTargets: IAnimationTarget[] = this._pTargetList;
			var pJointList: IJoint[] = [];

			for (var i = 0; i < pTargets.length; ++ i) { 
				if (pTargets[i].target instanceof scene.Joint) {
					pJointList.push(pTargets[i].target);
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

		BEGIN_EVENT_TABLE(AnimationBase);
			BROADCAST(onplay, CALL(fRealTime));
			BROADCAST(onstop, CALL(fRealTime));
		END_EVENT_TABLE();
	} 
}

#endif