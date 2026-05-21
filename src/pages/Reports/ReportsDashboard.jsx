import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getSalesReport,
  getTopProducts,
  getOrdersByStatus,
} from "../../api/reports";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#f9c5d1", "#e8a9b4", "#f5e6d3", "#d9c2b0", "#c7a4b4"];

const ReportsDashboard = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const { data: sales, isLoading: salesLoading } = useQuery({
    queryKey: ["salesReport", dateRange.start, dateRange.end],
    queryFn: () =>
      getSalesReport(dateRange.start || undefined, dateRange.end || undefined),
  });

  const { data: topProducts, isLoading: topLoading } = useQuery({
    queryKey: ["topProducts"],
    queryFn: getTopProducts,
  });

  const { data: ordersByStatus, isLoading: statusLoading } = useQuery({
    queryKey: ["ordersByStatus"],
    queryFn: getOrdersByStatus,
  });

  if (salesLoading || topLoading || statusLoading) return <LoadingSpinner />;

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold text-darkText">Reportes</h1>

      {/* Filtro de fechas */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-600">Desde</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
            className="border rounded px-3 py-1"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Hasta</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
            className="border rounded px-3 py-1"
          />
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Ventas totales (período)</h3>
          <p className="text-2xl font-bold">
            ${sales?.totalSales?.toFixed(2) || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Número de pedidos</h3>
          <p className="text-2xl font-bold">{sales?.orderCount || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Artículos vendidos</h3>
          <p className="text-2xl font-bold">{sales?.totalItems || 0}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Productos más vendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts || []}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalQuantity" fill="#f9c5d1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Pedidos por estado</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ordersByStatus || []}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {(ordersByStatus || []).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
