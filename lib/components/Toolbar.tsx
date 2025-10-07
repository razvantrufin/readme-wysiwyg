import React from 'react';
import { useSlate } from 'slate-react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import CustomEditor from '../editor';
import { CustomElement, FormattedText } from '../custom-types';

const MarkButton = ({ format, children }: { format: keyof Omit<FormattedText, 'text'>; children: React.ReactNode }) => {
  const editor = useSlate();
  return (
    <Button
      variant={CustomEditor.isMarkActive(editor, format) ? 'solid' : 'ghost'}
      onMouseDown={(event) => {
        event.preventDefault();
        CustomEditor.toggleMark(editor, format);
      }}
    >
      {children}
    </Button>
  );
};

const BlockButton = ({ format, children }: { format: CustomElement['type']; children: React.ReactNode }) => {
  const editor = useSlate();
  return (
    <Button
      variant={CustomEditor.isBlockActive(editor, format) ? 'solid' : 'ghost'}
      onMouseDown={(event) => {
        event.preventDefault();
        CustomEditor.toggleBlock(editor, format);
      }}
    >
      {children}
    </Button>
  );
};

const LinkButton = () => {
  const editor = useSlate();
  return (
    <Button
      variant={CustomEditor.isLinkActive(editor) ? 'solid' : 'ghost'}
      onMouseDown={(event) => {
        event.preventDefault();
        const url = window.prompt('Enter the URL of the link:');
        if (!url) return;
        CustomEditor.wrapLink(editor, url);
      }}
    >
      Link
    </Button>
  );
};

const Toolbar = () => {
  const editor = useSlate();
  return (
    <ButtonGroup>
      <MarkButton format="bold">Bold</MarkButton>
      <MarkButton format="italic">Italic</MarkButton>
      <MarkButton format="underline">Underline</MarkButton>
      <MarkButton format="strikethrough">Strikethrough</MarkButton>
      <BlockButton format="h1">H1</BlockButton>
      <BlockButton format="h2">H2</BlockButton>
      <BlockButton format="h3">H3</BlockButton>
      <BlockButton format="blockquote">Quote</BlockButton>
      <BlockButton format="ul">UL</BlockButton>
      <BlockButton format="ol">OL</BlockButton>
      <LinkButton />
      <Button onMouseDown={() => CustomEditor.insertHorizontalRule(editor)}>HR</Button>
      <Button onMouseDown={() => CustomEditor.insertTable(editor)}>Table</Button>
    </ButtonGroup>
  );
};

export default Toolbar;