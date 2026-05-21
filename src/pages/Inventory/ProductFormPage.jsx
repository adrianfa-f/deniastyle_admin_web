import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, updateProduct, getProduct } from "../../api/products";
import { getCategories } from "../../api/categories";
import { uploadImage } from "../../api/upload";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [uploading, setUploading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: product, isLoading: loadingData } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: isEdit,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
      images: [],
      attributes: [],
      destacado: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });
  const images = watch("images") || [];

  // Reset form when product and categories are loaded
  useEffect(() => {
    if (product && categories?.length) {
      reset({
        ...product,
        price: product.price.toString(),
        stock: product.stock.toString(),
        categoryId: product.categoryId.toString(),
      });
    }
  }, [product, categories, reset]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setValue("images", [...images, url]);
    } catch (err) {
      alert("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue("images", newImages);
  };

  const mutation = useMutation({
    mutationFn: isEdit
      ? (data) => updateProduct({ id, ...data })
      : createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      navigate("/products");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      categoryId: parseInt(data.categoryId),
    });
  };

  if (loadingData) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-darkText mb-6">
        {isEdit ? "Editar Producto" : "Nuevo Producto"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-darkText font-medium mb-1">
            Nombre *
          </label>
          <input
            {...register("name", { required: "Nombre requerido" })}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-darkText font-medium mb-1">Slug *</label>
          <input
            {...register("slug", { required: "Slug requerido" })}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-darkText font-medium mb-1">
            Descripción
          </label>
          <textarea
            {...register("description")}
            rows="3"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-darkText font-medium mb-1">
              Precio *
            </label>
            <input
              type="number"
              step="0.01"
              {...register("price", { required: "Precio requerido", min: 0 })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-darkText font-medium mb-1">
              Stock
            </label>
            <input
              type="number"
              {...register("stock", { min: 0 })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-darkText font-medium mb-1">
            Categoría *
          </label>
          <select
            {...register("categoryId", { required: "Categoría requerida" })}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Selecciona</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-darkText font-medium mb-1">
            Imágenes
          </label>
          <div className="flex flex-wrap gap-3 mb-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20">
                <img
                  src={img}
                  alt="preview"
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                >
                  <XMarkIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
            <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-100">
              {uploading ? (
                <LoadingSpinner />
              ) : (
                <PlusIcon className="w-6 h-6 text-gray-400" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
        <div>
          <label className="block text-darkText font-medium mb-1">
            Atributos
          </label>
          {fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <input
                placeholder="Nombre"
                {...register(`attributes.${idx}.name`)}
                className="flex-1 border rounded px-2 py-1"
              />
              <input
                placeholder="Valor"
                {...register(`attributes.${idx}.value`)}
                className="flex-1 border rounded px-2 py-1 w-full"
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="text-red-500"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ name: "", value: "" })}
            className="text-sm text-accent"
          >
            + Agregar atributo
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("destacado")}
            className="w-4 h-4"
          />
          <label className="text-darkText">Producto destacado</label>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-primary hover:bg-accent text-darkText px-6 py-2 rounded-lg"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
