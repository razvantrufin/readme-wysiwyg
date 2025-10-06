import { Container, Heading, VStack } from '@chakra-ui/react';
import Editor from './components/Editor';

function App() {
  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8}>
        <Heading>Markdown Editor</Heading>
        <Editor />
      </VStack>
    </Container>
  );
}

export default App;