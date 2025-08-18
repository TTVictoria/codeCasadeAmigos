document.addEventListener('DOMContentLoaded', function () {
  const roomColors = {
    'El Azur': '#a3e0f2bf',
    'Los Olivos': '#fecc04c4',
    'El Azahar': '#beb92ac1',
    'La Albahaca': '#4f1f3ab8',
    'La Lavanda': '#b8a1eac1'
  };

  let bookings = [];

  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'uk', // українська мова
    firstDay: 1, // початок тижня з понеділка
    height: 'auto', // Чтобы не было прокрутки
    contentHeight: 'auto',
    fixedWeekCount: false, // Убирает пустые недели и корректно отображает месяц
    headerToolbar: {
       left: 'prev', // стрелка назад
       center: 'title', // название месяца (в центре)
       right: 'next today dayGridMonth timeGridWeek listWeek' // стрелка вперёд + кнопки управления
    },
    events: [],
    eventDidMount: function (info) {
      if (info.event.extendedProps.guest) {
        info.el.title = 'Гість: ' + info.event.extendedProps.guest;
      } else if (info.event.extendedProps.description) {
        info.el.title = info.event.extendedProps.description;
      }
    }
  });

  calendar.render();

  const form = document.getElementById('bookingForm');
  const roomSelect = document.getElementById('roomSelect');

  form.start.addEventListener('change', updateRoomAvailability);
  form.end.addEventListener('change', updateRoomAvailability);

  function updateRoomAvailability() {
    const start = new Date(form.start.value);
    const end = new Date(form.end.value);

    for (const option of roomSelect.options) {
      if (!option.value) continue;
      option.disabled = isRoomBooked(option.value, start, end);
    }
  }

  function isRoomBooked(room, startDate, endDate) {
    return bookings.some(b => {
      if (b.room !== room) return false;
      const bStart = new Date(b.start);
      const bEnd = new Date(b.end);
      return !(endDate < bStart || startDate > bEnd);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const guest = data.get('guest');
    saveGuestName(guest);
    const room = data.get('room');
    const color = roomColors[room];
    const start = data.get('start');
    const end = data.get('end');
    const arrivalDate = data.get('arrivalDate');
    const arrivalTime = data.get('arrivalTime');
    const departureDate = data.get('departureDate');
    const departureTime = data.get('departureTime');
    const pickup = data.get('airportPickup') ? 'так' : 'ні';

    bookings.push({ room, start, end });

    calendar.addEvent({
      title: `Кімната ${room}`,
      start: start,
      end: addOneDay(end),
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        guest,
        room
      }
    });

    calendar.addEvent({
      title: `Прибирання перед (${room})`,
      start: subtractDays(start, 1),
      backgroundColor: '#e0e0e0',
      extendedProps: { room }
    });

    calendar.addEvent({
      title: `Прибирання після (${room})`,
      start: addOneDay(end),
      backgroundColor: '#e0e0e0',
      extendedProps: { room }
    });

    calendar.addEvent({
      title: `Приліт (${guest})`,
      start: arrivalDate,
      extendedProps: {
        description: `Час: ${arrivalTime}, трансфер: ${pickup}`,
        room
      }
    });

    calendar.addEvent({
      title: `Виліт (${guest})`,
      start: departureDate,
      extendedProps: {
        description: `Час: ${departureTime}`,
        room,
        isDeparture: true
      }
    });

    form.reset();
    updateRoomAvailability();
  });

  function addOneDay(dateStr) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  function subtractDays(dateStr, days) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  }

  // LocalStorage: guests
  function loadGuestNames() {
    const stored = localStorage.getItem('guestNames');
    return stored ? JSON.parse(stored) : [];
  }

  function saveGuestName(name) {
    let names = loadGuestNames();
    if (!names.includes(name)) {
      names.push(name);
      localStorage.setItem('guestNames', JSON.stringify(names));
      updateGuestList(names);
    }
  }

  function updateGuestList(names) {
    const datalist = document.getElementById('guestList');
    datalist.innerHTML = '';
    names.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      datalist.appendChild(option);
    });
  }

  updateGuestList(loadGuestNames());

  // Filters
  document.getElementById("roomFilter").addEventListener("change", filterCalendar);
  document.getElementById("departureFilter").addEventListener("change", filterCalendar);

  function filterCalendar() {
    const selectedRoom = document.getElementById("roomFilter").value;
    const filterType = document.getElementById("departureFilter").value;

    calendar.getEvents().forEach(event => {
      const isDeparture = event.extendedProps.isDeparture;
      const matchesRoom = selectedRoom === "all" || event.extendedProps.room === selectedRoom;

      if (filterType === "departures") {
        event.setProp("display", isDeparture ? "auto" : "none");
      } else {
        event.setProp("display", matchesRoom ? "auto" : "none");
      }
    });
  }
});











function changeQty(field, delta) {
    const input = document.getElementById(field);
    let value = parseInt(input.value, 10);
    const min = parseInt(input.min, 10);

    value = isNaN(value) ? min : value + delta;
    if (value < min) value = min;

    input.value = value;
  }








// прокрутка стрелок на панеле комнат
  const track = document.querySelector('.carousel-track');
const leftBtn = document.querySelector('.arrow.left');
const rightBtn = document.querySelector('.arrow.right');

let currentIndex = 0;
const visibleCards = 3;
const cards = document.querySelectorAll('.room-card');
const cardWidth = cards[0].offsetWidth + 30;

leftBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
});

rightBtn.addEventListener('click', () => {
  if ((currentIndex + visibleCards) < cards.length) {
    currentIndex++;
    updateCarousel();
  }
});

function updateCarousel() {
  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}