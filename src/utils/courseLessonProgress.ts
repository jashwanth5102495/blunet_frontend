const STORAGE_KEY = 'studentLessonProgress';

const FALLBACK_BACKEND_URL =
  import.meta.env.DEV
    ? 'http://localhost:5000'
    : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');

const BASE_URL = import.meta.env.VITE_BACKEND_URL || FALLBACK_BACKEND_URL;

export type CourseLessonProgressRecord = {
  completedKeys: string[];
  totalLessons: number;
  progress: number;
  completedLessons: number;
  lastUpdated: string;
};

export function lessonKey(moduleId: string, lessonIndex: number): string {
  return `${moduleId}-${lessonIndex}`;
}

export function getTotalLessonsFromModules(modules: { lessons?: unknown[] }[]): number {
  return modules.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0);
}

export function loadAllLessonProgress(): Record<string, CourseLessonProgressRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getCurrentUser(): { id: string; token?: string } | null {
  try {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (!user?.id) return null;
    return { id: user.id, token: user.token || localStorage.getItem('authToken') || undefined };
  } catch {
    return null;
  }
}

async function syncLessonToBackend(opts: {
  courseId: string;
  moduleId: string;
  lessonIndex: number;
  lessonTitle?: string;
  moduleTitle?: string;
}): Promise<void> {
  const user = getCurrentUser();
  if (!user?.id) return;

  const lessonId = lessonKey(opts.moduleId, opts.lessonIndex);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (user.token) headers.Authorization = `Bearer ${user.token}`;

  try {
    await fetch(`${BASE_URL}/api/progress/student/${user.id}/lesson`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        courseId: opts.courseId,
        moduleId: opts.moduleId,
        lessonId,
        lessonTitle: opts.lessonTitle || lessonId,
        moduleTitle: opts.moduleTitle || opts.moduleId,
        status: 'completed',
      }),
    });
  } catch (err) {
    console.warn('Could not sync lesson progress to server:', err);
  }
}

export type MarkLessonCompleteOptions = {
  courseId: string;
  moduleId: string;
  lessonIndex: number;
  totalLessons: number;
  lessonTitle?: string;
  moduleTitle?: string;
};

/** Call when student completes a concept and taps Next Topic */
export function markLessonComplete(opts: MarkLessonCompleteOptions): CourseLessonProgressRecord {
  const key = lessonKey(opts.moduleId, opts.lessonIndex);
  const all = loadAllLessonProgress();
  const existing = all[opts.courseId] ?? {
    completedKeys: [],
    totalLessons: opts.totalLessons,
    progress: 0,
    completedLessons: 0,
    lastUpdated: '',
  };

  const completedSet = new Set(existing.completedKeys);
  completedSet.add(key);

  const total = Math.max(opts.totalLessons, 1);
  const completedLessons = completedSet.size;
  const progress = Math.min(100, Math.round((completedLessons / total) * 100));

  const record: CourseLessonProgressRecord = {
    completedKeys: Array.from(completedSet),
    totalLessons: total,
    progress,
    completedLessons,
    lastUpdated: new Date().toISOString(),
  };

  all[opts.courseId] = record;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  window.dispatchEvent(
    new CustomEvent('student-progress-updated', {
      detail: { courseId: opts.courseId, record },
    })
  );

  void syncLessonToBackend(opts);

  return record;
}

/** Resolve stored progress for a course id (tries aliases) */
export function getStoredProgressForCourse(
  courseId: string,
  aliases: string[] = []
): CourseLessonProgressRecord | null {
  const all = loadAllLessonProgress();
  const keys = [courseId, ...aliases];
  for (const k of keys) {
    if (all[k]) return all[k];
  }
  return null;
}
