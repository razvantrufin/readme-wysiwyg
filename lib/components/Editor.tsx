import { Box, Button, ButtonGroup, VStack } from '@chakra-ui/react';
import { useRef, useCallback } from 'react';

type BlockStyle = 'h1' | 'h2' | 'h3' | 'blockquote' | 'ul' | 'ol';
type InlineStyle = 'strong' | 'em';

const Editor = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  const applyInlineStyle = useCallback((style: InlineStyle) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const element = document.createElement(style);
    element.appendChild(range.extractContents());
    range.insertNode(element);

    selection.removeAllRanges();
    range.selectNodeContents(element);
    selection.addRange(range);
  }, []);

  const applyBlockStyle = useCallback((style: BlockStyle) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount || !editorRef.current) return;

    const range = selection.getRangeAt(0);
    let blockEl = range.startContainer;

    // Find the top-level block element within the editor.
    while (blockEl.parentNode !== editorRef.current && blockEl.parentNode) {
      blockEl = blockEl.parentNode;
    }

    if (!(blockEl instanceof HTMLElement)) return;

    const listParent = blockEl.closest('ul, ol');

    // Case 1: Toggling a list
    if (style === 'ul' || style === 'ol') {
      if (listParent) {
        // Subcase 1a: Switching list type (e.g., UL to OL)
        if (listParent.tagName.toLowerCase() !== style) {
          const newList = document.createElement(style);
          while (listParent.firstChild) {
            newList.appendChild(listParent.firstChild);
          }
          listParent.replaceWith(newList);
        } else {
          // Subcase 1b: Toggling list off - CORRECTED LOGIC
          const fragment = document.createDocumentFragment();
          for (const li of Array.from(listParent.children)) {
            const p = document.createElement('p');
            while (li.firstChild) {
              p.appendChild(li.firstChild);
            }
            if (p.innerHTML === '') {
              p.innerHTML = '<br>';
            }
            fragment.appendChild(p);
          }
          listParent.replaceWith(fragment);
        }
      } else {
        // Subcase 1c: Toggling list on
        const list = document.createElement(style);
        const listItem = document.createElement('li');
        while (blockEl.firstChild) {
          listItem.appendChild(blockEl.firstChild);
        }
        if (listItem.innerHTML === '') {
            listItem.innerHTML = '<br>';
        }
        list.appendChild(listItem);
        blockEl.replaceWith(list);
      }
    } else {
      // Case 2: Toggling headings or blockquotes
      const newTag = blockEl.tagName.toLowerCase() === style ? 'p' : style;
      const newBlock = document.createElement(newTag);
      while (blockEl.firstChild) {
        newBlock.appendChild(blockEl.firstChild);
      }
      blockEl.replaceWith(newBlock);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent, style: InlineStyle | BlockStyle) => {
    e.preventDefault();
    editorRef.current?.focus();
    if (style === 'strong' || style === 'em') {
      applyInlineStyle(style);
    } else {
      applyBlockStyle(style);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <ButtonGroup>
        <Button onMouseDown={(e) => handleMouseDown(e, 'strong')}>Bold</Button>
        <Button onMouseDown={(e) => handleMouseDown(e, 'em')}>Italic</Button>
        <Button onMouseDown={(e) => handleMouseDown(e, 'h1')}>H1</Button>
        <Button onMouseDown={(e) => handleMouseDown(e, 'h2')}>H2</Button>
        <Button onMouseDown={(e) => handleMouseDown(e, 'h3')}>H3</Button>
        <Button onMouseDown={(e) => handleMouseDown(e, 'ul')}>UL</Button>
        <Button onMouseDown={(e) => handleMouseDown(e, 'ol')}>OL</Button>
        <Button onMouseDown={(e) => handleMouseDown(e, 'blockquote')}>Quote</Button>
      </ButtonGroup>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        contentEditable
        suppressContentEditableWarning={true}
        ref={editorRef}
        minH="200px"
      >
        <p><br/></p>
      </Box>
    </VStack>
  );
};

export default Editor;