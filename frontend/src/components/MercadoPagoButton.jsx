import React, { useState } from 'react';
import { toast } from 'react-toastify';
import mpService from '../api/mercadopago';

const MercadoPagoButton = ({ carrito, nombreUsuario, telefono, mailUsuario }) => {
  const [loading, setLoading] = useState(false);

  const handlePagar = async () => {
    try {
      setLoading(true);

      const payload = {
        articulos: carrito,
        nombreUsuario,
        telefono,
        mailUsuario, // en test el backend lo ignora
      };

      const data = await mpService.createPreference(payload);

      if (!data?.res) {
        toast.error('No se pudo crear la preferencia de pago.');
        return;
      }

      const checkoutUrl =
        data.isTest && data.sandbox_init_point
          ? data.sandbox_init_point
          : data.init_point;

      if (!checkoutUrl) {
        toast.error('Mercado Pago no devolvió una URL de checkout válida.');
        return;
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error al iniciar pago con Mercado Pago:', error);
      toast.error('Error al iniciar el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePagar}
      disabled={loading || !carrito?.length}
      className="w-52 h-10 bg-blue-600 text-white hover:bg-blue-700 duration-300 rounded disabled:opacity-50"
    >
      {loading ? 'CARGANDO...' : 'PAGAR CON MP'}
    </button>
  );
};

export default MercadoPagoButton;