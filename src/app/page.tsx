import Link from "next/link";
import { ArrowRight, BookOpen, Brain, PenTool } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[90vh]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
          Revolutionizing Arabic Learning
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 animate-slide-up">
          Master Arabic Grammar <br className="hidden md:block" />
          <span className="text-emerald-600">Powered by AI</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-arabic animate-slide-up" style={{ animationDelay: "150ms" }}>
          Qawaid-AI is an intelligent companion that helps you understand Nahwu and Sharaf with instant text analysis, smart feedback, and interactive exercises.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Start Analyzing Text
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors duration-200"
          >
            Sign In to Account
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 mt-auto rounded-3xl mb-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why choose Qawaid-AI?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Everything you need to confidently grasp the rules of the Arabic language.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Instant I'rab Analysis</h3>
            <p className="text-slate-600 leading-relaxed">
              Paste any Arabic text and immediately receive a detailed grammatical breakdown (fi'il, isim, harf) along with case endings and contextual explanations.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Dictionary & Notes</h3>
            <p className="text-slate-600 leading-relaxed">
              Save your text analyses directly into your personal dashboard. Easily reference your learned vocabulary, syntax rules, and keep track of your progress.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-6">
              <PenTool className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Interactive Exercises</h3>
            <p className="text-slate-600 leading-relaxed">
              Test your grammar knowledge with customized, AI-generated quizzes based on your past analyses to reinforce your comprehension dynamically.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
