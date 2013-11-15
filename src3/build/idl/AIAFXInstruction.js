// AIAFXInstruction interface
// [write description here...]
/// <reference path="AIParser.ts" />
/// <reference path="AIAFXComponent.ts" />
/// <reference path="AIUnique.ts" />
/// <reference path="AIRenderer.ts" />
/// <reference path="AIMap.ts" />
/// <reference path="AIRenderStateMap.ts" />
// #define EPassState AERenderStates
// #define EPassStateValue AERenderStateValues
// #define IPassStateMap AIRenderStateMap
/// <reference path="AIAFXComposer.ts" />
var AEAFXInstructionTypes;
(function (AEAFXInstructionTypes) {
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_Instruction"] = 0] = "k_Instruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_InstructionCollector"] = 1] = "k_InstructionCollector";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_SimpleInstruction"] = 2] = "k_SimpleInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_VariableTypeInstruction"] = 3] = "k_VariableTypeInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_SystemTypeInstruction"] = 4] = "k_SystemTypeInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_ComplexTypeInstruction"] = 5] = "k_ComplexTypeInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_TypedInstruction"] = 6] = "k_TypedInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_DeclInstruction"] = 7] = "k_DeclInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_IntInstruction"] = 8] = "k_IntInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_FloatInstruction"] = 9] = "k_FloatInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_BoolInstruction"] = 10] = "k_BoolInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_StringInstruction"] = 11] = "k_StringInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_IdInstruction"] = 12] = "k_IdInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_KeywordInstruction"] = 13] = "k_KeywordInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_TypeDeclInstruction"] = 14] = "k_TypeDeclInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_VariableDeclInstruction"] = 15] = "k_VariableDeclInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_AnnotationInstruction"] = 16] = "k_AnnotationInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_UsageTypeInstruction"] = 17] = "k_UsageTypeInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_BaseTypeInstruction"] = 18] = "k_BaseTypeInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_StructDeclInstruction"] = 19] = "k_StructDeclInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_StructFieldsInstruction"] = 20] = "k_StructFieldsInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_ExprInstruction"] = 21] = "k_ExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_IdExprInstruction"] = 22] = "k_IdExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_ArithmeticExprInstruction"] = 23] = "k_ArithmeticExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_AssignmentExprInstruction"] = 24] = "k_AssignmentExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_RelationalExprInstruction"] = 25] = "k_RelationalExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_LogicalExprInstruction"] = 26] = "k_LogicalExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_ConditionalExprInstruction"] = 27] = "k_ConditionalExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_CastExprInstruction"] = 28] = "k_CastExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_UnaryExprInstruction"] = 29] = "k_UnaryExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_PostfixIndexInstruction"] = 30] = "k_PostfixIndexInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_PostfixPointInstruction"] = 31] = "k_PostfixPointInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_PostfixArithmeticInstruction"] = 32] = "k_PostfixArithmeticInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_PrimaryExprInstruction"] = 33] = "k_PrimaryExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_ComplexExprInstruction"] = 34] = "k_ComplexExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_FunctionCallInstruction"] = 35] = "k_FunctionCallInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_SystemCallInstruction"] = 36] = "k_SystemCallInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_ConstructorCallInstruction"] = 37] = "k_ConstructorCallInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_CompileExprInstruction"] = 38] = "k_CompileExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_InitExprInstruction"] = 39] = "k_InitExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_SamplerStateBlockInstruction"] = 40] = "k_SamplerStateBlockInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_SamplerStateInstruction"] = 41] = "k_SamplerStateInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_ExtractExprInstruction"] = 42] = "k_ExtractExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_MemExprInstruction"] = 43] = "k_MemExprInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_FunctionDeclInstruction"] = 44] = "k_FunctionDeclInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_ShaderFunctionInstruction"] = 45] = "k_ShaderFunctionInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_SystemFunctionInstruction"] = 46] = "k_SystemFunctionInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_FunctionDefInstruction"] = 47] = "k_FunctionDefInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_StmtInstruction"] = 48] = "k_StmtInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_StmtBlockInstruction"] = 49] = "k_StmtBlockInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_ExprStmtInstruction"] = 50] = "k_ExprStmtInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_BreakStmtInstruction"] = 51] = "k_BreakStmtInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_WhileStmtInstruction"] = 52] = "k_WhileStmtInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_ForStmtInstruction"] = 53] = "k_ForStmtInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_IfStmtInstruction"] = 54] = "k_IfStmtInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_DeclStmtInstruction"] = 55] = "k_DeclStmtInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_ReturnStmtInstruction"] = 56] = "k_ReturnStmtInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_ExtractStmtInstruction"] = 57] = "k_ExtractStmtInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_SemicolonStmtInstruction"] = 58] = "k_SemicolonStmtInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_PassInstruction"] = 59] = "k_PassInstruction";
    AEAFXInstructionTypes[AEAFXInstructionTypes["k_TechniqueInstruction"] = 60] = "k_TechniqueInstruction";
})(AEAFXInstructionTypes || (AEAFXInstructionTypes = {}));

