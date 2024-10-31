const apiUrl = "/api/room"; // Đồng bộ với server.js

async function fetchRooms() {
  try {
    document.getElementById("loading-spinner").classList.remove("hidden"); // Show spinner
    const response = await fetch(apiUrl); // apiUrl = "/api/room"
    const rooms = await response.json(); // Example rooms: [{ "roomId": "1", "roomType": "Deluxe", "description": "A deluxe room", "price": 100, "image": "deluxe.jpg" }]
    return rooms;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
  } finally {
    document.getElementById("loading-spinner").classList.add("hidden"); // Hide spinner
  }
}

function displayRooms(rooms) {
  const roomList = document.getElementById("room-list");
  roomList.innerHTML = "";
  rooms.forEach((room) => {
    const roomCard = `
      <div class="bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl p-4">
        <img src="${room.image}" alt="${room.roomType}" class="w-full h-64 object-cover rounded-t-lg">
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-2">${room.roomType}</h3>
          <p class="text-gray-600 mb-2">${room.description}</p>
          <p class="font-bold text-xl mb-4">$${room.price}</p>
          <button onclick="viewDetail('${room.roomId}')" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:shadow-lg transition">View Detail</button>
          <button onclick="bookNow('${room.roomId}')" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 hover:shadow-lg transition">Book Now</button>
        </div>
      </div>
    `;
    roomList.innerHTML += roomCard;
  });
}

async function filterRooms(type) {
  const buttons = document.querySelectorAll(".filter-button");

  // Xóa trạng thái active cho tất cả nút
  buttons.forEach((button) => button.classList.remove("active"));

  // Thêm trạng thái active cho nút đã chọn
  const selectedButton = [...buttons].find((button) => button.textContent.includes(type) || type === "all");
  if (selectedButton) selectedButton.classList.add("active");

  const rooms = await fetchRooms();
  const filteredRooms = type === "all" ? rooms : rooms.filter((room) => room.roomType.includes(type));
  displayRooms(filteredRooms);
}

async function searchRooms() {
  const query = document.getElementById("search-bar").value.toLowerCase();
  const rooms = await fetchRooms();
  const filteredRooms = rooms.filter((room) => room.roomType.toLowerCase().includes(query));
  displayRooms(filteredRooms);
}

function viewDetail(roomId) {
  window.location.href = `/room-detail.html?roomId=${roomId}`;
}

function bookNow(roomId) {
  window.location.href = `/reservation.html?roomId=${roomId}`;
}

// Khi trang được tải, hiển thị tất cả các phòng và kích hoạt nút "All Rooms"
document.addEventListener("DOMContentLoaded", () => {
  // Add click listener to logo for all pages
  const logo = document.querySelector("header .flex.items-center");
  if (logo) {
    logo.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  filterRooms("all");
});
