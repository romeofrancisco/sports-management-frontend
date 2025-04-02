import React from "react";
import CoachListHeader from "./components/coach/CoachListHeader";
import CoachTable from "./components/coach/CoachTable";
import { useCoaches } from "@/hooks/useCoaches";
import Loading from "@/components/common/Loading";
import PageError from "../PageError";

const CoachList = () => {
  const { data, isLoading, isError } = useCoaches();

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  return (
    <div>
      <CoachListHeader />
      <CoachTable coaches={data} />
    </div>
  );
};

export default CoachList;
