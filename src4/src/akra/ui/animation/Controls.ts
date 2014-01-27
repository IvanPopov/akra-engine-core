/// <reference path="../../idl/IUIGraphNode.ts" />
/// <reference path="../../idl/IUIAnimationControls.ts" />

/// <reference path="../graph/Controls.ts" />

/// <reference path="Data.ts" />
/// <reference path="Player.ts" />
/// <reference path="Blender.ts" />
/// <reference path="Mask.ts" />

/// <reference path="../../io/Exporter.ts"

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


			var pExportBtn: IUIButton = new Button(pControlPanel, {text: "{ save controller }"})
			var pExportBinBtn: IUIButton = new Button(pControlPanel, {text: "{ save controller (binary) }"})

			////this.connect(pDataBtn, SIGNAL(click), SLOT(createData));
			//this.connect(pPlayerBtn, SIGNAL(click), SLOT(createPlayer));
			//this.connect(pBlenderBtn, SIGNAL(click), SLOT(createBlender));
			//this.connect(pMaskBtn, SIGNAL(click), SLOT(createMask));

			pPlayerBtn.click.connect(this, this.createPlayer);
			pBlenderBtn.click.connect(this, this.createBlender);
			pMaskBtn.click.connect(this, this.createMask);

			//this.connect(pExportBtn, SIGNAL(click), SLOT(exportController));
			//this.connect(pExportBinBtn, SIGNAL(click), SLOT(exportBinController));

			pExportBtn.click.connect(this, this.exportController);
			pExportBinBtn.click.connect(this, this.exportBinController);
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

		protected createExporter(): io.Exporter {
			var pExporter = new io.Exporter;
			var pController = this.graph.getController();
			var pGraphOffset = this.graph.el.offset();

			pExporter.writeController(pController);
			
			for (var i = 0; i < pController.totalAnimations; ++ i) {
				var pAnimation: IAnimationBase = pController.getAnimation(i);
				var pEntry: IAnimationBaseEntry = <IAnimationBaseEntry>pExporter.findEntry(pAnimation.guid);
				var pGraphNode: IUIAnimationNode = this.graph.findNodeByAnimation(pAnimation);

				var pOffset = pGraphNode.el.offset();

				if (!pEntry.extra) {
					pEntry.extra = {}
				}

				pEntry.extra.graph = {
					x: pOffset.left - pGraphOffset.left, 
					y: pOffset.top - pGraphOffset.top
				};
			}

			return pExporter;
		}

		exportBinController(): void {
			var pExporter = this.createExporter();
			var pController = this.graph.getController();
			pExporter.saveAs((pController.name || "untitled") + ".bson", EDocumentFormat.BINARY_JSON);
		}

		exportController(): void {
			var pExporter = this.createExporter();
			var pController = this.graph.getController();
			pExporter.saveAs((pController.name || "untitled") + ".json");
		}

		//selected(): void {
		//	super.selected();
		//	// ide.cmd(ECMD.INSPECT_ANIMATION_CONTROLLER, this.graph.getController());
		//}
	}

	register("animation.Controls", Controls);
}

