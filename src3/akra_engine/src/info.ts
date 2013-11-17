/// <reference path="idl/AICanvasInfo.ts" />
/// <reference path="idl/AIURI.ts" />

import BrowserInfo = require("info/BrowserInfo");
import ApiInfo = require("info/ApiInfo");
import ScreenInfo = require("info/ScreenInfo");
import path = require("path");
import uri = require("uri");

export function canvas(pCanvas: HTMLCanvasElement): AICanvasInfo;
export function canvas(id: string): AICanvasInfo;
export function canvas(id): AICanvasInfo {
    var pCanvas: HTMLCanvasElement = isString(id) ? document.getElementById(id) : id;

    return {
        width: pCanvas.offsetWidth,
        height: pCanvas.offsetHeight,
        id: pCanvas.id
    };
}

export var browser: AIBrowserInfo = new BrowserInfo;
export var api: AIApiInfo = new ApiInfo;
export var screen: AIScreenInfo = new ScreenInfo;
export var uri: AIURI = uri.parse(document.location.href);

export module is {
    /**
     * show status - online or offline
     */
    var online;
    /**
     * perform test on mobile device
     */
    var mobile: boolean = (/mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i)
        .test(navigator.userAgent.toLowerCase());
    var linux: boolean = browser.os === 'Linux';
    var windows: boolean = browser.os === 'Windows';
    var mac: boolean = browser.os === 'Mac';
    var iPhone: boolean = browser.os === 'iPhone';

    var Opera: boolean = browser.name === "Opera";
}



//TODO: move it to [akra.info.is] module, when typescript access this.
Object.defineProperty(is, 'online', {
    get: function () {
        return navigator.onLine;
    }
});
