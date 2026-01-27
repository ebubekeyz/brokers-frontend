import { createRoot } from "react-dom/client";
import { store } from "./store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import "./index.css";
import App from "./App";
import "react-toastify/dist/ReactToastify.css"; // make sure this is included

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <App />
      <ToastContainer position="top-center" />
    </I18nextProvider>
  </Provider>
);
