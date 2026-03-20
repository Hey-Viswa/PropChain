"use client";

import { ListTodo, CheckSquare, XSquare, AlertCircle } from "lucide-react";

export default function OracleQueuePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-display font-bold text-on_surface font-display leading-tight tracking-tight text-3xl sm:text-4xl mb-1">
            Verification Queue
          </h1>
          <p className="text-body-md text-on_surface_variant">
            Oracle tasks requiring manual intervention or institutional signatures.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface_container_lowest rounded-2xl p-6 border border-outline_variant/10 shadow-[0_8px_24px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] uppercase font-bold text-on_surface_variant mb-2">Pending Items</p>
          <p className="text-3xl font-bold text-on_surface">24</p>
        </div>
        <div className="bg-surface_container_lowest rounded-2xl p-6 border border-outline_variant/10 shadow-[0_8px_24px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] uppercase font-bold text-warning mb-2">High Priority</p>
          <p className="text-3xl font-bold text-warning">3</p>
        </div>
        <div className="bg-surface_container_lowest rounded-2xl p-6 border border-outline_variant/10 shadow-[0_8px_24px_rgba(0,0,0,0.02)]">
          <p className="text-[10px] uppercase font-bold text-success mb-2">Processed Today</p>
          <p className="text-3xl font-bold text-success">112</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-surface_container_lowest rounded-2xl border border-outline_variant/10 shadow-[0_8px_24px_rgba(0,0,0,0.02)] p-6">
        <h3 className="text-lg font-bold font-display text-on_surface mb-6">Active Tasks</h3>
        
        <div className="space-y-4">
          <div className="border border-outline_variant/20 rounded-xl p-4 flex items-center justify-between hover:bg-surface_container_low transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="font-bold text-on_surface">Deed Discrepancy: Property #829</p>
                <p className="text-xs text-on_surface_variant">AI confidence below 60%. Manual review required.</p>
              </div>
            </div>
            <div className="flex gap-2">
               <button className="text-xs font-semibold px-4 py-2 rounded-md bg-surface_container text-on_surface_variant hover:bg-surface_container_high">Decline</button>
               <button className="text-xs font-semibold px-4 py-2 rounded-md bg-primary text-on_primary hover:bg-primary/90">Review Docs</button>
            </div>
          </div>
          
          <div className="border border-outline_variant/20 rounded-xl p-4 flex items-center justify-between hover:bg-surface_container_low transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ListTodo size={20} />
              </div>
              <div>
                <p className="font-bold text-on_surface">Final Signature: Tech Hub A1</p>
                <p className="text-xs text-on_surface_variant">All automated checks passed. Awaiting oracle multi-sig.</p>
              </div>
            </div>
            <div className="flex gap-2">
               <button className="text-xs font-semibold px-4 py-2 rounded-md bg-primary text-on_primary hover:bg-primary/90">Sign & Approve</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
