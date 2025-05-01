import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PeriodSelector = ({ periods, selectedPeriodIndex, onPeriodChange }) => {
  if (!periods?.length) return null;

  return (
    <Select
      value={selectedPeriodIndex.toString()}
      onValueChange={(val) => onPeriodChange(Number(val))}
    >
      <SelectTrigger size="xs" className="text-xs h-8">
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent>
        {periods.map((p, i) => (
          <SelectItem key={p.number} value={i.toString()} className="text-xs">
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PeriodSelector;