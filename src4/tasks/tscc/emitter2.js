///<reference path='typescript2.d.ts' />
var TypeScript;
(function (TypeScript) {
    (function (EmitContainer) {
        EmitContainer[EmitContainer["Prog"] = 0] = "Prog";
        EmitContainer[EmitContainer["Module"] = 1] = "Module";
        EmitContainer[EmitContainer["DynamicModule"] = 2] = "DynamicModule";
        EmitContainer[EmitContainer["Class"] = 3] = "Class";
        EmitContainer[EmitContainer["Constructor"] = 4] = "Constructor";
        EmitContainer[EmitContainer["Function"] = 5] = "Function";
        EmitContainer[EmitContainer["Args"] = 6] = "Args";
        EmitContainer[EmitContainer["Interface"] = 7] = "Interface";
    })(TypeScript.EmitContainer || (TypeScript.EmitContainer = {}));
    var EmitContainer = TypeScript.EmitContainer;

    var EmitState = (function () {
        function EmitState() {
            this.column = 0;
            this.line = 0;
            this.container = 0 /* Prog */;
        }
        return EmitState;
    })();
    TypeScript.EmitState = EmitState;

    var EmitOptions = (function () {
        function EmitOptions(compiler, resolvePath) {
            this.resolvePath = resolvePath;
            this._diagnostic = null;
            this._settings = null;
            this._commonDirectoryPath = "";
            this._sharedOutputFile = "";
            this._sourceRootDirectory = "";
            this._sourceMapRootDirectory = "";
            this._outputDirectory = "";
            var settings = compiler.compilationSettings();
            this._settings = settings;

            if (settings.moduleGenTarget() === 0 /* Unspecified */ && compiler._isDynamicModuleCompilation()) {
                this._diagnostic = new TypeScript.Diagnostic(null, null, 0, 0, TypeScript.DiagnosticCode.Cannot_compile_external_modules_unless_the_module_flag_is_provided, null);
                return;
            }

            if (!settings.mapSourceFiles()) {
                // Error to specify --mapRoot or --sourceRoot without mapSourceFiles
                if (settings.mapRoot()) {
                    if (settings.sourceRoot()) {
                        this._diagnostic = new TypeScript.Diagnostic(null, null, 0, 0, TypeScript.DiagnosticCode.Options_mapRoot_and_sourceRoot_cannot_be_specified_without_specifying_sourcemap_option, null);
                        return;
                    } else {
                        this._diagnostic = new TypeScript.Diagnostic(null, null, 0, 0, TypeScript.DiagnosticCode.Option_mapRoot_cannot_be_specified_without_specifying_sourcemap_option, null);
                        return;
                    }
                } else if (settings.sourceRoot()) {
                    this._diagnostic = new TypeScript.Diagnostic(null, null, 0, 0, TypeScript.DiagnosticCode.Option_sourceRoot_cannot_be_specified_without_specifying_sourcemap_option, null);
                    return;
                }
            }

            this._sourceMapRootDirectory = TypeScript.convertToDirectoryPath(TypeScript.switchToForwardSlashes(settings.mapRoot()));
            this._sourceRootDirectory = TypeScript.convertToDirectoryPath(TypeScript.switchToForwardSlashes(settings.sourceRoot()));

            if (settings.outFileOption() || settings.outDirOption() || settings.mapRoot() || settings.sourceRoot()) {
                if (settings.outFileOption()) {
                    this._sharedOutputFile = TypeScript.switchToForwardSlashes(resolvePath(settings.outFileOption()));
                }

                if (settings.outDirOption()) {
                    this._outputDirectory = TypeScript.convertToDirectoryPath(TypeScript.switchToForwardSlashes(resolvePath(settings.outDirOption())));
                }

                // Parse the directory structure
                if (this._outputDirectory || this._sourceMapRootDirectory || this.sourceRootDirectory) {
                    this.determineCommonDirectoryPath(compiler);
                }
            }
        }
        EmitOptions.prototype.diagnostic = function () {
            return this._diagnostic;
        };

        EmitOptions.prototype.commonDirectoryPath = function () {
            return this._commonDirectoryPath;
        };
        EmitOptions.prototype.sharedOutputFile = function () {
            return this._sharedOutputFile;
        };
        EmitOptions.prototype.sourceRootDirectory = function () {
            return this._sourceRootDirectory;
        };
        EmitOptions.prototype.sourceMapRootDirectory = function () {
            return this._sourceMapRootDirectory;
        };
        EmitOptions.prototype.outputDirectory = function () {
            return this._outputDirectory;
        };

        EmitOptions.prototype.compilationSettings = function () {
            return this._settings;
        };

        EmitOptions.prototype.determineCommonDirectoryPath = function (compiler) {
            var commonComponents = [];
            var commonComponentsLength = -1;

            var fileNames = compiler.fileNames();
            for (var i = 0, len = fileNames.length; i < len; i++) {
                var fileName = fileNames[i];
                var document = compiler.getDocument(fileNames[i]);
                var sourceUnit = document.sourceUnit();

                if (!document.isDeclareFile()) {
                    var fileComponents = TypeScript.filePathComponents(fileName);
                    if (commonComponentsLength === -1) {
                        // First time at finding common path
                        // So common path = directory of file
                        commonComponents = fileComponents;
                        commonComponentsLength = commonComponents.length;
                    } else {
                        var updatedPath = false;
                        for (var j = 0; j < commonComponentsLength && j < fileComponents.length; j++) {
                            if (commonComponents[j] !== fileComponents[j]) {
                                // The new components = 0 ... j -1
                                commonComponentsLength = j;
                                updatedPath = true;

                                if (j === 0) {
                                    if (this._outputDirectory || this._sourceRootDirectory || (this._sourceMapRootDirectory && (!this._sharedOutputFile || compiler._isDynamicModuleCompilation()))) {
                                        // Its error to not have common path
                                        this._diagnostic = new TypeScript.Diagnostic(null, null, 0, 0, TypeScript.DiagnosticCode.Cannot_find_the_common_subdirectory_path_for_the_input_files, null);
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
        };
        return EmitOptions;
    })();
    TypeScript.EmitOptions = EmitOptions;

    var Indenter = (function () {
        function Indenter() {
            this.indentAmt = 0;
        }
        Indenter.prototype.increaseIndent = function () {
            this.indentAmt += Indenter.indentStep;
        };

        Indenter.prototype.decreaseIndent = function () {
            this.indentAmt -= Indenter.indentStep;
        };

        Indenter.prototype.getIndent = function () {
            var indentString = Indenter.indentStrings[this.indentAmt];
            if (indentString === undefined) {
                indentString = "";
                for (var i = 0; i < this.indentAmt; i = i + Indenter.indentStep) {
                    indentString += Indenter.indentStepString;
                }
                Indenter.indentStrings[this.indentAmt] = indentString;
            }
            return indentString;
        };
        Indenter.indentStep = 4;
        Indenter.indentStepString = "    ";
        Indenter.indentStrings = [];
        return Indenter;
    })();
    TypeScript.Indenter = Indenter;

    function lastParameterIsRest(parameterList) {
        var parameters = parameterList.parameters;
        return parameters.nonSeparatorCount() > 0 && parameters.nonSeparatorAt(parameters.nonSeparatorCount() - 1).dotDotDotToken !== null;
    }
    TypeScript.lastParameterIsRest = lastParameterIsRest;

    var Emitter = (function () {
        function Emitter(emittingFileName, outfile, emitOptions, semanticInfoChain) {
            this.emittingFileName = emittingFileName;
            this.outfile = outfile;
            this.emitOptions = emitOptions;
            this.semanticInfoChain = semanticInfoChain;
            this.globalThisCapturePrologueEmitted = false;
            this.extendsPrologueEmitted = false;
            this.thisClassNode = null;
            this.inArrowFunction = false;
            this.moduleName = "";
            this.emitState = new EmitState();
            this.indenter = new Indenter();
            this.sourceMapper = null;
            this.captureThisStmtString = "var _this = this;";
            this.declStack = [];
            this.exportAssignmentIdentifier = null;
            this.inWithBlock = false;
            this.document = null;
            this.copyrightElement = null;
            /**
            * For closure
            */
            this.thisFullClassName = null;
            this.thisFullExtendClassName = null;
            this.obfuscatedSymbolList = [];
            this.obfuscatedSymbolNameMap = {};
            this.obfuscatorCounter = 0;
            this.thisFullInterfaceName = null;
            this.emittedInterfaceSymbols = [];
            this.usedButNotEmittedInterfaces = [];
            /** For emit typedef comments without type parameters */
            this.isTypeParametersEmitBlocked = false;
            /** For emit enum */
            this.isEnumEmitted = false;
            this.isEmittedEnumExported = false;
            /** for emit enum elements */
            this.totalEmitedConstansts = 0;
            this.lastEmitConstantValue = null;
            /** for emitting jsDoc cooments for class properties */
            this.emittedClassProperties = null;
            this.isEmitConstructorStatements = false;
            this._emittedModuleNames = [];
        }
        Emitter.prototype.pushDecl = function (decl) {
            if (decl) {
                this.declStack[this.declStack.length] = decl;
            }
        };

        Emitter.prototype.popDecl = function (decl) {
            if (decl) {
                this.declStack.length--;
            }
        };

        Emitter.prototype.getEnclosingDecl = function () {
            var declStackLen = this.declStack.length;
            var enclosingDecl = declStackLen > 0 ? this.declStack[declStackLen - 1] : null;
            return enclosingDecl;
        };

        Emitter.prototype.setExportAssignmentIdentifier = function (id) {
            this.exportAssignmentIdentifier = id;
        };

        Emitter.prototype.getExportAssignmentIdentifier = function () {
            return this.exportAssignmentIdentifier;
        };

        Emitter.prototype.setDocument = function (document) {
            this.document = document;
        };

        Emitter.prototype.shouldEmitImportDeclaration = function (importDeclAST) {
            return TypeScript.importDeclarationIsElided(importDeclAST, this.semanticInfoChain, this.emitOptions.compilationSettings());
        };

        Emitter.prototype.emitImportDeclaration = function (importDeclAST) {
            var isExternalModuleReference = importDeclAST.moduleReference.kind() === 260 /* ExternalModuleReference */;
            var importDecl = this.semanticInfoChain.getDeclForAST(importDeclAST);
            var isExported = TypeScript.hasFlag(importDecl.flags, 1 /* Exported */);
            var isAmdCodeGen = this.emitOptions.compilationSettings().moduleGenTarget() == 2 /* Asynchronous */;

            this.emitComments(importDeclAST, true);

            var importSymbol = importDecl.getSymbol();

            var parentSymbol = importSymbol.getContainer();
            var parentKind = parentSymbol ? parentSymbol.kind : 0 /* None */;
            var associatedParentSymbol = parentSymbol ? parentSymbol.getAssociatedContainerType() : null;
            var associatedParentSymbolKind = associatedParentSymbol ? associatedParentSymbol.kind : 0 /* None */;

            var needsPropertyAssignment = false;
            var usePropertyAssignmentInsteadOfVarDecl = false;
            var moduleNamePrefix;

            if (isExported && (parentKind == 4 /* Container */ || parentKind === 32 /* DynamicModule */ || associatedParentSymbolKind === 4 /* Container */ || associatedParentSymbolKind === 32 /* DynamicModule */)) {
                if (importSymbol.getExportAssignedTypeSymbol() || importSymbol.getExportAssignedContainerSymbol()) {
                    // Type or container assignment that is exported
                    needsPropertyAssignment = true;
                } else {
                    var valueSymbol = importSymbol.getExportAssignedValueSymbol();
                    if (valueSymbol && (valueSymbol.kind == 65536 /* Method */ || valueSymbol.kind == 16384 /* Function */)) {
                        needsPropertyAssignment = true;
                    } else {
                        usePropertyAssignmentInsteadOfVarDecl = true;
                    }
                }

                // Calculate what name prefix to use
                if (this.emitState.container === 2 /* DynamicModule */) {
                    moduleNamePrefix = "exports.";
                } else {
                    moduleNamePrefix = this.moduleName + ".";
                }
            }

            if (isAmdCodeGen && isExternalModuleReference) {
                // For amdCode gen of exported external module reference, do not emit var declaration
                // Emit the property assignment since it is exported
                needsPropertyAssignment = true;
            } else {
                this.recordSourceMappingStart(importDeclAST);
                if (usePropertyAssignmentInsteadOfVarDecl) {
                    this.writeToOutput(moduleNamePrefix);
                } else {
                    this.writeToOutput("var ");
                }

                this.writeToOutput(this.getObfuscatedName(importSymbol, importDeclAST.identifier.text()) + " = ");
                var aliasAST = importDeclAST.moduleReference;

                if (isExternalModuleReference) {
                    this.writeToOutput("require(" + aliasAST.stringLiteral.text() + ")");
                } else {
                    this.emitJavascript(aliasAST.moduleName, false);
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
        };

        Emitter.prototype.createSourceMapper = function (document, jsFileName, jsFile, sourceMapOut, resolvePath) {
            this.sourceMapper = new TypeScript.SourceMapper(jsFile, sourceMapOut, document, jsFileName, this.emitOptions, resolvePath);
        };

        Emitter.prototype.setSourceMapperNewSourceFile = function (document) {
            this.sourceMapper.setNewSourceFile(document, this.emitOptions);
        };

        Emitter.prototype.updateLineAndColumn = function (s) {
            var lineNumbers = TypeScript.TextUtilities.parseLineStarts(s);
            if (lineNumbers.length > 1) {
                // There are new lines in the string, update the line and column number accordingly
                this.emitState.line += lineNumbers.length - 1;
                this.emitState.column = s.length - lineNumbers[lineNumbers.length - 1];
            } else {
                // No new lines in the string
                this.emitState.column += s.length;
            }
        };

        Emitter.prototype.writeToOutputWithSourceMapRecord = function (s, astSpan) {
            this.recordSourceMappingStart(astSpan);
            this.writeToOutput(s);
            this.recordSourceMappingEnd(astSpan);
        };

        Emitter.prototype.writeToOutput = function (s) {
            this.outfile.Write(s);
            this.updateLineAndColumn(s);
        };

        Emitter.prototype.writeLineToOutput = function (s, force) {
            if (typeof force === "undefined") { force = false; }
            // No need to print a newline if we're already at the start of the line.
            if (!force && s === "" && this.emitState.column === 0) {
                return;
            }

            this.outfile.WriteLine(s);
            this.updateLineAndColumn(s);
            this.emitState.column = 0;
            this.emitState.line++;
        };

        Emitter.prototype.writeCaptureThisStatement = function (ast) {
            this.emitIndent();
            this.writeToOutputWithSourceMapRecord(this.captureThisStmtString, ast);
            this.writeLineToOutput("");
        };

        Emitter.prototype.setContainer = function (c) {
            var temp = this.emitState.container;
            this.emitState.container = c;
            return temp;
        };

        Emitter.prototype.getIndentString = function () {
            return this.indenter.getIndent();
        };

        Emitter.prototype.emitIndent = function () {
            this.writeToOutput(this.getIndentString());
        };

        Emitter.prototype.emitComment = function (comment, trailing, first) {
            if (this.emitOptions.compilationSettings().removeComments()) {
                return;
            }

            var text = getTrimmedTextLines(comment);
            var emitColumn = this.emitState.column;

            if (emitColumn === 0) {
                this.emitIndent();
            } else if (trailing && first) {
                this.writeToOutput(" ");
            }

            if (comment.kind() === 6 /* MultiLineCommentTrivia */) {
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
            } else {
                this.recordSourceMappingStart(comment);
                this.writeToOutput(text[0]);
                this.recordSourceMappingEnd(comment);
                this.writeLineToOutput("");
                // Fall through
            }

            if (!trailing && emitColumn != 0) {
                // If we were indented before, stay indented after.
                this.emitIndent();
            }
        };

        Emitter.prototype.emitComments = function (ast, pre, onlyPinnedOrTripleSlashComments) {
            if (typeof onlyPinnedOrTripleSlashComments === "undefined") { onlyPinnedOrTripleSlashComments = false; }
            var _this = this;
            // Emitting the comments for the exprssion inside an arrow function is handled specially
            // in emitFunctionBodyStatements.  We don't want to emit those comments a second time.
            if (ast && ast.kind() !== 161 /* Block */) {
                if (ast.parent.kind() === 234 /* SimpleArrowFunctionExpression */ || ast.parent.kind() === 233 /* ParenthesizedArrowFunctionExpression */) {
                    return;
                }
            }

            if (pre) {
                var preComments = ast.preComments();

                if (preComments && ast === this.copyrightElement) {
                    // We're emitting the comments for the first script element.  Skip any
                    // copyright comments, as we'll already have emitted those.
                    var copyrightComments = this.getCopyrightComments();
                    preComments = preComments.slice(copyrightComments.length);
                }

                // We're emitting comments on an elided element.  Only keep the comment if it is
                // a triple slash or pinned comment.
                if (onlyPinnedOrTripleSlashComments) {
                    preComments = TypeScript.ArrayUtilities.where(preComments, function (c) {
                        return _this.isPinnedOrTripleSlash(c);
                    });
                }

                this.emitCommentsArray(preComments, false);
            } else {
                this.emitCommentsArray(ast.postComments(), true);
            }
        };

        Emitter.prototype.isPinnedOrTripleSlash = function (comment) {
            var fullText = comment.fullText();
            if (fullText.match(TypeScript.tripleSlashReferenceRegExp)) {
                return true;
            } else {
                return fullText.indexOf("/*!") === 0;
            }
        };

        Emitter.prototype.emitCommentsArray = function (comments, trailing) {
            if (!this.emitOptions.compilationSettings().removeComments() && comments) {
                for (var i = 0, n = comments.length; i < n; i++) {
                    this.emitComment(comments[i], trailing, i === /*first:*/ 0);
                }
            }
        };

        Emitter.prototype.emitObjectLiteralExpression = function (objectLiteral) {
            this.recordSourceMappingStart(objectLiteral);

            // Try to preserve the newlines between elements that the user had.
            this.writeToOutput("{");
            this.emitCommaSeparatedList(objectLiteral, objectLiteral.propertyAssignments, " ", true);
            this.writeToOutput("}");

            this.recordSourceMappingEnd(objectLiteral);
        };

        Emitter.prototype.emitArrayLiteralExpression = function (arrayLiteral) {
            this.recordSourceMappingStart(arrayLiteral);

            // Try to preserve the newlines between elements that the user had.
            this.writeToOutput("[");
            this.emitCommaSeparatedList(arrayLiteral, arrayLiteral.expressions, "", true);
            this.writeToOutput("]");

            this.recordSourceMappingEnd(arrayLiteral);
        };

        Emitter.prototype.emitObjectCreationExpression = function (objectCreationExpression) {
            this.recordSourceMappingStart(objectCreationExpression);
            this.writeToOutput("new ");
            var target = objectCreationExpression.expression;

            this.emit(target);
            if (objectCreationExpression.argumentList) {
                this.recordSourceMappingStart(objectCreationExpression.argumentList);
                this.writeToOutput("(");
                this.emitCommaSeparatedList(objectCreationExpression.argumentList, objectCreationExpression.argumentList.arguments, "", false);
                this.writeToOutputWithSourceMapRecord(")", objectCreationExpression.argumentList.closeParenToken);
                this.recordSourceMappingEnd(objectCreationExpression.argumentList);
            }

            this.recordSourceMappingEnd(objectCreationExpression);
        };

        Emitter.prototype.getConstantDecl = function (dotExpr) {
            var pullSymbol = this.semanticInfoChain.getSymbolForAST(dotExpr);
            if (pullSymbol && pullSymbol.kind === 67108864 /* EnumMember */) {
                var pullDecls = pullSymbol.getDeclarations();
                if (pullDecls.length === 1) {
                    var pullDecl = pullDecls[0];
                    if (pullDecl.kind === 67108864 /* EnumMember */) {
                        return pullDecl;
                    }
                }
            }

            return null;
        };

        Emitter.prototype.tryEmitConstant = function (dotExpr) {
            var propertyName = dotExpr.name;
            var boundDecl = this.getConstantDecl(dotExpr);
            if (boundDecl) {
                var value = boundDecl.constantValue;
                if (value !== null) {
                    this.totalEmitedConstansts++;
                    this.lastEmitConstantValue = value;

                    this.recordSourceMappingStart(dotExpr);
                    this.writeToOutput(value.toString());
                    var comment = " /* ";
                    comment += propertyName.text();
                    comment += " */";
                    this.writeToOutput(comment);
                    this.recordSourceMappingEnd(dotExpr);
                    return true;
                }
            }

            return false;
        };

        Emitter.prototype.emitInvocationExpression = function (callNode) {
            this.recordSourceMappingStart(callNode);
            var target = callNode.expression;
            var args = callNode.argumentList.arguments;

            if (target.kind() === 227 /* MemberAccessExpression */ && target.expression.kind() === 50 /* SuperKeyword */) {
                this.emit(target);
                this.writeToOutput(".call");
                this.recordSourceMappingStart(args);
                this.writeToOutput("(");
                this.emitThis();
                if (args && args.nonSeparatorCount() > 0) {
                    this.writeToOutput(", ");
                    this.emitCommaSeparatedList(callNode.argumentList, args, "", false);
                }
            } else {
                if (callNode.expression.kind() === 50 /* SuperKeyword */ && this.emitState.container === 4 /* Constructor */) {
                    this.writeToOutput(this.thisFullExtendClassName + ".call");
                } else {
                    this.emitJavascript(target, false);
                }
                this.recordSourceMappingStart(args);
                this.writeToOutput("(");
                if (callNode.expression.kind() === 50 /* SuperKeyword */ && this.emitState.container === 4 /* Constructor */) {
                    this.writeToOutput("this");
                    if (args && args.nonSeparatorCount() > 0) {
                        this.writeToOutput(", ");
                    }
                }
                this.emitCommaSeparatedList(callNode.argumentList, args, "", false);
            }

            this.writeToOutputWithSourceMapRecord(")", callNode.argumentList.closeParenToken);
            this.recordSourceMappingEnd(args);
            this.recordSourceMappingEnd(callNode);
        };

        Emitter.prototype.emitParameterList = function (list) {
            this.writeToOutput("(");
            this.emitCommentsArray(list.openParenTrailingComments, true);
            this.emitFunctionParameters(TypeScript.Parameters.fromParameterList(list));
            this.writeToOutput(")");
        };

        Emitter.prototype.emitFunctionParameters = function (parameters) {
            var argsLen = 0;

            if (parameters) {
                this.emitComments(parameters.ast, true);

                var tempContainer = this.setContainer(6 /* Args */);
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
                this.setContainer(tempContainer);

                this.emitComments(parameters.ast, false);
            }
        };

        Emitter.prototype.emitFunctionBodyStatements = function (name, funcDecl, parameterList, block, bodyExpression) {
            this.writeLineToOutput(" {");
            if (name) {
                this.recordSourceMappingNameStart(name);
            }

            this.indenter.increaseIndent();

            if (parameterList) {
                this.emitDefaultValueAssignments(parameterList);
                this.emitRestParameterInitializer(parameterList);
            }

            if (this.shouldCaptureThis(funcDecl)) {
                this.writeCaptureThisStatement(funcDecl);
            }

            if (block) {
                this.emitList(block.statements);
                this.emitCommentsArray(block.closeBraceLeadingComments, false);
            } else {
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
                this.emitCommentsArray(bodyExpression.preComments(), false);
                this.writeToOutput("return ");
                this.emit(bodyExpression);
                this.writeLineToOutput(";");
                this.emitCommentsArray(bodyExpression.postComments(), true);
                //bodyExpression.setPreComments(preComments);
                //bodyExpression.setPostComments(postComments);
            }

            this.indenter.decreaseIndent();
            this.emitIndent();

            if (block) {
                this.writeToOutputWithSourceMapRecord("}", block.closeBraceToken);
            } else {
                this.writeToOutputWithSourceMapRecord("}", bodyExpression);
            }

            if (name) {
                this.recordSourceMappingNameEnd();
            }
        };

        Emitter.prototype.emitDefaultValueAssignments = function (parameters) {
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
                    this.writeToOutput("if (typeof " + id.text() + " === \"undefined\") { "); //
                    this.writeToOutputWithSourceMapRecord(id.text(), id);
                    this.emitJavascript(equalsValueClause, false);
                    this.writeLineToOutput("; }");
                    this.recordSourceMappingEnd(arg);
                }
            }
        };

        Emitter.prototype.emitRestParameterInitializer = function (parameters) {
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
        };

        Emitter.prototype.getImportDecls = function (fileName) {
            var topLevelDecl = this.semanticInfoChain.topLevelDecl(this.document.fileName);
            var result = [];

            var dynamicModuleDecl = topLevelDecl.getChildDecls()[0];
            var queue = dynamicModuleDecl.getChildDecls();

            for (var i = 0, n = queue.length; i < n; i++) {
                var decl = queue[i];

                if (decl.kind & 128 /* TypeAlias */) {
                    var importStatementAST = this.semanticInfoChain.getASTForDecl(decl);
                    if (importStatementAST.moduleReference.kind() === 260 /* ExternalModuleReference */) {
                        var symbol = decl.getSymbol();
                        var typeSymbol = symbol && symbol.type;
                        if (typeSymbol && typeSymbol !== this.semanticInfoChain.anyTypeSymbol && !typeSymbol.isError()) {
                            result.push(decl);
                        }
                    }
                }
            }

            return result;
        };

        Emitter.prototype.getModuleImportAndDependencyList = function (sourceUnit) {
            var importList = "";
            var dependencyList = "";

            var importDecls = this.getImportDecls(this.document.fileName);

            // all dependencies are quoted
            if (importDecls.length) {
                for (var i = 0; i < importDecls.length; i++) {
                    var importStatementDecl = importDecls[i];
                    var importStatementSymbol = importStatementDecl.getSymbol();
                    var importStatementAST = this.semanticInfoChain.getASTForDecl(importStatementDecl);

                    if (importStatementSymbol.isUsedAsValue()) {
                        if (i <= importDecls.length - 1) {
                            dependencyList += ", ";
                            importList += ", ";
                        }

                        importList += importStatementDecl.name;
                        dependencyList += importStatementAST.moduleReference.stringLiteral.text();
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
        };

        Emitter.prototype.shouldCaptureThis = function (ast) {
            if (ast.kind() === 135 /* SourceUnit */) {
                var scriptDecl = this.semanticInfoChain.topLevelDecl(this.document.fileName);
                return TypeScript.hasFlag(scriptDecl.flags, 262144 /* MustCaptureThis */);
            }

            var decl = this.semanticInfoChain.getDeclForAST(ast);
            if (decl) {
                return TypeScript.hasFlag(decl.flags, 262144 /* MustCaptureThis */);
            }

            return false;
        };

        Emitter.prototype.emitEnum = function (moduleDecl) {
            var pullDecl = this.semanticInfoChain.getDeclForAST(moduleDecl);
            this.pushDecl(pullDecl);

            var svModuleName = this.moduleName;
            var svModuleFullName = pullDecl.getSymbol().getContainer().fullName();
            this.moduleName = moduleDecl.identifier.text();

            var temp = this.setContainer(1 /* Module */);
            var isExported = TypeScript.hasFlag(pullDecl.flags, 1 /* Exported */);

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
            } else {
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
        };

        Emitter.prototype.getModuleDeclToVerifyChildNameCollision = function (moduleDecl, changeNameIfAnyDeclarationInContext) {
            if (TypeScript.ArrayUtilities.contains(this.declStack, moduleDecl)) {
                // Given decl is in the scope, we would need to check for child name collision
                return moduleDecl;
            } else if (changeNameIfAnyDeclarationInContext) {
                // Check if any other declaration of the given symbol is in scope
                // (eg. when emitting expression of type defined from different declaration in reopened module)
                var symbol = moduleDecl.getSymbol();
                if (symbol) {
                    var otherDecls = symbol.getDeclarations();
                    for (var i = 0; i < otherDecls.length; i++) {
                        // If the other decl is in the scope, use this decl to determine which name to display
                        if (TypeScript.ArrayUtilities.contains(this.declStack, otherDecls[i])) {
                            return otherDecls[i];
                        }
                    }
                }
            }

            return null;
        };

        Emitter.prototype.hasChildNameCollision = function (moduleName, childDecls) {
            var _this = this;
            return TypeScript.ArrayUtilities.any(childDecls, function (childDecl) {
                if (childDecl.name == moduleName) {
                    // same name child
                    var childAST = _this.semanticInfoChain.getASTForDecl(childDecl);
                    if (_this.shouldEmit(childAST)) {
                        // Child ast would be emitted
                        return true;
                    }
                }
                return false;
            });
        };

        // Get the moduleName to write in js file
        // If changeNameIfAnyDeclarationInContext is true, verify if any of the declarations for the symbol would need rename.
        Emitter.prototype.getModuleName = function (moduleDecl, changeNameIfAnyDeclarationInContext) {
            var moduleName = moduleDecl.name;
            var moduleDisplayName = moduleDecl.getDisplayName();

            // If the decl is in stack it may need name change in the js file
            moduleDecl = this.getModuleDeclToVerifyChildNameCollision(moduleDecl, changeNameIfAnyDeclarationInContext);
            if (moduleDecl) {
                var childDecls = moduleDecl.getChildDecls();

                while (this.hasChildNameCollision(moduleName, childDecls)) {
                    // there was name collision with member which could result in faulty codegen, try rename with prepend of '_'
                    moduleName = "_" + moduleName;
                    moduleDisplayName = "_" + moduleDisplayName;
                }
            }

            return moduleDisplayName;
            //return moduleDecl.getSymbol().fullName();
        };

        Emitter.prototype.emitModuleDeclarationWorker = function (moduleDecl) {
            if (moduleDecl.stringLiteral) {
                this.emitSingleModuleDeclaration(moduleDecl, moduleDecl.stringLiteral);
            } else {
                var moduleNames = TypeScript.getModuleNames(moduleDecl.name);
                this.emitSingleModuleDeclaration(moduleDecl, moduleNames[0]);
            }
        };

        Emitter.prototype.emitSingleModuleDeclaration = function (moduleDecl, moduleName) {
            var isLastName = TypeScript.isLastNameOfModule(moduleDecl, moduleName);

            if (isLastName) {
                // Doc Comments on the ast belong to the innermost module being emitted.
                this.emitComments(moduleDecl, true);
            }

            var pullDecl = this.semanticInfoChain.getDeclForAST(moduleName);
            this.pushDecl(pullDecl);

            var svModuleName = this.moduleName;

            if (moduleDecl.stringLiteral) {
                this.moduleName = moduleDecl.stringLiteral.valueText();
                if (TypeScript.isTSFile(this.moduleName)) {
                    this.moduleName = this.moduleName.substring(0, this.moduleName.length - ".ts".length);
                }
            } else {
                this.moduleName = moduleName.text();
            }

            var temp = this.setContainer(1 /* Module */);
            var isExported = TypeScript.hasFlag(pullDecl.flags, 1 /* Exported */);

            var fullModuleName = pullDecl.getSymbol().fullName();

            if (this._emittedModuleNames.indexOf(fullModuleName) < 0) {
                this.recordSourceMappingStart(moduleDecl);

                if (fullModuleName.indexOf(".") < 0) {
                    this.writeToOutput("var ");
                }

                this.recordSourceMappingStart(moduleName);
                this.writeToOutput(fullModuleName);
                this.recordSourceMappingEnd(moduleName);
                this.writeLineToOutput(" = {};");
                this.recordSourceMappingEnd(moduleDecl);
                this.emitIndent();

                this._emittedModuleNames.push(fullModuleName);
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
            } else {
                var moduleNames = TypeScript.getModuleNames(moduleDecl.name);
                var nameIndex = moduleNames.indexOf(moduleName);
                TypeScript.Debug.assert(nameIndex >= 0);

                if (isLastName) {
                    // If we're on the innermost module, we can emit the module elements.
                    this.emitList(moduleDecl.moduleElements);
                } else {
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
        };

        Emitter.prototype.emitEnumElement = function (varDecl) {
            // <EnumName>[<EnumName>["<MemberName>"] = <MemberValue>] = "<MemberName>";
            var pullDecl = this.semanticInfoChain.getDeclForAST(varDecl);
            TypeScript.Debug.assert(pullDecl && pullDecl.kind === 67108864 /* EnumMember */);

            this.emitComments(varDecl, true);
            this.recordSourceMappingStart(varDecl);
            var name = varDecl.propertyName.text();
            var quoted = TypeScript.isQuoted(name);
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

                if (totalEmittedConstantsBeforeEmit + 1 === this.totalEmitedConstansts && varDecl.equalsValueClause.value.kind() === 11 /* IdentifierName */) {
                    pullDecl.constantValue = this.lastEmitConstantValue;
                }
            } else if (pullDecl.constantValue !== null) {
                this.writeToOutput(pullDecl.constantValue.toString());
            } else {
                this.writeToOutput('null');
            }

            //this.writeToOutput('] = ');
            //this.writeToOutput(quoted ? name : '"' + name + '"');
            this.recordSourceMappingEnd(varDecl);
            this.emitComments(varDecl, false);
            //this.writeToOutput(';');
        };

        Emitter.prototype.emitElementAccessExpression = function (expression) {
            this.recordSourceMappingStart(expression);
            this.emit(expression.expression);
            this.writeToOutput("[");
            this.emit(expression.argumentExpression);
            this.writeToOutput("]");
            this.recordSourceMappingEnd(expression);
        };

        Emitter.prototype.emitSimpleArrowFunctionExpression = function (arrowFunction) {
            this.emitAnyArrowFunctionExpression(arrowFunction, null, TypeScript.Parameters.fromIdentifier(arrowFunction.identifier), arrowFunction.block, arrowFunction.expression);
        };

        Emitter.prototype.emitParenthesizedArrowFunctionExpression = function (arrowFunction) {
            this.emitAnyArrowFunctionExpression(arrowFunction, null, TypeScript.Parameters.fromParameterList(arrowFunction.callSignature.parameterList), arrowFunction.block, arrowFunction.expression);
        };

        Emitter.prototype.emitAnyArrowFunctionExpression = function (arrowFunction, funcName, parameters, block, expression) {
            var savedInArrowFunction = this.inArrowFunction;
            this.inArrowFunction = true;

            var temp = this.setContainer(5 /* Function */);

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
        };

        Emitter.prototype.emitConstructor = function (funcDecl) {
            if (!funcDecl.block) {
                return;
            }
            var temp = this.setContainer(4 /* Constructor */);

            this.recordSourceMappingStart(funcDecl);

            var pullDecl = this.semanticInfoChain.getDeclForAST(funcDecl);
            this.pushDecl(pullDecl);

            this.emitComments(funcDecl, true);

            this.recordSourceMappingStart(funcDecl);
            this.writeToOutput("function ");

            //this.writeToOutput(this.thisClassNode.identifier.text());
            this.writeToOutput("(");
            var parameters = TypeScript.Parameters.fromParameterList(funcDecl.parameterList);
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
            this.emitCommentsArray(funcDecl.block.closeBraceLeadingComments, false);

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
        };

        Emitter.prototype.emitGetAccessor = function (accessor) {
            this.recordSourceMappingStart(accessor);
            this.writeToOutput("get ");

            var temp = this.setContainer(5 /* Function */);

            this.recordSourceMappingStart(accessor);

            var pullDecl = this.semanticInfoChain.getDeclForAST(accessor);
            this.pushDecl(pullDecl);

            this.recordSourceMappingStart(accessor);

            var accessorSymbol = TypeScript.PullHelpers.getAccessorSymbol(accessor, this.semanticInfoChain);
            var container = accessorSymbol.getContainer();
            var containerKind = container.kind;

            this.recordSourceMappingNameStart(accessor.propertyName.text());
            this.writeToOutput(accessor.propertyName.text());
            this.writeToOutput("(");
            this.writeToOutput(")");

            this.emitFunctionBodyStatements(null, accessor, TypeScript.Parameters.fromParameterList(accessor.parameterList), accessor.block, null);

            this.recordSourceMappingEnd(accessor);

            // The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
            this.recordSourceMappingEnd(accessor);

            this.popDecl(pullDecl);
            this.setContainer(temp);
            this.recordSourceMappingEnd(accessor);
        };

        Emitter.prototype.emitSetAccessor = function (accessor) {
            this.recordSourceMappingStart(accessor);
            this.writeToOutput("set ");

            var temp = this.setContainer(5 /* Function */);

            this.recordSourceMappingStart(accessor);

            var pullDecl = this.semanticInfoChain.getDeclForAST(accessor);
            this.pushDecl(pullDecl);

            this.recordSourceMappingStart(accessor);

            var accessorSymbol = TypeScript.PullHelpers.getAccessorSymbol(accessor, this.semanticInfoChain);
            var container = accessorSymbol.getContainer();
            var containerKind = container.kind;

            this.recordSourceMappingNameStart(accessor.propertyName.text());
            this.writeToOutput(accessor.propertyName.text());
            this.writeToOutput("(");

            var parameters = TypeScript.Parameters.fromParameterList(accessor.parameterList);
            this.emitFunctionParameters(parameters);
            this.writeToOutput(")");

            this.emitFunctionBodyStatements(null, accessor, parameters, accessor.block, null);

            this.recordSourceMappingEnd(accessor);

            // The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
            this.recordSourceMappingEnd(accessor);

            this.popDecl(pullDecl);
            this.setContainer(temp);
            this.recordSourceMappingEnd(accessor);
        };

        Emitter.prototype.emitFunctionExpression = function (funcDecl) {
            var savedInArrowFunction = this.inArrowFunction;
            this.inArrowFunction = false;

            var temp = this.setContainer(5 /* Function */);

            var funcName = funcDecl.identifier ? funcDecl.identifier.text() : null;

            this.recordSourceMappingStart(funcDecl);

            var pullDecl = this.semanticInfoChain.getDeclForAST(funcDecl);
            this.pushDecl(pullDecl);

            this.recordSourceMappingStart(funcDecl);
            this.writeToOutput("function ");

            //var id = funcDecl.getNameText();
            if (funcDecl.identifier) {
                this.recordSourceMappingStart(funcDecl.identifier);
                this.writeToOutput(funcDecl.identifier.text());
                this.recordSourceMappingEnd(funcDecl.identifier);
            }

            this.writeToOutput("(");

            var parameters = TypeScript.Parameters.fromParameterList(funcDecl.callSignature.parameterList);
            this.emitFunctionParameters(parameters);
            this.writeToOutput(")");

            this.emitFunctionBodyStatements(funcName, funcDecl, parameters, funcDecl.block, null);

            this.recordSourceMappingEnd(funcDecl);

            // The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
            this.recordSourceMappingEnd(funcDecl);

            this.emitComments(funcDecl, false);

            this.popDecl(pullDecl);

            this.setContainer(temp);
            this.inArrowFunction = savedInArrowFunction;
        };

        Emitter.prototype.emitFunction = function (funcDecl) {
            if (funcDecl.block === null) {
                return;
            }
            var savedInArrowFunction = this.inArrowFunction;
            this.inArrowFunction = false;

            var isModuleContainer = (this.emitState.container === 1 /* Module */ || this.emitState.container === 2 /* DynamicModule */);
            var isStaticModuleContainer = this.emitState.container === 1 /* Module */;
            var temp = this.setContainer(5 /* Function */);

            var funcName = funcDecl.identifier.text();

            this.recordSourceMappingStart(funcDecl);

            var printName = funcDecl.identifier !== null;
            var pullDecl = this.semanticInfoChain.getDeclForAST(funcDecl);
            this.pushDecl(pullDecl);

            //this.emitComments(funcDecl, true);
            this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(funcDecl), this.getJSDocForFunctionDeclaration(funcDecl)));

            var pullFunctionDecl = this.semanticInfoChain.getDeclForAST(funcDecl);

            if (funcDecl.block && isModuleContainer && pullFunctionDecl && TypeScript.hasFlag(pullFunctionDecl.flags, 1 /* Exported */)) {
                this.writeLineToOutput("");
                this.emitIndent();
                var modName = isStaticModuleContainer ? pullDecl.getSymbol().getContainer().fullName() : "exports";
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
            } else {
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

            var parameters = TypeScript.Parameters.fromParameterList(funcDecl.callSignature.parameterList);
            this.emitFunctionBodyStatements(funcDecl.identifier.text(), funcDecl, parameters, funcDecl.block, null);

            this.recordSourceMappingEnd(funcDecl);

            // The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
            this.recordSourceMappingEnd(funcDecl);

            this.emitComments(funcDecl, false);

            this.popDecl(pullDecl);

            this.setContainer(temp);
            this.inArrowFunction = savedInArrowFunction;
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
        };

        Emitter.prototype.emitAmbientVarDecl = function (varDecl) {
            this.recordSourceMappingStart(this.currentVariableDeclaration);
            if (varDecl.equalsValueClause) {
                this.emitComments(varDecl, true);
                this.recordSourceMappingStart(varDecl);
                this.writeToOutputWithSourceMapRecord(varDecl.propertyName.text(), varDecl.propertyName);
                this.emitJavascript(varDecl.equalsValueClause, false);
                this.recordSourceMappingEnd(varDecl);
                this.emitComments(varDecl, false);
            }
        };

        // Emits "var " if it is allowed
        Emitter.prototype.emitVarDeclVar = function () {
            if (this.currentVariableDeclaration) {
                this.writeToOutput("var ");
            }
        };

        Emitter.prototype.emitVariableDeclaration = function (declaration) {
            var varDecl = declaration.declarators.nonSeparatorAt(0);

            var symbol = this.semanticInfoChain.getSymbolForAST(varDecl);

            var parentSymbol = symbol ? symbol.getContainer() : null;
            var parentKind = parentSymbol ? parentSymbol.kind : 0 /* None */;

            this.emitComments(declaration, true);

            var pullVarDecl = this.semanticInfoChain.getDeclForAST(varDecl);
            var isAmbientWithoutInit = pullVarDecl && TypeScript.hasFlag(pullVarDecl.flags, 8 /* Ambient */) && varDecl.equalsValueClause === null;
            if (!isAmbientWithoutInit) {
                var prevVariableDeclaration = this.currentVariableDeclaration;
                this.currentVariableDeclaration = declaration;

                for (var i = 0, n = declaration.declarators.nonSeparatorCount(); i < n; i++) {
                    var declarator = declaration.declarators.nonSeparatorAt(i);

                    if (i > 0) {
                        this.writeToOutput(", ");
                    }

                    this.emit(declarator);
                }
                this.currentVariableDeclaration = prevVariableDeclaration;

                // Declarator emit would take care of emitting start of the variable declaration start
                this.recordSourceMappingEnd(declaration);
            }

            this.emitComments(declaration, false);
        };

        Emitter.prototype.emitMemberVariableDeclaration = function (varDecl) {
            TypeScript.Debug.assert(!TypeScript.hasModifier(varDecl.modifiers, 16 /* Static */) && varDecl.variableDeclarator.equalsValueClause);

            var pullDecl = this.semanticInfoChain.getDeclForAST(varDecl);
            this.pushDecl(pullDecl);

            var symbol = pullDecl.getSymbol();
            if (this.emittedClassProperties.indexOf(symbol) < 0) {
                var jsDocComments = this.getJSDocForClassMemberVariable(symbol);
                this.emitInlineJSDocComment(Emitter.getUserComments(varDecl), jsDocComments);

                this.emittedClassProperties.push(symbol);
            } else {
                this.emitComments(varDecl, true);
            }

            this.recordSourceMappingStart(varDecl);

            var varDeclName = varDecl.variableDeclarator.propertyName.text();
            var quotedOrNumber = TypeScript.isQuoted(varDeclName) || varDecl.variableDeclarator.propertyName.kind() !== 11 /* IdentifierName */;

            var symbol = this.semanticInfoChain.getSymbolForAST(varDecl);
            var parentSymbol = symbol ? symbol.getContainer() : null;
            var parentDecl = pullDecl && pullDecl.getParentDecl();

            if (quotedOrNumber) {
                this.writeToOutput("this[");
            } else {
                this.writeToOutput("this.");
            }

            this.writeToOutputWithSourceMapRecord(varDecl.variableDeclarator.propertyName.text(), varDecl.variableDeclarator.propertyName);

            if (quotedOrNumber) {
                this.writeToOutput("]");
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
            if (this.emitState.container !== 6 /* Args */) {
                this.writeToOutput(";");
            }

            this.recordSourceMappingEnd(varDecl);
            this.emitComments(varDecl, false);

            this.popDecl(pullDecl);
        };

        Emitter.prototype.emitVariableDeclarator = function (varDecl) {
            var pullDecl = this.semanticInfoChain.getDeclForAST(varDecl);
            this.pushDecl(pullDecl);
            if (pullDecl && (pullDecl.flags & 8 /* Ambient */) === 8 /* Ambient */) {
                this.emitAmbientVarDecl(varDecl);
            } else {
                var symbol = pullDecl.getSymbol();
                var jsDocComments = null;
                if (symbol.isProperty()) {
                    if (this.emittedClassProperties.indexOf(symbol) < 0) {
                        jsDocComments = this.getJSDocForClassMemberVariable(symbol);
                        this.emittedClassProperties.push(symbol);
                    } else {
                        jsDocComments = [];
                    }
                } else {
                    jsDocComments = this.getJSDocForVariableDeclaration(symbol);
                }

                //this.emitInlineJSDocComment(Emitter.getUserComments(varDecl), jsDocComments);
                //this.emitComments(varDecl, true);
                this.recordSourceMappingStart(this.currentVariableDeclaration);
                this.recordSourceMappingStart(varDecl);

                var varDeclName = varDecl.propertyName.text();

                var symbol = this.semanticInfoChain.getSymbolForAST(varDecl);
                var parentSymbol = symbol ? symbol.getContainer() : null;
                var parentDecl = pullDecl && pullDecl.getParentDecl();
                var parentIsModule = parentDecl && (parentDecl.flags & 102400 /* SomeInitializedModule */);

                if (parentIsModule) {
                    // module
                    if (!TypeScript.hasFlag(pullDecl.flags, 1 /* Exported */)) {
                        this.emitVarDeclVar();
                        this.emitInlineJSDocComment(Emitter.getUserComments(varDecl), jsDocComments);
                    } else {
                        this.emitInlineJSDocComment(Emitter.getUserComments(varDecl), jsDocComments);

                        if (this.emitState.container === 2 /* DynamicModule */) {
                            this.writeToOutput("exports.");
                        } else {
                            this.writeToOutput(symbol.getContainer().fullName() + ".");
                            //this.writeToOutput(this.moduleName + ".");
                        }
                    }
                } else {
                    this.emitVarDeclVar();
                    this.emitInlineJSDocComment(Emitter.getUserComments(varDecl), jsDocComments);
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
        };

        Emitter.prototype.symbolIsUsedInItsEnclosingContainer = function (symbol, dynamic) {
            if (typeof dynamic === "undefined") { dynamic = false; }
            var symDecls = symbol.getDeclarations();

            if (symDecls.length) {
                var enclosingDecl = this.getEnclosingDecl();
                if (enclosingDecl) {
                    var parentDecl = symDecls[0].getParentDecl();
                    if (parentDecl) {
                        var symbolDeclarationEnclosingContainer = parentDecl;
                        var enclosingContainer = enclosingDecl;

                        while (symbolDeclarationEnclosingContainer) {
                            if (symbolDeclarationEnclosingContainer.kind === (dynamic ? 32 /* DynamicModule */ : 4 /* Container */)) {
                                break;
                            }
                            symbolDeclarationEnclosingContainer = symbolDeclarationEnclosingContainer.getParentDecl();
                        }

                        // if the symbol in question is not a global, compute the nearest
                        // enclosing declaration from the point of usage
                        if (symbolDeclarationEnclosingContainer) {
                            while (enclosingContainer) {
                                if (enclosingContainer.kind === (dynamic ? 32 /* DynamicModule */ : 4 /* Container */)) {
                                    break;
                                }

                                enclosingContainer = enclosingContainer.getParentDecl();
                            }
                        }

                        if (symbolDeclarationEnclosingContainer && enclosingContainer) {
                            var same = symbolDeclarationEnclosingContainer === enclosingContainer;

                            // initialized module object variables are bound to their parent's decls
                            if (!same && symbol.anyDeclHasFlag(32768 /* InitializedModule */)) {
                                same = symbolDeclarationEnclosingContainer === enclosingContainer.getParentDecl();
                            }

                            return same;
                        }
                    }
                }
            }

            return false;
        };

        // Gets the decl path that needs to be emitted for the symbol in the enclosing context
        Emitter.prototype.getPotentialDeclPathInfoForEmit = function (pullSymbol) {
            var decl = pullSymbol.getDeclarations()[0];
            var parentDecl = decl.getParentDecl();
            var symbolContainerDeclPath = parentDecl ? parentDecl.getParentPath() : [];

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
            var startingIndex = symbolContainerDeclPath.length - 1;
            for (var i = startingIndex - 1; i > commonNodeIndex; i--) {
                if (symbolContainerDeclPath[i + 1].flags & 1 /* Exported */) {
                    startingIndex = i;
                } else {
                    break;
                }
            }
            return { potentialPath: symbolContainerDeclPath, startingIndex: startingIndex };
        };

        // Emit the dotted names using the decl path
        Emitter.prototype.emitDottedNameFromDeclPath = function (declPath, startingIndex, lastIndex) {
            for (var i = startingIndex; i <= lastIndex; i++) {
                if (declPath[i].kind === 32 /* DynamicModule */ || declPath[i].flags & 65536 /* InitializedDynamicModule */) {
                    this.writeToOutput("exports.");
                } else {
                    this.writeToOutput(declPath[lastIndex].getSymbol().fullName() + ".");
                    return;
                    // Get the name of the decl that would need to referenced and is conflict free.
                    //this.writeToOutput(this.getModuleName(declPath[i], /* changeNameIfAnyDeclarationInContext */ true) + ".");
                }
            }
        };

        // Emits the container name of the symbol in the given enclosing context
        Emitter.prototype.emitSymbolContainerNameInEnclosingContext = function (pullSymbol) {
            var declPathInfo = this.getPotentialDeclPathInfoForEmit(pullSymbol);
            var potentialDeclPath = declPathInfo.potentialPath;
            var startingIndex = declPathInfo.startingIndex;

            // Emit dotted names for the path
            this.emitDottedNameFromDeclPath(potentialDeclPath, startingIndex, potentialDeclPath.length - 1);
        };

        // Get the symbol information to be used for emitting the ast
        Emitter.prototype.getSymbolForEmit = function (ast) {
            var pullSymbol = this.semanticInfoChain.getSymbolForAST(ast);
            var pullSymbolAlias = this.semanticInfoChain.getAliasSymbolForAST(ast);
            if (pullSymbol && pullSymbolAlias) {
                var symbolToCompare = TypeScript.isTypesOnlyLocation(ast) ? pullSymbolAlias.getExportAssignedTypeSymbol() : pullSymbolAlias.getExportAssignedValueSymbol();

                if (pullSymbol == symbolToCompare) {
                    pullSymbol = pullSymbolAlias;
                    pullSymbolAlias = null;
                }
            }
            return { symbol: pullSymbol, aliasSymbol: pullSymbolAlias };
        };

        Emitter.prototype.emitName = function (name, addThis) {
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
                var isLocalAlias = pullSymbolAlias && (pullSymbolAlias.getDeclarations()[0].getParentDecl() == this.getEnclosingDecl());

                if (addThis && (this.emitState.container !== 6 /* Args */) && pullSymbol) {
                    var pullSymbolContainer = pullSymbol.getContainer();

                    if (pullSymbolContainer) {
                        var pullSymbolContainerKind = pullSymbolContainer.kind;

                        if (this.isEnumEmitted && pullSymbol.kind === 67108864 /* EnumMember */) {
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

                        if (pullSymbolContainerKind === 8 /* Class */) {
                            if (pullSymbol.anyDeclHasFlag(16 /* Static */)) {
                                // This is static symbol
                                this.emitSymbolContainerNameInEnclosingContext(pullSymbol);
                            } else if (pullSymbolKind === 4096 /* Property */) {
                                this.emitThis();
                                this.writeToOutput(".");
                            }
                        } else if (TypeScript.PullHelpers.symbolIsModule(pullSymbolContainer) || pullSymbolContainerKind === 64 /* Enum */ || pullSymbolContainer.anyDeclHasFlag(32768 /* InitializedModule */ | 4096 /* Enum */)) {
                            // If property or, say, a constructor being invoked locally within the module of its definition
                            if (pullSymbolKind === 4096 /* Property */ || pullSymbolKind === 67108864 /* EnumMember */) {
                                this.emitSymbolContainerNameInEnclosingContext(pullSymbol);
                            } else if (pullSymbol.anyDeclHasFlag(1 /* Exported */) && pullSymbolKind === 512 /* Variable */ && !pullSymbol.anyDeclHasFlag(32768 /* InitializedModule */ | 4096 /* Enum */)) {
                                this.emitSymbolContainerNameInEnclosingContext(pullSymbol);
                            } else if (pullSymbol.anyDeclHasFlag(1 /* Exported */)) {
                                this.emitSymbolContainerNameInEnclosingContext(pullSymbol);
                            } else if (this.isNeedObfuscateName(pullSymbol)) {
                                this.writeToOutput(this.getObfuscatedName(pullSymbol, name.text()));

                                this.recordSourceMappingEnd(name);
                                this.emitComments(name, false);

                                return;
                            }
                        } else if (pullSymbolContainerKind === 32 /* DynamicModule */ || pullSymbolContainer.anyDeclHasFlag(65536 /* InitializedDynamicModule */)) {
                            if (pullSymbolKind === 4096 /* Property */) {
                                // If dynamic module
                                this.writeToOutput("exports.");
                            } else if (pullSymbol.anyDeclHasFlag(1 /* Exported */) && !isLocalAlias && !pullSymbol.anyDeclHasFlag(118784 /* ImplicitVariable */) && pullSymbol.kind !== 32768 /* ConstructorMethod */ && pullSymbol.kind !== 8 /* Class */ && pullSymbol.kind !== 64 /* Enum */) {
                                this.writeToOutput("exports.");
                            }
                        }
                    }
                }

                this.writeToOutput(name.text());
            }

            this.recordSourceMappingEnd(name);
            this.emitComments(name, false);
        };

        Emitter.prototype.recordSourceMappingNameStart = function (name) {
            if (this.sourceMapper) {
                var nameIndex = -1;
                if (name) {
                    if (this.sourceMapper.currentNameIndex.length > 0) {
                        var parentNameIndex = this.sourceMapper.currentNameIndex[this.sourceMapper.currentNameIndex.length - 1];
                        if (parentNameIndex != -1) {
                            name = this.sourceMapper.names[parentNameIndex] + "." + name;
                        }
                    }

                    // Look if there already exists name
                    var nameIndex = this.sourceMapper.names.length - 1;
                    for (nameIndex; nameIndex >= 0; nameIndex--) {
                        if (this.sourceMapper.names[nameIndex] == name) {
                            break;
                        }
                    }

                    if (nameIndex == -1) {
                        nameIndex = this.sourceMapper.names.length;
                        this.sourceMapper.names.push(name);
                    }
                }
                this.sourceMapper.currentNameIndex.push(nameIndex);
            }
        };

        Emitter.prototype.recordSourceMappingNameEnd = function () {
            if (this.sourceMapper) {
                this.sourceMapper.currentNameIndex.pop();
            }
        };

        Emitter.prototype.recordSourceMappingStart = function (ast) {
            if (this.sourceMapper && TypeScript.isValidAstNode(ast)) {
                var lineCol = { line: -1, character: -1 };
                var sourceMapping = new TypeScript.SourceMapping();
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

                TypeScript.Debug.assert(!isNaN(sourceMapping.start.emittedColumn));
                TypeScript.Debug.assert(!isNaN(sourceMapping.start.emittedLine));
                TypeScript.Debug.assert(!isNaN(sourceMapping.start.sourceColumn));
                TypeScript.Debug.assert(!isNaN(sourceMapping.start.sourceLine));
                TypeScript.Debug.assert(!isNaN(sourceMapping.end.sourceColumn));
                TypeScript.Debug.assert(!isNaN(sourceMapping.end.sourceLine));

                if (this.sourceMapper.currentNameIndex.length > 0) {
                    sourceMapping.nameIndex = this.sourceMapper.currentNameIndex[this.sourceMapper.currentNameIndex.length - 1];
                }

                // Set parent and child relationship
                var siblings = this.sourceMapper.currentMappings[this.sourceMapper.currentMappings.length - 1];
                siblings.push(sourceMapping);
                this.sourceMapper.currentMappings.push(sourceMapping.childMappings);
                this.sourceMapper.increaseMappingLevel(ast);
            }
        };

        Emitter.prototype.recordSourceMappingEnd = function (ast) {
            if (this.sourceMapper && TypeScript.isValidAstNode(ast)) {
                // Pop source mapping childs
                this.sourceMapper.currentMappings.pop();

                // Get the last source mapping from sibling list = which is the one we are recording end for
                var siblings = this.sourceMapper.currentMappings[this.sourceMapper.currentMappings.length - 1];
                var sourceMapping = siblings[siblings.length - 1];

                sourceMapping.end.emittedColumn = this.emitState.column;
                sourceMapping.end.emittedLine = this.emitState.line;

                TypeScript.Debug.assert(!isNaN(sourceMapping.end.emittedColumn));
                TypeScript.Debug.assert(!isNaN(sourceMapping.end.emittedLine));

                this.sourceMapper.decreaseMappingLevel(ast);
            }
        };

        // Note: may throw exception.
        Emitter.prototype.getOutputFiles = function () {
            // Output a source mapping.  As long as we haven't gotten any errors yet.
            var result = [];
            if (this.sourceMapper !== null) {
                this.sourceMapper.emitSourceMapping();
                result.push(this.sourceMapper.getOutputFile());
            }

            result.push(this.outfile.getOutputFile());
            return result;
        };

        Emitter.prototype.emitParameterPropertyAndMemberVariableAssignments = function () {
            // emit any parameter properties first
            var constructorDecl = getLastConstructor(this.thisClassNode);

            if (constructorDecl && constructorDecl.parameterList) {
                for (var i = 0, n = constructorDecl.parameterList.parameters.nonSeparatorCount(); i < n; i++) {
                    var parameter = constructorDecl.parameterList.parameters.nonSeparatorAt(i);
                    var parameterDecl = this.semanticInfoChain.getDeclForAST(parameter);
                    if (TypeScript.hasFlag(parameterDecl.flags, 8388608 /* PropertyParameter */)) {
                        this.emitIndent();
                        this.recordSourceMappingStart(parameter);

                        var symbol = this.semanticInfoChain.getSymbolForAST(parameter);

                        if (this.emittedClassProperties.indexOf(symbol) < 0) {
                            this.emitJSDocComment(this.getJSDocForClassMemberVariable(symbol));
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
                if (this.thisClassNode.classElements.childAt(i).kind() === 151 /* MemberVariableDeclaration */) {
                    var varDecl = this.thisClassNode.classElements.childAt(i);
                    if (!TypeScript.hasModifier(varDecl.modifiers, 16 /* Static */) && varDecl.variableDeclarator.equalsValueClause) {
                        this.emitIndent();
                        this.emitMemberVariableDeclaration(varDecl);
                        this.writeLineToOutput("");
                    }
                }
            }
        };

        Emitter.prototype.isOnSameLine = function (pos1, pos2) {
            var lineMap = this.document.lineMap();
            return lineMap.getLineNumberFromPosition(pos1) === lineMap.getLineNumberFromPosition(pos2);
        };

        Emitter.prototype.emitCommaSeparatedList = function (parent, list, buffer, preserveNewLines) {
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
            } else {
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
                    } else {
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
            } else {
                this.writeToOutput(buffer);
            }
        };

        Emitter.prototype.emitList = function (list, useNewLineSeparator, startInclusive, endExclusive) {
            if (typeof useNewLineSeparator === "undefined") { useNewLineSeparator = true; }
            if (typeof startInclusive === "undefined") { startInclusive = 0; }
            if (typeof endExclusive === "undefined") { endExclusive = list.childCount(); }
            if (list === null) {
                return;
            }

            this.emitComments(list, true);
            var lastEmittedNode = null;

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
        };

        Emitter.prototype.emitSeparatedList = function (list, useNewLineSeparator, startInclusive, endExclusive) {
            if (typeof useNewLineSeparator === "undefined") { useNewLineSeparator = true; }
            if (typeof startInclusive === "undefined") { startInclusive = 0; }
            if (typeof endExclusive === "undefined") { endExclusive = list.nonSeparatorCount(); }
            if (list === null) {
                return;
            }

            this.emitComments(list, true);
            var lastEmittedNode = null;

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
        };

        Emitter.prototype.isDirectivePrologueElement = function (node) {
            if (node.kind() === 164 /* ExpressionStatement */) {
                var exprStatement = node;
                return exprStatement.expression.kind() === 14 /* StringLiteral */;
            }

            return false;
        };

        // If these two constructs had more than one line between them originally, then emit at
        // least one blank line between them.
        Emitter.prototype.emitSpaceBetweenConstructs = function (node1, node2) {
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
                this.writeLineToOutput("", true);
            }
        };

        // We consider a sequence of comments to be a copyright header if there are no blank lines
        // between them, and there is a blank line after the last one and the node they're attached
        // to.
        Emitter.prototype.getCopyrightComments = function () {
            var preComments = this.copyrightElement.preComments();
            if (preComments) {
                var lineMap = this.document.lineMap();

                var copyrightComments = [];
                var lastComment = null;

                for (var i = 0, n = preComments.length; i < n; i++) {
                    var comment = preComments[i];

                    if (lastComment) {
                        var lastCommentLine = lineMap.getLineNumberFromPosition(lastComment.end());
                        var commentLine = lineMap.getLineNumberFromPosition(comment.start());

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
                var lastCommentLine = lineMap.getLineNumberFromPosition(TypeScript.ArrayUtilities.last(copyrightComments).end());
                var astLine = lineMap.getLineNumberFromPosition(this.copyrightElement.start());
                if (astLine >= lastCommentLine + 2) {
                    return copyrightComments;
                }
            }

            // No usable copyright comments found.
            return [];
        };

        Emitter.prototype.emitPossibleCopyrightHeaders = function (script) {
            var list = script.moduleElements;
            if (list.childCount() > 0) {
                var firstElement = list.childAt(0);

                this.copyrightElement = firstElement;
                this.emitCommentsArray(this.getCopyrightComments(), false);
            }
        };

        Emitter.prototype.emitScriptElements = function (sourceUnit) {
            var list = sourceUnit.moduleElements;

            this.emitPossibleCopyrightHeaders(sourceUnit);

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
            var isNonElidedExternalModule = isExternalModule && !TypeScript.scriptIsElided(sourceUnit);
            if (isNonElidedExternalModule) {
                this.recordSourceMappingStart(sourceUnit);

                if (this.emitOptions.compilationSettings().moduleGenTarget() === 2 /* Asynchronous */) {
                    var dependencyList = "[\"require\", \"exports\"";
                    var importList = "require, exports";

                    var importAndDependencyList = this.getModuleImportAndDependencyList(sourceUnit);
                    importList += importAndDependencyList.importList;
                    dependencyList += importAndDependencyList.dependencyList + "]";

                    this.writeLineToOutput("define(" + dependencyList + "," + " function(" + importList + ") {");
                }
            }

            if (isExternalModule) {
                var temp = this.setContainer(2 /* DynamicModule */);

                var svModuleName = this.moduleName;
                this.moduleName = sourceUnit.fileName();
                if (TypeScript.isTSFile(this.moduleName)) {
                    this.moduleName = this.moduleName.substring(0, this.moduleName.length - ".ts".length);
                }

                // if the external module has an "export =" identifier, we'll
                // set it in the ExportAssignment emit method
                this.setExportAssignmentIdentifier(null);

                if (this.emitOptions.compilationSettings().moduleGenTarget() === 2 /* Asynchronous */) {
                    this.indenter.increaseIndent();
                }

                var externalModule = this.semanticInfoChain.getDeclForAST(this.document.sourceUnit());

                if (TypeScript.hasFlag(externalModule.flags, 262144 /* MustCaptureThis */)) {
                    this.writeCaptureThisStatement(sourceUnit);
                }

                this.pushDecl(externalModule);
            }

            this.emitList(list, true, i, n);

            if (isExternalModule) {
                if (this.emitOptions.compilationSettings().moduleGenTarget() === 2 /* Asynchronous */) {
                    this.indenter.decreaseIndent();
                }

                if (isNonElidedExternalModule) {
                    var exportAssignmentIdentifier = this.getExportAssignmentIdentifier();
                    var exportAssignmentValueSymbol = externalModule.getSymbol().getExportAssignedValueSymbol();

                    if (this.emitOptions.compilationSettings().moduleGenTarget() === 2 /* Asynchronous */) {
                        if (exportAssignmentIdentifier && exportAssignmentValueSymbol && !(exportAssignmentValueSymbol.kind & 58720272 /* SomeTypeReference */)) {
                            // indent was decreased for AMD above
                            this.indenter.increaseIndent();
                            this.emitIndent();
                            this.writeLineToOutput("return " + exportAssignmentIdentifier + ";");
                            this.indenter.decreaseIndent();
                        }
                        this.writeToOutput("});");
                    } else if (exportAssignmentIdentifier && exportAssignmentValueSymbol && !(exportAssignmentValueSymbol.kind & 58720272 /* SomeTypeReference */)) {
                        this.emitIndent();
                        this.writeToOutput("module.exports = " + exportAssignmentIdentifier + ";");
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

                while (pArr.length !== 0) {
                    this.emitInterfaceDeclaration(this.semanticInfoChain.getASTForDecl(pArr[0].getDeclarations()[0]));
                    this.writeLineToOutput("");
                }
            }
        };

        Emitter.prototype.emitConstructorStatements = function (funcDecl) {
            var list = funcDecl.block.statements;

            if (list === null) {
                return;
            }

            this.emitComments(list, true);

            var emitPropertyAssignmentsAfterSuperCall = TypeScript.getExtendsHeritageClause(this.thisClassNode.heritageClauses) !== null;
            var propertyAssignmentIndex = emitPropertyAssignmentsAfterSuperCall ? 1 : 0;
            var lastEmittedNode = null;

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
        };

        // tokenId is the id the preceding token
        Emitter.prototype.emitJavascript = function (ast, startLine) {
            if (ast === null) {
                return;
            }

            if (startLine && this.indenter.indentAmt > 0) {
                this.emitIndent();
            }

            this.emit(ast);
        };

        Emitter.prototype.emitAccessorMemberDeclaration = function (funcDecl, name, className, isProto) {
            if (funcDecl.kind() !== 154 /* GetAccessor */) {
                var accessorSymbol = TypeScript.PullHelpers.getAccessorSymbol(funcDecl, this.semanticInfoChain);
                if (accessorSymbol.getGetter()) {
                    return;
                }
            }

            this.emitIndent();
            this.recordSourceMappingStart(funcDecl);

            this.writeToOutput("Object.defineProperty(" + className);
            if (isProto) {
                this.writeToOutput(".prototype, ");
            } else {
                this.writeToOutput(", ");
            }

            var functionName = name.text();
            if (TypeScript.isQuoted(functionName)) {
                this.writeToOutput(functionName);
            } else {
                this.writeToOutput('"' + functionName + '"');
            }

            this.writeLineToOutput(", {");

            this.indenter.increaseIndent();

            var accessors = TypeScript.PullHelpers.getGetterAndSetterFunction(funcDecl, this.semanticInfoChain);
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
        };

        Emitter.prototype.emitAccessorBody = function (funcDecl, parameterList, block) {
            var pullDecl = this.semanticInfoChain.getDeclForAST(funcDecl);
            this.pushDecl(pullDecl);

            this.recordSourceMappingStart(funcDecl);
            this.writeToOutput("function ");

            this.writeToOutput("(");

            var parameters = TypeScript.Parameters.fromParameterList(parameterList);
            this.emitFunctionParameters(parameters);
            this.writeToOutput(")");

            this.emitFunctionBodyStatements(null, funcDecl, parameters, block, null);

            this.recordSourceMappingEnd(funcDecl);

            // The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
            this.recordSourceMappingEnd(funcDecl);
            this.popDecl(pullDecl);
        };

        Emitter.prototype.emitClass = function (classDecl) {
            var pullDecl = this.semanticInfoChain.getDeclForAST(classDecl);
            this.pushDecl(pullDecl);

            var svClassNode = this.thisClassNode;
            var svFullClassName = this.thisFullClassName;
            var svFullExtendClassName = this.thisFullExtendClassName;

            this.thisClassNode = classDecl;
            this.thisFullClassName = null;
            this.thisFullExtendClassName = null;

            var className = classDecl.identifier.text();
            var fullClassName = className;
            var constrDecl = getLastConstructor(classDecl);

            //this.emitComments(classDecl, true);
            this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(classDecl), this.getJSDocForClass(classDecl)));

            var temp = this.setContainer(3 /* Class */);

            var hasBaseClass = TypeScript.getExtendsHeritageClause(classDecl.heritageClauses) !== null;
            var baseTypeReference = null;

            if ((temp === 1 /* Module */ || temp === 2 /* DynamicModule */) && TypeScript.hasFlag(pullDecl.flags, 1 /* Exported */)) {
                var modName = temp === 1 /* Module */ ? pullDecl.getSymbol().getContainer().fullName() : "exports";
                this.thisFullClassName = fullClassName = modName + "." + className;
            }

            this.thisFullClassName = fullClassName;

            if (hasBaseClass) {
                baseTypeReference = TypeScript.getExtendsHeritageClause(classDecl.heritageClauses).typeNames.nonSeparatorAt(0);

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

            this.recordSourceMappingStart(classDecl);

            if (fullClassName.indexOf(".") < 0) {
                var symbol = pullDecl.getSymbol().getConstructorMethod();
                this.thisFullClassName = fullClassName = this.getObfuscatedName(symbol, className);
                this.writeToOutput("var " + fullClassName + " = ");
            } else {
                this.writeToOutput(fullClassName + " = ");
            }

            this.recordSourceMappingNameStart(className);

            this.emittedClassProperties = [];

            // output constructor
            if (constrDecl) {
                // declared constructor
                this.emit(constrDecl);
                this.writeLineToOutput("");
            } else {
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
                this.writeLineToOutput("__extends(" + fullClassName + ", " + fullExtendClassName + ");");
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

            this.emittedClassProperties = null;

            this.popDecl(pullDecl);
        };

        Emitter.prototype.emitClassMembers = function (classDecl) {
            // First, emit all the functions.
            var lastEmittedMember = null;

            for (var i = 0, n = classDecl.classElements.childCount(); i < n; i++) {
                var memberDecl = classDecl.classElements.childAt(i);

                if (memberDecl.kind() === 154 /* GetAccessor */) {
                    this.emitSpaceBetweenConstructs(lastEmittedMember, memberDecl);
                    var getter = memberDecl;
                    this.emitAccessorMemberDeclaration(getter, getter.propertyName, this.thisFullClassName, !TypeScript.hasModifier(getter.modifiers, 16 /* Static */));
                    lastEmittedMember = memberDecl;
                } else if (memberDecl.kind() === 155 /* SetAccessor */) {
                    this.emitSpaceBetweenConstructs(lastEmittedMember, memberDecl);
                    var setter = memberDecl;
                    this.emitAccessorMemberDeclaration(setter, setter.propertyName, this.thisFullClassName, !TypeScript.hasModifier(setter.modifiers, 16 /* Static */));
                    lastEmittedMember = memberDecl;
                } else if (memberDecl.kind() === 150 /* MemberFunctionDeclaration */) {
                    var memberFunction = memberDecl;

                    if (memberFunction.block) {
                        this.emitSpaceBetweenConstructs(lastEmittedMember, memberDecl);

                        this.emitClassMemberFunctionDeclaration(classDecl, memberFunction);
                        lastEmittedMember = memberDecl;
                    }
                }
            }

            for (var i = 0, n = classDecl.classElements.childCount(); i < n; i++) {
                var memberDecl = classDecl.classElements.childAt(i);

                if (memberDecl.kind() === 151 /* MemberVariableDeclaration */) {
                    var varDecl = memberDecl;

                    if (TypeScript.hasModifier(varDecl.modifiers, 16 /* Static */) && varDecl.variableDeclarator.equalsValueClause) {
                        this.emitSpaceBetweenConstructs(lastEmittedMember, varDecl);

                        this.emitIndent();
                        this.recordSourceMappingStart(varDecl);

                        var varDeclName = varDecl.variableDeclarator.propertyName.text();
                        if (TypeScript.isQuoted(varDeclName) || varDecl.variableDeclarator.propertyName.kind() !== 11 /* IdentifierName */) {
                            this.writeToOutput(this.thisFullClassName + "[" + varDeclName + "]");
                        } else {
                            this.writeToOutput(this.thisFullClassName + "." + varDeclName);
                        }

                        this.emit(varDecl.variableDeclarator.equalsValueClause);

                        this.recordSourceMappingEnd(varDecl);
                        this.writeLineToOutput(";");

                        lastEmittedMember = varDecl;
                    }
                }
            }
        };

        Emitter.prototype.emitClassMemberFunctionDeclaration = function (classDecl, funcDecl) {
            this.emitIndent();
            this.recordSourceMappingStart(funcDecl);

            //this.emitComments(funcDecl, true);
            this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(funcDecl), this.getJSDocForFunctionDeclaration(funcDecl)));

            var functionName = funcDecl.propertyName.text();

            this.writeToOutput(this.thisFullClassName);

            //this.writeToOutput(classDecl.identifier.text());
            if (!TypeScript.hasModifier(funcDecl.modifiers, 16 /* Static */)) {
                this.writeToOutput(".prototype");
            }

            if (TypeScript.isQuoted(functionName) || funcDecl.propertyName.kind() !== 11 /* IdentifierName */) {
                this.writeToOutput("[" + functionName + "] = ");
            } else {
                this.writeToOutput("." + functionName + " = ");
            }

            var pullDecl = this.semanticInfoChain.getDeclForAST(funcDecl);
            this.pushDecl(pullDecl);

            this.recordSourceMappingStart(funcDecl);
            this.writeToOutput("function ");

            this.emitParameterList(funcDecl.callSignature.parameterList);

            var parameters = TypeScript.Parameters.fromParameterList(funcDecl.callSignature.parameterList);
            this.emitFunctionBodyStatements(funcDecl.propertyName.text(), funcDecl, parameters, funcDecl.block, null);

            this.recordSourceMappingEnd(funcDecl);

            this.emitComments(funcDecl, false);

            this.recordSourceMappingEnd(funcDecl);
            this.popDecl(pullDecl);

            this.writeLineToOutput(";");
        };

        Emitter.prototype.requiresExtendsBlock = function (moduleElements) {
            for (var i = 0, n = moduleElements.childCount(); i < n; i++) {
                var moduleElement = moduleElements.childAt(i);

                if (moduleElement.kind() === 145 /* ModuleDeclaration */) {
                    var moduleAST = moduleElement;

                    if (!TypeScript.hasModifier(moduleAST.modifiers, 8 /* Ambient */) && this.requiresExtendsBlock(moduleAST.moduleElements)) {
                        return true;
                    }
                } else if (moduleElement.kind() === 146 /* ClassDeclaration */) {
                    var classDeclaration = moduleElement;

                    if (!TypeScript.hasModifier(classDeclaration.modifiers, 8 /* Ambient */) && TypeScript.getExtendsHeritageClause(classDeclaration.heritageClauses) !== null) {
                        return true;
                    }
                }
            }

            return false;
        };

        Emitter.prototype.emitPrologue = function (sourceUnit) {
            if (!this.extendsPrologueEmitted) {
                if (this.requiresExtendsBlock(sourceUnit.moduleElements)) {
                    this.extendsPrologueEmitted = true;
                    this.emitJSDocComment([
                        '@param {Function} d',
                        '@param {Function} b'
                    ]);
                    this.writeLineToOutput("function __extends(d, b) {");
                    this.writeLineToOutput("  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];");
                    this.writeLineToOutput("  /** @constructor */ function __() { this.constructor = d; }");
                    this.writeLineToOutput("  __.prototype = b.prototype;");
                    this.writeLineToOutput("  d.prototype = new __();");
                    this.writeLineToOutput("};");
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
        };

        Emitter.prototype.emitThis = function () {
            if (!this.inWithBlock && this.inArrowFunction) {
                this.writeToOutput("_this");
            } else {
                this.writeToOutput("this");
            }
        };

        Emitter.prototype.emitBlockOrStatement = function (node) {
            if (node.kind() === 161 /* Block */) {
                this.emit(node);
            } else {
                this.writeLineToOutput("");
                this.indenter.increaseIndent();
                this.emitJavascript(node, true);
                this.indenter.decreaseIndent();
            }
        };

        Emitter.prototype.emitLiteralExpression = function (expression) {
            switch (expression.kind()) {
                case 32 /* NullKeyword */:
                    this.writeToOutputWithSourceMapRecord("null", expression);
                    break;
                case 24 /* FalseKeyword */:
                    this.writeToOutputWithSourceMapRecord("false", expression);
                    break;
                case 37 /* TrueKeyword */:
                    this.writeToOutputWithSourceMapRecord("true", expression);
                    break;
                default:
                    throw TypeScript.Errors.abstract();
            }
        };

        Emitter.prototype.emitThisExpression = function (expression) {
            if (!this.inWithBlock && this.inArrowFunction) {
                this.writeToOutputWithSourceMapRecord("_this", expression);
            } else {
                this.writeToOutputWithSourceMapRecord("this", expression);
            }
        };

        Emitter.prototype.emitSuperExpression = function (expression) {
            this.writeToOutputWithSourceMapRecord(this.thisFullExtendClassName + ".prototype", expression);
        };

        Emitter.prototype.emitParenthesizedExpression = function (parenthesizedExpression) {
            if (parenthesizedExpression.expression.kind() === 235 /* CastExpression */ && parenthesizedExpression.openParenTrailingComments === null) {
                // We have an expression of the form: (<Type>SubExpr)
                // Emitting this as (SubExpr) is really not desirable.  Just emit the subexpr as is.
                var symbol = this.semanticInfoChain.getSymbolForAST(parenthesizedExpression);

                if (!symbol) {
                    var resolver = this.semanticInfoChain.getResolver();

                    symbol = resolver.resolveAST(parenthesizedExpression, false, new TypeScript.PullTypeResolutionContext(resolver));

                    if (symbol.isTypeReference()) {
                        symbol = symbol.referencedTypeSymbol;
                    }
                }

                var svIsBlockTemplate = this.isTypeParametersEmitBlocked;

                this.isTypeParametersEmitBlocked = true;
                this.emitInlineJSDocComment([], this.getJSDocForType(symbol.type));
                this.isTypeParametersEmitBlocked = svIsBlockTemplate;

                this.emit(parenthesizedExpression.expression);
            } else {
                this.recordSourceMappingStart(parenthesizedExpression);
                this.writeToOutput("(");
                this.emitCommentsArray(parenthesizedExpression.openParenTrailingComments, false);
                this.emit(parenthesizedExpression.expression);
                this.writeToOutput(")");
                this.recordSourceMappingEnd(parenthesizedExpression);
            }
        };

        Emitter.prototype.emitCastExpression = function (expression) {
            this.emit(expression.expression);
        };

        Emitter.prototype.emitPrefixUnaryExpression = function (expression) {
            var nodeType = expression.kind();

            this.recordSourceMappingStart(expression);
            switch (nodeType) {
                case 182 /* LogicalNotExpression */:
                    this.writeToOutput("!");
                    this.emit(expression.operand);
                    break;
                case 181 /* BitwiseNotExpression */:
                    this.writeToOutput("~");
                    this.emit(expression.operand);
                    break;
                case 180 /* NegateExpression */:
                    this.writeToOutput("-");
                    if (expression.operand.kind() === 180 /* NegateExpression */ || expression.operand.kind() === 184 /* PreDecrementExpression */) {
                        this.writeToOutput(" ");
                    }
                    this.emit(expression.operand);
                    break;
                case 179 /* PlusExpression */:
                    this.writeToOutput("+");
                    if (expression.operand.kind() === 179 /* PlusExpression */ || expression.operand.kind() === 183 /* PreIncrementExpression */) {
                        this.writeToOutput(" ");
                    }
                    this.emit(expression.operand);
                    break;
                case 183 /* PreIncrementExpression */:
                    this.writeToOutput("++");
                    this.emit(expression.operand);
                    break;
                case 184 /* PreDecrementExpression */:
                    this.writeToOutput("--");
                    this.emit(expression.operand);
                    break;
                default:
                    throw TypeScript.Errors.abstract();
            }

            this.recordSourceMappingEnd(expression);
        };

        Emitter.prototype.emitPostfixUnaryExpression = function (expression) {
            var nodeType = expression.kind();

            this.recordSourceMappingStart(expression);
            switch (nodeType) {
                case 225 /* PostIncrementExpression */:
                    this.emit(expression.operand);
                    this.writeToOutput("++");
                    break;
                case 226 /* PostDecrementExpression */:
                    this.emit(expression.operand);
                    this.writeToOutput("--");
                    break;
                default:
                    throw TypeScript.Errors.abstract();
            }

            this.recordSourceMappingEnd(expression);
        };

        Emitter.prototype.emitTypeOfExpression = function (expression) {
            this.recordSourceMappingStart(expression);
            this.writeToOutput("typeof ");
            this.emit(expression.expression);
            this.recordSourceMappingEnd(expression);
        };

        Emitter.prototype.emitDeleteExpression = function (expression) {
            this.recordSourceMappingStart(expression);
            this.writeToOutput("delete ");
            this.emit(expression.expression);
            this.recordSourceMappingEnd(expression);
        };

        Emitter.prototype.emitVoidExpression = function (expression) {
            this.recordSourceMappingStart(expression);
            this.writeToOutput("void ");
            this.emit(expression.expression);
            this.recordSourceMappingEnd(expression);
        };

        Emitter.prototype.canEmitDottedNameMemberAccessExpression = function (expression) {
            var memberExpressionNodeType = expression.expression.kind();

            // If the memberAccess is of Name or another member access, we could potentially emit the symbol using the this memberAccessSymol
            if (memberExpressionNodeType == 11 /* IdentifierName */ || memberExpressionNodeType == 227 /* MemberAccessExpression */) {
                var memberAccessSymbol = this.getSymbolForEmit(expression).symbol;
                var memberAccessExpressionSymbol = this.getSymbolForEmit(expression.expression).symbol;
                if (memberAccessSymbol && memberAccessExpressionSymbol && !this.semanticInfoChain.getAliasSymbolForAST(expression.expression) && (TypeScript.PullHelpers.symbolIsModule(memberAccessExpressionSymbol) || memberAccessExpressionSymbol.kind === 64 /* Enum */ || memberAccessExpressionSymbol.anyDeclHasFlag(32768 /* InitializedModule */ | 4096 /* Enum */))) {
                    // If the memberAccess is in the context of the container, we could use the symbol to emit this expression
                    var memberAccessSymbolKind = memberAccessSymbol.kind;
                    if (memberAccessSymbolKind === 4096 /* Property */ || memberAccessSymbolKind === 67108864 /* EnumMember */ || (memberAccessSymbol.anyDeclHasFlag(1 /* Exported */) && memberAccessSymbolKind === 512 /* Variable */ && !memberAccessSymbol.anyDeclHasFlag(32768 /* InitializedModule */ | 4096 /* Enum */)) || ((memberAccessSymbol.anyDeclHasFlag(1 /* Exported */) && !this.symbolIsUsedInItsEnclosingContainer(memberAccessSymbol)))) {
                        // If the expression is member access, we need to verify it as well
                        if (memberExpressionNodeType == 227 /* MemberAccessExpression */) {
                            return this.canEmitDottedNameMemberAccessExpression(expression.expression);
                        }

                        return true;
                    }
                }
            }

            return false;
        };

        // Emit the member access expression using the declPath
        Emitter.prototype.emitDottedNameMemberAccessExpressionWorker = function (expression, potentialPath, startingIndex, lastIndex) {
            this.recordSourceMappingStart(expression);
            if (expression.expression.kind() == 227 /* MemberAccessExpression */) {
                // Emit the dotted name access expression
                this.emitDottedNameMemberAccessExpressionRecurse(expression.expression, potentialPath, startingIndex, lastIndex - 1);
            } else {
                this.emitComments(expression.expression, true);
                this.recordSourceMappingStart(expression.expression);

                // Emit the qualifying name fo the expression.expression
                this.emitDottedNameFromDeclPath(potentialPath, startingIndex, lastIndex - 2); // We would be emitting two identifiers as part of member access

                // Emit expression.expression
                this.writeToOutput(expression.expression.text());

                this.recordSourceMappingEnd(expression.expression);
                this.emitComments(expression.expression, false);
            }

            this.writeToOutput(".");
            this.emitName(expression.name, false);

            this.recordSourceMappingEnd(expression);
        };

        // Set the right indices for the recursive member access expression before emitting it using the decl path
        Emitter.prototype.emitDottedNameMemberAccessExpressionRecurse = function (expression, potentialPath, startingIndex, lastIndex) {
            this.emitComments(expression, true);

            if (lastIndex - startingIndex < 1) {
                startingIndex = lastIndex - 1;
                TypeScript.Debug.assert(startingIndex >= 0);
            }

            this.emitDottedNameMemberAccessExpressionWorker(expression, potentialPath, startingIndex, lastIndex);
            this.emitComments(expression, false);
        };

        Emitter.prototype.emitDottedNameMemberAccessExpression = function (expression) {
            var memberAccessSymbol = this.getSymbolForEmit(expression).symbol;

            // Get the decl path info to emit this expression using declPath
            var potentialDeclInfo = this.getPotentialDeclPathInfoForEmit(memberAccessSymbol);
            this.emitDottedNameMemberAccessExpressionWorker(expression, potentialDeclInfo.potentialPath, potentialDeclInfo.startingIndex, potentialDeclInfo.potentialPath.length);
        };

        Emitter.prototype.emitMemberAccessExpression = function (expression) {
            if (!this.tryEmitConstant(expression)) {
                // If the expression is dotted name of the modules, emit it using decl path so the name could be resolved correctly.
                if (this.canEmitDottedNameMemberAccessExpression(expression)) {
                    this.emitDottedNameMemberAccessExpression(expression);
                } else {
                    if (this.isEmitConstructorStatements) {
                        var symbol = this.semanticInfoChain.getSymbolForAST(expression.name);

                        if (symbol && symbol.isProperty() && symbol.getContainer() && symbol.getContainer() === this.semanticInfoChain.getSymbolForAST(this.thisClassNode) && this.emittedClassProperties.indexOf(symbol) < 0) {
                            this.emitInlineJSDocComment(this.getJSDocForClassMemberVariable(symbol));
                            this.emittedClassProperties.push(symbol);
                        }
                    }

                    this.recordSourceMappingStart(expression);
                    this.emit(expression.expression);
                    this.writeToOutput(".");
                    this.emitName(expression.name, false);
                    this.recordSourceMappingEnd(expression);
                }
            }
        };

        Emitter.prototype.emitQualifiedName = function (name) {
            this.recordSourceMappingStart(name);

            this.emit(name.left);
            this.writeToOutput(".");
            this.emitName(name.right, false);

            this.recordSourceMappingEnd(name);
        };

        Emitter.prototype.emitBinaryExpression = function (expression) {
            this.recordSourceMappingStart(expression);
            switch (expression.kind()) {
                case 188 /* CommaExpression */:
                    this.emit(expression.left);
                    this.writeToOutput(", ");
                    this.emit(expression.right);
                    break;
                default: {
                    this.emit(expression.left);
                    var binOp = TypeScript.SyntaxFacts.getText(TypeScript.SyntaxFacts.getOperatorTokenFromBinaryExpression(expression.kind()));
                    if (binOp === "instanceof") {
                        this.writeToOutput(" instanceof ");
                    } else if (binOp === "in") {
                        this.writeToOutput(" in ");
                    } else {
                        this.writeToOutput(" " + binOp + " ");
                    }
                    this.emit(expression.right);
                }
            }
            this.recordSourceMappingEnd(expression);
        };

        Emitter.prototype.emitSimplePropertyAssignment = function (property) {
            this.recordSourceMappingStart(property);
            this.emit(property.propertyName);
            this.writeToOutput(": ");
            this.emit(property.expression);
            this.recordSourceMappingEnd(property);
        };

        Emitter.prototype.emitFunctionPropertyAssignment = function (funcProp) {
            this.recordSourceMappingStart(funcProp);

            this.emit(funcProp.propertyName);
            this.writeToOutput(": ");

            var pullFunctionDecl = this.semanticInfoChain.getDeclForAST(funcProp);

            var savedInArrowFunction = this.inArrowFunction;
            this.inArrowFunction = false;

            var temp = this.setContainer(5 /* Function */);
            var funcName = funcProp.propertyName;

            var pullDecl = this.semanticInfoChain.getDeclForAST(funcProp);
            this.pushDecl(pullDecl);

            this.recordSourceMappingStart(funcProp);
            this.writeToOutput("function ");

            //this.recordSourceMappingStart(funcProp.propertyName);
            //this.writeToOutput(funcProp.propertyName.actualText);
            //this.recordSourceMappingEnd(funcProp.propertyName);
            this.writeToOutput("(");

            var parameters = TypeScript.Parameters.fromParameterList(funcProp.callSignature.parameterList);
            this.emitFunctionParameters(parameters);
            this.writeToOutput(")");

            this.emitFunctionBodyStatements(funcProp.propertyName.text(), funcProp, parameters, funcProp.block, null);

            this.recordSourceMappingEnd(funcProp);

            // The extra call is to make sure the caller's funcDecl end is recorded, since caller wont be able to record it
            this.recordSourceMappingEnd(funcProp);

            this.emitComments(funcProp, false);

            this.popDecl(pullDecl);

            this.setContainer(temp);
            this.inArrowFunction = savedInArrowFunction;

            this.recordSourceMappingEnd(funcProp);
        };

        Emitter.prototype.emitConditionalExpression = function (expression) {
            this.emit(expression.condition);
            this.writeToOutput(" ? ");
            this.emit(expression.whenTrue);
            this.writeToOutput(" : ");
            this.emit(expression.whenFalse);
        };

        Emitter.prototype.emitThrowStatement = function (statement) {
            this.recordSourceMappingStart(statement);
            this.writeToOutput("throw ");
            this.emit(statement.expression);
            this.recordSourceMappingEnd(statement);
            this.writeToOutput(";");
        };

        Emitter.prototype.emitExpressionStatement = function (statement) {
            var isArrowExpression = statement.expression.kind() === 234 /* SimpleArrowFunctionExpression */ || statement.expression.kind() === 233 /* ParenthesizedArrowFunctionExpression */;

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
        };

        Emitter.prototype.emitLabeledStatement = function (statement) {
            this.writeToOutputWithSourceMapRecord(statement.identifier.text(), statement.identifier);
            this.writeLineToOutput(":");
            this.emitJavascript(statement.statement, true);
        };

        Emitter.prototype.emitBlock = function (block) {
            this.recordSourceMappingStart(block);
            this.writeLineToOutput(" {");
            this.indenter.increaseIndent();
            if (block.statements) {
                this.emitList(block.statements);
            }
            this.emitCommentsArray(block.closeBraceLeadingComments, false);
            this.indenter.decreaseIndent();
            this.emitIndent();
            this.writeToOutput("}");
            this.recordSourceMappingEnd(block);
        };

        Emitter.prototype.emitBreakStatement = function (jump) {
            this.recordSourceMappingStart(jump);
            this.writeToOutput("break");

            if (jump.identifier) {
                this.writeToOutput(" " + jump.identifier.text());
            }

            this.recordSourceMappingEnd(jump);
            this.writeToOutput(";");
        };

        Emitter.prototype.emitContinueStatement = function (jump) {
            this.recordSourceMappingStart(jump);
            this.writeToOutput("continue");

            if (jump.identifier) {
                this.writeToOutput(" " + jump.identifier.text());
            }

            this.recordSourceMappingEnd(jump);
            this.writeToOutput(";");
        };

        Emitter.prototype.emitWhileStatement = function (statement) {
            this.recordSourceMappingStart(statement);
            this.writeToOutput("while (");
            this.emit(statement.condition);
            this.writeToOutput(")");
            this.emitBlockOrStatement(statement.statement);
            this.recordSourceMappingEnd(statement);
        };

        Emitter.prototype.emitDoStatement = function (statement) {
            this.recordSourceMappingStart(statement);
            this.writeToOutput("do");
            this.emitBlockOrStatement(statement.statement);
            this.writeToOutputWithSourceMapRecord(" while", statement.whileKeyword);
            this.writeToOutput('(');
            this.emit(statement.condition);
            this.writeToOutput(")");
            this.recordSourceMappingEnd(statement);
            this.writeToOutput(";");
        };

        Emitter.prototype.emitIfStatement = function (statement) {
            this.recordSourceMappingStart(statement);
            this.writeToOutput("if (");
            this.emit(statement.condition);
            this.writeToOutput(")");

            this.emitBlockOrStatement(statement.statement);

            if (statement.elseClause) {
                if (statement.statement.kind() !== 161 /* Block */) {
                    this.writeLineToOutput("");
                    this.emitIndent();
                } else {
                    this.writeToOutput(" ");
                }

                this.emit(statement.elseClause);
            }
            this.recordSourceMappingEnd(statement);
        };

        Emitter.prototype.emitElseClause = function (elseClause) {
            if (elseClause.statement.kind() === 162 /* IfStatement */) {
                this.writeToOutput("else ");
                this.emit(elseClause.statement);
            } else {
                this.writeToOutput("else");
                this.emitBlockOrStatement(elseClause.statement);
            }
        };

        Emitter.prototype.emitReturnStatement = function (statement) {
            this.recordSourceMappingStart(statement);
            if (statement.expression) {
                this.writeToOutput("return ");
                this.emit(statement.expression);
            } else {
                this.writeToOutput("return");
            }
            this.recordSourceMappingEnd(statement);
            this.writeToOutput(";");
        };

        Emitter.prototype.emitForInStatement = function (statement) {
            this.recordSourceMappingStart(statement);
            this.writeToOutput("for (");
            if (statement.left) {
                this.emit(statement.left);
            } else {
                this.emit(statement.variableDeclaration);
            }
            this.writeToOutput(" in ");
            this.emit(statement.expression);
            this.writeToOutput(")");
            this.emitBlockOrStatement(statement.statement);
            this.recordSourceMappingEnd(statement);
        };

        Emitter.prototype.emitForStatement = function (statement) {
            this.recordSourceMappingStart(statement);
            this.writeToOutput("for (");
            if (statement.variableDeclaration) {
                this.emit(statement.variableDeclaration);
            } else if (statement.initializer) {
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
        };

        Emitter.prototype.emitWithStatement = function (statement) {
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
        };

        Emitter.prototype.emitSwitchStatement = function (statement) {
            this.recordSourceMappingStart(statement);
            this.writeToOutput("switch (");
            this.emit(statement.expression);
            this.recordSourceMappingStart(statement.closeParenToken);
            this.writeToOutput(")");
            this.recordSourceMappingEnd(statement.closeParenToken);
            this.writeLineToOutput(" {");
            this.indenter.increaseIndent();
            this.emitList(statement.switchClauses, false);
            this.indenter.decreaseIndent();
            this.emitIndent();
            this.writeToOutput("}");
            this.recordSourceMappingEnd(statement);
        };

        Emitter.prototype.emitCaseSwitchClause = function (clause) {
            this.recordSourceMappingStart(clause);
            this.writeToOutput("case ");
            this.emit(clause.expression);
            this.writeToOutput(":");

            this.emitSwitchClauseBody(clause.statements);
            this.recordSourceMappingEnd(clause);
        };

        Emitter.prototype.emitSwitchClauseBody = function (body) {
            if (body.childCount() === 1 && body.childAt(0).kind() === 161 /* Block */) {
                // The case statement was written with curly braces, so emit it with the appropriate formatting
                this.emit(body.childAt(0));
                this.writeLineToOutput("");
            } else {
                // No curly braces. Format in the expected way
                this.writeLineToOutput("");
                this.indenter.increaseIndent();
                this.emit(body);
                this.indenter.decreaseIndent();
            }
        };

        Emitter.prototype.emitDefaultSwitchClause = function (clause) {
            this.recordSourceMappingStart(clause);
            this.writeToOutput("default:");

            this.emitSwitchClauseBody(clause.statements);
            this.recordSourceMappingEnd(clause);
        };

        Emitter.prototype.emitTryStatement = function (statement) {
            this.recordSourceMappingStart(statement);
            this.writeToOutput("try ");
            this.emit(statement.block);
            this.emitJavascript(statement.catchClause, false);

            if (statement.finallyClause) {
                this.emit(statement.finallyClause);
            }
            this.recordSourceMappingEnd(statement);
        };

        Emitter.prototype.emitCatchClause = function (clause) {
            this.writeToOutput(" ");
            this.recordSourceMappingStart(clause);
            this.writeToOutput("catch (");
            this.emit(clause.identifier);
            this.writeToOutput(")");
            this.emit(clause.block);
            this.recordSourceMappingEnd(clause);
        };

        Emitter.prototype.emitFinallyClause = function (clause) {
            this.writeToOutput(" finally");
            this.emit(clause.block);
        };

        Emitter.prototype.emitDebuggerStatement = function (statement) {
            this.writeToOutputWithSourceMapRecord("debugger", statement);
            this.writeToOutput(";");
        };

        Emitter.prototype.emitNumericLiteral = function (literal) {
            this.writeToOutputWithSourceMapRecord(literal.text(), literal);
        };

        Emitter.prototype.emitRegularExpressionLiteral = function (literal) {
            this.writeToOutputWithSourceMapRecord(literal.text(), literal);
        };

        Emitter.prototype.emitStringLiteral = function (literal) {
            this.writeToOutputWithSourceMapRecord(literal.text(), literal);
        };

        Emitter.prototype.emitEqualsValueClause = function (clause) {
            if (!this.isEnumEmitted) {
                this.writeToOutput(" = ");
            }

            this.emit(clause.value);
        };

        Emitter.prototype.emitParameter = function (parameter) {
            this.writeToOutputWithSourceMapRecord(parameter.identifier.text(), parameter);
        };

        Emitter.prototype.emitConstructorDeclaration = function (declaration) {
            if (declaration.block) {
                this.emitConstructor(declaration);
            } else {
                this.emitComments(declaration, true, true);
            }
        };

        Emitter.prototype.shouldEmitFunctionDeclaration = function (declaration) {
            return declaration.preComments() !== null || (!TypeScript.hasModifier(declaration.modifiers, 8 /* Ambient */) && declaration.block !== null);
        };

        Emitter.prototype.emitFunctionDeclaration = function (declaration) {
            if (!TypeScript.hasModifier(declaration.modifiers, 8 /* Ambient */) && declaration.block !== null) {
                this.emitFunction(declaration);
                this.writeToOutput(";");
            } else {
                this.emitComments(declaration, true, true);
            }
        };

        Emitter.prototype.emitSourceUnit = function (sourceUnit) {
            if (!this.document.isDeclareFile()) {
                var pullDecl = this.semanticInfoChain.getDeclForAST(sourceUnit);
                this.pushDecl(pullDecl);
                this.emitScriptElements(sourceUnit);
                this.popDecl(pullDecl);
            }
        };

        Emitter.prototype.shouldEmitEnumDeclaration = function (declaration) {
            return declaration.preComments() !== null || !TypeScript.enumIsElided(declaration);
        };

        Emitter.prototype.emitEnumDeclaration = function (declaration) {
            if (!TypeScript.enumIsElided(declaration)) {
                this.emitComments(declaration, true);
                this.emitEnum(declaration);
                this.emitComments(declaration, false);
            } else {
                this.emitComments(declaration, true, true);
            }
        };

        Emitter.prototype.shouldEmitModuleDeclaration = function (declaration) {
            return declaration.preComments() !== null || !TypeScript.moduleIsElided(declaration);
        };

        Emitter.prototype.emitModuleDeclaration = function (declaration) {
            if (!TypeScript.moduleIsElided(declaration)) {
                this.emitModuleDeclarationWorker(declaration);
            } else {
                this.emitComments(declaration, true, true);
            }
        };

        Emitter.prototype.shouldEmitClassDeclaration = function (declaration) {
            return declaration.preComments() !== null || !TypeScript.hasModifier(declaration.modifiers, 8 /* Ambient */);
        };

        Emitter.prototype.emitClassDeclaration = function (declaration) {
            if (!TypeScript.hasModifier(declaration.modifiers, 8 /* Ambient */)) {
                this.emitClass(declaration);
            } else {
                this.emitComments(declaration, true, true);
            }
        };

        Emitter.prototype.shouldEmitInterfaceDeclaration = function (declaration) {
            return true;
        };

        Emitter.prototype.emitInterfaceDeclaration = function (declaration) {
            //if (declaration.preComments() !== null) {
            //	this.emitComments(declaration, /*pre:*/ true, /*onlyPinnedOrTripleSlashComments:*/ true);
            //}
            var symbolForEmit = this.getSymbolForEmit(declaration);
            var symbol = symbolForEmit.symbol;
            var name = symbol.getDisplayName();
            var hasCallOrIndex = symbol.type.hasOwnCallSignatures() || symbol.type.hasOwnIndexSignatures();

            this.emittedInterfaceSymbols.push(symbol);

            var index = this.usedButNotEmittedInterfaces.indexOf(symbol);
            if (index >= 0) {
                this.usedButNotEmittedInterfaces.splice(index);
            }

            if (name === "String" || name === "Number" || name === "Array" || name === "Function" || TypeScript.isDTSFile(declaration.fileName())) {
                return;
            }

            var userComments = Emitter.getUserComments(declaration);

            if (hasCallOrIndex) {
                this.emitJSDocComment(Emitter.joinJSDocComments(userComments, this.getJSDocForTypedef(symbol.type)));
            } else {
                this.emitJSDocComment(Emitter.joinJSDocComments(userComments, this.getJSDocForInterfaceDeclaration(declaration)));
            }

            if (this.isNeedObfuscateName(symbol)) {
                this.writeToOutput("var ");
            }

            var svFullInterfaceName = this.thisFullInterfaceName;
            this.thisFullInterfaceName = this.getFullSymbolName(symbol);

            this.writeToOutput(this.thisFullInterfaceName);

            if (!hasCallOrIndex) {
                this.writeToOutput(" = function(){}");
            }

            this.writeToOutput(";");

            if (!hasCallOrIndex) {
                this.emitInterfaceMembers(declaration);
            }

            this.thisFullInterfaceName = svFullInterfaceName;
        };

        Emitter.prototype.emitInterfaceMembers = function (declaration) {
            var lastEmittedMember = null;
            var isFirstLine = true;
            var alreadyEmittedMethods = [];

            var members = declaration.body.typeMembers;

            var isExportedInterface = TypeScript.hasModifier(declaration.modifiers, 1 /* Exported */);

            for (var i = 0, n = members.nonSeparatorCount(); i < n; i++) {
                var memberDecl = members.nonSeparatorAt(i);

                if (memberDecl.kind() === 158 /* ConstructSignature */) {
                    continue;
                }

                var symbol = this.getSymbolForEmit(memberDecl).symbol;
                var name = symbol.getDisplayName();

                if (alreadyEmittedMethods.indexOf(name) >= 0) {
                    continue;
                }

                alreadyEmittedMethods.push(name);

                if (isFirstLine) {
                    this.writeLineToOutput('');
                    isFirstLine = false;
                }

                this.writeLineToOutput('');

                var jsDocComments = this.getJSDocForType(symbol.type);

                if (isExportedInterface && !symbol.type.isFunction()) {
                    jsDocComments.push("@expose");
                }

                this.emitInlineJSDocComment(Emitter.getUserComments(memberDecl), jsDocComments);
                this.writeToOutput(this.thisFullInterfaceName + '.prototype.' + name + ';');
                lastEmittedMember = memberDecl;
            }
        };

        Emitter.prototype.firstVariableDeclarator = function (statement) {
            return statement.declaration.declarators.nonSeparatorAt(0);
        };

        Emitter.prototype.isNotAmbientOrHasInitializer = function (variableStatement) {
            return !TypeScript.hasModifier(variableStatement.modifiers, 8 /* Ambient */) || this.firstVariableDeclarator(variableStatement).equalsValueClause !== null;
        };

        Emitter.prototype.shouldEmitVariableStatement = function (statement) {
            return statement.preComments() !== null || this.isNotAmbientOrHasInitializer(statement);
        };

        Emitter.prototype.emitVariableStatement = function (statement) {
            if (this.isNotAmbientOrHasInitializer(statement)) {
                this.emitComments(statement, true);
                this.emit(statement.declaration);
                this.writeToOutput(";");
                this.emitComments(statement, false);
            } else {
                this.emitComments(statement, true, true);
            }
        };

        Emitter.prototype.emitGenericType = function (type) {
            this.emit(type.name);
        };

        Emitter.prototype.shouldEmit = function (ast) {
            if (!ast) {
                return false;
            }

            switch (ast.kind()) {
                case 148 /* ImportDeclaration */:
                    return this.shouldEmitImportDeclaration(ast);
                case 146 /* ClassDeclaration */:
                    return this.shouldEmitClassDeclaration(ast);
                case 143 /* InterfaceDeclaration */:
                    return this.shouldEmitInterfaceDeclaration(ast);
                case 144 /* FunctionDeclaration */:
                    return this.shouldEmitFunctionDeclaration(ast);
                case 145 /* ModuleDeclaration */:
                    return this.shouldEmitModuleDeclaration(ast);
                case 163 /* VariableStatement */:
                    return this.shouldEmitVariableStatement(ast);
                case 238 /* OmittedExpression */:
                    return false;
                case 147 /* EnumDeclaration */:
                    return this.shouldEmitEnumDeclaration(ast);
            }

            return true;
        };

        Emitter.prototype.emit = function (ast) {
            if (!ast) {
                return;
            }

            switch (ast.kind()) {
                case 2 /* SeparatedList */:
                    return this.emitSeparatedList(ast);
                case 1 /* List */:
                    return this.emitList(ast);
                case 135 /* SourceUnit */:
                    return this.emitSourceUnit(ast);
                case 148 /* ImportDeclaration */:
                    return this.emitImportDeclaration(ast);
                case 149 /* ExportAssignment */:
                    return this.setExportAssignmentIdentifier(ast.identifier.text());
                case 146 /* ClassDeclaration */:
                    return this.emitClassDeclaration(ast);
                case 143 /* InterfaceDeclaration */:
                    return this.emitInterfaceDeclaration(ast);
                case 11 /* IdentifierName */:
                    return this.emitName(ast, true);
                case 240 /* VariableDeclarator */:
                    return this.emitVariableDeclarator(ast);
                case 234 /* SimpleArrowFunctionExpression */:
                    return this.emitSimpleArrowFunctionExpression(ast);
                case 233 /* ParenthesizedArrowFunctionExpression */:
                    return this.emitParenthesizedArrowFunctionExpression(ast);
                case 144 /* FunctionDeclaration */:
                    return this.emitFunctionDeclaration(ast);
                case 145 /* ModuleDeclaration */:
                    return this.emitModuleDeclaration(ast);
                case 239 /* VariableDeclaration */:
                    return this.emitVariableDeclaration(ast);
                case 141 /* GenericType */:
                    return this.emitGenericType(ast);
                case 152 /* ConstructorDeclaration */:
                    return this.emitConstructorDeclaration(ast);
                case 147 /* EnumDeclaration */:
                    return this.emitEnumDeclaration(ast);
                case 258 /* EnumElement */:
                    return this.emitEnumElement(ast);
                case 237 /* FunctionExpression */:
                    return this.emitFunctionExpression(ast);
                case 163 /* VariableStatement */:
                    return this.emitVariableStatement(ast);
            }

            this.emitComments(ast, true);
            this.emitWorker(ast);
            this.emitComments(ast, false);
        };

        Emitter.prototype.emitWorker = function (ast) {
            if (!ast) {
                return;
            }

            switch (ast.kind()) {
                case 13 /* NumericLiteral */:
                    return this.emitNumericLiteral(ast);
                case 12 /* RegularExpressionLiteral */:
                    return this.emitRegularExpressionLiteral(ast);
                case 14 /* StringLiteral */:
                    return this.emitStringLiteral(ast);
                case 24 /* FalseKeyword */:
                case 32 /* NullKeyword */:
                case 37 /* TrueKeyword */:
                    return this.emitLiteralExpression(ast);
                case 35 /* ThisKeyword */:
                    return this.emitThisExpression(ast);
                case 50 /* SuperKeyword */:
                    return this.emitSuperExpression(ast);
                case 232 /* ParenthesizedExpression */:
                    return this.emitParenthesizedExpression(ast);
                case 229 /* ArrayLiteralExpression */:
                    return this.emitArrayLiteralExpression(ast);
                case 226 /* PostDecrementExpression */:
                case 225 /* PostIncrementExpression */:
                    return this.emitPostfixUnaryExpression(ast);
                case 182 /* LogicalNotExpression */:
                case 181 /* BitwiseNotExpression */:
                case 180 /* NegateExpression */:
                case 179 /* PlusExpression */:
                case 183 /* PreIncrementExpression */:
                case 184 /* PreDecrementExpression */:
                    return this.emitPrefixUnaryExpression(ast);
                case 228 /* InvocationExpression */:
                    return this.emitInvocationExpression(ast);
                case 236 /* ElementAccessExpression */:
                    return this.emitElementAccessExpression(ast);
                case 227 /* MemberAccessExpression */:
                    return this.emitMemberAccessExpression(ast);
                case 136 /* QualifiedName */:
                    return this.emitQualifiedName(ast);
                case 188 /* CommaExpression */:
                case 189 /* AssignmentExpression */:
                case 190 /* AddAssignmentExpression */:
                case 191 /* SubtractAssignmentExpression */:
                case 192 /* MultiplyAssignmentExpression */:
                case 193 /* DivideAssignmentExpression */:
                case 194 /* ModuloAssignmentExpression */:
                case 195 /* AndAssignmentExpression */:
                case 196 /* ExclusiveOrAssignmentExpression */:
                case 197 /* OrAssignmentExpression */:
                case 198 /* LeftShiftAssignmentExpression */:
                case 199 /* SignedRightShiftAssignmentExpression */:
                case 200 /* UnsignedRightShiftAssignmentExpression */:
                case 202 /* LogicalOrExpression */:
                case 203 /* LogicalAndExpression */:
                case 204 /* BitwiseOrExpression */:
                case 205 /* BitwiseExclusiveOrExpression */:
                case 206 /* BitwiseAndExpression */:
                case 207 /* EqualsWithTypeConversionExpression */:
                case 208 /* NotEqualsWithTypeConversionExpression */:
                case 209 /* EqualsExpression */:
                case 210 /* NotEqualsExpression */:
                case 211 /* LessThanExpression */:
                case 212 /* GreaterThanExpression */:
                case 213 /* LessThanOrEqualExpression */:
                case 214 /* GreaterThanOrEqualExpression */:
                case 215 /* InstanceOfExpression */:
                case 216 /* InExpression */:
                case 217 /* LeftShiftExpression */:
                case 218 /* SignedRightShiftExpression */:
                case 219 /* UnsignedRightShiftExpression */:
                case 220 /* MultiplyExpression */:
                case 221 /* DivideExpression */:
                case 222 /* ModuloExpression */:
                case 223 /* AddExpression */:
                case 224 /* SubtractExpression */:
                    return this.emitBinaryExpression(ast);
                case 201 /* ConditionalExpression */:
                    return this.emitConditionalExpression(ast);
                case 247 /* EqualsValueClause */:
                    return this.emitEqualsValueClause(ast);
                case 257 /* Parameter */:
                    return this.emitParameter(ast);
                case 161 /* Block */:
                    return this.emitBlock(ast);
                case 250 /* ElseClause */:
                    return this.emitElseClause(ast);
                case 162 /* IfStatement */:
                    return this.emitIfStatement(ast);
                case 164 /* ExpressionStatement */:
                    return this.emitExpressionStatement(ast);
                case 154 /* GetAccessor */:
                    return this.emitGetAccessor(ast);
                case 155 /* SetAccessor */:
                    return this.emitSetAccessor(ast);
                case 172 /* ThrowStatement */:
                    return this.emitThrowStatement(ast);
                case 165 /* ReturnStatement */:
                    return this.emitReturnStatement(ast);
                case 231 /* ObjectCreationExpression */:
                    return this.emitObjectCreationExpression(ast);
                case 166 /* SwitchStatement */:
                    return this.emitSwitchStatement(ast);
                case 248 /* CaseSwitchClause */:
                    return this.emitCaseSwitchClause(ast);
                case 249 /* DefaultSwitchClause */:
                    return this.emitDefaultSwitchClause(ast);
                case 167 /* BreakStatement */:
                    return this.emitBreakStatement(ast);
                case 168 /* ContinueStatement */:
                    return this.emitContinueStatement(ast);
                case 169 /* ForStatement */:
                    return this.emitForStatement(ast);
                case 170 /* ForInStatement */:
                    return this.emitForInStatement(ast);
                case 173 /* WhileStatement */:
                    return this.emitWhileStatement(ast);
                case 178 /* WithStatement */:
                    return this.emitWithStatement(ast);
                case 235 /* CastExpression */:
                    return this.emitCastExpression(ast);
                case 230 /* ObjectLiteralExpression */:
                    return this.emitObjectLiteralExpression(ast);
                case 255 /* SimplePropertyAssignment */:
                    return this.emitSimplePropertyAssignment(ast);
                case 256 /* FunctionPropertyAssignment */:
                    return this.emitFunctionPropertyAssignment(ast);
                case 171 /* EmptyStatement */:
                    return this.writeToOutputWithSourceMapRecord(";", ast);
                case 174 /* TryStatement */:
                    return this.emitTryStatement(ast);
                case 251 /* CatchClause */:
                    return this.emitCatchClause(ast);
                case 252 /* FinallyClause */:
                    return this.emitFinallyClause(ast);
                case 175 /* LabeledStatement */:
                    return this.emitLabeledStatement(ast);
                case 176 /* DoStatement */:
                    return this.emitDoStatement(ast);
                case 186 /* TypeOfExpression */:
                    return this.emitTypeOfExpression(ast);
                case 185 /* DeleteExpression */:
                    return this.emitDeleteExpression(ast);
                case 187 /* VoidExpression */:
                    return this.emitVoidExpression(ast);
                case 177 /* DebuggerStatement */:
                    return this.emitDebuggerStatement(ast);
            }
        };

        Emitter.prototype.isNeedObfuscateName = function (symbol) {
            return TypeScript.PullHelpers.symbolIsModule(symbol.getContainer()) && !symbol.anyDeclHasFlag(1 /* Exported */) && !symbol.isPrimitive();
        };

        Emitter.prototype.getObfuscatedName = function (symbol, origName) {
            if (!this.isNeedObfuscateName(symbol)) {
                return origName;
            }

            var findIndex = this.obfuscatedSymbolList.indexOf(symbol);
            var obfusctatedName = "";

            if (findIndex < 0) {
                this.obfuscatedSymbolList.push(symbol);
                obfusctatedName = this.obfuscatedSymbolNameMap[this.obfuscatedSymbolList.length - 1] = "$$_" + origName + "_" + (this.obfuscatorCounter++) + "_$$";
            } else {
                obfusctatedName = this.obfuscatedSymbolNameMap[findIndex];
            }

            return obfusctatedName;
        };

        Emitter.getUserComments = function (node) {
            var comments = node.preComments();
            if (comments === null) {
                return [];
            }
            return Emitter.EMPTY_STRING_LIST.concat(comments.map(function (comment) {
                return comment.fullText().split('\n');
            })).map(function (line) {
                return (line + '').replace(/^\/\/\s?/, '');
            });
        };

        Emitter.joinJSDocComments = function (first, second) {
            return first.concat(first.length && second.length ? [''] : Emitter.EMPTY_STRING_LIST, second);
        };

        Emitter.stripOffArrayType = function (type) {
            return type.replace(/^Array\.<(.*)>$/, '$1');
        };

        Emitter.prototype.getFullSymbolNameForAST = function (ast) {
            return this.getFullSymbolName(this.getSymbolForEmit(ast).symbol);
        };

        Emitter.prototype.getFullSymbolName = function (symbol) {
            var correctSymbol = symbol;

            if (correctSymbol.isTypeReference()) {
                correctSymbol = correctSymbol.referencedTypeSymbol;
            }

            if (correctSymbol.isType() && !correctSymbol.isInterface() && !correctSymbol.isPrimitive()) {
                if (!correctSymbol.type.isEnum()) {
                    if (correctSymbol.type.isAlias()) {
                        correctSymbol = correctSymbol.type.assignedType();
                    }

                    correctSymbol = correctSymbol.type.getConstructorMethod();
                }
            }

            var moduleName = "";
            if (!this.isNeedObfuscateName(correctSymbol) && correctSymbol.getContainer() !== null && !correctSymbol.isPrimitive()) {
                moduleName = correctSymbol.getContainer().fullName() + ".";
            }

            var symbolName = this.getObfuscatedName(correctSymbol, correctSymbol.getDisplayName());

            if (correctSymbol.isInterface() && this.emittedInterfaceSymbols.indexOf(correctSymbol) < 0) {
                this.usedButNotEmittedInterfaces.push(correctSymbol);
            }

            return moduleName + symbolName;
        };

        Emitter.prototype.getFullSymbolNameType = function (symbol) {
            var baseName = this.getFullSymbolName(symbol);
            var baseType = symbol.isTypeReference() ? symbol : symbol.type;

            if (baseType.isGeneric()) {
                var genericPart = "";
                var typeParameters = baseType.getTypeArgumentsOrTypeParameters();

                if (typeParameters) {
                    genericPart = ".<";

                    for (var i = 0; i < typeParameters.length; i++) {
                        var param = typeParameters[i];
                        genericPart += this.formatJSDocType(param);

                        if (i < typeParameters.length - 1) {
                            genericPart += ", ";
                        }
                    }

                    genericPart += ">";
                }
                baseName += genericPart;
            }

            return baseName;
        };

        Emitter.prototype.getJSDocForInterfaceDeclaration = function (interfaceDecl) {
            return ['@interface'].concat(this.getJSDocForExtends(interfaceDecl.heritageClauses), this.getJSDocForTemplatesForAST(interfaceDecl));
        };

        Emitter.prototype.getJSDocForTemplatesForAST = function (ast) {
            return this.getJSDocForTemplates(this.semanticInfoChain.getSymbolForAST(ast).type);
        };

        Emitter.prototype.getJSDocForTemplates = function (typeOrSignature) {
            var type = typeOrSignature;

            if (!type.isGeneric()) {
                return "";
            }

            var typeParameters = type.getTypeParameters();

            if (typeParameters && typeParameters.length === 0) {
                return "";
            }

            return "@template " + typeParameters.map(function (param) {
                return param.getDisplayName();
            }).join(", ");
        };

        Emitter.prototype.getJSDocForClass = function (classDecl) {
            var constrDecl = getLastConstructor(classDecl);
            var jsDocForParams = Emitter.EMPTY_STRING_LIST;

            if (constrDecl) {
                var constrSignatures = this.semanticInfoChain.getSymbolForAST(constrDecl).type.getConstructSignatures();
                var parameters = constrSignatures[constrSignatures.length - 1].parameters;
                jsDocForParams = this.getJSDocForArguments(parameters);
            }

            return ['@constructor', '@struct', TypeScript.hasModifier(classDecl.modifiers, 268435456 /* Final */) ? '@final' : ''].concat(this.getJSDocForExtends(classDecl.heritageClauses), this.getJSDocForImplements(classDecl.heritageClauses), this.getJSDocForTemplatesForAST(classDecl), jsDocForParams);
        };

        Emitter.prototype.getJSDocForFunctionDeclaration = function (memberOrFuncDecl) {
            var jsDocComments = [];

            var funcDecl = memberOrFuncDecl;
            var symbol = this.semanticInfoChain.getSymbolForAST(funcDecl);
            var callSignatures = symbol.type.getCallSignatures();
            var signature = callSignatures[callSignatures.length - 1];

            var isClassMember = funcDecl.kind() === 150 /* MemberFunctionDeclaration */;

            if (isClassMember) {
                var isFinalClass = TypeScript.hasModifier(this.thisClassNode.modifiers, 268435456 /* Final */);
                var isExportedClass = TypeScript.hasModifier(this.thisClassNode.modifiers, 1 /* Exported */);
                var isFinalMethod = TypeScript.hasModifier(funcDecl.modifiers, 268435456 /* Final */);
                var isPrivate = TypeScript.hasModifier(funcDecl.modifiers, 2 /* Private */);
                var isProtected = TypeScript.hasModifier(funcDecl.modifiers, 134217728 /* Protected */);

                if (!isFinalClass && !isFinalMethod && isExportedClass && !isPrivate) {
                    jsDocComments.push("@expose");
                } else if (isFinalMethod) {
                    jsDocComments.push("@final");
                }

                if (isProtected) {
                    jsDocComments.push("@protected");
                }

                if (isPrivate) {
                    jsDocComments.push("private");
                }
            }

            if (callSignatures.length === 1) {
                jsDocComments = jsDocComments.concat(this.getJSDocForArguments(signature.parameters).concat(signature.returnType !== null && signature.returnType.getTypeName() !== 'void' ? this.getJSDocForReturnType(signature.returnType) : Emitter.EMPTY_STRING_LIST));

                var templates = this.getJSDocForTemplates(signature);

                if (templates !== "") {
                    jsDocComments.push(templates);
                }
            } else {
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
        };

        Emitter.prototype.getJSDocForArguments = function (symbols) {
            var _this = this;
            return symbols.map(function (symbol) {
                var type = _this.formatJSDocType(symbol.type);

                if (symbol.isVarArg) {
                    return '@param {...' + Emitter.stripOffArrayType(type) + '} ' + symbol.getDisplayName();
                }

                if (symbol.isOptional) {
                    type += '=';
                }

                return '@param {' + type + '} ' + symbol.getDisplayName();
            });
        };

        Emitter.prototype.getJSDocForImplements = function (herigateList) {
            var implementsClause = TypeScript.getImplementsHeritageClause(herigateList);

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
        };

        Emitter.prototype.getJSDocForExtends = function (herigateList) {
            var extendsClause = TypeScript.getExtendsHeritageClause(herigateList);

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
        };

        Emitter.prototype.emitJSDocComment = function (lines) {
            var _this = this;
            if (lines.length === 0)
                return;
            lines = ['/**'].concat(lines.map(function (line) {
                return ' ' + ('* ' + line.replace(/\*\//g, '* /')).trim();
            }), [' */']);
            lines.forEach(function (line, i) {
                if (i)
                    _this.emitIndent();
                _this.writeLineToOutput(line);
            });
            this.emitIndent();
        };

        Emitter.prototype.emitInlineJSDocComment = function (user, jsDoc) {
            if (arguments.length === 1) {
                this.writeToOutput('/** ' + arguments[0].join(' ') + ' */ ');
            } else if (user.length === 0) {
                this.writeToOutput('/** ' + jsDoc.join(' ') + ' */ ');
            } else {
                this.emitJSDocComment(Emitter.joinJSDocComments(user, jsDoc));
            }
        };

        Emitter.prototype.getJSDocForTypedef = function (type) {
            /** Need for change typeParameter to ?, because templates are not support in @typedef in closure*/
            var svIsBlockTemplate = this.isTypeParametersEmitBlocked;
            this.isTypeParametersEmitBlocked = true;
            var result = ['@typedef {' + this.formatJSDocType(type, true) + '}'];
            this.isTypeParametersEmitBlocked = svIsBlockTemplate;

            return result;
        };

        Emitter.prototype.getJSDocForType = function (type) {
            return ['@type {' + this.formatJSDocType(type) + '}'];
        };

        Emitter.prototype.getJSDocForReturnType = function (returnType) {
            return ['@returns {' + this.formatJSDocType(returnType) + '}'];
        };

        Emitter.prototype.getJSDocForEnumDeclaration = function (enumDecl) {
            return ['@enum {number}'];
        };

        Emitter.prototype.getJSDocForVariableDeclaration = function (symbol) {
            var svIsBlockTemplate = this.isTypeParametersEmitBlocked;
            this.isTypeParametersEmitBlocked = true;
            var result = this.getJSDocForType(symbol.type);
            this.isTypeParametersEmitBlocked = svIsBlockTemplate;

            return result;
        };

        Emitter.prototype.getJSDocForClassMemberVariable = function (symbol) {
            var jsDocComments = this.getJSDocForVariableDeclaration(symbol);
            var isClassExports = TypeScript.hasModifier(this.thisClassNode.modifiers, 1 /* Exported */);

            if (symbol.anyDeclHasFlag(134217728 /* Protected */)) {
                jsDocComments.push("@protected");
            } else if (symbol.anyDeclHasFlag(4 /* Public */)) {
                jsDocComments.push("@public");

                if (isClassExports) {
                    jsDocComments.push("@expose");
                }
            } else if (symbol.anyDeclHasFlag(2 /* Private */)) {
                jsDocComments.push("@private");
            }

            return jsDocComments;
        };

        Emitter.prototype.formatJSDocType = function (type, ignoreName) {
            if (typeof ignoreName === "undefined") { ignoreName = false; }
            var _this = this;
            // Google Closure Compiler's type system is not powerful enough to work
            // with type parameters, especially type parameters with constraints
            if (type.isTypeParameter() && this.isTypeParametersEmitBlocked) {
                return '?';
            } else if (type.isTypeParameter()) {
                return type.getDisplayName();
            }

            // Simple types
            if (type.isNamedTypeSymbol() && ignoreName === false) {
                var name = this.getFullSymbolNameType(type);
                if (name === 'any')
                    return '?';
                if (name === 'void')
                    return 'undefined';
                if (name === 'Boolean')
                    return '?boolean';
                if (name === 'Number')
                    return '?number';
                if (name === 'String')
                    return 'string';

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
            if (type.kind & (8388608 /* ObjectType */ | 16 /* Interface */ | 16777216 /* FunctionType */) && type.hasOwnCallSignatures()) {
                return this.formatJSDocUnionType(type.getCallSignatures().map(function (signature) {
                    return '?function(' + signature.parameters.map(function (arg) {
                        return _this.formatJSDocArgumentType(arg);
                    }).join(', ') + ')' + ((signature.returnType !== null && signature.returnType.getTypeName() !== 'void') ? (': ' + _this.formatJSDocType(signature.returnType)) : '');
                }));
            }

            // Constructor types
            if (type.kind & 33554432 /* ConstructorType */ && type.getConstructSignatures().length > 0) {
                return this.formatJSDocUnionType(type.getConstructSignatures().map(function (signature) {
                    return '?function(' + (signature.returnType !== null && signature.returnType.getTypeName() !== 'void' ? ['new:' + _this.formatJSDocType(signature.returnType)] : Emitter.EMPTY_STRING_LIST).concat(signature.parameters.map(function (arg) {
                        return _this.formatJSDocArgumentType(arg);
                    })).join(', ') + ')';
                }));
            }

            // Map types
            if (type.kind & (8388608 /* ObjectType */ | 16 /* Interface */) && type.getIndexSignatures().length > 0) {
                return this.formatJSDocUnionType(type.getIndexSignatures().map(function (signature) {
                    return 'Object.<' + _this.formatJSDocType(signature.parameters[0].type) + ', ' + _this.formatJSDocType(signature.returnType) + '>';
                }));
            }

            // Object types and interfaces
            if (type.kind & (8388608 /* ObjectType */ | 16 /* Interface */)) {
                if (type.getMembers().length === 0) {
                    return '?Object';
                }
                if (type.getMembers().some(function (member) {
                    return /[^A-Za-z0-9_$]/.test(member.getDisplayName());
                })) {
                    return '?';
                }
                return '?{ ' + type.getMembers().map(function (member) {
                    return member.getDisplayName() + ': ' + _this.formatJSDocType(member.type);
                }).join(', ') + ' }';
            }

            // Arrays
            if (type.isArrayNamedTypeReference()) {
                return 'Array.<' + this.formatJSDocType(type.getTypeArguments()[0]) + '>';
            }

            throw new Error(TypeScript.PullElementKind[type.kind] + ' types like "' + type.getTypeName() + '" are not supported');
        };

        Emitter.prototype.formatJSDocUnionType = function (parts) {
            return parts.length === 1 ? parts[0] : '(' + parts.join('|') + ')';
        };

        Emitter.prototype.formatJSDocArgumentType = function (arg) {
            return arg.isVarArg ? '...[' + Emitter.stripOffArrayType(this.formatJSDocType(arg.type)) + ']' : (this.formatJSDocType(arg.type) + (arg.isOptional ? "=" : ""));
        };

        Emitter.prototype.tryGetEnumValue = function (pullSymbol) {
            if (pullSymbol.kind === 67108864 /* EnumMember */) {
                var pullDecls = pullSymbol.getDeclarations();
                if (pullDecls.length === 1) {
                    var pullDecl = pullDecls[0];
                    if (pullDecl.kind === 67108864 /* EnumMember */) {
                        var value = pullDecl.constantValue;
                        return value;
                    }
                }
            }

            return null;
        };

        Emitter.prototype.getFunctionDeclarationSignature = function (funcDecl) {
            var type = this.semanticInfoChain.getSymbolForAST(funcDecl).type;

            //var signaturesCount = type.getCallSignatures().length;
            //var signature: PullSignatureSymbol = (signaturesCount > 0) ? type.getCallSignatures()[signaturesCount - 1] : type.getConstructSignatures()[0];
            var signature = type.getCallSignatures().concat(type.getConstructSignatures())[0];

            //if (signature.parameters.length !== funcDecl.callSignature.parameterList.parameters.nonSeparatorCount()) {
            //	//console.log(funcDecl.name.text(), signature.parameters.length, funcDecl.arguments.members.length);
            //	//throw new Error('Internal error');
            //}
            return signature;
        };
        Emitter.EMPTY_STRING_LIST = [];
        return Emitter;
    })();
    TypeScript.Emitter = Emitter;

    function getLastConstructor(classDecl) {
        return classDecl.classElements.lastOrDefault(function (e) {
            return e.kind() === 152 /* ConstructorDeclaration */;
        });
    }
    TypeScript.getLastConstructor = getLastConstructor;

    function getTrimmedTextLines(comment) {
        if (comment.kind() === 6 /* MultiLineCommentTrivia */) {
            return comment.fullText().split("\n").map(function (s) {
                return s.trim();
            });
        } else {
            return [comment.fullText().trim()];
        }
    }
    TypeScript.getTrimmedTextLines = getTrimmedTextLines;
})(TypeScript || (TypeScript = {}));
