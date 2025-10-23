import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SportStatsForm from "../forms/SportStatsForm";
import { useFormula } from "@/hooks/useFormula";
import { useParams } from "react-router";
import ContentLoading from "../common/ContentLoading";
import { ScrollArea } from "../ui/scroll-area";
import { useStatCategories } from "@/hooks/useStats";

const SportStatsModal = ({ isOpen, onClose, stat }) => {
  const { sport } = useParams();
  const { data: formulas, isLoading } = useFormula(sport);
  const { data: categories } = useStatCategories();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Stat</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh] px-5">
          {isLoading ? (
            <ContentLoading />
          ) : (
            <SportStatsForm
              onClose={onClose}
              stat={stat}
              formulas={formulas}
              sport={sport}
              categories={categories}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SportStatsModal;
