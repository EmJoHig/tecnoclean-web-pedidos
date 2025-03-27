import app from "./app.js";
import { connectDB } from "./database.js";
import { createAdminUser } from "./libs/createUser.js";
import whatsapp from "../src/libs/whatsapp.js";

async function main() {
  await connectDB();
   
 // anda papaaaa ahora que onda?
  //await  whatsapp.initialize();

  
  app.listen(app.get("port")); 

  console.log("Server on port", app.get("port"));

}

main();
