///<reference path='typescript3.d.ts' />

declare function createStreamForInterfaceExterns(path: string): any;

module TypeScript {
	var isNeedEscape = "_isNeedEscape";
	var splitToExternMode = "_splitToExternsMode";
	var escapeNamesMap = "_escapeOptionsMap";

	enum InterfaceExternsSplitMode {
		k_None,
		k_All,
		k_Part
	}

	export enum EmitContainer {
		Prog,
		Module,
		DynamicModule,
		Class,
		Constructor,
		Function,
		Args,
		Interface,
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
		private _diagnostic: Diagnostic = null;

		private _settings: ImmutableCompilationSettings = null;
		private _commonDirectoryPath = "";
		private _sharedOutputFile = "";
		private _sourceRootDirectory = "";
		private _sourceMapRootDirectory = "";
		private _outputDirectory = "";

		public diagnostic(): Diagnostic { return this._diagnostic; }

		public commonDirectoryPath() { return this._commonDirectoryPath; }
		public sharedOutputFile() { return this._sharedOutputFile; }
		public sourceRootDirectory() { return this._sourceRootDirectory; }
		public sourceMapRootDirectory() { return this._sourceMapRootDirectory; }
		public outputDirectory() { return this._outputDirectory; }

		public compilationSettings() { return this._settings; }

		constructor(compiler: TypeScriptCompiler, public resolvePath: (path: string) => string) {
			var settings = compiler.compilationSettings();
			this._settings = settings;

			// If the document is an external module, then report if the the user has not 
			// provided the right command line option.
			if (settings.moduleGenTarget() === ModuleGenTarget.Unspecified) {
				var fileNames = compiler.fileNames();
				for (var i = 0, n = fileNames.length; i < n; i++) {
					var document = compiler.getDocument(fileNames[i]);
					if (!document.isDeclareFile() && document.isExternalModule()) {
						var errorSpan = document.externalModuleIndicatorSpan();
						this._diagnostic = new Diagnostic(document.fileName, document.lineMap(), errorSpan.start(), errorSpan.length(),
							DiagnosticCode.Cannot_compile_external_modules_unless_the_module_flag_is_provided);

						return;
					}
				}
			}

			if (!settings.mapSourceFiles()) {
				// Error to specify --mapRoot or --sourceRoot without mapSourceFiles
				if (settings.mapRoot()) {
					if (settings.sourceRoot()) {
						this._diagnostic = new Diagnostic(null, null, 0, 0, DiagnosticCode.Options_mapRoot_and_sourceRoot_cannot_be_specified_without_specifying_sourcemap_option, null);
						return;
					}
					else {
						this._diagnostic = new Diagnostic(null, null, 0, 0, DiagnosticCode.Option_mapRoot_cannot_be_specified_without_specifying_sourcemap_option, null);
						return;
					}
				}
				else if (settings.sourceRoot()) {
					this._diagnostic = new Diagnostic(null, null, 0, 0, DiagnosticCode.Option_sourceRoot_cannot_be_specified_without_specifying_sourcemap_option, null);
					return;
				}
			}

			this._sourceMapRootDirectory = convertToDirectoryPath(switchToForwardSlashes(settings.mapRoot()));
			this._sourceRootDirectory = convertToDirectoryPath(switchToForwardSlashes(settings.sourceRoot()));

			if (settings.outFileOption() ||
				settings.outDirOption() ||
				settings.mapRoot() ||
				settings.sourceRoot()) {

				if (settings.outFileOption()) {
					this._sharedOutputFile = switchToForwardSlashes(resolvePath(settings.outFileOption()));
				}

				if (settings.outDirOption()) {
					this._outputDirectory = convertToDirectoryPath(switchToForwardSlashes(resolvePath(settings.outDirOption())));
				}

				// Parse the directory structure
				if (this._outputDirectory || this._sourceMapRootDirectory || this.sourceRootDirectory) {
					this.determineCommonDirectoryPath(compiler);
				}
			}
		}

		private determineCommonDirectoryPath(compiler: TypeScriptCompiler): void {
			var commonComponents: string[] = [];
			var commonComponentsLength = -1;

			var fileNames = compiler.fileNames();
			for (var i = 0, len = fileNames.length; i < len; i++) {
				var fileName = fileNames[i];
				var document = compiler.getDocument(fileNames[i]);
				var sourceUnit = document.sourceUnit();

				if (!document.isDeclareFile()) {
					var fileComponents = filePathComponents(fileName);
					if (commonComponentsLength === -1) {
						// First time at finding common path
						// So common path = directory of file
						commonComponents = fileComponents;
						commonComponentsLength = commonComponents.length;
					}
					else {
						var updatedPath = false;
						for (var j = 0; j < commonComponentsLength && j < fileComponents.length; j++) {
							if (commonComponents[j] !== fileComponents[j]) {
								// The new components = 0 ... j -1
								commonComponentsLength = j;
								updatedPath = true;

								if (j === 0) {
									if (this._outputDirectory || this._sourceMapRootDirectory) {
										// Its error to not have common path
										this._diagnostic = new Diagnostic(null, null, 0, 0, DiagnosticCode.Cannot_find_the_common_subdirectory_path_for_the_input_files, null);
										return;
									}

									return;
								}

								break;
							}
						}

						// If the fileComponent path completely matched and less than already found update the length
						if (!updatedPath && fileComponents.length < commonComponentsLength) {
							commonComponentsLength = fileComponents.length;
						}
					}
				}
			}

			this._commonDirectoryPath = commonComponents.slice(0, commonComponentsLength).join("/") + "/";
		}
	}

	export class Indenter {
		static indentStep: number = 4;
		static indentStepString: string = "    ";
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

	export function lastParameterIsRest(parameterList: ParameterList): boolean {
		var parameters = parameterList.parameters;
		return parameters.nonSeparatorCount() > 0 && (<Parameter>parameters.nonSeparatorAt(parameters.nonSeparatorCount() - 1)).dotDotDotToken !== null;
	}

	export class Emitter {
		public globalThisCapturePrologueEmitted = false;
		public extendsPrologueEmitted = false;
		public thisClassNode: ClassDeclaration = null;
		public inArrowFunction: boolean = false;
		public moduleName = "";
		public emitState = new EmitState();
		public indenter = new Indenter();
		public sourceMapper: SourceMapper = null;
		public captureThisStmtString = "var _this = this;";
		private currentVariableDeclaration: VariableDeclaration;
		private declStack: PullDecl[] = [];
		private exportAssignment: ExportAssignment = null;
		private inWithBlock = false;

		public document: Document = null;
		// private copyrightElement: AST = null;

		/**
		* For closure
		*/
		private thisShortClassNameForMethods: string = null;
		private thisFullClassName: string = null;
		private thisFullExtendClassName: string = null;
		private obfuscatedSymbolList: PullSymbol[] = [];
		private obfuscatedSymbolNameMap: { [index: number]: string } = {};
		private obfuscatorCounter: number = 0;

		private thisFullInterfaceName: string = null;
		private thisFullInterfaceExternPartName: string = null;

		private emittedInterfaces: InterfaceDeclaration[] = [];
		private usedButNotEmittedInterfaces: InterfaceDeclaration[] = [];

		/** For emit typedef comments without type parameters */
		private isTypeParametersEmitBlocked = false;

		/** For emit enum */
		private isEnumEmitted = false;
		private isEmittedEnumExported = false;

		/** for emit enum elements */
		private totalEmitedConstansts = 0;
		private lastEmitConstantValue = null;

		// If we choose to detach comments from an element (for example, the Copyright comments),
		// then keep track of that element so that we don't emit all on the comments on it when
		// we visit it.
		private detachedCommentsElement: AST = null;
		/** for emitting jsDoc cooments for class properties */
		private emittedClassProperties: PullSymbol[] = null;

		private isEmitConstructorStatements: boolean = false;

		/** for hack with fix closure problem with many variable definitions */
		private emittedSymbolNames: { [id: number]: string[] } = {};
		private emittedForInStatement: boolean = false;

		private _emitGlobal: boolean = true;

		private interfaceExternsStream = null;
		private isEnabledInterfaceExternStream = false;
		private externFile = null;

		private shortNameMap: { [longName: string]: string } = {};
		private shorter: number = 0;

		constructor(public emittingFileName: string,
			public outfile: TextWriter,
			public emitOptions: EmitOptions,
			private semanticInfoChain: SemanticInfoChain) {

			if (emitOptions.sharedOutputFile()) {
				this.interfaceExternsStream = createStreamForInterfaceExterns(emitOptions.sharedOutputFile() + ".tmp.externs");
				this.externFile = createStreamForInterfaceExterns(emitOptions.sharedOutputFile() + ".externs");
			}
			else {
				console.warn("TSCC warn >> Bad compilation options! Better if you specify output file.");
				this.interfaceExternsStream = createStreamForInterfaceExterns(emitOptions.sourceRootDirectory() + "/__interface__.js.tmp.externs");
				this.interfaceExternsStream = createStreamForInterfaceExterns(emitOptions.sourceRootDirectory() + "/__externs__.js.externs");
			}
		}

		private pushDecl(decl: PullDecl) {
			if (decl) {
				this.declStack[this.declStack.length] = decl;
			}
		}

		private popDecl(decl: PullDecl) {
			if (decl) {
				this.declStack.length--;
			}
		}

		private getEnclosingDecl() {
			var declStackLen = this.declStack.length;
			var enclosingDecl = declStackLen > 0 ? this.declStack[declStackLen - 1] : null;
			return enclosingDecl;
		}

		public setExportAssignment(exportAssignment: ExportAssignment) {
			this.exportAssignment = exportAssignment;
		}

		public getExportAssignment() {
			return this.exportAssignment;
		}

		public setDocument(document: Document) {
			this.document = document;
		}

		public shouldEmitImportDeclaration(importDeclAST: ImportDeclaration) {
			var isExternalModuleReference = importDeclAST.moduleReference.kind() === SyntaxKind.ExternalModuleReference;
			var importDecl = this.semanticInfoChain.getDeclForAST(importDeclAST);
			var isExported = hasFlag(importDecl.flags, PullElementFlags.Exported);
			var isAmdCodeGen = this.emitOptions.compilationSettings().moduleGenTarget() === ModuleGenTarget.Asynchronous;

			// 1) Any internal reference needs to check if the emit can happen
			// 2) External module reference with export modifier always needs to be emitted
			// 3) commonjs needs the var declaration for the import declaration
			if (isExternalModuleReference && !isExported && isAmdCodeGen) {
				return false;
			}

			var importSymbol = <PullTypeAliasSymbol>importDecl.getSymbol();
			if (importSymbol.isUsedAsValue()) {
				return true;
			}

			if (importDeclAST.moduleReference.kind() !== SyntaxKind.ExternalModuleReference) {
				var canBeUsedExternally = isExported || importSymbol.typeUsedExternally() || importSymbol.isUsedInExportedAlias();
				if (!canBeUsedExternally && !this.document.isExternalModule()) {
					// top level import in non-external module are visible across the whole global module
					canBeUsedExternally = hasFlag(importDecl.getParentDecl().kind, PullElementKind.Script | PullElementKind.DynamicModule);
				}

				if (canBeUsedExternally) {
					if (importSymbol.getExportAssignedValueSymbol()) {
						return true;
					}

					var containerSymbol = importSymbol.getExportAssignedContainerSymbol();
					if (containerSymbol && containerSymbol.getInstanceSymbol()) {
						return true;
					}
				}
			}

			return false;
		}

		public emitImportDeclaration(importDeclAST: ImportDeclaration) {
			var isExternalModuleReference = importDeclAST.moduleReference.kind() === SyntaxKind.ExternalModuleReference;
			var importDecl = this.semanticInfoChain.getDeclForAST(importDeclAST);
			var isExported = hasFlag(importDecl.flags, PullElementFlags.Exported);
			var isAmdCodeGen = this.emitOptions.compilationSettings().moduleGenTarget() === ModuleGenTarget.Asynchronous;

			this.emitComments(importDeclAST, true);

			var importSymbol = <PullTypeAliasSymbol>importDecl.getSymbol();

			var parentSymbol = importSymbol.getContainer();
			var parentKind = parentSymbol ? parentSymbol.kind : PullElementKind.None;
			var associatedParentSymbol = parentSymbol ? parentSymbol.getAssociatedContainerType() : null;
			var associatedParentSymbolKind = associatedParentSymbol ? associatedParentSymbol.kind : PullElementKind.None;

			var needsPropertyAssignment = false;
			var usePropertyAssignmentInsteadOfVarDecl = false;
			var moduleNamePrefix: string;

			if (isExported &&
				(parentKind === PullElementKind.Container ||
				parentKind === PullElementKind.DynamicModule ||
				associatedParentSymbolKind === PullElementKind.Container ||
				associatedParentSymbolKind === PullElementKind.DynamicModule)) {
				if (importSymbol.getExportAssignedTypeSymbol() || importSymbol.getExportAssignedContainerSymbol()) {
					// Type or container assignment that is exported
					needsPropertyAssignment = true;
				}
				else {
					var valueSymbol = importSymbol.getExportAssignedValueSymbol();
					if (valueSymbol &&
						(valueSymbol.kind === PullElementKind.Method || valueSymbol.kind === PullElementKind.Function)) {
						needsPropertyAssignment = true;
					}
					else {
						usePropertyAssignmentInsteadOfVarDecl = true;
					}
				}

				// Calculate what name prefix to use
				if (this.emitState.container === EmitContainer.DynamicModule) {
					moduleNamePrefix = "exports."
				}
				else {
					moduleNamePrefix = this.moduleName + ".";
				}
			}

			if (isAmdCodeGen && isExternalModuleReference) {
				// For amdCode gen of exported external module reference, do not emit var declaration
				// Emit the property assignment since it is exported
				needsPropertyAssignment = true;
			}
			else {
				this.recordSourceMappingStart(importDeclAST);
				if (usePropertyAssignmentInsteadOfVarDecl) {
					this.writeToOutput(moduleNamePrefix);
				} else {
					this.writeToOutput("var /** @const */");
				}

				this.writeToOutput(this.getObfuscatedName(importSymbol, importDeclAST.identifier.text()) + " = ");
				var aliasAST = importDeclAST.moduleReference;

				if (isExternalModuleReference) {
					this.writeToOutput("require(" + (<ExternalModuleReference>aliasAST).stringLiteral.text() + ")");
				}
				else {
					this.emitJavascript((<ModuleNameModuleReference>aliasAST).moduleName, false);
				}

				this.recordSourceMappingEnd(importDeclAST);
				this.writeToOutput(";");

				if (needsPropertyAssignment) {
					this.writeLineToOutput("");
					this.emitIndent();
				}
			}

			if (needsPropertyAssignment) {
				this.writeToOutputWithSourceMapRecord(moduleNamePrefix + importDeclAST.identifier.text() + " = " + importDeclAST.identifier.text(), importDeclAST);
				this.writeToOutput(";");
			}
			this.emitComments(importDeclAST, false);
		}

		public createSourceMapper(document: Document, jsFileName: string, jsFile: TextWriter, sourceMapOut: TextWriter, resolvePath: (path: string) => string) {
			this.sourceMapper = new SourceMapper(jsFile, sourceMapOut, document, jsFileName, this.emitOptions, resolvePath);
		}

		public setSourceMapperNewSourceFile(document: Document) {
			this.sourceMapper.setNewSourceFile(document, this.emitOptions);
		}

		private updateLineAndColumn(s: string) {
			var lineNumbers = TextUtilities.parseLineStarts(s);
			if (lineNumbers.length > 1) {
				// There are new lines in the string, update the line and column number accordingly
				this.emitState.line += lineNumbers.length - 1;
				this.emitState.column = s.length - lineNumbers[lineNumbers.length - 1];
			}
			else {
				// No new lines in the string
				this.emitState.column += s.length;
			}
		}

		public writeToOutputWithSourceMapRecord(s: string, astSpan: IASTSpan) {
			this.recordSourceMappingStart(astSpan);
			this.writeToOutput(s);
			this.recordSourceMappingEnd(astSpan);
		}

		private writeToStream(s: string) {
			//if (this.bufferForStream !== "" && this.bufferForStream !== s) {
			//	this.bufferForStream += s;
			//}
			//else {
			//	this.bufferForStream = "";
			//	var ok = this.interfaceExternsStream.write(s);

			//	if (!ok) {
			//		this.bufferForStream = s;
			//		var me = this;
			//		this.interfaceExternsStream.once('drain', () => {
			//			me.writeToStream(me.bufferForStream);
			//		});
			//	}
			//}

			this.interfaceExternsStream.buffer += s;
		}

		public writeToOutput(s: string) {
			if (this.isEnabledInterfaceExternStream) {
				this.writeToStream(s);
				return;
			}

			this.outfile.Write(s);
			this.updateLineAndColumn(s);
		}

		public writeLineToOutput(s: string, force = false) {
			if (this.isEnabledInterfaceExternStream) {
				this.writeToStream(s + "\n");
				return;
			}
			// No need to print a newline if we're already at the start of the line.
			if (!force && s === "" && this.emitState.column === 0) {
				return;
			}

			this.outfile.WriteLine(s);
			this.updateLineAndColumn(s);
			this.emitState.column = 0;
			this.emitState.line++;
		}

