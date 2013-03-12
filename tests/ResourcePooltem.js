Include('/sources/');

var parent = new a.ResourcePoolItem({});

var child = [new a.ResourcePoolItem({}), new a.ResourcePoolItem({}), new a.ResourcePoolItem({})];
var disconnector;
for (var i = 0; i < child.length; ++i) {
    disconnector = parent.connect(child[i], a.ResourcePoolItem.Loaded);
}

parent.notifyLoaded();
console.log(parent.isResourceLoaded(), ' <---- 1');

for (var i = 0; i < child.length; ++i) {
    child[i].notifyLoaded();
    console.log(parent.isResourceLoaded());
}

disconnector();
child[2].notifyUnloaded();

console.log(parent.isResourceLoaded(), ' <---- 1.5');
child[1].notifyUnloaded();
console.log(parent.isResourceLoaded(), ' <---- 2');

for (var i = 0; i < child.length - 1; ++i) {
    child[i].notifyLoaded();
    console.log(parent.isResourceLoaded());
}

parent.connect(child[2], a.ResourcePoolItem.Loaded);
console.log(parent.isResourceLoaded(), ' <---- 2.5');

child[2].notifyLoaded();
console.log(parent.isResourceLoaded(), ' <---- 3');