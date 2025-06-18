import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Cart from "./pages/Cart"
import ProductDetail from "./pages/ProductDetail"
import Coins from "./pages/Coins"
import Orders from "./pages/Orders"
import ReviewSubmitted from "./components/ReviewSubmitted"
import Addreview from "./pages/Addreview"
import ShopCoins from "./pages/shopcoins"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/shopcoins" element={<ShopCoins/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/my-cart" element={<Cart/>}></Route>
        <Route path="/product/:id" element={<ProductDetail/>}></Route>
        <Route path="/mycoins" element={<Coins></Coins>}></Route>
        <Route path="/orders" element={<Orders></Orders>}></Route>
        <Route path="/addreview/:id" element={<Addreview></Addreview>}></Route>
        <Route path="/review-submitted" element={<ReviewSubmitted></ReviewSubmitted>}></Route>
      </Routes>
    </div>
  )
}

export default App