import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar"
import Footer from "./components/footer"
import { HomePage } from "./pages/Home"
import ProductsPage from "./pages/Products"
import ProductDetails from "./pages/Product-Detail"

function App() {
  return (
    <body className="max-w-[1800px] mx-auto">
      
      <Router>
        
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/products" element={<ProductsPage />}/>
          <Route path="/products/zip-tote-basket" element={<ProductDetails />}/>
        </Routes>

        <Footer />
      </Router>
    </body>
    )
}

export default App;
