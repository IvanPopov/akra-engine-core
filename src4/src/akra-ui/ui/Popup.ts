/// <reference path="../idl/IUILayout.ts" />
/// <reference path="../idl/IUIPopup.ts" />

/// <reference path="Component.ts" />

module akra.ui {
	class MoveSignal extends Signal<{ (pNode: IUIComponent, e: IUIEvent): void; }, IUIComponent> {
		emit(e?: IUIEvent): void {
			super.emit(e);
			this.getSender().getElement().css("bottom", "auto");
		}
	}


	export class Popup extends Component implements IUIPopup {
		closed: ISignal<{ (pPopup: IUIPopup): void; }>;

		protected $title: JQuery;
		protected $header: JQuery;
		protected $footer: JQuery;
		protected $controls: JQuery;
		protected $closeBtn: JQuery = null;

		getTitle(): string {
			return this.$title.html();
		}

		setTitle(sTitle: string) {
			this.$title.html(sTitle || "");
		}


		constructor(parent, options?, eType: EUIComponents = EUIComponents.POPUP) {
			super(parent, mergeOptions({ layout: EUILayouts.UNKNOWN }, options), eType,
				$("<div class=\"component-popup\"><div class='header'><div class=\"title\"/><div class=\"controls\"/></div></div>"));

			var pPopup = this;

			this.$header = this.getElement().find("div.header:first");
			this.$title = this.$header.find("div.title");
			this.$footer = $("<div class=\"footer\"/>");
			this.$controls = this.$header.find("div.controls");

			this.getElement().append(this.$footer);

			if (isDefAndNotNull(options)) {
				if (isString(options.title)) {
					this.setTitle(options.title);
				}

				if (isString(options.controls)) {
					var pControls: string[] = options.controls.split(" ");
					for (var i = 0; i < pControls.length; ++i) {
						switch (pControls[i]) {
							case "close":
								this.$closeBtn = $("<div class=\"close-btn\"/>");
								this.$controls.append(this.$closeBtn);
								break;
						}
					}
				}
			}

			this.setDraggable(true, {
				containment: "document",
				handle: ".header"
			});

			this.getElement().offset({ top: 0, left: 0 });

			if (this.$closeBtn) {
				this.$closeBtn.click((e: IUIEvent) => { pPopup.close(); });
			}
		}

		protected setupSignals(): void {
			this.closed = this.closed || new Signal(<any>this);
			this.move = this.move || new MoveSignal(this);

			super.setupSignals();
		}

		close(): void {
			this.closed.emit();
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);
			this.setTitle($comp.attr("title"));
		}

		static MoveSignal = MoveSignal;
	}

	register("Popup", Popup);
}

