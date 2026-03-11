const API_BASE_URL = "http://localhost:3000/api";
const DEMO_STORAGE_KEY = "ota_demo_bookings_v1";
const DEMO_ROOMS_KEY = "ota_demo_rooms_v1";

const DEMO_HOTELS = [
  {
    id: 1,
    name: "Ocean View Resort",
    city: "Bali",
    description: "Beachfront resort with direct sea view",
    rating: 4.7,
    price: 120,
    featured_room_id: 1
  },
  {
    id: 2,
    name: "Mountain Paradise Hotel",
    city: "Bandung",
    description: "Cool weather stay near mountain attractions",
    rating: 4.4,
    price: 90,
    featured_room_id: 3
  },
  {
    id: 3,
    name: "City Lights Inn",
    city: "Jakarta",
    description: "Business-friendly hotel in city center",
    rating: 4.1,
    price: 110,
    featured_room_id: 4
  }
];

const DEFAULT_DEMO_ROOMS = [
  { id: 1, hotel_id: 1, room_name: "Deluxe Ocean", price: 120, capacity: 2, stock: 10 },
  { id: 2, hotel_id: 1, room_name: "Family Suite", price: 180, capacity: 4, stock: 5 },
  { id: 3, hotel_id: 2, room_name: "Standard", price: 90, capacity: 2, stock: 12 },
  { id: 4, hotel_id: 3, room_name: "Business", price: 110, capacity: 2, stock: 8 }
];

function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

function getHotelImage(name = "") {
  const key = name.toLowerCase();
  if (key.includes("ocean")) {
    return "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80";
  }
  if (key.includes("mountain")) {
    return "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";
  }
  return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80";
}

function readJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_err) {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getDemoRooms() {
  const rooms = readJsonStorage(DEMO_ROOMS_KEY, null);
  if (rooms) return rooms;
  writeJsonStorage(DEMO_ROOMS_KEY, DEFAULT_DEMO_ROOMS);
  return [...DEFAULT_DEMO_ROOMS];
}

function setDemoRooms(rooms) {
  writeJsonStorage(DEMO_ROOMS_KEY, rooms);
}

function getDemoBookings() {
  return readJsonStorage(DEMO_STORAGE_KEY, []);
}

function setDemoBookings(bookings) {
  writeJsonStorage(DEMO_STORAGE_KEY, bookings);
}

async function safeFetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

function filterHotels(data, city, q) {
  const cityLower = city.toLowerCase();
  const qLower = q.toLowerCase();
  return data.filter((h) => {
    const cityMatch = city ? h.city.toLowerCase().includes(cityLower) : true;
    const qMatch = q
      ? `${h.name} ${h.description}`.toLowerCase().includes(qLower)
      : true;
    return cityMatch && qMatch;
  });
}

async function getHotels(city, q) {
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  if (q) params.set("q", q);
  const url = `${API_BASE_URL}/hotels${params.toString() ? `?${params.toString()}` : ""}`;

  try {
    return await safeFetchJson(url);
  } catch (_err) {
    return filterHotels(DEMO_HOTELS, city, q);
  }
}

async function getHotelDetail(id) {
  try {
    return await safeFetchJson(`${API_BASE_URL}/hotels/${id}`);
  } catch (_err) {
    const hotel = DEMO_HOTELS.find((h) => h.id === Number(id));
    if (!hotel) throw new Error("Hotel not found");
    const rooms = getDemoRooms().filter((r) => r.hotel_id === Number(id));
    return { ...hotel, rooms };
  }
}

async function getBookingsData() {
  try {
    return await safeFetchJson(`${API_BASE_URL}/bookings`);
  } catch (_err) {
    return getDemoBookings();
  }
}

function createBookingInDemo(payload) {
  const rooms = getDemoRooms();
  const bookings = getDemoBookings();

  const room = rooms.find((r) => r.id === Number(payload.room_id));
  if (!room) throw new Error("Room not found");
  if (room.stock < 1) throw new Error("Room out of stock");

  const checkinDate = new Date(payload.checkin);
  const checkoutDate = new Date(payload.checkout);
  const stayInDays = Math.max(
    1,
    Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24))
  );

  const booking = {
    id: bookings.length + 1,
    user_id: Number(payload.user_id),
    room_id: Number(payload.room_id),
    guest_name: payload.guest_name,
    checkin: payload.checkin,
    checkout: payload.checkout,
    total_price: stayInDays * room.price,
    status: "pending_payment",
    created_at: new Date().toISOString(),
    source: "demo"
  };

  room.stock -= 1;
  setDemoRooms(rooms);
  setDemoBookings([...bookings, booking]);
  return booking;
}