		public writeCaptureThisStatement(ast: AST) {
			this.emitIndent();
			this.writeToOutputWithSourceMapRecord(this.captureThisStmtString, ast);
			this.writeLineToOutput("");
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

		public emitComment(comment: Comment, trailing: boolean, first: boolean) {
			if (this.emitOptions.compilationSettings().removeComments()) {
				return;
			}

			var text = getTrimmedTextLines(comment);
			var emitColumn = this.emitState.column;

			if (emitColumn === 0) {
				this.emitIndent();
			}
			else if (trailing && first) {
				this.writeToOutput(" ");
			}

			if (comment.kind() === SyntaxKind.MultiLineCommentTrivia) {
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
				}
				else {
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

			if (!trailing && emitColumn !== 0) {
				// If we were indented before, stay indented after.
				this.emitIndent();
			}
		}

		public emitComments(ast: AST, pre: boolean, onlyPinnedOrTripleSlashComments: boolean = false) {
			// Emitting the comments for the exprssion inside an arrow function is handled specially
			// in emitFunctionBodyStatements.  We don't want to emit those comments a second time.
			if (ast && ast.kind() !== SyntaxKind.Block) {
				if (ast.parent.kind() === SyntaxKind.SimpleArrowFunctionExpression || ast.parent.kind() === SyntaxKind.ParenthesizedArrowFunctionExpression) {
					return;
				}
			}

			if (pre) {
				var preComments = ast.preComments();

				if (preComments && ast === this.detachedCommentsElement) {
					// We're emitting the comments for the first script element.  Skip any 
					// copyright comments, as we'll already have emitted those.
					var detachedComments = this.getDetachedComments(ast);
					preComments = preComments.slice(detachedComments.length);
					this.detachedCommentsElement = null;
				}

				// We're emitting comments on an elided element.  Only keep the comment if it is
				// a triple slash or pinned comment.
				if (preComments && onlyPinnedOrTripleSlashComments) {
					preComments = ArrayUtilities.where(preComments, c => this.isPinnedOrTripleSlash(c));
				}

				this.emitCommentsArray(preComments, /*trailing:*/ false);
			}
			else {
				this.emitCommentsArray(ast.postComments(), /*trailing:*/ true);
			}
		}

		private isPinnedOrTripleSlash(comment: Comment): boolean {
			var fullText = comment.fullText();
			if (fullText.match(tripleSlashReferenceRegExp)) {
				return true;
			}
			else {
				return fullText.indexOf("/*!") === 0;
			}
		}

		public emitCommentsArray(comments: Comment[], trailing: boolean): void {
			if (!this.emitOptions.compilationSettings().removeComments() && comments) {
				for (var i = 0, n = comments.length; i < n; i++) {
					this.emitComment(comments[i], trailing, /*first:*/ i === 0);
				}
			}
		}

		public emitObjectLiteralExpression(objectLiteral: ObjectLiteralExpression) {
			this.recordSourceMappingStart(objectLiteral);

			// Try to preserve the newlines between elements that the user had.
			this.writeToOutput("{");
			this.emitCommaSeparatedList(objectLiteral, objectLiteral.propertyAssignments, /*buffer:*/ " ", /*preserveNewLines:*/ true);
			this.writeToOutput("}");

			this.recordSourceMappingEnd(objectLiteral);
		}

		public emitArrayLiteralExpression(arrayLiteral: ArrayLiteralExpression) {
			this.recordSourceMappingStart(arrayLiteral);

			// Try to preserve the newlines between elements that the user had.
			this.writeToOutput("[");
			this.emitCommaSeparatedList(arrayLiteral, arrayLiteral.expressions, /*buffer:*/ "", /*preserveNewLines:*/ true);
			this.writeToOutput("]");

			this.recordSourceMappingEnd(arrayLiteral);
		}

		public emitObjectCreationExpression(objectCreationExpression: ObjectCreationExpression) {
			this.recordSourceMappingStart(objectCreationExpression);
			this.writeToOutput("new ");
			var target = objectCreationExpression.expression;

			this.emit(target);
			if (objectCreationExpression.argumentList) {
				this.recordSourceMappingStart(objectCreationExpression.argumentList);
				this.writeToOutput("(");
				this.emitCommaSeparatedList(objectCreationExpression.argumentList, objectCreationExpression.argumentList.arguments, /*buffer:*/ "", /*preserveNewLines:*/ false);
				this.writeToOutputWithSourceMapRecord(")", objectCreationExpression.argumentList.closeParenToken);
				this.recordSourceMappingEnd(objectCreationExpression.argumentList);
			}

			this.recordSourceMappingEnd(objectCreationExpression);
		}

		public getConstantDecl(dotExpr: MemberAccessExpression): PullEnumElementDecl {
			var pullSymbol = this.semanticInfoChain.getSymbolForAST(dotExpr);
			if (pullSymbol && pullSymbol.kind === PullElementKind.EnumMember) {
				var pullDecls = pullSymbol.getDeclarations();
				if (pullDecls.length === 1) {
					var pullDecl = pullDecls[0];
					if (pullDecl.kind === PullElementKind.EnumMember) {
						return <PullEnumElementDecl>pullDecl;
					}
				}
			}

			return null;
		}

		public tryEmitConstant(dotExpr: MemberAccessExpression) {
			var propertyName = dotExpr.name;
			var boundDecl = this.getConstantDecl(dotExpr);
			if (boundDecl) {
				var value = boundDecl.constantValue;
				if (value !== null) {

					this.totalEmitedConstansts++;
					this.lastEmitConstantValue = value;

					this.recordSourceMappingStart(dotExpr);
					var comment = " /** ";
					comment += this.getJSDocForType(boundDecl.getSymbol().type)[0];
					comment += " */";
					this.writeToOutput(comment);
					this.writeToOutput("(" + value.toString() + ")");
					this.recordSourceMappingEnd(dotExpr);
					return true;
				}
			}

			return false;
		}

		public emitInvocationExpression(callNode: InvocationExpression) {
			this.recordSourceMappingStart(callNode);
			var target = callNode.expression;
			var args = callNode.argumentList.arguments;

			if (target.kind() === SyntaxKind.MemberAccessExpression && (<MemberAccessExpression>target).expression.kind() === SyntaxKind.SuperKeyword) {
				this.emit(target);
				this.writeToOutput(".call");
				this.recordSourceMappingStart(args);
				this.writeToOutput("(");
				this.emitThis();
				if (args && args.nonSeparatorCount() > 0) {
					this.writeToOutput(", ");
					this.emitCommaSeparatedList(callNode.argumentList, args, /*buffer:*/ "", /*preserveNewLines:*/ false);
				}
			}
			else {
				if (callNode.expression.kind() === SyntaxKind.SuperKeyword && this.emitState.container === EmitContainer.Constructor) {
					this.writeToOutput(this.thisFullExtendClassName + ".call");
				}
				else {
					this.emitJavascript(target, false);
				}
				this.recordSourceMappingStart(args);
				this.writeToOutput("(");
				if (callNode.expression.kind() === SyntaxKind.SuperKeyword && this.emitState.container === EmitContainer.Constructor) {
					this.writeToOutput("this");
					if (args && args.nonSeparatorCount() > 0) {
						this.writeToOutput(", ");
					}
				}
				this.emitCommaSeparatedList(callNode.argumentList, args, /*buffer:*/ "", /*preserveNewLines:*/ false);
			}

			this.writeToOutputWithSourceMapRecord(")", callNode.argumentList.closeParenToken);
			this.recordSourceMappingEnd(args);
			this.recordSourceMappingEnd(callNode);
		}

		private emitParameterList(list: ParameterList): void {
			this.writeToOutput("(");
			this.emitCommentsArray(list.openParenTrailingComments, /*trailing:*/ true);
			this.emitFunctionParameters(ASTHelpers.parametersFromParameterList(list));
			this.writeToOutput(")");
		}

		private emitFunctionParameters(parameters: IParameters): void {
			var argsLen = 0;

			if (parameters) {
				this.emitComments(parameters.ast, true);

				var tempContainer = this.setContainer(EmitContainer.Args);
				argsLen = parameters.length;
				var printLen = argsLen;
				if (parameters.lastParameterIsRest()) {
					printLen--;
				}
				for (var i = 0; i < printLen; i++) {
					var arg = parameters.astAt(i);
					this.emit(arg);

					if (i < (printLen - 1)) {
						this.writeToOutput(", ");
					}
				}

				if (parameters.lastParameterIsRest()) {
					var arg = parameters.astAt(argsLen - 1);
					var symbol = this.semanticInfoChain.getDeclForAST(arg).getSymbol();

					if (printLen > 0) {
						this.writeToOutput(", ");
					}
					this.writeToOutput(Emitter.mangleRestParameterName(symbol));
				}

				this.setContainer(tempContainer);

				this.emitComments(parameters.ast, false);
			}
		}

		private emitFunctionBodyStatements(name: string, funcDecl: AST, parameterList: IParameters, block: Block, bodyExpression: AST): void {
			this.writeLineToOutput(" {");
			if (name) {
				this.recordSourceMappingNameStart(name);
			}

			this.indenter.increaseIndent();

			if (block) {
				// We want any detached statements at the start of hte block to stay at the start.
				// This is important for features like VSDoc which place their comments inside a
				// block, but can't have them preceded by things like "var _this = this" when we
				// emit.

				this.emitDetachedComments(block.statements);
			}

			// Parameter list parameters with defaults could capture this
			if (this.shouldCaptureThis(funcDecl)) {
				this.writeCaptureThisStatement(funcDecl);
			}

			if (parameterList) {
				this.emitDefaultValueAssignments(parameterList);
				this.emitRestParameterInitializer(parameterList);
			}

			if (block) {
				this.emitList(block.statements);
				this.emitCommentsArray(block.closeBraceLeadingComments, /*trailing:*/ false);
			}
			else {
				// Copy any comments before the body of the arrow function to the return statement.
				// This is necessary for emitting correctness so we don't emit something like this:
				//
				//      return
				//          // foo
				//          this.foo();
				//
				// Because of ASI, this gets parsed as "return;" which is *not* what we want for
				// proper semantics.  
				//var preComments = bodyExpression.preComments();
				//var postComments = bodyExpression.postComments();

				//bodyExpression.setPreComments(null);
				//bodyExpression.setPostComments(null);

				this.emitIndent();
				this.emitCommentsArray(bodyExpression.preComments(), /*trailing:*/ false);
				this.writeToOutput("return ");
				this.emit(bodyExpression);
				this.writeLineToOutput(";");
				this.emitCommentsArray(bodyExpression.postComments(), /*trailing:*/ true);

				//bodyExpression.setPreComments(preComments);
				//bodyExpression.setPostComments(postComments);
			}

			this.indenter.decreaseIndent();
			this.emitIndent();

			if (block) {
				this.writeToOutputWithSourceMapRecord("}", block.closeBraceToken);
			}
			else {
				this.writeToOutputWithSourceMapRecord("}", bodyExpression);
			}

			if (name) {
				this.recordSourceMappingNameEnd();
			}
		}

		private emitDefaultValueAssignments(parameters: IParameters): void {
			var n = parameters.length;
			if (parameters.lastParameterIsRest()) {
				n--;
			}

			for (var i = 0; i < n; i++) {
				var arg = parameters.astAt(i);
				var id = parameters.identifierAt(i);
				var equalsValueClause = parameters.initializerAt(i);
				if (equalsValueClause) {
					this.emitIndent();
					this.recordSourceMappingStart(arg);
					this.writeToOutput("if (typeof " + id.text() + " === \"undefined\") { ");//
					this.writeToOutputWithSourceMapRecord(id.text(), id);
					this.emitJavascript(equalsValueClause, false);
					this.writeLineToOutput("; }");
					this.recordSourceMappingEnd(arg);
				}
			}
		}

		private emitRestParameterInitializer(parameters: IParameters): void {
			if (parameters.lastParameterIsRest()) {
				var n = parameters.length;
				var lastArg = parameters.astAt(n - 1);
				var id = parameters.identifierAt(n - 1);
				this.emitIndent();
				this.recordSourceMappingStart(lastArg);
				this.writeToOutput("var ");
				this.writeToOutputWithSourceMapRecord(id.text(), id);
				this.writeLineToOutput(" = [];");
				this.recordSourceMappingEnd(lastArg);
				this.emitIndent();
				this.writeToOutput("for (");
				this.writeToOutputWithSourceMapRecord("var _i = 0;", lastArg);
				this.writeToOutput(" ");
				this.writeToOutputWithSourceMapRecord("_i < (arguments.length - " + (n - 1) + ")", lastArg);
				this.writeToOutput("; ");
				this.writeToOutputWithSourceMapRecord("_i++", lastArg);
				this.writeLineToOutput(") {");
				this.indenter.increaseIndent();
				this.emitIndent();

				this.writeToOutputWithSourceMapRecord(id.text() + "[_i] = arguments[_i + " + (n - 1) + "];", lastArg);
				this.writeLineToOutput("");
				this.indenter.decreaseIndent();
				this.emitIndent();
				this.writeLineToOutput("}");
			}
		}

		private getImportDecls(fileName: string): PullDecl[] {
			var topLevelDecl = this.semanticInfoChain.topLevelDecl(this.document.fileName);
			var result: PullDecl[] = [];

			var dynamicModuleDecl = topLevelDecl.getChildDecls()[0]; // Dynamic module declaration has to be present
			var queue: PullDecl[] = dynamicModuleDecl.getChildDecls();

			for (var i = 0, n = queue.length; i < n; i++) {
				var decl = queue[i];

				if (decl.kind & PullElementKind.TypeAlias) {
					var importStatementAST = <ImportDeclaration>this.semanticInfoChain.getASTForDecl(decl);
					if (importStatementAST.moduleReference.kind() === SyntaxKind.ExternalModuleReference) { // external module
						var symbol = decl.getSymbol();
						var typeSymbol = symbol && symbol.type;
						if (typeSymbol && typeSymbol !== this.semanticInfoChain.anyTypeSymbol && !typeSymbol.isError()) {
							result.push(decl);
						}
					}
				}
			}

			return result;
		}

		public getModuleImportAndDependencyList(sourceUnit: SourceUnit) {
			var importList = "";
			var dependencyList = "";

			var importDecls = this.getImportDecls(this.document.fileName);

			// all dependencies are quoted
			if (importDecls.length) {
				for (var i = 0; i < importDecls.length; i++) {
					var importStatementDecl = importDecls[i];
					var importStatementSymbol = <PullTypeAliasSymbol>importStatementDecl.getSymbol();
					var importStatementAST = <ImportDeclaration>this.semanticInfoChain.getASTForDecl(importStatementDecl);

					if (importStatementSymbol.isUsedAsValue()) {
						if (i <= importDecls.length - 1) {
							dependencyList += ", ";
							importList += ", ";
						}

						importList += importStatementDecl.name;
						dependencyList += (<ExternalModuleReference>importStatementAST.moduleReference).stringLiteral.text();
					}
				}
			}

			// emit any potential amd dependencies
			var amdDependencies = this.document.amdDependencies();
			for (var i = 0; i < amdDependencies.length; i++) {
				dependencyList += ", \"" + amdDependencies[i] + "\"";
			}

			return {
				importList: importList,
				dependencyList: dependencyList
			};
		}

		public shouldCaptureThis(ast: AST) {
			if (ast.kind() === SyntaxKind.SourceUnit) {
				var scriptDecl = this.semanticInfoChain.topLevelDecl(this.document.fileName);
				return hasFlag(scriptDecl.flags, PullElementFlags.MustCaptureThis);
			}

			var decl = this.semanticInfoChain.getDeclForAST(ast);
			if (decl) {
				return hasFlag(decl.flags, PullElementFlags.MustCaptureThis);
			}

			return false;
		}

		public emitEnum(moduleDecl: EnumDeclaration) {
			var pullDecl = this.semanticInfoChain.getDeclForAST(moduleDecl);
			this.pushDecl(pullDecl);

			var svModuleName = this.moduleName;
			var svModuleFullName = pullDecl.getSymbol().getContainer().fullName();
			this.moduleName = moduleDecl.identifier.text();

			var temp = this.setContainer(EmitContainer.Module);
			var isExported = hasFlag(pullDecl.flags, PullElementFlags.Exported);

			//if (!isExported) {
			//this.recordSourceMappingStart(moduleDecl);
			//this.writeToOutput("var ");
			//this.recordSourceMappingStart(moduleDecl.identifier);
			//this.writeToOutput(this.moduleName);
			//this.recordSourceMappingEnd(moduleDecl.identifier);
			//this.writeLineToOutput(";");
			//this.recordSourceMappingEnd(moduleDecl);
			//this.emitIndent();
			//}
			this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(moduleDecl), this.getJSDocForEnumDeclaration(moduleDecl)));

			var enumName = this.moduleName;

			if (!isExported) {
				this.moduleName = enumName = this.getObfuscatedName(pullDecl.getSymbol(), enumName);
			}
			else {
				this.moduleName = enumName = svModuleFullName + "." + enumName;
			}

			this.recordSourceMappingStart(moduleDecl);

			if (!isExported) {
				this.writeToOutput("var ");
			}

			this.recordSourceMappingStart(moduleDecl.identifier);
			this.writeToOutput(this.moduleName);
			this.recordSourceMappingEnd(moduleDecl.identifier);
			this.writeLineToOutput(" = { ");
			this.recordSourceMappingEnd(moduleDecl);
			//this.emitIndent();

			this.recordSourceMappingStart(moduleDecl);
			this.recordSourceMappingNameStart(this.moduleName);

			//this.indenter.increaseIndent();

			//if (this.shouldCaptureThis(moduleDecl)) {
			//	this.writeCaptureThisStatement(moduleDecl);
			//}
			this.isEmittedEnumExported = isExported;
			this.isEnumEmitted = true;

			this.emitCommaSeparatedList(moduleDecl, moduleDecl.enumElements, "", true);

			//this.emitSeparatedList(moduleDecl.enumElements);
			this.isEnumEmitted = false;
			this.isEmittedEnumExported = false;

			//this.indenter.decreaseIndent();

			this.emitIndent();

			this.recordSourceMappingNameEnd();

			//var parentIsDynamic = temp === EmitContainer.DynamicModule;
			//if (temp === EmitContainer.Prog && isExported) {
			//	this.writeToOutput("}");
			//	this.recordSourceMappingNameEnd();
			//	this.writeToOutput(")(this." + this.moduleName + " || (this." + this.moduleName + " = {}));");
			//}
			//else if (isExported || temp === EmitContainer.Prog) {
			//	var dotMod = svModuleName !== "" ? (parentIsDynamic ? "exports" : svModuleFullName) + "." : svModuleFullName;
			//	this.writeToOutput("}");
			//	this.recordSourceMappingNameEnd();
			//	this.writeToOutput(")(" + dotMod + this.moduleName + " || (" + dotMod + this.moduleName + " = {}));");
			//}
			//else if (!isExported && temp !== EmitContainer.Prog) {
			//	this.writeToOutput("}");
			//	this.recordSourceMappingNameEnd();
			//	this.writeToOutput(")(" + this.moduleName + " || (" + this.moduleName + " = {}));");
			//}
			//else {
			//	this.writeToOutput("}");
			//	this.recordSourceMappingNameEnd();
			//	this.writeToOutput(")();");
			//}

			this.recordSourceMappingEnd(moduleDecl);

			this.writeLineToOutput("};");

			if (isExported) {
				this.exportSymbol(pullDecl.getSymbol());
			}

			//if (temp !== EmitContainer.Prog && isExported) {
			//	this.recordSourceMappingStart(moduleDecl);
			//	if (parentIsDynamic) {
			//		this.writeLineToOutput("");
			//		this.emitIndent();
			//		this.writeToOutput("var " + this.moduleName + " = exports." + this.moduleName + ";");
			//	} else {
			//		this.writeLineToOutput("");
			//		this.emitIndent();
			//		this.writeToOutput("var " + this.moduleName + " = " + svModuleFullName + "." + this.moduleName + ";");
			//	}
			//	this.recordSourceMappingEnd(moduleDecl);
			//}
			this.setContainer(temp);
			this.moduleName = svModuleName;

			this.popDecl(pullDecl);
		}

		private getModuleDeclToVerifyChildNameCollision(moduleDecl: PullDecl, changeNameIfAnyDeclarationInContext: boolean) {
			if (ArrayUtilities.contains(this.declStack, moduleDecl)) {
				// Given decl is in the scope, we would need to check for child name collision
				return moduleDecl;
			}
			else if (changeNameIfAnyDeclarationInContext) {
				// Check if any other declaration of the given symbol is in scope 
				// (eg. when emitting expression of type defined from different declaration in reopened module)
				var symbol = moduleDecl.getSymbol();
				if (symbol) {
					var otherDecls = symbol.getDeclarations();
					for (var i = 0; i < otherDecls.length; i++) {
						// If the other decl is in the scope, use this decl to determine which name to display
						if (ArrayUtilities.contains(this.declStack, otherDecls[i])) {
							return otherDecls[i];
						}
					}
				}
			}

			return null;
		}

		private hasChildNameCollision(moduleName: string, parentDecl: PullDecl) {
			var childDecls = parentDecl.getChildDecls();
			return ArrayUtilities.any(childDecls, (childDecl: PullDecl) => {
				var childAST = this.semanticInfoChain.getASTForDecl(childDecl);
				// Enum member it can never conflict with module name as it is property of the enum
				// Only if this child would be emitted we need to look further in
				if (childDecl.kind != PullElementKind.EnumMember && this.shouldEmit(childAST)) {
					// same name child
					if (childDecl.name === moduleName) {
						// collision if the parent was not class
						if (parentDecl.kind != PullElementKind.Class) {
							return true;
						}

						// If the parent was class, we would find name collision if this was not a property/method/accessor
						if (!(childDecl.kind == PullElementKind.Method ||
							childDecl.kind == PullElementKind.Property ||
							childDecl.kind == PullElementKind.SetAccessor ||
							childDecl.kind == PullElementKind.GetAccessor)) {
							return true;
						}
					}

					// Check if the name collision exists in any of the children
					if (this.hasChildNameCollision(moduleName, childDecl)) {
						return true;
					}
				}
				return false;
			});
		}

		// Get the moduleName to write in js file
		// If changeNameIfAnyDeclarationInContext is true, verify if any of the declarations for the symbol would need rename.
		private getModuleName(moduleDecl: PullDecl, changeNameIfAnyDeclarationInContext?: boolean) {
			var moduleName = moduleDecl.name;
			var moduleDisplayName = moduleDecl.getDisplayName();

			// If the decl is in stack it may need name change in the js file
			moduleDecl = this.getModuleDeclToVerifyChildNameCollision(moduleDecl, changeNameIfAnyDeclarationInContext);
			if (moduleDecl && moduleDecl.kind != PullElementKind.Enum) {
				// If there is any child that would be emitted with same name as module, js files would need to use rename for the module
				while (this.hasChildNameCollision(moduleName, moduleDecl)) {
					// there was name collision with member which could result in faulty codegen, try rename with prepend of '_'
					moduleName = "_" + moduleName;
					moduleDisplayName = "_" + moduleDisplayName;
				}
			}

			return moduleDisplayName;
		}

		private emitModuleDeclarationWorker(moduleDecl: ModuleDeclaration) {
			if (moduleDecl.stringLiteral) {
				this.emitSingleModuleDeclaration(moduleDecl, moduleDecl.stringLiteral);
			}
			else {
				var moduleNames = getModuleNames(moduleDecl.name);
				this.emitSingleModuleDeclaration(moduleDecl, moduleNames[0]);
			}
		}

		_emittedModuleNames: string[] = [];

		public emitSingleModuleDeclaration(moduleDecl: ModuleDeclaration, moduleName: IASTToken) {
			var isLastName = ASTHelpers.isLastNameOfModule(moduleDecl, moduleName);

			if (isLastName) {
				// Doc Comments on the ast belong to the innermost module being emitted.
				this.emitComments(moduleDecl, true);
			}

			var pullDecl = this.semanticInfoChain.getDeclForAST(moduleName);
			this.pushDecl(pullDecl);

			var svModuleName = this.moduleName;

			if (moduleDecl.stringLiteral) {
				this.moduleName = moduleDecl.stringLiteral.valueText();
				if (isTSFile(this.moduleName)) {
					this.moduleName = this.moduleName.substring(0, this.moduleName.length - ".ts".length);
				}
			}
			else {
				this.moduleName = moduleName.text();
			}

			var temp = this.setContainer(EmitContainer.Module);
			var isExported = hasFlag(pullDecl.flags, PullElementFlags.Exported);

			var fullModuleName = pullDecl.getSymbol().fullName();

			if (this._emittedModuleNames.indexOf(fullModuleName) < 0) {
				this.recordSourceMappingStart(moduleDecl);

				if (fullModuleName.indexOf(".") < 0) {
					this.writeToOutput("var ");
				}

				this.recordSourceMappingStart(moduleName);
				this.writeToOutput(fullModuleName);
				this.recordSourceMappingEnd(moduleName);

				var exportedName = this.getNameForExport(pullDecl.getSymbol());
				//this.writeLineToOutput(" = " + fullModuleName + " || {};");

				//view like: (container['akra'] = container['akra'] || {}) || {};

				this.writeLineToOutput(" = (" + exportedName + " = " + exportedName + " || {}) || {};");

				//var shortName = this.getShortName(exportedName, pullDecl.getSymbol());
				var shortName = this.getShortName(pullDecl.getSymbol().fullName());

				this.writeLineToOutput("var " + shortName + " = " + exportedName + ";");

				//this.writeLineToOutput(fullModuleName + " = " + fullModuleName);

				this.recordSourceMappingEnd(moduleDecl);
				this.emitIndent();

				this._emittedModuleNames.push(fullModuleName);

				//this.exportSymbol(pullDecl.getSymbol());
			}

			// prologue

			//if (!isExported) {
			//	this.recordSourceMappingStart(moduleDecl);
			//	this.writeToOutput("var ");
			//	this.recordSourceMappingStart(moduleName);
			//	this.writeToOutput(this.moduleName);
			//	this.recordSourceMappingEnd(moduleName);
			//	this.writeLineToOutput(";");
			//	this.recordSourceMappingEnd(moduleDecl);
			//	this.emitIndent();
			//}

			//this.writeToOutput("(");
			//this.recordSourceMappingStart(moduleDecl);
			//this.writeToOutput("function (");
			//// Use the name that doesnt conflict with its members, 
			//// this.moduleName needs to be updated to make sure that export member declaration is emitted correctly
			//this.moduleName = this.getModuleName(pullDecl);
			//this.writeToOutputWithSourceMapRecord(this.moduleName, moduleName);
			//this.writeLineToOutput(") {");

			this.recordSourceMappingStart(moduleDecl);
			this.moduleName = this.getModuleName(pullDecl);

			this.recordSourceMappingNameStart(moduleName.text());

			//this.indenter.increaseIndent();

			if (this.shouldCaptureThis(moduleDecl)) {
				this.writeCaptureThisStatement(moduleDecl);
			}

			if (moduleName === moduleDecl.stringLiteral) {
				this.emitList(moduleDecl.moduleElements);
			}
			else {
				var moduleNames = getModuleNames(moduleDecl.name);
				var nameIndex = moduleNames.indexOf(<Identifier>moduleName);
				Debug.assert(nameIndex >= 0);

				if (isLastName) {
					// If we're on the innermost module, we can emit the module elements.
					this.emitList(moduleDecl.moduleElements);
				}
				else {
					// otherwise, just recurse and emit the next module in the A.B.C module name.
					this.emitIndent();
					this.emitSingleModuleDeclaration(moduleDecl, moduleNames[nameIndex + 1]);
					this.writeLineToOutput("");
				}
			}

			this.moduleName = moduleName.text();
			//this.indenter.decreaseIndent();
			//this.emitIndent();

			// epilogue
			//var parentIsDynamic = temp === EmitContainer.DynamicModule;
			//this.recordSourceMappingStart(moduleDecl.endingToken);
			////if (temp === EmitContainer.Prog && isExported) {
			////	this.writeToOutput("}");
			////	this.recordSourceMappingNameEnd();
			////	this.recordSourceMappingEnd(moduleDecl.endingToken);
			////	this.writeToOutput(")(this." + this.moduleName + " || (this." + this.moduleName + " = {}));");
			////}
			////else if (isExported || temp === EmitContainer.Prog) {
			////	var dotMod = svModuleName !== "" ? (parentIsDynamic ? "exports" : svModuleName) + "." : svModuleName;
			////	this.writeToOutput("}");
			////	this.recordSourceMappingNameEnd();
			////	this.recordSourceMappingEnd(moduleDecl.endingToken);
			////	this.writeToOutput(")(" + dotMod + this.moduleName + " || (" + dotMod + this.moduleName + " = {}));");
			////}
			////else if (!isExported && temp !== EmitContainer.Prog) {
			////	this.writeToOutput("}");
			////	this.recordSourceMappingNameEnd();
			////	this.recordSourceMappingEnd(moduleDecl.endingToken);
			////	this.writeToOutput(")(" + this.moduleName + " || (" + this.moduleName + " = {}));");
			////}
			////else {
			////	this.writeToOutput("}");
			////	this.recordSourceMappingNameEnd();
			////	this.recordSourceMappingEnd(moduleDecl.endingToken);
			////	this.writeToOutput(")();");
			////}

			this.recordSourceMappingNameEnd();
			//this.recordSourceMappingEnd(moduleDecl.endingToken);

			this.recordSourceMappingEnd(moduleDecl);

			//if (temp !== EmitContainer.Prog && isExported) {
			//	this.recordSourceMappingStart(moduleDecl);
			//	//if (parentIsDynamic) {
			//	//	this.writeLineToOutput("");
			//	//	this.emitIndent();
			//	//	this.writeToOutput("var " + this.moduleName + " = exports." + this.moduleName + ";");
			//	//} else {
			//	//	this.writeLineToOutput("");
			//	//	this.emitIndent();
			//	//	this.writeToOutput("var " + this.moduleName + " = " + svModuleName + "." + this.moduleName + ";");
			//	//}
			//	this.recordSourceMappingEnd(moduleDecl);
			//}

			this.setContainer(temp);
			this.moduleName = svModuleName;

			this.popDecl(pullDecl);

			if (isLastName) {
				// Comments on the module ast belong to the innermost module being emitted.
				this.emitComments(moduleDecl, false);
			}
		}

		public emitEnumElement(varDecl: EnumElement): void {
			// <EnumName>[<EnumName>["<MemberName>"] = <MemberValue>] = "<MemberName>";
			var pullDecl = <PullEnumElementDecl>this.semanticInfoChain.getDeclForAST(varDecl);
			Debug.assert(pullDecl && pullDecl.kind === PullElementKind.EnumMember);

			this.emitComments(varDecl, true);
			this.recordSourceMappingStart(varDecl);
			var name = varDecl.propertyName.text();
			var quoted = isQuoted(name);
			var isNeedQuoted = this.isEmittedEnumExported && !quoted;
			//this.writeToOutput(this.moduleName);
			//this.writeToOutput('[');
			//this.writeToOutput(this.moduleName);
			//this.writeToOutput('[');
			this.writeToOutput((isNeedQuoted ? ('"' + name + '"') : name) + ": ");
			//this.writeToOutput(']');

			if (varDecl.equalsValueClause) {
				var totalEmittedConstantsBeforeEmit = this.totalEmitedConstansts;
				this.emit(varDecl.equalsValueClause);

				if (totalEmittedConstantsBeforeEmit + 1 === this.totalEmitedConstansts &&
					varDecl.equalsValueClause.value.kind() === SyntaxKind.IdentifierName) {
					(<PullEnumElementDecl>pullDecl).constantValue = this.lastEmitConstantValue;
				}
			}
			else if (pullDecl.constantValue !== null) {
				this.writeToOutput(pullDecl.constantValue.toString());
			}
			else {
				this.writeToOutput('null');
			}

			//this.writeToOutput('] = ');
			//this.writeToOutput(quoted ? name : '"' + name + '"');
			this.recordSourceMappingEnd(varDecl);
			this.emitComments(varDecl, false);
			//this.writeToOutput(';');
		}

