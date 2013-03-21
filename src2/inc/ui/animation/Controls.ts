#ifndef UIANIMATIONCONTROLS_TS
#define UIANIMATIONCONTROLS_TS

#include "IUIGraphNode.ts"
#include "../graph/Controls.ts"
#include "Data.ts"
#include "Player.ts"
#include "Blender.ts"
#include "Mask.ts"

module akra.ui.animation {
	export class Controls extends graph.Controls {

		constructor (parent) {
			super(parent);

			var pControlPanel: IUIComponent = this.controls;

			var pNodeBtn: IUIButton = new Button(pControlPanel, {text: "Create graph node"});
			var pDataBtn: IUIButton = new Button(pControlPanel, {text: "Create data"});
			var pPlayerBtn: IUIButton = new Button(pControlPanel, {text: "Create player"});
			var pBlenderBtn: IUIButton = new Button(pControlPanel, {text: "Create blender"});
			var pMaskBtn: IUIButton = new Button(pControlPanel, {text: "Create mask"});

			this.connect(pNodeBtn, SIGNAL(click), SLOT(createNode));
			this.connect(pDataBtn, SIGNAL(click), SLOT(createData));
			this.connect(pPlayerBtn, SIGNAL(click), SLOT(createPlayer));
			this.connect(pBlenderBtn, SIGNAL(click), SLOT(createBlender));
			this.connect(pMaskBtn, SIGNAL(click), SLOT(createMask));
		}	

		createNode(): IUIGraphNode {
			return new graph.Node(this.graph);
		}

		createData(): IUIAnimationNode {
			return new Data(this.graph);
		}

		createPlayer(): IUIAnimationNode {
			return new Player(this.graph);
		}

		createBlender(): IUIAnimationNode {
			return new Blender(this.graph);
		}

		createMask(): IUIAnimationNode {
			return new Mask(this.graph);
		}

		label(): string {
			return "AnimationControls";
		}
	}

	Component.register("AnimationControls", Controls);
}

#endif
