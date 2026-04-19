function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">SkillSakhi</h1>

        <div className="space-x-6 text-gray-700 font-medium">
          <a href="#home" className="hover:text-blue-600 transition">Home</a>
          <a href="#about" className="hover:text-blue-600 transition">About</a>
          <a href="#contact" className="hover:text-blue-600 transition">Contact Us</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;