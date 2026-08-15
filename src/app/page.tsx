'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="noren-header">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tighter">
              Budimind
            </h1>
            <nav className="hidden md:flex space-x-6">
              <Link href="/assessment" className="text-muted-foreground hover:text-primary transition-colors">
                Assessments
              </Link>
              <Link href="/login" className="button-accent">Login</Link>
            </nav>
            <button className="md:hidden" id="mobile-menu-button">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center bg-[url('/images/washi-pattern.svg')] bg-[size:300px] text-center px-6 py-12">
        <div className="max-w-4xl">
          <h2 className="text-5xl font-bold mb-6 tracking-tighter">
            Comprehensive Psychological Assessment Platform
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Empowering mental health professionals with scientifically validated 
            assessment tools and intuitive analytics for better patient outcomes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment" className="button flex-1">
              Start Assessment
            </Link>
            <Link href="/login" className="button-secondary flex-1">
              Consultant Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Budimind?
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="washi-card p-8 text-center">
              <div className="mb-6">
                <svg className="h-12 w-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">14+ Validated Assessments</h3>
              <p className="text-muted-foreground">
                From DASS-21 to PCL-5, we offer comprehensive screening tools 
                for depression, anxiety, PTSD, ADHD, and more
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="washi-card p-8 text-center">
              <div className="mb-6">
                <svg className="h-12 w-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 10c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0-8c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Beautiful, Calming Interface</h3>
              <p className="text-muted-foreground">
                Inspired by Japanese tatami and washi paper aesthetics, 
                creating a serene environment for assessment completion
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="washi-card p-8 text-center">
              <div className="mb-6">
                <svg className="h-12 w-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.504-.203-2.958-.632-4.236z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Insightful Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Visualize patient progress with interactive spider charts, 
                trend analysis, and comprehensive reporting
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="washi-card p-8 text-center">
              <div className="mb-6">
                <svg className="h-12 w-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4h2a2 2 0 012 2v2h-2V6h-2v2h-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2h3l1-2h3l1-2V6a2 2 0 012-2zm0 10H8v-3h8v3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure & Compliant</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with JWT authentication, 
                encrypted data storage, and privacy-first design
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Assessments Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Available Assessments
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Evidence-based screening tools covering a wide range of psychological 
            concerns and symptom domains
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Assessment Cards */}
            <div className="washi-card p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <svg className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                DASS-21
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Depression Anxiety Stress Scales - measures three negative emotional states
              </p>
              <Link href="/assessment/dass21" className="text-sm font-medium text-primary hover:text-primary/80">
                Take Assessment →
              </Link>
            </div>
            
            <div className="washi-card p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <svg className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                PHQ-9
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Patient Health Questionnaire - 9-item depression screening
              </p>
              <Link href="/assessment/phq9" className="text-sm font-medium text-primary hover:text-primary/80">
                Take Assessment →
              </Link>
            </div>
            
            <div className="washi-card p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <svg className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                GAD-7
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Generalized Anxiety Disorder - 7-item anxiety screening
              </p>
              <Link href="/assessment/gad7" className="text-sm font-medium text-primary hover:text-primary/80">
                Take Assessment →
              </Link>
            </div>
            
            <div className="washi-card p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <svg className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 10c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0-8c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2z" />
                </svg>
                WHO-5
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Well-Being Index - 5-item mental well-being screening
              </p>
              <Link href="/assessment/who5" className="text-sm font-medium text-primary hover:text-primary/80">
                Take Assessment →
              </Link>
            </div>
            
            <div className="washi-card p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <svg className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                PCL-5
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                PTSD Checklist - 20-item PTSD symptom screening
              </p>
              <Link href="/assessment/pcl5" className="text-sm font-medium text-primary hover:text-primary/80">
                Take Assessment →
              </Link>
            </div>
            
            <div className="washi-card p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <svg className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                EPDS
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Edinburgh Postnatal Depression Scale - 10-item postpartum screening
              </p>
              <Link href="/assessment/epds" className="text-sm font-medium text-primary hover:text-primary/80">
                Take Assessment →
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/assessment" className="button button-accent">
              View All Assessments
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/90 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Ready to begin your assessment journey?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Select from our comprehensive library of psychological assessments 
            and gain valuable insights into mental health and well-being
          </p>
          <Link href="/assessment" className="button-accent">
            Start Assessment Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/80 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="space-x-4 mb-6 sm:mb-0">
              <a href="/" className="hover:text-primary transition-colors">
                Budimind
              </a>
              <span className="mx-2 text-muted-foreground">/</span>
              <a href="/assessment" className="hover:text-primary transition-colors">
                Assessments
              </a>
              <span className="mx-2 text-muted-foreground">/</span>
              <a href="/login" className="hover:text-primary transition-colors">
                Consultant Login
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Budimind Psychology Clinic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}