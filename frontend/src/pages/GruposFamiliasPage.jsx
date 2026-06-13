import React, { useEffect, useMemo, useState } from "react";
import HeaderBottomTC from "../components/HeaderBottomTC";
import { useArticulos } from "../context/articulosContext";
import { toast } from "react-toastify";

const SIN_GRUPO_LABEL = "Sin grupo";

const GruposFamiliasPage = () => {
  const {
    GetFamilias,
    GetGruposFamilias,
    CreateGrupoFamilia,
    UpdateGrupoFamilia,
    DeleteGrupoFamilia,
    CreateFamilia,
    UpdateFamilia,
    DeleteFamilia,
  } = useArticulos();

  const [familias, setFamilias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevoGrupo, setNuevoGrupo] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("TODOS");
  const [busqueda, setBusqueda] = useState("");
  const [editGrupoId, setEditGrupoId] = useState(null);
  const [editDescripcion, setEditDescripcion] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState("grupos");
  const [familiaModalOpen, setFamiliaModalOpen] = useState(false);
  const [familiaEditando, setFamiliaEditando] = useState(null);
  const [familiaForm, setFamiliaForm] = useState({
    codigo: "",
    descripcion: "",
    grupoId: "",
  });
  const [savingFamilia, setSavingFamilia] = useState(false);
  const [deletingFamiliaId, setDeletingFamiliaId] = useState(null);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [familiasData, gruposData] = await Promise.all([
        GetFamilias(),
        GetGruposFamilias(),
      ]);

      let gruposList = Array.isArray(gruposData) ? gruposData : [];
      const tieneSinGrupo = gruposList.some(
        (grupo) =>
          grupo.descripcion?.trim().toLowerCase() ===
          SIN_GRUPO_LABEL.toLowerCase()
      );

      if (!tieneSinGrupo) {
        const creado = await CreateGrupoFamilia(SIN_GRUPO_LABEL);
        if (creado) {
          gruposList = [...gruposList, creado];
        }
      }

      gruposList.sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion, "es", { sensitivity: "base" })
      );

      const familiasOrdenadas = Array.isArray(familiasData)
        ? [...familiasData].sort((a, b) =>
            a.descripcion.localeCompare(b.descripcion, "es", {
              sensitivity: "base",
            })
          )
        : [];

      setGrupos(gruposList);
      setFamilias(familiasOrdenadas);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar grupos o familias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    cargarDatos();
  }, []);

  const familiasFiltradas = useMemo(() => {
    const filtro = busqueda.trim().toLowerCase();

    return familias.filter((familia) => {
      const coincideBusqueda = filtro
        ? familia.descripcion.toLowerCase().includes(filtro)
        : true;

      const grupoId = familia.grupoId?._id || "";
      const coincideGrupo =
        filtroGrupo === "TODOS" ? true : grupoId === filtroGrupo;

      return coincideBusqueda && coincideGrupo;
    });
  }, [familias, busqueda, filtroGrupo]);

  const sinGrupo = useMemo(() => {
    return grupos.find(
      (grupo) =>
        grupo.descripcion?.trim().toLowerCase() ===
        SIN_GRUPO_LABEL.toLowerCase()
    );
  }, [grupos]);

  const handleCrearGrupo = async () => {
    const descripcion = nuevoGrupo.trim();
    if (!descripcion) {
      toast.warning("Ingrese un nombre de grupo");
      return;
    }

    try {
      const creado = await CreateGrupoFamilia(descripcion);
      if (creado) {
        const existe = grupos.some((grupo) => grupo._id === creado._id);
        if (!existe) {
          setGrupos((prev) =>
            [...prev, creado].sort((a, b) =>
              a.descripcion.localeCompare(b.descripcion, "es", {
                sensitivity: "base",
              })
            )
          );
        }
        setNuevoGrupo("");
        toast.success("Grupo creado");
      }
    } catch (error) {
      console.error(error);
      toast.error("No se pudo crear el grupo");
    }
  };

  const handleEditarGrupo = (grupo) => {
    setEditGrupoId(grupo._id);
    setEditDescripcion(grupo.descripcion || "");
  };

  const handleCancelarEdicion = () => {
    setEditGrupoId(null);
    setEditDescripcion("");
  };

  const handleGuardarGrupo = async (grupoId) => {
    const descripcion = editDescripcion.trim();
    if (!descripcion) {
      toast.warning("Ingrese un nombre de grupo");
      return;
    }

    try {
      const actualizado = await UpdateGrupoFamilia(grupoId, descripcion);

      setGrupos((prev) =>
        [...prev]
          .map((grupo) => (grupo._id === actualizado._id ? actualizado : grupo))
          .sort((a, b) =>
            a.descripcion.localeCompare(b.descripcion, "es", {
              sensitivity: "base",
            })
          )
      );

      setFamilias((prev) =>
        prev.map((familia) =>
          familia.grupoId?._id === actualizado._id
            ? { ...familia, grupoId: actualizado }
            : familia
        )
      );

      handleCancelarEdicion();
      toast.success("Grupo actualizado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el grupo");
    }
  };

  const handleEliminarGrupo = async (grupo) => {
    if (!grupo?._id) return;
    const confirmado = window.confirm(
      `Eliminar el grupo "${grupo.descripcion}"? Las familias pasaran a "${SIN_GRUPO_LABEL}".`
    );
    if (!confirmado) return;

    try {
      setDeletingId(grupo._id);
      await DeleteGrupoFamilia(grupo._id);

      setGrupos((prev) =>
        prev.filter((item) => item._id !== grupo._id)
      );

      setFamilias((prev) =>
        prev.map((familia) =>
          familia.grupoId?._id === grupo._id
            ? { ...familia, grupoId: sinGrupo || familia.grupoId }
            : familia
        )
      );

      if (filtroGrupo === grupo._id) {
        setFiltroGrupo("TODOS");
      }

      if (editGrupoId === grupo._id) {
        handleCancelarEdicion();
      }

      toast.success("Grupo eliminado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar el grupo");
    } finally {
      setDeletingId(null);
    }
  };

  const abrirModalNuevaFamilia = () => {
    setFamiliaEditando(null);
    setFamiliaForm({
      codigo: "",
      descripcion: "",
      grupoId: sinGrupo?._id || grupos[0]?._id || "",
    });
    setFamiliaModalOpen(true);
  };

  const abrirModalEditarFamilia = (familia) => {
    setFamiliaEditando(familia);
    setFamiliaForm({
      codigo: familia.codigo || "",
      descripcion: familia.descripcion || "",
      grupoId: familia.grupoId?._id || sinGrupo?._id || grupos[0]?._id || "",
    });
    setFamiliaModalOpen(true);
  };

  const cerrarModalFamilia = () => {
    setFamiliaModalOpen(false);
    setFamiliaEditando(null);
    setFamiliaForm({ codigo: "", descripcion: "", grupoId: "" });
  };

  const handleFamiliaFormChange = (event) => {
    const { name, value } = event.target;
    setFamiliaForm((prev) => ({ ...prev, [name]: value }));
  };

  const ordenarFamilias = (listado) =>
    [...listado].sort((a, b) =>
      a.descripcion.localeCompare(b.descripcion, "es", { sensitivity: "base" })
    );

  const handleGuardarFamilia = async (event) => {
    event.preventDefault();

    const payload = {
      codigo: familiaForm.codigo.trim(),
      descripcion: familiaForm.descripcion.trim(),
      grupoId: familiaForm.grupoId,
    };

    if (!payload.codigo || !payload.descripcion || !payload.grupoId) {
      toast.warning("Complete codigo, familia y grupo");
      return;
    }

    try {
      setSavingFamilia(true);
      const guardada = familiaEditando
        ? await UpdateFamilia(familiaEditando._id, payload)
        : await CreateFamilia(payload);

      setFamilias((prev) => {
        const existe = prev.some((familia) => familia._id === guardada._id);
        const next = existe
          ? prev.map((familia) =>
              familia._id === guardada._id ? guardada : familia
            )
          : [...prev, guardada];

        return ordenarFamilias(next);
      });

      toast.success(familiaEditando ? "Familia actualizada" : "Familia creada");
      cerrarModalFamilia();
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.message || "No se pudo guardar la familia";
      toast.error(message);
    } finally {
      setSavingFamilia(false);
    }
  };

  const handleEliminarFamilia = async (familia) => {
    if (!familia?._id) return;

    const confirmado = window.confirm(
      `Eliminar la familia "${familia.descripcion}"?`
    );
    if (!confirmado) return;

    try {
      setDeletingFamiliaId(familia._id);
      await DeleteFamilia(familia._id);
      setFamilias((prev) => prev.filter((item) => item._id !== familia._id));
      toast.success("Familia eliminada");
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.message || "No se pudo eliminar la familia";
      toast.error(message);
    } finally {
      setDeletingFamiliaId(null);
    }
  };

  return (
    <>
      <HeaderBottomTC />
      <div className="max-w-container mx-auto px-4">
        <div className="flex flex-col gap-2 py-6">
          <h1 className="text-2xl font-bold">Gestion de grupos de familias</h1>
          <p className="text-sm text-gray-600">
            Las familias en "{SIN_GRUPO_LABEL}" no aparecen en los filtros de la
            tienda.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("grupos")}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                activeTab === "grupos"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              ABM de grupos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("familias")}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                activeTab === "familias"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Gestion de familias
            </button>
          </div>
          {activeTab === "grupos" ? (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Crear nuevo grupo
              </label>
              <div className="flex gap-2 flex-col sm:flex-row">
                <input
                  type="text"
                  value={nuevoGrupo}
                  onChange={(event) => setNuevoGrupo(event.target.value)}
                  placeholder="Nombre del grupo"
                  className="border rounded-lg px-3 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <button
                  onClick={handleCrearGrupo}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"
                >
                  Crear grupo
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Filtrar por grupo
                  </label>
                  <select
                    value={filtroGrupo}
                    onChange={(event) => setFiltroGrupo(event.target.value)}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="TODOS">Todos</option>
                    {grupos.map((grupo) => (
                      <option key={grupo._id} value={grupo._id}>
                        {grupo.descripcion}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Buscar familia
                  </label>
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(event) => setBusqueda(event.target.value)}
                    placeholder="Ej: Limpieza"
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={abrirModalNuevaFamilia}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"
              >
                Nueva familia
              </button>
            </div>
          )}

          {loading ? (
            <div className="py-10 text-center text-gray-600">Cargando...</div>
          ) : activeTab === "grupos" ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left p-3">Grupo</th>
                    <th className="text-right p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {grupos.length === 0 ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="text-center p-6 text-gray-500"
                      >
                        No hay grupos para mostrar.
                      </td>
                    </tr>
                  ) : (
                    grupos.map((grupo) => {
                      const isSinGrupo =
                        grupo.descripcion?.trim().toLowerCase() ===
                        SIN_GRUPO_LABEL.toLowerCase();
                      const isEditing = editGrupoId === grupo._id;

                      return (
                        <tr key={grupo._id} className="border-t">
                          <td className="p-3 font-medium text-gray-800">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editDescripcion}
                                onChange={(event) =>
                                  setEditDescripcion(event.target.value)
                                }
                                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-slate-400"
                              />
                            ) : (
                              grupo.descripcion
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {isEditing ? (
                              <div className="flex flex-wrap gap-2 justify-end">
                                <button
                                  onClick={() => handleGuardarGrupo(grupo._id)}
                                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                                >
                                  Guardar
                                </button>
                                <button
                                  onClick={handleCancelarEdicion}
                                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2 justify-end">
                                <button
                                  onClick={() => handleEditarGrupo(grupo)}
                                  disabled={isSinGrupo}
                                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleEliminarGrupo(grupo)}
                                  disabled={isSinGrupo || deletingId === grupo._id}
                                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                >
                                  {deletingId === grupo._id
                                    ? "Eliminando..."
                                    : "Eliminar"}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left p-3">Codigo</th>
                    <th className="text-left p-3">Familia</th>
                    <th className="text-left p-3">Grupo</th>
                    <th className="text-right p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {familiasFiltradas.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center p-6 text-gray-500"
                      >
                        No hay familias para mostrar.
                      </td>
                    </tr>
                  ) : (
                    familiasFiltradas.map((familia) => (
                      <tr key={familia._id} className="border-t">
                        <td className="p-3 text-gray-700">
                          {familia.codigo || "-"}
                        </td>
                        <td className="p-3 font-medium text-gray-800">
                          {familia.descripcion}
                        </td>
                        <td className="p-3">
                          {familia.grupoId?.descripcion || "-"}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => abrirModalEditarFamilia(familia)}
                              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEliminarFamilia(familia)}
                              disabled={deletingFamiliaId === familia._id}
                              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                              {deletingFamiliaId === familia._id
                                ? "Eliminando..."
                                : "Eliminar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {familiaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {familiaEditando ? "Editar familia" : "Nueva familia"}
                </h2>
                <p className="text-sm text-gray-600">
                  El grupo se modifica desde este formulario.
                </p>
              </div>
              <button
                type="button"
                onClick={cerrarModalFamilia}
                className="rounded-lg border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleGuardarFamilia} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Codigo
                </label>
                <input
                  type="text"
                  name="codigo"
                  value={familiaForm.codigo}
                  onChange={handleFamiliaFormChange}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Ej: LIMPIEZA"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Familia
                </label>
                <input
                  type="text"
                  name="descripcion"
                  value={familiaForm.descripcion}
                  onChange={handleFamiliaFormChange}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Nombre de la familia"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Grupo
                </label>
                <select
                  name="grupoId"
                  value={familiaForm.grupoId}
                  onChange={handleFamiliaFormChange}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="">Seleccionar grupo</option>
                  {grupos.map((grupo) => (
                    <option key={grupo._id} value={grupo._id}>
                      {grupo.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cerrarModalFamilia}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingFamilia}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition"
                >
                  {savingFamilia ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GruposFamiliasPage;
