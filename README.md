# DevUnity Editor

Lightweight, **dependency-free** WYSIWYG editor with first-class **Arabic / RTL** support.
One JS file (CSS is injected automatically) — drop it into Laravel, Next.js, or plain HTML.

~75 KB minified (~23 KB gzipped) · no jQuery · no frameworks · MIT

---

## 1. Install from the CDN

```html
<script src="https://cdn.jsdelivr.net/gh/Mohamedouf125/devunity-editor@1.0.0/dist/devunity-editor.min.js"></script>
```

That's it — styles are injected by the script. (Optional: if you add `dist/devunity-editor.css` as a `<link>` yourself, the script detects it and won't inject the styles again.)

### Publishing it to a CDN

**Option A — jsDelivr via GitHub (free, recommended)**
1. Push this folder to your GitHub repo, e.g. `Mohamedouf125/devunity-editor`.
2. Create a release/tag: `git tag v1.0.0 && git push --tags`
3. Use: `https://cdn.jsdelivr.net/gh/Mohamedouf125/devunity-editor@1.0.0/dist/devunity-editor.min.js`
   - `@1` → latest 1.x · `@latest` → latest tag (cached up to 7 days; pin versions in production)

**Option B — npm (gives you unpkg + jsDelivr)**
```bash
npm login && npm publish
```
→ `https://cdn.jsdelivr.net/npm/devunity-editor@1/dist/devunity-editor.min.js`
→ `https://unpkg.com/devunity-editor@1`

**Option C — your own domain** (e.g. `cdn.devunity.co`): upload `dist/` to Cloudflare R2 / S3 / Bunny with long cache headers, and put the version in the path (`/editor/1.0.0/devunity-editor.min.js`).

---

## 2. Usage

### Zero-JS (auto-init)
```html
<textarea name="description" data-devunity-editor data-lang="ar" data-min-height="300"></textarea>
```

### JS
```html
<textarea id="body" name="body"></textarea>
<script>
  const editor = new DevUnityEditor('#body', {
    lang: 'ar',            // 'ar' | 'en' — auto from <html lang>
    toolbar: 'full',       // 'full' | 'standard' | 'basic' | 'minimal' | custom array
    minHeight: 300,
    uploadUrl: '/editor/upload',
    onChange: html => console.log(html)
  });
</script>
```

When the target is a `<textarea>`, its value stays in sync — a normal form submit sends the HTML. When the target is a `<div>`, pass `name: 'body'` to get a hidden input.

---

## 3. Features

| | |
|---|---|
| Text | bold, italic, underline, strike, sub/superscript, inline code, clear formatting |
| Blocks | paragraph, H1–H6, quote, code block, horizontal line |
| Style | font family, font size, line height, text color, highlight (palette + custom picker) |
| Layout | align (left/center/right/justify), per-paragraph RTL/LTR, indent/outdent, lists |
| Media | images (upload / drag & drop / paste / URL), resize handle, 25–100% presets, float, alt text |
| Embeds | YouTube, Vimeo, Google Maps, mp4 — URL or `<iframe>` code (allow-listed hosts only) |
| Tables | grid picker, header row, add/remove rows & columns, Tab to move/add rows |
| Tools | find & replace, HTML source view, print, fullscreen, undo/redo history, emoji, word count |
| Safety | built-in HTML sanitizer on load, paste and source edits (strips scripts, event handlers, `javascript:` URLs, Word junk) |
| UX | light / dark / auto themes, sticky toolbar, keyboard shortcuts, mobile friendly, Arabic & English UI |

Shortcuts: `Ctrl+B/I/U`, `Ctrl+K` link, `Ctrl+Z` / `Ctrl+Y` (or `Ctrl+Shift+Z`), `Ctrl+F` find, `Tab` in tables & lists, `Esc` exits fullscreen. Double-click a link to edit it.

---

## 4. Options

| Option | Default | Notes |
|---|---|---|
| `lang` | auto | `'ar'` or `'en'` |
| `dir` | auto | `'rtl'` / `'ltr'` (follows `lang`) |
| `theme` | `'light'` | `'light'`, `'dark'`, `'auto'` |
| `toolbar` | `'full'` | preset name, `'bold,italic|link'` string, or array of groups |
| `placeholder` | — | also read from the textarea's `placeholder` |
| `value` | — | initial HTML (overrides target content) |
| `height` / `minHeight` / `maxHeight` | `null` / `250` / `null` | number = px |
| `resizable` | `true` | vertical drag-resize |
| `stickyToolbar` / `stickyOffset` | `true` / `0` | offset for fixed site headers |
| `statusBar` / `branding` | `true` / `true` | word count + "DevUnity Editor" mark |
| `readOnly` | `false` | |
| `primaryColor` | `#10b981` | any CSS color |
| `name` | — | hidden input name when target is a `<div>` |
| `uploadUrl` | — | POST endpoint, must return `{ "url": "..." }` |
| `uploadField` | `'file'` | form field name |
| `uploadHeaders` | — | extra headers (Laravel CSRF is added automatically from `<meta name="csrf-token">`) |
| `uploadImage` | — | `async (file) => url` — your own uploader (S3, Cloudinary…) |
| `maxImageSize` | `5 MB` | bytes |
| `pastePlain` | `false` | always paste as plain text |
| `sanitize` | `true` | |
| `fontSizes`, `fontFamilies`, `lineHeights`, `colors`, `emojis` | built-in | override lists |
| `i18n` | — | override any label: `{ bold: 'تقيل' }` |

