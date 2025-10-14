
import HeroCarousel from '../compoBig/Carousel'
import BestSellerFlex from '../compoBig/BestSeller'
import ShopByCategory from '../compoBig/ShopbyCategory'
// import OnSale from '../component/Onsale'
import ProductsSection from '../compoBig/ProductsSection'

const HomePage = () => {
  return (
    <div>
        <HeroCarousel />
        <BestSellerFlex />
        <ShopByCategory />
        <ProductsSection/>
    </div>
  )
}

export default HomePage