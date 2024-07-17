import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';


import FooterTC from "./components/FooterTC";
import FooterBottomTC from "./components/FooterBottomTC";
import HeaderTC from "./components/HeaderTC";
import HeaderBottomTC from "./components/HeaderBottomTC";
import SpecialCaseTC from "./components/SpecialCaseTC";
// import About from "./pages/About/About";
// import SignIn from "./pages/Account/SignIn";
// import SignUp from "./pages/Account/SignUp";
// import Cart from "./pages/Cart/Cart";
// import Contact from "./pages/Contact/Contact";
// import Home from "./pages/Home/Home";
// import Journal from "./pages/Journal/Journal";
// import Offer from "./pages/Offer/Offer";
// import Payment from "./pages/payment/Payment";
// import ProductDetails from "./pages/ProductDetails/ProductDetails";
// import Shop from "./pages/Shop/Shop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


//estilos
// import CssBaseline from '@mui/material/CssBaseline';
// import Container from '@mui/material/Container';

// context
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./routes";
import { MinisterioProvider } from "./context/ministerioContext";
import { UsuarioProvider } from "./context/usuarioContext";
import { ArticuloProvider } from "./context/articulosContext";

// vistas
import WelcomePage from "./pages/WelcomePage";
import  HomePage  from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import CartPage from './pages/CartPage';
// import RegisterPage from "./pages/RegisterPage";
// import { LoginPage } from "./pages/LoginPage";
// import { MinisterioPage } from "./pages/Ministerio/MinisterioPage";
// import { SolicitudPage } from "./pages/Solicitud/SolicitudPage";


const Layout = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <HeaderTC />
      <HeaderBottomTC />
      <SpecialCaseTC />
      {/* <ScrollRestoration /> */}
      <Outlet />
      <FooterTC />
      <FooterBottomTC />
    </div>
  );
};


// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route>
//       <Route path="/" element={<Layout />}>
//         {/* ==================== Header Navlink Start here =================== */}
//         <Route index element={<WelcomePage />}></Route>
//         {/* <Route path="/shop" element={<Shop />}></Route> */}
//         {/* <Route path="/about" element={<About />}></Route> */}
//         {/* <Route path="/contact" element={<Contact />}></Route> */}
//         {/* <Route path="/journal" element={<Journal />}></Route> */}
//         {/* ==================== Header Navlink End here ===================== */}
//         {/* <Route path="/category/:category" element={<Offer />}></Route>
//         <Route path="/product/:_id" element={<ProductDetails />}></Route>
//         <Route path="/cart" element={<Cart />}></Route>
//         <Route path="/paymentgateway" element={<Payment />}></Route> */}
//       </Route>
//       {/* <Route path="/signup" element={<SignUp />}></Route>
//       <Route path="/signin" element={<SignIn />}></Route> */}
//     </Route>
//   )
// );

// function App() {
//   return (
//     <div className="font-bodyFont">
//       <RouterProvider router={router} />
//     </div>
//   );
// }


function App() {
  return (
    <AuthProvider>
      <ArticuloProvider>
      <MinisterioProvider>
        <UsuarioProvider>
          <BrowserRouter>
            <main className="">
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index path="/home" element={<HomePage />}/>

                  <Route path="/welcome" element={<WelcomePage />} />

                  <Route path="/shop" element={<ShopPage />} />

                  <Route path="/cart" element={<CartPage />} />

                  
                  <Route element={<ProtectedRoute />}>
                    {/* <Route path="/solicitudes-reservas" element={<SolicitudPage />} /> */}
                  </Route>

                </Route>
              </Routes>
            </main>
          </BrowserRouter>
        </UsuarioProvider>
      </MinisterioProvider>
      </ArticuloProvider>
    </AuthProvider>
  );
}

export default App;