Without `uploadUrl`/`uploadImage`, images are embedded as base64.

### Custom toolbar & buttons
```js
new DevUnityEditor('#body', {
  toolbar: [
    ['undo', 'redo'],
    ['bold', 'italic', 'foreColor'],
    ['link', 'image', {
      name: 'price',
      title: 'Insert price',
      icon: '💰',
      action: ed => ed.insertHTML('<b>EGP 4,950,000</b>')
    }]
  ]
});
```

Available names: `undo redo format fontFamily fontSize lineHeight bold italic underline strike subscript superscript inlineCode foreColor backColor align alignLeft alignCenter alignRight alignJustify direction ul ol indent outdent link unlink image video table emoji blockquote codeBlock hr removeFormat findReplace source print fullscreen`

---

## 5. API

```js
editor.getHTML()            // clean HTML ('' when empty)
editor.setHTML(html)
editor.getText()
editor.isEmpty()
editor.insertHTML(html) / editor.insertText(text) / editor.insertImage(src, alt)
editor.exec('bold')         // any execCommand
editor.undo() / editor.redo()
editor.focus() / editor.blur() / editor.clear()
editor.setReadOnly(true) / editor.setTheme('dark')
editor.toggleSource() / editor.toggleFullscreen()
editor.destroy()            // restores the original textarea with the latest HTML

editor.on('change', html => {})   // also: ready, focus, blur, upload, error, fullscreen, destroy
document.querySelector('#body').addEventListener('due:change', e => e.detail)

DevUnityEditor.init('.rich', opts)   // many at once → array
DevUnityEditor.get('#body')          // instance from element
DevUnityEditor.sanitize(html)        // the sanitizer, standalone
DevUnityEditor.iframeHosts.push('www.facebook.com')  // allow more embed hosts
```

---

## 6. Laravel

**Route + controller**
```php
// routes/web.php
Route::post('/editor/upload', [EditorUploadController::class, 'store'])->middleware('auth');

// app/Http/Controllers/EditorUploadController.php
public function store(Request $request)
{
    $request->validate(['file' => 'required|image|max:5120']);
    $path = $request->file('file')->store('editor', 'public');
    return response()->json(['url' => Storage::url($path)]);
}
```

**Blade (Option A: Direct HTML)**
```blade
<meta name="csrf-token" content="{{ csrf_token() }}">

<textarea name="description" data-devunity-editor data-upload-url="{{ route('editor.upload') }}">{{ old('description', $unit->description) }}</textarea>

<script src="https://cdn.jsdelivr.net/gh/Mohamedouf125/devunity-editor@1/dist/devunity-editor.min.js"></script>
```

**Blade (Option B: Ready-made Component Wrapper)**
Copy `wrappers/blade/devunity-editor.blade.php` to your Laravel project at `resources/views/components/devunity-editor.blade.php`:
```blade
<meta name="csrf-token" content="{{ csrf_token() }}">

<x-devunity-editor
    name="description"
    :value="$unit->description"
    :upload-url="route('editor.upload')"
    lang="ar"
    min-height="320"
/>
```
*(Handles old form inputs, Livewire synchronization, and script loading automatically).*

**Always re-sanitize on the server** before saving (client-side sanitizing can be bypassed), e.g. with `mews/purifier`:
```php
$data['description'] = clean($request->description);
```

**Displaying saved content** — wrap it in `.due-render` to get identical styling:
```blade
<div class="due-render" dir="rtl">{!! $unit->description !!}</div>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Mohamedouf125/devunity-editor@1/dist/devunity-editor.css">
```

---

## 7. Next.js / React

A ready-to-use React component wrapper is provided in `wrappers/react/DevUnityEditor.jsx` (with TypeScript definitions).

**Usage in Next.js (App Router / Pages Router):**
```jsx
'use client';
import { useState } from 'react';
import DevUnityEditor from '@/components/DevUnityEditor'; // from wrappers/react/DevUnityEditor.jsx

export default function MyEditorPage() {
  const [content, setContent] = useState('<h2>عنوان المقال</h2><p>محتوى تجريبي...</p>');

  return (
    <div style={{ maxWidth: 900, margin: '40px auto' }}>
      <DevUnityEditor
        value={content}
        onChange={setContent}
        uploadUrl="/api/editor/upload"
        lang="ar"
        minHeight={350}
      />
    </div>
  );
}
```
Or with vanilla React and direct CDN loading:
```jsx
'use client';
import { useEffect, useRef } from 'react';

export default function RichEditor({ value, onChange }) {
  const el = useRef(null);
  useEffect(() => {
    let ed;
    import('devunity-editor').then(({ default: DevUnityEditor }) => {
      ed = new DevUnityEditor(el.current, { value, lang: 'ar', onChange });
    });
    return () => ed && ed.destroy();
  }, []);
  return <div ref={el} />;
}
```
(or load the CDN script with `next/script` and use `window.DevUnityEditor`.)

---

## Build

```bash
npm install
npm run build   # → dist/devunity-editor.js, .min.js, .css
```

Browser support: current Chrome, Edge, Safari, Firefox (desktop & mobile).

© DevUnity — https://devunity.co — MIT License
