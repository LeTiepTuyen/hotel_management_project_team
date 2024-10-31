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
  <div class="bg-gray-100 rounded-lg shadow-lg p-6 max-w-lg mx-auto animate-fade-in">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-4">
      <svg class="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M12 20a8 8 0 100-16 8 8 0 000 16z"></path>
      </svg>
      Reservation Confirmation
    </h2>
    <div class="bg-white rounded-lg p-4 border border-gray-300 shadow-sm">
      <table class="w-full text-gray-700 border-collapse">
        <tbody>
          <tr class="border-b border-gray-200"><td class="font-medium p-2 border-r border-gray-200">Guest Name:</td><td class="p-2">${
            reservationData.guestName
          }</td></tr>
          <tr class="border-b border-gray-200"><td class="font-medium p-2 border-r border-gray-200">Email:</td><td class="p-2">${
            reservationData.email
          }</td></tr>
          <tr class="border-b border-gray-200"><td class="font-medium p-2 border-r border-gray-200">Phone Number:</td><td class="p-2">${
            reservationData.phoneNumber
          }</td></tr>
          <tr class="border-b border-gray-200"><td class="font-medium p-2 border-r border-gray-200">Arrival Date:</td><td class="p-2">${
            reservationData.arrival
          }</td></tr>
          <tr class="border-b border-gray-200"><td class="font-medium p-2 border-r border-gray-200">Departure Date:</td><td class="p-2">${
            reservationData.departure
          }</td></tr>
          <tr class="border-b border-gray-200"><td class="font-medium p-2 border-r border-gray-200">Length of Stay:</td><td class="p-2">${
            reservationData.lengthOfStay
          } days</td></tr>
          <tr class="border-b border-gray-200"><td class="font-medium p-2 border-r border-gray-200">Additional Services:</td><td class="p-2">${reservationData.additionalServices.join(
            ", "
          )}</td></tr>
          <tr class="border-b border-gray-200"><td class="font-medium p-2 border-r border-gray-200">Room Price:</td><td class="p-2 text-blue-600">$${
            reservationData.subtotal - reservationData.additionalServiceCharges
          }</td></tr>
          <tr class="border-b border-gray-200"><td class="font-medium p-2 border-r border-gray-200">Additional Services Charge:</td><td class="p-2 text-red-600">$${
            reservationData.additionalServiceCharges
          }</td></tr>
          <tr><td class="font-medium p-2 border-r border-gray-200 text-lg">Total Cost:</td><td class="p-2 text-green-600 text-lg font-semibold">$${
            reservationData.totalCost
          }</td></tr>
        </tbody>
      </table>
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

  modal.classList.remove("hidden"); // Show the modal

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
