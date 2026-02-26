import React, { useState, useEffect } from "react";
import { motion, AnimatePresence  } from "framer-motion";
import { ImPlus, ImMinus } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import NavTitleTC from "./NavTitleTC";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategory } from "../../redux/orebiSlice";
import { useArticulos } from "../../context/articulosContext";

const CategoryTC = () => {
  const [openGrupo, setOpenGrupo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [familiasAgrupadas, setFamiliasAgrupadas] = useState({});

  const {
    GetArticulosPorCategoria,
    updateOffset,
    mostrarCargarMas,
    familias,
    familiasConArticulos,
    GetFamiliasConArticulos,
  } = useArticulos();

  const checkedCategorys = useSelector(
    (state) => state.orebiReducer.checkedCategorys
  );
  const dispatch = useDispatch();

  // Agrupar familias por grupo dentro de useEffect y manejar loading
  useEffect(() => {
    if (!familiasConArticulos) return;

    setLoading(true);

    const resultado = {};

    familiasConArticulos.forEach((familia) => {
      const grupoDescripcion = familia.grupoId?.descripcion;

      if (!grupoDescripcion || grupoDescripcion.trim() === "") return;

      if (!resultado[grupoDescripcion]) {
        resultado[grupoDescripcion] = [];
      }

      resultado[grupoDescripcion].push(familia);
    });

    setFamiliasAgrupadas(resultado);
    setLoading(false);
  }, [familiasConArticulos]);

  useEffect(() => {
    GetFamiliasConArticulos();
  }, []);

  useEffect(() => {
    GetArticulosPorCategoria(checkedCategorys, null, 0);
    updateOffset(0);
  }, [checkedCategorys]);

  const handleToggleCategory = async (category) => {
    await dispatch(toggleCategory(category));
  };

  const handleGrupoCollapse = (grupo) => {
    setOpenGrupo(openGrupo === grupo ? null : grupo);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-5 border border-gray-100">
      {/* <NavTitleTC title="Categorias" icons={false} /> */}

      {/* nuevito */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
          Categorías
        </h2>
        {checkedCategorys.length > 0 && (
          <button
            onClick={() => {
              checkedCategorys.forEach((cat) => dispatch(toggleCategory(cat)));
            }}
            className="text-sm text-[#e00725] font-medium hover:opacity-80 transition"
          >
            Limpiar todo
          </button>
        )}
      </div>
      {/* nuevito */}

      {/* Píldoras de categorías seleccionadas */}
      {checkedCategorys.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {checkedCategorys.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center bg-[#e00725]/10 text-[#e00725] border border-[#e00725]/20 rounded-full px-3 py-1 text-sm font-medium"
            >
              <span className="mr-2">{cat.descripcion}</span>
              <button
                onClick={() => handleToggleCategory(cat)}
                className="focus:outline-none"
              >
                <IoMdClose className="text-[#e00725] text-lg hover:scale-110 transition" />
              </button>
            </div>
          ))}
        </div>
      )}

      {loading ||
        !familiasAgrupadas ||
        Object.keys(familiasAgrupadas).length === 0 ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded w-3/4 mx-2" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="flex flex-col gap-2 text-sm lg:text-base text-[#767676]">
            {Object.keys(familiasAgrupadas).map((grupo) => (
              <li key={grupo} className="rounded-xl overflow-hidden">
                <div
                  className={`flex justify-between items-center cursor-pointer px-4 py-3 font-semibold rounded-xl transition
                    ${openGrupo === grupo
                      ? "bg-[#e00725]/10 text-[#e00725]"
                      : "hover:bg-gray-100 text-gray-800"
                    }`} onClick={() => handleGrupoCollapse(grupo)}
                >
                  <span>{grupo}</span>
                  <span>{openGrupo === grupo ? <ImMinus /> : <ImPlus />}</span>
                </div>

                <AnimatePresence>
                  {openGrupo === grupo && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-2 flex flex-col gap-1"
                    >
                      {familiasAgrupadas[grupo].map((item) => {
                        const isChecked = checkedCategorys.some(
                          (b) => b._id === item._id
                        );

                        return (
                          <li key={item.codigo}>
                            <label className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition hover:bg-gray-50 group">
                              <input
                                type="checkbox"
                                className="hidden"
                                checked={isChecked}
                                onChange={() =>
                                  handleToggleCategory(item)
                                }
                              />

                              <span className="truncate text-gray-700 group-hover:text-[#e00725] transition">
                                {item.descripcion}
                              </span>

                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition
                                  ${isChecked
                                    ? "bg-[#e00725] border-[#e00725]"
                                    : "border-gray-300"
                                  }
                                `}
                              >
                                {isChecked && (
                                  <div className="w-2 h-2 bg-white rounded-sm" />
                                )}
                              </div>
                            </label>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default CategoryTC;
