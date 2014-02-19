/// <reference path="idl/IAjaxParams.ts" />
/// <reference path="logger.ts" />
/// <reference path="config/config.ts" />
/// <reference path="conv/conv.ts" />
/// <reference path="time.ts" />

module akra {
	var pDefaulParams: IAjaxParams = <IAjaxParams><any>config.ajax;

	function stringToHttpMethod(sMethod: string): EAjaxHttpMethods {
		if (sMethod.toLowerCase() === "get") {
			return EAjaxHttpMethods.GET;
		}

		return EAjaxHttpMethods.POST;
	}

	function stringToAjaxDataType(sDataType: string): EAjaxDataTypes {
		switch (sDataType.toLowerCase()) {
			case "json":
				return EAjaxDataTypes.JSON;
			case "blob":
				return EAjaxDataTypes.BLOB;
			case "html":
			case "document":
				return EAjaxDataTypes.DOCUMENT;
			case "array_buffer":
			case "arraybuffer":
				return EAjaxDataTypes.ARRAY_BUFFER;
		}

		return EAjaxDataTypes.TEXT;
	}

	function ajaxDataTypeToXHRResponseType(eDataType: EAjaxDataTypes): string {

		switch (eDataType) {
			case EAjaxDataTypes.BLOB:
				return "blob";
			case EAjaxDataTypes.ARRAY_BUFFER:
				return "arraybuffer";
			case EAjaxDataTypes.DOCUMENT:
				return "document";
			case EAjaxDataTypes.TEXT:
				return "text";
		}

		return "";
	}

	function createXMLHttpRequest(): XMLHttpRequest {
		if ((<any>window).XMLHttpRequest) {
			return new XMLHttpRequest();
		}
		else if ((<any>window).ActiveXObject) {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}

		return null;
	}

