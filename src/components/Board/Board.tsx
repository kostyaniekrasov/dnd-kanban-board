import React, { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimation,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { useIssuesStore } from '@/store/useIssuesStore';
import { ColumnType, IssueStatus, IssueType } from '@/types';
import { BoardColumn, IssueCard } from '@/components';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Alert, Fade, Spinner } from 'react-bootstrap';

const Board: React.FC = () => {
  const {
    isLoading,
    columns,
    currentIssues: issues,
    moveColumn,
    reorderIssue,
    addToColumnWithReorder,
    addToColumn,
    error,
  } = useIssuesStore();
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeIssue, setActiveIssue] = useState<IssueType | null>(null);

  const columnsIds = useMemo(() => {
    return columns.map((c) => c.id);
  }, [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 20,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Column') {
      if (event.active.id !== activeColumn?.id) {
        return setActiveColumn(event.active.data.current.column);
      }
    }

    if (event.active.data.current?.type === 'Issue') {
      if (event.active.id !== activeIssue?.id) {
        return setActiveIssue(event.active.data.current.issue);
      }
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveIssue(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const isActiveColumn = active.data.current?.type === 'Column';
    const isOverColumn = over.data.current?.type === 'Column';

    if (activeId === overId) return;

    if (isActiveColumn && isOverColumn) {
      moveColumn(activeId as IssueStatus, overId as IssueStatus);
    }
  };

  const debouncedOnDragOver = useMemo(
    () =>
      debounce((event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveColumn = activeData?.type === 'Column';
        const isActiveIssue = activeData?.type === 'Issue';
        const isOverIssue = overData?.type === 'Issue';
        const isOverColumn = overData?.type === 'Column';

        if (isActiveColumn && isOverIssue) {
          const currentIssue = issues.find((issue) => issue.id === overId);
          if (currentIssue && activeId !== currentIssue.status) {
            moveColumn(activeId as IssueStatus, currentIssue.status);
          }
        }

        if (isActiveIssue) {
          if (isOverIssue) {
            addToColumnWithReorder(activeId as number, overId as number);
            reorderIssue(activeId as number, overId as number);
          } else if (isOverColumn) {
            const newStatus = overData?.column.id;
            if (activeData?.status !== newStatus) {
              addToColumn(activeId as number, newStatus);
            }
          }
        }
      }, 100),
    [issues, moveColumn, addToColumnWithReorder, reorderIssue, addToColumn]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={debouncedOnDragOver}
    >
      {isLoading ? (
        <div>
          <Spinner
            animation="border"
            variant="light"
            className="d-flex scale-150 m-auto"
          />
        </div>
      ) : (
        <>
          <Fade in={!isLoading}>
            <div className="d-flex justify-content-center">
              <div className="d-flex gap-5 mb-5">
                <SortableContext
                  items={columnsIds}
                  strategy={horizontalListSortingStrategy}
                >
                  {columns.map((column) => (
                    <BoardColumn
                      key={column.id}
                      column={column}
                      issues={issues.filter((i) => i.status === column.id)}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          </Fade>
          {createPortal(
            <DragOverlay
              dropAnimation={{
                ...defaultDropAnimation,
                duration: 375,
              }}
            >
              {activeColumn && (
                <motion.div
                  key={activeColumn.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BoardColumn
                    key={activeColumn.id}
                    column={activeColumn}
                    issues={issues.filter((i) => i.status === activeColumn.id)}
                    dragOverlay
                  />
                </motion.div>
              )}
              {activeIssue && (
                <motion.div
                  key={activeIssue.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <IssueCard issue={activeIssue} dragOverlay />
                </motion.div>
              )}
            </DragOverlay>,
            document.body
          )}
        </>
      )}

      <Alert
        show={error !== null}
        variant="danger"
        style={{
          position: 'absolute',
          left: 15,
          top: 15,
        }}
      >
        {error}
      </Alert>
    </DndContext>
  );
};

export default Board;
