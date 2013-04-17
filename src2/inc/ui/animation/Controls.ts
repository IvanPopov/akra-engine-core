#ifndef UIANIMATIONCONTROLS_TS
#define UIANIMATIONCONTROLS_TS

#include "IUIGraphNode.ts"
#include "IUIAnimationControls.ts"
#include "../graph/Controls.ts"
#include "Data.ts"
#include "Player.ts"
#include "Blender.ts"
#include "Mask.ts"

module akra.ui.animation {
	export class Controls extends graph.Controls implements IUIAnimationControls {
		public graph: IUIAnimationGraph;

		constructor (parent, options?) {
			super(parent, options, <IUIGraph>getUI(parent).createComponent("animation.Graph"));

			var pControlPanel: IUIComponent = this.controls;

			//var pDataBtn: IUIButton = new Button(pControlPanel, {text: "Create data"});
			var pPlayerBtn: IUIButton = new Button(pControlPanel, {text: "Create player"});
			var pBlenderBtn: IUIButton = new Button(pControlPanel, {text: "Create blender"});
			var pMaskBtn: IUIButton = new Button(pControlPanel, {text: "Create mask"});

			//this.connect(pDataBtn, SIGNAL(click), SLOT(createData));
			this.connect(pPlayerBtn, SIGNAL(click), SLOT(createPlayer));
			this.connect(pBlenderBtn, SIGNAL(click), SLOT(createBlender));
			this.connect(pMaskBtn, SIGNAL(click), SLOT(createMask));
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
	}

	register("AnimationControls", Controls);
}

#endif
