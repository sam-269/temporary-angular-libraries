/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __read, __spread } from "tslib";
import { identifierName } from '../compile_metadata';
import { mapLiteral } from '../output/map_util';
import * as o from '../output/output_ast';
import { R3FactoryTarget, compileFactoryFunction } from './r3_factory';
import { Identifiers as R3 } from './r3_identifiers';
import { convertMetaToOutput, jitOnlyGuardedExpression, mapToMapExpression } from './util';
/**
 * Construct an `R3NgModuleDef` for the given `R3NgModuleMetadata`.
 */
export function compileNgModule(meta) {
    var internalType = meta.internalType, moduleType = meta.type, bootstrap = meta.bootstrap, declarations = meta.declarations, imports = meta.imports, exports = meta.exports, schemas = meta.schemas, containsForwardDecls = meta.containsForwardDecls, emitInline = meta.emitInline, id = meta.id;
    var additionalStatements = [];
    var definitionMap = {
        type: internalType
    };
    // Only generate the keys in the metadata if the arrays have values.
    if (bootstrap.length) {
        definitionMap.bootstrap = refsToArray(bootstrap, containsForwardDecls);
    }
    // If requested to emit scope information inline, pass the declarations, imports and exports to
    // the `ɵɵdefineNgModule` call. The JIT compilation uses this.
    if (emitInline) {
        if (declarations.length) {
            definitionMap.declarations = refsToArray(declarations, containsForwardDecls);
        }
        if (imports.length) {
            definitionMap.imports = refsToArray(imports, containsForwardDecls);
        }
        if (exports.length) {
            definitionMap.exports = refsToArray(exports, containsForwardDecls);
        }
    }
    // If not emitting inline, the scope information is not passed into `ɵɵdefineNgModule` as it would
    // prevent tree-shaking of the declarations, imports and exports references.
    else {
        var setNgModuleScopeCall = generateSetNgModuleScopeCall(meta);
        if (setNgModuleScopeCall !== null) {
            additionalStatements.push(setNgModuleScopeCall);
        }
    }
    if (schemas && schemas.length) {
        definitionMap.schemas = o.literalArr(schemas.map(function (ref) { return ref.value; }));
    }
    if (id) {
        definitionMap.id = id;
    }
    var expression = o.importExpr(R3.defineNgModule).callFn([mapToMapExpression(definitionMap)]);
    var type = new o.ExpressionType(o.importExpr(R3.NgModuleDefWithMeta, [
        new o.ExpressionType(moduleType.type), tupleTypeOf(declarations), tupleTypeOf(imports),
        tupleTypeOf(exports)
    ]));
    return { expression: expression, type: type, additionalStatements: additionalStatements };
}
/**
 * Generates a function call to `ɵɵsetNgModuleScope` with all necessary information so that the
 * transitive module scope can be computed during runtime in JIT mode. This call is marked pure
 * such that the references to declarations, imports and exports may be elided causing these
 * symbols to become tree-shakeable.
 */
