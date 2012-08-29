A_FORMAT({
	'Mat4': {
		'pData': 'Float32Array',

		'@constructor': function () {
			return new Mat4;
		}
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
	'Number': 'Float32',
	'Float'	: 'Float32',
	'Int'	: 'Int32',
	'Uint'	: 'Uint32',
	'Array'	: 'Object'
});

A_FORMAT_OUT({
	'Float32Array': function (pData) { this.float32Array(pData); },
	'Float64Array': function (pData) { this.float64Array(pData); },
	
	'Int32Array': function (pData) { this.int32Array(pData); },
	'Int16Array': function (pData) { this.int16Array(pData); },
	'Int8Array'	: function (pData) { this.int8Array(pData); },

	'Uint32Array': function (pData) { this.uint32Array(pData); },
	'Uint16Array': function (pData) { this.uint16Array(pData); },
	'Uint8Array' : function (pData) { this.uint8Array(pData); },

	'String': function (str) { this.string(str); },

	//float
	'Float64': function (val) { this.float64(val); },
	'Float32': function (val) { this.float32(val); },


	//int
	'Int32'	: function (val) { this.int32(val); },
	'Int16'	: function (val) { this.int16(val); },
	'Int8'	: function (val) { this.int8(val); },

	//uint
	'Uint32': function (val) { this.uint32(val); },
	'Uint16': function (val) { this.uint16(val); },
	'Uint8'	: function (val) { this.uint8(val); },

	'Boolean': function (b) { this.bool(b); },

	'Object': function (object) {
		if (object instanceof Array) {
			this.bool(true); 	//is array
			this.uint32(object.length);

			for (var i = 0; i < object.length; ++ i) {
				this.write(object[i]);
			}
		}
		else {
			this.bool(false); 	//is not array
			this.stringArray(Object.keys(object));

			for (var key in object) {
				this.write(object[key]);	
			}
		}
	},
});

A_FORMAT_IN({
	'Float32Array': function () { return this.float32Array(); },
	'Float64Array': function () { return this.float64Array(); },
	
	'Int32Array': function () { return this.int32Array(); },
	'Int16Array': function () { return this.int16Array(); },
	'Int8Array'	: function () { return this.int8Array(); },

	'Uint32Array': function () { return this.uint32Array(); },
	'Uint16Array': function () { return this.uint16Array(); },
	'Uint8Array' : function () { return this.uint8Array(); },

	'String': function () { return this.string(); },

	//float
	'Float64': function () { return this.float64(); },
	'Float32': function () { return this.float32(); },


	//int
	'Int32'	: function () { return this.int32(); },
	'Int16'	: function () { return this.int16(); },
	'Int8'	: function () { return this.int8(); },

	//uint
	'Uint32': function () { return this.uint32(); },
	'Uint16': function () { return this.uint16(); },
	'Uint8'	: function () { return this.uint8(); },

	'Boolean': function () { return this.bool(); },

	'Object': function (object) {
		var is_array = this.bool();
		var keys;
		var n;

		if (is_array) {
			n = this.uint32();
			object = object || new Array(n);

			for (var i = 0; i < n; ++ i) {
				object[i] = this.read();	
			}
		}
		else {
			object = object || {};
			keys = this.stringArray();

			for (var i = 0; i < keys.length; ++ i) {
				object[keys[i]] = this.read();
			}
		}

		return object;
	}
});