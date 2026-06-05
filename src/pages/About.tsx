import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Wrench, Award, TrendingUp, Users } from 'lucide-react';
import { SEO } from '../components/SEO';

export function About() {
  const stats = [
    { icon: Award, label: 'Expert Reviews', value: '300+' },
    { icon: TrendingUp, label: 'Field Tests', value: '200+' },
    { icon: Users, label: 'Community', value: '10k+' }
  ];

  const coreValues = [
    {
      title: 'Real-World Performance',
      description: 'We don\'t just read spec sheets. We take every tool to the jobsite and push it to its limits.',
      icon: Zap
    },
    {
      title: 'Unbiased Integrity',
      description: 'Our reviews are honest and transparent. We tell you what works and what doesn\'t, period.',
      icon: Shield
    },
    {
      title: 'Technical Depth',
      description: 'We dive deep into motor tech, battery chemistry, and ergonomics to give you the full picture.',
      icon: Award
    }
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <SEO 
        title="About CordlessToolz | Our Mission & Values"
        description="Learn about CordlessToolz, our mission to provide the best cordless power tools, and our commitment to real-world performance and unbiased integrity." 
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter"
          >
            The <span className="text-orange-600 italic">Premier Destination</span> for <br /> Cordless Innovation.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto border-l-4 border-orange-600 pl-8 py-2"
          >
            CordlessToolz is dedicated to the evolution of the cordless jobsite. From high-torque drills to intelligent vacuum systems, we provide the technical intelligence pros need to master their craft.
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center"
            >
              <stat.icon className="w-10 h-10 text-orange-600 mx-auto mb-6" />
              <div className="text-4xl font-black text-slate-900 mb-2">{stat.value}</div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Our Mission</h2>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                Founded in 2021, Cordless Tools emerged from a simple observation: the cordless landscape was moving faster than the information about it. Contractors and DIY enthusiasts were drowning in marketing jargon. 
              </p>
              <p>
                We sell lightweight, compact, and easy-to-use power tools for everyday life. Born from a team of creative engineers, we focus on practical, user-first products that replace heavy, awkward equipment with efficient cordless solutions.
              </p>
              <p>
                Our range serves home cleanup, vehicle maintenance, DIY projects, and more — built with simple, durable design and real-world utility in mind. Every tool carefully selected to ensure reliable performance and a satisfying user experience.
              </p>
              <p>
                We pair value-for-money products with attentive customer service and active listening: feedback and suggestions help us select each new model we embark to sell.
              </p>
              <p>
                Our commitment: make everyday tasks easier through thoughtful cordless innovation, and become a trusted brand customers rely on worldwide.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-orange-900/10">
              <img 
                src="https://i.postimg.cc/GmYBzNrd/cordlesstoolz-teamphoto.jpg" 
                alt="Tool testing" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                width="480"
                height="600"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-orange-600 p-8 rounded-3xl text-white shadow-2xl">
              <div className="text-3xl font-black mb-1">100%</div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-80">Independent</div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8">
          {coreValues.map((value, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-3xl border border-slate-200 hover:border-orange-600 transition-all duration-500"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 group-hover:bg-orange-600 group-hover:text-white transition-colors mb-6">
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
              <p className="text-slate-500 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
