// AIAjaxParams interface
// [write description here...]

enum AEAjaxDataTypes {
	TEXT,
	JSON,
	BLOB,
	ARRAY_BUFFER,
	DOCUMENT
}

enum AEAjaxHttpMethods {
	GET = 1,
	POST
}
enum AEAjaxHttpCodes {
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

interface AIAjaxStatusCodeCallback {
	(code: uint): void;
}

interface AIAjaxStatusCodeMap {
	[code: uint]: AIAjaxStatusCodeCallback;
}

interface AIAjaxErrorCallback {
	(request?: XMLHttpRequest, statusText?: string, error?: Error): void;
}

interface AIAjaxSuccessCallback {
	(data?: any, statusText?: string, request?: XMLHttpRequest): void;
}

interface AIAjaxBeforeSendCallback {
	(request?: XMLHttpRequest, settings?: AIAjaxParams): boolean;
}

interface AIAjaxParams {
	url?: string;
	async?: boolean;
	statusCode?: AIAjaxStatusCodeMap;
	success?: AIAjaxSuccessCallback;
	error?: AIAjaxErrorCallback;
	beforeSend?: AIAjaxBeforeSendCallback;
	data?: Object;
	cache?: boolean;
	contentType?: string;
	dataType?: AEAjaxDataTypes;
	type?: AEAjaxHttpMethods;
	timeout?: uint;
}

interface AIAjaxResultSync {
	data: any;
	statusText: string;
	xhr: XMLHttpRequest;
}
