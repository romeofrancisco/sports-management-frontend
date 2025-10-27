import React from "react";
import { Box } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "../ui/empty";
import { Button } from "../ui/button";

const ContentEmpty = ({
  icon: Icon = Box,
  title = "No content found",
  description = "There are no items to display.",
  action = null,
}) => {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {action ? (
          <Button onClick={action.onClick}>
            <action.logo />
            {action.label}
          </Button>
        ) : null}
      </EmptyContent>
    </Empty>
  );
};

export default ContentEmpty;
