/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler/src/constant_pool", ["require", "exports", "tslib", "@angular/compiler/src/output/output_ast", "@angular/compiler/src/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var o = require("@angular/compiler/src/output/output_ast");
    var util_1 = require("@angular/compiler/src/util");
    var CONSTANT_PREFIX = '_c';
    /**
     * `ConstantPool` tries to reuse literal factories when two or more literals are identical.
     * We determine whether literals are identical by creating a key out of their AST using the
     * `KeyVisitor`. This constant is used to replace dynamic expressions which can't be safely
     * converted into a key. E.g. given an expression `{foo: bar()}`, since we don't know what
     * the result of `bar` will be, we create a key that looks like `{foo: <unknown>}`. Note
     * that we use a variable, rather than something like `null` in order to avoid collisions.
     */
    var UNKNOWN_VALUE_KEY = o.variable('<unknown>');
    /**
     * Context to use when producing a key.
     *
     * This ensures we see the constant not the reference variable when producing
     * a key.
     */
    var KEY_CONTEXT = {};
    /**
     * A node that is a place-holder that allows the node to be replaced when the actual
     * node is known.
     *
     * This allows the constant pool to change an expression from a direct reference to
     * a constant to a shared constant. It returns a fix-up node that is later allowed to
     * change the referenced expression.
     */
    var FixupExpression = /** @class */ (function (_super) {
        tslib_1.__extends(FixupExpression, _super);
        function FixupExpression(resolved) {
            var _this = _super.call(this, resolved.type) || this;
            _this.resolved = resolved;
            _this.original = resolved;
            return _this;
        }
        FixupExpression.prototype.visitExpression = function (visitor, context) {
            if (context === KEY_CONTEXT) {
                // When producing a key we want to traverse the constant not the
                // variable used to refer to it.
                return this.original.visitExpression(visitor, context);
            }
            else {
                return this.resolved.visitExpression(visitor, context);
            }
        };
        FixupExpression.prototype.isEquivalent = function (e) {
            return e instanceof FixupExpression && this.resolved.isEquivalent(e.resolved);
        };
        FixupExpression.prototype.isConstant = function () { return true; };
        FixupExpression.prototype.fixup = function (expression) {
            this.resolved = expression;
            this.shared = true;
        };
        return FixupExpression;
    }(o.Expression));
    /**
     * A constant pool allows a code emitter to share constant in an output context.
     *
     * The constant pool also supports sharing access to ivy definitions references.
     */
    var ConstantPool = /** @class */ (function () {
        function ConstantPool() {
            this.statements = [];
            this.literals = new Map();
            this.literalFactories = new Map();
            this.injectorDefinitions = new Map();
            this.directiveDefinitions = new Map();
            this.componentDefinitions = new Map();
            this.pipeDefinitions = new Map();
            this.nextNameIndex = 0;
        }
        ConstantPool.prototype.getConstLiteral = function (literal, forceShared) {
            if (literal instanceof o.LiteralExpr || literal instanceof FixupExpression) {
                // Do no put simple literals into the constant pool or try to produce a constant for a
                // reference to a constant.
                return literal;
            }
            var key = this.keyOf(literal);
            var fixup = this.literals.get(key);
            var newValue = false;
            if (!fixup) {
                fixup = new FixupExpression(literal);
                this.literals.set(key, fixup);
                newValue = true;
            }
            if ((!newValue && !fixup.shared) || (newValue && forceShared)) {
                // Replace the expression with a variable
                var name_1 = this.freshName();
                this.statements.push(o.variable(name_1).set(literal).toDeclStmt(o.INFERRED_TYPE, [o.StmtModifier.Final]));
                fixup.fixup(o.variable(name_1));
            }
            return fixup;
        };
        ConstantPool.prototype.getDefinition = function (type, kind, ctx, forceShared) {
            if (forceShared === void 0) { forceShared = false; }
            var definitions = this.definitionsOf(kind);
            var fixup = definitions.get(type);
            var newValue = false;
            if (!fixup) {
                var property = this.propertyNameOf(kind);
                fixup = new FixupExpression(ctx.importExpr(type).prop(property));
                definitions.set(type, fixup);
                newValue = true;
            }
            if ((!newValue && !fixup.shared) || (newValue && forceShared)) {
                var name_2 = this.freshName();
                this.statements.push(o.variable(name_2).set(fixup.resolved).toDeclStmt(o.INFERRED_TYPE, [o.StmtModifier.Final]));
                fixup.fixup(o.variable(name_2));
            }
            return fixup;
        };
        ConstantPool.prototype.getLiteralFactory = function (literal) {
            // Create a pure function that builds an array of a mix of constant and variable expressions
            if (literal instanceof o.LiteralArrayExpr) {
                var argumentsForKey = literal.entries.map(function (e) { return e.isConstant() ? e : UNKNOWN_VALUE_KEY; });
                var key = this.keyOf(o.literalArr(argumentsForKey));
                return this._getLiteralFactory(key, literal.entries, function (entries) { return o.literalArr(entries); });
            }
            else {
                var expressionForKey = o.literalMap(literal.entries.map(function (e) { return ({
                    key: e.key,
                    value: e.value.isConstant() ? e.value : UNKNOWN_VALUE_KEY,
                    quoted: e.quoted
                }); }));
                var key = this.keyOf(expressionForKey);
                return this._getLiteralFactory(key, literal.entries.map(function (e) { return e.value; }), function (entries) { return o.literalMap(entries.map(function (value, index) { return ({
                    key: literal.entries[index].key,
                    value: value,
                    quoted: literal.entries[index].quoted
                }); })); });
            }
        };
        ConstantPool.prototype._getLiteralFactory = function (key, values, resultMap) {
            var _this = this;
            var literalFactory = this.literalFactories.get(key);
            var literalFactoryArguments = values.filter((function (e) { return !e.isConstant(); }));
            if (!literalFactory) {
                var resultExpressions = values.map(function (e, index) { return e.isConstant() ? _this.getConstLiteral(e, true) : o.variable("a" + index); });
                var parameters = resultExpressions.filter(isVariable).map(function (e) { return new o.FnParam(e.name, o.DYNAMIC_TYPE); });
                var pureFunctionDeclaration = o.fn(parameters, [new o.ReturnStatement(resultMap(resultExpressions))], o.INFERRED_TYPE);
                var name_3 = this.freshName();
                this.statements.push(o.variable(name_3).set(pureFunctionDeclaration).toDeclStmt(o.INFERRED_TYPE, [
                    o.StmtModifier.Final
                ]));
                literalFactory = o.variable(name_3);
                this.literalFactories.set(key, literalFactory);
            }
            return { literalFactory: literalFactory, literalFactoryArguments: literalFactoryArguments };
        };
        /**
         * Produce a unique name.
         *
         * The name might be unique among different prefixes if any of the prefixes end in
         * a digit so the prefix should be a constant string (not based on user input) and
         * must not end in a digit.
         */
        ConstantPool.prototype.uniqueName = function (prefix) { return "" + prefix + this.nextNameIndex++; };
        ConstantPool.prototype.definitionsOf = function (kind) {
            switch (kind) {
                case 2 /* Component */:
                    return this.componentDefinitions;
                case 1 /* Directive */:
                    return this.directiveDefinitions;
                case 0 /* Injector */:
                    return this.injectorDefinitions;
                case 3 /* Pipe */:
                    return this.pipeDefinitions;
            }
            util_1.error("Unknown definition kind " + kind);
            return this.componentDefinitions;
        };
        ConstantPool.prototype.propertyNameOf = function (kind) {
            switch (kind) {
                case 2 /* Component */:
                    return 'ɵcmp';
                case 1 /* Directive */:
                    return 'ɵdir';
                case 0 /* Injector */:
                    return 'ɵinj';
                case 3 /* Pipe */:
                    return 'ɵpipe';
            }
            util_1.error("Unknown definition kind " + kind);
            return '<unknown>';
        };
        ConstantPool.prototype.freshName = function () { return this.uniqueName(CONSTANT_PREFIX); };
        ConstantPool.prototype.keyOf = function (expression) {
            return expression.visitExpression(new KeyVisitor(), KEY_CONTEXT);
        };
        return ConstantPool;
    }());
    exports.ConstantPool = ConstantPool;
    /**
     * Visitor used to determine if 2 expressions are equivalent and can be shared in the
     * `ConstantPool`.
     *
     * When the id (string) generated by the visitor is equal, expressions are considered equivalent.
     */
    var KeyVisitor = /** @class */ (function () {
        function KeyVisitor() {
            this.visitWrappedNodeExpr = invalid;
            this.visitWriteVarExpr = invalid;
            this.visitWriteKeyExpr = invalid;
            this.visitWritePropExpr = invalid;
            this.visitInvokeMethodExpr = invalid;
            this.visitInvokeFunctionExpr = invalid;
            this.visitInstantiateExpr = invalid;
            this.visitConditionalExpr = invalid;
            this.visitNotExpr = invalid;
            this.visitAssertNotNullExpr = invalid;
            this.visitCastExpr = invalid;
            this.visitFunctionExpr = invalid;
            this.visitBinaryOperatorExpr = invalid;
            this.visitReadPropExpr = invalid;
            this.visitReadKeyExpr = invalid;
            this.visitCommaExpr = invalid;
            this.visitLocalizedString = invalid;
        }
        KeyVisitor.prototype.visitLiteralExpr = function (ast) {
            return "" + (typeof ast.value === 'string' ? '"' + ast.value + '"' : ast.value);
        };
        KeyVisitor.prototype.visitLiteralArrayExpr = function (ast, context) {
            var _this = this;
            return "[" + ast.entries.map(function (entry) { return entry.visitExpression(_this, context); }).join(',') + "]";
        };
        KeyVisitor.prototype.visitLiteralMapExpr = function (ast, context) {
            var _this = this;
            var mapKey = function (entry) {
                var quote = entry.quoted ? '"' : '';
                return "" + quote + entry.key + quote;
            };
            var mapEntry = function (entry) {
                return mapKey(entry) + ":" + entry.value.visitExpression(_this, context);
            };
            return "{" + ast.entries.map(mapEntry).join(',');
        };
        KeyVisitor.prototype.visitExternalExpr = function (ast) {
            return ast.value.moduleName ? "EX:" + ast.value.moduleName + ":" + ast.value.name :
                "EX:" + ast.value.runtime.name;
        };
        KeyVisitor.prototype.visitReadVarExpr = function (node) { return "VAR:" + node.name; };
        KeyVisitor.prototype.visitTypeofExpr = function (node, context) {
            return "TYPEOF:" + node.expr.visitExpression(this, context);
        };
        return KeyVisitor;
    }());
    function invalid(arg) {
        throw new Error("Invalid state: Visitor " + this.constructor.name + " doesn't handle " + arg.constructor.name);
    }
    function isVariable(e) {
        return e instanceof o.ReadVarExpr;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRfcG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9jb25zdGFudF9wb29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUVILDJEQUF5QztJQUN6QyxtREFBNEM7SUFFNUMsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDO0lBRTdCOzs7Ozs7O09BT0c7SUFDSCxJQUFNLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7SUFJbEQ7Ozs7O09BS0c7SUFDSCxJQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7SUFFdkI7Ozs7Ozs7T0FPRztJQUNIO1FBQThCLDJDQUFZO1FBTXhDLHlCQUFtQixRQUFzQjtZQUF6QyxZQUNFLGtCQUFNLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FFckI7WUFIa0IsY0FBUSxHQUFSLFFBQVEsQ0FBYztZQUV2QyxLQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7UUFDM0IsQ0FBQztRQUVELHlDQUFlLEdBQWYsVUFBZ0IsT0FBNEIsRUFBRSxPQUFZO1lBQ3hELElBQUksT0FBTyxLQUFLLFdBQVcsRUFBRTtnQkFDM0IsZ0VBQWdFO2dCQUNoRSxnQ0FBZ0M7Z0JBQ2hDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ3hEO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ3hEO1FBQ0gsQ0FBQztRQUVELHNDQUFZLEdBQVosVUFBYSxDQUFlO1lBQzFCLE9BQU8sQ0FBQyxZQUFZLGVBQWUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEYsQ0FB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LEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBTSxDQUFDLENBQUM7Z0JBQ2hELFFBQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBTSxDQUFDO1FBQy9ELENBQUM7UUFFRCxxQ0FBZ0IsR0FBaEIsVUFBaUIsSUFBbUIsSUFBSSxPQUFPLFNBQU8sSUFBSSxDQUFDLElBQU0sQ0FBQyxDQUFDLENBQUM7UUFFcEUsb0NBQWUsR0FBZixVQUFnQixJQUFrQixFQUFFLE9BQVk7WUFDOUMsT0FBTyxZQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUcsQ0FBQztRQUM5RCxDQUFDO1FBbUJILGlCQUFDO0lBQUQsQ0FBQyxBQS9DRCxJQStDQztJQUVELFNBQVMsT0FBTyxDQUErQixHQUErQjtRQUM1RSxNQUFNLElBQUksS0FBSyxDQUNYLDRCQUEwQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksd0JBQW1CLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBTSxDQUFDLENBQUM7SUFDaEcsQ0FBQztJQUVELFNBQVMsVUFBVSxDQUFDLENBQWU7UUFDakMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQztJQUNwQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBvIGZyb20gJy4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtPdXRwdXRDb250ZXh0LCBlcnJvcn0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgQ09OU1RBTlRfUFJFRklYID0gJ19jJztcblxuLyoqXG4gKiBgQ29uc3RhbnRQb29sYCB0cmllcyB0byByZXVzZSBsaXRlcmFsIGZhY3RvcmllcyB3aGVuIHR3byBvciBtb3JlIGxpdGVyYWxzIGFyZSBpZGVudGljYWwuXG4gKiBXZSBkZXRlcm1pbmUgd2hldGhlciBsaXRlcmFscyBhcmUgaWRlbnRpY2FsIGJ5IGNyZWF0aW5nIGEga2V5IG91dCBvZiB0aGVpciBBU1QgdXNpbmcgdGhlXG4gKiBgS2V5VmlzaXRvcmAuIFRoaXMgY29uc3RhbnQgaXMgdXNlZCB0byByZXBsYWNlIGR5bmFtaWMgZXhwcmVzc2lvbnMgd2hpY2ggY2FuJ3QgYmUgc2FmZWx5XG4gKiBjb252ZXJ0ZWQgaW50byBhIGtleS4gRS5nLiBnaXZlbiBhbiBleHByZXNzaW9uIGB7Zm9vOiBiYXIoKX1gLCBzaW5jZSB3ZSBkb24ndCBrbm93IHdoYXRcbiAqIHRoZSByZXN1bHQgb2YgYGJhcmAgd2lsbCBiZSwgd2UgY3JlYXRlIGEga2V5IHRoYXQgbG9va3MgbGlrZSBge2ZvbzogPHVua25vd24+fWAuIE5vdGVcbiAqIHRoYXQgd2UgdXNlIGEgdmFyaWFibGUsIHJhdGhlciB0aGFuIHNvbWV0aGluZyBsaWtlIGBudWxsYCBpbiBvcmRlciB0byBhdm9pZCBjb2xsaXNpb25zLlxuICovXG5jb25zdCBVTktOT1dOX1ZBTFVFX0tFWSA9IG8udmFyaWFibGUoJzx1bmtub3duPicpO1xuXG5leHBvcnQgY29uc3QgZW51bSBEZWZpbml0aW9uS2luZCB7SW5qZWN0b3IsIERpcmVjdGl2ZSwgQ29tcG9uZW50LCBQaXBlfVxuXG4vKipcbiAqIENvbnRleHQgdG8gdXNlIHdoZW4gcHJvZHVjaW5nIGEga2V5LlxuICpcbiAqIFRoaXMgZW5zdXJlcyB3ZSBzZWUgdGhlIGNvbnN0YW50IG5vdCB0aGUgcmVmZXJlbmNlIHZhcmlhYmxlIHdoZW4gcHJvZHVjaW5nXG4gKiBhIGtleS5cbiAqL1xuY29uc3QgS0VZX0NPTlRFWFQgPSB7fTtcblxuLyoqXG4gKiBBIG5vZGUgdGhhdCBpcyBhIHBsYWNlLWhvbGRlciB0aGF0IGFsbG93cyB0aGUgbm9kZSB0byBiZSByZXBsYWNlZCB3aGVuIHRoZSBhY3R1YWxcbiAqIG5vZGUgaXMga25vd24uXG4gKlxuICogVGhpcyBhbGxvd3MgdGhlIGNvbnN0YW50IHBvb2wgdG8gY2hhbmdlIGFuIGV4cHJlc3Npb24gZnJvbSBhIGRpcmVjdCByZWZlcmVuY2UgdG9cbiAqIGEgY29uc3RhbnQgdG8gYSBzaGFyZWQgY29uc3RhbnQuIEl0IHJldHVybnMgYSBmaXgtdXAgbm9kZSB0aGF0IGlzIGxhdGVyIGFsbG93ZWQgdG9cbiAqIGNoYW5nZSB0aGUgcmVmZXJlbmNlZCBleHByZXNzaW9uLlxuICovXG5jbGFzcyBGaXh1cEV4cHJlc3Npb24gZXh0ZW5kcyBvLkV4cHJlc3Npb24ge1xuICBwcml2YXRlIG9yaWdpbmFsOiBvLkV4cHJlc3Npb247XG5cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHNoYXJlZCAhOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZXNvbHZlZDogby5FeHByZXNzaW9uKSB7XG4gICAgc3VwZXIocmVzb2x2ZWQudHlwZSk7XG4gICAgdGhpcy5vcmlnaW5hbCA9IHJlc29sdmVkO1xuICB9XG5cbiAgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IG8uRXhwcmVzc2lvblZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgaWYgKGNvbnRleHQgPT09IEtFWV9DT05URVhUKSB7XG4gICAgICAvLyBXaGVuIHByb2R1Y2luZyBhIGtleSB3ZSB3YW50IHRvIHRyYXZlcnNlIHRoZSBjb25zdGFudCBub3QgdGhlXG4gICAgICAvLyB2YXJpYWJsZSB1c2VkIHRvIHJlZmVyIHRvIGl0LlxuICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWwudmlzaXRFeHByZXNzaW9uKHZpc2l0b3IsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlZC52aXNpdEV4cHJlc3Npb24odmlzaXRvciwgY29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgaXNFcXVpdmFsZW50KGU6IG8uRXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBlIGluc3RhbmNlb2YgRml4dXBFeHByZXNzaW9uICYmIHRoaXMucmVzb2x2ZWQuaXNFcXVpdmFsZW50KGUucmVzb2x2ZWQpO1xuICB9XG5cbiAgaXNDb25zdGFudCgpIHsgcmV0dXJuIHRydWU7IH1cblxuICBmaXh1cChleHByZXNzaW9uOiBvLkV4cHJlc3Npb24pIHtcbiAgICB0aGlzLnJlc29sdmVkID0gZXhwcmVzc2lvbjtcbiAgICB0aGlzLnNoYXJlZCA9IHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGNvbnN0YW50IHBvb2wgYWxsb3dzIGEgY29kZSBlbWl0dGVyIHRvIHNoYXJlIGNvbnN0YW50IGluIGFuIG91dHB1dCBjb250ZXh0LlxuICpcbiAqIFRoZSBjb25zdGFudCBwb29sIGFsc28gc3VwcG9ydHMgc2hhcmluZyBhY2Nlc3MgdG8gaXZ5IGRlZmluaXRpb25zIHJlZmVyZW5jZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb25zdGFudFBvb2wge1xuICBzdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdID0gW107XG4gIHByaXZhdGUgbGl0ZXJhbHMgPSBuZXcgTWFwPHN0cmluZywgRml4dXBFeHByZXNzaW9uPigpO1xuICBwcml2YXRlIGxpdGVyYWxGYWN0b3JpZXMgPSBuZXcgTWFwPHN0cmluZywgby5FeHByZXNzaW9uPigpO1xuICBwcml2YXRlIGluamVjdG9yRGVmaW5pdGlvbnMgPSBuZXcgTWFwPGFueSwgRml4dXBFeHByZXNzaW9uPigpO1xuICBwcml2YXRlIGRpcmVjdGl2ZURlZmluaXRpb25zID0gbmV3IE1hcDxhbnksIEZpeHVwRXhwcmVzc2lvbj4oKTtcbiAgcHJpdmF0ZSBjb21wb25lbnREZWZpbml0aW9ucyA9IG5ldyBNYXA8YW55LCBGaXh1cEV4cHJlc3Npb24+KCk7XG4gIHByaXZhdGUgcGlwZURlZmluaXRpb25zID0gbmV3IE1hcDxhbnksIEZpeHVwRXhwcmVzc2lvbj4oKTtcblxuICBwcml2YXRlIG5leHROYW1lSW5kZXggPSAwO1xuXG4gIGdldENvbnN0TGl0ZXJhbChsaXRlcmFsOiBvLkV4cHJlc3Npb24sIGZvcmNlU2hhcmVkPzogYm9vbGVhbik6IG8uRXhwcmVzc2lvbiB7XG4gICAgaWYgKGxpdGVyYWwgaW5zdGFuY2VvZiBvLkxpdGVyYWxFeHByIHx8IGxpdGVyYWwgaW5zdGFuY2VvZiBGaXh1cEV4cHJlc3Npb24pIHtcbiAgICAgIC8vIERvIG5vIHB1dCBzaW1wbGUgbGl0ZXJhbHMgaW50byB0aGUgY29uc3RhbnQgcG9vbCBvciB0cnkgdG8gcHJvZHVjZSBhIGNvbnN0YW50IGZvciBhXG4gICAgICAvLyByZWZlcmVuY2UgdG8gYSBjb25zdGFudC5cbiAgICAgIHJldHVybiBsaXRlcmFsO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSB0aGlzLmtleU9mKGxpdGVyYWwpO1xuICAgIGxldCBmaXh1cCA9IHRoaXMubGl0ZXJhbHMuZ2V0KGtleSk7XG4gICAgbGV0IG5ld1ZhbHVlID0gZmFsc2U7XG4gICAgaWYgKCFmaXh1cCkge1xuICAgICAgZml4dXAgPSBuZXcgRml4dXBFeHByZXNzaW9uKGxpdGVyYWwpO1xuICAgICAgdGhpcy5saXRlcmFscy5zZXQoa2V5LCBmaXh1cCk7XG4gICAgICBuZXdWYWx1ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCghbmV3VmFsdWUgJiYgIWZpeHVwLnNoYXJlZCkgfHwgKG5ld1ZhbHVlICYmIGZvcmNlU2hhcmVkKSkge1xuICAgICAgLy8gUmVwbGFjZSB0aGUgZXhwcmVzc2lvbiB3aXRoIGEgdmFyaWFibGVcbiAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmZyZXNoTmFtZSgpO1xuICAgICAgdGhpcy5zdGF0ZW1lbnRzLnB1c2goXG4gICAgICAgICAgby52YXJpYWJsZShuYW1lKS5zZXQobGl0ZXJhbCkudG9EZWNsU3RtdChvLklORkVSUkVEX1RZUEUsIFtvLlN0bXRNb2RpZmllci5GaW5hbF0pKTtcbiAgICAgIGZpeHVwLmZpeHVwKG8udmFyaWFibGUobmFtZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBmaXh1cDtcbiAgfVxuXG4gIGdldERlZmluaXRpb24odHlwZTogYW55LCBraW5kOiBEZWZpbml0aW9uS2luZCwgY3R4OiBPdXRwdXRDb250ZXh0LCBmb3JjZVNoYXJlZDogYm9vbGVhbiA9IGZhbHNlKTpcbiAgICAgIG8uRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgZGVmaW5pdGlvbnMgPSB0aGlzLmRlZmluaXRpb25zT2Yoa2luZCk7XG4gICAgbGV0IGZpeHVwID0gZGVmaW5pdGlvbnMuZ2V0KHR5cGUpO1xuICAgIGxldCBuZXdWYWx1ZSA9IGZhbHNlO1xuICAgIGlmICghZml4dXApIHtcbiAgICAgIGNvbnN0IHByb3BlcnR5ID0gdGhpcy5wcm9wZXJ0eU5hbWVPZihraW5kKTtcbiAgICAgIGZpeHVwID0gbmV3IEZpeHVwRXhwcmVzc2lvbihjdHguaW1wb3J0RXhwcih0eXBlKS5wcm9wKHByb3BlcnR5KSk7XG4gICAgICBkZWZpbml0aW9ucy5zZXQodHlwZSwgZml4dXApO1xuICAgICAgbmV3VmFsdWUgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICgoIW5ld1ZhbHVlICYmICFmaXh1cC5zaGFyZWQpIHx8IChuZXdWYWx1ZSAmJiBmb3JjZVNoYXJlZCkpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmZyZXNoTmFtZSgpO1xuICAgICAgdGhpcy5zdGF0ZW1lbnRzLnB1c2goXG4gICAgICAgICAgby52YXJpYWJsZShuYW1lKS5zZXQoZml4dXAucmVzb2x2ZWQpLnRvRGVjbFN0bXQoby5JTkZFUlJFRF9UWVBFLCBbby5TdG10TW9kaWZpZXIuRmluYWxdKSk7XG4gICAgICBmaXh1cC5maXh1cChvLnZhcmlhYmxlKG5hbWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpeHVwO1xuICB9XG5cbiAgZ2V0TGl0ZXJhbEZhY3RvcnkobGl0ZXJhbDogby5MaXRlcmFsQXJyYXlFeHByfG8uTGl0ZXJhbE1hcEV4cHIpOlxuICAgICAge2xpdGVyYWxGYWN0b3J5OiBvLkV4cHJlc3Npb24sIGxpdGVyYWxGYWN0b3J5QXJndW1lbnRzOiBvLkV4cHJlc3Npb25bXX0ge1xuICAgIC8vIENyZWF0ZSBhIHB1cmUgZnVuY3Rpb24gdGhhdCBidWlsZHMgYW4gYXJyYXkgb2YgYSBtaXggb2YgY29uc3RhbnQgYW5kIHZhcmlhYmxlIGV4cHJlc3Npb25zXG4gICAgaWYgKGxpdGVyYWwgaW5zdGFuY2VvZiBvLkxpdGVyYWxBcnJheUV4cHIpIHtcbiAgICAgIGNvbnN0IGFyZ3VtZW50c0ZvcktleSA9IGxpdGVyYWwuZW50cmllcy5tYXAoZSA9PiBlLmlzQ29uc3RhbnQoKSA/IGUgOiBVTktOT1dOX1ZBTFVFX0tFWSk7XG4gICAgICBjb25zdCBrZXkgPSB0aGlzLmtleU9mKG8ubGl0ZXJhbEFycihhcmd1bWVudHNGb3JLZXkpKTtcbiAgICAgIHJldHVybiB0aGlzLl9nZXRMaXRlcmFsRmFjdG9yeShrZXksIGxpdGVyYWwuZW50cmllcywgZW50cmllcyA9PiBvLmxpdGVyYWxBcnIoZW50cmllcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBleHByZXNzaW9uRm9yS2V5ID0gby5saXRlcmFsTWFwKFxuICAgICAgICAgIGxpdGVyYWwuZW50cmllcy5tYXAoZSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGUua2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZS52YWx1ZS5pc0NvbnN0YW50KCkgPyBlLnZhbHVlIDogVU5LTk9XTl9WQUxVRV9LRVksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1b3RlZDogZS5xdW90ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKSk7XG4gICAgICBjb25zdCBrZXkgPSB0aGlzLmtleU9mKGV4cHJlc3Npb25Gb3JLZXkpO1xuICAgICAgcmV0dXJuIHRoaXMuX2dldExpdGVyYWxGYWN0b3J5KFxuICAgICAgICAgIGtleSwgbGl0ZXJhbC5lbnRyaWVzLm1hcChlID0+IGUudmFsdWUpLFxuICAgICAgICAgIGVudHJpZXMgPT4gby5saXRlcmFsTWFwKGVudHJpZXMubWFwKCh2YWx1ZSwgaW5kZXgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGxpdGVyYWwuZW50cmllc1tpbmRleF0ua2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdW90ZWQ6IGxpdGVyYWwuZW50cmllc1tpbmRleF0ucXVvdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0TGl0ZXJhbEZhY3RvcnkoXG4gICAgICBrZXk6IHN0cmluZywgdmFsdWVzOiBvLkV4cHJlc3Npb25bXSwgcmVzdWx0TWFwOiAocGFyYW1ldGVyczogby5FeHByZXNzaW9uW10pID0+IG8uRXhwcmVzc2lvbik6XG4gICAgICB7bGl0ZXJhbEZhY3Rvcnk6IG8uRXhwcmVzc2lvbiwgbGl0ZXJhbEZhY3RvcnlBcmd1bWVudHM6IG8uRXhwcmVzc2lvbltdfSB7XG4gICAgbGV0IGxpdGVyYWxGYWN0b3J5ID0gdGhpcy5saXRlcmFsRmFjdG9yaWVzLmdldChrZXkpO1xuICAgIGNvbnN0IGxpdGVyYWxGYWN0b3J5QXJndW1lbnRzID0gdmFsdWVzLmZpbHRlcigoZSA9PiAhZS5pc0NvbnN0YW50KCkpKTtcbiAgICBpZiAoIWxpdGVyYWxGYWN0b3J5KSB7XG4gICAgICBjb25zdCByZXN1bHRFeHByZXNzaW9ucyA9IHZhbHVlcy5tYXAoXG4gICAgICAgICAgKGUsIGluZGV4KSA9PiBlLmlzQ29uc3RhbnQoKSA/IHRoaXMuZ2V0Q29uc3RMaXRlcmFsKGUsIHRydWUpIDogby52YXJpYWJsZShgYSR7aW5kZXh9YCkpO1xuICAgICAgY29uc3QgcGFyYW1ldGVycyA9XG4gICAgICAgICAgcmVzdWx0RXhwcmVzc2lvbnMuZmlsdGVyKGlzVmFyaWFibGUpLm1hcChlID0+IG5ldyBvLkZuUGFyYW0oZS5uYW1lICEsIG8uRFlOQU1JQ19UWVBFKSk7XG4gICAgICBjb25zdCBwdXJlRnVuY3Rpb25EZWNsYXJhdGlvbiA9XG4gICAgICAgICAgby5mbihwYXJhbWV0ZXJzLCBbbmV3IG8uUmV0dXJuU3RhdGVtZW50KHJlc3VsdE1hcChyZXN1bHRFeHByZXNzaW9ucykpXSwgby5JTkZFUlJFRF9UWVBFKTtcbiAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmZyZXNoTmFtZSgpO1xuICAgICAgdGhpcy5zdGF0ZW1lbnRzLnB1c2goXG4gICAgICAgICAgby52YXJpYWJsZShuYW1lKS5zZXQocHVyZUZ1bmN0aW9uRGVjbGFyYXRpb24pLnRvRGVjbFN0bXQoby5JTkZFUlJFRF9UWVBFLCBbXG4gICAgICAgICAgICBvLlN0bXRNb2RpZmllci5GaW5hbFxuICAgICAgICAgIF0pKTtcbiAgICAgIGxpdGVyYWxGYWN0b3J5ID0gby52YXJpYWJsZShuYW1lKTtcbiAgICAgIHRoaXMubGl0ZXJhbEZhY3Rvcmllcy5zZXQoa2V5LCBsaXRlcmFsRmFjdG9yeSk7XG4gICAgfVxuICAgIHJldHVybiB7bGl0ZXJhbEZhY3RvcnksIGxpdGVyYWxGYWN0b3J5QXJndW1lbnRzfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9kdWNlIGEgdW5pcXVlIG5hbWUuXG4gICAqXG4gICAqIFRoZSBuYW1lIG1pZ2h0IGJlIHVuaXF1ZSBhbW9uZyBkaWZmZXJlbnQgcHJlZml4ZXMgaWYgYW55IG9mIHRoZSBwcmVmaXhlcyBlbmQgaW5cbiAgICogYSBkaWdpdCBzbyB0aGUgcHJlZml4IHNob3VsZCBiZSBhIGNvbnN0YW50IHN0cmluZyAobm90IGJhc2VkIG9uIHVzZXIgaW5wdXQpIGFuZFxuICAgKiBtdXN0IG5vdCBlbmQgaW4gYSBkaWdpdC5cbiAgICovXG4gIHVuaXF1ZU5hbWUocHJlZml4OiBzdHJpbmcpOiBzdHJpbmcgeyByZXR1cm4gYCR7cHJlZml4fSR7dGhpcy5uZXh0TmFtZUluZGV4Kyt9YDsgfVxuXG4gIHByaXZhdGUgZGVmaW5pdGlvbnNPZihraW5kOiBEZWZpbml0aW9uS2luZCk6IE1hcDxhbnksIEZpeHVwRXhwcmVzc2lvbj4ge1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBEZWZpbml0aW9uS2luZC5Db21wb25lbnQ6XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudERlZmluaXRpb25zO1xuICAgICAgY2FzZSBEZWZpbml0aW9uS2luZC5EaXJlY3RpdmU6XG4gICAgICAgIHJldHVybiB0aGlzLmRpcmVjdGl2ZURlZmluaXRpb25zO1xuICAgICAgY2FzZSBEZWZpbml0aW9uS2luZC5JbmplY3RvcjpcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5qZWN0b3JEZWZpbml0aW9ucztcbiAgICAgIGNhc2UgRGVmaW5pdGlvbktpbmQuUGlwZTpcbiAgICAgICAgcmV0dXJuIHRoaXMucGlwZURlZmluaXRpb25zO1xuICAgIH1cbiAgICBlcnJvcihgVW5rbm93biBkZWZpbml0aW9uIGtpbmQgJHtraW5kfWApO1xuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudERlZmluaXRpb25zO1xuICB9XG5cbiAgcHVibGljIHByb3BlcnR5TmFtZU9mKGtpbmQ6IERlZmluaXRpb25LaW5kKTogc3RyaW5nIHtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgRGVmaW5pdGlvbktpbmQuQ29tcG9uZW50OlxuICAgICAgICByZXR1cm4gJ8m1Y21wJztcbiAgICAgIGNhc2UgRGVmaW5pdGlvbktpbmQuRGlyZWN0aXZlOlxuICAgICAgICByZXR1cm4gJ8m1ZGlyJztcbiAgICAgIGNhc2UgRGVmaW5pdGlvbktpbmQuSW5qZWN0b3I6XG4gICAgICAgIHJldHVybiAnybVpbmonO1xuICAgICAgY2FzZSBEZWZpbml0aW9uS2luZC5QaXBlOlxuICAgICAgICByZXR1cm4gJ8m1cGlwZSc7XG4gICAgfVxuICAgIGVycm9yKGBVbmtub3duIGRlZmluaXRpb24ga2luZCAke2tpbmR9YCk7XG4gICAgcmV0dXJuICc8dW5rbm93bj4nO1xuICB9XG5cbiAgcHJpdmF0ZSBmcmVzaE5hbWUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudW5pcXVlTmFtZShDT05TVEFOVF9QUkVGSVgpOyB9XG5cbiAgcHJpdmF0ZSBrZXlPZihleHByZXNzaW9uOiBvLkV4cHJlc3Npb24pIHtcbiAgICByZXR1cm4gZXhwcmVzc2lvbi52aXNpdEV4cHJlc3Npb24obmV3IEtleVZpc2l0b3IoKSwgS0VZX0NPTlRFWFQpO1xuICB9XG59XG5cbi8qKlxuICogVmlzaXRvciB1c2VkIHRvIGRldGVybWluZSBpZiAyIGV4cHJlc3Npb25zIGFyZSBlcXVpdmFsZW50IGFuZCBjYW4gYmUgc2hhcmVkIGluIHRoZVxuICogYENvbnN0YW50UG9vbGAuXG4gKlxuICogV2hlbiB0aGUgaWQgKHN0cmluZykgZ2VuZXJhdGVkIGJ5IHRoZSB2aXNpdG9yIGlzIGVxdWFsLCBleHByZXNzaW9ucyBhcmUgY29uc2lkZXJlZCBlcXVpdmFsZW50LlxuICovXG5jbGFzcyBLZXlWaXNpdG9yIGltcGxlbWVudHMgby5FeHByZXNzaW9uVmlzaXRvciB7XG4gIHZpc2l0TGl0ZXJhbEV4cHIoYXN0OiBvLkxpdGVyYWxFeHByKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7dHlwZW9mIGFzdC52YWx1ZSA9PT0gJ3N0cmluZycgPyAnXCInICsgYXN0LnZhbHVlICsgJ1wiJyA6IGFzdC52YWx1ZX1gO1xuICB9XG5cbiAgdmlzaXRMaXRlcmFsQXJyYXlFeHByKGFzdDogby5MaXRlcmFsQXJyYXlFeHByLCBjb250ZXh0OiBvYmplY3QpOiBzdHJpbmcge1xuICAgIHJldHVybiBgWyR7YXN0LmVudHJpZXMubWFwKGVudHJ5ID0+IGVudHJ5LnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSkuam9pbignLCcpfV1gO1xuICB9XG5cbiAgdmlzaXRMaXRlcmFsTWFwRXhwcihhc3Q6IG8uTGl0ZXJhbE1hcEV4cHIsIGNvbnRleHQ6IG9iamVjdCk6IHN0cmluZyB7XG4gICAgY29uc3QgbWFwS2V5ID0gKGVudHJ5OiBvLkxpdGVyYWxNYXBFbnRyeSkgPT4ge1xuICAgICAgY29uc3QgcXVvdGUgPSBlbnRyeS5xdW90ZWQgPyAnXCInIDogJyc7XG4gICAgICByZXR1cm4gYCR7cXVvdGV9JHtlbnRyeS5rZXl9JHtxdW90ZX1gO1xuICAgIH07XG4gICAgY29uc3QgbWFwRW50cnkgPSAoZW50cnk6IG8uTGl0ZXJhbE1hcEVudHJ5KSA9PlxuICAgICAgICBgJHttYXBLZXkoZW50cnkpfToke2VudHJ5LnZhbHVlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KX1gO1xuICAgIHJldHVybiBgeyR7YXN0LmVudHJpZXMubWFwKG1hcEVudHJ5KS5qb2luKCcsJyl9YDtcbiAgfVxuXG4gIHZpc2l0RXh0ZXJuYWxFeHByKGFzdDogby5FeHRlcm5hbEV4cHIpOiBzdHJpbmcge1xuICAgIHJldHVybiBhc3QudmFsdWUubW9kdWxlTmFtZSA/IGBFWDoke2FzdC52YWx1ZS5tb2R1bGVOYW1lfToke2FzdC52YWx1ZS5uYW1lfWAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBFWDoke2FzdC52YWx1ZS5ydW50aW1lLm5hbWV9YDtcbiAgfVxuXG4gIHZpc2l0UmVhZFZhckV4cHIobm9kZTogby5SZWFkVmFyRXhwcikgeyByZXR1cm4gYFZBUjoke25vZGUubmFtZX1gOyB9XG5cbiAgdmlzaXRUeXBlb2ZFeHByKG5vZGU6IG8uVHlwZW9mRXhwciwgY29udGV4dDogYW55KTogc3RyaW5nIHtcbiAgICByZXR1cm4gYFRZUEVPRjoke25vZGUuZXhwci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCl9YDtcbiAgfVxuXG4gIHZpc2l0V3JhcHBlZE5vZGVFeHByID0gaW52YWxpZDtcbiAgdmlzaXRXcml0ZVZhckV4cHIgPSBpbnZhbGlkO1xuICB2aXNpdFdyaXRlS2V5RXhwciA9IGludmFsaWQ7XG4gIHZpc2l0V3JpdGVQcm9wRXhwciA9IGludmFsaWQ7XG4gIHZpc2l0SW52b2tlTWV0aG9kRXhwciA9IGludmFsaWQ7XG4gIHZpc2l0SW52b2tlRnVuY3Rpb25FeHByID0gaW52YWxpZDtcbiAgdmlzaXRJbnN0YW50aWF0ZUV4cHIgPSBpbnZhbGlkO1xuICB2aXNpdENvbmRpdGlvbmFsRXhwciA9IGludmFsaWQ7XG4gIHZpc2l0Tm90RXhwciA9IGludmFsaWQ7XG4gIHZpc2l0QXNzZXJ0Tm90TnVsbEV4cHIgPSBpbnZhbGlkO1xuICB2aXNpdENhc3RFeHByID0gaW52YWxpZDtcbiAgdmlzaXRGdW5jdGlvbkV4cHIgPSBpbnZhbGlkO1xuICB2aXNpdEJpbmFyeU9wZXJhdG9yRXhwciA9IGludmFsaWQ7XG4gIHZpc2l0UmVhZFByb3BFeHByID0gaW52YWxpZDtcbiAgdmlzaXRSZWFkS2V5RXhwciA9IGludmFsaWQ7XG4gIHZpc2l0Q29tbWFFeHByID0gaW52YWxpZDtcbiAgdmlzaXRMb2NhbGl6ZWRTdHJpbmcgPSBpbnZhbGlkO1xufVxuXG5mdW5jdGlvbiBpbnZhbGlkPFQ+KHRoaXM6IG8uRXhwcmVzc2lvblZpc2l0b3IsIGFyZzogby5FeHByZXNzaW9uIHwgby5TdGF0ZW1lbnQpOiBuZXZlciB7XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIHN0YXRlOiBWaXNpdG9yICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSBkb2Vzbid0IGhhbmRsZSAke2FyZy5jb25zdHJ1Y3Rvci5uYW1lfWApO1xufVxuXG5mdW5jdGlvbiBpc1ZhcmlhYmxlKGU6IG8uRXhwcmVzc2lvbik6IGUgaXMgby5SZWFkVmFyRXhwciB7XG4gIHJldHVybiBlIGluc3RhbmNlb2Ygby5SZWFkVmFyRXhwcjtcbn1cbiJdfQ==