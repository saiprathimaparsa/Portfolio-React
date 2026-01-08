import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RentVsBuyCalculator = () => {
    const [inputs, setInputs] = useState({
        monthlyRent: 2000,
        homePrice: 400000,
        downPaymentPercent: 20,
        mortgageRate: 6.5,
        loanTerm: 30,
        propertyTaxRate: 1.2,
        maintenanceRate: 1, // annual %
        yearsToStay: 7
    });

    const calculateDecision = useMemo(() => {
        // Constants / Assumptions not in main UI
        const homeInsurance = 1500;
        const appreciationRate = 3;
        const rentInflation = 3;
        const investmentReturn = 7;

        let rentCost = 0;
        let buyCost = 0;
        let homeValue = inputs.homePrice;
        let loanBalance = inputs.homePrice * (1 - inputs.downPaymentPercent / 100);
        const monthlyRate = inputs.mortgageRate / 100 / 12;
        const numberOfPayments = inputs.loanTerm * 12;

        const monthlyMortgage =
            (loanBalance * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        const initialCostBuy = inputs.homePrice * (inputs.downPaymentPercent / 100) + (inputs.homePrice * 0.03); // Down payment + 3% closing
        const initialCostRent = inputs.monthlyRent; // Security deposit

        let investmentRent = initialCostBuy - initialCostRent;
        let data = [];
        let breakEvenYear = null;

        let currentRent = inputs.monthlyRent;

        for (let year = 1; year <= 30; year++) { // Calculate up to 30 years to find break-even
            let yearlyRentCost = currentRent * 12;

            // Interest vs Principal
            let yearlyInterest = 0;
            for (let m = 0; m < 12; m++) {
                const interestPayment = loanBalance * monthlyRate;
                const principalPayment = monthlyMortgage - interestPayment;
                yearlyInterest += interestPayment;
                loanBalance -= principalPayment;
            }
            if (loanBalance < 0) loanBalance = 0;

            // Opportunity cost gain
            investmentRent *= (1 + investmentReturn / 100);

            rentCost += yearlyRentCost;

            // Unrecoverable Buy Costs: Interest + Tax + Insurance + Maintenance - Appreciation
            // Tax, Insurance, Maintenance increase with home value? Simplified: yes for tax/maint, no for insurance here
            const yearlyTax = homeValue * (inputs.propertyTaxRate / 100);
            const yearlyMaint = homeValue * (inputs.maintenanceRate / 100);
            const yearlyAppreciation = homeValue * (appreciationRate / 100);

            const unrecoverableBuy = yearlyInterest + yearlyTax + homeInsurance + yearlyMaint - yearlyAppreciation;
            buyCost += unrecoverableBuy;

            homeValue *= (1 + appreciationRate / 100);
            currentRent *= (1 + rentInflation / 100);

            // Net Position at End of Year
            // For Renters: Total Rent Paid - Investment Gains
            // For Buyers: Total Unrecoverable Costs + (Initial Cost - Sale Proceeds... ignored here as simplified "Net Cost" view)
            // Let's stick to the "Net Cost" metric used before: Total Sunk Costs
            // Rent Sunk: Rent Paid - Returns on saved downpayment
            // Buy Sunk: Interest + Tax + Ins + Maint + Buying/Selling Fees - Appreciation

            // Buying/Selling Fees amortized? Or just final lumpsum?
            // To find break-even, strict comparison of Net Worth is better, but cost is easier to graph.
            // Let's align with "Total Cost" view.

            const netRent = rentCost - (investmentRent - (initialCostBuy - initialCostRent)); // Profit from investing downpayment
            const netBuy = buyCost + (inputs.homePrice * 0.03) + (homeValue * 0.06); // + Closing Costs + Selling Fees (if sold)

            // Break Even Check
            if (breakEvenYear === null && netBuy < netRent) {
                breakEvenYear = year;
            }

            if (year <= inputs.yearsToStay) {
                data.push({
                    year: `Year ${year}`,
                    Renting: Math.round(netRent),
                    Buying: Math.round(netBuy),
                });
            }
        }

        // Final values for selected duration
        const finalNetRent = data[data.length - 1].Renting;
        const finalNetBuy = data[data.length - 1].Buying;

        return {
            data,
            finalNetBuy,
            finalNetRent,
            breakEvenYear,
            isBuyingCheaper: finalNetBuy < finalNetRent
        };
    }, [inputs]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
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
                        <h1 className="text-3xl font-bold text-gray-900">Rent vs Buy Calculator</h1>
                        <p className="text-gray-600">Should you rent or buy right now?</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                        {/* LEFT: Inputs */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col h-fit">
                            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">📝</span> Input Details
                            </h2>

                            <div className="space-y-6">
                                {/* Monthly Rent */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent ($)</label>
                                    <input type="number" name="monthlyRent" value={inputs.monthlyRent} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                </div>

                                {/* Home Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Home Price ($)</label>
                                    <input type="number" name="homePrice" value={inputs.homePrice} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment (%)</label>
                                        <input type="number" name="downPaymentPercent" value={inputs.downPaymentPercent} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mortgage Rate (%)</label>
                                        <input type="number" name="mortgageRate" value={inputs.mortgageRate} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (Years)</label>
                                        <input type="number" name="loanTerm" value={inputs.loanTerm} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Stay (Years)</label>
                                        <input type="number" name="yearsToStay" value={inputs.yearsToStay} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Tax (%)</label>
                                        <input type="number" name="propertyTaxRate" value={inputs.propertyTaxRate} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance (%)</label>
                                        <input type="number" name="maintenanceRate" value={inputs.maintenanceRate} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Results & Charts */}
                        <div className="flex flex-col gap-6">
                            {/* Recommendation Card */}
                            <div className="bg-indigo-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-bold mb-4">Recommendation</h2>
                                    <p className="text-lg leading-relaxed opacity-90 mb-4">
                                        If you plan to stay for <strong>{inputs.yearsToStay} years</strong>,
                                        it is financially better to <span className="font-bold text-yellow-300 text-xl px-2 py-1 bg-white/10 rounded">{calculateDecision.isBuyingCheaper ? "BUY" : "RENT"}</span>.
                                    </p>
                                    <div className="text-sm bg-black/20 p-4 rounded-lg inline-block">
                                        <p>Break-even Point: <span className="font-bold text-yellow-300">{calculateDecision.breakEvenYear ? `Year ${calculateDecision.breakEvenYear}` : "Not within 30 years"}</span></p>
                                    </div>
                                </div>
                                {/* Decorative circle */}
                                <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                            </div>

                            {/* Cost Comparison Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                    <h3 className="text-red-800 text-xs font-bold uppercase tracking-wider mb-1">Total Cost Renting</h3>
                                    <p className="text-2xl font-bold text-gray-900">${Math.round(calculateDecision.finalNetRent).toLocaleString()}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                    <h3 className="text-green-800 text-xs font-bold uppercase tracking-wider mb-1">Total Cost Buying</h3>
                                    <p className="text-2xl font-bold text-gray-900">${Math.round(calculateDecision.finalNetBuy).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex-grow min-h-[300px] flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Cumulative Cost Analysis</h3>
                                <div className="flex-grow w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={calculateDecision.data}
                                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                        >
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
                                                cursor={{ fill: '#F3F4F6' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                                            />
                                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                            <Bar dataKey="Renting" name="Total Rent Cost" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                            <Bar dataKey="Buying" name="Total Buy Cost" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={50} />
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

export default RentVsBuyCalculator;
