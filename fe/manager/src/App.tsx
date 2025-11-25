import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AppWithRouter from "./AppWithRouter";
import useClientWidth from "./hooks/useClientWidth.util";
import "./styles/app.scss";
import "./styles/reset.scss";
import "./styles/root.scss";

function App() {
  useClientWidth();

  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

export default App;
