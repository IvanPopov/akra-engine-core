#include "util/testutils.ts"
#include "core/Engine.ts"
#include "common.ts"
#include "IEffect.ts"

module akra {
	test("Example creation test", () => {
		var pEngine: IEngine = createEngine();

		pEngine.bind(SIGNAL(depsLoaded), (pEngine: IEngine, pDeps: IDependens) => {
			var pEffectResourcePool: IResourcePool = pEngine.getResourceManager().effectPool;
			var pEffect: IEffect = <IEffect>pEffectResourcePool.createResource("test-effect");
			pEffect.create();

			shouldBeTrue("Effect resource create");
			check(!isNull(pEffect));

			pEffect.addComponent("akra.system.mesh_texture");
			pEffect.addComponent("akra.system.prepareForDeferredShading", 0, 0);
			pEffect.addComponent("akra.system.prepareForDeferredShading", 1, 1);

			var pComposer: IAFXComposer = pEngine.getComposer();
			LOG(pEngine.getComposer());

			var pAnyComposer: any = <any>pComposer;

			pAnyComposer._pEffectResourceToComponentBlendMap[0].finalizeBlend();
		});

	});
}