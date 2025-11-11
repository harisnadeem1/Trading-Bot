import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit2, Trash2, X, DollarSign, Calendar, TrendingUp, FileText } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';

// const mockPlans = [
//   { 
//     id: 1,
//     name: 'Starter Plan', 
//     description: 'Perfect for beginners starting their investment journey',
//     roi: 4, 
//     duration: 30, 
//     minAmount: 50,
//     maxAmount: 74999,
//     autoRoi: true
//   },
//   { 
//     id: 2,
//     name: 'Advanced Plan', 
//     description: 'For experienced investors seeking better returns',
//     roi: 6, 
//     duration: 30, 
//     minAmount: 75000,
//     maxAmount: 99999,
//     autoRoi: true
//   },
//   { 
//     id: 3,
//     name: 'Pro Plan', 
//     description: 'Premium plan with extended duration',
//     roi: 8, 
//     duration: 60, 
//     minAmount: 100000,
//     maxAmount: 249999,
//     autoRoi: true
//   },
//   { 
//     id: 4,
//     name: 'Whale Plan', 
//     description: 'Exclusive plan for high-value investors',
//     roi: 10, 
//     duration: 90, 
//     minAmount: 250000,
//     maxAmount: 999999999,
//     autoRoi: true
//   },
// ];

const AdminPlans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minAmount: '',
    maxAmount: '',
    roi: '',
    autoRoi: true,
    duration: 30
  });
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

 useEffect(() => {
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/plans`);
      if (res.data.success) {
        const formatted = res.data.data.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          minAmount: Number(p.min_amount),
          maxAmount: Number(p.max_amount),
          roi: Number(p.roi),
          duration: p.duration,
          autoRoi: p.auto_roi,
        }));
        setPlans(formatted);
      } else {
        console.error("Failed to fetch plans");
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchPlans();
}, []);



  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        description: plan.description,
        minAmount: plan.minAmount,
        maxAmount: plan.maxAmount,
        roi: plan.roi,
        autoRoi: plan.autoRoi,
        duration: plan.duration
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        description: '',
        minAmount: '',
        maxAmount: '',
        roi: '',
        autoRoi: true,
        duration: 30
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const planData = {
      name: formData.name,
      description: formData.description,
      minAmount: parseFloat(formData.minAmount),
      maxAmount: parseFloat(formData.maxAmount),
      roi: parseFloat(formData.roi),
      autoRoi: formData.autoRoi,
      duration: parseInt(formData.duration)
    };

    try {
      if (editingPlan) {
        // Update existing plan
        await axios.put(`${API_BASE}/admin/plans/${editingPlan.id}`, planData);
      } else {
        // Create new plan
        await axios.post(`${API_BASE}/admin/plans`, planData);
      }

      // Refresh plans after save
      const res = await axios.get(`${API_BASE}/admin/plans`);
      if (res.data.success) setPlans(res.data.data);

      handleCloseModal();
    } catch (err) {
      console.error("Error saving plan:", err);
    }
  };


  const handleDelete = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      await axios.delete(`${API_BASE}/admin/plans/${planId}`);
      setPlans(prev => prev.filter(p => p.id !== planId));
    } catch (err) {
      console.error("Error deleting plan:", err);
    }
  };


  return (
    <>
      <Helmet>
        <title>Manage Plans - Admin</title>
        <meta name="description" content="Add or edit investment plans." />
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-2 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Manage Investment Plans</h1>
            <p className="text-sm text-gray-400">Create and manage your investment plans</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#80ee64] hover:bg-[#70de54] text-[#0F1014] font-semibold transition-all duration-300"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Plan
          </motion.button>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#0F1014] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all duration-300"
            >
              {/* Plan Header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{plan.description}</p>
              </div>

              {/* ROI Display */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#80ee64]">{plan.roi}%</span>
                  <span className="text-sm text-gray-400">ROI</span>
                </div>
              </div>

              {/* Plan Details */}
              <div className="space-y-2 mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Range</span>
                  <span className="text-white font-medium">
                    $
                    {Number(plan.minAmount || 0).toLocaleString()} - $
                    {Number(plan.maxAmount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-medium">{plan.duration} Days</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Auto ROI</span>
                  <span className={`font-medium ${plan.autoRoi ? 'text-[#80ee64]' : 'text-gray-400'}`}>
                    {plan.autoRoi ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenModal(plan)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDelete(plan.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 transition-all text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add/Edit Plan Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#0F1014] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingPlan ? 'Edit Plan' : 'Add New Plan'}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {editingPlan ? 'Update plan details' : 'Create a new investment plan'}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Modal Body - Scrollable */}
                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
                  <div className="p-6 space-y-5">
                    {/* Plan Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Plan Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Starter Plan"
                          required
                          className="w-full bg-[#181A20] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#80ee64]/50 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Brief description of the plan"
                        rows={3}
                        className="w-full bg-[#181A20] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#80ee64]/50 transition-colors resize-none"
                      />
                    </div>

                    {/* Amount Range */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Minimum Amount <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="number"
                            name="minAmount"
                            value={formData.minAmount}
                            onChange={handleInputChange}
                            placeholder="50"
                            required
                            min="0"
                            step="0.01"
                            className="w-full bg-[#181A20] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#80ee64]/50 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Maximum Amount <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="number"
                            name="maxAmount"
                            value={formData.maxAmount}
                            onChange={handleInputChange}
                            placeholder="74999"
                            required
                            min="0"
                            step="0.01"
                            className="w-full bg-[#181A20] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#80ee64]/50 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ROI and Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Monthly ROI (%) <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="number"
                            name="roi"
                            value={formData.roi}
                            onChange={handleInputChange}
                            placeholder="4.5"
                            required
                            min="0"
                            max="100"
                            step="0.001"
                            className="w-full bg-[#181A20] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#80ee64]/50 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Duration (Days) <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            placeholder="30"
                            required
                            min="1"
                            className="w-full bg-[#181A20] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#80ee64]/50 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Auto ROI Generation */}
                    <div className="flex items-center gap-3 p-4 bg-[#181A20] border border-white/5 rounded-xl">
                      <input
                        type="checkbox"
                        id="autoRoi"
                        name="autoRoi"
                        checked={formData.autoRoi}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-white/20 bg-[#0F1014] text-[#80ee64] focus:ring-[#80ee64] focus:ring-offset-0"
                      />
                      <label htmlFor="autoRoi" className="flex-1 cursor-pointer">
                        <span className="text-sm font-medium text-white block">Auto ROI Generation</span>
                        <span className="text-xs text-gray-400">Automatically generate ROI for investments</span>
                      </label>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center gap-3 p-6 border-t border-white/5">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all font-medium"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-3 rounded-xl bg-[#80ee64] hover:bg-[#70de54] text-[#0F1014] transition-all font-semibold"
                    >
                      {editingPlan ? 'Update Plan' : 'Create Plan'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPlans;