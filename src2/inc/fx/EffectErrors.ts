#ifndef AFXEFFECTERRORS_TS
#define AFXEFFECTERRORS_TS

#include "ILogger.ts"

module akra.fx {
	//Errors
	#define EFFECT_REDEFINE_SYSTEM_TYPE 2201
	#define EFFECT_REDEFINE_TYPE 2202
	#define EFFECT_REDEFINE_VARIABLE 2234
    #define EFFECT_REDEFINE_SYSTEM_VARIABLE 2235
    #define EFFECT_REDEFINE_FUNCTION 2236
    #define EFFECT_REDEFINE_SYSTEM_FUNCTION 2237

    #define EFFECT_UNSUPPORTED_TYPEDECL 2203
    #define EFFECT_UNSUPPORTED_EXPR 2204
    #define EFFECT_UNKNOWN_VARNAME 2205
    #define EFFECT_BAD_ARITHMETIC_OPERATION 2206
    #define EFFECT_BAD_ARITHMETIC_ASSIGNMENT_OPERATION 2207
    #define EFFECT_BAD_ASSIGNMENT_OPERATION 2208
    #define EFFECT_BAD_RELATIONAL_OPERATION 2209
    #define EFFECT_BAD_LOGICAL_OPERATION 2210
    #define EFFECT_BAD_CONDITION_TYPE 2211
    #define EFFECT_BAD_CONDITION_VALUE_TYPES 2212
    #define EFFECT_BAD_CAST_TYPE_USAGE 2213
    #define EFFECT_BAD_CAST_TYPE_NOT_BASE 2214
    #define EFFECT_BAD_CAST_UNKNOWN_TYPE 2215
    #define EFFECT_BAD_UNARY_OPERATION 2216
    #define EFFECT_BAD_POSTIX_NOT_ARRAY 2217
    #define EFFECT_BAD_POSTIX_NOT_INT_INDEX 2218
    #define EFFECT_BAD_POSTIX_NOT_FIELD 2219
    #define EFFECT_BAD_POSTIX_NOT_POINTER 2220
    #define EFFECT_BAD_POSTIX_ARITHMETIC 2221
    #define EFFECT_BAD_PRIMARY_NOT_POINT 2222
    #define EFFECT_BAD_COMPLEX_NOT_FUNCTION 2223
    #define EFFECT_BAD_COMPLEX_NOT_TYPE 2224
    #define EFFECT_BAD_COMPLEX_NOT_CONSTRUCTOR 2225
    #define EFFECT_BAD_COMPILE_NOT_FUNCTION 2226
    #define EFFECT_BAD_REDEFINE_FUNCTION 2227
    #define EFFECT_BAD_WHILE_CONDITION 2228
    #define EFFECT_BAD_DO_WHILE_CONDITION 2229	
    #define EFFECT_BAD_IF_CONDITION 2230
    #define EFFECT_BAD_FOR_INIT_EXPR 2231
    #define EFFECT_BAD_FOR_INIT_EMPTY_ITERATOR 2232
    #define EFFECT_BAD_FOR_COND_EMPTY 2233
    #define EFFECT_BAD_FOR_COND_RELATION 2238
    #define EFFECT_BAD_FOR_STEP_EMPTY 2239
    #define EFFECT_BAD_FOR_STEP_OPERATOR 2240
    #define EFFECT_BAD_FOR_STEP_EXPRESSION 2241
    #define EFFCCT_BAD_NEW_FIELD_FOR_STRUCT_NAME 2242
    #define EFFCCT_BAD_NEW_FIELD_FOR_STRUCT_SEMANTIC 2243
    #define EFFCCT_BAD_NEW_ANNOTATION_VAR 2244
    #define EFFCCT_BAD_FUNCTION_PARAMETER_DEFENITION_NEED_DEFAULT 2245
    #define EFFECT_BAD_CANNOT_CHOOSE_FUNCTION 2246
    #define EFFECT_BAD_FUNCTION_DEF_RETURN_TYPE 2247
    #define EFFECT_BAD_SYSTEM_FUNCTION_REDEFINE 2248
    #define EFFECT_BAD_SYSTEM_FUNCTION_RETURN_TYPE 2249
    #define EFFECT_BAD_TYPE_NAME_NOT_TYPE 2250
    #define EFFECT_BAD_TYPE_VECTOR_MATRIX 2251
    #define EFFECT_BAD_TECHNIQUE_REDEFINE_NAME 2252
    #define EFFECT_BAD_MEMOF_ARGUMENT 2253
    #define EFFECT_BAD_MEMOF_NO_BUFFER 2254
    #define EFFECT_BAD_FUNCTION_USAGE_RECURSION 2255
    #define EFFECT_BAD_FUNCTION_USAGE_BLACKLIST 2256
    #define EFFECT_BAD_FUNCTION_USAGE_VERTEX 2257
    #define EFFECT_BAD_FUNCTION_USAGE_PIXEL 2258
    #define EFFECT_BAD_FUNCTION_VERTEX_DEFENITION 2259
    #define EFFECT_BAD_FUNCTION_PIXEL_DEFENITION 2260
    #define EFFECT_BAD_RETURN_STMT_VOID 2261
    #define EFFECT_BAD_RETURN_STMT_EMPTY 2262
    #define EFFECT_BAD_RETURN_STMT_NOT_EQUAL_TYPES 2263
    #define EFFECT_BAD_RETURN_TYPE_FOR_FUNCTION 2264
    #define EFFECT_BAD_FUNCTION_PARAMETER_USAGE 2265
    #define EFFECT_BAD_OUT_VARIABLE_IN_FUNCTION 2266
    #define EFFECT_BAD_TYPE_FOR_WRITE 2267
    #define EFFECT_BAD_TYPE_FOR_READ 2268
    #define EFFECT_BAD_VARIABLE_INITIALIZER 2269
    #define EFFECT_NOT_SUPPORT_STATE_INDEX 2270
    #define EFFECT_BAD_TEXTURE_FOR_SAMLER 2271
    #define EFFCET_CANNOT_CALCULATE_PADDINGS 2272
    #define EFFECT_UNSUPPORTED_EXTRACT_BASE_TYPE 2273
    #define EFFECT_BAD_EXTRACTING 2274
    #define EFFECT_BAD_TECHNIQUE_IMPORT 2275
    #define EFFECT_BAD_USE_OF_ENGINE_VARIABLE 2276
    #define EFFECT_BAD_IMPORTED_COMPONENT_NOT_EXIST 2277
    #define EFFECT_CANNOT_ADD_SHARED_VARIABLE 2278



