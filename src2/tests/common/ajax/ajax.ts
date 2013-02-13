"use strict";

#include "util/test/testutils.ts"
#include "io/ajax.ts"

module akra.util.test {
	
	var test_1 = () => {
		shouldBeTrue("Sync ajax request test");
		shouldBeTrue("Async ajax request test");
		shouldBeTrue("Async error test");
		
		check(io.ajax("data/data.txt").data === "test_data");

		io.ajax(<IAjaxParams>{
			url: "data/data.txt",
			success: function (pData: string): void {
				check(<string>pData === "test_data");
			}
		});

		io.ajax({
			url: "data/not_exists",
			error: function () {
				console.log(arguments);
				check(true);
			}
		});
	}

	new Test({
		name: "Ajax API test",
		main: test_1,
		description: "Test ajax api"
		});
}