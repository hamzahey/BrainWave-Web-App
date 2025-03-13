import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-lg font-bold">BrainWave</h1>
        <div className="space-x-4">
          <Link href="/auth/login" className="hover:underline">Login</Link>
          <Link href="/auth/register" className="hover:underline">Register</Link>
          <Link href="/inference" className="hover:underline">Inference</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
