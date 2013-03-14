#include "util/testutils.ts"
#include "core/Engine.ts"
#include "common.ts"
#include "IEffect.ts"

module akra {
	test("Example creation test", () => {
		var pEngine: IEngine = createEngine();

		pEngine.bind(SIGNAL(depsLoaded), (pEngine: IEngine, pDeps: IDependens) => {
			// var pEffectResourcePool: IResourcePool = pEngine.getResourceManager().effectPool;
			// var pRenderMethodPool: IResourcePool = pEngine.getResourceManager().renderMethodPool;
			
			// var pMethod: IRenderMethod = <IRenderMethod>pRenderMethodPool.createResource("test-method");

			// // var pGlobalEffect: IEffect = <IEffect>pEffectResourcePool.createResource("test-global-effect");
			// var pEffect: IEffect = <IEffect>pEffectResourcePool.createResource("test-effect");
			// pEffect.create();

			// shouldBeTrue("Effect resource create");
			// check(!isNull(pEffect));

			// pEffect.addComponent("akra.system.mesh_texture");
			// pEffect.addComponent("akra.system.prepareForDeferredShading", 0, 0);
			// pEffect.addComponent("akra.system.prepareForDeferredShading", 1, 1);

			// var pTechnique: IRenderTechnique = new render.RenderTechnique(pMethod);

			// pMethod.effect = pEffect;
			
			var pTestRenderable: IRenderableObject = new render.RenderableObject();
			pTestRenderable._setup(pEngine.getRenderer(), "test-method");

			var pDefaultTechnique: IRenderTechnique = pTestRenderable.getTechniqueDefault();
			var pDefaultEffect: IEffect = pTestRenderable.getRenderMethod().effect;

			pDefaultEffect.addComponent("akra.system.mesh_texture");

			LOG(pDefaultTechnique.totalPasses);

			pDefaultTechnique.addComponent("akra.system.prepareForDeferredShading", 0, 0);
			pDefaultTechnique.addComponent("akra.system.prepareForDeferredShading", 1, 1);

			LOG(pDefaultTechnique, pDefaultTechnique.totalPasses);

			var pComposer: IAFXComposer = pEngine.getComposer();
			LOG(pEngine.getComposer());

			// var pAnyComposer: any = <any>pComposer;

			// pAnyComposer._pEffectResourceToComponentBlendMap[0].finalizeBlend();
			// 
			
			// var obj = {a:1,
			// 	b:2,
			// 	c:3,
			// 	d:4
			// };

			// function wrap(fn, nTime): uint {
			// 	var time = now();

			// 	for(var i: uint = 0; i < nTime; i++){
			// 		fn.call(null);
			// 	}

			// 	return now() - time;
			// }

			// function t1(): int{
			// 	var res = 0;

			// 	for(var i = 0; i < 1000; i++){
			// 		if(!!isDef(obj["c"])){
			// 			res += i * obj["c"];
			// 		}
			// 	}

			// 	return res;
			// }

			// function t2(): int{
			// 	var res = 0;

			// 	for(var i = 0; i < 1000; i++){
			// 		if(!isDef(obj["x"])){
			// 			res += i * obj["c"];
			// 		}
			// 	}

			// 	return res;
			// }

			// LOG("def", wrap(t1, 10000));
			// LOG("undef", wrap(t2, 10000));

			
		});		
	});
}