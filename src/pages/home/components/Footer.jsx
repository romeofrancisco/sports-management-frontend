import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-primary dark:bg-primary/70 text-white py-12">
      {/* <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-secondary" />
              <div>
                <h3 className="font-bold">ALTAS Sports</h3>
                <p className="text-xs text-white/70">Management System</p>
              </div>
            </div>
            <p className="text-white/70 text-sm">
              Empowering UPHSD Molino athletics with comprehensive sports management tools.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><Link to="/login" className="hover:text-secondary transition-colors">Sign In</Link></li>
              <li><a href="#" className="hover:text-secondary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Sports Programs</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><a href="#" className="hover:text-secondary transition-colors">Basketball</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Volleyball</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Swimming</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Taekwondo</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><a href="#" className="hover:text-secondary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Documentation</a></li>
              <li><Link to="/privacy-policy" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8"> */}
          <p className="text-white/70 text-sm text-center">
            © 2024 UPHSD Molino Campus Sports Management System. All rights reserved.
          </p>
        {/* </div>
      </div> */}
    </footer>
  )
}

export default Footer
