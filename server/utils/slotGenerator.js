/**
 * Generates available time slots for a given day.
 *
 * @param {string} startTime - Start of working hours, e.g. "09:00"
 * @param {string} endTime   - End of working hours, e.g. "19:00"
 * @param {number} slotDurationMins - Duration of each slot in minutes (default: 30)
 * @param {string[]} bookedSlots    - Array of already booked slot times, e.g. ["09:00", "10:30"]
 * @returns {object[]} Array of slot objects with time and availability flag
 */
const generateSlots = (
  startTime = '09:00',
  endTime = '19:00',
  slotDurationMins = 30,
  bookedSlots = []
) => {
  const slots = [];

  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let current = startHour * 60 + startMin;
  const end = endHour * 60 + endMin;

  while (current + slotDurationMins <= end) {
    const hours = Math.floor(current / 60)
      .toString()
      .padStart(2, '0');
    const mins = (current % 60).toString().padStart(2, '0');
    const slotTime = `${hours}:${mins}`;

    slots.push({
      time: slotTime,
      isBooked: bookedSlots.includes(slotTime),
    });

    current += slotDurationMins;
  }

  return slots;
};

module.exports = { generateSlots };
