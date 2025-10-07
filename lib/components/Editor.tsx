import React, { useState, useMemo, useCallback } from 'react';
import { createEditor, Descendant, Editor as SlateEditor, Transforms, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { Box, VStack } from '@chakra-ui/react';
import { CustomElement, CustomText } from '../custom-types';
import Toolbar from './Toolbar';
import CustomEditor from '../editor';

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'Start typing here...' }],
  },
];

const Element = ({ attributes, children, element }: { attributes: any, children: any, element: CustomElement }) => {
  switch (element.type) {
    case 'h1':
      return <h1 {...attributes}>{children}</h1>;
    case 'h2':
      return <h2 {...attributes}>{children}</h2>;
    case 'h3':
      return <h3 {...attributes}>{children}</h3>;
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'ul':
      return <ul {...attributes}>{children}</ul>;
    case 'ol':
      return <ol {...attributes}>{children}</ol>;
    case 'li':
      return <li {...attributes}>{children}</li>;
    case 'link':
      return <a {...attributes} href={element.url}>{children}</a>;
    case 'hr':
        return <hr {...attributes} />;
    case 'table':
        return <table {...attributes}><tbody>{children}</tbody></table>;
    case 'tr':
        return <tr {...attributes}>{children}</tr>;
    case 'td':
        return <td {...attributes}>{children}</td>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: { attributes: any, children: any, leaf: CustomText }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }
  return <span {...attributes}>{children}</span>;
};

const withVoids = (editor: ReactEditor) => {
    const { isVoid } = editor;
    editor.isVoid = (element: SlateElement) => {
        return element.type === 'hr' ? true : isVoid(element);
    };
    return editor;
};

const SlateEditor = () => {
  const editor = useMemo(() => withVoids(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  return (
    <VStack spacing={4} align="stretch">
      <Slate editor={editor} initialValue={value} onChange={setValue}>
        <Toolbar />
        <Box borderWidth="1px" borderRadius="lg" p={4}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              if (!event.ctrlKey) {
                return;
              }
              switch (event.key) {
                case 'b': {
                  event.preventDefault();
                  CustomEditor.toggleMark(editor, 'bold');
                  break;
                }
                case 'i': {
                  event.preventDefault();
                  CustomEditor.toggleMark(editor, 'italic');
                  break;
                }
                case 'u': {
                    event.preventDefault();
                    CustomEditor.toggleMark(editor, 'underline');
                    break;
                }
              }
            }}
          />
        </Box>
      </Slate>
    </VStack>
  );
};

export default SlateEditor;