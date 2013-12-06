var akra = {};

/**
 * / <reference path="../IMap.ts" />
 * / <reference path="IState.ts" />
 * / <reference path="IParser.ts" />
 */
akra.parser = {};

/**
 * @interface
 */
akra.parser.IItem = function () {
};

/**
 * @type {?function(akra.parser.IItem, akra.parser.EParserType=): boolean}
 */
akra.parser.IItem.prototype.isEqual;
/**
 * @type {?function(akra.parser.IItem): boolean}
 */
akra.parser.IItem.prototype.isParentItem;
/**
 * @type {?function(akra.parser.IItem): boolean}
 */
akra.parser.IItem.prototype.isChildItem;

/**
 * @type {?function(): string}
 */
akra.parser.IItem.prototype.mark;
/**
 * @type {?function(): string}
 */
akra.parser.IItem.prototype.end;
/**
 * @type {?function(): string}
 */
akra.parser.IItem.prototype.nextMarked;

/**
 * @type {?function(): string}
 */
akra.parser.IItem.prototype.toString;

/**
 * @type {?function(string): boolean}
 */
akra.parser.IItem.prototype.isExpected;
/**
 * @type {?function(string): boolean}
 */
akra.parser.IItem.prototype.addExpected;

/**
 * @type {?function(): akra.parser.IRule}
 */
akra.parser.IItem.prototype.getRule;
/**
 * @type {?function(akra.parser.IRule)}
 */
akra.parser.IItem.prototype.setRule;

/**
 * @type {?function(): number}
 */
akra.parser.IItem.prototype.getPosition;
/**
 * @type {?function(number)}
 */
akra.parser.IItem.prototype.setPosition;

/**
 * @type {?function(): number}
 */
akra.parser.IItem.prototype.getIndex;
/**
 * @type {?function(number)}
 */
akra.parser.IItem.prototype.setIndex;

/**
 * @type {?function(): akra.parser.IState}
 */
akra.parser.IItem.prototype.getState;
/**
 * @type {?function(akra.parser.IState)}
 */
akra.parser.IItem.prototype.setState;

/**
 * @type {?function(): boolean}
 */
akra.parser.IItem.prototype.getIsNewExpected;
/**
 * @type {?function(boolean)}
 */
akra.parser.IItem.prototype.setIsNewExpected;

/**
 * @type {?function(): akra.IMap}
 */
akra.parser.IItem.prototype.getExpectedSymbols;
/**
 * @type {?function(): number}
 */
akra.parser.IItem.prototype.getLength;
