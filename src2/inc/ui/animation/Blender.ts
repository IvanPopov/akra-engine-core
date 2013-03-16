#ifndef UIANIMATIONBLENDER_TS
#define UIANIMATIONBLENDER_TS

#include "../graph/Node.ts"

module akra.ui.animation {
	export class Blender extends graph.Node {
		constructor (pGraph: IUIGraph) {
			super(pGraph, EUIGraphNodes.ANIMATION_BLENDER);
		}

		label(): string {
			return "AnimationBlender";
		}
	}

	Component.register("AnimationBlender", Blender);
}

#endif
