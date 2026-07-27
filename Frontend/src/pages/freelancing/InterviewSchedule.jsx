import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, Video, Phone, MapPin, ArrowRight } from 'lucide-react';
import { freelancingService } from '@/lib/freelancingService';
import { useToast } from '@/components/ui/use-toast';

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
const INTERVIEW_TYPES = [
  { key: 'video', label: 'Video Call', icon: Video },
  { key: 'phone', label: 'Phone Call', icon: Phone },
  { key: 'onsite', label: 'On-site', icon: MapPin }
];

export default function InterviewSchedule() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [interviewType, setInterviewType] = useState('video');
  const [notes, setNotes] = useState('');
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
    freelancingService
      .getApplication(applicationId)
      .then(setApp)
      .catch(() => toast({ title: 'Error', description: 'Could not load application.', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [applicationId]);

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast({ title: 'Select a Time', description: 'Please choose a date and time slot.', variant: 'destructive' });
      return;
    }
    setScheduling(true);
    try {
      await freelancingService.updateApplication(applicationId, {
        status: 'interview'
      });
      toast({ title: 'Interview Scheduled', description: `Interview scheduled for ${selectedDate} at ${selectedTime}.` });
      navigate('/freelancing/my-applications');
    } catch {
      toast({ title: 'Error', description: 'Could not schedule interview.', variant: 'destructive' });
    } finally {
      setScheduling(false);
    }
  };

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-40 rounded-xl border border-slate-200 bg-white animate-pulse" />)}</div>;
  }

  if (!app) return null;

  const today = new Date();
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i + 1);
    return {
      value: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link to="/freelancing" className="hover:text-slate-600">Freelancing</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/freelancing/my-applications" className="hover:text-slate-600">My Applications</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700 font-medium">Schedule Interview</span>
      </nav>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Schedule Interview</h1>
        <p className="mt-1 text-sm text-slate-500">
          {app.job_title} at {app.company}
        </p>
      </div>

      {/* Interview Type */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Interview Format</h2>
        <div className="grid grid-cols-3 gap-3">
          {INTERVIEW_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setInterviewType(t.key)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                  interviewType === t.key
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${interviewType === t.key ? 'text-slate-900' : 'text-slate-400'}`} />
                <span className={`text-sm font-medium ${interviewType === t.key ? 'text-slate-900' : 'text-slate-500'}`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Selection */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          Select a Date
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {dates.map((d) => (
            <button
              key={d.value}
              onClick={() => setSelectedDate(d.value)}
              className={`flex flex-col items-center gap-1 py-3 rounded-lg border transition-colors ${
                selectedDate === d.value
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span className="text-[11px] uppercase">{d.day}</span>
              <span className="text-lg font-bold">{d.date}</span>
              <span className="text-[10px]">{d.month}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          Select a Time Slot
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TIME_SLOTS.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`h-10 rounded-lg border text-sm font-medium transition-colors ${
                selectedTime === t
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Additional Notes (Optional)</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any topics you'd like to cover or questions for the interviewer..."
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 resize-none"
        />
      </div>

      {/* Summary + Actions */}
      <div className="flex items-center justify-between pb-6">
        <div className="text-sm text-slate-500">
          {selectedDate && selectedTime ? (
            <p>Interview: <span className="font-medium text-slate-700">{selectedDate} at {selectedTime}</span></p>
          ) : (
            <p>Select a date and time to continue.</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/freelancing/my-applications')}
            className="h-10 px-5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={scheduling || !selectedDate || !selectedTime}
            className="h-10 px-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {scheduling ? 'Scheduling...' : 'Confirm Schedule'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}