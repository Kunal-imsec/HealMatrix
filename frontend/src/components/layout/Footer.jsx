import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  ExternalLink,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  // Don't show footer for patients to keep interface clean
  const shouldShowDetailedFooter = ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'].includes(user?.role);

  if (!shouldShowDetailedFooter) {
    return (
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <span>© {currentYear} Hospital Management System.</span>
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for better healthcare.</span>
            </div>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              <Link to="/privacy" className="hover:text-gray-700 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-gray-700 transition-colors">
                Terms
              </Link>
              <Link to="/help" className="hover:text-gray-700 transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">HMS</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Comprehensive hospital management system designed to streamline healthcare operations 
              and improve patient care delivery.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/patients" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Patients
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Appointments
                </Link>
              </li>
              <li>
                <Link to="/reports" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Reports
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center">
                  Documentation
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </li>
              <li>
                <Link to="/api-docs" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center">
                  API Documentation
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Send Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>123 Healthcare Ave, Medical District</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-gray-400" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +1 (234) 567-8900
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href="mailto:support@hms.com" className="hover:text-white transition-colors">
                  support@hms.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Globe className="h-4 w-4 text-gray-400" />
                <a href="https://hms.com" className="hover:text-white transition-colors">
                  www.hms.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>© {currentYear} Hospital Management System.</span>
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for better healthcare.</span>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <div className="flex items-center space-x-1 text-gray-400">
                <Shield className="h-4 w-4" />
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>All Systems Operational</span>
                </div>
                <span>Version 1.0.0</span>
                <span>Last Updated: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <span>Powered by React & Spring Boot</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
