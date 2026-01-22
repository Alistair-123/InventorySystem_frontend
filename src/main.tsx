import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalToaster from "./components/GlobalToaster";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { AuthProvider } from "./context/auth/authContext";
import { BrowserRouter } from "react-router-dom";
const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
     <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
          <App />
          <GlobalToaster />
      </AuthProvider>
    </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
