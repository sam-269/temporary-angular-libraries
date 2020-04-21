/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as i18n from '../../../i18n/i18n_ast';
import { toPublicName } from '../../../i18n/serializers/xmb';
import * as o from '../../../output/output_ast';
/* Closure variables holding messages must be named `MSG_[A-Z0-9]+` */
const CLOSURE_TRANSLATION_PREFIX = 'MSG_';
/* Prefix for non-`goog.getMsg` i18n-related vars */
export const TRANSLATION_PREFIX = 'I18N_';
/** Name of the i18n attributes **/
export const I18N_ATTR = 'i18n';
export const I18N_ATTR_PREFIX = 'i18n-';
/** Prefix of var expressions used in ICUs */
export const I18N_ICU_VAR_PREFIX = 'VAR_';
/** Prefix of ICU expressions for post processing */
export const I18N_ICU_MAPPING_PREFIX = 'I18N_EXP_';
/** Placeholder wrapper for i18n expressions **/
export const I18N_PLACEHOLDER_SYMBOL = '�';
export function isI18nAttribute(name) {
    return name === I18N_ATTR || name.startsWith(I18N_ATTR_PREFIX);
}
export function isI18nRootNode(meta) {
    return meta instanceof i18n.Message;
}
export function isSingleI18nIcu(meta) {
    return isI18nRootNode(meta) && meta.nodes.length === 1 && meta.nodes[0] instanceof i18n.Icu;
}
export function hasI18nAttrs(element) {
    return element.attrs.some((attr) => isI18nAttribute(attr.name));
}
export function icuFromI18nMessage(message) {
    return message.nodes[0];
}
export function wrapI18nPlaceholder(content, contextId = 0) {
    const blockId = contextId > 0 ? `:${contextId}` : '';
    return `${I18N_PLACEHOLDER_SYMBOL}${content}${blockId}${I18N_PLACEHOLDER_SYMBOL}`;
}
export function assembleI18nBoundString(strings, bindingStartIndex = 0, contextId = 0) {
    if (!strings.length)
        return '';
    let acc = '';
    const lastIdx = strings.length - 1;
    for (let i = 0; i < lastIdx; i++) {
        acc += `${strings[i]}${wrapI18nPlaceholder(bindingStartIndex + i, contextId)}`;
    }
    acc += strings[lastIdx];
    return acc;
}
export function getSeqNumberGenerator(startsAt = 0) {
    let current = startsAt;
    return () => current++;
}
export function placeholdersToParams(placeholders) {
    const params = {};
    placeholders.forEach((values, key) => {
        params[key] = o.literal(values.length > 1 ? `[${values.join('|')}]` : values[0]);
    });
    return params;
}
export function updatePlaceholderMap(map, name, ...values) {
    const current = map.get(name) || [];
    current.push(...values);
    map.set(name, current);
}
export function assembleBoundTextPlaceholders(meta, bindingStartIndex = 0, contextId = 0) {
    const startIdx = bindingStartIndex;
    const placeholders = new Map();
    const node = meta instanceof i18n.Message ? meta.nodes.find(node => node instanceof i18n.Container) : meta;
    if (node) {
        node
            .children
            .filter((child) => child instanceof i18n.Placeholder)
            .forEach((child, idx) => {
            const content = wrapI18nPlaceholder(startIdx + idx, contextId);
            updatePlaceholderMap(placeholders, child.name, content);
        });
    }
    return placeholders;
}
/**
 * Format the placeholder names in a map of placeholders to expressions.
 *
 * The placeholder names are converted from "internal" format (e.g. `START_TAG_DIV_1`) to "external"
 * format (e.g. `startTagDiv_1`).
 *
 * @param params A map of placeholder names to expressions.
 * @param useCamelCase whether to camelCase the placeholder name when formatting.
 * @returns A new map of formatted placeholder names to expressions.
 */
