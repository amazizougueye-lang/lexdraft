import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LexLogo } from '../components/LexLogo'
import { BackgroundPaths } from '../components/ui/background-paths'
import { TextRotate } from '../components/ui/text-rotate'
import { Marquee } from '../components/ui/marquee'
import { FAQ } from '../components/ui/faq'
import { Footer } from '../components/ui/footer'
import { ArrowRight, Shield, Clock, Star } from 'lucide-react'

/* ─── Data ──────────────────────────────────────────────────── */

const TESTIMONIALS = [
  {
    initials: 'IF',
    name: 'Me Isabelle Fortier',
    title: 'Avocate, droit civil et litige commercial — Montréal',
    body: '"LexDraft m\'a permis de gagner un temps considérable sur les dossiers répétitifs. La structure est rigoureuse, le ton juridique est juste. Je retouche très peu avant d\'envoyer."',
    stars: 5,
  },
  {
    initials: 'JC',
    name: 'Me Jean-Philippe Côté',
    title: 'Avocat solo, recouvrement de créances — Québec',
    body: '"Outil impressionnant pour une beta. La mise en demeure générée respecte les formules qu\'on utilise en pratique au Québec. Ça remplace facilement 30 minutes de rédaction."',
    stars: 5,
  },
  {
    initials: 'SL',
    name: 'Sandra Létourneau',
    title: 'Parajuriste, cabinet Archambault & Associés — Laval',
    body: '"Très utile pour les dossiers de routine. Je génère la lettre, je la relis, j\'ajuste deux ou trois phrases et c\'est parti. Le gain de temps est réel."',
    stars: 5,
  },
]

const FAQ_ITEMS = [
  {
    question: 'Est-ce que mes données sont confidentielles ?',
    answer: 'LexDraft a été conçu pour respecter les obligations déontologiques des avocats et parajuristes québécois. Les informations saisies lors de la génération sont transmises de manière chiffrée et ne sont jamais partagées avec des tiers, vendues, ni utilisées pour entraîner un modèle d\'intelligence artificielle. Vos dossiers restent les vôtres.',
  },
  {
    question: 'Comment fonctionne la génération ?',
    answer: 'Vous renseignez les informations clés du dossier : les parties, les faits, le manquement reproché et la demande. LexDraft structure ces éléments et génère automatiquement une mise en demeure en français juridique québécois, selon une structure en quatre parties (faits, manquement, demande, pression). Le document est ensuite disponible en lecture, en copie et en téléchargement Word.',
  },
  {
    question: 'Est-ce conforme au droit québécois ?',
    answer: 'LexDraft génère des mises en demeure conformes aux usages du droit civil québécois et au Code civil du Québec. Les documents respectent la structure, le registre et les formules consacrées en pratique. Cela dit, LexDraft est un outil d\'assistance à la rédaction — la révision par un professionnel du droit demeure recommandée avant tout envoi.',
  },
  {
    question: 'Les documents générés sont-ils juridiquement fiables ?',
    answer: 'LexDraft produit des documents de qualité professionnelle, structurés selon les standards du milieu juridique québécois. Ils ne constituent pas un avis juridique. La responsabilité de la révision et de l\'envoi appartient au professionnel qui utilise l\'outil.',
  },
  {
    question: 'Comment fonctionne l\'intelligence artificielle ?',
    answer: 'LexDraft utilise un modèle de langage de pointe pour structurer et rédiger les mises en demeure à partir des informations que vous fournissez. Le modèle ne conserve aucune information entre les sessions et ne mémorise pas le contenu de vos dossiers.',
  },
  {
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Oui. LexDraft utilise une infrastructure sécurisée avec authentification protégée et transmission chiffrée (HTTPS). Aucune information confidentielle de dossier n\'est conservée après la génération du document.',
  },
  {
    question: 'Puis-je modifier les documents générés ?',
    answer: 'Oui. Une fois la mise en demeure générée, vous pouvez la copier directement ou la télécharger au format Word (.docx) pour la modifier librement dans votre traitement de texte habituel.',
  },
]

/* ─── Testimonial card ───────────────────────────────────────── */

