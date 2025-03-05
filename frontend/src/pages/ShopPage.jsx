import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderBottomTC from "../components/HeaderBottomTC";
import BreadcrumbsTC from "../components/shop/BreadcrumbsTC";
import PaginationTC from "../components/shop/PaginationTC";
import ProductBannerTC from "../components/shop/ProductBannerTC";
import ShopSideNavTC from "../components/shop/ShopSideNavTC";
import { filterArticulos } from "../redux/orebiSlice";
import { useArticulos } from "../context/articulosContext";


const ShopPage = () => {

  const dispatch = useDispatch();

  const { articulos, loading, GetArticulosPorCategoria } = useArticulos();
  // const { familias, GetFamilias } = useArticulos();

  const checkedCategorys = useSelector(
    (state) => state.orebiReducer.checkedCategorys
  );

  const articulosShop = useSelector(
    (state) => state.orebiReducer.articulosShop
  );

  // const [articulosShopListadoRender, setArticulosShopistadoRender] = useState([]);
  // useEffect(() => {
  //   GetArticulosPorCategoria([], 0);
  //   dispatch(filterArticulos(articulos));
  // }, []);

  // useEffect(() => {
  //   GetArticulosPorCategoria(checkedCategorys, 0);
  //   dispatch(filterArticulos(articulos));
  // }, []);

  useEffect(() => {
    GetArticulosPorCategoria(checkedCategorys, 0);
  }, [checkedCategorys]); // Asegúrate de que este efecto se ejecute cuando cambien las categorías seleccionadas


  //probar que cosa no anda si  descomento esto
  // useEffect(() => {
  //   // Asegúrate de que 'articulos' esté disponible antes de despachar
  //   if (articulos && articulos.length > 0) {
  //     dispatch(filterArticulos(articulos));
  //   }
  // }, [articulos, dispatch]);



  // useEffect(() => {
  //   console.log("Artículos en articulosShop:", articulosShop);
  //   console.log("Artículos en articulos:", articulos);
  //   // setArticulosShopistadoRender(articulos);
  // }, [articulosShop]);


  // useEffect(() => {
  //   const fetchArticulos = async () => {
  //     const fetchedArticulos = await GetArticulosPorCategoria([], 0);
  //     dispatch(filterArticulos(fetchedArticulos)); // Despacha solo cuando los datos están disponibles
  //   };

  //   fetchArticulos();
  // }, [dispatch, GetArticulosPorCategoria]);


  const [itemsPerPage, setItemsPerPage] = useState(9);

  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  const handleClick = () => {
    // console.log('articulos');
    // console.log(articulos);
    // console.log('articulosShop');
    // console.log(articulosShop);
  }


  return (
    <>
      <HeaderBottomTC />
      <div className="max-w-container mx-auto px-4">
        <BreadcrumbsTC title="Tienda" />
        <div className="w-full h-full flex pb-20 gap-10">
          <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
            <ShopSideNavTC />
          </div>
          <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
            {/* <ProductBannerTC itemsPerPageFromBanner={itemsPerPageFromBanner} /> */}

            {/* {articulos && articulos.length > 0 ? (
            <PaginationTC itemsPerPage={itemsPerPage} articuloslista={articulos} />
          ) : (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-12 h-12 border-4 border-t-4 border-red-500 border-solid rounded-full"></div>
              <span className="text-gray-600 text-lg font-semibold text-6xl">Cargando...</span>
            </div>
          )} */}

            {loading ? (
              <div className="flex justify-center items-center space-x-2">
                <span className="text-gray-600 font-semibold text-5xl">
                  Cargando...
                </span>
              </div>
            ) : articulos && articulos.length > 0 ? (
              <PaginationTC itemsPerPage={itemsPerPage} articuloslista={articulos} />
            ) : (
              <div className="text-gray-600 text-lg font-semibold">
                No se encontraron artículos.
              </div>
            )}


          </div>
        </div>
      </div>
    </>

  );
};

export default ShopPage;
