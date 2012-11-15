#ifndef IAJAXPARAMS_TS
#define IAJAXPARAMS_TS

module akra {

	export enum EAjaxDataTypes {
		TEXT,
        JSON,
        BLOB,
        ARRAY_BUFFER,
        DOCUMENT
	}

	export enum EAjaxHttpMethods {
		GET = 1,
        POST
	}
	export enum EAjaxHttpCodes {
		OK = 200,
        CREATED,
        ACCEPTED,
        PARTIAL_INFORMATION,
        MOVED = 301,
        FOUND,
        METHOD,
        NOT_MODIFIED = 304,
        BAD_REQUEST = 400,
        UNAUTHORIZED,
        PAYMENT_REQUIRED,
        FORBIDDEN,
        NOT_FOUND,
        INTERNAL_ERROR = 500,
        NOT_IMPLEMENTED,
        SERVICE_TEMPORARILY_OVERLOADED,
        GATEWAY_TIMEOUT
	}

	export interface IAjaxStatusCodeCallback {
		(code: uint): void;
	}

	export interface IAjaxStatusCodeMap {
		[code: uint]: IAjaxStatusCodeCallback;
	}

	export interface IAjaxErrorCallback {
		(request?: XMLHttpRequest, statusText?: string, error?: Error): void;
	}

	export interface IAjaxSuccessCallback {
		(data?: any, statusText?: string, request?: XMLHttpRequest): void;
	}

	export interface IAjaxBeforeSendCallback {
		(request?: XMLHttpRequest, settings?: IAjaxParams): bool;
	}

	export interface IAjaxParams {
		url?: string;
		async?: bool;
		statusCode?: IAjaxStatusCodeMap;
		success?: IAjaxSuccessCallback;
		error?: IAjaxErrorCallback;
		beforeSend?: IAjaxBeforeSendCallback;
		data?: Object;
		cache?: bool;
		contentType?: string;
		dataType?: EAjaxDataTypes;
		type?: EAjaxHttpMethods;
		timeout?: uint;
	}

	export interface IAjaxResultSync {
		data: any;
		statusText: string;
		xhr: XMLHttpRequest;
	}
}

#endif