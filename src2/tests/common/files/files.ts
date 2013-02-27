#include "util/testutils.ts"
#include "io/files.ts"

module akra {

	asyncTest("Local file API Test", () => {
		shouldBeTrue("Threads support");
		shouldBeTrue("File creation");
		shouldBeTrue("File openning");
		shouldBeTrue("File writing(string)");
		shouldBe("File reading(should be \"test_data\")", "test_data");

		check(info.api.webWorker);

		var pFile: IFile = io.fopen("filesystem://temporary/data/data.txt", "r+");
		
		check(isDefAndNotNull(pFile));

		pFile.open(function(err, pMeta) {
			if (err) {
				failed();
				return;
			}

			check(isDefAndNotNull(pMeta));

			pFile.write("test_data", function(err, pMeta) {
				if (err) failed();
				else {
					
					check(isDefAndNotNull(pMeta));

					pFile.position = 0;
					pFile.read(function(err, sData: string) {
						if (err) check(null);
						else {
							check(sData);
							run();
						}
					});
				}
			});
		});
	});

	asyncTest("Remote file API Test", () => {
		shouldBeTrue("Threads support");
		shouldBeTrue("File creation");
		shouldBe("Data should be \"text data\"", "text data");

		check(info.api.webWorker);

		var pFile: IFile = io.fopen("data/data.txt");
		
		check(pFile != null);

		pFile.read(function(err, sData: string) {
			//alert(sData);
			if (err) check(null);
			else {
				check(sData);
				run();
			}
		});
	});

}