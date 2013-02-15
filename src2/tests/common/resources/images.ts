

#include "akra.ts"

module akra{
	test("img tests", () => {
		var pEngine:IEngine=createEngine();
		var pRsMg:IResourcePoolManager=pEngine.getResoureMenagaer();
		var pImg:IImg=pRsMg.createImg();

		shouldBeTrue("create image");
		ok(isDefAndNotNull(pImg));


	});
}