/// <reference path="../idl/EEffectErrors.ts" />
/// <reference path="../logger.ts" />

module akra.fx {

	function registerCode(iErr: int, sDesc: string): void {
		logger.registerCode(iErr, sDesc);
	}


	registerCode(EEffectErrors.REDEFINE_SYSTEM_TYPE,
		"You trying to redefine system type: {typeName}. In line: {line}. In column: {column}");
	registerCode(EEffectErrors.REDEFINE_TYPE,
		"You trying to redefine type: {typeName}. In line: {line}. In column: {column}");
	registerCode(EEffectErrors.UNSUPPORTED_TYPEDECL,
		"You try to use unssuported type declaration. We implement it soon. In line: {line}.");
	registerCode(EEffectErrors.UNSUPPORTED_EXPR,
		"You try to use unssuported expr: {exprName}. We implement it soon. In line: {line}.");
	registerCode(EEffectErrors.UNKNOWN_VARNAME,
		"Unknown variable name: {varName}. In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_ARITHMETIC_OPERATION,
		"Invalid arithmetic operation!. There no operator '{operator}'" +
		" for left-type '{leftTypeName}' " +
		" and right-type '{rightTypeName}'. In line: {line}.");
	registerCode(EEffectErrors.BAD_ARITHMETIC_ASSIGNMENT_OPERATION,
		"Invalid arithmetic-assignment operation!. " +
		" There no operator {operator} for left-type '{leftTypeName}' " +
		" and right-type '{rightTypeName}'. In line: {line}.");
	registerCode(EEffectErrors.BAD_ASSIGNMENT_OPERATION,
		"Invalid assignment operation!. It`s no possible to do assignment " +
		" between left-type '{leftTypeName}' " +
		" and right-type '{rightTypeName}'. In line: {line}.");
	registerCode(EEffectErrors.BAD_RELATIONAL_OPERATION,
		"Invalid relational operation!. There no operator {operator} " +
		" for left-type '{leftTypeName}' " +
		" and right-type '{rightTypeName}'. In line: {line}.");
	registerCode(EEffectErrors.BAD_LOGICAL_OPERATION,
		"Invalid logical operation!. In operator: {operator}. " +
		" Cannot convert type '{typeName}' to 'boolean'. In line: {line}.");
	registerCode(EEffectErrors.BAD_CONDITION_TYPE,
		"Invalid conditional expression!. Cannot convert type '{typeName}' to 'boolean'. " +
		" In line: {line}.");
	registerCode(EEffectErrors.BAD_CONDITION_VALUE_TYPES,
		"Invalid conditional expression!. Type '{leftTypeName}' and type '{rightTypeName}'" +
		" are not equal. In line: {line}.");
	registerCode(EEffectErrors.BAD_CAST_TYPE_USAGE,
		"Invalid type cast!. Bad type casting. Only base types without usages are supported. " +
		" WebGL don`t support so casting. In line: {line}.");
	registerCode(EEffectErrors.BAD_CAST_TYPE_NOT_BASE,
		"Invalid type cast!. Bad type for casting '{typeName}'. " +
		" WebGL support only base-type casting. In line: {line}.");
	registerCode(EEffectErrors.BAD_UNARY_OPERATION,
		"Invalid unary expression!. Bad type: '{typeName}' " +
		" for operator '{opeator}'. In line: {line}.");
	registerCode(EEffectErrors.BAD_POSTIX_NOT_ARRAY,
		"Invalid postfix-array expression!. " +
		" Type of expression is not array: '{typeName}'. In line: {line}.");
	registerCode(EEffectErrors.BAD_POSTIX_NOT_INT_INDEX,
		"Invalid postfix-array expression!. Bad type of index: '{typeName}'. " +
		"Must be 'int'. In line: {line}.");
	registerCode(EEffectErrors.BAD_POSTIX_NOT_FIELD,
		"Invalid postfix-point expression!. Type '{typeName}' has no field '{fieldName}'. " +
		"In line: {line}.");
	registerCode(EEffectErrors.BAD_POSTIX_NOT_POINTER,
		"Invalid postfix-point expression!. Type '{typeName}' is not pointer. " +
		"In line: {line}.");
	registerCode(EEffectErrors.BAD_POSTIX_ARITHMETIC,
		"Invalid postfix-arithmetic expression!. Bad type '{typeName}' " +
		"for operator {operator}. In line: {line}.");
	registerCode(EEffectErrors.BAD_PRIMARY_NOT_POINT,
		"Invalid primary expression!. Bad type '{typeName}'." +
		"It`s not pointer. In line: {line}.");
	registerCode(EEffectErrors.BAD_COMPLEX_NOT_FUNCTION,
		"Invalid function call expression!. Could not find function-signature " +
		"with name {funcName} and so types. In line: {line}.");
	registerCode(EEffectErrors.BAD_COMPLEX_NOT_TYPE,
		"Invalid constructor call!. There are not so type. In line: {line}.");
	registerCode(EEffectErrors.BAD_COMPLEX_NOT_CONSTRUCTOR,
		"Invalid constructor call!. Could not find constructor-signature " +
		"with name {typeName} and so types. In line: {line}.");
	registerCode(EEffectErrors.BAD_COMPILE_NOT_FUNCTION,
		"Invalid compile expression!. Could not find function-signature " +
		"with name {funcName} and so types. In line: {line}.");
	registerCode(EEffectErrors.BAD_REDEFINE_FUNCTION,
		"You try to redefine function. With name {funcName}. In line: {line}.");
	registerCode(EEffectErrors.BAD_WHILE_CONDITION,
		"Bad type of while-condition. Must be 'boolean' but it is '{typeName}'. " +
		"In line: {line}.");
	registerCode(EEffectErrors.BAD_DO_WHILE_CONDITION,
		"Bad type of do-while-condition. Must be 'boolean' but it is '{typeName}'. " +
		"In line: {line}.");
	registerCode(EEffectErrors.BAD_IF_CONDITION,
		"Bad type of if-condition. Must be 'boolean' but it is '{typeName}'. " +
		"In line: {line}.");
	registerCode(EEffectErrors.BAD_FOR_INIT_EXPR,
		"Bad for-init expression. WebGL support only VariableDecl as for-init expression, " +
		"like \"int i = 0;\" or \"float i = 0.0;\". " +
		"In line: {line}.");
	registerCode(EEffectErrors.BAD_FOR_INIT_EMPTY_ITERATOR,
		"Bad for-init expression. WebGL support only VariableDecl as for-init expression, " +
		"like \"int i = 0;\" or \"float i = 0.0;\". " +
		"In line: {line}.");
	registerCode(EEffectErrors.BAD_FOR_COND_EMPTY,
		"Bad for-cond expression. WebGL does not support empty conditional expression in for-loop. " +
		"In line: {line}.");
	registerCode(EEffectErrors.BAD_FOR_COND_RELATION,
		"Bad for-cond expression. WebGL support only relational expression for condition in for-loop. " +
		"In line: {line}.");
	registerCode(EEffectErrors.BAD_FOR_STEP_EMPTY,
		"Bad for-step expression. WebGL does not support empty step expression. " +
		"In line: {line}.");
	registerCode(EEffectErrors.BAD_FOR_STEP_OPERATOR,
		"Bad for-step expression. WebGL does not support operator '{operator}' in step expression. " +
		"In line: {line}.");
	registerCode(EEffectErrors.BAD_FOR_STEP_EXPRESSION,
		"Bad for-step expression. WebGL support only unary and assignment expression in for-step. " +
		"In line: {line}.");
	registerCode(EEffectErrors.REDEFINE_SYSTEM_VARIABLE,
		"You trying to redefine system variable: {varName}. In line: {line}. In column: {column}");
	registerCode(EEffectErrors.REDEFINE_VARIABLE,
		"You trying to redefine variable: {varName}. In line: {line}. In column: {column}");
	registerCode(EEffectErrors.REDEFINE_SYSTEM_FUNCTION,
		"You trying to redefine system function: {funcName}. In line: {line}. In column: {column}");
	registerCode(EEffectErrors.REDEFINE_FUNCTION,
		"You trying to redefine function: {funcName}. In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_NEW_FIELD_FOR_STRUCT_NAME,
		"You trying to add field to struct with name '{varName}', but it`s already in it. " +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_NEW_FIELD_FOR_STRUCT_SEMANTIC,
		"You trying to add field to struct with semantic '{semanticName}'," +
		"but struct already has this semantic." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_NEW_ANNOTATION_VAR,
		"Bad variable name '{varName}'. Annotation already has variable with that name." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_FUNCTION_PARAMETER_DEFENITION_NEED_DEFAULT,
		"Bad parameter '{varName}' in function '{funcName}'. Need default value." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_CANNOT_CHOOSE_FUNCTION,
		"Bad function call. There are two or more call signatures for function '{funcName}'." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_FUNCTION_DEF_RETURN_TYPE,
		"Bad function definition. There are two or more different retturn type signatures for function '{funcName}'." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_SYSTEM_FUNCTION_REDEFINE,
		"Bad system function '{funcName}'. Already have this function.");
	registerCode(EEffectErrors.BAD_TYPE_NAME_NOT_TYPE,
		"Bad type. Could not find type with name '{typeName}'." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_TYPE_VECTOR_MATRIX,
		"Bad type. We don`t support vector and matrix typename." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_TECHNIQUE_REDEFINE_NAME,
		"Bad technique name '{techName}'. Effect already have technique with that name." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_MEMOF_ARGUMENT,
		"Bad 'memof'-operator argument. Literal for its argument is bad idea." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_MEMOF_NO_BUFFER,
		"Bad 'memof'-operator argument. No buffer for argument." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_FUNCTION_USAGE_RECURSION,
		"Bad function '{funcDef}'. It is recursion.");
	registerCode(EEffectErrors.BAD_FUNCTION_USAGE_BLACKLIST,
		"Bad function '{funcDef}'. It use bad-function with recursion.");
	registerCode(EEffectErrors.BAD_FUNCTION_USAGE_VERTEX,
		"Bad function '{funcDef}'. Can not use in vertex-shader.");
	registerCode(EEffectErrors.BAD_FUNCTION_USAGE_PIXEL,
		"Bad function '{funcDef}'. Can not use in pixel-shader.");
	registerCode(EEffectErrors.BAD_FUNCTION_VERTEX_DEFENITION,
		"Bad function with defenition '{funcDef}'. Can not be used as vertex-shader.");
	registerCode(EEffectErrors.BAD_FUNCTION_PIXEL_DEFENITION,
		"Bad function with defenition '{funcDef}'. Can not be used as pixel-shader.");
	registerCode(EEffectErrors.BAD_RETURN_STMT_VOID,
		"Bad return stmt. You try to return something in void-function." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_RETURN_STMT_EMPTY,
		"Bad return stmt. You can not call empty return in non-void-function." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_RETURN_STMT_NOT_EQUAL_TYPES,
		"Bad return stmt. Types of return expression and return type of function are not equal." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_RETURN_TYPE_FOR_FUNCTION,
		"Bad return type for '{funcName}'. Return type for function can not contain or be sampler/pointer." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_FUNCTION_PARAMETER_USAGE,
		"Bad parameter '{varName}' in function '{funcName}'. Bad usage." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_OUT_VARIABLE_IN_FUNCTION,
		"Bad variable with name 'Out'. It is sytem for used like return variable in shaders." +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_TYPE_FOR_WRITE,
		"Variable type is not writable. " +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_TYPE_FOR_READ,
		"Variable type is not readable. " +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_VARIABLE_INITIALIZER,
		"Bad init expr for variable '{varName}'. " +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.NOT_SUPPORT_STATE_INDEX,
		"Don`t supported construction '[uint]' in sampler_state. " +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.BAD_TEXTURE_FOR_SAMLER,
		"Incorrect texture setup for sampler. " +
		"In line: {line}. In column: {column}");
	registerCode(EEffectErrors.CANNOT_CALCULATE_PADDINGS,
		"Can not calculate padding for type '{typeName}'.");
	registerCode(EEffectErrors.UNSUPPORTED_EXTRACT_BASE_TYPE,
		"Can not extract type '{typeName}'.");
	registerCode(EEffectErrors.BAD_EXTRACTING,
		"Bad extract exrpression.");
	registerCode(EEffectErrors.BAD_TECHNIQUE_IMPORT,
		"Bad imports in technique '{techniqueName}'.");
	registerCode(EEffectErrors.BAD_USE_OF_ENGINE_VARIABLE,
		"You try use 'engine' variable in out of pass." +
		"In line: {line}. In column: {column}.");
	registerCode(EEffectErrors.BAD_IMPORTED_COMPONENT_NOT_EXIST,
		"You try to import not exuisted component '{componentName}'");



