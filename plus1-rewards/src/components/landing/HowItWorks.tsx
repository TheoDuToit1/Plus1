// plus1-rewards/src/components/landing/HowItWorks.tsx
import { IconBuildingStore, IconScan, IconShieldCheck } from "@tabler/icons-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <IconBuildingStore stroke={1.5} className="w-8 h-8 text-[#1a558b]" />,
      number: '01',
      title: 'Shop at partner stores',
      desc: 'Shop at +1 Rewards partner stores near you, from grocery stores and pharmacies to spaza shops and takeaways.',
    },
    {
      icon: <IconScan stroke={1.5} className="w-8 h-8 text-[#1a558b]" />,
      number: '02',
      title: 'Earn cashback on every purchase',
      desc: 'Use your cell phone number or scan your +1 Rewards code at checkout to earn cashback in rands.',
    },
    {
      icon: <IconShieldCheck stroke={1.5} className="w-8 h-8 text-white" />,
      number: '03',
      title: 'Your cover gets paid',
      desc: 'Your cashback adds up and goes toward your Day1Health medical cover until your monthly cover is paid.',
      highlight: true
    },
  ]

  return (
    <section className="py-24 px-6 lg:px-20 bg-white" id="how-it-works">
      <div className="max-w-[1800px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 bg-[#1a558b]/10 text-[#1a558b]">
            Simple Process
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">Earn Health Cover in 3 Simple Steps</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Shop local. Earn rands. Medical cover gets paid.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[2px] bg-gray-100 z-0" />

          {steps.map((step, i) => (
            <div key={i} className={`relative z-10 flex flex-col items-center text-center p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 ${step.highlight ? 'bg-[#1a558b] shadow-xl shadow-blue-900/20' : 'bg-gray-50 border border-gray-100'}`}>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm ${step.highlight ? 'bg-white/20 backdrop-blur-sm' : 'bg-white'}`}>
                {step.icon}
              </div>
              <div className={`text-sm font-black tracking-widest mb-3 ${step.highlight ? 'text-blue-200' : 'text-[#1a558b]'}`}>
                STEP {step.number}
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${step.highlight ? 'text-white' : 'text-gray-900'}`}>
                {step.title}
              </h3>
              <p className={`leading-relaxed ${step.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* The maths made simple */}
        <div className="mt-16 max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col md:flex-row">
          <div className="bg-[#16a34a] p-8 md:w-1/3 flex flex-col justify-center items-center text-center text-white">
            <span className="text-sm font-bold uppercase tracking-widest mb-2 opacity-90">The Maths Made Simple</span>
            <div className="text-4xl font-black">Proof in numbers</div>
          </div>
          <div className="bg-white p-8 md:w-2/3 flex items-center">
            <p className="text-gray-700 text-xl leading-relaxed font-medium">
              A tank of fuel, braai supplies, school snacks, a dentist visit, a takeaway, ice cream for the kids = your medical cover.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}