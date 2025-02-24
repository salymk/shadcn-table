import React, { useState, useEffect } from "react";
import { type Cell } from "@tanstack/react-table";
import { type Person } from "~/makeData";

interface EditableCellProps {
  cell: Cell<Person, unknown>;
  row: any;
}

export function EditableCell({ cell, row }: EditableCellProps) {
  const initialValue = cell.getValue() as string;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    // Only update if value changed
    if (value !== initialValue) {
      row._valuesCache[cell.column.id] = value;
      // You can also implement your update logic here
      console.log("Updated value:", value);
    }
  };

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      className="w-full h-full bg-transparent cursor-pointer border-none outline-none text-wrap"
    />
  );
}
