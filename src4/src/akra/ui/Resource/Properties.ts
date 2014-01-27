/// <reference path="../../idl/IUILabel.ts" />
/// <reference path="../../idl/IResourcePoolItem.ts" />
/// <reference path="../animation/ColladaAnimation.ts" />
/// <reference path="../Component.ts" />

module akra.ui.resource {
	export class Properties extends Component {
		protected _pResource: IResourcePoolItem = null;
		protected _pName: IUILabel;

		//== collada
		protected _pColldaProperties: IUIComponent;
		protected _pColladaAnimations: animation.ColladaAnimation[] = [];
		protected $colladaAnimations: JQuery;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("resource.Properties.tpl");

			this._pName = <IUILabel>this.findEntity("name");
			this._pColldaProperties = <IUIComponent>this.findEntity("collada-properties");
			this.$colladaAnimations = this._pColldaProperties.el.find("div.row:first");
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

			//collada-properties
			if (core.pool.resources.isColladaResource(pItem)) {
				this._pColldaProperties.show();	
				
				var pCollada: ICollada = <ICollada>pItem;
				var pAnimations: IColladaAnimation[] = pCollada.getAnimations();
				var pColladaAnimations: animation.ColladaAnimation[] = this._pColladaAnimations;
			
				for (var i = 0; i < pColladaAnimations.length; ++ i) {
					pColladaAnimations[i].hide();
				}

				for (var i = 0; i < pAnimations.length; ++ i) {
					var pComp: animation.ColladaAnimation;
					
					if (pColladaAnimations.length > i) {
						pComp = pColladaAnimations[i];
					}
					else {
						pComp = pColladaAnimations[pColladaAnimations.length] = <animation.ColladaAnimation>
							this._pColldaProperties.createComponent("animation.ColladaAnimation", {show: false});

						pComp.render(this.$colladaAnimations);
					}


					pComp.show();
					pComp.setAnimation(pCollada, i);
				}
			}
			else {
				this._pColldaProperties.hide();
			}
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-resourceproperties");
		}
	}

	register("resource.Properties", Properties);
}


