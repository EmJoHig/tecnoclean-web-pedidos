import React, { useState, useEffect } from "react";
// import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { ImPlus } from "react-icons/im";
import NavTitleTC from "./NavTitleTC";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategory, filterArticulos } from "../../redux/orebiSlice";
import { useArticulos } from "../../context/articulosContext";


const CategoryTC = () => {
  const [showSubCatOne, setShowSubCatOne] = useState(false);

  const [showCategorias, setShowCategorias] = useState(true);

  const { articulos, GetArticulosPorCategoria, getArticulos, offset, updateOffset, mostrarCargarMas } = useArticulos();

  const { familias, GetFamilias } = useArticulos();

  const [mostrarCargarMasLocal, setMostrarCargarMasLocal] = useState(true);



  useEffect(() => {
    GetFamilias();
    //getArticulos();
  }, []);


  useEffect(() => {

    if (mostrarCargarMas) {
      setMostrarCargarMasLocal(true);
    } else {
      setMostrarCargarMasLocal(false);
    }
  }, [mostrarCargarMas]);


  const checkedCategorys = useSelector(
    (state) => state.orebiReducer.checkedCategorys
  );
  const dispatch = useDispatch();

  // const category = [
  //   {
  //     _id: 9006,
  //     title: "Imprimante",
  //   },
  //   {
  //     _id: 9007,
  //     title: "Encre",
  //   },
  //   {
  //     _id: 9008,
  //     title: "Ruban",
  //   },
  //   {
  //     _id: 9009,
  //     title: "Bac de dechet",
  //   },
  // ];

  const category = [
    {
      _id: 1,
      codigo: "AER",
      descripcion: "Aerosoles",
    },
    {
      _id: 2,
      codigo: "ESPONJA",
      descripcion: "Esponjas",
    },
    {
      _id: 3,
      codigo: "PEG",
      descripcion: "Pegamentos",
    },
    {
      _id: 4,
      codigo: "CEP",
      descripcion: "Cepillos",
    },
    {
      _id: 5,
      codigo: "BOLSAS",
      descripcion: "Bolsas",
    },
    {
      _id: 6,
      codigo: "SECADOR",
      descripcion: "Secadores",
    },
    {
      _id: 7,
      codigo: "TRAPO",
      descripcion: "Trapos",
    },
    {
      _id: 8,
      codigo: "PERF",
      descripcion: "Perfumeria",
    },

    {
      _id: 9,
      codigo: "SAUME",
      descripcion: "Saumerios",
    },
    {
      _id: 10,
      codigo: "AROM",
      descripcion: "Aromatizantes",
    },
    {
      _id: 11,
      codigo: "MASCOTA",
      descripcion: "Mascotas",
    },
    {
      _id: 12,
      codigo: "VEN",
      descripcion: "Venenos",
    },

  ];


  const handleToggleCategory = async (category) => {

    // console.log("checkedCategorys antes de dispatch");
    // console.log(checkedCategorys);
    await dispatch(toggleCategory(category));
  };


  //se activa cuando checkedCategorys cambia
  useEffect(() => {
    // console.log("checkedCategorys después de dispatch");
    // console.log(checkedCategorys);
    GetArticulosPorCategoria(checkedCategorys, 0);
    updateOffset(0);
    // console.log("articulos recueprados checked categorua antes");
    // console.log(articulos);

    // dispatch(filterArticulos(articulos));
    // dispatch(toggleArticulo(articulos));
  }, [checkedCategorys]);


  // useEffect(() => {
  //   dispatch(filterArticulos(articulos));
  //   console.log("articulos recueprados checked categorua despues");
  //   console.log(articulos);
  // }, [articulos]);


  // useEffect(() => {
  //   console.log("articulos actualizados useefect");
  //   console.log(articulos);
  // }, [articulos]);


  return (
    <div className="w-full">
      {/* <NavTitleTC title="Shop by Categoryeessss" icons={true} /> */}
      <div
      //onClick={() => setShowCategorias(!showCategorias)}
      //className="cursor-pointer"
      >
        <NavTitleTC title="Categorias" icons={false} />
      </div>

      {/* {showCategorias && ( */}

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {familias && familias.map((item) => (
            <li
              key={item.codigo}
              className="border-b-[1px] border-b-[#F0F0F0] cursor-pointer pb-2 flex items-center gap-2 hover:text-[#e00725] hover:border-gray-400 duration-300"
              onClick={() => handleToggleCategory(item)}
            >
              <input
                type="checkbox"
                className="cursor-pointer transform scale-150"
                id={item._id}
                checked={checkedCategorys.some((b) => b._id === item._id)}
                onClick={(e) => e.stopPropagation()} // Detener la propagación del evento para que no se active el evento del padre
                onChange={() => handleToggleCategory(item)}
              />
              {item.descripcion}
              {item.icons && (
                <span
                  onClick={() => setShowSubCatOne(!showSubCatOne)}
                  className="text-[10px] lg:text-xs cursor-pointer text-gray-400 hover:text-[#e00725] duration-300"
                >
                  <ImPlus />
                </span>
              )}
            </li>
          ))}
          {/* <li onClick={() => console.log(checkedCategorys)}>test</li> */}
        </ul>
      </motion.div>

      {/* )} */}


    </div>
  );
};

export default CategoryTC;
