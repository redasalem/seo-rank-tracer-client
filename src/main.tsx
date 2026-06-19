import "./index.css";
import "./i18n";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AddProvider } from "./context/AppContext.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <ThemeProvider defaultTheme="dark">
            <AddProvider>
                <App />
            </AddProvider>
        </ThemeProvider>
    </BrowserRouter>
);
