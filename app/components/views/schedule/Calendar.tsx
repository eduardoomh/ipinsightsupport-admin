import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";

// --- Importaciones de dnd-kit ---
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Interfaz y tipos de datos ---
interface Task {
  id: string;
  content: string;
}

const initialTasks: Task[] = [
  { id: "1", content: "Reunión con equipo" },
  { id: "2", content: "Enviar informe" },
  { id: "3", content: "Llamar a cliente" },
  { id: "4", content: "Preparar presentación" },
  { id: "5", content: "Revisar código" },
  { id: "6", content: "Entrenamiento equipo" },
];

type CalendarTasks = {
  [date: string]: Task[];
};

// --- Componente para renderizar la tarea DENTRO DEL DRAG OVERLAY ---
function OverlayItem({ task }: { task: Task }) {
  return (
    <div
      className={`
        bg-blue-200 text-blue-800 p-1 mb-1 rounded text-xs truncate
        shadow-md ring-2 ring-blue-300
      `}
      style={{
        cursor: 'grabbing',
      }}
    >
      {task.content}
    </div>
  );
}

// --- Componente Draggable/Sortable para las tareas ---
interface SortableTaskProps {
  task: Task;
}

function SortableTask({ task }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2000 : "auto",
    opacity: isDragging ? 0 : 1, // Elemento original invisible al arrastrar
    boxSizing: 'border-box' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-blue-200 text-blue-800 p-1 mb-1 rounded text-xs truncate cursor-grab select-none
        ${isDragging ? "invisible" : ""}
      `}
    >
      {task.content}
    </div>
  );
}

// --- Componente Droppable para las celdas del calendario ---
interface CalendarDayCellProps {
  dateKey: string;
  tasks: Task[];
  currentDay: Date;
  monthStart: Date;
}

function CalendarDayCell({
  dateKey,
  tasks,
  currentDay,
  monthStart,
}: CalendarDayCellProps) {
  const { setNodeRef } = useSortable({
    id: dateKey,
    data: {
      type: "CONTAINER",
      dateKey,
    },
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div
      ref={setNodeRef}
      className={`border h-32 p-1 text-sm overflow-y-auto rounded shadow-sm
        ${!isSameMonth(currentDay, monthStart) ? "bg-gray-100 text-gray-400" : "bg-white"}
        ${isSameDay(currentDay, new Date()) ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"}
      `}
    >
      <div
        className={`text-xs font-semibold mb-1 ${
          isSameDay(currentDay, new Date()) ? "text-blue-600" : "text-gray-700"
        }`}
      >
        {format(currentDay, "d")}
      </div>
      <SortableContext id={dateKey} items={taskIds} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <SortableTask key={task.id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}

// --- Componente principal Calendar ---
export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [taskPool, setTaskPool] = useState<Task[]>(initialTasks);
  const [calendarTasks, setCalendarTasks] = useState<CalendarTasks>({});
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    let foundTask: Task | undefined = taskPool.find(task => task.id === id);

    if (!foundTask) {
      for (const dateKey in calendarTasks) {
        foundTask = calendarTasks[dateKey].find(task => task.id === id);
        if (foundTask) break;
      }
    }
    setActiveTask(foundTask || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    let sourceContainerId: string | null = null;
    let sourceTasks: Task[] = [];
    let sourceIndex: number = -1;

    sourceIndex = taskPool.findIndex((task) => task.id === activeId);
    if (sourceIndex !== -1) {
      sourceContainerId = "task-pool";
      sourceTasks = taskPool;
    } else {
      for (const dateKey in calendarTasks) {
        sourceIndex = calendarTasks[dateKey].findIndex((task) => task.id === activeId);
        if (sourceIndex !== -1) {
          sourceContainerId = dateKey;
          sourceTasks = calendarTasks[dateKey];
          break;
        }
      }
    }

    if (!sourceContainerId || sourceIndex === -1) {
      console.warn("Tarea arrastrada no encontrada en las listas de origen.");
      return;
    }

    const movedTask = sourceTasks[sourceIndex];

    const destinationTasks = overId === "task-pool" ? taskPool : (calendarTasks[overId] || []);

    if (overId !== "task-pool" && destinationTasks.length >= 3 && sourceContainerId !== overId) {
      console.warn(`La celda ${overId} ya tiene 3 ítems. No se puede añadir más.`);
      return;
    }

    if (sourceContainerId === overId) {
      const newIndex = over.data.current?.sortable?.index ?? sourceIndex;
      if (sourceContainerId === "task-pool") {
        setTaskPool(arrayMove(taskPool, sourceIndex, newIndex));
      } else {
        setCalendarTasks((prev) => ({
          ...prev,
          [sourceContainerId]: arrayMove(destinationTasks, sourceIndex, newIndex),
        }));
      }
    } else {
      const newSourceTasks = Array.from(sourceTasks);
      newSourceTasks.splice(sourceIndex, 1);

      let newDestinationTasks = Array.from(destinationTasks);
      const newIndex = over.data.current?.sortable?.index !== undefined
        ? over.data.current.sortable.index
        : newDestinationTasks.length;

      newDestinationTasks.splice(newIndex, 0, movedTask);

      if (sourceContainerId === "task-pool") {
        setTaskPool(newSourceTasks);
      } else {
        setCalendarTasks((prev) => ({
          ...prev,
          [sourceContainerId]: newSourceTasks,
        }));
      }

      if (overId === "task-pool") {
        setTaskPool(newDestinationTasks);
      } else {
        setCalendarTasks((prev) => ({
          ...prev,
          [overId]: newDestinationTasks,
        }));
      }
    }
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button onClick={prevMonth} className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors">&lt;</button>
      <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
      <button onClick={nextMonth} className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors">&gt;</button>
    </div>
  );

  const renderDays = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    return (
      <div className="grid grid-cols-7 mb-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="text-center font-medium text-gray-600">
            {format(addDays(startDate, i), "EEE")}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const days = [];

      for (let i = 0; i < 7; i++) {
        const currentDay = addDays(day, i);
        const dateKey = format(currentDay, "yyyy-MM-dd");
        const tasksForDay = calendarTasks[dateKey] || [];

        days.push(
          <CalendarDayCell
            key={dateKey}
            dateKey={dateKey}
            tasks={tasksForDay}
            currentDay={currentDay}
            monthStart={monthStart}
          />
        );
      }

      rows.push(
        <div className="grid grid-cols-7 gap-1 mb-1" key={day.toString()}>
          {days}
        </div>
      );

      day = addDays(day, 7);
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-light_blue border-high_blue rounded-lg">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* El contenedor principal del calendario */}
        <div className="bg-white p-3 rounded-lg shadow-sm">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
<br/>
                {/* Este es el bloque de "Tareas disponibles" que ahora está fuera del div del calendario */}
        <div className="mb-6 bg-white p-3 rounded-lg shadow-sm">
          <h3 className="font-bold text-lg mb-2 text-gray-800">Tareas disponibles:</h3>
          <SortableContext
            id="task-pool"
            items={taskPool.map((task) => task.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-2 min-h-[60px] border border-dashed border-gray-300 p-3 rounded-md bg-gray-50">
              {taskPool.map((task) => (
                <SortableTask key={task.id} task={task} />
              ))}
            </div>
          </SortableContext>
        </div>

        <DragOverlay>
          {activeTask ? (
            <OverlayItem task={activeTask} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}