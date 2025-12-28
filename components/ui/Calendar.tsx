import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { Button } from './Button';

interface CalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  className?: string;
  minDate?: Date;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelect, className = "", minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className={`p-4 bg-popover border border-border rounded-xl shadow-lg max-w-[320px] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="font-bold text-popover-foreground text-base">
          {format(currentMonth, 'MMMM, yyyy')}
        </span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 text-muted-foreground hover:text-popover-foreground hover:bg-muted">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 text-muted-foreground hover:text-popover-foreground hover:bg-muted">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs text-muted-foreground font-semibold py-1 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isDayToday = isToday(day);
          const isDisabled = minDate ? day < new Date(new Date(minDate).setHours(0,0,0,0)) : false;

          return (
            <div key={day.toString()} className="relative w-full pt-[100%]">
                <button
                onClick={() => !isDisabled && onSelect(day)}
                disabled={isDisabled}
                className={`
                    absolute inset-0 flex items-center justify-center text-sm rounded-lg transition-all duration-200
                    ${!isCurrentMonth ? 'text-muted-foreground/50' : 'text-foreground'}
                    ${isSelected 
                        ? 'bg-primary text-primary-foreground font-bold shadow-md scale-105 z-10' 
                        : 'hover:bg-muted'}
                    ${isDayToday && !isSelected ? 'border border-primary text-primary' : ''}
                    ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer'}
                `}
                >
                {format(day, 'd')}
                </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};