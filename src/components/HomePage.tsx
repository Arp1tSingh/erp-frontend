import { LoginSection } from "./LoginSection";
import { FeatureCard } from "./FeatureCard";
import { BookOpen, Calendar, FileText, BarChart3, Users, GraduationCap } from "lucide-react";
import heroImage from '../assets/hero-image.jpg'; 
import { useState } from 'react';

// This defines what props the HomePage component expects
type HomePageProps = {
  onLogin: (role: "student" | "admin") => void;
};

// --- FIXES ARE HERE ---
// 1. Changed "export default function HomePage()" to "export function HomePage(...)" for a named export.
// 2. Added "({ onLogin }: HomePageProps)" to accept the onLogin prop.
export function HomePage({ onLogin }: HomePageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            <span className="text-xl">EduERP</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-primary">
              Education Management System
            </div>
            <h1>Transform Your Educational Institution</h1>
            <p className="text-muted-foreground">
              A comprehensive ERP solution designed to streamline academic operations, 
              enhance student engagement, and empower administrators with powerful tools 
              for efficient institution management.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="#login" className="inline-block">
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                  Get Started
                </button>
              </a>
              <button className="border border-border px-6 py-3 rounded-lg hover:bg-accent transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img
              src={heroImage} // <-- 2. Use the imported variable here
              alt="Students using technology"
              className="w-full h-full object-cover"
  />
          </div>
        </div>
      </section>

      {/* Login Section */}
      
      <section id="login" className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="mb-4">Access Your Account</h2>
          <p className="text-muted-foreground">
            Sign in to continue to your dashboard
          </p>
        </div>
        <div className="flex justify-center">
          {/* This line is now correct because 'onLogin' is defined from the props */}
          <LoginSection onLogin={onLogin} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your educational institution efficiently
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={BookOpen}
              title="Course Management"
              description="Organize courses, manage curricula, and track student progress seamlessly"
            />
            <FeatureCard
              icon={Calendar}
              title="Attendance Tracking"
              description="Monitor student attendance with automated reporting and notifications"
            />
            <FeatureCard
              icon={FileText}
              title="Grade Management"
              description="Efficiently record, calculate, and distribute student grades and transcripts"
            />
            <FeatureCard
              icon={BarChart3}
              title="Analytics & Reports"
              description="Gain insights with comprehensive analytics and customizable reports"
            />
            <FeatureCard
              icon={Users}
              title="User Management"
              description="Manage students, faculty, and staff with role-based access control"
            />
            <FeatureCard
              icon={GraduationCap}
              title="Student Portal"
              description="Empower students with access to grades, schedules, and resources"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              <span>EduERP</span>
            </div>
            <p className="text-muted-foreground">
              © 2025 EduERP. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}