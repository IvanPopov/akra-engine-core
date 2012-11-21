#ifndef EFFECTPARSER_TS
#define EFFECTPARSER_TS

#include "util/Parser.ts"
#include "IParser.ts"

module akra.util {

	export class EffectParser extends Parser {

		constructor(){
			super();

			this.addAdditionalFunction("addType", this._addType);
			this.addAdditionalFunction("includeCode", this._includeCode);
		}

		protected defaultInit(): void {
			super.defaultInit();

			this.addTypeId("float2");
			this.addTypeId("float3");
			this.addTypeId("float4");
			
			this.addTypeId("float2x2");
			this.addTypeId("float3x3");
			this.addTypeId("float4x4");
			
			this.addTypeId("int2");
			this.addTypeId("int3");
			this.addTypeId("int4");
			
			this.addTypeId("bool2");
			this.addTypeId("bool3");
			this.addTypeId("bool4");
		}

		private _addType(): EOperationType {
			var pTree: IParseTree = this.getSyntaxTree();
			var pNode: IParseNode = pTree.getLastNode();
			var sTypeId: string;

			sTypeId = pNode.children[pNode.children.length - 2].value;

			this.addTypeId(sTypeId);

			return EOperationType.k_Ok;
		}

		private _includeCode(): EOperationType {
			return EOperationType.k_Ok;
		}

	}	

	export var parser: EffectParser = new EffectParser();

