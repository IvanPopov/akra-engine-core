declare var process: {
	argv: string[];
};

export module optarg {
	export interface IFlag {
		short: string;
		full: string;
		default: any;
		
		boolean?: bool;
		string?: bool;
		number?: bool;

		//can be: string, number, int, float, boolean, bool
		type: string;

		description?: string;
		demand: bool;

		check?: (flag) => bool;
	}

	export interface IArgument {
		demand?: bool;
		type?: string;
		description?: string;

		boolean?: bool;
		string?: bool;
		number?: bool;
	}

	export interface IFlagInfo {
		name: string;
		value: any;
	}

	export class Flag {
		
		data: IFlag = null;
		params: any[] = [];
		short: bool = false;
		name: string = null;
		value: any = null;

		parser: Parser;

		constructor (parser: Parser, param: string, short: bool) {
			this.parser = parser;
			this.short = short;

			var info: IFlagInfo;
			var data: IFlag;
			var name: string;

			info = this.parse(param);
			data = this.data = parser.findFlagDesc(info.name, short);
		
			
			if (data) {
				if (this.check(info, data)) {
					// console.log(data.short, "[", data.full, "] (", data.description, ") = ", info.value);

					if (data.demand) {
						parser.specifyDemandFlag(param, short);
					}
				}
				else {
					throw new Error("incorrect flag data...");
				}
			}
			else {
				throw new Error("used unknown flag: " + info.name);
			}
		}

		private parse(param: string): IFlagInfo {
			var eqpos: number = param.indexOf("=");
			var name: string;
			var value: string = null;

			if (eqpos < 0) {
				name = param;
			}
			else {
				name = param.substr(0, eqpos);
				value = param.substr(eqpos + 1);
			}

			return {name: name, value: value};
		}

		private check(info: IFlagInfo, data: IFlag): bool {
			if (!data.boolean && info.value === null) {
				info.value = this.parser.pop(true);

				if (!info.value) {
					info.value = data.default;
				}
			}

			if (data.boolean) {
				info.value = true;
			}


			if (data.number) {
				info.value = parseFloat(info.value);
			}

			this.name = info.name;
			this.value = info.value;

			if (data.check) {
				return data.check.call(this.parser, this);
			}

			return true;
		}

		isShort(): bool { 
			return this.short;
		}

		isFull(): bool {
			return !this.short;
		}
	}

	export class Argument {
		constructor (parser: Parser, param: string) {
			console.log("argument > ", param);
		}	
	}

	export interface IExample {
		description: string; 
		cmd: string;
	}

	export interface IParserOptions {
		description: string;
		examples?: IExample[];
		entry?: string;
	}

	export class Parser {
		private arglist: IArgument[] = [];
		private flaglist: IFlag[] = [];
		private params: string[] = [];
		private demandflags: IFlag[] = [];
		private description: string = "";
		private examples: IExample[] = null;
		private entry: string = "make.js";

		flags: {[i: string]: Flag;} = {};
		args: Argument[] = [];

		constructor (arglist: IArgument[] = null, flaglist: IFlag[] = null, options: IParserOptions = null) {
			if (arglist) {
				for (var i: number = 0; i < arglist.length; ++ i) {
					this.argument(arglist[i]);
				};
			}

			if (flaglist) {
				for (var i: number = 0; i < flaglist.length; ++ i) {
					this.flag(flaglist[i]);
				};
			}

			if (options) {
				if (options.description) {
					this.setUsage(options.description, options.examples || null, options.entry || null);
				}
			}
		}


