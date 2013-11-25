module akra.parser {
	/** @const */
	export var END_POSITION = "END";            //item, parser
	/** @const */
	export var T_EMPTY = "EMPTY";               //item, parser
	/** @const */
	export var UNKNOWN_TOKEN = "UNNOWN";        //lexer
	/** @const */
	export var START_SYMBOL = "S";              //parser
	/** @const */
	export var UNUSED_SYMBOL = "##";            //parser
	/** @const */
	export var END_SYMBOL = "$";                //lexer, parser
	/** @const */
	export var LEXER_RULES = "--LEXER--";       //parser
	/** @const */
	export var FLAG_RULE_CREATE_NODE = "--AN";  //parser
	/** @const */
	export var FLAG_RULE_NOT_CREATE_NODE = "--NN"; //parser
	/** @const */
	export var FLAG_RULE_FUNCTION = "--F";      //parser
	/** @const */
	export var EOF = "EOF";                     //lexer
	/** @const */
	export var T_STRING = "T_STRING";           //lexer
	/** @const */
	export var T_FLOAT = "T_FLOAT";             //lexer
	/** @const */
	export var T_UINT = "T_UINT";               //lexer
	/** @const */
	export var T_TYPE_ID = "T_TYPE_ID";         //lexer
	/** @const */
	export var T_NON_TYPE_ID = "T_NON_TYPE_ID"; //lexer
}

