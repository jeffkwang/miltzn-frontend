import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar"
import Footer from "./components/footer"
import { HomePage } from "./pages/Home"
import ProductsPage from "./pages/Products"
import ProductDetails from "./pages/Product-Detail"
import { LoginPage } from "./pages/Login"
import { SignupPage } from "./pages/Signup"

function App() {

  return (
    <body className="max-w-[1800px] mx-auto">
      <Router>
        
        {window.location.pathname !== '/login' && window.location.pathname !== '/signup' && (
        <Navbar />
        )}
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/products" element={<ProductsPage />}/>
          <Route path="/products/:slug" element={<ProductDetails />}/>
          <Route path="/collections/:collection/*" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<SignupPage />}/>
        </Routes>

        {window.location.pathname !== '/login' && window.location.pathname !== '/signup' && (
        <Footer />
        )}

      </Router>
    </body>
    )
}

export default App;
