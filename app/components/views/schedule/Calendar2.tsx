import React, { useState } from "react";

// --- Importaciones de antd ---
import { Calendar, Typography, Space } from "antd";
import type { CalendarProps } from "antd";
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";

const { Title } = Typography;

// --- Interfaz y tipos de datos ---
interface Task {
  id: string;
  content: string;
}

const initialTasks: Task[] = [
  { id: "1", content: "Team meeting" },
  { id: "2", content: "Send report" },
  { id: "3", content: "Call client" },
  { id: "4", content: "Prepare presentation" },
  { id: "5", content: "Review code" },
  { id: "6", content: "Team training" },
];

type CalendarTasks = {
  [date: string]: Task[];
};

// --- Componente para renderizar la tarea DENTRO DEL DRAG OVERLAY ---
function OverlayItem({ task }: { task: Task }) {
  return (
    <div
      style={{
        backgroundColor: '#bbdefb', // un azul claro de Antd
        color: '#1a237e', // un azul oscuro de Antd
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        cursor: 'grabbing',
        border: '2px solid #64b5f6', // Borde para destacar el overlay
        opacity: 0.9, // Ligeramente transparente para indicar que es un overlay
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
    zIndex: isDragging ? 2000 : "auto", // Mantenemos el z-index para que el elemento arrastrado esté por encima
    opacity: isDragging ? 0.3 : 1, // Hacemos el original un poco transparente
    boxSizing: 'border-box' as const,
    backgroundColor: '#e3f2fd', // un azul muy claro de Antd
    color: '#3f51b5', // un azul medio de Antd
    padding: '4px 8px',
    marginBottom: '4px', // Espacio entre tareas
    borderRadius: '4px',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'grab',
    userSelect: 'none' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {task.content}
    </div>
  );
}

// --- Componente principal AntCalendarDnd ---
export default function AntCalendarDnd() {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
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

    // Determina el origen de la tarea (task-pool o celda del calendario)
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

    // Limita a 3 tareas por día (si no es el task-pool y no es un reordenamiento)
    // Solo aplica la restricción si el ORIGEN y el DESTINO son diferentes
    if (overId !== "task-pool" && destinationTasks.length >= 3 && sourceContainerId !== overId) {
      console.warn(`La celda ${overId} ya tiene 3 ítems. No se puede añadir más.`);
      return;
    }

    if (sourceContainerId === overId) {
      // Reordenando dentro del mismo contenedor
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
      // Moviendo entre contenedores diferentes
      // Elimina de la fuente
      const newSourceTasks = [...sourceTasks];
      newSourceTasks.splice(sourceIndex, 1);

      if (sourceContainerId === "task-pool") {
        setTaskPool(newSourceTasks);
      } else {
        setCalendarTasks((prev) => ({
          ...prev,
          [sourceContainerId!]: newSourceTasks,
        }));
      }

      // Añade al destino
      // Determina el índice donde se soltó el elemento en el destino
      const newIndex = over.data.current?.sortable?.index !== undefined
        ? over.data.current.sortable.index
        : destinationTasks.length; // Si no hay índice sortable, lo añade al final

      const newDestinationTasks = [...destinationTasks];
      newDestinationTasks.splice(newIndex, 0, movedTask);

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

  // --- Función para personalizar el contenido de cada celda del calendario de Ant Design ---
  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current: Dayjs, info) => {
    // Solo modificamos las celdas de fecha
    if (info.type === 'date') {
      const dateKey = current.format("YYYY-MM-DD");
      const tasksForDay = calendarTasks[dateKey] || [];
      const taskIds = tasksForDay.map((task) => task.id);

      const { setNodeRef, isOver } = useDroppable({
        id: dateKey,
        data: { type: "CONTAINER", dateKey },
      });

      // El elemento raíz de la celda que Ant Design ya renderiza (el div principal del día).
      const originalDayCell = info.originNode as React.ReactElement;

      // Clonamos el nodo original de la celda para aplicar los estilos de droppable
      // y para controlar su contenido.
      return React.cloneElement(originalDayCell, {
        ref: setNodeRef, // Aquí se asigna la referencia para que dnd-kit detecte el área de drop
        style: {
          ...originalDayCell.props.style,
          // **ESTILOS CLAVE PARA OCUPAR TODA LA ALTURA Y MOSTRAR FEEDBACK**
          // Asegura que el div clonado ocupe todo el espacio de la celda del calendario.
          height: '100%',
          display: 'flex',       // Habilitamos flexbox
          flexDirection: 'column', // Los elementos internos se apilarán verticalmente
          justifyContent: 'flex-start', // Alinea el contenido al inicio
          alignItems: 'flex-start',  // Alinea los items al inicio horizontalmente (como el número del día)

          // Estilos de feedback visual para el arrastre (AHORA REFORZANDO EL Z-INDEX)
          backgroundColor: isOver ? 'rgba(24, 144, 255, 0.08)' : 'transparent',
          border: isOver ? '1px dashed #1890ff' : '1px solid transparent',
          transition: 'background-color 0.2s ease, border 0.2s ease',

          // AÑADIDO: Asegurarse de que nada "tape" la interacción con los items arrastrables
          // Esto puede ser útil si el pseudo-elemento está causando problemas de puntero
          position: 'relative', // Necesario para que el z-index funcione en los hijos
          zIndex: 1, // Asegura que la celda misma tenga un z-index base si otros elementos interfieren
        },
        // El contenido (children) de la celda modificada.
        children: (
          // Este div envolvente contendrá el número del día y la lista de tareas.
          // También es un flex container para gestionar el espacio vertical.
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%', // Asegura que este contenedor interno también ocupe el 100% de la altura de su padre.
            padding: '4px', // Pequeño padding interno para que no se pegue al borde
            boxSizing: 'border-box', // Asegura que el padding no aumente el tamaño total
          }}>

            {/* Contenedor para la lista de tareas. Le damos flexGrow para que ocupe el espacio restante. */}
            <div style={{
              flexGrow: 1, // Este es el que se estira y ocupa todo el espacio vertical sobrante
              width: '100%',
              minHeight: '40px', // Un mínimo de altura para el área de drop de tareas si no hay ninguna
              overflowY: 'auto', // Si hay muchas tareas, que se pueda hacer scroll
              display: 'flex', // Necesario para que SortableContext maneje sus hijos
              flexDirection: 'column', // Las tareas se apilan en columna
              gap: '4px', // Espacio entre las tareas (aunque SortableTask ya tiene marginBottom)
              // Importante: Asegura que esta capa de tareas esté por encima de cualquier pseudo-elemento
              position: 'relative',
              zIndex: 10, // Un z-index alto para que los ítems sean clicables
            }}>
              <SortableContext id={dateKey} items={taskIds} strategy={verticalListSortingStrategy}>
                {tasksForDay.map((task) => (
                  <SortableTask key={task.id} task={task} />
                ))}
              </SortableContext>
            </div>
          </div>
        ),
      });
    }

    // Para otras celdas (mes, año), devolvemos el nodo original sin cambios.
    return info.originNode;
  };

  const onPanelChange: CalendarProps<Dayjs>['onPanelChange'] = (value) => {
    setCurrentDate(value);
  };
  // @ts-ignore ignora el error de tipado si no lo estás usando directamente con un ref HTML
  const { ref: taskPoolRef, isOver: isOverTaskPool } = useDroppable({ id: 'task-pool' });

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto', padding: '24px', backgroundColor: '#fff', borderRadius: '8px'}}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Componente Calendar de Ant Design */}
        <Calendar
          value={currentDate}
          onPanelChange={onPanelChange}
          cellRender={cellRender} // Aquí se personaliza el CONTENIDO de cada celda
          fullscreen={true}
        />

        {/* Bloque de "Tareas disponibles" */}
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #d9d9d9' }}>
          <Title level={4} style={{ marginBottom: '16px', color: '#555' }}>Tasks:</Title>
           <SortableContext
              id="task-pool"
              items={taskPool.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
           >
                <div
                    ref={taskPoolRef}
                    style={{
                        minHeight: '80px',
                        width: '100%',
                        padding: '8px',
                       
                        borderRadius: '4px',
                        transition: 'background-color 0.2s ease',
                        border: isOverTaskPool ? '1px dashed #1890ff' : '1px solid transparent',
                    }}
                >
                    <Space size={[8, 8]} wrap>
                        {taskPool.map((task) => (
                          <SortableTask key={task.id} task={task} />
                        ))}
                    </Space>
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