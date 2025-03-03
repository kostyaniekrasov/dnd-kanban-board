import { Container } from 'react-bootstrap';
import './App.css';
import { Board, Header } from './components';

function App() {
  return (
    <Container>
      <Header />
      <main>
        <Board />
      </main>
    </Container>
  );
}

export default App;
