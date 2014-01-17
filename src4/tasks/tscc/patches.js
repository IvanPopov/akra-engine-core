TypeScript.ModuleDeclaration.prototype.shouldEmit = function() {
  return !TypeScript.hasFlag(this.getModuleFlags(), TypeScript.ModuleFlags.Ambient) && this.members.members.length > 0;
};

TypeScript.ModuleDeclaration.prototype.emit = function(emitter) {
  emitter.emitModule(this);
};

TypeScript.InterfaceDeclaration.prototype.shouldEmit = function() {
  return true;
};

TypeScript.InterfaceDeclaration.prototype.emit = function(emitter) {
  emitter.recordSourceMappingStart(this);
  emitter.emitInterfaceDeclaration(this);
  emitter.recordSourceMappingEnd(this);
};

TypeScript.UnaryExpression.prototype.emitWorker = function(emitWorker) {
  return function(emitter) { emitter.emitUnaryExpression(this, emitWorker); };
}(TypeScript.UnaryExpression.prototype.emitWorker);

TypeScript.Parameter.prototype.emitWorker = function(emitter) {
  emitter.emitParameter(this);
};

TypeScript.VariableStatement.prototype.emitWorker = function(emitter) {
  emitter.emitVariableStatement(this);
};

TypeScript.ForStatement.prototype.emitWorker = function(emitter) {
  emitter.emitForStatement(this);
};

TypeScript.ForInStatement.prototype.emitWorker = function(emitter) {
  emitter.emitForInStatement(this);
};

TypeScript.TypeScriptCompiler.prototype.emitAll = function(emitAll) {
  return function(ioHost, ioMapper) {
    TypeScript.Emitter.preprocessCompilerInput(this, ioHost);
    return emitAll.call(this, ioHost, ioMapper);
  };
}(TypeScript.TypeScriptCompiler.prototype.emitAll);

TypeScript.Indenter.indentStepString = '  ';
TypeScript.Indenter.indentStep = 2;
