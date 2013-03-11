#ifndef UICOMPONENT_TS
#define UICOMPONENT_TS

#include "IUIComponent.ts"
#include "DNDNode.ts"
#include "io/ajax.ts"

/// @dep ../data/ui
/// @css ui/css/main.css

module akra.ui {
	export const TEMPLATES: StringMap = <StringMap>{};

	export function loadTemplate(sData: string): void {
		$("<div/>").html(sData).find("> component").each(function(i: int) {
			TEMPLATES[$(this).attr("name")] = $(this).html();
		});
	}

	io.ajax({
		url: "ui/templates/templates.html",
		async: false,		
		success: (sData?: string): void => {
			loadTemplate(sData);
		}
	});

	export class Component extends DNDNode implements IUIComponent {
		protected _eComponentType: EUIComponents;

		inline get componentType(): EUIComponents { return this._eComponentType; }

		constructor (pParent: IUINode, pOptions?: IUIComponentOptions, eType?: EUIComponents, $el?: JQuery);
		constructor (pUI: IUI, pOptions?: IUIComponentOptions, eType?: EUIComponents, $el?: JQuery);
		constructor (parent, pOptions: IUIComponentOptions = null, 
			eType: EUIComponents = EUIComponents.UNKNOWN, $el: JQuery = $("<div />")) {
			super(parent, $el.get(), EUINodeTypes.COMPONENT);

			this._eComponentType = eType;
			this.applyOptions(pOptions);
			this.$element.addClass(this.computeStyle());

			var sTemplate: string = TEMPLATES[this.label()];

			if (isDefAndNotNull(sTemplate)) { 
				this.$element.html(sTemplate);

				var pComponents: any[] = [];
				var $element: JQuery = this.$element;

				repeat:
				while (!isNull($element)) {
					var $elements: JQuery = null;

					$elements = $element.children();
					for (var i = 0; i < $elements.length; ++ i) {
						if ($($elements[i]).prop("tagName") !== "component") {
							$element = $($elements[i]);
							continue repeat;
						}
						else {
							pComponents.push($element);
						}
					}

					break;
				}

				for (var i: int = 0; i < pComponents.length; i ++) {
					var $component: JQuery = $(pComponents[i]);
					var sCompName: string = $component.attr("name");
					var sClasses: string = $component.attr("class");
					var sHtml: string = $component.attr("text");
					var sTempTpl: string = TEMPLATES[sCompName] || "";

					TEMPLATES[sCompName] = sTempTpl + $component.html();
					
					var pComp: Component = <Component>this.ui.createComponent(sCompName);
					pComp.attachToParent(this);
					
					TEMPLATES[sCompName] = sTempTpl;

					pComponents[i].before(pComp.$element);
					pComponents[i].remove();
					pComp.render(null);

					if(isDef(sHtml)) {
						pComp.$element.attr("text", sHtml);
					}

					if (isDef(sClasses)) {
						pComp.$element.addClass(sClasses);
					}
				}

				var $layouts: JQuery = this.$element.find("layout");

				for (var i: int = 0, pLayout = null; i < $layouts.length; i ++) {
					var $layout: JQuery = $($layouts[i]);
					var sLayoutName: string = $layout.attr("name");
					var sLayoutType: string = $layout.attr("type");
					var sAlign: string= $layout.attr("align");

					var pLayout: IUIComponent = this.ui.createComponent(sLayoutName);

					$layout.before(pLayout.renderTarget());
					$layout.remove();

					pLayout.render(null);

					if (isDefAndNotNull(sAlign)) {
						pLayout.align(sAlign);
					}
				}	
			}

			if (pOptions.show === true || !isNull(this.parent)) {
				this.render();
			}
		}

		// inline renderTarget(): JQuery {

		// }	

		attachToParent(pParent: IUINode): bool {
			if (!super.attachToParent(pParent)) {
				return false;
			}

			this.render(pParent);

			return true;
		}

		destroy(): void {
			this.$element.remove();

			super.destroy();
		}

		protected computeStyle(): string {
			return isNull(super.label())? this.className(): super.className() + " " + this.className();
		}

		protected label(): string {
			return "Component";
		}

		protected applyOptions(pOptions: IUIComponentOptions): void {
			if (isNull(pOptions)) {
				return;
			}

			var $element: JQuery = this.renderTarget();

			this.name = pOptions.name || null;

			if (isDefAndNotNull(pOptions.html)) {
				$element.html(pOptions.html);
			}

			if (isDefAndNotNull(pOptions.css)) {
		    	$element.css(pOptions.css);
		    }

		    if (isDefAndNotNull(pOptions.width)) {
		    	$element.width(pOptions.width);
		    }

		    if (isDefAndNotNull(pOptions.height)) {
		    	$element.height(pOptions.height);
		    }

		    if (isDefAndNotNull(pOptions.draggable)) {
		    	this.setDraggable(pOptions.draggable);
		    }

		 //    if (isDefAndNotNull(pOptions.renderTo)) {
			// 	this.$renderTo = Component.determRenderTarget(pOptions.renderTo);
			// }

			if (isDefAndNotNull(pOptions.dragZone)) {
				$element.draggable("option", "containment", pOptions.dragZone);
			}
		}
	}



}

#endif

