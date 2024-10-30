document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("roomId");

  if (roomId) {
    fetchRoomDetails(roomId);
  }
});

async function fetchRoomDetails(roomId) {
  try {
    document.getElementById("loading-spinner").classList.remove("hidden"); // Show spinner
    const response = await fetch(`/api/room/${roomId}`);
    if (!response.ok) {
      throw new Error("Error fetching room details: " + response.status);
    }

    const room = await response.json();
    const roomDetailContainer = document.getElementById("room-detail");

    roomDetailContainer.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src="${room.image}" alt="${room.description}" class="w-full h-96 object-cover rounded-lg shadow-md" />
        <div>
          <h2 class="text-4xl font-bold mb-4">${room.roomType}</h2>
          <p class="text-2xl text-green-600 font-semibold mb-2">$${parseFloat(room.price).toFixed(2)}</p>
          <p class="text-gray-500 mb-4">Rating: ${room.rating} ⭐</p>
          <p class="mb-6 text-lg">${room.description}</p>
          <div class="grid grid-cols-2 gap-4">
            <p><strong>Beds:</strong> ${room.numBeds}</p>
            <p><strong>Adults:</strong> ${room.numAdults}</p>
            <p><strong>Children:</strong> ${room.numChildrens}</p>
            <p><strong>With Bathroom:</strong> ${room.withBathroom ? "Yes" : "No"}</p>
            <p><strong>With Kitchen:</strong> ${room.withKitchen ? "Yes" : "No"}</p>
            <p><strong>Availability:</strong> ${room.availability ? "Available" : "Not Available"}</p>
          </div>
          <h3 class="text-2xl font-semibold mt-8 mb-4">Room Features</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            ${room.feature
              .map(
                (feature) => `
              <div class="bg-gray-100 p-4 rounded-lg shadow-md flex items-center">
                <img src="/assets/icons/${feature
                  .toLowerCase()
                  .replace(" ", "-")}.png" alt="${feature}" class="h-10 w-10 mr-4 flex-shrink-0" />
                <span class="truncate w-full">${feature}</span>
              </div>
            `
              )
              .join("")}
          </div>
          <button id="book-now" class="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Book This Room</button>
        </div>
      </div>
    `;

    document.getElementById("book-now").addEventListener("click", () => {
      window.location.href = `/reservation.html?roomId=${room.roomId}`;
    });
  } catch (error) {
    console.error("Error fetching room details:", error);
  } finally {
    document.getElementById("loading-spinner").classList.add("hidden"); // Hide spinner
  }
}
