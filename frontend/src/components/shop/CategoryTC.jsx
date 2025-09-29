import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    GetFamiliasConArticulos,
  } = useArticulos();

  const checkedCategorys = useSelector(
    (state) => state.orebiReducer.checkedCategorys
  );
  const dispatch = useDispatch();

  // Agrupar familias por grupo dentro de useEffect y manejar loading
  useEffect(() => {
    if (!familias) return;

    setLoading(true);

    const resultado = {};

    familias.forEach((familia) => {
      const grupoDescripcion = familia.grupoId?.descripcion;

      if (!grupoDescripcion || grupoDescripcion.trim() === "") return;

      if (!resultado[grupoDescripcion]) {
        resultado[grupoDescripcion] = [];
      }

      resultado[grupoDescripcion].push(familia);
    });

    setFamiliasAgrupadas(resultado);
    setLoading(false);
  }, [familias]);

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
    <div className="w-full">
      <NavTitleTC title="Categorias" icons={false} />

      {/* Píldoras de categorías seleccionadas */}
      {checkedCategorys.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {checkedCategorys.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center bg-[#e00725] text-white rounded-full px-3 py-1 text-sm"
            >
              <span className="mr-2">{cat.descripcion}</span>
              <button
                onClick={() => handleToggleCategory(cat)}
                className="focus:outline-none"
              >
                <IoMdClose className="text-white text-lg" />
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
              <li key={grupo} className="border-b border-gray-300">
                <div
                  className="flex justify-between items-center cursor-pointer p-2 font-semibold hover:text-[#e00725] hover:bg-gray-100 transition"
                  onClick={() => handleGrupoCollapse(grupo)}
                >
                  <span>{grupo}</span>
                  <span>{openGrupo === grupo ? <ImMinus /> : <ImPlus />}</span>
                </div>

                {openGrupo === grupo && (
                  <ul className="pl-4">
                    {familiasAgrupadas[grupo].map((item) => (
                      <li key={item.codigo} className="border-b border-gray-200">
                        <div className="flex items-center cursor-pointer p-2 hover:text-[#e00725] hover:bg-gray-50 transition">
                          <label className="flex items-center gap-2 w-full">
                            <input
                              type="checkbox"
                              className="cursor-pointer transform scale-150"
                              id={item._id}
                              checked={checkedCategorys.some(
                                (b) => b._id === item._id
                              )}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => handleToggleCategory(item)}
                            />
                            <span className="truncate">{item.descripcion}</span>
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default CategoryTC;
