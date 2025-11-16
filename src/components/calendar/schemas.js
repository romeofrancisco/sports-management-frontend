import { z } from "zod";

export const eventSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	startDate: z.date({
		required_error: "Start date is required",
	}),
	endDate: z.date({
		required_error: "End date is required",
	}),
	color: z.enum(["blue", "green", "red", "yellow", "purple", "orange"], {
		required_error: "Variant is required",
	}),
});

// Reservation schema extends the base event schema and includes facility/coach ids.
export const reservationSchema = eventSchema.extend({
	// HTML select fields are strings; coerce to number for backend
	facility_id: z.preprocess((val) => {
		if (typeof val === "string") {
			const n = Number(val);
			return Number.isNaN(n) ? val : n;
		}
		return val;
	}, z.number({ required_error: "Facility is required" })),
	coach_id: z.preprocess((val) => {
		if (val === "" || val === null || val === undefined) return undefined;
		if (typeof val === "string") {
			const n = Number(val);
			return Number.isNaN(n) ? val : n;
		}
		return val;
	}, z.number().optional()),
});
