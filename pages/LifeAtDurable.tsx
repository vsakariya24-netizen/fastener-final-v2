import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, Zap, BookOpen, Coffee, Heart, ArrowRight, Target, Award, TrendingUp } from 'lucide-react';

// --- Constants for Animation ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.15 } }
};

const LifeAtDurable: React.FC = () => {
  // Using 'amber' for the gold/yellow logo color, and 'slate'/'blue' for deep tones.
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* ==================== 
          HERO SECTION: Brand Immersion
      ==================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Dynamic Background Gradients matching brand blues */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-800 via-slate-900 to-black opacity-90 z-10"></div>
        {/* Subtle animated accent blob */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full filter blur-[120px] z-10 animate-pulse-slow"></div>
        
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Team collaboration" className="w-full h-full object-cover opacity-20 mix-blend-overlay grayscale" />
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pt-20">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            {/* Brand Pill */}
            <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 font-bold text-sm tracking-wider uppercase mb-8 shadow-lg">
              <Sparkles size={14} /> Life at Durable
            </span>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-none mb-8">
              Crafting Futures. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300">
                Defining Vibe.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
              We're engineering more than just products. We're engineering a culture where innovation is the norm and your growth is accelerated.
            </p>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-amber-500 text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-400 transition-all shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)] flex items-center gap-3 mx-auto"
            >
              Explore Opportunities <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ==================== 
          THE BENTO GRID: The Durable DNA
          Using Brand Palette precisely across cards.
      ==================== */}
      <section className="py-24 px-4 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={fadeInUp} 
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">The Durable DNA</h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Decoding our mindset. It's not about the hours you put in, it's about the impact you make.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:min-h-[600px]"
          >
            {/* Card 1: People First (Large Image) */}
            <motion.div variants={fadeInUp} className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2rem] shadow-xl bg-slate-900">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-10">
                <div className="bg-amber-500/20 p-3 rounded-2xl inline-block mb-4 backdrop-blur-sm">
                    <Heart className="text-amber-500" size={32} fill="currentColor" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">People-First Mindset.</h3>
                <p className="text-slate-300 text-lg">We build machines, but we value humans. Mental wellness, genuine connections, and a culture of respect are non-negotiable.</p>
              </div>
            </motion.div>

            {/* Card 2: Innovation (Brand Gold Card) */}
            <motion.div variants={fadeInUp} className="md:col-span-1 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2rem] p-8 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 shadow-xl shadow-amber-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 text-amber-300 opacity-50">
                  <Zap size={100} />
              </div>
              <Zap size={40} className="text-slate-900 relative z-10" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-1">Impact Over Output</h3>
                <p className="text-sm font-bold text-slate-800/80">Your ideas don't get lost here. They get built, tested, and shipped.</p>
              </div>
            </motion.div>

            {/* Card 3: Vibe/Chill (Brand Blue Card) */}
            <motion.div variants={fadeInUp} className="md:col-span-1 bg-gradient-to-br from-blue-900 to-slate-900 rounded-[2rem] p-8 flex flex-col justify-between text-white hover:-translate-y-2 transition-transform duration-300 shadow-xl relative overflow-hidden">
               <div className="absolute bottom-0 right-0 -mb-4 -mr-4 text-blue-800 opacity-50">
                  <Coffee size={100} />
              </div>
              <Coffee size={40} className="text-amber-400 relative z-10" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-1">The Vibe</h3>
                <p className="text-sm text-blue-200">Work hard, chill harder. Gaming zones, good coffee, and zero toxicity.</p>
              </div>
            </motion.div>

            {/* Card 4: Collaboration (Dark Card) */}
            <motion.div variants={fadeInUp} className="md:col-span-2 bg-slate-800 rounded-[2rem] p-8 flex items-center relative overflow-hidden shadow-xl border border-slate-700/50">
              <div className="z-10 w-2/3 relative">
                <Users size={40} className="text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Zero Doors Policy</h3>
                <p className="text-slate-400 text-sm">Flat hierarchy. Mentorship over management. We win together.</p>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/20 to-transparent"></div>
               <TrendingUp className="absolute right-8 bottom-8 text-slate-700" size={64} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== 
          DURABLE LEARNING ACADEMY 
          Dark Theme with Gold Accents for premium feel.
      ==================== */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        {/* Brand color background blurs */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/40 rounded-full filter blur-[150px] opacity-50"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-amber-600/30 rounded-full filter blur-[150px] opacity-40"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:w-1/2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-900/50 border border-blue-700/50 rounded-xl backdrop-blur-md">
                  <BookOpen size={24} className="text-blue-300" />
                </div>
                <span className="text-blue-300 font-bold tracking-wider uppercase text-sm">Future-Proof Your Career</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                Durable Learning <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Academy</span>
              </h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Stagnation is the enemy. We don't just hire Gen-Z talent; we build future industry leaders through accelerated learning paths and real-world challenges.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5 group">
                  <div className="bg-amber-500/10 p-3 rounded-full group-hover:bg-amber-500/20 transition-colors">
                    <Target className="text-amber-500 flex-shrink-0" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-white mb-1 group-hover:text-amber-400 transition-colors">Skill Stacking</h4>
                    <p className="text-slate-400">Don't just be one thing. Learn cross-functional skills beyond your JD.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 group">
                   <div className="bg-amber-500/10 p-3 rounded-full group-hover:bg-amber-500/20 transition-colors">
                    <Award className="text-amber-500 flex-shrink-0" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-white mb-1 group-hover:text-amber-400 transition-colors">Sponsored Certifications</h4>
                    <p className="text-slate-400">We pay for the courses that make you better. AWS, Lean Six Sigma, you name it.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               whileInView={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               viewport={{ once: true }}
               className="lg:w-1/2 relative"
            >
              <div className="relative rounded-[2rem] overflow-hidden border-4 border-slate-800 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500">
                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Learning Session" className="w-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl">
                  <p className="text-lg font-medium text-white italic">"I joined as a fresher, and in 2 years, the Academy helped me pivot into Product Strategy. The growth here is real."</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-8 h-1 bg-amber-500 rounded-full"></div>
                    <p className="text-sm text-amber-400 font-bold uppercase tracking-wider">Priya Sharma, Strategy Lead</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

       {/* ==================== 
          STAFF ACTIVITY: Horizontal Scroll
      ==================== */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 mb-12 flex flex-col md:flex-row items-end justify-between gap-4">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-2">Life Unfiltered</h2>
             <div className="w-20 h-1 bg-amber-500 mb-4"></div>
            <p className="text-slate-600 text-lg">No staged stock photos. Just us being us.</p>
          </motion.div>
          <div className="text-slate-400 flex items-center gap-2 text-sm font-medium">
              <ArrowRight className="animate-pulse"/> Scroll to explore
          </div>
        </div>

        {/* Scrollable Gallery Container with drag constraints could be added here, using simple overflow for now */}
        <div className="flex overflow-x-auto pb-8 hide-scrollbar gap-6 px-4 snap-x snap-mandatory">
            {[
                { img: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Hackathons" },
                { img: "https://images.unsplash.com/photo-1528605248644-14dd04022da8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Team Lunches" },
                { img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Gaming Breaks" },
                { img: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Fitness Challenges" },
                 { img: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", title: "Diwali Celebrations" }
            ].map((item, index) => (
                 <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="min-w-[300px] md:min-w-[350px] h-[450px] rounded-[2rem] overflow-hidden relative group snap-center shadow-md hover:shadow-xl transition-all"
                 >
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                 <div className="absolute bottom-6 left-6">
                   <h3 className="text-white text-2xl font-bold group-hover:text-amber-400 transition-colors">{item.title}</h3>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* ==================== 
          FINAL CTA: Strong Brand Finish
      ==================== */}
      <section className="py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-slate-900"></div>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-blue-900 to-transparent opacity-60"></div>
         {/* Gold accent glow underneath */}
         <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/30 rounded-[100%] filter blur-[120px] opacity-70"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-block p-4 bg-amber-500 rounded-2xl rotate-12 mb-8 shadow-lg shadow-amber-500/30">
                <Sparkles size={40} className="text-slate-900 -rotate-12" />
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">Ready to define <br/> what's next?</h2>
            <p className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto">
              The machinery is world-class. The people are even better. Your desk is waiting.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-12 py-5 rounded-full font-bold text-xl hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.6)] transition-all"
              >
                View All Open Roles
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 rounded-full font-bold text-xl text-white border-2 border-white/20 backdrop-blur-sm transition-all"
              >
                See Life on Instagram
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LifeAtDurable;