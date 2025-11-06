
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Copy, Bitcoin, Droplets } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ethereum, Tether, Usdc } from '@/components/CoinIcons';

const coinData = {
  BTC: {
    name: "Bitcoin",
    network: "BTC Mainnet",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    icon: <Bitcoin className="w-6 h-6 text-orange-400" />,
  },
  ETH: {
    name: "Ethereum",
    network: "ERC20",
    address: "0x1234AbCdEfGhIjKlMnOpQrStUvWxYz567890aBcDeF",
    icon: <Ethereum className="w-6 h-6" />,
  },
  USDT: {
    name: "Tether",
    network: "TRC20",
    address: "TABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ab",
    icon: <Tether className="w-6 h-6" />,
  },
  USDC: {
    name: "USD Coin",
    network: "ERC20",
    address: "0x9876FeDcBa0987654321fedcba9876543210FeDc",
    icon: <Usdc className="w-6 h-6" />,
  },
};

const Deposit = () => {
  const { toast } = useToast();
  const [selectedCoin, setSelectedCoin] = useState('BTC');

  const handleCopy = () => {
    navigator.clipboard.writeText(coinData[selectedCoin].address);
    toast({ title: `${coinData[selectedCoin].name} address copied!` });
  };
  
  const handleDeposit = () => {
    toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  };
  
  return (
    <>
      <Helmet>
        <title>Deposit - NovaTrade AI</title>
        <meta name="description" content="Deposit cryptocurrency into your NovaTrade AI account." />
      </Helmet>
      <div className="p-4 sm:p-6 lg:p-8 flex justify-center items-center min-h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg bg-gradient-to-br from-gray-900 to-green-950/20 border border-green-500/30 rounded-2xl p-8 card-glow"
        >
          <div className="flex items-center gap-3 mb-6">
            <Droplets className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold text-green-400 glow-green">Deposit Crypto</h1>
          </div>
          
          <p className="text-gray-400 mb-6">Select a currency and send the funds to the generated address to fund your account.</p>

          <div className="space-y-6">
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
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Your <span className="font-bold text-green-400">{selectedCoin}</span> Deposit Address</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  value={coinData[selectedCoin].address}
                  className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg pr-12 pl-4 py-3 text-white truncate"
                />
                <Button onClick={handleCopy} variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400">
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Network: {coinData[selectedCoin].network}</p>
            </div>

            <div className="text-center bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                <p className="font-bold text-green-300">Important</p>
                <p className="text-sm text-gray-300">Only send <span className="font-semibold">{selectedCoin}</span> via the <span className="font-semibold">{coinData[selectedCoin].network}</span> network. Sending other assets or using a different network may result in permanent loss of funds.</p>
            </div>

            <Button onClick={handleDeposit} className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3">
              I've Made a Deposit
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Deposit;
