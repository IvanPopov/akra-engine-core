
var t = {
	'Mat4': {
		'pData': 'Float32Array'
	},
	'Vec4': {
		'pData': 'Float32Array'	
	},
	'Vec3': {
		'pData': 'Float32Array'
	},
	'Vec2': {
		'pData': 'Float32Array'
	},
	'Quat4': {
		'pData': 'Float32Array'
	},
	//animation
};

a.BinWriter.template(t);
a.BinReader.template(t);

a.BinWriter.template({
	'Float32Array': function (pData) {
		this.float32Array(pData);
	},
	'Object': function (object) {
		this.stringArray(Object.keys(object));

		for (var key in object) {
			this.write(object[key], true);	
		}
	},
	'String': function (str) {
		this.string(str);
	},
	'Number': function (val) {
		this.float32(val);
	},
	'Boolean': function (b) {
		this.bool(b);
	}
});

a.BinReader.template({
	'Float32Array': function (pData) {
		return this.float32Array();
	},
	'Object': function () {
		var object = {};
		var keys = this.stringArray();
		trace('object keys > ', keys);
		var type;

		for (var i = 0; i < keys.length; ++ i) {
			type = this.string();
			object[keys[i]] = this.read(type);	
		}

		return object;
	},
	'String': function () {
		return this.string();
	},
	'Number': function (val) {
		return this.float32();
	},
	'Boolean': function () {
		return this.bool();
	}
});