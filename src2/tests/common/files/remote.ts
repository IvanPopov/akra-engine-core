#include "util/test/testutils.ts"
#include "io/files.ts"

module akra.util.test {
	
	var test_1 = () => {
		shouldBeTrue("Threads support");
		shouldBeTrue("File creation");
		shouldBeTrue("Data should be \"text data\"");

		check(info.api.webWorker);

		var pFile: IFile = io.fopen("data/data.txt");
		
		check(pFile != null);

		pFile.read(function(err, sData: string) {
			//alert(sData);
			if (err) check(null);
			else check(sData === "text data");
		});
	}

	new Test({
		name: "Remote file API Test",
		main: test_1,
		description: "Test all file apis"
		});
}