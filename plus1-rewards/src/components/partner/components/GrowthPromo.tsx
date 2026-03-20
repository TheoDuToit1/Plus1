// src/components/shop/components/GrowthPromo.tsx
export default function GrowthPromo() {
  const handleViewMarketingTips = () => {
    alert('Marketing Tips:\n\n1. Display your QR code prominently at checkout\n2. Encourage customers to scan for instant rewards\n3. Highlight the rewards rate\n4. Create loyalty through consistent rewards\n5. Use email to remind customers about their balance');
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#1a558b] to-[#2d7ab8] p-6 text-white flex flex-col gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined font-bold text-3xl">rocket_launch</span>
        <h4 className="font-black text-xl leading-tight">Grow your business with Rewards</h4>
      </div>
      <p className="text-sm font-medium opacity-90">Did you know? Customers are 3x more likely to return when they earn points for every purchase.</p>
      <button
        onClick={handleViewMarketingTips}
        className="mt-2 w-fit px-4 py-2 bg-white text-[#1a558b] rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
        title="View marketing tips and best practices"
      >
        View Marketing Tips
      </button>
    </div>
  );
}
