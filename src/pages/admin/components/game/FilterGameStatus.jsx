import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GAME_STATUS } from "@/constants/game";

const FilterGameStatus = ({ filterStatus }) => {
  return (
    <Select
      defaultValue="scheduled"
      onValueChange={(value) => filterStatus(value)}
    >
      <SelectTrigger className="w-[11.5rem] place-self-end justify-center gap-1">
        <span className="text-muted-foreground ">Status:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={GAME_STATUS.SCHEDULED}>Scheduled</SelectItem>
        <SelectItem value={GAME_STATUS.COMPLETED}>Completed</SelectItem>
        <SelectItem value={GAME_STATUS.IN_PROGRESS}>In Progress</SelectItem>
        <SelectItem value={GAME_STATUS.POSTPONED}>Postponed</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FilterGameStatus;
