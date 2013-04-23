#ifndef UIHORIZONTAL_TS
#define UIHORIZONTAL_TS

#include "Layout.ts"

module akra.ui {
	export class Horizontal extends Layout {
		protected $row: JQuery;
		protected $table: JQuery;

		constructor (parent) {
			//style=\"margin: 0 auto;\"
			super(parent, $("<div class='layout horizontal'><table/></div>"), EUILayouts.HORIZONTAL);

			this.$table = this.$element.find("table:first");
			this.$row = $("<tr />");
			this.$table.append(this.$row);
		}

		renderTarget(): JQuery {
			var $td = $("<td />");
			this.$row.append($td);
			return $td;
		}

		removeChild(pChild: IEntity): IEntity {
			if (containsHTMLElement(pChild)) {
				(<IUIHTMLNode>pChild).$element.parent().remove();
			}

			return super.removeChild(pChild);
		}

#ifdef DEBUG
		toString(isRecursive: bool = false, iDepth: int = 0): string {
			if (!isRecursive) {
		        return '<horizontal' + (this.name? " " + this.name: "") + '>';
		    }

		    return super.toString(isRecursive, iDepth);
		}
#endif
	}
}

#endif
