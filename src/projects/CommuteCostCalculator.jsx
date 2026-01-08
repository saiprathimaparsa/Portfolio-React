import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CommuteCostCalculator = () => {
    const [inputs, setInputs] = useState({
        distance: 15, // miles one way
        daysPerWeek: 5,
        mode: 'car', // 'car' or 'transit'
        mpg: 25,
        gasPrice: 3.50,
        parkingCost: 0, // daily
        transitCost: 100, // monthly pass
        commuteTime: 45 // minutes one way
    });

    const results = useMemo(() => {
        const weeksPerYear = 50; // Assuming 2 weeks vacation
        const roundTripsPerWeek = inputs.daysPerWeek;
        const totalRoundTrips = roundTripsPerWeek * weeksPerYear;

        let yearlyFinancialCost = 0;

        if (inputs.mode === 'car') {
            const milesPerYear = inputs.distance * 2 * totalRoundTrips;
            const gallonsUsed = milesPerYear / inputs.mpg;
            const fuelCost = gallonsUsed * inputs.gasPrice;
            const parkingTotal = inputs.parkingCost * totalRoundTrips; // Assuming daily parking cost
            // Optional: Maintenance estimate (e.g., $0.09/mile) - keeping it simple for now as requested
            yearlyFinancialCost = fuelCost + parkingTotal;
        } else {
            // Transit: Assuming monthly pass covers everything
            yearlyFinancialCost = inputs.transitCost * 12;
        }

        const monthlyFinancialCost = yearlyFinancialCost / 12;

        // Time Calculations
        const minutesPerDay = inputs.commuteTime * 2;
        const hoursPerYear = (minutesPerDay * totalRoundTrips) / 60;
        const daysLostPerYear = hoursPerYear / 24;

        // Cost per Hour (Financial Cost / Time Spent)
        const costPerHour = hoursPerYear > 0 ? yearlyFinancialCost / hoursPerYear : 0;

        // Chart Data: Projection
        const data = [
            { name: '1 Year', Cost: Math.round(yearlyFinancialCost) },
            { name: '5 Years', Cost: Math.round(yearlyFinancialCost * 5) },
            { name: '10 Years', Cost: Math.round(yearlyFinancialCost * 10) },
        ];

        return {
            monthlyFinancialCost,
            yearlyFinancialCost,
            hoursPerYear,
            daysLostPerYear,
            costPerHour,
            data
        };
    }, [inputs]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: name === 'mode' ? value : (parseFloat(value) || 0)
        }));
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold text-gray-900">Commute Cost Calculator</h1>
                        <p className="text-gray-600">Is this job actually worth it after commute costs?</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                        {/* LEFT: Inputs */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col h-fit">
                            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">🚗</span> Commute Details
                            </h2>

                            <div className="space-y-6">
                                {/* Mode Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Transport Mode</label>
                                    <div className="flex bg-gray-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => setInputs(prev => ({ ...prev, mode: 'car' }))}
                                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${inputs.mode === 'car' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                        >
                                            Car (Drive)
                                        </button>
                                        <button
                                            onClick={() => setInputs(prev => ({ ...prev, mode: 'transit' }))}
                                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${inputs.mode === 'transit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                        >
                                            Public Transit
                                        </button>
                                    </div>
                                </div>

                                {/* Common Inputs */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Commute Days/Week</label>
                                        <input type="number" name="daysPerWeek" value={inputs.daysPerWeek} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" max="7" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">One-Way Time (min)</label>
                                        <input type="number" name="commuteTime" value={inputs.commuteTime} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>

                                {/* Mode Specific Inputs */}
                                {inputs.mode === 'car' ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">One-Way Miles</label>
                                                <input type="number" name="distance" value={inputs.distance} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Gas Price ($/gal)</label>
                                                <input type="number" name="gasPrice" value={inputs.gasPrice} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle MPG</label>
                                                <input type="number" name="mpg" value={inputs.mpg} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Parking ($)</label>
                                                <input type="number" name="parkingCost" value={inputs.parkingCost} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Transit Pass Cost ($)</label>
                                        <input type="number" name="transitCost" value={inputs.transitCost} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Results & Charts */}
                        <div className="flex flex-col gap-6">
                            {/* Summary Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                                    <h3 className="text-indigo-800 text-xs font-bold uppercase tracking-wider mb-1">Monthly Cost</h3>
                                    <p className="text-3xl font-bold text-gray-900">${Math.round(results.monthlyFinancialCost).toLocaleString()}</p>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                    <h3 className="text-purple-800 text-xs font-bold uppercase tracking-wider mb-1">Yearly Cost</h3>
                                    <p className="text-3xl font-bold text-gray-900">${Math.round(results.yearlyFinancialCost).toLocaleString()}</p>
                                </div>
                                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                    <h3 className="text-orange-800 text-xs font-bold uppercase tracking-wider mb-1">Time Lost / Year</h3>
                                    <p className="text-2xl font-bold text-gray-900">{Math.round(results.daysLostPerYear * 10) / 10} Days</p>
                                    <p className="text-xs text-orange-700 mt-1">({Math.round(results.hoursPerYear)} hours)</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                    <h3 className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">Cost / Commute Hour</h3>
                                    <p className="text-2xl font-bold text-gray-900">${results.costPerHour.toFixed(2)}</p>
                                    <p className="text-xs text-slate-500 mt-1">Price you pay to sit in traffic</p>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex-grow min-h-[300px] flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Cost Projection Over Time</h3>
                                <div className="flex-grow w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={results.data}
                                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                tickFormatter={(value) => `$${value.toLocaleString()}`}
                                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip
                                                cursor={{ fill: '#F3F4F6' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']}
                                            />
                                            <Bar dataKey="Cost" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={60} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CommuteCostCalculator;
