import { Bars3Icon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-4 flex-shrink-0 z-20 relative">
      {/* Botón hamburguesa solo visible en móvil */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 md:hidden mr-2"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>
      <div className="text-xl font-bold text-primary">DeniaStyle Admin</div>
      <div className="flex-1" />
      <button
        onClick={handleLogout}
        className="text-sm text-darkText bg-rose/20 px-3 py-1 rounded-full hover:bg-rose/30"
      >
        Cerrar sesión
      </button>
    </header>
  );
};

export default Header;
