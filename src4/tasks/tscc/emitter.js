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
var TypeScript;
(function (TypeScript) {
    var IgnoreName;
    (function (IgnoreName) {
        IgnoreName[IgnoreName["NO"] = 0] = "NO";
        IgnoreName[IgnoreName["YES"] = 1] = "YES";
    })(IgnoreName || (IgnoreName = {}));

    var ShouldMangle;
    (function (ShouldMangle) {
        ShouldMangle[ShouldMangle["NO"] = 0] = "NO";
        ShouldMangle[ShouldMangle["YES"] = 1] = "YES";
    })(ShouldMangle || (ShouldMangle = {}));

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
            this.container = EmitContainer.Prog;
        }
        return EmitState;
    })();
    TypeScript.EmitState = EmitState;

    var EmitOptions = (function () {
        function EmitOptions(compilationSettings) {
            this.compilationSettings = compilationSettings;
            this.ioHost = null;
            this.outputMany = true;
            this.commonDirectoryPath = "";
        }
        EmitOptions.prototype.mapOutputFileName = function (document, extensionChanger) {
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
        };

        EmitOptions.prototype.decodeSourceMapOptions = function (document, jsFilePath, oldSourceMapSourceInfo) {
            var sourceMapSourceInfo = new TypeScript.SourceMapSourceInfo(oldSourceMapSourceInfo);

            var tsFilePath = TypeScript.switchToForwardSlashes(document.fileName);

            if (!oldSourceMapSourceInfo) {
                // Js File Name = pretty name of js file
                var prettyJsFileName = TypeScript.getPrettyName(jsFilePath, false, true);
                var prettyMapFileName = prettyJsFileName + TypeScript.SourceMapper.MapFileExtension;
                sourceMapSourceInfo.jsFileName = prettyJsFileName;

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
        Indenter.indentStepString = "  ";
        Indenter.indentStrings = [];
        return Indenter;
    })();
    TypeScript.Indenter = Indenter;

    var Emitter = (function () {
        function Emitter(emittingFileName, outfile, emitOptions, semanticInfoChain) {
            this.emittingFileName = emittingFileName;
            this.outfile = outfile;
            this.emitOptions = emitOptions;
            this.semanticInfoChain = semanticInfoChain;
            this.extendsPrologueEmitted = false;
            this.thisBaseName = null;
            this.thisClassNode = null;
            this.thisFunctionDeclaration = null;
            this.emitState = new EmitState();
            this.indenter = new Indenter();
            this.allSourceMappers = [];
            this.sourceMapper = null;
            this.captureThisStmtString = "var _this = this;";
            this.resolvingContext = new TypeScript.PullTypeResolutionContext();
            this.emittedModuleNames = [];
            this.emittedSymbolNames = {};
            this.document = null;
            this.copyrightElement = null;
            this._emitForExportEnum = false;
            this._emitGlobal = true;
            TypeScript.globalSemanticInfoChain = semanticInfoChain;
            TypeScript.globalBinder.semanticInfoChain = semanticInfoChain;
        }
        Emitter.prototype.setExportAssignmentIdentifier = function (id) {
            // Export assignments are ignored
        };

        Emitter.prototype.setDocument = function (document) {
            this.document = document;
        };

        Emitter.prototype.emitImportDeclaration = function (importDeclAST) {
        };

        Emitter.prototype.setSourceMappings = function (mapper) {
            this.allSourceMappers.push(mapper);
            this.sourceMapper = mapper;
        };

        Emitter.prototype.updateLineAndColumn = function (s) {
            var lineNumbers = TypeScript.TextUtilities.parseLineStarts(TypeScript.TextFactory.createText(s));
            if (lineNumbers.length > 1) {
                // There are new lines in the string, update the line and column number accordingly
                this.emitState.line += lineNumbers.length - 1;
                this.emitState.column = s.length - lineNumbers[lineNumbers.length - 1];
            } else {
                // No new lines in the string
                this.emitState.column += s.length;
            }
        };

        Emitter.prototype.writeToOutput = function (s) {
            this.outfile.Write(s);
            this.updateLineAndColumn(s);
        };

        Emitter.prototype.writeToOutputTrimmable = function (s) {
            this.writeToOutput(s);
        };

        Emitter.prototype.writeLineToOutput = function (s) {
            this.outfile.WriteLine(s);
            this.updateLineAndColumn(s);
            this.emitState.column = 0;
            this.emitState.line++;
        };

        Emitter.prototype.writeCaptureThisStatement = function (ast) {
            this.emitIndent();
            this.recordSourceMappingStart(ast);
            this.writeToOutput(this.captureThisStmtString);
            this.recordSourceMappingEnd(ast);
            this.writeLineToOutput("");
        };

        Emitter.prototype.setInVarBlock = function (count) {
            // Not used by the modified emitter code
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

        Emitter.prototype.emitComment = function (comment) {
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
            } else {
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
        };

        Emitter.prototype.emitComments = function (ast, pre) {
            var comments;
            if (pre) {
                var preComments = ast.preComments();
                if (preComments && ast === this.copyrightElement) {
                    // We're emitting the comments for the first script element.  Skip any
                    // copyright comments, as we'll already have emitted those.
                    var copyrightComments = this.getCopyrightComments();
                    comments = preComments.slice(copyrightComments.length);
                } else {
                    comments = preComments;
                }
            } else {
                comments = ast.postComments();
            }

            this.emitCommentsArray(comments);
        };

        Emitter.prototype.emitCommentsArray = function (comments) {
            if (!this.emitOptions.compilationSettings.removeComments && comments) {
                for (var i = 0, n = comments.length; i < n; i++) {
                    this.emitComment(comments[i]);
                }
            }
        };

        Emitter.prototype.emitObjectLiteral = function (objectLiteral) {
            var useNewLines = !TypeScript.hasFlag(objectLiteral.getFlags(), TypeScript.ASTFlags.SingleLine);

            this.writeToOutput("{");
            var list = objectLiteral.operand;
            if (list.members.length > 0) {
                if (useNewLines) {
                    this.writeLineToOutput("");
                } else {
                    this.writeToOutput(" ");
                }

                this.indenter.increaseIndent();
                this.emitCommaSeparatedList(list, useNewLines);
                this.indenter.decreaseIndent();
                if (useNewLines) {
                    this.emitIndent();
                } else {
                    this.writeToOutput(" ");
                }
            }
            this.writeToOutput("}");
        };

        Emitter.prototype.emitArrayLiteral = function (arrayLiteral) {
            var useNewLines = !TypeScript.hasFlag(arrayLiteral.getFlags(), TypeScript.ASTFlags.SingleLine);

            this.writeToOutput("[");
            var list = arrayLiteral.operand;
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
        };

        Emitter.prototype.emitNew = function (objectCreationExpression, target, args) {
            this.writeToOutput("new ");
            if (target.nodeType() === TypeScript.NodeType.TypeRef) {
                var typeRef = target;
                if (typeRef.arrayCount) {
                    this.writeToOutput("Array()");
                } else {
                    typeRef.term.emit(this);
                    this.writeToOutput("()");
                }
            } else {
                target.emit(this);
                this.recordSourceMappingStart(args);
                this.writeToOutput("(");
                this.emitCommaSeparatedList(args);
                this.recordSourceMappingStart(objectCreationExpression.closeParenSpan);
                this.writeToOutput(")");
                this.recordSourceMappingEnd(objectCreationExpression.closeParenSpan);
                this.recordSourceMappingEnd(args);
            }
        };

        // Enum constants are handled by Google Closure Compiler
        Emitter.prototype.tryEmitConstant = function (dotExpr) {
            return false;
        };

        Emitter.prototype.emitCall = function (callNode, target, args) {
            if (this.emitSuperCall(callNode)) {
                return;
            }

            // Check if the target needs a cast because it has a more specific call
            // signature than the default one like document.createElement('canvas')
            var returnType = this.getSymbolForAST(callNode);
            var symbol = this.getSymbolForAST(callNode.target);
            var emitCast = returnType !== null && symbol !== null && symbol.type.getCallSignatures().length > 1 && returnType.getTypeName() !== 'void';
            if (emitCast) {
                this.emitInlineJSDocComment([], Emitter.getJSDocForType(returnType.type));
                this.writeToOutput('(');
            }
            if (target.nodeType() === TypeScript.NodeType.FunctionDeclaration) {
                this.writeToOutput("(");
            }
            if (callNode.target.nodeType() === TypeScript.NodeType.SuperExpression && this.emitState.container === EmitContainer.Constructor) {
                this.writeToOutput(this.thisBaseName + ".call");
            } else {
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
        };

        Emitter.prototype.emitInnerFunction = function (funcDecl, printName, includePreComments, isFunctionExpression) {
            if (typeof includePreComments === "undefined") { includePreComments = true; }
            if (typeof isFunctionExpression === "undefined") { isFunctionExpression = false; }
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
            var needSemicolon = false;

            if (funcDecl.isConstructor) {
                this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(this.thisClassNode), Emitter.joinJSDocComments(Emitter.getUserComments(funcDecl), this.getJSDocForFunctionDeclaration(funcDecl))));
                this.emitFullSymbolVariableStatement(this.getSymbolForAST(this.thisClassNode));
                this.writeToOutput(' = ');
                needSemicolon = true;
            } else if (printName && !isFunctionExpression) {
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
                    var arg = funcDecl.arguments.members[i];

                    //arg.emit(this);
                    this.writeToOutput(arg.id.actualText);

                    if (i < (printLen - 1)) {
                        this.writeToOutput(", ");
                    }
                }

                if (funcDecl.variableArgList) {
                    var arg = funcDecl.arguments.members[printLen];
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
                } else {
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
        };

        Emitter.prototype.emitDefaultValueAssignments = function (funcDecl) {
            var parameters = this.getFunctionDeclarationSignature(funcDecl).parameters;
            var n = funcDecl.arguments.members.length;
            if (funcDecl.variableArgList) {
                n--;
            }

            for (var i = 0; i < n; i++) {
                var arg = funcDecl.arguments.members[i];
                if (arg.init) {
                    var mangled = Emitter.mangleSymbolName(parameters[i]);
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
        };

        Emitter.prototype.emitRestParameterInitializer = function (funcDecl) {
            if (funcDecl.variableArgList) {
                var n = funcDecl.arguments.members.length;
                var lastArg = funcDecl.arguments.members[n - 1];
                var symbol = this.getSymbolForAST(lastArg);
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
        };

        Emitter.prototype.shouldCaptureThis = function (ast) {
            var decl = this.getDeclForAST(ast);
            if (decl) {
                return (decl.flags & TypeScript.PullElementFlags.MustCaptureThis) === TypeScript.PullElementFlags.MustCaptureThis;
            }

            return false;
        };

        Emitter.prototype.emitModule = function (moduleDecl) {
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
            } else {
                var symbol = this.getSymbolForAST(moduleDecl);
                var name = Emitter.getFullSymbolName(symbol);

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

                if (!isWholeFile)
                    this.recordSourceMappingNameStart(moduleName);
                this.emitModuleElements(moduleDecl.members, true, skipFirstLine);
                if (!isWholeFile)
                    this.recordSourceMappingNameEnd();
            }

            this.recordSourceMappingEnd(moduleDecl);
            this.setContainer(temp);
        };

        Emitter.prototype.emitEnumElement = function (varDecl) {
            this.emitComments(varDecl, true);
            this.recordSourceMappingStart(varDecl);
            if (this._emitForExportEnum) {
                this.writeToOutput("\"" + Emitter.mangleSymbolName(this.getSymbolForAST(varDecl)) + '\": ');
            } else {
                this.writeToOutput(Emitter.mangleSymbolName(this.getSymbolForAST(varDecl)) + ': ');
            }

            if (varDecl.init !== null) {
                varDecl.init.emit(this);
            } else if (varDecl.constantValue !== null) {
                this.writeToOutput(varDecl.constantValue.toString());
            } else {
                this.writeToOutput("null");
            }

            this.recordSourceMappingEnd(varDecl);
            this.emitComments(varDecl, false);
        };

        Emitter.prototype.emitIndex = function (operand1, operand2) {
            operand1.emit(this);
            this.writeToOutput("[");
            operand2.emit(this);
            this.writeToOutput("]");
        };

        Emitter.prototype.emitFunction = function (funcDecl) {
            if (TypeScript.hasFlag(funcDecl.getFunctionFlags(), TypeScript.FunctionFlags.Signature)) {
                return;
            }
            var temp;
            var tempFnc = this.thisFunctionDeclaration;
            this.thisFunctionDeclaration = funcDecl;

            if (funcDecl.isConstructor) {
                temp = this.setContainer(EmitContainer.Constructor);
            } else {
                temp = this.setContainer(EmitContainer.Function);
            }

            var funcName = funcDecl.getNameText();

            if (temp !== EmitContainer.Constructor || (funcDecl.getFunctionFlags() & TypeScript.FunctionFlags.Method) === TypeScript.FunctionFlags.None) {
                var isFunctionExpression = TypeScript.hasFlag(funcDecl.getFunctionFlags(), TypeScript.FunctionFlags.IsFunctionExpression);
                this.recordSourceMappingStart(funcDecl);
                this.emitInnerFunction(funcDecl, funcDecl.name && !funcDecl.name.isMissing(), false, isFunctionExpression);
            }
            this.setContainer(temp);
            this.thisFunctionDeclaration = tempFnc;

            var symbol = this.getSymbolForAST(funcDecl);

            if (TypeScript.hasFlag(funcDecl.getFunctionFlags(), TypeScript.FunctionFlags.Exported)) {
                this.exportSymbol(symbol);
            }
        };

        Emitter.prototype.emitAmbientVarDecl = function (varDecl) {
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
        };

        Emitter.prototype.emitVariableDeclaration = function (declaration) {
            for (var i = 0, n = declaration.declarators.members.length; i < n; i++) {
                if (i > 0) {
                    this.writeLineToOutput('');
                    this.emitIndent();
                }
                declaration.declarators.members[i].emit(this);
            }
        };

        Emitter.prototype.emitVariableDeclarator = function (varDecl) {
            var symbol = this.getSymbolForAST(varDecl);
            var parentSymbol = symbol ? symbol.getContainer() : null;
            var parentKind = parentSymbol ? parentSymbol.kind : TypeScript.PullElementKind.None;
            var hasInitializer = varDecl.init !== null;

            var isExported = TypeScript.hasFlag(varDecl.getVarFlags(), TypeScript.VariableFlags.Exported);

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
                var jsDocComments = this.getJSDocForVariableDeclaration(varDecl);
                if (parentKind === TypeScript.PullElementKind.Class && this.emitState.container !== EmitContainer.Args) {
                    if (TypeScript.hasFlag(varDecl.getVarFlags(), TypeScript.VariableFlags.Public)) {
                        jsDocComments.push("@expose");
                    }

                    if (TypeScript.hasFlag(varDecl.getVarFlags(), TypeScript.VariableFlags.Protected)) {
                        jsDocComments.push("@protected");
                    } else if (TypeScript.hasFlag(varDecl.getVarFlags(), TypeScript.VariableFlags.Private)) {
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

            if (!isAdditionalDeclaration && isExported) {
                this.exportSymbol(symbol);
            }
        };

        Emitter.prototype.emitName = function (name, isNotMemberAccess) {
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
        };

        Emitter.prototype.recordSourceMappingNameStart = function (name) {
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
            }
        };

        // Note: may throw exception.
        Emitter.prototype.emitSourceMapsAndClose = function () {
            if (this.sourceMapper !== null) {
                TypeScript.SourceMapper.emitSourceMapping(this.allSourceMappers);
            }

            try  {
                this.outfile.Close();
            } catch (e) {
                Emitter.throwEmitterError(e);
            }
        };

        Emitter.prototype.emitParameterPropertyAndMemberVariableAssignments = function () {
            // emit any parameter properties first
            var constructorDecl = this.thisClassNode.constructorDecl;

            if (constructorDecl && constructorDecl.arguments) {
                var parameters = this.getFunctionDeclarationSignature(constructorDecl).parameters;
                for (var i = 0, n = constructorDecl.arguments.members.length; i < n; i++) {
                    var arg = constructorDecl.arguments.members[i];
                    if ((arg.getVarFlags() & TypeScript.VariableFlags.Property) !== TypeScript.VariableFlags.None) {
                        var memberSymbol = this.getSymbolForAST(arg);
                        var argumentSymbol = parameters[i];
                        this.emitIndent();
                        this.recordSourceMappingStart(arg);
                        this.recordSourceMappingStart(arg.id);

                        var jsDocComments = Emitter.getJSDocForType(memberSymbol.type);
                        if (TypeScript.hasFlag(arg.getVarFlags(), TypeScript.VariableFlags.Public)) {
                            jsDocComments.push("@expose");
                        }

                        if (TypeScript.hasFlag(arg.getVarFlags(), TypeScript.VariableFlags.Protected)) {
                            jsDocComments.push("@protected");
                        } else if (TypeScript.hasFlag(arg.getVarFlags(), TypeScript.VariableFlags.Private)) {
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
                    var varDecl = this.thisClassNode.members.members[i];
                    if (!TypeScript.hasFlag(varDecl.getVarFlags(), TypeScript.VariableFlags.Static)) {
                        this.emitIndent();
                        this.emitVariableDeclarator(varDecl);
                        this.writeLineToOutput("");
                    }
                }
            }
        };

        Emitter.prototype.emitCommaSeparatedList = function (list, startLine) {
            if (typeof startLine === "undefined") { startLine = false; }
            if (list === null) {
                return;
            } else {
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
        };

        Emitter.prototype.emitModuleElements = function (list, isModule, skipFirstLine) {
            if (typeof isModule === "undefined") { isModule = false; }
            if (typeof skipFirstLine === "undefined") { skipFirstLine = false; }
            if (list === null) {
                return;
            }

            this.emitComments(list, true);
            var lastEmittedNode = null;
            var isFirstLine = true;

            for (var i = 0, n = list.members.length; i < n; i++) {
                var node = list.members[i];

                if (node.shouldEmit()) {
                    if (isModule) {
                        if (isFirstLine && !skipFirstLine)
                            this.writeLineToOutput('');
                        if (skipFirstLine)
                            skipFirstLine = false;
else
                            this.writeLineToOutput('');
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
        };

        Emitter.prototype.isDirectivePrologueElement = function (node) {
            if (node.nodeType() === TypeScript.NodeType.ExpressionStatement) {
                var exprStatement = node;
                return exprStatement.expression.nodeType() === TypeScript.NodeType.StringLiteral;
            }

            return false;
        };

        // If these two constructs had more than one line between them originally, then emit at
        // least one blank line between them.
        Emitter.prototype.emitSpaceBetweenConstructs = function (node1, node2) {
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
        };

        // We consider a sequence of comments to be a copyright header if there are no blank lines
        // between them, and there is a blank line after the last one and the node they're attached
        // to.
        Emitter.prototype.getCopyrightComments = function () {
            var preComments = this.copyrightElement.preComments();
            if (preComments) {
                var lineMap = this.document.lineMap;

                var copyrightComments = [];
                var lastComment = null;

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
        };

        Emitter.prototype.emitPossibleCopyrightHeaders = function (script) {
            var list = script.moduleElements;
            if (list.members.length > 0) {
                var firstElement = list.members[0];
                if (firstElement.nodeType() === TypeScript.NodeType.ModuleDeclaration) {
                    var moduleDeclaration = firstElement;
                    if (moduleDeclaration.isWholeFile()) {
                        firstElement = moduleDeclaration.members.members[0];
                    }
                }

                this.copyrightElement = firstElement;
                this.emitCommentsArray(this.getCopyrightComments());
            }
        };

        Emitter.prototype.emitScriptElements = function (script) {
            var list = script.moduleElements;

            this.emitPossibleCopyrightHeaders(script);
            if (this._emitGlobal) {
                this.writeLineToOutput("var global=this;");
                this._emitGlobal = false;
            }

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
            var lastEmittedNode = null;

            for (; i < n; i++) {
                var node = list.members[i];

                if (node.shouldEmit()) {
                    this.emitSpaceBetweenConstructs(lastEmittedNode, node);

                    this.emitJavascript(node, true);
                    this.writeLineToOutput("");

                    lastEmittedNode = node;
                }
            }
        };

        Emitter.prototype.emitConstructorStatements = function (funcDecl) {
            var list = funcDecl.block.statements;

            if (list === null) {
                return;
            }

            this.emitComments(list, true);

            var emitPropertyAssignmentsAfterSuperCall = this.thisClassNode.extendsList && this.thisClassNode.extendsList.members.length > 0;
            var propertyAssignmentIndex = emitPropertyAssignmentsAfterSuperCall ? 1 : 0;
            var lastEmittedNode = null;

            for (var i = 0, n = list.members.length; i < n; i++) {
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
        };

        // tokenId is the id the preceding token
        Emitter.prototype.emitJavascript = function (ast, startLine) {
            if (ast === null) {
                return;
            }

            if (startLine && this.indenter.indentAmt > 0) {
                this.emitIndent();
            }

            ast.emit(this);
        };

        Emitter.prototype.emitPropertyAccessor = function (funcDecl, className, isProto) {
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
        };

        Emitter.prototype.emitPrototypeMember = function (funcDecl, classSymbol) {
            if (funcDecl.isAccessor()) {
                this.emitPropertyAccessor(funcDecl, classSymbol.name, true);
            } else if (classSymbol.isInterface()) {
                return;
            } else {
                this.emitIndent();
                this.recordSourceMappingStart(funcDecl);

                var jsDocComments = [];

                var isFinalClass = TypeScript.hasFlag((classSymbol.ast).getVarFlags(), TypeScript.VariableFlags.Final);
                var isFinalMethod = TypeScript.hasFlag(funcDecl.getFunctionFlags(), TypeScript.FunctionFlags.Final);
                var isNeedExport = classSymbol.hasFlag(TypeScript.PullElementFlags.Exported) && TypeScript.hasFlag(funcDecl.getFunctionFlags(), TypeScript.FunctionFlags.Public);

                if (!isFinalClass && !isFinalMethod && isNeedExport) {
                    jsDocComments.push("@expose");
                } else if (isFinalMethod) {
                    jsDocComments.push("@final");
                }

                if (funcDecl.symbol.type.getCallSignatures().length > 1) {
                    jsDocComments.push("@type {" + Emitter.formatJSDocType(funcDecl.symbol.type) + "}");
                    this.emitJSDocComment(jsDocComments);
                } else {
                    jsDocComments = jsDocComments.concat(this.getJSDocForFunctionDeclaration(funcDecl));
                    this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(funcDecl), jsDocComments));
                }

                var sFunctionMangleName = Emitter.mangleSymbolName(this.getSymbolForAST(funcDecl));
                var sClassName = Emitter.getFullSymbolName(classSymbol);
                this.writeToOutput(sClassName + ".prototype." + sFunctionMangleName + " = ");

                var tempFnc = this.thisFunctionDeclaration;
                this.thisFunctionDeclaration = funcDecl;
                this.emitInnerFunction(funcDecl, false, false);
                this.thisFunctionDeclaration = tempFnc;

                this.writeToOutput(";");

                if (isNeedExport && (isFinalClass || isFinalMethod)) {
                    this.writeLineToOutput('');
                    this.emitIndent();
                    this.writeToOutput(sClassName + "['prototype']['" + sFunctionMangleName + "']=" + sClassName + ".prototype." + sFunctionMangleName + ";");
                }
            }
        };

        Emitter.prototype.emitClass = function (classDecl) {
            var pullDecl = this.getDeclForAST(classDecl);

            var svClassNode = this.thisClassNode;
            var svBaseName = this.thisBaseName;
            this.thisClassNode = classDecl;
            this.thisBaseName = null;
            var temp = this.setContainer(EmitContainer.Class);

            this.recordSourceMappingStart(classDecl);

            var hasBaseClass = classDecl.extendsList && classDecl.extendsList.members.length;
            var baseNameDecl = null;
            var baseName = null;
            var varDecl = null;

            if (hasBaseClass) {
                baseNameDecl = classDecl.extendsList.members[0];
                baseName = baseNameDecl.nodeType() === TypeScript.NodeType.InvocationExpression ? (baseNameDecl).target : baseNameDecl;
                this.thisBaseName = Emitter.getFullSymbolName(this.getSymbolForAST(baseName));
            }

            var constrDecl = classDecl.constructorDecl;

            if (constrDecl) {
                // declared constructor
                constrDecl.emit(this);
            } else {
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
            var name = Emitter.getFullSymbolName(this.getSymbolForAST(classDecl));
            if (this.emittedModuleNames.indexOf(name) < 0) {
                this.emittedModuleNames.push(name);
                this.exportSymbol(this.getSymbolForAST(classDecl));
            }
        };

        Emitter.prototype.emitClassMembers = function (classDecl) {
            // First, emit all the functions.
            var lastEmittedMember = null;
            var isFirstLine = true;

            for (var i = 0, n = classDecl.members.members.length; i < n; i++) {
                var memberDecl = classDecl.members.members[i];

                if (memberDecl.nodeType() === TypeScript.NodeType.FunctionDeclaration) {
                    var fn = memberDecl;

                    if (TypeScript.hasFlag(fn.getFunctionFlags(), TypeScript.FunctionFlags.Method) && !fn.isSignature()) {
                        if (isFirstLine) {
                            this.writeLineToOutput('');
                            isFirstLine = false;
                        }
                        this.writeLineToOutput('');
                        this.emitSpaceBetweenConstructs(lastEmittedMember, fn);

                        if (!TypeScript.hasFlag(fn.getFunctionFlags(), TypeScript.FunctionFlags.Static)) {
                            this.emitPrototypeMember(fn, this.getSymbolForAST(classDecl));
                        } else {
                            var tempFnc = this.thisFunctionDeclaration;
                            this.thisFunctionDeclaration = fn;

                            if (fn.isAccessor()) {
                                this.emitPropertyAccessor(fn, this.thisClassNode.name.actualText, false);
                            } else {
                                this.emitIndent();
                                this.recordSourceMappingStart(fn);
                                this.emitJSDocComment(Emitter.joinJSDocComments(Emitter.getUserComments(fn), this.getJSDocForFunctionDeclaration(fn)));
                                this.emitFullSymbolVariableStatement(this.getSymbolForAST(fn));
                                this.writeToOutput(' = ');
                                this.emitInnerFunction(fn, false, false);
                                this.writeToOutput(";");

                                if (TypeScript.hasFlag(fn.getFunctionFlags(), TypeScript.FunctionFlags.Public)) {
                                    var sFullName = Emitter.getFullSymbolName(this.getSymbolForAST(fn));
                                    var sExportName = sFullName.replace(/(\.\w+)$/, function (str) {
                                        return "['" + str.substr(1) + "']";
                                    });
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

            for (var i = 0, n = classDecl.members.members.length; i < n; i++) {
                var memberDecl = classDecl.members.members[i];

                if (memberDecl.nodeType() === TypeScript.NodeType.VariableDeclarator) {
                    var varDecl = memberDecl;

                    if (TypeScript.hasFlag(varDecl.getVarFlags(), TypeScript.VariableFlags.Static)) {
                        if (isFirstLine) {
                            this.writeLineToOutput('');
                            isFirstLine = false;
                        }
                        this.writeLineToOutput('');
                        this.emitSpaceBetweenConstructs(lastEmittedMember, varDecl);

                        this.emitIndent();
                        this.recordSourceMappingStart(varDecl);

                        var jsDocComments = this.getJSDocForVariableDeclaration(varDecl);

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
        };

        Emitter.prototype.requiresExtendsBlock = function (moduleElements) {
            for (var i = 0, n = moduleElements.members.length; i < n; i++) {
                var moduleElement = moduleElements.members[i];

                if (moduleElement.nodeType() === TypeScript.NodeType.ModuleDeclaration) {
                    if (this.requiresExtendsBlock((moduleElement).members)) {
                        return true;
                    }
                } else if (moduleElement.nodeType() === TypeScript.NodeType.ClassDeclaration) {
                    var classDeclaration = moduleElement;

                    if (classDeclaration.extendsList && classDeclaration.extendsList.members.length > 0) {
                        return true;
                    }
                }
            }

            return false;
        };

        Emitter.prototype.emitPrologue = function (script) {
            if (!this.extendsPrologueEmitted) {
                if (this.requiresExtendsBlock(script.moduleElements)) {
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
                    this.writeLineToOutput("}");
                    this.writeLineToOutput("");
                    this.writeLineToOutput("global['__extends']=__extends;");
                    this.writeLineToOutput("");
                }
            }
        };

        Emitter.prototype.emitSuperReference = function () {
            this.writeToOutput(this.thisBaseName + ".prototype");
        };

        Emitter.prototype.emitSuperCall = function (callEx) {
            if (callEx.target.nodeType() === TypeScript.NodeType.MemberAccessExpression) {
                var dotNode = callEx.target;
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
        };

        Emitter.prototype.emitThis = function () {
            if (this.thisFunctionDeclaration && !this.thisFunctionDeclaration.isMethod() && (!this.thisFunctionDeclaration.isConstructor)) {
                this.writeToOutput("_this");
            } else {
                this.writeToOutput("this");
            }
        };

        Emitter.prototype.emitBlockOrStatement = function (node) {
            if (node.nodeType() === TypeScript.NodeType.Block) {
                node.emit(this);
            } else {
                this.writeLineToOutput("");
                this.indenter.increaseIndent();
                this.emitJavascript(node, true);
                this.indenter.decreaseIndent();
            }
        };

        Emitter.throwEmitterError = function (e) {
            var error = new Error(e.message);
            error.isEmitterError = true;
            throw error;
        };

        Emitter.handleEmitterError = function (fileName, e) {
            if ((e).isEmitterError === true) {
                return [new TypeScript.Diagnostic(fileName, 0, 0, TypeScript.DiagnosticCode.Emit_Error_0, [e.message])];
            }

            throw e;
        };

        Emitter.prototype.getDeclForAST = function (ast) {
            return this.semanticInfoChain.getDeclForAST(ast, this.document.fileName) || null;
        };

        Emitter.prototype.getSymbolForAST = function (ast) {
            var symbol = this.semanticInfoChain.getSymbolForAST(ast, this.document.fileName) || null;

            if (symbol === null) {
                var pullDecl = this.getDeclForAST(ast);
                if (pullDecl !== null)
                    symbol = pullDecl.getSymbol();
            }

            return symbol;
        };

        Emitter.prototype.emitUnaryExpression = function (ast, emitWorker) {
            if (ast.nodeType() === TypeScript.NodeType.CastExpression) {
                this.emitInlineJSDocComment([], Emitter.getJSDocForType(this.getSymbolForAST(ast).type));
                this.writeToOutput('(');
                ast.operand.emit(this);
                this.writeToOutput(')');
            } else {
                emitWorker.call(ast, this);
            }
        };

        Emitter.prototype.emitVariableStatement = function (ast) {
            if (TypeScript.hasFlag(ast.getFlags(), TypeScript.ASTFlags.EnumElement)) {
                this.emitEnumElement(ast.declaration.declarators.members[0]);
            } else {
                ast.declaration.emit(this);
            }
        };

        Emitter.prototype.emitInlineVariableDeclaration = function (ast) {
            for (var i = 0, n = ast.declarators.members.length; i < n; i++) {
                var varDecl = ast.declarators.members[i];
                var name = Emitter.getFullSymbolName(this.getSymbolForAST(varDecl));
                if (i > 0)
                    this.writeToOutput(', ');
else if (name.indexOf('.') < 0)
                    this.writeToOutput('var ');
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
        };

        Emitter.prototype.emitForInStatement = function (ast) {
            this.writeToOutput("for (");
            if (ast.lval.nodeType() === TypeScript.NodeType.VariableDeclaration) {
                this.emitInlineVariableDeclaration(ast.lval);
            } else {
                ast.lval.emit(this);
            }
            this.writeToOutput(" in ");
            ast.obj.emit(this);
            this.writeToOutput(")");
            this.emitBlockOrStatement(ast.body);
        };

        Emitter.prototype.emitForStatement = function (ast) {
            this.writeToOutput("for (");
            if (ast.init) {
                if (ast.init.nodeType() === TypeScript.NodeType.VariableDeclaration) {
                    this.emitInlineVariableDeclaration(ast.init);
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
        };

        Emitter.prototype.emitInterfaceDeclaration = function (interfaceDecl) {
            // Special-case interface declarations with index or call signatures
            var symbol = this.getSymbolForAST(interfaceDecl);
            var name = Emitter.getFullSymbolName(symbol);

            if (name === "String" || name === "Number" || name === "Array") {
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
        };

        Emitter.prototype.emitInterfaceMembers = function (interfaceDecl) {
            var lastEmittedMember = null;
            var isFirstLine = true;
            var alreadyEmittedMethods = [];

            for (var i = 0, n = interfaceDecl.members.members.length; i < n; i++) {
                var memberDecl = interfaceDecl.members.members[i];

                if (memberDecl.nodeType() === TypeScript.NodeType.VariableDeclarator) {
                    var symbol = this.getSymbolForAST(memberDecl);
                    if (isFirstLine) {
                        this.writeLineToOutput('');
                        isFirstLine = false;
                    }
                    this.writeLineToOutput('');
                    this.emitSpaceBetweenConstructs(lastEmittedMember, memberDecl);

                    var jsDocComments = this.getJSDocForVariableDeclaration(memberDecl);

                    if (TypeScript.hasFlag(interfaceDecl.getVarFlags(), TypeScript.VariableFlags.Exported)) {
                        jsDocComments.push("@expose");
                    }

                    this.emitInlineJSDocComment(Emitter.getUserComments(memberDecl), jsDocComments);
                    this.writeToOutput(Emitter.getFullSymbolName(this.getSymbolForAST(interfaceDecl)) + '.prototype.' + Emitter.mangleSymbolName(symbol) + ';');
                    lastEmittedMember = memberDecl;
                } else if (memberDecl.nodeType() === TypeScript.NodeType.FunctionDeclaration) {
                    if (alreadyEmittedMethods.indexOf(memberDecl.decl.name) >= 0) {
                        continue;
                    }
                    if (isFirstLine) {
                        this.writeLineToOutput('');
                        isFirstLine = false;
                    }
                    this.writeLineToOutput('');
                    this.emitSpaceBetweenConstructs(lastEmittedMember, memberDecl);
                    this.emitInteraceMethodMember(memberDecl, interfaceDecl);

                    //this.emitPrototypeMember(<FunctionDeclaration>memberDecl, this.getSymbolForAST(interfaceDecl));
                    lastEmittedMember = memberDecl;
                    alreadyEmittedMethods.push(memberDecl.decl.name);
                }
            }
        };

        Emitter.prototype.emitInteraceMethodMember = function (method, interfaceDecl) {
            var type = "@type {" + Emitter.formatJSDocType(method.symbol.type) + "}";

            this.emitIndent();
            this.recordSourceMappingStart(method);
            if (TypeScript.hasFlag(interfaceDecl.getVarFlags(), TypeScript.VariableFlags.Exported)) {
                this.emitJSDocComment([type]);
            } else {
                this.emitJSDocComment([type]);
            }

            this.writeToOutput(Emitter.getFullSymbolName(this.getSymbolForAST(interfaceDecl)) + ".prototype." + Emitter.mangleSymbolName(this.getSymbolForAST(method)) + ";");
            //console.log(type);
        };

        Emitter.prototype.exportSymbol = function (symbol) {
            this.writeLineToOutput("");
            this.emitIndent();
            var path = TypeScript.getPathToDecl(symbol.getDeclarations()[0]);

            if (path.length === 2) {
                this.writeToOutput("global['" + symbol.name + "']=" + symbol.name + ";");
                return;
            }

            for (var i = path.length - 1; i > 0; i--) {
                var nextSymbol = path[i - 1].getSymbol();

                if (nextSymbol === null || nextSymbol.kind & TypeScript.PullElementKind.SomeFunction) {
                    break;
                }
            }

            var names = path.slice(i, path.length - 1).map(function (pullDecl) {
                return pullDecl.getSymbol().name;
            });

            var externalPath = "global['" + names.join("']['") + "']";
            var internalPath = names.join(".");

            this.writeToOutput(externalPath + "['" + symbol.name + "']=" + internalPath + "." + symbol.name + ";");
        };

        Emitter.mangleVarArgSymbolName = function (symbol) {
            return symbol.getDisplayName() + '$rest';
        };

        Emitter.isAmbientSymbol = function (symbol) {
            var path = TypeScript.getPathToDecl(symbol.getDeclarations()[0]);
            for (var i = 0; i < path.length; i++) {
                if (TypeScript.hasFlag(path[i].flags, TypeScript.DeclFlags.Ambient))
                    return true;
            }
            return false;
        };

        Emitter.shouldMangleSymbol = function (symbol) {
            if (!Emitter.MANGLE_NAMES)
                return false;

            if (/^\d/.test(symbol.getDisplayName()))
                return false;

            // Ignore symbols not in the user's code
            var path = TypeScript.getPathToDecl(symbol.getDeclarations()[0]);
            if (path.length === 0)
                return false;
            var rootPath = path[0].name;
            if (!/\.ts$/.test(rootPath) || /\.d\.ts$/.test(rootPath))
                return false;

            if (Emitter.isAmbientSymbol(symbol))
                return false;

            if (symbol.kind !== TypeScript.PullElementKind.Property && Emitter.getFullSymbolName(symbol, ShouldMangle.NO).indexOf('.') < 0)
                return false;

            if (Emitter.symbolsToAvoidMangling.indexOf(symbol) >= 0)
                return false;

            return true;
        };

        Emitter.mangleSymbolName = function (symbol) {
            var name = symbol.getDisplayName();
            return Emitter.shouldMangleSymbol(symbol) ? name + '$mangled' : name;
        };

        Emitter.getFullSymbolName = function (symbol, shouldMangle) {
            if (typeof shouldMangle === "undefined") { shouldMangle = ShouldMangle.YES; }
            var path = TypeScript.getPathToDecl(symbol.getDeclarations()[0]);

            if (symbol.kind & TypeScript.PullElementKind.Property && !(path[path.length - 1].flags & TypeScript.PullElementFlags.Static)) {
                return shouldMangle === ShouldMangle.YES ? Emitter.mangleSymbolName(symbol) : symbol.name;
            }

            for (var i = path.length - 1; i > 0; i--) {
                var nextSymbol = path[i - 1].getSymbol();

                if (nextSymbol === null || nextSymbol.kind & TypeScript.PullElementKind.SomeFunction) {
                    break;
                }
            }

            return path.slice(i).map(function (pullDecl) {
                var symbol = pullDecl.getSymbol();
                return symbol === null ? 'null' : shouldMangle === ShouldMangle.YES ? Emitter.mangleSymbolName(symbol) : symbol.name;
            }).join('.');
        };

        Emitter.formatJSDocUnionType = function (parts) {
            return parts.length === 1 ? parts[0] : '(' + parts.join('|') + ')';
        };

        Emitter.formatJSDocArgumentType = function (arg) {
            return arg.isVarArg ? '...[' + Emitter.stripOffArrayType(Emitter.formatJSDocType(arg.type)) + ']' : (Emitter.formatJSDocType(arg.type) + (arg.isOptional ? "=" : ""));
        };

        Emitter.formatJSDocType = function (type, ignoreName) {
            if (typeof ignoreName === "undefined") { ignoreName = IgnoreName.NO; }
            if (type.kind & TypeScript.PullElementKind.TypeParameter) {
                return '?';
            }

            if (type.isNamedTypeSymbol() && ignoreName === IgnoreName.NO) {
                var name = Emitter.getFullSymbolName(type);
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

            if (type.kind & (TypeScript.PullElementKind.ObjectType | TypeScript.PullElementKind.Interface | TypeScript.PullElementKind.FunctionType) && type.getCallSignatures().length > 0) {
                return Emitter.formatJSDocUnionType(type.getCallSignatures().map(function (signature) {
                    return '?function(' + signature.parameters.map(function (arg) {
                        return Emitter.formatJSDocArgumentType(arg);
                    }).join(', ') + ')' + (signature.returnType !== null && signature.returnType.getTypeName() !== 'void' ? ': ' + Emitter.formatJSDocType(signature.returnType) : '');
                }));
            }

            if (type.kind & TypeScript.PullElementKind.ConstructorType && type.getConstructSignatures().length > 0) {
                return Emitter.formatJSDocUnionType(type.getConstructSignatures().map(function (signature) {
                    return '?function(' + (signature.returnType !== null && signature.returnType.getTypeName() !== 'void' ? ['new:' + Emitter.formatJSDocType(signature.returnType)] : Emitter.EMPTY_STRING_LIST).concat(signature.parameters.map(function (arg) {
                        return Emitter.formatJSDocArgumentType(arg);
                    })).join(', ') + ')';
                }));
            }

            if (type.kind & (TypeScript.PullElementKind.ObjectType | TypeScript.PullElementKind.Interface) && type.getIndexSignatures().length > 0) {
                return Emitter.formatJSDocUnionType(type.getIndexSignatures().map(function (signature) {
                    return 'Object.<' + Emitter.formatJSDocType(signature.parameters[0].type) + ', ' + Emitter.formatJSDocType(signature.returnType) + '>';
                }));
            }

            if (type.kind & (TypeScript.PullElementKind.ObjectType | TypeScript.PullElementKind.Interface)) {
                if (type.getMembers().length === 0) {
                    return '?Object';
                }
                if (type.getMembers().some(function (member) {
                    return /[^A-Za-z0-9_$]/.test(member.getDisplayName());
                })) {
                    return '?';
                }
                return '?{ ' + type.getMembers().map(function (member) {
                    return Emitter.mangleSymbolName(member) + ': ' + Emitter.formatJSDocType(member.type);
                }).join(', ') + ' }';
            }

            if (type.kind & TypeScript.PullElementKind.Array) {
                return 'Array.<' + Emitter.formatJSDocType(type.getTypeArguments()[0]) + '>';
            }

            throw new Error(TypeScript.PullElementKind[type.kind] + ' types like "' + type.getTypeName() + '" are not supported');
        };

        Emitter.getUserComments = function (node) {
            var comments = node.preComments();
            if (comments === null) {
                return [];
            }
            return Emitter.EMPTY_STRING_LIST.concat(comments.map(function (comment) {
                return comment.getDocCommentTextValue().split('\n');
            })).map(function (line) {
                return (line + '').replace(/^\/\/\s?/, '');
            });
        };

        Emitter.getJSDocForType = function (type) {
            return ['@type {' + Emitter.formatJSDocType(type) + '}'];
        };

        Emitter.getJSDocForConst = function (type) {
            return ['@const {' + Emitter.formatJSDocType(type) + '}'];
        };

        Emitter.stripOffArrayType = function (type) {
            return type.replace(/^Array\.<(.*)>$/, '$1');
        };

        Emitter.getJSDocForArguments = function (symbols) {
            return symbols.map(function (symbol) {
                var type = Emitter.formatJSDocType(symbol.type);
                if (symbol.isVarArg)
                    return '@param {...' + Emitter.stripOffArrayType(type) + '} ' + Emitter.mangleVarArgSymbolName(symbol);
                if (symbol.isOptional)
                    type += '=';
                return '@param {' + type + '} ' + Emitter.mangleSymbolName(symbol);
            });
        };

        Emitter.prototype.getJSDocForConstructor = function (classDecl) {
            return ['@constructor', '@struct', TypeScript.hasFlag(classDecl.getVarFlags(), TypeScript.VariableFlags.Final) ? '@final' : ''].concat(this.getJSDocForExtends(classDecl.extendsList), this.getJSDocForImplements(classDecl.implementsList));
        };

        // The symbol for GenericType nodes is sometimes stored in the name
        Emitter.prototype.getSymbolForNameAST = function (ast) {
            return this.getSymbolForAST(ast.nodeType() === TypeScript.NodeType.GenericType ? (ast).name : ast);
        };

        Emitter.prototype.getJSDocForExtends = function (extendsList) {
            var _this = this;
            return extendsList !== null ? extendsList.members.map(function (member) {
                return '@extends {' + Emitter.getFullSymbolName(_this.getSymbolForNameAST(member)) + '}';
            }) : Emitter.EMPTY_STRING_LIST;
        };

        Emitter.prototype.getJSDocForImplements = function (implementsList) {
            var _this = this;
            return implementsList !== null ? implementsList.members.map(function (member) {
                return '@implements {' + Emitter.getFullSymbolName(_this.getSymbolForNameAST(member)) + '}';
            }) : Emitter.EMPTY_STRING_LIST;
        };

        Emitter.getJSDocForReturnType = function (returnType) {
            return ['@returns {' + Emitter.formatJSDocType(returnType) + '}'];
        };

        Emitter.getJSDocForEnumDeclaration = function (moduleDecl) {
            return ['@enum {number}'];
        };

        Emitter.getJSDocForTypedef = function (type) {
            return ['@typedef {' + Emitter.formatJSDocType(type, IgnoreName.YES) + '}'];
        };

        Emitter.prototype.getFunctionDeclarationSignature = function (funcDecl) {
            var type = this.getSymbolForAST(funcDecl).type;

            //var signaturesCount = type.getCallSignatures().length;
            //var signature: PullSignatureSymbol = (signaturesCount > 0) ? type.getCallSignatures()[signaturesCount - 1] : type.getConstructSignatures()[0];
            var signature = type.getCallSignatures().concat(type.getConstructSignatures())[0];

            if (signature.parameters.length !== funcDecl.arguments.members.length) {
                //console.log(funcDecl.name.text(), signature.parameters.length, funcDecl.arguments.members.length);
                //throw new Error('Internal error');
            }

            return signature;
        };

        Emitter.prototype.getJSDocForFunctionDeclaration = function (funcDecl) {
            var signature = this.getFunctionDeclarationSignature(funcDecl);
            return Emitter.getJSDocForArguments(signature.parameters).concat(funcDecl.isConstructor ? this.getJSDocForConstructor(funcDecl.classDecl) : signature.returnType !== null && signature.returnType.getTypeName() !== 'void' ? Emitter.getJSDocForReturnType(signature.returnType) : Emitter.EMPTY_STRING_LIST);
        };

        Emitter.prototype.getJSDocForInterfaceDeclaration = function (interfaceDecl) {
            return ['@interface'].concat(this.getJSDocForExtends(interfaceDecl.extendsList));
        };

        Emitter.prototype.getJSDocForVariableDeclaration = function (varDecl) {
            var symbol = this.getSymbolForAST(varDecl);
            return Emitter.DEFINES.indexOf(Emitter.getFullSymbolName(symbol, ShouldMangle.NO)) >= 0 ? ['@define {' + Emitter.formatJSDocType(symbol.type) + '}'] : Emitter.detectedConstants.indexOf(symbol) >= 0 ? Emitter.getJSDocForConst(symbol.type) : Emitter.getJSDocForType(symbol.type);
        };

        Emitter.joinJSDocComments = function (first, second) {
            return first.concat(first.length && second.length ? [''] : Emitter.EMPTY_STRING_LIST, second);
        };

        Emitter.prototype.emitFullSymbolVariableStatement = function (symbol) {
            var name = Emitter.getFullSymbolName(symbol);
            this.writeToOutput(name.indexOf('.') < 0 ? 'var ' + Emitter.mangleSymbolName(symbol) : name);
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
            if (user.length === 0)
                this.writeToOutput('/** ' + jsDoc.join(' ') + ' */ ');
else
                this.emitJSDocComment(Emitter.joinJSDocComments(user, jsDoc));
        };

        Emitter.detectConstants = function (compiler, ioHost) {
            if (!Emitter.DETECT_CONSTANTS)
                return;

            var potentialConstants = [];
            var impossibleConstants = [];

            compiler.fileNameToDocument.getAllKeys().forEach(function (fileName) {
                TypeScript.walkAST(compiler.getDocument(fileName).script, function (path, walker) {
                    switch (path.nodeType()) {
                        case TypeScript.NodeType.VariableDeclarator:
                            var varDecl = path.ast();
                            if (varDecl.init !== null) {
                                var symbol = compiler.semanticInfoChain.getSymbolForAST(varDecl, fileName) || null;
                                if (symbol !== null && potentialConstants.indexOf(symbol) === -1 && (symbol.type.isPrimitive() || symbol.type.getTypeName() === 'RegExp') && (symbol.kind === TypeScript.PullElementKind.Variable || symbol.kind === TypeScript.PullElementKind.Property && varDecl.isStatic())) {
                                    potentialConstants.push(symbol);
                                }
                            }
                            break;

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
                            var binaryExpr = path.ast();
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

                        case TypeScript.NodeType.PreIncrementExpression:
                        case TypeScript.NodeType.PreDecrementExpression:
                        case TypeScript.NodeType.PostIncrementExpression:
                        case TypeScript.NodeType.PostDecrementExpression:
                            var unaryExpr = path.ast();
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

            Emitter.detectedConstants = potentialConstants.filter(function (symbol) {
                return impossibleConstants.indexOf(symbol) === -1;
            });
        };

        Emitter.preventManglingOfAmbientSymbols = function (compiler, ioHost) {
            if (!Emitter.MANGLE_NAMES)
                return;

            var symbolsToAvoidMangling = [];
            var objectInterfaceType = null;

            // Find the object type
            compiler.semanticInfoChain.units.forEach(function (unit) {
                unit.getTopLevelDecls().forEach(function (decl) {
                    decl.getChildDecls().forEach(function (decl) {
                        var symbol = decl.getSymbol();
                        if (symbol !== null && symbol.kind === TypeScript.PullElementKind.Interface && Emitter.getFullSymbolName(symbol) === 'Object') {
                            objectInterfaceType = symbol.type;
                        }
                    });
                });
            });

            function preventManglingOfSymbol(symbol) {
                if (symbolsToAvoidMangling.indexOf(symbol) < 0) {
                    symbolsToAvoidMangling.push(symbol);
                    if (symbol.type !== null)
                        preventManglingOfType(symbol.type);
                }
            }

            function preventManglingOfType(type) {
                type.getMembers().forEach(preventManglingOfSymbol);
            }

            function getAllMembers(members, type) {
                Array.prototype.push.apply(members, type.getMembers());
                type.getExtendedTypes().forEach(function (type) {
                    return getAllMembers(members, type);
                });

                if (objectInterfaceType !== null) {
                    Array.prototype.push.apply(members, objectInterfaceType.getMembers());
                }
            }

            function preventManglingOfInheritedMembers(type) {
                var allMembers = [];
                getAllMembers(allMembers, type);
                type.getMembers().forEach(function (member) {
                    if (allMembers.some(function (other) {
                        return member.name === other.name && !Emitter.shouldMangleSymbol(other);
                    })) {
                        preventManglingOfSymbol(member);
                    }
                });
            }

            compiler.fileNameToDocument.getAllKeys().forEach(function (fileName) {
                TypeScript.walkAST(compiler.getDocument(fileName).script, function (path, walker) {
                    switch (path.nodeType()) {
                        case TypeScript.NodeType.FunctionDeclaration:
                        case TypeScript.NodeType.ClassDeclaration:
                        case TypeScript.NodeType.InterfaceDeclaration:
                        case TypeScript.NodeType.ModuleDeclaration:
                        case TypeScript.NodeType.VariableDeclarator:
                            var symbol = compiler.semanticInfoChain.getSymbolForAST(path.ast(), fileName) || null;
                            if (symbol !== null) {
                                if (Emitter.isAmbientSymbol(symbol))
                                    preventManglingOfSymbol(symbol);
else if (symbol.type !== null)
                                    preventManglingOfInheritedMembers(symbol.type);
                            }
                            break;
                    }
                });
            });

            Emitter.symbolsToAvoidMangling = symbolsToAvoidMangling;
        };

        Emitter.preprocessCompilerInput = function (compiler, ioHost) {
            Emitter.detectConstants(compiler, ioHost);
            Emitter.preventManglingOfAmbientSymbols(compiler, ioHost);
        };
        Emitter.EMPTY_STRING_LIST = [];

        Emitter.DEFINES = [];
        Emitter.MANGLE_NAMES = false;
        Emitter.DETECT_CONSTANTS = false;
        Emitter.detectedConstants = [];
        Emitter.symbolsToAvoidMangling = [];
        return Emitter;
    })();
    TypeScript.Emitter = Emitter;
})(TypeScript || (TypeScript = {}));
