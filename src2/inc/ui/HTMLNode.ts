#ifndef UIHTMLNODE_TS
#define UIHTMLNODE_TS

#include "IUIHTMLNode.ts"
#include "ui/Node.ts"

module akra.ui {

	export class HTMLNode extends Node implements IUIHTMLNode {
		public $element: JQuery = null;


		inline get el(): JQuery { return this.$element; }

		constructor (parent, pElement?: HTMLElement, eNodeType?: EUINodeTypes);
		constructor (parent, $element?: JQuery, eNodeType?: EUINodeTypes);
		constructor (parent, pElement = null, eNodeType: EUINodeTypes = EUINodeTypes.HTML) {
			super(getUI(parent), eNodeType);

			var pNode: HTMLNode = this;

			this.$element = $(pElement || "<div />");
			this.$element.bind(HTMLNode.EVENTS.join(' '), (e: Event) => {
				if (HTMLNode.EVENTS.indexOf(e.type) == -1) {
					return;
				}

		     	return (<any>this)[e.type](e);
			});

			//this.$element.mousedown((e: IUIEvent) => { pNode.mousedown(e); });

			if (!isUI(parent)) {
				this.attachToParent(<Node>parent);
			}
		}

		hasRenderTarget(): bool {
			return true;
		}

		renderTarget(): JQuery {
			return this.$element;
		}

		inline getHTMLElement(): HTMLElement {
			return this.$element.get()[0];
		}

		render(): bool;
		render(pParent: IUINode): bool;
		render(pElement: HTMLElement): bool;
		render(pElement: JQuery): bool;
		render(sSelector: string): bool;
		render(to?): bool {
			var $to = $body;
			var pTarget: IUINode = null;

			if (!isDef(to)) {
				pTarget = this.findRenderTarget();
				$to = isNull(pTarget)? $to: pTarget.renderTarget();
			}
			else {
				if (to instanceof Node) {
					if (this.parent != <IUINode>to) {
						return this.attachToParent(<IUINode>to);
					}

					$to = (<IUINode>to).renderTarget();
				}
				else {
					$to = $(to)
				}
			}

			this.beforeRender();

			//trace($to, this.self());
			$to.append(this.self());

			this.rendered();

			return true;
		}

		attachToParent(pParent: IUINode, bRender: bool = true): bool {
			if (super.attachToParent(pParent)) {
				if (bRender && !this.isRendered()) {
					this.render(pParent);
				}
				return true;
			}
			return false;
		}

		isFocused(): bool {
			return !isNull(this.$element) && this.$element.is(":focus");
		}

		isRendered(): bool {
			//console.log((<any>new Error).stack)
			return !isNull(this.$element) && this.$element.parent().length > 0;
		}

		destroy(): void {
			super.destroy();
			this.$element.remove();
		}

		inline width(): uint {
			return this.$element.width();
		}

		inline height(): uint {
			return this.$element.height();
		}

		valueOf(): JQuery {
			return this.$element;
		}


		protected self(): JQuery {
			return this.$element;
		}

		BROADCAST(click, CALL(e));
		BROADCAST(dblclick, CALL(e));
		
		BROADCAST(mousemove, CALL(e));
		BROADCAST(mouseup, CALL(e));
		BROADCAST(mousedown, CALL(e));
		BROADCAST(mouseover, CALL(e));
		BROADCAST(mouseout, CALL(e));
		
		BROADCAST(focusin, CALL(e));
		BROADCAST(focusout, CALL(e));
		
		BROADCAST(blur, CALL(e));
		BROADCAST(change, CALL(e));

		BROADCAST(keydown, CALL(e));
		BROADCAST(keyup, CALL(e));

		BROADCAST(resize, VOID);
		BROADCAST(rendered, VOID);
		BROADCAST(beforeRender, VOID);


		static EVENTS: string[] = [
			"click",
			"dblclick",
			"mousemove",
			"mouseup",
			"mousedown",
			"mouseover",
			"mouseout",
			"focusin",
			"focusout",
			"blur",
			"change",
			"keydown",
			"keyup",
			"resize"
		];
	}
}

#endif