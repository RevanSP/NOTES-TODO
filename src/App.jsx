import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Notes from "./pages/Notes";
import Todo from "./pages/Todo";

const App = () => {
  return (
    <Router basename="/NOTES-TODO">
      <Routes>
        <Route path="/" element={<Navigate to="/notes" />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </Router>
  );
};

export default App;