	function queryString(pData: any, sPrefix: string = null): string {
		if (isString(pData)) {
			return pData;
		}

		var pQueryParts: string[] = [];

		for (var p in pData) {
			var k: string = sPrefix ? sPrefix + "[" + p + "]" : p,
				v: any = pData[p];

			pQueryParts.push(isObject(v) ?
				queryString(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
		}

		return pQueryParts.join("&");
	}

	function convertXHRResponse(pRequest: XMLHttpRequest, eType: EAjaxDataTypes, isAsync: boolean): any {
		switch (eType) {
			case EAjaxDataTypes.TEXT:
				return String(pRequest.responseText);
			case EAjaxDataTypes.JSON:
				return conv.parseJSON(pRequest.responseText);
			case EAjaxDataTypes.BLOB:
				return (isAsync ?
					pRequest.response : <Blob>(new Blob([pRequest.responseText], { type: "application/octet-stream" })));
			case EAjaxDataTypes.ARRAY_BUFFER:
				return (isAsync ? (pRequest.response) : pRequest.responseText);
			case EAjaxDataTypes.DOCUMENT:
				return (isAsync ? pRequest.response : conv.parseHTML(pRequest.responseText));
		}

		return null;
	}



	export function ajax(sUrl: string, pSettings?: IAjaxParams, pRequest?: XMLHttpRequest): IAjaxResultSync;
	export function ajax(pSettings: IAjaxParams, pRequest?: XMLHttpRequest): IAjaxResultSync;
	export function ajax(pUrl: any, pSettings?: any, pRequest?: any): IAjaxResultSync {

		var iTimeoutId: int = 0;
		var isAborted: boolean = false;
		var sQueryString: string;
		var pData: Object;
		var sUrl: string;

		if (isString(arguments[0])) {
			sUrl = String(arguments[0]);
			pSettings = <IAjaxParams>arguments[1] || <IAjaxParams>{};
			pRequest = <XMLHttpRequest>arguments[2];
			pSettings.url = sUrl;
		}
		else {
			pSettings = <IAjaxParams>arguments[0];
			pRequest = <XMLHttpRequest>arguments[1];
		}

		pData = pSettings.data || {};

		//setup default parameters
		for (var sKey in pDefaulParams) {
			if (isDef(pSettings[sKey])) {
				continue;
			}

			pSettings[sKey] = pDefaulParams[sKey];
		}

		//if something parameters setuped by strings
		if (isString(pSettings.type)) {
			pSettings.type = stringToHttpMethod(<string><any>pSettings.type);
		}

		if (isString(pSettings.dataType)) {
			pSettings.dataType = stringToAjaxDataType(<string><any>pSettings.dataType);
		}

		var fnCauseError = function (pReq: XMLHttpRequest, pErr: Error) {
			if (!pSettings.error) {
				logger.error(pErr);
			}
			else {
				pSettings.error(pReq, (pReq ? pReq.statusText : null), pErr);
			}
		}

		var fnBeforeResult = function () {
			if (iTimeoutId !== null) {
				clearTimeout(iTimeoutId);
			}
		}

		pRequest = pRequest || createXMLHttpRequest();

		if (!pRequest) {
			fnCauseError(null, new Error("Invalid request object."));
		}

		if (pSettings.timeout > 0) {
			iTimeoutId = setTimeout(function () {
				isAborted = true;
				pRequest.abort();
				fnCauseError(pRequest, new Error("Timeout is over."));
			}, pSettings.timeout);
		}

		if (pSettings.beforeSend) {
			if (!pSettings.beforeSend(pRequest, pSettings)) {
				return null;
			}
		}

		if (pSettings.cache) {
			pData["TIMESTAMP"] = time();
		}

		sQueryString = queryString(pData);

		pRequest.onreadystatechange =
		/** @this {XMLHttpRequest} */ function (): void {
			if (isAborted) {
				return;
			}

			if (pRequest.readyState == this.HEADERS_RECEIVED) {
				if (pSettings.timeout > 0) {
					clearTimeout(iTimeoutId);
				}
			}

			if (pRequest.readyState == this.DONE) {
				var iStatusCode: int = pRequest.status;
				var fnStatusHandler: IAjaxStatusCodeCallback = pSettings.statusCode[iStatusCode];

				if (isDefAndNotNull(fnStatusHandler)) {
					fnStatusHandler(pRequest.status);
				}

				fnBeforeResult();

				if (iStatusCode == EAjaxHttpCodes.OK) {
					if (pSettings.success) {
						pSettings.success(
							convertXHRResponse(pRequest, pSettings.dataType, true),
							pRequest.statusText, pRequest);
					}
				}
				else if (!fnStatusHandler) {
					fnCauseError(pRequest, new Error("Request is not completed successfully (code: " + iStatusCode + ")"));
				}
			}
		}


	if (isAborted) {
			return null;
		}

		if (pSettings.async) {
			try {
				if (pSettings.type == EAjaxHttpMethods.GET) {
					pRequest.open("GET", pSettings.url + (sQueryString.length ? "?" + sQueryString : ""), true);
					pRequest.responseType = ajaxDataTypeToXHRResponseType(pSettings.dataType);
					pRequest.send(null);
				}
				else {
					pRequest.open("POST", pSettings.url, true);
					pRequest.setRequestHeader("Content-Type", pSettings.contentType);
					pRequest.responseType = ajaxDataTypeToXHRResponseType(pSettings.dataType);
					pRequest.send(sQueryString);
				}
			}
			catch (e) {
				fnCauseError(pRequest, e);
			}
		}
		else {
			if (pSettings.type == EAjaxHttpMethods.GET) {
				pRequest.open("GET", pSettings.url + "?" + sQueryString, false);
				pRequest.send(null);
			}
			else {
				pRequest.open("POST", pSettings.url, false);
				pRequest.setRequestHeader("Content-type", pSettings.contentType);
				pRequest.send(sQueryString);
			}

			fnBeforeResult();

			return {
				data: convertXHRResponse(pRequest, pSettings.dataType, false),
				statusText: pRequest.statusText,
				xhr: pRequest
			};
		}

		return null;
	}
}