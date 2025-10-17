import { useState } from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button, Input } from "../components/ui";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim() || !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    setSubscribing(true);
    await new Promise((r) => setTimeout(r, 1500)); // fake loading
    setSubscribing(false);
    setSubscribed(true);
  };

  return (
    <footer className="w-full border-t border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))]">
      <div className="app-container grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
        {/* Logo + About */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[rgb(var(--fg))] mb-3">ShopEase</h2>
          <p className="text-sm leading-relaxed">
            Your one-stop shop for fashion, electronics, and more.
            Quality products at the best prices with exceptional service.
          </p>
          <div className="flex space-x-4 pt-2">
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-[rgb(var(--fg))] mb-3">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <span
                onClick={() => navigate("/")}
                className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1"
              >
                Home
              </span>
            </li>
            <li>
              <span
                onClick={() => navigate("/products")}
                className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1"
              >
                Shop
              </span>
            </li>
            <li>
              <span
                onClick={() => navigate("/contact")}
                className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1"
              >
                Contact
              </span>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-[rgb(var(--fg))] mb-3">Customer Support</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1">
                FAQs
              </span>
            </li>
            <li>
              <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1">
                Shipping Info
              </span>
            </li>
            <li>
              <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1">
                Returns & Exchanges
              </span>
            </li>
            <li>
              <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1">
                Track Your Order
              </span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-[rgb(var(--fg))] mb-3">Stay Updated</h3>
          <p className="text-sm mb-4 leading-relaxed">
            Subscribe to get special offers, free giveaways, and exclusive updates.
          </p>

          {!subscribed ? (
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                disabled={subscribing}
                className="w-full"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubscribe}
                disabled={subscribing}
                className="w-full"
              >
                {subscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          ) : (
            <div className="p-3 bg-green-700/20 border border-green-500/30 text-green-400 text-sm rounded-lg text-center">
              Subscribed ✅ Thank you!
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
        <div className="app-container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium text-[rgb(var(--muted))]">
            © {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[rgb(var(--muted))] hidden sm:block">Follow us:</span>
            <div className="flex gap-4 text-[rgb(var(--muted))]">
              <div className="p-2 rounded-full hover:bg-[rgb(var(--card))] transition-all duration-200 group cursor-pointer">
                <Facebook className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" size={18} />
              </div>
              <div className="p-2 rounded-full hover:bg-[rgb(var(--card))] transition-all duration-200 group cursor-pointer">
                <Instagram className="group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" size={18} />
              </div>
              <div className="p-2 rounded-full hover:bg-[rgb(var(--card))] transition-all duration-200 group cursor-pointer">
                <Twitter className="group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors" size={18} />
              </div>
              <div className="p-2 rounded-full hover:bg-[rgb(var(--card))] transition-all duration-200 group cursor-pointer">
                <Youtube className="group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
