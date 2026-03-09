import app from "./app.js";
import { connectDB } from "./database.js";
import { createAdminUser } from "./libs/createUser.js";
import whatsapp, { startWhatsApp } from "../src/libs/whatsapp.js";

async function main() {
  await connectDB();
   
 // tst produccion ya anda todo test de carpeta imagenes 
  try {
    //await startWhatsApp();
    console.log('WhatsApp client started');
  } catch (err) {
    console.warn('WhatsApp client failed to start (continuing):', err.message || err);
  }

  app.listen(app.get("port")); 

  console.log("Server on port", app.get("port"));

}

main();
