#include "util/test/testutils.ts"
#include "io/ajax.ts"

module akra.utils.test {
	
	var test_1 = () => {
		shouldBeTrue("Sync ajax request test");
		
		check(io.ajax("data/data.txt").data === "test_data");
	}

	new Test({
		name: "Ajax API test",
		main: test_1,
		description: "Test ajax api"
		});
}