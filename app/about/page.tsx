import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | JSM Mock Interview App',
  description: 'Learn more about our mission to help you ace your technical interviews',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About PrepView Mock Interview App</h1>
        <p className="text-xl text-muted-foreground">Empowering developers to ace their technical interviews</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              At PrepView Mock Interview App, we're dedicated to helping aspiring and experienced developers prepare for technical interviews through realistic mock interviews and personalized feedback.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What We Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>Real Time Interview Practice with AI</li>
              <li>Personalized feedback</li>
              <li>Interview preparation resources</li>
              <li>Performance tracking</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-4">Ready to ace your next interview?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join our WhatsApp community of developers who are preparing for their dream tech jobs.
        </p>
        <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
          <a href="https://chat.whatsapp.com/H91b3THUpVi3I57OLvCK5B" target="_blank" rel="noopener noreferrer">
            Join WhatsApp Group
          </a>
        </Button>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Our Story</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-muted-foreground">
            <p className="mb-4">
              PrepView was born out of our own struggles with technical interviews. We understand how daunting the interview process can be, especially when you're trying to break into the tech industry or level up your career.
            </p>
            <p>
              Our platform is designed by developers, for developers, with a focus on providing a realistic interview experience and actionable feedback to help you improve.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
