import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Footer from '@/components/layout/Footer';
import { FiMail } from 'react-icons/fi';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

/* ── Data ─────────────────────────────────────────────────── */

const teamMembers = [
  { name: 'Bhavya Singhal',            email: 'bhav8175@gmail.com',                linkedin: 'https://www.linkedin.com/in/bhavya-singhal-20ba6232b/',                                                                         github: 'https://github.com/Bhav-Codes', image: '/team_members/bhavya.png' },
  { name: 'Parth Gandhi',              email: 'parthgandhi625@gmail.com',           linkedin: 'https://www.linkedin.com/in/parth-gandhi-641320324',                                                                            github: 'https://github.com/parthgandhi22', image: '/team_members/parth_gandhi.png' },
  { name: 'Mukund Rakholiya',          email: '2024ucp1163@mnit.ac.in',             linkedin: 'https://www.linkedin.com/in/mukundrakholiya28',                                                                                  github: 'https://github.com/mukundrakholiya28', image: '/team_members/mukund_rakholiya.png' },
  { name: 'Raghunandan Jhawar',        email: 'raghunandanjhawar1234@gmail.com',    linkedin: 'http://linkedin.com/in/raghunandan-jhanwar-555137329',                                                                           github: '', image: '/team_members/raghunandan.png' },
  { name: 'Yuvraj',                    email: 'work.yuvrajsv@gmail.com',            linkedin: 'https://linkedin.com/in/yuvraj-singh-verma',                                                                                     github: '', image: '/team_members/yuvraj.png' },
  { name: 'Rashi Jangid',              email: '2024uce1173@mnit.ac.in',             linkedin: 'https://www.linkedin.com/in/rashi-jangid-47849a221',                                                                             github: '', image: '/team_members/rashi_jangid.png' },
  { name: 'Mridul Trivedi',            email: 'mridultrivedi318@gmail.com',         linkedin: 'https://www.linkedin.com/in/mridul-trivedi-050a733a8/',                                                                          github: '', image: '/team_members/mridul.png' },
  { name: 'Shubham',                   email: 'shubhamsinghstrides@gmail.com',      linkedin: 'https://www.linkedin.com/in/shubham-singh-bb9146316/',                                                                           github: '', image: '/team_members/shubham.png' },
  { name: 'Aagam Jain',               email: 'coderaj2006@gmail.com',                linkedin: 'https://www.linkedin.com/in/aagam-jain-b38827394/',                                                                      github: 'https://github.com/coderaj2006', image: '/team_members/aagam_jain.png' },
  { name: 'Aditya Dhiman',             email: 'dhimanaditya941@gmail.com',             linkedin: 'https://www.linkedin.com/in/aditya-dhiman-37165a36b',                                                                    github: 'https://github.com/Aditya281107', image: '/team_members/aditya_dhiman.png' },
  { name: 'Akshat Agrawal',            email: 'agrawalakshat1407@gmail.com',           linkedin: 'https://www.linkedin.com/in/akshat-agrawal-0a66b6383',                                                                   github: 'https://github.com/agrawalakshat1407-dotcom', image: '/team_members/akshat.png' },
  { name: 'Chiranjeev Goyal',          email: 'chiranjeevgoyal135@gmail.com',          linkedin: 'https://www.linkedin.com/in/chiranjeev-goyal-b7475b3b4',                                                                 github: '', image: '/team_members/chiranjeev.png' },
  { name: 'Devanshi Bhatt',            email: 'dbhatt2310@gmail.com',                  linkedin: 'https://www.linkedin.com/in/devanshi-bhatt-23db/',                                                                       github: 'https://github.com/devanshibhatt23', image: '/developers/01_devanshi-bhatt.jpeg' },
  { name: 'Dishank Viradiya',          email: 'dlviradiya@gmail.com',                  linkedin: 'https://www.linkedin.com/in/dishank7',                                                                                    github: '', image: '/team_members/dishank.png' },
  { name: 'Het Shah',                  email: 'hets1457@gmail.com',                    linkedin: 'https://www.linkedin.com/in/het-shah-8b593a369',                                                                          github: 'https://github.com/HetShah2212008', image: '/team_members/het_shah.png' },
  { name: 'Meet Van',                  email: '2025ucp1832@mnit.ac.in',                linkedin: 'https://www.linkedin.com/in/meet-van/',                                                                                   github: 'https://github.com/meet20062007', image: '/team_members/meet_van.png' },
  { name: 'Pallvi',                    email: 'pallvipatialavi1102@gmail.com',           linkedin: 'https://www.linkedin.com/in/pallvi-varyam-singh-739197375/',                                                              github: 'https://github.com/Pallvi2007', image: '/team_members/pallvi.png' },
  { name: 'Param Chauhan',             email: 'param.chauhan2006@gmail.com',            linkedin: 'https://www.linkedin.com/in/param-chauhan-a1b5aa36a/',                                                                   github: 'https://github.com/paramchauhan2006-afk', image: '/team_members/param.png' },
  { name: 'Prarthana',                 email: 'prarthanasingla321@gmail.com',           linkedin: 'https://www.linkedin.com/in/prarthana-singla-b5b111372/',                                                                github: 'https://github.com/prarthanasingla321-rgb', image: '/team_members/prarthana.png' },
  { name: 'Ridhima Garg',              email: 'ridhimagarg0915@gmail.com',              linkedin: 'https://www.linkedin.com/in/ridhima-garg-0a3725369',                                                                     github: 'https://github.com/coderidhimagarg0915-pixel', image: '/team_members/ridhima-garg.jpg' },
  { name: 'Saarvik Singh Suryavanshi', email: 'saarvikxcode@gmail.com',                linkedin: 'https://www.linkedin.com/in/saarvik-singh-suryavanshi-94315b36a',                                                        github: 'https://github.com/Saarvik-got-it', image: '/team_members/saarvik.png' },
  { name: 'Sahil Kumar',               email: 'sahil7667790514@gmail.com',              linkedin: 'https://www.linkedin.com/in/76sahil',                                                                                    github: 'https://github.com/2025ucp1686-sudo', image: '/team_members/sahil.png' },
  { name: 'Siddharth Kumar',           email: 'siddjon07@gmail.com',                   linkedin: 'https://www.linkedin.com/in/siddharth-kumar-174738381/',                                                                  github: 'https://github.com/siddjon07-ctrl', image: '/team_members/siddharth.png' },
  { name: 'Shlok Patel',              email: 'shlokpatel2400@gmail.com',               linkedin: 'https://www.linkedin.com/in/shlok-patel-b36802396/',                                                            github: '', image: '/team_members/shlok.png' },
];

