import { motion } from 'framer-motion';

export default function LoadingPage() {
  const logoVariants = {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 20 }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Mobile Layout */}
      <motion.div
        className="lg:hidden flex flex-col items-center justify-center gap-12 relative z-10 px-6"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit={{ opacity: 0, scale: 0.95 }}
      >
        {/* Top Logo - Plus1 Rewards */}
        <motion.div
          variants={logoVariants}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div variants={pulseVariants} animate="animate">
            <img 
              src="/logo.png" 
              alt="Plus1 Rewards" 
              className="w-auto object-contain drop-shadow-lg"
              style={{ height: '110px' }}
            />
          </motion.div>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          className="flex gap-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <div className="w-2 h-2 rounded-full bg-blue-600" />
        </motion.div>
      </motion.div>

      {/* Desktop Layout */}
      <motion.div
        className="hidden lg:flex items-center justify-center gap-32 relative z-10"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit={{ opacity: 0, scale: 0.95 }}
      >
        {/* Left Logo - Plus1 Rewards */}
        <motion.div
          variants={logoVariants}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div variants={pulseVariants} animate="animate">
            <img 
              src="/logo.png" 
              alt="Plus1 Rewards" 
              className="w-auto object-contain drop-shadow-2xl"
              style={{ height: '160px' }}
            />
          </motion.div>
        </motion.div>

        {/* Center loading indicator */}
        <motion.div
          className="flex flex-col items-center gap-6"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex gap-3">
            <motion.div
              className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
          <motion.p
            className="text-sm font-semibold text-gray-600 tracking-widest uppercase"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading
          </motion.p>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
