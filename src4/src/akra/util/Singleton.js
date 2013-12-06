var akra = {};

/**
 * / <reference path="../common.ts" />
 */
akra.util = {};

/**
 * /*,constructor() {,if (isDef(Singleton._instance)),throw new Error("Singleton class may be created only one time.");,Singleton._instance = <T>this;,},static getInstance() {,if (Singleton._instance === null) {,Singleton._instance = new ((<any>this).constructor)();,},return Singleton._instance;,}
 *
 * @constructor
 * @struct
 */
akra.util.Singleton = function () {
  /** @type {?} */ var _this = /** @type {?} */ (this);
  /** @type {?} */ var _constructor = _this.constructor;

  if (_constructor._instance != null) {
    throw new Error("Singleton class may be created only one time.");
  }

  _constructor._instance = /** @type {?} */ (this);
};

/**
 * @returns {?}
 */
akra.util.Singleton.getInstance = function () {
  if (this._instance === null) {
    this._instance = new ((/** @type {?} */ (this)))();
  }

  return this._instance;
};

/** @type {?} */ akra.util.Singleton._instance = null;
