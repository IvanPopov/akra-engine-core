#ifndef IANIMATION_TS
#define IANIMATION_TS

module akra {
	IFACE(INode);
	IFACE(IAnimationFrame);
	IFACE(IAnimationTrack);

	export interface IAnimation extends IAnimationBase {
		readonly totalTracks: int;

		push(pTrack: IAnimationTrack): void;
		attach(pTarget: INode): void;

		getTracks(): IAnimationTrack[];
		
		frame(sName: string, fTime: float): IAnimationFrame;
		extend(pAnimation: IAnimation): void;
	}
}

#endif