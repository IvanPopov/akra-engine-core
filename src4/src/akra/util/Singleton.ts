/// <reference path="../common.ts" />

module akra.util {
	export class Singleton<T> {
		private static _instance: any = null;
		constructor() {
			var _this: any = <any>this;
			var _constructor = _this.constructor;

			if (_constructor._instance != null) {
				throw new Error("Singleton class may be created only one time.");
			}

			_constructor._instance = <T>this;
		}
	}
}