import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LifestyleInflationCalculator = () => {
    const [inputs, setInputs] = useState({
        currentMonthlyExpenses: 3000,
        newExpenseCost: 150,
        expenseFrequency: 'monthly', // 'weekly', 'monthly', 'yearly'
        inflationRate: 3, // annual %
        timeHorizon: 10, // years
        investmentReturn: 7 // annual %
    });

    const results = useMemo(() => {
        let annualBaseExpense = 0;
        switch (inputs.expenseFrequency) {
            case 'weekly': annualBaseExpense = inputs.newExpenseCost * 52; break;
            case 'monthly': annualBaseExpense = inputs.newExpenseCost * 12; break;
            case 'yearly': annualBaseExpense = inputs.newExpenseCost; break;
            default: annualBaseExpense = 0;
        }

        let cumulativeCost = 0;
        let potentialWealth = 0;
        const data = [];

        let currentAnnualCost = annualBaseExpense;

        for (let year = 1; year <= inputs.timeHorizon; year++) {
            // Cost Side: Adjusted for inflation
            cumulativeCost += currentAnnualCost;

            // Wealth Side: Compound Interest
            // Assume contributions happen throughout the year, simplified to end of year for calculation + growth
            // Previous wealth grows
            potentialWealth = potentialWealth * (1 + inputs.investmentReturn / 100);
            // Add new contribution (which is the money relevant to the expense)
            potentialWealth += currentAnnualCost;
            // Note: This matches "Opportunity Cost" -> If I saved this money instead of spending it.

            data.push({
                year: `Year ${year}`,
                "Cumulative Cost": Math.round(cumulativeCost),
                "Potential Wealth": Math.round(potentialWealth)
            });

            // Inflate expense for next year
            currentAnnualCost *= (1 + inputs.inflationRate / 100);
        }

        const trueLongTermCost = cumulativeCost;
        const opportunityCost = potentialWealth;
        const inflationImpact = cumulativeCost - (annualBaseExpense * inputs.timeHorizon);

        return {
            annualBaseExpense,
            trueLongTermCost,
            opportunityCost,
            inflationImpact,
            data
        };
    }, [inputs]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: name === 'expenseFrequency' ? value : (parseFloat(value) || 0)
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
                        <h1 className="text-3xl font-bold text-gray-900">Lifestyle Inflation Calculator</h1>
                        <p className="text-gray-600">How much will this lifestyle change really cost you?</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                        {/* LEFT: Inputs */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col h-fit">
                            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">💸</span> Expense Details
                            </h2>

                            <div className="space-y-6">
                                {/* New Expense */}
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-900 mb-4">New Recurring Expense</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Cost ($)</label>
                                            <input type="number" name="newExpenseCost" value={inputs.newExpenseCost} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Frequency</label>
                                            <select name="expenseFrequency" value={inputs.expenseFrequency} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                                <option value="yearly">Yearly</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Economic Assumptions */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Assumptions</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Inflation Rate (%)</label>
                                            <input type="number" name="inflationRate" value={inputs.inflationRate} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Time Horizon (Years)</label>
                                            <input type="number" name="timeHorizon" value={inputs.timeHorizon} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Investment Return (%) <span className="text-gray-400 font-normal text-xs">(for opportunity cost)</span></label>
                                        <input type="number" name="investmentReturn" value={inputs.investmentReturn} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>

                                {/* Context (Optional) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Monthly Expenses ($)</label>
                                    <input type="number" name="currentMonthlyExpenses" value={inputs.currentMonthlyExpenses} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    <p className="text-xs text-gray-500 mt-1">Used to contextualize the impact.</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Results & Charts */}
                        <div className="flex flex-col gap-6">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                    <h3 className="text-red-800 text-xs font-bold uppercase tracking-wider mb-1">True Cost (Adjusted)</h3>
                                    <p className="text-3xl font-bold text-gray-900">${Math.round(results.trueLongTermCost).toLocaleString()}</p>
                                    <p className="text-xs text-red-700 mt-1">Total spent over {inputs.timeHorizon} years</p>
                                </div>
                                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                    <h3 className="text-green-800 text-xs font-bold uppercase tracking-wider mb-1">Opportunity Cost</h3>
                                    <p className="text-3xl font-bold text-gray-900">${Math.round(results.opportunityCost).toLocaleString()}</p>
                                    <p className="text-xs text-green-700 mt-1">If invested at {inputs.investmentReturn}% instead</p>
                                </div>
                            </div>

                            {/* Insight Card */}
                            <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg">
                                <p className="text-lg leading-relaxed">
                                    That <strong>${inputs.newExpenseCost} {inputs.expenseFrequency}</strong> expense seems small, but it could be worth <span className="font-bold text-yellow-300">${Math.round(results.opportunityCost).toLocaleString()}</span> in wealth over {inputs.timeHorizon} years.
                                </p>
                            </div>

                            {/* Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex-grow min-h-[300px] flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Spending vs. Wealth Potential</h3>
                                <div className="flex-grow w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={results.data}
                                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis
                                                dataKey="year"
                                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                tickFormatter={(value) => `$${value / 1000}k`}
                                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                                            />
                                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                            <Area type="monotone" dataKey="Cumulative Cost" stroke="#EF4444" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2} />
                                            <Area type="monotone" dataKey="Potential Wealth" stroke="#10B981" fillOpacity={1} fill="url(#colorWealth)" strokeWidth={2} />
                                        </AreaChart>
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

export default LifestyleInflationCalculator;
