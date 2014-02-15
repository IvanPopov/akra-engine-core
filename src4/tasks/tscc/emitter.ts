//
// Copyright (c) Microsoft Corporation.  All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Modified to emit Google Closure Compiler type annotations by Evan Wallace.
//

///<reference path='typescript.d.ts' />

module TypeScript {
	enum IgnoreName {
		NO,
		YES,
	}

	enum ShouldMangle {
		NO,
		YES,
	}

	export enum EmitContainer {
		Prog,
		Module,
		DynamicModule,
		Class,
		Constructor,
		Function,
		Args,
		Interface
	}

	export class EmitState {
		public column: number;
		public line: number;
		public container: EmitContainer;

		constructor() {
			this.column = 0;
			this.line = 0;
			this.container = EmitContainer.Prog;
		}
	}

	export class EmitOptions {
		public ioHost: EmitterIOHost = null;
		public outputMany: boolean = true;
		public commonDirectoryPath = "";

		constructor(public compilationSettings: CompilationSettings) {
		}

		public mapOutputFileName(document: Document, extensionChanger: (fname: string, wholeFileNameReplaced: boolean) => string) {
			if (this.outputMany || document.script.topLevelMod) {
				var updatedFileName = document.fileName;
				if (this.compilationSettings.outDirOption !== "") {
					// Replace the common directory path with the option specified
					updatedFileName = document.fileName.replace(this.commonDirectoryPath, "");
					updatedFileName = this.compilationSettings.outDirOption + updatedFileName;
				}
				return extensionChanger(updatedFileName, false);
			} else {
				return extensionChanger(this.compilationSettings.outFileOption, true);
			}
		}

		public decodeSourceMapOptions(document: Document, jsFilePath: string, oldSourceMapSourceInfo?: SourceMapSourceInfo): SourceMapSourceInfo {
			var sourceMapSourceInfo = new TypeScript.SourceMapSourceInfo(oldSourceMapSourceInfo);

			var tsFilePath = TypeScript.switchToForwardSlashes(document.fileName);

			// Decode mapRoot and sourceRoot
			if (!oldSourceMapSourceInfo) {
				// Js File Name = pretty name of js file
				var prettyJsFileName = TypeScript.getPrettyName(jsFilePath, false, true);
				var prettyMapFileName = prettyJsFileName + TypeScript.SourceMapper.MapFileExtension;
				sourceMapSourceInfo.jsFileName = prettyJsFileName;

				// Figure out sourceMapPath and sourceMapDirectory
				if (this.compilationSettings.mapRoot) {
					if (this.outputMany || document.script.topLevelMod) {
						var sourceMapPath = tsFilePath.replace(this.commonDirectoryPath, "");
						sourceMapPath = this.compilationSettings.mapRoot + sourceMapPath;
						sourceMapPath = TypeScript.TypeScriptCompiler.mapToJSFileName(sourceMapPath, false) + TypeScript.SourceMapper.MapFileExtension;
						sourceMapSourceInfo.sourceMapPath = sourceMapPath;

						if (TypeScript.isRelative(sourceMapSourceInfo.sourceMapPath)) {
							sourceMapPath = this.commonDirectoryPath + sourceMapSourceInfo.sourceMapPath;
						}
						sourceMapSourceInfo.sourceMapDirectory = TypeScript.getRootFilePath(sourceMapPath);
					} else {
						sourceMapSourceInfo.sourceMapPath = this.compilationSettings.mapRoot + prettyMapFileName;
						sourceMapSourceInfo.sourceMapDirectory = this.compilationSettings.mapRoot;
						if (TypeScript.isRelative(sourceMapSourceInfo.sourceMapDirectory)) {
							sourceMapSourceInfo.sourceMapDirectory = TypeScript.getRootFilePath(jsFilePath) + this.compilationSettings.mapRoot;
						}
					}
				} else {
					sourceMapSourceInfo.sourceMapPath = prettyMapFileName;
					sourceMapSourceInfo.sourceMapDirectory = TypeScript.getRootFilePath(jsFilePath);
				}
				sourceMapSourceInfo.sourceRoot = this.compilationSettings.sourceRoot;
			}

			if (this.compilationSettings.sourceRoot) {
				// Use the relative path corresponding to the common directory path
				sourceMapSourceInfo.tsFilePath = TypeScript.getRelativePathToFixedPath(this.commonDirectoryPath, tsFilePath);
			} else {
				// Source locations relative to map file location
				sourceMapSourceInfo.tsFilePath = TypeScript.getRelativePathToFixedPath(sourceMapSourceInfo.sourceMapDirectory, tsFilePath);
			}
			return sourceMapSourceInfo;
		}
	}

	export class Indenter {
		static indentStep: number = 4;
		static indentStepString: string = "  ";
		static indentStrings: string[] = [];
		public indentAmt: number = 0;

		public increaseIndent() {
			this.indentAmt += Indenter.indentStep;
		}

		public decreaseIndent() {
			this.indentAmt -= Indenter.indentStep;
		}

		public getIndent() {
			var indentString = Indenter.indentStrings[this.indentAmt];
			if (indentString === undefined) {
				indentString = "";
				for (var i = 0; i < this.indentAmt; i = i + Indenter.indentStep) {
					indentString += Indenter.indentStepString;
				}
				Indenter.indentStrings[this.indentAmt] = indentString;
			}
			return indentString;
		}
	}

	export interface BoundDeclInfo {
		boundDecl: BoundDecl;
		pullDecl: PullDecl;
	}

	export class Emitter {
		public extendsPrologueEmitted = false;
		public thisBaseName: string = null;
		public thisClassNode: ClassDeclaration = null;
		public thisFunctionDeclaration: FunctionDeclaration = null;
		public emitState = new EmitState();
		public indenter = new Indenter();
		public allSourceMappers: SourceMapper[] = [];
		public sourceMapper: SourceMapper = null;
		public captureThisStmtString = "var _this = this;";
		private resolvingContext = new TypeScript.PullTypeResolutionContext();
		private emittedModuleNames: string[] = [];
		private emittedSymbolNames: { [id: number]: string[] } = {};

		public document: Document = null;
		private copyrightElement: AST = null;

		constructor(public emittingFileName: string,
			public outfile: ITextWriter,
			public emitOptions: EmitOptions,
			private semanticInfoChain: SemanticInfoChain) {
			TypeScript.globalSemanticInfoChain = semanticInfoChain;
			TypeScript.globalBinder.semanticInfoChain = semanticInfoChain;
		}

		public setExportAssignmentIdentifier(id: string) {
			// Export assignments are ignored
		}

		public setDocument(document: Document) {
			this.document = document;
		}

		public emitImportDeclaration(importDeclAST: ImportDeclaration) {
		}

		public setSourceMappings(mapper: SourceMapper) {
			this.allSourceMappers.push(mapper);
			this.sourceMapper = mapper;
		}

		private updateLineAndColumn(s: string) {
			var lineNumbers = TypeScript.TextUtilities.parseLineStarts(TypeScript.TextFactory.createText(s));
			if (lineNumbers.length > 1) {
				// There are new lines in the string, update the line and column number accordingly
				this.emitState.line += lineNumbers.length - 1;
				this.emitState.column = s.length - lineNumbers[lineNumbers.length - 1];
			} else {
				// No new lines in the string
				this.emitState.column += s.length;
			}
		}

		public writeToOutput(s: string) {
			this.outfile.Write(s);
			this.updateLineAndColumn(s);
		}

		public writeToOutputTrimmable(s: string) {
			this.writeToOutput(s);
		}

		public writeLineToOutput(s: string) {
			this.outfile.WriteLine(s);
			this.updateLineAndColumn(s);
			this.emitState.column = 0;
			this.emitState.line++;
		}

		public writeCaptureThisStatement(ast: AST) {
			this.emitIndent();
			this.recordSourceMappingStart(ast);
			this.writeToOutput(this.captureThisStmtString);
			this.recordSourceMappingEnd(ast);
			this.writeLineToOutput("");
		}

		public setInVarBlock(count: number) {
			// Not used by the modified emitter code
		}

		public setContainer(c: number): number {
			var temp = this.emitState.container;
			this.emitState.container = c;
			return temp;
		}

		private getIndentString() {
			return this.indenter.getIndent();
		}

		public emitIndent() {
			this.writeToOutput(this.getIndentString());
		}

		public emitComment(comment: Comment) {
			if (this.emitOptions.compilationSettings.removeComments) {
				return;
			}

			var text = comment.getText();
			var emitColumn = this.emitState.column;

			if (emitColumn === 0) {
				this.emitIndent();
			}

			if (comment.isBlockComment) {
				this.recordSourceMappingStart(comment);
				this.writeToOutput(text[0]);

				if (text.length > 1 || comment.endsLine) {
					for (var i = 1; i < text.length; i++) {
						this.writeLineToOutput("");
						this.emitIndent();
						this.writeToOutput(text[i]);
					}
					this.recordSourceMappingEnd(comment);
					this.writeLineToOutput("");
					// Fall through
				} else {
					this.recordSourceMappingEnd(comment);
					this.writeToOutput(" ");
					return;
				}
			}
			else {
				this.recordSourceMappingStart(comment);
				this.writeToOutput(text[0]);
				this.recordSourceMappingEnd(comment);
				this.writeLineToOutput("");
				// Fall through
			}

			if (emitColumn != 0) {
				// If we were indented before, stay indented after.
				this.emitIndent();
			}
		}

		public emitComments(ast: AST, pre: boolean) {
			var comments: Comment[];
			if (pre) {
				var preComments = ast.preComments();
				if (preComments && ast === this.copyrightElement) {
					// We're emitting the comments for the first script element.  Skip any
					// copyright comments, as we'll already have emitted those.
					var copyrightComments = this.getCopyrightComments();
					comments = preComments.slice(copyrightComments.length);
				}
				else {
					comments = preComments;
				}
			}
			else {
				comments = ast.postComments();
			}

			this.emitCommentsArray(comments);
		}

		public emitCommentsArray(comments: Comment[]) {
			if (!this.emitOptions.compilationSettings.removeComments && comments) {
				for (var i = 0, n = comments.length; i < n; i++) {
					this.emitComment(comments[i]);
				}
			}
		}

		public emitObjectLiteral(objectLiteral: UnaryExpression) {
			var useNewLines = !TypeScript.hasFlag(objectLiteral.getFlags(), TypeScript.ASTFlags.SingleLine);

			this.writeToOutput("{");
			var list = <ASTList>objectLiteral.operand;
			if (list.members.length > 0) {
				if (useNewLines) {
					this.writeLineToOutput("");
				}
				else {
					this.writeToOutput(" ");
				}

				this.indenter.increaseIndent();
				this.emitCommaSeparatedList(list, useNewLines);
				this.indenter.decreaseIndent();
				if (useNewLines) {
					this.emitIndent();
				}
				else {
					this.writeToOutput(" ");
				}
			}
			this.writeToOutput("}");
		}

