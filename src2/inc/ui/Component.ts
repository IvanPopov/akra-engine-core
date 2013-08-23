#ifndef UICOMPONENT_TS
#define UICOMPONENT_TS

#include "IUIComponent.ts"
#include "DNDNode.ts"
#include "io/ajax.ts"

#include "raphael.d.ts"
#include "swig.d.ts"
#include "io/filedrop.ts"

/// @: {data}/ui/3d-party/raphael/raphael-min.js|location()|script()|data_location({data},DATA)
/// @: {data}/ui/3d-party/swig/swig.pack.min.js|location()|script()|data_location({data},DATA)
/// @: {data}/ui/css/main.css|location()|css()|data_location({data},DATA)

module akra.ui {
	swig.init({
		filters: {data: (path) => DATA(path)}
	});

	// LOG(swig.compile("{% filter data %}ui/img/switch16.png{% endfilter %}", {filename: "*"})(null));

	function _template(pNode: IUIComponent, sTemplate: string, sName: string, pData: any = null, bRenderAsNormal: bool = false, iDepth: int = 0): void {
		var fnTemplate: SwigTemplate = swig.compile(sTemplate, {filename: sName});
		var sTplData: string = fnTemplate(pData);
		var $target: JQuery = pNode.el;

		if (!isNull(pNode.layout)) {
			$target = pNode.layout.renderTarget();
		}

		$target.append(sTplData);
		$target.find("component").each(function(i: int) {
			var $comp: JQuery = $(this);
			var sType: string = $comp.attr("type");
			var sName: string = $comp.attr("name");

			if ($comp.parents("component").length > 0) {
				return;
			}

			bRenderAsNormal = $target[0] == $comp.parent()[0];

			var pComponent: IUIComponent = pNode.createComponent(sType, {show: bRenderAsNormal, name: sName});
			pComponent._createdFrom($comp);
			
			if ($comp.text().length > 0 && !$comp.attr("template")) {
				_template(pComponent, $comp.html(), sName, pData, false, iDepth + 1);
			}

			if (!bRenderAsNormal) {
				// WARNING(sTemplate);
				var $span = $("<span/>");
				$comp.before($span);

				pComponent.render($span);
				pComponent.el.unwrap();
			}

			$comp.remove();
		});
	}

	export function template(pNode: IUIComponent, sUrl: string, pData?: any): void {
		var sTemplate: string = io.ajax(sUrl, {async: false}).data;
		_template(pNode, sTemplate, sUrl, pData)
	}

	// var pFileEventListeners: any[] = [];

	// io.createFileDropArea(null, {
	// 	dragenter: (e: DragEvent): void => {
	// 		for (var i: int = 0; i < pFileEventListeners.length; ++ i) {
	// 			pFileEventListeners[i].fileDragStarted(e);
	// 		}
	// 	},
		
	// 	dragleave: (e: DragEvent): void => {
	// 		for (var i: int = 0; i < pFileEventListeners.length; ++ i) {
	// 			pFileEventListeners[i].fileDragEnded(e);
	// 		}
	// 	},

	// 	dragover: (e: DragEvent): void => {
	// 		for (var i: int = 0; i < pFileEventListeners.length; ++ i) {
	// 			pFileEventListeners[i].fileDragOver(e);
	// 		}
	// 	},

	// 	drop: (file: File, content, format?: EFileDataTypes, e?: DragEvent): void => {
	// 		for (var i: int = 0; i < pFileEventListeners.length; ++ i) {
	// 			pFileEventListeners[i].fileDroped(file, content, format, e);
	// 		}
	// 	},

	// 	format: EFileDataTypes.ARRAY_BUFFER
	// });

	
	export var COMPONENTS: { [type: string]: IUIComponentType; } = <any>{};

	export class Component extends DNDNode implements IUIComponent {
		protected _eComponentType: EUIComponents;
		protected _sGenericType: string = null;
		protected _pComponentOptions: IUIComponentOptions = null;

		inline get componentType(): EUIComponents { return this._eComponentType; }
		inline get genericType(): string { return this._sGenericType; }

		inline get name(): string { return this._sName; }
		inline set name(sName: string) {
			this.$element.attr("name", sName);
			this._sName = sName;
		}

		inline get options(): IUIComponentOptions {
			return this._pComponentOptions;
		}

		get layout(): IUILayout { return isLayout(<IUINode>this.child)? <IUILayout>this.child: null; }

