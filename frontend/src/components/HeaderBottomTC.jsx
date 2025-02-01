import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import Flex from "../components/designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { paginationItems } from "../constants";
import imprimante1 from "../assets/images/products/bestSeller/imprimante1.webp";
import { BsSuitHeartFill } from "react-icons/bs";
import useIsMobile from "../hooks/useIsMobile";
import { useArticulos } from "../context/articulosContext";
import { toggleCategory, filterArticulos } from "../redux/orebiSlice";

const HeaderBottom = () => {

  const { articulosQuery, GetArticulosQuery, familias, GetFamilias, updateOffset, GetArticulosPorCategoria } = useArticulos();

  const products = useSelector((state) => state.orebiReducer.products);
  const isMobile = useIsMobile();

  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  const searchRef = useRef();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const [showSubCatOne, setShowSubCatOne] = useState(false);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   document.body.addEventListener("click", (e) => {
  //     if (ref.current && ref.current.contains(e.target)) {
  //       setShow(true);
  //     } else {
  //       setShow(false);
  //     }
  //   });
  // }, [show, ref]);


  useEffect(() => {
    GetFamilias();
  }, []);

  const checkedCategorys = useSelector(
    (state) => state.orebiReducer.checkedCategorys
  );



  useEffect(() => {
    GetArticulosPorCategoria(checkedCategorys, 0);
    updateOffset(0);
  }, [checkedCategorys]);



  // Manejador de clics fuera del componente
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchBar(false);
      }

      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false); // Cierra el menú
      }

    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);



  //useEffects para filtrar los productos en la barra de busqueda
  useEffect(() => {
    if (searchQuery.length > 1) {
      GetArticulosQuery(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    setFilteredProducts(articulosQuery);
  }, [articulosQuery]);


  //Funcion para manejar el cambio en el input de busqueda
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchBar(true);
  };


  const handleToggleCategory = async (category) => {

    // console.log("checkedCategorys antes de dispatch");
    // console.log(checkedCategorys);
    await dispatch(toggleCategory(category));
  };


  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          {isMobile && (
            <div
              onClick={() => setShow(!show)}
              ref={ref}
              className="flex h-14 cursor-pointer items-center gap-2 text-primeColor mt-5"
            >
              <HiOutlineMenuAlt4 className="w-5 h-5" />
              <p className="text-[14px] font-normal">Buscar por categoría</p>

              {show && (
                <motion.ul
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-14 z-50 bg-[#e00725] w-[70%] text-[#767676] h-auto p-4 pb-6"
                >
                  {/* <Link to={"category/imprimante"}>
                    <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                      Imprimante mobile
                    </li>
                  </Link>

                  <Link to={"category/ancre"}>
                    <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                      ancre mobile
                    </li>
                  </Link>
                  <Link to={"category/Ruban"}>
                    <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                      ruban mobile
                    </li>
                  </Link>
                  <Link to={"category/Bac"}>
                    <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                      Bac de dechet mobile
                    </li>
                  </Link> */}

                  <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#fff]">
                    {familias && familias.map((item) => (
                      <li
                        key={item.codigo}
                        className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-[#fff] hover:border-gray-400 duration-300"
                        onClick={() => handleToggleCategory(item)}
                      >
                        <input
                          type="checkbox"
                          className="cursor-pointer"
                          id={item._id}
                          checked={checkedCategorys.some((b) => b._id === item._id)}
                          onChange={() => handleToggleCategory(item)}
                        />
                        {item.descripcion}
                        {item.icons && (
                          <span
                            // onClick={() => setShowSubCatOne(!showSubCatOne)}
                            className="text-[10px] lg:text-xs cursor-pointer text-gray-400 hover:text-[#e00725] duration-300"
                          >
                            <ImPlus />
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>

                </motion.ul>
              )}
            </div>
          )}
          <div className="mb-6 mt-7 relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
            <input
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
              type="text"
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Buscar productos..."
            />
            <FaSearch className="w-5 h-5" />
            {searchQuery && showSearchBar && (
              <div
                ref={searchRef}
                className={`w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer`}
              >
                {searchQuery &&
                  filteredProducts &&
                  filteredProducts.map((item) => (
                    <div
                      onClick={() =>
                        navigate(`/articulo/${item._id}`,
                          {
                            state: {
                              item: item,
                            },
                          }
                        ) &
                        setShowSearchBar(true) &
                        setSearchQuery("")
                      }
                      key={item._id}
                      className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3"
                    >
                      {/* <img className="w-24" src={imprimante1} alt="productImg" /> */}
                      {item.imagen ? (
                        <img
                          className="w-[25%]"
                          src={`http://localhost:4000${item.imagen.replace(/ /g, "%20")}`}
                          alt="productImg"
                        />
                      ) : (
                        <></>
                      )}

                      <div className="flex flex-col gap-1">
                        {/* <p className="font-semibold text-lg">
                          {item.codigo}
                        </p> */}
                        <p className="text-[20px]">
                          {item.descripcion.length > 100
                            ? `${item.descripcion.slice(0, 100)}...`
                            : item.descripcion}
                        </p>
                        <p className="text-lg">
                          Precio: {" "}
                          <span className="text-primeColor font-semibold">
                            $ {item.precio.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-6 mb-6 lg:mt-0 items-center pr-6 cursor-pointer relative">
            {/* <div onClick={() => setShowUser(!showUser)} className="flex">
              <FaUser />
              <FaCaretDown />
            </div> */}
            {/* {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-0 z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
              >
                <Link to="/signin">
                  <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                    Login
                  </li>
                </Link>
                <Link onClick={() => setShowUser(false)} to="/signup">
                  <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                    Sign Up
                  </li>
                </Link>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Profile
                </li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400  hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Others
                </li>
              </motion.ul>
            )} */}
            <Link to="/cart">
              <div className="relative top-1 mb-1">
                <FaShoppingCart />
                <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                  {products.length > 0 ? products.length : 0}
                </span>
              </div>
            </Link>
            {/* <BsSuitHeartFill /> */}
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
