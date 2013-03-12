#ifndef UIHTMLNODE_TS
#define UIHTMLNODE_TS

#include "IUIHTMLNode.ts"
#include "Node.ts"

module akra.ui {

	export class HTMLNode extends Node implements IUIHTMLNode {
		public $element: JQuery = null;


		constructor (pParent: IUINode, pElement: HTMLElement, eNodeType?: EUINodeTypes);
		constructor (pParent: IUINode, pElement: JQuery, eNodeType?: EUINodeTypes);
		constructor (pUI: IUI, pElement: HTMLElement, eNodeType?: EUINodeTypes);
		constructor (pUI: IUI, pElement: JQuery, eNodeType?: EUINodeTypes);
		constructor (parent, pElement?, eNodeType: EUINodeTypes = EUINodeTypes.HTML) {
			super(parent, eNodeType);

			var pNode: HTMLNode = this;

			this.$element = $(pElement);
			this.$element.bind(HTMLNode.EVENTS.join(' '), (e: Event) => {
				if (HTMLNode.EVENTS.indexOf(e.type) == -1) {
					return;
				}

		     	return (<any>this)[e.type](e);
			});
		}

		inline renderTarget(): JQuery {
			return this.$element;
		}

		inline getHTMLElement(): HTMLElement {
			return this.$element.get();
		}

		render(): bool;
		render(pParent: IUINode): bool;
		render(pElement: HTMLElement): bool;
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
					$to = (<IUINode>to).renderTarget();

					this.attachToParent(<IUINode>to);
				}
				else {
					$to = $(to)
				}
			}

			$to.append(this.renderTarget());

			this.rendered();

			return true;
		}

		inline isFocused(): bool {
			return this.$element.is(":focus");
		}

		valueOf(): JQuery {
			return this.$element;
		}

	
		BEGIN_EVENT_TABLE(HTMLNode);

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

			BROADCAST(rendered, VOID);

		END_EVENT_TABLE();

		static EVENTS: string[] = [
			"click",
			"dblclick",
			"mousemove",
			"mouseup",
			"mouseover",
			"mouseout",
			"focusin",
			"focusout",
			"blur",
			"change",
			"keydown",
			"keyup"
		];
	}
}

#endif