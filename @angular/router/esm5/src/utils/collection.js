/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵisObservable as isObservable, ɵisPromise as isPromise } from '@angular/core';
import { from, of } from 'rxjs';
import { concatAll, last as lastValue, map } from 'rxjs/operators';
import { PRIMARY_OUTLET } from '../shared';
export function shallowEqualArrays(a, b) {
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; ++i) {
        if (!shallowEqual(a[i], b[i]))
            return false;
    }
    return true;
}
export function shallowEqual(a, b) {
    // Casting Object.keys return values to include `undefined` as there are some cases
    // in IE 11 where this can happen. Cannot provide a test because the behavior only
    // exists in certain circumstances in IE 11, therefore doing this cast ensures the
    // logic is correct for when this edge case is hit.
    var k1 = Object.keys(a);
    var k2 = Object.keys(b);
    if (!k1 || !k2 || k1.length != k2.length) {
        return false;
    }
    var key;
    for (var i = 0; i < k1.length; i++) {
        key = k1[i];
        if (!equalArraysOrString(a[key], b[key])) {
            return false;
        }
    }
    return true;
}
/**
 * Test equality for arrays of strings or a string.
 */
export function equalArraysOrString(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length != b.length)
            return false;
        return a.every(function (aItem) { return b.indexOf(aItem) > -1; });
    }
    else {
        return a === b;
    }
}
/**
 * Flattens single-level nested arrays.
 */
export function flatten(arr) {
    return Array.prototype.concat.apply([], arr);
}
/**
 * Return the last element of an array.
 */
export function last(a) {
    return a.length > 0 ? a[a.length - 1] : null;
}
/**
 * Verifys all booleans in an array are `true`.
 */
