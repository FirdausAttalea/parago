export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Fleet Management Dashboard
      </h1>
      <p className="text-gray-500 mt-2">
        Sistem pemantauan armada real-time.
      </p>
      
      {/* Area untuk peta atau konten lainnya nanti */}
      <div className="mt-8">
        <div className="w-full h-[600px] bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
          <p className="text-gray-400">Area Peta akan dimuat di sini</p>
        </div>
      </div>
    </main>
  );
}