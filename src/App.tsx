import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import VocabularyList from './pages/VocabularyList';
import Flashcards from './pages/Flashcards';
import Grammar from './pages/Grammar';
import Exercises from './pages/Exercises';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="vocabulary" element={<VocabularyList />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="grammar" element={<Grammar />} />
          <Route path="exercises" element={<Exercises />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
