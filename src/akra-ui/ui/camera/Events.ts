
/// <reference path="../../idl/IUIButton.ts" />

/// <reference path="../Component.ts" />

module akra.ui.camera {
	export class Events extends Component {
		protected _pCamera: ICamera = null;
		protected _pPreRenderEvtBtn: IUIButton;
		protected _pPostRenderEvtBtn: IUIButton;
		protected _pLookThrough: IUIButton;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("camera.Events.tpl");

			this._pLookThrough = <IUIButton>this.findEntity("look-through");

			this._pPreRenderEvtBtn = <IUIButton>this.findEntity("pre-render-scene");
			this._pPostRenderEvtBtn = <IUIButton>this.findEntity("post-render-scene");

			//this.connect(this._pLookThrough, SIGNAL(click), SLOT(_lookThrough));
			this._pLookThrough.click.connect(this, this._lookThrough);

			//this.connect(this._pPreRenderEvtBtn, SIGNAL(click), SLOT(_editPreRenderEvent));
			//this.connect(this._pPostRenderEvtBtn, SIGNAL(click), SLOT(_editPostRenderEvent));
			this._pPreRenderEvtBtn.click.connect(this, this._editPreRenderEvent);
			this._pPostRenderEvtBtn.click.connect(this, this._editPostRenderEvent);
		}

		_lookThrough(pBtn: IUIButton): void {
			ide.cmd(ECMD.CHANGE_CAMERA, this._pCamera);
		}

		_editPreRenderEvent(pBtn: IUIButton, e: IUIEvent): void {
			ide.cmd(ECMD.EDIT_EVENT, this._pCamera, "preRenderScene");
		}

		_editPostRenderEvent(pBtn: IUIButton, e: IUIEvent): void {
			ide.cmd(ECMD.EDIT_EVENT, this._pCamera, "postRenderScene");
		}

		setCamera(pCamera: ICamera): void {
			if (!isNull(this._pCamera)) {
				this._pCamera.release();
			}

			pCamera.addRef();
			this._pCamera = pCamera;
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-cameraevents");
		}
	}

	register("camera.Events", Events);
}



