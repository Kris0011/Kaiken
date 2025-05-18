import React from 'react'
import { Button } from '../ui/button'

export default function ReferalProgram() {
    return (
        <section className="py-16 bg-gradient-to-br from-background to-accent/5 border-t border-border">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="md:w-1/2">
                        <div className="bg-accent/10 text-accent text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                            Community Program
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Grow Together</h2>
                        <p className="text-muted-foreground mb-6">
                            Join our thriving community of traders and earn rewards by inviting friends to the platform. The more
                            your network grows, the more Heart Coins you can earn through our referral program.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="bg-accent/20 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-accent"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Invite Friends</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Share your unique referral link with friends and colleagues
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-accent/20 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-accent"
                                    >
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Earn Rewards</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Get Heart Coins for each friend who joins and makes their first trade
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-accent/20 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-accent"
                                    >
                                        <path d="M20 6 9 17l-5-5"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Unlock Benefits</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Access exclusive markets and features as your network grows
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Button size="lg" className="h-12 px-8 rounded-lg text-base">
                                Start Referring
                            </Button>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/20 rounded-full filter blur-3xl"></div>
                            <div className="relative z-10 bg-background p-6 rounded-3xl shadow-xl border border-border">
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold mb-2">Your Referral Stats</h3>
                                    <p className="text-sm text-muted-foreground">Track your community growth</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-muted/20 rounded-xl p-4 text-center">
                                        <div className="text-3xl font-bold text-accent mb-1">0</div>
                                        <div className="text-xs text-muted-foreground">Friends Invited</div>
                                    </div>
                                    <div className="bg-muted/20 rounded-xl p-4 text-center">
                                        <div className="text-3xl font-bold text-accent mb-1">0</div>
                                        <div className="text-xs text-muted-foreground">Heart Coins Earned</div>
                                    </div>
                                </div>
                                <div className="bg-muted/10 rounded-xl p-4 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">Your Referral Link</span>
                                        <button className="text-xs text-accent">Copy</button>
                                    </div>
                                    <div className="bg-background rounded-lg p-3 text-sm text-muted-foreground border border-border overflow-hidden text-ellipsis">
                                        https://platform.com/ref/yourname
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="flex space-x-4">
                                        <button className="bg-[#1877F2] text-white w-10 h-10 rounded-full flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                            </svg>
                                        </button>
                                        <button className="bg-[#1DA1F2] text-white w-10 h-10 rounded-full flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                            </svg>
                                        </button>
                                        <button className="bg-[#0077B5] text-white w-10 h-10 rounded-full flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                                <rect x="2" y="9" width="4" height="12"></rect>
                                                <circle cx="4" cy="4" r="2"></circle>
                                            </svg>
                                        </button>
                                        <button className="bg-[#25D366] text-white w-10 h-10 rounded-full flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </section >
    )
}
