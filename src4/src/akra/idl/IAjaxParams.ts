
module akra {
	enum EAjaxDataTypes {
		TEXT,
		JSON,
		BLOB,
		ARRAY_BUFFER,
		DOCUMENT
	}
	
	enum EAjaxHttpMethods {
		GET = 1,
		POST
	}
	enum EAjaxHttpCodes {
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
	
	interface IAjaxStatusCodeCallback {
		(code: uint): void;
	}
	
	interface IAjaxStatusCodeMap {
		[code: uint]: IAjaxStatusCodeCallback;
	}
	
	interface IAjaxErrorCallback {
		(request?: XMLHttpRequest, statusText?: string, error?: Error): void;
	}
	
	interface IAjaxSuccessCallback {
		(data?: any, statusText?: string, request?: XMLHttpRequest): void;
	}
	
	interface IAjaxBeforeSendCallback {
		(request?: XMLHttpRequest, settings?: IAjaxParams): boolean;
	}
	
	interface IAjaxParams {
		url?: string;
		async?: boolean;
		statusCode?: IAjaxStatusCodeMap;
		success?: IAjaxSuccessCallback;
		error?: IAjaxErrorCallback;
		beforeSend?: IAjaxBeforeSendCallback;
		data?: Object;
		cache?: boolean;
		contentType?: string;
		dataType?: EAjaxDataTypes;
		type?: EAjaxHttpMethods;
		timeout?: uint;
	}
	
	interface IAjaxResultSync {
		data: any;
		statusText: string;
		xhr: XMLHttpRequest;
	}
	
}
