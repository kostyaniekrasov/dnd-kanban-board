import { Card } from 'react-bootstrap';
import { IssueCard } from '@/components';
import { ColumnType, IssueType } from '@/types';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

type Props = {
  column: ColumnType;
  issues: IssueType[];
  dragOverlay?: boolean;
};

const BoardColumn = ({ issues, column, dragOverlay }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    width: 420,
    height: 'min-content',
  };

  const issuesIds = useMemo(() => {
    return issues.map((iss) => iss.id);
  }, [issues]);

  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        style={{
          ...style,
        }}
        bg="dark"
        border="danger"
        text="light"
        className="rounded shadow-md"
      >
        <Card.Header>
          <Card.Title>{column.title}</Card.Title>
        </Card.Header>

        <Card.Body
          className="px-4 opacity-0"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {!issues.length && (
            <Card
              bg="secondary"
              text="light"
              className="py-5"
              style={{
                fontSize: 14,
              }}
            >
              <Card.Body>
                <Card.Title className="d-flex  justify-content-between mb-0.5">
                  {column.title} is empty
                </Card.Title>
              </Card.Body>
            </Card>
          )}

          <SortableContext items={issuesIds}>
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </SortableContext>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      bg="dark"
      border={isHovered ? 'danger' : ''}
      text="light"
      className="rounded shadow-md"
      data-cy={`${column.id}-column`}
    >
      <Card.Header
        {...attributes}
        {...listeners}
        onMouseEnter={() => setIsHovered(true)}
        onMouseUp={() => setIsHovered(false)}
        onMouseDown={() => setIsHovered(false)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card.Title>{column.title}</Card.Title>
      </Card.Header>

      <Card.Body
        className="px-4"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {!issues.length && (
          <Card
            bg="secondary"
            text="light"
            className="py-5"
            style={{
              fontSize: 14,
            }}
          >
            <Card.Body>
              <Card.Title className="d-flex  justify-content-between mb-0.5">
                {column.title} is empty
              </Card.Title>
            </Card.Body>
          </Card>
        )}

        <AnimatePresence>
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} dragOverlay={dragOverlay} />
          ))}
        </AnimatePresence>
      </Card.Body>
    </Card>
  );
};

export default BoardColumn;
