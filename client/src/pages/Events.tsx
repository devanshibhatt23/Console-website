import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import UpcomingEvents from '@/components/sections/UpcomingEvents';
import PreviousEvents from '@/components/sections/PreviousEvents';
import { Calendar } from 'lucide-react';

export default function Events() {
  return (
    <div className="bg-black min-h-screen text-foreground overflow-hidden selection:bg-primary/30 selection:text-white">
      <Navbar />

      <main className="pt-20">
        {/* Page Hero Header */}
        <section className="relative py-24 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden bg-black">
          {/* Decorative background gradients */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="container mx-auto px-6 relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-xs text-primary mb-8 hover:bg-white/10 transition-colors">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Community Calendar
            </div>
            
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 font-mono">
              Console <span className="text-gradient-fire">Events</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground font-mono leading-relaxed max-w-2xl mx-auto">
              Where concepts compile into reality. Connect, code, compete, and level up with fellow hackers in our hands-on workshops and hackathons.
            </p>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <UpcomingEvents />

        {/* Previous Events Section */}
        <PreviousEvents />
      </main>

      <Footer />
    </div>
  );
}
