[![Build Status](https://travis-ci.org/A11yance/axobject-query.svg?branch=master)](https://travis-ci.org/A11yance/axobject-query)

**NOTICE: The API for AXObject Query is very much under development until a major version release. Please be aware that data structures might change in minor version releases before 1.0.0 is released.**

# AXObject Query

Approximate model of the [Chrome AXObject](https://cs.chromium.org/chromium/src/third_party/WebKit/Source/modules/accessibility/AXObject.h).

The project attempts to map the AXObject concepts to the [WAI-ARIA 1.1 Roles Model](https://www.w3.org/TR/wai-aria-1.1/#roles) so that a complete representation of the semantic HTML layer, as it is exposed assistive technology, can be obtained.

## Utilities

### AXObjects

```javascript
import { AXObjects } from 'axobject-query';
```

AXObjects are mapped to their HTML and ARIA concepts in the `relatedConcepts` field.

The `type` field is a loose association of an AXObject to the `window`, `structure` and `widget` abstract roles in ARIA. The `generic` value is given to `DivRole`; it does not exist in ARIA. Divs are special in HTML in the way that they are used as generic containers. Span might have also been associated with a generic type except that there is no `SpanRole` AXObject.

```
Map {
  'AbbrRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'AlertDialogRole' => { relatedConcepts: [ [Object] ], type: 'window' },
  'AlertRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'AnnotationRole' => { relatedConcepts: [], type: 'structure' },
  'ApplicationRole' => { relatedConcepts: [ [Object] ], type: 'window' },
  'ArticleRole' => { relatedConcepts: [ [Object], [Object] ], type: 'structure' },
  'AudioRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'BannerRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'BlockquoteRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'BusyIndicatorRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'ButtonRole' => { relatedConcepts: [ [Object], [Object] ], type: 'widget' },
  'CanvasRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'CaptionRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'CellRole' => { relatedConcepts: [ [Object], [Object], [Object] ], type: 'widget' },
  'CheckBoxRole' => { relatedConcepts: [ [Object], [Object] ], type: 'widget' },
  'ColorWellRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'ColumnHeaderRole' => { relatedConcepts: [ [Object], [Object] ], type: 'widget' },
  'ColumnRole' => { relatedConcepts: [], type: 'structure' },
  'ComboBoxRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'ComplementaryRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'ContentInfoRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'DateRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'DateTimeRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'DefinitionRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'DescriptionListDetailRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'DescriptionListRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'DescriptionListTermRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'DetailsRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'DialogRole' => { relatedConcepts: [ [Object], [Object] ], type: 'window' },
  'DirectoryRole' => { relatedConcepts: [ [Object], [Object] ], type: 'structure' },
  'DisclosureTriangleRole' => { relatedConcepts: [], type: 'widget' },
  'DivRole' => { relatedConcepts: [ [Object] ], type: 'generic' },
  'DocumentRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'EmbeddedObjectRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'FeedRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'FigcaptionRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'FigureRole' => { relatedConcepts: [ [Object], [Object] ], type: 'structure' },
  'FooterRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'FormRole' => { relatedConcepts: [ [Object], [Object] ], type: 'structure' },
  'GridRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'GroupRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'HeadingRole' => { relatedConcepts: [ [Object], [Object], [Object], [Object], [Object], [Object], [Object] ], type: 'structure' },
  'IframePresentationalRole' => { relatedConcepts: [], type: 'window' },
  'IframeRole' => { relatedConcepts: [ [Object] ], type: 'window' },
  'IgnoredRole' => { relatedConcepts: [], type: 'structure' },
  'ImageMapLinkRole' => { relatedConcepts: [], type: 'widget' },
  'ImageMapRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'ImageRole' => { relatedConcepts: [ [Object], [Object] ], type: 'structure' },
  'InlineTextBoxRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'InputTimeRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'LabelRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'LegendRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'LineBreakRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'LinkRole' => { relatedConcepts: [ [Object], [Object] ], type: 'widget' },
  'ListBoxOptionRole' => { relatedConcepts: [ [Object], [Object] ], type: 'widget' },
  'ListBoxRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'ListItemRole' => { relatedConcepts: [ [Object], [Object] ], type: 'structure' },
  'ListMarkerRole' => { relatedConcepts: [], type: 'structure' },
  'ListRole' => { relatedConcepts: [ [Object], [Object], [Object] ], type: 'structure' },
  'LogRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'MainRole' => { relatedConcepts: [ [Object], [Object] ], type: 'structure' },
  'MarkRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'MarqueeRole' => { relatedConcepts: [ [Object], [Object] ], type: 'structure' },
  'MathRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'MenuBarRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'MenuButtonRole' => { relatedConcepts: [], type: 'widget' },
  'MenuItemRole' => { relatedConcepts: [ [Object], [Object] ], type: 'widget' },
  'MenuItemCheckBoxRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'MenuItemRadioRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'MenuListOptionRole' => { relatedConcepts: [], type: 'widget' },
  'MenuListPopupRole' => { relatedConcepts: [], type: 'widget' },
  'MenuRole' => { relatedConcepts: [ [Object], [Object] ], type: 'structure' },
  'MeterRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'NavigationRole' => { relatedConcepts: [ [Object], [Object] ], type: 'structure' },
  'NoneRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'NoteRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'OutlineRole' => { relatedConcepts: [], type: 'structure' },
  'ParagraphRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'PopUpButtonRole' => { relatedConcepts: [], type: 'widget' },
  'PreRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'PresentationalRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'ProgressIndicatorRole' => { relatedConcepts: [ [Object], [Object] ], type: 'structure' },
  'RadioButtonRole' => { relatedConcepts: [ [Object], [Object] ], type: 'widget' },
  'RadioGroupRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'RegionRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'RootWebAreaRole' => { relatedConcepts: [], type: 'structure' },
  'RowHeaderRole' => { relatedConcepts: [ [Object], [Object] ], type: 'widget' },
  'RowRole' => { relatedConcepts: [ [Object], [Object] ], type: 'structure' },
  'RubyRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'RulerRole' => { relatedConcepts: [], type: 'structure' },
  'ScrollAreaRole' => { relatedConcepts: [], type: 'structure' },
  'ScrollBarRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'SeamlessWebAreaRole' => { relatedConcepts: [], type: 'structure' },
  'SearchRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'SearchBoxRole' => { relatedConcepts: [ [Object], [Object] ], type: 'widget' },
  'SliderRole' => { relatedConcepts: [ [Object], [Object] ], type: 'widget' },
  'SliderThumbRole' => { relatedConcepts: [], type: 'structure' },
  'SpinButtonRole' => { relatedConcepts: [ [Object], [Object] ], type: 'widget' },
  'SpinButtonPartRole' => { relatedConcepts: [], type: 'structure' },
  'SplitterRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'StaticTextRole' => { relatedConcepts: [], type: 'structure' },
  'StatusRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'SVGRootRole' => { relatedConcepts: [], type: 'structure' },
  'SwitchRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'TabGroupRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'TabRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'TableHeaderContainerRole' => { relatedConcepts: [], type: 'structure' },
  'TableRole' => { relatedConcepts: [ [Object], [Object] ], type: 'structure' },
  'TabListRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'TabPanelRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'TermRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'TextFieldRole' => { relatedConcepts: [ [Object], [Object], [Object] ], type: 'widget' },
  'TimeRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'TimerRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'ToggleButtonRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'ToolbarRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'TreeRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'TreeGridRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'TreeItemRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'UserInterfaceTooltipRole' => { relatedConcepts: [ [Object] ], type: 'structure' },
  'VideoRole' => { relatedConcepts: [ [Object] ], type: 'widget' },
  'WebAreaRole' => { relatedConcepts: [], type: 'structure' },
  'WindowRole' => { relatedConcepts: [], type: 'window' }
}
```

### AXObject to Element

```javascript
import { AXObjectElements } from 'axobject-query';
```

AXObjects are mapped to their related HTML concepts, which may require attributes (in the case of inputs) to obtain the correct association.

```
Map {
  'AbbrRole' => Set { { name: 'abbr' } },
  'ArticleRole' => Set { { name: 'article' } },
  'AudioRole' => Set { { name: 'audio' } },
  'BlockquoteRole' => Set { { name: 'blockquote' } },
  'ButtonRole' => Set { { name: 'button' } },
  'CanvasRole' => Set { { name: 'canvas' } },
  'CaptionRole' => Set { { name: 'caption' } },
  'CellRole' => Set { { name: 'td' } },
  'CheckBoxRole' => Set { { name: 'input', attributes: [Object] } },
  'ColorWellRole' => Set { { name: 'input', attributes: [Object] } },
  'ColumnHeaderRole' => Set { { name: 'th' } },
  'DateRole' => Set { { name: 'input', attributes: [Object] } },
  'DateTimeRole' => Set { { name: 'input', attributes: [Object] } },
  'DefinitionRole' => Set { { name: 'dfn' } },
  'DescriptionListDetailRole' => Set { { name: 'dd' } },
  'DescriptionListRole' => Set { { name: 'dl' } },
  'DescriptionListTermRole' => Set { { name: 'dt' } },
  'DetailsRole' => Set { { name: 'details' } },
  'DialogRole' => Set { { name: 'dialog' } },
  'DirectoryRole' => Set { { name: 'dir' } },
  'DivRole' => Set { { name: 'div' } },
  'EmbeddedObjectRole' => Set { { name: 'embed' } },
  'FigcaptionRole' => Set { { name: 'figcaption' } },
  'FigureRole' => Set { { name: 'figure' } },
  'FooterRole' => Set { { name: 'footer' } },
  'FormRole' => Set { { name: 'form' } },
  'HeadingRole' => Set { { name: 'h1' }, { name: 'h2' }, { name: 'h3' }, { name: 'h4' }, { name: 'h5' }, { name: 'h6' } },
  'IframeRole' => Set { { name: 'iframe' } },
  'ImageMapRole' => Set { { name: 'img', attributes: [Object] } },
  'ImageRole' => Set { { name: 'img' } },
  'InlineTextBoxRole' => Set { { name: 'input' } },
  'InputTimeRole' => Set { { name: 'input', attributes: [Object] } },
  'LabelRole' => Set { { name: 'label' } },
  'LegendRole' => Set { { name: 'legend' } },
  'LineBreakRole' => Set { { name: 'br' } },
  'LinkRole' => Set { { name: 'a', attributes: [Object] } },
  'ListBoxOptionRole' => Set { { name: 'option' } },
  'ListItemRole' => Set { { name: 'li' } },
  'ListRole' => Set { { name: 'ul' }, { name: 'ol' } },
  'MainRole' => Set { { name: 'main' } },
  'MarkRole' => Set { { name: 'mark' } },
  'MarqueeRole' => Set { { name: 'marquee' } },
  'MenuItemRole' => Set { { name: 'menuitem' } },
  'MenuRole' => Set { { name: 'menu' } },
  'MeterRole' => Set { { name: 'meter' } },
  'NavigationRole' => Set { { name: 'nav' } },
  'ParagraphRole' => Set { { name: 'p' } },
  'PreRole' => Set { { name: 'pre' } },
  'ProgressIndicatorRole' => Set { { name: 'progress' } },
  'RadioButtonRole' => Set { { name: 'input', attributes: [Object] } },
  'RowHeaderRole' => Set { { name: 'th', attributes: [Object] } },
  'RowRole' => Set { { name: 'tr' } },
  'RubyRole' => Set { { name: 'ruby' } },
  'SearchBoxRole' => Set { { name: 'input', attributes: [Object] } },
  'SliderRole' => Set { { name: 'input', attributes: [Object] } },
  'SpinButtonRole' => Set { { name: 'input', attributes: [Object] } },
  'TableRole' => Set { { name: 'table' } },
  'TextFieldRole' => Set { { name: 'input' }, { name: 'input', attributes: [Object] } },
  'TimeRole' => Set { { name: 'time' } },
  'VideoRole' => Set { { name: 'video' }
}
```

### AXObject to Role

```javascript
import { AXObjectRoles } from 'axobject-query';
```

AXObjects are mapped to their related ARIA concepts..

```
Map {
  'AlertDialogRole' => Set { { name: 'alertdialog' } },
  'AlertRole' => Set { { name: 'alert' } },
  'ApplicationRole' => Set { { name: 'application' } },
  'ArticleRole' => Set { { name: 'article' } },
  'BannerRole' => Set { { name: 'banner' } },
  'BusyIndicatorRole' => Set { { attributes: [Object] } },
  'ButtonRole' => Set { { name: 'button' } },
  'CellRole' => Set { { name: 'cell' }, { name: 'gridcell' } },
  'CheckBoxRole' => Set { { name: 'checkbox' } },
  'ColumnHeaderRole' => Set { { name: 'columnheader' } },
  'ComboBoxRole' => Set { { name: 'combobox' } },
  'ComplementaryRole' => Set { { name: 'complementary' } },
  'ContentInfoRole' => Set { { name: 'structureinfo' } },
  'DialogRole' => Set { { name: 'dialog' } },
  'DirectoryRole' => Set { { name: 'directory' } },
  'DocumentRole' => Set { { name: 'document' } },
  'FeedRole' => Set { { name: 'feed' } },
  'FigureRole' => Set { { name: 'figure' } },
  'FormRole' => Set { { name: 'form' } },
  'GridRole' => Set { { name: 'grid' } },
  'GroupRole' => Set { { name: 'group' } },
  'HeadingRole' => Set { { name: 'heading' } },
  'ImageRole' => Set { { name: 'img' } },
  'LinkRole' => Set { { name: 'link' } },
  'ListBoxOptionRole' => Set { { name: 'option' } },
  'ListBoxRole' => Set { { name: 'listbox' } },
  'ListItemRole' => Set { { name: 'listitem' } },
  'ListRole' => Set { { name: 'list' } },
  'LogRole' => Set { { name: 'log' } },
  'MainRole' => Set { { name: 'main' } },
  'MarqueeRole' => Set { { name: 'marquee' } },
  'MathRole' => Set { { name: 'math' } },
  'MenuBarRole' => Set { { name: 'menubar' } },
  'MenuItemRole' => Set { { name: 'menuitem' } },
  'MenuItemCheckBoxRole' => Set { { name: 'menuitemcheckbox' } },
  'MenuItemRadioRole' => Set { { name: 'menuitemradio' } },
  'MenuRole' => Set { { name: 'menu' } },
  'NavigationRole' => Set { { name: 'navigation' } },
  'NoneRole' => Set { { name: 'none' } },
  'NoteRole' => Set { { name: 'note' } },
  'PresentationalRole' => Set { { name: 'presentation' } },
  'ProgressIndicatorRole' => Set { { name: 'progressbar' } },
  'RadioButtonRole' => Set { { name: 'radio' } },
  'RadioGroupRole' => Set { { name: 'radiogroup' } },
  'RegionRole' => Set { { name: 'region' } },
  'RowHeaderRole' => Set { { name: 'rowheader' } },
  'RowRole' => Set { { name: 'row' } },
  'ScrollBarRole' => Set { { name: 'scrollbar' } },
  'SearchRole' => Set { { name: 'search' } },
  'SearchBoxRole' => Set { { name: 'searchbox' } },
  'SliderRole' => Set { { name: 'slider' } },
  'SpinButtonRole' => Set { { name: 'spinbutton' } },
  'SplitterRole' => Set { { name: 'separator' } },
  'StatusRole' => Set { { name: 'status' } },
  'SwitchRole' => Set { { name: 'switch' } },
  'TabGroupRole' => Set { { name: 'tablist' } },
  'TabRole' => Set { { name: 'tab' } },
  'TableRole' => Set { { name: 'table' } },
  'TabListRole' => Set { { name: 'tablist' } },
  'TabPanelRole' => Set { { name: 'tabpanel' } },
  'TermRole' => Set { { name: 'term' } },
  'TextFieldRole' => Set { { name: 'textbox' } },
  'TimerRole' => Set { { name: 'timer' } },
  'ToggleButtonRole' => Set { { attributes: [Object] } },
  'ToolbarRole' => Set { { name: 'toolbar' } },
  'TreeRole' => Set { { name: 'tree' } },
  'TreeGridRole' => Set { { name: 'treegrid' } },
  'TreeItemRole' => Set { { name: 'treeitem' } },
  'UserInterfaceTooltipRole' => Set { { name: 'tooltip' } }
}
```

### Element to AXObject

```javascript
import { elementAXObjects } from 'axobject-query';
```

HTML elements are mapped to their related AXConcepts concepts.

```
Map {
  { name: 'abbr' } => Set { 'AbbrRole' },
  { name: 'article' } => Set { 'ArticleRole' },
  { name: 'audio' } => Set { 'AudioRole' },
  { name: 'blockquote' } => Set { 'BlockquoteRole' },
  { name: 'button' } => Set { 'ButtonRole' },
  { name: 'canvas' } => Set { 'CanvasRole' },
  { name: 'caption' } => Set { 'CaptionRole' },
  { name: 'td' } => Set { 'CellRole' },
  { name: 'input', attributes: [ [Object] ] } => Set { 'CheckBoxRole' },
  { name: 'input', attributes: [ [Object] ] } => Set { 'ColorWellRole' },
  { name: 'th' } => Set { 'ColumnHeaderRole' },
  { name: 'input', attributes: [ [Object] ] } => Set { 'DateRole' },
  { name: 'input', attributes: [ [Object] ] } => Set { 'DateTimeRole' },
  { name: 'dfn' } => Set { 'DefinitionRole' },
  { name: 'dd' } => Set { 'DescriptionListDetailRole' },
  { name: 'dl' } => Set { 'DescriptionListRole' },
  { name: 'dt' } => Set { 'DescriptionListTermRole' },
  { name: 'details' } => Set { 'DetailsRole' },
  { name: 'dialog' } => Set { 'DialogRole' },
  { name: 'dir' } => Set { 'DirectoryRole' },
  { name: 'div' } => Set { 'DivRole' },
  { name: 'embed' } => Set { 'EmbeddedObjectRole' },
  { name: 'figcaption' } => Set { 'FigcaptionRole' },
  { name: 'figure' } => Set { 'FigureRole' },
  { name: 'footer' } => Set { 'FooterRole' },
  { name: 'form' } => Set { 'FormRole' },
  { name: 'h1' } => Set { 'HeadingRole' },
  { name: 'h2' } => Set { 'HeadingRole' },
  { name: 'h3' } => Set { 'HeadingRole' },
  { name: 'h4' } => Set { 'HeadingRole' },
  { name: 'h5' } => Set { 'HeadingRole' },
  { name: 'h6' } => Set { 'HeadingRole' },
  { name: 'iframe' } => Set { 'IframeRole' },
  { name: 'img', attributes: [ [Object] ] } => Set { 'ImageMapRole' },
  { name: 'img' } => Set { 'ImageRole' },
  { name: 'input' } => Set { 'InlineTextBoxRole', 'TextFieldRole' },
  { name: 'input', attributes: [ [Object] ] } => Set { 'InputTimeRole' },
  { name: 'label' } => Set { 'LabelRole' },
  { name: 'legend' } => Set { 'LegendRole' },
  { name: 'br' } => Set { 'LineBreakRole' },
  { name: 'a', attributes: [ [Object] ] } => Set { 'LinkRole' },
  { name: 'option' } => Set { 'ListBoxOptionRole' },
  { name: 'li' } => Set { 'ListItemRole' },
  { name: 'ul' } => Set { 'ListRole' },
  { name: 'ol' } => Set { 'ListRole' },
  { name: 'main' } => Set { 'MainRole' },
  { name: 'mark' } => Set { 'MarkRole' },
  { name: 'marquee' } => Set { 'MarqueeRole' },
  { name: 'menuitem' } => Set { 'MenuItemRole' },
  { name: 'menu' } => Set { 'MenuRole' },
  { name: 'meter' } => Set { 'MeterRole' },
  { name: 'nav' } => Set { 'NavigationRole' },
  { name: 'p' } => Set { 'ParagraphRole' },
  { name: 'pre' } => Set { 'PreRole' },
  { name: 'progress' } => Set { 'ProgressIndicatorRole' },
  { name: 'input', attributes: [ [Object] ] } => Set { 'RadioButtonRole' },
  { name: 'th', attributes: [ [Object] ] } => Set { 'RowHeaderRole' },
  { name: 'tr' } => Set { 'RowRole' },
  { name: 'ruby' } => Set { 'RubyRole' },
  { name: 'input', attributes: [ [Object] ] } => Set { 'SearchBoxRole' },
  { name: 'input', attributes: [ [Object] ] } => Set { 'SliderRole' },
  { name: 'input', attributes: [ [Object] ] } => Set { 'SpinButtonRole' },
  { name: 'table' } => Set { 'TableRole' },
  { name: 'input' } => Set { 'InlineTextBoxRole', 'TextFieldRole' },
  { name: 'input', attributes: [ [Object] ] } => Set { 'TextFieldRole' },
  { name: 'time' } => Set { 'TimeRole' },
  { name: 'video' } => Set { 'VideoRole' }
}
```