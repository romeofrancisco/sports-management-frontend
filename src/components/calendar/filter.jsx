import { CheckIcon, Filter, RefreshCcw } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { useCalendar } from "@/components/calendar/calendar-context";

export default function FilterEvents() {
	const { selectedColors, filterEventsBySelectedColors, clearFilter } =
		useCalendar();

	const colors = [
		{ key: "blue", label: "event" },
		{ key: "green", label: "practice" },
		{ key: "red", label: "league" },
		{ key: "purple", label: "tournament" },
		{ key: "orange", label: "training" },
	];

	return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
				<Toggle variant="outline" className="cursor-pointer w-fit">
					<Filter className="h-4 w-4" />
				</Toggle>
			</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
				{colors.map((color, index) => (
					<DropdownMenuItem
						key={color.key}
						className="flex items-center gap-2 cursor-pointer"
						onClick={(e) => {
							e.preventDefault();
							filterEventsBySelectedColors(color.key);
						}}>
						<div className={`size-3.5 rounded-full bg-${color.key}-600 dark:bg-${color.key}-700`} />
						<span className="capitalize flex justify-center items-center gap-2">
							{color.label}
							<span>
								{selectedColors.includes(color.key) && (
									<span className="text-blue-500">
										<CheckIcon className="size-4" />
									</span>
								)}
							</span>
						</span>
					</DropdownMenuItem>
				))}
				<Separator className="my-2" />
				<DropdownMenuItem
                    disabled={selectedColors.length === 0}
                    className="flex gap-2 cursor-pointer"
                    onClick={(e) => {
						e.preventDefault();
						clearFilter();
					}}>
					<RefreshCcw className="size-3.5" />
					Clear Filter
				</DropdownMenuItem>
			</DropdownMenuContent>
        </DropdownMenu>
    );
}
