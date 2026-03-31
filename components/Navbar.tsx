import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-slate-800">
               NutriTrack
            </Link>
            
            {session && (
              <div className="hidden md:flex space-x-6">
                <Link href="/recipes" className="text-slate-600 hover:text-slate-900 font-medium">Recipies</Link>
                <Link href="/planner" className="text-slate-600 hover:text-slate-900 font-medium">Planner</Link>
                <Link href="/journal" className="text-slate-600 hover:text-slate-900 font-medium">Jurnal</Link>
                <Link href="/progress" className="text-slate-600 hover:text-slate-900 font-medium">Progress</Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500 hidden sm:block">
                  Hi, {session.user?.name?.split(' ')[0]}
                </span>
                <Link 
                  href="/api/auth/signout" 
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Log out
                </Link>
              </div>
            ) : (
              <Link 
                href="/api/auth/signin" 
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}