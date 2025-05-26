export default function Footer() {
  return (
    <footer className="bg-gray-900 text-light py-6">
      <div className="container mx-auto text-center">
        © {new Date().getFullYear()} AutoDex – Všetky práva vyhradené.
      </div>
    </footer>
  );
}
