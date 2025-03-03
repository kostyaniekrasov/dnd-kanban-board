import { Card } from 'react-bootstrap';
import { IssueType } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

type Props = {
  issue: IssueType;
  dragOverlay?: boolean;
};

const IssueCard = ({ issue, dragOverlay }: Props) => {
  const { id, title, author, createdAt, comments, status } = issue;
  const [isHover, setIsHover] = useState(false);
  const {
    setNodeRef,
    listeners,
    attributes,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'Issue',
      issue,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const date = new Date(issue.createdAt);
  const formattedDate = formatDistanceToNow(date, { addSuffix: true });

  if (isDragging) {
    return (
      <motion.div
        ref={setNodeRef}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        layout
      >
        <Card
          bg="dark"
          text="light"
          style={{
            ...style,
          }}
          border={'danger'}
        >
          <Card.Body className="opacity-0">
            <Card.Title className="d-flex  justify-content-between mb-0.5">
              <p className="mb-0">{title}</p>
            </Card.Title>

            <Card.Text>{`#${id} ${createdAt}`}</Card.Text>

            <Card.Text>{`${author} | Comments: ${comments}`}</Card.Text>
          </Card.Body>
        </Card>
      </motion.div>
    );
  }

  return dragOverlay ? (
    <Card
      bg="secondary"
      text="secondary"
      style={{
        fontSize: 14,
        ...style,
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseUp={() => setIsHover(false)}
      onMouseLeave={() => setIsHover(false)}
      border={isHover ? 'danger' : ''}
    >
      <Card.Body>
        <Card.Title className="d-flex  justify-content-between mb-0.5">
          <p className="mb-0">{title}</p>
        </Card.Title>

        <Card.Text>{`#${id} opened ${formattedDate}`}</Card.Text>

        <Card.Text>{`${author} | Comments: ${comments}`}</Card.Text>
      </Card.Body>
    </Card>
  ) : (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      layoutId={issue.id.toString()}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        bg="secondary"
        text="light"
        style={{
          fontSize: 14,
          ...style,
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseUp={() => setIsHover(false)}
        onMouseLeave={() => setIsHover(false)}
        border={isHover ? 'danger' : ''}
        data-cy={`${status}-item`}
      >
        <Card.Body>
          <Card.Title className="d-flex  justify-content-between mb-0.5">
            <p className="mb-0 ">{title}</p>
          </Card.Title>

          <Card.Text>{`#${id} opened ${formattedDate}`}</Card.Text>

          <Card.Text>{`${author} | Comments: ${comments}`}</Card.Text>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default React.memo(IssueCard);
