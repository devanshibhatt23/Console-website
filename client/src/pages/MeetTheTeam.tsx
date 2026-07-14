import { useState, CSSProperties, ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FiMail } from 'react-icons/fi';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

/* ── Data ─────────────────────────────────────────────────── */

const developers = [
  {
    name: 'Devanshi Bhatt',
    email: 'dbhatt2310@gmail.com',
    linkedin: 'https://www.linkedin.com/in/devanshi-bhatt-23db/',
    github: 'https://github.com/devanshibhatt23',
    image: '/developers/01_devanshi-bhatt.jpeg',
  },
  {
    name: 'Ridhima Garg',
    email: 'ridhimagarg0915@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ridhima-garg-0a3725369',
    github: 'https://github.com/coderidhimagarg0915-pixel',
    image: '/developers/02_ridhima-garg.jpg',
  },
  {
    name: 'Prarthana',
    email: 'prarthanasingla321@gmail.com',
    linkedin: 'https://www.linkedin.com/in/prarthana-singla-b5b111372/',
    github: 'https://github.com/prarthanasingla321-rgb',
    image: '/developers/03_prarthana.jpeg',
  },
];

const teamMembers = [
  { name: 'Bhavya Singhal',            email: 'bhav8175@gmail.com',                 linkedin: 'https://www.linkedin.com/in/bhavya-singhal-20ba6232b/',                                                                github: 'https://github.com/Bhav-Codes' },
  { name: 'Parth Gandhi',              email: 'parthgandhi625@gmail.com',             linkedin: 'https://www.linkedin.com/in/parth-gandhi-641320324',                                                                    github: 'https://github.com/parthgandhi22' },
  { name: 'Mukund Rakholiya',          email: '',                                     linkedin: 'https://www.linkedin.com/in/mukundrakholiya28',                                                                          github: 'https://github.com/mukundrakholiya28' },
  { name: 'Rishi Kataria',             email: '',                                     linkedin: 'https://www.linkedin.com/in/rishi-kataria/',                                                                             github: '' },
  { name: 'Raghunandan Jhawar',        email: 'raghunandanjhawar1234@gmail.com',      linkedin: 'http://linkedin.com/in/raghunandan-jhanwar-555137329',                                                                   github: '' },
  { name: 'Shivam Pareek',             email: 'shivamvdn2005@gmail.com',              linkedin: 'https://www.linkedin.com/in/shivam-pareek-047819346',                                                                    github: '' },
  { name: 'Sujal Maurya',              email: 'sujalmaurya08@gmail.com',              linkedin: 'https://www.linkedin.com/in/sujal-maurya/',                                                                              github: 'https://github.com/sujal25' },
  { name: 'Shivam Jat',               email: 'shivamjat531@gmail.com',               linkedin: 'https://www.linkedin.com/in/shivamjat',                                                                                  github: '' },
  { name: 'Yuvraj',                    email: 'work.yuvrajsv@gmail.com',              linkedin: 'https://linkedin.com/in/yuvraj-singh-verma',                                                                             github: '' },
  { name: 'Neel Shah',                 email: 'neelsshah2006@gmail.com',              linkedin: 'https://www.linkedin.com/in/neelsshah2006',                                                                              github: '' },
  { name: 'Shubham Singh',             email: 'shubhamsingh4665655@gmail.com',        linkedin: 'https://in.linkedin.com/in/shubknight',                                                                                  github: 'https://github.com/shubknight' },
  { name: 'Amit Kumar',               email: '6217amitkumar@gmail.com',              linkedin: 'https://www.linkedin.com/in/amit6217',                                                                                   github: '' },
  { name: 'Mahek Patel',               email: 'pjmahek2006@gmail.com',                linkedin: 'https://www.linkedin.com/in/mahek-patel-580404307',                                                                      github: '' },
  { name: 'Rashi Jangid',              email: '2024uce1173@mnit.ac.in',               linkedin: 'https://www.linkedin.com/in/rashi-jangid-47849a221',                                                                     github: '' },
  { name: 'Mridul Trivedi',            email: 'mridultrivedi318@gmail.com',            linkedin: 'https://www.linkedin.com/in/mridul-trivedi-129b4337a/',                                                                  github: '' },
  { name: 'Prashant Chaudhary',        email: 'prashantchaudhary7353@gmail.com',       linkedin: 'https://www.linkedin.com/in/prashant-chaudhary-147912320/',                                                              github: '' },
  { name: 'Krrish Sharma',             email: 'krish56b1@gmail.com',                  linkedin: 'https://www.linkedin.com/in/krish-sharma1165',                                                                           github: '' },
  { name: 'Ritesh Singh',              email: 'ummeshchandrasingh1998@gmail.com',      linkedin: 'https://www.linkedin.com/in/ritesh-kumar-singh-188b9a255',                                                               github: '' },
  { name: 'Abhinav Singh',             email: 'abhinav.6111q@gmail.com',               linkedin: 'https://www.linkedin.com/in/abhinav-singh-3a0863322',                                                                    github: '' },
  { name: 'Siddhi Agarwal',            email: 'siddhinonuagarwal@gmail.com',           linkedin: '',                                                                                                                        github: '' },
  { name: 'Aagam Jain',               email: 'coderaj2006@gmail.com',                linkedin: 'https://www.linkedin.com/in/aagam-jain-b38827394/',                                                                      github: 'https://github.com/coderaj2006' },
  { name: 'Aditya Dhiman',             email: 'dhimanaditya941@gmail.com',             linkedin: 'https://www.linkedin.com/in/aditya-dhiman-37165a36b',                                                                    github: 'https://github.com/Aditya281107' },
  { name: 'Akshat Agrawal',            email: 'agrawalakshat1407@gmail.com',           linkedin: 'https://www.linkedin.com/in/akshat-agrawal-0a66b6383',                                                                   github: 'https://github.com/agrawalakshat1407-dotcom' },
  { name: 'Chiranjeev Goyal',          email: 'chiranjeevgoyal135@gmail.com',          linkedin: 'https://www.linkedin.com/in/chiranjeev-goyal-b7475b3b4',                                                                 github: '' },
  { name: 'Devanshi Bhatt',            email: 'dbhatt2310@gmail.com',                  linkedin: 'https://www.linkedin.com/in/devanshi-bhatt-23db/',                                                                       github: 'https://github.com/devanshibhatt23' },
  { name: 'Dishank Viradiya',          email: 'dlviradiya@gmail.com',                  linkedin: 'https://www.linkedin.com/in/dishank7',                                                                                    github: '' },
  { name: 'Het Shah',                  email: 'hets1457@gmail.com',                    linkedin: 'https://www.linkedin.com/in/het-shah-8b593a369',                                                                          github: 'https://github.com/HetShah2212008' },
  { name: 'Meet Van',                  email: '',                                       linkedin: 'https://www.linkedin.com/in/meet-van/',                                                                                   github: 'https://github.com/meet20062007' },
  { name: 'Pallvi',                    email: 'pallvipatialavi1102@gmail.com',           linkedin: 'https://www.linkedin.com/in/pallvi-varyam-singh-739197375/',                                                              github: 'https://github.com/Pallvi2007' },
  { name: 'Param Chauhan',             email: 'param.chauhan2006@gmail.com',            linkedin: 'https://www.linkedin.com/in/param-chauhan-a1b5aa36a/',                                                                   github: 'https://github.com/paramchauhan2006-afk' },
  { name: 'Prarthana',                 email: 'prarthanasingla321@gmail.com',           linkedin: 'https://www.linkedin.com/in/prarthana-singla-b5b111372/',                                                                github: 'https://github.com/prarthanasingla321-rgb' },
  { name: 'Ridhima Garg',              email: 'ridhimagarg0915@gmail.com',              linkedin: 'https://www.linkedin.com/in/ridhima-garg-0a3725369',                                                                     github: 'https://github.com/coderidhimagarg0915-pixel' },
  { name: 'Saarvik Singh Suryavanshi', email: 'saarvikxcode@gmail.com',                linkedin: 'https://www.linkedin.com/in/saarvik-singh-suryavanshi-94315b36a',                                                        github: 'https://github.com/Saarvik-got-it' },
  { name: 'Sahil Kumar',               email: 'sahil7667790514@gmail.com',              linkedin: 'https://www.linkedin.com/in/76sahil',                                                                                    github: 'https://github.com/2025ucp1686-sudo' },
  { name: 'Siddharth Kumar',           email: 'siddjon07@gmail.com',                   linkedin: 'https://www.linkedin.com/in/siddharth-kumar-174738381/',                                                                  github: 'https://github.com/siddjon07-ctrl' },
  { name: 'Shlok Patel',              email: 'shlokpatel2400@gmail.com',               linkedin: 'https://www.linkedin.com/me?trk=p_mwlite_feed-secondary_nav',                                                            github: '' },
];

