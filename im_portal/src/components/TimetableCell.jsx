import React from "react";

export default function TimetableCell({ entries, onClick }) {
    if (!entries || entries.length === 0) {
        return (
            <div
                onClick={onClick}
                className="h-full w-full min-h-[80px] hover:bg-slate-50 transition-colors cursor-pointer border-b border-r border-slate-100 p-1"
            >
                {/* Empty cell */}
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className="h-full w-full min-h-[80px] bg-white border-b border-r border-slate-100 p-1 flex flex-col gap-1 cursor-pointer hover:bg-slate-50 transition-colors"
        >
            {entries.map((entry, idx) => {
                if (entry.type === "Lunch") {
                    return (
                        <div
                            key={idx}
                            className={`w-full py-3 px-2 flex items-center justify-center rounded-md font-semibold text-xs shadow-sm border-l-4 ${entry.color || "bg-yellow-100 border-yellow-400 text-yellow-800"}`}
                        >
                            {entry.moduleName}
                        </div>
                    );
                }

                return (
                    <div
                        key={idx}
                        className={`p-1.5 rounded text-[10px] leading-tight shadow-sm border-l-2 flex flex-col ${entry.color || "bg-teal-50 border-teal-500 text-teal-900"}`}
                    >
                        <div className="font-bold">{entry.moduleCode}</div>
                        <div className="truncate opacity-90">{entry.moduleName}</div>
                        <div className="text-[9px] opacity-75 mt-0.5 truncate">{entry.lecturer} ({entry.type || "Lecture"})</div>
                        {entry.venue && <div className="text-[10px] font-bold mt-1 opacity-90 tracking-tight">📍 {entry.venue}</div>}
                    </div>
                );
            })}
        </div>
    );
}
