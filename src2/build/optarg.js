(function (optarg) {
    var Flag = (function () {
        function Flag(parser, param, short) {
            this.data = null;
            this.params = [];
            this.short = false;
            this.name = null;
            this.value = null;
            this.parser = parser;
            this.short = short;
            var info;
            var data;
            var name;
            info = this.parse(param);
            data = this.data = parser.findFlagDesc(info.name, short);
            if(data) {
                if(this.check(info, data)) {
                    if(data.demand) {
                        parser.specifyDemandFlag(param, short);
                    }
                } else {
                    throw new Error("incorrect flag data...");
                }
            } else {
                throw new Error("used unknown flag: " + info.name);
            }
        }
        Flag.prototype.parse = function (param) {
            var eqpos = param.indexOf("=");
            var name;
            var value = null;
            if(eqpos < 0) {
                name = param;
            } else {
                name = param.substr(0, eqpos);
                value = param.substr(eqpos + 1);
            }
            return {
                name: name,
                value: value
            };
        };
        Flag.prototype.check = function (info, data) {
            if(!data.boolean && info.value === null) {
                info.value = this.parser.pop(true);
                if(!info.value) {
                    info.value = data.default;
                }
            }
            if(data.boolean) {
                info.value = true;
            }
            if(data.number) {
                info.value = parseFloat(info.value);
            }
            this.name = info.name;
            this.value = info.value;
            if(data.check) {
                return data.check.call(this.parser, this);
            }
            return true;
        };
        Flag.prototype.isShort = function () {
            return this.short;
        };
        Flag.prototype.isFull = function () {
            return !this.short;
        };
        return Flag;
    })();
    optarg.Flag = Flag;    
    var Argument = (function () {
        function Argument(parser, param) {
            console.log("argument > ", param);
        }
        return Argument;
    })();
    optarg.Argument = Argument;    
    var Parser = (function () {
        function Parser(arglist, flaglist, options) {
            if (typeof arglist === "undefined") { arglist = null; }
            if (typeof flaglist === "undefined") { flaglist = null; }
            if (typeof options === "undefined") { options = null; }
            this.arglist = [];
            this.flaglist = [];
            this.params = [];
            this.demandflags = [];
            this.description = "";
            this.examples = null;
            this.entry = "make.js";
            this.flags = {
            };
            this.args = [];
            if(arglist) {
                for(var i = 0; i < arglist.length; ++i) {
                    this.argument(arglist[i]);
                }
                ; ;
            }
            if(flaglist) {
                for(var i = 0; i < flaglist.length; ++i) {
                    this.flag(flaglist[i]);
                }
                ; ;
            }
            if(options) {
                if(options.description) {
                    this.setUsage(options.description, options.examples || null, options.entry || null);
                }
            }
        }
        Parser.prototype.flag = function (flag) {
            var data = {
                short: null,
                full: null,
                default: null,
                string: false,
                boolean: false,
                number: false,
                type: null,
                description: "Unknown flag.",
                demand: false,
                check: null
            };
            for(var key in flag) {
                var value = flag[key];
                switch(key) {
                    case "short": {
                        data.short = value[0] || null;
                        break;

                    }
                    case "full": {
                        data.full = value;
                        break;

                    }
                    case "default":
                    case "description": {
                        data[key] = value;
                        break;

                    }
                    case "string":
                    case "boolean":
                    case "number":
                    case "demand": {
                        data[key] = value;
                        break;

                    }
                    case "type": {
                        data.type = [
                            "string", 
                            "number", 
                            "bool", 
                            "boolean", 
                            "int", 
                            "float"
                        ].indexOf(value) < 0 ? "string" : value;
                        break;

                    }
                    case "check": {
                        data.check = value;
                        break;

                    }
                }
            }
            switch(data.type) {
                case "string": {
                    data.string = true;
                    break;

                }
                case "boolean":
                case "bool": {
                    data.boolean = true;
                    break;

                }
                case "number":
                case "int":
                case "float": {
                    data.number = true;
                    break;

                }
            }
            if(data.boolean) {
                data.number = data.string = false;
            }
            if(data.string) {
                data.number = data.boolean = false;
            }
            if(data.number) {
                data.string = data.boolean = false;
            }
            if(!data.boolean && !data.string && !data.number) {
                data.boolean = true;
            }
            if(data.short && this.findFlagDesc(data.short, true)) {
                console.log("flag dublicated(short: ", data.short, ")");
                return this;
            }
            if(data.full && this.findFlagDesc(data.full)) {
                console.log("flag dublicated(full: ", data.full, ")");
                return this;
            }
            this.flaglist.push(data);
            if(data.demand) {
                this.demandflags.push(data);
            }
            return this;
        };
        Parser.prototype.argument = function (arg) {
            var data = {
                string: false,
                boolean: false,
                number: false,
                type: null,
                description: null,
                demand: false
            };
            for(var key in arg) {
                var value = arg[key];
                switch(key) {
                    case "description": {
                        data[key] = value;
                        break;

                    }
                    case "string":
                    case "boolean":
                    case "number":
                    case "demand": {
                        data[key] = value;
                        break;

                    }
                    case "type": {
                        data.string = [
                            "string", 
                            "number", 
                            "bool", 
                            "boolean", 
                            "any", 
                            "int", 
                            "float"
                        ].indexOf(value) < 0 ? "any" : value;
                        break;

                    }
                }
            }
            switch(data.type) {
                case "string": {
                    data.string = true;
                    break;

                }
                case "boolean":
                case "bool": {
                    data.boolean = true;
                    break;

                }
                case "number":
                case "int":
                case "float": {
                    data.number = true;
                    break;

                }
            }
            if(data.boolean) {
                data.number = data.string = false;
            }
            if(data.string) {
                data.number = data.boolean = false;
            }
            if(data.number) {
                data.string = data.boolean = false;
            }
            if(!data.boolean && !data.string && !data.number) {
                data.boolean = true;
            }
            this.arglist.push(data);
            return this;
        };
        Parser.prototype.specifyDemandFlag = function (name, short) {
            if (typeof short === "undefined") { short = false; }
            for(var i = 0; i < this.demandflags.length; ++i) {
                if((short ? this.demandflags[i].short : this.demandflags[i].full) === name) {
                    this.demandflags.splice(i, 1);
                    return;
                }
            }
        };
        Parser.prototype.parse = function (argv) {
            var arg;
            var flags;
            for(var i = 0; i < argv.length; ++i) {
                this.push(argv[i]);
            }
            ; ;
            while(arg = this.pop()) {
                if(arg[0] === "-") {
                    if(arg[1] === "-") {
                        this.pushFlag(new Flag(this, arg.substr(2), false));
                    } else {
                        flags = arg.substr(1);
                        if(arg[2] !== "=") {
                            for(var i = 0; i < flags.length; ++i) {
                                this.pushFlag(new Flag(this, flags[i], true));
                            }
                        } else {
                            this.pushFlag(new Flag(this, flags, true));
                        }
                    }
                } else {
                    this.pushArgument(new Argument(this, arg));
                }
            }
            if(this.demandflags.length) {
                console.log("you must specify demand flag: ", this.demandflags[0].full || this.demandflags[0].short);
            }
            return this;
        };
        Parser.prototype.findFlagDesc = function (name, short) {
            if (typeof short === "undefined") { short = false; }
            for(var i = 0; i < this.flaglist.length; ++i) {
                var data = this.flaglist[i];
                if(short && data.short === name) {
                    return data;
                }
                if(!short && data.full === name) {
                    return data;
                }
            }
            return null;
        };
        Parser.prototype.pushFlag = function (flag) {
            if(!flag.data) {
                return;
            }
            if(flag.isShort()) {
                this.flags[flag.data.short] = flag;
            }
            if(flag.isFull()) {
                this.flags[flag.data.full] = flag;
            }
        };
        Parser.prototype.pushArgument = function (arg) {
        };
        Parser.prototype.push = function (param) {
            this.params.unshift(param);
        };
        Parser.prototype.pop = function (onlyargumens) {
            if (typeof onlyargumens === "undefined") { onlyargumens = false; }
            var data = this.params.pop();
            if(onlyargumens && data[0] === "-") {
                this.push(data);
                return null;
            }
            return data || null;
        };
        Parser.prototype.setUsage = function (message, examples, entry) {
            if (typeof examples === "undefined") { examples = null; }
            if (typeof entry === "undefined") { entry = null; }
            this.description = message;
            this.examples = examples;
            this.entry = entry || "make.js";
        };
        Parser.prototype.usage = function () {
            var result = [
                this.description, 
                null
            ];
            var row;
            if(this.arglist.length || this.flaglist.length) {
                result.push("Usage: ");
                row = "\t " + this.entry + " ";
                for(var i = 0; i < this.arglist.length; ++i) {
                    var arg = this.arglist[i];
                    row += arg.demand ? "< " + arg.description + " >" : "[ " + arg.description + " ]";
                    row += " ";
                }
                for(var i = 0; i < this.flaglist.length; ++i) {
                    var flag = this.flaglist[i];
                    if(!flag.short && !flag.full) {
                        continue;
                    }
                    row += arg.demand ? "< " + (flag.short ? "-" + flag.short : "--" + flag.full) + " >" : "[ " + (flag.short ? "-" + flag.short : "--" + flag.full) + " ]";
                    row += " ";
                }
                result.push(row, null);
            }
            for(var i = 0; i < this.flaglist.length; ++i) {
                var data = this.flaglist[i];
                row = "\t";
                if(data.full) {
                    row += "--" + data.full;
                }
                if(data.short) {
                    if(row.length) {
                        row += ", ";
                    }
                    row += "-" + data.short;
                }
                for(var n = 0, m = 20 - row.length; n < m; ++n) {
                    row += " ";
                }
                row += data.demand ? "[ required ]" : "[ optional ]";
                row += (data.boolean ? "[  bool  ]" : (data.string ? "[ string ]" : "[ number ]"));
                row += "\t";
                row += data.description;
                row += " ";
                if(data.default) {
                    row += "[ default: " + data.default + " ]";
                }
                result.push(row);
            }
            if(this.examples) {
                result.push(null);
                result.push("Examples: ");
                for(var i = 0; i < this.examples.length; ++i) {
                    var example = this.examples[i];
                    row = "\t";
                    row += example.description + "\n\t\t > " + example.cmd;
                    result.push(row);
                }
            }
            result.push(null);
            return result.join("\n");
        };
        return Parser;
    })();
    optarg.Parser = Parser;    
    function create(arglist, flaglist, options) {
        if (typeof arglist === "undefined") { arglist = null; }
        if (typeof flaglist === "undefined") { flaglist = null; }
        if (typeof options === "undefined") { options = null; }
        return new Parser(arglist, flaglist, options);
    }
    optarg.create = create;
    function parse(argv, arglist, flaglist, options) {
        if (typeof arglist === "undefined") { arglist = null; }
        if (typeof flaglist === "undefined") { flaglist = null; }
        if (typeof options === "undefined") { options = null; }
        return create(arglist, flaglist, options).parse(argv);
    }
    optarg.parse = parse;
})(exports.optarg || (exports.optarg = {}));
var optarg = exports.optarg;
var argv = optarg.parse(process.argv.splice(2), [
    {
        string: true,
        description: "File for building."
    }
], [
    {
        short: "t",
        full: "target",
        description: "Build target. Can be CORE, TESTS or ALL",
        string: true,
        default: "CORE",
        check: function (flag) {
            switch((flag.value || "").toUpperCase()) {
                case "CORE":
                case "TESTS":
                case "ALL": {
                    return true;

                }
            }
            return false;
        }
    }, 
    {
        short: "o",
        full: "out",
        string: true,
        description: "Path to output folder.",
        default: "./bin"
    }, 
    {
        short: "d",
        full: "build",
        string: true,
        default: "./",
        description: "Build directory."
    }, 
    {
        short: "s",
        full: "tests",
        string: true,
        description: "Path to directory with all tests."
    }, 
    {
        short: "c",
        full: "test",
        string: true,
        description: "Path to directory with test."
    }, 
    {
        full: "html",
        description: "Build tests as HTML."
    }, 
    {
        full: "nw",
        description: "Build tests as Node-Webkit project (.nw)."
    }, 
    {
        full: "ES6",
        description: "Activate EcmaScript 6 capability."
    }, 
    {
        full: "compress",
        description: "Compress output javascript."
    }, 
    {
        short: "h",
        full: "help",
        description: "Show this message.",
        check: function (flag) {
            console.log(this.usage());
            return true;
        }
    }, 
    
], {
    entry: "make.js",
    description: "Akra Engine automatic build system.",
    examples: [
        {
            description: "build 'inc/akra.ts' to './bin/akra.js' with EcmaScript 6 capabilities.",
            cmd: "make.js inc/akra.ts -o ./bin/akra.js --build ../ -t CORE --ES6"
        }, 
        {
            description: "Build test 'path/to/test.ts' as HTML test with compressing.",
            cmd: "make.js --build ../ -t TESTS --ES6 --tests tests/common --test path/to/test.ts --compress --html"
        }
    ]
});
console.log("\n\n------------->\n\n", argv.flags["t"].value);
