const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, producto }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          ⚠️ Confirmar eliminación
        </h2>

        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que querés eliminar el producto{" "}
          <span className="font-semibold text-gray-900">
            {producto?.descripcion}
          </span>
          ?
          <br />
          <span className="text-red-600 font-medium">
            Esta acción no se puede deshacer.
          </span>
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-lg
              bg-gray-200 text-gray-700
              hover:bg-gray-300
              transition
            "
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-lg
              bg-red-600 text-white
              hover:bg-red-700
              active:scale-95
              transition
            "
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
