/// <reference path="../idl/IUIHTMLNode.ts" />

/// <reference path="Node.ts" />

module akra.ui {

	class RenderedSignal extends Signal<IUIHTMLNode> {
		emit(pNode: IUIHTMLNode = null): void {
			super.emit(pNode);
			(<HTMLNode>this.getSender()).finalizeRender(pNode);
		}
	}

	export class HTMLNode extends Node implements IUIHTMLNode {

		click: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		dblclick: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;

		mousemove: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		mouseup: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		mousedown: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		mouseover: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		mouseout: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		mouseenter: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		mouseleave: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;

		focusin: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		focusout: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;

		blur: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		change: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;

		keydown: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;
		keyup: ISignal<{ (pNode: IUIHTMLNode, e: IUIEvent): void; }>;

		resize: ISignal<{ (pNode: IUIHTMLNode): void; }>;
		beforeRender: ISignal<{ (pNode: IUIHTMLNode): void; }>;
		rendered: ISignal<{ (pNode: IUIHTMLNode): void; }>;



		public $element: JQuery = null;
		protected _fnEventRedirector: Function = null;

		getElement(): JQuery { return this.$element; }

		constructor(parent, pElement?: HTMLElement, eNodeType?: EUINodeTypes);
		constructor(parent, $element?: JQuery, eNodeType?: EUINodeTypes);
		constructor(parent, pElement = null, eNodeType: EUINodeTypes = EUINodeTypes.HTML) {
			super(getUI(parent), eNodeType);

			var pNode: HTMLNode = this;
			var fnEventRedirector: Function = this._fnEventRedirector = function (e: Event) {
				if (HTMLNode.EVENTS.indexOf(e.type) == -1) {
					return;
				}

				return (<any>pNode)[e.type](e);
			}

			this.$element = $(pElement || "<div />");
			// this.$element.bind(HTMLNode.EVENTS.join(' '), fnEventRedirector);

			if (!isUI(parent)) {
				this.attachToParent(<Node>parent);
			}
		}

		protected setupSignals(): void {
			this.click = this.click || new Signal(this);
			this.dblclick = this.dblclick || new Signal(this);

			this.mousemove = this.mousemove || new Signal(this);
			this.mouseup = this.mouseup || new Signal(this);
			this.mousedown = this.mousedown || new Signal(this);
			this.mouseover = this.mouseover || new Signal(this);
			this.mouseout = this.mouseout || new Signal(this);
			this.mouseenter = this.mouseenter || new Signal(this);
			this.mouseleave = this.mouseleave || new Signal(this);

			this.focusin = this.focusin || new Signal(this);
			this.focusout = this.focusout || new Signal(this);

			this.blur = this.blur || new Signal(this);
			this.change = this.change || new Signal(this);

			this.keydown = this.keydown || new Signal(this);
			this.keyup = this.keyup || new Signal(this);

			this.resize = this.resize || new Signal(this);
			this.beforeRender = this.beforeRender || new Signal(this);
			this.rendered = this.rendered || new RenderedSignal(this);

			super.setupSignals();
		}

		handleEvent(sEvent: string): boolean {
			this.$element.bind(sEvent, this._fnEventRedirector);
			return true;
		}

		disableEvent(sEvent: string): void {
			this.$element.unbind(sEvent, <(e: IUIEvent) => any>this._fnEventRedirector);
		}

		hasRenderTarget(): boolean {
			return true;
		}

		renderTarget(): JQuery {
			return this.$element;
		}

		getHTMLElement(): HTMLElement {
			return this.$element.get()[0];
		}

		render(): boolean;
		render(pParent: IUINode): boolean;
		render(pElement: HTMLElement): boolean;
		render(pElement: JQuery): boolean;
		render(sSelector: string): boolean;
		render(to?): boolean {
			var $to = $body;
			var pTarget: IUINode = null;

			if (!isDef(to)) {
				pTarget = this.findRenderTarget();
				$to = isNull(pTarget) ? $to : pTarget.renderTarget();
			}
			else {
				if (to instanceof Node) {
					if (this.getParent() != <IUINode>to) {
						return this.attachToParent(<IUINode>to);
					}

					$to = (<IUINode>to).renderTarget();
				}
				else {
					$to = $(to)
				}
			}

			this.beforeRender.emit();

			//trace($to, this.self());
			$to.append(this.self());

			this.rendered.emit();

			return true;
		}

		attachToParent(pParent: IUINode, bRender: boolean = true): boolean {
			if (super.attachToParent(pParent)) {
				if (bRender && !this.isRendered()) {
					this.render(pParent);
				}
				return true;
			}
			return false;
		}

		isFocused(): boolean {
			return !isNull(this.$element) && this.$element.is(":focus");
		}

		isRendered(): boolean {
			//console.log((<any>new Error).stack)
			return !isNull(this.$element) && this.$element.parent().length > 0;
		}

		destroy(bRecursive?: boolean, bPromoteChildren?: boolean): void {
			super.destroy(bRecursive, bPromoteChildren);
			this.$element.remove();
		}

		width(): uint {
			return this.$element.width();
		}

		height(): uint {
			return this.$element.height();
		}

		valueOf(): JQuery {
			return this.$element;
		}

		hide(): void {
			this.getElement().hide();
		}

		show(): void {
			this.getElement().show();
		}

		protected self(): JQuery {
			return this.$element;
		}

		protected finalizeRender(pNode?: IUIHTMLNode): void {

		}

		private static EVENTS: string[] = [
			"click",
			"dblclick",
			"mousemove",
			"mouseup",
			"mousedown",
			"mouseover",
			"mouseout",
			"mouseenter",
			"mouseleave",
			"focusin",
			"focusout",
			"blur",
			"change",
			"keydown",
			"keyup",
			"resize"
		];

		static RenderedSignal: typeof Signal = RenderedSignal;
	}
}

