#ifndef UTILDEPSINCLUDE_TS
#define UTILDEPSINCLUDE_TS

#include "info/info.ts"

module akra.util.deps {

	export interface IScriptInfo {
		path?: string;
		scripts: string[];
	}

	var readyRegExp: RegExp = navigator.platform === 'PLAYSTATION 3' ?
                      /^complete$/ : /^(complete|loaded)$/;

	function removeListener(node: HTMLScriptElement, func: EventListener, name: string, ieName?: string) {
        //Favor detachEvent because of IE9
        //issue, see attachEvent/addEventListener comment elsewhere
        //in this file.
        if (node.detachEvent && !info.is.Opera) {
            //Probably IE. If not it will throw an error, which will be
            //useful to know.
            if (ieName) {
                node.detachEvent(ieName, func);
            }
        } else {
            node.removeEventListener(name, func, false);
        }
    }

    function removeCallbacks(e: Event, callback: EventListener) {
    	var node: HTMLScriptElement = <HTMLScriptElement>(e.currentTarget || e.srcElement);

    	removeListener(node, callback, "load", "onreadystatechange");
        removeListener(node, callback, "error");
    }

	export function requireJS(
		url: string, 
		callback: (err: Event, script: HTMLScriptElement) => void, 
		parent: HTMLElement = null): void {

	    var script: HTMLScriptElement = <HTMLScriptElement>document.createElement("script");
	    script.type = "text/javascript";
	    script.charset = "utf-8";
        script.async = true;

        var fnScriptLoad: EventListener, 
        	fnScriptError: EventListener;

        fnScriptLoad = (e: Event): void => {
        	if (e.type === "load" ||
                    (readyRegExp.test(<string>(<any>(e.currentTarget || e.srcElement)).readyState))) {

        		removeCallbacks(e, <EventListener>callback);	
        		callback(null, script);
            }
        };

        fnScriptError = (e: Event): void => {
        	removeCallbacks(e, <EventListener>callback);	
        	callback(e, null);
        }

	    if (script.readyState) {  
	    //IE
	        script.onreadystatechange = fnScriptLoad;
	    } 
	    else {  
	    //Others
	        script.onload = fnScriptLoad;
	    }

		script.onerror = <EventListener>callback;
		

	    script.src = url;

	    if (isNull(parent)) {
	    	parent = <HTMLElement>document.getElementsByTagName("head")[0];
	    }

	    parent.appendChild(script);
	}

	export function js(url: string, callback: (err: Event, scripts: HTMLScriptElement[]) => void): void;
	export function js(info: IScriptInfo, callback: (err: Event, scripts: HTMLScriptElement[]) => void): void;
	export function js(arg: any, callback: (err: Event, scripts: HTMLScriptElement[]) => void): void {
		var info: IScriptInfo;

		if (isString(arguments[0])) {
			info = {
				path: akra.DATA, 
				scripts: [arguments[0]]
			};
		}
		else {
			info = <IScriptInfo>arguments[0];
		}

		var iCurrentScript: int = 0;
		var pScripts: HTMLScriptElement[] = [];
		var fnLoad: (e: Event, pScript: HTMLScriptElement) => void;

		var fnStart = () => {
			requireJS(path.resolve(info.scripts[iCurrentScript], info.path || null), fnLoad);
		}

		fnLoad = (e: Event, pScript: HTMLScriptElement): void => {
			if (e) {
				callback(e, null);
			}

			pScripts.push(pScript);
			
			if ((++iCurrentScript) < info.scripts.length) {
				fnStart();
			}
			else {
				callback(null, pScripts);
			}
		};

		fnStart();
	}

	export function css(url: string): void {
	    var link: HTMLLinkElement = <HTMLLinkElement>document.createElement("link");
	    link.type = "text/css";
	    link.rel = "stylesheet";
	    link.href = url;

	    document.getElementsByTagName("head")[0].appendChild(link);
	}
}

#endif