var AEFunctionType;
(function (AEFunctionType) {
    AEFunctionType[AEFunctionType["k_Vertex"] = 0] = "k_Vertex";
    AEFunctionType[AEFunctionType["k_Pixel"] = 1] = "k_Pixel";
    AEFunctionType[AEFunctionType["k_Fragment"] = 1] = "k_Fragment";
    AEFunctionType[AEFunctionType["k_Function"] = 2] = "k_Function";
    AEFunctionType[AEFunctionType["k_PassFunction"] = 3] = "k_PassFunction";
})(AEFunctionType || (AEFunctionType = {}));

var AECheckStage;
(function (AECheckStage) {
    AECheckStage[AECheckStage["CODE_TARGET_SUPPORT"] = 0] = "CODE_TARGET_SUPPORT";
    AECheckStage[AECheckStage["SELF_CONTAINED"] = 1] = "SELF_CONTAINED";
})(AECheckStage || (AECheckStage = {}));

var AEVarUsedMode;
(function (AEVarUsedMode) {
    AEVarUsedMode[AEVarUsedMode["k_Read"] = 0] = "k_Read";
    AEVarUsedMode[AEVarUsedMode["k_Write"] = 1] = "k_Write";
    AEVarUsedMode[AEVarUsedMode["k_ReadWrite"] = 2] = "k_ReadWrite";
    AEVarUsedMode[AEVarUsedMode["k_Undefined"] = 3] = "k_Undefined";
    AEVarUsedMode[AEVarUsedMode["k_Default"] = AEVarUsedMode.k_ReadWrite] = "k_Default";
})(AEVarUsedMode || (AEVarUsedMode = {}));

var AEExtractExprType;
(function (AEExtractExprType) {
    AEExtractExprType[AEExtractExprType["k_Header"] = 0] = "k_Header";

    AEExtractExprType[AEExtractExprType["k_Float"] = 1] = "k_Float";
    AEExtractExprType[AEExtractExprType["k_Int"] = 2] = "k_Int";
    AEExtractExprType[AEExtractExprType["k_Bool"] = 3] = "k_Bool";

    AEExtractExprType[AEExtractExprType["k_Float2"] = 4] = "k_Float2";
    AEExtractExprType[AEExtractExprType["k_Int2"] = 5] = "k_Int2";
    AEExtractExprType[AEExtractExprType["k_Bool2"] = 6] = "k_Bool2";

    AEExtractExprType[AEExtractExprType["k_Float3"] = 7] = "k_Float3";
    AEExtractExprType[AEExtractExprType["k_Int3"] = 8] = "k_Int3";
    AEExtractExprType[AEExtractExprType["k_Bool3"] = 9] = "k_Bool3";

    AEExtractExprType[AEExtractExprType["k_Float4"] = 10] = "k_Float4";
    AEExtractExprType[AEExtractExprType["k_Int4"] = 11] = "k_Int4";
    AEExtractExprType[AEExtractExprType["k_Bool4"] = 12] = "k_Bool4";

    AEExtractExprType[AEExtractExprType["k_Float4x4"] = 13] = "k_Float4x4";
})(AEExtractExprType || (AEExtractExprType = {}));

var AEAFXBlendMode;
(function (AEAFXBlendMode) {
    AEAFXBlendMode[AEAFXBlendMode["k_Shared"] = 0] = "k_Shared";
    AEAFXBlendMode[AEAFXBlendMode["k_Uniform"] = 1] = "k_Uniform";
    AEAFXBlendMode[AEAFXBlendMode["k_Attribute"] = 2] = "k_Attribute";
    AEAFXBlendMode[AEAFXBlendMode["k_Foreign"] = 3] = "k_Foreign";
    AEAFXBlendMode[AEAFXBlendMode["k_Global"] = 4] = "k_Global";
    AEAFXBlendMode[AEAFXBlendMode["k_Varying"] = 5] = "k_Varying";
    AEAFXBlendMode[AEAFXBlendMode["k_TypeDecl"] = 6] = "k_TypeDecl";
    AEAFXBlendMode[AEAFXBlendMode["k_VertexOut"] = 7] = "k_VertexOut";
})(AEAFXBlendMode || (AEAFXBlendMode = {}));
//# sourceMappingURL=AIAFXInstruction.js.map
