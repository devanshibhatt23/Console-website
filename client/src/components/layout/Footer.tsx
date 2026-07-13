import { Terminal, Heart } from 'lucide-react';
import { FaDiscord, FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden">
                <img src="/console-logo.png" alt="Console Logo" className="w-full h-full object-cover" onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('bg-primary/20', 'border', 'border-primary/50', 'glow-indigo');
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>';
                  }
                }} />
              </div>
              <span className="font-mono font-bold text-xl tracking-tight">
                CONSOLE<span className="text-primary">_</span>
              </span>
            </div>
            <p className="text-muted-foreground font-mono text-sm max-w-sm mb-6 leading-relaxed">
              The official coding club. A collective of developers, hackers, and builders creating the future one line at a time.
            </p>
            <div className="flex gap-4">
              {[
                { icon: FaDiscord, href: '#' },
                { icon: FaGithub, href: '#' },
                { icon: FaTwitter, href: '#' },
                { icon: FaLinkedin, href: '#' },
                { icon: FaInstagram, href: '#' }
              ].map((Social, i) => (
                <a 
                  key={i} 
                  href={Social.href}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all hover:glow-indigo"
                >
                  <Social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono font-semibold text-white mb-6">&gt; Quick Links</h4>
            <ul className="space-y-3 font-mono text-sm text-muted-foreground">
              <li><a href="/#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><Link to="/events" className="hover:text-primary transition-colors">Events</Link></li>
              <li><a href="/#domains" className="hover:text-primary transition-colors">Tech Domains</a></li>
              <li><Link to="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-semibold text-white mb-6">&gt; Resources</h4>
            <ul className="space-y-3 font-mono text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Learning Paths</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cheatsheets</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Open Source</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Join Discord</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} Console Club. All rights reserved.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground group">
            Built with <Heart className="w-3 h-3 text-destructive" /> by the Console Team
            <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-primary">
              [exit 0]
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