    #define TEMP_EFFECT_BAD_ARRAY_OF_POINTERS 2300
    #define TEMP_EFFECT_BAD_LOCAL_OF_SHADER_INPUT 2301
    #define TEMP_EFFECT_BAD_LOCAL_OF_SHADER_OUTPUT 2302
    #define TEMP_EFFECT_UNSUPPORTED_PROVIDE_AS 2303

    akra.logger.registerCode(EFFECT_REDEFINE_SYSTEM_TYPE, 
    						 "You trying to redefine system type: {typeName}. In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_REDEFINE_TYPE, 
    	 					 "You trying to redefine type: {typeName}. In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_UNSUPPORTED_TYPEDECL, 
    						 "You try to use unssuported type declaration. We implement it soon. In line: {line}.");
    akra.logger.registerCode(EFFECT_UNSUPPORTED_EXPR, 
    						 "You try to use unssuported expr: {exprName}. We implement it soon. In line: {line}.");
    akra.logger.registerCode(EFFECT_UNKNOWN_VARNAME, 
    						 "Unknown variable name: {varName}. In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_BAD_ARITHMETIC_OPERATION, 
    						 "Invalid arithmetic operation!. There no operator '{operator}'" +
    						 " for left-type '{leftTypeName}' " +
    						 " and right-type '{rightTypeName}'. In line: {line}.");
    akra.logger.registerCode(EFFECT_BAD_ARITHMETIC_ASSIGNMENT_OPERATION, 
    						 "Invalid arithmetic-assignment operation!. " +
    						 " There no operator {operator} for left-type '{leftTypeName}' " +
    						 " and right-type '{rightTypeName}'. In line: {line}.");
    akra.logger.registerCode(EFFECT_BAD_ASSIGNMENT_OPERATION, 
    						 "Invalid assignment operation!. It`s no possible to do assignment " +
    						 " between left-type '{leftTypeName}' " +
    						 " and right-type '{rightTypeName}'. In line: {line}.");
    akra.logger.registerCode(EFFECT_BAD_RELATIONAL_OPERATION, 
    						 "Invalid relational operation!. There no operator {operator} " +
    						 " for left-type '{leftTypeName}' " +
    						 " and right-type '{rightTypeName}'. In line: {line}.");
    akra.logger.registerCode(EFFECT_BAD_LOGICAL_OPERATION, 
    						 "Invalid logical operation!. In operator: {operator}. " +
    						 " Cannot convert type '{typeName}' to 'bool'. In line: {line}.");
    akra.logger.registerCode(EFFECT_BAD_CONDITION_TYPE, 
    						 "Invalid conditional expression!. Cannot convert type '{typeName}' to 'bool'. " +
    						 " In line: {line}.");
    akra.logger.registerCode(EFFECT_BAD_CONDITION_VALUE_TYPES, 
    						 "Invalid conditional expression!. Type '{leftTypeName}' and type '{rightTypeName}'" +
    						  " are not equal. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_CAST_TYPE_USAGE, 
    						 "Invalid type cast!. Bad type casting. Only base types without usages are supported. " +
    						 " WebGL don`t support so casting. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_CAST_TYPE_NOT_BASE, 
    						 "Invalid type cast!. Bad type for casting '{typeName}'. " +
    						 " WebGL support only base-type casting. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_UNARY_OPERATION, 
    						 "Invalid unary expression!. Bad type: '{typeName}' " +
    						 " for operator '{opeator}'. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_POSTIX_NOT_ARRAY, 
    						 "Invalid postfix-array expression!. " +
    						 " Type of expression is not array: '{typeName}'. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_POSTIX_NOT_INT_INDEX, 
    						 "Invalid postfix-array expression!. Bad type of index: '{typeName}'. " +
    						 "Must be 'int'. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_POSTIX_NOT_FIELD, 
    						 "Invalid postfix-point expression!. Type '{typeName}' has no field '{fieldName}'. " +
    						 "In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_POSTIX_NOT_POINTER, 
    						 "Invalid postfix-point expression!. Type '{typeName}' is not pointer. " +
    						 "In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_POSTIX_ARITHMETIC, 
    						 "Invalid postfix-arithmetic expression!. Bad type '{typeName}' " +
    						 "for operator {operator}. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_PRIMARY_NOT_POINT, 
    						 "Invalid primary expression!. Bad type '{typeName}'." +
    						 "It`s not pointer. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_COMPLEX_NOT_FUNCTION, 
    						 "Invalid function call expression!. Could not find function-signature " +
    						 "with name {funcName} and so types. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_COMPLEX_NOT_TYPE, 
    						 "Invalid constructor call!. There are not so type. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_COMPLEX_NOT_CONSTRUCTOR, 
    						 "Invalid constructor call!. Could not find constructor-signature " +
    						 "with name {typeName} and so types. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_COMPILE_NOT_FUNCTION, 
    						 "Invalid compile expression!. Could not find function-signature " +
    						 "with name {funcName} and so types. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_REDEFINE_FUNCTION, 
    						 "You try to redefine function. With name {funcName}. In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_WHILE_CONDITION, 
							 "Bad type of while-condition. Must be 'bool' but it is '{typeName}'. " +
							 "In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_DO_WHILE_CONDITION, 
							 "Bad type of do-while-condition. Must be 'bool' but it is '{typeName}'. " +
							 "In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_IF_CONDITION, 
							 "Bad type of if-condition. Must be 'bool' but it is '{typeName}'. " +
							 "In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_FOR_INIT_EXPR, 
							 "Bad for-init expression. WebGL support only VariableDecl as for-init expression, " +
							 "like \"int i = 0;\" or \"float i = 0.0;\". " +
							 "In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_FOR_INIT_EMPTY_ITERATOR, 
							 "Bad for-init expression. WebGL support only VariableDecl as for-init expression, " +
							 "like \"int i = 0;\" or \"float i = 0.0;\". " +
							 "In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_FOR_COND_EMPTY, 
							 "Bad for-cond expression. WebGL does not support empty conditional expression in for-loop. " +
							 "In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_FOR_COND_RELATION, 
							 "Bad for-cond expression. WebGL support only relational expression for condition in for-loop. " +
							 "In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_FOR_STEP_EMPTY, 
							 "Bad for-step expression. WebGL does not support empty step expression. " +
							 "In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_FOR_STEP_OPERATOR, 
							 "Bad for-step expression. WebGL does not support operator '{operator}' in step expression. " +
							 "In line: {line}.");
	akra.logger.registerCode(EFFECT_BAD_FOR_STEP_EXPRESSION, 
							 "Bad for-step expression. WebGL support only unary and assignment expression in for-step. " +
							 "In line: {line}.");
	akra.logger.registerCode(EFFECT_REDEFINE_SYSTEM_VARIABLE, 
    						 "You trying to redefine system variable: {varName}. In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_REDEFINE_VARIABLE, 
    	 					 "You trying to redefine variable: {varName}. In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_REDEFINE_SYSTEM_FUNCTION, 
    						 "You trying to redefine system function: {funcName}. In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_REDEFINE_FUNCTION, 
    	 					 "You trying to redefine function: {funcName}. In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFCCT_BAD_NEW_FIELD_FOR_STRUCT_NAME, 
    						 "You trying to add field to struct with name '{varName}', but it`s already in it. " +
    						 "In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFCCT_BAD_NEW_FIELD_FOR_STRUCT_SEMANTIC, 
    	 					 "You trying to add field to struct with semantic '{semanticName}'," +
    	 					  "but struct already has this semantic." +
    	 					  "In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFCCT_BAD_NEW_ANNOTATION_VAR, 
       					     "Bad variable name '{varName}'. Annotation already has variable with that name." +
    	 					  "In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFCCT_BAD_FUNCTION_PARAMETER_DEFENITION_NEED_DEFAULT,
                             "Bad parameter '{varName}' in function '{funcName}'. Need default value." +
                             "In line: {line}. In column: {column}"); 
    akra.logger.registerCode(EFFECT_BAD_CANNOT_CHOOSE_FUNCTION,
                             "Bad function call. There are two or more call signatures for function '{funcName}'." +
                             "In line: {line}. In column: {column}"); 
    akra.logger.registerCode(EFFECT_BAD_FUNCTION_DEF_RETURN_TYPE,
                             "Bad function definition. There are two or more different retturn type signatures for function '{funcName}'." +
                             "In line: {line}. In column: {column}"); 
    akra.logger.registerCode(EFFECT_BAD_SYSTEM_FUNCTION_REDEFINE,
                             "Bad system function '{funcName}'. Already have this function.");
    akra.logger.registerCode(EFFECT_BAD_TYPE_NAME_NOT_TYPE,
                             "Bad type. Could not find type with name '{typeName}'." +
                             "In line: {line}. In column: {column}"); 
    akra.logger.registerCode(EFFECT_BAD_TYPE_VECTOR_MATRIX,
                             "Bad type. We don`t support vector and matrix typename." +
                             "In line: {line}. In column: {column}"); 
    akra.logger.registerCode(EFFECT_BAD_TECHNIQUE_REDEFINE_NAME,
                             "Bad technique name '{techName}'. Effect already have technique with that name." +
                             "In line: {line}. In column: {column}"); 
    akra.logger.registerCode(EFFECT_BAD_MEMOF_ARGUMENT,
                             "Bad 'memof'-operator argument. Literal for its argument is bad idea." +
                             "In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_BAD_MEMOF_NO_BUFFER,
                             "Bad 'memof'-operator argument. No buffer for argument." +
                             "In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_BAD_FUNCTION_USAGE_RECURSION,
                             "Bad function '{funcDef}'. It is recursion.");
    akra.logger.registerCode(EFFECT_BAD_FUNCTION_USAGE_BLACKLIST,
                             "Bad function '{funcDef}'. It use bad-function with recursion.");
    akra.logger.registerCode(EFFECT_BAD_FUNCTION_USAGE_VERTEX,
                             "Bad function '{funcDef}'. Can not use in vertex-shader.");
    akra.logger.registerCode(EFFECT_BAD_FUNCTION_USAGE_PIXEL,
                             "Bad function '{funcDef}'. Can not use in pixel-shader.");
    akra.logger.registerCode(EFFECT_BAD_FUNCTION_VERTEX_DEFENITION,
                             "Bad function with defenition '{funcDef}'. Can not be used as vertex-shader.");
    akra.logger.registerCode(EFFECT_BAD_FUNCTION_PIXEL_DEFENITION,
                             "Bad function with defenition '{funcDef}'. Can not be used as pixel-shader.");
    akra.logger.registerCode(EFFECT_BAD_RETURN_STMT_VOID,
                             "Bad return stmt. You try to return something in void-function." +
                             "In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_BAD_RETURN_STMT_EMPTY,
                             "Bad return stmt. You can not call empty return in non-void-function." +
                             "In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_BAD_RETURN_STMT_NOT_EQUAL_TYPES,
                             "Bad return stmt. Types of return expression and return type of function are not equal." +
                             "In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_BAD_RETURN_TYPE_FOR_FUNCTION,
                             "Bad return type for '{funcName}'. Return type for function can not contain or be sampler/pointer." +
                             "In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_BAD_FUNCTION_PARAMETER_USAGE,
                             "Bad parameter '{varName}' in function '{funcName}'. Bad usage." +
                             "In line: {line}. In column: {column}"); 
    akra.logger.registerCode(EFFECT_BAD_OUT_VARIABLE_IN_FUNCTION,
                             "Bad variable with name 'Out'. It is sytem for used like return variable in shaders." +
                             "In line: {line}. In column: {column}"); 
    akra.logger.registerCode(EFFECT_BAD_TYPE_FOR_WRITE,
                             "Variable type is not writable. " +
                             "In line: {line}. In column: {column}"); 
    akra.logger.registerCode(EFFECT_BAD_TYPE_FOR_READ,
                             "Variable type is not readable. " +
                             "In line: {line}. In column: {column}"); 
    akra.logger.registerCode(EFFECT_BAD_VARIABLE_INITIALIZER,
                             "Bad init expr for variable '{varName}'. " +
                             "In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_NOT_SUPPORT_STATE_INDEX,
                             "Don`t supported construction '[uint]' in sampler_state. " +
                             "In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFECT_BAD_TEXTURE_FOR_SAMLER,
                             "Incorrect texture setup for sampler. " +
                             "In line: {line}. In column: {column}");
    akra.logger.registerCode(EFFCET_CANNOT_CALCULATE_PADDINGS,
                             "Can not calculate padding for type '{typeName}'.");
    akra.logger.registerCode(EFFECT_UNSUPPORTED_EXTRACT_BASE_TYPE,
                             "Can not extract type '{typeName}'.");
    akra.logger.registerCode(EFFECT_BAD_EXTRACTING,
                             "Bad extract exrpression.");
    akra.logger.registerCode(EFFECT_BAD_TECHNIQUE_IMPORT,
                             "Bad imports in technique '{techniqueName}'.");
    akra.logger.registerCode(EFFECT_BAD_USE_OF_ENGINE_VARIABLE, 
                             "You try use 'engine' variable in out of pass." +
                             "In line: {line}. In column: {column}.");
    akra.logger.registerCode(EFFECT_BAD_IMPORTED_COMPONENT_NOT_EXIST, 
                             "You try to import not exuisted component '{componentName}'");