/* ── Heading style (32px gradient) ─────────────────────────── */
const headingStyle: CSSProperties = {
  background: 'linear-gradient(90deg, #F2994A, #F0405C)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontSize: 'clamp(48px, 7vw, 72px)',
  fontWeight: 900,
  fontFamily: 'Montserrat, sans-serif',
  lineHeight: 1.2,
  cursor: 'default',
  display: 'inline-block',
  transition: 'transform 0.3s ease, filter 0.3s ease',
  letterSpacing: '-0.02em',
};

const headingHoverOn = (e: React.MouseEvent<HTMLHeadingElement>) => {
  const el = e.currentTarget as HTMLElement;
  el.style.transform = 'scale(1.02)';
  el.style.filter = 'drop-shadow(0 0 14px rgba(242,153,74,0.7)) drop-shadow(0 0 28px rgba(240,64,92,0.4))';
};
const headingHoverOff = (e: React.MouseEvent<HTMLHeadingElement>) => {
  const el = e.currentTarget as HTMLElement;
  el.style.transform = '';
  el.style.filter = '';
};

/* ── Icon button ────────────────────────────────────────────── */
function IconLink({ href, icon }: { href: string; icon: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-all duration-200 hover:border-[#F2994A] hover:text-[#F2994A] hover:bg-[#F2994A]/10 hover:scale-110"
      onClick={(e) => e.stopPropagation()}
    >
      {icon}
    </a>
  );
}

/* ── Team member card ────────────────────────────── */
function MemberCard({ member }: { member: typeof teamMembers[0] }) {
  const [imgError, setImgError] = useState(false);

  function getInitials(name: string) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  const hasAnyLink = member.email || member.linkedin || member.github;

  return (
    <div 
      className="flex flex-col items-center p-8 rounded-2xl border border-white/10 bg-[#0d0d0d] transition-all duration-300 hover:border-[#F2994A]/40 hover:shadow-[0_0_30px_rgba(242,153,74,0.12)]"
    >
      {/* Circular photo */}
      {!imgError && member.image ? (
        <img
          src={member.image}
          alt={member.name}
          onError={() => setImgError(true)}
          className="w-40 h-40 rounded-full object-cover mb-6 border-2 border-white/10"
        />
      ) : (
        <div
          className="w-40 h-40 rounded-full mb-6 flex items-center justify-center text-white font-bold text-3xl font-montserrat"
          style={{ background: 'linear-gradient(135deg, #F2994A, #F0405C)' }}
        >
          {getInitials(member.name)}
        </div>
      )}

      <h3 className="text-lg font-bold text-white font-montserrat mb-1 text-center">{member.name}</h3>

      {member.email && (
        <p className="text-sm text-white text-center break-all" style={{ marginBottom: '28px' }}>{member.email}</p>
      )}

      {hasAnyLink && (
        <div className="flex gap-2" style={{ marginTop: member.email ? '0' : '28px' }}>
          {member.email && (
            <IconLink href={`mailto:${member.email}`} icon={<FiMail size={16} />} />
          )}
          {member.linkedin && (
            <IconLink href={member.linkedin} icon={<FaLinkedin size={16} />} />
          )}
          {member.github && (
            <IconLink href={member.github} icon={<FaGithub size={16} />} />
          )}
        </div>
      )}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function MeetTheTeam() {
  return (
    <div className="bg-black min-h-screen text-white w-full">


      <main className="pt-24 pb-20 w-full">
        {/* ── Team members ── */}
        <section className="w-full px-6 md:px-12 lg:px-20 pt-12 mb-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h2 style={headingStyle} onMouseEnter={headingHoverOn} onMouseLeave={headingHoverOff}>Meet the team</h2>
            </div>
            <p className="text-center text-gray-400 font-inter text-base" style={{ marginBottom: '64px' }}>
              Ready to join the future of tech? We are here to help you grow and succeed.
            </p>

            {/* 3rd Year Members */}
            <div className="mb-16">
              <div className="text-center mb-13">
                <h3 style={{ ...headingStyle, fontSize: 'clamp(32px, 5vw, 38px)' }} onMouseEnter={headingHoverOn} onMouseLeave={headingHoverOff}>3rd year members</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {teamMembers.slice(0, 8).map((member, i) => (
                  <MemberCard key={`${member.name}-${i}`} member={member} />
                ))}
              </div>
            </div>

            {/* 2nd Year Members */}
            <div>
              <div className="text-center mb-13 mt-31">
                <h3 style={{ ...headingStyle, fontSize: 'clamp(32px, 5vw, 38px)' }} onMouseEnter={headingHoverOn} onMouseLeave={headingHoverOff}>2nd year members</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {teamMembers.slice(8).map((member, i) => (
                  <MemberCard key={`${member.name}-${i}`} member={member} />
                ))}
              </div>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
}
