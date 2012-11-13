#include "util/test/testutils.ts"
#include "io/files.ts"

module akra.utils.test {
	
	var test_1 = () => {
		shouldBeTrue("Threads support");
		shouldBeTrue("File creation");
		shouldBeTrue("File openning");
		shouldBeTrue("File writing(string)");
		shouldBeTrue("File reading(should be \"test_data\")");

		check(info.api.webWorker);

		var pFile: IFile = io.fopen("filesystem://temporary/data/data.txt", "r+");
		
		check(pFile != null);

		pFile.open(function(err, pMeta) {
			if (err) {
				failed();
				return;
			}
			check(pMeta != null);
			pFile.write("test_data", function(err, pMeta) {
				if (err) check(null);
				else {
					check(pMeta != null);
					pFile.position = 0;
					pFile.read(function(err, sData: string) {
						check(!err && sData === "test_data");
						console.log(arguments);
					});
				}
			});
		});
		
	}

	new Test({
		name: "Local file API Test",
		main: test_1,
		description: "Test all file apis"
		});
}