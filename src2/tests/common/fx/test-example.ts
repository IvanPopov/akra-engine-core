#include "util/testutils.ts"
#include "core/Engine.ts"
#include "common.ts"

module akra {
	test("Example creation test", () => {
		var pEngine: IEngine = createEngine({depsRoot: "../../../data"});
		var pEffectDataPool: IResourcePool = pEngine.getResourceManager().effectDataPool;

		var pEffectData: IResourcePoolItem = pEffectDataPool.createResource("test");
		
		shouldBeTrue("Effec data create");
		check(!isNull(pEffectData));

		pEffectData.loadResource("data/SystemEffects.afx");
	});
}