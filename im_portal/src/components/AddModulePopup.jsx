import React from "react";

export default function AddModulePopup({
    showModal,
    setShowModal,
    editCellKey,
    academicData,
    canEdit,
    cellForm,
    setCellForm,
    saveAcademicEntry,
    deleteAcademicEntry
}) {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Time Slot Details</h3>
                <p className="text-sm text-slate-500 mb-4 capitalize">{editCellKey?.replace("-", " ")}:00</p>
                <div className="space-y-3 mb-6">
                    {(academicData[editCellKey] || []).map((entry, idx) => (
                        <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50 relative group">
                            {entry.type === "Lunch" ? (
                                <div className="font-bold text-slate-800 italic">{entry.moduleName}</div>
                            ) : (
                                <>
                                    <div className="font-bold text-slate-800">{entry.moduleCode} - {entry.moduleName}</div>
                                    <div className="text-xs text-slate-500">{entry.lecturer} | {entry.stream || "All"} ({entry.category || "Compulsory"}) {entry.venue ? `| Venue: ${entry.venue} ` : ''}| Credits: {entry.credits || entry.moduleCode?.split('').pop()}</div>
                                </>
                            )}
                            {canEdit && (
                                <button
                                    onClick={() => deleteAcademicEntry(idx)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            )}
                        </div>
                    ))}
                    {(academicData[editCellKey] || []).length === 0 && <p className="text-sm text-slate-400 italic">No modules assigned.</p>}
                </div>

                {canEdit ? (
                    <div className="border-t border-slate-100 pt-4">
                        <h4 className="font-semibold text-sm text-slate-700 mb-3">Add Module</h4>
                        
                        <div className="mb-4 flex items-center gap-2">
                            <input type="checkbox" id="lunchBreakCheck" className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500" checked={cellForm.isLunchBreak} onChange={e => setCellForm({...cellForm, isLunchBreak: e.target.checked})} />
                            <label htmlFor="lunchBreakCheck" className="text-sm font-bold text-slate-700">Mark this slot as a Lunch Break</label>
                        </div>

                        {!cellForm.isLunchBreak && (
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400" placeholder="Course Code" value={cellForm.moduleCode} onChange={e => setCellForm({ ...cellForm, moduleCode: e.target.value })} />
                                <input className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400" placeholder="Module Name" value={cellForm.moduleName} onChange={e => setCellForm({ ...cellForm, moduleName: e.target.value })} />
                                <input className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 col-span-2" placeholder="Lecturer Name" value={cellForm.lecturer} onChange={e => setCellForm({ ...cellForm, lecturer: e.target.value })} />
                                <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800" value={cellForm.type} onChange={e => setCellForm({ ...cellForm, type: e.target.value })}>
                                    <option value="Lecture">Lecture</option>
                                    <option value="Lab">Lab</option>
                                    <option value="Tutorial">Tutorial</option>
                                </select>
                                <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800" value={cellForm.stream} onChange={e => setCellForm({ ...cellForm, stream: e.target.value })}>
                                    <option value="All">All Streams</option>
                                    <option value="IT">IT</option>
                                    <option value="MIT">MIT</option>
                                </select>
                                <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800" value={cellForm.category} onChange={e => setCellForm({ ...cellForm, category: e.target.value })}>
                                    <option value="Compulsory">Compulsory</option>
                                    <option value="Optional">Optional</option>
                                </select>
                                <input className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400" placeholder="Venue (e.g., A8-203)" value={cellForm.venue} onChange={e => setCellForm({ ...cellForm, venue: e.target.value })} />
                            </div>
                        )}
                        <button onClick={saveAcademicEntry} className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700">Add Entry</button>
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 mt-4 text-center">Only Academic Advisors can edit the timetable.</p>
                )}
                <div className="mt-4 flex justify-end">
                    <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-800 text-sm">Close</button>
                </div>
            </div>
        </div>
    );
}
