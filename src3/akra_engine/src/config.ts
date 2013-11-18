/// <reference path="idl/AIAjaxParams.ts" />
/// <reference path="idl/common.d.ts" />

import conv = require("conv");

//unknown constants
export var unknown = {
    code: 0,
    message: "Unknown code.",
    name: "unknown"
}

//global
export var DEBUG: boolean = has("DEBUG");
export var data = "";
export var version = "0.1.1";
export var defaultName: string = "default";

//material
export var material = {
    name: defaultName
};

//default ajax parameters
export var ajax = {
    async: false,
    statusCode: {},
    success: null,
    error: null,
    beforeSend: null,
    data: null,
    cache: false,
    contentType: "application/x-www-form-urlencoded",
    dataType: "text", 
    type: "get",
    timeout: 0
};

export var threading = {
    min: 0, //the minimum number of threads created on startup
    max: 4,  //the maximum number of threads created on startup
    idleTime: 30, //maximum IDLE time (sec)
};

export var io = {
    //thread file config
    tfile: {
        interface: "FileInterface.t.js",
        local: "LocalFile.t.js",
        remote: "RemoteFile.t.js"
    },
    //local file config
    local: {
        filesystemLimit: 32 * 1024 * 1024 //32 mb
    }
}

export var deps = {
    archiveIndex: ".map",
    etag: {
        file: ".etag",
        forceCheck: false
    }
};




















//thread inlining
if (!DEBUG) {
    var buildInlineThread = (sInterface: string, sLogic: string): string => {
        return conv.toURL(
            "var $INTERFACE_DEFINED = true;\n" + sLogic + "\n" + sInterface,
            "application/javascript");
    };

    var ifaceContent: string = __STRINGIFY__(__MINIFY__(__CONTENT__("/js/FileInterface.t.js")));
    var localContent: string = __STRINGIFY__(__MINIFY__(__CONTENT__("/js/LocalFile.t.js")));
    var remoteContent: string = __STRINGIFY__(__MINIFY__(__CONTENT__("/js/RemoteFile.t.js")));

    io.tfile.interface = null;
    io.tfile.local = buildInlineThread(ifaceContent, localContent);
    io.tfile.remote = buildInlineThread(ifaceContent, remoteContent);
}