module akra.util {
	class Singleton {
		constructor () {
			var _constructor = (<any>this).constructor;

			assert(!isDef(_constructor._pInstance), 
				'Singleton class may be created only one time.');

			_constructor._pInstance = this;
		}
	}
}