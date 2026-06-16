import "./index.css";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AddProvider } from "./context/AppConext.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <ThemeProvider>
            <AddProvider>
                <App />
            </AddProvider>
        </ThemeProvider>
    </BrowserRouter>
);
