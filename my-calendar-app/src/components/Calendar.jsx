import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight, Star, StarOff, Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import eventsData from '../data/events.json';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [importantDates, setImportantDates] = useState(new Set());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setEvents(eventsData);
  }, []);

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startDate = startOfMonth.startOf('week');
  const endDate = endOfMonth.endOf('week');

  const today = dayjs();

  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));
  const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));

  const toggleImportantDate = (date, e) => {
    e.stopPropagation();
    const dateStr = date.format('YYYY-MM-DD');
    const newImportantDates = new Set(importantDates);
    
    if (newImportantDates.has(dateStr)) {
      newImportantDates.delete(dateStr);
    } else {
      newImportantDates.add(dateStr);
    }
    
    setImportantDates(newImportantDates);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'event-high';
      case 'medium': return 'event-medium';
      case 'low': return 'event-low';
      default: return 'event-default';
    }
  };

  const checkEventConflicts = (dayEvents) => {
    const conflicts = [];
    for (let i = 0; i < dayEvents.length; i++) {
      for (let j = i + 1; j < dayEvents.length; j++) {
        const event1 = dayEvents[i];
        const event2 = dayEvents[j];
        const time1 = dayjs(`${event1.date} ${event1.time}`);
        const time2 = dayjs(`${event2.date} ${event2.time}`);
        const end1 = time1.add(event1.duration, 'minute');
        const end2 = time2.add(event2.duration, 'minute');
        
        if ((time1.isBefore(end2) && time2.isBefore(end1))) {
          conflicts.push([event1, event2]);
        }
      }
    }
    return conflicts;
  };

  const renderHeader = () => (
    <div className="calendar-header">
      <div className="header-left">
        <div className="calendar-icon">
          <CalendarIcon size={24} />
        </div>
        <div className="header-info">
          <h1 className="header-title">
            {currentDate.format('MMMM YYYY')}
          </h1>
          <p className="header-subtitle">
            {events.length} events this month
          </p>
        </div>
      </div>
      <div className="header-controls">
        <button
          onClick={prevMonth}
          className="nav-button"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextMonth}
          className="nav-button"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return (
      <div className="days-header">
        {days.map((day, index) => (
          <div key={index} className="day-header">
            <span className="day-full">{day}</span>
            <span className="day-short">{day.slice(0, 3)}</span>
            <span className="day-letter">{day.charAt(0)}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day.isBefore(endDate, 'day') || day.isSame(endDate, 'day')) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = day.format('D');
        const isToday = today.isSame(cloneDay, 'day');
        const isCurrentMonth = currentDate.isSame(cloneDay, 'month');
        const isImportant = importantDates.has(cloneDay.format('YYYY-MM-DD'));
        const dayEvents = events.filter(event => dayjs(event.date).isSame(cloneDay, 'day'));
        const isSelected = selectedDate?.isSame(cloneDay, 'day');
        const conflicts = checkEventConflicts(dayEvents);
        const hasConflicts = conflicts.length > 0;

        let cellClasses = 'calendar-cell';
        if (isSelected) cellClasses += ' selected';
        if (!isCurrentMonth) cellClasses += ' other-month';
        if (hasConflicts) cellClasses += ' has-conflicts';

        days.push(
          <div
            key={cloneDay.toString()}
            className={cellClasses}
            onClick={() => {
              setSelectedDate(cloneDay);
            }}
          >
            <div className="cell-header">
              <span className={`date-number ${isToday ? 'today' : ''} ${isCurrentMonth ? 'current-month' : 'other-month'}`}>
                {formattedDate}
              </span>
              <button
                onClick={(e) => toggleImportantDate(cloneDay, e)}
                className={`star-button ${isImportant ? 'important' : ''}`}
                aria-label="Mark as important"
              >
                {isImportant ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
              </button>
            </div>

            {hasConflicts && (
              <div className="conflict-indicator" title="Time conflicts detected"></div>
            )}

            <div className="events-container">
              {dayEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className={`event-badge ${getPriorityColor(event.priority)} ${conflicts.some(conflict => conflict.includes(event)) ? 'conflicted' : ''}`}
                  title={`${event.title} - ${event.description}`}
                >
                  <div className="event-content">
                    <Clock size={10} />
                    <span className="event-title">{event.title}</span>
                  </div>
                  <div className="event-time">{event.time}</div>
                </div>
              ))}
              
              {/* Show detailed event info for selected date */}
              {isSelected && dayEvents.length > 0 && (
                <div className="event-details-inline">
                  {dayEvents.map((event) => (
                    <div key={`detail-${event.id}`} className="event-detail-inline">
                      <div className="event-detail-header">
                        <span className="event-detail-title">{event.title}</span>
                        <span className={`priority-badge priority-${event.priority}`}>
                          {event.priority}
                        </span>
                      </div>
                      <div className="event-detail-description">{event.description}</div>
                      <div className="event-detail-meta">
                        <span className="meta-item">
                          <Clock size={12} />
                          {event.time}
                        </span>
                        <span className="meta-item">
                          <Users size={12} />
                          {event.duration} min
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {dayEvents.length > 3 && !isSelected && (
                <div className="more-events">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>

            {isToday && <div className="today-indicator"></div>}
          </div>
        );
        day = day.add(1, 'day');
      }
      rows.push(
        <div key={day.toString()} className="calendar-row">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="calendar-grid">{rows}</div>;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        {renderHeader()}
        
        <div className="calendar-main">
          {renderDays()}
          {renderCells()}
        </div>
        
        <div className="stats-footer">
          <div className="stat-card">
            <div className="stat-number">{events.length}</div>
            <div className="stat-label">Total Events</div>
          </div>
          <div className="stat-card">
            <div className="stat-number important">{importantDates.size}</div>
            <div className="stat-label">Important Dates</div>
          </div>
          <div className="stat-card">
            <div className="stat-number high-priority">
              {events.filter(e => e.priority === 'high').length}
            </div>
            <div className="stat-label">High Priority</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;