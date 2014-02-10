var akra;
(function (akra) {
    (function (parser) {
        /** @const */
        parser.END_POSITION = "END";

        /** @const */
        parser.T_EMPTY = "EMPTY";

        /** @const */
        parser.UNKNOWN_TOKEN = "UNNOWN";

        /** @const */
        parser.START_SYMBOL = "S";

        /** @const */
        parser.UNUSED_SYMBOL = "##";

        /** @const */
        parser.END_SYMBOL = "$";

        /** @const */
        parser.LEXER_RULES = "--LEXER--";

        /** @const */
        parser.FLAG_RULE_CREATE_NODE = "--AN";

        /** @const */
        parser.FLAG_RULE_NOT_CREATE_NODE = "--NN";

        /** @const */
        parser.FLAG_RULE_FUNCTION = "--F";

        /** @const */
        parser.EOF = "EOF";

        /** @const */
        parser.T_STRING = "T_STRING";

        /** @const */
        parser.T_FLOAT = "T_FLOAT";

        /** @const */
        parser.T_UINT = "T_UINT";

        /** @const */
        parser.T_TYPE_ID = "T_TYPE_ID";

        /** @const */
        parser.T_NON_TYPE_ID = "T_NON_TYPE_ID";
    })(akra.parser || (akra.parser = {}));
    var parser = akra.parser;
})(akra || (akra = {}));
//# sourceMappingURL=symbols.js.map
