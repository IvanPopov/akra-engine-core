#ifndef ANIMATIONTRACK_TS
#define ANIMATIONTRACK_TS

#include "IAnimationTrack.ts"
#include "model/Skeleton.ts"
#include "animation/AnimationFrame.ts"
#include "IScene.ts"
#include "ISceneNode.ts"
#include "IMat4.ts"


module akra.animation {
	class AnimationTrack implements IAnimationTrack {
		private _sTarget: string = null;
		private _pTarget: ISceneNode = null;
		private _pKeyFrames: IAnimationFrame[] = [];
		private _eInterpolationType: EAnimationInterpolations = EAnimationInterpolations.MATRIX_LINEAR;


		inline get target(): ISceneNode{
			return this._pTarget;
		}

		inline get targetName(): string{
			return this._sTarget;
		}

		inline set targetName(sValue: string){
			this._sTarget = sValue;
		}

		inline get duration(): float{
			return this._pKeyFrames.last.fTime;
		}

		constructor (sTarget: string = null) {
			this._sTarget = sTarget;
		}

		keyFrame(fTime: float, pMatrix: IMat4): bool {
			var pFrame: IAnimationFrame;
		    var iFrame: int;

		    var pKeyFrames: IAnimationFrame[] = this._pKeyFrames;
		  	var nTotalFrames: int = pKeyFrames.length;

		  	if (arguments.length > 1) {
		  		pFrame = new animation.AnimationFrame(fTime, pMatrix);
		  	}
		    else {
		    	pFrame = arguments[0];
		    }

		    if (nTotalFrames && (iFrame = this.findKeyFrame(pFrame.time)) >= 0) {
				pKeyFrames.splice(iFrame, 0, pFrame);
			}
			else {
				pKeyFrames.push(pFrame);
			}

			return true;
		}

		getKeyFrame(iFrame: int): IAnimationFrame {
			debug_assert(iFrame < this._pKeyFrames.length, 'iFrame must be less then number of total jey frames.');

			return this._pKeyFrames[iFrame];
		}

		findKeyFrame(fTime: float): int {
			var pKeyFrames: IAnimationFrame[] = this._pKeyFrames;
		    var nTotalFrames: int             = pKeyFrames.length;
			
			if (pKeyFrames[nTotalFrames - 1].time == fTime) {
				return nTotalFrames - 1;
			}
			else {
				for (var i: int = nTotalFrames - 1; i >= 0; i--) {
					if (pKeyFrames[i].time > fTime && pKeyFrames[i - 1].time <= fTime) {
						return i - 1;
					}
				}
			}

			return -1;
		}

		bind(sJoint: string, pSkeleton: ISkeleton): bool;
		bind(pSkeleton: ISkeleton): bool;
		bind(pNode: ISceneNode): bool;
		bind(pJoint: any, pSkeleton?: any): bool {
			var pNode: ISceneNode = null,
				pRootNode: ISceneNode;
	
			var sJoint: string;

			switch (arguments.length) {
				case 2:
					//bind by pair <String joint, Skeleton skeleton>
					sJoint = <string>pJoint;

					this._sTarget = sJoint;
					pNode = (<ISkeleton>pSkeleton).findJoint(sJoint);
					break;
				default:
					//bind by <Skeleton skeleton>
					if (!isDef(arguments[0].type)) {
						
						if (this._sTarget == null) {
							return false;
						}

						pSkeleton = <ISkeleton>arguments[0];
						pNode = (<ISkeleton>pSkeleton).findJoint(this._sTarget);
					}
					//bind by <Node node>
					else {
						pRootNode = <ISceneNode>arguments[0];
						pNode = <ISceneNode>pRootNode.findEntity(this.targetName);
					}
			}
			
			this._pTarget = pNode;

			return isDefAndNotNull(pNode);
		}

		frame(fTime: float): IAnimationFrame {
			var iKey1: int = 0, iKey2: int = 0;
			var fScalar: float;
			var fTimeDiff: float;
			
			var pKeys:  IAnimationFrame[] = this._pKeyFrames
			var nKeys:  int = pKeys.length;
			var pFrame: IAnimationFrame = animation.animationFrame();

			debug_assert(nKeys > 0, 'no frames :(');

			if (nKeys === 1) {
				pFrame.set(pKeys[0]);
			}
			else {
				//TODO: реализовать существенно более эффективный поиск кадра.
				for (var i: int = 0; i < nKeys; i ++) {
			    	if (fTime >= this._pKeyFrames[i].time) {
			            iKey1 = i;
			        }
			    }

			    iKey2 = (iKey1 >= (nKeys - 1))? iKey1 : iKey1 + 1;
			
			    fTimeDiff = pKeys[iKey2].time - pKeys[iKey1].time;
			    
			    if (!fTimeDiff)
			        fTimeDiff = 1;
				
				fScalar = (fTime - pKeys[iKey1].time) / fTimeDiff;

				pFrame.interpolate(
					this._pKeyFrames[iKey1], 
					this._pKeyFrames[iKey2], 
					fScalar);
			}

			pFrame.time = fTime;
			pFrame.weight = 1.0;

			return pFrame;
		}
	}

	export function createTrack(sName: string = null): IAnimationTrack {
		return new AnimationTrack(sName);
	}
}

#endif