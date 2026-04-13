import React, { useEffect, useState, useRef } from "react";
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

const ImageZoom = ({ src, alt }) => {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 4;
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const imgContainerRef = useRef(null);

  const openModal = () => {
    setOpen(true);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const closeModal = () => {
    setOpen(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setDragging(false);
  };

  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(z + delta).toFixed(2))));
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
    startRef.current = { x: clientX, y: clientY, ox: offset.x, oy: offset.y };
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
    const dx = clientX - startRef.current.x;
    const dy = clientY - startRef.current.y;
    setOffset({ x: startRef.current.ox + dx, y: startRef.current.oy + dy });
  };

  const onPointerUp = () => {
    setDragging(false);
  };

  // Attach non-passive native listeners for wheel and touch to allow preventDefault
  useEffect(() => {
    const el = imgContainerRef.current;
    if (!el) return;

    const wheelHandler = (e) => {
      e.preventDefault();
      onWheel(e);
    };

    const touchStartHandler = (e) => {
      onPointerDown(e);
    };

    const touchMoveHandler = (e) => {
      onPointerMove(e);
    };

    const touchEndHandler = (e) => {
      onPointerUp(e);
    };

    el.addEventListener('wheel', wheelHandler, { passive: false });
    el.addEventListener('touchstart', touchStartHandler, { passive: false });
    el.addEventListener('touchmove', touchMoveHandler, { passive: false });
    el.addEventListener('touchend', touchEndHandler, { passive: false });

    return () => {
      el.removeEventListener('wheel', wheelHandler);
      el.removeEventListener('touchstart', touchStartHandler);
      el.removeEventListener('touchmove', touchMoveHandler);
      el.removeEventListener('touchend', touchEndHandler);
    };
  }, [imgContainerRef, onWheel, onPointerDown, onPointerMove, onPointerUp]);

  return (
    <>
      <div className="relative overflow-hidden w-full h-full group">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
          onClick={openModal}
        />
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="relative max-w-full max-h-full w-full" style={{ maxWidth: 1200, maxHeight: '90vh' }}>
            <button
              onClick={closeModal}
              className="absolute right-2 top-2 z-50 text-white bg-black bg-opacity-50 rounded-full p-2"
            >
              ✕
            </button>

            <div
              ref={imgContainerRef}
              onMouseDown={onPointerDown}
              onMouseMove={onPointerMove}
              onMouseUp={onPointerUp}
              onMouseLeave={onPointerUp}
              className="w-full h-full flex items-center justify-center cursor-grab"
              style={{ touchAction: 'none' }}
            >
              <img
                src={src}
                alt={alt}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  transition: dragging ? 'none' : 'transform 150ms ease-out',
                  maxWidth: '100%',
                  maxHeight: '90vh',
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

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
            {/* Hardcoded test image to uploads/leviesp.jpg for zoom testing */}
            <ImageZoom
              src={`${API_URL}/uploads/images/leviesp.jpg`}
              alt={productInfo.nombre || "imagen"}
            />
            {/* original fallback removed for hardcoded testing */}
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
