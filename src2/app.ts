///<reference path="include/akra.ts" />

class DemoApp extends akra.Engine {
    oneTimeSceneInit(): bool {
        this.notifyOneTimeSceneInit();

        akra.debug_assert(false, "do not use this!", "do not use this!", "do not use this!");

        //this.setupWorldOcTree();
        return true;
    }
} 

(new DemoApp).oneTimeSceneInit();