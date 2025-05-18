
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © 2025 Kaiken. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/events" className="hover:text-foreground">Markets</Link>
            <a href="#" className="hover:text-foreground">About</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
