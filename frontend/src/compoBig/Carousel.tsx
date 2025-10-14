import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const heroSlides = [
  {
    id: 1,
    title: "Premium Electronics",
    subtitle: "Latest gadgets at unbeatable prices",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop&crop=center",
    cta: "Shop Now"
  },
  {
    id: 2,
    title: "Fashion Collection",
    subtitle: "Trendy styles for every season",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=600&fit=crop&crop=center",
    cta: "Explore"
  },
  {
    id: 3,
    title: "Home & Living",
    subtitle: "Transform your space with our curated selection",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop&crop=center",
    cta: "Discover"
  }
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-scroll with pause on hover
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [current, isAutoPlaying]);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div 
        className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] max-h-[600px]"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroSlides[current].image})` }}
            >
              <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
            </div>

            {/* Content Overlay */}
            <div className="relative h-full flex items-center justify-center text-center px-4">
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="max-w-4xl mx-auto text-white"
              >
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                  {heroSlides[current].title}
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
                  {heroSlides[current].subtitle}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-base shadow-lg hover:shadow-xl"
                >
                  {heroSlides[current].cta}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 sm:left-6 -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-base"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 sm:right-6 -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-base"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-base ${
                current === index 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
