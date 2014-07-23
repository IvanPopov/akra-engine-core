/// <reference path="WebGLRenderer.ts" />
/// <reference path="WebGLInternalTexture.ts" />
/// <reference path="../util/ObjectArray.ts" />

module akra.webgl {
	export interface WebGLInternalTextureState {
		isUsed: boolean;
		texture: WebGLInternalTexture;
		states: IMap<int>;
	}

	export interface WebGLInternalTextureStateMap {
		[guid: uint]: WebGLInternalTextureState;
	}

	export class WebGLInternalTextureStateManager {
		private _pActiveTextureStateMap: WebGLInternalTextureStateMap = null;
		private _pActiveTextureList: util.ObjectArray<uint> = null;

		private _pWebGLRenderer: WebGLRenderer = null;
		
		constructor(pRenderer: WebGLRenderer){
			this._pWebGLRenderer = pRenderer;

			this._pActiveTextureStateMap = <WebGLInternalTextureStateMap>{};
			this._pActiveTextureList = new util.ObjectArray<uint>();
		}

		add(pTexture: WebGLInternalTexture): IMap<int> {
			var iGuid: uint = pTexture.guid;
			var pTextureState: WebGLInternalTextureState = this._pActiveTextureStateMap[iGuid];

			if(!isDef(pTextureState)){
				pTextureState = {
					isUsed: true,
					texture: pTexture,
					states: <IMap<int>>{}
				};

				pTextureState.states[ETextureParameters.MIN_FILTER] = pTexture.getFilter(ETextureParameters.MIN_FILTER);
				pTextureState.states[ETextureParameters.MAG_FILTER] = pTexture.getFilter(ETextureParameters.MAG_FILTER);
				pTextureState.states[ETextureParameters.WRAP_S] = pTexture.getWrapMode(ETextureParameters.WRAP_S);
				pTextureState.states[ETextureParameters.WRAP_T] = pTexture.getWrapMode(ETextureParameters.WRAP_T);

				this._pActiveTextureStateMap[iGuid] = pTextureState;
				this._pActiveTextureList.push(iGuid);

				return pTextureState.states;
			}

			if(!pTextureState.isUsed){
				pTextureState.states[ETextureParameters.MIN_FILTER] = pTexture.getFilter(ETextureParameters.MIN_FILTER);
				pTextureState.states[ETextureParameters.MAG_FILTER] = pTexture.getFilter(ETextureParameters.MAG_FILTER);
				pTextureState.states[ETextureParameters.WRAP_S] = pTexture.getWrapMode(ETextureParameters.WRAP_S);
				pTextureState.states[ETextureParameters.WRAP_T] = pTexture.getWrapMode(ETextureParameters.WRAP_T);

				this._pActiveTextureList.push(iGuid);
			}

			return pTextureState.states;
		}

		reset(): void {
			var iLength: uint = this._pActiveTextureList.getLength();

			for(var i: uint = 0; i < iLength; i++){
				var pTextureState: WebGLInternalTextureState = this._pActiveTextureStateMap[this._pActiveTextureList.value(i)];

				pTextureState.texture.setFilter(ETextureParameters.MIN_FILTER, pTextureState.states[ETextureParameters.MIN_FILTER]);
				pTextureState.texture.setFilter(ETextureParameters.MAG_FILTER, pTextureState.states[ETextureParameters.MAG_FILTER]);
				pTextureState.texture.setWrapMode(ETextureParameters.WRAP_S, pTextureState.states[ETextureParameters.WRAP_S]);
				pTextureState.texture.setWrapMode(ETextureParameters.WRAP_T, pTextureState.states[ETextureParameters.WRAP_T]);

				pTextureState.isUsed = false;
			}

			this._pActiveTextureList.clear();
			//this._pWebGLRenderer.bindWebGLTexture(gl.TEXTURE_2D, null);
		}

		getTextureState(iGuid: uint): IMap<int> {
			return this._pActiveTextureStateMap[iGuid].states;
		}

	}
}