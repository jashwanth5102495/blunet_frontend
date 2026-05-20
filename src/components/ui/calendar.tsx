import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./button";

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const CalendarDay: React.FC<{ 
  day: number | string; 
  isHeader?: boolean; 
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ day, isHeader, isSelected, onClick }) => {
  return (
    <div
      onClick={!isHeader ? onClick : undefined}
      className={`col-span-1 row-span-1 flex h-8 w-8 items-center justify-center ${
        isHeader ? "" : "rounded-xl cursor-pointer hover:bg-gray-800 transition-colors"
      } ${
        isSelected 
          ? "bg-indigo-500 text-white hover:bg-indigo-600" 
          : isHeader 
            ? "text-gray-500" 
            : "text-gray-300"
      }`}
    >
      <span className={`font-medium ${isHeader ? "text-xs" : "text-sm"}`}>
        {day}
      </span>
    </div>
  );
};

export function Calendar() {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [phase, setPhase] = useState<"calendar" | "form" | "success">("calendar");
  const [formData, setFormData] = useState({ name: "", email: "" });

  const renderCalendarDays = () => {
    let days: React.ReactNode[] = [
      ...dayNames.map((day) => (
        <CalendarDay key={`header-${day}`} day={day} isHeader />
      )),
      ...Array(firstDayOfWeek).fill(null).map((_, i) => (
        <div key={`empty-start-${i}`} className="col-span-1 row-span-1 h-8 w-8" />
      )),
      ...Array(daysInMonth).fill(null).map((_, i) => {
        const day = i + 1;
        return (
          <CalendarDay 
            key={`date-${day}`} 
            day={day} 
            isSelected={selectedDate === day}
            onClick={() => setSelectedDate(day)}
          />
        );
      }),
    ];
    return days;
  };

  const handleBook = () => {
    if (selectedDate) setPhase("form");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setPhase("success");
    }
  };

  return (
    <BentoCard height="h-auto">
      <div className="grid h-full gap-5 bg-black/90 text-white p-6 md:p-8 rounded-2xl min-h-[350px]">
        
        {phase === "calendar" && (
          <>
            <div className="">
              <h2 className="mb-4 text-xl md:text-3xl font-semibold">
                Ready to Build the Future?
              </h2>
              <p className="mb-2 text-sm md:text-base text-gray-400">
                Select a date for a free consultation call with our team.
              </p>
              <Button 
                onClick={handleBook}
                disabled={!selectedDate}
                className="mt-4 rounded-2xl bg-white text-black hover:bg-gray-200 px-6 py-6 font-bold text-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue Booking
              </Button>
            </div>
            <div className="transition-all duration-500 ease-out md:group-hover:-right-12 md:group-hover:top-5 relative">
              <div className="h-full w-full max-w-[550px] rounded-[24px] border border-gray-800 p-2 transition-colors duration-100 group-hover:border-indigo-400 bg-[#0f0f0f]">
                <div className="h-full rounded-2xl border-2 border-[#A5AEB81F]/10 p-3" style={{ boxShadow: "0px 2px 1.5px 0px rgba(165,174,184,0.1) inset" }}>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm">
                      <span className="font-medium text-white">
                        {currentMonth}, {currentYear}
                      </span>
                    </p>
                    <span className="h-1 w-1 rounded-full bg-white/20">&nbsp;</span>
                    <p className="text-xs text-gray-400">30 min call</p>
                  </div>
                  <div className="mt-4 grid grid-cols-7 grid-rows-5 gap-2 px-4">
                    {renderCalendarDays()}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {phase === "form" && (
          <div className="flex flex-col justify-center h-full max-w-md w-full">
            <h2 className="mb-2 text-2xl font-semibold">Enter Details</h2>
            <p className="mb-6 text-sm text-gray-400">
              Booking for {currentMonth} {selectedDate}, {currentYear}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-3 mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setPhase("calendar")}
                  className="flex-1 border-gray-700 text-white bg-transparent hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-indigo-500 text-white hover:bg-indigo-600"
                >
                  Confirm Booking
                </Button>
              </div>
            </form>
          </div>
        )}

        {phase === "success" && (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className="mb-3 text-3xl font-bold text-white">Appointment Confirmed!</h2>
            <p className="text-gray-400 max-w-sm">
              Thanks {formData.name}, your consultation is booked for {currentMonth} {selectedDate}, {currentYear}. We've sent an invitation to {formData.email}.
            </p>
          </div>
        )}
        
      </div>
    </BentoCard>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  height?: string;
  rowSpan?: number;
  colSpan?: number;
  className?: string;
  showHoverGradient?: boolean;
  hideOverflow?: boolean;
}

export function BentoCard({
  children,
  height = "h-auto",
  rowSpan = 8,
  colSpan = 7,
  className = "",
  showHoverGradient = true,
  hideOverflow = true,
}: BentoCardProps) {
  return (
    <div
      className={`group relative flex flex-col rounded-2xl border border-gray-800 bg-black/80 hover:bg-indigo-900/10 ${
        hideOverflow && "overflow-hidden"
      } ${height} row-span-${rowSpan} col-span-${colSpan} ${className}`}
    >
      {showHoverGradient && (
        <div className="user-select-none pointer-events-none absolute inset-0 z-30 bg-gradient-to-tl from-indigo-400/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></div>
      )}
      {children}
    </div>
  );
}
