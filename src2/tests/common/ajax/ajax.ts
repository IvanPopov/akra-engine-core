#include "util/testutils.ts"
#include "io/ajax.ts"

module akra {
	
	test("Ajax API test", () => {
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
	});
}