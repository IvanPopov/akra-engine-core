/// <reference path="../../idl/IUIButton.ts" />
/// <reference path="../../idl/IScene.ts" />

/// <reference path="../Component.ts" />

module akra.ui.scene {
	export class Events extends Component {
		protected _pScene: IScene = null;
		protected _pPreUpdateEvtBtn: IUIButton;
		protected _pPostUpdateEvtBtn: IUIButton;
		protected _pBeforeUpdateEvtBtn: IUIButton;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("scene.Events.tpl");

			this._pPreUpdateEvtBtn = <IUIButton>this.findEntity("pre-update");
			this._pPostUpdateEvtBtn = <IUIButton>this.findEntity("post-update");
			this._pBeforeUpdateEvtBtn = <IUIButton>this.findEntity("before-update");

			//this.connect(this._pPreUpdateEvtBtn, SIGNAL(click), SLOT(_editPreUpdateEvent));
			//this.connect(this._pPostUpdateEvtBtn, SIGNAL(click), SLOT(_editPostUpdateEvent));
			//this.connect(this._pBeforeUpdateEvtBtn, SIGNAL(click), SLOT(_editBeforeUpdateEvent));
			this._pPreUpdateEvtBtn.click.connect(this, this._editPreUpdateEvent);
			this._pPostUpdateEvtBtn.click.connect(this, this._editPostUpdateEvent);
			this._pBeforeUpdateEvtBtn.click.connect(this, this._editBeforeUpdateEvent);
		}

		_editPreUpdateEvent(pBtn: IUIButton, e: IUIEvent): void {
			ide.cmd(ECMD.EDIT_EVENT, this._pScene, "preUpdate");
		}

		_editPostUpdateEvent(pBtn: IUIButton, e: IUIEvent): void {
			ide.cmd(ECMD.EDIT_EVENT, this._pScene, "postUpdate");
		}

		_editBeforeUpdateEvent(pBtn: IUIButton, e: IUIEvent): void {
			ide.cmd(ECMD.EDIT_EVENT, this._pScene, "beforeUpdate");
		}

		setScene(pScene: IScene): void {
			this._pScene = pScene;
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.el.addClass("component-sceneevents");
		}
	}

	register("scene.Events", Events);
}
