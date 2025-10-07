import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

// Elements
export type ParagraphElement = { type: 'paragraph'; children: CustomText[] };
export type HeadingElement = { type: 'h1' | 'h2' | 'h3'; children: CustomText[] };
export type BlockquoteElement = { type: 'blockquote'; children: CustomText[] };
export type BulletedListElement = { type: 'ul'; children: ListItemElement[] };
export type NumberedListElement = { type: 'ol'; children: ListItemElement[] };
export type ListItemElement = { type: 'li'; children: CustomText[] };
export type LinkElement = { type: 'link'; url: string; children: CustomText[] };
export type HorizontalRuleElement = { type: 'hr'; children: CustomText[] };
export type TableElement = { type: 'table'; children: TableRowElement[] };
export type TableRowElement = { type: 'tr'; children: TableCellElement[] };
export type TableCellElement = { type: 'td'; children: CustomText[] };


export type CustomElement =
  | ParagraphElement
  | HeadingElement
  | BlockquoteElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | LinkElement
  | HorizontalRuleElement
  | TableElement
  | TableRowElement
  | TableCellElement;

// Text
export type FormattedText = {
  text: string;
  bold?: true;
  italic?: true;
  underline?: true;
  strikethrough?: true;
};

export type CustomText = FormattedText;

// Editor
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}