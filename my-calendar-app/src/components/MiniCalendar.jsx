import React from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MiniCalendar = ({ currentDate, onDateSelect, onClose }) => {
  const [viewDate, setViewDate] = React.useState(currentDate);
  
  const startOfMonth = viewDate.startOf('month');
  const endOfMonth = viewDate.endOf('month');
  const startDate = startOfMonth.startOf('week');
  const endDate = endOfMonth.endOf('week');
  
  const today = dayjs();
  
  const nextMonth = () => setViewDate(viewDate.add(1, 'month'));
  const prevMonth = () => setViewDate(viewDate.subtract(1, 'month'));
  
  const handleDateClick = (date) => {
    onDateSelect(date);
    onClose();
  };
  
  const renderMiniCells = () => {
    const days = [];
    let day = startDate;
    
    while (day.isBefore(endDate, 'day') || day.isSame(endDate, 'day')) {
      const cloneDay = day;
      const isToday = today.isSame(cloneDay, 'day');
      const isCurrentMonth = viewDate.isSame(cloneDay, 'month');
      const isSelected = currentDate.isSame(cloneDay, 'day');
      
      days.push(
        <button
          key={cloneDay.toString()}
          onClick={() => handleDateClick(cloneDay)}
          className={`mini-calendar-day ${isToday ? 'today' : ''} ${isCurrentMonth ? 'current-month' : 'other-month'} ${isSelected ? 'selected' : ''}`}
        >
          {cloneDay.format('D')}
        </button>
      );
      day = day.add(1, 'day');
    }
    
    return days;
  };
  
  return (
    <div className="mini-calendar-overlay" onClick={onClose}>
      <div className="mini-calendar" onClick={(e) => e.stopPropagation()}>
        <div className="mini-calendar-header">
          <button onClick={prevMonth} className="mini-nav-button">
            <ChevronLeft size={16} />
          </button>
          <h3 className="mini-calendar-title">
            {viewDate.format('MMMM YYYY')}
          </h3>
          <button onClick={nextMonth} className="mini-nav-button">
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="mini-calendar-days-header">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="mini-day-header">{day}</div>
          ))}
        </div>
        
        <div className="mini-calendar-grid">
          {renderMiniCells()}
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;