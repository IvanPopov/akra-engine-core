var akra = {};

/**
 * / <reference path="IItem.ts" />
 * / <reference path="../IMap.ts" />
 */
akra.parser = {};

/**
 * @interface
 */
akra.parser.IState = function () {
};

/**
 * @type {?function(akra.parser.IItem, akra.parser.EParserType): akra.parser.IItem}
 */
akra.parser.IState.prototype.hasItem;
/**
 * @type {?function(akra.parser.IItem): akra.parser.IItem}
 */
akra.parser.IState.prototype.hasParentItem;
/**
 * @type {?function(akra.parser.IItem): akra.parser.IItem}
 */
akra.parser.IState.prototype.hasChildItem;

/**
 * @type {?function(akra.parser.IRule, number): boolean}
 */
akra.parser.IState.prototype.hasRule;

/**
 * @type {?function(): boolean}
 */
akra.parser.IState.prototype.isEmpty;
/**
 * @type {?function(akra.parser.IState, akra.parser.EParserType): boolean}
 */
akra.parser.IState.prototype.isEqual;

/**
 * @type {?function(akra.parser.IItem)}
 */
akra.parser.IState.prototype.push;

/**
 * @type {?function(akra.parser.IRule, number): boolean}
 */
akra.parser.IState.prototype.tryPush_LR0;
/**
 * @type {?function(akra.parser.IRule, number, string): boolean}
 */
akra.parser.IState.prototype.tryPush_LR;

/**
 * @type {?function()}
 */
akra.parser.IState.prototype.deleteNotBase;

/**
 * @type {?function(string): akra.parser.IState}
 */
akra.parser.IState.prototype.getNextStateBySymbol;
/**
 * @type {?function(string, akra.parser.IState): boolean}
 */
akra.parser.IState.prototype.addNextState;

/**
 * @type {?function(boolean): string}
 */
akra.parser.IState.prototype.toString;

/**
 * @type {?function(): number}
 */
akra.parser.IState.prototype.getIndex;
/**
 * @type {?function(number)}
 */
akra.parser.IState.prototype.setIndex;

/**
 * @type {?function(): Array.<akra.parser.IItem>}
 */
akra.parser.IState.prototype.getItems;
/**
 * @type {?function(): number}
 */
akra.parser.IState.prototype.getNumBaseItems;
/**
 * @type {?function(): akra.IMap}
 */
akra.parser.IState.prototype.getNextStates;
