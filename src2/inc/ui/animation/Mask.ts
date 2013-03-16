#ifndef UIANIMATIONMASK_TS
#define UIANIMATIONMASK_TS

#include "../graph/Node.ts"

module akra.ui.animation {
	export class Mask extends graph.Node {
		constructor (pGraph: IUIGraph) {
			super(pGraph, EUIGraphNodes.ANIMATION_MASK);
		}

		label(): string {
			return "AnimationMask";
		}
	}

	Component.register("AnimationMask", Mask);
}

#endif