function generateSetNgModuleScopeCall(meta) {
    var moduleType = meta.adjacentType, declarations = meta.declarations, imports = meta.imports, exports = meta.exports, containsForwardDecls = meta.containsForwardDecls;
    var scopeMap = {};
    if (declarations.length) {
        scopeMap.declarations = refsToArray(declarations, containsForwardDecls);
    }
    if (imports.length) {
        scopeMap.imports = refsToArray(imports, containsForwardDecls);
    }
    if (exports.length) {
        scopeMap.exports = refsToArray(exports, containsForwardDecls);
    }
    if (Object.keys(scopeMap).length === 0) {
        return null;
    }
    // setNgModuleScope(...)
    var fnCall = new o.InvokeFunctionExpr(
    /* fn */ o.importExpr(R3.setNgModuleScope), 
    /* args */ [moduleType, mapToMapExpression(scopeMap)]);
    // (ngJitMode guard) && setNgModuleScope(...)
    var guardedCall = jitOnlyGuardedExpression(fnCall);
    // function() { (ngJitMode guard) && setNgModuleScope(...); }
    var iife = new o.FunctionExpr(
    /* params */ [], 
    /* statements */ [guardedCall.toStmt()]);
    // (function() { (ngJitMode guard) && setNgModuleScope(...); })()
    var iifeCall = new o.InvokeFunctionExpr(
    /* fn */ iife, 
    /* args */ []);
    return iifeCall.toStmt();
}
export function compileInjector(meta) {
    var result = compileFactoryFunction({
        name: meta.name,
        type: meta.type,
        internalType: meta.internalType,
        typeArgumentCount: 0,
        deps: meta.deps,
        injectFn: R3.inject,
        target: R3FactoryTarget.NgModule,
    });
    var definitionMap = {
        factory: result.factory,
    };
    if (meta.providers !== null) {
        definitionMap.providers = meta.providers;
    }
    if (meta.imports.length > 0) {
        definitionMap.imports = o.literalArr(meta.imports);
    }
    var expression = o.importExpr(R3.defineInjector).callFn([mapToMapExpression(definitionMap)]);
    var type = new o.ExpressionType(o.importExpr(R3.InjectorDef, [new o.ExpressionType(meta.type.type)]));
    return { expression: expression, type: type, statements: result.statements };
}
// TODO(alxhub): integrate this with `compileNgModule`. Currently the two are separate operations.
export function compileNgModuleFromRender2(ctx, ngModule, injectableCompiler) {
    var className = identifierName(ngModule.type);
    var rawImports = ngModule.rawImports ? [ngModule.rawImports] : [];
    var rawExports = ngModule.rawExports ? [ngModule.rawExports] : [];
    var injectorDefArg = mapLiteral({
        'factory': injectableCompiler.factoryFor({ type: ngModule.type, symbol: ngModule.type.reference }, ctx),
        'providers': convertMetaToOutput(ngModule.rawProviders, ctx),
        'imports': convertMetaToOutput(__spread(rawImports, rawExports), ctx),
    });
    var injectorDef = o.importExpr(R3.defineInjector).callFn([injectorDefArg]);
    ctx.statements.push(new o.ClassStmt(
    /* name */ className, 
    /* parent */ null, 
    /* fields */ [new o.ClassField(
        /* name */ 'ɵinj', 
        /* type */ o.INFERRED_TYPE, 
        /* modifiers */ [o.StmtModifier.Static], 
        /* initializer */ injectorDef)], 
    /* getters */ [], 
    /* constructorMethod */ new o.ClassMethod(null, [], []), 
    /* methods */ []));
}
function accessExportScope(module) {
    var selectorScope = new o.ReadPropExpr(module, 'ɵmod');
    return new o.ReadPropExpr(selectorScope, 'exported');
}
function tupleTypeOf(exp) {
    var types = exp.map(function (ref) { return o.typeofExpr(ref.type); });
    return exp.length > 0 ? o.expressionType(o.literalArr(types)) : o.NONE_TYPE;
}
function refsToArray(refs, shouldForwardDeclare) {
    var values = o.literalArr(refs.map(function (ref) { return ref.value; }));
    return shouldForwardDeclare ? o.fn([], [new o.ReturnStatement(values)]) : values;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfbW9kdWxlX2NvbXBpbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3JlbmRlcjMvcjNfbW9kdWxlX2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQStCLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRWpGLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEtBQUssQ0FBQyxNQUFNLHNCQUFzQixDQUFDO0FBRzFDLE9BQU8sRUFBdUIsZUFBZSxFQUFFLHNCQUFzQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzNGLE9BQU8sRUFBQyxXQUFXLElBQUksRUFBRSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDbkQsT0FBTyxFQUFjLG1CQUFtQixFQUFFLHdCQUF3QixFQUFFLGtCQUFrQixFQUFDLE1BQU0sUUFBUSxDQUFDO0FBNEV0Rzs7R0FFRztBQUNILE1BQU0sVUFBVSxlQUFlLENBQUMsSUFBd0I7SUFFcEQsSUFBQSxnQ0FBWSxFQUNaLHNCQUFnQixFQUNoQiwwQkFBUyxFQUNULGdDQUFZLEVBQ1osc0JBQU8sRUFDUCxzQkFBTyxFQUNQLHNCQUFPLEVBQ1AsZ0RBQW9CLEVBQ3BCLDRCQUFVLEVBQ1YsWUFBRSxDQUNLO0lBRVQsSUFBTSxvQkFBb0IsR0FBa0IsRUFBRSxDQUFDO0lBQy9DLElBQU0sYUFBYSxHQUFHO1FBQ3BCLElBQUksRUFBRSxZQUFZO0tBU25CLENBQUM7SUFFRixvRUFBb0U7SUFDcEUsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO1FBQ3BCLGFBQWEsQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0tBQ3hFO0lBRUQsK0ZBQStGO0lBQy9GLDhEQUE4RDtJQUM5RCxJQUFJLFVBQVUs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LENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQztJQUNyRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUM5RSxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsSUFBbUIsRUFBRSxvQkFBNkI7SUFDckUsSUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLEtBQUssRUFBVCxDQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ25GLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcGlsZVNoYWxsb3dNb2R1bGVNZXRhZGF0YSwgaWRlbnRpZmllck5hbWV9IGZyb20gJy4uL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0IHtJbmplY3RhYmxlQ29tcGlsZXJ9IGZyb20gJy4uL2luamVjdGFibGVfY29tcGlsZXInO1xuaW1wb3J0IHttYXBMaXRlcmFsfSBmcm9tICcuLi9vdXRwdXQvbWFwX3V0aWwnO1xuaW1wb3J0ICogYXMgbyBmcm9tICcuLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQge091dHB1dENvbnRleHR9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge1IzRGVwZW5kZW5jeU1ldGFkYXRhLCBSM0ZhY3RvcnlUYXJnZXQsIGNvbXBpbGVGYWN0b3J5RnVuY3Rpb259IGZyb20gJy4vcjNfZmFjdG9yeSc7XG5pbXBvcnQge0lkZW50aWZpZXJzIGFzIFIzfSBmcm9tICcuL3IzX2lkZW50aWZpZXJzJztcbmltcG9ydCB7UjNSZWZlcmVuY2UsIGNvbnZlcnRNZXRhVG9PdXRwdXQsIGppdE9ubHlHdWFyZGVkRXhwcmVzc2lvbiwgbWFwVG9NYXBFeHByZXNzaW9ufSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFIzTmdNb2R1bGVEZWYge1xuICBleHByZXNzaW9uOiBvLkV4cHJlc3Npb247XG4gIHR5cGU6IG8uVHlwZTtcbiAgYWRkaXRpb25hbFN0YXRlbWVudHM6IG8uU3RhdGVtZW50W107XG59XG5cbi8qKlxuICogTWV0YWRhdGEgcmVxdWlyZWQgYnkgdGhlIG1vZHVsZSBjb21waWxlciB0byBnZW5lcmF0ZSBhIG1vZHVsZSBkZWYgKGDJtW1vZGApIGZvciBhIHR5cGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUjNOZ01vZHVsZU1ldGFkYXRhIHtcbiAgLyoqXG4gICAqIEFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBtb2R1bGUgdHlwZSBiZWluZyBjb21waWxlZC5cbiAgICovXG4gIHR5cGU6IFIzUmVmZXJlbmNlO1xuXG4gIC8qKlxuICAgKiBBbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgbW9kdWxlIHR5cGUgYmVpbmcgY29tcGlsZWQsIGludGVuZGVkIGZvciB1c2Ugd2l0aGluIGEgY2xhc3NcbiAgICogZGVmaW5pdGlvbiBpdHNlbGYuXG4gICAqXG4gICAqIFRoaXMgY2FuIGRpZmZlciBmcm9tIHRoZSBvdXRlciBgdHlwZWAgaWYgdGhlIGNsYXNzIGlzIGJlaW5nIGNvbXBpbGVkIGJ5IG5nY2MgYW5kIGlzIGluc2lkZVxuICAgKiBhbiBJSUZFIHN0cnVjdHVyZSB0aGF0IHVzZXMgYSBkaWZmZXJlbnQgbmFtZSBpbnRlcm5hbGx5LlxuICAgKi9cbiAgaW50ZXJuYWxUeXBlOiBvLkV4cHJlc3Npb247XG5cbiAgLyoqXG4gICAqIEFuIGV4cHJlc3Npb24gaW50ZW5kZWQgZm9yIHVzZSBieSBzdGF0ZW1lbnRzIHRoYXQgYXJlIGFkamFjZW50IChpLmUuIHRpZ2h0bHkgY291cGxlZCkgdG8gYnV0XG4gICAqIG5vdCBpbnRlcm5hbCB0byBhIGNsYXNzIGRlZmluaXRpb24uXG4gICAqXG4gICAqIFRoaXMgY2FuIGRpZmZlciBmcm9tIHRoZSBvdXRlciBgdHlwZWAgaWYgdGhlIGNsYXNzIGlzIGJlaW5nIGNvbXBpbGVkIGJ5IG5nY2MgYW5kIGlzIGluc2lkZVxuICAgKiBhbiBJSUZFIHN0cnVjdHVyZSB0aGF0IHVzZXMgYSBkaWZmZXJlbnQgbmFtZSBpbnRlcm5hbGx5LlxuICAgKi9cbiAgYWRqYWNlbnRUeXBlOiBvLkV4cHJlc3Npb247XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGV4cHJlc3Npb25zIHJlcHJlc2VudGluZyB0aGUgYm9vdHN0cmFwIGNvbXBvbmVudHMgc3BlY2lmaWVkIGJ5IHRoZSBtb2R1bGUuXG4gICAqL1xuICBib290c3RyYXA6IFIzUmVmZXJlbmNlW107XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGV4cHJlc3Npb25zIHJlcHJlc2VudGluZyB0aGUgZGlyZWN0aXZlcyBhbmQgcGlwZXMgZGVjbGFyZWQgYnkgdGhlIG1vZHVsZS5cbiAgICovXG4gIGRlY2xhcmF0aW9uczogUjNSZWZlcmVuY2VbXTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZXhwcmVzc2lvbnMgcmVwcmVzZW50aW5nIHRoZSBpbXBvcnRzIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBpbXBvcnRzOiBSM1JlZmVyZW5jZVtdO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBleHByZXNzaW9ucyByZXByZXNlbnRpbmcgdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGV4cG9ydHM6IFIzUmVmZXJlbmNlW107XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZW1pdCB0aGUgc2VsZWN0b3Igc2NvcGUgdmFsdWVzIChkZWNsYXJhdGlvbnMsIGltcG9ydHMsIGV4cG9ydHMpIGlubGluZSBpbnRvIHRoZVxuICAgKiBtb2R1bGUgZGVmaW5pdGlvbiwgb3IgdG8gZ2VuZXJhdGUgYWRkaXRpb25hbCBzdGF0ZW1lbnRzIHdoaWNoIHBhdGNoIHRoZW0gb24uIElubGluZSBlbWlzc2lvblxuICAgKiBkb2VzIG5vdCBhbGxvdyBjb21wb25lbnRzIHRvIGJlIHRyZWUtc2hha2VuLCBidXQgaXMgdXNlZnVsIGZvciBKSVQgbW9kZS5cbiAgICovXG4gIGVtaXRJbmxpbmU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZ2VuZXJhdGUgY2xvc3VyZSB3cmFwcGVycyBmb3IgYm9vdHN0cmFwLCBkZWNsYXJhdGlvbnMsIGltcG9ydHMsIGFuZCBleHBvcnRzLlxuICAgKi9cbiAgY29udGFpbnNGb3J3YXJkRGVjbHM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBzZXQgb2Ygc2NoZW1hcyB0aGF0IGRlY2xhcmUgZWxlbWVudHMgdG8gYmUgYWxsb3dlZCBpbiB0aGUgTmdNb2R1bGUuXG4gICAqL1xuICBzY2hlbWFzOiBSM1JlZmVyZW5jZVtdfG51bGw7XG5cbiAgLyoqIFVuaXF1ZSBJRCBvciBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgdW5pcXVlIElEIG9mIGFuIE5nTW9kdWxlLiAqL1xuICBpZDogby5FeHByZXNzaW9ufG51bGw7XG59XG5cbi8qKlxuICogQ29uc3RydWN0IGFuIGBSM05nTW9kdWxlRGVmYCBmb3IgdGhlIGdpdmVuIGBSM05nTW9kdWxlTWV0YWRhdGFgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZU5nTW9kdWxlKG1ldGE6IFIzTmdNb2R1bGVNZXRhZGF0YSk6IFIzTmdNb2R1bGVEZWYge1xuICBjb25zdCB7XG4gICAgaW50ZXJuYWxUeXBlLFxuICAgIHR5cGU6IG1vZHVsZVR5cGUsXG4gICAgYm9vdHN0cmFwLFxuICAgIGRlY2xhcmF0aW9ucyxcbiAgICBpbXBvcnRzLFxuICAgIGV4cG9ydHMsXG4gICAgc2NoZW1hcyxcbiAgICBjb250YWluc0ZvcndhcmREZWNscyxcbiAgICBlbWl0SW5saW5lLFxuICAgIGlkXG4gIH0gPSBtZXRhO1xuXG4gIGNvbnN0IGFkZGl0aW9uYWxTdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdID0gW107XG4gIGNvbnN0IGRlZmluaXRpb25NYXAgPSB7XG4gICAgdHlwZTogaW50ZXJuYWxUeXBlXG4gIH0gYXN7XG4gICAgdHlwZTogby5FeHByZXNzaW9uLFxuICAgIGJvb3RzdHJhcDogby5FeHByZXNzaW9uLFxuICAgIGRlY2xhcmF0aW9uczogby5FeHByZXNzaW9uLFxuICAgIGltcG9ydHM6IG8uRXhwcmVzc2lvbixcbiAgICBleHBvcnRzOiBvLkV4cHJlc3Npb24sXG4gICAgc2NoZW1hczogby5MaXRlcmFsQXJyYXlFeHByLFxuICAgIGlkOiBvLkV4cHJlc3Npb25cbiAgfTtcblxuICAvLyBPbmx5IGdlbmVyYXRlIHRoZSBrZXlzIGluIHRoZSBtZXRhZGF0YSBpZiB0aGUgYXJyYXlzIGhhdmUgdmFsdWVzLlxuICBpZiAoYm9vdHN0cmFwLmxlbmd0aCkge1xuICAgIGRlZmluaXRpb25NYXAuYm9vdHN0cmFwID0gcmVmc1RvQXJyYXkoYm9vdHN0cmFwLCBjb250YWluc0ZvcndhcmREZWNscyk7XG4gIH1cblxuICAvLyBJZiByZXF1ZXN0ZWQgdG8gZW1pdCBzY29wZSBpbmZvcm1hdGlvbiBpbmxpbmUsIHBhc3MgdGhlIGRlY2xhcmF0aW9ucywgaW1wb3J0cyBhbmQgZXhwb3J0cyB0b1xuICAvLyB0aGUgYMm1ybVkZWZpbmVOZ01vZHVsZWAgY2FsbC4gVGhlIEpJVCBjb21waWxhdGlvbiB1c2VzIHRoaXMuXG4gIGlmIChlbWl0SW5saW5lKSB7XG4gICAgaWYgKGRlY2xhcmF0aW9ucy5sZW5ndGgpIHtcbiAgICAgIGRlZmluaXRpb25NYXAuZGVjbGFyYXRpb25zID0gcmVmc1RvQXJyYXkoZGVjbGFyYXRpb25zLCBjb250YWluc0ZvcndhcmREZWNscyk7XG4gICAgfVxuXG4gICAgaWYgKGltcG9ydHMubGVuZ3RoKSB7XG4gICAgICBkZWZpbml0aW9uTWFwLmltcG9ydHMgPSByZWZzVG9BcnJheShpbXBvcnRzLCBjb250YWluc0ZvcndhcmREZWNscyk7XG4gICAgfVxuXG4gICAgaWYgKGV4cG9ydHMubGVuZ3RoKSB7XG4gICAgICBkZWZpbml0aW9uTWFwLmV4cG9ydHMgPSByZWZzVG9BcnJheShleHBvcnRzLCBjb250YWluc0ZvcndhcmREZWNscyk7XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgbm90IGVtaXR0aW5nIGlubGluZSwgdGhlIHNjb3BlIGluZm9ybWF0aW9uIGlzIG5vdCBwYXNzZWQgaW50byBgybXJtWRlZmluZU5nTW9kdWxlYCBhcyBpdCB3b3VsZFxuICAvLyBwcmV2ZW50IHRyZWUtc2hha2luZyBvZiB0aGUgZGVjbGFyYXRpb25zLCBpbXBvcnRzIGFuZCBleHBvcnRzIHJlZmVyZW5jZXMuXG4gIGVsc2Uge1xuICAgIGNvbnN0IHNldE5nTW9kdWxlU2NvcGVDYWxsID0gZ2VuZXJhdGVTZXROZ01vZHVsZVNjb3BlQ2FsbChtZXRhKTtcbiAgICBpZiAoc2V0TmdNb2R1bGVTY29wZUNhbGwgIT09IG51bGwpIHtcbiAgICAgIGFkZGl0aW9uYWxTdGF0ZW1lbnRzLnB1c2goc2V0TmdNb2R1bGVTY29wZUNhbGwpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzY2hlbWFzICYmIHNjaGVtYXMubGVuZ3RoKSB7XG4gICAgZGVmaW5pdGlvbk1hcC5zY2hlbWFzID0gby5saXRlcmFsQXJyKHNjaGVtYXMubWFwKHJlZiA9PiByZWYudmFsdWUpKTtcbiAgfVxuXG4gIGlmIChpZCkge1xuICAgIGRlZmluaXRpb25NYXAuaWQgPSBpZDtcbiAgfVxuXG4gIGNvbnN0IGV4cHJlc3Npb24gPSBvLmltcG9ydEV4cHIoUjMuZGVmaW5lTmdNb2R1bGUpLmNhbGxGbihbbWFwVG9NYXBFeHByZXNzaW9uKGRlZmluaXRpb25NYXApXSk7XG4gIGNvbnN0IHR5cGUgPSBuZXcgby5FeHByZXNzaW9uVHlwZShvLmltcG9ydEV4cHIoUjMuTmdNb2R1bGVEZWZXaXRoTWV0YSwgW1xuICAgIG5ldyBvLkV4cHJlc3Npb25UeXBlKG1vZHVsZVR5cGUudHlwZSksIHR1cGxlVHlwZU9mKGRlY2xhcmF0aW9ucyksIHR1cGxlVHlwZU9mKGltcG9ydHMpLFxuICAgIHR1cGxlVHlwZU9mKGV4cG9ydHMpXG4gIF0pKTtcblxuXG4gIHJldHVybiB7ZXhwcmVzc2lvbiwgdHlwZSwgYWRkaXRpb25hbFN0YXRlbWVudHN9O1xufVxuXG4vKipcbiAqIEdlbmVyYXRlcyBhIGZ1bmN0aW9uIGNhbGwgdG8gYMm1ybVzZXROZ01vZHVsZVNjb3BlYCB3aXRoIGFsbCBuZWNlc3NhcnkgaW5mb3JtYXRpb24gc28gdGhhdCB0aGVcbiAqIHRyYW5zaXRpdmUgbW9kdWxlIHNjb3BlIGNhbiBiZSBjb21wdXRlZCBkdXJpbmcgcnVudGltZSBpbiBKSVQgbW9kZS4gVGhpcyBjYWxsIGlzIG1hcmtlZCBwdXJlXG4gKiBzdWNoIHRoYXQgdGhlIHJlZmVyZW5jZXMgdG8gZGVjbGFyYXRpb25zLCBpbXBvcnRzIGFuZCBleHBvcnRzIG1heSBiZSBlbGlkZWQgY2F1c2luZyB0aGVzZVxuICogc3ltYm9scyB0byBiZWNvbWUgdHJlZS1zaGFrZWFibGUuXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlU2V0TmdNb2R1bGVTY29wZUNhbGwobWV0YTogUjNOZ01vZHVsZU1ldGFkYXRhKTogby5TdGF0ZW1lbnR8bnVsbCB7XG4gIGNvbnN0IHthZGphY2VudFR5cGU6IG1vZHVsZVR5cGUsIGRlY2xhcmF0aW9ucywgaW1wb3J0cywgZXhwb3J0cywgY29udGFpbnNGb3J3YXJkRGVjbHN9ID0gbWV0YTtcblxuICBjb25zdCBzY29wZU1hcCA9IHt9IGFze1xuICAgIGRlY2xhcmF0aW9uczogby5FeHByZXNzaW9uLFxuICAgIGltcG9ydHM6IG8uRXhwcmVzc2lvbixcbiAgICBleHBvcnRzOiBvLkV4cHJlc3Npb24sXG4gIH07XG5cbiAgaWYgKGRlY2xhcmF0aW9ucy5sZW5ndGgpIHtcbiAgICBzY29wZU1hcC5kZWNsYXJhdGlvbnMgPSByZWZzVG9BcnJheShkZWNsYXJhdGlvbnMsIGNvbnRhaW5zRm9yd2FyZERlY2xzKTtcbiAgfVxuXG4gIGlmIChpbXBvcnRzLmxlbmd0aCkge1xuICAgIHNjb3BlTWFwLmltcG9ydHMgPSByZWZzVG9BcnJheShpbXBvcnRzLCBjb250YWluc0ZvcndhcmREZWNscyk7XG4gIH1cblxuICBpZiAoZXhwb3J0cy5sZW5ndGgpIHtcbiAgICBzY29wZU1hcC5leHBvcnRzID0gcmVmc1RvQXJyYXkoZXhwb3J0cywgY29udGFpbnNGb3J3YXJkRGVjbHMpO1xuICB9XG5cbiAgaWYgKE9iamVjdC5rZXlzKHNjb3BlTWFwKS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIHNldE5nTW9kdWxlU2NvcGUoLi4uKVxuICBjb25zdCBmbkNhbGwgPSBuZXcgby5JbnZva2VGdW5jdGlvbkV4cHIoXG4gICAgICAvKiBmbiAqLyBvLmltcG9ydEV4cHIoUjMuc2V0TmdNb2R1bGVTY29wZSksXG4gICAgICAvKiBhcmdzICovW21vZHVsZVR5cGUsIG1hcFRvTWFwRXhwcmVzc2lvbihzY29wZU1hcCldKTtcblxuICAvLyAobmdKaXRNb2RlIGd1YXJkKSAmJiBzZXROZ01vZHVsZVNjb3BlKC4uLilcbiAgY29uc3QgZ3VhcmRlZENhbGwgPSBqaXRPbmx5R3VhcmRlZEV4cHJlc3Npb24oZm5DYWxsKTtcblxuICAvLyBmdW5jdGlvbigpIHsgKG5nSml0TW9kZSBndWFyZCkgJiYgc2V0TmdNb2R1bGVTY29wZSguLi4pOyB9XG4gIGNvbnN0IGlpZmUgPSBuZXcgby5GdW5jdGlvbkV4cHIoXG4gICAgICAvKiBwYXJhbXMgKi9bXSxcbiAgICAgIC8qIHN0YXRlbWVudHMgKi9bZ3VhcmRlZENhbGwudG9TdG10KCldKTtcblxuICAvLyAoZnVuY3Rpb24oKSB7IChuZ0ppdE1vZGUgZ3VhcmQpICYmIHNldE5nTW9kdWxlU2NvcGUoLi4uKTsgfSkoKVxuICBjb25zdCBpaWZlQ2FsbCA9IG5ldyBvLkludm9rZUZ1bmN0aW9uRXhwcihcbiAgICAgIC8qIGZuICovIGlpZmUsXG4gICAgICAvKiBhcmdzICovW10pO1xuXG4gIHJldHVybiBpaWZlQ2FsbC50b1N0bXQoKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSM0luamVjdG9yRGVmIHtcbiAgZXhwcmVzc2lvbjogby5FeHByZXNzaW9uO1xuICB0eXBlOiBvLlR5cGU7XG4gIHN0YXRlbWVudHM6IG8uU3RhdGVtZW50W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUjNJbmplY3Rvck1ldGFkYXRhIHtcbiAgbmFtZTogc3RyaW5nO1xuICB0eXBlOiBSM1JlZmVyZW5jZTtcbiAgaW50ZXJuYWxUeXBlOiBvLkV4cHJlc3Npb247XG4gIGRlcHM6IFIzRGVwZW5kZW5jeU1ldGFkYXRhW118bnVsbDtcbiAgcHJvdmlkZXJzOiBvLkV4cHJlc3Npb258bnVsbDtcbiAgaW1wb3J0czogby5FeHByZXNzaW9uW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlSW5qZWN0b3IobWV0YTogUjNJbmplY3Rvck1ldGFkYXRhKTogUjNJbmplY3RvckRlZiB7XG4gIGNvbnN0IHJlc3VsdCA9IGNvbXBpbGVGYWN0b3J5RnVuY3Rpb24oe1xuICAgIG5hbWU6IG1ldGEubmFtZSxcbiAgICB0eXBlOiBtZXRhLnR5cGUsXG4gICAgaW50ZXJuYWxUeXBlOiBtZXRhLmludGVybmFsVHlwZSxcbiAgICB0eXBlQXJndW1lbnRDb3VudDogMCxcbiAgICBkZXBzOiBtZXRhLmRlcHMsXG4gICAgaW5qZWN0Rm46IFIzLmluamVjdCxcbiAgICB0YXJnZXQ6IFIzRmFjdG9yeVRhcmdldC5OZ01vZHVsZSxcbiAgfSk7XG4gIGNvbnN0IGRlZmluaXRpb25NYXAgPSB7XG4gICAgZmFjdG9yeTogcmVzdWx0LmZhY3RvcnksXG4gIH0gYXN7ZmFjdG9yeTogby5FeHByZXNzaW9uLCBwcm92aWRlcnM6IG8uRXhwcmVzc2lvbiwgaW1wb3J0czogby5FeHByZXNzaW9ufTtcblxuICBpZiAobWV0YS5wcm92aWRlcnMgIT09IG51bGwpIHtcbiAgICBkZWZpbml0aW9uTWFwLnByb3ZpZGVycyA9IG1ldGEucHJvdmlkZXJzO1xuICB9XG5cbiAgaWYgKG1ldGEuaW1wb3J0cy5sZW5ndGggPiAwKSB7XG4gICAgZGVmaW5pdGlvbk1hcC5pbXBvcnRzID0gby5saXRlcmFsQXJyKG1ldGEuaW1wb3J0cyk7XG4gIH1cblxuICBjb25zdCBleHByZXNzaW9uID0gby5pbXBvcnRFeHByKFIzLmRlZmluZUluamVjdG9yKS5jYWxsRm4oW21hcFRvTWFwRXhwcmVzc2lvbihkZWZpbml0aW9uTWFwKV0pO1xuICBjb25zdCB0eXBlID1cbiAgICAgIG5ldyBvLkV4cHJlc3Npb25UeXBlKG8uaW1wb3J0RXhwcihSMy5JbmplY3RvckRlZiwgW25ldyBvLkV4cHJlc3Npb25UeXBlKG1ldGEudHlwZS50eXBlKV0pKTtcbiAgcmV0dXJuIHtleHByZXNzaW9uLCB0eXBlLCBzdGF0ZW1lbnRzOiByZXN1bHQuc3RhdGVtZW50c307XG59XG5cbi8vIFRPRE8oYWx4aHViKTogaW50ZWdyYXRlIHRoaXMgd2l0aCBgY29tcGlsZU5nTW9kdWxlYC4gQ3VycmVudGx5IHRoZSB0d28gYXJlIHNlcGFyYXRlIG9wZXJhdGlvbnMuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZU5nTW9kdWxlRnJvbVJlbmRlcjIoXG4gICAgY3R4OiBPdXRwdXRDb250ZXh0LCBuZ01vZHVsZTogQ29tcGlsZVNoYWxsb3dNb2R1bGVNZXRhZGF0YSxcbiAgICBpbmplY3RhYmxlQ29tcGlsZXI6IEluamVjdGFibGVDb21waWxlcik6IHZvaWQge1xuICBjb25zdCBjbGFzc05hbWUgPSBpZGVudGlmaWVyTmFtZShuZ01vZHVsZS50eXBlKSAhO1xuXG4gIGNvbnN0IHJhd0ltcG9ydHMgPSBuZ01vZHVsZS5yYXdJbXBvcnRzID8gW25nTW9kdWxlLnJhd0ltcG9ydHNdIDogW107XG4gIGNvbnN0IHJhd0V4cG9ydHMgPSBuZ01vZHVsZS5yYXdFeHBvcnRzID8gW25nTW9kdWxlLnJhd0V4cG9ydHNdIDogW107XG5cbiAgY29uc3QgaW5qZWN0b3JEZWZBcmcgPSBtYXBMaXRlcmFsKHtcbiAgICAnZmFjdG9yeSc6XG4gICAgICAgIGluamVjdGFibGVDb21waWxlci5mYWN0b3J5Rm9yKHt0eXBlOiBuZ01vZHVsZS50eXBlLCBzeW1ib2w6IG5nTW9kdWxlLnR5cGUucmVmZXJlbmNlfSwgY3R4KSxcbiAgICAncHJvdmlkZXJzJzogY29udmVydE1ldGFUb091dHB1dChuZ01vZHVsZS5yYXdQcm92aWRlcnMsIGN0eCksXG4gICAgJ2ltcG9ydHMnOiBjb252ZXJ0TWV0YVRvT3V0cHV0KFsuLi5yYXdJbXBvcnRzLCAuLi5yYXdFeHBvcnRzXSwgY3R4KSxcbiAgfSk7XG5cbiAgY29uc3QgaW5qZWN0b3JEZWYgPSBvLmltcG9ydEV4cHIoUjMuZGVmaW5lSW5qZWN0b3IpLmNhbGxGbihbaW5qZWN0b3JEZWZBcmddKTtcblxuICBjdHguc3RhdGVtZW50cy5wdXNoKG5ldyBvLkNsYXNzU3RtdChcbiAgICAgIC8qIG5hbWUgKi8gY2xhc3NOYW1lLFxuICAgICAgLyogcGFyZW50ICovIG51bGwsXG4gICAgICAvKiBmaWVsZHMgKi9bbmV3IG8uQ2xhc3NGaWVsZChcbiAgICAgICAgICAvKiBuYW1lICovICfJtWluaicsXG4gICAgICAgICAgLyogdHlwZSAqLyBvLklORkVSUkVEX1RZUEUsXG4gICAgICAgICAgLyogbW9kaWZpZXJzICovW28uU3RtdE1vZGlmaWVyLlN0YXRpY10sXG4gICAgICAgICAgLyogaW5pdGlhbGl6ZXIgKi8gaW5qZWN0b3JEZWYsICldLFxuICAgICAgLyogZ2V0dGVycyAqL1tdLFxuICAgICAgLyogY29uc3RydWN0b3JNZXRob2QgKi8gbmV3IG8uQ2xhc3NNZXRob2QobnVsbCwgW10sIFtdKSxcbiAgICAgIC8qIG1ldGhvZHMgKi9bXSkpO1xufVxuXG5mdW5jdGlvbiBhY2Nlc3NFeHBvcnRTY29wZShtb2R1bGU6IG8uRXhwcmVzc2lvbik6IG8uRXhwcmVzc2lvbiB7XG4gIGNvbnN0IHNlbGVjdG9yU2NvcGUgPSBuZXcgby5SZWFkUHJvcEV4cHIobW9kdWxlLCAnybVtb2QnKTtcbiAgcmV0dXJuIG5ldyBvLlJlYWRQcm9wRXhwcihzZWxlY3RvclNjb3BlLCAnZXhwb3J0ZWQnKTtcbn1cblxuZnVuY3Rpb24gdHVwbGVUeXBlT2YoZXhwOiBSM1JlZmVyZW5jZVtdKTogby5UeXBlIHtcbiAgY29uc3QgdHlwZXMgPSBleHAubWFwKHJlZiA9PiBvLnR5cGVvZkV4cHIocmVmLnR5cGUpKTtcbiAgcmV0dXJuIGV4cC5sZW5ndGggPiAwID8gby5leHByZXNzaW9uVHlwZShvLmxpdGVyYWxBcnIodHlwZXMpKSA6IG8uTk9ORV9UWVBFO1xufVxuXG5mdW5jdGlvbiByZWZzVG9BcnJheShyZWZzOiBSM1JlZmVyZW5jZVtdLCBzaG91bGRGb3J3YXJkRGVjbGFyZTogYm9vbGVhbik6IG8uRXhwcmVzc2lvbiB7XG4gIGNvbnN0IHZhbHVlcyA9IG8ubGl0ZXJhbEFycihyZWZzLm1hcChyZWYgPT4gcmVmLnZhbHVlKSk7XG4gIHJldHVybiBzaG91bGRGb3J3YXJkRGVjbGFyZSA/IG8uZm4oW10sIFtuZXcgby5SZXR1cm5TdGF0ZW1lbnQodmFsdWVzKV0pIDogdmFsdWVzO1xufVxuIl19