#include "util/test/testutils.ts"
#include "io/file.ts"

module akra.utils.test {
	
	var test_1 = () => {
		shouldBeTrue("Threads support");
		shouldBeTrue("File creation");
		shouldBeTrue("Data should be \"test_data.\"");

		check(info.api.webWorker);

		var pFile: IFile = io.fopen("../../tests/common/file/test.txt");
		
		check(pFile != null);
		
		pFile.read(function(err, sData: string) {
			if (err) check(null);
			else check(sData === "test_data.");
		});
	}

	new Test({
		name: "Remote file API Test",
		main: test_1,
		description: "Test all file apis"
		});
}