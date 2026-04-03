import { Link } from 'react-router-dom'
import { LexLogo } from '../components/LexLogo'
import { Footer } from '../components/ui/footer'
import { ArrowLeft } from 'lucide-react'

export default function PolitiqueConfidentialite() {
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
          Politique de confidentialité
        </h1>
        <p className="text-[13px] mb-10" style={{ color: '#8aada4' }}>Dernière mise à jour : avril 2026</p>

        <div className="space-y-8" style={{ color: '#F0F4F2' }}>
          <Section title="1. Collecte des données">
            <p>LexDraft collecte uniquement les informations nécessaires à la fourniture du service : votre adresse courriel (pour l'authentification), les informations de dossier saisies lors de la génération de mises en demeure (noms des parties, résumé des faits, montant réclamé, date limite), ainsi que les fichiers de style uploadés volontairement (.docx).</p>
          </Section>

          <Section title="2. Utilisation des données">
            <p>Les informations collectées sont utilisées exclusivement pour :</p>
            <ul className="list-disc list-inside mt-2 space-y-1" style={{ color: '#8aada4' }}>
              <li>Générer les mises en demeure demandées</li>
              <li>Personnaliser les documents selon votre style</li>
              <li>Sauvegarder vos documents générés dans votre espace personnel</li>
              <li>Assurer la sécurité et le bon fonctionnement de la plateforme</li>
            </ul>
          </Section>

          <Section title="3. Partage des données">
            <p>LexDraft ne vend, ne loue et ne partage aucune de vos données avec des tiers. Vos informations de dossier ne sont jamais utilisées pour entraîner un modèle d'intelligence artificielle.</p>
          </Section>

          <Section title="4. Sécurité">
            <p>Toutes les communications entre votre navigateur et nos serveurs sont chiffrées via HTTPS. L'authentification est assurée par Supabase, une infrastructure sécurisée conforme aux standards de l'industrie. Vos données sont stockées dans des serveurs situés au Canada ou dans l'Union européenne.</p>
          </Section>

          <Section title="5. Conservation">
            <p>Vos données sont conservées tant que votre compte est actif. Vous pouvez demander la suppression de votre compte et de vos données à tout moment en contactant flowmatic.ca@gmail.com.</p>
          </Section>

          <Section title="6. Droits des utilisateurs">
            <p>Conformément aux lois applicables (Loi 25 au Québec, RGPD en Europe), vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez-nous à flowmatic.ca@gmail.com.</p>
          </Section>

          <Section title="7. Cookies">
            <p>LexDraft utilise uniquement des cookies fonctionnels nécessaires à l'authentification. Aucun cookie publicitaire ou de traçage tiers n'est utilisé.</p>
          </Section>

          <Section title="8. Contact">
            <p>Pour toute question relative à la protection de vos données personnelles : <a href="mailto:flowmatic.ca@gmail.com" className="underline" style={{ color: '#6cc4a0' }}>flowmatic.ca@gmail.com</a></p>
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
