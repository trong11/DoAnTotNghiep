import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'
import {BrowserRouter} from "react-router-dom";
import NotificationProvider from "./context/NotificationProvider";
import ContextProviders from "./context";

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(<BrowserRouter>
    <ContextProviders>
        <App/>
    </ContextProviders>
</BrowserRouter>)