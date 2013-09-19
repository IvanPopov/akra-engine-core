#ifndef PARSERERRORS_TS
#define PARSERERRORS_TS

#include "common.ts"
#include "ILogger.ts"
#include "logger.ts"

module akra.util {
	#define PARSER_GRAMMAR_ADD_OPERATION 2001
    #define PARSER_GRAMMAR_ADD_STATE_LINK 2002
    #define PARSER_GRAMMAR_UNEXPECTED_SYMBOL 2003
    #define PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME 2004
    #define PARSER_GRAMMAR_BAD_KEYWORD 2005
    #define PARSER_SYNTAX_ERROR 2051

    #define LEXER_UNKNOWN_TOKEN 2101
    #define LEXER_BAD_TOKEN 2102

    akra.logger.registerCode(PARSER_GRAMMAR_ADD_OPERATION, "Grammar not LALR(1)! Cannot to generate syntax table. Add operation error.\n" +
                                                           "Conflict in state with index: {stateIndex}. With grammar symbol: \"{grammarSymbol}\"\n" +
                                                           "Old operation: {oldOperation}\n" + 
                                                           "New operation: {newOperation}\n" +
                                                           "For more info init parser in debug-mode and see syntax table and list of states.");

    akra.logger.registerCode(PARSER_GRAMMAR_ADD_STATE_LINK, "Grammar not LALR(1)! Cannot to generate syntax table. Add state link error.\n" +
                                                            "Conflict in state with index: {stateIndex}. With grammar symbol: \"{grammarSymbol}\"\n" +
                                                            "Old next state: {oldNextStateIndex}\n" +
                                                            "New next state: {newNextStateIndex}\n" +
                                                            "For more info init parser in debug-mode and see syntax table and list of states.");

    akra.logger.registerCode(PARSER_GRAMMAR_UNEXPECTED_SYMBOL, "Grammar error. Can`t generate rules from grammar\n" +
                                                               "Unexpected symbol: {unexpectedSymbol}\n" +
                                                               "Expected: {expectedSymbol}");

    akra.logger.registerCode(PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME, "Grammar error. Empty additional function name.");
    akra.logger.registerCode(PARSER_GRAMMAR_BAD_KEYWORD, "Grammar error. Bad keyword: {badKeyword}\n" +
                                                         "All keyword must be define in lexer rule block.");

    akra.logger.registerCode(PARSER_SYNTAX_ERROR, "Syntax error during parsing. Token: {tokenValue}\n" +
                                                  "Line: {line}. Column: {column}.");

    akra.logger.registerCode(LEXER_UNKNOWN_TOKEN, "Unknown token: {tokenValue}");
    akra.logger.registerCode(LEXER_BAD_TOKEN, "Bad token: {tokenValue}");



    function sourceLocationToString(pLocation: ISourceLocation): string {
        var sLocation:string = "[" + pLocation.file + ":" + pLocation.line.toString() + "]: ";
        return sLocation;
    }

    function syntaxErrorLogRoutine(pLogEntity: ILoggerEntity): void{
        var sPosition:string = sourceLocationToString(pLogEntity.location);
        var sError: string = "Code: " + pLogEntity.code.toString() + ". ";
        var pParseMessage: string[] = pLogEntity.message.split(/\{(\w+)\}/);
        var pInfo:any = pLogEntity.info;

        for(var i = 0; i < pParseMessage.length; i++){
            if(isDef(pInfo[pParseMessage[i]])){
                pParseMessage[i] = <string><any>pInfo[pParseMessage[i]];
            }
        }

        var sMessage = sPosition + sError + pParseMessage.join("");
        
        console["error"].call(console, sMessage);
    }

    akra.logger.setCodeFamilyRoutine("ParserSyntaxErrors", syntaxErrorLogRoutine, ELogLevel.ERROR);

}

#endif