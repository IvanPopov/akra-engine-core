#ifndef UIHORIZONTAL_TS
#define UIHORIZONTAL_TS

#include "Layout.ts"

module akra.ui {
	export class Horizontal extends Layout {
		protected $row: JQuery;

		constructor (parent) {
			super(parent, $("<table />"), EUILayouts.HORIZONTAL);

			this.$row = this.$element.append("<tr />");
		}

		renderTarget(): JQuery {
			var $td = $("<td />");
			this.$row.append($td);
			return $td;
		}
	}
}

#endif
