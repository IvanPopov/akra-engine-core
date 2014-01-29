/// <reference path="../idl/IUICheckboxList.ts" />
/// <reference path="Component.ts" />

module akra.ui {
	export class CheckboxList extends Component implements IUICheckboxList {
		changed: ISignal<{ (pList: IUICheckboxList, pCheckbox: IUICheckbox): void; }>;

		private _nSize: uint = 0;
		private _pItems: IUICheckbox[] = [];
		private _bMultiSelect: boolean = false;
		private _bLikeRadio: boolean = false;

		getLength(): uint { return this._nSize; }
		isRadio(): boolean { return this._bLikeRadio; }
		setRadio(b: boolean): void { this._bLikeRadio = b; }
		getItems(): IUICheckbox[] { return this._pItems; }

		isChecked(): IUICheckbox {
			for (var i: int = 0; i < this._pItems.length; ++i) {
				if (this._pItems[i].isChecked()) {
					return this._pItems[i];
				}
			}

			return null;
		}

		constructor(parent, options?, eType: EUIComponents = EUIComponents.CHECKBOX_LIST) {
			super(parent, options, eType);

			this.setLayout(EUILayouts.HORIZONTAL);

			this.getLayout().childAdded.connect(this, this._childAdded, EEventTypes.UNICAST);
			this.getLayout().childRemoved.connect(this, this._childRemoved, EEventTypes.UNICAST);

			// this.connect(this.layout, SIGNAL(childAdded), SLOT(_childAdded), EEventTypes.UNICAST);
			// this.connect(this.layout, SIGNAL(childRemoved), SLOT(_childRemoved), EEventTypes.UNICAST);\

			var pChild: IUINode = <IUINode>this.getLayout().getChild();

			while (!isNull(pChild)) {
				if (isCheckbox(pChild)) {
					this.addCheckbox(<IUICheckbox>pChild);
				}

				pChild = <IUINode>pChild.getSibling();
			}
		}

		protected setupSignals(): void {
			this.changed = this.changed || new Signal(<any>this);
			super.setupSignals();
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);
			this.setRadio(isDef($comp.attr("radio")) && $comp.attr("radio").toLowerCase() !== "false");
			this._bMultiSelect = isDef($comp.attr("multiselect")) &&
			$comp.attr("multiselect").toLowerCase() !== "false";
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-checkboxlist");
		}

		hasMultiSelect(): boolean {
			return this._bMultiSelect;
		}

		//when checkbox added to childs
		update(): boolean {
			var pItems: IUICheckbox[] = this._pItems;

			if (pItems.length == 0) {
				return;
			}

			pItems.first.$element.addClass("first");

			for (var i: int = 0; i < pItems.length - 1; ++i) {
				pItems[i].$element.removeClass("last");
			};

			pItems.last.$element.addClass("last");

			return super.update();
		}

		protected addCheckbox(pCheckbox: IUICheckbox): void {
			this._pItems.push(pCheckbox);
			// this.connect(pCheckbox, SIGNAL(changed), SLOT(_changed));
			pCheckbox.changed.connect(this, this._changed);
			this.update();
		}

		_childAdded(pLayout: IUILayout, pNode: IUINode): void {
			if (isCheckbox(pNode)) {
				this.addCheckbox(<IUICheckbox>pNode);
			}
		}

		_childRemoved(pLayout: IUILayout, pNode: IUINode): void {
			if (isCheckbox(pNode)) {
				var i = this._pItems.indexOf(<IUICheckbox>pNode);
				if (i != -1) {
					var pCheckbox: IUICheckbox = this._pItems[i];
					// this.disconnect(pCheckbox, SIGNAL(changed), SLOT(_changed));
					pCheckbox.changed.disconnect(this, this._changed);

					this._pItems.splice(i, 1);
					this.update();
				}
			}
		}

		_changed(pCheckbox: IUICheckbox, bCheked: boolean): void {
			if (this.hasMultiSelect()) {
				this.changed.emit(pCheckbox);
				return;
			}
			else {

				if (!bCheked && this.isRadio()) {
					pCheckbox.setChecked(true);
					return;
				}

				var pItems: IUICheckbox[] = this._pItems;
				for (var i: int = 0; i < pItems.length; ++i) {
					if (pItems[i] === pCheckbox) {
						continue;
					}

					pItems[i]._setValue(false);
				}

				this.changed.emit(pCheckbox);
			}
		}
	}

	register("CheckboxList", CheckboxList);
}


