///<reference path="include/akra.ts" />

class DemoApp extends akra.Engine {
    oneTimeSceneInit(): bool {
        this.notifyOneTimeSceneInit();
        this.setupWorldOcTree(new akra.geometry.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));

        return true;
    }
} 

var pApp = new DemoApp();

if (!pApp.create('canvas') || !pApp.run()) {
    akra.error('cannot create and run application.');
}