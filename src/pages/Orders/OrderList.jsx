import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getOrders, updateOrderStatus, deleteOrder } from "../../api/orders";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import ErrorAlert from "../../components/Common/ErrorAlert";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const statusOptions = [
  "Pendiente",
  "Confirmado",
  "Enviado",
  "Entregado",
  "Cancelado",
];

const statusColors = {
  Pendiente: "bg-yellow-100 text-yellow-800",
  Confirmado: "bg-blue-100 text-blue-800",
  Enviado: "bg-purple-100 text-purple-800",
  Entregado: "bg-green-100 text-green-800",
  Cancelado: "bg-red-100 text-red-800",
};

const OrderList = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    minTotal: "",
    maxTotal: "",
  });

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const updateMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["products"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["products"]);
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`Cambiar estado a ${newStatus}?`)) {
      updateMutation.mutate({ id: orderId, status: newStatus });
    }
  };

  const handleDelete = (orderId) => {
    if (window.confirm("¿Eliminar este pedido?"))
      deleteMutation.mutate(orderId);
  };

  const filteredOrders = orders?.filter((order) => {
    if (filters.status && order.status !== filters.status) return false;
    if (
      filters.startDate &&
      new Date(order.createdAt) < new Date(filters.startDate)
    )
      return false;
    if (
      filters.endDate &&
      new Date(order.createdAt) > new Date(filters.endDate)
    )
      return false;
    if (filters.minTotal && order.total < parseFloat(filters.minTotal))
      return false;
    if (filters.maxTotal && order.total > parseFloat(filters.maxTotal))
      return false;
    return true;
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Error al cargar pedidos" />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-darkText mb-6">Órdenes</h1>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="">Todos los estados</option>
            {statusOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input
            type="date"
            placeholder="Desde"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="date"
            placeholder="Hasta"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Total mínimo"
            value={filters.minTotal}
            onChange={(e) =>
              setFilters({ ...filters, minTotal: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Total máximo"
            value={filters.maxTotal}
            onChange={(e) =>
              setFilters({ ...filters, maxTotal: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Tabla escritorio */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders?.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {order.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  ${order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="border rounded px-2 py-1 mr-2 text-sm"
                  >
                    {statusOptions.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-accent hover:text-darkText mr-2"
                  >
                    <EyeIcon className="w-5 h-5 inline" />
                  </Link>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas móvil mejoradas */}
      <div className="md:hidden space-y-4">
        {filteredOrders?.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-start border-b pb-2 mb-2">
              <span className="font-bold text-darkText">
                Pedido #{order.id}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}
              >
                {order.status}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Cliente:</span>{" "}
                {order.customerName}
              </p>
              <p>
                <span className="font-medium">Total:</span> ${order.total}
              </p>
              <p>
                <span className="font-medium">Fecha:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-between items-center mt-3 pt-2 border-t">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                {statusOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <div className="flex gap-3">
                <Link
                  to={`/orders/${order.id}`}
                  className="text-accent hover:text-darkText"
                >
                  <EyeIcon className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
