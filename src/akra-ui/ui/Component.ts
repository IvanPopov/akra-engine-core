/// <reference path="../idl/IUIComponent.ts" />

/// <reference path="DNDNode.ts" />

/// <reference path="../idl/3d-party/raphael.d.ts" />
/// <reference path="../idl/3d-party/swig.d.ts" />


/// @: {data}/ui/3d-party/raphael/raphael-min.js|location()|script()|data_location({data},DATA)
/// @: {data}/ui/3d-party/swig/swig.pack.min.js|location()|script()|data_location({data},DATA)
/// @: {data}/ui/css/main.css|location()|css()|data_location({data},DATA)

module akra.ui {
	swig.init({
		filters: {
			data: (path) => config.data + path
		}
	});

	// LOG(swig.compile("{% filter data %}ui/img/switch16.png{% endfilter %}", {filename: "*"})(null));

	function _template(pNode: IUIComponent, sTemplate: string, sName: string, pData: any = null, bRenderAsNormal: boolean = false, iDepth: int = 0): void {
		var fnTemplate: SwigTemplate = swig.compile(sTemplate, { filename: sName });
		var sTplData: string = fnTemplate(pData);
		var $target: JQuery = pNode.getElement();

		if (!isNull(pNode.getLayout())) {
			$target = pNode.getLayout().renderTarget();
		}

		$target.append(sTplData);
		$target.find("component").each(function (i: int) {
			var $comp: JQuery = $(this);
			var sType: string = $comp.attr("type");
			var sName: string = $comp.attr("name");

			if ($comp.parents("component").length > 0) {
				return;
			}

			bRenderAsNormal = $target[0] == $comp.parent()[0];

			var pComponent: IUIComponent = pNode.createComponent(sType, { show: bRenderAsNormal, name: sName });
			pComponent._createdFrom($comp);

			if ($comp.text().length > 0 && !$comp.attr("template")) {
				_template(pComponent, $comp.html(), sName, pData, false, iDepth + 1);
			}

			if (!bRenderAsNormal) {
				// logger.warn(sTemplate);
				var $span = $("<span/>");
				$comp.before($span);

				pComponent.render($span);
				pComponent.getElement().unwrap();
			}

			$comp.remove();
		});
	}

	export function template(pNode: IUIComponent, sUrl: string, pData?: any): void {
		var sTemplate: string = ajax(sUrl, { async: false }).data;
		_template(pNode, sTemplate, sUrl, pData)
	}

	export var COMPONENTS: { [type: string]: typeof Component; } = <any>{};


	export class Component extends DNDNode implements IUIComponent {
		protected _eComponentType: EUIComponents;
		protected _sGenericType: string = null;
		protected _pComponentOptions: IUIComponentOptions = null;

		getComponentType(): EUIComponents { return this._eComponentType; }
		getGenericType(): string { return this._sGenericType; }

		getName(): string { return this._sName; }
		setName(sName: string): void {
			this.$element.attr("name", sName);
			this._sName = sName;
		}

		getOptions(): IUIComponentOptions {
			return this._pComponentOptions;
		}

		getLayout(): IUILayout { return isLayout(<IUINode>this.getChild()) ? <IUILayout>this.getChild() : null; }

		constructor(parent, sName?: string, eType?: EUIComponents, $el?: JQuery);
		constructor(parent, pOptions?: IUIComponentOptions, eType?: EUIComponents, $el?: JQuery);
		constructor(parent, options?, eType: EUIComponents = EUIComponents.UNKNOWN, $el?: JQuery) {
			super(getUI(parent), $el, EUINodeTypes.COMPONENT);

			var pOptions: IUIComponentOptions = mergeOptions(options, null);

			if (!isUI(parent)) {
				this.attachToParent(<Node>parent, (!isDef(pOptions.show) || pOptions.show == true));
			}

			this._eComponentType = eType;
			this.applyOptions(pOptions);
		}


		template(sTplName: string, pData?: any): void {
			template(this, config.data + "ui/templates/" + sTplName, pData);
		}