    akra.logger.registerCode(TEMP_EFFECT_BAD_ARRAY_OF_POINTERS,
                             "We don`t support array of pinters now. Only pointe to array.\
                              In line: {line}. In column: {column}"); 
    akra.logger.registerCode(TEMP_EFFECT_BAD_LOCAL_OF_SHADER_INPUT,
                             "We don`t support using complex shader input like functions params.\
                             Shader: '{funcName}'"); 
    akra.logger.registerCode(TEMP_EFFECT_BAD_LOCAL_OF_SHADER_OUTPUT,
                             "We don`t support using complex shader output like functions params.\
                             Shader: '{funcName}'"); 
    akra.logger.registerCode(TEMP_EFFECT_UNSUPPORTED_PROVIDE_AS,
                             "We don`t support 'provide ... as' operator now.");


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

    akra.logger.setCodeFamilyRoutine("EffectSyntaxErrors", syntaxErrorLogRoutine, ELogLevel.ERROR);

    export interface IEffectErrorInfo{
    	
    	typeName?: string;
        techName?: string;
   		exprName?: string;
   		varName?: string;
   		operator?: string;
   		leftTypeName?: string;
   		rirgtTypeName?: string;
   		fieldName?: string;
   		funcName?: string;
        funcDef?: string;
   		semanticName?: string;
        techniqueName?: string;
        componentName?: string;
    	
    	line?: uint;
    	column?: uint;
    }

}

#endif