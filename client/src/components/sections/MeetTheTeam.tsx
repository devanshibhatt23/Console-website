import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tilt from 'react-parallax-tilt';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

type TeamMember = {
  name: string;
  avatar: string;
  avatarBg: string;
  hoverBorder: string;
  gradientFrom: string;
  github: string;
  linkedin: string;
  email?: string;
  role?: string;
  quote?: string;
  photoUrl?: string;
};

const team: TeamMember[] = [
  {
    name: 'Bhavya Singhal',
    avatar: 'BS',
    avatarBg: 'bg-primary/20 border-primary/30',
    hoverBorder: 'hover:border-primary/40',
    gradientFrom: 'from-primary/20',
    github: 'https://github.com/Bhav-Codes',
    linkedin: 'https://www.linkedin.com/in/bhavya-singhal-20ba6232b/',
    email: 'bhav8175@gmail.com',
  },
  {
    name: 'Parth Gandhi',
    avatar: 'PG',
    avatarBg: 'bg-secondary/20 border-secondary/30',
    hoverBorder: 'hover:border-secondary/40',
    gradientFrom: 'from-secondary/20',
    github: 'https://github.com/parthgandhi22',
    linkedin: 'https://www.linkedin.com/in/parth-gandhi-641320324',
    email: 'parthgandhi625@gmail.com',
  },
  {
    name: 'Mukund Rakholiya',
    avatar: 'MR',
    avatarBg: 'bg-accent/20 border-accent/30',
    hoverBorder: 'hover:border-accent/40',
    gradientFrom: 'from-accent/20',
    github: 'https://github.com/mukundrakholiya28',
    linkedin: 'https://www.linkedin.com/in/mukundrakholiya28',
    email: '2024ucp1163@mnit.ac.in',
  },
  {
    name: 'Raghunandan Jhawar',
    avatar: 'RJ',
    avatarBg: 'bg-yellow-500/20 border-yellow-500/30',
    hoverBorder: 'hover:border-yellow-500/30',
    gradientFrom: 'from-yellow-500/15',
    github: '',
    linkedin: 'http://linkedin.com/in/raghunandan-jhanwar-555137329',
    email: 'raghunandanjhawar1234@gmail.com',
  },
  {
    name: 'Yuvraj',
    avatar: 'YU',
    avatarBg: 'bg-pink-500/20 border-pink-500/30',
    hoverBorder: 'hover:border-pink-500/30',
    gradientFrom: 'from-pink-500/15',
    github: '',
    linkedin: 'https://linkedin.com/in/yuvraj-singh-verma',
    email: 'work.yuvrajsv@gmail.com',
  },
  {
    name: 'Rashi Jangid',
    avatar: 'RJ',
    avatarBg: 'bg-green-500/20 border-green-500/30',
    hoverBorder: 'hover:border-green-500/30',
    gradientFrom: 'from-green-500/15',
    github: '',
    linkedin: 'https://www.linkedin.com/in/rashi-jangid-47849a221',
    email: '2024uce1173@mnit.ac.in',
  },
  {
    name: 'Mridul Trivedi',
    avatar: 'MT',
    avatarBg: 'bg-purple-500/20 border-purple-500/30',
    hoverBorder: 'hover:border-purple-500/30',
    gradientFrom: 'from-purple-500/15',
    github: '',
    linkedin: 'https://www.linkedin.com/in/mridul-trivedi-129b4337a/',
    email: 'mridultrivedi318@gmail.com',
  },
  {
    name: 'Shubham',
    avatar: 'SH',
    avatarBg: 'bg-orange-500/20 border-orange-500/30',
    hoverBorder: 'hover:border-orange-500/30',
    gradientFrom: 'from-orange-500/15',
    github: '',
    linkedin: 'https://www.linkedin.com/in/shubham-singh-bb9146316/',
    email: 'shubhamsinghstrides@gmail.com',
  },
  {
    name: 'Shlok',
    avatar: 'SH',
    avatarBg: 'bg-indigo-500/20 border-indigo-500/30',
    hoverBorder: 'hover:border-indigo-500/30',
    gradientFrom: 'from-indigo-500/15',
    github: '',
    linkedin: '',
    photoUrl: '/team_members/shlok.png',
    email: 'shlokpatel2400@gmail.com',
  },
];

export default function MeetTheTeam() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: headerRef.current, start: 'top 85%' } }
      );
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleCardClick = async (member: TeamMember) => {
    try {
      if (member.email) {
        const { data } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', member.email)
          .single();
        
        if (data?.id) {
          navigate(`/profile/${data.id}`);
          return;
        }
      }
      navigate(`/profile/team-${member.name.replace(/\s+/g, '-').toLowerCase()}`, { state: { staticMember: member } });
    } catch (err) {
      console.error("Profile not found or error:", err);
      navigate(`/profile/team-${member.name.replace(/\s+/g, '-').toLowerCase()}`, { state: { staticMember: member } });
    }
  };

  return (
    <section id="team" ref={sectionRef} className="py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 font-mono text-xs text-primary mb-6">
            <span className="w-2 h-2 rounded-full bg-primary" />
            The Core Team
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
            Meet the <span className="text-gradient-fire">People</span>
          </h2>
          <p className="text-muted-foreground font-mono leading-relaxed">
            Driven by caffeine and curiosity. These are the humans who keep CONSOLE running.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <div key={i} ref={el => { cardsRef.current[i] = el; }}>
              <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} glareEnable glareMaxOpacity={0.08} className="h-full">
                <div 
                  onClick={() => handleCardClick(member)}
                  className={`relative h-full p-7 rounded-2xl bg-card border border-white/5 ${member.hoverBorder} transition-all duration-500 overflow-hidden group cursor-pointer`}
                >
                  {/* Gradient bg reveal */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${member.gradientFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                  <div className="relative z-10">
                    {/* Avatar */}
                    <div 
                      className="w-16 h-16 rounded-2xl border border-white/20 flex items-center justify-center mb-5 font-mono font-bold text-xl text-white group-hover:scale-105 transition-transform duration-300 overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #F2994A, #F0405C)' }}
                    >
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        member.avatar
                      )}
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                      {member.role && (
                        <span className="font-mono text-xs text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                          {member.role}
                        </span>
                      )}
                    </div>

                    {member.quote && (
                      <p className="text-muted-foreground text-sm font-mono italic leading-relaxed mb-6">
                        "{member.quote}"
                      </p>
                    )}

                    {/* Social links */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                      {[
                        { href: member.github, Icon: FaGithub, label: 'GitHub' },
                        { href: member.linkedin, Icon: FaLinkedin, label: 'LinkedIn' },
                      ].filter(({ href }) => href).map(({ href, Icon, label }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors text-white/40"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
