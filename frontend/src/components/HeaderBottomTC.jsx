import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { ImPlus, ImMinus } from "react-icons/im";
import Flex from "../components/designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategory } from "../redux/orebiSlice";
import useIsMobile from "../hooks/useIsMobile";
import { useArticulos } from "../context/articulosContext";
import { API_URL } from "../config";

const gruposColapsables = {
  "🧴 Limpieza y Desinfección": [
    "Líquidos", "Desinfectantes", "Desengrasantes", "Quitamanchas", "Jabón Ropa", "Jabones", "Ceras"
  ],
  "🧹 Accesorios de Limpieza": [
    "Trapos y Paños", "Cepillos", "Secadores", "Rejillas", "Esponjas", "Mangos y Cabos", "Guantes"
  ],
  "🍽 Descartables y Bolsas": [
    "Plásticos", "Descartables", "Bolsas"
  ],
  "🏠 Ambientadores y Aromas": [
    "Aromatizantes", "Esencias", "Sahumerios", "Pastillas", "Aerosoles"
  ],
  "🧷 Papelería y Cocina": [
    "Papeles", "Rollos Cocina"
  ],
  "🛠 Adhesivos y Pegamentos": [
    "Pegamentos"
  ],
  "🐾 Mascotas y Control de Plagas": [
    "Mascotas", "Venenos", "Insecticidas"
  ],
  "💄 Perfumería y Cuidado Personal": [
    "Perfumería", "Perfumería y Cuidado Personal"
  ],
  "🍽 Bazar y Artículos Variados": [
    "Bazar", "Artículos Varios", "Tecnoclean"
  ]
};

const agruparFamiliasPorGrupo = (familias) => {
  const resultado = {};
  Object.keys(gruposColapsables).forEach((grupo) => {
    resultado[grupo] = familias.filter((familia) =>
      gruposColapsables[grupo].includes(familia.descripcion)
    );
  });
  return resultado;
};

const HeaderBottom = () => {
  const { articulosQuery, GetArticulosQuery, familias, GetFamilias, updateOffset, GetArticulosPorCategoria } = useArticulos();
  const products = useSelector((state) => state.orebiReducer.products);
  const isMobile = useIsMobile();

  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [openGroups, setOpenGroups] = useState({});

  const navigate = useNavigate();
  const ref = useRef();
  const searchRef = useRef();
  const dispatch = useDispatch();

  const checkedCategorys = useSelector((state) => state.orebiReducer.checkedCategorys);

  useEffect(() => {
    GetFamilias();
  }, []);

  useEffect(() => {
    GetArticulosPorCategoria(checkedCategorys, null, 0);
    updateOffset(0);
  }, [checkedCategorys]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchBar(false);
      if (ref.current && !ref.current.contains(e.target)) setShow(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) GetArticulosQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setFilteredProducts(articulosQuery);
  }, [articulosQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchBar(true);
  };

  const handleToggleCategory = async (category) => {
    await dispatch(toggleCategory(category));
    setShow(false);
  };

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const familiasAgrupadas = familias ? agruparFamiliasPorGrupo(familias) : {};

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          {isMobile && (
            <>
              <div
                onClick={() => setShow(!show)}
                ref={ref}
                className="flex h-14 cursor-pointer items-center gap-2 text-primeColor mt-5"
              >
                <HiOutlineMenuAlt4 className="w-8 h-8" />
                <p className="text-[16px] font-semibold">Buscar por categoría</p>
              </div>

              {/* Chips por debajo */}
              <div className="flex flex-wrap gap-2 mt-2 ml-10">
                {checkedCategorys.map((cat) => (
                  <div
                    key={cat._id}
                    className="flex items-center bg-red-500 text-white px-2 py-1 rounded-full text-sm"
                  >
                    <span className="mr-1">{cat.descripcion}</span>
                    <button
                      className="text-white ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCategory(cat);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {show && (
                <motion.ul
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-14 z-50 bg-[#e00725] w-[90%] text-[#fff] p-4 rounded-lg"
                >
                  {Object.keys(familiasAgrupadas).map((grupo) => (
                    <div key={grupo} className="mb-3">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGroup(grupo);
                        }}
                        className="flex justify-between items-center cursor-pointer text-lg font-semibold py-2"
                      >
                        <span>{grupo}</span>
                        {openGroups[grupo] ? (
                          <ImMinus className="text-xl" />
                        ) : (
                          <ImPlus className="text-xl" />
                        )}
                      </div>
                      {openGroups[grupo] && (
                        <ul className="ml-4 mt-2">
                          {familiasAgrupadas[grupo].map((item) => (
                            <li
                              key={item.codigo}
                              className="flex items-center gap-3 py-2 cursor-pointer text-base"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleCategory(item);
                              }}
                            >
                              <input
                                type="checkbox"
                                className="cursor-pointer w-5 h-5"
                                checked={checkedCategorys.some((b) => b._id === item._id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleToggleCategory(item);
                                }}
                              />
                              {item.descripcion}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </motion.ul>
              )}
            </>
          )}
          <div className="mb-6 mt-7 relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
            <input
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
              type="text"
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Buscar articulo ..."
            />
            <FaSearch className="w-5 h-5" />
            {searchQuery && showSearchBar && (
              <div
                ref={searchRef}
                className={`w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer`}
              >
                {filteredProducts.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      navigate(`/articulo/${item._id}`, { state: { item } });
                      setShowSearchBar(false);
                      setSearchQuery("");
                    }}
                    className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3 pl-3"
                  >
                    {item.imagen && (
                      <img
                        // className="w-[25%]"
                        className="h-full max-h-24 object-contain"
                        src={`${API_URL}${item.imagen.replace(/ /g, "%20")}`}
                        alt="productImg"
                      />
                    )}
                    <div className="flex flex-col gap-1">
                      <p className="text-[20px]">
                        {item.descripcion.length > 100
                          ? `${item.descripcion.slice(0, 100)}...`
                          : item.descripcion}
                      </p>
                      <p className="text-lg">
                        Precio:{" "}
                        <span className="text-primeColor font-semibold">
                          ${" "}
                          {item.precio.toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-6 mb-6 lg:mt-0 items-center pr-6 cursor-pointer relative">
            <Link to="/cart">
              <div className="relative top-1 mb-1">
                <FaShoppingCart />
                <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                  {products.length}
                </span>
              </div>
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
