export const getCurrentISTDate = () => {
  const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(new Date());
  
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  
  return `${year}-${month}-${day}`;
};

export const formatEventDateToYYYYMMDD = (eventDateStr) => {
  // If the date is already in YYYY-MM-DD format, just return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(eventDateStr)) {
    return eventDateStr;
  }

  const date = new Date(eventDateStr);
  if (isNaN(date.getTime())) return "9999-99-99"; // Fallback for unparseable dates
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getEventStatus = (eventDateStr) => {
  if (!eventDateStr) return 'previous'; // fallback

  const currentIST = getCurrentISTDate();
  const eventDate = formatEventDateToYYYYMMDD(eventDateStr);
  
  // Lexicographical string comparison of YYYY-MM-DD
  if (eventDate >= currentIST) {
    return 'upcoming';
  } else {
    return 'previous';
  }
};

export const categorizeAndSortEvents = (events) => {
  if (!events || !Array.isArray(events)) {
    return { upcoming: [], previous: [] };
  }

  const upcoming = [];
  const previous = [];

  events.forEach(event => {
    const status = getEventStatus(event.date);
    if (status === 'upcoming') {
      upcoming.push(event);
    } else {
      previous.push(event);
    }
  });

  // Sort upcoming chronologically (Ascending: nearest event first)
  upcoming.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });

  // Sort previous reverse-chronologically (Descending: most recently finished first)
  previous.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  return { upcoming, previous };
};
