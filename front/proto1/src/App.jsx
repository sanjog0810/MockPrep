import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './home/Header';
import Hero from './home/Hero';
import Topics from './home/Topics';
import Footer from './home/Footer';// 👈 import interview page
import Ip from './ed2/Ip'; // 👈 import second page of interview
import './global.css'; // Global styles
import Username from './Username';
import ResultsPage from './ResultPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Hero />
              <Topics />
              <Footer />
              
            </>
          }
        />

        {/* Interview Code Editor Page */}
        <Route path="/inter" element={<Ip />} />
        <Route path="/user" element={<Username />} />
        <Route path="/results" element={<ResultsPage />} />

      </Routes>
    </Router>
  );
}

export default App;
