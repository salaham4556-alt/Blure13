import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-primary/5 border-t py-12 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <h3 className="font-serif text-2xl font-bold text-primary mb-4">Blure Books</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {t('disclaimer')}
        </p>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium font-serif italic text-primary/80">
            {t('signature')}
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Blure Books. {t('all_rights_reserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}