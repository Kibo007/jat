"use client";

import * as React from "react";

import { PositionStatus } from "@/types/common";
import { onUpdateStatus } from "@/actions/updatePosition";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { POSITION_STATUS } from "@/utils/supabase/constants";

interface SelectStatusProps {
  status: PositionStatus;
  id: number;
}

export const SelectStatus = ({ status, id }: SelectStatusProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Select
      open={isOpen}
      onOpenChange={setIsOpen}
      defaultValue={status}
      onValueChange={(status) => {
        onUpdateStatus(id, status as PositionStatus);
      }}
    >
      <SelectTrigger
        className="w-[120px]"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((state) => !state);
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <SelectValue placeholder="Select postion status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {POSITION_STATUS.map((status) => {
            return (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
