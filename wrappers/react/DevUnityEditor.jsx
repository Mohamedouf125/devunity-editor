'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

/**
 * DevUnityEditor Component for React & Next.js (App Router & Pages Router)
 */
const DevUnityEditor = forwardRef(function DevUnityEditor(
  {
    value = '',
    onChange,
    name,
    placeholder,
    lang = 'ar',
    dir,
    theme = 'light',
    minHeight = 300,
    height,
    toolbar = 'full',
    uploadUrl,
    uploadHeaders,
    readOnly = false,
    options = {},
    className = '',
    style = {},
  },
  ref
) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const isInternalChangeRef = useRef(false);

  // Expose editor instance methods via ref
  useImperativeHandle(ref, () => ({
    getHTML: () => (editorRef.current ? editorRef.current.getHTML() : ''),
    setHTML: (html) => editorRef.current && editorRef.current.setHTML(html),
    getText: () => (editorRef.current ? editorRef.current.getText() : ''),
    isEmpty: () => (editorRef.current ? editorRef.current.isEmpty() : true),
    focus: () => editorRef.current && editorRef.current.focus(),
    blur: () => editorRef.current && editorRef.current.blur(),
    clear: () => editorRef.current && editorRef.current.clear(),
    insertHTML: (html) => editorRef.current && editorRef.current.insertHTML(html),
    insertText: (text) => editorRef.current && editorRef.current.insertText(text),
    insertImage: (src, alt) => editorRef.current && editorRef.current.insertImage(src, alt),
    getInstance: () => editorRef.current,
  }));

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!containerRef.current) return;

      // Import the library or load from window/CDN
      let EditorClass = window.DevUnityEditor;
      if (!EditorClass) {
        try {
          const mod = await import('devunity-editor');
          EditorClass = mod.default || mod.DevUnityEditor;
        } catch {
          // If not installed as npm package, load from CDN
          if (!document.querySelector('script[src*="devunity-editor"]')) {
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://cdn.jsdelivr.net/gh/Mohamedouf125/devunity-editor@1/dist/devunity-editor.min.js';
              script.async = true;
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
            });
          }
          EditorClass = window.DevUnityEditor;
        }
      }

      if (!isMounted || !containerRef.current || !EditorClass) return;

      const mergedOptions = {
        value: value || '',
        lang,
        dir,
        theme,
        minHeight,
        height,
        toolbar,
        placeholder,
        uploadUrl,
        uploadHeaders,
        readOnly,
        name,
        ...options,
        onChange: (html) => {
          isInternalChangeRef.current = true;
          if (onChange) onChange(html);
          if (options.onChange) options.onChange(html);
          setTimeout(() => {
            isInternalChangeRef.current = false;
          }, 0);
        },
      };

      editorRef.current = new EditorClass(containerRef.current, mergedOptions);
    }

    init();

    return () => {
      isMounted = false;
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // Sync external value updates
  useEffect(() => {
    if (editorRef.current && !isInternalChangeRef.current) {
      const currentHTML = editorRef.current.getHTML();
      if (value !== undefined && value !== currentHTML) {
        editorRef.current.setHTML(value || '');
      }
    }
  }, [value]);

  // Sync readOnly
  useEffect(() => {
    if (editorRef.current && typeof editorRef.current.setReadOnly === 'function') {
      editorRef.current.setReadOnly(readOnly);
    }
  }, [readOnly]);

  // Sync theme
  useEffect(() => {
    if (editorRef.current && typeof editorRef.current.setTheme === 'function') {
      editorRef.current.setTheme(theme);
    }
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={`devunity-editor-react-wrapper ${className}`}
      style={style}
    />
  );
});

export default DevUnityEditor;