		constructor (parent, sName?: string, eType?: EUIComponents, $el?: JQuery);
		constructor (parent, pOptions?: IUIComponentOptions, eType?: EUIComponents, $el?: JQuery);
		constructor (parent, options?, eType: EUIComponents = EUIComponents.UNKNOWN, $el?: JQuery) {
			super(getUI(parent), $el, EUINodeTypes.COMPONENT);

			var pOptions: IUIComponentOptions = mergeOptions(options, null);

			if (!isUI(parent)) {
				this.attachToParent(<Node>parent, (!isDef(pOptions.show) || pOptions.show == true));
			}

			this._eComponentType = eType;
			this.applyOptions(pOptions);
		}

		template(sTplName: string, pData?: any): void {
			template(this, DATA("ui/templates/" + sTplName), pData);
		}

		fromStringTemplate(sTemplate: string, pData?: any): void {
			_template(this, sTemplate, sTemplate, pData);
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component");
			this.getHTMLElement()["component"] = this;
		}

		inline isGeneric(): bool {
			return !isNull(this._sGenericType);
		}

		// handleEvent(sEvent: string): bool {
		// 	var pEvents: string[] = sEvent.split(' ');

		// 	for (var i = 0; i < pEvents.length; ++ i) {
		// 		sEvent = pEvents[i].toLowerCase();

		// 		if (HTMLNode.EVENTS.indexOf(sEvent) == -1) {
		// 			// switch (sEvent) {
		// 			// 	case "dragenter":
		// 			// 	case "dragover":
		// 			// 	case "dragleave":
		// 			// 	case "drop":
		// 			// 		var pOptions = {};
		// 			// 		var pComponent: any = this;
		// 			// 		pOptions[sEvent] = () => {pComponent[sEvent].apply(pComponent, arguments);};
		// 			// 		io.fileDropArea(this.getHTMLElement(), pOptions);
		// 			// }
		// 			switch (sEvent) {
		// 				case "fileevent": 
		// 					if (pFileEventListeners.indexOf(this) == -1) {
		// 						pFileEventListeners.push(this);
		// 					}
		// 			}
		// 		}
		// 		else {
		// 			super.handleEvent(sEvent);
		// 		}
		// 	}
		// 	return true;
		// }

		// inline disableEvent(sEvent: string): void {
		// 	super.disableEvent(sEvent);
		// }

		fileDragStarted(e: DragEvent): void {
			// LOG("fileDragStarted(", e, ")");
		}

		fileDragEnded(e: DragEvent): void {
			// LOG("fileDragEnded(", e, ")");
		}

		fileDragOver(e: DragEvent): void {
			// LOG("fileDragOver(", e, ")");
		}

		fileDroped(file: File, content: any, format?: EFileDataTypes, e?: DragEvent): void {
			// LOG(arguments);
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
				var pLayoutPrev: IUILayout = <IUILayout>this.child;
				pLayoutPrev.relocateChildren(pLayout);
				pLayoutPrev.destroy();
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

			this.name = isDef(pOptions.name)? pOptions.name: null;

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

			if (isDefAndNotNull(pOptions.events)) {
				if (isArray(pOptions.events)) {
					pOptions.events = pOptions.events.join(' ');
				}

				this.handleEvent(pOptions.events);
			}

			if (isDefAndNotNull(pOptions.parent)) {
				this.attachToParent(pOptions.parent, isDefAndNotNull(pOptions.show)? pOptions.show: true);
			}

			if (isDefAndNotNull(pOptions.template)) {
				this.template(pOptions.template);
			}

			this._pComponentOptions = pOptions;
		}

		createComponent(sType: string, pOptions?: IUIComponentOptions): IUIComponent {
			var pComp: IUIComponent = this.ui.createComponent(sType, pOptions);
			pComp.attachToParent(this, !isDefAndNotNull(pOptions) || pOptions.show !== false);
			return pComp;
		}

		_createdFrom($comp: JQuery): void {
			this.$element.attr("style", $comp.attr("style"));
			this.$element.attr("class", $comp.attr("class"));
			
			var sLayout: string = $comp.attr("layout");
			var sTemplate: string = $comp.attr("template");
			var sClick: string = $comp.attr("onclick");

			if (isString(sTemplate)) {
				this.template(sTemplate);
			}

			if (isString(sLayout)) {
				this.setLayout(sLayout);
			}

			if (isString(sClick)) {
				this.el.attr("onclick", sClick);
			}

			this.el.attr("id", "cuid-" + this.getGuid());
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

