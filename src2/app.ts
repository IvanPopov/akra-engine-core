///<reference path="include/akra.ts" />


var v2: akra.Vec3 = new akra.Vec3(1, 2, 3);
var v: akra.Vec3 = new akra.Vec3(10);



console.log((new akra.Vec3).set(v.z, v2.z, v2.y).toString());

//class DemoApp extends akra.Engine {
//    oneTimeSceneInit(): bool {
//        this.notifyOneTimeSceneInit();
//        //this.setupWorldOcTree();
//        return true;
//    }
//} 