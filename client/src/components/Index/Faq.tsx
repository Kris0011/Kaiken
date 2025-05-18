import React from 'react'

export default function Faq() {
    return (
        <section className="py-16 bg-muted/20">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Get answers to the most common questions about our prediction markets
                    </p>
                </div>
                <div className="max-w-3xl mx-auto space-y-4">
                    {[
                        {
                            question: "What are Heart Coins and how do they work?",
                            answer:
                                "Heart Coins are our platform's currency used for trading on prediction markets. They symbolize the community aspect of our platform and can be earned through accurate predictions and participation.",
                        },
                        {
                            question: "How are markets resolved?",
                            answer:
                                "Markets are resolved based on real-world outcomes of events. Our team verifies the results using reliable sources to ensure accuracy and fairness in all resolutions.",
                        },
                        {
                            question: "Can I create my own prediction market?",
                            answer:
                                "Currently, only admins or authorized users can create new prediction markets. If you would like access, please email krishp759@gmail.com for more information.",
                        },
                        {
                            question: "How do I withdraw my earnings?",
                            answer:
                                "You can withdraw your Heart Coin earnings to your connected wallet at any time from your account dashboard. Withdrawals typically process within 24 hours.",
                        },
                    ].map((faq, index) => (
                        <div key={index} className="glass-card rounded-xl p-6">
                            <h4 className="font-semibold text-lg mb-2">{faq.question}</h4>
                            <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
