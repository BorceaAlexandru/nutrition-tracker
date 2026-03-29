import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link"; 

export default async function Home() {
  //get data from client
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-800">
        Nutrition Tracker 
      </h1>
      <p className="text-slate-600 mt-2 mb-6">
        aici construiesc
      </p>

      {/* status client */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200 inline-block">
        {session ? (
          <div>
            <p className="text-slate-600 mb-4">
              Hi, <span className="font-semibold text-slate-900">{session.user?.name}</span>!
            </p>
            <Link 
              href="/api/auth/signout" 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Log out
            </Link>
          </div>
        ) : (
           //if user isnt logged in
          <div>
            <p className="text-slate-600 mb-4">You are not logged in.</p>
            <Link 
              href="/api/auth/signin" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Log in cu Google
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}