import whatsapp, { waitForReady } from '../libs/whatsapp.js';

const MP_ACCESS_TOKEN =
    process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;

const getFetch = async () => {
    if (typeof fetch === 'function') return fetch;
    try {
        const pkg = await import('node-fetch');
        return pkg.default || pkg;
    } catch {
        throw new Error('Fetch no disponible. Instale node-fetch o use Node>=18');
    }
};

const sanitizePhone = (raw) => {
    if (!raw) return null;
    return raw.toString().replace(/[^0-9]/g, '');
};

const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

// CREATE PREFERENCE
export const createPreference = async (req, res) => {
    try {
        if (!MP_ACCESS_TOKEN) {
            return res.status(500).json({
                res: false,
                error: 'MERCADOPAGO access token not configured',
            });
        }

        const { articulos = [], nombreUsuario, telefono, mailUsuario } = req.body;

        if (!Array.isArray(articulos) || articulos.length === 0) {
            return res.status(400).json({
                res: false,
                error: 'No items provided',
            });
        }

        const items = articulos.map((it) => ({
            title: it.name || it.descripcion || 'Producto',
            quantity: Number(it.quantity) > 0 ? Number(it.quantity) : 1,
            currency_id: 'ARS',
            unit_price: Number(it.unit_price ?? it.precio ?? it.price) || 0,
        }));

        const telefonoSan = sanitizePhone(telefono) || '';

        const FRONTEND_URL =
            process.env.FRONTEND_URL && process.env.FRONTEND_URL.trim()
                ? process.env.FRONTEND_URL.trim()
                : null;

        const MP_NOTIFICATION_URL =
            process.env.MP_NOTIFICATION_URL && process.env.MP_NOTIFICATION_URL.trim()
                ? process.env.MP_NOTIFICATION_URL.trim()
                : null;

        const MP_MODE = String(process.env.MP_MODE || 'test').toLowerCase();
        const isTestMode = MP_MODE === 'test';

        const preference = {
            items,
            external_reference: telefonoSan || undefined,

            statement_descriptor: "TECNOCLEAN",

            payment_methods: {
                excluded_payment_methods: [],
                excluded_payment_types: [],
                installments: 12
            }
        };
        // En TEST no mandamos payer para no mezclar comprador real con cuentas test.
        // En LIVE sí se puede mandar payer si viene email válido.
        if (!isTestMode && isValidEmail(mailUsuario)) {
            preference.payer = {
                email: String(mailUsuario).trim(),
            };

            if (nombreUsuario && typeof nombreUsuario === 'string' && nombreUsuario.trim()) {
                preference.payer.name = String(nombreUsuario).trim();
            }
        }

        if (FRONTEND_URL) {
            preference.back_urls = {
                success: `${FRONTEND_URL}/pago-exitoso`,
                failure: `${FRONTEND_URL}/pago-error`,
                pending: `${FRONTEND_URL}/pago-pendiente`,
            };

            const allowLocal =
                String(process.env.MP_ALLOW_AUTO_RETURN_LOCAL || '').toLowerCase() === 'true';

            const isSecureUrl = FRONTEND_URL.toLowerCase().startsWith('https://');
            const isLocalhost = /localhost|127\.0\.0\.1/.test(FRONTEND_URL);

            if (isSecureUrl || (isLocalhost && allowLocal)) {
                preference.auto_return = 'approved';
            }
        }

        if (MP_NOTIFICATION_URL) {
            preference.notification_url = MP_NOTIFICATION_URL;
        }

        console.log('MP_MODE:', MP_MODE);
        console.log('FRONTEND_URL:', FRONTEND_URL);
        console.log('MP_NOTIFICATION_URL:', MP_NOTIFICATION_URL);
        console.log('Preference sent to MP:', JSON.stringify(preference, null, 2));

        const _fetch = await getFetch();
        const mpRes = await _fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preference),
        });

        const mpBody = await mpRes.json();

        console.log('MP response status:', mpRes.status);
        console.log('MP response body:', JSON.stringify(mpBody, null, 2));
        console.log(
            'MP excluded_payment_methods:',
            JSON.stringify(mpBody.payment_methods?.excluded_payment_methods, null, 2)
        );
        console.log(
            'MP excluded_payment_types:',
            JSON.stringify(mpBody.payment_methods?.excluded_payment_types, null, 2)
        );

        if (!mpRes.ok) {
            return res.status(mpRes.status).json({
                res: false,
                mp_status: mpRes.status,
                mp_body: mpBody,
                error: 'MP create preference failed',
            });
        }

        const responseIsTest = isTestMode || Boolean(mpBody?.sandbox_init_point);

        return res.json({
            res: true,
            init_point: mpBody.init_point,
            sandbox_init_point: mpBody.sandbox_init_point,
            preference_id: mpBody.id,
            isTest: responseIsTest,
        });
    } catch (error) {
        console.error('createPreference error:', error);
        return res.status(500).json({
            res: false,
            error: error.message || 'Server error creating preference',
        });
    }
};

// TEST PREFERENCE
export const testPreference = async (req, res) => {
    try {
        if (!MP_ACCESS_TOKEN) {
            return res.status(500).json({
                res: false,
                error: 'MERCADOPAGO access token not configured',
            });
        }

        const preference = {
            items: [
                {
                    title: 'Producto test',
                    quantity: 1,
                    currency_id: 'ARS',
                    unit_price: 100,
                },
            ],
        };

        console.log('Test preference sent to MP:', JSON.stringify(preference, null, 2));

        const _fetch = await getFetch();
        const mpRes = await _fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preference),
        });

        const mpBody = await mpRes.json();

        console.log('MP testPreference status:', mpRes.status);
        console.log('MP testPreference body:', JSON.stringify(mpBody, null, 2));

        return res.status(mpRes.ok ? 200 : 500).json({
            ok: mpRes.ok,
            status: mpRes.status,
            body: mpBody,
        });
    } catch (error) {
        console.error('Error testPreference:', error);
        return res.status(500).json({
            res: false,
            error: error.message || error,
        });
    }
};



