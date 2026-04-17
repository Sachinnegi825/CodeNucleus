
export default function TopStaffList({ coders }) {
  return (
    <div className="space-y-4">
      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4">Top Coding Staff</p>
      {coders?.length > 0 ? coders?.map((coder, i) => (
        <div key={i} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs text-brand font-bold">
              {coder?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-200 truncate w-32">{coder?.email}</span>
              <span className="text-[9px] text-slate-500 uppercase font-mono">Real-time Data</span>
            </div>
          </div>
          <span className="text-xs font-bold text-white bg-slate-900 px-2 py-1 rounded border border-slate-700">
            {coder?.count} Files
          </span>
        </div>
      )) : (
        <p className="text-xs text-slate-600 italic">No employee activity tracked yet.</p>
      )}
    </div>
  );
}