#ifndef ANIMATIONTRACK_TS
#define ANIMATIONTRACK_TS

#include "IAnimationTrack.ts"
#include "IScene.ts"
#include "ISceneNode.ts"
#include "IMat4.ts"

#include "model/Skeleton.ts"
#include "Parameter.ts"


module akra.animation {
	
	class Track extends Parameter implements IAnimationTrack {
		private _sTarget: string = null;
		private _pTarget: ISceneNode = null;

	
		inline get target(): ISceneNode{
			return this._pTarget;
		}

		inline get targetName(): string{
			return this._sTarget;
		}

		inline set targetName(sValue: string) {
			this._sTarget = sValue;
		}

		constructor (sTarget: string = null) {
			super();
			this._sTarget = sTarget;
		}

		keyFrame(pFrame: PositionFrame): bool;
		keyFrame(fTime: float, pMatrix: IMat4): bool;
		keyFrame(fTime, pMatrix?): bool {
			var pFrame: PositionFrame;

			if (arguments.length > 1) {
		  		pFrame = new PositionFrame(<float>fTime, <IMat4>pMatrix);
		  	}
		    else {
		    	pFrame = <PositionFrame>arguments[0];
		    }

		    return super.keyFrame(pFrame);
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

		
#ifdef DEBUG
		toString(): string {
			var s = "target: " + this.targetName + ", from: " + this.first + "sec. , duration: " + this.duration + 
				" sec. , frames: " + this.totalFrames; 
			return s;
		}
#endif
	}

	export function createTrack(sTarget: string = null): IAnimationTrack {
		return new Track(sTarget);
	}
}

#endif