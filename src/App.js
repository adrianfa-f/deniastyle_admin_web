import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/Inventory/ProductList";
import ProductFormPage from "./pages/Inventory/ProductFormPage";
import OrderList from "./pages/Orders/OrderList";
import OrderDetail from "./pages/Orders/OrderDetail";

// Configuración global de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos sin considerar datos obsoletos
      refetchOnWindowFocus: false, // evita refetch al volver a la pestaña
      retry: 1,
    },
  },
});

// Componente de ruta protegida
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <Layout />;
};

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:id/edit" element={<ProductFormPage />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/:id" element={<OrderDetail />} />
          </Route>
        </Routes>
        {/* Opcional: solo en desarrollo */}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