export function i18nFormatPlaceholderNames(params = {}, useCamelCase) {
    const _params = {};
    if (params && Object.keys(params).length) {
        Object.keys(params).forEach(key => _params[formatI18nPlaceholderName(key, useCamelCase)] = params[key]);
    }
    return _params;
}
/**
 * Converts internal placeholder names to public-facing format
 * (for example to use in goog.getMsg call).
 * Example: `START_TAG_DIV_1` is converted to `startTagDiv_1`.
 *
 * @param name The placeholder name that should be formatted
 * @returns Formatted placeholder name
 */
export function formatI18nPlaceholderName(name, useCamelCase = true) {
    const publicName = toPublicName(name);
    if (!useCamelCase) {
        return publicName;
    }
    const chunks = publicName.split('_');
    if (chunks.length === 1) {
        // if no "_" found - just lowercase the value
        return name.toLowerCase();
    }
    let postfix;
    // eject last element if it's a number
    if (/^\d+$/.test(chunks[chunks.length - 1])) {
        postfix = chunks.pop();
    }
    let raw = chunks.shift().toLowerCase();
    if (chunks.length) {
        raw += chunks.map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()).join('');
    }
    return postfix ? `${raw}_${postfix}` : raw;
}
/**
 * Generates a prefix for translation const name.
 *
 * @param extra Additional local prefix that should be injected into translation var name
 * @returns Complete translation const prefix
 */
export function getTranslationConstPrefix(extra) {
    return `${CLOSURE_TRANSLATION_PREFIX}${extra}`.toUpperCase();
}
/**
 * Generate AST to declare a variable. E.g. `var I18N_1;`.
 * @param variable the name of the variable to declare.
 */
