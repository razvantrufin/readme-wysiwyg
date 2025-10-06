import { Box, Button,ButtonGroup, VStack } from '@chakra-ui/react';
import { useRef } from 'react';

const Editor = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleBold = () => {
    document.execCommand('bold');
  };

  const handleItalic = () => {
    document.execCommand('italic');
  };

  return (
    <VStack spacing={4} align="stretch">
      <ButtonGroup>
        <Button onClick={handleBold}>Bold</Button>
        <Button onClick={handleItalic}>Italic</Button>
      </ButtonGroup>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        contentEditable
        ref={editorRef}
        minH="200px"
      />
    </VStack>
  );
};

export default Editor;