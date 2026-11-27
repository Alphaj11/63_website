import { lazy, Suspense } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { CartProvider } from './hooks/useCart';
import { CustomizerProvider } from './hooks/useCustomizer';
import { useRoute } from './hooks/useRoute';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Cart, MobileCartBar } from './components/Cart';
import { DemoBanner } from './components/ui/DemoBadge';
import Home from './pages/Home';

// Découpage du code : ces écrans ne sont chargés qu'à la demande.
const ProductCustomizer = lazy(() => import('./components/ProductCustomizer').then((m) => ({ default: m.ProductCustomizer })));
const Checkout = lazy(() => import('./components/Checkout').then((m) => ({ default: m.Checkout })));
const OrderStatus = lazy(() => import('./components/OrderStatus').then((m) => ({ default: m.OrderStatus })));
const RestaurantSpace = lazy(() => import('./components/admin/RestaurantSpace').then((m) => ({ default: m.RestaurantSpace })));

export default function App() {
  const route = useRoute();
  const key = route.page === 'order' ? `order-${route.id}` : route.page;

  if (route.page === 'restaurant') {
    return (
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen bg-night">
          <DemoBanner />
          <Suspense fallback={<div className="min-h-screen" />}>
            <RestaurantSpace />
          </Suspense>
        </div>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <CustomizerProvider>
          <a href="#main" className="sr-only z-[80] rounded-full bg-ember px-4 py-2 text-night focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
            Aller au contenu
          </a>
          <div className="grain min-h-screen">
            <DemoBanner />
            <Header />
            <AnimatePresence mode="wait">
              <motion.main id="main" key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <Suspense fallback={<div className="min-h-[70vh]" />}>
                  {route.page === 'home' && <Home />}
                  {route.page === 'checkout' && <Checkout />}
                  {route.page === 'order' && <OrderStatus id={route.id} />}
                </Suspense>
              </motion.main>
            </AnimatePresence>
            <Footer />
            <Cart />
            <MobileCartBar />
            <Suspense fallback={null}>
              <ProductCustomizer />
            </Suspense>
          </div>
        </CustomizerProvider>
      </CartProvider>
    </MotionConfig>
  );
}
