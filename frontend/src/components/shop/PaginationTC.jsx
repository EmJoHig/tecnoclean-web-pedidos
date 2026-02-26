import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import ProductTC from "../../components/ProductTC";
import { useDispatch, useSelector } from "react-redux";
import { paginationItems } from "../../constants";
import imprimante1 from "../../assets/images/products/bestSeller/imprimante1.webp";
import { useArticulos } from "../../context/articulosContext";


const items = paginationItems;

function Items({ currentItems, selectedBrands, selectedCategories }) {

  // Filter items based on selected brands and categories

  // const filteredItems = currentItems.filter((item) => {
  //   const isBrandSelected =
  //     selectedBrands.length === 0 ||
  //     selectedBrands.some((brand) => brand.title === item.brand);

  //   const isCategorySelected =
  //     selectedCategories.length === 0 ||
  //     selectedCategories.some((category) => category.title === item.cat);

  //   return isBrandSelected && isCategorySelected;
  // });

  return (
    <>
      {/* filteredItems */}
      {currentItems.map((item) => (
        <div key={item._id} className="w-full">
          <ProductTC
            _id={item._id}
            imagen={item.imagen? item.imagen : ""}
            codigo={item.codigo}
            descripcion={item.descripcion}
            precio={item.precio}
            //color="Red"
            fracciones={item.fracciones ? item.fracciones : []}
            tienefragancia={item.tienefragancia ? item.tienefragancia : false}
            familiaObj={item.familiaArticulo ? item.familiaArticulo : null}
            colores={item.colores ? item.colores : []}
          />
        </div>
      ))}
    </>
  );
}

const PaginationTC = ({ itemsPerPage, articuloslista }) => {

  const { articulos, GetArticulosPorCategoria, offset, updateOffset, mostrarCargarMas } = useArticulos();

  const checkedCategorys = useSelector(
    (state) => state.orebiReducer.checkedCategorys
  );

  // const [offset, setOffset] = useState(10);
  const [loading, setLoading] = useState(false);

  
  const [mostrarCargarMasLocal, setMostrarCargarMasLocal] = useState(true);


  const [articulosListadoPaginado, setArticulosListadoPaginado] = useState(articulos);

  // const [itemOffset, setItemOffset] = useState(0);
  // const [itemStart, setItemStart] = useState(1);

  // const endOffset = itemOffset + itemsPerPage;
  // const currentItems = articuloslista.slice(itemOffset, endOffset);
  const selectedBrands = useSelector(
    (state) => state.orebiReducer.checkedBrands
  );
  const selectedCategories = useSelector(
    (state) => state.orebiReducer.checkedCategorys
  );

  useEffect(() => {
    if (offset == 0) {
      updateOffset(10);
    }
  }, [offset]);


  // const pageCount = Math.ceil(items.length / itemsPerPage);

  // const handlePageClick = (event) => {
  //   const newOffset = (event.selected * itemsPerPage) % items.length;
  //   const newStart = newOffset + 1; // Adjust the start index

  //   setItemOffset(newOffset);
  //   setItemStart(newStart);
  // };


  useEffect(() => {    

      if (mostrarCargarMas) {
        setMostrarCargarMasLocal(true);
      }else{
        setMostrarCargarMasLocal(false);
      }
  }, [mostrarCargarMas]);

  
  const handleCargarMas = async (event) => {

    // console.log("offset");
    // console.log(offset);

    setLoading(true);
    try {
      const newOffset = offset === 0 ? 10 : offset;

      const response = await GetArticulosPorCategoria(checkedCategorys, null, offset);

      if (response && response.length > 0) {
        updateOffset((prevOffset) => prevOffset + response.length);

        //setMostrarCargarMas(true);

        // updateOffset(offset + response.length);
        // setArticulosListadoPaginado((prevArticulos) => [
        //   ...prevArticulos,
        //   ...response,
        // ]);
        // setOffset((prevOffset) => prevOffset + response.length);
      } else {
        //setMostrarCargarMas(false);
      }

      // console.log("articulos luego de GetArticulosPorCategoria");
      // console.log(articulos);

      // articuloslista = (prevArticulos) => [...prevArticulos, ...response.data];

      // setOffset(offset + 10); // Aumenta el offset en 10 para la siguiente carga
    } catch (error) {
      console.error("Error cargando los artículos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10 justify-items-center">
        <Items
          currentItems={articulos}
          selectedBrands={selectedBrands}
          selectedCategories={selectedCategories}
        />{" "}
      </div>
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        {/* <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold font-titleFont py-10"
          activeClassName="bg-black text-white"
        /> */}

        {/* <p className="text-base font-normal text-lightText">
          Products from {itemStart} to {Math.min(endOffset, items.length)} of{" "}
          {items.length}
        </p> */}
        {/* <button onClick={() => console.log(selectedBrands)}> test</button> */}
      </div>


      {mostrarCargarMasLocal ? (
        <button
          onClick={handleCargarMas}
          disabled={loading}
          className="w-full mt-8 py-4 bg-[#16a34a] hover:bg-[#15803d] duration-300 text-white text-lg font-titleFont rounded"
        >
          CARGAR MAS
        </button>
      ) : null}

    </div>
  );
};

export default PaginationTC;
