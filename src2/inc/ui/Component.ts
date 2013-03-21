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
			TEMPLATES[$(this).attr("type")] = $(this).html();
		});
	}

	io.ajax({
		url: "ui/templates/components.html",
		async: false,		
		success: (sData?: string): void => {
			loadTemplate(sData);
		}
	});

	export var COMPONENTS: { [type: string]: IUIComponentType; } = <any>{};

	export class Component extends DNDNode implements IUIComponent {
		protected _eComponentType: EUIComponents;
		protected _sGenericType: string = null;

		// protected $renderTo: JQuery = null;

		inline get componentType(): EUIComponents { return this._eComponentType; }
		inline get genericType(): string { return this._sGenericType; }

		inline get name(): string { return this._sName; }
		inline set name(sName: string) {
			this.$element.attr("name", sName);
			this._sName = sName;
		}

		get layout(): IUILayout { return isLayout(<IUINode>this.child)? <IUILayout>this.child: null; }

		constructor (parent, sName?: string, eType?: EUIComponents, $el?: JQuery);
		constructor (parent, pOptions?: IUIComponentOptions, eType?: EUIComponents, $el?: JQuery);
		constructor (parent, options?, eType: EUIComponents = EUIComponents.UNKNOWN, $el?: JQuery) {
			super(parent, $el, EUINodeTypes.COMPONENT);

			var pOptions: IUIComponentOptions = isString(options)? { name: <string>options }: options;
			
			this._eComponentType = eType;
			this.applyOptions(pOptions);
			
			this.$element.addClass(this.computeStyle());

			var sTemplate: string = TEMPLATES[this.genericType || this.label()];

			if (isDefAndNotNull(sTemplate)) { 
				this.$element.html(sTemplate);

				var pComponents: JQuery[] = Component.extractComponents(this.$element);
			
				for (var i: int = 0; i < pComponents.length; i ++) {
					var $component: JQuery = $(pComponents[i]);
					var sCompType: string = $component.attr("type");
					var sTempTpl: string = TEMPLATES[sCompType] || "";

					TEMPLATES[sCompType] = sTempTpl + $component.html();

					var pComp: Component = <Component>this.ui.createComponent(sCompType);

					if (!pComp.attachToParent(this, false)) {
						debug_print("try to attach ", pComp, "to parent", this);
						CRITICAL("cannot assemble template component hierarchy");
					}

					TEMPLATES[sCompType] = sTempTpl;

					$component.before(pComp.$element);
					$component.remove();
					
					pComp._applyEntry($component);
					pComp.rendered();
				}

				var $layouts: JQuery = this.$element.find("layout");

				for (var i: int = 0, pLayout = null; i < $layouts.length; i ++) {
					var $layout: JQuery = $($layouts[i]);
					var sLayoutType: string = $layout.attr("type");
					//var sLayoutType: string = $layout.attr("type");
					var sAlign: string= $layout.attr("align");
					var sStyle: string = $layout.attr("style");

					var pLayout: IUIComponent = this.ui.createLayout(sLayoutType/*, {type: sLayoutType}*/);

					if (!pLayout.attachToParent(this, false)) {
						debug_print("try to attach ", pLayout, "to parent", this);
						CRITICAL("cannot assemble template layout hierarchy");
					}

					$layout.before(pLayout.$element);
					$layout.remove();
					pLayout.$element.addClass("layout");
					pLayout.$element.attr("style", sStyle);
					pLayout.rendered();

					//pLayout.render();

					if (isDefAndNotNull(sAlign)) {
						pLayout.$element.attr("align", sAlign);
					}
				}	
			}

			// if ((pOptions && !!pOptions.show) || !isNull(this.parent)) {
			// 	this.render();
			// }
		}

		_applyEntry($entry: JQuery): void {
			var sClasses: string = $entry.attr("class");
			var sHtml: string = $entry.attr("text");

			if(isDef(sHtml)) {
				this.$element.attr("text", sHtml);
			}

			if (isDef(sClasses)) {
				this.$element.addClass(sClasses);
			}
		}


		inline isGeneric(): bool {
			return !isNull(this._sGenericType);
		}

		renderTarget(): JQuery {
			// if (isLayout(<IUINode>this.child) && (<IUIHTMLNode>this.child).isRendered()) {
			// 	return (<IUINode>this.child).renderTarget();
			// }

			return this.$element;
		}

		// render(to?): bool {
		// 	if (!isNull(to) && !isNull(this.$renderTo) && <IEntity>to === this.parent) {
		// 		to = this.$renderTo;
		// 		console.log("----->", to);
		// 	}

		// 	return super.render(to);
		// }

		setLayout(eType: EUILayouts): bool;
		setLayout(sType: string): bool;
		setLayout(type): bool {
			var eType: EUILayouts = EUILayouts.UNKNOWN;

			if (isString(type)) {
				switch ((<string>type).toLowerCase()) {
					case "horizontal":
						eType = EUILayouts.HORIZONTAL;
						break;
					case "vertical":
						eType = EUILayouts.VERTICAL;
						break;
				}
			}
			else {
				eType = <EUILayouts>type;
			}
			
			var pLayout: IUILayout = this.ui.createLayout(eType);

			if (isLayout(<IUINode>this.child)) {
				ERROR("//TODO: LAYOUT");
			}

			this.relocateChildren(pLayout);

			return pLayout.render(this);
		}

		attachToParent(pParent: IUINode, bRender: bool = true): bool {
			if (isComponent(pParent) && isLayout(pParent.child) && !isLayout(pParent)) {
				// console.log("redirected to layout ------>", pParent.toString(true));
				pParent = <IUINode>pParent.child;
			}

			return super.attachToParent(pParent, bRender);
		}

		protected computeStyle(): string {
			if (this.isGeneric()) {
				return Component.className(this.label()) +  " " + Component.className(this.genericType);
			}

			var pClassReference: any = (<any>this).constructor.prototype;
			var sStyle: string = "";

			while (pClassReference !== Component.prototype["__proto__"]) {
				sStyle = Component.className(pClassReference.label()) + " " + sStyle;
				pClassReference = pClassReference["__proto__"];
			}

			return sStyle;
		}

		protected label(): string {
			return "Component";
		}

		protected applyOptions(pOptions: IUIComponentOptions): void {
			if (!isDefAndNotNull(pOptions)) {
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

		    if (isDefAndNotNull(pOptions.layout)) {
		    	this.setLayout(pOptions.layout);
		    }

		    if (isString(pOptions.generic)) {
		    	this._sGenericType = <string>pOptions.generic;
		    }

		 //    if (isDefAndNotNull(pOptions.renderTo)) {
			// 	this.$renderTo = <JQuery>pOptions.renderTo;
			// 	console.log("renderTo > ", this.$renderTo)
			// }

			if (isDefAndNotNull(pOptions.dragZone)) {
				$element.draggable("option", "containment", pOptions.dragZone);
			}
		}

#ifdef DEBUG
		toString(isRecursive: bool = false, iDepth: int = 0): string {
			if (!isRecursive) {
		        return (this.isGeneric()? "<generic-" + this.genericType : "<component-" + this.label()) +
		        	 (this.name? " " + this.name: "") + ">";
		    }

		    return super.toString(isRecursive, iDepth);
		}
#endif

		static extractComponents($element: JQuery, pComponents: JQuery[] = []): JQuery[] {
			var $elements: JQuery = $element.children();

			for (var i: int = 0; i < $elements.length; ++ i) {
				$element = $($elements[i]);

				if ($element.prop("tagName").toLowerCase() !== "component") {
					Component.extractComponents($element, pComponents);
				}
				else {
					pComponents.push($element);
				}
			}

			return pComponents;
		}

		static className(sComponent: string): string {
			if (isNull(sComponent)) {
				return "";
			}

			if (sComponent == "Component") {
				return "component";
			}

			return "component-" + sComponent.toLowerCase();
		}

		static register(sType: string, pComponent: IUIComponentType): void {
			COMPONENTS[sType] = pComponent;
		}

	}

	export function isComponent(pEntity: IEntity, eComponent?: EUIComponents): bool {
		if (!isUINode(pEntity) || (<IUINode>pEntity).nodeType !== EUINodeTypes.COMPONENT) {
			return false;
		}

		if (arguments.length > 1) {
			return (<IUIComponent>pEntity).componentType === eComponent;
		}

		return true;
	}

	export inline function isGeneric(pEntity: IEntity): bool {
		return isComponent(pEntity) && (<IUIComponent>pEntity).isGeneric();
	}
}

#endif

