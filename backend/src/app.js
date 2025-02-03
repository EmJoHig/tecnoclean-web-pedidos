import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import methodOverride from "method-override";
import flash from "connect-flash";
import passport from "passport";
import morgan from "morgan";
import MongoStore from "connect-mongo";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import cors  from "cors";
import path from 'path';
import { MONGODB_URI, PORT } from "./config.js";

import indexRoutes from "./routes/index.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import userRoutes from "./routes/auth.routes.js";
import articulosRoutes from "./routes/articulos.routes.js";
import "./config/passport.js";


// const bodyParser = require("body-parser");
import bodyParser from "body-parser";



// Initializations
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));


// middlewares
const corsOptions = {
  origin: ["http://localhost:5173", "https://tecnoclean-web-pedidos-f-f2ffe.web.app"],
  credentials: true, // Habilitar el intercambio de cookies y otros datos de autenticación
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));



app.use(
  bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
  })
);

// for parsing multipart/form-data
// app.use(upload.array());
app.use(express.json());
// app.use(bodyParser.json());
// settings
app.set("port", PORT);
app.set("views", join(__dirname, "views"));

// config view engine
const hbs = exphbs.create({
  defaultLayout: "main",
  layoutsDir: join(app.get("views"), "layouts"),
  partialsDir: join(app.get("views"), "partials"),
  extname: ".hbs",
  helpers: { // para usar el carrito
    json: function(context) {
        return JSON.stringify(context);
    }
}
});
app.engine(".hbs", hbs.engine);
app.engine('handlebars', hbs.engine);
app.set("view engine", ".hbs");

// middlewares
// app.use(morgan("dev"));
// app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' }));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: false },
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// routes
app.use(indexRoutes);
app.use(userRoutes);
app.use(notesRoutes);
app.use(articulosRoutes);

// static files
app.use(express.static(join(__dirname, "public")));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/images', express.static(path.join(__dirname, '..', 'uploads', 'images')));


// app.get('/test-image', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'uploads', 'images', 'zenitsu3.jpg'));
// });

app.use((req, res) => {
  res.render("404");
});

export default app;
