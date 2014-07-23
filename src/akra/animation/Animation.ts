/// <reference path="../idl/IAnimation.ts" />
/// <reference path="../idl/ISceneNode.ts" />
/// <reference path="../idl/IPositionFrame.ts" />
/// <reference path="../idl/IAnimationTrack.ts" />

/// <reference path="../debug.ts" />

/// <reference path="Base.ts" />

module akra.animation {
	export class Animation extends Base implements IAnimation {
		private _pTracks: IAnimationTrack[] = [];

		constructor(sName?: string) {
			super(EAnimationTypes.ANIMATION, sName);
		}

		getTotalTracks(): float {
			return this._pTracks.length;
		}

		push(pTrack: IAnimationTrack): void {
			this._pTracks.push(pTrack);
			this._fDuration = math.max(this._fDuration, pTrack.getDuration());
			this._fFirst = math.min(this.getFirst(), pTrack.getFirst());
			this.addTarget(pTrack.getTargetName());
		}

		attach(pTarget: ISceneNode): void {
			var pPointer: IAnimationTarget;
			var pTracks: IAnimationTrack[] = this._pTracks;

			for (var i = 0; i < pTracks.length; ++i) {
				if (!pTracks[i].bind(pTarget)) {
					logger.log("cannot bind animation track [", i, "] to joint <", pTracks[i].getTarget(), ">");
				}
				else {
					pPointer = this.setTarget(pTracks[i].getTargetName(), pTracks[i].getTarget());
					pPointer.track = pTracks[i];
				}
			}
		}

		getTracks(): IAnimationTrack[] {
			return this._pTracks;
		}

		getTrack(i: int): IAnimationTrack {
			return this._pTracks[i];
		}

		frame(sName: string, fTime: float): IPositionFrame {
			var pPointer: IAnimationTarget = this.getTargetByName(sName);

			if (!pPointer || !pPointer.track) {
				return null;
			}

			return <IPositionFrame>pPointer.track.frame(math.clamp(fTime, 0, this._fDuration));
		}

		extend(pAnimation: IAnimation): void {
			var pTracks: IAnimationTrack[] = pAnimation.getTracks();

			for (var i = 0; i < pTracks.length; ++i) {
				if (!this.getTarget(pTracks[i].getTargetName())) {
					this.push(pTracks[i]);
				}
			}
		}


		toString(): string {
			if (config.DEBUG) {
				var s = super.toString();
				s += "total tracks : " + this.getTotalTracks() + "\n";

				for (var i: int = 0; i < this.getTotalTracks(); ++i) {
					s += "\t" + i + ". " + this.getTrack(i) + "\n";
				}

				return s;
			}

			return null;
		}


		static isAnimation(pAnimation: IAnimationBase): boolean {
			return pAnimation.getType() === EAnimationTypes.ANIMATION;
		}
	}


	export function createAnimation(sName?: string): IAnimation {
		return new Animation(sName);
	}
}
