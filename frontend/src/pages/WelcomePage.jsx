import { Link } from "react-router-dom";
import { useEffect, Fragment } from "react";
import { useMinisterio } from "../context/ministerioContext";


function WelcomePage() {

  const { ministerios, getMinisterios } = useMinisterio();

  useEffect(() => {
    getMinisterios();
  }, []);


  return (
    <>
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">PAGINA DE INICIO</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{/* Your content */}</div>
        </main>
      </div>
    </>
  );
}

export default WelcomePage;
