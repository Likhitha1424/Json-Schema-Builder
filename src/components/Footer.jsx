
export default function Footer() {
  return (
    <footer className="bg-card shadow-inner px-6 py-4 text-sm text-muted-foreground border-t border-border">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <span>&copy; {new Date().getFullYear()} SchemaBuilder Inc. All rights reserved.</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs italic">Designed & Developed with ❤️ by</span>
          <span className="font-medium text-primary">Likhitha Gangisetty</span>
        </div>
      </div>
    </footer>
  );
}
