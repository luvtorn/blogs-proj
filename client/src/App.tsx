import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
