import React, { useEffect, useState } from "react";
import { useArticulos } from "../../context/articulosContext";
import { FaSave } from "react-icons/fa";
import { toast } from "react-toastify";

const FamiliasDescuentosTable = () => {
    const { GetFamilias, UpdateDescuentoFamilia } = useArticulos();

    const [familias, setFamilias] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFamilias();
    }, []);

    const fetchFamilias = async () => {
        setLoading(true);
        try {
            const data = await GetFamilias();
            setFamilias(data);
        } catch {
            toast.error("Error al cargar familias");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActivo = (index) => {
        const copy = [...familias];
        copy[index].descuento.activo = !copy[index].descuento.activo;
        setFamilias(copy);
    };

    const handleChangePorcentaje = (index, value) => {
        const copy = [...familias];
        copy[index].descuento.porcentaje = Number(value);
        setFamilias(copy);
    };

    const handleGuardar = async (familia) => {
        try {
            const body = {
                _id: familia._id,
                activo: familia.descuento.activo,
                porcentaje: Number(familia.descuento.porcentaje)
            };

            await UpdateDescuentoFamilia(body);
            toast.success(`Descuento actualizado: ${familia.descripcion}`);
        } catch (error) {
            toast.error("Error al guardar descuento");
        }
    };

    if (loading) {
        return <p>Cargando familias...</p>;
    }

    return (
        <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Familia</th>
                        <th className="p-3 text-center">Activo</th>
                        <th className="p-3 text-center">Porcentaje (%)</th>
                        <th className="p-3 text-center">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {familias.map((familia, index) => (
                        <tr key={familia._id} className="border-t">
                            <td className="p-3 font-semibold">
                                {familia.descripcion}
                            </td>

                            <td className="p-3 text-center">
                                <input
                                    type="checkbox"
                                    checked={familia.descuento?.activo || false}
                                    onChange={() => handleToggleActivo(index)}
                                />
                            </td>

                            <td className="p-3 text-center">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    disabled={!familia.descuento?.activo}
                                    value={familia.descuento?.porcentaje || 0}
                                    onChange={(e) =>
                                        handleChangePorcentaje(index, e.target.value)
                                    }
                                    className="w-20 border px-2 py-1 text-center disabled:bg-gray-100"
                                />
                            </td>

                            <td className="p-3 text-center">
                                <button
                                    onClick={() => handleGuardar(familia)}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    <FaSave />
                                    Guardar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FamiliasDescuentosTable;