		fromStringTemplate(sTemplate: string, pData?: any): void {
			_template(this, sTemplate, sTemplate, pData);
		}

		//will be called after the rendering signal will be emitted.
		protected finalizeRender(pNode?: IUIHTMLNode): void {
			this.getElement().addClass("component");
			this.getHTMLElement()["component"] = this;
		}

		isGeneric(): boolean {
			return !isNull(this._sGenericType);
		}

		setLayout(eType: EUILayouts): boolean;
		setLayout(sType: string): boolean;
		setLayout(type): boolean {
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

			var pLayout: IUILayout = this.getUI().createLayout(eType);

			if (isLayout(<IUINode>this.getChild())) {
				var pLayoutPrev: IUILayout = <IUILayout>this.getChild();
				pLayoutPrev.relocateChildren(pLayout);
				pLayoutPrev.destroy();
			}

			this.relocateChildren(pLayout);

			return pLayout.render(this);
		}

		attachToParent(pParent: IUINode, bRender: boolean = true): boolean {
			if (isComponent(pParent) && isLayout(pParent.getChild()) && !isLayout(pParent)) {
				// console.log("redirected to layout ------>", pParent.toString(true));
				pParent = <IUINode>pParent.getChild();
			}

			return super.attachToParent(pParent, bRender);
		}

		protected applyOptions(pOptions: IUIComponentOptions): void {
			if (!isDefAndNotNull(pOptions)) {
				return;
			}

			var $element: JQuery = this.getElement();

			this.setName(isDef(pOptions.name) ? pOptions.name : null);

			if (isDefAndNotNull(pOptions.html)) {
				$element.html(pOptions.html);
			}

			if (isDefAndNotNull(pOptions.css)) {
				logger.log(pOptions.css);
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
				this.attachToParent(pOptions.parent, isDefAndNotNull(pOptions.show) ? pOptions.show : true);
			}

			if (isDefAndNotNull(pOptions.template)) {
				this.template(pOptions.template);
			}

			this._pComponentOptions = pOptions;
		}

		createComponent(sType: string, pOptions?: IUIComponentOptions): IUIComponent {
			var pComp: IUIComponent = this.getUI().createComponent(sType, pOptions);
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
				this.getElement().attr("onclick", sClick);
			}

			this.getElement().attr("id", "cuid-" + this.guid);
		}


		toString(isRecursive: boolean = false, iDepth: int = 0): string {
			if (!isRecursive) {
				return (this.isGeneric() ? "<generic-" + this.getGenericType() : "<component-" + "*") +
					(this.getName() ? " " + this.getName() : "") + ">";
			}

			return super.toString(isRecursive, iDepth);
		}
	}

	export function register(sType: string, pComponent: typeof Component): void {
		COMPONENTS[sType] = pComponent;
	}

	export function isComponent(pEntity: IEntity, eComponent?: EUIComponents): boolean {
		if (!isUINode(pEntity) || (<IUINode>pEntity).getNodeType() !== EUINodeTypes.COMPONENT) {
			return false;
		}

		if (arguments.length > 1) {
			return (<IUIComponent>pEntity).getComponentType() === eComponent;
		}

		return true;
	}

	export function isGeneric(pEntity: IEntity): boolean {
		return isComponent(pEntity) && (<IUIComponent>pEntity).isGeneric();
	}

	export function mergeOptions(sNameLeft: string, pOptionsRight: IUIComponentOptions): IUIComponentOptions;
	export function mergeOptions(sNameLeft: string, sNameRight: string): IUIComponentOptions;
	export function mergeOptions(pOptionsLeft: IUIComponentOptions, pOptionsRight: IUIComponentOptions): IUIComponentOptions;
	export function mergeOptions(left, right): IUIComponentOptions {
		var pOptionsLeft: IUIComponentOptions;
		var pOptionsRight: IUIComponentOptions;

		if (isString(left)) {
			pOptionsLeft = { name: <string>left };
		}
		else {
			pOptionsLeft = <IUIComponentOptions>left || <IUIComponentOptions>{};
		}

		if (isString(right)) {
			pOptionsRight = { name: <string>right };
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


