const API_BASE_URL = "http://localhost:3000/api";

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

async function searchHotel() {
  const city = document.getElementById("city")?.value?.trim() || "";
  const q = document.getElementById("q")?.value?.trim() || "";

  const params = new URLSearchParams();
  if (city) params.set("city", city);
  if (q) params.set("q", q);

  const url = `${API_BASE_URL}/hotels${params.toString() ? `?${params.toString()}` : ""}`;
  const hotelList = document.getElementById("hotelList");
  if (!hotelList) return;

  try {
    const res = await fetch(url);
    const data = await res.json();

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
  } catch (_err) {
    hotelList.innerHTML = "<p class='error'>Gagal load data hotel. Pastikan backend aktif.</p>";
  }
}

async function loadHotelDetail() {
  const hotelId = getQueryParam("id");
  const hotelDetail = document.getElementById("hotelDetail");
  const roomList = document.getElementById("roomList");
  if (!hotelId || !hotelDetail || !roomList) return;

  try {
    const res = await fetch(`${API_BASE_URL}/hotels/${hotelId}`);
    const hotel = await res.json();

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
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (result) result.textContent = JSON.stringify(json, null, 2);
    await loadBookings();
  } catch (_err) {
    if (result) result.textContent = "Gagal membuat booking. Pastikan backend aktif di port 3000.";
  }
}

async function payBooking(id) {
  await fetch(`${API_BASE_URL}/bookings/${id}/pay`, { method: "POST" });
  await loadBookings();
}

async function loadBookings() {
  const body = document.getElementById("myBookingBody");
  if (!body) return;

  try {
    const res = await fetch(`${API_BASE_URL}/bookings`);
    const bookings = await res.json();

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
  } catch (_err) {
    body.innerHTML = `<tr><td colspan="5" class="error">Gagal load booking.</td></tr>`;
  }
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
