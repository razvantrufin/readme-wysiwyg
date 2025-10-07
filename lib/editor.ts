import { Editor, Transforms, Element as SlateElement, Text } from 'slate';
import { CustomElement, FormattedText } from './custom-types';

const LIST_TYPES = ['ul', 'ol'];

const CustomEditor = {
  isMarkActive(editor: Editor, format: keyof Omit<FormattedText, 'text'>) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },

  isBlockActive(editor: Editor, format: CustomElement['type']) {
    const [match] = Editor.nodes(editor, {
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  },

  toggleMark(editor: Editor, format: keyof Omit<FormattedText, 'text'>) {
    const isActive = CustomEditor.isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },

  toggleBlock(editor: Editor, format: CustomElement['type']) {
    const isActive = CustomEditor.isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: n =>
        LIST_TYPES.includes(
          !Editor.isEditor(n) && SlateElement.isElement(n) && (n.type as any)
        ),
      split: true,
    });

    const newProperties: Partial<SlateElement> = {
      type: isActive ? 'paragraph' : isList ? 'li' : format,
    };
    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] } as CustomElement;
      Transforms.wrapNodes(editor, block);
    }
  },

  isLinkActive(editor: Editor) {
    const [link] = Editor.nodes(editor, { match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link' });
    return !!link;
  },

  unwrapLink(editor: Editor) {
    Transforms.unwrapNodes(editor, { match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link' });
  },

  wrapLink(editor: Editor, url: string) {
    if (CustomEditor.isLinkActive(editor)) {
      CustomEditor.unwrapLink(editor);
    }
    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const link: CustomElement = {
      type: 'link',
      url,
      children: isCollapsed ? [{ text: url }] : [],
    };
    if (isCollapsed) {
      Transforms.insertNodes(editor, link);
    } else {
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: 'end' });
    }
  },

  insertHorizontalRule(editor: Editor) {
    const hr: CustomElement = { type: 'hr', children: [{ text: '' }] };
    Transforms.insertNodes(editor, hr);
  },

  insertTable(editor: Editor) {
    const table: CustomElement = {
      type: 'table',
      children: [
        {
          type: 'tr',
          children: [
            { type: 'td', children: [{ text: '' }] },
            { type: 'td', children: [{ text: '' }] },
          ],
        },
        {
          type: 'tr',
          children: [
            { type: 'td', children: [{ text: '' }] },
            { type: 'td', children: [{ text: '' }] },
          ],
        },
      ],
    };
    Transforms.insertNodes(editor, table);
  },
};

export default CustomEditor;