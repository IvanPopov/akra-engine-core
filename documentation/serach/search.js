var express = require('express');
var fs = require('fs');
var fuzzy = require('fuzzy');
var cors = require('cors');

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(app.router);


var sourceFile = process.argv[2];
var doc = JSON.parse(fs.readFileSync(sourceFile));

//TODO: поиск по запросам вида:
//  enum <query>
//  class <query>

var db = {
    modules: {},
    interfaces: {},
    interfaceMembers: {},
    classes: {},
    classMembers: {},
    functions: {},
    enums: {},
    enumKeys: {},
    variables: {}
};

var SearchCond = {
    MODULE: 0x1,
    CLASS: 0x2,
    INTERFACE: 0x4,
    ENUM: 0x8,
    ENUM_KEY: 0x10,
    INTERFACE_MEMBER: 0x20,
    VARIABLE: 0x40,
    FUNCTION: 0x80,
    CLASS: 0x100,
    CLASS_MEMBER: 0x200
};

function exportModule(parent, parentPath, cond, db) {

    for (var category in parent) {
        if (category === "modules") {
            for (var moduleName in parent.modules) {
                var module = parent.modules[moduleName];
                var Location = module.location;
                var path = Location ? Location + "." + moduleName : moduleName;

                if (cond & SearchCond.MODULE) {
                    db[path] = {
                        kind: "module",
                        name: moduleName,
                        location: module.location,
                        comment: null
                    };
                }

                exportModule(module, path, cond, db);
            }
        }
        else if (category === "enums") {
            for (var enumName in parent.enums) {
                var enumeration = parent.enums[enumName];
                var enumLocation = parentPath ? parentPath + "." + enumName : enumName;

                if (cond & SearchCond.ENUM) {
                    db[enumLocation] = {
                        kind: "enum",
                        name: enumName,
                        location: parentPath,
                        comment: null,
                    };
                }

                if (cond & SearchCond.ENUM_KEY) {
                    for (var k = 0; k < enumeration.length; ++k) {
                        var key = enumeration[k];
                        var keyLocation = enumLocation + "." + key.name;
                        db[keyLocation] = {
                            kind: "enumKey",
                            name: key.name,
                            location: enumLocation,
                            comment: null,
                            value: key.value
                        };
                    }
                }
            }
        }
        else if (category === "interfaces") {
            for (var interfaceName in parent.interfaces) {
                var iface = parent.interfaces[interfaceName];
                var ifaceLocation = parentPath ? parentPath + "." + interfaceName : interfaceName;
                
                if (cond & SearchCond.INTERFACE) {
                    db[ifaceLocation] = {
                        kind: "interface",
                        name: interfaceName,
                        location: parentPath,
                        comment: null,
                    };
                }

                if (cond & SearchCond.INTERFACE_MEMBER) {
                    for (var fnName in iface.functions) {
                        var fn = iface.functions[fnName];
                        var fnLocation = ifaceLocation + "." + fnName;

                        db[fnLocation] = {
                            kind: "method",
                            name: fnName,
                            location: ifaceLocation,
                            comment: null,
                            type: fn.type
                        }
                    }

                    if (iface.variables) {
                        for (var varName in iface.variables.public) {
                            var variable = iface.variables.public[varName];
                            var varLocation = ifaceLocation + "." + varName;

                            db[varLocation] = {
                                kind: "member",
                                name: varName,
                                location: ifaceLocation,
                                comment: null,
                                type: variable.type
                            }
                        }
                    }
                }
            }
        }
        else if (category === "variables") {
            for (var varName in parent.variables) {
                var variable = parent.variables[varName];
                var varLocation = parentPath ? parentPath + "." + varName : varName;

                if (cond & SearchCond.VARIABLE) {
                    db[varLocation] = {
                        kind: "variable",
                        name: varName,
                        location: parentPath,
                        comment: null,
                        type: variable.type
                    };
                }
            }
        }
        else if (category === "functions") {
            for (var fnName in parent.functions) {
                var fn = parent.functions[fnName];
                var fnLocation = parentPath ? parentPath + "." + fnName : fnName;

                if (cond & SearchCond.FUNCTION) {
                    db[fnLocation] = {
                        kind: "function",
                        name: fnName,
                        location: parentPath,
                        comment: fn.comments || null,
                        type: fn.type
                    };
                }
            }
        }
        else if (category === "classes") {
                for (var className in parent.classes) {
                    var cls = parent.classes[className];
                    var clsLocation = parentPath ? parentPath + "." + className : className;
                
                    if (cond & SearchCond.CLASS) {
                        db[clsLocation] = {
                            kind: "class",
                            name: className,
                            location: parentPath,
                            comment: null,
                        };
                    }

                    if (cond & SearchCond.CLASS_MEMBER) {
                        for (var fnName in cls.functions) {
                            var fn = cls.functions[fnName];
                            var fnLocation = clsLocation + "." + fnName;

                            db[fnLocation] = {
                                kind: "method",
                                name: fnName,
                                location: clsLocation,
                                comment: fn.comments || null,
                                type: fn.type
                            }
                        }

                        if (cls.variables) {
                            for (var varName in cls.variables.public) {
                                var variable = cls.variables.public[varName];
                                var varLocation = clsLocation + "." + varName;

                                db[varLocation] = {
                                    kind: "member",
                                    name: varName,
                                    location: clsLocation,
                                    comment: null,
                                    type: variable.type
                                }
                            }

                            for (var varName in cls.variables.protected) {
                                var variable = cls.variables.protected[varName];
                                var varLocation = clsLocation + "." + varName;

                                db[varLocation] = {
                                    kind: "member",
                                    name: varName,
                                    location: clsLocation,
                                    comment: null,
                                    type: variable.type
                                }
                            }

                            for (var varName in cls.variables.private) {
                                var variable = cls.variables.private[varName];
                                var varLocation = clsLocation + "." + varName;

                                db[varLocation] = {
                                    kind: "member",
                                    name: varName,
                                    location: clsLocation,
                                    comment: null,
                                    type: variable.type
                                }
                            }
                        }
                    }
                }
            }
    }
}

exportModule(doc, null, SearchCond.MODULE, db.modules);
exportModule(doc, null, SearchCond.ENUM, db.enums);
exportModule(doc, null, SearchCond.ENUM_KEY, db.enumKeys);
exportModule(doc, null, SearchCond.INTERFACE, db.interfaces);
exportModule(doc, null, SearchCond.INTERFACE_MEMBER, db.interfaceMembers);
exportModule(doc, null, SearchCond.VARIABLE, db.variables);
exportModule(doc, null, SearchCond.FUNCTION, db.functions);
exportModule(doc, null, SearchCond.CLASS, db.classes);
exportModule(doc, null, SearchCond.CLASS_MEMBER, db.classMembers);

var dict = {};

for (var category in db) {
    dict[category] = Object.keys(db[category]);
}


function search(query) {
    query = query || "";

    var res = [];
    for (var category in db) {
        res.push({type:category,data:[]});
    }

    for (var j in res) {
        var result = fuzzy.filter(query, dict[res[j].type]);
        // console.log(res[j].type + ": " + result.length);
        for (var i = 0; i < result.length; ++i) {
            res[j].data.push(db[res[j].type][result[i].string]);
        }
    }

    return res;
}

app.get('/search/:query', function (req, res) {
    var query = req.params.query;
    res.send(search(query));
});

app.get('/search', function (req, res) {
    var query = req.query.q;
    res.send(search(query));
});

app.listen(3000);