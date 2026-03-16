// plus1-rewards/src/components/mobile/HeroSection.tsx
export default function HeroSection() {
  return (
    <section className="px-4 py-6">
      <div 
        className="relative rounded-xl overflow-hidden min-h-[400px] flex flex-col justify-end p-6 bg-cover bg-center" 
        data-alt="Vibrant local community market with people shopping" 
        style={{
          backgroundImage: "linear-gradient(to top, rgba(16, 34, 22, 0.95), rgba(16, 34, 22, 0.2)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsMkIY7LdWeKdI3jEu-u1IdhyJXk6fwyNZ3oPAQuK4mXq8V9xpNGz_ZNRRpydT7s486XqinfErDMqQSm_llcqhgV82MbDh1LvJp-PVgiKLYmkj7GDKYzkjp3hLrbKB9J8bTgzaXhXWOV6mxY_5j8sXUgt15g1HekbCnbYfo7vPZSUnJH5UsfULxITgmTQkLmFjMYN9cemmBsvuHQ7rAeH9RQSxc6WUjncwhdRkC7n_gSOPAO8V0FCg8RPubJHItbwHsBgLCfG1-74q')"
        }}
      >
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">Health for Everyone</span>
          <h1 className="text-4xl font-bold text-white leading-tight">Shop. Earn. Cover your health.</h1>
          <p className="text-slate-300 text-lg">Turn your everyday grocery shopping into comprehensive healthcare coverage.</p>
          <button className="w-full bg-primary text-background-dark py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform">Get Started Now</button>
        </div>
      </div>
    </section>
  );
}
