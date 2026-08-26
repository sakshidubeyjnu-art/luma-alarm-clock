import { useState } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import { ScreenHeader, PrimaryButton, SectionLabel } from '@/components/ui';
import { Sheet } from '@/components/Sheet';
import { hapticSoft, hapticMedium } from '@/lib/haptic';
import type { Task, TaskCategory, AppState } from '@/lib/types';

const CATEGORIES: { id: TaskCategory; label: string }[] = [
  { id: 'study', label: 'Study' },
  { id: 'assignment', label: 'Assignment' },
  { id: 'exam', label: 'Exam' },
  { id: 'reading', label: 'Reading' },
  { id: 'personal', label: 'Personal' },
  { id: 'health', label: 'Health' },
];

interface Props {
  state: AppState;
  onAdd: (t: Task) => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onRemove: (id: string) => void;
  onUpdatePriority: (p: string) => void;
}

export function Tasks({ state, onAdd, onUpdate, onRemove, onUpdatePriority }: Props) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('study');
  const [editingPriority, setEditingPriority] = useState(false);
  const [priorityText, setPriorityText] = useState(state.priority);

  const today = state.tasks;
  const completed = today.filter((t) => t.completed).length;

  const add = () => {
    if (!title.trim()) return;
    hapticMedium();
    onAdd({ id: `t${Date.now()}`, title: title.trim(), category, completed: false, date: '' });
    setTitle('');
    setAdding(false);
  };

  return (
    <div className="app-shell bg-paper-warm">
      <ScreenHeader title="Tasks" subtitle={`${completed} of ${today.length} done`} right={
        <button onClick={() => { hapticSoft(); setAdding(true); }} className="press-sm flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white">
          <Plus className="h-5 w-5" />
        </button>
      } />
      <div className="scroll-area pb-24">
        {/* Priority */}
        <div className="px-4 pt-4">
          <button onClick={() => { setEditingPriority(true); setPriorityText(state.priority); }}
            className="press w-full rounded-3xl bg-white p-5 text-left shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">What matters most today?</p>
            <p className="mt-2 font-display text-xl font-medium text-ink">{state.priority}</p>
            <p className="mt-2 text-xs text-ink/40">Tap to edit</p>
          </button>
        </div>

        <SectionLabel>Today</SectionLabel>
        <div className="px-4 space-y-2">
          {today.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 text-center">
              <p className="font-display text-xl font-medium text-ink">A clear day starts here.</p>
              <div className="mt-6 w-full max-w-xs">
                <PrimaryButton onClick={() => setAdding(true)}>Add task</PrimaryButton>
              </div>
            </div>
          ) : (
            today.map((t) => (
              <div key={t.id} className="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-soft">
                <button onClick={() => { hapticSoft(); onUpdate(t.id, { completed: !t.completed }); }}
                  className={`press-sm flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${t.completed ? 'border-sage-500 bg-sage-500' : 'border-ink/20'}`}>
                  {t.completed && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </button>
                <div className="flex-1">
                  <p className={`text-[15px] font-medium ${t.completed ? 'text-ink/40 line-through' : 'text-ink'}`}>{t.title}</p>
                  <p className="text-[11px] uppercase tracking-wide text-ink/35">{CATEGORIES.find((c) => c.id === t.category)?.label}</p>
                </div>
                 <button onClick={() => { if (window.confirm(`Delete “${t.title}”?`)) { hapticMedium(); onRemove(t.id); } }} className="press-sm p-1 text-ink/20 hover:text-blush-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add task sheet */}
      <Sheet open={adding} onClose={() => setAdding(false)} title="New task">
        <div className="py-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to do?"
            autoFocus
            className="w-full rounded-2xl bg-paper-fog p-4 text-[15px] text-ink outline-none focus:ring-2 focus:ring-sage-300"
          />
          <SectionLabel>Category</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => { hapticSoft(); setCategory(c.id); }}
                className={`press-sm rounded-full px-4 py-2 text-sm font-medium ${category === c.id ? 'bg-ink text-white' : 'bg-paper-fog text-ink/60'}`}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="mt-6">
            <PrimaryButton onClick={add}>Add task</PrimaryButton>
          </div>
        </div>
      </Sheet>

      {/* Edit priority sheet */}
      <Sheet open={editingPriority} onClose={() => setEditingPriority(false)} title="Today's priority">
        <div className="py-2">
          <input
            value={priorityText}
            onChange={(e) => setPriorityText(e.target.value)}
            placeholder="What matters most today?"
            autoFocus
            className="w-full rounded-2xl bg-paper-fog p-4 text-[15px] text-ink outline-none focus:ring-2 focus:ring-sage-300"
          />
          <div className="mt-6">
            <PrimaryButton onClick={() => { hapticMedium(); onUpdatePriority(priorityText.trim()); setEditingPriority(false); }}>Save</PrimaryButton>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
