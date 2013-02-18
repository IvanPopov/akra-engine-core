#include "util/testutils.ts"
#include "io/ajax.ts"

module akra {
	
	test("Ajax API test", () => {
		shouldBe("Sync ajax request test", "test_data");
		check(io.ajax("data/data.txt").data);
	});

	asyncTest("Ajax async request", () => {
		shouldBe("Async ajax request test", "test_data");

		io.ajax(<IAjaxParams>{
			url: "data/data.txt",
			success: function (pData: string): void {
				check(<string>pData);
				run();
			}
		});
	});

	asyncTest("Ajax error test", () => {
		shouldBeTrue("Async error test");

		io.ajax({
			url: "data/not_exists",
			error: function () {
				LOG(arguments);
				check(true);
			}
		});
	});
}