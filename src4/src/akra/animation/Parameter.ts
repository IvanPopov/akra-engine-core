/// <reference path="../idl/IAnimationParameter.ts" />
/// <reference path="Frame.ts" />

module akra.animation {
	export class Parameter implements IAnimationParameter {
		private _pKeyFrames: IFrame[] = [];

		 get totalFrames(): uint {
			return this._pKeyFrames.length;
		}

		 get duration(): float {
			return (<IFrame>(this._pKeyFrames.last)).time;
		}

		 get first(): float {
			return (<IFrame>(this._pKeyFrames.first)).time;
		}

		keyFrame(pFrame: IFrame): boolean {
		    var iFrame: int;

		    var pKeyFrames: IFrame[] = this._pKeyFrames;
		  	var nTotalFrames: int = pKeyFrames.length;
		    
		    if (nTotalFrames && (iFrame = this.findKeyFrame(pFrame.time)) >= 0) {
				pKeyFrames.splice(iFrame, 0, pFrame);
			}
			else {
				pKeyFrames.push(pFrame);
			}
			
			return true;
		}

		getKeyFrame(iFrame: int): IFrame {
			debug.assert(iFrame < this.totalFrames, 
				"iFrame must be less then number of total jey frames.");

			return this._pKeyFrames[iFrame];
		}

		findKeyFrame(fTime: float): int {
			var pKeyFrames: IFrame[] = this._pKeyFrames;
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

		frame(fTime: float): IFrame {
			var iKey1: int = 0, iKey2: int = 0;
			var fScalar: float;
			var fTimeDiff: float;
			
			var pKeys:  IFrame[] = this._pKeyFrames;
			var nKeys:  int = pKeys.length;
			var pFrame: IFrame = PositionFrame.temp();

			debug.assert(nKeys > 0, 'no frames :(');

			if (nKeys === 1) {
				pFrame.set(pKeys[0]);
			}
			else {
				//TODO: реализовать эвристики для бинарного поиска
				
				if(fTime >= this._pKeyFrames[nKeys - 1].time){
					iKey1 = nKeys - 1;
				}
				else {
					var p: uint = 0;
					var q: uint = nKeys - 1;

					while(p < q){
						var s:uint = (p + q) >> 1;
						var fKeyTime: float = this._pKeyFrames[s].time;

						if(fTime >= fKeyTime){
							if(fTime === fKeyTime || fTime < this._pKeyFrames[s+1].time){
								iKey1 = s;
								break;
							}

							p = s + 1;
						}
						else {
							q = s;
						}
					}
				}

			    iKey2 = (iKey1 >= (nKeys - 1))? iKey1 : iKey1 + 1;
			
			    fTimeDiff = pKeys[iKey2].time - pKeys[iKey1].time;
			    
			    if (!fTimeDiff) {
			        fTimeDiff = 1.;
			    }
				
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

	export function createParameter(): IAnimationParameter {
		return new Parameter();
	}
}
