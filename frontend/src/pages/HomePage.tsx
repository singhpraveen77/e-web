
import HeroCarousel from '../component/Carousel'
import BestSellerFlex from '../component/BestSeller'
import ShopByCategory from '../component/ShopbyCategory'
// import OnSale from '../component/Onsale'
import ProductsSection from '../component/ProductsSection'

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