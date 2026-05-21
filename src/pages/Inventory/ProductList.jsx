import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../../api/products";
import { getCategories } from "../../api/categories";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import ErrorAlert from "../../components/Common/ErrorAlert";
import { useState } from "react";

const ProductList = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    minStock: "",
    destacado: "",
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  const handleDelete = (id) => {
    if (
      window.confirm(
        "¿Eliminar este producto? También se borrarán sus imágenes.",
      )
    )
      deleteMutation.mutate(id);
  };

  const getFirstImage = (images) =>
    images && images.length ? images[0] : null;

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message="Error al cargar productos" />;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-darkText">Productos</h1>
        <Link
          to="/products/new"
          className="bg-primary hover:bg-accent text-darkText px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" /> Nuevo Producto
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Buscar nombre..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <select
            value={filters.categoryId}
            onChange={(e) =>
              setFilters({ ...filters, categoryId: e.target.value })
            }
            className="border rounded px-3 py-2"
          >
            <option value="">Todas las categorías</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Precio min"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Precio max"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Stock mínimo"
            value={filters.minStock}
            onChange={(e) =>
              setFilters({ ...filters, minStock: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <select
            value={filters.destacado}
            onChange={(e) =>
              setFilters({ ...filters, destacado: e.target.value })
            }
            className="border rounded px-3 py-2"
          >
            <option value="">Todos</option>
            <option value="true">Destacados</option>
            <option value="false">No destacados</option>
          </select>
        </div>
      </div>

      {/* Tabla escritorio */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Imagen
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Precio
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Destacado
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products?.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  {getFirstImage(product.images) ? (
                    <img
                      src={getFirstImage(product.images)}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                      Sin img
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-darkText">
                  {product.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  ${product.price}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {product.destacado ? (
                    <StarSolidIcon className="w-5 h-5 text-yellow-500" />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href={`${process.env.REACT_APP_PUBLIC_URL}/producto/${product.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5 inline" />
                  </a>
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="text-accent hover:text-darkText mr-2"
                  >
                    <PencilIcon className="w-5 h-5 inline" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
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

      {/* Tarjetas móvil */}
      <div className="md:hidden space-y-4">
        {products?.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow p-3 flex gap-3"
          >
            <div className="flex-shrink-0">
              {getFirstImage(product.images) ? (
                <img
                  src={getFirstImage(product.images)}
                  alt={product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                  Sin img
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <span className="font-bold text-darkText">{product.name}</span>
                {product.destacado && (
                  <StarSolidIcon className="w-4 h-4 text-yellow-500" />
                )}
              </div>
              <div className="text-sm text-gray-500">
                Precio: ${product.price}
              </div>
              <div className="text-sm text-gray-500">
                Stock: {product.stock}
              </div>
              <div className="flex justify-end gap-3 mt-1">
                <a
                  href={`${process.env.REACT_APP_PUBLIC_URL}/producto/${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                </a>
                <Link
                  to={`/products/${product.id}/edit`}
                  className="text-accent hover:text-darkText"
                >
                  <PencilIcon className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
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

export default ProductList;
