import React from 'react';

export interface DevUnityEditorRef {
  getHTML: () => string;
  setHTML: (html: string) => void;
  getText: () => string;
  isEmpty: () => boolean;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  insertHTML: (html: string) => void;
  insertText: (text: string) => void;
  insertImage: (src: string, alt?: string) => void;
  getInstance: () => any;
}

export interface DevUnityEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  name?: string;
  placeholder?: string;
  lang?: 'ar' | 'en';
  dir?: 'rtl' | 'ltr';
  theme?: 'light' | 'dark' | 'auto';
  minHeight?: number;
  height?: number;
  toolbar?: 'full' | 'standard' | 'basic' | 'minimal' | any[];
  uploadUrl?: string;
  uploadHeaders?: Record<string, string>;
  readOnly?: boolean;
  options?: Record<string, any>;
  className?: string;
  style?: React.CSSProperties;
}

declare const DevUnityEditor: React.ForwardRefExoticComponent<
  DevUnityEditorProps & React.RefAttributes<DevUnityEditorRef>
>;

export default DevUnityEditor;