		public emitElementAccessExpression(expression: ElementAccessExpression) {
			this.recordSourceMappingStart(expression);

			var symbol = this.semanticInfoChain.getSymbolForAST(expression.expression);

			if (symbol && PullHelpers.symbolIsModule(symbol.type) && this.hasShortName(symbol.type.fullName())) {
				this.writeToOutput(this.getShortName(symbol.type.fullName()));
			}
			else {
				this.emit(expression.expression);
			}

			this.writeToOutput("[");
			this.emit(expression.argumentExpression);
			this.writeToOutput("]");
			this.recordSourceMappingEnd(expression);
		}

		public emitSimpleArrowFunctionExpression(arrowFunction: SimpleArrowFunctionExpression): void {
			this.emitAnyArrowFunctionExpression(arrowFunction, null /*arrowFunction.getNameText()*/,
				ASTHelpers.parametersFromIdentifier(arrowFunction.identifier), arrowFunction.block, arrowFunction.expression);
		}

		public emitParenthesizedArrowFunctionExpression(arrowFunction: ParenthesizedArrowFunctionExpression): void {
			this.emitAnyArrowFunctionExpression(arrowFunction, null /* arrowFunction.getNameText() */,
				ASTHelpers.parametersFromParameterList(arrowFunction.callSignature.parameterList), arrowFunction.block, arrowFunction.expression);
		}

		private emitAnyArrowFunctionExpression(arrowFunction: AST, funcName: string, parameters: IParameters, block: Block, expression: AST): void {
			var savedInArrowFunction = this.inArrowFunction;
			this.inArrowFunction = true;

			var temp = this.setContainer(EmitContainer.Function);

			this.recordSourceMappingStart(arrowFunction);

			// Start
			var pullDecl = this.semanticInfoChain.getDeclForAST(arrowFunction);
			this.pushDecl(pullDecl);

			this.emitComments(arrowFunction, true);

			this.recordSourceMappingStart(arrowFunction);
			this.writeToOutput("function ");
			this.writeToOutput("(");
			this.emitFunctionParameters(parameters);
			this.writeToOutput(")");

			this.emitFunctionBodyStatements(funcName, arrowFunction, parameters, block, expression);

			this.recordSourceMappingEnd(arrowFunction);

			// The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
			this.recordSourceMappingEnd(arrowFunction);

			this.emitComments(arrowFunction, false);

			this.popDecl(pullDecl);
			this.setContainer(temp);
			this.inArrowFunction = savedInArrowFunction;
		}

		public emitConstructor(funcDecl: ConstructorDeclaration) {
			if (!funcDecl.block) {
				return;
			}
			var temp = this.setContainer(EmitContainer.Constructor);

			this.recordSourceMappingStart(funcDecl);

			var pullDecl = this.semanticInfoChain.getDeclForAST(funcDecl);
			this.pushDecl(pullDecl);

			//this.emitComments(funcDecl, true);

			this.recordSourceMappingStart(funcDecl);
			this.writeToOutput("function ");
			//this.writeToOutput(this.thisClassNode.identifier.text());
			this.writeToOutput("(");
			var parameters = ASTHelpers.parametersFromParameterList(funcDecl.callSignature.parameterList);
			this.emitFunctionParameters(parameters);
			this.writeLineToOutput(") {");

			this.recordSourceMappingNameStart("constructor");
			this.indenter.increaseIndent();

			this.emitDefaultValueAssignments(parameters);
			this.emitRestParameterInitializer(parameters);

			if (this.shouldCaptureThis(funcDecl)) {
				this.writeCaptureThisStatement(funcDecl);
			}

			this.emitConstructorStatements(funcDecl);
			this.emitCommentsArray(funcDecl.block.closeBraceLeadingComments, /*trailing:*/ false);

			this.indenter.decreaseIndent();
			this.emitIndent();
			this.writeToOutputWithSourceMapRecord("};", funcDecl.block.closeBraceToken);

			this.recordSourceMappingNameEnd();
			this.recordSourceMappingEnd(funcDecl);

			// The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
			this.recordSourceMappingEnd(funcDecl);

			this.emitComments(funcDecl, false);

			this.popDecl(pullDecl);
			this.setContainer(temp);
		}

		public emitGetAccessor(accessor: GetAccessor): void {
			this.recordSourceMappingStart(accessor);
			this.writeToOutput("get ");

			var temp = this.setContainer(EmitContainer.Function);

			this.recordSourceMappingStart(accessor);

			var pullDecl = this.semanticInfoChain.getDeclForAST(accessor);
			this.pushDecl(pullDecl);

			this.recordSourceMappingStart(accessor);

			var accessorSymbol = PullHelpers.getAccessorSymbol(accessor, this.semanticInfoChain);
			var container = accessorSymbol.getContainer();
			var containerKind = container.kind;

			this.recordSourceMappingNameStart(accessor.propertyName.text());
			this.writeToOutput(accessor.propertyName.text());
			this.writeToOutput("(");
			this.writeToOutput(")");

			this.emitFunctionBodyStatements(null, accessor, ASTHelpers.parametersFromParameterList(accessor.parameterList), accessor.block, /*bodyExpression:*/ null);

			this.recordSourceMappingEnd(accessor);

			// The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
			this.recordSourceMappingEnd(accessor);

			this.popDecl(pullDecl);
			this.setContainer(temp);
			this.recordSourceMappingEnd(accessor);
		}

		public emitSetAccessor(accessor: SetAccessor): void {
			this.recordSourceMappingStart(accessor);
			this.writeToOutput("set ");

			var temp = this.setContainer(EmitContainer.Function);

			this.recordSourceMappingStart(accessor);

			var pullDecl = this.semanticInfoChain.getDeclForAST(accessor);
			this.pushDecl(pullDecl);

			this.recordSourceMappingStart(accessor);

			var accessorSymbol = PullHelpers.getAccessorSymbol(accessor, this.semanticInfoChain);
			var container = accessorSymbol.getContainer();
			var containerKind = container.kind;

			this.recordSourceMappingNameStart(accessor.propertyName.text());
			this.writeToOutput(accessor.propertyName.text());
			this.writeToOutput("(");

			var parameters = ASTHelpers.parametersFromParameterList(accessor.parameterList);
			this.emitFunctionParameters(parameters);
			this.writeToOutput(")");

			this.emitFunctionBodyStatements(null, accessor, parameters, accessor.block, /*bodyExpression:*/ null);

			this.recordSourceMappingEnd(accessor);

			// The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
			this.recordSourceMappingEnd(accessor);

			this.popDecl(pullDecl);
			this.setContainer(temp);
			this.recordSourceMappingEnd(accessor);
		}

		public emitFunctionExpression(funcDecl: FunctionExpression): void {
			var savedInArrowFunction = this.inArrowFunction;
			this.inArrowFunction = false;

			var temp = this.setContainer(EmitContainer.Function);

			var funcName = funcDecl.identifier ? funcDecl.identifier.text() : null;//.getNameText();

			this.recordSourceMappingStart(funcDecl);

			var pullDecl = this.semanticInfoChain.getDeclForAST(funcDecl);
			this.pushDecl(pullDecl);

			this.emitComments(funcDecl, true);
			this.recordSourceMappingStart(funcDecl);
			this.writeToOutput("function ");

			//var id = funcDecl.getNameText();
			if (funcDecl.identifier) {
				this.recordSourceMappingStart(funcDecl.identifier);
				this.writeToOutput(funcDecl.identifier.text());
				this.recordSourceMappingEnd(funcDecl.identifier);
			}

			this.writeToOutput("(");

			var parameters = ASTHelpers.parametersFromParameterList(funcDecl.callSignature.parameterList);
			this.emitFunctionParameters(parameters);
			this.writeToOutput(")");

			this.emitFunctionBodyStatements(funcName, funcDecl, parameters, funcDecl.block, /*bodyExpression:*/ null);

			this.recordSourceMappingEnd(funcDecl);

			// The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
			this.recordSourceMappingEnd(funcDecl);

			this.emitComments(funcDecl, false);

			this.popDecl(pullDecl);

			this.setContainer(temp);
			this.inArrowFunction = savedInArrowFunction;
		}

		public emitFunction(funcDecl: FunctionDeclaration) {
			if (funcDecl.block === null) {
				return;
			}
			var savedInArrowFunction = this.inArrowFunction;
			this.inArrowFunction = false;

			var isModuleContainer = (this.emitState.container === EmitContainer.Module || this.emitState.container === EmitContainer.DynamicModule);
			var isStaticModuleContainer = this.emitState.container === EmitContainer.Module;
			var temp = this.setContainer(EmitContainer.Function);

			var funcName = funcDecl.identifier.text();

			this.recordSourceMappingStart(funcDecl);

			var printName = funcDecl.identifier !== null
			var pullDecl = this.semanticInfoChain.getDeclForAST(funcDecl);
			this.pushDecl(pullDecl);

			//this.emitComments(funcDecl, true);
			this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(funcDecl), this.getJSDocForFunctionDeclaration(funcDecl)));

			var pullFunctionDecl = this.semanticInfoChain.getDeclForAST(funcDecl);

			if (funcDecl.block && isModuleContainer && pullFunctionDecl && hasFlag(pullFunctionDecl.flags, PullElementFlags.Exported)) {

				this.writeLineToOutput("");
				this.emitIndent();
				var modName = isStaticModuleContainer ? pullDecl.getSymbol().getContainer().fullName()/*this.moduleName*/ : "exports";
				this.recordSourceMappingStart(funcDecl);
				this.writeToOutput(modName + ".");
				if (funcDecl.identifier) {
					this.recordSourceMappingStart(funcDecl.identifier);
				}

				this.writeToOutput(funcName);

				if (funcDecl.identifier) {
					this.recordSourceMappingEnd(funcDecl.identifier);
				}

				this.writeToOutput(" = " + "function");
				//this.recordSourceMappingEnd(funcDecl);
			}
			else {
				this.recordSourceMappingStart(funcDecl);
				this.writeToOutput("function ");

				if (printName) {
					var id = this.getObfuscatedName(pullDecl.getSymbol(), funcName);

					if (id) {
						if (funcDecl.identifier) {
							this.recordSourceMappingStart(funcDecl.identifier);
						}
						this.writeToOutput(id);
						if (funcDecl.identifier) {
							this.recordSourceMappingEnd(funcDecl.identifier);
						}
					}
				}
			}


			this.emitParameterList(funcDecl.callSignature.parameterList);

			var parameters = ASTHelpers.parametersFromParameterList(funcDecl.callSignature.parameterList);
			this.emitFunctionBodyStatements(funcDecl.identifier.text(), funcDecl, parameters, funcDecl.block, /*bodyExpression:*/ null);

			this.recordSourceMappingEnd(funcDecl);

			// The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
			this.recordSourceMappingEnd(funcDecl);

			this.emitComments(funcDecl, false);

			this.popDecl(pullDecl);

			this.setContainer(temp);
			this.inArrowFunction = savedInArrowFunction;

			if (pullFunctionDecl && hasFlag(pullFunctionDecl.flags, PullElementFlags.Exported)) {
				this.writeToOutput(";");
				this.exportSymbol(pullFunctionDecl.getSymbol());
			}

			//if (funcDecl.block) {
			//	var pullFunctionDecl = this.semanticInfoChain.getDeclForAST(funcDecl);
			//	if ((this.emitState.container === EmitContainer.Module || this.emitState.container === EmitContainer.DynamicModule) && pullFunctionDecl && hasFlag(pullFunctionDecl.flags, PullElementFlags.Exported)) {
			//		this.writeLineToOutput("");
			//		this.emitIndent();
			//		var modName = this.emitState.container === EmitContainer.Module ? pullDecl.getSymbol().getContainer().fullName()/*this.moduleName*/ : "exports";
			//		this.recordSourceMappingStart(funcDecl);
			//		this.writeToOutput(modName + "." + funcName + " = " + funcName + ";");
			//		this.recordSourceMappingEnd(funcDecl);
			//	}
			//}
		}

		public emitAmbientVarDecl(varDecl: VariableDeclarator) {
			this.recordSourceMappingStart(this.currentVariableDeclaration);
			if (varDecl.equalsValueClause) {
				this.emitComments(varDecl, true);
				this.recordSourceMappingStart(varDecl);
				this.writeToOutputWithSourceMapRecord(varDecl.propertyName.text(), varDecl.propertyName);
				this.emitJavascript(varDecl.equalsValueClause, false);
				this.recordSourceMappingEnd(varDecl);
				this.emitComments(varDecl, false);
			}
		}

		// Emits "var " if it is allowed
		public emitVarDeclVar() {
			if (this.currentVariableDeclaration) {
				this.writeToOutput("var ");
			}
		}

		public emitVariableDeclaration(declaration: VariableDeclaration) {
			var varDecl = <VariableDeclarator>declaration.declarators.nonSeparatorAt(0);

			var symbol = this.semanticInfoChain.getSymbolForAST(varDecl);

			var parentSymbol = symbol ? symbol.getContainer() : null;
			var parentKind = parentSymbol ? parentSymbol.kind : PullElementKind.None;

			this.emitComments(declaration, true);

			var pullVarDecl = this.semanticInfoChain.getDeclForAST(varDecl);
			var isAmbientWithoutInit = pullVarDecl && hasFlag(pullVarDecl.flags, PullElementFlags.Ambient) && varDecl.equalsValueClause === null;
			if (!isAmbientWithoutInit) {
				var prevVariableDeclaration = this.currentVariableDeclaration;
				this.currentVariableDeclaration = declaration;

				var prevLine = this.emitState.line, prevColumn = this.emitState.column;

				for (var i = 0, n = declaration.declarators.nonSeparatorCount(); i < n; i++) {
					var declarator = declaration.declarators.nonSeparatorAt(i);

					if (i > 0 && (prevLine !== this.emitState.line || prevColumn !== this.emitState.column)) {
						this.writeToOutput(", ");
					}

					prevLine = this.emitState.line;
					prevColumn = this.emitState.column;

					this.emit(declarator);
				}
				this.currentVariableDeclaration = prevVariableDeclaration;

				// Declarator emit would take care of emitting start of the variable declaration start
				this.recordSourceMappingEnd(declaration);
			}

			this.emitComments(declaration, false);
		}

		private emitMemberVariableDeclaration(varDecl: MemberVariableDeclaration) {
			//Debug.assert(!hasModifier(varDecl.modifiers, PullElementFlags.Static) && varDecl.variableDeclarator.equalsValueClause);

			var pullDecl = this.semanticInfoChain.getDeclForAST(varDecl);
			this.pushDecl(pullDecl);


			var symbol = pullDecl.getSymbol();
			if (this.emittedClassProperties.indexOf(symbol) < 0) {
				var jsDocComments: string[] = this.getJSDocForClassMemberVariable(symbol);
				this.emitInlineJSDocComment(Emitter.getUserComments(varDecl), jsDocComments);

				this.emittedClassProperties.push(symbol);
			}
			else {
				this.emitComments(varDecl, true);
			}

			this.recordSourceMappingStart(varDecl);

			var varDeclName = varDecl.variableDeclarator.propertyName.text();
			var quotedOrNumber = isQuoted(varDeclName) || varDecl.variableDeclarator.propertyName.kind() !== SyntaxKind.IdentifierName;
			var isNeedEscapeMember = this.isNeedEscapeName(symbol);

			var symbol = this.semanticInfoChain.getSymbolForAST(varDecl);
			var parentSymbol = symbol ? symbol.getContainer() : null;
			var parentDecl = pullDecl && pullDecl.getParentDecl();

			if (quotedOrNumber) {
				this.writeToOutput("this[");
			}
			else if (isNeedEscapeMember) {
				this.writeToOutput("this[\"");
			}
			else {
				this.writeToOutput("this.");
			}

			this.writeToOutputWithSourceMapRecord(varDecl.variableDeclarator.propertyName.text(), varDecl.variableDeclarator.propertyName);

			if (quotedOrNumber) {
				this.writeToOutput("]");
			}
			else if (isNeedEscapeMember) {
				this.writeToOutput("\"]");
			}

			if (varDecl.variableDeclarator.equalsValueClause) {
				// Ensure we have a fresh var list count when recursing into the variable 
				// initializer.  We don't want our current list of variables to affect how we
				// emit nested variable lists.
				var prevVariableDeclaration = this.currentVariableDeclaration;
				this.emit(varDecl.variableDeclarator.equalsValueClause);
				this.currentVariableDeclaration = prevVariableDeclaration;
			}

			// class
			if (this.emitState.container !== EmitContainer.Args) {
				this.writeToOutput(";");
			}

			this.recordSourceMappingEnd(varDecl);
			this.emitComments(varDecl, false);

			this.popDecl(pullDecl);
		}

		public emitVariableDeclarator(varDecl: VariableDeclarator) {
			var pullDecl = this.semanticInfoChain.getDeclForAST(varDecl);
			this.pushDecl(pullDecl);

			if (pullDecl && (pullDecl.flags & PullElementFlags.Ambient) === PullElementFlags.Ambient) {
				this.emitAmbientVarDecl(varDecl);
			}
			else {
				var symbol = pullDecl.getSymbol();
				var parentSymbol = symbol ? symbol.getContainer() : null;
				var hasInitializer = varDecl.equalsValueClause !== null;
				var jsDocComments = null;
				var isAdditionalDeclaration = false;


				this.recordSourceMappingStart(this.currentVariableDeclaration);

				// Google's Closure Compiler requires one variable statement per function.
				// Note that "emittedSymbolNames" is a hack since I don't think the compiler
				// actually stores any information about aliases so I can't tell them apart.
				if (symbol !== null) {
					var id = parentSymbol !== null ? parentSymbol.pullSymbolID : -1;
					var names = this.emittedSymbolNames[id] || [];

					isAdditionalDeclaration = names.indexOf(symbol.name) >= 0;
					this.emittedSymbolNames[id] = names.concat(symbol.name);
					//if (isAdditionalDeclaration && !hasInitializer && !this.emittedForInStatement) {

					//	this.currentVariableDeclaration = undefined;
					//	this.popDecl(pullDecl);

					//	return;
					//}
				}

				if (!isAdditionalDeclaration) {
					var userComments = null;

					if (this.currentVariableDeclaration && this.currentVariableDeclaration.kind() === SyntaxKind.VariableDeclaration) {
						userComments = Emitter.getUserComments(this.currentVariableDeclaration.parent);
					}
					else {
						userComments = Emitter.getUserComments(varDecl);
					}

					var isConst = userComments.join(' ').search("@const") >= 0 || userComments.join(' ').search("@define") >= 0;
				}

				if (!isAdditionalDeclaration) {
					if (symbol.isProperty()) {
						if (this.emittedClassProperties.indexOf(symbol) < 0) {
							jsDocComments = this.getJSDocForClassMemberVariable(symbol);
							this.emittedClassProperties.push(symbol);
						}
						else {
							jsDocComments = [];
						}
					}
					else {
						jsDocComments = this.getJSDocForVariableDeclaration(symbol);
					}
				}

				//this.emitInlineJSDocComment(Emitter.getUserComments(varDecl), jsDocComments);

				//this.emitComments(varDecl, true);
				//this.recordSourceMappingStart(this.currentVariableDeclaration);
				this.recordSourceMappingStart(varDecl);

				var varDeclName = varDecl.propertyName.text();

				var symbol = this.semanticInfoChain.getSymbolForAST(varDecl);
				var parentSymbol = symbol ? symbol.getContainer() : null;
				var parentDecl = pullDecl && pullDecl.getParentDecl();
				var parentIsModule = parentDecl && (parentDecl.flags & PullElementFlags.SomeInitializedModule);

				if (parentIsModule) {
					// module
					if (!hasFlag(pullDecl.flags, PullElementFlags.Exported)/* && !varDecl.isProperty() */) {
						this.emitVarDeclVar();
						if (!isAdditionalDeclaration) {
							this.emitInlineJSDocComment(userComments, jsDocComments);
						}
					}
					else {
						if (!isAdditionalDeclaration) {
							this.emitInlineJSDocComment(userComments, jsDocComments);
						}

						if (this.emitState.container === EmitContainer.DynamicModule) {
							this.writeToOutput("exports.");
						}
						else {
							this.writeToOutput(symbol.getContainer().fullName() + ".");

							//this.writeToOutput(this.moduleName + ".");
						}
					}
				}
				else {
					this.emitVarDeclVar();
					if (!isAdditionalDeclaration) {
						this.emitInlineJSDocComment(userComments, jsDocComments);
					}
				}

				this.writeToOutputWithSourceMapRecord(this.getObfuscatedName(symbol, varDecl.propertyName.text()), varDecl.propertyName);

				if (varDecl.equalsValueClause) {
					// Ensure we have a fresh var list count when recursing into the variable 
					// initializer.  We don't want our current list of variables to affect how we
					// emit nested variable lists.
					var prevVariableDeclaration = this.currentVariableDeclaration;
					this.emit(varDecl.equalsValueClause);
					this.currentVariableDeclaration = prevVariableDeclaration;
				}

				this.recordSourceMappingEnd(varDecl);
				this.emitComments(varDecl, false);
			}

			this.currentVariableDeclaration = undefined;
			this.popDecl(pullDecl);

			if (!isAdditionalDeclaration && hasFlag(pullDecl.flags, PullElementFlags.Exported)/* && symbol.type.isFunction()*/) {
				this.exportSymbol(symbol);
			}
		}

		private symbolIsUsedInItsEnclosingContainer(symbol: PullSymbol, dynamic = false) {
			var symDecls = symbol.getDeclarations();

			if (symDecls.length) {
				var enclosingDecl = this.getEnclosingDecl();
				if (enclosingDecl) {
					var parentDecl = symDecls[0].getParentDecl();
					if (parentDecl) {
						var symbolDeclarationEnclosingContainer = parentDecl;
						var enclosingContainer = enclosingDecl;

						// compute the closing container of the symbol's declaration
						while (symbolDeclarationEnclosingContainer) {
							if (symbolDeclarationEnclosingContainer.kind === (dynamic ? PullElementKind.DynamicModule : PullElementKind.Container)) {
								break;
							}
							symbolDeclarationEnclosingContainer = symbolDeclarationEnclosingContainer.getParentDecl();
						}

						// if the symbol in question is not a global, compute the nearest
						// enclosing declaration from the point of usage
						if (symbolDeclarationEnclosingContainer) {
							while (enclosingContainer) {
								if (enclosingContainer.kind === (dynamic ? PullElementKind.DynamicModule : PullElementKind.Container)) {
									break;
								}

								enclosingContainer = enclosingContainer.getParentDecl();
							}
						}

						if (symbolDeclarationEnclosingContainer && enclosingContainer) {
							var same = symbolDeclarationEnclosingContainer === enclosingContainer;

							// initialized module object variables are bound to their parent's decls
							if (!same && symbol.anyDeclHasFlag(PullElementFlags.InitializedModule)) {
								same = symbolDeclarationEnclosingContainer === enclosingContainer.getParentDecl();
							}

							return same;
						}
					}
				}
			}

			return false;
		}

		// Gets the decl path that needs to be emitted for the symbol in the enclosing context
		private getPotentialDeclPathInfoForEmit(pullSymbol: PullSymbol) {
			var decl = pullSymbol.getDeclarations()[0];
			var parentDecl = decl.getParentDecl();
			var symbolContainerDeclPath = parentDecl ? parentDecl.getParentPath() : <PullDecl[]>[];

			var enclosingContextDeclPath = this.declStack;
			var commonNodeIndex = -1;

			// Find the container decl path and the declStack of the context
			if (enclosingContextDeclPath.length) {
				for (var i = symbolContainerDeclPath.length - 1; i >= 0; i--) {
					var symbolContainerDeclPathNode = symbolContainerDeclPath[i];
					for (var j = enclosingContextDeclPath.length - 1; j >= 0; j--) {
						var enclosingContextDeclPathNode = enclosingContextDeclPath[j];
						if (symbolContainerDeclPathNode === enclosingContextDeclPathNode) {
							commonNodeIndex = i;
							break;
						}
					}

					if (commonNodeIndex >= 0) {
						break;
					}
				}
			}

			// We can emit dotted names only of exported declarations, so find the index to start emitting dotted name
			var startingIndex = symbolContainerDeclPath.length - 1
			for (var i = startingIndex - 1; i > commonNodeIndex; i--) {
				if (symbolContainerDeclPath[i + 1].flags & PullElementFlags.Exported) {
					startingIndex = i;
				}
				else {
					break;
				}
			}
			return { potentialPath: symbolContainerDeclPath, startingIndex: startingIndex };
		}

