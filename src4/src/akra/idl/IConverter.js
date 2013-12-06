var akra = {};

/**
 * @typedef {?function(string, ?, number=): number}
 */
akra.IConverter;

/**
 * @interface
 */
akra.IConvertionTableRow = function () {
};

/** @type {?} */ akra.IConvertionTableRow.prototype.type;
/** @type {akra.IConverter} */ akra.IConvertionTableRow.prototype.converter;

/**
 * @typedef {Object.<string, akra.IConvertionTableRow>}
 */
akra.IConvertionTable;
