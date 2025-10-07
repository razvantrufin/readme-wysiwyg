import React from 'react';
import { Container, Heading, VStack } from '@chakra-ui/react';
import { Editor } from '../lib';

function App() {
  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8}>
        <Heading>Slate.js Markdown Editor</Heading>
        <Editor />
      </VStack>
    </Container>
  );
}

export default App;