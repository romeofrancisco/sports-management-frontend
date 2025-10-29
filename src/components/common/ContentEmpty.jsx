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
        <div className="flex gap-2">
          {action ? (
            <Button onClick={action.onClick}>
              {action.logo && <action.logo />}
              {action.label}
            </Button>
          ) : null}
          {action?.extra ? (
            <Button variant="outline" onClick={action.extra.onClick}>
              {action.extra.logo && <action.extra.logo />}
              {action.extra.label}
            </Button>
          ) : null}
        </div>
      </EmptyContent>
    </Empty>
  );
};

export default ContentEmpty;