		// Emit the dotted names using the decl path
		private emitDottedNameFromDeclPath(declPath: PullDecl[], startingIndex: number, lastIndex: number) {
			for (var i = startingIndex; i <= lastIndex; i++) {
				if (declPath[i].kind === PullElementKind.DynamicModule ||
					declPath[i].flags & PullElementFlags.InitializedDynamicModule) {
					this.writeToOutput("exports.");
				} else {
					this.writeToOutput(declPath[lastIndex].getSymbol().fullName() + ".");
					return;
					// Get the name of the decl that would need to referenced and is conflict free.
					//this.writeToOutput(this.getModuleName(declPath[i], /* changeNameIfAnyDeclarationInContext */ true) + ".");
				}
			}
		}

		private _bEmitEscapedName: boolean = false;

		// Emits the container name of the symbol in the given enclosing context
		private emitSymbolContainerNameInEnclosingContext(pullSymbol: PullSymbol) {
			var declPathInfo = this.getPotentialDeclPathInfoForEmit(pullSymbol);
			var potentialDeclPath = declPathInfo.potentialPath;
			var startingIndex = declPathInfo.startingIndex;

			if (this.isNeedEscapeName(pullSymbol) && this.isNeedEscapeVariableInModule(pullSymbol)) {
				this.writeToOutput(this.getShortName(pullSymbol.getContainer().fullName()));
				this._bEmitEscapedName = true;
			}
			else {
				// Emit dotted names for the path
				this.emitDottedNameFromDeclPath(potentialDeclPath, startingIndex, potentialDeclPath.length - 1);
			}
		}

		// Get the symbol information to be used for emitting the ast
		private getSymbolForEmit(ast: AST) {
			var pullSymbol = this.semanticInfoChain.getSymbolForAST(ast);
			var pullSymbolAlias = this.semanticInfoChain.getAliasSymbolForAST(ast);
			if (pullSymbol && pullSymbolAlias) {
				var symbolToCompare = isTypesOnlyLocation(ast) ?
					pullSymbolAlias.getExportAssignedTypeSymbol() :
					pullSymbolAlias.getExportAssignedValueSymbol();

				if (pullSymbol === symbolToCompare) {
					pullSymbol = pullSymbolAlias;
					pullSymbolAlias = null;
				}
			}
			return { symbol: pullSymbol, aliasSymbol: pullSymbolAlias };
		}

		public emitName(name: Identifier, addThis: boolean) {
			this.emitComments(name, true);
			this.recordSourceMappingStart(name);
			if (name.text().length > 0) {

				var symbolForEmit = this.getSymbolForEmit(name);
				var pullSymbol = symbolForEmit.symbol;
				if (!pullSymbol) {
					pullSymbol = this.semanticInfoChain.anyTypeSymbol;
				}
				var pullSymbolAlias = symbolForEmit.aliasSymbol;
				var pullSymbolKind = pullSymbol.kind;
				var isLocalAlias = pullSymbolAlias && (pullSymbolAlias.getDeclarations()[0].getParentDecl() === this.getEnclosingDecl());
				if (addThis && (this.emitState.container !== EmitContainer.Args) && pullSymbol) {
					var pullSymbolContainer = pullSymbol.getContainer();

					if (pullSymbolContainer) {
						var pullSymbolContainerKind = pullSymbolContainer.kind;

						if (this.isEnumEmitted && pullSymbol.kind === PullElementKind.EnumMember) {
							var value = this.tryGetEnumValue(pullSymbol);
							if (value !== null) {
								this.totalEmitedConstansts++;
								this.lastEmitConstantValue = value;

								this.writeToOutput(value.toString());

								this.recordSourceMappingEnd(name);
								this.emitComments(name, false);
								return;
							}
						}

						if (pullSymbolContainerKind === PullElementKind.Class) {
							if (pullSymbol.anyDeclHasFlag(PullElementFlags.Static)) {
								// This is static symbol
								this.emitSymbolContainerNameInEnclosingContext(pullSymbol);
							}
							else if (pullSymbolKind === PullElementKind.Property) {
								this.emitThis();
								this.writeToOutput(".");
							}
						}
						else if (PullHelpers.symbolIsModule(pullSymbolContainer) || pullSymbolContainerKind === PullElementKind.Enum ||
							pullSymbolContainer.anyDeclHasFlag(PullElementFlags.InitializedModule | PullElementFlags.Enum)) {
							// If property or, say, a constructor being invoked locally within the module of its definition
							if (pullSymbolKind === PullElementKind.Property || pullSymbolKind === PullElementKind.EnumMember) {
								this.emitSymbolContainerNameInEnclosingContext(pullSymbol);
							}
							else if (pullSymbol.anyDeclHasFlag(PullElementFlags.Exported) &&
								pullSymbolKind === PullElementKind.Variable &&
								!pullSymbol.anyDeclHasFlag(PullElementFlags.InitializedModule | PullElementFlags.Enum)) {
								this.emitSymbolContainerNameInEnclosingContext(pullSymbol);
							}
							else if (pullSymbol.anyDeclHasFlag(PullElementFlags.Exported)/* && !this.symbolIsUsedInItsEnclosingContainer(pullSymbol)*/) {
								this.emitSymbolContainerNameInEnclosingContext(pullSymbol);
							}
							else if (this.isNeedObfuscateName(pullSymbol)) {
								if (pullSymbol.isAlias() && pullSymbol.isType()) {
									var aliasSymbol = <PullTypeAliasSymbol>pullSymbol;
									this.writeToOutput(this.getFullSymbolName(aliasSymbol.assignedValue()));
								}
								else {
									this.writeToOutput(this.getObfuscatedName(pullSymbol, name.text()));
								}

								this.recordSourceMappingEnd(name);
								this.emitComments(name, false);

								return;
							}
						}
						else if (pullSymbolContainerKind === PullElementKind.DynamicModule ||
							pullSymbolContainer.anyDeclHasFlag(PullElementFlags.InitializedDynamicModule)) {
							if (pullSymbolKind === PullElementKind.Property) {
								// If dynamic module
								this.writeToOutput("exports.");
							}
							else if (pullSymbol.anyDeclHasFlag(PullElementFlags.Exported) &&
								!isLocalAlias &&
								!pullSymbol.anyDeclHasFlag(PullElementFlags.ImplicitVariable) &&
								pullSymbol.kind !== PullElementKind.ConstructorMethod &&
								pullSymbol.kind !== PullElementKind.Class &&
								pullSymbol.kind !== PullElementKind.Enum) {
								this.writeToOutput("exports.");
							}
						}
					}
				}

				if (this._bEmitEscapedName) {
					this.writeToOutput("[\"" + name.text() + "\"]");

					this._bEmitEscapedName = false;
				}
				else {
					this.writeToOutput(name.text());
				}
			}

			this.recordSourceMappingEnd(name);
			this.emitComments(name, false);
		}

		public recordSourceMappingNameStart(name: string) {
			if (this.sourceMapper) {
				var nameIndex = -1;
				if (name) {
					if (this.sourceMapper.currentNameIndex.length > 0) {
						var parentNameIndex = this.sourceMapper.currentNameIndex[this.sourceMapper.currentNameIndex.length - 1];
						if (parentNameIndex !== -1) {
							name = this.sourceMapper.names[parentNameIndex] + "." + name;
						}
					}

					// Look if there already exists name
					var nameIndex = this.sourceMapper.names.length - 1;
					for (nameIndex; nameIndex >= 0; nameIndex--) {
						if (this.sourceMapper.names[nameIndex] === name) {
							break;
						}
					}

					if (nameIndex === -1) {
						nameIndex = this.sourceMapper.names.length;
						this.sourceMapper.names.push(name);
					}
				}
				this.sourceMapper.currentNameIndex.push(nameIndex);
			}
		}

		public recordSourceMappingNameEnd() {
			if (this.sourceMapper) {
				this.sourceMapper.currentNameIndex.pop();
			}
		}

		public recordSourceMappingStart(ast: IASTSpan) {
			if (this.sourceMapper && ASTHelpers.isValidAstNode(ast)) {
				var lineCol = { line: -1, character: -1 };
				var sourceMapping = new SourceMapping();
				sourceMapping.start.emittedColumn = this.emitState.column;
				sourceMapping.start.emittedLine = this.emitState.line;
				// REVIEW: check time consumed by this binary search (about two per leaf statement)
				var lineMap = this.document.lineMap();
				lineMap.fillLineAndCharacterFromPosition(ast.start(), lineCol);
				sourceMapping.start.sourceColumn = lineCol.character;
				sourceMapping.start.sourceLine = lineCol.line + 1;
				lineMap.fillLineAndCharacterFromPosition(ast.end(), lineCol);
				sourceMapping.end.sourceColumn = lineCol.character;
				sourceMapping.end.sourceLine = lineCol.line + 1;

				Debug.assert(!isNaN(sourceMapping.start.emittedColumn));
				Debug.assert(!isNaN(sourceMapping.start.emittedLine));
				Debug.assert(!isNaN(sourceMapping.start.sourceColumn));
				Debug.assert(!isNaN(sourceMapping.start.sourceLine));
				Debug.assert(!isNaN(sourceMapping.end.sourceColumn));
				Debug.assert(!isNaN(sourceMapping.end.sourceLine));

				if (this.sourceMapper.currentNameIndex.length > 0) {
					sourceMapping.nameIndex = this.sourceMapper.currentNameIndex[this.sourceMapper.currentNameIndex.length - 1];
				}
				// Set parent and child relationship
				var siblings = this.sourceMapper.currentMappings[this.sourceMapper.currentMappings.length - 1];
				siblings.push(sourceMapping);
				this.sourceMapper.currentMappings.push(sourceMapping.childMappings);
				this.sourceMapper.increaseMappingLevel(ast);
			}
		}

		public recordSourceMappingEnd(ast: IASTSpan) {
			if (this.sourceMapper && ASTHelpers.isValidAstNode(ast)) {
				// Pop source mapping childs
				this.sourceMapper.currentMappings.pop();

				// Get the last source mapping from sibling list = which is the one we are recording end for
				var siblings = this.sourceMapper.currentMappings[this.sourceMapper.currentMappings.length - 1];
				var sourceMapping = siblings[siblings.length - 1];

				sourceMapping.end.emittedColumn = this.emitState.column;
				sourceMapping.end.emittedLine = this.emitState.line;

				Debug.assert(!isNaN(sourceMapping.end.emittedColumn));
				Debug.assert(!isNaN(sourceMapping.end.emittedLine));

				this.sourceMapper.decreaseMappingLevel(ast);
			}
		}

		// Note: may throw exception.
		public getOutputFiles(): OutputFile[] {
			// Output a source mapping.  As long as we haven't gotten any errors yet.
			var result: OutputFile[] = [];
			if (this.sourceMapper !== null) {
				this.sourceMapper.emitSourceMapping();
				result.push(this.sourceMapper.getOutputFile());
			}

			result.push(this.outfile.getOutputFile());
			return result;
		}

		private emitParameterPropertyAndMemberVariableAssignments(): void {
			// emit any parameter properties first
			var constructorDecl = getLastConstructor(this.thisClassNode);

			if (constructorDecl) {
				for (var i = 0, n = constructorDecl.callSignature.parameterList.parameters.nonSeparatorCount(); i < n; i++) {
					var parameter = <Parameter>constructorDecl.callSignature.parameterList.parameters.nonSeparatorAt(i);
					var parameterDecl = this.semanticInfoChain.getDeclForAST(parameter);
					if (hasFlag(parameterDecl.flags, PullElementFlags.PropertyParameter)) {
						this.emitIndent();
						this.recordSourceMappingStart(parameter);

						var symbol = this.semanticInfoChain.getSymbolForAST(parameter);

						if (this.emittedClassProperties.indexOf(symbol) < 0) {
							this.emitInlineJSDocComment(this.getJSDocForClassMemberVariable(symbol));
							this.emittedClassProperties.push(symbol);
						}

						this.writeToOutputWithSourceMapRecord("this." + parameter.identifier.text(), parameter.identifier);
						this.writeToOutput(" = ");
						this.writeToOutputWithSourceMapRecord(parameter.identifier.text(), parameter.identifier);
						this.writeLineToOutput(";");
						this.recordSourceMappingEnd(parameter);
					}
				}
			}

			for (var i = 0, n = this.thisClassNode.classElements.childCount(); i < n; i++) {
				if (this.thisClassNode.classElements.childAt(i).kind() === SyntaxKind.MemberVariableDeclaration) {
					var varDecl = <MemberVariableDeclaration>this.thisClassNode.classElements.childAt(i);
					if (!hasModifier(varDecl.modifiers, PullElementFlags.Static)/* && varDecl.variableDeclarator.equalsValueClause*/) {
						this.emitIndent();
						this.emitMemberVariableDeclaration(varDecl);
						this.writeLineToOutput("");
					}
				}
			}
		}

		private isOnSameLine(pos1: number, pos2: number): boolean {
			var lineMap = this.document.lineMap();
			return lineMap.getLineNumberFromPosition(pos1) === lineMap.getLineNumberFromPosition(pos2);
		}

		private emitCommaSeparatedList(parent: AST, list: ISeparatedSyntaxList2, buffer: string, preserveNewLines: boolean): void {
			if (list === null || list.nonSeparatorCount() === 0) {
				return;
			}

			// If the first element isn't on hte same line as the parent node, then we need to 
			// start with a newline.
			var startLine = preserveNewLines && !this.isOnSameLine(parent.end(), list.nonSeparatorAt(0).end());

			if (preserveNewLines) {
				// Any elements on a new line will have to be indented.
				this.indenter.increaseIndent();
			}

			// If we're starting on a newline, then emit an actual newline. Otherwise write out
			// the buffer character before hte first element.
			if (startLine) {
				this.writeLineToOutput("");
			}
			else {
				this.writeToOutput(buffer);
			}

			for (var i = 0, n = list.nonSeparatorCount(); i < n; i++) {
				var emitNode = list.nonSeparatorAt(i);

				// Write out the element, emitting an indent if we're on a new line.
				this.emitJavascript(emitNode, startLine);

				if (i < (n - 1)) {
					// If the next element start on a different line than this element ended on, 
					// then we want to start on a newline.  Emit the comma with a newline.  
					// Otherwise, emit the comma with the space.
					startLine = preserveNewLines && !this.isOnSameLine(emitNode.end(), list.nonSeparatorAt(i + 1).start());
					if (startLine) {
						this.writeLineToOutput(",");
					}
					else {
						this.writeToOutput(", ");
					}
				}
			}

			if (preserveNewLines) {
				// We're done with all the elements.  Return the indent back to where it was.
				this.indenter.decreaseIndent();
			}

			// If the last element isn't on the same line as the parent, then emit a newline
			// after the last element and emit our indent so the list's terminator will be
			// on the right line.  Otherwise, emit the buffer string between the last value
			// and the terminator.
			if (preserveNewLines && !this.isOnSameLine(parent.end(), list.nonSeparatorAt(list.nonSeparatorCount() - 1).end())) {
				this.writeLineToOutput("");
				this.emitIndent();
			}
			else {
				this.writeToOutput(buffer);
			}
		}

		public emitList(list: ISyntaxList2, useNewLineSeparator = true, startInclusive = 0, endExclusive = list.childCount()) {
			if (list === null) {
				return;
			}

			this.emitComments(list, true);
			var lastEmittedNode: AST = null;

			for (var i = startInclusive; i < endExclusive; i++) {
				var node = list.childAt(i);

				if (this.shouldEmit(node)) {
					this.emitSpaceBetweenConstructs(lastEmittedNode, node);

					this.emitJavascript(node, true);
					if (useNewLineSeparator) {
						this.writeLineToOutput("");
					}

					lastEmittedNode = node;
				}
			}

			this.emitComments(list, false);
		}

		public emitSeparatedList(list: ISeparatedSyntaxList2, useNewLineSeparator = true, startInclusive = 0, endExclusive = list.nonSeparatorCount()) {
			if (list === null) {
				return;
			}

			this.emitComments(list, true);
			var lastEmittedNode: AST = null;

			for (var i = startInclusive; i < endExclusive; i++) {
				var node = list.nonSeparatorAt(i);

				if (this.shouldEmit(node)) {
					this.emitSpaceBetweenConstructs(lastEmittedNode, node);

					this.emitJavascript(node, true);
					if (useNewLineSeparator) {
						this.writeLineToOutput("");
					}

					lastEmittedNode = node;
				}
			}

			this.emitComments(list, false);
		}

		private isDirectivePrologueElement(node: AST) {
			if (node.kind() === SyntaxKind.ExpressionStatement) {
				var exprStatement = <ExpressionStatement>node;
				return exprStatement.expression.kind() === SyntaxKind.StringLiteral;
			}

			return false;
		}

		// If these two constructs had more than one line between them originally, then emit at 
		// least one blank line between them.
		public emitSpaceBetweenConstructs(node1: AST, node2: AST): void {
			if (node1 === null || node2 === null) {
				return;
			}

			if (node1.start() === -1 || node1.end() === -1 || node2.start() === -1 || node2.end() === -1) {
				return;
			}

			var lineMap = this.document.lineMap();
			var node1EndLine = lineMap.getLineNumberFromPosition(node1.end());
			var node2StartLine = lineMap.getLineNumberFromPosition(node2.start());

			if ((node2StartLine - node1EndLine) > 1) {
				this.writeLineToOutput("", /*force:*/ true);
			}
		}

		// We consider a sequence of comments to be a detached from an ast if there are no blank lines 
		// between them, and there is a blank line after the last one and the node they're attached 
		// to.
		private getDetachedComments(element: AST): Comment[] {
			var preComments = element.preComments();
			if (preComments) {
				var lineMap = this.document.lineMap();

				var detachedComments: Comment[] = [];
				var lastComment: Comment = null;

				for (var i = 0, n = preComments.length; i < n; i++) {
					var comment = preComments[i];

					if (lastComment) {
						var lastCommentLine = lineMap.getLineNumberFromPosition(lastComment.end());
						var commentLine = lineMap.getLineNumberFromPosition(comment.start());

						if (commentLine >= lastCommentLine + 2) {
							// There was a blank line between the last comment and this comment.  This
							// comment is not part of the copyright comments.  Return what we have so 
							// far.
							return detachedComments;
						}
					}

					detachedComments.push(comment);
					lastComment = comment;
				}

				// All comments look like they could have been part of the copyright header.  Make
				// sure there is at least one blank line between it and the node.  If not, it's not
				// a copyright header.
				var lastCommentLine = lineMap.getLineNumberFromPosition(ArrayUtilities.last(detachedComments).end());
				var astLine = lineMap.getLineNumberFromPosition(element.start());
				if (astLine >= lastCommentLine + 2) {
					return detachedComments;
				}
			}

			// No usable copyright comments found.
			return [];
		}

		private emitPossibleCopyrightHeaders(script: SourceUnit): void {
			this.emitDetachedComments(script.moduleElements);
		}

		private emitDetachedComments(list: ISyntaxList2): void {
			if (list.childCount() > 0) {
				var firstElement = list.childAt(0);

				this.detachedCommentsElement = firstElement;
				this.emitCommentsArray(this.getDetachedComments(this.detachedCommentsElement), /*trailing:*/ false);
			}
		}

		public emitScriptElements(sourceUnit: SourceUnit) {
			var list = sourceUnit.moduleElements;

			this.emitPossibleCopyrightHeaders(sourceUnit);

			if (this._emitGlobal) {
				this.writeLineToOutput("var global=this;");
				this._emitGlobal = false;
			}

			// First, emit all the prologue elements.
			for (var i = 0, n = list.childCount(); i < n; i++) {
				var node = list.childAt(i);

				if (!this.isDirectivePrologueElement(node)) {
					break;
				}

				this.emitJavascript(node, true);
				this.writeLineToOutput("");
			}

			// Now emit __extends or a _this capture if necessary.
			this.emitPrologue(sourceUnit);

			var isExternalModule = this.document.isExternalModule();
			var isNonElidedExternalModule = isExternalModule && !ASTHelpers.scriptIsElided(sourceUnit);
			if (isNonElidedExternalModule) {
				this.recordSourceMappingStart(sourceUnit);

				if (this.emitOptions.compilationSettings().moduleGenTarget() === ModuleGenTarget.Asynchronous) { // AMD
					var dependencyList = "[\"require\", \"exports\"";
					var importList = "require, exports";

					var importAndDependencyList = this.getModuleImportAndDependencyList(sourceUnit);
					importList += importAndDependencyList.importList;
					dependencyList += importAndDependencyList.dependencyList + "]";

					this.writeLineToOutput("define(" + dependencyList + "," + " function(" + importList + ") {");
				}
			}

			if (isExternalModule) {
				var temp = this.setContainer(EmitContainer.DynamicModule);

				var svModuleName = this.moduleName;
				this.moduleName = sourceUnit.fileName();
				if (TypeScript.isTSFile(this.moduleName)) {
					this.moduleName = this.moduleName.substring(0, this.moduleName.length - ".ts".length);
				}

				// if the external module has an "export =" identifier, we'll
				// set it in the ExportAssignment emit method
				this.setExportAssignment(null);

				if (this.emitOptions.compilationSettings().moduleGenTarget() === ModuleGenTarget.Asynchronous) {
					this.indenter.increaseIndent();
				}

				var externalModule = this.semanticInfoChain.getDeclForAST(this.document.sourceUnit());

				if (hasFlag(externalModule.flags, PullElementFlags.MustCaptureThis)) {
					this.writeCaptureThisStatement(sourceUnit);
				}

				this.pushDecl(externalModule);
			}

			this.emitList(list, /*useNewLineSeparator:*/ true, /*startInclusive:*/ i, /*endExclusive:*/ n);

			if (isExternalModule) {
				if (this.emitOptions.compilationSettings().moduleGenTarget() === ModuleGenTarget.Asynchronous) {
					this.indenter.decreaseIndent();
				}

				if (isNonElidedExternalModule) {
					var exportAssignment = this.getExportAssignment();
					var exportAssignmentIdentifierText = exportAssignment ? exportAssignment.identifier.text() : null;
					var exportAssignmentValueSymbol = (<PullContainerSymbol>externalModule.getSymbol()).getExportAssignedValueSymbol();

					if (this.emitOptions.compilationSettings().moduleGenTarget() === ModuleGenTarget.Asynchronous) { // AMD
						if (exportAssignmentIdentifierText && exportAssignmentValueSymbol && !(exportAssignmentValueSymbol.kind & PullElementKind.SomeTypeReference)) {
							// indent was decreased for AMD above
							this.indenter.increaseIndent();
							this.emitIndent();
							this.writeToOutputWithSourceMapRecord("return " + exportAssignmentIdentifierText, exportAssignment);
							this.writeLineToOutput(";");
							this.indenter.decreaseIndent();
						}
						this.writeToOutput("});");
					}
					else if (exportAssignmentIdentifierText && exportAssignmentValueSymbol && !(exportAssignmentValueSymbol.kind & PullElementKind.SomeTypeReference)) {
						this.emitIndent();
						this.writeToOutputWithSourceMapRecord("module.exports = " + exportAssignmentIdentifierText, exportAssignment);
						this.writeToOutput(";");
					}

					this.recordSourceMappingEnd(sourceUnit);
					this.writeLineToOutput("");
				}

				this.setContainer(temp);
				this.moduleName = svModuleName;
				this.popDecl(externalModule);
			}

			if (this.usedButNotEmittedInterfaces.length > 0) {
				var pArr = this.usedButNotEmittedInterfaces;

				while (this.usedButNotEmittedInterfaces.length !== 0) {
					this.emitInterfaceDeclaration(this.usedButNotEmittedInterfaces[0]);
					this.writeLineToOutput("");
				}
			}
		}

