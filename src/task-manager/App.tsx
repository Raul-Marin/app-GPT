import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Calendar, CheckCircle, Circle } from "@openai/apps-sdk-ui/components/Icon";

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

// Obtener datos de tareas desde el window object (inyectados por el servidor MCP)
const tasks: Task[] = (window as any).__TASK_DATA__ || [
  {
    id: "1",
    title: "Revisar propuesta de diseño",
    description: "Analizar mockups del nuevo dashboard",
    dueDate: "2025-11-25",
    completed: false,
    priority: "high",
  },
  {
    id: "2",
    title: "Actualizar documentación",
    description: "Añadir ejemplos de uso del API",
    dueDate: "2025-11-24",
    completed: false,
    priority: "medium",
  },
  {
    id: "3",
    title: "Reunión de equipo",
    description: "Sprint planning Q1 2026",
    dueDate: "2025-11-23",
    completed: true,
    priority: "low",
  },
];

const priorityColors = {
  high: "error" as const,
  medium: "warning" as const,
  low: "success" as const,
};

const priorityLabels = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

export function App() {
  const incompleteTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="w-full max-w-2xl">
      <div className="rounded-2xl border border-default bg-surface shadow-lg p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="heading-xl">Mis Tareas</h1>
            <p className="mt-1 text-secondary text-sm">
              {incompleteTasks.length} pendiente(s), {completedTasks.length} completada(s)
            </p>
          </div>
          <Button color="primary" size="sm">
            Nueva Tarea
          </Button>
        </div>

        {/* Tareas pendientes */}
        {incompleteTasks.length > 0 && (
          <div className="mt-6">
            <h2 className="heading-sm mb-3">Pendientes</h2>
            <div className="space-y-3">
              {incompleteTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {/* Tareas completadas */}
        {completedTasks.length > 0 && (
          <div className="mt-6">
            <h2 className="heading-sm mb-3 text-tertiary">Completadas</h2>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <div className="mt-8 text-center py-8">
            <Circle className="mx-auto size-12 text-tertiary" />
            <p className="mt-3 text-secondary">No hay tareas</p>
            <p className="mt-1 text-tertiary text-sm">
              Crea tu primera tarea para comenzar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div
      className={`rounded-xl border border-subtle bg-default p-4 transition-all hover:shadow-md ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          className="mt-0.5 text-secondary hover:text-primary transition-colors"
          aria-label={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
        >
          {task.completed ? (
            <CheckCircle className="size-5 text-success" />
          ) : (
            <Circle className="size-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`font-medium ${
                task.completed ? "line-through text-secondary" : ""
              }`}
            >
              {task.title}
            </h3>
            <Badge color={priorityColors[task.priority]} size="sm">
              {priorityLabels[task.priority]}
            </Badge>
          </div>

          {task.description && (
            <p className="mt-1 text-sm text-secondary">{task.description}</p>
          )}

          {task.dueDate && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-tertiary">
              <Calendar className="size-3.5" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

