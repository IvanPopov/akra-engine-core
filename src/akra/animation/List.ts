/// <reference path="Base.ts" />

module akra.animation {
	export class List extends Base implements IAnimationBase {
		static isList(pAnimation: IAnimationBase): boolean {
			return pAnimation.getType() === EAnimationTypes.LIST;
		}	
	}
}

