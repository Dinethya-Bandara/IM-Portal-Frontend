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
            {entries.map((entry, idx) => (
                <div
                    key={idx}
                    className={`p-1.5 rounded text-[10px] leading-tight shadow-sm border-l-2 ${entry.color || "bg-teal-50 border-teal-500 text-teal-900"}`}
                >
                    <div className="font-bold">{entry.moduleCode}</div>
                    <div className="truncate opacity-90">{entry.moduleName}</div>
                    <div className="text-[9px] opacity-75 mt-0.5 truncate">{entry.lecturer} ({entry.type || "Lecture"})</div>
                </div>
            ))}
        </div>
    );
}
