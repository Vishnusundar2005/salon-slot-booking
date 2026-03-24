import Link from 'next/link';
import { Calendar, Clock, Scissors, Star, CheckCircle, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-32 mb-20 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative pt-10 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-indigo-50/50 dark:bg-indigo-900/10 rounded-bl-[100px] hidden lg:block"></div>
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-left space-y-8">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest leading-none">
              <Star size={14} className="fill-indigo-600" />
              <span>Rated #1 Salon Experience</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tight font-outfit leading-[1.05]">
              Redefining <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Grooming.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed font-medium">
              Experience the perfect blend of traditional craftsmanship and modern precision. 
              Book your signature look in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link 
                href="/services/" 
                className="px-10 py-5 text-lg font-black rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-200 dark:shadow-none transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 group"
              >
                Book Appointment
                <Calendar className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link 
                href="/login/" 
                className="px-10 py-5 text-lg font-black rounded-2xl text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center"
              >
                Login to Manage
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-8 border-t border-gray-100 dark:border-gray-800 max-w-sm">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700"></div>
                ))}
              </div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                <span className="text-gray-900 dark:text-white">500+</span> Customers served this month
              </p>
            </div>
          </div>

          <div className="flex-1 relative hidden lg:block">
            <div className="absolute inset-0 bg-indigo-600/10 dark:bg-indigo-600/20 blur-[100px] rounded-full"></div>
            <div className="relative bg-white dark:bg-gray-800 p-4 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-700 rotate-2 hover:rotate-0 transition-transform duration-500">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                     <div className="bg-indigo-600 h-64 rounded-3xl"></div>
                     <div className="bg-emerald-500 h-40 rounded-3xl"></div>
                  </div>
                  <div className="space-y-4 pt-12">
                     <div className="bg-amber-400 h-40 rounded-3xl"></div>
                     <div className="bg-indigo-800 h-64 rounded-3xl"></div>
                  </div>
               </div>
               {/* Floating Stat card */}
               <div className="absolute -bottom-10 -left-10 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 animate-bounce">
                  <div className="flex items-center gap-4">
                     <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <CheckCircle size={24} />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Available Today</p>
                        <p className="text-xl font-black text-gray-900 dark:text-white">12 Free Slots</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: Scissors,
            title: "Expert Stylists",
            desc: "Our masters blend classic techniques with modern trends for a look that's uniquely yours.",
            color: "indigo"
          },
          {
            icon: Clock,
            title: "Zero Wait Time",
            desc: "Respect for your schedule. Walk in precisely at your booked time and get straight to the chair.",
            color: "emerald"
          },
          {
            icon: ShieldCheck,
            title: "Safe & Hygienic",
            desc: "Premium grooming starts with safety. Hospital-grade sanitization for every single customer.",
            color: "amber"
          }
        ].map((f, i) => (
          <div key={i} className="group bg-white dark:bg-gray-800 p-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-xl transition-all duration-300">
            <div className={`w-16 h-16 bg-${f.color}-50 dark:bg-${f.color}-900/20 rounded-2xl flex items-center justify-center text-${f.color}-600 dark:text-${f.color}-400 mb-8 group-hover:scale-110 transition-transform`}>
              <f.icon size={32} />
            </div>
            <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white font-outfit">{f.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-900 rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
         
         <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-white font-outfit max-w-3xl mx-auto leading-tight">
              Ready for your next <br />
              <span className="text-indigo-400">Masterpiece?</span>
            </h2>
            <p className="text-xl text-indigo-100/70 max-w-xl mx-auto font-medium">
              Join thousands of satisfied gentlemen who trust Slotify for their daily grooming needs.
            </p>
            <div className="pt-4">
              <Link 
                href="/services/" 
                className="inline-flex px-12 py-6 bg-white text-indigo-900 text-lg font-black rounded-3xl hover:bg-indigo-50 transition-colors shadow-2xl"
              >
                Explore Services
              </Link>
            </div>
         </div>
         
         {/* Decorative circles */}
         <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
         <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
}
