export default function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Company</h3>
                        <ul className="space-y-2">
                            <li><a href="/about" className="hover:text-white">About Us</a></li>
                            <li><a href="/contact" className="hover:text-white">Contact</a></li>
                            <li><a href="/careers" className="hover:text-white">Careers</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Resources</h3>
                        <ul className="space-y-2">
                            <li><a href="/blog" className="hover:text-white">Blog</a></li>
                            <li><a href="/documentation" className="hover:text-white">Documentation</a></li>
                            <li><a href="/support" className="hover:text-white">Support</a></li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Connect</h3>
                        <ul className="space-y-2">
                            <li><a href="https://twitter.com" className="hover:text-white">Twitter</a></li>
                            <li><a href="https://linkedin.com" className="hover:text-white">LinkedIn</a></li>
                            <li><a href="https://github.com" className="hover:text-white">GitHub</a></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center">
                    <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}