// plus1-rewards/src/components/member/components/WelcomeSection.tsx
interface WelcomeSectionProps {
  name: string;
  phone: string;
  avatarUrl: string;
}

const BLUE = '#1a558b';

export default function WelcomeSection({ name, phone, avatarUrl }: WelcomeSectionProps) {
  return (
    <section className="flex flex-col md:flex-row gap-6 items-center animate-fade-in">
      <div 
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl size-24 md:size-32 shadow-lg" 
        data-alt="Modern geometric profile placeholder image" 
        style={{
          backgroundImage: `url("${avatarUrl}")`,
          border: `2px solid ${BLUE}40`
        }}
      ></div>
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-1" style={{ color: '#111827' }}>Welcome back, {name}</h1>
        <p className="font-medium text-lg tracking-wide" style={{ color: BLUE }}>{phone}</p>
      </div>
    </section>
  );
}
