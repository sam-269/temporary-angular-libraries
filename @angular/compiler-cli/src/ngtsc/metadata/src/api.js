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
        define("@angular/compiler-cli/src/ngtsc/metadata/src/api", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9tZXRhZGF0YS9zcmMvYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmVNZXRhIGFzIFQyRGlyZWN0aXZlTWV0YSwgU2NoZW1hTWV0YWRhdGF9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge1JlZmVyZW5jZX0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb259IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuXG5cbi8qKlxuICogTWV0YWRhdGEgY29sbGVjdGVkIGZvciBhbiBgTmdNb2R1bGVgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nTW9kdWxlTWV0YSB7XG4gIHJlZjogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb24+O1xuICBkZWNsYXJhdGlvbnM6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPltdO1xuICBpbXBvcnRzOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj5bXTtcbiAgZXhwb3J0czogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb24+W107XG4gIHNjaGVtYXM6IFNjaGVtYU1ldGFkYXRhW107XG5cbiAgLyoqXG4gICAqIFRoZSByYXcgYHRzLkV4cHJlc3Npb25gIHdoaWNoIGdhdmUgcmlzZSB0byBgZGVjbGFyYXRpb25zYCwgaWYgb25lIGV4aXN0cy5cbiAgICpcbiAgICogSWYgdGhpcyBpcyBgbnVsbGAsIHRoZW4gZWl0aGVyIG5vIGRlY2xhcmF0aW9ucyBleGlzdCwgb3Igbm8gZXhwcmVzc2lvbiB3YXMgYXZhaWxhYmxlIChsaWtlbHlcbiAgICogYmVjYXVzZSB0aGUgbW9kdWxlIGNhbWUgZnJvbSBhIC5kLnRzIGZpbGUpLlxuICAgKi9cbiAgcmF3RGVjbGFyYXRpb25zOiB0cy5FeHByZXNzaW9ufG51bGw7XG59XG5cbi8qKlxuICogTWV0YWRhdGEgY29sbGVjdGVkIGZvciBhIGRpcmVjdGl2ZSB3aXRoaW4gYW4gTmdNb2R1bGUncyBzY29wZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEaXJlY3RpdmVNZXRhIGV4dGVuZHMgVDJEaXJlY3RpdmVNZXRhIHtcbiAgcmVmOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj47XG4gIC8qKlxuICAgKiBVbnBhcnNlZCBzZWxlY3RvciBvZiB0aGUgZGlyZWN0aXZlLCBvciBudWxsIGlmIHRoZSBkaXJlY3RpdmUgZG9lcyBub3QgaGF2ZSBhIHNlbGVjdG9yLlxuICAgKi9cbiAgc2VsZWN0b3I6IHN0cmluZ3xudWxsO1xuICBxdWVyaWVzOiBzdHJpbmdbXTtcbiAgbmdUZW1wbGF0ZUd1YXJkczogVGVtcGxhdGVHdWFyZE1ldGFbXTtcbiAgaGFzTmdUZW1wbGF0ZUNvbnRleHRHdWFyZDogYm9vbGVhbjtcbiAgY29lcmNlZElucHV0RmllbGRzOiBTZXQ8c3RyaW5nPjtcblxuICAvKipcbiAgICogQSBgUmVmZXJlbmNlYCB0byB0aGUgYmFzZSBjbGFzcyBmb3IgdGhlIGRpcmVjdGl2ZSwgaWYgb25lIHdhcyBkZXRlY3RlZC5cbiAgICpcbiAgICogQSB2YWx1ZSBvZiBgJ2R5bmFtaWMnYCBpbmRpY2F0ZXMgdGhhdCB3aGlsZSB0aGUgYW5hbHl6ZXIgZGV0ZWN0ZWQgdGhhdCB0aGlzIGRpcmVjdGl2ZSBleHRlbmRzXG4gICAqIGFub3RoZXIgdHlwZSwgaXQgY291bGQgbm90IHN0YXRpY2FsbHkgZGV0ZXJtaW5lIHRoZSBiYXNlIGNsYXNzLlxuICAgKi9cbiAgYmFzZUNsYXNzOiBSZWZlcmVuY2U8Q2xhc3NEZWNsYXJhdGlvbj58J2R5bmFtaWMnfG51bGw7XG59XG5cbi8qKlxuICogTWV0YWRhdGEgdGhhdCBkZXNjcmliZXMgYSB0ZW1wbGF0ZSBndWFyZCBmb3Igb25lIG9mIHRoZSBkaXJlY3RpdmUncyBpbnB1dHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGVHdWFyZE1ldGEge1xuICAvKipcbiAgICogVGhlIGlucHV0IG5hbWUgdGhhdCB0aGlzIGd1YXJkIHNob3VsZCBiZSBhcHBsaWVkIHRvLlxuICAgKi9cbiAgaW5wdXROYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgdGhlIHR5cGUgb2YgdGhlIHRlbXBsYXRlIGd1YXJkLlxuICAgKlxuICAgKiAtICdpbnZvY2F0aW9uJyBtZWFucyB0aGF0IGEgY2FsbCB0byB0aGUgdGVtcGxhdGUgZ3VhcmQgZnVuY3Rpb24gaXMgZW1pdHRlZCBzbyB0aGF0IGl0cyByZXR1cm5cbiAgICogICB0eXBlIGNhbiByZXN1bHQgaW4gbmFycm93aW5nIG9mIHRoZSBpbnB1dCB0eXBlLlxuICAgKiAtICdiaW5kaW5nJyBtZWFucyB0aGF0IHRoZSBpbnB1dCBiaW5kaW5nIGV4cHJlc3Npb24gaXRzZWxmIGlzIHVzZWQgYXMgdGVtcGxhdGUgZ3VhcmQuXG4gICAqL1xuICB0eXBlOiAnaW52b2NhdGlvbid8J2JpbmRpbmcnO1xufVxuXG4vKipcbiAqIE1ldGFkYXRhIGZvciBhIHBpcGUgd2l0aGluIGFuIE5nTW9kdWxlJ3Mgc2NvcGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUGlwZU1ldGEge1xuICByZWY6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPjtcbiAgbmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIFJlYWRzIG1ldGFkYXRhIGZvciBkaXJlY3RpdmVzLCBwaXBlcywgYW5kIG1vZHVsZXMgZnJvbSBhIHBhcnRpY3VsYXIgc291cmNlLCBzdWNoIGFzIC5kLnRzIGZpbGVzXG4gKiBvciBhIHJlZ2lzdHJ5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1ldGFkYXRhUmVhZGVyIHtcbiAgZ2V0RGlyZWN0aXZlTWV0YWRhdGEobm9kZTogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb24+KTogRGlyZWN0aXZlTWV0YXxudWxsO1xuICBnZXROZ01vZHVsZU1ldGFkYXRhKG5vZGU6IFJlZmVyZW5jZTxDbGFzc0RlY2xhcmF0aW9uPik6IE5nTW9kdWxlTWV0YXxudWxsO1xuICBnZXRQaXBlTWV0YWRhdGEobm9kZTogUmVmZXJlbmNlPENsYXNzRGVjbGFyYXRpb24+KTogUGlwZU1ldGF8bnVsbDtcbn1cblxuLyoqXG4gKiBSZWdpc3RlcnMgbmV3IG1ldGFkYXRhIGZvciBkaXJlY3RpdmVzLCBwaXBlcywgYW5kIG1vZHVsZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWV0YWRhdGFSZWdpc3RyeSB7XG4gIHJlZ2lzdGVyRGlyZWN0aXZlTWV0YWRhdGEobWV0YTogRGlyZWN0aXZlTWV0YSk6IHZvaWQ7XG4gIHJlZ2lzdGVyTmdNb2R1bGVNZXRhZGF0YShtZXRhOiBOZ01vZHVsZU1ldGEpOiB2b2lkO1xuICByZWdpc3RlclBpcGVNZXRhZGF0YShtZXRhOiBQaXBlTWV0YSk6IHZvaWQ7XG59XG4iXX0=