	var sGrammar: string = "S : Program\n\
Program : --AN\n\
Program : Decls\n\
\n\
Decls : Decl --NN\n\
Decls : Decls Decl\n\
Decl : ';'\n\
Decl : TypeDecl\n\
Decl : VariableDecl\n\
Decl : VarStructDecl\n\
Decl : FunctionDecl\n\
Decl : TechniqueDecl\n\
Decl : UseDecl\n\
Decl : ImportDecl\n\
Decl : ProvideDecl\n\
Decl : IncludeDecl\n\
\n\
IncludeDecl : T_KW_INCLUDE String --AN --F includeCode\n\
\n\
ImportDecl : T_KW_IMPORT ComplexNameOpt ShiftOpt ExtOpt\n\
ShiftOpt :\n\
ShiftOpt : T_KW_SHIFT Uint\n\
ShiftOpt : T_KW_SHIFT '-' Uint\n\
\n\
ExtOpt :\n\
ExtOpt : T_KW_TO T_KW_ALL_PASSES\n\
\n\
ProvideDecl : T_KW_PROVIDE ComplexNameOpt\n\
ProvideDecl : T_KW_PROVIDE ComplexNameOpt T_KW_AS ComplexNameOpt\n\
\n\
UseDecl : T_KW_USE Mode\n\
Mode : T_KW_STRICT\n\
\n\
Usages : Usage --NN\n\
Usages : Usages Usage\n\
Usage : T_KW_STATIC --AN\n\
Usage : T_KW_UNIFORM\n\
Usage : T_KW_EXTERN\n\
Usage : T_KW_VOLATILE\n\
Usage : T_KW_INLINE\n\
Usage : T_KW_SHARED\n\
Usage : T_KW_GLOBAL\n\
Usage : T_KW_FOREIGN\n\
Usage : ConstUsage\n\
\n\
ConstUsages : ConstUsage --NN\n\
ConstUsages : ConstUsages ConstUsage\n\
ConstUsage : T_KW_CONST\n\
ConstUsage : T_KW_ROW_MAJOR\n\
ConstUsage : T_KW_COLUMN_MAJOR\n\
\n\
UsageType : Type --AN\n\
UsageType : Usages Type\n\
\n\
UsageStructDecl : StructDecl --AN\n\
UsageStructDecl : Usages StructDecl\n\
\n\
TypeDecl : T_KW_TYPEDEF ConstType TypeDefs ';' --AN\n\
TypeDecl : T_KW_TYPEDEF ConstStructDecl TypeDefs ';'\n\
TypeDecl : StructDecl --F addType ';'\n\
TypeDefs : VariableDim\n\
TypeDefs : VariableDim ',' TypeDefs\n\
\n\
Type : BaseType --AN\n\
Type : Struct\n\
Type : TypeId\n\
Type : T_KW_STRUCT TypeId\n\
\n\
ConstType : Type --AN\n\
ConstType : ConstUsages Type\n\
ConstTypeDim : ConstType --NN\n\
ConstTypeDim : ConstTypeDim '[' ConstantExpr ']'\n\
\n\
BaseType : T_KW_VOID --AN\n\
BaseType : ScalarType\n\
BaseType : VectorType\n\
BaseType : MatrixType\n\
BaseType : ObjectType\n\
\n\
ScalarType : T_KW_BOOL --AN\n\
ScalarType : T_KW_INT\n\
ScalarType : T_KW_HALF\n\
ScalarType : T_KW_FLOAT\n\
ScalarType : T_KW_DOUBLE\n\
\n\
VectorType : T_KW_VECTOR --AN\n\
VectorType : T_KW_VECTOR '<' ScalarType ',' AddExpr '>'\n\
\n\
MatrixType : T_KW_MATRIX --AN\n\
MatrixType : T_KW_MATRIX '<' ScalarType ',' ConstantExpr ',' AddExpr '>'\n\
\n\
ObjectType : T_KW_STRING --AN\n\
ObjectType : T_KW_TEXTURE\n\
ObjectType : T_KW_TEXTURE1D\n\
ObjectType : T_KW_TEXTURE2D\n\
ObjectType : T_KW_TEXTURE3D\n\
ObjectType : T_KW_TEXTURECUBE\n\
ObjectType : T_KW_SAMPLER\n\
ObjectType : T_KW_SAMPLER1D\n\
ObjectType : T_KW_SAMPLER2D\n\
ObjectType : T_KW_SAMPLER3D\n\
ObjectType : T_KW_SAMPLERCUBE\n\
ObjectType : T_KW_PIXELSHADER\n\
ObjectType : T_KW_VERTEXSHADER\n\
ObjectType : T_KW_PIXELFRAGMENT\n\
ObjectType : T_KW_VERTEXFRAGMENT\n\
ObjectType : T_KW_STATEBLOCK\n\
ObjectType : T_KW_VIDEOBUFFER\n\
ObjectType : T_KW_PTR\n\
\n\
Struct : T_KW_STRUCT StructBegin StructEnd --AN\n\
Struct : T_KW_STRUCT StructBegin StructDecls StructEnd\n\
StructDecl : T_KW_STRUCT Id StructBegin StructEnd --AN\n\
StructDecl : T_KW_STRUCT Id StructBegin UseDecl StructDecls StructEnd\n\
StructDecl : T_KW_STRUCT Id StructBegin StructDecls StructEnd\n\
\n\
ConstStructDecl : StructDecl\n\
ConstStructDecl : ConstUsages StructDecl\n\
\n\
StructBegin : '{'\n\
StructDecls : VariableDecl --NN\n\
StructDecls : VariableDecl StructDecls\n\
StructEnd : '}'\n\
\n\
Semantic : ':' Id --AN\n\
Semantic : ':' T_KW_REGISTER '(' Register ')'\n\
Semantics : Semantic\n\
Semantics : Semantics Semantic\n\
SemanticsOpt :\n\
SemanticsOpt : Semantics\n\
\n\
Register : Id\n\
Register : Target ',' Id\n\
\n\
Annotation : AnnotationBegin AnnotationEnd  --AN\n\
Annotation : AnnotationBegin AnnotationDecls AnnotationEnd\n\
AnnotationOpt :\n\
AnnotationOpt : Annotation\n\
AnnotationBegin : '<'\n\
AnnotationDecls : VariableDecl\n\
AnnotationDecls : VariableDecl AnnotationDecls\n\
AnnotationEnd : '>'\n\
\n\
Initializer : '=' AssignmentExpr --AN\n\
Initializer : '=' '{' InitExprs '}'\n\
Initializer : '=' '{' InitExprs ',' '}'\n\
InitializerOpt :\n\
InitializerOpt : Initializer\n\
\n\
AddressOpt :\n\
AddressOpt : FromExpr\n\
\n\
VariableDecl : UsageType Variables ';' --AN\n\
VarStructDecl : UsageStructDecl Variables ';' --AN\n\
Variables : Variable --NN\n\
Variables : Variables ',' Variable\n\
Variable : VariableDim SemanticsOpt AnnotationOpt InitializerOpt --AN\n\
VariableDim : Id --AN\n\
VariableDim : VariableDim '[' ConstantExpr ']'\n\
VariableDim : VariableDim '[' ']' AddressOpt\n\
\n\
FunctionDecl : FunctionDef ';' --AN\n\
FunctionDecl : FunctionDef AnnotationOpt StmtBlock\n\
FunctionDef : UsageType Id ParamList SemanticsOpt\n\
\n\
ParamList : ParamListBegin ParamListEnd\n\
ParamList : ParamListBegin T_KW_VOID ParamListEnd\n\
ParamList : ParamListBegin ParameterDecls ParamListEnd\n\
ParamListBegin : '('\n\
ParamListEnd : ')'\n\
\n\
ParameterDecls : ParameterDecl --NN\n\
ParameterDecls : ParameterDecls ',' ParameterDecl\n\
ParameterDecl : ParamUsageType Variable\n\
\n\
ParamUsageType : Type --AN\n\
ParamUsageType : ParamUsages Type\n\
\n\
ParamUsages : ParamUsage --NN\n\
ParamUsages : ParamUsages ParamUsage\n\
ParamUsage : T_KW_IN --AN\n\
ParamUsage : T_KW_OUT\n\
ParamUsage : T_KW_INOUT\n\
ParamUsage : T_KW_UNIFORM\n\
ParamUsage : ConstUsage\n\
\n\
\n\
TechniqueDecl : T_KW_TECHNIQUE ComplexNameOpt SemanticsOpt AnnotationOpt TechniqueBody --AN\n\
TechniqueBody : TechniqueBegin TechniqueEnd  --AN\n\
TechniqueBody : TechniqueBegin PassDecls TechniqueEnd\n\
TechniqueBegin : '{'\n\
TechniqueEnd : '}'\n\
\n\
ComplexNameOpt : ComplexName --AN\n\
ComplexName : Id --NN\n\
ComplexName : ComplexName '.' Id\n\
\n\
PassDecls : PassDecl --NN\n\
PassDecls : PassDecls PassDecl\n\
PassDecl : T_KW_PASS IdOpt AnnotationOpt PassStateBlock --AN\n\
PassDecl : ImportDecl\n\
PassDecl : ';'\n\
\n\
PassStateBlock : '{' '}' --AN\n\
PassStateBlock : '{' PassStates '}'\n\
PassStates : PassState --NN\n\
PassStates : PassStates PassState\n\
\n\
PassState : Id StateIndex StateExprBegin StateExpr StateExprEnd --AN\n\
PassState : StateIf\n\
PassState : StateSwitch\n\
\n\
StateIf : T_KW_IF '(' Expr ')' PassStateBlock\n\
StateIf : T_KW_IF '(' Expr ')' PassStateBlock T_KW_ELSE PassStateBlock\n\
StateIf : T_KW_IF '(' Expr ')' PassStateBlock T_KW_ELSE StateIf\n\
StateSwitch : T_KW_SWITCH '(' Expr ')' CaseBlock\n\
\n\
CaseBlock : '{' CaseStates DefaultState '}'\n\
CaseStates : CaseState --NN\n\
CaseStates : CaseStates CaseState\n\
\n\
CaseState : T_KW_CASE Dword ':' PassStates BreakOpt\n\
DefaultState : T_KW_DEFAULT ':' PassStates BreakOpt\n\
\n\
BreakOpt :  --NN\n\
BreakOpt : ';'\n\
BreakOpt : T_KW_BREAK ';'\n\
\n\
StateBlock : StateBlockBegin StateBlockEnd --AN\n\
StateBlock : StateBlockBegin States StateBlockEnd\n\
StateBlockBegin : '{'\n\
StateBlockEnd : '}'\n\
\n\
States : State --NN\n\
States : States State\n\
State : Id StateIndex StateExprBegin StateExpr StateExprEnd --AN\n\
\n\
StateIndex :\n\
StateIndex : '[' Uint ']'\n\
StateExprBegin : '='\n\
StateExprEnd : ';'\n\
\n\
StmtBlock : StmtBlockBegin StmtBlockEnd --AN\n\
StmtBlock : StmtBlockBegin Stmts StmtBlockEnd\n\
StmtBlockBegin : '{'\n\
StmtBlockEnd : '}'\n\
Stmts : Stmt --NN\n\
Stmts : Stmts Stmt\n\
SimpleStmt : ';' --AN\n\
SimpleStmt : Expr ';'\n\
SimpleStmt : T_KW_RETURN ';'\n\
SimpleStmt : T_KW_RETURN Expr ';'\n\
SimpleStmt : T_KW_DO Stmt T_KW_WHILE '(' Expr ')' ';'\n\
SimpleStmt : StmtBlock\n\
SimpleStmt : T_KW_DISCARD ';'\n\
SimpleStmt : TypeDecl\n\
SimpleStmt : VariableDecl\n\
SimpleStmt : VarStructDecl\n\
SimpleStmt : T_KW_BREAK ';'\n\
SimpleStmt : T_KW_CONTINUE ';'\n\
\n\
NonIfStmt : SimpleStmt --AN\n\
NonIfStmt : T_KW_WHILE '(' Expr ')' NonIfStmt\n\
NonIfStmt : For '(' ForInit ForCond ForStep ')' NonIfStmt\n\
\n\
Stmt : SimpleStmt --AN\n\
Stmt : UseDecl\n\
Stmt : T_KW_WHILE '(' Expr ')' Stmt\n\
Stmt : For '(' ForInit ForCond ForStep ')' Stmt\n\
Stmt : T_KW_IF '(' Expr ')' Stmt\n\
Stmt : T_KW_IF '(' Expr ')' NonIfStmt T_KW_ELSE Stmt\n\
\n\
\n\
For : T_KW_FOR\n\
ForInit : ';' --AN\n\
ForInit : Expr ';'\n\
ForInit : VariableDecl\n\
ForCond : ';' --AN\n\
ForCond : Expr ';'\n\
ForStep : --AN\n\
ForStep : Expr\n\
\n\
DwordExpr : Dword\n\
DwordExpr : Dword '|' DwordExpr\n\
\n\
StateExpr : DwordExpr --AN\n\
StateExpr : ComplexExpr\n\
StateExpr : '{' InitExprs '}'\n\
StateExpr : '{' InitExprs ',' '}'\n\
StateExpr : '<' RelationalExpr '>'\n\
\n\
SimpleExpr : T_KW_TRUE\n\
SimpleExpr : T_KW_FALSE\n\
SimpleExpr : Uint\n\
SimpleExpr : Float\n\
SimpleExpr : String\n\
SimpleExpr : NonTypeId\n\
\n\
ComplexExpr : '(' Expr ')'\n\
ComplexExpr : TypeId '(' ArgumentsOpt ')'\n\
ComplexExpr : BaseType '(' ArgumentsOpt ')'\n\
ComplexExpr : NonTypeId '(' ArgumentsOpt ')'\n\
ComplexExpr : ObjectExpr\n\
\n\
ObjectExpr : T_KW_COMPILE NonTypeId '(' ArgumentsOpt ')'\n\
ObjectExpr : T_KW_SAMPLER_STATE StateBlock\n\
ObjectExpr : T_KW_COMPILE_FRAGMENT Target NonTypeId '(' ArgumentsOpt ')'\n\
ObjectExpr : T_KW_STATEBLOCK_STATE StateBlock\n\
\n\
PrimaryExpr : ComplexExpr\n\
PrimaryExpr : SimpleExpr\n\
PrimaryExpr : '@' PrimaryExpr\n\
PostfixExpr : PrimaryExpr\n\
PostfixExpr : PostfixExpr '[' Expr ']'\n\
PostfixExpr : PostfixExpr '.' Id AddressOpt\n\
PostfixExpr : PostfixExpr T_OP_INC\n\
PostfixExpr : PostfixExpr T_OP_DEC\n\
\n\
UnaryExpr : PostfixExpr\n\
UnaryExpr : T_OP_INC UnaryExpr\n\
UnaryExpr : T_OP_DEC UnaryExpr\n\
UnaryExpr : '!' CastExpr\n\
UnaryExpr : '-' CastExpr\n\
UnaryExpr : '+' CastExpr\n\
\n\
CastExpr : UnaryExpr\n\
CastExpr : '(' ConstTypeDim ')' CastExpr\n\
\n\
MulExpr : CastExpr\n\
MulExpr : MulExpr '*' CastExpr\n\
MulExpr : MulExpr '/' CastExpr\n\
MulExpr : MulExpr '%' CastExpr\n\
\n\
AddExpr : MulExpr\n\
AddExpr : AddExpr '+' MulExpr\n\
AddExpr : AddExpr '-' MulExpr\n\
\n\
RelationalExpr : AddExpr\n\
RelationalExpr : RelationalExpr '<' AddExpr\n\
RelationalExpr : RelationalExpr '>' AddExpr\n\
RelationalExpr : RelationalExpr T_OP_LE AddExpr\n\
RelationalExpr : RelationalExpr T_OP_GE AddExpr\n\
\n\
EqualityExpr : RelationalExpr\n\
EqualityExpr : EqualityExpr T_OP_EQ RelationalExpr\n\
EqualityExpr : EqualityExpr T_OP_NE RelationalExpr\n\
\n\
AndExpr : EqualityExpr\n\
AndExpr : AndExpr T_OP_AND EqualityExpr\n\
OrExpr : AndExpr\n\
OrExpr : OrExpr T_OP_OR AndExpr\n\
ConditionalExpr : OrExpr\n\
ConditionalExpr : OrExpr '?' AssignmentExpr ':' ConditionalExpr\n\
\n\
AssignmentExpr : ConditionalExpr\n\
AssignmentExpr : MemExpr\n\
AssignmentExpr : CastExpr '=' AssignmentExpr\n\
AssignmentExpr : CastExpr T_OP_ME AssignmentExpr\n\
AssignmentExpr : CastExpr T_OP_DE AssignmentExpr\n\
AssignmentExpr : CastExpr T_OP_RE AssignmentExpr\n\
AssignmentExpr : CastExpr T_OP_AE AssignmentExpr\n\
AssignmentExpr : CastExpr T_OP_SE AssignmentExpr\n\
\n\
MemExpr : T_KW_MEMOF PostfixExpr\n\
FromExpr : '(' MemExpr ')'\n\
FromExpr : '(' NonTypeId ')'\n\
\n\
Arguments : AssignmentExpr --NN\n\
Arguments : Arguments ',' AssignmentExpr\n\
ArgumentsOpt : --NN\n\
ArgumentsOpt : Arguments\n\
\n\
InitExpr : AssignmentExpr --AN\n\
InitExpr : '{' InitExprs '}'\n\
InitExpr : '{' InitExprs ',' '}'\n\
InitExprs : InitExpr --NN\n\
InitExprs : InitExprs ',' InitExpr\n\
\n\
ConstantExpr : AssignmentExpr\n\
Expr : AssignmentExpr\n\
Expr : Expr ',' AssignmentExpr\n\
\n\
Dword : Uint\n\
Dword : '-' Uint\n\
Dword : Float\n\
Dword : '-' Float\n\
Dword : DwordId\n\
Dword : Uint DwordId\n\
DwordId : Id\n\
DwordId : T_KW_TRUE\n\
DwordId : T_KW_FALSE\n\
DwordId : T_KW_TEXTURE\n\
\n\
Id : TypeId\n\
Id : NonTypeId\n\
IdOpt :\n\
IdOpt : Id\n\
\n\
Target : NonTypeId\n\
\n\
Uint : T_UINT\n\
Uint : T_INT32\n\
Uint : T_UINT32\n\
\n\
Float : T_FLOAT\n\
Float : T_FLOAT16\n\
Float : T_FLOAT32\n\
Float : T_FLOAT64\n\
\n\
Strings : String\n\
Strings : Strings String\n\
String : T_STRING\n\
\n\
TypeId : T_TYPE_ID\n\
NonTypeId : T_NON_TYPE_ID\n\
\n\
AsmDecl : T_KW_DECL '{'\n\
Asm : T_KW_ASM '{'\n\
AsmFragment : T_KW_ASM_FRAGMENT '{'\n\
\n\
--LEXER--\n\
\n\
T_KW_STATIC : \"static\"\n\
T_KW_UNIFORM : \"uniform\"\n\
T_KW_EXTERN : \"extern\"\n\
T_KW_VOLATILE : \"volatile\"\n\
T_KW_INLINE : \"inline\"\n\
T_KW_SHARED : \"shared\"\n\
T_KW_GLOBAL : \"global\"\n\
T_KW_FOREIGN : \"foreign\"\n\
T_KW_CONST : \"const\"\n\
T_KW_ROW_MAJOR : \"row_major\"\n\
T_KW_COLUMN_MAJOR : \"column_major\"\n\
T_KW_TYPEDEF : \"typedef\"\n\
T_KW_STRUCT : \"struct\"\n\
T_KW_VOID : \"void\"\n\
T_KW_BOOL : \"bool\"\n\
T_KW_INT : \"int\"\n\
T_KW_HALF : \"half\"\n\
T_KW_FLOAT : \"float\"\n\
T_KW_DOUBLE : \"double\"\n\
T_KW_VECTOR : \"vector\"\n\
T_KW_MATRIX : \"matrix\"\n\
T_KW_STRING : \"string\"\n\
T_KW_TEXTURE : \"texture\"\n\
T_KW_TEXTURE1D : \"texture1D\"\n\
T_KW_TEXTURE2D : \"texture2D\"\n\
T_KW_TEXTURE3D : \"texture3D\"\n\
T_KW_TEXTURECUBE : \"texturecube\"\n\
T_KW_SAMPLER : \"sampler\"\n\
T_KW_SAMPLER1D : \"sampler1D\"\n\
T_KW_SAMPLER2D : \"sampler2D\"\n\
T_KW_SAMPLER3D : \"sampler3D\"\n\
T_KW_SAMPLERCUBE : \"samplerCUBE\"\n\
T_KW_PIXELSHADER : \"pixelshader\"\n\
T_KW_VERTEXSHADER : \"vertexshader\"\n\
T_KW_PIXELFRAGMENT : \"pixelfragment\"\n\
T_KW_VERTEXFRAGMENT : \"vertexfragment\"\n\
T_KW_STATEBLOCK : \"stateblock\"\n\
T_KW_REGISTER : \"register\"\n\
T_KW_IN : \"in\"\n\
T_KW_OUT : \"out\"\n\
T_KW_INOUT : \"inout\"\n\
T_KW_TECHNIQUE : \"technique\"\n\
T_KW_PASS : \"pass\"\n\
T_KW_RETURN : \"return\"\n\
T_KW_DO : \"do\"\n\
T_KW_DISCARD : \"discard\"\n\
T_KW_WHILE : \"while\"\n\
T_KW_IF : \"if\"\n\
T_KW_ELSE : \"else\"\n\
T_KW_FOR : \"for\"\n\
T_KW_TRUE : \"true\"\n\
T_KW_FALSE : \"false\"\n\
T_KW_COMPILE : \"compile\"\n\
T_KW_SAMPLER_STATE : \"sampler_state\"\n\
T_KW_COMPILE_FRAGMENT : \"compile_fragment\"\n\
T_KW_STATEBLOCK_STATE : \"stateblock_state\"\n\
T_KW_DECL : \"decl\"\n\
T_KW_ASM : \"asm\"\n\
T_KW_ASM_FRAGMENT : \"asm_fragment\"\n\
T_KW_MEMOF : \"memof\"\n\
T_KW_VIDEOBUFFER : \"video_buffer\"\n\
T_KW_USE : \"use\"\n\
T_KW_STRICT : \"strict\"\n\
T_KW_IMPORT : \"import\"\n\
T_KW_PROVIDE : \"provide\"\n\
T_KW_SWITCH : \"switch\"\n\
T_KW_CASE : \"case\"\n\
T_KW_DEFAULT : \"default\"\n\
T_KW_BREAK : \"break\"\n\
T_KW_CONTINUE: \"continue\"\n\
T_KW_AS : \"as\"\n\
T_KW_PTR : \"ptr\"\n\
T_KW_SHIFT : \"shift\"\n\
T_KW_INCLUDE : \"include\"\n\
T_KW_TO : \"to\"\n\
T_KW_ALL_PASSES : \"ALL_PASSES\"\n\
T_OP_INC : \"++\"\n\
T_OP_DEC : \"--\"\n\
T_OP_LE : \">=\"\n\
T_OP_GE : \"<=\"\n\
T_OP_EQ : \"==\"\n\
T_OP_NE : \"!=\"\n\
T_OP_AND : \"&&\"\n\
T_OP_OR : \"||\"\n\
T_OP_ME : \"*=\"\n\
T_OP_DE : \"/=\"\n\
T_OP_RE : \"%=\"\n\
T_OP_AE : \"+=\"\n\
T_OP_SE : \"-=\"";

	parser.init(sGrammar, akra.EParseMode.k_Add | 
						  akra.EParseMode.k_Negate |
						  akra.EParseMode.k_Optimize |
						  akra.EParseMode.k_DebugMode);

}


#endif