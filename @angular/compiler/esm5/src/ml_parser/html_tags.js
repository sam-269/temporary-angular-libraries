/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TagContentType } from './tags';
var HtmlTagDefinition = /** @class */ (function () {
    function HtmlTagDefinition(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, closedByChildren = _b.closedByChildren, implicitNamespacePrefix = _b.implicitNamespacePrefix, _c = _b.contentType, contentType = _c === void 0 ? TagContentType.PARSABLE_DATA : _c, _d = _b.closedByParent, closedByParent = _d === void 0 ? false : _d, _e = _b.isVoid, isVoid = _e === void 0 ? false : _e, _f = _b.ignoreFirstLf, ignoreFirstLf = _f === void 0 ? false : _f;
        this.closedByChildren = {};
        this.closedByParent = false;
        this.canSelfClose = false;
        if (closedByChildren && closedByChildren.length > 0) {
            closedByChildren.forEach(function (tagName) { return _this.closedByChildren[tagName] = true; });
        }
        this.isVoid = isVoid;
        this.closedByParent = closedByParent || isVoid;
        this.implicitNamespacePrefix = implicitNamespacePrefix || null;
        this.contentType = contentType;
        this.ignoreFirstLf = ignoreFirstLf;
    }
    HtmlTagDefinition.prototype.isClosedByChild = function (name) {
        return this.isVoid || name.toLowerCase() in this.closedByChildren;
    };
    return HtmlTagDefinition;
}());
export { HtmlTagDefinition };
var _DEFAULT_TAG_DEFINITION;
// see http://www.w3.org/TR/html51/syntax.html#optional-tags
// This implementation does not fully conform to the HTML5 spec.
var TAG_DEFINITIONS;
export function getHtmlTagDefinition(tagName) {
    if (!TAG_DEFINITIONS) {
        _DEFAULT_TAG_DEFINITION = new HtmlTagDefinition();
        TAG_DEFINITIONS = {
            'base': new HtmlTagDefinition({ isVoid: true }),
            'meta': new HtmlTagDefinition({ isVoid: true }),
            'area': new HtmlTagDefinition({ isVoid: true }),
            'embed': new HtmlTagDefinition({ isVoid: true }),
            'link': new HtmlTagDefinition({ isVoid: true }),
            'img': new HtmlTagDefinition({ isVoid: true }),
            'input': new HtmlTagDefinition({ isVoid: true }),
            'param': new HtmlTagDefinition({ isVoid: true }),
            'hr': new HtmlTagDefinition({ isVoid: true }),
            'br': new HtmlTagDefinition({ isVoid: true }),
            'source': new HtmlTagDefinition({ isVoid: true }),
            'track': new HtmlTagDefinition({ isVoid: true }),
            'wbr': new HtmlTagDefinition({ isVoid: true }),
            'p': new HtmlTagDefinition({
                closedByChildren: [
                    'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset',
                    'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
                    'h6', 'header', 'hgroup', 'hr', 'main', 'nav', 'ol',
                    'p', 'pre', 'section', 'table', 'ul'
                ],
                closedByParent: true
            }),
            'thead': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'] }),
            'tbody': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'], closedByParent: true }),
            'tfoot': new HtmlTagDefinition({ closedByChildren: ['tbody'], closedByParent: true }),
            'tr': new HtmlTagDefinition({ closedByChildren: ['tr'], closedByParent: true }),
            'td': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
            'th': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
            'col': new HtmlTagDefinition({ isVoid: true }),
            'svg': new HtmlTagDefinition({ implicitNamespacePrefix: 'svg' }),
            'math': new HtmlTagDefinition({ implicitNamespacePrefix: 'math' }),
            'li': new HtmlTagDefinition({ closedByChildren: ['li'], closedByParent: true }),
            'dt': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'] }),
            'dd': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'], closedByParent: true }),
            'rb': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
            'rt': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
            'rtc': new HtmlTagDefinition({ closedByChildren: ['rb', 'rtc', 'rp'], closedByParent: true }),
            'rp': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
            'optgroup': new HtmlTagDefinition({ closedByChildren: ['optgroup'], closedByParent: true }),
            'option': new HtmlTagDefinition({ closedByChildren: ['option', 'optgroup'], closedByParent: true }),
            'pre': new HtmlTagDefinition({ ignoreFirstLf: true }),
            'listing': new HtmlTagDefinition({ ignoreFirstLf: true }),
            'style': new HtmlTagDefinition({ contentType: TagContentType.RAW_TEXT }),
            'script': new HtmlTagDefinition({ contentType: TagContentType.RAW_TEXT }),
            'title': new HtmlTagDefinition({ contentType: TagContentType.ESCAPABLE_RAW_TEXT }),
            'textarea': new HtmlTagDefinition({ contentType: TagContentType.ESCAPABLE_RAW_TEXT, ignoreFirstLf: true }),
        };
    }
    return TAG_DEFINITIONS[tagName.toLowerCase()] || _DEFAULT_TAG_DEFINITION;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF90YWdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL21sX3BhcnNlci9odG1sX3RhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBZ0IsTUFBTSxRQUFRLENBQUM7QUFFckQ7SUFVRSwyQkFDSSxFQVFNO1FBVFYsaUJBa0JDO1lBakJHLDRCQVFNLEVBUkwsc0NBQWdCLEVBQUUsb0RBQXVCLEVBQUUsbUJBQTBDLEVBQTFDLCtEQUEwQyxFQUNyRixzQkFBc0IsRUFBdEIsMkNBQXNCLEVBQUUsY0FBYyxFQUFkLG1DQUFjLEVBQUUscUJBQXFCLEVBQXJCLDBDQUFxQjtRQVgxRCxxQkFBZ0IsR0FBNkIsRUFBRSxDQUFDO1FBRXhELG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBS2hDLGlCQUFZLEdBQVksS0FBSyxDQUFDO1FBWTVCLElBQUksZ0JBQWdCLElBQUksZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNuRCxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPLElBQUksT0FBQSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxFQUFyQyxDQUFxQyxDQUFDLENBQUM7U0FDNUU7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsSUFBSSxNQUFNLENBQUM7UUFDL0MsSUFBSSxDQUFDLHVCQUF1QixHQUFHLHVCQUF1QixJQUFJLElBQUksQ0FBQztRQUMvRCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztJQUNyQyxDQUFDO0lBRUQsMkNBQWUsR0FBZixVQUFnQixJQUFZO1FBQzFCLE9BQU8sSUFBSSxD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QWlCLENBQzdCLEVBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFDLENBQUM7U0FDM0UsQ0FBQztLQUNIO0lBQ0QsT0FBTyxlQUFlLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksdUJBQXVCLENBQUM7QUFDM0UsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUYWdDb250ZW50VHlwZSwgVGFnRGVmaW5pdGlvbn0gZnJvbSAnLi90YWdzJztcblxuZXhwb3J0IGNsYXNzIEh0bWxUYWdEZWZpbml0aW9uIGltcGxlbWVudHMgVGFnRGVmaW5pdGlvbiB7XG4gIHByaXZhdGUgY2xvc2VkQnlDaGlsZHJlbjoge1trZXk6IHN0cmluZ106IGJvb2xlYW59ID0ge307XG5cbiAgY2xvc2VkQnlQYXJlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgaW1wbGljaXROYW1lc3BhY2VQcmVmaXg6IHN0cmluZ3xudWxsO1xuICBjb250ZW50VHlwZTogVGFnQ29udGVudFR5cGU7XG4gIGlzVm9pZDogYm9vbGVhbjtcbiAgaWdub3JlRmlyc3RMZjogYm9vbGVhbjtcbiAgY2FuU2VsZkNsb3NlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICB7Y2xvc2VkQnlDaGlsZHJlbiwgaW1wbGljaXROYW1lc3BhY2VQcmVmaXgsIGNvbnRlbnRUeXBlID0gVGFnQ29udGVudFR5cGUuUEFSU0FCTEVfREFUQSxcbiAgICAgICBjbG9zZWRCeVBhcmVudCA9IGZhbHNlLCBpc1ZvaWQgPSBmYWxzZSwgaWdub3JlRmlyc3RMZiA9IGZhbHNlfToge1xuICAgICAgICBjbG9zZWRCeUNoaWxkcmVuPzogc3RyaW5nW10sXG4gICAgICAgIGNsb3NlZEJ5UGFyZW50PzogYm9vbGVhbixcbiAgICAgICAgaW1wbGljaXROYW1lc3BhY2VQcmVmaXg/OiBzdHJpbmcsXG4gICAgICAgIGNvbnRlbnRUeXBlPzogVGFnQ29udGVudFR5cGUsXG4gICAgICAgIGlzVm9pZD86IGJvb2xlYW4sXG4gICAgICAgIGlnbm9yZUZpcnN0TGY/OiBib29sZWFuXG4gICAgICB9ID0ge30pIHtcbiAgICBpZiAoY2xvc2VkQnlDaGlsZHJlbiAmJiBjbG9zZWRCeUNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGNsb3NlZEJ5Q2hpbGRyZW4uZm9yRWFjaCh0YWdOYW1lID0+IHRoaXMuY2xvc2VkQnlDaGlsZHJlblt0YWdOYW1lXSA9IHRydWUpO1xuICAgIH1cbiAgICB0aGlzLmlzVm9pZCA9IGlzVm9pZDtcbiAgICB0aGlzLmNsb3NlZEJ5UGFyZW50ID0gY2xvc2VkQnlQYXJlbnQgfHwgaXNWb2lkO1xuICAgIHRoaXMuaW1wbGljaXROYW1lc3BhY2VQcmVmaXggPSBpbXBsaWNpdE5hbWVzcGFjZVByZWZpeCB8fCBudWxsO1xuICAgIHRoaXMuY29udGVudFR5cGUgPSBjb250ZW50VHlwZTtcbiAgICB0aGlzLmlnbm9yZUZpcnN0TGYgPSBpZ25vcmVGaXJzdExmO1xuICB9XG5cbiAgaXNDbG9zZWRCeUNoaWxkKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzVm9pZCB8fCBuYW1lLnRvTG93ZXJDYXNlKCkgaW4gdGhpcy5jbG9zZWRCeUNoaWxkcmVuO1xuICB9XG59XG5cbmxldCBfREVGQVVMVF9UQUdfREVGSU5JVElPTiAhOiBIdG1sVGFnRGVmaW5pdGlvbjtcblxuLy8gc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL2h0bWw1MS9zeW50YXguaHRtbCNvcHRpb25hbC10YWdzXG4vLyBUaGlzIGltcGxlbWVudGF0aW9uIGRvZXMgbm90IGZ1bGx5IGNvbmZvcm0gdG8gdGhlIEhUTUw1IHNwZWMuXG5sZXQgVEFHX0RFRklOSVRJT05TICE6IHtba2V5OiBzdHJpbmddOiBIdG1sVGFnRGVmaW5pdGlvbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIdG1sVGFnRGVmaW5pdGlvbih0YWdOYW1lOiBzdHJpbmcpOiBIdG1sVGFnRGVmaW5pdGlvbiB7XG4gIGlmICghVEFHX0RFRklOSVRJT05TKSB7XG4gICAgX0RFRkFVTFRfVEFHX0RFRklOSVRJT04gPSBuZXcgSHRtbFRhZ0RlZmluaXRpb24oKTtcbiAgICBUQUdfREVGSU5JVElPTlMgPSB7XG4gICAgICAnYmFzZSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAnbWV0YSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAnYXJlYSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAnZW1iZWQnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ2xpbmsnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ2ltZyc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAnaW5wdXQnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ3BhcmFtJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdocic6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAnYnInOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ3NvdXJjZSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAndHJhY2snOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ3dicic6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAncCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7XG4gICAgICAgIGNsb3NlZEJ5Q2hpbGRyZW46IFtcbiAgICAgICAgICAnYWRkcmVzcycsICdhcnRpY2xlJywgJ2FzaWRlJywgICAnYmxvY2txdW90ZScsICdkaXYnLCAgJ2RsJywgICdmaWVsZHNldCcsXG4gICAgICAgICAgJ2Zvb3RlcicsICAnZm9ybScsICAgICdoMScsICAgICAgJ2gyJywgICAgICAgICAnaDMnLCAgICdoNCcsICAnaDUnLFxuICAgICAgICAgICdoNicsICAgICAgJ2hlYWRlcicsICAnaGdyb3VwJywgICdocicsICAgICAgICAgJ21haW4nLCAnbmF2JywgJ29sJyxcbiAgICAgICAgICAncCcsICAgICAgICdwcmUnLCAgICAgJ3NlY3Rpb24nLCAndGFibGUnLCAgICAgICd1bCdcbiAgICAgICAgXSxcbiAgICAgICAgY2xvc2VkQnlQYXJlbnQ6IHRydWVcbiAgICAgIH0pLFxuICAgICAgJ3RoZWFkJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3Rib2R5JywgJ3Rmb290J119KSxcbiAgICAgICd0Ym9keSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWyd0Ym9keScsICd0Zm9vdCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ3Rmb290JzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3Rib2R5J10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICAgICAndHInOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsndHInXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICd0ZCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWyd0ZCcsICd0aCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ3RoJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3RkJywgJ3RoJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICAgICAnY29sJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdzdmcnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2ltcGxpY2l0TmFtZXNwYWNlUHJlZml4OiAnc3ZnJ30pLFxuICAgICAgJ21hdGgnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2ltcGxpY2l0TmFtZXNwYWNlUHJlZml4OiAnbWF0aCd9KSxcbiAgICAgICdsaSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWydsaSddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ2R0JzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ2R0JywgJ2RkJ119KSxcbiAgICAgICdkZCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWydkdCcsICdkZCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ3JiJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKFxuICAgICAgICAgIHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3JiJywgJ3J0JywgJ3J0YycsICdycCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ3J0JzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKFxuICAgICAgICAgIHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3JiJywgJ3J0JywgJ3J0YycsICdycCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ3J0Yyc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWydyYicsICdydGMnLCAncnAnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICdycCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbihcbiAgICAgICAgICB7Y2xvc2VkQnlDaGlsZHJlbjogWydyYicsICdydCcsICdydGMnLCAncnAnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICdvcHRncm91cCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWydvcHRncm91cCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ29wdGlvbic6XG4gICAgICAgICAgbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ29wdGlvbicsICdvcHRncm91cCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ3ByZSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aWdub3JlRmlyc3RMZjogdHJ1ZX0pLFxuICAgICAgJ2xpc3RpbmcnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lnbm9yZUZpcnN0TGY6IHRydWV9KSxcbiAgICAgICdzdHlsZSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y29udGVudFR5cGU6IFRhZ0NvbnRlbnRUeXBlLlJBV19URVhUfSksXG4gICAgICAnc2NyaXB0JzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjb250ZW50VHlwZTogVGFnQ29udGVudFR5cGUuUkFXX1RFWFR9KSxcbiAgICAgICd0aXRsZSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y29udGVudFR5cGU6IFRhZ0NvbnRlbnRUeXBlLkVTQ0FQQUJMRV9SQVdfVEVYVH0pLFxuICAgICAgJ3RleHRhcmVhJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKFxuICAgICAgICAgIHtjb250ZW50VHlwZTogVGFnQ29udGVudFR5cGUuRVNDQVBBQkxFX1JBV19URVhULCBpZ25vcmVGaXJzdExmOiB0cnVlfSksXG4gICAgfTtcbiAgfVxuICByZXR1cm4gVEFHX0RFRklOSVRJT05TW3RhZ05hbWUudG9Mb3dlckNhc2UoKV0gfHwgX0RFRkFVTFRfVEFHX0RFRklOSVRJT047XG59XG4iXX0=