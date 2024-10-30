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

  makeReservation(reservationData);
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
