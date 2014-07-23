module akra {
	var t: uint = Date.now();
	/**
	 * Get current time in milliseconds from the time the page is loaded.
	 */
	export var time: () => uint = isDef(window.performance) ?
		(): uint => window.performance.now() :
		(): uint => Date.now() - t;;
}
