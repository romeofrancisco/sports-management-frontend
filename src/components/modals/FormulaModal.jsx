import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import FormulaForm from "../forms/FormulaForm";
import { useParams } from "react-router";
import ContentLoading from "../common/ContentLoading";
import { useSportStats } from "@/hooks/useStats";

const FormulaModal = ({ isOpen, onClose, formula = null }) => {
  const { sport } = useParams();
  const { data: stats, isLoading } = useSportStats(sport);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{formula ? "Update Formula" : "Create New Formula"}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh]">
          {isLoading ? (
            <ContentLoading />
          ) : (
            <FormulaForm
              onClose={onClose}
              stats={stats}
              sport={sport}
              formula={formula}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FormulaModal;
