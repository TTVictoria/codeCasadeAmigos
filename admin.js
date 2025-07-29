document.addEventListener('DOMContentLoaded', function () {
    const roomColors = {
      'El Azur': '#a3dff2',
      'Los Olivos': '#fece04',
      'El Azahar': '#beba2a',
      'La Albahaca': '#4f1f3a',
      'La Lavanda': '#b8a1ea'
    };

    let bookings = [];

    const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
      initialView: 'dayGridMonth',
      locale: 'uk',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      events: [],
      eventDidMount: function(info) {
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
      const adults = data.get('adults');
      const children = data.get('children');

      bookings.push({ room, start, end });

      calendar.addEvent({
        title: `Кімната ${room}`,
        start: start,
        end: addOneDay(end),
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          guest: guest
        }
      });

      calendar.addEvent({
        title: `Прибирання перед (${room})`,
        start: subtractDays(start, 1),
        backgroundColor: '#e0e0e0'
      });

      calendar.addEvent({
        title: `Прибирання після (${room})`,
        start: addOneDay(end),
        backgroundColor: '#e0e0e0'
      });

      calendar.addEvent({
        title: `Приліт (${guest})`,
        start: arrivalDate,
        extendedProps: {
          description: `Час: ${arrivalTime}, трансфер: ${pickup}`
        }
      });

      calendar.addEvent({
        title: `Виліт (${guest})`,
        start: departureDate,
        extendedProps: {
          description: `Час: ${departureTime}`
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
  });








  // Загрузка имён из localStorage
function loadGuestNames() {
  const stored = localStorage.getItem('guestNames');
  return stored ? JSON.parse(stored) : [];
}

// Сохранение нового имени, если ещё не было
function saveGuestName(name) {
  let names = loadGuestNames();
  if (!names.includes(name)) {
    names.push(name);
    localStorage.setItem('guestNames', JSON.stringify(names));
    updateGuestList(names);
  }
}

// Обновление datalist
function updateGuestList(names) {
  const datalist = document.getElementById('guestList');
  datalist.innerHTML = '';
  names.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    datalist.appendChild(option);
  });
}

// Вызываем при загрузке
document.addEventListener('DOMContentLoaded', function () {
  updateGuestList(loadGuestNames());
});




document.addEventListener('DOMContentLoaded', function () {
      var calendarEl = document.getElementById('calendar');
      var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'uk',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        events: []
      });
      calendar.render();
    });