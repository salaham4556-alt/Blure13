import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import BookDetails from "@/pages/BookDetails";
import About from "@/pages/About";
import Authors from "@/pages/Authors";
import Library from "@/pages/Library";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/book/:id" component={BookDetails} />
      <Route path="/about" component={About} />
      <Route path="/authors" component={Authors} />
      <Route path="/library/:type" component={Library} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
