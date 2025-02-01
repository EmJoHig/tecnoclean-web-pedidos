import qrcode from 'qrcode-terminal'; // Importa el módulo completo como un objeto
import whatsappWeb from 'whatsapp-web.js'; // Importa el módulo completo como un objeto

const { Client, LocalAuth } = whatsappWeb; // Desestructura para obtener las clases necesarias

const whatsapp = new Client({
    puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    authStrategy: new LocalAuth()
  });

whatsapp.on('qr', qr => {
  console.log('QR Code received');
    qrcode.generate(qr, {
        small: true
    });
  });

whatsapp.on('ready', () => {
  console.log('Client is ready!');
});

whatsapp.on('error', (error) => {
  console.error('WhatsApp Client Error:', error);
});

whatsapp.on('authenticated', () => {
  console.log('WhatsApp authenticated successfully!');
});

// whatsapp.on('loading_screen', (percent, message) => {
//   console.log(`Loading screen: ${percent}% - ${message}`);
// });

// whatsapp.on('change_state', (state) => {
//   console.log('Change state:', state);
// });


export default whatsapp;
