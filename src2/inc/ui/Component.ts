#ifndef UICOMPONENT_TS
#define UICOMPONENT_TS

#include "IUIComponent.ts"
#include "DNDNode.ts"
#include "io/ajax.ts"

/// @dep ../data/ui
/// @css ui/css/main.css

module akra.ui {
	export var COMPONENTS: { [type: string]: IUIComponentType; } = <any>{};

	export class Component extends DNDNode implements IUIComponent {
		protected _eComponentType: EUIComponents;
		protected _sGenericType: string = null;

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

			this._eComponentType = eType;
			this.applyOptions(mergeOptions(options, null));
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component");
		}

		inline isGeneric(): bool {
			return !isNull(this._sGenericType);
		}

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

		protected applyOptions(pOptions: IUIComponentOptions): void {
			if (!isDefAndNotNull(pOptions)) {
				return;
			}

			var $element: JQuery = this.el;

			this.name = pOptions.name || null;

			if (isDefAndNotNull(pOptions.html)) {
				$element.html(pOptions.html);
			}

			if (isDefAndNotNull(pOptions.css)) {
				LOG(pOptions.css);
		    	$element.css(pOptions.css);
		    }

		    if (isDefAndNotNull(pOptions.class)) {
		    	$element.addClass(pOptions.class);
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

			if (isDefAndNotNull(pOptions.dragZone)) {
				$element.draggable("option", "containment", pOptions.dragZone);
			}
		}

#ifdef DEBUG
		toString(isRecursive: bool = false, iDepth: int = 0): string {
			if (!isRecursive) {
		        return (this.isGeneric()? "<generic-" + this.genericType : "<component-" + "*") +
		        	 (this.name? " " + this.name: "") + ">";
		    }

		    return super.toString(isRecursive, iDepth);
		}
#endif

	}

	export inline function register(sType: string, pComponent: IUIComponentType): void {
		COMPONENTS[sType] = pComponent;
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

	export function mergeOptions(sNameLeft: string, pOptionsRight: IUIComponentOptions): IUIComponentOptions;
	export function mergeOptions(sNameLeft: string, sNameRight: string): IUIComponentOptions;
	export function mergeOptions(pOptionsLeft: IUIComponentOptions, pOptionsRight: IUIComponentOptions): IUIComponentOptions;
	export function mergeOptions(left, right): IUIComponentOptions {
		var pOptionsLeft: IUIComponentOptions;
		var pOptionsRight: IUIComponentOptions;
		
		if (isString(left)) {
			pOptionsLeft = {name: <string>left};
		}
		else {
			pOptionsLeft = <IUIComponentOptions>left || <IUIComponentOptions>{};
		}

		if (isString(right)) {
			pOptionsRight = {name: <string>right};
		}
		else {
			pOptionsRight = <IUIComponentOptions>right || <IUIComponentOptions>{};
		}

		for (var sOpt in pOptionsRight) {
			pOptionsLeft[sOpt] = pOptionsRight[sOpt];
		}

		return pOptionsLeft;
	}
}

#endif

