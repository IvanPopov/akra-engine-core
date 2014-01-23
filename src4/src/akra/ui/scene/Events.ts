#ifndef UISCENEEVENTS_TS
#define UISCENEEVENTS_TS

#include "../Component.ts"
#include "IUIButton.ts"
#include "IScene.ts"

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

			this.connect(this._pPreUpdateEvtBtn, SIGNAL(click), SLOT(_editPreUpdateEvent));
			this.connect(this._pPostUpdateEvtBtn, SIGNAL(click), SLOT(_editPostUpdateEvent));
			this.connect(this._pBeforeUpdateEvtBtn, SIGNAL(click), SLOT(_editBeforeUpdateEvent));
		}

		_editPreUpdateEvent(pBtn: IUIButton, e: IUIEvent): void {
			ide.cmd(ECMD.EDIT_EVENT, this._pScene, SIGNAL(preUpdate));
		}

		_editPostUpdateEvent(pBtn: IUIButton, e: IUIEvent): void {
			ide.cmd(ECMD.EDIT_EVENT, this._pScene, SIGNAL(postUpdate));
		}

		_editBeforeUpdateEvent(pBtn: IUIButton, e: IUIEvent): void {
			ide.cmd(ECMD.EDIT_EVENT, this._pScene, SIGNAL(beforeUpdate));
		}

		setScene(pScene: IScene): void {
			this._pScene = pScene;
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-sceneevents");
		}
	}

	register("scene.Events", Events);
}

#endif

