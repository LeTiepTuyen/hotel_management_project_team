document.addEventListener("DOMContentLoaded", () => {
  fetchDestinations();
});

function fetchDestinations() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/destinations", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const destinations = JSON.parse(xhr.responseText);
      const destinationsContainer = document.getElementById("destinations");
      destinationsContainer.innerHTML = destinations
        .map(
          (destination) => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300">
          <img src="${destination.image}" alt="${destination.name}" class="w-full h-48 object-cover">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-2 text-gray-800">${destination.name}</h2>
            <p class="text-gray-600 mb-2">${destination.location}</p>
            <p class="text-sm text-gray-500 mb-4">${destination.description.substring(0, 100)}...</p>
            <div class="flex justify-between items-center">
              <span class="text-blue-600 font-bold">Rating: ${destination.rating.toFixed(2)}</span>
              <a href="/detail.html?id=${
                destination.id
              }" class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">View Details</a>
            </div>
          </div>
        </div>
      `
        )
        .join("");
    } else {
      console.error("Error fetching destinations:", xhr.status);
    }
  };
  xhr.send();
}
