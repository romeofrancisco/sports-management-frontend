import React from "react";
const AttendanceStatistics = ({ attendanceStats }) => {
  return (
    <div className="flex items-center gap-6 rounded-xl px-4 py-2.5 border-2 border-primary/20">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        <span className="text-sm font-medium text-gray-700">
          {attendanceStats?.total || 0} Total
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-medium text-gray-700">
          {attendanceStats?.present || 0} Present
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
        <span className="text-sm font-medium text-gray-700">
          {attendanceStats?.late || 0} Late
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-sm font-medium text-gray-700">
          {attendanceStats?.absent || 0} Absent
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        <span className="text-sm font-medium text-gray-700">
          {attendanceStats?.pending || 0} Pending
        </span>
      </div>
    </div>
  );
};

export default AttendanceStatistics;