		public emitArrayLiteral(arrayLiteral: UnaryExpression) {
			var useNewLines = !TypeScript.hasFlag(arrayLiteral.getFlags(), TypeScript.ASTFlags.SingleLine);

			this.writeToOutput("[");
			var list = <ASTList>arrayLiteral.operand;
			if (list.members.length > 0) {
				if (useNewLines) {
					this.writeLineToOutput("");
				}

				this.indenter.increaseIndent();
				this.emitCommaSeparatedList(list, useNewLines);
				this.indenter.decreaseIndent();
				if (useNewLines) {
					this.emitIndent();
				}
			}
			this.writeToOutput("]");
		}

		public emitNew(objectCreationExpression: ObjectCreationExpression, target: AST, args: ASTList) {
			this.writeToOutput("new ");
			if (target.nodeType() === TypeScript.NodeType.TypeRef) {
				var typeRef = <TypeReference>target;
				if (typeRef.arrayCount) {
					this.writeToOutput("Array()");
				}
				else {
					typeRef.term.emit(this);
					this.writeToOutput("()");
				}
			}
			else {
				target.emit(this);
				this.recordSourceMappingStart(args);
				this.writeToOutput("(");
				this.emitCommaSeparatedList(args);
				this.recordSourceMappingStart(objectCreationExpression.closeParenSpan);
				this.writeToOutput(")");
				this.recordSourceMappingEnd(objectCreationExpression.closeParenSpan);
				this.recordSourceMappingEnd(args);
			}
		}

		// Enum constants are handled by Google Closure Compiler
		public tryEmitConstant(dotExpr: BinaryExpression): boolean {
			return false;
		}

		public emitCall(callNode: InvocationExpression, target: AST, args: ASTList) {
			if (this.emitSuperCall(callNode)) {
				return;
			}

			// Check if the target needs a cast because it has a more specific call
			// signature than the default one like document.createElement('canvas')
			var returnType: PullSymbol = this.getSymbolForAST(callNode);
			var symbol: PullSymbol = this.getSymbolForAST(callNode.target);
			var emitCast: boolean = returnType !== null && symbol !== null && symbol.type.getCallSignatures().length > 1 && returnType.getTypeName() !== 'void';
			if (emitCast) {
				this.emitInlineJSDocComment([], Emitter.getJSDocForType(returnType.type));
				this.writeToOutput('(');
			}
			if (target.nodeType() === TypeScript.NodeType.FunctionDeclaration) {
				this.writeToOutput("(");
			}
			if (callNode.target.nodeType() === TypeScript.NodeType.SuperExpression && this.emitState.container === EmitContainer.Constructor) {
				this.writeToOutput(this.thisBaseName + ".call");
			}
			else {
				this.emitJavascript(target, false);
			}
			if (target.nodeType() === TypeScript.NodeType.FunctionDeclaration) {
				this.writeToOutput(")");
			}
			this.recordSourceMappingStart(args);
			this.writeToOutput("(");
			if (callNode.target.nodeType() === TypeScript.NodeType.SuperExpression && this.emitState.container === EmitContainer.Constructor) {
				this.writeToOutput("this");
				if (args && args.members.length) {
					this.writeToOutput(", ");
				}
			}
			this.emitCommaSeparatedList(args);
			this.recordSourceMappingStart(callNode.closeParenSpan);
			this.writeToOutput(")");
			this.recordSourceMappingEnd(callNode.closeParenSpan);
			this.recordSourceMappingEnd(args);
			if (emitCast) {
				this.writeToOutput(')');
			}
		}

		public emitInnerFunction(funcDecl: FunctionDeclaration, printName: boolean, includePreComments = true, isFunctionExpression = false) {
			/// REVIEW: The code below causes functions to get pushed to a newline in cases where they shouldn't
			/// such as:
			///   Foo.prototype.bar =
			///     function() {
			///     };
			/// Once we start emitting comments, we should pull this code out to place on the outer context where the function
			/// is used.
			//if (funcDecl.preComments!=null && funcDecl.preComments.length>0) {
			//  this.writeLineToOutput("");
			//  this.increaseIndent();
			//  emitIndent();
			//}

			var pullDecl = this.getDeclForAST(funcDecl);

			// We have no way of knowing if the current function is used as an expression or a statement, so as to enusre that the emitted
			// JavaScript is always valid, add an extra parentheses for unparenthesized function expressions
			var shouldParenthesize = false;

			if (includePreComments && !funcDecl.isConstructor && !printName) {
				this.emitComments(funcDecl, true);
			}

			if (shouldParenthesize) {
				this.writeToOutput("(");
			}
			this.recordSourceMappingStart(funcDecl);
			var accessorSymbol = funcDecl.isAccessor() ? TypeScript.PullHelpers.getAccessorSymbol(funcDecl, this.semanticInfoChain, this.document.fileName) : null;
			var container = accessorSymbol ? accessorSymbol.getContainer() : null;
			var containerKind = container ? container.kind : TypeScript.PullElementKind.None;
			var needSemicolon: boolean = false;

			if (funcDecl.isConstructor) {
				this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(this.thisClassNode),
					Emitter.joinJSDocComments(Emitter.getUserComments(funcDecl), this.getJSDocForFunctionDeclaration(funcDecl))));
				this.emitFullSymbolVariableStatement(this.getSymbolForAST(this.thisClassNode));
				this.writeToOutput(' = ');
				needSemicolon = true;
			}