const processedPayments = new Set();

export const mpWebhook = async (req, res) => {
  try {
    // console.log('MP webhook query:', req.query);
    // console.log('MP webhook body:', JSON.stringify(req.body, null, 2));

    const topic = req.query?.topic || req.body?.type || '';
    const queryPaymentId = req.query?.id || req.query?.['data.id'];
    const bodyPaymentId = req.body?.data?.id || req.body?.id;

    // Solo procesar eventos de pago
    const isPaymentEvent =
      topic === 'payment' ||
      req.body?.type === 'payment' ||
      req.body?.action === 'payment.created' ||
      req.body?.action === 'payment.updated';

    if (!isPaymentEvent) {
      console.log('Webhook ignorado: no es evento de payment');
      return res.status(200).json({ received: true, skipped: 'not payment event' });
    }

    const paymentId = queryPaymentId || bodyPaymentId;

    if (!paymentId) {
      console.log('Webhook ignorado: paymentId vacío');
      return res.status(200).json({ received: true, skipped: 'no payment id' });
    }

    // console.log('MP webhook paymentId:', paymentId);

    // Evitar procesar dos veces el mismo pago en memoria
    if (processedPayments.has(String(paymentId))) {
      console.log('Pago ya procesado, se ignora repetido:', paymentId);
      return res.status(200).json({ received: true, skipped: 'duplicate payment' });
    }

    const _fetch = await getFetch();
    const mpRes = await _fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
    });

    const payment = await mpRes.json();

    console.log('MP payment fetch status:', mpRes.status);
    console.log('MP payment response:', JSON.stringify(payment, null, 2));

    if (!mpRes.ok) {
      console.warn('Mercado Pago payment lookup failed:', {
        status: mpRes.status,
        payment,
      });
      return res.status(200).json({ received: true, lookup_failed: true });
    }

    const rawStatus = payment.status;
    const status = typeof rawStatus === 'string' ? rawStatus.toLowerCase() : '';

    console.log('MP payment status:', payment.status);
    console.log('MP payment status_detail:', payment.status_detail);

    // Solo marcar como procesado cuando logramos leer un payment válido
    processedPayments.add(String(paymentId));

    if (status !== 'approved') {
      console.log('Pago no aprobado, no se envía WhatsApp');
      return res.status(200).json({ received: true, status });
    }

    const externalRef =
      payment.external_reference ||
      payment.preference?.external_reference ||
      payment.metadata?.telefono ||
      '';

    const phone = sanitizePhone(externalRef);

    // console.log('mi telefono es:', phone, 'con el externalRef:', externalRef);

    if (!phone) {
      console.warn('Pago aprobado pero sin teléfono válido en external_reference');
      return res.status(200).json({ received: true, approved: true, whatsapp_sent: false });
    }

    const monto = payment.transaction_amount || payment.amount || '';
    const receiptUrl =
      payment.receipt_url ||
      payment.transaction_details?.external_resource_url ||
      payment.point_of_interaction?.transaction_data?.ticket_url ||
      '';

    let mensaje = `*Comprobante de Pago*\nSu pago ha sido aprobado.`;
    if (monto) mensaje += `\nMonto: $ ${monto}`;
    if (receiptUrl) mensaje += `\nComprobante: ${receiptUrl}`;

    try {
    //   console.log('Esperando cliente WhatsApp listo...');
    //   await waitForReady(15000);

      if (!whatsapp) {
        throw new Error('Cliente WhatsApp no inicializado');
      }

      if (typeof whatsapp.getNumberId !== 'function') {
        throw new Error('getNumberId no está disponible en el cliente WhatsApp');
      }

      const numberId = await whatsapp.getNumberId(phone);

      if (!numberId || !numberId._serialized) {
        console.warn('El número no existe en WhatsApp o no pudo resolverse:', phone);
        return res.status(200).json({
          received: true,
          approved: true,
          whatsapp_sent: false,
          reason: 'number_not_found_on_whatsapp',
        });
      }

    //   console.log('Número resuelto en WhatsApp:', numberId._serialized);

    //   await whatsapp.sendMessage(numberId._serialized, mensaje);
    //   console.log('Comprobante enviado por WhatsApp a', numberId._serialized);
    } catch (err) {
      console.warn('No se pudo enviar WhatsApp:', err?.message || err);
      console.warn('Detalle completo error WhatsApp:', err);
    }

    return res.status(200).json({ received: true, approved: true });
  } catch (error) {
    console.error('Error en webhook MP:', error);
    return res.status(200).json({
      received: true,
      error: error.message || error,
    });
  }
};


export const tokenInfo = async (req, res) => {
    try {
        if (!MP_ACCESS_TOKEN) {
            return res.status(200).json({
                configured: false,
                message: 'MP access token not configured',
            });
        }

        const MP_MODE = String(process.env.MP_MODE || 'test').toLowerCase();

        return res.status(200).json({
            configured: true,
            mode: MP_MODE,
            tokenPreview: `${MP_ACCESS_TOKEN.slice(0, 8)}...`,
        });
    } catch (err) {
        console.error('tokenInfo error', err);
        return res.status(500).json({
            configured: false,
            error: err.message || err,
        });
    }
};

export default { createPreference, testPreference, mpWebhook, tokenInfo };