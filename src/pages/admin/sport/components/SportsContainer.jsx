import React, { useState } from "react";
import SportCard from "./SportCard";
import { useSports, useReactivateSport } from "@/hooks/useSports";
import ContentLoading from "@/components/common/ContentLoading";
import SportModal from "@/components/modals/SportModal";
import { useModal } from "@/hooks/useModal";
import DeleteSportModal from "@/components/modals/DeleteSportModal";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

const SportsContainer = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const { data: sports, isLoading } = useSports();
  const { mutate: reactivateSport } = useReactivateSport();

  const modals = {
    update: useModal(),
    delete: useModal(),
  };

  const handleUpdateSport = (sport) => {
    setSelectedSport(sport);
    modals.update.openModal();
  };

  const handleDeleteSport = (sport) => {
    setSelectedSport(sport);
    modals.delete.openModal();
  };

  const handleReactivateSport = (sport) => {
    reactivateSport(sport.slug);
  };

  const totalSports = sports?.length || 0;

  return (
    <>
      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden min-h-[calc(100vh-10.5rem)]">
        <CardHeader className="flex flex-col border-b-2 border-primary/20 justify-between gap-4 pb-5 bg-transparent">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-3 rounded-xl">
                <Trophy className="size-7 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">Sports</h2>
                  <Badge className="h-6 text-[11px]">{totalSports} sports</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Manage and configure sports stats, formulas, and settings.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ContentLoading />
          ) : sports && sports.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2">
              {sports.map((sport) => (
                <SportCard
                  key={sport.id}
                  sport={sport}
                  onEdit={handleUpdateSport}
                  onDelete={handleDeleteSport}
                  onReactivate={handleReactivateSport}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg opacity-50"></div>
              <div className="relative">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-primary/20">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                <p className="text-foreground font-bold text-lg mb-2">
                  No sports found
                </p>
                <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                  Create your first sport to get started with sports management
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <SportModal
        sport={selectedSport}
        isOpen={modals.update.isOpen}
        onClose={modals.update.closeModal}
      />
      <DeleteSportModal
        sport={selectedSport}
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
      />
    </>
  );
};

export default SportsContainer;
