const API_BASE_URL = "http://localhost:3000/api";

function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
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
        <div class="card">
          <h3>${hotel.name}</h3>
          <p>${hotel.city}</p>
          <p>⭐ ${hotel.rating}</p>
          <p>$${hotel.price}/night</p>
          <p>${hotel.description}</p>
          <a href="booking.html?room_id=${hotel.featured_room_id}">Book</a>
        </div>
      `
      )
      .join("");
  } catch (_err) {
    hotelList.innerHTML =
      "<p class='error'>Gagal load data hotel. Pastikan backend aktif di port 3000.</p>";
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
  } catch (_err) {
    if (result) {
      result.textContent = "Gagal membuat booking. Pastikan backend aktif di port 3000.";
    }
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
}
