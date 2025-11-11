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
import { useSportStats, useStatCategories } from "@/hooks/useStats";
import Modal from "../common/Modal";
import { Calculator } from "lucide-react";

const FormulaModal = ({ isOpen, onClose, formula = null }) => {
  const { sport } = useParams();
  const { data: stats, isLoading: isStatsLoading } = useSportStats(sport);
  const { data: categories, isLoading: isCategoriesLoading } =
    useStatCategories({ sport: sport });

  return (
    <Modal
      title={formula ? "Update Formula" : "Create New Formula"}
      description={
        formula
          ? "Modify the details of the existing formula."
          : "Fill out the details below to create a new formula."
      }
      icon={Calculator}
      open={isOpen}
      onOpenChange={onClose}
    >
      {isStatsLoading || isCategoriesLoading ? (
        <ContentLoading />
      ) : (
        <FormulaForm
          onClose={onClose}
          stats={stats}
          sport={sport}
          formula={formula}
          categories={categories}
        />
      )}
    </Modal>
  );
};

export default FormulaModal;
