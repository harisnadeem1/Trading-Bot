
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DollarSign, Wallet, Clock, CheckCircle, Droplets } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ethereum, Tether, Usdc, Bitcoin } from '@/components/CoinIcons';

const withdrawals = [
    { amount: '$500.00', coin: "BTC", status: 'Completed', date: '2025-10-28' },
    { amount: '$1,200.00', coin: "ETH", status: 'Pending', date: '2025-11-02' },
    { amount: '$350.50', coin: "USDT", status: 'Completed', date: '2025-10-15' },
];

const coinData = {
  BTC: { name: "Bitcoin", network: "BTC Mainnet", icon: <Bitcoin className="w-5 h-5 text-orange-400" /> },
  ETH: { name: "Ethereum", network: "ERC20", icon: <Ethereum className="w-5 h-5" /> },
  USDT: { name: "Tether", network: "TRC20", icon: <Tether className="w-5 h-5" /> },
  USDC: { name: "USD Coin", network: "ERC20", icon: <Usdc className="w-5 h-5" /> },
};

const Withdraw = () => {
    const { toast } = useToast();
    const [selectedCoin, setSelectedCoin] = useState('BTC');

    const handleWithdraw = (e) => {
        e.preventDefault();
        toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
    }
  
  return (
    <>
      <Helmet>
        <title>Withdraw - NovaTrade AI</title>
        <meta name="description" content="Withdraw your earnings from NovaTrade AI." />
      </Helmet>
      <div className="p-4 sm:p-6 lg:p-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-green-400 glow-green"
        >
          Withdraw Funds
        </motion.h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full bg-gradient-to-br from-gray-900 to-green-950/20 border border-green-500/30 rounded-2xl p-8 card-glow"
            >
                <h2 className="text-xl font-bold mb-6">Request Withdrawal</h2>
                <form onSubmit={handleWithdraw} className="space-y-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Select Currency</label>
                        <Select onValueChange={setSelectedCoin} defaultValue={selectedCoin}>
                            <SelectTrigger className="w-full bg-gray-800/50 border-green-500/30">
                            <SelectValue placeholder="Select a coin" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-green-500/50 text-white">
                            {Object.keys(coinData).map(key => (
                                <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                    {coinData[key].icon}
                                    <span>{coinData[key].name} ({key})</span>
                                    <span className="ml-auto text-xs text-gray-500">{coinData[key].network}</span>
                                </div>
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Amount (USD)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input type="number" placeholder="0.00" className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500/60" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm text-gray-400 mb-2">Your {selectedCoin} Wallet Address</label>
                        <div className="relative">
                            <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input type="text" placeholder={`Your ${coinData[selectedCoin].network} wallet address`} className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500/60" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3">Withdraw Now</Button>
                </form>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full bg-gray-900/50 border border-green-500/20 rounded-xl p-6 card-glow"
            >
                <h2 className="text-xl font-bold mb-6">Withdrawal History</h2>
                <div className="space-y-4">
                    {withdrawals.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-800/50 p-4 rounded-lg">
                            <div>
                                <p className="font-bold text-lg flex items-center gap-2">
                                    {coinData[item.coin]?.icon}
                                    {item.amount}
                                </p>
                                <p className="text-xs text-gray-500">{item.date}</p>
                            </div>
                            <div className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full ${item.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                {item.status === 'Completed' ? <CheckCircle className="w-4 h-4"/> : <Clock className="w-4 h-4"/>}
                                {item.status}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
      </div>
    </>
  );
};

export default Withdraw;
