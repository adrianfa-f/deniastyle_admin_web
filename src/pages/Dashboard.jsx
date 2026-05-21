import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/orders";
import { getProducts } from "../api/products";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const Dashboard = () => {
  const { data: orders, isLoading: ordersLoad } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  const { data: products, isLoading: productsLoad } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (ordersLoad || productsLoad) return <LoadingSpinner />;

  const totalSales = orders?.reduce((acc, o) => acc + o.total, 0) || 0;
  const pendingOrders =
    orders?.filter((o) => o.status === "Pendiente").length || 0;
  const lowStock = products?.filter((p) => p.stock < 5).length || 0;
  const outOfStock = products?.filter((p) => p.stock === 0).length || 0;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-darkText mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Ventas totales</h3>
          <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Pedidos pendientes</h3>
          <p className="text-2xl font-bold">{pendingOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">
            Productos con bajo stock (&lt;5)
          </h3>
          <p className="text-2xl font-bold text-red-500">{lowStock}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Productos agotados</h3>
          <p className="text-2xl font-bold text-red-500">{outOfStock}</p>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