		flag(flag: IFlag): Parser {

			var data: IFlag = {
				short:  null,
				full: null,
				default: null,
				
				string: false,
				boolean: false,
				number: false,

				type: null,

				description: "Unknown flag.",
				demand: false,

				check: null
			}

			for (var key in flag) {
				var value: any = flag[key];
				switch (key) {
					case "short":
						data.short = value[0] || null;
						break;
					case "full":
						data.full = <string>value
						break;
					case "default":
					case "description": 
						data[key] = <string>value;
						break;
					case "string": 
					case "boolean": 
					case "number": 
					case "demand":
						data[key] = <bool>value;
						break;
					case "type": 
						data.type = ["string", "number", "bool", "boolean", "int", "float"].indexOf(value) < 0? "string": value;
						break;
					case "check": 
						data.check = <(flag) => bool>value;
						break;
				}
			}

			switch (data.type) {
				case "string":
					data.string = true;
					break;
				case "boolean":
				case "bool":
					data.boolean = true;
					break;
				case "number":
				case "int":
				case "float":
					data.number = true;
					break;
			}

			if (data.boolean) {
				data.number = data.string = false;
			}

			if (data.string) {
				data.number = data.boolean = false;
			}

			if (data.number) {
				data.string = data.boolean = false;
			}

			if (!data.boolean && !data.string && !data.number) {
				data.boolean = true;
			}

			if (data.short && this.findFlagDesc(data.short, true)) {
				console.log("flag dublicated(short: ", data.short, ")");
				return this;
			}

			if (data.full && this.findFlagDesc(data.full)) {
				console.log("flag dublicated(full: ", data.full, ")");
				return this;
			}

			this.flaglist.push(data);

			if (data.demand) {
				this.demandflags.push(data);
			}

			return this;
		}

		argument(arg: IArgument): Parser {

			var data: IArgument = {
				string: false,
				boolean: false,
				number: false,

				type: null,

				description: null,
				demand: false
			}

			for (var key in arg) {
				var value: any = arg[key];
				switch (key) {
					case "description": 
						data[key] = <string>value;
						break;
					case "string": 
					case "boolean": 
					case "number": 
					case "demand":
						data[key] = <bool>value;
						break;
					case "type": 
						data.string = ["string", "number", "bool", "boolean", "any", "int", "float"].indexOf(value) < 0? "any": value;
						break;
				}
			}

			switch (data.type) {
				case "string":
					data.string = true;
					break;
				case "boolean":
				case "bool":
					data.boolean = true;
					break;
				case "number":
				case "int":
				case "float":
					data.number = true;
					break;
			}

			if (data.boolean) {
				data.number = data.string = false;
			}

			if (data.string) {
				data.number = data.boolean = false;
			}

			if (data.number) {
				data.string = data.boolean = false;
			}

			if (!data.boolean && !data.string && !data.number) {
				data.boolean = true;
			}

			this.arglist.push(data);

			return this;
		}

		specifyDemandFlag(name: string, short: bool = false): void {
			for (var i = 0; i < this.demandflags.length; ++ i) {
				if ((short? this.demandflags[i].short: this.demandflags[i].full) === name) {
					this.demandflags.splice(i, 1);
					return;
				}
			}
		}

		parse(argv: string[]): Parser {
			var arg: string;
			var flags: string;

			for (var i: number = 0; i < argv.length; ++ i) {
				this.push(argv[i]);
			};

			while (arg = this.pop()) {
				if (arg[0] === "-") {
					if (arg[1] === "-") {
						this.pushFlag(new Flag(this, arg.substr(2), false));
					}
					else {
						flags = arg.substr(1);
						
						if (arg[2] !== "=") {
							for (var i: number = 0; i < flags.length; ++ i) {
								this.pushFlag(new Flag(this, flags[i], true));
							}
						}
						else {
							this.pushFlag(new Flag(this, flags, true));
						}
					}
				}
				else {
					this.pushArgument(new Argument(this, arg));
				}
			}

			if (this.demandflags.length) {
				console.log("you must specify demand flag: ", this.demandflags[0].full || this.demandflags[0].short);
			}

			return this;
		}

