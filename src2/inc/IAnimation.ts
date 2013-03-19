#ifndef IANIMATION_TS
#define IANIMATION_TS

#include "IAnimationBase.ts"

module akra {
	IFACE(ISceneNode);
	IFACE(IAnimationFrame);
	IFACE(IAnimationTrack);

	export interface IAnimation extends IAnimationBase {
		readonly totalTracks: int;

		push(pTrack: IAnimationTrack): void;
		attach(pTarget: ISceneNode): void;

		getTracks(): IAnimationTrack[];
		getTrack(i: int): IAnimationTrack;
		
		frame(sName: string, fTime: float): IAnimationFrame;
		extend(pAnimation: IAnimation): void;
	}
}

#endif