export function declareI18nVariable(variable) {
    return new o.DeclareVarStmt(variable.name, undefined, o.INFERRED_TYPE, null, variable.sourceSpan);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3ZpZXcvaTE4bi91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sS0FBSyxJQUFJLE1BQU0sd0JBQXdCLENBQUM7QUFDL0MsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBRTNELE9BQU8sS0FBSyxDQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFFaEQsc0VBQXNFO0FBQ3RFLE1BQU0sMEJBQTBCLEdBQUcsTUFBTSxDQUFDO0FBRTFDLG9EQUFvRDtBQUNwRCxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUM7QUFFMUMsbUNBQW1DO0FBQ25DLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDaEMsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDO0FBRXhDLDZDQUE2QztBQUM3QyxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxNQUFNLENBQUM7QUFFMUMsb0RBQW9EO0FBQ3BELE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHLFdBQVcsQ0FBQztBQUVuRCxnREFBZ0Q7QUFDaEQsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsR0FBRyxDQUFDO0FBRTNDLE1BQU0sVUFBVSxlQUFlLENBQUMsSUFBWTtJQUMxQyxPQUFPLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFDLElBQW9CO0lBQ2pELE9BQU8sSUFBSSxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDdEMsQ0FBQztBQUVELE1BQU0sVUFBVSxlQUFlLENBQUMsSUFBb0I7SUFDbEQsT0FBTyxjQUFjLENB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O0dBS0c7QUFDSCxNQUFNLFVBQVUseUJBQXlCLENBQUMsS0FBYTtJQUNyRCxPQUFPLEdBQUcsMEJBQTBCLEdBQUcsS0FBSyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDL0QsQ0FBQztBQUVEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxRQUF1QjtJQUN6RCxPQUFPLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FDdkIsUUFBUSxDQUFDLElBQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzlFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyBpMThuIGZyb20gJy4uLy4uLy4uL2kxOG4vaTE4bl9hc3QnO1xuaW1wb3J0IHt0b1B1YmxpY05hbWV9IGZyb20gJy4uLy4uLy4uL2kxOG4vc2VyaWFsaXplcnMveG1iJztcbmltcG9ydCAqIGFzIGh0bWwgZnJvbSAnLi4vLi4vLi4vbWxfcGFyc2VyL2FzdCc7XG5pbXBvcnQgKiBhcyBvIGZyb20gJy4uLy4uLy4uL291dHB1dC9vdXRwdXRfYXN0JztcblxuLyogQ2xvc3VyZSB2YXJpYWJsZXMgaG9sZGluZyBtZXNzYWdlcyBtdXN0IGJlIG5hbWVkIGBNU0dfW0EtWjAtOV0rYCAqL1xuY29uc3QgQ0xPU1VSRV9UUkFOU0xBVElPTl9QUkVGSVggPSAnTVNHXyc7XG5cbi8qIFByZWZpeCBmb3Igbm9uLWBnb29nLmdldE1zZ2AgaTE4bi1yZWxhdGVkIHZhcnMgKi9cbmV4cG9ydCBjb25zdCBUUkFOU0xBVElPTl9QUkVGSVggPSAnSTE4Tl8nO1xuXG4vKiogTmFtZSBvZiB0aGUgaTE4biBhdHRyaWJ1dGVzICoqL1xuZXhwb3J0IGNvbnN0IEkxOE5fQVRUUiA9ICdpMThuJztcbmV4cG9ydCBjb25zdCBJMThOX0FUVFJfUFJFRklYID0gJ2kxOG4tJztcblxuLyoqIFByZWZpeCBvZiB2YXIgZXhwcmVzc2lvbnMgdXNlZCBpbiBJQ1VzICovXG5leHBvcnQgY29uc3QgSTE4Tl9JQ1VfVkFSX1BSRUZJWCA9ICdWQVJfJztcblxuLyoqIFByZWZpeCBvZiBJQ1UgZXhwcmVzc2lvbnMgZm9yIHBvc3QgcHJvY2Vzc2luZyAqL1xuZXhwb3J0IGNvbnN0IEkxOE5fSUNVX01BUFBJTkdfUFJFRklYID0gJ0kxOE5fRVhQXyc7XG5cbi8qKiBQbGFjZWhvbGRlciB3cmFwcGVyIGZvciBpMThuIGV4cHJlc3Npb25zICoqL1xuZXhwb3J0IGNvbnN0IEkxOE5fUExBQ0VIT0xERVJfU1lNQk9MID0gJ++/vSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0kxOG5BdHRyaWJ1dGUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBuYW1lID09PSBJMThOX0FUVFIgfHwgbmFtZS5zdGFydHNXaXRoKEkxOE5fQVRUUl9QUkVGSVgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJMThuUm9vdE5vZGUobWV0YT86IGkxOG4uSTE4bk1ldGEpOiBtZXRhIGlzIGkxOG4uTWVzc2FnZSB7XG4gIHJldHVybiBtZXRhIGluc3RhbmNlb2YgaTE4bi5NZXNzYWdlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTaW5nbGVJMThuSWN1KG1ldGE/OiBpMThuLkkxOG5NZXRhKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0kxOG5Sb290Tm9kZShtZXRhKSAmJiBtZXRhLm5vZGVzLmxlbmd0aCA9PT0gMSAmJiBtZXRhLm5vZGVzWzBdIGluc3RhbmNlb2YgaTE4bi5JY3U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNJMThuQXR0cnMoZWxlbWVudDogaHRtbC5FbGVtZW50KTogYm9vbGVhbiB7XG4gIHJldHVybiBlbGVtZW50LmF0dHJzLnNvbWUoKGF0dHI6IGh0bWwuQXR0cmlidXRlKSA9PiBpc0kxOG5BdHRyaWJ1dGUoYXR0ci5uYW1lKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpY3VGcm9tSTE4bk1lc3NhZ2UobWVzc2FnZTogaTE4bi5NZXNzYWdlKSB7XG4gIHJldHVybiBtZXNzYWdlLm5vZGVzWzBdIGFzIGkxOG4uSWN1UGxhY2Vob2xkZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwSTE4blBsYWNlaG9sZGVyKGNvbnRlbnQ6IHN0cmluZyB8IG51bWJlciwgY29udGV4dElkOiBudW1iZXIgPSAwKTogc3RyaW5nIHtcbiAgY29uc3QgYmxvY2tJZCA9IGNvbnRleHRJZCA+IDAgPyBgOiR7Y29udGV4dElkfWAgOiAnJztcbiAgcmV0dXJuIGAke0kxOE5fUExBQ0VIT0xERVJfU1lNQk9MfSR7Y29udGVudH0ke2Jsb2NrSWR9JHtJMThOX1BMQUNFSE9MREVSX1NZTUJPTH1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVJMThuQm91bmRTdHJpbmcoXG4gICAgc3RyaW5nczogc3RyaW5nW10sIGJpbmRpbmdTdGFydEluZGV4OiBudW1iZXIgPSAwLCBjb250ZXh0SWQ6IG51bWJlciA9IDApOiBzdHJpbmcge1xuICBpZiAoIXN0cmluZ3MubGVuZ3RoKSByZXR1cm4gJyc7XG4gIGxldCBhY2MgPSAnJztcbiAgY29uc3QgbGFzdElkeCA9IHN0cmluZ3MubGVuZ3RoIC0gMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsYXN0SWR4OyBpKyspIHtcbiAgICBhY2MgKz0gYCR7c3RyaW5nc1tpXX0ke3dyYXBJMThuUGxhY2Vob2xkZXIoYmluZGluZ1N0YXJ0SW5kZXggKyBpLCBjb250ZXh0SWQpfWA7XG4gIH1cbiAgYWNjICs9IHN0cmluZ3NbbGFzdElkeF07XG4gIHJldHVybiBhY2M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXFOdW1iZXJHZW5lcmF0b3Ioc3RhcnRzQXQ6IG51bWJlciA9IDApOiAoKSA9PiBudW1iZXIge1xuICBsZXQgY3VycmVudCA9IHN0YXJ0c0F0O1xuICByZXR1cm4gKCkgPT4gY3VycmVudCsrO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGxhY2Vob2xkZXJzVG9QYXJhbXMocGxhY2Vob2xkZXJzOiBNYXA8c3RyaW5nLCBzdHJpbmdbXT4pOlxuICAgIHtbbmFtZTogc3RyaW5nXTogby5MaXRlcmFsRXhwcn0ge1xuICBjb25zdCBwYXJhbXM6IHtbbmFtZTogc3RyaW5nXTogby5MaXRlcmFsRXhwcn0gPSB7fTtcbiAgcGxhY2Vob2xkZXJzLmZvckVhY2goKHZhbHVlczogc3RyaW5nW10sIGtleTogc3RyaW5nKSA9PiB7XG4gICAgcGFyYW1zW2tleV0gPSBvLmxpdGVyYWwodmFsdWVzLmxlbmd0aCA+IDEgPyBgWyR7dmFsdWVzLmpvaW4oJ3wnKX1dYCA6IHZhbHVlc1swXSk7XG4gIH0pO1xuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUGxhY2Vob2xkZXJNYXAobWFwOiBNYXA8c3RyaW5nLCBhbnlbXT4sIG5hbWU6IHN0cmluZywgLi4udmFsdWVzOiBhbnlbXSkge1xuICBjb25zdCBjdXJyZW50ID0gbWFwLmdldChuYW1lKSB8fCBbXTtcbiAgY3VycmVudC5wdXNoKC4uLnZhbHVlcyk7XG4gIG1hcC5zZXQobmFtZSwgY3VycmVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZUJvdW5kVGV4dFBsYWNlaG9sZGVycyhcbiAgICBtZXRhOiBpMThuLkkxOG5NZXRhLCBiaW5kaW5nU3RhcnRJbmRleDogbnVtYmVyID0gMCwgY29udGV4dElkOiBudW1iZXIgPSAwKTogTWFwPHN0cmluZywgYW55W10+IHtcbiAgY29uc3Qgc3RhcnRJZHggPSBiaW5kaW5nU3RhcnRJbmRleDtcbiAgY29uc3QgcGxhY2Vob2xkZXJzID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcbiAgY29uc3Qgbm9kZSA9XG4gICAgICBtZXRhIGluc3RhbmNlb2YgaTE4bi5NZXNzYWdlID8gbWV0YS5ub2Rlcy5maW5kKG5vZGUgPT4gbm9kZSBpbnN0YW5jZW9mIGkxOG4uQ29udGFpbmVyKSA6IG1ldGE7XG4gIGlmIChub2RlKSB7XG4gICAgKG5vZGUgYXMgaTE4bi5Db250YWluZXIpXG4gICAgICAgIC5jaGlsZHJlblxuICAgICAgICAuZmlsdGVyKChjaGlsZDogaTE4bi5Ob2RlKTogY2hpbGQgaXMgaTE4bi5QbGFjZWhvbGRlciA9PiBjaGlsZCBpbnN0YW5jZW9mIGkxOG4uUGxhY2Vob2xkZXIpXG4gICAgICAgIC5mb3JFYWNoKChjaGlsZDogaTE4bi5QbGFjZWhvbGRlciwgaWR4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICBjb25zdCBjb250ZW50ID0gd3JhcEkxOG5QbGFjZWhvbGRlcihzdGFydElkeCArIGlkeCwgY29udGV4dElkKTtcbiAgICAgICAgICB1cGRhdGVQbGFjZWhvbGRlck1hcChwbGFjZWhvbGRlcnMsIGNoaWxkLm5hbWUsIGNvbnRlbnQpO1xuICAgICAgICB9KTtcbiAgfVxuICByZXR1cm4gcGxhY2Vob2xkZXJzO1xufVxuXG4vKipcbiAqIEZvcm1hdCB0aGUgcGxhY2Vob2xkZXIgbmFtZXMgaW4gYSBtYXAgb2YgcGxhY2Vob2xkZXJzIHRvIGV4cHJlc3Npb25zLlxuICpcbiAqIFRoZSBwbGFjZWhvbGRlciBuYW1lcyBhcmUgY29udmVydGVkIGZyb20gXCJpbnRlcm5hbFwiIGZvcm1hdCAoZS5nLiBgU1RBUlRfVEFHX0RJVl8xYCkgdG8gXCJleHRlcm5hbFwiXG4gKiBmb3JtYXQgKGUuZy4gYHN0YXJ0VGFnRGl2XzFgKS5cbiAqXG4gKiBAcGFyYW0gcGFyYW1zIEEgbWFwIG9mIHBsYWNlaG9sZGVyIG5hbWVzIHRvIGV4cHJlc3Npb25zLlxuICogQHBhcmFtIHVzZUNhbWVsQ2FzZSB3aGV0aGVyIHRvIGNhbWVsQ2FzZSB0aGUgcGxhY2Vob2xkZXIgbmFtZSB3aGVuIGZvcm1hdHRpbmcuXG4gKiBAcmV0dXJucyBBIG5ldyBtYXAgb2YgZm9ybWF0dGVkIHBsYWNlaG9sZGVyIG5hbWVzIHRvIGV4cHJlc3Npb25zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaTE4bkZvcm1hdFBsYWNlaG9sZGVyTmFtZXMoXG4gICAgcGFyYW1zOiB7W25hbWU6IHN0cmluZ106IG8uRXhwcmVzc2lvbn0gPSB7fSwgdXNlQ2FtZWxDYXNlOiBib29sZWFuKSB7XG4gIGNvbnN0IF9wYXJhbXM6IHtba2V5OiBzdHJpbmddOiBvLkV4cHJlc3Npb259ID0ge307XG4gIGlmIChwYXJhbXMgJiYgT2JqZWN0LmtleXMocGFyYW1zKS5sZW5ndGgpIHtcbiAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goXG4gICAgICAgIGtleSA9PiBfcGFyYW1zW2Zvcm1hdEkxOG5QbGFjZWhvbGRlck5hbWUoa2V5LCB1c2VDYW1lbENhc2UpXSA9IHBhcmFtc1trZXldKTtcbiAgfVxuICByZXR1cm4gX3BhcmFtcztcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBpbnRlcm5hbCBwbGFjZWhvbGRlciBuYW1lcyB0byBwdWJsaWMtZmFjaW5nIGZvcm1hdFxuICogKGZvciBleGFtcGxlIHRvIHVzZSBpbiBnb29nLmdldE1zZyBjYWxsKS5cbiAqIEV4YW1wbGU6IGBTVEFSVF9UQUdfRElWXzFgIGlzIGNvbnZlcnRlZCB0byBgc3RhcnRUYWdEaXZfMWAuXG4gKlxuICogQHBhcmFtIG5hbWUgVGhlIHBsYWNlaG9sZGVyIG5hbWUgdGhhdCBzaG91bGQgYmUgZm9ybWF0dGVkXG4gKiBAcmV0dXJucyBGb3JtYXR0ZWQgcGxhY2Vob2xkZXIgbmFtZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0STE4blBsYWNlaG9sZGVyTmFtZShuYW1lOiBzdHJpbmcsIHVzZUNhbWVsQ2FzZTogYm9vbGVhbiA9IHRydWUpOiBzdHJpbmcge1xuICBjb25zdCBwdWJsaWNOYW1lID0gdG9QdWJsaWNOYW1lKG5hbWUpO1xuICBpZiAoIXVzZUNhbWVsQ2FzZSkge1xuICAgIHJldHVybiBwdWJsaWNOYW1lO1xuICB9XG4gIGNvbnN0IGNodW5rcyA9IHB1YmxpY05hbWUuc3BsaXQoJ18nKTtcbiAgaWYgKGNodW5rcy5sZW5ndGggPT09IDEpIHtcbiAgICAvLyBpZiBubyBcIl9cIiBmb3VuZCAtIGp1c3QgbG93ZXJjYXNlIHRoZSB2YWx1ZVxuICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gIH1cbiAgbGV0IHBvc3RmaXg7XG4gIC8vIGVqZWN0IGxhc3QgZWxlbWVudCBpZiBpdCdzIGEgbnVtYmVyXG4gIGlmICgvXlxcZCskLy50ZXN0KGNodW5rc1tjaHVua3MubGVuZ3RoIC0gMV0pKSB7XG4gICAgcG9zdGZpeCA9IGNodW5rcy5wb3AoKTtcbiAgfVxuICBsZXQgcmF3ID0gY2h1bmtzLnNoaWZ0KCkgIS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoY2h1bmtzLmxlbmd0aCkge1xuICAgIHJhdyArPSBjaHVua3MubWFwKGMgPT4gYy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGMuc2xpY2UoMSkudG9Mb3dlckNhc2UoKSkuam9pbignJyk7XG4gIH1cbiAgcmV0dXJuIHBvc3RmaXggPyBgJHtyYXd9XyR7cG9zdGZpeH1gIDogcmF3O1xufVxuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHByZWZpeCBmb3IgdHJhbnNsYXRpb24gY29uc3QgbmFtZS5cbiAqXG4gKiBAcGFyYW0gZXh0cmEgQWRkaXRpb25hbCBsb2NhbCBwcmVmaXggdGhhdCBzaG91bGQgYmUgaW5qZWN0ZWQgaW50byB0cmFuc2xhdGlvbiB2YXIgbmFtZVxuICogQHJldHVybnMgQ29tcGxldGUgdHJhbnNsYXRpb24gY29uc3QgcHJlZml4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUcmFuc2xhdGlvbkNvbnN0UHJlZml4KGV4dHJhOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7Q0xPU1VSRV9UUkFOU0xBVElPTl9QUkVGSVh9JHtleHRyYX1gLnRvVXBwZXJDYXNlKCk7XG59XG5cbi8qKlxuICogR2VuZXJhdGUgQVNUIHRvIGRlY2xhcmUgYSB2YXJpYWJsZS4gRS5nLiBgdmFyIEkxOE5fMTtgLlxuICogQHBhcmFtIHZhcmlhYmxlIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZSB0byBkZWNsYXJlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVjbGFyZUkxOG5WYXJpYWJsZSh2YXJpYWJsZTogby5SZWFkVmFyRXhwcik6IG8uU3RhdGVtZW50IHtcbiAgcmV0dXJuIG5ldyBvLkRlY2xhcmVWYXJTdG10KFxuICAgICAgdmFyaWFibGUubmFtZSAhLCB1bmRlZmluZWQsIG8uSU5GRVJSRURfVFlQRSwgbnVsbCwgdmFyaWFibGUuc291cmNlU3Bhbik7XG59XG4iXX0=