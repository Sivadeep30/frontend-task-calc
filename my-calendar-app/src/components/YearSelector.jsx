import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const YearSelector = ({ currentDate, onYearSelect, onClose }) => {
  const currentYear = currentDate.year();
  const [startYear, setStartYear] = React.useState(Math.floor(currentYear / 12) * 12);
  
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);
  
  const nextDecade = () => setStartYear(startYear + 12);
  const prevDecade = () => setStartYear(startYear - 12);
  
  const handleYearClick = (year) => {
    onYearSelect(currentDate.year(year));
    onClose();
  };
  
  return (
    <div className="year-selector-overlay" onClick={onClose}>
      <div className="year-selector" onClick={(e) => e.stopPropagation()}>
        <div className="year-selector-header">
          <button onClick={prevDecade} className="year-nav-button">
            <ChevronLeft size={16} />
          </button>
          <h3 className="year-selector-title">
            {startYear} - {startYear + 11}
          </h3>
          <button onClick={nextDecade} className="year-nav-button">
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="year-grid">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => handleYearClick(year)}
              className={`year-button ${year === currentYear ? 'selected' : ''}`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearSelector;