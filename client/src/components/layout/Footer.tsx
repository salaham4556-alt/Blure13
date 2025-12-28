export function Footer() {
  return (
    <footer className="w-full border-t bg-card py-8 mt-auto">
      <div className="container px-4 flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-2 mb-4">
           <img src="https://i.postimg.cc/cJsW1YJR/IMG-20251228-133427.png" alt="Blure Books" className="h-12 w-12 object-contain opacity-80" />
        </div>
        
        <p className="text-sm text-muted-foreground max-w-md">
          Blure Books is a gateway to thousands of free eBooks. 
          Knowledge should be free and accessible to everyone.
        </p>
        
        <div className="w-24 h-[1px] bg-border my-4"></div>
        
        <p className="font-serif text-lg italic text-primary">
          by Saad Elomortaji
        </p>
        
        <p className="text-xs text-muted-foreground mt-4">
          © {new Date().getFullYear()} Blure Books. Content provided by Gutendex.
        </p>
      </div>
    </footer>
  );
}
