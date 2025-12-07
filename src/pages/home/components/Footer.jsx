import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-primary dark:bg-primary/70 text-center py-12">

      <p className="text-white/70 text-sm text-center">
        © 2025 UPHSD Molino Campus Sports Management System. All rights
        reserved.
      </p>
      <div className="mt-3 text-white/70 text-sm">
        <Link to="/privacy-policy" className="underline hover:text-white">
          Privacy Policy
        </Link>
        <span class="mx-1">|</span>
        <Link to="/terms" className="underline hover:text-white">
          Terms of Service
        </Link>
      </div>

    </footer>
  );
};

export default Footer;
