#ifndef UIVERTICAL_TS
#define UIVERTICAL_TS

#include "Layout.ts"

module akra.ui {
	export class Vertical extends Layout {
		protected $table: JQuery;

		constructor (parent) {
			super(parent, $("<div class='layout vertical'><table /></div>"), EUILayouts.VERTICAL);
			
			this.$table = this.$element.find("table:first");
		}

		renderTarget(): JQuery {
			var $trtd = $("<tr><td /></tr>");
			this.$table.append($trtd);
			return $trtd.find("> td");
		}

		removeChild(pChild: IEntity): IEntity {
			if (containsHTMLElement(pChild)) {
				var $el = (<IUIHTMLNode>pChild).$element;
				$el.parent().parent().remove();
			}

			return super.removeChild(pChild);
		}

#ifdef DEBUG
		toString(isRecursive: bool = false, iDepth: int = 0): string {
			if (!isRecursive) {
		        return '<vertical' + (this.name? " " + this.name: "") + '>';
		    }

		    return super.toString(isRecursive, iDepth);
		}
#endif
	}
}

#endif
