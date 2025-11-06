
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle } from 'lucide-react';

const mockPlans = [
  { name: 'Starter Plan', roi: 4, duration: '30 Days', tier: '$50 - $75K' },
  { name: 'Advanced Plan', roi: 6, duration: '30 Days', tier: '$75K - $100K' },
  { name: 'Pro Plan', roi: 8, duration: '60 Days', tier: '$100K - $250K' },
  { name: 'Whale Plan', roi: 10, duration: '90 Days', tier: '$250K+' },
];

const AdminPlans = () => {
    const { toast } = useToast();
    
    const handleAction = () => {
        toast({ title: "🚧 This feature isn't implemented yet!" });
    };

  return (
    <>
      <Helmet>
        <title>Manage Plans - Admin</title>
        <meta name="description" content="Add or edit investment plans." />
      </Helmet>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
            <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-red-400 glow-red"
            >
            Manage Investment Plans
            </motion.h1>
             <Button onClick={handleAction} className="bg-red-500/80 hover:bg-red-600 text-white font-semibold">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Plan
            </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900/50 border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all duration-300 card-glow-red flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.tier}</p>
                <div className="text-4xl font-bold text-red-400 glow-red mb-4">{plan.roi}%</div>
                <div className="text-gray-400 text-sm">{plan.duration}</div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleAction} className="w-full bg-red-500/20 text-red-300 hover:bg-red-500/30">Edit</Button>
                <Button onClick={handleAction} variant="destructive" className="w-full">Delete</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminPlans;
