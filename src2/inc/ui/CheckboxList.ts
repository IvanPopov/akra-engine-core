#ifndef UICHECKBOXLIST_TS
#define UICHECKBOXLIST_TS

#include "IUICheckboxList.ts"
#include "Component.ts"

module akra.ui {
	export class CheckboxList extends Component implements IUICheckboxList {
		private _nSize: uint = 0;
		private _pItems: IUICheckbox[] = [];

		inline get length(): uint { return this._nSize; }

		constructor (parent, options?, eType: EUIComponents = EUIComponents.CHECKBOX_LIST) {
			super(parent, options, eType);
			this.setLayout(EUILayouts.HORIZONTAL);

			this.connect(this.layout, SIGNAL(childAdded), SLOT(_childAdded), EEventTypes.UNICAST);
		}

		//when checkbox added to childs
		update(): bool {
			var pItems: IUICheckbox[] = this._pItems;

			if (pItems.length == 0) {
				return;
			}

			pItems.first.$element.addClass("first");

			for (var i: int = 0; i < pItems.length - 1; ++ i) {
				pItems[i].$element.removeClass("last");
			};

			pItems.last.$element.addClass("last");

			return super.update();
		}

		_childAdded(pLayout: IUILayout, pNode: IUINode): void {
			if (isCheckbox(pNode)) {
				this._pItems.push(<IUICheckbox>pNode);
				this.update();
			}
		}

		_childRemoved(pLayout: IUILayout, pNode: IUINode): void {
			if (isCheckbox(pNode)) {
				var i = this._pItems.indexOf(<IUICheckbox>pNode);
				this._pItems.splice(i, 1);
				this.update();
			}
		}

		protected label(): string {
			return "CheckboxList";
		}
	}
}

#endif

