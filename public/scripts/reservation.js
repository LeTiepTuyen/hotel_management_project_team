const apiUrl = "/api/Booking"; // Đồng bộ với server.js

async function makeReservation(data) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Reservation made successfully!");
      window.location.href = "index.html";
    } else {
      alert("Failed to make reservation.");
    }
  } catch (error) {
    console.error("Error making reservation:", error);
  }
}

async function fetchRoomDetails(roomId) {
  try {
    document.getElementById("loading-spinner").classList.remove("hidden"); // Show spinner
    const response = await fetch(`/api/room/${roomId}`);
    if (!response.ok) {
      throw new Error("Error fetching room details: " + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching room details:", error);
  } finally {
    document.getElementById("loading-spinner").classList.add("hidden"); // Hide spinner
  }
}

function showModal(reservationData) {
  const modal = document.getElementById("reservation-modal");
  const modalContent = document.getElementById("modal-content");

  modalContent.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto animate-fade-in">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-4">
        <svg class="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M12 20a8 8 0 100-16 8 8 0 000 16z"></path>
        </svg>
        Reservation Confirmation
      </h2>
      <div class="space-y-2 text-gray-700">
        <p><span class="font-medium">Guest Name:</span> ${reservationData.guestName}</p>
        <p><span class="font-medium">Email:</span> ${reservationData.email}</p>
        <p><span class="font-medium">Phone Number:</span> ${reservationData.phoneNumber}</p>
        <p><span class="font-medium">Arrival Date:</span> ${reservationData.arrival}</p>
        <p><span class="font-medium">Departure Date:</span> ${reservationData.departure}</p>
        <p><span class="font-medium">Length of Stay:</span> ${reservationData.lengthOfStay} days</p>
        <p><span class="font-medium">Additional Services:</span> ${reservationData.additionalServices.join(", ")}</p>
        <p class="text-lg font-semibold text-gray-800"><span>Total Cost:</span> $${reservationData.totalCost}</p>
      </div>
      <div class="flex justify-end mt-6 space-x-3">
        <button id="accept-btn" class="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none transition ease-in-out duration-300 shadow-md transform hover:-translate-y-0.5">
          <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg> Accept
        </button>
        <button id="back-btn" class="bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-500 focus:outline-none transition ease-in-out duration-300 shadow-md transform hover:-translate-y-0.5">
          <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg> Back
        </button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");

  document.getElementById("accept-btn").onclick = () => {
    makeReservation(reservationData);
    modal.classList.add("hidden");
  };

  document.getElementById("back-btn").onclick = () => {
    modal.classList.add("hidden");
  };
}

document.getElementById("reservation-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const roomId = document.getElementById("roomId").value;
  const guestName = document.getElementById("guestName").value;
  const email = document.getElementById("email").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const arrival = document.getElementById("arrival").value;
  const departure = document.getElementById("departure").value;

  // Fetch room details
  const roomDetails = await fetchRoomDetails(roomId);

  // Calculate length of stay in days
  const arrivalDate = new Date(arrival);
  const departureDate = new Date(departure);
  const lengthOfStay = (departureDate - arrivalDate) / (1000 * 60 * 60 * 24);

  // Gather additional services
  const additionalServices = [];
  if (document.getElementById("service1").checked) additionalServices.push("Wi-Fi");
  if (document.getElementById("service2").checked) additionalServices.push("Breakfast");
  if (document.getElementById("service3").checked) additionalServices.push("Airport Pickup");

  // Calculate additional service charges
  const additionalServiceCharges = additionalServices.length * 10;

  // Calculate subtotal and total cost
  const subtotal = parseFloat(roomDetails.price) * lengthOfStay + additionalServiceCharges;
  const totalCost = subtotal;

  const reservationData = {
    createdAt: new Date().toISOString(),
    arrival,
    departure,
    lengthOfStay,
    guestName,
    email,
    phoneNumber,
    additionalServices,
    additionalServiceCharges: additionalServiceCharges.toFixed(2),
    subtotal: subtotal.toFixed(2),
    totalCost: totalCost.toFixed(2),
    roomId: roomDetails.roomId,
    numAdults: roomDetails.numAdults,
    numChildrens: roomDetails.numChildrens,
    numBeds: roomDetails.numBeds,
    roomType: roomDetails.roomType,
    withBathroom: roomDetails.withBathroom,
    withKitchen: roomDetails.withKitchen,
    status: "pending",
  };

  showModal(reservationData);
});

function getRoomIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("roomId");
}

document.addEventListener("DOMContentLoaded", () => {
  const roomId = getRoomIdFromUrl();
  document.getElementById("roomId").value = roomId;

  document.getElementById("cancel").onclick = () => {
    window.location.href = "index.html";
  };
});
