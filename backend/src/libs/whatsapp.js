import qrcode from 'qrcode-terminal'; // Importa el módulo completo como un objeto
import whatsappWeb from 'whatsapp-web.js'; // Importa el módulo completo como un objeto
import QRCode from 'qrcode';

const { Client, LocalAuth } = whatsappWeb; // Desestructura para obtener las clases necesarias
let qrData = '';
const whatsapp = new Client({
    puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    authStrategy: new LocalAuth()
  });

  let isAuthenticated = false;
  let isReady = false;
  let hasInit = false;
  let lastQr = null;
  let qrTimeout = null;

  whatsapp.on('qr', async qr => {
    // Ignore QR if already authenticated or ready
    if (isAuthenticated || isReady) return;

    // Avoid printing identical QR repeatedly
    if (qr && lastQr === qr) return;
    lastQr = qr;

    try {
      console.log('QR Code received');
      qrData = await QRCode.toDataURL(qr);
      console.log(`QR BASE64: ${qrData}`);
      qrcode.generate(qr, { small: true });
    } catch (e) {
      console.warn('Error generating QR output', e.message || e);
    }

    // Reset lastQr after 2 minutes to allow a new QR later if needed
    if (qrTimeout) clearTimeout(qrTimeout);
    qrTimeout = setTimeout(() => { lastQr = null; qrTimeout = null; }, 2 * 60 * 1000);
  });

whatsapp.on('ready', () => {
  isReady = true;
  console.log('Client is ready!');
});

whatsapp.on('error', (error) => {
  console.error('WhatsApp Client Error:', error);
});

whatsapp.on('authenticated', () => {
  isAuthenticated = true;
  console.log('WhatsApp authenticated successfully!');
});

export const startWhatsApp = () => {
  return new Promise((resolve, reject) => {
    try {
      if (hasInit) {
        if (isReady) return resolve(true);

        const readyHandler = () => {
          isReady = true;
          whatsapp.off('ready', readyHandler);
          resolve(true);
        };
        const errHandler = (err) => {
          whatsapp.off('error', errHandler);
          reject(err);
        };
        whatsapp.on('ready', readyHandler);
        whatsapp.on('error', errHandler);
        return;
      }

      hasInit = true;
      whatsapp.initialize();

      const readyHandler = () => {
        isReady = true;
        whatsapp.off('ready', readyHandler);
        resolve(true);
      };

      const errHandler = (err) => {
        whatsapp.off('error', errHandler);
        reject(err);
      };

      whatsapp.on('ready', readyHandler);
      whatsapp.on('error', errHandler);
    } catch (error) {
      reject(error);
    }
  });
};

export const waitForReady = async (timeout = 15000) => {
  if (isReady) return true;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('WhatsApp client not ready')), timeout);
    const onReady = () => {
      clearTimeout(timer);
      resolve(true);
    };
    whatsapp.once('ready', onReady);
  });
};

// whatsapp.on('loading_screen', (percent, message) => {
//   console.log(`Loading screen: ${percent}% - ${message}`);
// });

// whatsapp.on('change_state', (state) => {
//   console.log('Change state:', state);
// });


export default whatsapp;
