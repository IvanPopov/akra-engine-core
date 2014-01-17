/// <reference path="../idl/IAnimationTrack.ts" />
/// <reference path="../idl/IScene.ts" />
/// <reference path="../idl/ISceneNode.ts" />
/// <reference path="../idl/IMat4.ts" />
/// <reference path="../idl/ISkeleton.ts" />

/// <reference path="Parameter.ts" />


module akra.animation {
	
	class Track extends Parameter implements IAnimationTrack {
		private _sTarget: string = null;
		private _pTarget: ISceneNode = null;

	
		 get target(): ISceneNode{
			return this._pTarget;
		}

		 get targetName(): string{
			return this._sTarget;
		}

		 set targetName(sValue: string) {
			this._sTarget = sValue;
		}

		constructor (sTarget: string = null) {
			super();
			this._sTarget = sTarget;
		}

		keyFrame(pFrame: PositionFrame): boolean;
		keyFrame(fTime: float, pMatrix: IMat4): boolean;
		keyFrame(fTime, pMatrix?): boolean {
			var pFrame: PositionFrame;

			if (arguments.length > 1) {
		  		pFrame = new PositionFrame(<float>fTime, <IMat4>pMatrix);
		  	}
		    else {
		    	pFrame = <PositionFrame>arguments[0];
		    }

		    return super.keyFrame(pFrame);
		}

		bind(sJoint: string, pSkeleton: ISkeleton): boolean;
		bind(pSkeleton: ISkeleton): boolean;
		bind(pNode: ISceneNode): boolean;
		bind(pJoint: any, pSkeleton?: any): boolean {
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

		

		toString(): string {
			if (config.DEBUG) {
				var s = "target: " + this.targetName + ", from: " + this.first + "sec. , duration: " + this.duration +
					" sec. , frames: " + this.totalFrames;
				return s;
			}

			return null;
		}
	}

	export function createTrack(sTarget: string = null): IAnimationTrack {
		return new Track(sTarget);
	}
}

