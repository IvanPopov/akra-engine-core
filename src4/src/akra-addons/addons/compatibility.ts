/// <reference path="../../../built/Lib/akra.d.ts" />

module akra.addons {
	interface IRequirement {
		name: string;
		desc: string;
		done: boolean;
		link: string;
	}

	var pRequirements: IMap<IRequirement> = null

	function require(pReq: IRequirement) {
		pRequirements[pReq.name.toUpperCase()] = pReq;
	}

	function check(sName: string): boolean {
		debug.assert(isDefAndNotNull(pRequirements[sName.toUpperCase()]), "Could not check unknown requirement.");
		return pRequirements[sName.toUpperCase()].done;
	}

	function checkAll(): boolean {
		for (var sName in pRequirements) {
			if (!check(sName)) {
				return false;
			}
		}
	}

	function checkWebGLExtension(extension) {
		require({
			name: extension,
			desc: extension + " WebGL extension",
			done: webgl.hasExtension(extension),
			link: "http://www.khronos.org/registry/webgl/extensions/" + extension + "/"
		});
	}

	function buildLog(): string {
		var s = "";

		for (var sName in pRequirements) {
			var pReq: IRequirement = pRequirements[sName];

			var sNew = " Check " + pReq.desc;
			s += sNew;

			for (var n = sNew.length; n < 64; ++n) {
				s += ".";
			}

			s += check(sName) ? "[   OK   ]" : "[ FAILED ]";
			s += "\n";
		}

		return s;
	}

	export function checkCompatibility(): boolean {

		pRequirements = <any>{};

		require({
			name: "WebGL",
			done: webgl.isEnabled(),
			desc: "WebGL API",
			link: "https://developer.mozilla.org/en-US/docs/Web/WebGL"
		});

		if (!check("webgl")) {
			throw new Error("WebGL not supported.");
			return false;
		}


		checkWebGLExtension(webgl.WEBGL_COMPRESSED_TEXTURE_S3TC);
		checkWebGLExtension(webgl.WEBGL_DEPTH_TEXTURE);
		checkWebGLExtension(webgl.OES_TEXTURE_FLOAT);
		checkWebGLExtension(webgl.OES_ELEMENT_INDEX_UINT);
		checkWebGLExtension(webgl.OES_STANDARD_DERIVATIVES);

		require({
			name: "Webstorage",
			desc: "Webstorage API",
			link: "https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage",
			done: info.api.getLocalStorage()
		});

		require({
			name: "LocalFileSystem",
			desc: "LocalFileSystem API",
			link: "https://developer.mozilla.org/en-US/docs/Web/API/LocalFileSystem",
			done: info.api.getFileSystem()
		});

		require({
			name: "WebWorkers",
			desc: "WebWorkers API",
			link: "https://developer.mozilla.org/en-US/docs/Web/API/Worker",
			done: info.api.getWebWorker()
		});

		return checkAll();
	} 

	export function buildCompatibilityLog(): string {
		return buildLog();
	}
}