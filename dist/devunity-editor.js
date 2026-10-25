/*!
 * DevUnity Editor v1.0.0
 * Lightweight, dependency-free WYSIWYG editor with first-class RTL / Arabic support.
 * (c) 2026 DevUnity — https://devunity.co — MIT License
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DevUnityEditor = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '1.0.0';
  var HAS_DOM = typeof document !== 'undefined';

  /* ------------------------------------------------------------------ *
   * i18n
   * ------------------------------------------------------------------ */
  var LANGS = {
    en: {
      undo: 'Undo', redo: 'Redo', format: 'Paragraph format', normal: 'Normal', heading: 'Heading',
      fontSize: 'Font size', fontFamily: 'Font', lineHeight: 'Line height',
      bold: 'Bold', italic: 'Italic', underline: 'Underline', strike: 'Strikethrough',
      subscript: 'Subscript', superscript: 'Superscript', inlineCode: 'Inline code',
      foreColor: 'Text color', backColor: 'Highlight color',
      align: 'Alignment', alignLeft: 'Align left', alignCenter: 'Align center', alignRight: 'Align right', alignJustify: 'Justify',
      direction: 'Text direction', rtl: 'Right to left', ltr: 'Left to right',
      ul: 'Bulleted list', ol: 'Numbered list', indent: 'Increase indent', outdent: 'Decrease indent',
      link: 'Insert link', unlink: 'Remove link', image: 'Insert image', video: 'Video / embed', table: 'Insert table',
      emoji: 'Emoji', hr: 'Horizontal line', blockquote: 'Quote', codeBlock: 'Code block',
      removeFormat: 'Clear formatting', findReplace: 'Find & replace', source: 'HTML source', print: 'Print', fullscreen: 'Fullscreen',
      url: 'URL', text: 'Text', newTab: 'Open in a new tab', insert: 'Insert', save: 'Save', cancel: 'Cancel', or: 'or',
      alt: 'Alt text (describes the image)', dropImage: 'Choose an image or drop it here',
      embedUrl: 'YouTube, Vimeo, Google Maps, .mp4 link or <iframe> code',
      placeholder: 'Start writing…', words: 'words', chars: 'characters', default: 'Default',
      none: 'No color', custom: 'Custom color', headerRow: 'Header row',
      find: 'Find', replaceWith: 'Replace with', matchCase: 'Match case', replaceAll: 'Replace all',
      matches: 'matches', replaced: 'replaced',
      tooLarge: 'Image is larger than the allowed size', uploadFailed: 'Image upload failed', invalidUrl: 'Invalid link',
      unsupportedEmbed: 'This link can’t be embedded',
      rowBefore: 'Insert row above', rowAfter: 'Insert row below', colBefore: 'Insert column before', colAfter: 'Insert column after',
      delRow: 'Delete row', delCol: 'Delete column', delTable: 'Delete table',
      openLink: 'Open link', editLink: 'Edit link', remove: 'Remove',
      imgLeft: 'Float left', imgCenter: 'Center', imgRight: 'Float right', imgInline: 'Inline', editAlt: 'Alt text'
    },
    ar: {
      undo: 'تراجع', redo: 'إعادة', format: 'نوع الفقرة', normal: 'فقرة عادية', heading: 'عنوان',
      fontSize: 'حجم الخط', fontFamily: 'نوع الخط', lineHeight: 'تباعد الأسطر',
      bold: 'عريض', italic: 'مائل', underline: 'تسطير', strike: 'يتوسطه خط',
      subscript: 'منخفض', superscript: 'مرتفع', inlineCode: 'كود داخل السطر',
      foreColor: 'لون النص', backColor: 'لون التظليل',
      align: 'المحاذاة', alignLeft: 'محاذاة لليسار', alignCenter: 'توسيط', alignRight: 'محاذاة لليمين', alignJustify: 'ضبط',
      direction: 'اتجاه النص', rtl: 'من اليمين لليسار', ltr: 'من اليسار لليمين',
      ul: 'قائمة نقطية', ol: 'قائمة مرقمة', indent: 'زيادة المسافة', outdent: 'إنقاص المسافة',
      link: 'إدراج رابط', unlink: 'إزالة الرابط', image: 'إدراج صورة', video: 'فيديو / تضمين', table: 'إدراج جدول',
      emoji: 'إيموجي', hr: 'خط فاصل', blockquote: 'اقتباس', codeBlock: 'كتلة كود',
      removeFormat: 'مسح التنسيق', findReplace: 'بحث واستبدال', source: 'كود HTML', print: 'طباعة', fullscreen: 'ملء الشاشة',
      url: 'الرابط', text: 'النص', newTab: 'فتح في تبويب جديد', insert: 'إدراج', save: 'حفظ', cancel: 'إلغاء', or: 'أو',
      alt: 'نص بديل (وصف الصورة)', dropImage: 'اختر صورة أو اسحبها هنا',
      embedUrl: 'رابط يوتيوب أو فيميو أو خرائط جوجل أو ملف mp4 أو كود iframe',
      placeholder: 'ابدأ الكتابة هنا…', words: 'كلمة', chars: 'حرف', default: 'افتراضي',
      none: 'بدون لون', custom: 'لون مخصص', headerRow: 'صف عناوين',
      find: 'بحث عن', replaceWith: 'استبدال بـ', matchCase: 'مطابقة حالة الأحرف', replaceAll: 'استبدال الكل',
      matches: 'نتيجة', replaced: 'تم الاستبدال',
      tooLarge: 'حجم الصورة أكبر من المسموح', uploadFailed: 'فشل رفع الصورة', invalidUrl: 'رابط غير صالح',
      unsupportedEmbed: 'لا يمكن تضمين هذا الرابط',
      rowBefore: 'إضافة صف أعلى', rowAfter: 'إضافة صف أسفل', colBefore: 'إضافة عمود قبل', colAfter: 'إضافة عمود بعد',
      delRow: 'حذف الصف', delCol: 'حذف العمود', delTable: 'حذف الجدول',
      openLink: 'فتح الرابط', editLink: 'تعديل الرابط', remove: 'حذف',
      imgLeft: 'يسار', imgCenter: 'وسط', imgRight: 'يمين', imgInline: 'داخل السطر', editAlt: 'النص البديل'
    }
  };

  /* ------------------------------------------------------------------ *
   * Icons (24x24 stroke)
   * ------------------------------------------------------------------ */
  function svg(p) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }
  var I = {
    undo: svg('<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>'),
    redo: svg('<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>'),
    bold: svg('<path d="M6 4h8a4 4 0 0 1 0 8H6z"/><path d="M6 12h9a4 4 0 0 1 0 8H6z"/>'),
    italic: svg('<path d="M19 4h-9M14 20H5M15 4 9 20"/>'),
    underline: svg('<path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"/>'),
    strike: svg('<path d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6M4 12h16"/>'),
    subscript: svg('<path d="m4 5 8 8M12 5l-8 8M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14a2 2 0 0 0-3.9-.6"/>'),
    superscript: svg('<path d="m4 19 8-8M12 19l-8-8M20 12h-4c0-1.5.44-2 1.5-2.5S20 8.33 20 7a2 2 0 0 0-3.9-.6"/>'),
    inlineCode: svg('<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>'),
    codeBlock: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m10 9-3 3 3 3M14 15l3-3-3-3"/>'),
    textColor: svg('<path d="m6 15 6-12 6 12M8.5 10h7"/>'),
    highlight: svg('<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>'),
    alignLeft: svg('<path d="M3 6h18M3 12h12M3 18h16"/>'),
    alignCenter: svg('<path d="M3 6h18M6 12h12M4 18h16"/>'),
    alignRight: svg('<path d="M3 6h18M9 12h12M5 18h16"/>'),
    alignJustify: svg('<path d="M3 6h18M3 12h18M3 18h18"/>'),
    ul: svg('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>'),
    ol: svg('<path d="M10 6h11M10 12h11M10 18h11M4 4h1v4M4 8h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>'),
    indent: svg('<path d="m3 8 4 4-4 4M21 12H11M21 6H11M21 18H11"/>'),
    outdent: svg('<path d="M7 8l-4 4 4 4M21 12H11M21 6H11M21 18H11"/>'),
    link: svg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
    unlink: svg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/><path d="M3 3l18 18"/>'),
    image: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>'),
    video: svg('<rect x="2" y="5" width="15" height="14" rx="2"/><path d="m17 10 5-3v10l-5-3"/>'),
    table: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M12 3v18"/>'),
    emoji: svg('<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>'),
    hr: svg('<path d="M3 12h18"/><path d="M8 6h8M8 18h8" opacity=".35"/>'),
    quote: svg('<path d="M6 17h3l2-4V7H5v6h3zM14 17h3l2-4V7h-6v6h3z"/>'),
    clear: svg('<path d="M4 7V4h16v3M5 20h6M13 4 8 20M15 15l5 5M20 15l-5 5"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>'),
    source: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M10 13l-2 2 2 2M14 17l2-2-2-2"/>'),
    print: svg('<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>'),
    full: svg('<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>'),
    lineHeight: svg('<path d="m3 7 3-3 3 3M6 4v16M3 17l3 3 3-3M13 6h8M13 12h8M13 18h8"/>'),
    rtl: svg('<path d="M10 4v9M14 4v9M16 4H9.5a3.5 3.5 0 0 0 0 7H10M20 18H4m3-3-3 3 3 3"/>'),
    ltr: svg('<path d="M10 4v9M14 4v9M16 4H9.5a3.5 3.5 0 0 0 0 7H10M4 18h16m-3-3 3 3-3 3"/>'),
    upload: svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>'),
    edit: svg('<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
    external: svg('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>'),
    trash: svg('<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2"/>'),
    close: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
    chev: svg('<path d="m6 9 6 6 6-6"/>'),
    rowBefore: svg('<rect x="3" y="12" width="18" height="8" rx="1"/><path d="M12 2v7M8.5 5.5h7"/>'),
    rowAfter: svg('<rect x="3" y="4" width="18" height="8" rx="1"/><path d="M12 15v7M8.5 18.5h7"/>'),
    colBefore: svg('<rect x="12" y="3" width="8" height="18" rx="1"/><path d="M2 12h7M5.5 8.5v7"/>'),
    colAfter: svg('<rect x="4" y="3" width="8" height="18" rx="1"/><path d="M15 12h7M18.5 8.5v7"/>'),
    delRow: svg('<rect x="3" y="8" width="18" height="8" rx="1"/><path d="m10 10 4 4M14 10l-4 4"/>'),
    delCol: svg('<rect x="8" y="3" width="8" height="18" rx="1"/><path d="m10 10 4 4M14 10l-4 4"/>'),
    imgLeft: svg('<rect x="3" y="5" width="8" height="8" rx="1"/><path d="M14 6h7M14 10h7M3 17h18M3 21h12"/>'),
    imgRight: svg('<rect x="13" y="5" width="8" height="8" rx="1"/><path d="M3 6h7M3 10h7M3 17h18M3 21h12"/>'),
    imgCenter: svg('<rect x="7" y="3" width="10" height="10" rx="1"/><path d="M3 17h18M6 21h12"/>'),
    imgInline: svg('<rect x="3" y="8" width="7" height="7" rx="1"/><path d="M13 12h8M3 19h18M13 4h8"/>')
  };

  /* ------------------------------------------------------------------ *
   * Styles (injected once). `.due-render` lets you style saved HTML the same way.
   * ------------------------------------------------------------------ */
  var CSS = [
    '.due{--due-primary:#10b981;--due-primary-soft:color-mix(in srgb,var(--due-primary) 14%,transparent);--due-bg:#fff;--due-fg:#1f2937;--due-muted:#6b7280;--due-border:#e5e7eb;--due-toolbar:#f9fafb;--due-hover:#eceff3;--due-radius:10px;--due-shadow:0 12px 32px rgba(15,23,42,.14);--due-code-bg:#0f172a;--due-code-fg:#e2e8f0;position:relative;border:1px solid var(--due-border);border-radius:var(--due-radius);background:var(--due-bg);color:var(--due-fg);font-family:system-ui,-apple-system,"Segoe UI",Tahoma,Arial,sans-serif;font-size:15px;line-height:1.6;text-align:start}',
    '.due *,.due *::before,.due *::after{box-sizing:border-box}',
    '.due-dark{--due-bg:#111827;--due-fg:#e5e7eb;--due-muted:#9ca3af;--due-border:#2f3a4b;--due-toolbar:#172030;--due-hover:#273244;--due-shadow:0 12px 32px rgba(0,0,0,.5);--due-code-bg:#020617}',
    '@media (prefers-color-scheme:dark){.due-auto{--due-bg:#111827;--due-fg:#e5e7eb;--due-muted:#9ca3af;--due-border:#2f3a4b;--due-toolbar:#172030;--due-hover:#273244;--due-shadow:0 12px 32px rgba(0,0,0,.5);--due-code-bg:#020617}}',
    '.due-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:2px;padding:6px;background:var(--due-toolbar);border-bottom:1px solid var(--due-border);border-radius:var(--due-radius) var(--due-radius) 0 0;position:sticky;top:var(--due-sticky-top,0);z-index:6}',
    '.due-nosticky .due-toolbar{position:relative}',
    '.due-group{display:flex;align-items:center;gap:2px;padding-inline-end:5px;margin-inline-end:3px;border-inline-end:1px solid var(--due-border)}',
    '.due-group:last-child{border:0;margin:0;padding:0}',
    '.due-btn{display:inline-flex;align-items:center;justify-content:center;gap:3px;min-width:32px;height:32px;padding:0 6px;border:0;border-radius:7px;background:transparent;color:var(--due-fg);cursor:pointer;font:inherit;font-size:13px;line-height:1;white-space:nowrap;transition:background .12s,color .12s}',
    '.due-btn:hover{background:var(--due-hover)}',
    '.due-btn:focus-visible{outline:2px solid var(--due-primary);outline-offset:1px}',
    '.due-btn.is-active{background:var(--due-primary-soft);color:var(--due-primary)}',
    '.due-btn:disabled{opacity:.35;cursor:default;background:transparent}',
    '.due-btn svg{width:18px;height:18px;flex:none}',
    '.due-caret{display:inline-flex;opacity:.6}.due-caret svg{width:12px;height:12px}',
    '.due-label{max-width:96px;overflow:hidden;text-overflow:ellipsis}',
    '.due-cicon{position:relative;display:inline-flex;flex-direction:column;align-items:center}',
    '.due-cbar{display:block;width:16px;height:3px;border-radius:2px;margin-top:-2px;background:currentColor}',
    '.due-dd{position:relative;display:inline-flex}',
    '.due-panel{position:absolute;top:calc(100% + 4px);inset-inline-start:0;z-index:30;min-width:170px;max-height:340px;overflow:auto;padding:6px;background:var(--due-bg);color:var(--due-fg);border:1px solid var(--due-border);border-radius:10px;box-shadow:var(--due-shadow);display:none}',
    '.due-dd.is-open>.due-panel{display:block}',
    '.due-item{display:flex;align-items:center;gap:8px;width:100%;padding:7px 10px;border:0;background:none;color:inherit;text-align:start;border-radius:6px;cursor:pointer;font:inherit;font-size:14px}',
    '.due-item:hover,.due-item.is-active{background:var(--due-hover)}.due-item.is-active{color:var(--due-primary)}',
    '.due-item svg{width:18px;height:18px}',
    '.due-swatches{display:grid;grid-template-columns:repeat(8,22px);gap:5px;padding:2px}',
    '.due-swatch{width:22px;height:22px;border-radius:5px;border:1px solid rgba(0,0,0,.12);cursor:pointer;padding:0}',
    '.due-swatch:hover{transform:scale(1.15)}',
    '.due-prow{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px;padding-top:8px;border-top:1px solid var(--due-border);font-size:13px}',
    '.due-prow label{display:flex;align-items:center;gap:6px;cursor:pointer}',
    '.due-prow input[type=color]{width:28px;height:24px;padding:0;border:1px solid var(--due-border);border-radius:5px;background:none;cursor:pointer}',
    '.due-link-btn{border:0;background:none;color:var(--due-primary);cursor:pointer;font:inherit;font-size:13px;padding:2px}',
    '.due-emojis{display:grid;grid-template-columns:repeat(8,34px);gap:2px}',
    '.due-emojis button{width:34px;height:34px;border:0;border-radius:6px;background:none;font-size:20px;cursor:pointer;line-height:1}',
    '.due-emojis button:hover{background:var(--due-hover)}',
    '.due-grid{display:grid;grid-template-columns:repeat(8,20px);gap:3px}',
    '.due-grid span{width:20px;height:20px;border:1px solid var(--due-border);border-radius:4px;cursor:pointer}',
    '.due-grid span.on{background:var(--due-primary-soft);border-color:var(--due-primary)}',
    '.due-grid-info{text-align:center;font-size:13px;color:var(--due-muted);margin-top:6px}',
    '.due-body{position:relative}',
    '.due-content{min-height:250px;padding:16px 20px;outline:none;overflow-y:auto;overflow-wrap:break-word;caret-color:var(--due-primary)}',
    '.due-resizable .due-content{resize:vertical}',
    '.due-placeholder{position:absolute;top:16px;inset-inline:20px;color:var(--due-muted);pointer-events:none;user-select:none;display:none}',
    '.due-is-empty .due-placeholder{display:block}',
    '.due-source{display:none;width:100%;min-height:250px;padding:16px 20px;border:0;outline:none;resize:vertical;background:var(--due-code-bg);color:var(--due-code-fg);font:13px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;tab-size:2;direction:ltr;text-align:left}',
    '.due-status{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:5px 12px;border-top:1px solid var(--due-border);color:var(--due-muted);font-size:12px;background:var(--due-toolbar);border-radius:0 0 var(--due-radius) var(--due-radius)}',
    '.due-brand{opacity:.7;text-decoration:none;color:inherit}.due-brand b{color:var(--due-primary);font-weight:600}',
    '.due-full{position:fixed!important;inset:0;z-index:99990;border-radius:0;display:flex;flex-direction:column}',
    '.due-full .due-toolbar{border-radius:0}.due-full .due-body{flex:1;min-height:0;display:flex;flex-direction:column}',
    '.due-full .due-content,.due-full .due-source{flex:1;max-height:none!important;height:auto!important;resize:none}',
    '.due-full .due-content{padding-inline:max(20px,calc((100% - 900px)/2))}',
    '.due-full .due-status{border-radius:0}',
    '.due-readonly .due-toolbar{display:none}',
    /* context bar */
    '.due-ctx{position:absolute;z-index:5;display:none;align-items:center;gap:2px;padding:4px;background:var(--due-bg);border:1px solid var(--due-border);border-radius:9px;box-shadow:var(--due-shadow);max-width:calc(100% - 8px);flex-wrap:wrap}',
    '.due-ctx .due-btn{min-width:30px;height:30px;font-size:12px;font-weight:600}',
    '.due-ctx .due-sep{width:1px;height:20px;background:var(--due-border);margin:0 3px}',
    '.due-ctx-url{max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--due-primary);font-size:13px;padding:0 6px;direction:ltr}',
    '[dir=rtl] .due-flip svg{transform:scaleX(-1)}',
    '.due-handle{position:absolute;z-index:5;width:14px;height:14px;border-radius:4px;background:var(--due-primary);border:2px solid var(--due-bg);box-shadow:0 1px 4px rgba(0,0,0,.3);cursor:nwse-resize;display:none;touch-action:none}',
    /* modal */
    '.due-modal{position:fixed;inset:0;z-index:99995;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,23,42,.45);backdrop-filter:blur(2px)}',
    '.due-modal-box{width:100%;max-width:440px;max-height:calc(100vh - 32px);overflow:auto;background:var(--due-bg);color:var(--due-fg);border-radius:14px;box-shadow:var(--due-shadow);animation:due-pop .14s ease-out}',
    '@keyframes due-pop{from{transform:translateY(6px) scale(.98);opacity:0}}',
    '.due-modal-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 4px;font-size:16px}',
    '.due-modal-body{padding:10px 16px;display:flex;flex-direction:column;gap:12px}',
    '.due-modal-foot{display:flex;align-items:center;gap:8px;padding:10px 16px 16px}',
    '.due-modal-info{flex:1;font-size:13px;color:var(--due-muted)}',
    '.due-field{display:flex;flex-direction:column;gap:5px;font-size:13px;color:var(--due-muted)}',
    '.due-field input,.due-field textarea{width:100%;padding:9px 11px;border:1px solid var(--due-border);border-radius:8px;background:var(--due-bg);color:var(--due-fg);font:inherit;font-size:14px;outline:none}',
    '.due-field input:focus,.due-field textarea:focus{border-color:var(--due-primary);box-shadow:0 0 0 3px var(--due-primary-soft)}',
    '.due-check{display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer}',
    '.due-check input{accent-color:var(--due-primary);width:16px;height:16px}',
    '.due-b1,.due-b2{height:36px;padding:0 16px;border-radius:8px;font:inherit;font-size:14px;cursor:pointer;border:1px solid var(--due-border);background:var(--due-bg);color:var(--due-fg)}',
    '.due-b1{background:var(--due-primary);border-color:var(--due-primary);color:#fff;font-weight:600}',
    '.due-b1:hover{filter:brightness(.95)}.due-b2:hover{background:var(--due-hover)}',
    '.due-drop{display:flex;flex-direction:column;align-items:center;gap:6px;padding:22px;border:2px dashed var(--due-border);border-radius:12px;cursor:pointer;text-align:center;color:var(--due-muted);font-size:14px}',
    '.due-drop:hover,.due-drop.is-over{border-color:var(--due-primary);color:var(--due-primary);background:var(--due-primary-soft)}',
    '.due-drop svg{width:28px;height:28px}',
    '.due-or{text-align:center;font-size:12px;color:var(--due-muted)}',
    '.due-toast{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);z-index:10;padding:8px 14px;border-radius:8px;background:#111827;color:#fff;font-size:13px;box-shadow:var(--due-shadow);pointer-events:none;opacity:0;transition:opacity .2s}',
    '.due-toast.show{opacity:1}',
    '.due-content img.due-uploading{opacity:.45;filter:grayscale(1)}',
    '.due-content img.due-img-active{outline:2px solid var(--due-primary);outline-offset:2px}',
    /* content typography — shared with .due-render */
    '.due-content>:first-child,.due-render>:first-child{margin-top:0}',
    '.due-content p,.due-render p{margin:0 0 .8em}',
    '.due-content h1,.due-render h1{font-size:2em;line-height:1.25;margin:.6em 0 .4em;font-weight:700}',
    '.due-content h2,.due-render h2{font-size:1.6em;line-height:1.3;margin:.6em 0 .4em;font-weight:700}',
    '.due-content h3,.due-render h3{font-size:1.3em;margin:.6em 0 .4em;font-weight:700}',
    '.due-content h4,.due-render h4{font-size:1.12em;margin:.6em 0 .4em;font-weight:700}',
    '.due-content h5,.due-render h5{font-size:1em;margin:.6em 0 .4em;font-weight:700}',
    '.due-content h6,.due-render h6{font-size:.9em;margin:.6em 0 .4em;font-weight:700;text-transform:uppercase;letter-spacing:.03em}',
    '.due-content ul,.due-content ol,.due-render ul,.due-render ol{margin:0 0 .8em;padding-inline-start:1.7em}',
    '.due-content li,.due-render li{margin:.2em 0}',
    '.due-content a,.due-render a{color:var(--due-primary,#10b981);text-decoration:underline;text-underline-offset:2px}',
    '.due-content blockquote,.due-render blockquote{margin:0 0 .8em;padding:.5em 1em;border-inline-start:4px solid var(--due-primary,#10b981);background:var(--due-primary-soft,rgba(16,185,129,.1));border-radius:6px}',
    '.due-content pre,.due-render pre{margin:0 0 .8em;padding:12px 14px;border-radius:8px;background:var(--due-code-bg,#0f172a);color:var(--due-code-fg,#e2e8f0);font:13px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow:auto;white-space:pre-wrap;direction:ltr;text-align:left}',
    '.due-content code,.due-render code{padding:.1em .35em;border-radius:4px;background:rgba(127,127,127,.16);font:.9em ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}',
    '.due-content pre code,.due-render pre code{padding:0;background:none;font:inherit}',
    '.due-content hr,.due-render hr{border:0;border-top:2px solid var(--due-border,#e5e7eb);margin:1.2em 0}',
    '.due-content img,.due-render img{max-width:100%;height:auto;border-radius:4px}',
    '.due-content table,.due-render table{border-collapse:collapse;width:100%;margin:0 0 .8em}',
    '.due-content td,.due-content th,.due-render td,.due-render th{border:1px solid var(--due-border,#d1d5db);padding:7px 10px;min-width:48px;vertical-align:top;text-align:start}',
    '.due-content th,.due-render th{background:rgba(127,127,127,.09);font-weight:600}',
    '.due-content .due-video,.due-render .due-video{position:relative;aspect-ratio:16/9;margin:0 0 .8em;border-radius:8px;overflow:hidden;background:#000}',
    '.due-content .due-video iframe,.due-render .due-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}',
    '.due-content .due-map,.due-render .due-map{aspect-ratio:4/3}',
    '.due-content video,.due-render video{max-width:100%;border-radius:8px}'
  ].join('\n');

  function injectCSS() {
    if (!HAS_DOM || document.getElementById('devunity-editor-css') || document.querySelector('link[href*="devunity-editor"][href*=".css"]')) return;
    var s = document.createElement('style');
    s.id = 'devunity-editor-css';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ------------------------------------------------------------------ *
   * Defaults & presets
   * ------------------------------------------------------------------ */
  var PRESETS = {
    full: [
      ['undo', 'redo'],
      ['format', 'fontFamily', 'fontSize', 'lineHeight'],
      ['bold', 'italic', 'underline', 'strike', 'subscript', 'superscript', 'inlineCode'],
      ['foreColor', 'backColor'],
      ['align', 'direction'],
      ['ul', 'ol', 'outdent', 'indent'],
      ['link', 'image', 'video', 'table', 'emoji'],
      ['blockquote', 'codeBlock', 'hr'],
      ['removeFormat', 'findReplace', 'source', 'print', 'fullscreen']
    ],
    standard: [
      ['undo', 'redo'],
      ['format', 'fontSize'],
      ['bold', 'italic', 'underline', 'strike'],
      ['foreColor', 'backColor'],
      ['align', 'direction'],
      ['ul', 'ol'],
      ['link', 'image', 'video', 'table'],
      ['blockquote', 'removeFormat', 'source', 'fullscreen']
    ],
    basic: [['undo', 'redo'], ['format'], ['bold', 'italic', 'underline'], ['foreColor'], ['ul', 'ol'], ['link', 'image'], ['removeFormat']],
    minimal: [['bold', 'italic', 'underline'], ['ul', 'ol'], ['link']]
  };

  var DEFAULTS = {
    lang: null,                // 'ar' | 'en' (auto from <html lang>)
    dir: null,                 // 'rtl' | 'ltr' (auto from lang)
    theme: 'light',            // 'light' | 'dark' | 'auto'
    toolbar: 'full',           // preset name or array of groups
    placeholder: null,
    value: null,               // initial HTML (overrides target content)
    height: null,              // fixed height (px or css)
    minHeight: 250,
    maxHeight: null,
    resizable: true,
    stickyToolbar: true,
    stickyOffset: 0,
    statusBar: true,
    branding: true,
    readOnly: false,
    autofocus: false,
    primaryColor: null,
    name: null,                // creates hidden input when target is not a textarea
    sanitize: true,
    pastePlain: false,
    uploadUrl: null,           // POST endpoint, returns {url}
    uploadField: 'file',
    uploadHeaders: null,
    uploadImage: null,         // async (file) => url   (overrides uploadUrl)
    maxImageSize: 5 * 1024 * 1024,
    i18n: null,                // override any label
    fontSizes: ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px'],
    fontFamilies: [
      { label: 'Cairo', value: 'Cairo, sans-serif' },
      { label: 'Tajawal', value: 'Tajawal, sans-serif' },
      { label: 'Almarai', value: 'Almarai, sans-serif' },
      { label: 'Arial', value: 'Arial, sans-serif' },
      { label: 'Tahoma', value: 'Tahoma, sans-serif' },
      { label: 'Verdana', value: 'Verdana, sans-serif' },
      { label: 'Georgia', value: 'Georgia, serif' },
      { label: 'Times New Roman', value: '"Times New Roman", serif' },
      { label: 'Courier New', value: '"Courier New", monospace' }
    ],
    lineHeights: ['1', '1.15', '1.5', '1.75', '2', '2.5', '3'],
    colors: [
      '#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6', '#ffffff',
      '#dc2626', '#ea580c', '#d97706', '#16a34a', '#059669', '#0891b2', '#2563eb', '#7c3aed',
      '#fca5a5', '#fdba74', '#fcd34d', '#86efac', '#6ee7b7', '#67e8f9', '#93c5fd', '#c4b5fd',
      '#7f1d1d', '#7c2d12', '#78350f', '#14532d', '#064e3b', '#164e63', '#1e3a8a', '#4c1d95',
      '#db2777', '#f472b6', '#fbcfe8', '#34d399', '#10b981', '#a7f3d0', '#fef08a', '#fde68a'
    ],
    emojis: '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 😉 😍 🥰 😘 😋 😎 🤩 🥳 😏 🤔 🤗 😢 😭 😡 👍 👎 👏 🙌 🙏 💪 👌 ✌️ 👋 🤝 ❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🔥 ⭐ ✨ 🎉 🎁 🏠 🏡 🏢 🏗️ 🏘️ 🔑 📍 🗺️ 📞 📧 💬 📌 📎 ✅ ❌ ⚠️ 💡 📈 📉 💰 💵 🕒 📅 🚗 ✈️ ☀️ 🌙 🌿 🌸 ☕ 🍽️'.split(' '),
    onChange: null,
    onReady: null
  };

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */
  function h(tag, cls, attrs) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (attrs) for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    return e;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function cssLen(v) { return v == null || v === '' ? '' : (typeof v === 'number' || /^\d+$/.test(v) ? v + 'px' : v); }
  function unwrap(el) { var p = el.parentNode; if (!p) return; while (el.firstChild) p.insertBefore(el.firstChild, el); p.removeChild(el); }
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function safeUrl(u, isMedia) {
    u = String(u || '').trim();
    var compact = u.replace(/[\s\u0000-\u001f]/g, '').toLowerCase();
    if (/^(javascript|vbscript|file):/.test(compact)) return '';
    if (/^data:/.test(compact)) return isMedia && /^data:image\/(png|jpe?g|gif|webp|bmp|avif|svg\+xml);/.test(compact) ? u : '';
    return u;
  }
  function normalizeUrl(u) {
    u = String(u || '').trim();
    if (!u) return '';
    if (!/^([a-z][a-z0-9+.-]*:|\/|#|\?|\.)/i.test(u)) u = (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u) ? 'mailto:' : 'https://') + u;
    return safeUrl(u, false);
  }

  /* ------------------------------------------------------------------ *
   * Sanitizer
   * ------------------------------------------------------------------ */
  var ALLOWED_TAGS = ('p div br span b strong i em u s strike del ins sub sup small mark a img h1 h2 h3 h4 h5 h6 ul ol li ' +
    'blockquote pre code hr table thead tbody tfoot tr th td caption colgroup col figure figcaption iframe video source font').split(' ');
  var DROP_TAGS = 'script style meta link title head object embed applet form input button select textarea noscript template svg math base frame frameset xml'.split(' ');
  var ALLOWED_ATTRS = 'href target rel src alt title width height style colspan rowspan dir align controls allowfullscreen frameborder allow loading poster type class color face size start reversed'.split(' ');
  var IFRAME_HOSTS = ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com', 'www.google.com', 'maps.google.com'];

  function iframeAllowed(src) {
    try {
      var u = new URL(src, 'https://x.invalid');
      if (u.protocol !== 'https:') return false;
      if (IFRAME_HOSTS.indexOf(u.hostname) < 0) return false;
      if ((u.hostname === 'www.google.com' || u.hostname === 'maps.google.com') && u.pathname.indexOf('/maps') !== 0) return false;
      return true;
    } catch (e) { return false; }
  }

  var PASTE_STYLE_KEEP = ['color', 'background-color', 'font-weight', 'font-style', 'text-decoration', 'text-align', 'direction'];

  function cleanStyle(style, paste) {
    if (!style) return '';
    var out = [];
    style.split(';').forEach(function (decl) {
      var i = decl.indexOf(':');
      if (i < 0) return;
      var prop = decl.slice(0, i).trim().toLowerCase();
      var val = decl.slice(i + 1).trim();
      if (!prop || !val) return;
      if (/expression|javascript:|url\s*\(|@import|behavior/i.test(val)) return;
      if (paste) {
        if (PASTE_STYLE_KEEP.indexOf(prop) < 0 || prop.indexOf('mso') === 0) return;
        if ((prop === 'color' && /^(#000000|black|rgb\(0,\s*0,\s*0\)|windowtext)$/i.test(val)) ||
            (prop === 'background-color' && /^(transparent|#fff(fff)?|white|rgba\(0,\s*0,\s*0,\s*0\))$/i.test(val)) ||
            (prop === 'font-weight' && /^(normal|400)$/.test(val)) || (prop === 'font-style' && val === 'normal') ||
            (prop === 'text-decoration' && /^none/.test(val))) return;
      }
      out.push(prop + ': ' + val);
    });
    return out.join('; ');
  }

  function sanitize(html, opts) {
    if (!HAS_DOM) return html;
    opts = opts || {};
    var paste = !!opts.paste;
    var tpl = document.createElement('template');
    tpl.innerHTML = String(html || '').replace(/<!--\[if[\s\S]*?endif\]-->/gi, '');
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 8) { n.parentNode.removeChild(n); return; }
        if (n.nodeType !== 1) return;
        var tag = n.tagName.toLowerCase();
        if (DROP_TAGS.indexOf(tag) >= 0) { n.parentNode.removeChild(n); return; }
        walk(n);
        var strip = ALLOWED_TAGS.indexOf(tag) < 0 ||
          (paste && (tag === 'font' || (tag === 'span' && !cleanStyle(n.getAttribute('style'), true))));
        if (strip) { unwrap(n); return; }
        if (tag === 'iframe' && !iframeAllowed(n.getAttribute('src'))) { n.parentNode.removeChild(n); return; }
        Array.prototype.slice.call(n.attributes).forEach(function (a) {
          var name = a.name.toLowerCase(), v = a.value;
          if (ALLOWED_ATTRS.indexOf(name) < 0 || name.indexOf('on') === 0) { n.removeAttribute(a.name); return; }
          if (name === 'class') {
            var keep = v.split(/\s+/).filter(function (c) { return /^due-/.test(c) && c !== 'due-img-active' && c !== 'due-uploading'; });
            if (paste || !keep.length) n.removeAttribute('class'); else n.setAttribute('class', keep.join(' '));
          } else if (name === 'style') {
            var st = cleanStyle(v, paste);
            if (st) n.setAttribute('style', st); else n.removeAttribute('style');
          } else if (name === 'href' || name === 'src' || name === 'poster') {
            var su = safeUrl(v, name !== 'href');
            if (!su) n.removeAttribute(a.name); else n.setAttribute(a.name, su);
          } else if (paste && (name === 'width' || name === 'height') && tag !== 'img') {
            n.removeAttribute(a.name);
          }
        });
        if (tag === 'a' && n.getAttribute('target') === '_blank') n.setAttribute('rel', 'noopener noreferrer');
      });
    })(tpl.content);
    return tpl.innerHTML.replace(/​/g, '');
  }

  function formatHTML(html) {
    var blocks = 'p|div|h[1-6]|li|ul|ol|blockquote|pre|table|thead|tbody|tfoot|tr|figure|figcaption|hr|caption';
    return html
      .replace(new RegExp('(</(' + blocks + ')>)', 'gi'), '$1\n')
      .replace(new RegExp('(<(ul|ol|table|thead|tbody|tfoot|tr)(\\s[^>]*)?>)', 'gi'), '$1\n')
      .replace(/(<hr[^>]*>)/gi, '$1\n')
      .replace(/\n{2,}/g, '\n')
      .trim();
  }

  function dataOptions(el) {
    var out = {}, ds = el.dataset || {};
    Object.keys(DEFAULTS).forEach(function (k) {
      if (ds[k] === undefined) return;
      var v = ds[k], d = DEFAULTS[k];
      if (typeof d === 'boolean') out[k] = v !== 'false' && v !== '0';
      else if (typeof d === 'number' || /^\d+$/.test(v)) out[k] = Number(v);
      else if (Array.isArray(d)) { try { out[k] = JSON.parse(v); } catch (e) { out[k] = v.split(','); } }
      else out[k] = v;
    });
    if (!out.placeholder && el.getAttribute('placeholder')) out.placeholder = el.getAttribute('placeholder');
    return out;
  }

  var BLOCK_SEL = 'p,h1,h2,h3,h4,h5,h6,li,blockquote,pre,div,td,th';

  /* ------------------------------------------------------------------ *
   * Editor
   * ------------------------------------------------------------------ */
  function Editor(target, options) {
    if (!(this instanceof Editor)) return new Editor(target, options);
    if (!HAS_DOM) throw new Error('[DevUnityEditor] requires a browser environment');
    if (typeof target === 'string') target = document.querySelector(target);
    if (!target) throw new Error('[DevUnityEditor] target element not found');
    if (target.__due) return target.__due;
    injectCSS();

    var o = this.o = Object.assign({}, DEFAULTS, dataOptions(target), options || {});
    var htmlLang = (document.documentElement.lang || '').toLowerCase();
    this.lang = o.lang || (htmlLang.indexOf('ar') === 0 ? 'ar' : 'en');
    this.t = Object.assign({}, LANGS.en, LANGS[this.lang] || {}, o.i18n || {});
    this.dir = o.dir || (this.lang === 'ar' ? 'rtl' : 'ltr');
    this.target = target;
    this._isField = /^(TEXTAREA|INPUT)$/.test(target.tagName);
    this._ev = {};
    this._hist = [];
    this._hi = -1;
    this._timer = null;
    this._range = null;
    this._img = null;
    this._srcMode = false;
    target.__due = this;

    var initial = o.value != null ? o.value : (this._isField ? target.value : target.innerHTML);
    this._build();
    this._bind();
    this.setHTML(initial, true);
    if (o.readOnly) this.setReadOnly(true);
    if (o.autofocus) this.focus();
    Editor.instances.push(this);
    var self = this;
    setTimeout(function () {
      self._emit('ready', self);
      if (typeof o.onReady === 'function') o.onReady(self);
    });
  }

  var P = Editor.prototype;

  /* ---------- DOM ---------- */
  P._build = function () {
    var o = this.o, t = this.t;
    var theme = o.theme === 'dark' ? 'due-dark' : o.theme === 'auto' ? 'due-auto' : 'due-light';
    var w = this.el = h('div', 'due ' + theme + (o.stickyToolbar ? '' : ' due-nosticky') + (o.resizable && !o.height ? ' due-resizable' : ''), { dir: this.dir });
    if (o.primaryColor) w.style.setProperty('--due-primary', o.primaryColor);
    if (o.stickyOffset) w.style.setProperty('--due-sticky-top', cssLen(o.stickyOffset));

    this.toolbar = h('div', 'due-toolbar', { role: 'toolbar' });
    this.body = h('div', 'due-body');
    this.content = h('div', 'due-content', {
      contenteditable: 'true', role: 'textbox', 'aria-multiline': 'true', spellcheck: 'true',
      'aria-label': o.placeholder || t.placeholder
    });
    this.content.style.minHeight = cssLen(o.minHeight);
    if (o.height) this.content.style.height = cssLen(o.height);
    if (o.maxHeight) this.content.style.maxHeight = cssLen(o.maxHeight);
    this.ph = h('div', 'due-placeholder');
    this.ph.textContent = o.placeholder || t.placeholder;
    this.source = h('textarea', 'due-source', { spellcheck: 'false', dir: 'ltr', 'aria-label': t.source });
    this.ctx = h('div', 'due-ctx');
    this.handle = h('div', 'due-handle');
    this.toast = h('div', 'due-toast', { role: 'status' });
    this.body.append(this.content, this.ph, this.source, this.ctx, this.handle);
    w.append(this.toolbar, this.body);

    if (o.statusBar) {
      this.status = h('div', 'due-status');
      this.counter = h('span');
      this.status.appendChild(this.counter);
      if (o.branding) {
        var b = h('a', 'due-brand', { href: 'https://devunity.co', target: '_blank', rel: 'noopener' });
        b.innerHTML = 'Dev<b>Unity</b> Editor';
        this.status.appendChild(b);
      }
      w.appendChild(this.status);
    }
    w.appendChild(this.toast);
    this._buildToolbar();

    var tg = this.target;
    if (this._isField) {
      this._origDisplay = tg.style.display;
      tg.style.display = 'none';
      tg.parentNode.insertBefore(w, tg.nextSibling);
    } else {
      this._origHTML = tg.innerHTML;
      tg.innerHTML = '';
      tg.appendChild(w);
      if (o.name) {
        this.hidden = h('input', null, { type: 'hidden', name: o.name });
        tg.appendChild(this.hidden);
      }
    }
    try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch (e) {}
  };

  P._buildToolbar = function () {
    var self = this, groups = this.o.toolbar;
    if (typeof groups === 'string') groups = PRESETS[groups] || groups.split('|').map(function (g) { return g.split(','); });
    this._btns = {};
    this._dds = [];
    groups.forEach(function (g) {
      var ge = h('div', 'due-group');
      g.forEach(function (name) {
        var it = self._makeItem(typeof name === 'string' ? name.trim() : name);
        if (it) ge.appendChild(it);
      });
      if (ge.children.length) self.toolbar.appendChild(ge);
    });
    this.toolbar.addEventListener('mousedown', function (e) {
      if (!e.target.closest('input,textarea,select,label')) e.preventDefault();
    });
  };

  P._btn = function (html, title, fn, name) {
    var self = this;
    var b = h('button', 'due-btn', { type: 'button', title: title, 'aria-label': title });
    b.innerHTML = html;
    if (name) { b.dataset.name = name; this._btns[name] = b; }
    b.addEventListener('click', function (e) {
      e.preventDefault();
      if (self._srcMode && name !== 'source' && name !== 'fullscreen') return;
      fn(e);
    });
    return b;
  };

  P._makeItem = function (name) {
    var self = this, t = this.t;
    if (name && typeof name === 'object') {
      // custom button: { name, icon, title, action(editor), active?(editor) }
      var cb = this._btn(name.icon || esc(name.title || name.name), name.title || name.name, function () { name.action(self); }, name.name);
      if (name.active) cb._activeFn = name.active;
      return cb;
    }
    var simple = {
      undo: [I.undo, function () { self.undo(); }],
      redo: [I.redo, function () { self.redo(); }],
      bold: [I.bold, function () { self.exec('bold'); }, 'bold'],
      italic: [I.italic, function () { self.exec('italic'); }, 'italic'],
      underline: [I.underline, function () { self.exec('underline'); }, 'underline'],
      strike: [I.strike, function () { self.exec('strikeThrough'); }, 'strikeThrough'],
      subscript: [I.subscript, function () { self.exec('subscript'); }, 'subscript'],
      superscript: [I.superscript, function () { self.exec('superscript'); }, 'superscript'],
      inlineCode: [I.inlineCode, function () { self.toggleInlineCode(); }],
      alignLeft: [I.alignLeft, function () { self.exec('justifyLeft'); }, 'justifyLeft'],
      alignCenter: [I.alignCenter, function () { self.exec('justifyCenter'); }, 'justifyCenter'],
      alignRight: [I.alignRight, function () { self.exec('justifyRight'); }, 'justifyRight'],
      alignJustify: [I.alignJustify, function () { self.exec('justifyFull'); }, 'justifyFull'],
      ul: [I.ul, function () { self.exec('insertUnorderedList'); }, 'insertUnorderedList'],
      ol: [I.ol, function () { self.exec('insertOrderedList'); }, 'insertOrderedList'],
      indent: [I.indent, function () { self.exec('indent'); }],
      outdent: [I.outdent, function () { self.exec('outdent'); }],
      link: [I.link, function () { self.openLink(); }],
      unlink: [I.unlink, function () { self.removeLink(); }],
      image: [I.image, function () { self.openImage(); }],
      video: [I.video, function () { self.openEmbed(); }],
      hr: [I.hr, function () { self.insertHTML('<hr><p><br></p>'); }],
      blockquote: [I.quote, function () { self.toggleBlock('blockquote'); }],
      codeBlock: [I.codeBlock, function () { self.toggleBlock('pre'); }],
      removeFormat: [I.clear, function () { self.clearFormat(); }],
      findReplace: [I.search, function () { self.openFind(); }],
      source: [I.source, function () { self.toggleSource(); }],
      print: [I.print, function () { self.print(); }],
      fullscreen: [I.full, function () { self.toggleFullscreen(); }]
    };
    if (simple[name]) {
      var s = simple[name];
      var b = this._btn(s[0], t[name] || name, s[1], name);
      if (s[2]) b.dataset.state = s[2];
      return b;
    }
    switch (name) {
      case 'format': return this._ddFormat();
      case 'fontSize': return this._ddList('fontSize', t.fontSize, this.o.fontSizes.map(function (v) { return { label: v.replace('px', ''), value: v }; }), function (v) { self.setFontSize(v); }, true);
      case 'fontFamily': return this._ddList('fontFamily', t.fontFamily, this.o.fontFamilies.map(function (f) { return typeof f === 'string' ? { label: f.split(',')[0].replace(/"/g, ''), value: f, style: 'font-family:' + f } : { label: f.label, value: f.value, style: 'font-family:' + f.value }; }), function (v) { self.setFontFamily(v); }, true);
      case 'lineHeight': return this._ddList('lineHeight', t.lineHeight, this.o.lineHeights.map(function (v) { return { label: v, value: v }; }), function (v) { self.setLineHeight(v); }, false, I.lineHeight);
      case 'foreColor': return this._ddColor('foreColor');
      case 'backColor': return this._ddColor('backColor');
      case 'align': return this._ddList('align', t.align, [
        { label: t.alignLeft, value: 'justifyLeft', icon: I.alignLeft },
        { label: t.alignCenter, value: 'justifyCenter', icon: I.alignCenter },
        { label: t.alignRight, value: 'justifyRight', icon: I.alignRight },
        { label: t.alignJustify, value: 'justifyFull', icon: I.alignJustify }
      ], function (v) { self.exec(v); }, false, this.dir === 'rtl' ? I.alignRight : I.alignLeft);
      case 'direction': return this._ddList('direction', t.direction, [
        { label: t.rtl, value: 'rtl', icon: I.rtl },
        { label: t.ltr, value: 'ltr', icon: I.ltr }
      ], function (v) { self.setDirection(v); }, false, this.dir === 'rtl' ? I.rtl : I.ltr);
      case 'table': return this._ddTable();
      case 'emoji': return this._ddEmoji();
    }
    return null;
  };

  /* ---------- dropdowns ---------- */
  P._dd = function (name, labelHTML, build) {
    var self = this;
    var wrap = h('div', 'due-dd');
    var b = this._btn(labelHTML + '<span class="due-caret">' + I.chev + '</span>', this.t[name] || name, function () { self._toggleDD(wrap); }, name);
    b.setAttribute('aria-haspopup', 'true');
    var p = h('div', 'due-panel');
    build(p, function () { self._closeDD(); });
    wrap.append(b, p);
    this._dds.push(wrap);
    return wrap;
  };
  P._toggleDD = function (wrap) {
    var open = wrap.classList.contains('is-open');
    this._closeDD();
    if (open) return;
    this._saveSel();
    wrap.classList.add('is-open');
    var p = wrap.querySelector('.due-panel');
    p.style.transform = '';
    var r = p.getBoundingClientRect(), vw = document.documentElement.clientWidth;
    var dx = 0;
    if (r.right > vw - 8) dx = vw - 8 - r.right;
    if (r.left + dx < 8) dx = 8 - r.left;
    if (dx) p.style.transform = 'translateX(' + dx + 'px)';
    if (wrap._onOpen) wrap._onOpen();
  };
  P._closeDD = function () { (this._dds || []).forEach(function (d) { d.classList.remove('is-open'); }); };

  P._ddList = function (name, title, items, onPick, showLabel, icon) {
    var self = this;
    var label = showLabel ? '<span class="due-label">' + esc(title) + '</span>' : (icon || '');
    var wrap = this._dd(name, label, function (p, close) {
      items.forEach(function (it) {
        var b = h('button', 'due-item', { type: 'button' });
        b.innerHTML = (it.icon || '') + '<span' + (it.style ? ' style="' + esc(it.style) + '"' : '') + '>' + esc(it.label) + '</span>';
        b.dataset.value = it.value;
        b.addEventListener('click', function () { close(); onPick(it.value); });
        p.appendChild(b);
      });
      if (name === 'fontSize' || name === 'fontFamily' || name === 'lineHeight') {
        var d = h('button', 'due-item', { type: 'button' });
        d.textContent = self.t.default;
        d.style.color = 'var(--due-muted)';
        d.addEventListener('click', function () { close(); onPick(''); });
        p.insertBefore(d, p.firstChild);
      }
    });
    return wrap;
  };

  P._ddFormat = function () {
    var self = this, t = this.t;
    var sizes = { p: '14px', h1: '22px', h2: '19px', h3: '17px', h4: '15px', h5: '14px', h6: '12px' };
    var items = [['p', t.normal], ['h1', t.heading + ' 1'], ['h2', t.heading + ' 2'], ['h3', t.heading + ' 3'], ['h4', t.heading + ' 4'], ['h5', t.heading + ' 5'], ['h6', t.heading + ' 6'], ['blockquote', t.blockquote], ['pre', t.codeBlock]];
    var wrap = this._dd('format', '<span class="due-label">' + esc(t.normal) + '</span>', function (p, close) {
      items.forEach(function (it) {
        var b = h('button', 'due-item', { type: 'button' });
        var st = it[0] === 'pre' ? 'font-family:monospace' : it[0] === 'blockquote' ? 'font-style:italic' : 'font-size:' + sizes[it[0]] + ';font-weight:' + (it[0] === 'p' ? 400 : 700);
        b.innerHTML = '<span style="' + st + '">' + esc(it[1]) + '</span>';
        b.dataset.value = it[0];
        b.addEventListener('click', function () { close(); it[0] === 'blockquote' || it[0] === 'pre' ? self.toggleBlock(it[0], true) : self.formatBlock(it[0]); });
        p.appendChild(b);
      });
    });
    this._fmtLabel = wrap.querySelector('.due-label');
    return wrap;
  };

  P._ddColor = function (cmd) {
    var self = this, t = this.t;
    var icon = '<span class="due-cicon">' + (cmd === 'foreColor' ? I.textColor : I.highlight) + '<span class="due-cbar" style="background:' + (cmd === 'foreColor' ? '#dc2626' : '#fef08a') + '"></span></span>';
    var wrap = this._dd(cmd, icon, function (p, close) {
      var grid = h('div', 'due-swatches');
      self.o.colors.forEach(function (c) {
        var s = h('button', 'due-swatch', { type: 'button', title: c, 'aria-label': c });
        s.style.background = c;
        s.addEventListener('click', function () { close(); pick(c); });
        grid.appendChild(s);
      });
      var row = h('div', 'due-prow');
      var none = h('button', 'due-link-btn', { type: 'button' });
      none.textContent = t.none;
      none.addEventListener('click', function () { close(); pick(''); });
      var lab = h('label');
      var inp = h('input', null, { type: 'color', value: '#10b981' });
      lab.append(inp, document.createTextNode(t.custom));
      inp.addEventListener('change', function () { close(); pick(inp.value); });
      row.append(none, lab);
      p.append(grid, row);
    });
    var bar = wrap.querySelector('.due-cbar');
    function pick(c) {
      if (c) bar.style.background = c;
      self.setColor(cmd, c);
    }
    return wrap;
  };

  P._ddTable = function () {
    var self = this, t = this.t, N = 8;
    return this._dd('table', I.table, function (p, close) {
      var grid = h('div', 'due-grid');
      var info = h('div', 'due-grid-info');
      info.textContent = '1 × 1';
      var head = h('label', 'due-check');
      head.style.cssText = 'margin-top:8px;font-size:13px';
      var cb = h('input', null, { type: 'checkbox' });
      head.append(cb, document.createTextNode(t.headerRow));
      var cells = [];
      for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
        var s = h('span');
        s.dataset.r = r + 1; s.dataset.c = c + 1;
        cells.push(s); grid.appendChild(s);
      }
      grid.addEventListener('mouseover', function (e) {
        var s = e.target.closest('span'); if (!s) return;
        var R = +s.dataset.r, C = +s.dataset.c;
        cells.forEach(function (x) { x.classList.toggle('on', +x.dataset.r <= R && +x.dataset.c <= C); });
        info.textContent = R + ' × ' + C;
      });
      grid.addEventListener('click', function (e) {
        var s = e.target.closest('span'); if (!s) return;
        close(); self.insertTable(+s.dataset.r, +s.dataset.c, cb.checked);
      });
      p.append(grid, info, head);
    });
  };

  P._ddEmoji = function () {
    var self = this;
    return this._dd('emoji', I.emoji, function (p, close) {
      var g = h('div', 'due-emojis');
      self.o.emojis.forEach(function (em) {
        var b = h('button', null, { type: 'button' });
        b.textContent = em;
        b.addEventListener('click', function () { close(); self.insertText(em); });
        g.appendChild(b);
      });
      p.appendChild(g);
    });
  };

  /* ---------- events ---------- */
  P._bind = function () {
    var self = this, c = this.content;

    this._onSel = function () {
      var s = window.getSelection();
      if (!s || !s.rangeCount) return;
      if (c.contains(s.anchorNode)) {
        self._range = s.getRangeAt(0).cloneRange();
        cancelAnimationFrame(self._raf);
        self._raf = requestAnimationFrame(function () { self._updateState(); self._updateCtx(); });
      }
    };
    this._onDocDown = function (e) {
      if (!(self.el.contains(e.target) && e.target.closest('.due-dd'))) self._closeDD();
    };
    this._onDocKey = function (e) {
      if (e.key === 'Escape') {
        if (self._dds.some(function (d) { return d.classList.contains('is-open'); })) { self._closeDD(); return; }
        if (self._full && !self._modalEl) self.toggleFullscreen(false);
      }
    };
    this._onResize = function () { self._updateCtx(); };
    document.addEventListener('selectionchange', this._onSel);
    document.addEventListener('mousedown', this._onDocDown);
    document.addEventListener('keydown', this._onDocKey);
    window.addEventListener('resize', this._onResize);

    c.addEventListener('input', function () {
      self._scheduleRecord();
      self._emitChange();
    });
    c.addEventListener('focus', function () { self.el.classList.add('due-focused'); self._emit('focus'); });
    c.addEventListener('blur', function () {
      self.el.classList.remove('due-focused');
      self._emit('blur');
      setTimeout(function () {
        if (!self.el.contains(document.activeElement) && !self._modalEl && !self._dragging) self._hideCtx(true);
      }, 180);
    });
    c.addEventListener('scroll', function () { self._updateCtx(); });
    c.addEventListener('keydown', function (e) { self._onKey(e); });
    c.addEventListener('paste', function (e) { self._onPaste(e); });
    c.addEventListener('dragover', function (e) {
      if (e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') >= 0) e.preventDefault();
    });
    c.addEventListener('drop', function (e) { self._onDrop(e); });
    c.addEventListener('click', function (e) {
      var img = e.target.closest && e.target.closest('img');
      self._selectImage(img && c.contains(img) ? img : null);
      self._updateCtx();
    });
    c.addEventListener('dblclick', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (a && c.contains(a)) { e.preventDefault(); self.openLink(); }
    });

    this.source.addEventListener('input', function () { self._syncField(self.getHTML()); });

    this.ctx.addEventListener('mousedown', function (e) { if (!e.target.closest('a')) e.preventDefault(); });

    this.handle.addEventListener('pointerdown', function (e) {
      var img = self._img; if (!img) return;
      e.preventDefault();
      self._dragging = true;
      var startX = e.clientX, startW = img.getBoundingClientRect().width;
      var maxW = c.clientWidth - 20;
      function move(ev) {
        var w = Math.round(Math.max(40, Math.min(maxW, startW + (ev.clientX - startX))));
        img.style.width = w + 'px';
        img.style.height = 'auto';
        img.removeAttribute('width'); img.removeAttribute('height');
        self._updateCtx();
      }
      function up() {
        self._dragging = false;
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        self._changed();
      }
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    });
  };

  P._onKey = function (e) {
    var mod = e.ctrlKey || e.metaKey, code = e.code;
    if (this._img && (e.key === 'Backspace' || e.key === 'Delete')) {
      e.preventDefault();
      this._flush();
      this._img.remove();
      this._img = null;
      this._changed();
      return;
    }
    if (this._img && !mod && e.key.length === 1) this._selectImage(null);

    if (mod && !e.altKey) {
      if (code === 'KeyZ' && !e.shiftKey) { e.preventDefault(); this.undo(); return; }
      if (code === 'KeyY' || (code === 'KeyZ' && e.shiftKey)) { e.preventDefault(); this.redo(); return; }
      if (code === 'KeyK') { e.preventDefault(); this.openLink(); return; }
      if (code === 'KeyB') { e.preventDefault(); this.exec('bold'); return; }
      if (code === 'KeyI') { e.preventDefault(); this.exec('italic'); return; }
      if (code === 'KeyU') { e.preventDefault(); this.exec('underline'); return; }
      if (code === 'KeyF' && this._btns.findReplace) { e.preventDefault(); this.openFind(); return; }
    }
    if (e.key === 'Tab') {
      var cell = this._closest('td,th');
      if (cell) {
        e.preventDefault();
        var table = cell.closest('table');
        var cells = Array.prototype.slice.call(table.querySelectorAll('td,th'));
        var i = cells.indexOf(cell) + (e.shiftKey ? -1 : 1);
        if (i >= cells.length) {
          this._cell = cell;
          this.tableOp('rowAfter');
          cells = Array.prototype.slice.call(table.querySelectorAll('td,th'));
        }
        var next = cells[Math.max(0, i)];
        if (next) this._caretIn(next, true);
        return;
      }
      if (this._closest('li')) { e.preventDefault(); this.exec(e.shiftKey ? 'outdent' : 'indent'); return; }
      if (this._closest('pre')) { e.preventDefault(); document.execCommand('insertText', false, '  '); return; }
    }
  };

  P._onPaste = function (e) {
    var cd = e.clipboardData;
    if (!cd) return;
    var files = Array.prototype.slice.call(cd.files || []).filter(function (f) { return /^image\//.test(f.type); });
    var html = cd.getData('text/html'), text = cd.getData('text/plain');
    if (files.length && !text) { e.preventDefault(); this._saveSel(); this.uploadFiles(files); return; }
    e.preventDefault();
    this._saveSel();
    if (html && !this.o.pastePlain && !this._closest('pre')) {
      var clean = sanitize(html, { paste: true });
      this.insertHTML(clean);
      if (files.length && !/<img/i.test(clean)) this.uploadFiles(files);
    } else {
      this._flush();
      document.execCommand('insertText', false, text || '');
      this._changed();
    }
  };

  P._onDrop = function (e) {
    var dt = e.dataTransfer;
    if (!dt || !dt.files || !dt.files.length) return;
    var files = Array.prototype.slice.call(dt.files).filter(function (f) { return /^image\//.test(f.type); });
    if (!files.length) return;
    e.preventDefault();
    var r = null;
    if (document.caretRangeFromPoint) r = document.caretRangeFromPoint(e.clientX, e.clientY);
    else if (document.caretPositionFromPoint) {
      var pos = document.caretPositionFromPoint(e.clientX, e.clientY);
      if (pos) { r = document.createRange(); r.setStart(pos.offsetNode, pos.offset); r.collapse(true); }
    }
    if (r && this.content.contains(r.startContainer)) this._range = r;
    this.uploadFiles(files);
  };

  /* ---------- selection ---------- */
  P._saveSel = function () {
    var s = window.getSelection();
    if (s && s.rangeCount && this.content.contains(s.anchorNode)) this._range = s.getRangeAt(0).cloneRange();
  };
  P._restore = function () {
    var c = this.content;
    if (document.activeElement !== c) c.focus({ preventScroll: true });
    var s = window.getSelection();
    if (this._range && c.contains(this._range.startContainer) && c.contains(this._range.endContainer)) {
      s.removeAllRanges(); s.addRange(this._range);
    } else if (!s.rangeCount || !c.contains(s.anchorNode)) {
      this._caretIn(c, false);
    }
  };
  P._caretIn = function (el, start) {
    var r = document.createRange();
    r.selectNodeContents(el);
    r.collapse(!!start);
    var s = window.getSelection();
    s.removeAllRanges(); s.addRange(r);
    this._range = r.cloneRange();
  };
  P._closest = function (sel) {
    var r = this._range, s = window.getSelection();
    var n = (s && s.rangeCount && this.content.contains(s.anchorNode)) ? s.anchorNode : (r ? r.startContainer : null);
    while (n && n !== this.content) {
      if (n.nodeType === 1 && n.matches(sel)) return n;
      n = n.parentNode;
    }
    return null;
  };
  P._blocks = function () {
    this._restore();
    var r = this._range;
    if (!r) return [];
    var c = this.content;
    var leaf = Array.prototype.slice.call(c.querySelectorAll(BLOCK_SEL)).filter(function (el) {
      return r.intersectsNode(el) && !el.querySelector(BLOCK_SEL);
    });
    if (!leaf.length) {
      document.execCommand('formatBlock', false, '<p>');
      this._saveSel();
      var b = this._closest(BLOCK_SEL);
      if (b) leaf = [b];
    }
    return leaf;
  };

  /* ---------- history ---------- */
  P._record = function () {
    var html = this.content.innerHTML;
    if (this._hist[this._hi] === html) return;
    this._hist = this._hist.slice(0, this._hi + 1);
    this._hist.push(html);
    if (this._hist.length > 200) this._hist.shift();
    this._hi = this._hist.length - 1;
    this._updateHistBtns();
  };
  P._scheduleRecord = function () {
    var self = this;
    clearTimeout(this._timer);
    this._timer = setTimeout(function () { self._timer = null; self._record(); }, 350);
  };
  P._flush = function () {
    if (this._timer) { clearTimeout(this._timer); this._timer = null; }
    this._record();
  };
  P.undo = function () {
    this._flush();
    if (this._hi <= 0) return this;
    this._hi--;
    this._restoreHist();
    return this;
  };
  P.redo = function () {
    this._flush();
    if (this._hi >= this._hist.length - 1) return this;
    this._hi++;
    this._restoreHist();
    return this;
  };
  P._restoreHist = function () {
    this.content.innerHTML = this._hist[this._hi];
    this._img = null;
    this._caretIn(this.content, false);
    this._emitChange();
    this._updateState();
    this._hideCtx();
  };
  P._updateHistBtns = function () {
    if (this._btns.undo) this._btns.undo.disabled = this._hi <= 0;
    if (this._btns.redo) this._btns.redo.disabled = this._hi >= this._hist.length - 1;
  };

  /* ---------- change pipeline ---------- */
  P._changed = function () {
    this._saveSel();
    this._record();
    this._emitChange();
    this._updateState();
    this._updateCtx();
  };
  P._emitChange = function () {
    var html = this.getHTML();
    this._syncField(html);
    this.el.classList.toggle('due-is-empty', this.isEmpty() && !this._srcMode);
    this._updateCount();
    if (html === this._lastHTML) return;
    this._lastHTML = html;
    this._emit('change', html);
    if (typeof this.o.onChange === 'function') this.o.onChange(html, this);
  };
  P._syncField = function (html) {
    if (this._isField) {
      this.target.value = html;
      try { this.target.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
    } else if (this.hidden) this.hidden.value = html;
  };
  P._updateCount = function () {
    if (!this.counter) return;
    var text = this.getText();
    var words = (text.trim().match(/\S+/g) || []).length;
    var chars = text.replace(/\s/g, '').length;
    this.counter.textContent = words + ' ' + this.t.words + ' · ' + chars + ' ' + this.t.chars;
  };

  P._updateState = function () {
    if (this._srcMode || !this._btns) return;
    var s = window.getSelection();
    var inside = s && s.rangeCount && this.content.contains(s.anchorNode);
    var self = this;
    Object.keys(this._btns).forEach(function (name) {
      var b = self._btns[name], st = b.dataset.state, on = false;
      if (st) { try { on = inside && document.queryCommandState(st); } catch (e) {} b.classList.toggle('is-active', !!on); }
      if (b._activeFn) b.classList.toggle('is-active', !!b._activeFn(self));
    });
    var pre = !!this._closest('pre');
    var tog = { blockquote: !!this._closest('blockquote'), codeBlock: pre, inlineCode: !pre && !!this._closest('code'), link: !!this._closest('a') };
    Object.keys(tog).forEach(function (k) { if (self._btns[k]) self._btns[k].classList.toggle('is-active', tog[k]); });

    if (this._fmtLabel) {
      var tag = '';
      try { tag = (document.queryCommandValue('formatBlock') || '').toLowerCase(); } catch (e) {}
      if (tog.blockquote) tag = 'blockquote';
      if (pre) tag = 'pre';
      var map = { blockquote: this.t.blockquote, pre: this.t.codeBlock };
      this._fmtLabel.textContent = /^h[1-6]$/.test(tag) ? this.t.heading + ' ' + tag[1] : (map[tag] || this.t.normal);
    }
    var el = inside ? (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentNode) : null;
    if (el && this.content.contains(el)) {
      var cs = getComputedStyle(el);
      if (this._btns.fontSize) this._btns.fontSize.querySelector('.due-label').textContent = Math.round(parseFloat(cs.fontSize));
      if (this._btns.fontFamily) {
        var ff = el.closest('[style*="font-family"]');
        this._btns.fontFamily.querySelector('.due-label').textContent = ff && this.content.contains(ff) ? ff.style.fontFamily.split(',')[0].replace(/["']/g, '') : this.t.fontFamily;
      }
      if (this._btns.align) {
        var blk = el.closest(BLOCK_SEL) || this.content;
        var ta = getComputedStyle(blk).textAlign;
        var rtl = getComputedStyle(blk).direction === 'rtl';
        if (ta === 'start') ta = rtl ? 'right' : 'left';
        if (ta === 'end') ta = rtl ? 'left' : 'right';
        var ic = { left: I.alignLeft, center: I.alignCenter, right: I.alignRight, justify: I.alignJustify }[ta] || I.alignLeft;
        var holder = this._btns.align;
        if (holder._ic !== ta) { holder._ic = ta; holder.innerHTML = ic + '<span class="due-caret">' + I.chev + '</span>'; }
      }
      if (this._btns.direction) {
        var d = getComputedStyle(el).direction;
        if (this._btns.direction._d !== d) { this._btns.direction._d = d; this._btns.direction.innerHTML = (d === 'rtl' ? I.rtl : I.ltr) + '<span class="due-caret">' + I.chev + '</span>'; }
      }
    }
    this._updateHistBtns();
  };

  /* ---------- commands ---------- */
  P.exec = function (cmd, val) {
    if (this._srcMode) return this;
    this._restore();
    this._flush();
    try { document.execCommand('styleWithCSS', false, false); } catch (e) {}
    document.execCommand(cmd, false, val == null ? null : val);
    this._changed();
    return this;
  };
  P.formatBlock = function (tag) {
    var bq = this._closest('blockquote');
    this._restore(); this._flush();
    document.execCommand('formatBlock', false, '<' + tag + '>');
    if (bq && tag !== 'blockquote' && this.content.contains(bq)) unwrap(bq);
    this._changed();
    return this;
  };
  P.toggleBlock = function (tag, forceOn) {
    var cur = this._closest(tag);
    if (cur && !forceOn) {
      this._flush();
      if (tag === 'blockquote') {
        var kids = Array.prototype.slice.call(cur.childNodes);
        var hasBlock = kids.some(function (k) { return k.nodeType === 1 && k.matches(BLOCK_SEL); });
        if (!hasBlock) { var p = document.createElement('p'); while (cur.firstChild) p.appendChild(cur.firstChild); cur.appendChild(p); }
        unwrap(cur);
        this._changed();
      } else {
        this.formatBlock('p');
      }
      return this;
    }
    if (cur) return this;
    return this.formatBlock(tag);
  };
  P.insertHTML = function (html) {
    this._restore(); this._flush();
    document.execCommand('insertHTML', false, html);
    this._changed();
    return this;
  };
  P.insertText = function (text) {
    this._restore(); this._flush();
    document.execCommand('insertText', false, text);
    this._changed();
    return this;
  };
  P.clearFormat = function () {
    this._restore(); this._flush();
    document.execCommand('removeFormat');
    var r = this._range;
    if (r && !r.collapsed) {
      Array.prototype.slice.call(this.content.querySelectorAll('span,font,mark,code')).forEach(function (el) {
        if (r.intersectsNode(el) && !el.closest('pre')) unwrap(el);
      });
    }
    this._changed();
    return this;
  };
  P.toggleInlineCode = function () {
    var code = this._closest('code');
    if (code && !code.closest('pre')) { this._flush(); unwrap(code); this._changed(); return this; }
    this._restore();
    var txt = this._range ? this._range.toString() : '';
    if (!txt) return this.insertHTML('<code>​</code>');
    return this.insertHTML('<code>' + esc(txt) + '</code>');
  };

  // wraps the selection in <span style="prop:value">, removing nested values of the same prop
  P._applyInlineStyle = function (prop, value) {
    if (this._srcMode) return this;
    this._restore(); this._flush();
    var s = window.getSelection();
    var r = s.rangeCount ? s.getRangeAt(0) : null;
    if (!r) return this;
    if (r.collapsed) {
      if (!value) return this;
      var sp = document.createElement('span');
      sp.style[prop] = value;
      sp.textContent = '​';
      r.insertNode(sp);
      var nr = document.createRange();
      nr.setStart(sp.firstChild, 1); nr.collapse(true);
      s.removeAllRanges(); s.addRange(nr);
      this._changed();
      return this;
    }
    try { document.execCommand('styleWithCSS', false, false); } catch (e) {}
    document.execCommand('fontName', false, '__due__');
    var made = [];
    Array.prototype.slice.call(this.content.querySelectorAll('font[face="__due__"]')).forEach(function (f) {
      var span = document.createElement('span');
      while (f.firstChild) span.appendChild(f.firstChild);
      Array.prototype.slice.call(span.querySelectorAll('[style]')).forEach(function (x) {
        x.style[prop] = '';
        if (!x.getAttribute('style')) x.removeAttribute('style');
        if (x.tagName === 'SPAN' && !x.attributes.length) unwrap(x);
      });
      Array.prototype.slice.call(span.querySelectorAll('font')).forEach(function (x) {
        if (prop === 'fontFamily') x.removeAttribute('face');
        if (prop === 'color') x.removeAttribute('color');
        if (prop === 'fontSize') x.removeAttribute('size');
        if (!x.attributes.length) unwrap(x);
      });
      if (value) span.style[prop] = value;
      f.parentNode.replaceChild(span, f);
      made.push(span);
    });
    var first = made[0], last = made[made.length - 1];
    if (first) {
      var sel = document.createRange();
      sel.setStartBefore(first); sel.setEndAfter(last);
      s.removeAllRanges(); s.addRange(sel);
    }
    made.forEach(function (sp) { if (!sp.getAttribute('style')) unwrap(sp); });
    this._changed();
    return this;
  };
  P.setFontSize = function (v) { return this._applyInlineStyle('fontSize', v); };
  P.setFontFamily = function (v) { return this._applyInlineStyle('fontFamily', v); };
  P.setColor = function (cmd, c) { return this._applyInlineStyle(cmd === 'backColor' ? 'backgroundColor' : 'color', c); };
  P.setLineHeight = function (v) {
    this._flush();
    this._blocks().forEach(function (b) { b.style.lineHeight = v; if (!b.getAttribute('style')) b.removeAttribute('style'); });
    this._changed();
    return this;
  };
  P.setDirection = function (dir) {
    this._flush();
    var blocks = this._blocks(), self = this;
    blocks.forEach(function (b) {
      var target = b.tagName === 'LI' ? b.parentNode : b;
      target.setAttribute('dir', dir);
      target.style.textAlign = '';
      if (!target.getAttribute('style')) target.removeAttribute('style');
    });
    if (!blocks.length) this.content.setAttribute('dir', dir);
    self._changed();
    return this;
  };

  /* ---------- tables ---------- */
  P.insertTable = function (rows, cols, header) {
    var html = '<table><tbody>';
    for (var r = 0; r < rows; r++) {
      html += '<tr>';
      for (var c = 0; c < cols; c++) { var tg = header && r === 0 ? 'th' : 'td'; html += '<' + tg + '><br></' + tg + '>'; }
      html += '</tr>';
    }
    html += '</tbody></table><p><br></p>';
    this.insertHTML(html);
    return this;
  };
  P.tableOp = function (op) {
    var cell = this._cell && this.content.contains(this._cell) ? this._cell : this._closest('td,th');
    if (!cell) return this;
    this._flush();
    var row = cell.parentNode, table = cell.closest('table'), idx = cell.cellIndex;
    var focusCell = null;
    function newRow() {
      var tr = document.createElement('tr');
      for (var i = 0; i < row.cells.length; i++) { var td = document.createElement('td'); td.innerHTML = '<br>'; tr.appendChild(td); }
      return tr;
    }
    switch (op) {
      case 'rowBefore': var a = newRow(); row.parentNode.insertBefore(a, row); focusCell = a.cells[idx]; break;
      case 'rowAfter': var b = newRow(); row.parentNode.insertBefore(b, row.nextSibling); focusCell = b.cells[idx] || b.cells[0]; break;
      case 'colBefore':
      case 'colAfter':
        Array.prototype.forEach.call(table.rows, function (tr) {
          var ref = tr.cells[idx];
          var nc = document.createElement(ref ? ref.tagName.toLowerCase() : 'td');
          nc.innerHTML = '<br>';
          tr.insertBefore(nc, op === 'colBefore' ? ref : (ref ? ref.nextSibling : null));
          if (tr === row) focusCell = nc;
        });
        break;
      case 'delRow':
        var sib = row.nextElementSibling || row.previousElementSibling;
        row.remove();
        if (!table.rows.length) { table.remove(); this._cell = null; }
        else focusCell = sib ? (sib.cells[idx] || sib.cells[0]) : table.rows[0].cells[0];
        break;
      case 'delCol':
        Array.prototype.forEach.call(table.rows, function (tr) { if (tr.cells[idx]) tr.deleteCell(idx); });
        if (!table.rows[0] || !table.rows[0].cells.length) { table.remove(); this._cell = null; }
        else focusCell = row.cells[Math.max(0, idx - 1)] || null;
        break;
      case 'delTable': table.remove(); this._cell = null; break;
    }
    if (focusCell) { this._cell = focusCell; this._caretIn(focusCell, true); }
    else this._restore();
    this._changed();
    return this;
  };

  /* ---------- links ---------- */
  P.removeLink = function () {
    var a = this._closest('a');
    if (a) { this._flush(); unwrap(a); this._changed(); return this; }
    return this.exec('unlink');
  };
  P.openLink = function () {
    this._saveSel();
    var self = this, t = this.t;
    var a = this._closest('a');
    var selText = this._range ? this._range.toString() : '';
    var m = this._modal(a ? t.editLink : t.link,
      '<label class="due-field"><span>' + t.url + '</span><input name="url" type="text" dir="ltr" placeholder="https://"></label>' +
      '<label class="due-field"><span>' + t.text + '</span><input name="text" type="text"></label>' +
      '<label class="due-check"><input name="tab" type="checkbox"> ' + t.newTab + '</label>',
      function () {
        var url = normalizeUrl(m.q('[name=url]').value);
        if (!url) { m.info(t.invalidUrl); return false; }
        var text = m.q('[name=text]').value.trim();
        var tab = m.q('[name=tab]').checked;
        var attrs = ' href="' + esc(url) + '"' + (tab ? ' target="_blank" rel="noopener noreferrer"' : '');
        if (a && self.content.contains(a)) {
          self._flush();
          a.setAttribute('href', url);
          if (tab) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } else { a.removeAttribute('target'); a.removeAttribute('rel'); }
          if (text && text !== a.textContent) a.textContent = text;
          self._changed();
        } else if (!selText || (text && text !== selText)) {
          self.insertHTML('<a' + attrs + '>' + esc(text || url) + '</a>​');
        } else {
          self._restore(); self._flush();
          document.execCommand('createLink', false, '#__due__');
          Array.prototype.slice.call(self.content.querySelectorAll('a[href="#__due__"]')).forEach(function (x) {
            x.setAttribute('href', url);
            if (tab) { x.target = '_blank'; x.rel = 'noopener noreferrer'; }
          });
          self._changed();
        }
      }, a ? t.save : t.insert);
    m.q('[name=url]').value = a ? a.getAttribute('href') || '' : '';
    m.q('[name=text]').value = a ? a.textContent : selText;
    m.q('[name=tab]').checked = a ? a.target === '_blank' : false;
  };

  /* ---------- images ---------- */
  P.openImage = function () {
    this._saveSel();
    var self = this, t = this.t;
    var m = this._modal(t.image,
      '<label class="due-drop">' + I.upload + '<span>' + t.dropImage + '</span><input type="file" accept="image/*" multiple hidden></label>' +
      '<div class="due-or">— ' + t.or + ' —</div>' +
      '<label class="due-field"><span>' + t.url + '</span><input name="url" type="text" dir="ltr" placeholder="https://…/image.jpg"></label>' +
      '<label class="due-field"><span>' + t.alt + '</span><input name="alt" type="text"></label>',
      function () {
        var url = safeUrl(m.q('[name=url]').value, true);
        if (!url) { m.info(t.invalidUrl); return false; }
        self.insertImage(url, m.q('[name=alt]').value);
      }, t.insert);
    var drop = m.q('.due-drop'), file = m.q('input[type=file]');
    file.addEventListener('change', function () { var f = file.files; m.close(); self.uploadFiles(f); });
    drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('is-over'); });
    drop.addEventListener('dragleave', function () { drop.classList.remove('is-over'); });
    drop.addEventListener('drop', function (e) { e.preventDefault(); var f = e.dataTransfer.files; m.close(); self.uploadFiles(f); });
  };
  P.insertImage = function (src, alt) {
    src = safeUrl(src, true);
    if (!src) return this;
    return this.insertHTML('<img src="' + esc(src) + '" alt="' + esc(alt || '') + '">');
  };
  P.uploadFiles = function (files) {
    var self = this, t = this.t;
    var list = Array.prototype.slice.call(files || []).filter(function (f) { return /^image\//.test(f.type); });
    var chain = Promise.resolve();
    list.forEach(function (f) {
      chain = chain.then(function () {
        if (f.size > self.o.maxImageSize) { self._toast(t.tooLarge); self._emit('error', { type: 'size', file: f }); return; }
        var id = 'due-up-' + Math.random().toString(36).slice(2, 9);
        var preview = URL.createObjectURL(f);
        self.insertHTML('<img id="' + id + '" class="due-uploading" src="' + preview + '" alt="">');
        var getUrl = typeof self.o.uploadImage === 'function' ? self.o.uploadImage(f, self)
          : self.o.uploadUrl ? self._uploadXHR(f) : self._toDataURL(f);
        return Promise.resolve(getUrl).then(function (url) {
          var img = self.content.querySelector('#' + id);
          if (!img) return;
          var safe = safeUrl(url, true);
          if (!safe) throw new Error('bad url');
          img.src = safe; img.removeAttribute('id'); img.classList.remove('due-uploading');
          if (!img.getAttribute('class')) img.removeAttribute('class');
          self._emit('upload', { file: f, url: safe });
          self._changed();
        }).catch(function (err) {
          var img = self.content.querySelector('#' + id);
          if (img) img.remove();
          self._toast(t.uploadFailed);
          self._emit('error', { type: 'upload', file: f, error: err });
          self._changed();
        }).then(function () { setTimeout(function () { URL.revokeObjectURL(preview); }, 4000); });
      });
    });
    return chain;
  };
  P._toDataURL = function (f) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(r.result); };
      r.onerror = rej;
      r.readAsDataURL(f);
    });
  };
  P._uploadXHR = function (f) {
    var o = this.o;
    var fd = new FormData();
    fd.append(o.uploadField || 'file', f);
    var headers = Object.assign({ Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, o.uploadHeaders || {});
    var csrf = document.querySelector('meta[name="csrf-token"]');
    if (csrf && !headers['X-CSRF-TOKEN']) headers['X-CSRF-TOKEN'] = csrf.getAttribute('content');
    return fetch(o.uploadUrl, { method: 'POST', body: fd, headers: headers, credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) {
        var url = j.url || j.location || j.path || (j.data && (j.data.url || j.data.path || j.data.location));
        if (!url) throw new Error('Upload response has no "url"');
        return url;
      });
  };
  P._selectImage = function (img) {
    if (this._img && this._img !== img) this._img.classList.remove('due-img-active');
    this._img = img;
    if (img) {
      img.classList.add('due-img-active');
      var r = document.createRange(); r.selectNode(img);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      this._range = r.cloneRange();
    }
  };

  /* ---------- embeds (video / maps) ---------- */
  P.openEmbed = function () {
    this._saveSel();
    var self = this, t = this.t;
    var m = this._modal(t.video,
      '<label class="due-field"><span>' + t.embedUrl + '</span><textarea name="url" rows="3" dir="ltr" placeholder="https://www.youtube.com/watch?v=…"></textarea></label>',
      function () {
        var html = self.embedHTML(m.q('[name=url]').value);
        if (!html) { m.info(t.unsupportedEmbed); return false; }
        self.insertHTML(html + '<p><br></p>');
      }, t.insert);
  };
  P.embedHTML = function (input) {
    var v = String(input || '').trim(), src = v, mm;
    if (/<iframe/i.test(v)) { mm = v.match(/src=["']([^"']+)["']/i); src = mm ? mm[1] : ''; }
    src = src.replace(/&amp;/g, '&');
    if ((mm = src.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/)))
      return '<div class="due-video"><iframe src="https://www.youtube.com/embed/' + mm[1] + '" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy"></iframe></div>';
    if ((mm = src.match(/vimeo\.com\/(?:video\/)?(\d+)/)))
      return '<div class="due-video"><iframe src="https://player.vimeo.com/video/' + mm[1] + '" allowfullscreen allow="autoplay; fullscreen; picture-in-picture" loading="lazy"></iframe></div>';
    if (/^https:\/\/(www|maps)\.google\.com\/maps\/embed/.test(src))
      return '<div class="due-video due-map"><iframe src="' + esc(src) + '" allowfullscreen loading="lazy"></iframe></div>';
    if (/^https?:\/\/\S+\.(mp4|webm|ogg)(\?\S*)?$/i.test(src))
      return '<video controls src="' + esc(src) + '"></video>';
    return '';
  };

  /* ---------- find & replace ---------- */
  P.openFind = function () {
    this._saveSel();
    var self = this, t = this.t;
    var m = this._modal(t.findReplace,
      '<label class="due-field"><span>' + t.find + '</span><input name="f" type="text"></label>' +
      '<label class="due-field"><span>' + t.replaceWith + '</span><input name="r" type="text"></label>' +
      '<label class="due-check"><input name="cs" type="checkbox"> ' + t.matchCase + '</label>',
      function () {
        var n = self.replaceAll(m.q('[name=f]').value, m.q('[name=r]').value, m.q('[name=cs]').checked);
        m.info(t.replaced + ': ' + n);
        return false;
      }, t.replaceAll);
    function count() {
      var f = m.q('[name=f]').value;
      m.info(f ? self.count(f, m.q('[name=cs]').checked) + ' ' + t.matches : '');
    }
    m.q('[name=f]').addEventListener('input', count);
    m.q('[name=cs]').addEventListener('change', count);
    var sel = this._range ? this._range.toString() : '';
    if (sel && sel.length < 80) { m.q('[name=f]').value = sel; count(); }
  };
  P._textNodes = function () {
    var w = document.createTreeWalker(this.content, NodeFilter.SHOW_TEXT), out = [];
    while (w.nextNode()) out.push(w.currentNode);
    return out;
  };
  P.count = function (find, cs) {
    if (!find) return 0;
    var re = new RegExp(escapeRe(find), cs ? 'g' : 'gi'), n = 0;
    this._textNodes().forEach(function (tn) { n += (tn.nodeValue.match(re) || []).length; });
    return n;
  };
  P.replaceAll = function (find, rep, cs) {
    if (!find) return 0;
    var re = new RegExp(escapeRe(find), cs ? 'g' : 'gi'), n = 0;
    this._flush();
    this._textNodes().forEach(function (tn) {
      var m = tn.nodeValue.match(re);
      if (m) { n += m.length; tn.nodeValue = tn.nodeValue.replace(re, function () { return rep; }); }
    });
    if (n) this._changed();
    return n;
  };

  /* ---------- source / fullscreen / print ---------- */
  P.toggleSource = function (on) {
    var want = on == null ? !this._srcMode : !!on;
    if (want === this._srcMode) return this;
    this._closeDD();
    this._hideCtx(true);
    var self = this;
    if (want) {
      this._flush();
      this.source.value = formatHTML(this.getHTML());
      this.source.style.height = Math.max(this.content.offsetHeight, 250) + 'px';
      this.content.style.display = 'none';
      this.source.style.display = 'block';
      this._srcMode = true;
      this.el.classList.remove('due-is-empty');
      this.source.focus();
    } else {
      this._srcMode = false;
      this.source.style.display = 'none';
      this.content.style.display = '';
      this.setHTML(this.source.value);
      this.focus();
    }
    Object.keys(this._btns).forEach(function (k) {
      if (k !== 'source' && k !== 'fullscreen') self._btns[k].disabled = want;
    });
    this._btns.source && this._btns.source.classList.toggle('is-active', want);
    if (!want) this._updateHistBtns();
    return this;
  };
  P.toggleFullscreen = function (on) {
    this._full = on == null ? !this._full : !!on;
    this.el.classList.toggle('due-full', this._full);
    document.documentElement.style.overflow = this._full ? 'hidden' : '';
    if (this._btns.fullscreen) this._btns.fullscreen.classList.toggle('is-active', this._full);
    this._updateCtx();
    this._emit('fullscreen', this._full);
    return this;
  };
  P.print = function () {
    var w = window.open('', '_blank');
    if (!w) return this;
    w.document.write('<!doctype html><html dir="' + this.dir + '"><head><meta charset="utf-8"><title>Print</title><style>' + CSS +
      ' body{margin:0;padding:32px;font:15px/1.7 system-ui,Tahoma,Arial,sans-serif;color:#111}</style></head><body><div class="due-render">' +
      this.getHTML() + '</div></body></html>');
    w.document.close();
    w.focus();
    setTimeout(function () { w.print(); }, 300);
    return this;
  };

  /* ---------- context bar (image / link / table) ---------- */
  P._hideCtx = function (deselect) {
    this.ctx.style.display = 'none';
    this.handle.style.display = 'none';
    if (deselect && this._img) { this._img.classList.remove('due-img-active'); this._img = null; }
  };
  P._ctxBtn = function (html, title, fn, flip) {
    var self = this;
    var b = h('button', 'due-btn' + (flip ? ' due-flip' : ''), { type: 'button', title: title, 'aria-label': title });
    b.innerHTML = html;
    b.addEventListener('click', function (e) { e.preventDefault(); fn(); });
    this.ctx.appendChild(b);
    return b;
  };
  P._sep = function () { this.ctx.appendChild(h('span', 'due-sep')); };
  P._updateCtx = function () {
    if (this._srcMode || this.o.readOnly) return this._hideCtx();
    var self = this, t = this.t, ctx = this.ctx, anchor = null, kind = '';
    var img = this._img && this.content.contains(this._img) ? this._img : null;
    var a = img ? null : this._closest('a');
    var cell = img || a ? null : this._closest('td,th');
    if (img) { anchor = img; kind = 'img'; }
    else if (a) { anchor = a; kind = 'a:' + a.getAttribute('href'); }
    else if (cell) { anchor = cell.closest('table'); kind = 'table'; this._cell = cell; }
    if (!anchor) return this._hideCtx();

    if (this._ctxKind !== kind || this._ctxAnchor !== anchor || ctx.style.display === 'none') {
      this._ctxKind = kind; this._ctxAnchor = anchor;
      ctx.innerHTML = '';
      if (img) {
        ['25%', '50%', '75%', '100%'].forEach(function (w) {
          self._ctxBtn(w, w, function () { self._flush(); img.style.width = w; img.style.height = 'auto'; img.removeAttribute('width'); img.removeAttribute('height'); self._changed(); });
        });
        this._sep();
        var setAlign = function (mode) {
          self._flush();
          var s = img.style;
          s.float = ''; s.display = ''; s.margin = '';
          if (mode === 'left') { s.float = 'left'; s.margin = '0 1em .6em 0'; }
          if (mode === 'right') { s.float = 'right'; s.margin = '0 0 .6em 1em'; }
          if (mode === 'center') { s.display = 'block'; s.margin = '0 auto .8em'; }
          if (!img.getAttribute('style')) img.removeAttribute('style');
          self._changed();
        };
        this._ctxBtn(I.imgLeft, t.imgLeft, function () { setAlign('left'); });
        this._ctxBtn(I.imgCenter, t.imgCenter, function () { setAlign('center'); });
        this._ctxBtn(I.imgRight, t.imgRight, function () { setAlign('right'); });
        this._ctxBtn(I.imgInline, t.imgInline, function () { setAlign(''); });
        this._sep();
        this._ctxBtn('ALT', t.editAlt, function () {
          var m = self._modal(t.editAlt, '<label class="due-field"><span>' + t.alt + '</span><input name="alt" type="text"></label>', function () {
            self._flush(); img.setAttribute('alt', m.q('[name=alt]').value); self._changed();
          }, t.save);
          m.q('[name=alt]').value = img.getAttribute('alt') || '';
        });
        this._ctxBtn(I.trash, t.remove, function () { self._flush(); img.remove(); self._img = null; self._hideCtx(); self._changed(); });
      } else if (a) {
        var link = h('a', 'due-ctx-url', { href: a.getAttribute('href'), target: '_blank', rel: 'noopener noreferrer', title: t.openLink });
        link.textContent = a.getAttribute('href');
        ctx.appendChild(link);
        this._ctxBtn(I.external, t.openLink, function () { window.open(a.href, '_blank', 'noopener'); });
        this._ctxBtn(I.edit, t.editLink, function () { self.openLink(); });
        this._ctxBtn(I.unlink, t.unlink, function () { self._flush(); unwrap(a); self._hideCtx(); self._changed(); });
      } else {
        this._ctxBtn(I.rowBefore, t.rowBefore, function () { self.tableOp('rowBefore'); });
        this._ctxBtn(I.rowAfter, t.rowAfter, function () { self.tableOp('rowAfter'); });
        this._ctxBtn(I.colBefore, t.colBefore, function () { self.tableOp('colBefore'); }, true);
        this._ctxBtn(I.colAfter, t.colAfter, function () { self.tableOp('colAfter'); }, true);
        this._sep();
        this._ctxBtn(I.delRow, t.delRow, function () { self.tableOp('delRow'); });
        this._ctxBtn(I.delCol, t.delCol, function () { self.tableOp('delCol'); });
        this._ctxBtn(I.trash, t.delTable, function () { self.tableOp('delTable'); });
      }
    }

    // position
    var br = this.body.getBoundingClientRect(), r = anchor.getBoundingClientRect(), cr = this.content.getBoundingClientRect();
    if (r.bottom < cr.top || r.top > cr.bottom) return this._hideCtx();
    ctx.style.display = 'flex';
    var cw = ctx.offsetWidth, ch = ctx.offsetHeight;
    var top = r.top - br.top - ch - 8;
    if (top < 4) top = Math.min(r.bottom - br.top + 8, br.height - ch - 4);
    var left = this.dir === 'rtl' ? r.right - br.left - cw : r.left - br.left;
    left = Math.max(4, Math.min(left, br.width - cw - 4));
    ctx.style.top = top + 'px';
    ctx.style.left = left + 'px';

    if (img) {
      this.handle.style.display = 'block';
      this.handle.style.top = (r.bottom - br.top - 9) + 'px';
      this.handle.style.left = (r.right - br.left - 9) + 'px';
    } else this.handle.style.display = 'none';
  };

  /* ---------- modal ---------- */
  P._modal = function (title, bodyHTML, onOk, okText) {
    var self = this, t = this.t;
    if (this._modalEl) this._modalEl.remove();
    this._closeDD();
    var m = h('div', 'due-modal', { role: 'dialog', 'aria-modal': 'true', 'aria-label': title });
    m.innerHTML = '<div class="due-modal-box"><div class="due-modal-head"><b></b><button type="button" class="due-btn due-x" aria-label="' + esc(t.cancel) + '">' + I.close + '</button></div>' +
      '<form class="due-modal-body" novalidate>' + bodyHTML + '<button type="submit" hidden></button></form>' +
      '<div class="due-modal-foot"><span class="due-modal-info"></span><button type="button" class="due-b2 due-cancel">' + esc(t.cancel) + '</button>' +
      '<button type="button" class="due-b1 due-ok">' + esc(okText || t.insert) + '</button></div></div>';
    m.querySelector('.due-modal-head b').textContent = title;
    this.el.appendChild(m);
    this._modalEl = m;
    var closed = false;
    function close() {
      if (closed) return; closed = true;
      m.remove();
      if (self._modalEl === m) self._modalEl = null;
      self._restore();
    }
    function ok() { if (onOk() !== false) close(); }
    m.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); ok(); });
    m.querySelector('.due-ok').addEventListener('click', ok);
    m.querySelector('.due-cancel').addEventListener('click', close);
    m.querySelector('.due-x').addEventListener('click', close);
    m.addEventListener('mousedown', function (e) { if (e.target === m) close(); });
    m.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); close(); }
      if (e.key === 'Enter' && e.target.tagName === 'TEXTAREA' && !e.shiftKey) { e.preventDefault(); ok(); }
    });
    setTimeout(function () {
      var f = m.querySelector('input[type=text],textarea');
      if (f) { f.focus(); f.select && f.select(); }
    }, 30);
    return {
      el: m, close: close,
      q: function (s) { return m.querySelector(s); },
      info: function (txt) { m.querySelector('.due-modal-info').textContent = txt; }
    };
  };

  P._toast = function (msg) {
    var tt = this.toast;
    tt.textContent = msg;
    tt.classList.add('show');
    clearTimeout(this._toastT);
    this._toastT = setTimeout(function () { tt.classList.remove('show'); }, 3000);
  };

  /* ------------------------------------------------------------------ *
   * Public API
   * ------------------------------------------------------------------ */
  P.getHTML = function () {
    if (this._srcMode) return this.o.sanitize ? sanitize(this.source.value) : this.source.value;
    var c = this.content.cloneNode(true);
    Array.prototype.slice.call(c.querySelectorAll('.due-img-active,.due-uploading')).forEach(function (x) {
      x.classList.remove('due-img-active');
      if (!x.getAttribute('class')) x.removeAttribute('class');
    });
    var html = c.innerHTML.replace(/​/g, '');
    if (this.isEmpty()) return '';
    return html;
  };
  P.getText = function () { return (this.content.innerText || this.content.textContent || '').replace(/​/g, ''); };
  P.isEmpty = function () {
    return !this.content.textContent.replace(/[\s​]/g, '') && !this.content.querySelector('img,iframe,video,hr,table');
  };
  P.setHTML = function (html, initial) {
    html = String(html == null ? '' : html);
    if (this.o.sanitize) html = sanitize(html);
    if (!html.trim()) html = '<p><br></p>';
    this.content.innerHTML = html;
    this._img = null;
    if (initial) { this._hist = [this.content.innerHTML]; this._hi = 0; this._updateHistBtns(); }
    else this._record();
    this._emitChange();
    this._hideCtx();
    return this;
  };
  P.clear = function () { return this.setHTML(''); };
  P.focus = function () { this._restore(); return this; };
  P.blur = function () { this.content.blur(); return this; };
  P.setReadOnly = function (ro) {
    this.o.readOnly = !!ro;
    this.content.setAttribute('contenteditable', ro ? 'false' : 'true');
    this.el.classList.toggle('due-readonly', !!ro);
    if (ro) this._hideCtx(true);
    return this;
  };
  P.setTheme = function (theme) {
    this.el.classList.remove('due-light', 'due-dark', 'due-auto');
    this.el.classList.add(theme === 'dark' ? 'due-dark' : theme === 'auto' ? 'due-auto' : 'due-light');
    this.o.theme = theme;
    return this;
  };
  P.on = function (ev, fn) { (this._ev[ev] = this._ev[ev] || []).push(fn); return this; };
  P.off = function (ev, fn) {
    if (!this._ev[ev]) return this;
    this._ev[ev] = fn ? this._ev[ev].filter(function (f) { return f !== fn; }) : [];
    return this;
  };
  P._emit = function (ev, data) {
    var self = this;
    (this._ev[ev] || []).forEach(function (fn) { try { fn.call(self, data, self); } catch (e) { console.error(e); } });
    try { this.target.dispatchEvent(new CustomEvent('due:' + ev, { detail: data, bubbles: true })); } catch (e) {}
  };
  P.destroy = function () {
    document.removeEventListener('selectionchange', this._onSel);
    document.removeEventListener('mousedown', this._onDocDown);
    document.removeEventListener('keydown', this._onDocKey);
    window.removeEventListener('resize', this._onResize);
    if (this._full) this.toggleFullscreen(false);
    var html = this.getHTML();
    this.el.remove();
    if (this._isField) { this.target.style.display = this._origDisplay || ''; this.target.value = html; }
    else { this.target.innerHTML = html; }
    delete this.target.__due;
    var i = Editor.instances.indexOf(this);
    if (i >= 0) Editor.instances.splice(i, 1);
    this._emit('destroy');
    this._ev = {};
  };

  /* ------------------------------------------------------------------ *
   * Static
   * ------------------------------------------------------------------ */
  Editor.version = VERSION;
  Editor.instances = [];
  Editor.defaults = DEFAULTS;
  Editor.presets = PRESETS;
  Editor.lang = LANGS;
  Editor.icons = I;
  Editor.css = CSS;
  Editor.iframeHosts = IFRAME_HOSTS;
  Editor.sanitize = sanitize;
  Editor.get = function (el) { if (typeof el === 'string') el = document.querySelector(el); return el ? el.__due || null : null; };
  Editor.init = function (sel, opts) {
    var els = typeof sel === 'string' ? document.querySelectorAll(sel) : (sel && sel.length != null ? sel : [sel]);
    return Array.prototype.map.call(els, function (el) { return new Editor(el, opts); });
  };

  // Auto-init: <textarea data-devunity-editor ...>
  if (HAS_DOM) {
    var auto = function () {
      Array.prototype.forEach.call(document.querySelectorAll('[data-devunity-editor]'), function (el) { if (!el.__due) new Editor(el); });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto);
    else setTimeout(auto);
  }

  return Editor;
});
