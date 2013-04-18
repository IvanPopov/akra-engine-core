#ifndef UIPOPUP_TS
#define UIPOPUP_TS

#include "Component.ts"
#include "IUILayout.ts"
#include "IUIPopup.ts"

module akra.ui {
	export class Popup extends Component implements IUIPopup {
		protected $title: JQuery;
		protected $header: JQuery;
		protected $footer: JQuery;
		protected $controls: JQuery;
		protected $closeBtn: JQuery = null;

		inline get title(): string {
			return this.$title.html();
		}

		inline set title(sTitle: string) {
			this.$title.html(sTitle || "");
		}


		constructor (parent, options?, eType: EUIComponents = EUIComponents.POPUP) {
			super(parent, mergeOptions({layout: EUILayouts.UNKNOWN}, options), eType, 
				$("<div class=\"component-popup\"><div class='header'><div class=\"title\"/><div class=\"controls\"/></div></div>"));

			var pPopup = this;

			this.$header = this.el.find("div.header:first");
			this.$title = this.$header.find("div.title");
			this.$footer = $("<div class=\"footer\"/>");
			this.$controls = this.$header.find("div.controls");
			
			this.el.append(this.$footer);

			if (isDefAndNotNull(options)) {
				if (isString(options.title)) {
					this.title = options.title;
				}

				if (isString(options.controls)) {
					var pControls: string[] = options.controls.split(" ");
					for (var i = 0; i < pControls.length; ++ i) {
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

			this.el.offset({top: 0, left: 0});

			if (this.$closeBtn) {
				this.$closeBtn.click((e: IUIEvent) => { pPopup.close(); });
			}
		}

		move(e: IUIEvent): void {
			super.move(e);
			this.el.css("bottom", "auto");
		}

		close(): void {
			this.closed();
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);
			this.title = $comp.attr("title");
		}

		BROADCAST(closed, VOID);
	}

	register("Popup", Popup);
}

#endif