		public emitConstructorStatements(funcDecl: ConstructorDeclaration) {
			var list = funcDecl.block.statements;

			if (list === null) {
				return;
			}

			this.emitComments(list, true);

			var emitPropertyAssignmentsAfterSuperCall = ASTHelpers.getExtendsHeritageClause(this.thisClassNode.heritageClauses) !== null;
			var propertyAssignmentIndex = emitPropertyAssignmentsAfterSuperCall ? 1 : 0;
			var lastEmittedNode: AST = null;

			this.isEmitConstructorStatements = true;

			for (var i = 0, n = list.childCount(); i < n; i++) {
				// In some circumstances, class property initializers must be emitted immediately after the 'super' constructor
				// call which, in these cases, must be the first statement in the constructor body
				if (i === propertyAssignmentIndex) {
					this.emitParameterPropertyAndMemberVariableAssignments();
				}

				var node = list.childAt(i);

				if (this.shouldEmit(node)) {
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

			this.isEmitConstructorStatements = false;
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

			this.emit(ast);
		}

		public emitAccessorMemberDeclaration(funcDecl: AST, name: IASTToken, className: string, isProto: boolean) {
			if (funcDecl.kind() !== SyntaxKind.GetAccessor) {
				var accessorSymbol = PullHelpers.getAccessorSymbol(funcDecl, this.semanticInfoChain);
				if (accessorSymbol.getGetter()) {
					return;
				}
			}

			this.emitIndent();
			this.recordSourceMappingStart(funcDecl);

			this.writeToOutput("Object.defineProperty(" + className);
			if (isProto) {
				this.writeToOutput(".prototype, ");
			}
			else {
				this.writeToOutput(", ");
			}

			var functionName = name.text();
			if (isQuoted(functionName)) {
				this.writeToOutput(functionName);
			}
			else {
				this.writeToOutput('"' + functionName + '"');
			}

			this.writeLineToOutput(", {");

			this.indenter.increaseIndent();

			var accessors = PullHelpers.getGetterAndSetterFunction(funcDecl, this.semanticInfoChain);
			if (accessors.getter) {
				this.emitIndent();
				this.recordSourceMappingStart(accessors.getter);
				this.emitComments(accessors.getter, true);
				this.writeToOutput("get: ");
				this.emitAccessorBody(accessors.getter, accessors.getter.parameterList, accessors.getter.block);
				this.writeLineToOutput(",");
			}

			if (accessors.setter) {
				this.emitIndent();
				this.recordSourceMappingStart(accessors.setter);
				this.emitComments(accessors.setter, true);
				this.writeToOutput("set: ");
				this.emitAccessorBody(accessors.setter, accessors.setter.parameterList, accessors.setter.block);
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

		private emitAccessorBody(funcDecl: AST, parameterList: ParameterList, block: Block): void {
			var pullDecl = this.semanticInfoChain.getDeclForAST(funcDecl);
			this.pushDecl(pullDecl);

			this.recordSourceMappingStart(funcDecl);
			this.writeToOutput("function ");

			this.writeToOutput("(");

			var parameters = ASTHelpers.parametersFromParameterList(parameterList);
			this.emitFunctionParameters(parameters);
			this.writeToOutput(")");

			this.emitFunctionBodyStatements(null, funcDecl, parameters, block, /*bodyExpression:*/ null);

			this.recordSourceMappingEnd(funcDecl);

			// The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
			this.recordSourceMappingEnd(funcDecl);
			this.popDecl(pullDecl);
		}

		public emitClass(classDecl: ClassDeclaration) {
			var pullDecl = this.semanticInfoChain.getDeclForAST(classDecl);
			this.pushDecl(pullDecl);

			var svClassNode = this.thisClassNode;
			var svFullClassName = this.thisFullClassName;
			var svFullExtendClassName = this.thisFullExtendClassName;
			var svShortClassNameForMethods = this.thisShortClassNameForMethods;

			this.thisClassNode = classDecl;
			this.thisFullClassName = null;
			this.thisFullExtendClassName = null;
			this.thisShortClassNameForMethods = null;

			var className = classDecl.identifier.text();
			var fullClassName = className;
			var emittedClassName = className;
			var constrDecl = getLastConstructor(classDecl);

			//this.emitComments(classDecl, true);

			this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(classDecl), this.getJSDocForClass(classDecl)));

			var temp = this.setContainer(EmitContainer.Class);

			var hasBaseClass = ASTHelpers.getExtendsHeritageClause(classDecl.heritageClauses) !== null;
			var baseTypeReference: AST = null;

			if ((temp === EmitContainer.Module || temp === EmitContainer.DynamicModule) && hasFlag(pullDecl.flags, PullElementFlags.Exported)) {
				var modName = temp === EmitContainer.Module ? pullDecl.getSymbol().getContainer().fullName()/*this.moduleName*/ : "exports";
				fullClassName = modName + "." + className;
			}

			this.thisFullClassName = emittedClassName = fullClassName;

			if (hasBaseClass) {

				baseTypeReference = ASTHelpers.getExtendsHeritageClause(classDecl.heritageClauses).typeNames.nonSeparatorAt(0);

				var emitSymbol = this.getSymbolForEmit(baseTypeReference);
				var fullExtendClassName = "";

				fullExtendClassName = this.getFullSymbolName(emitSymbol.symbol);
				//if (emitSymbol.symbol.anyDeclHasFlag(PullElementFlags.Exported) && emitSymbol.symbol.getContainer().isContainer()) {
				//	fullExtendClassName = emitSymbol.symbol.getContainer().fullName() + "." + emitSymbol.symbol.getDisplayName();
				//}
				//else {
				//	fullExtendClassName = this.getObfuscatedName(emitSymbol.symbol, emitSymbol.symbol.getDisplayName());
				//}

				this.thisFullExtendClassName = fullExtendClassName;
			}

			this.calcClassEscapeNamesMap(pullDecl.getSymbol());

			this.recordSourceMappingStart(classDecl);

			if (fullClassName.indexOf(".") < 0) {
				var symbol = (<PullTypeSymbol>pullDecl.getSymbol()).getConstructorMethod();
				this.thisFullClassName = emittedClassName = this.getObfuscatedName(symbol, className, true);
				this.writeToOutput("var " + emittedClassName + " = ");
			}
			else {
				this.writeToOutput(fullClassName + " = ");
			}

			this.thisShortClassNameForMethods = this.getShortName(this.thisFullClassName + ".prototype");

			this.recordSourceMappingNameStart(className);

			this.emittedClassProperties = [];

			// output constructor
			if (constrDecl) {
				// declared constructor
				this.emit(constrDecl);
				this.writeLineToOutput("");
			}
			else {
				this.recordSourceMappingStart(classDecl);
				// default constructor
				//TODO: this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(classDecl), this.getJSDocForConstructor(classDecl)));
				this.indenter.increaseIndent();
				this.writeLineToOutput("function () {");
				this.recordSourceMappingNameStart("constructor");
				if (hasBaseClass) {
					this.emitIndent();
					this.writeLineToOutput(fullExtendClassName + ".apply(this, arguments);");
				}

				if (this.shouldCaptureThis(classDecl)) {
					this.writeCaptureThisStatement(classDecl);
				}

				this.emitParameterPropertyAndMemberVariableAssignments();

				this.indenter.decreaseIndent();
				this.emitIndent();
				this.writeLineToOutput("};");

				this.recordSourceMappingNameEnd();
				this.recordSourceMappingEnd(classDecl);
			}

			if (hasBaseClass) {
				this.emitIndent();
				this.writeLineToOutput("__extends(" + emittedClassName + ", " + fullExtendClassName + ");");
			}

			if (hasFlag(pullDecl.flags, PullElementFlags.Exported)) {
				this.exportSymbol(pullDecl.getSymbol(), emittedClassName);
			}

			this.writeLineToOutput("var " + this.thisShortClassNameForMethods + " = " + this.thisFullClassName + ".prototype;");

			if (fullClassName.indexOf(".") >= 0 && fullClassName !== emittedClassName) {
				this.writeLineToOutput("/** @type {" + emittedClassName + "} */ " + fullClassName + " = " + emittedClassName + ";");
			}

			this.emitClassMembers(classDecl);

			this.writeLineToOutput("");

			this.recordSourceMappingNameEnd();
			this.recordSourceMappingStart(classDecl);

			this.recordSourceMappingEnd(classDecl);

			this.recordSourceMappingEnd(classDecl);
			this.emitComments(classDecl, false);
			this.setContainer(temp);
			this.thisClassNode = svClassNode;
			this.thisFullClassName = svFullClassName;
			this.thisFullExtendClassName = svFullExtendClassName;
			this.thisShortClassNameForMethods = svShortClassNameForMethods;

			this.emittedClassProperties = null;

			this.popDecl(pullDecl);
		}

		private emitClassMembers(classDecl: ClassDeclaration): void {
			// First, emit all the functions.
			var lastEmittedMember: AST = null;

			for (var i = 0, n = classDecl.classElements.childCount(); i < n; i++) {
				var memberDecl = classDecl.classElements.childAt(i);

				if (memberDecl.kind() === SyntaxKind.GetAccessor) {
					this.emitSpaceBetweenConstructs(lastEmittedMember, memberDecl);
					var getter = <GetAccessor>memberDecl;
					this.emitAccessorMemberDeclaration(getter, getter.propertyName, this.thisFullClassName/*classDecl.identifier.text()*/,
						!hasModifier(getter.modifiers, PullElementFlags.Static));
					lastEmittedMember = memberDecl;
				}
				else if (memberDecl.kind() === SyntaxKind.SetAccessor) {
					this.emitSpaceBetweenConstructs(lastEmittedMember, memberDecl);
					var setter = <SetAccessor>memberDecl;
					this.emitAccessorMemberDeclaration(setter, setter.propertyName, this.thisFullClassName/*classDecl.identifier.text()*/,
						!hasModifier(setter.modifiers, PullElementFlags.Static));
					lastEmittedMember = memberDecl;
				}
				else if (memberDecl.kind() === SyntaxKind.MemberFunctionDeclaration) {

					var memberFunction = <MemberFunctionDeclaration>memberDecl;

					if (memberFunction.block) {
						this.emitSpaceBetweenConstructs(lastEmittedMember, memberDecl);

						this.emitClassMemberFunctionDeclaration(classDecl, memberFunction);
						lastEmittedMember = memberDecl;
					}
				}
			}

			// Now emit all the statics.
			for (var i = 0, n = classDecl.classElements.childCount(); i < n; i++) {
				var memberDecl = classDecl.classElements.childAt(i);

				if (memberDecl.kind() === SyntaxKind.MemberVariableDeclaration) {
					var varDecl = <MemberVariableDeclaration>memberDecl;

					if (hasModifier(varDecl.modifiers, PullElementFlags.Static) && varDecl.variableDeclarator.equalsValueClause) {
						this.emitSpaceBetweenConstructs(lastEmittedMember, varDecl);

						this.emitIndent();
						this.recordSourceMappingStart(varDecl);

						var symbol = this.semanticInfoChain.getDeclForAST(varDecl).getSymbol();
						this.emitInlineJSDocComment(this.getJSDocForClassMemberVariable(symbol));

						var varDeclName = varDecl.variableDeclarator.propertyName.text();
						if (isQuoted(varDeclName) || varDecl.variableDeclarator.propertyName.kind() !== SyntaxKind.IdentifierName) {
							this.writeToOutput(this.thisFullClassName/*classDecl.identifier.text()*/ + "[" + varDeclName + "]");
						}
						else if (this.isNeedEscapeName(symbol)) {
							this.writeToOutput(this.thisFullClassName/*classDecl.identifier.text()*/ + "[\"" + varDeclName + "\"]");
						}
						else {
							this.writeToOutput(this.thisFullClassName/*classDecl.identifier.text()*/ + "." + varDeclName);
						}

						this.emit(varDecl.variableDeclarator.equalsValueClause);

						this.recordSourceMappingEnd(varDecl);
						this.writeLineToOutput(";");

						lastEmittedMember = varDecl;
					}
				}
			}
		}

		private emitClassMemberFunctionDeclaration(classDecl: ClassDeclaration, funcDecl: MemberFunctionDeclaration): void {
			this.emitIndent();
			this.recordSourceMappingStart(funcDecl);

			//this.emitComments(funcDecl, true);
			this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(funcDecl), this.getJSDocForFunctionDeclaration(funcDecl)));

			var functionName = funcDecl.propertyName.text();

			//this.writeToOutput(this.thisFullClassName);
			//this.writeToOutput(classDecl.identifier.text());

			if (!hasModifier(funcDecl.modifiers, PullElementFlags.Static)) {
				this.writeToOutput("/** @this {" + this.thisFullClassName + "} */ " + this.thisShortClassNameForMethods);
				//this.writeToOutput(".prototype");
			}
			else {
				this.writeToOutput(this.thisFullClassName);
			}

			if (isQuoted(functionName) || funcDecl.propertyName.kind() !== SyntaxKind.IdentifierName) {
				this.writeToOutput("[" + functionName + "] = ");
			}
			else {
				this.writeToOutput("." + functionName + " = ");
			}

			var pullDecl = this.semanticInfoChain.getDeclForAST(funcDecl);
			this.pushDecl(pullDecl);
			
			if (this.isNeedExportClassFunctionMember(pullDecl.getSymbol()) && !isQuoted(functionName) && funcDecl.propertyName.kind() === SyntaxKind.IdentifierName) {
				var className = this.thisFullClassName;
				var exportLocation = hasModifier(funcDecl.modifiers, PullElementFlags.Static) ? className : (this.thisShortClassNameForMethods);
				var exportName = exportLocation + "[\"" + functionName + "\"]";

				this.writeToOutput("/** @this {" + this.thisFullClassName + "} */ " + exportName + " = ");
			}

			this.recordSourceMappingStart(funcDecl);
			this.writeToOutput("function ");

			this.emitParameterList(funcDecl.callSignature.parameterList);

			var parameters = ASTHelpers.parametersFromParameterList(funcDecl.callSignature.parameterList);
			this.emitFunctionBodyStatements(funcDecl.propertyName.text(), funcDecl, parameters, funcDecl.block, /*bodyExpression:*/ null);

			this.recordSourceMappingEnd(funcDecl);

			this.emitComments(funcDecl, false);

			this.recordSourceMappingEnd(funcDecl);
			this.popDecl(pullDecl);

			this.writeLineToOutput(";");
			//if (this.isNeedExportClassFunctionMember(pullDecl.getSymbol())) {
			//	var className = this.thisFullClassName;
			//	var location = hasModifier(funcDecl.modifiers, PullElementFlags.Static) ? className : (this.thisShortClassNameForMethods/*className + ".prototype"*/);
			//	var exportLocation = className === location ? location : (this.thisShortClassNameForMethods/*className + ".prototype"*/);
			//	var fullName = location;
			//	var exportName = exportLocation;

			//	if (isQuoted(functionName) || funcDecl.propertyName.kind() !== SyntaxKind.IdentifierName) {
			//		exportName += "[" + functionName + "]";
			//		fullName += "[" + functionName + "]";
			//	}
			//	else {
			//		exportName += "['" + functionName + "']";
			//		fullName += "." + functionName;
			//	}

			//	this.writeLineToOutput("");
			//	this.writeToOutput(exportName + " = " + fullName + ";");
			//}
		}

		private requiresExtendsBlock(moduleElements: ISyntaxList2): boolean {
			for (var i = 0, n = moduleElements.childCount(); i < n; i++) {
				var moduleElement = moduleElements.childAt(i);

				if (moduleElement.kind() === SyntaxKind.ModuleDeclaration) {
					var moduleAST = <ModuleDeclaration>moduleElement;

					if (!hasModifier(moduleAST.modifiers, PullElementFlags.Ambient) && this.requiresExtendsBlock(moduleAST.moduleElements)) {
						return true;
					}
				}
				else if (moduleElement.kind() === SyntaxKind.ClassDeclaration) {
					var classDeclaration = <ClassDeclaration>moduleElement;

					if (!hasModifier(classDeclaration.modifiers, PullElementFlags.Ambient) && ASTHelpers.getExtendsHeritageClause(classDeclaration.heritageClauses) !== null) {
						return true;
					}
				}
			}

			return false;
		}

		public emitPrologue(sourceUnit: SourceUnit) {
			if (!this.extendsPrologueEmitted) {
				if (this.requiresExtendsBlock(sourceUnit.moduleElements)) {
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
					this.writeLineToOutput("};");
					this.writeLineToOutput("global['__extends']=__extends;");
					this.writeLineToOutput("");
					//this.writeLineToOutput("var __extends = this.__extends || function (d, b) {");
					//this.writeLineToOutput("    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];");
					//this.writeLineToOutput("    function __() { this.constructor = d; }");
					//this.writeLineToOutput("    __.prototype = b.prototype;");
					//this.writeLineToOutput("    d.prototype = new __();");
					//this.writeLineToOutput("};");
				}
			}

			if (!this.globalThisCapturePrologueEmitted) {
				if (this.shouldCaptureThis(sourceUnit)) {
					this.globalThisCapturePrologueEmitted = true;
					this.writeLineToOutput(this.captureThisStmtString);
				}
			}
		}

		public emitThis() {
			if (!this.inWithBlock && this.inArrowFunction) {
				this.writeToOutput("_this");
			}
			else {
				this.writeToOutput("this");
			}
		}

		public emitBlockOrStatement(node: AST): void {
			if (node.kind() === SyntaxKind.Block) {
				this.emit(node);
			}
			else {
				this.writeLineToOutput("");
				this.indenter.increaseIndent();
				this.emitJavascript(node, true);
				this.indenter.decreaseIndent();
			}
		}

		public emitLiteralExpression(expression: LiteralExpression): void {
			switch (expression.kind()) {
				case SyntaxKind.NullKeyword:
					this.writeToOutputWithSourceMapRecord("null", expression);
					break;
				case SyntaxKind.FalseKeyword:
					this.writeToOutputWithSourceMapRecord("false", expression);
					break;
				case SyntaxKind.TrueKeyword:
					this.writeToOutputWithSourceMapRecord("true", expression);
					break;
				default:
					throw Errors.abstract();
			}
		}

		public emitThisExpression(expression: ThisExpression): void {
			if (!this.inWithBlock && this.inArrowFunction) {
				this.writeToOutputWithSourceMapRecord("_this", expression);
			}
			else {
				this.writeToOutputWithSourceMapRecord("this", expression);
			}
		}

		public emitSuperExpression(expression: SuperExpression): void {
			this.writeToOutputWithSourceMapRecord(this.thisFullExtendClassName + ".prototype", expression);
		}

		public emitParenthesizedExpression(parenthesizedExpression: ParenthesizedExpression): void {
			if (parenthesizedExpression.expression.kind() === SyntaxKind.CastExpression && parenthesizedExpression.openParenTrailingComments === null) {
				// We have an expression of the form: (<Type>SubExpr)
				// Emitting this as (SubExpr) is really not desirable.  Just emit the subexpr as is.
				this.emit(parenthesizedExpression.expression);
			}
			else {
				this.recordSourceMappingStart(parenthesizedExpression);
				this.writeToOutput("(");
				this.emitCommentsArray(parenthesizedExpression.openParenTrailingComments, /*trailing:*/ false);
				this.emit(parenthesizedExpression.expression);
				this.writeToOutput(")");
				this.recordSourceMappingEnd(parenthesizedExpression);
			}
		}

		public emitCastExpression(expression: CastExpression): void {
			var symbol = this.semanticInfoChain.getSymbolForAST(expression);
			if (!symbol) {
				var resolver = this.semanticInfoChain.getResolver();

				symbol = resolver.resolveAST(expression, false, new PullTypeResolutionContext(resolver));

				if (symbol.isTypeReference()) {
					symbol = (<PullTypeReferenceSymbol>symbol).referencedTypeSymbol;
				}
			}

			var svIsBlockTemplate = this.isTypeParametersEmitBlocked;
			if (!symbol.type.isAny()) {
				this.isTypeParametersEmitBlocked = true;
				this.emitInlineJSDocComment([], this.getJSDocForType(symbol.type));
				this.isTypeParametersEmitBlocked = svIsBlockTemplate;
			}
			this.writeToOutput("(");
			this.emit(expression.expression);
			this.writeToOutput(")");
		}

		public emitPrefixUnaryExpression(expression: PrefixUnaryExpression): void {
			var nodeType = expression.kind();

			this.recordSourceMappingStart(expression);
			switch (nodeType) {
				case SyntaxKind.LogicalNotExpression:
					this.writeToOutput("!");
					this.emit(expression.operand);
					break;
				case SyntaxKind.BitwiseNotExpression:
					this.writeToOutput("~");
					this.emit(expression.operand);
					break;
				case SyntaxKind.NegateExpression:
					this.writeToOutput("-");
					if (expression.operand.kind() === SyntaxKind.NegateExpression || expression.operand.kind() === SyntaxKind.PreDecrementExpression) {
						this.writeToOutput(" ");
					}
					this.emit(expression.operand);
					break;
				case SyntaxKind.PlusExpression:
					this.writeToOutput("+");
					if (expression.operand.kind() === SyntaxKind.PlusExpression || expression.operand.kind() === SyntaxKind.PreIncrementExpression) {
						this.writeToOutput(" ");
					}
					this.emit(expression.operand);
					break;
				case SyntaxKind.PreIncrementExpression:
					this.writeToOutput("++");
					this.emit(expression.operand);
					break;
				case SyntaxKind.PreDecrementExpression:
					this.writeToOutput("--");
					this.emit(expression.operand);
					break;
				default:
					throw Errors.abstract();
			}

			this.recordSourceMappingEnd(expression);
		}

		public emitPostfixUnaryExpression(expression: PostfixUnaryExpression): void {
			var nodeType = expression.kind();

			this.recordSourceMappingStart(expression);
			switch (nodeType) {
				case SyntaxKind.PostIncrementExpression:
					this.emit(expression.operand);
					this.writeToOutput("++");
					break;
				case SyntaxKind.PostDecrementExpression:
					this.emit(expression.operand);
					this.writeToOutput("--");
					break;
				default:
					throw Errors.abstract();
			}

			this.recordSourceMappingEnd(expression);
		}

		public emitTypeOfExpression(expression: TypeOfExpression): void {
			this.recordSourceMappingStart(expression);
			this.writeToOutput("typeof ");
			this.emit(expression.expression);
			this.recordSourceMappingEnd(expression);
		}

		public emitDeleteExpression(expression: DeleteExpression): void {
			this.recordSourceMappingStart(expression);
			this.writeToOutput("delete ");
			this.emit(expression.expression);
			this.recordSourceMappingEnd(expression);
		}

		public emitVoidExpression(expression: VoidExpression): void {
			this.recordSourceMappingStart(expression);
			this.writeToOutput("void ");
			this.emit(expression.expression);
			this.recordSourceMappingEnd(expression);
		}

		private canEmitDottedNameMemberAccessExpression(expression: MemberAccessExpression) {
			var memberExpressionNodeType = expression.expression.kind();

			// If the memberAccess is of Name or another member access, we could potentially emit the symbol using the this memberAccessSymol
			if (memberExpressionNodeType === SyntaxKind.IdentifierName || memberExpressionNodeType == SyntaxKind.MemberAccessExpression) {
				var memberAccessSymbol = this.getSymbolForEmit(expression).symbol;
				var memberAccessExpressionSymbol = this.getSymbolForEmit(expression.expression).symbol;
				if (memberAccessSymbol && memberAccessExpressionSymbol // We have symbols resolved for this expression and access
					&& !this.semanticInfoChain.getAliasSymbolForAST(expression.expression) // The access is not off alias
					&& (PullHelpers.symbolIsModule(memberAccessExpressionSymbol) || memberAccessExpressionSymbol.kind === PullElementKind.Enum ||
					memberAccessExpressionSymbol.anyDeclHasFlag(PullElementFlags.InitializedModule | PullElementFlags.Enum))) { // container is module

					// If the memberAccess is in the context of the container, we could use the symbol to emit this expression
					var memberAccessSymbolKind = memberAccessSymbol.kind;
					if (memberAccessSymbolKind === PullElementKind.Property
						|| memberAccessSymbolKind === PullElementKind.EnumMember
						|| (memberAccessSymbol.anyDeclHasFlag(PullElementFlags.Exported) && memberAccessSymbolKind === PullElementKind.Variable && !memberAccessSymbol.anyDeclHasFlag(PullElementFlags.InitializedModule | PullElementFlags.Enum))
						|| ((memberAccessSymbol.anyDeclHasFlag(PullElementFlags.Exported) && !this.symbolIsUsedInItsEnclosingContainer(memberAccessSymbol)))) {

						// If the expression is member access, we need to verify it as well
						if (memberExpressionNodeType === SyntaxKind.MemberAccessExpression) {
							return this.canEmitDottedNameMemberAccessExpression(<MemberAccessExpression>expression.expression);
						}

						return true;
					}
				}
			}

			return false;
		}