/* ── Heading style (32px gradient) ─────────────────────────── */
const headingStyle: CSSProperties = {
  background: 'linear-gradient(90deg, #F2994A, #F0405C)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontSize: '48px',
  fontWeight: 900,
  fontFamily: 'Montserrat, sans-serif',
  lineHeight: 1.2,
};

/* ── Icon button ────────────────────────────────────────────── */
function IconLink({ href, icon }: { href: string; icon: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-all duration-200 hover:border-[#F2994A] hover:text-[#F2994A] hover:bg-[#F2994A]/10 hover:scale-110"
    >
      {icon}
    </a>
  );
}

/* ── Developer card (with photo) ────────────────────────────── */
function DevCard({ dev }: { dev: typeof developers[0] }) {
  const [imgError, setImgError] = useState(false);

  function getInitials(name: string) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  return (
    <div className="flex flex-col items-center p-8 rounded-2xl border border-white/10 bg-[#0d0d0d] transition-all duration-300 hover:border-[#F2994A]/40 hover:shadow-[0_0_30px_rgba(242,153,74,0.12)] hover:-translate-y-1">
      {/* Circular photo */}
      {!imgError ? (
        <img
          src={dev.image}
          alt={dev.name}
          onError={() => setImgError(true)}
          className="w-40 h-40 rounded-full object-cover mb-6 border-2 border-white/10"
        />
      ) : (
        <div
          className="w-40 h-40 rounded-full mb-6 flex items-center justify-center text-white font-bold text-3xl font-montserrat"
          style={{ background: 'linear-gradient(135deg, #F2994A, #F0405C)' }}
        >
          {getInitials(dev.name)}
        </div>
      )}

      <h3 className="text-lg font-bold text-white font-montserrat mb-1 text-center">{dev.name}</h3>

      {dev.email && (
        <p className="text-sm text-white mb-5 text-center break-all">{dev.email}</p>
      )}

      <div className="flex gap-2 mt-auto">
        {dev.email && (
          <IconLink href={`mailto:${dev.email}`} icon={<FiMail size={16} />} />
        )}
        {dev.linkedin && (
          <IconLink href={dev.linkedin} icon={<FaLinkedin size={16} />} />
        )}
        {dev.github && (
          <IconLink href={dev.github} icon={<FaGithub size={16} />} />
        )}
      </div>
    </div>
  );
}

/* ── Team member card ───────────────────────────────────────── */
function MemberCard({ member }: { member: typeof teamMembers[0] }) {
  function getInitials(name: string) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  const hasAnyLink = member.email || member.linkedin || member.github;

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d0d] transition-all duration-300 hover:border-[#F2994A]/40 hover:shadow-[0_0_30px_rgba(242,153,74,0.12)] hover:-translate-y-1 flex flex-col">
      {/* Avatar + name row */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold font-montserrat"
          style={{ background: 'linear-gradient(135deg, #F2994A, #F0405C)' }}
        >
          {getInitials(member.name)}
        </div>
        <h3 className="text-base font-bold text-white font-montserrat leading-tight">{member.name}</h3>
      </div>

      {member.email && (
        <p className="text-sm text-white whitespace-nowrap overflow-hidden text-ellipsis" style={{ paddingLeft: '8px', marginBottom: '20px' }}>{member.email}</p>
      )}

      {hasAnyLink && (
        <div className="flex gap-2" style={{ marginTop: '4px' }}>
          {member.email && (
            <IconLink href={`mailto:${member.email}`} icon={<FiMail size={14} />} />
          )}
          {member.linkedin && (
            <IconLink href={member.linkedin} icon={<FaLinkedin size={14} />} />
          )}
          {member.github && (
            <IconLink href={member.github} icon={<FaGithub size={14} />} />
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
      <Navbar />

      <main className="pt-24 pb-20 w-full">
        {/* ── Developers ── */}
        <section className="w-full px-6 md:px-12 lg:px-20 mb-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h2 style={headingStyle}>Meet the developers</h2>
            </div>
            <p className="text-center text-gray-400 font-inter text-base" style={{ marginBottom: '64px' }}>
              Meet the brilliant minds behind the website of CONSOLE — building the future of tech community platforms
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {developers.map((dev) => (
                <DevCard key={dev.name} dev={dev} />
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-24" />

        {/* ── Team members ── */}
        <section className="w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h2 style={headingStyle}>Meet the team</h2>
            </div>
            <p className="text-center text-gray-400 font-inter text-base" style={{ marginBottom: '64px' }}>
              Ready to join the future of tech? We are here to help you grow and succeed.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {teamMembers.map((member, i) => (
                <MemberCard key={`${member.name}-${i}`} member={member} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
