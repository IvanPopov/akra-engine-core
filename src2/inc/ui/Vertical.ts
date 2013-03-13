#ifndef UIVERTICAL_TS
#define UIVERTICAL_TS

#include "Layout.ts"

module akra.ui {
	export class Vertical extends Layout {
		protected $row: JQuery;

		constructor (parent) {
			super(parent, $("<table />"), EUILayouts.VERTICAL);
		}

		renderTarget(): JQuery {
			var $trtd = $("<tr><td /></tr>");
			this.$element.append($trtd);
			return $trtd.find("> td");
		}
	}
}

#endif
