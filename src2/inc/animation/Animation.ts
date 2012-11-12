#ifndef ANIMATION_TS
#define ANIMATION_TS

#include "IAnimation.ts"
#include "INode.ts"
#include "IAnimationFrame.ts"
#include "IAnimationTrack.ts"


module akra.animation {
	export class Animation implements IAnimation extends AnimationBase {

		private _pTracks: IAnimationTrack[] = [];
    	

		inline get totalTracks(): float{
			return this._pTracks.length;
		}

		push(pTrack: IAnimationTrack): void {
			this._pTracks.push(pTrack);
			this._fDuration = Math.max(this._fDuration, pTrack.duration);
			this.addTarget(pTrack.targetName);
		}

		attach(pTarget: INode): void {
			var pPointer;
		    var pTracks: IAnimationTrack[] = this._pTracks;
			for (var i = 0; i < pTracks.length; ++ i) {
				if (!pTracks[i].bind(pTarget)) {
					trace('cannot bind animation track [', i, '] to joint <', pTracks[i].target, '>');
				}
				else {
					pPointer = this.setTarget(pTracks[i].targetName, pTracks[i].target);
					pPointer.track = pTracks[i];
				}
			};
		}

		getTracks(): IAnimationTrack[] {
			return this._pTracks;
		}
		
		frame(sName: string, fTime: float): IAnimationFrame {
			var pPointer: IAnimationTarget = this.getTargetByName(sName);
		    
		    if (!pPointer || !pPointer.track) {
		    	return null;
		    }

			return pPointer.track.frame(math.clamp(fTime, 0, this._fDuration));
		}

		extend(pAnimation: IAnimation): void {
			var pTracks: IAnimationTrack[] = pAnimation.getTracks();

			for (var i = 0; i < pTracks.length; ++ i) {
				if (!this.getTarget(pTracks[i].targetName)) {
					this.push(pTracks[i]);
				}
			}
		}
	} 
}

#endif