		// Emit the member access expression using the declPath
		private emitDottedNameMemberAccessExpressionWorker(expression: MemberAccessExpression, potentialPath: PullDecl[], startingIndex: number, lastIndex: number) {
			this.recordSourceMappingStart(expression);

			var symbol = this.semanticInfoChain.getSymbolForAST(expression.name);

			var isNeedEscapeSymbol = this.isNeedEscapeName(symbol);
			var isEscapedVarInModule = isNeedEscapeSymbol ? this.isNeedEscapeVariableInModule(symbol) : false;

			if (isEscapedVarInModule) {
				var shortModuleName = this.getShortName(symbol.getContainer().fullName());

				this.writeToOutput(shortModuleName);
				var name = expression.name.text();
				if (isQuoted(name)) {
					this.writeToOutput("[" + name + "]");
				}
				else {
					this.writeToOutput("[\"" + name + "\"]");
				}
			}
			else {
				if (expression.expression.kind() === SyntaxKind.MemberAccessExpression) {
					// Emit the dotted name access expression
					this.emitDottedNameMemberAccessExpressionRecurse(<MemberAccessExpression>expression.expression, potentialPath, startingIndex, lastIndex - 1);
				}
				else { // Name
					this.emitComments(expression.expression, true);
					this.recordSourceMappingStart(expression.expression);

					// Emit the qualifying name fo the expression.expression
					this.emitDottedNameFromDeclPath(potentialPath, startingIndex, lastIndex - 2); // We would be emitting two identifiers as part of member access
					// Emit expression.expression
					this.writeToOutput((<Identifier>expression.expression).text());

					this.recordSourceMappingEnd(expression.expression);
					this.emitComments(expression.expression, false);
				}

				this.writeToOutput(".");
				this.emitName(expression.name, false);
			}

			this.recordSourceMappingEnd(expression);
		}

		// Set the right indices for the recursive member access expression before emitting it using the decl path
		private emitDottedNameMemberAccessExpressionRecurse(expression: MemberAccessExpression, potentialPath: PullDecl[], startingIndex: number, lastIndex: number) {
			this.emitComments(expression, true);

			if (lastIndex - startingIndex < 1) { // Member expression emits alteast two identifiers
				startingIndex = lastIndex - 1;
				Debug.assert(startingIndex >= 0);
			}

			this.emitDottedNameMemberAccessExpressionWorker(expression, potentialPath, startingIndex, lastIndex);
			this.emitComments(expression, false);
		}

		private emitDottedNameMemberAccessExpression(expression: MemberAccessExpression) {
			var memberAccessSymbol = this.getSymbolForEmit(expression).symbol;
			// Get the decl path info to emit this expression using declPath
			var potentialDeclInfo = this.getPotentialDeclPathInfoForEmit(memberAccessSymbol);
			this.emitDottedNameMemberAccessExpressionWorker(expression, potentialDeclInfo.potentialPath, potentialDeclInfo.startingIndex, potentialDeclInfo.potentialPath.length);
		}

		public emitMemberAccessExpression(expression: MemberAccessExpression): void {
			if (!this.tryEmitConstant(expression)) {
				// If the expression is dotted name of the modules, emit it using decl path so the name could be resolved correctly.
				if (this.canEmitDottedNameMemberAccessExpression(expression)) {
					this.emitDottedNameMemberAccessExpression(expression);
				}
				else {
					//if (this.isEmitConstructorStatements) {
					//	var symbol = this.semanticInfoChain.getSymbolForAST(expression.name);

					//	if (symbol && symbol.isProperty() && symbol.getContainer() &&
					//		symbol.getContainer() === this.semanticInfoChain.getSymbolForAST(this.thisClassNode) &&
					//		this.emittedClassProperties.indexOf(symbol) < 0) {

					//		this.emitInlineJSDocComment(this.getJSDocForClassMemberVariable(symbol));
					//		this.emittedClassProperties.push(symbol);
					//	}
					//}

					var symbol = this.semanticInfoChain.getSymbolForAST(expression.name);
					var isNeedEscapeSymbol = this.isNeedEscapeName(symbol);

					this.recordSourceMappingStart(expression);

					//if (isNeedEscapeFunction) {
					//	this.writeToOutput("(/** " + this.formatJSDocType(symbol.type) + " */(");
					//}
					//if(isVarInModule)
					this.emit(expression.expression);

					if (isNeedEscapeSymbol) {
						this.writeToOutput("[\"");
					}
					else {
						this.writeToOutput(".");
					}

					this.emitName(expression.name, false);

					if (isNeedEscapeSymbol) {
						this.writeToOutput("\"]");
					}


					//if (isNeedEscapeFunction) {
					//	this.writeToOutput("))");
					//}

					this.recordSourceMappingEnd(expression);
				}
			}
		}

		public emitQualifiedName(name: QualifiedName): void {
			this.recordSourceMappingStart(name);

			this.emit(name.left);
			this.writeToOutput(".");
			this.emitName(name.right, false);

			this.recordSourceMappingEnd(name);
		}

		public emitBinaryExpression(expression: BinaryExpression): void {
			this.recordSourceMappingStart(expression);
			switch (expression.kind()) {
				case SyntaxKind.CommaExpression:
					this.emit(expression.left);
					this.writeToOutput(", ");
					this.emit(expression.right);
					break;
				default:
					{
						this.emit(expression.left);
						var binOp = SyntaxFacts.getText(SyntaxFacts.getOperatorTokenFromBinaryExpression(expression.kind()));
						if (binOp === "instanceof") {
							this.writeToOutput(" instanceof ");
						}
						else if (binOp === "in") {
							this.writeToOutput(" in ");
						}
						else {
							this.writeToOutput(" " + binOp + " ");
						}
						this.emit(expression.right);
					}
			}
			this.recordSourceMappingEnd(expression);
		}

		public emitSimplePropertyAssignment(property: SimplePropertyAssignment): void {
			this.recordSourceMappingStart(property);
			this.emit(property.propertyName);
			this.writeToOutput(": ");
			this.emit(property.expression);
			this.recordSourceMappingEnd(property);
		}

		public emitFunctionPropertyAssignment(funcProp: FunctionPropertyAssignment): void {
			this.recordSourceMappingStart(funcProp);

			this.emit(funcProp.propertyName);
			this.writeToOutput(": ");

			var pullFunctionDecl = this.semanticInfoChain.getDeclForAST(funcProp);

			var savedInArrowFunction = this.inArrowFunction;
			this.inArrowFunction = false;

			var temp = this.setContainer(EmitContainer.Function);
			var funcName = funcProp.propertyName;

			var pullDecl = this.semanticInfoChain.getDeclForAST(funcProp);
			this.pushDecl(pullDecl);

			this.recordSourceMappingStart(funcProp);
			this.writeToOutput("function ");

			//this.recordSourceMappingStart(funcProp.propertyName);
			//this.writeToOutput(funcProp.propertyName.actualText);
			//this.recordSourceMappingEnd(funcProp.propertyName);

			this.writeToOutput("(");

			var parameters = ASTHelpers.parametersFromParameterList(funcProp.callSignature.parameterList);
			this.emitFunctionParameters(parameters);
			this.writeToOutput(")");

			this.emitFunctionBodyStatements(funcProp.propertyName.text(), funcProp, parameters, funcProp.block, /*bodyExpression:*/ null);

			this.recordSourceMappingEnd(funcProp);

			// The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
			this.recordSourceMappingEnd(funcProp);

			this.emitComments(funcProp, false);

			this.popDecl(pullDecl);

			this.setContainer(temp);
			this.inArrowFunction = savedInArrowFunction;
		}

		public emitConditionalExpression(expression: ConditionalExpression): void {
			this.emit(expression.condition);
			this.writeToOutput(" ? ");
			this.emit(expression.whenTrue);
			this.writeToOutput(" : ");
			this.emit(expression.whenFalse);
		}

		public emitThrowStatement(statement: ThrowStatement): void {
			this.recordSourceMappingStart(statement);
			this.writeToOutput("throw ");
			this.emit(statement.expression);
			this.recordSourceMappingEnd(statement);
			this.writeToOutput(";");
		}

		public emitExpressionStatement(statement: ExpressionStatement): void {
			var isArrowExpression = statement.expression.kind() === SyntaxKind.SimpleArrowFunctionExpression || statement.expression.kind() === SyntaxKind.ParenthesizedArrowFunctionExpression;

			this.recordSourceMappingStart(statement);
			if (isArrowExpression) {
				this.writeToOutput("(");
			}

			this.emit(statement.expression);

			if (isArrowExpression) {
				this.writeToOutput(")");
			}

			this.recordSourceMappingEnd(statement);
			this.writeToOutput(";");
		}

		public emitLabeledStatement(statement: LabeledStatement): void {
			this.writeToOutputWithSourceMapRecord(statement.identifier.text(), statement.identifier);
			this.writeLineToOutput(":");
			this.emitJavascript(statement.statement, /*startLine:*/ true);
		}

		public emitBlock(block: Block): void {
			this.recordSourceMappingStart(block);
			this.writeLineToOutput(" {");
			this.indenter.increaseIndent();
			if (block.statements) {
				this.emitList(block.statements);
			}
			this.emitCommentsArray(block.closeBraceLeadingComments, /*trailing:*/ false);
			this.indenter.decreaseIndent();
			this.emitIndent();
			this.writeToOutput("}");
			this.recordSourceMappingEnd(block);
		}

		public emitBreakStatement(jump: BreakStatement): void {
			this.recordSourceMappingStart(jump);
			this.writeToOutput("break");

			if (jump.identifier) {
				this.writeToOutput(" " + jump.identifier.text());
			}

			this.recordSourceMappingEnd(jump);
			this.writeToOutput(";");
		}

		public emitContinueStatement(jump: ContinueStatement): void {
			this.recordSourceMappingStart(jump);
			this.writeToOutput("continue");

			if (jump.identifier) {
				this.writeToOutput(" " + jump.identifier.text());
			}

			this.recordSourceMappingEnd(jump);
			this.writeToOutput(";");
		}

		public emitWhileStatement(statement: WhileStatement): void {
			this.recordSourceMappingStart(statement);
			this.writeToOutput("while (");
			this.emit(statement.condition);
			this.writeToOutput(")");
			this.emitBlockOrStatement(statement.statement);
			this.recordSourceMappingEnd(statement);
		}

		public emitDoStatement(statement: DoStatement): void {
			this.recordSourceMappingStart(statement);
			this.writeToOutput("do");
			this.emitBlockOrStatement(statement.statement);
			this.writeToOutputWithSourceMapRecord(" while", statement.whileKeyword);
			this.writeToOutput('(');
			this.emit(statement.condition);
			this.writeToOutput(")");
			this.recordSourceMappingEnd(statement);
			this.writeToOutput(";");
		}

		public emitIfStatement(statement: IfStatement): void {
			this.recordSourceMappingStart(statement);
			this.writeToOutput("if (");
			this.emit(statement.condition);
			this.writeToOutput(")");

			this.emitBlockOrStatement(statement.statement);

			if (statement.elseClause) {
				if (statement.statement.kind() !== SyntaxKind.Block) {
					this.writeLineToOutput("");
					this.emitIndent();
				}
				else {
					this.writeToOutput(" ");
				}

				this.emit(statement.elseClause);
			}
			this.recordSourceMappingEnd(statement);
		}

		public emitElseClause(elseClause: ElseClause): void {
			if (elseClause.statement.kind() === SyntaxKind.IfStatement) {
				this.writeToOutput("else ");
				this.emit(elseClause.statement);
			}
			else {
				this.writeToOutput("else");
				this.emitBlockOrStatement(elseClause.statement);
			}
		}

		public emitReturnStatement(statement: ReturnStatement): void {
			this.recordSourceMappingStart(statement);
			if (statement.expression) {
				this.writeToOutput("return ");
				this.emit(statement.expression);
			}
			else {
				this.writeToOutput("return");
			}
			this.recordSourceMappingEnd(statement);
			this.writeToOutput(";");
		}

		public emitForInStatement(statement: ForInStatement): void {
			this.recordSourceMappingStart(statement);
			this.writeToOutput("for (");
			if (statement.left) {
				this.emit(statement.left);
			}
			else {
				this.emittedForInStatement = true;
				this.emit(statement.variableDeclaration);
				this.emittedForInStatement = false;
			}
			this.writeToOutput(" in ");
			this.emit(statement.expression);
			this.writeToOutput(")");
			this.emitBlockOrStatement(statement.statement);
			this.recordSourceMappingEnd(statement);
		}

		public emitForStatement(statement: ForStatement): void {
			this.recordSourceMappingStart(statement);
			this.writeToOutput("for (");
			if (statement.variableDeclaration) {
				this.emit(statement.variableDeclaration);
			}
			else if (statement.initializer) {
				this.emit(statement.initializer);
			}

			this.writeToOutput("; ");
			this.emitJavascript(statement.condition, false);
			this.writeToOutput(";");
			if (statement.incrementor) {
				this.writeToOutput(" ");
				this.emitJavascript(statement.incrementor, false);
			}
			this.writeToOutput(")");
			this.emitBlockOrStatement(statement.statement);
			this.recordSourceMappingEnd(statement);
		}

		public emitWithStatement(statement: WithStatement): void {
			this.recordSourceMappingStart(statement);
			this.writeToOutput("with (");
			if (statement.condition) {
				this.emit(statement.condition);
			}

			this.writeToOutput(")");
			var prevInWithBlock = this.inWithBlock;
			this.inWithBlock = true;
			this.emitBlockOrStatement(statement.statement);
			this.inWithBlock = prevInWithBlock;
			this.recordSourceMappingEnd(statement);
		}

		public emitSwitchStatement(statement: SwitchStatement): void {
			this.recordSourceMappingStart(statement);
			this.writeToOutput("switch (");
			this.emit(statement.expression);
			this.recordSourceMappingStart(statement.closeParenToken);
			this.writeToOutput(")");
			this.recordSourceMappingEnd(statement.closeParenToken);
			this.writeLineToOutput(" {");
			this.indenter.increaseIndent();
			this.emitList(statement.switchClauses, /*useNewLineSeparator:*/ false);
			this.indenter.decreaseIndent();
			this.emitIndent();
			this.writeToOutput("}");
			this.recordSourceMappingEnd(statement);
		}

		public emitCaseSwitchClause(clause: CaseSwitchClause): void {
			this.recordSourceMappingStart(clause);
			this.writeToOutput("case ");
			this.emit(clause.expression);
			this.writeToOutput(":");

			this.emitSwitchClauseBody(clause.statements);
			this.recordSourceMappingEnd(clause);
		}

		private emitSwitchClauseBody(body: ISyntaxList2): void {
			if (body.childCount() === 1 && body.childAt(0).kind() === SyntaxKind.Block) {
				// The case statement was written with curly braces, so emit it with the appropriate formatting
				this.emit(body.childAt(0));
				this.writeLineToOutput("");
			}
			else {
				// No curly braces. Format in the expected way
				this.writeLineToOutput("");
				this.indenter.increaseIndent();
				this.emit(body);
				this.indenter.decreaseIndent();
			}
		}

		public emitDefaultSwitchClause(clause: DefaultSwitchClause): void {
			this.recordSourceMappingStart(clause);
			this.writeToOutput("default:");

			this.emitSwitchClauseBody(clause.statements);
			this.recordSourceMappingEnd(clause);
		}

		public emitTryStatement(statement: TryStatement): void {
			this.recordSourceMappingStart(statement);
			this.writeToOutput("try ");
			this.emit(statement.block);
			this.emitJavascript(statement.catchClause, false);

			if (statement.finallyClause) {
				this.emit(statement.finallyClause);
			}
			this.recordSourceMappingEnd(statement);
		}

		public emitCatchClause(clause: CatchClause): void {
			this.writeToOutput(" ");
			this.recordSourceMappingStart(clause);
			this.writeToOutput("catch (");
			this.emit(clause.identifier);
			this.writeToOutput(")");
			this.emit(clause.block);
			this.recordSourceMappingEnd(clause);
		}

		public emitFinallyClause(clause: FinallyClause): void {
			this.writeToOutput(" finally");
			this.emit(clause.block);
		}

		public emitDebuggerStatement(statement: DebuggerStatement): void {
			this.writeToOutputWithSourceMapRecord("debugger", statement);
			this.writeToOutput(";");
		}

		public emitNumericLiteral(literal: NumericLiteral): void {
			this.writeToOutputWithSourceMapRecord(literal.text(), literal);
		}

		public emitRegularExpressionLiteral(literal: RegularExpressionLiteral): void {
			this.writeToOutputWithSourceMapRecord(literal.text(), literal);
		}

		public emitStringLiteral(literal: StringLiteral): void {
			this.writeToOutputWithSourceMapRecord(literal.text(), literal);
		}

		public emitEqualsValueClause(clause: EqualsValueClause): void {
			if (!this.isEnumEmitted) {
				this.writeToOutput(" = ");
			}

			this.emit(clause.value);
		}

		public emitParameter(parameter: Parameter): void {
			this.writeToOutputWithSourceMapRecord(parameter.identifier.text(), parameter);
		}

		public emitConstructorDeclaration(declaration: ConstructorDeclaration): void {
			if (declaration.block) {
				this.emitConstructor(declaration);
			}
			else {
				this.emitComments(declaration, /*pre:*/ true, /*onlyPinnedOrTripleSlashComments:*/ true);
			}
		}

		public shouldEmitFunctionDeclaration(declaration: FunctionDeclaration): boolean {
			return declaration.preComments() !== null || (!hasModifier(declaration.modifiers, PullElementFlags.Ambient) && declaration.block !== null);
		}

		public emitFunctionDeclaration(declaration: FunctionDeclaration): void {
			if (!hasModifier(declaration.modifiers, PullElementFlags.Ambient) && declaration.block !== null) {
				this.emitFunction(declaration);
				this.writeToOutput(";");
			}
			else {
				this.emitComments(declaration, /*pre:*/ true, /*onlyPinnedOrTripleSlashComments:*/ true);
			}
		}

		private emitSourceUnit(sourceUnit: SourceUnit): void {
			if (!this.document.isDeclareFile()) {
				var pullDecl = this.semanticInfoChain.getDeclForAST(sourceUnit);
				this.pushDecl(pullDecl);
				this.emitScriptElements(sourceUnit);
				this.popDecl(pullDecl);

				this.emitCommentsArray(sourceUnit.endOfFileTokenLeadingComments, /*trailing:*/ false);
			}
		}

		public shouldEmitEnumDeclaration(declaration: EnumDeclaration): boolean {
			return declaration.preComments() !== null || !ASTHelpers.enumIsElided(declaration);
		}

		public emitEnumDeclaration(declaration: EnumDeclaration): void {
			if (!ASTHelpers.enumIsElided(declaration)) {
				this.emitComments(declaration, true);
				this.emitEnum(declaration);
				this.emitComments(declaration, false);
			}
			else {
				this.emitComments(declaration, true, /*onlyPinnedOrTripleSlashComments:*/ true);
			}
		}

		public shouldEmitModuleDeclaration(declaration: ModuleDeclaration): boolean {
			return declaration.preComments() !== null || !ASTHelpers.moduleIsElided(declaration);
		}

		private emitModuleDeclaration(declaration: ModuleDeclaration): void {
			if (!ASTHelpers.moduleIsElided(declaration)) {
				this.emitModuleDeclarationWorker(declaration);
			}
			else {
				this.emitComments(declaration, true, /*onlyPinnedOrTripleSlashComments:*/ true);
			}
		}

		public shouldEmitClassDeclaration(declaration: ClassDeclaration): boolean {
			return declaration.preComments() !== null || !hasModifier(declaration.modifiers, PullElementFlags.Ambient);
		}

		public emitClassDeclaration(declaration: ClassDeclaration): void {
			if (!hasModifier(declaration.modifiers, PullElementFlags.Ambient)) {
				this.emitClass(declaration);
			}
			else {
				this.emitComments(declaration, /*pre:*/ true, /*onlyPinnedOrTripleSlashComments:*/ true);
			}
		}

		public shouldEmitInterfaceDeclaration(declaration: InterfaceDeclaration): boolean {
			return true/*declaration.preComments() !== null*/;
		}

		public emitInterfaceDeclaration(declaration: InterfaceDeclaration): void {
			//if (declaration.preComments() !== null) {
			//	this.emitComments(declaration, /*pre:*/ true, /*onlyPinnedOrTripleSlashComments:*/ true);
			//}
			var symbolForEmit = this.getSymbolForEmit(declaration);
			var symbol = symbolForEmit.symbol;
			var name = symbol.getDisplayName();
			var hasCallOrIndex = symbol.type.hasOwnCallSignatures() || symbol.type.hasOwnIndexSignatures();

			if (this.emittedInterfaces.indexOf(declaration) >= 0) {
				return;
			}

			this.emittedInterfaces.push(declaration);

			var index = this.usedButNotEmittedInterfaces.indexOf(declaration);
			if (index >= 0) {
				this.usedButNotEmittedInterfaces.splice(index, 1);
				index = this.usedButNotEmittedInterfaces.indexOf(declaration);
			}

			if (name === 'String' ||
				name === 'Number' ||
				name === 'Array' ||
				isDTSFile(declaration.fileName())) {
				return;
			}

			this.calcInterfaceEscapeNamesMap(symbol);

			var splitMode = this.getInterfaceSplitToExternsMode(declaration);

			var svFullInterfaceName = this.thisFullInterfaceName;
			var svExternPartName = this.thisFullInterfaceExternPartName;
			this.thisFullInterfaceName = this.getFullSymbolName(symbol);
			this.thisFullInterfaceExternPartName = this.thisFullInterfaceName;

			if (splitMode === InterfaceExternsSplitMode.k_Part) {
				this.thisFullInterfaceExternPartName = this.thisFullInterfaceName + "_BASE";
			}

			if (splitMode === InterfaceExternsSplitMode.k_All) {
				this.isEnabledInterfaceExternStream = true;
			}
			else if (splitMode === InterfaceExternsSplitMode.k_Part) {
				this.isEnabledInterfaceExternStream = true;
				this.writeLineToOutput("");
				this.emitJSDocComment(this.getJSDocForInterfaceDeclaration(declaration));
				this.writeToOutput("var " + this.thisFullInterfaceExternPartName + " = function(){};");
				this.isEnabledInterfaceExternStream = false;
			}

			this.writeLineToOutput("");

			//if (splitMode !== InterfaceExternsSplitMode.k_All) {
			var userComments = Emitter.getUserComments(declaration);

			if (hasCallOrIndex) {
				this.emitJSDocComment(Emitter.joinJSDocComments(userComments, this.getJSDocForTypedef(symbol.type)));
			}
			else {
				this.emitJSDocComment(Emitter.joinJSDocComments(userComments, this.getJSDocForInterfaceDeclaration(declaration)));
			}

			//if (this.isNeedObfuscateName(symbol)) {
			this.writeToOutput("var ");
			//}

			this.writeToOutput(this.thisFullInterfaceName);

			if (!hasCallOrIndex) {
				this.writeToOutput(" = function(){}");
			}

			this.writeToOutput(";");
			//}

			if (!hasCallOrIndex) {
				this.emitInterfaceMembers(declaration);
			}

			this.thisFullInterfaceName = svFullInterfaceName;
			this.thisFullInterfaceExternPartName = svExternPartName;

			if (splitMode === InterfaceExternsSplitMode.k_All) {
				this.isEnabledInterfaceExternStream = false;
			}
		}

		private emitInterfaceMembers(declaration: InterfaceDeclaration) {
			var lastEmittedMember: AST = null;
			var isFirstLine = true;
			var alreadyEmittedMethods: string[] = [];

			var members = declaration.body.typeMembers;

			var isExportedInterface = hasModifier(declaration.modifiers, PullElementFlags.Exported);
			var svEnabledStream = this.isEnabledInterfaceExternStream;
			var externMode = this.getInterfaceSplitToExternsMode(declaration);
			var canEnabelExtern = externMode !== InterfaceExternsSplitMode.k_None;

			for (var i = 0, n = members.nonSeparatorCount(); i < n; i++) {
				var memberDecl = members.nonSeparatorAt(i);

				if (memberDecl.kind() === SyntaxKind.ConstructSignature) {
					continue;
				}

				var symbol: PullSymbol = this.getSymbolForEmit(memberDecl).symbol;
				var name = symbol.getDisplayName();

				if (alreadyEmittedMethods.indexOf(name) >= 0) {
					continue;
				}

				alreadyEmittedMethods.push(name);

				//if (isFirstLine) {
				//	this.writeLineToOutput('');
				//	isFirstLine = false;
				//}

				if (canEnabelExtern && this.isInterfaceMemberForExtern(symbol)) {
					this.isEnabledInterfaceExternStream = true;

					var jsDocComments: string[] = this.getJSDocForType(symbol.type);

					this.writeLineToOutput('');
					this.emitInlineJSDocComment(Emitter.getUserComments(memberDecl), jsDocComments);
					this.writeToOutput(this.thisFullInterfaceExternPartName);

					this.writeToOutput(".prototype");
					if (isQuoted(name)) {
						this.writeToOutput("[" + name + "];");
					}
					else {
						this.writeToOutput('.' + name + ';');
					}

					this.isEnabledInterfaceExternStream = svEnabledStream;
				}

				var jsDocComments: string[] = this.getJSDocForType(symbol.type);

				this.writeLineToOutput('');
				this.emitInlineJSDocComment(Emitter.getUserComments(memberDecl), jsDocComments);
				//if (canEnabelExtern && this.isInterfaceMemberForExtern(symbol)) {
				//	this.writeToOutput(this.thisFullInterfaceExternPartName);
				//}
				//else {
				this.writeToOutput(this.thisFullInterfaceName);
				//}

				this.writeToOutput(".prototype");
				if (isQuoted(name)) {
					this.writeToOutput("[" + name + "];");
				}
				else {
					this.writeToOutput('.' + name + ';');
				}
				lastEmittedMember = memberDecl;

				//if (canEnabelExtern && this.isInterfaceMemberForExtern(symbol)) {
				//	this.isEnabledInterfaceExternStream = svEnabledStream;
				//}
			}
		}

