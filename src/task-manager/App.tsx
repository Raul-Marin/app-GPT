import { useState, useEffect } from "react";
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

// Extender el tipo Window para incluir openai
declare global {
  interface Window {
    __TASK_DATA__?: Task[];
    openai?: {
      toolOutput?: {
        tasks?: Task[];
      };
      callTool?: (name: string, args: any) => Promise<any>;
    };
  }
}

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

const defaultTasks: Task[] = [
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

export function App() {
  // Inicializar desde window.openai.toolOutput o __TASK_DATA__ o defaults
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      return (
        window.openai?.toolOutput?.tasks ||
        window.__TASK_DATA__ ||
        defaultTasks
      );
    }
    return defaultTasks;
  });

  // Escuchar eventos de actualización desde ChatGPT
  useEffect(() => {
    const handleSetGlobals = (event: any) => {
      const globals = event.detail?.globals;
      if (globals?.toolOutput?.tasks) {
        setTasks(globals.toolOutput.tasks);
      }
    };

    window.addEventListener("openai:set_globals", handleSetGlobals);

    return () => {
      window.removeEventListener("openai:set_globals", handleSetGlobals);
    };
  }, []);

  // Función para llamar a tools (completar tarea)
  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    // Actualización optimista
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !currentCompleted } : task
      )
    );

    // Llamar al MCP tool si está disponible
    if (window.openai?.callTool) {
      try {
        const response = await window.openai.callTool("update_task_status", {
          task_id: taskId,
          completed: !currentCompleted,
        });

        // Actualizar con la respuesta del servidor
        if (response?.structuredContent?.tasks) {
          setTasks(response.structuredContent.tasks);
        }
      } catch (error) {
        console.error("Error updating task:", error);
        // Revertir en caso de error
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, completed: currentCompleted } : task
          )
        );
      }
    }
  };

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
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                />
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
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                />
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

function TaskCard({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (taskId: string, currentCompleted: boolean) => void;
}) {
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
          onClick={() => onToggle(task.id, task.completed)}
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

