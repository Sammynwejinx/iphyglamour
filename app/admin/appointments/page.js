'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const STATUSES = ['requested', 'confirmed', 'completed', 'cancelled'];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState(null);

  async function load() {
    const { data } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
    setAppointments(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(a, status) {
    await supabase.from('appointments').update({ status }).eq('id', a.id);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Appointments</h1>

      {appointments === null && <p className="text-sm text-ink/50">Loading…</p>}
      {appointments && appointments.length === 0 && <p className="text-sm text-ink/50">No appointment requests yet.</p>}

      <div className="grid gap-4">
        {appointments?.map((a) => (
          <div key={a.id} className="border border-sand p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <p className="font-display text-ink capitalize">{a.type} appointment</p>
              <select
                value={a.status}
                onChange={(e) => updateStatus(a, e.target.value)}
                className="border border-sand px-2 py-1 text-xs capitalize"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-ink/60 text-xs mb-1">
              {a.customer_name || 'No name given'} · {a.phone || 'No phone given'}
            </p>
            {a.address && <p className="text-ink/60 text-xs mb-1">Address: {a.address}</p>}
            <p className="text-ink/60 text-xs mb-1">
              Preferred: {a.preferred_date} at {a.preferred_time}
            </p>
            {a.notes && <p className="text-ink/60 text-xs">Notes: {a.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