	registerCode(EEffectTempErrors.BAD_ARRAY_OF_POINTERS,
		"We don`t support array of pinters now. Only pointe to array.\
							  In line: {line}. In column: {column}");
	registerCode(EEffectTempErrors.BAD_LOCAL_OF_SHADER_INPUT,
		"We don`t support using complex shader input like functions params.\
							 Shader: '{funcName}'");
	registerCode(EEffectTempErrors.BAD_LOCAL_OF_SHADER_OUTPUT,
		"We don`t support using complex shader output like functions params.\
							 Shader: '{funcName}'");
	registerCode(EEffectTempErrors.UNSUPPORTED_PROVIDE_AS,
		"We don`t support 'provide ... as' operator now.");


	function sourceLocationToString(pLocation: ISourceLocation): string {
		var sLocation: string = "[" + pLocation.file + ":" + pLocation.line.toString() + "]: ";
		return sLocation;
	}

	function syntaxErrorLogRoutine(pLogEntity: ILoggerEntity): void {
		var sPosition: string = sourceLocationToString(pLogEntity.location);
		var sError: string = "Code: " + pLogEntity.code.toString() + ". ";
		var pParseMessage: string[] = pLogEntity.message.split(/\{(\w+)\}/);
		var pInfo: any = pLogEntity.info;

		for (var i = 0; i < pParseMessage.length; i++) {
			if (isDef(pInfo[pParseMessage[i]])) {
				pParseMessage[i] = <string><any>pInfo[pParseMessage[i]];
			}
		}

		var sMessage = sPosition + sError + pParseMessage.join("");

		console["error"].call(console, sMessage);
	}

	logger.setCodeFamilyRoutine("EffectSyntaxErrors", syntaxErrorLogRoutine, ELogLevel.ERROR);

}