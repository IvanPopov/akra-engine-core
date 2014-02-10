/// <reference path="parser/IParser.ts" />
/// <reference path="IAFXComponent.ts" />
/// <reference path="IUnique.ts" />
/// <reference path="IRenderer.ts" />
/// <reference path="IMap.ts" />
/// <reference path="IAFXComposer.ts" />
/// <reference path="ERenderStateValues.ts" />
var akra;
(function (akra) {
    (function (EAFXInstructionTypes) {
        EAFXInstructionTypes[EAFXInstructionTypes["k_Instruction"] = 0] = "k_Instruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_InstructionCollector"] = 1] = "k_InstructionCollector";
        EAFXInstructionTypes[EAFXInstructionTypes["k_SimpleInstruction"] = 2] = "k_SimpleInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_VariableTypeInstruction"] = 3] = "k_VariableTypeInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_SystemTypeInstruction"] = 4] = "k_SystemTypeInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_ComplexTypeInstruction"] = 5] = "k_ComplexTypeInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_TypedInstruction"] = 6] = "k_TypedInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_DeclInstruction"] = 7] = "k_DeclInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_IntInstruction"] = 8] = "k_IntInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_FloatInstruction"] = 9] = "k_FloatInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_BoolInstruction"] = 10] = "k_BoolInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_StringInstruction"] = 11] = "k_StringInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_IdInstruction"] = 12] = "k_IdInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_KeywordInstruction"] = 13] = "k_KeywordInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_TypeDeclInstruction"] = 14] = "k_TypeDeclInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_VariableDeclInstruction"] = 15] = "k_VariableDeclInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_AnnotationInstruction"] = 16] = "k_AnnotationInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_UsageTypeInstruction"] = 17] = "k_UsageTypeInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_BaseTypeInstruction"] = 18] = "k_BaseTypeInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_StructDeclInstruction"] = 19] = "k_StructDeclInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_StructFieldsInstruction"] = 20] = "k_StructFieldsInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_ExprInstruction"] = 21] = "k_ExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_IdExprInstruction"] = 22] = "k_IdExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_ArithmeticExprInstruction"] = 23] = "k_ArithmeticExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_AssignmentExprInstruction"] = 24] = "k_AssignmentExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_RelationalExprInstruction"] = 25] = "k_RelationalExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_LogicalExprInstruction"] = 26] = "k_LogicalExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_ConditionalExprInstruction"] = 27] = "k_ConditionalExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_CastExprInstruction"] = 28] = "k_CastExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_UnaryExprInstruction"] = 29] = "k_UnaryExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_PostfixIndexInstruction"] = 30] = "k_PostfixIndexInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_PostfixPointInstruction"] = 31] = "k_PostfixPointInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_PostfixArithmeticInstruction"] = 32] = "k_PostfixArithmeticInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_PrimaryExprInstruction"] = 33] = "k_PrimaryExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_ComplexExprInstruction"] = 34] = "k_ComplexExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_FunctionCallInstruction"] = 35] = "k_FunctionCallInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_SystemCallInstruction"] = 36] = "k_SystemCallInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_ConstructorCallInstruction"] = 37] = "k_ConstructorCallInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_CompileExprInstruction"] = 38] = "k_CompileExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_InitExprInstruction"] = 39] = "k_InitExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_SamplerStateBlockInstruction"] = 40] = "k_SamplerStateBlockInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_SamplerStateInstruction"] = 41] = "k_SamplerStateInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_ExtractExprInstruction"] = 42] = "k_ExtractExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_MemExprInstruction"] = 43] = "k_MemExprInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_FunctionDeclInstruction"] = 44] = "k_FunctionDeclInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_ShaderFunctionInstruction"] = 45] = "k_ShaderFunctionInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_SystemFunctionInstruction"] = 46] = "k_SystemFunctionInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_FunctionDefInstruction"] = 47] = "k_FunctionDefInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_StmtInstruction"] = 48] = "k_StmtInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_StmtBlockInstruction"] = 49] = "k_StmtBlockInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_ExprStmtInstruction"] = 50] = "k_ExprStmtInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_BreakStmtInstruction"] = 51] = "k_BreakStmtInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_WhileStmtInstruction"] = 52] = "k_WhileStmtInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_ForStmtInstruction"] = 53] = "k_ForStmtInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_IfStmtInstruction"] = 54] = "k_IfStmtInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_DeclStmtInstruction"] = 55] = "k_DeclStmtInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_ReturnStmtInstruction"] = 56] = "k_ReturnStmtInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_ExtractStmtInstruction"] = 57] = "k_ExtractStmtInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_SemicolonStmtInstruction"] = 58] = "k_SemicolonStmtInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_PassInstruction"] = 59] = "k_PassInstruction";
        EAFXInstructionTypes[EAFXInstructionTypes["k_TechniqueInstruction"] = 60] = "k_TechniqueInstruction";
    })(akra.EAFXInstructionTypes || (akra.EAFXInstructionTypes = {}));
    var EAFXInstructionTypes = akra.EAFXInstructionTypes;

    (function (EFunctionType) {
        EFunctionType[EFunctionType["k_Vertex"] = 0] = "k_Vertex";
        EFunctionType[EFunctionType["k_Pixel"] = 1] = "k_Pixel";
        EFunctionType[EFunctionType["k_Fragment"] = 1] = "k_Fragment";
        EFunctionType[EFunctionType["k_Function"] = 2] = "k_Function";
        EFunctionType[EFunctionType["k_PassFunction"] = 3] = "k_PassFunction";
    })(akra.EFunctionType || (akra.EFunctionType = {}));
    var EFunctionType = akra.EFunctionType;

    (function (ECheckStage) {
        ECheckStage[ECheckStage["CODE_TARGET_SUPPORT"] = 0] = "CODE_TARGET_SUPPORT";
        ECheckStage[ECheckStage["SELF_CONTAINED"] = 1] = "SELF_CONTAINED";
    })(akra.ECheckStage || (akra.ECheckStage = {}));
    var ECheckStage = akra.ECheckStage;

    (function (EVarUsedMode) {
        EVarUsedMode[EVarUsedMode["k_Read"] = 0] = "k_Read";
        EVarUsedMode[EVarUsedMode["k_Write"] = 1] = "k_Write";
        EVarUsedMode[EVarUsedMode["k_ReadWrite"] = 2] = "k_ReadWrite";
        EVarUsedMode[EVarUsedMode["k_Undefined"] = 3] = "k_Undefined";
        EVarUsedMode[EVarUsedMode["k_Default"] = EVarUsedMode.k_ReadWrite] = "k_Default";
    })(akra.EVarUsedMode || (akra.EVarUsedMode = {}));
    var EVarUsedMode = akra.EVarUsedMode;

    (function (EExtractExprType) {
        EExtractExprType[EExtractExprType["k_Header"] = 0] = "k_Header";

        EExtractExprType[EExtractExprType["k_Float"] = 1] = "k_Float";
        EExtractExprType[EExtractExprType["k_Int"] = 2] = "k_Int";
        EExtractExprType[EExtractExprType["k_Bool"] = 3] = "k_Bool";

        EExtractExprType[EExtractExprType["k_Float2"] = 4] = "k_Float2";
        EExtractExprType[EExtractExprType["k_Int2"] = 5] = "k_Int2";
        EExtractExprType[EExtractExprType["k_Bool2"] = 6] = "k_Bool2";

        EExtractExprType[EExtractExprType["k_Float3"] = 7] = "k_Float3";
        EExtractExprType[EExtractExprType["k_Int3"] = 8] = "k_Int3";
        EExtractExprType[EExtractExprType["k_Bool3"] = 9] = "k_Bool3";

        EExtractExprType[EExtractExprType["k_Float4"] = 10] = "k_Float4";
        EExtractExprType[EExtractExprType["k_Int4"] = 11] = "k_Int4";
        EExtractExprType[EExtractExprType["k_Bool4"] = 12] = "k_Bool4";

        EExtractExprType[EExtractExprType["k_Float4x4"] = 13] = "k_Float4x4";
    })(akra.EExtractExprType || (akra.EExtractExprType = {}));
    var EExtractExprType = akra.EExtractExprType;

    (function (EAFXBlendMode) {
        EAFXBlendMode[EAFXBlendMode["k_Shared"] = 0] = "k_Shared";
        EAFXBlendMode[EAFXBlendMode["k_Uniform"] = 1] = "k_Uniform";
        EAFXBlendMode[EAFXBlendMode["k_Attribute"] = 2] = "k_Attribute";
        EAFXBlendMode[EAFXBlendMode["k_Foreign"] = 3] = "k_Foreign";
        EAFXBlendMode[EAFXBlendMode["k_Global"] = 4] = "k_Global";
        EAFXBlendMode[EAFXBlendMode["k_Varying"] = 5] = "k_Varying";
        EAFXBlendMode[EAFXBlendMode["k_TypeDecl"] = 6] = "k_TypeDecl";
        EAFXBlendMode[EAFXBlendMode["k_VertexOut"] = 7] = "k_VertexOut";
    })(akra.EAFXBlendMode || (akra.EAFXBlendMode = {}));
    var EAFXBlendMode = akra.EAFXBlendMode;

    

    
})(akra || (akra = {}));
//# sourceMappingURL=IAFXInstruction.js.map
