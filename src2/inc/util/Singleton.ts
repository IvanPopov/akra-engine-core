#ifndef SINGLETON_TS
#define SINGLETON_TS

module akra.util {
	export class Singleton {
		constructor () {
			var _constructor = (<any>this).constructor;

			ASSERT(!isDef(_constructor._pInstance), 
				'Singleton class may be created only one time.');

			_constructor._pInstance = this;
		}
	}
}

#endif