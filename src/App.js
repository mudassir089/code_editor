import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";
import LoinPage from "./pages/LoginPage";
function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                fontSize: 18,
                backgroundColor: "#1d8f50",
                color: "#FFF",
              },
              iconTheme: {
                primary: "#FFF",
                secondary: "#1d8f50",
              },
            },
            error: {
              style: {
                fontSize: 18,
                backgroundColor: "#E15549",
                color: "#FFF",
              },
              iconTheme: {
                primary: "#FFF",
                secondary: "#E15549",
              },
            },
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoinPage />} />

          <Route path="/editor/:roomId" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
