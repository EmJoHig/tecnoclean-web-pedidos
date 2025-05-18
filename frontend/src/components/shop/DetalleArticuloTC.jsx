import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BreadcrumbsTC from "../../components/shop/BreadcrumbsTC";;
import ProductInfoTC from "../../components/shop/ProductInfoTC";
import { FaDownload } from "react-icons/fa";
import { API_URL } from "../../config";


const tabs = [
  {
    id: "Fiche Technique",
    label: "Fiche Technique",
  },
  {
    id: "Description",
    label: "Description",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis.",
  },
  {
    id: "Video",
    label: "Video",
    content: (
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/watch?v=6e0yIRDVPlA&list=RD6e0yIRDVPlA&start_radio=1"
        title="YouTube Video"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    ),
  },
  // Add more tabs as needed
];

const DetalleArticuloTC = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState([]);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    //aca se setea el producto seleccionado
    setProductInfo(location.state.item);
    setPrevLocation(location.pathname);
  }, [location, productInfo.ficheTech]);

  // useEffect(() => {
  //   console.log("productInfo: ", productInfo);
  // }, [productInfo]);


  if (!productInfo) {
    return <div>Cargando...</div>; // Muestra un mensaje de carga mientras productInfo es null
  }

  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300 mb-9">
      <div className="max-w-container mx-auto px-4">
        <div className="mb-2">
          <BreadcrumbsTC title="Detalle" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          <div className="h-full xl:col-span-2">
            {/* <img
              className="w-full h-full "
              src={`http://localhost:4000${productInfo.img.replace(/ /g, "%20")}`}
              alt="imagen"
            /> */}
            {productInfo.imagen ? (
              <img
                className="w-full h-full"
                src={`${API_URL}${productInfo.imagen.replace(/ /g, "%20")}`}
                alt="imagen"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">no hay ung</p>
              </div>
            )}
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-4 xl:px-4 flex flex-col gap-6 justify-center">
            <ProductInfoTC productInfo={productInfo} />
          </div>
        </div>
        {/* <div>
          <div className=" space-x-4  pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                } py-2 px-4  focus:outline-none`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="my-4">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={activeTab === tab.id ? "" : "hidden"}
              >
                {tab.id === "Fiche Technique" && productInfo.ficheTech ? (
                  <div>
                    <table className="table-auto w-full">
                      <tbody>
                        {productInfo.ficheTech.map((row) => (
                          <tr key={row.label} className="bg-gray-100">
                            <td className="border px-4 py-2 font-semibold">
                              {row.label}
                            </td>
                            <td className="border px-4 py-2">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="my-4 flex justify-end">
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-500 hover:bg-blue-600 text-white font-bodyFont">
                        <FaDownload className="h-5 w-5 mr-2 text-white" />
                        <a
                          href={productInfo.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white"
                        >
                          Download PDF
                        </a>{" "}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>{tab.content}</p>
                )}
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DetalleArticuloTC;
