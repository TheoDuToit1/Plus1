import React from 'react';
import { X, Plus, Minus, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  is_available: boolean;
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToBasket: () => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToBasket,
  quantity,
  onQuantityChange
}: ProductDetailModalProps) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // Generate carousel images
  const carouselImages = product?.image_url ? [product.image_url] : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-[2rem] overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-primary transition-colors shadow-lg"
            >
              <X size={20} />
            </button>

            {/* Product Image */}
            {product.image_url && carouselImages.length > 0 && (
              <div className="relative h-80 w-full overflow-hidden bg-slate-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    src={carouselImages[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Like Button */}
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`absolute top-6 left-6 h-12 w-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
                    isLiked
                      ? 'bg-red-500/90 border-red-400 text-white'
                      : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                  }`}
                >
                  <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-black tracking-tight mb-2">{product.name}</h1>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                      {product.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black tracking-tighter text-primary">
                      R{(product.price / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Description
                </h3>
                <p className="text-base leading-relaxed text-slate-600 font-medium">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Quantity
                </h3>
                <div className="flex items-center gap-4 bg-slate-50 rounded-[1.5rem] p-2 border border-slate-100 w-fit">
                  <button
                    onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-slate-400 hover:text-primary transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-lg font-black w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => onQuantityChange(quantity + 1)}
                    className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-slate-400 hover:text-secondary transition-colors shadow-sm"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 bg-slate-100 text-primary rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => {
                    onAddToBasket();
                    onClose();
                  }}
                  className="flex-1 py-4 bg-primary text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:opacity-90 transition-opacity shadow-xl"
                >
                  Add to Basket
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
