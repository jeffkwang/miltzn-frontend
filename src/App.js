import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar"
import Footer from "./components/footer"
import { HomePage } from "./pages/Home"
import ProductsPage from "./pages/Products"
import ProductDetailPage from "./pages/Product-Detail"
import { LoginPage } from "./pages/Login"
import { AccountPage } from "./pages/Account"
import { AboutPage } from "./pages/About"
import { ContactPage } from "./pages/Contact"

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
          <Route path="/products/:category/:name" element={<ProductDetailPage />}/>
          <Route path="/products/:category/" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/account" element={<AccountPage />}/>
          <Route path="/about" element={<AboutPage />}/>
          <Route path="/contact" element={<ContactPage />}/>
        </Routes>

        {window.location.pathname !== '/login' && window.location.pathname !== '/signup' && (
        <Footer />
        )}

      </Router>
    </body>
    )
}

export default App;
