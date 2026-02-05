import ReactDOM from "react-dom/client"
import "./index.css"

import { BrowserRouter } from "react-router-dom"   // 👈 thêm dòng này
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import App from "./App"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

const showDevtools = false

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>   
    <QueryClientProvider client={queryClient}>
      <App />
      {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </BrowserRouter>
)
