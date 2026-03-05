import React, { useState, useEffect } from "react";
import { useArticulos } from "../context/articulosContext";
import HeaderBottomTC from "../components/HeaderBottomTC";
import { toast } from "react-toastify";
import { FaSave, FaCheckSquare, FaSquare } from "react-icons/fa";

const AsignacionGruposPage = () => {
    const { GetFamilias, GetGruposFamilias, AsignarGrupoAFamilias } = useArticulos();

    const [familias, setFamilias] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [selectedGrupoId, setSelectedGrupoId] = useState("");
    const [selectedFamilias, setSelectedFamilias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [familiasData, gruposData] = await Promise.all([
                GetFamilias(),
                GetGruposFamilias()
            ]);
            setFamilias(familiasData);
            setGrupos(gruposData);
        } catch (error) {
            toast.error("Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    // Al cambiar el grupo seleccionado, marcar las familias que ya pertenecen a ese grupo
    useEffect(() => {
        if (selectedGrupoId) {
            const familiasDelGrupo = familias
                .filter(f => f.grupoId?._id === selectedGrupoId || f.grupoId === selectedGrupoId)
                .map(f => f._id);
            setSelectedFamilias(familiasDelGrupo);
        } else {
            setSelectedFamilias([]);
        }
    }, [selectedGrupoId, familias]);

    const handleToggleFamilia = (familiaId) => {
        if (selectedFamilias.includes(familiaId)) {
            setSelectedFamilias(selectedFamilias.filter(id => id !== familiaId));
        } else {
            setSelectedFamilias([...selectedFamilias, familiaId]);
        }
    };

    const handleGuardar = async () => {
        if (!selectedGrupoId) {
            toast.warning("Por favor selecciona un grupo");
            return;
        }

        try {
            setLoading(true);
            await AsignarGrupoAFamilias(selectedGrupoId, selectedFamilias);
            toast.success("Asignación guardada con éxito");
            // Refrescar datos para ver los cambios reflejados (especialmente si hay familias que cambiaron de grupo)
            const familiasData = await GetFamilias();
            setFamilias(familiasData);
        } catch (error) {
            toast.error("Error al guardar la asignación");
        } finally {
            setLoading(false);
        }
    };

    const filteredFamilias = familias.filter(f =>
        f.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <HeaderBottomTC />
            <div className="max-w-container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6 text-primeColor">
                    Asignación de Familias a Grupos
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Panel Izquierdo: Selección de Grupo */}
                    <div className="bg-white p-6 rounded shadow-md h-fit">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Seleccionar Grupo de Familias
                        </label>
                        <select
                            value={selectedGrupoId}
                            onChange={(e) => setSelectedGrupoId(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-primeColor mb-4"
                        >
                            <option value="">-- Seleccione un grupo --</option>
                            {grupos.map(g => (
                                <option key={g._id} value={g._id}>
                                    {g.descripcion}
                                </option>
                            ))}
                        </select>

                        <div className="mt-6">
                            <button
                                onClick={handleGuardar}
                                disabled={loading || !selectedGrupoId}
                                className="w-full flex items-center justify-center gap-2 bg-primeColor text-white py-2 rounded-md hover:bg-black transition-colors disabled:bg-gray-400"
                            >
                                <FaSave /> Guardar Asignación
                            </button>
                        </div>
                    </div>

                    {/* Panel Derecho: Listado de Familias */}
                    <div className="md:col-span-2 bg-white p-6 rounded shadow-md">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <h2 className="text-lg font-semibold">Lista de Familias</h2>
                            <input
                                type="text"
                                placeholder="Buscar familia..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-1 outline-none focus:border-primeColor w-full md:w-64"
                            />
                        </div>

                        <div className="max-h-[600px] overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="p-3 text-left w-12">#</th>
                                        <th className="p-3 text-left">Descripción</th>
                                        <th className="p-3 text-left">Código</th>
                                        <th className="p-3 text-left">Grupo Actual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFamilias.map((f) => {
                                        const isChecked = selectedFamilias.includes(f._id);
                                        const currentGroupDesc = f.grupoId?.descripcion || "Sin grupo";

                                        return (
                                            <tr
                                                key={f._id}
                                                className={`border-b hover:bg-gray-50 cursor-pointer ${isChecked ? 'bg-blue-50' : ''}`}
                                                onClick={() => handleToggleFamilia(f._id)}
                                            >
                                                <td className="p-3 text-center">
                                                    {isChecked ? (
                                                        <FaCheckSquare className="text-primeColor text-xl" />
                                                    ) : (
                                                        <FaSquare className="text-gray-300 text-xl" />
                                                    )}
                                                </td>
                                                <td className="p-3 font-medium">{f.descripcion}</td>
                                                <td className="p-3 text-gray-600">{f.codigo}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${f.grupoId?._id === selectedGrupoId ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {currentGroupDesc}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredFamilias.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="p-4 text-center text-gray-500">
                                                No se encontraron familias
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-sm text-gray-500 flex justify-between">
                            <span>Total familias: {filteredFamilias.length}</span>
                            {selectedGrupoId && (
                                <span>Seleccionadas para este grupo: {selectedFamilias.length}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AsignacionGruposPage;