async function createBookingRequest(payload) {
  try {
    return await safeFetchJson(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (_err) {
    const booking = createBookingInDemo(payload);
    return {
      status: "success",
      message: "Booking created (demo mode)",
      data: booking,
      next_step: "Click Pay on My Booking table"
    };
  }
}

async function payBookingRequest(id) {
  try {
    return await safeFetchJson(`${API_BASE_URL}/bookings/${id}/pay`, { method: "POST" });
  } catch (_err) {
    const bookings = getDemoBookings();
    const booking = bookings.find((b) => b.id === Number(id));
    if (!booking) throw new Error("Booking not found");
    booking.status = "confirmed";
    booking.paid_at = new Date().toISOString();
    setDemoBookings(bookings);
    return { status: "success", message: "Payment processed (demo mode)", data: booking };
  }
}

function renderHotelCards(data, hotelList) {
  if (!data.length) {
    hotelList.innerHTML = "<p>No hotel found.</p>";
    return;
  }

  hotelList.innerHTML = data
    .map(
      (hotel) => `
      <article class="room-card card">
        <img src="${getHotelImage(hotel.name)}" alt="${hotel.name}" />
        <div class="room-content">
          <h3>${hotel.name}</h3>
          <p>${hotel.city} · ⭐ ${hotel.rating}</p>
          <p>${hotel.description}</p>
          <p class="price">$${hotel.price}/night</p>
          <a href="hotel.html?id=${hotel.id}">Lihat Detail</a>
        </div>
      </article>
    `
    )
    .join("");
}

async function searchHotel() {
  const city = document.getElementById("city")?.value?.trim() || "";
  const q = document.getElementById("q")?.value?.trim() || "";
  const hotelList = document.getElementById("hotelList");
  if (!hotelList) return;

  try {
    const data = await getHotels(city, q);
    renderHotelCards(data, hotelList);
  } catch (_err) {
    hotelList.innerHTML = "<p class='error'>Gagal load data hotel.</p>";
  }
}

async function loadHotelDetail() {
  const hotelId = getQueryParam("id");
  const hotelDetail = document.getElementById("hotelDetail");
  const roomList = document.getElementById("roomList");
  if (!hotelId || !hotelDetail || !roomList) return;

  try {
    const hotel = await getHotelDetail(hotelId);

    hotelDetail.innerHTML = `
      <div class="detail-head">
        <img src="${getHotelImage(hotel.name)}" alt="${hotel.name}" />
        <div>
          <h3>${hotel.name}</h3>
          <p>${hotel.city} · ⭐ ${hotel.rating}</p>
          <p>${hotel.description}</p>
        </div>
      </div>
    `;

    roomList.innerHTML = (hotel.rooms || [])
      .map(
        (room) => `
        <article class="card">
          <h4>${room.room_name}</h4>
          <p>Capacity: ${room.capacity} pax</p>
          <p>Stock: ${room.stock}</p>
          <p class="price">$${room.price}/night</p>
          <a href="booking.html?room_id=${room.id}">Book this room</a>
        </article>
      `
      )
      .join("");
  } catch (_err) {
    hotelDetail.innerHTML = "<p class='error'>Gagal load detail hotel.</p>";
  }
}

async function createBooking(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());
  const result = document.getElementById("bookingResult");

  try {
    const json = await createBookingRequest(payload);
    if (result) result.textContent = JSON.stringify(json, null, 2);
    await loadBookings();
  } catch (err) {
    if (result) result.textContent = `Gagal membuat booking: ${err.message}`;
  }
}

async function payBooking(id) {
  try {
    await payBookingRequest(id);
    await loadBookings();
  } catch (_err) {
    // ignore
  }
}

function renderBookingsTable(bookings, body) {
  if (!bookings.length) {
    body.innerHTML = `<tr><td colspan="5">Belum ada booking.</td></tr>`;
    return;
  }

  body.innerHTML = bookings
    .map(
      (b) => `<tr>
        <td>#${b.id}</td>
        <td>Room ${b.room_id}</td>
        <td>${b.checkin} → ${b.checkout}</td>
        <td><span class="pill ${b.status === "confirmed" ? "pill-blue" : "pill-yellow"}">${b.status}</span></td>
        <td>${b.status === "pending_payment" ? `<button class="mini-btn" data-pay-id="${b.id}">Pay</button>` : "-"}</td>
      </tr>`
    )
    .join("");

  body.querySelectorAll("[data-pay-id]").forEach((btn) => {
    btn.addEventListener("click", () => payBooking(btn.dataset.payId));
  });
}

async function loadBookings() {
  const body = document.getElementById("myBookingBody");
  if (!body) return;

  try {
    const bookings = await getBookingsData();
    renderBookingsTable(bookings, body);
  } catch (_err) {
    body.innerHTML = `<tr><td colspan="5" class="error">Gagal load booking.</td></tr>`;
  }
}

function initPromoSlider() {
  const track = document.getElementById("promoTrack");
  const slider = document.getElementById("promoSlider");
  const prev = document.getElementById("promoPrev");
  const next = document.getElementById("promoNext");
  const dotsWrap = document.getElementById("promoDots");
  if (!track || !slider || !prev || !next || !dotsWrap) return;

  const slides = Array.from(track.children);
  let index = 0;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.className = i === 0 ? "active" : "";
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  prev.addEventListener("click", () => goTo(index - 1));
  next.addEventListener("click", () => goTo(index + 1));
  setInterval(() => goTo(index + 1), 4500);
}

const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
  searchBtn.addEventListener("click", searchHotel);
  searchHotel();
}

const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  const roomId = getQueryParam("room_id");
  const roomIdInput = document.getElementById("roomIdInput");
  if (roomId && roomIdInput) roomIdInput.value = roomId;
  bookingForm.addEventListener("submit", createBooking);
  loadBookings();
}

loadHotelDetail();
initPromoSlider();
