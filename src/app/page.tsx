import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Target, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Track Your Reading Journey
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover, track, and manage your reading with Pagely. Set goals, log sessions, and connect with fellow readers.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8" style={{ color: '#F5F5DC' }}>
                Get Started Free
              </Button>
            </Link>
            <Link href="/discover">
              <Button size="lg" variant="outline" className="text-lg px-8 text-foreground">
                Discover Books
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Track Your Reading
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Personal Library</h3>
            <p className="text-muted-foreground">
              Organize your books by reading status and track your progress
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Reading Stats</h3>
            <p className="text-muted-foreground">
              Visualize your reading habits with detailed statistics and charts
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Reading Goals</h3>
            <p className="text-muted-foreground">
              Set yearly or monthly goals and track your progress
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Social Features</h3>
            <p className="text-muted-foreground">
              Connect with readers, join book clubs, and share reviews
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-primary/5 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Reading Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            Join thousands of readers tracking their books with Pagely
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8" style={{ color: '#F5F5DC' }}>
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