function TestimonialCard({ initials, name, title, body, stars }: typeof TESTIMONIALS[number]) {
  return (
    <div
      className="w-72 rounded-[0.75rem] p-5 shrink-0"
      style={{ background: '#0f1f1d', border: '1px solid #1e3b32' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
          style={{ background: '#285A48' }}
        >
          {initials}
        </div>
        <div>
          <p className="text-[13px] font-semibold" style={{ color: '#F0F4F2' }}>{name}</p>
          <p className="text-[11px]" style={{ color: '#8aada4' }}>{title}</p>
        </div>
      </div>
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} size={11} fill="#285A48" style={{ color: '#285A48' }} />
        ))}
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: '#8aada4' }}>
        {body}
      </p>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#091413' }}>
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-30 flex items-center justify-between px-6 h-14"
        style={{ background: 'rgba(9,20,19,0.95)', borderBottom: '1px solid #1e3b32', backdropFilter: 'blur(12px)' }}
      >
        <LexLogo />
        <Link
          to="/login"
          className="text-[13.5px] font-medium px-4 py-2 rounded-[0.75rem] transition-all"
          style={{ border: '1px solid #285A48', color: '#F0F4F2' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(40,90,72,0.15)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          Se connecter
        </Link>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <BackgroundPaths>
        <section className="relative z-10 flex flex-col items-center justify-center text-center min-h-[calc(100vh-56px)] px-6 py-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{ background: 'rgba(40,90,72,0.15)', border: '1px solid rgba(40,90,72,0.35)' }}
          >
            <Shield size={12} style={{ color: '#285A48' }} />
            <span className="text-[12px] font-medium" style={{ color: '#6cc4a0' }}>
              Beta — accès sur invitation seulement
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[48px] sm:text-[60px] font-normal leading-[1.1] tracking-[-0.03em] mb-6 max-w-3xl"
            style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: '#F0F4F2' }}
          >
            La mise en demeure québécoise,{' '}
            <span style={{ color: '#285A48', fontStyle: 'italic' }}>rédigée en 60 secondes.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[18px] leading-relaxed max-w-xl mb-4"
            style={{ color: '#8aada4' }}
          >
            LexDraft génère des mises en demeure en français juridique québécois, à partir des informations de votre dossier. Précis. Rapide. Professionnel.
          </motion.p>

          {/* Animated text cycle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 mb-10 text-[14px]"
            style={{ color: '#8aada4' }}
          >
            <span>Pour</span>
            <span
              className="px-2 py-0.5 rounded-md font-medium"
              style={{ background: 'rgba(40,90,72,0.2)', color: '#6cc4a0', minWidth: '180px', display: 'inline-block', textAlign: 'center' }}
            >
              <TextRotate
                texts={['les avocats en litige civil', 'les parajuristes', 'les assistants juridiques', 'les avocats solos']}
                rotationInterval={2500}
                splitBy="words"
                mainClassName="justify-center"
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-110%', opacity: 0 }}
              />
            </span>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-3"
          >
            <a
              href="mailto:flowmatic.ca@gmail.com"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-[15px]"
            >
              Demander un accès beta <ArrowRight size={16} />
            </a>
            <p className="text-[12px]" style={{ color: '#8aada4', opacity: 0.6 }}>
              Accès gratuit — sur invitation seulement
            </p>
          </motion.div>
        </section>
      </BackgroundPaths>

      {/* ── Testimonials ───────────────────────────────────────── */}
      <section className="py-20 overflow-hidden" style={{ background: '#0f1f1d', borderTop: '1px solid #1e3b32' }}>
        <div className="max-w-5xl mx-auto px-6 mb-12 text-center">
          <p className="section-label mb-3">Avis beta testeurs</p>
          <h2
            className="text-[32px] font-normal tracking-[-0.02em]"
            style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: '#F0F4F2' }}
          >
            Ce que disent nos premiers testeurs
          </h2>
        </div>

        <div className="relative">
          <Marquee pauseOnHover repeat={3} className="[--duration:35s]">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </Marquee>
          {/* Gradient edges */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-20"
            style={{ background: 'linear-gradient(to right, #0f1f1d, transparent)' }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-20"
            style={{ background: 'linear-gradient(to left, #0f1f1d, transparent)' }}
          />
        </div>
      </section>

      {/* ── Features strip ─────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: '#091413', borderTop: '1px solid #1e3b32' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Clock, title: 'Généré en 20 secondes', desc: 'Fournissez les faits — LexDraft rédige la mise en demeure complète.' },
            { icon: Shield, title: 'Droit québécois', desc: 'Structure, registre et formules conformes aux usages du Code civil du Québec.' },
            { icon: Star, title: 'Votre style', desc: "Uploadez vos MED passées — l'IA s'adapte à vos formulations." },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-[0.75rem] p-5"
              style={{ background: '#0f1f1d', border: '1px solid #1e3b32' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(40,90,72,0.2)' }}
              >
                <Icon size={18} style={{ color: '#285A48' }} />
              </div>
              <p className="font-semibold text-[14px] mb-1.5" style={{ color: '#F0F4F2' }}>{title}</p>
              <p className="text-[13px] leading-relaxed" style={{ color: '#8aada4' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: '#091413', borderTop: '1px solid #1e3b32' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">FAQ</p>
            <h2
              className="text-[32px] font-normal tracking-[-0.02em]"
              style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: '#F0F4F2' }}
            >
              Questions fréquentes
            </h2>
          </div>
          <FAQ items={FAQ_ITEMS} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