			else if (printName && !isFunctionExpression) {
				var id = funcDecl.getNameText();
				if (id && !funcDecl.isAccessor()) {
					this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(funcDecl), this.getJSDocForFunctionDeclaration(funcDecl)));
					this.emitFullSymbolVariableStatement(this.getSymbolForAST(funcDecl));
					this.writeToOutput(' = ');
					needSemicolon = true;
				}
			}

			if (!(funcDecl.isAccessor() && containerKind !== TypeScript.PullElementKind.Class && containerKind !== TypeScript.PullElementKind.ConstructorType)) {
				this.writeToOutput("function ");
			}

			if (printName && isFunctionExpression) {
				var id = funcDecl.getNameText();
				if (id && !funcDecl.isAccessor()) {
					this.writeToOutput(id);
				}
			}

			this.writeToOutput("(");
			//if (funcDecl.arguments) {
			//	this.emitComments(funcDecl.arguments, true);
			//	this.getFunctionDeclarationSignature(funcDecl).parameters.forEach((symbol, i) => {
			//		if (i > 0) this.writeToOutput(', ');
			//		this.writeToOutput(symbol.isVarArg ? Emitter.mangleVarArgSymbolName(symbol) : Emitter.mangleSymbolName(symbol));
			//	});
			//	this.emitComments(funcDecl.arguments, false);
			//}
			var argsLen = 0;
			if (funcDecl.arguments) {
				this.emitComments(funcDecl.arguments, true);

				var tempContainer = this.setContainer(EmitContainer.Args);
				argsLen = funcDecl.arguments.members.length;
				var printLen = argsLen;
				if (funcDecl.variableArgList) {
					printLen--;
				}
				for (var i = 0; i < printLen; i++) {
					var arg = <Parameter>funcDecl.arguments.members[i];
					//arg.emit(this);
					this.writeToOutput(arg.id.actualText);
					//this.writeToOutput(symbol.isVarArg ? Emitter.mangleVarArgSymbolName(symbol) : Emitter.mangleSymbolName(symbol));
					if (i < (printLen - 1)) {
						this.writeToOutput(", ");
					}
				}

				if (funcDecl.variableArgList) {
					var arg = <Parameter>funcDecl.arguments.members[printLen];
					if (printLen > 0) {
						this.writeToOutput(", ");
					}
					this.writeToOutput(arg.id.actualText + '$rest');
				}

				this.setContainer(tempContainer);

				this.emitComments(funcDecl.arguments, false);
			}
			this.writeLineToOutput(") {");

			if (funcDecl.isConstructor) {
				this.recordSourceMappingNameStart("constructor");
			} else if (funcDecl.isGetAccessor()) {
				this.recordSourceMappingNameStart("get_" + funcDecl.getNameText());
			} else if (funcDecl.isSetAccessor()) {
				this.recordSourceMappingNameStart("set_" + funcDecl.getNameText());
			} else {
				this.recordSourceMappingNameStart(funcDecl.getNameText());
			}
			this.indenter.increaseIndent();

			if (funcDecl.block !== null) {
				this.emitDefaultValueAssignments(funcDecl);
				this.emitRestParameterInitializer(funcDecl);

				if (this.shouldCaptureThis(funcDecl)) {
					this.writeCaptureThisStatement(funcDecl);
				}

				if (funcDecl.isConstructor) {
					this.emitConstructorStatements(funcDecl);
				}
				else {
					this.emitModuleElements(funcDecl.block.statements);
				}

				this.emitCommentsArray(funcDecl.block.closeBraceLeadingComments);
			}

			this.indenter.decreaseIndent();
			this.emitIndent();
			if (funcDecl.block !== null) {
				this.recordSourceMappingStart(funcDecl.block.closeBraceSpan);
			}
			this.writeToOutput("}");

			this.recordSourceMappingNameEnd();
			if (funcDecl.block !== null) {
				this.recordSourceMappingEnd(funcDecl.block.closeBraceSpan);
			}
			this.recordSourceMappingEnd(funcDecl);

			if (shouldParenthesize) {
				this.writeToOutput(")");
			}
			if (needSemicolon) {
				this.writeToOutput(';');
			}

			// The extra call is to make sure the caller's funcDecl end is recorded, since caller won't be able to record it
			this.recordSourceMappingEnd(funcDecl);

			this.emitComments(funcDecl, false);
		}

		private emitDefaultValueAssignments(funcDecl: FunctionDeclaration) {
			var parameters = this.getFunctionDeclarationSignature(funcDecl).parameters;
			var n = funcDecl.arguments.members.length;
			if (funcDecl.variableArgList) {
				n--;
			}

			for (var i = 0; i < n; i++) {
				var arg = <Parameter>funcDecl.arguments.members[i];
				if (arg.init) {
					var mangled: string = Emitter.mangleSymbolName(parameters[i]);
					this.emitIndent();
					this.recordSourceMappingStart(arg);
					this.writeToOutput("if (typeof " + mangled + " === \"undefined\") ");
					this.recordSourceMappingStart(arg.id);
					this.writeToOutput(mangled);
					this.recordSourceMappingEnd(arg.id);
					this.writeToOutput(" = ");
					this.emitJavascript(arg.init, false);
					this.writeLineToOutput(";");
					this.recordSourceMappingEnd(arg);
				}
			}
		}

		private emitRestParameterInitializer(funcDecl: FunctionDeclaration) {
			if (funcDecl.variableArgList) {
				var n = funcDecl.arguments.members.length;
				var lastArg = <Parameter>funcDecl.arguments.members[n - 1];
				var symbol: PullSymbol = this.getSymbolForAST(lastArg);
				this.emitIndent();
				this.recordSourceMappingStart(lastArg);
				this.emitInlineJSDocComment(Emitter.EMPTY_STRING_LIST, Emitter.getJSDocForType(symbol.type));
				this.writeToOutput("var ");
				this.recordSourceMappingStart(lastArg.id);
				this.writeToOutput(Emitter.mangleSymbolName(symbol));
				this.recordSourceMappingEnd(lastArg.id);
				this.writeLineToOutput(" = [];");
				this.recordSourceMappingEnd(lastArg);
				this.emitIndent();
				this.writeToOutput("for (");
				this.recordSourceMappingStart(lastArg);
				this.writeToOutput("var _i = 0;");
				this.recordSourceMappingEnd(lastArg);
				this.writeToOutput(" ");
				this.recordSourceMappingStart(lastArg);
				this.writeToOutput("_i < arguments.length" + (n !== 1 ? ' - ' + (n - 1) : ''));
				this.recordSourceMappingEnd(lastArg);
				this.writeToOutput("; ");
				this.recordSourceMappingStart(lastArg);
				this.writeToOutput("_i++");
				this.recordSourceMappingEnd(lastArg);
				this.writeLineToOutput(") {");
				this.indenter.increaseIndent();
				this.emitIndent();

				this.recordSourceMappingStart(lastArg);
				this.writeToOutput(Emitter.mangleSymbolName(symbol) + "[_i] = arguments[_i" + (n !== 1 ? ' + ' + (n - 1) : '') + "];");
				this.recordSourceMappingEnd(lastArg);
				this.writeLineToOutput("");
				this.indenter.decreaseIndent();
				this.emitIndent();
				this.writeLineToOutput("}");
			}
		}

		public shouldCaptureThis(ast: AST) {
			var decl = this.getDeclForAST(ast);
			if (decl) {
				return (decl.flags & TypeScript.PullElementFlags.MustCaptureThis) === TypeScript.PullElementFlags.MustCaptureThis;
			}

			return false;
		}

		private _emitForExportEnum: boolean = false;

		public emitModule(moduleDecl: ModuleDeclaration) {
			var pullDecl = this.getDeclForAST(moduleDecl);

			var moduleName = moduleDecl.name.actualText;
			if (TypeScript.isTSFile(moduleName)) {
				moduleName = moduleName.substring(0, moduleName.length - ".ts".length);
			}

			var isDynamicMod = TypeScript.hasFlag(moduleDecl.getModuleFlags(), TypeScript.ModuleFlags.IsDynamic);
			var prevOutFile = this.outfile;
			var prevOutFileName = this.emittingFileName;
			var prevAllSourceMappers = this.allSourceMappers;
			var prevSourceMapper = this.sourceMapper;
			var prevColumn = this.emitState.column;
			var prevLine = this.emitState.line;
			var temp = this.setContainer(EmitContainer.Module);
			var isExported = TypeScript.hasFlag(pullDecl.flags, TypeScript.PullElementFlags.Exported);
			var isWholeFile = TypeScript.hasFlag(moduleDecl.getModuleFlags(), TypeScript.ModuleFlags.IsWholeFile);

			this.recordSourceMappingStart(moduleDecl);

			// Enum
			if (pullDecl.kind === TypeScript.PullElementKind.Enum) {
				this._emitForExportEnum = isExported;

				var startLine = true;
				this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(moduleDecl), Emitter.getJSDocForEnumDeclaration(moduleDecl)));
				this.emitFullSymbolVariableStatement(this.getSymbolForAST(moduleDecl));
				this.writeLineToOutput(' = {');
				this.indenter.increaseIndent();
				this.emitCommaSeparatedList(moduleDecl.members, startLine);
				this.indenter.decreaseIndent();
				this.emitIndent();
				this.writeToOutput('};');

				if (isExported) {
					this.exportSymbol(this.getSymbolForAST(moduleDecl));
				}

				this._emitForExportEnum = false;
			}

			// Module
			else {
				var symbol: PullSymbol = this.getSymbolForAST(moduleDecl);
				var name: string = Emitter.getFullSymbolName(symbol);

				// Only initialize a module once
				var skipFirstLine = true;
				if (this.emittedModuleNames.indexOf(name) < 0) {
					this.emitJSDocComment(Emitter.getUserComments(moduleDecl));
					this.emitFullSymbolVariableStatement(symbol);
					this.writeToOutput(' = {};');
					this.emittedModuleNames.push(name);
					this.exportSymbol(symbol);
					skipFirstLine = false;
				}

				if (!isWholeFile) this.recordSourceMappingNameStart(moduleName);
				this.emitModuleElements(moduleDecl.members, /* isModule: */ true, skipFirstLine);
				if (!isWholeFile) this.recordSourceMappingNameEnd();
			}

			this.recordSourceMappingEnd(moduleDecl);
			this.setContainer(temp);
		}

		public emitEnumElement(varDecl: VariableDeclarator) {
			this.emitComments(varDecl, true);
			this.recordSourceMappingStart(varDecl);
			if (this._emitForExportEnum) {
				this.writeToOutput("\"" + Emitter.mangleSymbolName(this.getSymbolForAST(varDecl)) + '\": ');
			}
			else {
				this.writeToOutput(Emitter.mangleSymbolName(this.getSymbolForAST(varDecl)) + ': ');
			}

			if (varDecl.init !== null) {
				varDecl.init.emit(this);
			}
			else if (varDecl.constantValue !== null) {
				this.writeToOutput(varDecl.constantValue.toString());
			}
			else {
				this.writeToOutput("null");
			}

			this.recordSourceMappingEnd(varDecl);
			this.emitComments(varDecl, false);
		}

		public emitIndex(operand1: AST, operand2: AST) {
			operand1.emit(this);
			this.writeToOutput("[");
			operand2.emit(this);
			this.writeToOutput("]");
		}

		public emitFunction(funcDecl: FunctionDeclaration) {
			if (TypeScript.hasFlag(funcDecl.getFunctionFlags(), TypeScript.FunctionFlags.Signature) /*|| funcDecl.isOverload*/) {
				return;
			}
			var temp: number;
			var tempFnc = this.thisFunctionDeclaration;
			this.thisFunctionDeclaration = funcDecl;

			if (funcDecl.isConstructor) {
				temp = this.setContainer(EmitContainer.Constructor);
			}
			else {
				temp = this.setContainer(EmitContainer.Function);
			}

			var funcName = funcDecl.getNameText();

			if (temp !== EmitContainer.Constructor || (funcDecl.getFunctionFlags() & TypeScript.FunctionFlags.Method) === TypeScript.FunctionFlags.None) {
				var isFunctionExpression = TypeScript.hasFlag(funcDecl.getFunctionFlags(), TypeScript.FunctionFlags.IsFunctionExpression);
				this.recordSourceMappingStart(funcDecl);
				this.emitInnerFunction(funcDecl, funcDecl.name && !funcDecl.name.isMissing(), /* includePreComments: */ false, isFunctionExpression);
			}
			this.setContainer(temp);
			this.thisFunctionDeclaration = tempFnc;

			var symbol = this.getSymbolForAST(funcDecl);

			if (TypeScript.hasFlag(funcDecl.getFunctionFlags(), TypeScript.FunctionFlags.Exported)) {
				this.exportSymbol(symbol);
			}
		}

		public emitAmbientVarDecl(varDecl: VariableDeclarator) {
			if (varDecl.init) {
				this.emitComments(varDecl, true);
				this.recordSourceMappingStart(varDecl);
				this.recordSourceMappingStart(varDecl.id);
				this.writeToOutput(varDecl.id.actualText);
				this.recordSourceMappingEnd(varDecl.id);
				this.writeToOutput(" = ");
				this.emitJavascript(varDecl.init, false);
				this.recordSourceMappingEnd(varDecl);
				this.emitComments(varDecl, false);
			}
		}

		public emitVariableDeclaration(declaration: VariableDeclaration) {
			for (var i = 0, n = declaration.declarators.members.length; i < n; i++) {
				if (i > 0) {
					this.writeLineToOutput('');
					this.emitIndent();
				}
				declaration.declarators.members[i].emit(this);
			}
		}

		public emitVariableDeclarator(varDecl: VariableDeclarator) {
			var symbol = this.getSymbolForAST(varDecl);
			var parentSymbol = symbol ? symbol.getContainer() : null;
			var parentKind = parentSymbol ? parentSymbol.kind : TypeScript.PullElementKind.None;
			var hasInitializer = varDecl.init !== null;

			var isExported = TypeScript.hasFlag(varDecl.getVarFlags(), TypeScript.VariableFlags.Exported);

			// Google's Closure Compiler requires one variable statement per function.
			// Note that "emittedSymbolNames" is a hack since I don't think the compiler
			// actually stores any information about aliases so I can't tell them apart.
			if (symbol !== null) {
				var id = parentSymbol !== null ? parentSymbol.pullSymbolID : -1;
				var names = this.emittedSymbolNames[id] || [];
				var isAdditionalDeclaration = names.indexOf(symbol.name) >= 0;
				this.emittedSymbolNames[id] = names.concat(symbol.name);
				if (isAdditionalDeclaration && !hasInitializer) {
					return;
				}
			}

			if (!isAdditionalDeclaration) {
				var jsDocComments: string[] = this.getJSDocForVariableDeclaration(varDecl);
				if (parentKind === TypeScript.PullElementKind.Class &&
					this.emitState.container !== EmitContainer.Args) {
					if (TypeScript.hasFlag(varDecl.getVarFlags(), TypeScript.VariableFlags.Public)) {
						jsDocComments.push("@expose");
					}

					if (TypeScript.hasFlag(varDecl.getVarFlags(), TypeScript.VariableFlags.Protected)) {
						jsDocComments.push("@protected");
					}
					else if (TypeScript.hasFlag(varDecl.getVarFlags(), TypeScript.VariableFlags.Private)) {
						jsDocComments.push("@private");
					}
				}

				//if (isExported && !symbol.type.isFunction()) {
				//	jsDocComments.push("@expose");
				//}

				this.emitInlineJSDocComment(Emitter.getUserComments(varDecl), jsDocComments);
			}
			this.recordSourceMappingStart(varDecl);

			if (parentKind === TypeScript.PullElementKind.Class) {
				if (this.emitState.container !== EmitContainer.Args) {
					this.writeToOutput("this.");
				}

				this.recordSourceMappingStart(varDecl.id);
				this.writeToOutput(Emitter.mangleSymbolName(this.getSymbolForAST(varDecl)));
				this.recordSourceMappingEnd(varDecl.id);
			} else if (!isAdditionalDeclaration) {
				this.emitFullSymbolVariableStatement(symbol);
			} else {
				this.writeToOutput(Emitter.getFullSymbolName(symbol));
			}

			if (hasInitializer) {
				this.writeToOutputTrimmable(" = ");
				varDecl.init.emit(this);
			}

			this.recordSourceMappingEnd(varDecl);
			this.writeToOutput(';');

			if (!isAdditionalDeclaration && isExported/* && symbol.type.isFunction()*/) {
				this.exportSymbol(symbol);
			}
		}

		public emitName(name: Identifier, isNotMemberAccess: boolean) {
			this.emitComments(name, true);
			this.recordSourceMappingStart(name);

			if (!name.isMissing()) {
				var pullSymbol = this.getSymbolForAST(name);
				if (pullSymbol === null || pullSymbol.isError() || name.text() === 'prototype') {
					// This is caused by PullTypeResolver.resolveNameExpression avoiding
					// names with the any type and happens when referencing the symbol
					// for a try/catch statement among other things
					this.writeToOutput(name.text());
				} else if (isNotMemberAccess) {
					this.writeToOutput(Emitter.getFullSymbolName(pullSymbol));
				} else {
					this.writeToOutput(Emitter.mangleSymbolName(pullSymbol));
				}
			}

			this.recordSourceMappingEnd(name);
			this.emitComments(name, false);
		}

		public recordSourceMappingNameStart(name: string) {
			if (this.sourceMapper) {
				var finalName = name;
				if (!name) {
					finalName = "";
				} else if (this.sourceMapper.currentNameIndex.length > 0) {
					finalName = this.sourceMapper.names[this.sourceMapper.currentNameIndex[this.sourceMapper.currentNameIndex.length - 1]] + "." + name;
				}

				// We are currently not looking for duplicate but that is possible.
				this.sourceMapper.names.push(finalName);
				this.sourceMapper.currentNameIndex.push(this.sourceMapper.names.length - 1);
			}
		}

		public recordSourceMappingNameEnd() {
			if (this.sourceMapper) {
				this.sourceMapper.currentNameIndex.pop();
			}
		}

		public recordSourceMappingStart(ast: IASTSpan) {
			if (this.sourceMapper && TypeScript.isValidAstNode(ast)) {
				var lineCol = { line: -1, character: -1 };
				var sourceMapping = new TypeScript.SourceMapping();
				sourceMapping.start.emittedColumn = this.emitState.column;
				sourceMapping.start.emittedLine = this.emitState.line;
				// REVIEW: check time consumed by this binary search (about two per leaf statement)
				var lineMap = this.document.lineMap;
				lineMap.fillLineAndCharacterFromPosition(ast.minChar, lineCol);
				sourceMapping.start.sourceColumn = lineCol.character;
				sourceMapping.start.sourceLine = lineCol.line + 1;
				lineMap.fillLineAndCharacterFromPosition(ast.limChar, lineCol);
				sourceMapping.end.sourceColumn = lineCol.character;
				sourceMapping.end.sourceLine = lineCol.line + 1;
				if (this.sourceMapper.currentNameIndex.length > 0) {
					sourceMapping.nameIndex = this.sourceMapper.currentNameIndex[this.sourceMapper.currentNameIndex.length - 1];
				}
				// Set parent and child relationship
				var siblings = this.sourceMapper.currentMappings[this.sourceMapper.currentMappings.length - 1];
				siblings.push(sourceMapping);
				this.sourceMapper.currentMappings.push(sourceMapping.childMappings);
			}
		}

		public recordSourceMappingEnd(ast: IASTSpan) {
			if (this.sourceMapper && TypeScript.isValidAstNode(ast)) {
				// Pop source mapping childs
				this.sourceMapper.currentMappings.pop();

				// Get the last source mapping from sibling list = which is the one we are recording end for
				var siblings = this.sourceMapper.currentMappings[this.sourceMapper.currentMappings.length - 1];
				var sourceMapping = siblings[siblings.length - 1];

				sourceMapping.end.emittedColumn = this.emitState.column;
				sourceMapping.end.emittedLine = this.emitState.line;
			}
		}

		// Note: may throw exception.
		public emitSourceMapsAndClose() {
			// Output a source mapping.  As long as we haven't gotten any errors yet.
			if (this.sourceMapper !== null) {
				TypeScript.SourceMapper.emitSourceMapping(this.allSourceMappers);
			}

			try {
				this.outfile.Close();
			}
			catch (e) {
				Emitter.throwEmitterError(e);
			}
		}

		private emitParameterPropertyAndMemberVariableAssignments() {
			// emit any parameter properties first
			var constructorDecl: FunctionDeclaration = this.thisClassNode.constructorDecl;

			if (constructorDecl && constructorDecl.arguments) {
				var parameters = this.getFunctionDeclarationSignature(constructorDecl).parameters;
				for (var i = 0, n = constructorDecl.arguments.members.length; i < n; i++) {
					var arg = <BoundDecl>constructorDecl.arguments.members[i];
					if ((arg.getVarFlags() & TypeScript.VariableFlags.Property) !== TypeScript.VariableFlags.None) {
						var memberSymbol: PullSymbol = this.getSymbolForAST(arg);
						var argumentSymbol: PullSymbol = parameters[i];
						this.emitIndent();
						this.recordSourceMappingStart(arg);
						this.recordSourceMappingStart(arg.id);

						var jsDocComments: string[] = Emitter.getJSDocForType(memberSymbol.type);
						if (TypeScript.hasFlag(arg.getVarFlags(), TypeScript.VariableFlags.Public)) {
							jsDocComments.push("@expose");
						}

						if (TypeScript.hasFlag(arg.getVarFlags(), TypeScript.VariableFlags.Protected)) {
							jsDocComments.push("@protected");
						}
						else if (TypeScript.hasFlag(arg.getVarFlags(), TypeScript.VariableFlags.Private)) {
							jsDocComments.push("@private");
						}

						this.emitInlineJSDocComment(Emitter.getUserComments(arg), jsDocComments);
						this.writeToOutput("this." + Emitter.mangleSymbolName(memberSymbol));

						this.recordSourceMappingEnd(arg.id);
						this.writeToOutput(" = ");
						this.recordSourceMappingStart(arg.id);
						this.writeToOutput(Emitter.mangleSymbolName(argumentSymbol));
						this.recordSourceMappingEnd(arg.id);
						this.writeLineToOutput(";");
						this.recordSourceMappingEnd(arg);
					}
				}
			}

			for (var i = 0, n = this.thisClassNode.members.members.length; i < n; i++) {
				if (this.thisClassNode.members.members[i].nodeType() === TypeScript.NodeType.VariableDeclarator) {
					var varDecl = <VariableDeclarator>this.thisClassNode.members.members[i];
					if (!TypeScript.hasFlag(varDecl.getVarFlags(), TypeScript.VariableFlags.Static)) {
						this.emitIndent();
						this.emitVariableDeclarator(varDecl);
						this.writeLineToOutput("");
					}
				}
			}
		}

		public emitCommaSeparatedList(list: ASTList, startLine: boolean = false) {
			if (list === null) {
				return;
			}
			else {
				// this.emitComments(ast, true);
				// this.emitComments(ast, false);

				for (var i = 0, n = list.members.length; i < n; i++) {
					var emitNode = list.members[i];
					this.emitJavascript(emitNode, startLine);

					if (i < (n - 1)) {
						this.writeToOutput(startLine ? "," : ", ");
					}

					if (startLine) {
						this.writeLineToOutput("");
					}
				}
			}
		}

		public emitModuleElements(list: ASTList, isModule = false, skipFirstLine = false) {
			if (list === null) {
				return;
			}

			this.emitComments(list, true);
			var lastEmittedNode: AST = null;
			var isFirstLine = true;

			for (var i = 0, n = list.members.length; i < n; i++) {
				var node = list.members[i];

				if (node.shouldEmit()) {
					if (isModule) {
						if (isFirstLine && !skipFirstLine) this.writeLineToOutput('');
						if (skipFirstLine) skipFirstLine = false;
						else this.writeLineToOutput('');
						isFirstLine = false;
					}

					this.emitSpaceBetweenConstructs(lastEmittedNode, node);
					this.emitJavascript(node, true);

					if (!isModule) {
						this.writeLineToOutput('');
					}

					lastEmittedNode = node;
				}
			}

			this.emitComments(list, false);
		}

		private isDirectivePrologueElement(node: AST) {
			if (node.nodeType() === TypeScript.NodeType.ExpressionStatement) {
				var exprStatement = <ExpressionStatement>node;
				return exprStatement.expression.nodeType() === TypeScript.NodeType.StringLiteral;
			}

			return false;
		}

		// If these two constructs had more than one line between them originally, then emit at
		// least one blank line between them.
		public emitSpaceBetweenConstructs(node1: AST, node2: AST) {
			if (node1 === null || node2 === null) {
				return;
			}

			if (node1.minChar === -1 || node1.limChar === -1 || node2.minChar === -1 || node2.limChar === -1) {
				return;
			}

			var lineMap = this.document.lineMap;
			var node1EndLine = lineMap.getLineNumberFromPosition(node1.limChar);
			var node2StartLine = lineMap.getLineNumberFromPosition(node2.minChar);

			if ((node2StartLine - node1EndLine) > 1) {
				this.writeLineToOutput("");
			}
		}

		// We consider a sequence of comments to be a copyright header if there are no blank lines
		// between them, and there is a blank line after the last one and the node they're attached
		// to.
		private getCopyrightComments(): Comment[] {
			var preComments = this.copyrightElement.preComments();
			if (preComments) {
				var lineMap = this.document.lineMap;

				var copyrightComments: Comment[] = [];
				var lastComment: Comment = null;

				for (var i = 0, n = preComments.length; i < n; i++) {
					var comment = preComments[i];

					if (lastComment) {
						var lastCommentLine = lineMap.getLineNumberFromPosition(lastComment.limChar);
						var commentLine = lineMap.getLineNumberFromPosition(comment.minChar);

						if (commentLine >= lastCommentLine + 2) {
							// There was a blank line between the last comment and this comment.  This
							// comment is not part of the copyright comments.  Return what we have so
							// far.
							return copyrightComments;
						}
					}

					copyrightComments.push(comment);
					lastComment = comment;
				}

				// All comments look like they could have been part of the copyright header.  Make
				// sure there is at least one blank line between it and the node.  If not, it's not
				// a copyright header.
				var lastCommentLine = lineMap.getLineNumberFromPosition(TypeScript.ArrayUtilities.last(copyrightComments).limChar);
				var astLine = lineMap.getLineNumberFromPosition(this.copyrightElement.minChar);
				if (astLine >= lastCommentLine + 2) {
					return copyrightComments;
				}
			}

			// No usable copyright comments found.
			return [];
		}

		private emitPossibleCopyrightHeaders(script: Script) {
			var list = script.moduleElements;
			if (list.members.length > 0) {
				var firstElement = list.members[0];
				if (firstElement.nodeType() === TypeScript.NodeType.ModuleDeclaration) {
					var moduleDeclaration = <ModuleDeclaration>firstElement;
					if (moduleDeclaration.isWholeFile()) {
						firstElement = moduleDeclaration.members.members[0];
					}
				}

				this.copyrightElement = firstElement;
				this.emitCommentsArray(this.getCopyrightComments());
			}
		}

		private _emitGlobal: boolean = true;

		public emitScriptElements(script: Script) {
			var list = script.moduleElements;

			this.emitPossibleCopyrightHeaders(script);
			if (this._emitGlobal) {
				this.writeLineToOutput("var global=this;");
				this._emitGlobal = false;
			}
			// First, emit all the prologue elements.
			for (var i = 0, n = list.members.length; i < n; i++) {
				var node = list.members[i];

				if (!this.isDirectivePrologueElement(node)) {
					break;
				}

				this.emitJavascript(node, true);
				this.writeLineToOutput("");
			}

			// Now emit __extends or a _this capture if necessary.
			this.emitPrologue(script);
			var lastEmittedNode: AST = null;

			// Now emit the rest of the script elements
			for (; i < n; i++) {
				var node = list.members[i];

				if (node.shouldEmit()) {
					this.emitSpaceBetweenConstructs(lastEmittedNode, node);

					this.emitJavascript(node, true);
					this.writeLineToOutput("");

					lastEmittedNode = node;
				}
			}
		}

		public emitConstructorStatements(funcDecl: FunctionDeclaration) {
			var list = funcDecl.block.statements;

			if (list === null) {
				return;
			}

			this.emitComments(list, true);

			var emitPropertyAssignmentsAfterSuperCall = this.thisClassNode.extendsList && this.thisClassNode.extendsList.members.length > 0;
			var propertyAssignmentIndex = emitPropertyAssignmentsAfterSuperCall ? 1 : 0;
			var lastEmittedNode: AST = null;

			for (var i = 0, n = list.members.length; i < n; i++) {
				// In some circumstances, class property initializers must be emitted immediately after the 'super' constructor
				// call which, in these cases, must be the first statement in the constructor body
				if (i === propertyAssignmentIndex) {
					this.emitParameterPropertyAndMemberVariableAssignments();
				}

				var node = list.members[i];

				if (node.shouldEmit()) {
					this.emitSpaceBetweenConstructs(lastEmittedNode, node);

					this.emitJavascript(node, true);
					this.writeLineToOutput("");

					lastEmittedNode = node;
				}
			}

			if (i === propertyAssignmentIndex) {
				this.emitParameterPropertyAndMemberVariableAssignments();
			}

			this.emitComments(list, false);
		}

		// tokenId is the id the preceding token
		public emitJavascript(ast: AST, startLine: boolean) {
			if (ast === null) {
				return;
			}

			if (startLine &&
				this.indenter.indentAmt > 0) {
				this.emitIndent();
			}

			ast.emit(this);
		}

		public emitPropertyAccessor(funcDecl: FunctionDeclaration, className: string, isProto: boolean) {
			if (!TypeScript.hasFlag(funcDecl.getFunctionFlags(), TypeScript.FunctionFlags.GetAccessor)) {
				var accessorSymbol = TypeScript.PullHelpers.getAccessorSymbol(funcDecl, this.semanticInfoChain, this.document.fileName);
				if (accessorSymbol.getGetter()) {
					return;
				}
			}

			this.emitIndent();
			this.recordSourceMappingStart(funcDecl);
			this.writeLineToOutput("Object.defineProperty(" + className + (isProto ? ".prototype, \"" : ", \"") + funcDecl.name.actualText + "\"" + ", {");
			this.indenter.increaseIndent();

			var accessors = TypeScript.PullHelpers.getGetterAndSetterFunction(funcDecl, this.semanticInfoChain, this.document.fileName);
			if (accessors.getter) {
				this.emitIndent();
				this.recordSourceMappingStart(accessors.getter);
				this.writeToOutput("get: ");
				this.emitInnerFunction(accessors.getter, false);
				this.writeLineToOutput(",");
			}

			if (accessors.setter) {
				this.emitIndent();
				this.recordSourceMappingStart(accessors.setter);
				this.writeToOutput("set: ");
				this.emitInnerFunction(accessors.setter, false);
				this.writeLineToOutput(",");
			}

			this.emitIndent();
			this.writeLineToOutput("enumerable: true,");
			this.emitIndent();
			this.writeLineToOutput("configurable: true");
			this.indenter.decreaseIndent();
			this.emitIndent();
			this.writeLineToOutput("});");
			this.recordSourceMappingEnd(funcDecl);
		}

		public emitPrototypeMember(funcDecl: FunctionDeclaration, classSymbol: PullSymbol) {
			if (funcDecl.isAccessor()) {
				this.emitPropertyAccessor(funcDecl, classSymbol.name, true);
			}
			else if (classSymbol.isInterface()) {
				return;
			}
			else {
				this.emitIndent();
				this.recordSourceMappingStart(funcDecl);

				var jsDocComments: string[] = [];

				var isFinalClass: boolean = TypeScript.hasFlag((<BoundDecl>classSymbol.ast).getVarFlags(), TypeScript.VariableFlags.Final);
				var isFinalMethod: boolean = TypeScript.hasFlag(funcDecl.getFunctionFlags(), TypeScript.FunctionFlags.Final);
				var isNeedExport: boolean = classSymbol.hasFlag(TypeScript.PullElementFlags.Exported) && TypeScript.hasFlag(funcDecl.getFunctionFlags(), TypeScript.FunctionFlags.Public);

				if (!isFinalClass && !isFinalMethod && isNeedExport) {
					jsDocComments.push("@expose");
				}
				else if (isFinalMethod) {
					jsDocComments.push("@final");
				}

				if (funcDecl.symbol.type.getCallSignatures().length > 1) {
					jsDocComments.push("@type {" + Emitter.formatJSDocType(funcDecl.symbol.type) + "}");
					this.emitJSDocComment(jsDocComments);
				}
				else {
					jsDocComments = jsDocComments.concat(this.getJSDocForFunctionDeclaration(funcDecl));
					this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(funcDecl), jsDocComments));
				}

				var sFunctionMangleName: string = Emitter.mangleSymbolName(this.getSymbolForAST(funcDecl));
				var sClassName: string = Emitter.getFullSymbolName(classSymbol);
				this.writeToOutput(sClassName + ".prototype." + sFunctionMangleName + " = ");

				var tempFnc = this.thisFunctionDeclaration;
				this.thisFunctionDeclaration = funcDecl;
				this.emitInnerFunction(funcDecl, /*printName:*/ false, /*includePreComments:*/ false);
				this.thisFunctionDeclaration = tempFnc;

				this.writeToOutput(";");

				if (isNeedExport && (isFinalClass || isFinalMethod)) {
					this.writeLineToOutput('');
					this.emitIndent();
					this.writeToOutput(sClassName + "['prototype']['" + sFunctionMangleName + "']=" + sClassName + ".prototype." + sFunctionMangleName + ";");
				}
			}
		}

		public emitClass(classDecl: ClassDeclaration) {
			var pullDecl = this.getDeclForAST(classDecl);

			var svClassNode = this.thisClassNode;
			var svBaseName = this.thisBaseName;
			this.thisClassNode = classDecl;
			this.thisBaseName = null;
			var temp = this.setContainer(EmitContainer.Class);

			this.recordSourceMappingStart(classDecl);

			var hasBaseClass = classDecl.extendsList && classDecl.extendsList.members.length;
			var baseNameDecl: AST = null;
			var baseName: AST = null;
			var varDecl: VariableDeclarator = null;

			if (hasBaseClass) {
				baseNameDecl = classDecl.extendsList.members[0];
				baseName = baseNameDecl.nodeType() === TypeScript.NodeType.InvocationExpression ? (<InvocationExpression>baseNameDecl).target : baseNameDecl;
				this.thisBaseName = Emitter.getFullSymbolName(this.getSymbolForAST(baseName));
			}

			var constrDecl = classDecl.constructorDecl;

			// output constructor
			if (constrDecl) {
				// declared constructor
				constrDecl.emit(this);
			}
			else {
				this.recordSourceMappingStart(classDecl);
				// default constructor
				this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(classDecl), this.getJSDocForConstructor(classDecl)));
				this.indenter.increaseIndent();
				this.emitFullSymbolVariableStatement(this.getSymbolForAST(classDecl));
				this.writeLineToOutput(" = function () {");
				this.recordSourceMappingNameStart("constructor");
				if (hasBaseClass) {
					this.emitIndent();
					this.writeLineToOutput(this.thisBaseName + ".apply(this, arguments);");
				}

				if (this.shouldCaptureThis(classDecl)) {
					this.writeCaptureThisStatement(classDecl);
				}

				this.emitParameterPropertyAndMemberVariableAssignments();

				this.indenter.decreaseIndent();
				this.emitIndent();
				this.writeToOutput("};");

				this.recordSourceMappingNameEnd();
				this.recordSourceMappingEnd(classDecl);
			}

			if (hasBaseClass) {
				this.writeLineToOutput("");
				this.writeLineToOutput("");
				this.emitIndent();
				this.writeToOutput("__extends(" + Emitter.getFullSymbolName(this.getSymbolForAST(classDecl)) + ", " + this.thisBaseName + ");");
			}

			this.emitClassMembers(classDecl);
			this.recordSourceMappingEnd(classDecl);
			this.emitComments(classDecl, false);

			this.setContainer(temp);
			this.thisClassNode = svClassNode;
			this.thisBaseName = svBaseName;

			// Count a class as emitting a module because of declaration merging
			var name: string = Emitter.getFullSymbolName(this.getSymbolForAST(classDecl));
			if (this.emittedModuleNames.indexOf(name) < 0) {
				this.emittedModuleNames.push(name);
				this.exportSymbol(this.getSymbolForAST(classDecl));
			}
		}

		private emitClassMembers(classDecl: ClassDeclaration) {
			// First, emit all the functions.
			var lastEmittedMember: AST = null;
			var isFirstLine = true;

			for (var i = 0, n = classDecl.members.members.length; i < n; i++) {
				var memberDecl = classDecl.members.members[i];

				if (memberDecl.nodeType() === TypeScript.NodeType.FunctionDeclaration) {
					var fn = <FunctionDeclaration>memberDecl;

					if (hasFlag(fn.getFunctionFlags(), FunctionFlags.Method) && !fn.isSignature()) {
						if (isFirstLine) {
							this.writeLineToOutput('');
							isFirstLine = false;
						}
						this.writeLineToOutput('');
						this.emitSpaceBetweenConstructs(lastEmittedMember, fn);

						if (!TypeScript.hasFlag(fn.getFunctionFlags(), TypeScript.FunctionFlags.Static)) {
							this.emitPrototypeMember(fn, this.getSymbolForAST(classDecl));
						}
						else { // static functions
							var tempFnc = this.thisFunctionDeclaration;
							this.thisFunctionDeclaration = fn;

							if (fn.isAccessor()) {
								this.emitPropertyAccessor(fn, this.thisClassNode.name.actualText, false);
							}
							else {
								this.emitIndent();
								this.recordSourceMappingStart(fn);
								this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(fn), this.getJSDocForFunctionDeclaration(fn)));
								this.emitFullSymbolVariableStatement(this.getSymbolForAST(fn));
								this.writeToOutput(' = ');
								this.emitInnerFunction(fn, /*printName:*/ false, /*includePreComments:*/ false);
								this.writeToOutput(";");

								if (TypeScript.hasFlag(fn.getFunctionFlags(), TypeScript.FunctionFlags.Public)) {
									var sFullName = Emitter.getFullSymbolName(this.getSymbolForAST(fn));
									var sExportName = sFullName.replace(/(\.\w+)$/, function (str: string) { return "['" + str.substr(1) + "']"; });
									this.writeLineToOutput("");
									this.writeToOutput(sExportName + "=" + sFullName + ";");
								}
							}

							this.thisFunctionDeclaration = tempFnc;
						}

						lastEmittedMember = fn;
					}
				}
			}

			// Reset spacing
			isFirstLine = true;
			lastEmittedMember = null;

			// Now emit all the statics.
			for (var i = 0, n = classDecl.members.members.length; i < n; i++) {
				var memberDecl = classDecl.members.members[i];

				if (memberDecl.nodeType() === TypeScript.NodeType.VariableDeclarator) {
					var varDecl = <VariableDeclarator>memberDecl;

					if (TypeScript.hasFlag(varDecl.getVarFlags(), TypeScript.VariableFlags.Static)) {
						if (isFirstLine) {
							this.writeLineToOutput('');
							isFirstLine = false;
						}
						this.writeLineToOutput('');
						this.emitSpaceBetweenConstructs(lastEmittedMember, varDecl);

						this.emitIndent();
						this.recordSourceMappingStart(varDecl);

						var jsDocComments: string[] = this.getJSDocForVariableDeclaration(varDecl);

						if (TypeScript.hasFlag(varDecl.getVarFlags(), TypeScript.VariableFlags.Public)) {
							jsDocComments.push("@expose");
						}

						this.emitInlineJSDocComment(Emitter.getUserComments(varDecl), jsDocComments);
						this.emitFullSymbolVariableStatement(this.getSymbolForAST(varDecl));

						if (varDecl.init !== null) {
							this.writeToOutput(' = ');
							varDecl.init.emit(this);
						}

						this.writeToOutput(";");
						this.recordSourceMappingEnd(varDecl);

						lastEmittedMember = varDecl;
					}
				}
			}
		}

		private requiresExtendsBlock(moduleElements: ASTList): boolean {
			for (var i = 0, n = moduleElements.members.length; i < n; i++) {
				var moduleElement = moduleElements.members[i];

				if (moduleElement.nodeType() === TypeScript.NodeType.ModuleDeclaration) {
					if (this.requiresExtendsBlock((<ModuleDeclaration>moduleElement).members)) {
						return true;
					}
				}
				else if (moduleElement.nodeType() === TypeScript.NodeType.ClassDeclaration) {
					var classDeclaration = <ClassDeclaration>moduleElement;

					if (classDeclaration.extendsList && classDeclaration.extendsList.members.length > 0) {
						return true;
					}
				}
			}

			return false;
		}

		public emitPrologue(script: Script) {
			if (!this.extendsPrologueEmitted) {
				if (this.requiresExtendsBlock(script.moduleElements)) {
					this.extendsPrologueEmitted = true;
					this.emitJSDocComment([
						'@param {Function} d',
						'@param {Function} b',
					]);
					this.writeLineToOutput("function __extends(d, b) {");
					this.writeLineToOutput("  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];");
					this.writeLineToOutput("  /** @constructor */ function __() { this.constructor = d; }");
					this.writeLineToOutput("  __.prototype = b.prototype;");
					this.writeLineToOutput("  d.prototype = new __();");
					this.writeLineToOutput("}");
					this.writeLineToOutput("");
					this.writeLineToOutput("global['__extends']=__extends;");
					this.writeLineToOutput("");
				}
			}
		}

		public emitSuperReference() {
			this.writeToOutput(this.thisBaseName + ".prototype");
		}

		public emitSuperCall(callEx: InvocationExpression): boolean {
			if (callEx.target.nodeType() === TypeScript.NodeType.MemberAccessExpression) {
				var dotNode = <BinaryExpression>callEx.target;
				if (dotNode.operand1.nodeType() === TypeScript.NodeType.SuperExpression) {
					dotNode.emit(this);
					this.writeToOutput(".call(");
					this.emitThis();
					if (callEx.arguments && callEx.arguments.members.length > 0) {
						this.writeToOutput(", ");
						this.emitCommaSeparatedList(callEx.arguments);
					}
					this.writeToOutput(")");
					return true;
				}
			}
			return false;
		}

		public emitThis() {
			if (this.thisFunctionDeclaration && !this.thisFunctionDeclaration.isMethod() && (!this.thisFunctionDeclaration.isConstructor)) {
				this.writeToOutput("_this");
			}
			else {
				this.writeToOutput("this");
			}
		}

		public emitBlockOrStatement(node: AST) {
			if (node.nodeType() === TypeScript.NodeType.Block) {
				node.emit(this);
			}
			else {
				this.writeLineToOutput("");
				this.indenter.increaseIndent();
				this.emitJavascript(node, true);
				this.indenter.decreaseIndent();
			}
		}

		public static throwEmitterError(e: Error) {
			var error: any = new Error(e.message);
			error.isEmitterError = true;
			throw error;
		}

		public static handleEmitterError(fileName: string, e: Error): Diagnostic[] {
			if ((<any>e).isEmitterError === true) {
				return [new Diagnostic(fileName, 0, 0, DiagnosticCode.Emit_Error_0, [e.message])];
			}

			throw e;
		}

		private getDeclForAST(ast: AST): PullDecl {
			return this.semanticInfoChain.getDeclForAST(ast, this.document.fileName) || null;
		}

		private getSymbolForAST(ast: AST): PullSymbol {
			var symbol: PullSymbol = this.semanticInfoChain.getSymbolForAST(ast, this.document.fileName) || null;

			// This fixes Parameter nodes
			if (symbol === null) {
				var pullDecl: PullDecl = this.getDeclForAST(ast);
				if (pullDecl !== null) symbol = pullDecl.getSymbol();
			}

			return symbol;
		}

		public emitUnaryExpression(ast: UnaryExpression, emitWorker: (emitter: Emitter) => void) {
			if (ast.nodeType() === TypeScript.NodeType.CastExpression) {
				this.emitInlineJSDocComment([], Emitter.getJSDocForType(this.getSymbolForAST(ast).type));
				this.writeToOutput('(');
				ast.operand.emit(this);
				this.writeToOutput(')');
			} else {
				emitWorker.call(ast, this);
			}
		}

		public emitVariableStatement(ast: VariableStatement) {
			if (TypeScript.hasFlag(ast.getFlags(), TypeScript.ASTFlags.EnumElement)) {
				this.emitEnumElement(<VariableDeclarator>ast.declaration.declarators.members[0]);
			} else {
				ast.declaration.emit(this);
			}
		}

		public emitInlineVariableDeclaration(ast: VariableDeclaration) {
			for (var i = 0, n = ast.declarators.members.length; i < n; i++) {
				var varDecl: VariableDeclarator = <VariableDeclarator>ast.declarators.members[i];
				var name: string = Emitter.getFullSymbolName(this.getSymbolForAST(varDecl));
				if (i > 0) this.writeToOutput(', ');
				else if (name.indexOf('.') < 0) this.writeToOutput('var ');
				this.emitComments(varDecl, true);
				this.recordSourceMappingStart(varDecl);
				this.recordSourceMappingStart(varDecl.id);
				this.writeToOutput(name);
				this.recordSourceMappingEnd(varDecl.id);
				if (varDecl.init) {
					this.writeToOutput(" = ");
					this.emitJavascript(varDecl.init, false);
				}
				this.recordSourceMappingEnd(varDecl);
				this.emitComments(varDecl, false);
			}
		}

		public emitForInStatement(ast: ForInStatement) {
			this.writeToOutput("for (");
			if (ast.lval.nodeType() === TypeScript.NodeType.VariableDeclaration) {
				this.emitInlineVariableDeclaration(<VariableDeclaration>ast.lval);
			} else {
				ast.lval.emit(this);
			}
			this.writeToOutput(" in ");
			ast.obj.emit(this);
			this.writeToOutput(")");
			this.emitBlockOrStatement(ast.body);
		}

		public emitForStatement(ast: ForStatement) {
			this.writeToOutput("for (");
			if (ast.init) {
				if (ast.init.nodeType() === TypeScript.NodeType.VariableDeclaration) {
					this.emitInlineVariableDeclaration(<VariableDeclaration>ast.init);
				} else {
					ast.init.emit(this);
				}
			}

			this.writeToOutput("; ");
			this.emitJavascript(ast.cond, false);
			this.writeToOutput(";");
			if (ast.incr) {
				this.writeToOutput(" ");
				this.emitJavascript(ast.incr, false);
			}
			this.writeToOutput(")");
			this.emitBlockOrStatement(ast.body);
		}

		public emitInterfaceDeclaration(interfaceDecl: InterfaceDeclaration) {
			// Special-case interface declarations with index or call signatures
			var symbol: PullSymbol = this.getSymbolForAST(interfaceDecl);
			var name = Emitter.getFullSymbolName(symbol);

			if (name === "String" ||
				name === "Number" ||
				name === "Array") {
				return;
			}

			if (symbol.type.getCallSignatures().length > 0 || symbol.type.getIndexSignatures().length > 0) {
				this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(interfaceDecl), Emitter.getJSDocForTypedef(symbol.type)));
				this.emitFullSymbolVariableStatement(symbol);
				this.writeToOutput(';');
				return;
			}

			this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(interfaceDecl), this.getJSDocForInterfaceDeclaration(interfaceDecl)));
			this.emitFullSymbolVariableStatement(symbol);
			this.writeLineToOutput(' = function () {');
			this.emitIndent();
			this.writeToOutput('};');
			this.emitInterfaceMembers(interfaceDecl);
		}

		private emitInterfaceMembers(interfaceDecl: InterfaceDeclaration) {
			var lastEmittedMember: AST = null;
			var isFirstLine = true;
			var alreadyEmittedMethods: string[] = [];

			for (var i = 0, n = interfaceDecl.members.members.length; i < n; i++) {
				var memberDecl = interfaceDecl.members.members[i];

				if (memberDecl.nodeType() === TypeScript.NodeType.VariableDeclarator) {
					var symbol: PullSymbol = this.getSymbolForAST(memberDecl);
					if (isFirstLine) {
						this.writeLineToOutput('');
						isFirstLine = false;
					}
					this.writeLineToOutput('');
					this.emitSpaceBetweenConstructs(lastEmittedMember, memberDecl);

					var jsDocComments: string[] = this.getJSDocForVariableDeclaration(<VariableDeclarator>memberDecl);

					if (TypeScript.hasFlag(interfaceDecl.getVarFlags(), TypeScript.VariableFlags.Exported)) {
						jsDocComments.push("@expose");
					}

					this.emitInlineJSDocComment(Emitter.getUserComments(memberDecl), jsDocComments);
					this.writeToOutput(Emitter.getFullSymbolName(this.getSymbolForAST(interfaceDecl)) + '.prototype.' + Emitter.mangleSymbolName(symbol) + ';');
					lastEmittedMember = memberDecl;
				}

				else if (memberDecl.nodeType() === TypeScript.NodeType.FunctionDeclaration) {
					if (alreadyEmittedMethods.indexOf(memberDecl.decl.name) >= 0) {
						continue;
					}
					if (isFirstLine) {
						this.writeLineToOutput('');
						isFirstLine = false;
					}
					this.writeLineToOutput('');
					this.emitSpaceBetweenConstructs(lastEmittedMember, memberDecl);
					this.emitInteraceMethodMember(<FunctionDeclaration> memberDecl, interfaceDecl);
					//this.emitPrototypeMember(<FunctionDeclaration>memberDecl, this.getSymbolForAST(interfaceDecl));
					lastEmittedMember = memberDecl;
					alreadyEmittedMethods.push(memberDecl.decl.name);
				}
			}
		}

		private emitInteraceMethodMember(method: FunctionDeclaration, interfaceDecl: InterfaceDeclaration): void {
			var type: string = "@type {" + Emitter.formatJSDocType(method.symbol.type) + "}";

			this.emitIndent();
			this.recordSourceMappingStart(method);
			if (TypeScript.hasFlag(interfaceDecl.getVarFlags(), TypeScript.VariableFlags.Exported)) {
				this.emitJSDocComment([type/*, "@expose"*/]);
			}
			else {
				this.emitJSDocComment([type]);
			}

			this.writeToOutput(Emitter.getFullSymbolName(this.getSymbolForAST(interfaceDecl)) + ".prototype." + Emitter.mangleSymbolName(this.getSymbolForAST(method)) + ";");

			//console.log(type);
		}

		private exportSymbol(symbol: PullSymbol): void {
			this.writeLineToOutput("");
			this.emitIndent();
			var path: PullDecl[] = TypeScript.getPathToDecl(symbol.getDeclarations()[0]);

			if (path.length === 2) {
				this.writeToOutput("global['" + symbol.name + "']=" + symbol.name + ";");
				return;
			}

			for (var i = path.length - 1; i > 0; i--) {
				var nextSymbol: PullSymbol = path[i - 1].getSymbol();

				// Stop before functions since symbols inside functions are
				// automatically available through regular lexical scoping
				if (nextSymbol === null || nextSymbol.kind & TypeScript.PullElementKind.SomeFunction) {
					break;
				}
			}

			var names: string[] = path.slice(i, path.length - 1).map(pullDecl => {
				return pullDecl.getSymbol().name;
			});

			var externalPath = "global['" + names.join("']['") + "']";
			var internalPath: string = names.join(".");

			this.writeToOutput(externalPath + "['" + symbol.name + "']=" + internalPath + "." + symbol.name + ";");
		}

		// Helps with type checking due to --noImplicitAny
		private static EMPTY_STRING_LIST: string[] = [];

		private static mangleVarArgSymbolName(symbol: PullSymbol): string {
			return symbol.getDisplayName() + '$rest';
		}

		private static isAmbientSymbol(symbol: PullSymbol): boolean {
			var path: PullDecl[] = TypeScript.getPathToDecl(symbol.getDeclarations()[0]);
			for (var i = 0; i < path.length; i++) {
				if (TypeScript.hasFlag(path[i].flags, TypeScript.DeclFlags.Ambient)) return true;
			}
			return false;
		}

		private static shouldMangleSymbol(symbol: PullSymbol): boolean {
			// Short-circuit if there's no compiler flag
			if (!Emitter.MANGLE_NAMES) return false;

			// Object literal properties may be numbers
			if (/^\d/.test(symbol.getDisplayName())) return false;

			// Ignore symbols not in the user's code
			var path: PullDecl[] = TypeScript.getPathToDecl(symbol.getDeclarations()[0]);
			if (path.length === 0) return false;
			var rootPath: string = path[0].name;
			if (!/\.ts$/.test(rootPath) || /\.d\.ts$/.test(rootPath)) return false;

			// Also avoid mangling names specified with the "declare" keyword
			if (Emitter.isAmbientSymbol(symbol)) return false;

			// Only mangle a symbol name if it's a property
			if (symbol.kind !== TypeScript.PullElementKind.Property && Emitter.getFullSymbolName(symbol, ShouldMangle.NO).indexOf('.') < 0) return false;

			// Finally, avoid mangling names that are used in the type of something externally visible
			if (Emitter.symbolsToAvoidMangling.indexOf(symbol) >= 0) return false;

			return true;
		}

		private static mangleSymbolName(symbol: PullSymbol): string {
			var name: string = symbol.getDisplayName();
			return Emitter.shouldMangleSymbol(symbol) ? name + '$mangled' : name;
		}

		private static getFullSymbolName(symbol: PullSymbol, shouldMangle: ShouldMangle = ShouldMangle.YES): string {
			var path: PullDecl[] = TypeScript.getPathToDecl(symbol.getDeclarations()[0]);

			// Never use the full parent path for object properties
			if (symbol.kind & TypeScript.PullElementKind.Property && !(path[path.length - 1].flags & TypeScript.PullElementFlags.Static)) {
				return shouldMangle === ShouldMangle.YES ? Emitter.mangleSymbolName(symbol) : symbol.name;
			}

			for (var i = path.length - 1; i > 0; i--) {
				var nextSymbol: PullSymbol = path[i - 1].getSymbol();

				// Stop before functions since symbols inside functions are
				// automatically available through regular lexical scoping
				if (nextSymbol === null || nextSymbol.kind & TypeScript.PullElementKind.SomeFunction) {
					break;
				}
			}

			return path.slice(i).map(pullDecl => {
				var symbol: PullSymbol = pullDecl.getSymbol();
				return symbol === null
					? 'null' // Call signatures and index signatures don't have symbols
					: shouldMangle === ShouldMangle.YES ? Emitter.mangleSymbolName(symbol) : symbol.name;
			}).join('.');
		}

		private static formatJSDocUnionType(parts: string[]): string {
			return parts.length === 1 ? parts[0] : '(' + parts.join('|') + ')';
		}

		private static formatJSDocArgumentType(arg: PullSymbol): string {
			return arg.isVarArg
				? '...[' + Emitter.stripOffArrayType(Emitter.formatJSDocType(arg.type)) + ']'
				: (Emitter.formatJSDocType(arg.type) + (arg.isOptional ? "=" : ""));
		}

		private static formatJSDocType(type: PullTypeSymbol, ignoreName: IgnoreName = IgnoreName.NO): string {
			// Google Closure Compiler's type system is not powerful enough to work
			// with type parameters, especially type parameters with constraints
			if (type.kind & TypeScript.PullElementKind.TypeParameter) {
				return '?';
			}

			// Simple types
			if (type.isNamedTypeSymbol() && ignoreName === IgnoreName.NO) {
				var name: string = Emitter.getFullSymbolName(type);
				if (name === 'any') return '?';
				if (name === 'void') return 'undefined';
				if (name === 'Boolean') return '?boolean'; // Use "Boolean" for a nullable boolean
				if (name === 'Number') return '?number'; // Use "Number" for a nullable number
				if (name === 'String') return 'string'; // Use "String" for a nullable string

				switch (name) {
					case "int":
					case "int8":
					case "int16":
					case "int32":
					case "int64":

					case "uint":
					case "uint8":
					case "uint16":
					case "uint32":
					case "uint64":

					case "float":
					case "float32":
					case "float64":

					case "long":
						return "number";
				}
				return name;
			}

			// Function types
			if (type.kind & (TypeScript.PullElementKind.ObjectType | TypeScript.PullElementKind.Interface | TypeScript.PullElementKind.FunctionType) &&
				type.getCallSignatures().length > 0) {
				return Emitter.formatJSDocUnionType(type.getCallSignatures().map(signature => '?function(' + // TypeScript has nullable functions
					signature.parameters.map(arg => Emitter.formatJSDocArgumentType(arg)).join(', ') + ')' + (
					signature.returnType !== null && signature.returnType.getTypeName() !== 'void' ? ': ' + Emitter.formatJSDocType(signature.returnType) : '')));
			}

			// Constructor types
			if (type.kind & TypeScript.PullElementKind.ConstructorType && type.getConstructSignatures().length > 0) {
				return Emitter.formatJSDocUnionType(type.getConstructSignatures().map(signature => '?function(' + // TypeScript has nullable functions
					(signature.returnType !== null && signature.returnType.getTypeName() !== 'void' ? ['new:' + Emitter.formatJSDocType(signature.returnType)] :
						Emitter.EMPTY_STRING_LIST).concat(signature.parameters.map((arg: PullSymbol) => Emitter.formatJSDocArgumentType(arg))).join(', ') + ')'));
			}

			// Map types
			if (type.kind & (TypeScript.PullElementKind.ObjectType | TypeScript.PullElementKind.Interface) && type.getIndexSignatures().length > 0) {
				return Emitter.formatJSDocUnionType(type.getIndexSignatures().map(signature => 'Object.<' +
					Emitter.formatJSDocType(signature.parameters[0].type) + ', ' + Emitter.formatJSDocType(signature.returnType) + '>'));
			}

			// Object types and interfaces
			if (type.kind & (TypeScript.PullElementKind.ObjectType | TypeScript.PullElementKind.Interface)) {
				if (type.getMembers().length === 0) {
					return '?Object'; // Object types are nullable in TypeScript
				}
				if (type.getMembers().some(member => /[^A-Za-z0-9_$]/.test(member.getDisplayName()))) {
					return '?'; // Google Closure Compiler's type parser cannot quote names
				}
				return '?{ ' + // Object types are nullable in TypeScript
					type.getMembers().map(member => Emitter.mangleSymbolName(member) + ': ' + Emitter.formatJSDocType(member.type)).join(', ') + ' }';
			}

			// Arrays
			if (type.kind & TypeScript.PullElementKind.Array) {
				return 'Array.<' + Emitter.formatJSDocType(type.getTypeArguments()[0]) + '>';
			}

			throw new Error(TypeScript.PullElementKind[type.kind] + ' types like "' + type.getTypeName() + '" are not supported');
		}

		private static getUserComments(node: AST): string[] {
			var comments: Comment[] = node.preComments();
			if (comments === null) {
				return [];
			}
			return Emitter.EMPTY_STRING_LIST.concat(comments.map(comment => {
				return comment.getDocCommentTextValue().split('\n');
			})).map(line => (line + '').replace(/^\/\/\s?/, ''));
		}

		private static getJSDocForType(type: PullTypeSymbol): string[] {
			return ['@type {' + Emitter.formatJSDocType(type) + '}'];
		}

		private static getJSDocForConst(type: PullTypeSymbol): string[] {
			return ['@const {' + Emitter.formatJSDocType(type) + '}'];
		}

		private static stripOffArrayType(type: string): string {
			return type.replace(/^Array\.<(.*)>$/, '$1');
		}

		private static getJSDocForArguments(symbols: PullSymbol[]): string[] {
			return symbols.map(symbol => {
				var type: string = Emitter.formatJSDocType(symbol.type);
				if (symbol.isVarArg) return '@param {...' + Emitter.stripOffArrayType(type) + '} ' + Emitter.mangleVarArgSymbolName(symbol);
				if (symbol.isOptional) type += '=';
				return '@param {' + type + '} ' + Emitter.mangleSymbolName(symbol);
			});
		}

		private getJSDocForConstructor(classDecl: ClassDeclaration): string[] {
			return ['@constructor', '@struct', TypeScript.hasFlag(classDecl.getVarFlags(), VariableFlags.Final) ? '@final' : ''].concat(
				this.getJSDocForExtends(classDecl.extendsList),
				this.getJSDocForImplements(classDecl.implementsList));
		}

		// The symbol for GenericType nodes is sometimes stored in the name
		private getSymbolForNameAST(ast: AST): PullSymbol {
			return this.getSymbolForAST(ast.nodeType() === TypeScript.NodeType.GenericType ? (<GenericType>ast).name : ast);
		}

		private getJSDocForExtends(extendsList: ASTList): string[] {
			return extendsList !== null
				? extendsList.members.map(member => '@extends {' + Emitter.getFullSymbolName(this.getSymbolForNameAST(member)) + '}')
				: Emitter.EMPTY_STRING_LIST;
		}

		private getJSDocForImplements(implementsList: ASTList): string[] {
			return implementsList !== null
				? implementsList.members.map(member => '@implements {' + Emitter.getFullSymbolName(this.getSymbolForNameAST(member)) + '}')
				: Emitter.EMPTY_STRING_LIST;
		}

		private static getJSDocForReturnType(returnType: PullTypeSymbol): string[] {
			return ['@returns {' + Emitter.formatJSDocType(returnType) + '}'];
		}

		private static getJSDocForEnumDeclaration(moduleDecl: ModuleDeclaration): string[] {
			return ['@enum {number}'];
		}

		private static getJSDocForTypedef(type: PullTypeSymbol): string[] {
			return ['@typedef {' + Emitter.formatJSDocType(type, IgnoreName.YES) + '}'];
		}

		private getFunctionDeclarationSignature(funcDecl: FunctionDeclaration): PullSignatureSymbol {
			var type: PullTypeSymbol = this.getSymbolForAST(funcDecl).type;
			//var signaturesCount = type.getCallSignatures().length;
			//var signature: PullSignatureSymbol = (signaturesCount > 0) ? type.getCallSignatures()[signaturesCount - 1] : type.getConstructSignatures()[0];

			var signature: PullSignatureSymbol = type.getCallSignatures().concat(type.getConstructSignatures())[0];

			if (signature.parameters.length !== funcDecl.arguments.members.length) {
				//console.log(funcDecl.name.text(), signature.parameters.length, funcDecl.arguments.members.length);
				//throw new Error('Internal error');
			}

			return signature;
		}

		private getJSDocForFunctionDeclaration(funcDecl: FunctionDeclaration): string[] {
			var signature: PullSignatureSymbol = this.getFunctionDeclarationSignature(funcDecl);
			return Emitter.getJSDocForArguments(signature.parameters).concat(
				funcDecl.isConstructor
				? this.getJSDocForConstructor(funcDecl.classDecl)
				: signature.returnType !== null && signature.returnType.getTypeName() !== 'void'
				? Emitter.getJSDocForReturnType(signature.returnType)
				: Emitter.EMPTY_STRING_LIST);
		}

		private getJSDocForInterfaceDeclaration(interfaceDecl: InterfaceDeclaration): string[] {
			return ['@interface'].concat(this.getJSDocForExtends(interfaceDecl.extendsList));
		}

		private getJSDocForVariableDeclaration(varDecl: VariableDeclarator): string[] {
			var symbol: PullSymbol = this.getSymbolForAST(varDecl);
			return Emitter.DEFINES.indexOf(Emitter.getFullSymbolName(symbol, ShouldMangle.NO)) >= 0
				? ['@define {' + Emitter.formatJSDocType(symbol.type) + '}']
				: Emitter.detectedConstants.indexOf(symbol) >= 0
				? Emitter.getJSDocForConst(symbol.type)
				: Emitter.getJSDocForType(symbol.type);
		}

		private static joinJSDocComments(first: string[], second: string[]): string[] {
			return first.concat(first.length && second.length ? [''] : Emitter.EMPTY_STRING_LIST, second);
		}

		private emitFullSymbolVariableStatement(symbol: PullSymbol) {
			var name: string = Emitter.getFullSymbolName(symbol);
			this.writeToOutput(name.indexOf('.') < 0 ? 'var ' + Emitter.mangleSymbolName(symbol) : name);
		}

		private emitJSDocComment(lines: string[]) {
			if (lines.length === 0) return;
			lines = ['/**'].concat(lines.map(line => ' ' + ('* ' + line.replace(/\*\//g, '* /')).trim()), [' */']);
			lines.forEach((line, i) => {
				if (i) this.emitIndent();
				this.writeLineToOutput(line);
			});
			this.emitIndent();
		}

		private emitInlineJSDocComment(user: string[], jsDoc: string[]) {
			if (user.length === 0) this.writeToOutput('/** ' + jsDoc.join(' ') + ' */ ');
			else this.emitJSDocComment(Emitter.joinJSDocComments(user, jsDoc));
		}

		private static detectConstants(compiler: TypeScriptCompiler, ioHost: EmitterIOHost) {
			if (!Emitter.DETECT_CONSTANTS) return;

			var potentialConstants: PullSymbol[] = [];
			var impossibleConstants: PullSymbol[] = [];

			compiler.fileNameToDocument.getAllKeys().forEach(fileName => {
				TypeScript.walkAST(compiler.getDocument(fileName).script, (path, walker) => {
					switch (path.nodeType()) {
						// Check all variable declarations for potential constants. This
						// ignores instance variables and variables of non-primitive type
						// since the intent of this detection step is to help the Google
						// Closure Compiler with inlining.
						case TypeScript.NodeType.VariableDeclarator:
							var varDecl = <VariableDeclarator>path.ast();
							if (varDecl.init !== null) {
								var symbol = compiler.semanticInfoChain.getSymbolForAST(varDecl, fileName) || null;
								if (symbol !== null && potentialConstants.indexOf(symbol) === -1 && (
									symbol.type.isPrimitive() || symbol.type.getTypeName() === 'RegExp') && (
									symbol.kind === TypeScript.PullElementKind.Variable ||
									symbol.kind === TypeScript.PullElementKind.Property && varDecl.isStatic())) {
									potentialConstants.push(symbol);
								}
							}
							break;

						// A symbol is not a constant if it has been assigned to other than
						// by its declaration
						case TypeScript.NodeType.AssignmentExpression:
						case TypeScript.NodeType.AddAssignmentExpression:
						case TypeScript.NodeType.SubtractAssignmentExpression:
						case TypeScript.NodeType.MultiplyAssignmentExpression:
						case TypeScript.NodeType.DivideAssignmentExpression:
						case TypeScript.NodeType.ModuloAssignmentExpression:
						case TypeScript.NodeType.AndAssignmentExpression:
						case TypeScript.NodeType.ExclusiveOrAssignmentExpression:
						case TypeScript.NodeType.OrAssignmentExpression:
						case TypeScript.NodeType.LeftShiftAssignmentExpression:
						case TypeScript.NodeType.SignedRightShiftAssignmentExpression:
						case TypeScript.NodeType.UnsignedRightShiftAssignmentExpression:
							var binaryExpr = <BinaryExpression>path.ast();
							switch (binaryExpr.operand1.nodeType()) {
								case TypeScript.NodeType.Name:
								case TypeScript.NodeType.MemberAccessExpression:
									var symbol = compiler.semanticInfoChain.getSymbolForAST(binaryExpr.operand1, fileName) || null;
									if (symbol !== null && impossibleConstants.indexOf(symbol) === -1) {
										impossibleConstants.push(symbol);
									}
									break;
							}
							break;

						// Unary ++ and -- also count as assignments
						case TypeScript.NodeType.PreIncrementExpression:
						case TypeScript.NodeType.PreDecrementExpression:
						case TypeScript.NodeType.PostIncrementExpression:
						case TypeScript.NodeType.PostDecrementExpression:
							var unaryExpr = <UnaryExpression>path.ast();
							switch (unaryExpr.operand.nodeType()) {
								case TypeScript.NodeType.Name:
								case TypeScript.NodeType.MemberAccessExpression:
									var symbol = compiler.semanticInfoChain.getSymbolForAST(unaryExpr.operand, fileName) || null;
									if (symbol !== null && impossibleConstants.indexOf(symbol) === -1) {
										impossibleConstants.push(symbol);
									}
									break;
							}
							break;
					}
				});
			});

			Emitter.detectedConstants = potentialConstants.filter(symbol => impossibleConstants.indexOf(symbol) === -1);
		}

		private static preventManglingOfAmbientSymbols(compiler: TypeScriptCompiler, ioHost: EmitterIOHost) {
			if (!Emitter.MANGLE_NAMES) return;

			var symbolsToAvoidMangling: PullSymbol[] = [];
			var objectInterfaceType: PullTypeSymbol = null;

			// Find the object type
			compiler.semanticInfoChain.units.forEach(unit => {
				unit.getTopLevelDecls().forEach(decl => {
					decl.getChildDecls().forEach(decl => {
						var symbol = decl.getSymbol();
						if (symbol !== null && symbol.kind === TypeScript.PullElementKind.Interface && Emitter.getFullSymbolName(symbol) === 'Object') {
							objectInterfaceType = symbol.type;
						}
					});
				});
			});

			function preventManglingOfSymbol(symbol: PullSymbol) {
				if (symbolsToAvoidMangling.indexOf(symbol) < 0) {
					symbolsToAvoidMangling.push(symbol);
					if (symbol.type !== null) preventManglingOfType(symbol.type);
				}
			}

			function preventManglingOfType(type: PullTypeSymbol) {
				type.getMembers().forEach(preventManglingOfSymbol);
			}

			function getAllMembers(members: PullSymbol[], type: PullTypeSymbol) {
				Array.prototype.push.apply(members, type.getMembers());
				type.getExtendedTypes().forEach(type => getAllMembers(members, type));

				// All types implicitly extend the Object interface
				if (objectInterfaceType !== null) {
					Array.prototype.push.apply(members, objectInterfaceType.getMembers());
				}
			}

			function preventManglingOfInheritedMembers(type: PullTypeSymbol) {
				var allMembers: PullSymbol[] = [];
				getAllMembers(allMembers, type);
				type.getMembers().forEach(member => {
					if (allMembers.some(other => member.name === other.name && !Emitter.shouldMangleSymbol(other))) {
						preventManglingOfSymbol(member);
					}
				});
			}

			compiler.fileNameToDocument.getAllKeys().forEach(fileName => {
				TypeScript.walkAST(compiler.getDocument(fileName).script, (path, walker) => {
					switch (path.nodeType()) {
						case TypeScript.NodeType.FunctionDeclaration:
						case TypeScript.NodeType.ClassDeclaration:
						case TypeScript.NodeType.InterfaceDeclaration:
						case TypeScript.NodeType.ModuleDeclaration:
						case TypeScript.NodeType.VariableDeclarator:
							var symbol = compiler.semanticInfoChain.getSymbolForAST(path.ast(), fileName) || null;
							if (symbol !== null) {
								if (Emitter.isAmbientSymbol(symbol)) preventManglingOfSymbol(symbol);
								else if (symbol.type !== null) preventManglingOfInheritedMembers(symbol.type);
							}
							break;
					}
				});
			});

			Emitter.symbolsToAvoidMangling = symbolsToAvoidMangling;
		}

		public static preprocessCompilerInput(compiler: TypeScriptCompiler, ioHost: EmitterIOHost) {
			Emitter.detectConstants(compiler, ioHost);
			Emitter.preventManglingOfAmbientSymbols(compiler, ioHost);
		}

		// This will be set by tscc, which checks command line flags
		public static DEFINES: string[] = [];
		public static MANGLE_NAMES: boolean = false;
		public static DETECT_CONSTANTS: boolean = false;
		private static detectedConstants: PullSymbol[] = [];
		private static symbolsToAvoidMangling: PullSymbol[] = [];
	}
}