		private firstVariableDeclarator(statement: VariableStatement): VariableDeclarator {
			return <VariableDeclarator>statement.declaration.declarators.nonSeparatorAt(0);
		}

		private isNotAmbientOrHasInitializer(variableStatement: VariableStatement): boolean {
			return !hasModifier(variableStatement.modifiers, PullElementFlags.Ambient) || this.firstVariableDeclarator(variableStatement).equalsValueClause !== null;
		}

		public shouldEmitVariableStatement(statement: VariableStatement): boolean {
			return statement.preComments() !== null || this.isNotAmbientOrHasInitializer(statement);
		}

		public emitVariableStatement(statement: VariableStatement): void {
			if (this.isNotAmbientOrHasInitializer(statement)) {
				this.emitComments(statement, true);
				this.emit(statement.declaration);
				this.writeToOutput(";");
				this.emitComments(statement, false);
			}
			else {
				this.emitComments(statement, /*pre:*/ true, /*onlyPinnedOrTripleSlashComments:*/ true);
			}
		}

		public emitGenericType(type: GenericType): void {
			this.emit(type.name);
		}

		private shouldEmit(ast: AST): boolean {
			if (!ast) {
				return false;
			}

			switch (ast.kind()) {
				case SyntaxKind.ImportDeclaration:
					return this.shouldEmitImportDeclaration(<ImportDeclaration>ast);
				case SyntaxKind.ClassDeclaration:
					return this.shouldEmitClassDeclaration(<ClassDeclaration>ast);
				case SyntaxKind.InterfaceDeclaration:
					return this.shouldEmitInterfaceDeclaration(<InterfaceDeclaration>ast);
				case SyntaxKind.FunctionDeclaration:
					return this.shouldEmitFunctionDeclaration(<FunctionDeclaration>ast);
				case SyntaxKind.ModuleDeclaration:
					return this.shouldEmitModuleDeclaration(<ModuleDeclaration>ast);
				case SyntaxKind.VariableStatement:
					return this.shouldEmitVariableStatement(<VariableStatement>ast);
				case SyntaxKind.OmittedExpression:
					return false;
				case SyntaxKind.EnumDeclaration:
					return this.shouldEmitEnumDeclaration(<EnumDeclaration>ast);
			}

			return true;
		}

		private emit(ast: AST): void {
			if (!ast) {
				return;
			}

			switch (ast.kind()) {
				case SyntaxKind.SeparatedList:
					return this.emitSeparatedList(<ISeparatedSyntaxList2>ast);
				case SyntaxKind.List:
					return this.emitList(<ISyntaxList2>ast);
				case SyntaxKind.SourceUnit:
					return this.emitSourceUnit(<SourceUnit>ast);
				case SyntaxKind.ImportDeclaration:
					return this.emitImportDeclaration(<ImportDeclaration>ast);
				case SyntaxKind.ExportAssignment:
					return this.setExportAssignment(<ExportAssignment>ast);
				case SyntaxKind.ClassDeclaration:
					return this.emitClassDeclaration(<ClassDeclaration>ast);
				case SyntaxKind.InterfaceDeclaration:
					return this.emitInterfaceDeclaration(<InterfaceDeclaration>ast);
				case SyntaxKind.IdentifierName:
					return this.emitName(<Identifier>ast, true);
				case SyntaxKind.VariableDeclarator:
					return this.emitVariableDeclarator(<VariableDeclarator>ast);
				case SyntaxKind.SimpleArrowFunctionExpression:
					return this.emitSimpleArrowFunctionExpression(<SimpleArrowFunctionExpression>ast);
				case SyntaxKind.ParenthesizedArrowFunctionExpression:
					return this.emitParenthesizedArrowFunctionExpression(<ParenthesizedArrowFunctionExpression>ast);
				case SyntaxKind.FunctionDeclaration:
					return this.emitFunctionDeclaration(<FunctionDeclaration>ast);
				case SyntaxKind.ModuleDeclaration:
					return this.emitModuleDeclaration(<ModuleDeclaration>ast);
				case SyntaxKind.VariableDeclaration:
					return this.emitVariableDeclaration(<VariableDeclaration>ast);
				case SyntaxKind.GenericType:
					return this.emitGenericType(<GenericType>ast);
				case SyntaxKind.ConstructorDeclaration:
					return this.emitConstructorDeclaration(<ConstructorDeclaration>ast);
				case SyntaxKind.EnumDeclaration:
					return this.emitEnumDeclaration(<EnumDeclaration>ast);
				case SyntaxKind.EnumElement:
					return this.emitEnumElement(<EnumElement>ast);
				case SyntaxKind.FunctionExpression:
					return this.emitFunctionExpression(<FunctionExpression>ast);
				case SyntaxKind.VariableStatement:
					return this.emitVariableStatement(<VariableStatement>ast);
			}

			this.emitComments(ast, true);
			this.emitWorker(ast);
			this.emitComments(ast, false);
		}

		private emitWorker(ast: AST): void {
			if (!ast) {
				return;
			}

			switch (ast.kind()) {
				case SyntaxKind.NumericLiteral:
					return this.emitNumericLiteral(<NumericLiteral>ast);
				case SyntaxKind.RegularExpressionLiteral:
					return this.emitRegularExpressionLiteral(<RegularExpressionLiteral>ast);
				case SyntaxKind.StringLiteral:
					return this.emitStringLiteral(<StringLiteral>ast);
				case SyntaxKind.FalseKeyword:
				case SyntaxKind.NullKeyword:
				case SyntaxKind.TrueKeyword:
					return this.emitLiteralExpression(<LiteralExpression>ast);
				case SyntaxKind.ThisKeyword:
					return this.emitThisExpression(<ThisExpression>ast);
				case SyntaxKind.SuperKeyword:
					return this.emitSuperExpression(<SuperExpression>ast);
				case SyntaxKind.ParenthesizedExpression:
					return this.emitParenthesizedExpression(<ParenthesizedExpression>ast);
				case SyntaxKind.ArrayLiteralExpression:
					return this.emitArrayLiteralExpression(<ArrayLiteralExpression>ast);
				case SyntaxKind.PostDecrementExpression:
				case SyntaxKind.PostIncrementExpression:
					return this.emitPostfixUnaryExpression(<PostfixUnaryExpression>ast);
				case SyntaxKind.LogicalNotExpression:
				case SyntaxKind.BitwiseNotExpression:
				case SyntaxKind.NegateExpression:
				case SyntaxKind.PlusExpression:
				case SyntaxKind.PreIncrementExpression:
				case SyntaxKind.PreDecrementExpression:
					return this.emitPrefixUnaryExpression(<PrefixUnaryExpression>ast);
				case SyntaxKind.InvocationExpression:
					return this.emitInvocationExpression(<InvocationExpression>ast);
				case SyntaxKind.ElementAccessExpression:
					return this.emitElementAccessExpression(<ElementAccessExpression>ast);
				case SyntaxKind.MemberAccessExpression:
					return this.emitMemberAccessExpression(<MemberAccessExpression>ast);
				case SyntaxKind.QualifiedName:
					return this.emitQualifiedName(<QualifiedName>ast);
				case SyntaxKind.CommaExpression:
				case SyntaxKind.AssignmentExpression:
				case SyntaxKind.AddAssignmentExpression:
				case SyntaxKind.SubtractAssignmentExpression:
				case SyntaxKind.MultiplyAssignmentExpression:
				case SyntaxKind.DivideAssignmentExpression:
				case SyntaxKind.ModuloAssignmentExpression:
				case SyntaxKind.AndAssignmentExpression:
				case SyntaxKind.ExclusiveOrAssignmentExpression:
				case SyntaxKind.OrAssignmentExpression:
				case SyntaxKind.LeftShiftAssignmentExpression:
				case SyntaxKind.SignedRightShiftAssignmentExpression:
				case SyntaxKind.UnsignedRightShiftAssignmentExpression:
				case SyntaxKind.LogicalOrExpression:
				case SyntaxKind.LogicalAndExpression:
				case SyntaxKind.BitwiseOrExpression:
				case SyntaxKind.BitwiseExclusiveOrExpression:
				case SyntaxKind.BitwiseAndExpression:
				case SyntaxKind.EqualsWithTypeConversionExpression:
				case SyntaxKind.NotEqualsWithTypeConversionExpression:
				case SyntaxKind.EqualsExpression:
				case SyntaxKind.NotEqualsExpression:
				case SyntaxKind.LessThanExpression:
				case SyntaxKind.GreaterThanExpression:
				case SyntaxKind.LessThanOrEqualExpression:
				case SyntaxKind.GreaterThanOrEqualExpression:
				case SyntaxKind.InstanceOfExpression:
				case SyntaxKind.InExpression:
				case SyntaxKind.LeftShiftExpression:
				case SyntaxKind.SignedRightShiftExpression:
				case SyntaxKind.UnsignedRightShiftExpression:
				case SyntaxKind.MultiplyExpression:
				case SyntaxKind.DivideExpression:
				case SyntaxKind.ModuloExpression:
				case SyntaxKind.AddExpression:
				case SyntaxKind.SubtractExpression:
					return this.emitBinaryExpression(<BinaryExpression>ast);
				case SyntaxKind.ConditionalExpression:
					return this.emitConditionalExpression(<ConditionalExpression>ast);
				case SyntaxKind.EqualsValueClause:
					return this.emitEqualsValueClause(<EqualsValueClause>ast);
				case SyntaxKind.Parameter:
					return this.emitParameter(<Parameter>ast);
				case SyntaxKind.Block:
					return this.emitBlock(<Block>ast);
				case SyntaxKind.ElseClause:
					return this.emitElseClause(<ElseClause>ast);
				case SyntaxKind.IfStatement:
					return this.emitIfStatement(<IfStatement>ast);
				case SyntaxKind.ExpressionStatement:
					return this.emitExpressionStatement(<ExpressionStatement>ast);
				case SyntaxKind.GetAccessor:
					return this.emitGetAccessor(<GetAccessor>ast);
				case SyntaxKind.SetAccessor:
					return this.emitSetAccessor(<SetAccessor>ast);
				case SyntaxKind.ThrowStatement:
					return this.emitThrowStatement(<ThrowStatement>ast);
				case SyntaxKind.ReturnStatement:
					return this.emitReturnStatement(<ReturnStatement>ast);
				case SyntaxKind.ObjectCreationExpression:
					return this.emitObjectCreationExpression(<ObjectCreationExpression>ast);
				case SyntaxKind.SwitchStatement:
					return this.emitSwitchStatement(<SwitchStatement>ast);
				case SyntaxKind.CaseSwitchClause:
					return this.emitCaseSwitchClause(<CaseSwitchClause>ast);
				case SyntaxKind.DefaultSwitchClause:
					return this.emitDefaultSwitchClause(<DefaultSwitchClause>ast);
				case SyntaxKind.BreakStatement:
					return this.emitBreakStatement(<BreakStatement>ast);
				case SyntaxKind.ContinueStatement:
					return this.emitContinueStatement(<ContinueStatement>ast);
				case SyntaxKind.ForStatement:
					return this.emitForStatement(<ForStatement>ast);
				case SyntaxKind.ForInStatement:
					return this.emitForInStatement(<ForInStatement>ast);
				case SyntaxKind.WhileStatement:
					return this.emitWhileStatement(<WhileStatement>ast);
				case SyntaxKind.WithStatement:
					return this.emitWithStatement(<WithStatement>ast);
				case SyntaxKind.CastExpression:
					return this.emitCastExpression(<CastExpression>ast);
				case SyntaxKind.ObjectLiteralExpression:
					return this.emitObjectLiteralExpression(<ObjectLiteralExpression>ast);
				case SyntaxKind.SimplePropertyAssignment:
					return this.emitSimplePropertyAssignment(<SimplePropertyAssignment>ast);
				case SyntaxKind.FunctionPropertyAssignment:
					return this.emitFunctionPropertyAssignment(<FunctionPropertyAssignment>ast);
				case SyntaxKind.EmptyStatement:
					return this.writeToOutputWithSourceMapRecord(";", ast);
				case SyntaxKind.TryStatement:
					return this.emitTryStatement(<TryStatement>ast);
				case SyntaxKind.CatchClause:
					return this.emitCatchClause(<CatchClause>ast);
				case SyntaxKind.FinallyClause:
					return this.emitFinallyClause(<FinallyClause>ast);
				case SyntaxKind.LabeledStatement:
					return this.emitLabeledStatement(<LabeledStatement>ast);
				case SyntaxKind.DoStatement:
					return this.emitDoStatement(<DoStatement>ast);
				case SyntaxKind.TypeOfExpression:
					return this.emitTypeOfExpression(<TypeOfExpression>ast);
				case SyntaxKind.DeleteExpression:
					return this.emitDeleteExpression(<DeleteExpression>ast);
				case SyntaxKind.VoidExpression:
					return this.emitVoidExpression(<VoidExpression>ast);
				case SyntaxKind.DebuggerStatement:
					return this.emitDebuggerStatement(<DebuggerStatement>ast);
			}
		}


		private isNeedObfuscateName(symbol: PullSymbol): boolean {
			return PullHelpers.symbolIsModule(symbol.getContainer()) && (!symbol.anyDeclHasFlag(PullElementFlags.Exported) || symbol.isInterface()) && !symbol.isPrimitive();
		}

		private getObfuscatedName(symbol: PullSymbol, origName: string, force: boolean = false): string {
			if (!force && !this.isNeedObfuscateName(symbol)) {
				return origName;
			}

			var findIndex = this.obfuscatedSymbolList.indexOf(symbol);
			var obfusctatedName = "";

			if (findIndex < 0) {
				this.obfuscatedSymbolList.push(symbol);
				obfusctatedName = this.obfuscatedSymbolNameMap[this.obfuscatedSymbolList.length - 1] =
				"$$_" + origName + "_" + (this.obfuscatorCounter++) + "_$$";
			}
			else {
				obfusctatedName = this.obfuscatedSymbolNameMap[findIndex];
			}

			return obfusctatedName;
		}

		// Helps with type checking due to --noImplicitAny
		private static EMPTY_STRING_LIST: string[] = [];

		private static getUserComments(node: AST): string[] {
			var comments: Comment[] = node.preComments();
			if (comments === null) {
				return [];
			}
			return Emitter.EMPTY_STRING_LIST.concat<any>(comments.map((comment: Comment) => {
				return comment.fullText().split('\n');
			})).map((line: string) => (line + '').replace(/^\/\/\s?/, '').replace(/^\/\*\*/, '').replace(/\*\/$/, ''));
		}

		private static joinJSDocComments(first: string[], second: string[]): string[] {
			return first.concat(first.length && second.length ? [''] : Emitter.EMPTY_STRING_LIST, second);
		}

		private static stripOffArrayType(type: string): string {
			return type.replace(/^Array\.<(.*)>$/, '$1');
		}

		private getFullSymbolNameForAST(ast: AST): string {
			return this.getFullSymbolName(this.getSymbolForEmit(ast).symbol);
		}

		private getFullSymbolName(symbol: PullSymbol): string {
			var correctSymbol = symbol;

			if (correctSymbol.isTypeReference()) {
				correctSymbol = (<PullInstantiatedTypeReferenceSymbol>correctSymbol).referencedTypeSymbol;
			}

			if (correctSymbol.isType() && !correctSymbol.isInterface() && !correctSymbol.isPrimitive()) {
				if (!correctSymbol.type.isEnum()) {
					if (correctSymbol.type.isAlias()) {
						correctSymbol = (<PullTypeAliasSymbol>correctSymbol.type).assignedType();
					}

					correctSymbol = correctSymbol.type.getConstructorMethod();
				}
			}

			var moduleName = "";
			if (!this.isNeedObfuscateName(correctSymbol) && correctSymbol.getContainer() !== null && !correctSymbol.isPrimitive()) {
				moduleName = correctSymbol.getContainer().fullName() + ".";
			}

			var symbolName = this.getObfuscatedName(correctSymbol, correctSymbol.getDisplayName());

			if (correctSymbol.isInterface()) {
				var decl = <InterfaceDeclaration>this.semanticInfoChain.getASTForDecl(correctSymbol.getDeclarations()[0]);
				if (this.emittedInterfaces.indexOf(decl) < 0 && this.usedButNotEmittedInterfaces.indexOf(decl) < 0) {
					this.usedButNotEmittedInterfaces.push(decl);
				}

				if (this.isEnabledInterfaceExternStream) {
					if (this.getInterfaceSplitToExternsMode(decl) === InterfaceExternsSplitMode.k_Part) {
						symbolName += "_BASE";
					}
				}
			}

			if (this.isEnabledInterfaceExternStream && correctSymbol.type.isEnum()) {
				return "number";
			}

			return moduleName + symbolName;
		}

		private getFullSymbolNameType(symbol: PullSymbol): string {
			var baseName = this.getFullSymbolName(symbol);
			var baseType = symbol.isTypeReference() ? (<PullInstantiatedTypeReferenceSymbol>symbol) : symbol.type;

			if (baseType.isGeneric()) {
				var genericPart = "";
				var typeParameters = baseType.getTypeArgumentsOrTypeParameters();

				if (typeParameters) {
					genericPart = ".<";

					for (var i = 0; i < typeParameters.length; i++) {
						var param = typeParameters[i];
						genericPart += this.formatJSDocType(param)/*this.getFullSymbolNameType(param)*/;

						if (i < typeParameters.length - 1) {
							genericPart += ", ";
						}
					}

					genericPart += ">";
				}
				baseName += genericPart;
			}

			return baseName;
		}

		private getJSDocForInterfaceDeclaration(interfaceDecl: InterfaceDeclaration): string[] {
			var result = ['@interface'];
			var symbol = this.semanticInfoChain.getSymbolForAST(interfaceDecl);
			if (symbol[splitToExternMode] === InterfaceExternsSplitMode.k_Part && !this.isEnabledInterfaceExternStream) {
				result.push("@extends {" + this.thisFullInterfaceExternPartName + "}");
			}
			return result.concat<any>(this.getJSDocForExtends(interfaceDecl.heritageClauses),
				this.getJSDocForTemplatesForAST(interfaceDecl));
		}

		private getJSDocForTemplatesForAST(ast: AST): string {
			return this.getJSDocForTemplates(this.semanticInfoChain.getSymbolForAST(ast).type);
		}

		private getJSDocForTemplates(signature: PullSignatureSymbol): string;
		private getJSDocForTemplates(type: PullTypeSymbol): string;
		private getJSDocForTemplates(typeOrSignature: any): string {

			var type = <PullTypeSymbol>typeOrSignature;

			if (!type.isGeneric()) {
				return "";
			}

			var typeParameters: PullTypeParameterSymbol[] = type.getTypeParameters();

			if (typeParameters && typeParameters.length === 0) {
				return "";
			}

			return "@template " + typeParameters.map((param) => {
				return param.getDisplayName();
			}).join(", ");
		}


		private getJSDocForClass(classDecl: ClassDeclaration): string[] {
			var constrDecl = getLastConstructor(classDecl);
			var jsDocForParams = Emitter.EMPTY_STRING_LIST;

			if (constrDecl) {
				var constrSignatures = this.semanticInfoChain.getSymbolForAST(constrDecl).type.getConstructSignatures();
				var parameters = constrSignatures[constrSignatures.length - 1].parameters;
				jsDocForParams = this.getJSDocForArguments(parameters);
			}

			return ['@constructor', '@struct', TypeScript.hasModifier(classDecl.modifiers, PullElementFlags.Final) ? '@final' : ''].concat<any>(
				this.getJSDocForExtends(classDecl.heritageClauses),
				this.getJSDocForImplements(classDecl.heritageClauses),
				this.getJSDocForTemplatesForAST(classDecl),
				jsDocForParams);
		}
		private getJSDocForFunctionDeclaration(funcDecl: MemberFunctionDeclaration): string[];
		private getJSDocForFunctionDeclaration(funcDecl: FunctionDeclaration): string[];
		private getJSDocForFunctionDeclaration(memberOrFuncDecl: any): string[] {
			var jsDocComments: string[] = [];

			var funcDecl = <FunctionDeclaration>memberOrFuncDecl;
			var symbol = this.semanticInfoChain.getSymbolForAST(funcDecl);
			var callSignatures = symbol.type.getCallSignatures();
			var signature = callSignatures[callSignatures.length - 1];

			var isClassMember = funcDecl.kind() === SyntaxKind.MemberFunctionDeclaration;

			if (isClassMember) {
				var isFinalClass = hasModifier(this.thisClassNode.modifiers, PullElementFlags.Final);
				var isExportedClass = hasModifier(this.thisClassNode.modifiers, PullElementFlags.Exported);
				var isFinalMethod = hasModifier(funcDecl.modifiers, PullElementFlags.Final);
				var isPrivate = hasModifier(funcDecl.modifiers, PullElementFlags.Private);
				var isProtected = hasModifier(funcDecl.modifiers, PullElementFlags.Protected);
				var isStatic = hasModifier(funcDecl.modifiers, PullElementFlags.Static);
				var isAkraSystemFunction = Emitter.isAkraSystemName(symbol.getDisplayName());

				if (!isFinalClass && !isFinalMethod && isExportedClass && !isPrivate && !isAkraSystemFunction) {
					if (isStatic) {
						//jsDocComments.push("@expose");
					}
					else {
						jsDocComments.push("1expose1");
					}
				}
				else if (isFinalMethod) {
					jsDocComments.push("@final");
				}

				if (isProtected) {
					jsDocComments.push("@protected");
				}

				if (isPrivate) {
					jsDocComments.push("@private");
				}

				if (isStatic) {
					jsDocComments.push("@this {" + this.thisFullClassName + "}");
				}
			}

			if (callSignatures.length === 1) {
				jsDocComments = jsDocComments.concat(this.getJSDocForArguments(signature.parameters).concat(
					signature.returnType !== null && signature.returnType.getTypeName() !== 'void'
					? this.getJSDocForReturnType(signature.returnType)
					: Emitter.EMPTY_STRING_LIST));

				var templates = this.getJSDocForTemplates(signature);

				if (templates !== "") {
					jsDocComments.push(templates);
				}
			}
			else {
				var svIsBlockTemplate = this.isTypeParametersEmitBlocked;
				if (!isClassMember) {
					this.isTypeParametersEmitBlocked = true;
				}

				jsDocComments = jsDocComments.concat(this.getJSDocForType(symbol.type));

				if (!isClassMember) {
					this.isTypeParametersEmitBlocked = svIsBlockTemplate;
				}
			}

			return jsDocComments;
		}

		private getJSDocForArguments(symbols: PullSymbol[]): string[] {
			return symbols.map((symbol: PullSymbol): string => {
				var type: string = this.formatJSDocType(symbol.type);

				if (symbol.isVarArg) {
					return '@param {...' + Emitter.stripOffArrayType(type) + '} ' + Emitter.mangleRestParameterName(symbol);
				}

				if (symbol.isOptional) {
					type += '=';
				}

				return '@param {' + type + '} ' + symbol.getDisplayName();
			});
		}

		private getJSDocForImplements(herigateList: ISyntaxList2): string[] {
			var implementsClause = ASTHelpers.getImplementsHeritageClause(herigateList);

			if (implementsClause === null) {
				return Emitter.EMPTY_STRING_LIST;
			}

			var implementsList = implementsClause.typeNames;
			var count = implementsList.nonSeparatorCount();
			var result = new Array(count);

			for (var i = 0; i < count; i++) {
				var member = implementsList.nonSeparatorAt(i);
				result[i] = '@implements {' + this.formatJSDocType(this.semanticInfoChain.getSymbolForAST(member).type) + '}';
			}

			return result;
		}

