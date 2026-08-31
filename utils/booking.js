const DAY_MS = 24 * 60 * 60 * 1000;

const parseDateOnly = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getNights = (checkIn, checkOut) => Math.round((checkOut - checkIn) / DAY_MS);

const normalizeBookingInput = (body = {}, maxGuests = 1) => {
  const checkIn = parseDateOnly(body.checkIn);
  const checkOut = parseDateOnly(body.checkOut);
  const guests = Number.parseInt(body.guests, 10);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (!checkIn || !checkOut) return { error: "Choose valid check-in and check-out dates." };
  if (checkIn < today) return { error: "Check-in cannot be in the past." };
  const nights = getNights(checkIn, checkOut);
  if (nights < 1) return { error: "Check-out must be after check-in." };
  if (!Number.isInteger(guests) || guests < 1 || guests > maxGuests) return { error: `Choose between 1 and ${maxGuests} guests.` };
  return { checkIn, checkOut, guests, nights };
};

const overlapFilter = (listing, checkIn, checkOut) => ({
  listing,
  status: "confirmed",
  checkIn: { $lt: checkOut },
  checkOut: { $gt: checkIn },
});

module.exports = { getNights, normalizeBookingInput, overlapFilter, parseDateOnly };
