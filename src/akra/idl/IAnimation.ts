
/// <reference path="IAnimationBase.ts" />


/// <reference path="ISceneNode.ts" />
/// <reference path="IPositionFrame.ts" />
/// <reference path="IAnimationTrack.ts" />

module akra {
	export interface IAnimation extends IAnimationBase {
		getTotalTracks(): int;
	
		push(pTrack: IAnimationTrack): void;
		attach(pTarget: ISceneNode): void;
	
		getTracks(): IAnimationTrack[];
		getTrack(i: int): IAnimationTrack;
		
		frame(sName: string, fTime: float): IPositionFrame;
		extend(pAnimation: IAnimation): void;
	}
	
}