		private getJSDocForExtends(herigateList: ISyntaxList2): string[] {
			var extendsClause = ASTHelpers.getExtendsHeritageClause(herigateList);

			if (extendsClause === null) {
				return Emitter.EMPTY_STRING_LIST;
			}

			var extendsList = extendsClause.typeNames;
			var count = extendsList.nonSeparatorCount();
			var result = new Array(count);

			for (var i = 0; i < count; i++) {
				var member = extendsList.nonSeparatorAt(i);
				result[i] = '@extends {' + this.formatJSDocType(this.semanticInfoChain.getSymbolForAST(member).type) + '}';
			}

			return result;
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

		private emitInlineJSDocComment(jsDoc: string[]);
		private emitInlineJSDocComment(user: string[], jsDoc: string[]);
		private emitInlineJSDocComment(user: string[], jsDoc?: string[]) {
			if (arguments.length === 1) {
				this.writeToOutput('/** ' + arguments[0].join(' ') + ' */ ');
			}
			else if (user.length === 0) {
				this.writeToOutput('/** ' + jsDoc.join(' ') + ' */ ');
			}
			else {
				this.emitJSDocComment(Emitter.joinJSDocComments(user, jsDoc));
			}
		}

		private getJSDocForTypedef(type: PullTypeSymbol): string[] {
			/** Need for change typeParameter to ?, because templates are not support in @typedef in closure*/
			var svIsBlockTemplate = this.isTypeParametersEmitBlocked;
			this.isTypeParametersEmitBlocked = true;
			var result = ['@typedef {' + this.formatJSDocType(type, true) + '}'];
			this.isTypeParametersEmitBlocked = svIsBlockTemplate;

			return result;
		}

		private getJSDocForType(type: PullTypeSymbol): string[] {
			return ['@type {' + this.formatJSDocType(type) + '}'];
		}

		private getJSDocForReturnType(returnType: PullTypeSymbol): string[] {
			return ['@returns {' + this.formatJSDocType(returnType) + '}'];
		}

		private getJSDocForEnumDeclaration(enumDecl: EnumDeclaration): string[] {
			return ['@enum {number}'];
		}

		private getJSDocForVariableDeclaration(symbol: PullSymbol): string[] {
			var svIsBlockTemplate = this.isTypeParametersEmitBlocked;
			this.isTypeParametersEmitBlocked = true;
			var result = this.getJSDocForType(symbol.type);

			if (symbol.anyDeclHasFlag(PullElementFlags.Const)) {
				result.push("@const");
			}

			this.isTypeParametersEmitBlocked = svIsBlockTemplate;

			return result;
		}

		private getJSDocForClassMemberVariable(symbol: PullSymbol): string[] {
			var jsDocComments: string[] = this.getJSDocForVariableDeclaration(symbol);
			var isClassExports = hasModifier(this.thisClassNode.modifiers, PullElementFlags.Exported);
			var isClassFinal = hasModifier(this.thisClassNode.modifiers, PullElementFlags.Final);

			if (symbol.anyDeclHasFlag(PullElementFlags.Protected)) {
				//if (isClassExports && !isClassFinal && !isConst) {
				//	jsDocComments.push("@expose");
				//}

				jsDocComments.push("@protected");
			}
			else if (symbol.anyDeclHasFlag(PullElementFlags.Private)) {
				jsDocComments.push("@private");
			}

			return jsDocComments;
		}

		private formatJSDocType(type: PullTypeSymbol, ignoreName: boolean = false): string {
			// Google Closure Compiler's type system is not powerful enough to work
			// with type parameters, especially type parameters with constraints

			if (type.isTypeParameter() && this.isTypeParametersEmitBlocked) {
				return '?';
			}
			else if (type.isTypeParameter()) {
				return type.getDisplayName();
			}

			// Simple types
			if (type.isNamedTypeSymbol() && ignoreName === false) {
				var name: string = this.getFullSymbolNameType(type);
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
				type.hasOwnCallSignatures()) {
				return this.formatJSDocUnionType(type.getCallSignatures().map((signature) => {
					return '?function(' + // TypeScript has nullable functions
						signature.parameters.map((arg) => { return this.formatJSDocArgumentType(arg) }).join(', ') + ')' +
						((signature.returnType !== null && signature.returnType.getTypeName() !== 'void') ? (': ' + this.formatJSDocType(signature.returnType)) : '');
				}));
			}

			// Constructor types
			if (type.kind & TypeScript.PullElementKind.ConstructorType && type.getConstructSignatures().length > 0) {
				return this.formatJSDocUnionType(type.getConstructSignatures().map(signature => '?function(' + // TypeScript has nullable functions
					(signature.returnType !== null && signature.returnType.getTypeName() !== 'void' ? ['new:' + this.formatJSDocType(signature.returnType)] :
						Emitter.EMPTY_STRING_LIST).concat(signature.parameters.map((arg: PullSymbol) => this.formatJSDocArgumentType(arg))).join(', ') + ')'));
			}

			// Map types
			if ((type.isObject() || type.isInterface()) && type.hasOwnIndexSignatures()) {
				return this.formatJSDocUnionType(type.getIndexSignatures().map(signature => 'Object.<' +
					this.formatJSDocType(signature.parameters[0].type) + ', ' + this.formatJSDocType(signature.returnType) + '>'));
			}

			// Object types and interfaces
			if ((type.isObject() || type.isInterface())) {
				if (type.getMembers().length === 0) {
					return '?Object'; // Object types are nullable in TypeScript
				}
				if (type.getMembers().some(member => /[^A-Za-z0-9_$]/.test(member.getDisplayName()))) {
					return '?'; // Google Closure Compiler's type parser cannot quote names
				}
				return '?{ ' + // Object types are nullable in TypeScript
					type.getMembers().map(member => member.getDisplayName() + ': ' + this.formatJSDocType(member.type)).join(', ') + ' }';
			}

			// Arrays
			if (type.isArrayNamedTypeReference()) {
				return 'Array.<' + this.formatJSDocType(type.getTypeArguments()[0]) + '>';
			}

			//debugger;
			throw new Error(TypeScript.PullElementKind[type.kind] + ' types like "' + type.getTypeName() + '" are not supported');
		}

		private formatJSDocUnionType(parts: string[]): string {
			return parts.length === 1 ? parts[0] : '(' + parts.join('|') + ')';
		}

		private formatJSDocArgumentType(arg: PullSymbol): string {
			return arg.isVarArg
				? '...[' + Emitter.stripOffArrayType(this.formatJSDocType(arg.type)) + ']'
				: (this.formatJSDocType(arg.type) + (arg.isOptional ? "=" : ""));
		}

		private tryGetEnumValue(pullSymbol: PullSymbol): number {
			if (pullSymbol.kind === PullElementKind.EnumMember) {
				var pullDecls = pullSymbol.getDeclarations();
				if (pullDecls.length === 1) {
					var pullDecl = pullDecls[0];
					if (pullDecl.kind === PullElementKind.EnumMember) {
						var value = (<PullEnumElementDecl>pullDecl).constantValue;
						return value;
					}
				}
			}

			return null;
		}

		private static mangleRestParameterName(symbol: PullSymbol): string {
			return symbol.getDisplayName() + "$rest";
		}

		private getNameForExport(symbol: PullSymbol, symbolName?: string): string {
			var result = "";

			var pullDecl = symbol.getDeclarations()[0];
			var path: PullDecl[] = pullDecl.getParentPath();

			if (path.length === 2) {
				result = "global['" + symbol.name + "']";
			}
			else {
				for (var i = path.length - 1; i > 0; i--) {
					var nextSymbol: PullSymbol = path[i - 1].getSymbol();

					// Stop before functions since symbols inside functions are
					// automatically available through regular lexical scoping
					if (nextSymbol === null || nextSymbol.kind & TypeScript.PullElementKind.SomeFunction) {
						break;
					}
				}

				//var names: string[] = path.slice(i, path.length - 1).map(pullDecl => {
				//	return pullDecl.getSymbol().name;
				//});

				var containerShortName = "global";
				//var me = this;

				//path.slice(i, path.length - 1).forEach(function (pullDecl) {
				//	containerShortName = me.getShortName(containerShortName + "['" + pullDecl.getSymbol().name + "']", pullDecl.getSymbol());
				//});

				containerShortName = this.getShortName(symbol.getContainer().fullName());

				//var names: string[] = path.slice(i, path.length - 1).map(pullDecl => {
				//	return pullDecl.getSymbol().name;
				//});

				//result = this.getShortName("global['" + names.join("']['") + "']") + "['" + symbol.name + "']";
				result = containerShortName + "['" + symbol.name + "']";
			}

			return result;
		}

		private exportSymbol(symbol: PullSymbol, symbolName?: string): void {
			this.writeLineToOutput("");
			this.emitIndent();
			var pullDecl = symbol.getDeclarations()[0];
			var path: PullDecl[] = pullDecl.getParentPath();

			if (path.length === 2) {
				var internalPath = "global['" + symbol.name + "']";
				this.writeToOutput(internalPath + " = " + internalPath + " || {};");
				this.writeLineToOutput("");

				if (PullHelpers.symbolIsModule(symbol)) {
					//var shortName = this.getShortName(internalPath, symbol);
					var shortName = this.getShortName(symbol.fullName());
					this.writeToOutput("var " + shortName + " = " + internalPath + ";");
				}

				this.writeLineToOutput("");

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

			var containerShortName = "global";
			var me = this;

			var names: string[] = path.slice(i, path.length - 1).map(pullDecl => {
				return pullDecl.getSymbol().name;
			});

			//path.slice(i, path.length - 1).forEach(function (pullDecl) {
			//	containerShortName = me.getShortName(containerShortName + "['" + pullDecl.getSymbol().name + "']", pullDecl.getSymbol())
			//});
			containerShortName = this.getShortName(symbol.getContainer().fullName());

			//var externalName = this.getShortName("global['" + names.join("']['") + "']") + "['" + symbol.name + "']";

			var externalName = containerShortName + "['" + symbol.name + "']";
			var internalPath: string = names.join(".");

			//this.writeToOutput(internalPath + "['" + symbol.name + "'] = ");

			this.writeToOutput(externalName + " = ");

			if (PullHelpers.symbolIsModule(symbol)) {
				this.writeToOutput(externalName + " || {};");
				this.writeLineToOutput("");

				//var shortName = this.getShortName(externalName, symbol);
				var shortName = this.getShortName(symbol.fullName());

				this.writeToOutput("var " + shortName + " = " + externalName + ";");
			}
			else {
				if (symbolName) {
					this.writeToOutput(symbolName + ";");
				}
				else {
					this.writeToOutput(internalPath + "." + symbol.name + ";");
				}
			}
			this.writeLineToOutput("");
		}

		private static isAkraSystemName(name: string): boolean {
			return name[0] === "_";
		}

		private getContainerEscapeOptionForName(symbol: PullSymbol, name: string): boolean {
			if (symbol[escapeNamesMap]) {
				return !!(symbol[escapeNamesMap][name]);
			}

			if (symbol.type.isInterface()) {
				this.calcInterfaceEscapeNamesMap(symbol);
			}
			else if (symbol.type.isClass()) {
				this.calcClassEscapeNamesMap(symbol);
			}
			else {
				//console.log("something going wrong " + name);
				return false;
			}

			return this.getContainerEscapeOptionForName(symbol, name);
		}

		private calcInterfaceEscapeNamesMap(interfaceSymbol: PullSymbol): any {
			var interfaceType = interfaceSymbol.type;
			if (interfaceType.isTypeReference()) {
				interfaceType = (<PullTypeReferenceSymbol>interfaceType).referencedTypeSymbol;
			}

			if (interfaceType[escapeNamesMap]) {
				return interfaceType[escapeNamesMap];
			}

			var result = interfaceType[escapeNamesMap] = {};
			var declaration = <InterfaceDeclaration>this.semanticInfoChain.getASTForDecl(interfaceType.getDeclarations()[0]);

			if (isDTSFile(declaration.fileName())) {
				return result;
			}

			var extendsClause = ASTHelpers.getExtendsHeritageClause(declaration.heritageClauses);

			if (extendsClause !== null) {
				var extendsList = extendsClause.typeNames;
				var count = extendsList.nonSeparatorCount();

				for (var i = 0; i < count; i++) {
					var extendsMember = <InterfaceDeclaration>extendsList.nonSeparatorAt(i);
					var extendsType = this.semanticInfoChain.getSymbolForAST(extendsMember).type;
					var escapes = this.calcInterfaceEscapeNamesMap(extendsType);

					for (var j in escapes) {
						result[j] = escapes[j];
					}
				}
			}

			if (!declaration.body) {
				return result;
			}

			var members = declaration.body.typeMembers;
			var alreadyCheckedMembers: string[] = [];
			var externMode = this.getInterfaceSplitToExternsMode(declaration);
			var canEnabelExtern = externMode !== InterfaceExternsSplitMode.k_None;

			for (var i = 0, n = members.nonSeparatorCount(); i < n; i++) {
				var memberDecl = members.nonSeparatorAt(i);

				if (memberDecl.kind() === SyntaxKind.ConstructSignature ||
					memberDecl.kind() === SyntaxKind.CallSignature ||
					memberDecl.kind() === SyntaxKind.IndexSignature) {
					continue;
				}

				var symbol: PullSymbol = this.semanticInfoChain.getSymbolForAST(memberDecl);
				var name = symbol.getDisplayName();

				if (alreadyCheckedMembers.indexOf(name) >= 0 || result[name] !== undefined) {
					continue;
				}

				alreadyCheckedMembers.push(name);

				if (canEnabelExtern && this.isInterfaceMemberForExtern(symbol)) {
					this.setSymbolEscapeOption(symbol, false);
				}

				if (isQuoted(name)) {
					name = name.substring(1, name.length - 2);
				}

				result[name] = this.isNeedPropertyEscape(symbol);
			}

			return result;
		}

		private calcClassEscapeNamesMap(classSymbol: PullSymbol): any {
			var classType = classSymbol.type;
			if (classType.isTypeReference()) {
				classType = (<PullTypeReferenceSymbol>classType).referencedTypeSymbol;
			}

			if (classType[escapeNamesMap]) {
				return classType[escapeNamesMap];
			}

			var result = classType[escapeNamesMap] = {};
			var declaration = <ClassDeclaration>this.semanticInfoChain.getASTForDecl(classType.getDeclarations()[0]);

			if (isDTSFile(declaration.fileName())) {
				return result;
			}

			var extendsClause = ASTHelpers.getExtendsHeritageClause(declaration.heritageClauses);
			var implementsClause = ASTHelpers.getImplementsHeritageClause(declaration.heritageClauses);

			if (implementsClause) {
				var implementsList = implementsClause.typeNames;
				var count = implementsList.nonSeparatorCount();

				for (var i = 0; i < count; i++) {
					var implementsMember = <InterfaceDeclaration>implementsList.nonSeparatorAt(i);
					var implementsType = this.semanticInfoChain.getSymbolForAST(implementsMember).type;
					var escapes = this.calcInterfaceEscapeNamesMap(implementsType);

					for (var j in escapes) {
						result[j] = escapes[j];
					}
				}
			}

			if (extendsClause !== null) {
				var extendsList = extendsClause.typeNames;
				var count = extendsList.nonSeparatorCount();

				for (var i = 0; i < count; i++) {
					var extendsMember = <ClassDeclaration>extendsList.nonSeparatorAt(i);
					var extendsType = this.semanticInfoChain.getSymbolForAST(extendsMember).type;
					var escapes = this.calcClassEscapeNamesMap(extendsType);

					for (var j in escapes) {
						result[j] = escapes[j];
					}
				}
			}

			var isClassExported = hasModifier(declaration.modifiers, PullElementFlags.Exported);
			var isClassFinal = hasModifier(declaration.modifiers, PullElementFlags.Final);
			var constructorDecl = getLastConstructor(declaration);

			if (!declaration.classElements && !(constructorDecl)) {
				return result;
			}

			if (constructorDecl) {
				for (var i = 0, n = constructorDecl.callSignature.parameterList.parameters.nonSeparatorCount(); i < n; i++) {
					var parameter = <Parameter>constructorDecl.callSignature.parameterList.parameters.nonSeparatorAt(i);
					var parameterDecl = this.semanticInfoChain.getDeclForAST(parameter);
					if (hasFlag(parameterDecl.flags, PullElementFlags.PropertyParameter)) {
						var symbol = this.semanticInfoChain.getSymbolForAST(parameter);
						var name = symbol.getDisplayName();

						if (result[name] === undefined) {
							result[name] = this.isNeedPropertyEscape(symbol);
						}
					}
				}
			}

			for (var i = 0, n = declaration.classElements.childCount(); i < n; i++) {
				var childDecl = this.thisClassNode.classElements.childAt(i);
				if (!childDecl ||
					childDecl.kind() === SyntaxKind.ConstructorDeclaration ||
					childDecl.kind() === SyntaxKind.GetAccessor ||
					childDecl.kind() === SyntaxKind.SetAccessor) {
					continue;
				}

				var symbol = this.semanticInfoChain.getSymbolForAST(childDecl);
				var name = symbol.getDisplayName();

				if (childDecl.kind() === SyntaxKind.MemberFunctionDeclaration && (isClassFinal || symbol.anyDeclHasFlag(PullElementFlags.Final))) {
					result[name] = this.setSymbolEscapeOption(symbol, false);
				}

				if (result[name] === undefined) {
					result[name] = this.isNeedPropertyEscape(symbol);
				}
			}

			return result;
		}

		private setSymbolEscapeOption(symbol: PullSymbol, isEscape: boolean) {
			return symbol[isNeedEscape] = isEscape;
		}

		private isNeedEscapeName(symbol: PullSymbol): boolean {
			if (!symbol) {
				return false;
			}

			if (symbol[isNeedEscape] !== undefined) {
				return symbol[isNeedEscape];
			}

			if (symbol.isContainer() || !symbol.getContainer() ||
				PullHelpers.symbolIsModule(symbol) ||
				PullHelpers.symbolIsModule(symbol.type)) {

				return this.setSymbolEscapeOption(symbol, false);
			}

			var container = symbol.getContainer();
			var name = symbol.getDisplayName();

			if (PullHelpers.symbolIsModule(container)) {
				return this.setSymbolEscapeOption(symbol, this.isNeedEscapeVariableInModule(symbol));
			}
			else {
				if (isQuoted(name)) {
					return this.setSymbolEscapeOption(symbol, true);
				}
				//if (symbol.type.isFunction()) {
				//	if (symbol.isMethod()) {
				return this.setSymbolEscapeOption(symbol, this.getContainerEscapeOptionForName(container, name));
				//	}
				//}
			}

			return this.setSymbolEscapeOption(symbol, false);
		}

		private isNeedEscapeVariableInModule(symbol: PullSymbol): boolean {
			if (!symbol || symbol.isContainer() || !symbol.getContainer()) {
				return false;
			}

			var container = symbol.getContainer();
			var name = symbol.getDisplayName();

			if (!PullHelpers.symbolIsModule(container) ||
				PullHelpers.symbolIsModule(symbol) ||
				PullHelpers.symbolIsModule(symbol.type) ||
				symbol.isContainer() ||
				symbol.isInterface() ||
				symbol.isType() ||
				symbol.type.isFunction() ||
				symbol.anyDeclHasFlag(PullElementFlags.Const) ||
				!symbol.anyDeclHasFlag(PullElementFlags.Exported)) {
				return false;
			}

			var declaration = <ModuleDeclaration>this.semanticInfoChain.getASTForDecl(symbol.getDeclarations()[0]);

			if (isDTSFile(declaration.fileName())) {
				return false;
			}

			return true;
		}

		private isNeedPropertyEscape(symbol: PullSymbol) {
			if (!symbol) {
				return false;
			}

			if (symbol[isNeedEscape] !== undefined) {
				return symbol[isNeedEscape];
			}

			var container = symbol.getContainer();
			var name = symbol.getDisplayName();

			if (isQuoted(name)) {
				return this.setSymbolEscapeOption(symbol, true);
			}

			if (symbol.isMethod() &&
				container.anyDeclHasFlag(PullElementFlags.Exported) &&
				symbol.anyDeclHasFlag(PullElementFlags.Public) && !symbol.anyDeclHasFlag(PullElementFlags.Protected) &&
				!symbol.anyDeclHasFlag(PullElementFlags.Final) && !container.anyDeclHasFlag(PullElementFlags.Final) &&
				!symbol.anyDeclHasFlag(PullElementFlags.Static) &&
				!Emitter.isAkraSystemName(name)) {

				if (symbol.getContainer().isInterface()) {
					return this.setSymbolEscapeOption(symbol, this.isMethodOfInterfaceAlwaysFinal(symbol));
				}

				return this.setSymbolEscapeOption(symbol, true);
			}

			if (symbol.isProperty() &&
				container.anyDeclHasFlag(PullElementFlags.Exported) &&
				symbol.anyDeclHasFlag(PullElementFlags.Public) && !symbol.anyDeclHasFlag(PullElementFlags.Protected)) {

				return this.setSymbolEscapeOption(symbol, true);
			}

			return this.setSymbolEscapeOption(symbol, false);
		}

		private isMethodOfInterfaceAlwaysFinal(symbol: PullSymbol, forceContainer?: PullTypeSymbol): boolean {
			var interfaceType = forceContainer ? forceContainer : symbol.getContainer().type;
			var methodName = symbol.getDisplayName();

			var typesThatImplementInterface = interfaceType.getTypesThatExplicitlyImplementThisType();
			var typesThatExtendInterface = interfaceType.getTypesThatExtendThisType();

			if (typesThatImplementInterface.length === 0 && typesThatExtendInterface.length === 0) {
				return false;
			}

			for (var i = 0; i < typesThatImplementInterface.length; i++) {
				var type = typesThatImplementInterface[i];

				if (!type.anyDeclHasFlag(PullElementFlags.Final)) {
					var member = type.findMember(methodName, true);

					if (member && !member.anyDeclHasFlag(PullElementFlags.Final)) {
						return true;
					}
				}
			}

			for (var i = 0; i < typesThatExtendInterface.length; i++) {
				if (this.isMethodOfInterfaceAlwaysFinal(symbol, typesThatExtendInterface[i])) {
					return true;
				}
			}

			return false;
		}

		private getInterfaceSplitToExternsMode(declaration: InterfaceDeclaration): InterfaceExternsSplitMode {
			var symbol = this.semanticInfoChain.getSymbolForAST(declaration);
			var name = symbol.getDisplayName();

			if (symbol[splitToExternMode] !== undefined) {
				return symbol[splitToExternMode];
			}

			if (name === 'String' ||
				name === 'Number' ||
				name === 'Array' ||
				isDTSFile(declaration.fileName())) {

				return InterfaceExternsSplitMode.k_None;
			}

			var hasCallOrIndex = symbol.type.hasOwnCallSignatures() || symbol.type.hasOwnIndexSignatures();

			if (hasCallOrIndex) {
				return (symbol[splitToExternMode] = InterfaceExternsSplitMode.k_All);
			}

			if (!hasModifier(declaration.modifiers, PullElementFlags.Exported)) {
				return (symbol[splitToExternMode] = InterfaceExternsSplitMode.k_None);
			}

			return (symbol[splitToExternMode] = InterfaceExternsSplitMode.k_Part);
		}

		private isInterfaceMemberForExtern(symbol: PullSymbol): boolean {
			return !symbol.type.isFunction() && !Emitter.isAkraSystemName(symbol.getDisplayName()) && !isQuoted(symbol.getDisplayName());
		}

		private isNeedExportClassFunctionMember(symbol: PullSymbol): boolean {
			if (symbol.anyDeclHasFlag(PullElementFlags.Private) || Emitter.isAkraSystemName(symbol.getDisplayName())) {
				return false;
			}

			if (symbol.anyDeclHasFlag(PullElementFlags.Protected)) {
				return this.isNeedEscapeName(symbol);
			}

			return true;
		}

		getShortName(longName: string/*, symbol?: PullSymbol*/): string {
			if (this.shortNameMap[longName]) {
				return this.shortNameMap[longName];
			}

			var result = (this.shortNameMap[longName] = "$$_shoter_$$_" + (this.shorter++));

			//if (symbol) {
			//	this.shortNameMap[symbol.fullName()] = result;
			//}

			return result;
		}

		hasShortName(longName: string): boolean {
			return this.shortNameMap[longName] !== undefined;
		}

	}

	export function getLastConstructor(classDecl: ClassDeclaration): ConstructorDeclaration {
		return <ConstructorDeclaration>classDecl.classElements.lastOrDefault(e => e.kind() === SyntaxKind.ConstructorDeclaration);
	}

	export function getTrimmedTextLines(comment: Comment): string[] {
		if (comment.kind() === SyntaxKind.MultiLineCommentTrivia) {
			return comment.fullText().split("\n").map(s => s.trim());
		}
		else {
			return [comment.fullText().trim()];
		}
	}
}