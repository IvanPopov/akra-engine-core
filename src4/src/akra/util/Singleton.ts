/// <reference path="../common.ts" />

module akra.util {
	export class Singleton<T> {
		private static _instance: T = null;
		/*
		constructor() {
			if (isDef(Singleton._instance))
				throw new Error("Singleton class may be created only one time.");

			Singleton._instance = <T>this;
		}

		static getInstance() {
			if (Singleton._instance === null) {
				Singleton._instance = new ((<any>this).constructor)();
			}

			return Singleton._instance;
		}*/
		constructor() {
			var _this: any = <any>this;
			var _constructor = _this.constructor;

			if (_constructor._instance != null) {
				throw new Error("Singleton class may be created only one time.");
			}

			_constructor._instance = <T>this;
		}

		static getInstance() {
			if (this._instance === null) {
				this._instance = new ((<any>this))();
			}

			return this._instance;
		}
	}
}