#ifndef UIRESOURCEPROPERTIES_TS
#define UIRESOURCEPROPERTIES_TS

#include "../Component.ts"
#include "IUILabel.ts"
#include "IResourcePoolItem.ts"

module akra.ui.resource {
	export class Properties extends Component {
		protected _pResource: IResourcePoolItem = null;
		protected _pName: IUILabel;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("ui/templates/ResourceProperties.tpl");

			this._pName = <IUILabel>this.findEntity("name");

		}

		setResource(pItem: IResourcePoolItem): void {
			if (!isNull(this._pResource)) {
				this._pResource.release();
			}

			pItem.addRef();
			this._pResource = pItem;
			this.updateProperties();
		}

		protected updateProperties(): void {
			var pItem: IResourcePoolItem = this._pResource;

			this._pName.text = pItem.findResourceName();
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-resourceproperties");
		}
	}

	register("ResourceProperties", Properties);
}

#endif

