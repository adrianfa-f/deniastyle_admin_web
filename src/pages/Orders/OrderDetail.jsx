import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getOrder } from "../../api/orders";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import ErrorAlert from "../../components/Common/ErrorAlert";

const OrderDetail = () => {
  const { id } = useParams();
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Error al cargar el pedido" />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-darkText mb-4">
        Pedido #{order.id}
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold text-lg mb-2">Datos del cliente</h2>
          <p>
            <strong>Nombre:</strong> {order.customerName}
          </p>
          <p>
            <strong>Email:</strong> {order.customerEmail}
          </p>
          <p>
            <strong>Teléfono:</strong> {order.customerPhone}
          </p>
          <p>
            <strong>Dirección:</strong> {order.customerAddress}
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-2">Información del pedido</h2>
          <p>
            <strong>Estado:</strong> {order.status}
          </p>
          <p>
            <strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Total:</strong> ${order.total}
          </p>
        </div>
      </div>
      <h2 className="font-semibold text-lg mt-6 mb-2">Productos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Precio unit.</th>
              <th className="px-4 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.product.name}</td>
                <td className="border px-4 py-2 text-center">
                  {item.quantity}
                </td>
                <td className="border px-4 py-2">${item.price}</td>
                <td className="border px-4 py-2">
                  ${item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <Link to="/orders" className="bg-gray-200 px-4 py-2 rounded-lg">
          Volver
        </Link>
      </div>
    </div>
  );
};
export default OrderDetail;
