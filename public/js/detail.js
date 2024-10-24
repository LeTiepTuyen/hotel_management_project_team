document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  if (id) {
    fetchDestinationDetails(id);
  }
});

function fetchDestinationDetails(id) {
  fetch(`/api/destinations/${id}`)
    .then((response) => response.json())
    .then((destination) => {
      const detailContainer = document.getElementById("destination-detail");
      detailContainer.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-6">
          <img src="${destination.image}" alt="${destination.name}" class="w-full h-64 object-cover mb-6 rounded">
          <h1 class="text-3xl font-bold mb-4">${destination.name}</h1>
          <p class="text-xl text-gray-600 mb-4">${destination.location}</p>
          <p class="text-gray-700 mb-6">${destination.description}</p>
          <div class="flex justify-between items-center">
            <span class="text-2xl text-blue-600 font-bold">Rating: ${destination.rating.toFixed(2)}</span>
            <span class="text-xl text-green-600 font-bold">Created: ${new Date(
              destination.createdAt
            ).toLocaleDateString()}</span>
          </div>
        </div>
      `;
    })
    .catch((error) => console.error("Error fetching destination details:", error));
}
