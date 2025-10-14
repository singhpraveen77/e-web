import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button, Input } from "../components/ui";

export default function Footer() {
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
              <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1">
                Home
              </a>
            </li>
            <li>
              <a href="/products" className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1">
                Shop
              </a>
            </li>
            <li>
              <a href="/deals" className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1">
                Deals
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-[rgb(var(--fg))] mb-3">Customer Support</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="/faqs" className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1">
                FAQs
              </a>
            </li>
            <li>
              <a href="/shipping" className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1">
                Shipping Info
              </a>
            </li>
            <li>
              <a href="/returns" className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1">
                Returns & Exchanges
              </a>
            </li>
            <li>
              <a href="/track-order" className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:pl-1">
                Track Your Order
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-[rgb(var(--fg))] mb-3">Stay Updated</h3>
          <p className="text-sm mb-4 leading-relaxed">
            Subscribe to get special offers, free giveaways, and exclusive updates.
          </p>
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full"
            />
            <Button 
              variant="primary" 
              size="sm" 
              className="w-full"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
        <div className="app-container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium text-[rgb(var(--muted))]">© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
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
