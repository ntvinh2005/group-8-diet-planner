import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";
import { Router } from "./routes/Router";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
