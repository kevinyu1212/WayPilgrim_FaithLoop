import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import AuthTrigger  from './components/AuthTrigger';
export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-white font-sans">
      <HeroSection />
      <IntroSection />
      <AuthTrigger />
    </main>
  );
}
