import React from "react";

interface ListItemProps {
  title: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ({ title, onClick }: ListItemProps) {
  return (
    <button id={title} className="list-item" onClick={onClick}>
      {title}
    </button>
  );
}
