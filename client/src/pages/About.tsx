import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useTranslation } from 'react-i18next';
import { Mail, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center space-y-8">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-primary/20 shadow-xl">
            <img 
              src="https://i.ibb.co/JjML3Tcn/1764541986187.png" 
              alt="Saad Elomortaji" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="font-serif text-4xl font-bold">{t('developer')}</h1>
            <h2 className="text-2xl text-primary font-serif italic">Saad Elomortaji</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Blure Books. I built this platform to make literature accessible to everyone, everywhere.
              Using modern web technologies and open APIs, we bring thousands of classic books to your fingertips.
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-8">
            <a href="https://www.instagram.com/saad_elmortaji13?igsh=ZXo0YWp1b3MyZ2F0" target="_blank" rel="noreferrer">
              <Button variant="outline" className="gap-2">
                <Instagram className="h-4 w-4" />
                Instagram
              </Button>
            </a>
            <a href="mailto:furfarifadi@gmail.com">
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                {t('contact')}
              </Button>
            </a>
          </div>

          <div className="pt-12 border-t mt-12">
            <h3 className="font-bold mb-4">Legal Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              {t('disclaimer')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}