export function and(bools) {
    return !bools.some(function (v) { return !v; });
}
export function forEach(map, callback) {
    for (var prop in map) {
        if (map.hasOwnProperty(prop)) {
            callback(map[prop], prop);
        }
    }
}
export function waitForMap(obj, fn) {
    if (Object.keys(obj).length === 0) {
        return of({});
    }
    var waitHead = [];
    var waitTail = [];
    var res = {};
    forEach(obj, function (a, k) {
        var mapped = fn(k, a).pipe(map(function (r) { return res[k] = r; }));
        if (k === PRIMARY_OUTLET) {
            waitHead.push(mapped);
        }
        else {
            waitTail.push(mapped);
        }
    });
    // Closure compiler has problem with using spread operator here. So we use "Array.concat".
    // Note that we also need to cast the new promise because TypeScript cannot infer the type
    // when calling the "of" function through "Function.apply"
    return of.apply(null, waitHead.concat(waitTail))
        .pipe(concatAll(), lastValue(), map(function () { return res; }));
}
export function wrapIntoObservable(value) {
    if (isObservable(value)) {
        return value;
    }
    if (isPromise(value)) {
        // Use `Promise.resolve()` to wrap promise-like instances.
        // Required ie when a Resolver returns a AngularJS `$q` promise to correctly trigger the
        // change detection.
        return from(Promise.resolve(value));
    }
    return of(value);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci9zcmMvdXRpbHMvY29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWtCLGFBQWEsSUFBSSxZQUFZLEVBQUUsVUFBVSxJQUFJLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN0RyxPQUFPLEVBQWEsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUMsU0FBUyxFQUFFLElBQUksSUFBSSxTQUFTLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFakUsT0FBTyxFQUFDLGNBQWMsRUFBUyxNQUFNLFdBQVcsQ0FBQztBQUVqRCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsQ0FBUSxFQUFFLENBQVE7SUFDbkQsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxNQUFNO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDeEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDakMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUM7S0FDN0M7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxNQUFNLFVBQVUsWUFBWSxDQUFDLENBQVMsRUFBRSxDQUFTO0lBQy9DLG1GQUFtRjtJQUNuRixrRkFBa0Y7SUFDbEYsa0ZBQWtGO0lBQ2xGLG1EQUFtRDtJQUNuRCxJQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBeUIsQ0FBQztJQUNsRCxJQUFNLEVBQUUsR0FB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LEdBQUcsQ0FBQyxVQUFDLENBQUksSUFBSyxPQUFBLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBVSxDQUFDLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsS0FBSyxjQUFjLEVBQUU7WUFDeEIsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN2QjthQUFNO1lBQ0wsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN2QjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsMEZBQTBGO0lBQzFGLDBGQUEwRjtJQUMxRiwwREFBMEQ7SUFDMUQsT0FBUSxFQUFFLENBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUErQjtTQUMzRSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsR0FBRyxDQUFDLGNBQU0sT0FBQSxHQUFHLEVBQUgsQ0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBRUQsTUFBTSxVQUFVLGtCQUFrQixDQUFJLEtBQW9DO0lBQ3hFLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNwQiwwREFBMEQ7UUFDMUQsd0ZBQXdGO1FBQ3hGLG9CQUFvQjtRQUNwQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDckM7SUFFRCxPQUFPLEVBQUUsQ0FBRSxLQUFLLENBQUMsQ0FBQztBQUNwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlRmFjdG9yeSwgybVpc09ic2VydmFibGUgYXMgaXNPYnNlcnZhYmxlLCDJtWlzUHJvbWlzZSBhcyBpc1Byb21pc2V9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBmcm9tLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtjb25jYXRBbGwsIGxhc3QgYXMgbGFzdFZhbHVlLCBtYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtQUklNQVJZX09VVExFVCwgUGFyYW1zfSBmcm9tICcuLi9zaGFyZWQnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2hhbGxvd0VxdWFsQXJyYXlzKGE6IGFueVtdLCBiOiBhbnlbXSk6IGJvb2xlYW4ge1xuICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYS5sZW5ndGg7ICsraSkge1xuICAgIGlmICghc2hhbGxvd0VxdWFsKGFbaV0sIGJbaV0pKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaGFsbG93RXF1YWwoYTogUGFyYW1zLCBiOiBQYXJhbXMpOiBib29sZWFuIHtcbiAgLy8gQ2FzdGluZyBPYmplY3Qua2V5cyByZXR1cm4gdmFsdWVzIHRvIGluY2x1ZGUgYHVuZGVmaW5lZGAgYXMgdGhlcmUgYXJlIHNvbWUgY2FzZXNcbiAgLy8gaW4gSUUgMTEgd2hlcmUgdGhpcyBjYW4gaGFwcGVuLiBDYW5ub3QgcHJvdmlkZSBhIHRlc3QgYmVjYXVzZSB0aGUgYmVoYXZpb3Igb25seVxuICAvLyBleGlzdHMgaW4gY2VydGFpbiBjaXJjdW1zdGFuY2VzIGluIElFIDExLCB0aGVyZWZvcmUgZG9pbmcgdGhpcyBjYXN0IGVuc3VyZXMgdGhlXG4gIC8vIGxvZ2ljIGlzIGNvcnJlY3QgZm9yIHdoZW4gdGhpcyBlZGdlIGNhc2UgaXMgaGl0LlxuICBjb25zdCBrMSA9IE9iamVjdC5rZXlzKGEpIGFzIHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xuICBjb25zdCBrMiA9IE9iamVjdC5rZXlzKGIpIGFzIHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xuICBpZiAoIWsxIHx8ICFrMiB8fCBrMS5sZW5ndGggIT0gazIubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGxldCBrZXk6IHN0cmluZztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBrMS5sZW5ndGg7IGkrKykge1xuICAgIGtleSA9IGsxW2ldO1xuICAgIGlmICghZXF1YWxBcnJheXNPclN0cmluZyhhW2tleV0sIGJba2V5XSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogVGVzdCBlcXVhbGl0eSBmb3IgYXJyYXlzIG9mIHN0cmluZ3Mgb3IgYSBzdHJpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlcXVhbEFycmF5c09yU3RyaW5nKGE6IHN0cmluZyB8IHN0cmluZ1tdLCBiOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShhKSAmJiBBcnJheS5pc0FycmF5KGIpKSB7XG4gICAgaWYgKGEubGVuZ3RoICE9IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIGEuZXZlcnkoYUl0ZW0gPT4gYi5pbmRleE9mKGFJdGVtKSA+IC0xKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYSA9PT0gYjtcbiAgfVxufVxuXG4vKipcbiAqIEZsYXR0ZW5zIHNpbmdsZS1sZXZlbCBuZXN0ZWQgYXJyYXlzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbjxUPihhcnI6IFRbXVtdKTogVFtdIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sIGFycik7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXN0PFQ+KGE6IFRbXSk6IFR8bnVsbCB7XG4gIHJldHVybiBhLmxlbmd0aCA+IDAgPyBhW2EubGVuZ3RoIC0gMV0gOiBudWxsO1xufVxuXG4vKipcbiAqIFZlcmlmeXMgYWxsIGJvb2xlYW5zIGluIGFuIGFycmF5IGFyZSBgdHJ1ZWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbmQoYm9vbHM6IGJvb2xlYW5bXSk6IGJvb2xlYW4ge1xuICByZXR1cm4gIWJvb2xzLnNvbWUodiA9PiAhdik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoPEssIFY+KG1hcDoge1trZXk6IHN0cmluZ106IFZ9LCBjYWxsYmFjazogKHY6IFYsIGs6IHN0cmluZykgPT4gdm9pZCk6IHZvaWQge1xuICBmb3IgKGNvbnN0IHByb3AgaW4gbWFwKSB7XG4gICAgaWYgKG1hcC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgY2FsbGJhY2sobWFwW3Byb3BdLCBwcm9wKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhaXRGb3JNYXA8QSwgQj4oXG4gICAgb2JqOiB7W2s6IHN0cmluZ106IEF9LCBmbjogKGs6IHN0cmluZywgYTogQSkgPT4gT2JzZXJ2YWJsZTxCPik6IE9ic2VydmFibGU8e1trOiBzdHJpbmddOiBCfT4ge1xuICBpZiAoT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb2YgKHt9KTtcbiAgfVxuXG4gIGNvbnN0IHdhaXRIZWFkOiBPYnNlcnZhYmxlPEI+W10gPSBbXTtcbiAgY29uc3Qgd2FpdFRhaWw6IE9ic2VydmFibGU8Qj5bXSA9IFtdO1xuICBjb25zdCByZXM6IHtbazogc3RyaW5nXTogQn0gPSB7fTtcblxuICBmb3JFYWNoKG9iaiwgKGE6IEEsIGs6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IG1hcHBlZCA9IGZuKGssIGEpLnBpcGUobWFwKChyOiBCKSA9PiByZXNba10gPSByKSk7XG4gICAgaWYgKGsgPT09IFBSSU1BUllfT1VUTEVUKSB7XG4gICAgICB3YWl0SGVhZC5wdXNoKG1hcHBlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdhaXRUYWlsLnB1c2gobWFwcGVkKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIENsb3N1cmUgY29tcGlsZXIgaGFzIHByb2JsZW0gd2l0aCB1c2luZyBzcHJlYWQgb3BlcmF0b3IgaGVyZS4gU28gd2UgdXNlIFwiQXJyYXkuY29uY2F0XCIuXG4gIC8vIE5vdGUgdGhhdCB3ZSBhbHNvIG5lZWQgdG8gY2FzdCB0aGUgbmV3IHByb21pc2UgYmVjYXVzZSBUeXBlU2NyaXB0IGNhbm5vdCBpbmZlciB0aGUgdHlwZVxuICAvLyB3aGVuIGNhbGxpbmcgdGhlIFwib2ZcIiBmdW5jdGlvbiB0aHJvdWdoIFwiRnVuY3Rpb24uYXBwbHlcIlxuICByZXR1cm4gKG9mIC5hcHBseShudWxsLCB3YWl0SGVhZC5jb25jYXQod2FpdFRhaWwpKSBhcyBPYnNlcnZhYmxlPE9ic2VydmFibGU8Qj4+KVxuICAgICAgLnBpcGUoY29uY2F0QWxsKCksIGxhc3RWYWx1ZSgpLCBtYXAoKCkgPT4gcmVzKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwSW50b09ic2VydmFibGU8VD4odmFsdWU6IFQgfCBQcm9taXNlPFQ+fCBPYnNlcnZhYmxlPFQ+KTogT2JzZXJ2YWJsZTxUPiB7XG4gIGlmIChpc09ic2VydmFibGUodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgaWYgKGlzUHJvbWlzZSh2YWx1ZSkpIHtcbiAgICAvLyBVc2UgYFByb21pc2UucmVzb2x2ZSgpYCB0byB3cmFwIHByb21pc2UtbGlrZSBpbnN0YW5jZXMuXG4gICAgLy8gUmVxdWlyZWQgaWUgd2hlbiBhIFJlc29sdmVyIHJldHVybnMgYSBBbmd1bGFySlMgYCRxYCBwcm9taXNlIHRvIGNvcnJlY3RseSB0cmlnZ2VyIHRoZVxuICAgIC8vIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgcmV0dXJuIGZyb20oUHJvbWlzZS5yZXNvbHZlKHZhbHVlKSk7XG4gIH1cblxuICByZXR1cm4gb2YgKHZhbHVlKTtcbn1cbiJdfQ==