import { Link } from "react-router-dom";
import { Button } from "../ui/button";



export default function HowItWorks() {
    return (
        <section className="py-20 bg-gradient-to-br from-accent/5 to-background border-t border-b border-border">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Start trading on prediction markets in just three simple steps
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="glass-card rounded-xl p-8 text-center">
                        <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <span className="text-2xl font-bold text-accent">1</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-4">Browse Markets</h3>
                        <p className="text-muted-foreground">
                            Explore prediction markets across various categories and see the current probabilities.
                        </p>
                    </div>

                    <div className="glass-card rounded-xl p-8 text-center">
                        <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <span className="text-2xl font-bold text-accent">2</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-4">Place Trades</h3>
                        <p className="text-muted-foreground">
                            Buy YES or NO shares based on what you think will happen in a given event.
                        </p>
                    </div>

                    <div className="glass-card rounded-xl p-8 text-center">
                        <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <span className="text-2xl font-bold text-accent">3</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-4">Collect Profits</h3>
                        <p className="text-muted-foreground">
                            If your prediction is correct, you'll receive payouts when the market resolves.
                        </p>
                    </div>
                </div>

                <div className="text-center mt-16">
                    <Link to="/register">
                        <Button size="lg" className="h-12 px-8 rounded-lg text-base">
                            Get Started Now
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
