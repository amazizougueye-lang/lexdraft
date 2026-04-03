import { Link } from 'react-router-dom'
import { LexLogo } from '../components/LexLogo'
import { Footer } from '../components/ui/footer'
import { ArrowLeft } from 'lucide-react'

export default function ConditionsUtilisation() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#091413' }}>
      <header className="page-header">
        <LexLogo />
        <Link to="/" className="btn-ghost flex items-center gap-1.5 text-[13px]">
          <ArrowLeft size={14} /> Retour
        </Link>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <h1
          className="text-[36px] font-normal leading-tight tracking-[-0.02em] mb-2"
          style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: '#F0F4F2' }}
        >
          Conditions d'utilisation
        </h1>
        <p className="text-[13px] mb-10" style={{ color: '#8aada4' }}>Dernière mise à jour : avril 2026</p>

        <div className="space-y-8">
          <Section title="1. Acceptation des conditions">
            <p>En accédant et en utilisant LexDraft, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le service.</p>
          </Section>

          <Section title="2. Description du service">
            <p>LexDraft est un outil d'assistance à la rédaction juridique destiné aux professionnels du droit (avocats, parajuristes, assistants juridiques) au Québec. Le service génère des mises en demeure en français juridique québécois à partir des informations fournies par l'utilisateur.</p>
          </Section>

          <Section title="3. Utilisation professionnelle">
            <p>LexDraft est conçu pour un usage professionnel dans le cadre de la pratique juridique. Les documents générés sont des outils d'assistance à la rédaction et ne constituent pas des avis juridiques. La responsabilité de la révision, de la validation et de l'envoi de tout document appartient intégralement à l'utilisateur.</p>
          </Section>

          <Section title="4. Limitations de responsabilité">
            <p>Flowmatic, développeur de LexDraft, ne peut être tenu responsable :</p>
            <ul className="list-disc list-inside mt-2 space-y-1" style={{ color: '#8aada4' }}>
              <li>Des erreurs ou inexactitudes dans les documents générés</li>
              <li>Des conséquences juridiques découlant de l'utilisation des documents sans révision professionnelle</li>
              <li>Des interruptions de service ou pertes de données</li>
            </ul>
          </Section>

          <Section title="5. Propriété intellectuelle">
            <p>Les documents générés par LexDraft à partir de vos informations vous appartiennent. Le code, les algorithmes et l'interface de LexDraft sont la propriété exclusive de Flowmatic.</p>
          </Section>

          <Section title="6. Accès beta">
            <p>LexDraft est actuellement en version beta. L'accès est accordé sur invitation. Flowmatic se réserve le droit de modifier ou d'interrompre le service à tout moment, avec ou sans préavis.</p>
          </Section>

          <Section title="7. Confidentialité">
            <p>L'utilisation de vos données personnelles est régie par notre <Link to="/politique-de-confidentialite" className="underline" style={{ color: '#6cc4a0' }}>Politique de confidentialité</Link>, incorporée par référence aux présentes conditions.</p>
          </Section>

          <Section title="8. Loi applicable">
            <p>Les présentes conditions sont régies par les lois de la province de Québec et les lois fédérales du Canada applicables. Tout litige sera soumis à la juridiction exclusive des tribunaux du Québec.</p>
          </Section>

          <Section title="9. Contact">
            <p>Pour toute question relative aux présentes conditions : <a href="mailto:flowmatic.ca@gmail.com" className="underline" style={{ color: '#6cc4a0' }}>flowmatic.ca@gmail.com</a></p>
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="text-[18px] font-semibold mb-3"
        style={{ color: '#F0F4F2' }}
      >
        {title}
      </h2>
      <div className="text-[14px] leading-relaxed space-y-2" style={{ color: '#8aada4' }}>
        {children}
      </div>
    </div>
  )
}
