
module akra {
	/**
	 * Get current time in milliseconds from the time the page is loaded.
	 */
	export var time: () => uint;

	if (isDef(window.performance)) {
		time = (): uint => window.performance.now();
	}
	else {
		var t: uint = Date.now();
		time = (): uint => Date.now() - t;
	}
}
