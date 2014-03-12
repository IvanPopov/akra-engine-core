module akra.parser {

	export const END_POSITION = "END";            //item, parser
	export const T_EMPTY = "EMPTY";               //item, parser
	export const UNKNOWN_TOKEN = "UNNOWN";        //lexer
	export const START_SYMBOL = "S";              //parser
	export const UNUSED_SYMBOL = "##";            //parser
	export const END_SYMBOL = "$";                //lexer, parser
	export const LEXER_RULES = "--LEXER--";       //parser
	export const FLAG_RULE_CREATE_NODE = "--AN";  //parser
	export const FLAG_RULE_NOT_CREATE_NODE = "--NN"; //parser
	export const FLAG_RULE_FUNCTION = "--F";      //parser
	export const EOF = "EOF";                     //lexer
	export const T_STRING = "T_STRING";           //lexer
	export const T_FLOAT = "T_FLOAT";             //lexer
	export const T_UINT = "T_UINT";               //lexer
	export const T_TYPE_ID = "T_TYPE_ID";         //lexer
	export const T_NON_TYPE_ID = "T_NON_TYPE_ID"; //lexer
}

