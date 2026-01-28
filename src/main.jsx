import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n";
import { ConfigProvider } from "antd";

import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <HelmetProvider>
      <QueryClientProvider client={new QueryClient()}>
        <ConfigProvider
          theme={{
            token: { colorPrimary: "#0d0d0d" },
            components: {
              Tabs: {
                itemColor: "#bbb",
                itemActiveColor: "#0d0d0d",
              },
            },
          }}
        >
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
