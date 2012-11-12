#ifndef ANIMATIONTRACK_TS
#define ANIMATIONTRACK_TS

#include "IAnimationTrack.ts"
#include "animation/AnimationFrame.ts"
#include "IScene.ts"
#include "INode.ts"
#include "IMat4.ts"


module akra.animation {
	export class AnimationTrack implements IAnimationTrack{
		private _sTarget: string;
		private _pTarget: INode = null;
		private _pKeyFrames: IAnimationFrame[] = [];
		private _eInterpolationType: EAnimationInterpolations = EAnimationInterpolations.MATRIX_LINEAR;

		inline get targetName(): string{
			return this.nodeName;
		}

		inline get target(): INode{
			return this._pTarget;
		}

		inline get nodeName(): string{
			return this._sTarget;
		}

		inline set nodeName(sValue: string){
			this._sTarget = sValue;
		}

		inline get duration(): string{
			return this._pKeyFrames.last.fTime;
		}

		keyFrame(fTime: float, pMatrix: IMat4) {
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

		    if (nTotalFrames && (iFrame = this.findKeyFrame(pFrame.fTime)) >= 0) {
				pKeyFrames.splice(iFrame, 0, pFrame);
			}
			else {
				pKeyFrames.push(pFrame);
			}

			return true;
		}

		getKeyFrame(iFrame: int) {
			debug_assert(iFrame < this._pKeyFrames.length, 'iFrame must be less then number of total jey frames.');

			return this._pKeyFrames[iFrame];
		}

		findKeyFrame(fTime: float) {
			var pKeyFrames: IAnimationFrame[] = this._pKeyFrames;
		    var nTotalFrames: int             = pKeyFrames.length;
			
			if (pKeyFrames[nTotalFrames - 1].fTime == fTime) {
				return nTotalFrames - 1;
			}
			else {
				for (var i: int = nTotalFrames - 1; i >= 0; i--) {
					if (pKeyFrames[i].fTime > fTime && pKeyFrames[i - 1].fTime <= fTime) {
						return i - 1;
					}
				}
			}

			return -1;
		}

		bind(sJoint: string, pSkeleton: ISkeleton);
		bind(pSkeleton: ISkeleton);
		bind(pNode: INode);
		bind(pJoint: any, pSkeleton?: any) {
			var pNode: INode = null,
				pRootNode: INode;
	
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
					if (arguments[0] instanceof animation.Skeleton) {
						
						if (this._sTarget == null) {
							return false;
						}

						pSkeleton = <ISkeleton>arguments[0];
						pNode = (<ISkeleton>pSkeleton).findJoint(this._sTarget);
					}
					//bind by <Node node>
					else if (arguments[0] instanceof a.Node) {
						pRootNode = <INode>arguments[0];
						pNode = pRootNode.findNode(this.nodeName);
					}
			}
			
			this._pTarget = pNode;

			return isDefAndNotNull(pNode);
		}

		frame(fTime: float) {
			var iKey1: int = 0, iKey2: int = 0;
			var fScalar: float;
			var fTimeDiff: float;
			
			var pKeys:  IAnimationFrame[] = this._pKeyFrames
			var nKeys:  int = pKeys.length;
			var pFrame: IAnimationFrame = animation.AnimationFrame();

			debug_assert(nKeys, 'no frames :(');

			if (nKeys === 1) {
				pFrame.set(pKeys[0]);
			}
			else {
				//TODO: реализовать существенно более эффективный поиск кадра.
				for (var i: int = 0; i < nKeys; i ++) {
			    	if (fTime >= this._pKeyFrames[i].fTime) {
			            iKey1 = i;
			        }
			    }

			    iKey2 = (iKey1 >= (nKeys - 1))? iKey1 : iKey1 + 1;
			
			    fTimeDiff = pKeys[iKey2].fTime - pKeys[iKey1].fTime;
			    
			    if (!fTimeDiff)
			        fTimeDiff = 1;
				
				fScalar = (fTime - pKeys[iKey1].fTime) / fTimeDiff;

				pFrame.interpolate(
					this._pKeyFrames[iKey1], 
					this._pKeyFrames[iKey2], 
					fScalar);
			}

			pFrame.fTime = fTime;
			pFrame.fWeight = 1.0;

			return pFrame;
		}
	} 
}

#endif