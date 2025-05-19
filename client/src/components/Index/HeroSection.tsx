import { ArrowRight, CheckCircle, LineChart, TrendingUp } from 'lucide-react'
import React from 'react'
import HeartCoin from '../HeartCoin'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

export default function HeroSection() {
    return (
        <section className="hero-gradient relative overflow-hidden py-10 md:py-12 border-b border-border">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]"></div>
            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-center gap-12">
                    <div className="md:w-1/2 space-y-6">
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium mb-4">
                            <TrendingUp size={14} className="mr-2" />
                            <span>Trading markets now live</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            <span className="block">Predict. Trade.</span>
                            <span className="text-accent">Profit.</span>
                        </h1>
                        <p className="text-accent-600 text-2xl font-semibold mb-6 max-w-lg">
                            Kaiken — Where Risk Becomes Reward
                        </p>
                        <p className="text-lg md:text-lg text-muted-foreground mb-6 max-w-lg">
                            Trade on real-world events with confidence. Buy YES or NO shares and earn profits when your predictions
                            come true.
                        </p>

                        <div className="bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20 border border-pink-200 dark:border-pink-800 rounded-xl p-6 mb-8">
                            <div className="flex items-center mb-3">
                                <HeartCoin amount="" />
                                <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-300">Trading with Heart Coins</h3>
                            </div>
                            <p className="text-pink-600 dark:text-pink-400 text-sm leading-relaxed">
                                Heart Coins remind us that beyond markets and numbers, what truly matters is the heart behind every
                                choice. They symbolize the love we spread by empowering each other, encouraging honest predictions,
                                and celebrating the wins — big or small.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/events">
                                <Button size="lg" className="h-12 px-8 rounded-lg text-base">
                                    Explore Markets
                                    <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button size="lg" variant="outline" className="h-12 px-8 rounded-lg text-base">
                                    Sign Up Now
                                </Button>
                            </Link>
                        </div>
                        <div className="pt-6 flex items-center text-sm text-muted-foreground">
                            <CheckCircle size={16} className="text-accent mr-2" />
                            <span>Trusted by over 10,000 traders</span>
                        </div>
                    </div>
                    <div className="md:w-1/2 relative">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/20 rounded-full filter blur-3xl"></div>
                        <div className="glass-card rounded-2xl p-8 relative shadow-xl shadow-accent/5 floating-element">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 bg-accent/20 rounded-full flex items-center justify-center">
                                        <LineChart size={24} className="text-accent" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="font-semibold">Will RCB win the IPL 2025?</h3>
                                        <p className="text-sm text-muted-foreground">Ends in 10 days</p>
                                    </div>
                                </div>
                                <div className="bg-market-yes/10 text-market-yes text-sm font-medium py-1 px-3 rounded-full">
                                    Live
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Current Yes Price</span>
                                    <span className="text-lg font-bold">
                                        <HeartCoin amount="0.76" />
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-accent rounded-full" style={{ width: "76%" }}></div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>0%</span>
                                    <span>50%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button className="bg-market-yes text-white font-medium py-2 px-6 rounded-lg w-1/2">Buy YES</button>
                                <button className="bg-market-no text-white font-medium py-2 px-6 rounded-lg w-1/2">Buy NO</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
