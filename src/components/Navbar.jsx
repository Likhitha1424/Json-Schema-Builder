export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm py-3 px-6 flex items-center justify-between">
      <span className="text-lg font-semibold text-primary">SchemaBuilder</span>
      <div className="hidden md:flex space-x-6 text-sm text-gray-700">
        <a href="#builder" className="hover:text-primary transition-colors">Builder</a>
        <a href="#json" className="hover:text-primary transition-colors">JSON</a>
      </div>
      <div className="md:hidden">
        <button className="text-gray-700 focus:outline-none">☰</button>
      </div>
    </nav>
  );
}