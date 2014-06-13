/// <reference path="../../../built/Lib/akra.d.ts" />

module akra.addons.compatibility {
	interface IRequirement {
		name: string;
		desc: string;
		done: boolean;
		link: string;
		flag?: int;
	}

	var pRequirements: IMap<IRequirement> = null;
	var iTotal: int = 0;
	var extIgnoreList: string[] = [];

	function require(pReq: IRequirement) {
		pRequirements[pReq.name.toUpperCase()] = pReq;
		pReq.flag = 1 << iTotal++;
	}

	function or() {
		iTotal--;
	}

	function check(sName: string): boolean {
		debug.assert(isDefAndNotNull(pRequirements[sName.toUpperCase()]), "Could not check unknown requirement.");
		return pRequirements[sName.toUpperCase()].done;
	}

	function isCompatible(): boolean {
		var i = 0xFFFFFFFF;

		for (var sName in pRequirements) {
			var pReq = pRequirements[sName];

			if (!pReq.done) {
				i &= ~pReq.flag;
			}
			else {
				i |= pReq.flag;
			}
		}

		return (i >>> 0) === 0xFFFFFFFF;
	}


	function checkWebGLExtension(extension: string) {
		if (extIgnoreList.indexOf(extension) !== -1) return;
		require({
			name: extension,
			desc: extension + " WebGL extension",
			done: webgl.hasExtension(extension),
			link: "http://www.khronos.org/registry/webgl/extensions/" + extension + "/"
		});
	}

	function buildLog(): string {
			var s = "\n";

			for (var sName in pRequirements) {
				var pReq: IRequirement = pRequirements[sName];

				var sNew = " Check " + pReq.desc;
				s += sNew;

				for (var n = sNew.length; n < 64; ++n) {
					s += ".";
				}

				s += check(sName) ? "[   OK   ]" : "[ FAILED ] \t" + (pReq.link || "");
				s += "\n";
			}

			return s;
	}

	function throwError(sMesg: string , id?: string) {
		if (isString(id)) {
			var e: HTMLElement = document.getElementById(id);
			e.style.display = "block";
			(<HTMLUnknownElement>e.getElementsByClassName("error")[0]).innerHTML = sMesg +
			"<br /><small>See console log for details.</small>";
		}

		throw new Error(sMesg);
	}

	var ERRORS = {
		NO_WEBGL: "WebGL not supported.",
		NON_COMPATIBLE: "Your browser is not compatible with Akra Engine."
	}

	export function ignoreWebGLExtension(extension: string): void {
		extIgnoreList.push(extension);
	}

	export function requireWebGLExtension(extension: string): void {
		checkWebGLExtension(extension);
	}

	/**
	 * @param id View element with @id if compatibility tests failed.
	 */
	export function verify(id: string = null): boolean {

		pRequirements = <any>{};

		require({
			name: "WebGL",
			done: webgl.isEnabled(),
			desc: "WebGL API",
			link: "https://developer.mozilla.org/en-US/docs/Web/WebGL"
		});

		if (!check("webgl")) {
			throwError(ERRORS.NO_WEBGL, id);
			return false;
		}


		//checkWebGLExtension(webgl.WEBGL_COMPRESSED_TEXTURE_S3TC);
		//checkWebGLExtension(webgl.WEBGL_DEPTH_TEXTURE);
		//checkWebGLExtension(webgl.OES_TEXTURE_FLOAT);
		//checkWebGLExtension(webgl.OES_ELEMENT_INDEX_UINT);
		//checkWebGLExtension(webgl.OES_STANDARD_DERIVATIVES);

		require({
			name: "LocalFileSystem",
			desc: "LocalFileSystem API",
			link: "https://developer.mozilla.org/en-US/docs/Web/API/LocalFileSystem",
			done: info.api.getFileSystem()
		});

		or();

		require({
			name: "Webstorage",
			desc: "Webstorage API",
			link: "https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage",
			done: info.api.getLocalStorage()
		});

		require({
			name: "WebWorkers",
			desc: "WebWorkers API",
			link: "https://developer.mozilla.org/en-US/docs/Web/API/Worker",
			done: info.api.getWebWorker()
		});

		if (!isCompatible()) {
			logger.log(buildLog());
			throwError(ERRORS.NON_COMPATIBLE, id);
			return false;
		}

		return true;
	} 

	export function log(): string {
		return buildLog();
	}
}