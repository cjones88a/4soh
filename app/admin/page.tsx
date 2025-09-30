import dynamic from 'next/dynamic';
const AdminClient = dynamic(() => import('./AdminClient'), { ssr: false });

export default function AdminPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>
      <AdminClient />
    </div>
  );
}