		findFlagDesc(name: string, short: bool = false): IFlag {
			for (var i: number = 0; i < this.flaglist.length; ++ i) {
				var data: IFlag = this.flaglist[i];
				if (short && data.short === name) {
					return data;
				}

				if (!short && data.full === name) {
					return data;
				}
			}

			return null;
		}

		private pushFlag(flag: Flag): void {
			if (!flag.data) {
				return;
			}

			if (flag.isShort()) {
				this.flags[flag.data.short] = flag;
			}

			if (flag.isFull()) {
				this.flags[flag.data.full] = flag;
			}
		}

		private pushArgument(arg: Argument): void {

		}

		push(param: string): void {
			this.params.unshift(param);
		}

		pop(onlyargumens: bool = false): string {
			var data: string = this.params.pop();
			
			if (onlyargumens && data[0] === "-") {
				this.push(data);
				return null;
			}
			
			return data || null;
		}

		setUsage(message: string, examples: IExample[] = null, entry: string = null): void {
			this.description = message;
			this.examples = examples;
			this.entry = entry || "make.js";
		}

		usage(): string {
			var result: string[] = [this.description, null];
			var row: string;

			if (this.arglist.length || this.flaglist.length) {
				result.push("Usage: ");
					row = "\t " + this.entry + " ";
				
				for (var i = 0; i < this.arglist.length; ++ i) {
					var arg: IArgument = this.arglist[i];
					
					row += arg.demand? "< " + arg.description + " >": "[ " + arg.description + " ]";
					row += " ";
				}

				for (var i = 0; i < this.flaglist.length; ++ i) {
					var flag: IFlag = this.flaglist[i];
					
					if (!flag.short && !flag.full) continue;

					row += arg.demand? 
					"< " + (flag.short? "-" + flag.short: "--" + flag.full) + " >":
					 "[ " + (flag.short? "-" + flag.short: "--" + flag.full) + " ]";
					row += " ";
				}

				result.push(row, null);
			}

			for (var i = 0; i < this.flaglist.length; ++ i) {
				var data: IFlag = this.flaglist[i];
				row = "\t";

				if (data.full) {
					row += "--" + data.full;
					
				}

				if (data.short) {
					if (row.length) row += ", "
					row += "-" + data.short;
				}

				for (var n = 0, m = 20 - row.length; n < m; ++ n) {
					row += " ";
				}

				row += data.demand? "[ required ]": "[ optional ]";
				row += (data.boolean? "[  bool  ]": (data.string? "[ string ]": "[ number ]"));
	
				row += "\t";
				row += data.description;
				row += " ";

				if (data.default) {
					row += "[ default: " + data.default + " ]";
				}

				result.push(row);
			}

			

			if (this.examples) {
				result.push(null);
				result.push("Examples: ");

				for (var i = 0; i < this.examples.length; ++ i) {
					var example: IExample = this.examples[i];
					row = "\t";

					row += example.description + "\n\t\t > " + example.cmd;

					result.push(row);
				}
			}

			result.push(null);

			return result.join("\n");
		}
	}

	export function create(arglist: IArgument[] = null, flaglist: IFlag[] = null, options: IParserOptions = null): Parser {
		return new Parser(arglist, flaglist, options);
	}	

	export function parse (argv: string[], arglist: IArgument[] = null, flaglist: IFlag[] = null, options: IParserOptions = null) {
		return create(arglist, flaglist, options).parse(argv);
	}
}



var argv = optarg.parse(process.argv.splice(2), 
	[
		{
			string: true,
			description: "File for building."
		}
	], 
	//<optarg.IFlag[]>
	[
		{
			short: "t", 
			full: "target",
			description: "Build target. Can be CORE, TESTS or ALL", 
			string: true,
			default: "CORE",
			check: function (flag: optarg.Flag): bool {
				switch ((flag.value || "").toUpperCase()) {
					case "CORE":
					case "TESTS":
					case "ALL":
						return true;
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
			check: function (flag: optarg.Flag) {
				console.log(this.usage());
				return true;
			}
		},

	],
	{
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

