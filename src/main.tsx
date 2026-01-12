import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { AuthProvider } from "./context/auth/authContext";

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
          <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
