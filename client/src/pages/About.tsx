import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, Instagram, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <main className="container px-4 py-16 flex-1 max-w-4xl mx-auto">
        <div className="text-center space-y-6 mb-16">
           <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
             <img src="https://i.postimg.cc/cJsW1YJR/IMG-20251228-133427.png" alt="Logo" className="w-20 h-20 object-contain" />
           </div>
           <h1 className="text-5xl font-serif font-bold text-foreground">About Blure Books</h1>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
             A project dedicated to making literature accessible, beautiful, and enjoyable for everyone.
           </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1 space-y-6">
            <h2 className="text-3xl font-serif font-bold">The Developer</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hi, I'm <strong>Saad Elomortaji</strong>. I built Blure Books with a passion for design and reading.
              My goal was to create a platform that honors the timeless nature of books while providing a modern, smooth user experience.
            </p>
            
            <div className="flex flex-col gap-4 pt-4">
               <a href="https://www.instagram.com/saad_elmortaji13?igsh=ZXo0YWp1b3MyZ2F0" target="_blank" rel="noreferrer">
                 <Button variant="outline" className="w-full md:w-auto gap-2 text-pink-600 border-pink-200 hover:bg-pink-50">
                   <Instagram className="w-5 h-5" />
                   Follow on Instagram
                 </Button>
               </a>
               <a href="mailto:furfarifadi@gmail.com">
                 <Button variant="outline" className="w-full md:w-auto gap-2">
                   <Mail className="w-5 h-5" />
                   furfarifadi@gmail.com
                 </Button>
               </a>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-background shadow-2xl ring-1 ring-border">
              <img 
                src="https://i.ibb.co/JjML3Tcn/1764541986187.png" 
                alt="Saad Elomortaji" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="bg-secondary/20 p-8 rounded-2xl border border-secondary flex gap-4 items-start">
           <ShieldCheck className="w-12 h-12 text-primary shrink-0" />
           <div className="space-y-2">
             <h3 className="text-xl font-bold">Legal Disclaimer</h3>
             <p className="text-muted-foreground">
               The content provided on this website is sourced from <strong>Gutendex</strong> (Project Gutenberg). 
               We do not host any of the books ourselves. All books are in the public domain in the US, but copyright laws may vary by country.
               Please verify the copyright laws in your country before downloading.
             </p>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
