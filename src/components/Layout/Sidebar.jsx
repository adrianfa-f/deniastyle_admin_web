import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Productos", href: "/products", icon: CubeIcon },
  { name: "Órdenes", href: "/orders", icon: ClipboardDocumentListIcon },
  { name: "Reportes", href: "/reports", icon: ChartBarIcon },
];

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg z-50
          transition-transform duration-300 ease-in-out
          md:transition-none md:z-30
          w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${isOpen ? "md:w-64" : "md:w-20"}
        `}
      >
        {/* Botón cerrar en móvil */}
        <div className="flex justify-end p-2 md:hidden">
          <button onClick={onToggle} className="p-1">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Botón toggle flecha solo escritorio */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md border border-gray-200 z-50 hidden md:block"
        >
          {isOpen ? (
            <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
          )}
        </button>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto h-full">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => {
                if (window.innerWidth < 768) onToggle();
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-primary text-darkText"
                  : "text-gray-600 hover:bg-rose/30"
              } ${!isOpen && "md:justify-center"}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span>{item.name}</span>}
              {!isOpen && (
                <span className="hidden md:inline text-xs sr-only">
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
