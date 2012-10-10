module akra {
    export var DEBUG: bool = true;

    export function typeOf(x: any): string {
        var s: string = typeof x;

        if (s === "object") {
            if (x) {

                if (x instanceof Array) {
                    return 'array';
                } else if (x instanceof Object) {
                    return s;
                }

                var className = Object.prototype.toString.call(x);

                if (className == '[object Window]') {
                    return 'object';
                }

                if ((className == '[object Array]' ||
                     typeof x.length == 'number' &&
                     typeof x.splice != 'undefined' &&
                     typeof x.propertyIsEnumerable != 'undefined' &&
                     !x.propertyIsEnumerable('splice')

                    )) {
                    return 'array';
                }

                if ((className == '[object Function]' ||
                    typeof x.call != 'undefined' &&
                    typeof x.propertyIsEnumerable != 'undefined' &&
                    !x.propertyIsEnumerable('call'))) {
                    return 'function';
                }

            } else {
                return 'null';
            }

        } else if (s == 'function' && typeof x.call == 'undefined') {
            return 'object';
        }
        return s;
    };

    /** @inline */
    export var isDef = (x: any): bool =>  x !== undefined;

    /** @inline */
    export var isNull = (x: any): bool =>  x === null;

    /** @inline */
    export var isBoolean = (x: any): bool => typeof x === "boolean";

    /** @inline */
    export var isNumber = (x: any): bool => typeof x === "number";
    /** @inline */
    export var isFloat = isNumber;
    /** @inline */
    export var isInt = isNumber;

    /** @inline */
    export var isFunction = (x: any): bool => typeOf(x) === "function";

    /** @inline */
    export var isObject = (x: any): bool => {
        var type = typeOf(x);
        return type == 'object' || type == 'array' || type == 'function';
    };

    if (!isDef(console.assert)) {
        console.assert = function (isOK?: bool, ...pParams: any[]): void { 
            if (!isOK) {
                trace('---------------------------');
                trace.apply(null, pParams);
                throw new Error("[assertion failed]");
            }
        }
    }

    export var trace = console.log.bind(console);
    export var assert = console.assert.bind(console);
    export var warning = console.warn.bind(console);

    export var debug_assert = (isOK: bool, ...pParams: any[]): void => {
        if (DEBUG) {
            assert.apply(null, arguments);
        }
    }
    
    export var debug_warning = (pArg:any, ...pParams: any[]): void => {
        if (DEBUG) {
            warning.apply(null, arguments);
        }
    }

};

///<reference path="types.d.ts" />
///<reference path="WebGL.d.ts" />

///<reference path="math/math.ts" />

///<reference path="WorldExtents.ts" />
///<reference path="Viewport.ts" />

///<reference path="IResourcePool.ts" />
///<reference path="pool/DataPool.ts" />
///<reference path="pool/ResourcePool.ts" />
///<reference path="pool/ResourcePoolItem.ts" />


///<reference path="IRenderer.ts" />
///<reference path="ICamera.ts" />

///<reference path="IManager.ts" />
///<reference path="IResourceManager.ts" />
///<reference path="IDisplayManager.ts" />
///<reference path="ILightManager.ts" />
///<reference path="IParticleManager.ts" />
///<reference path="ISpriteManager.ts" />

///<reference path="IEngine.ts" />
///<reference path="Engine.ts" />
