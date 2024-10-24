document.addEventListener("DOMContentLoaded", () => {
  fetchDestinations();
  document.getElementById("add-destination").addEventListener("click", showAddForm);
});

function fetchDestinations() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/destinations", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const destinations = JSON.parse(xhr.responseText);
      const tableBody = document.getElementById("destinations-table");
      tableBody.innerHTML = destinations
        .map(
          (destination, index) => `
        <tr class="${index % 2 === 0 ? "bg-gray-50" : "bg-white"}">
          <td class="px-4 py-3">
            <img src="${destination.image}" alt="${destination.name}" class="w-16 h-16 object-cover rounded">
          </td>
          <td class="px-4 py-3">${destination.name}</td>
          <td class="px-4 py-3">${destination.location}</td>
          <td class="px-4 py-3">${destination.rating.toFixed(2)}</td>
          <td class="px-4 py-3">
            <button onclick="editDestination(${
              destination.id
            })" class="bg-blue-500 text-white px-3 py-1 rounded-full mr-2 hover:bg-blue-600 transition duration-300">Edit</button>
            <button onclick="deleteDestination(${
              destination.id
            })" class="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition duration-300">Delete</button>
          </td>
        </tr>
      `
        )
        .join("");
    } else {
      console.error("Error fetching destinations:", xhr.status);
    }
  };
  xhr.send();
}

function showAddForm() {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center";
  modal.innerHTML = `
    <div class="bg-white p-8 rounded-lg shadow-xl w-96">
      <h3 class="text-2xl font-bold mb-6 text-gray-800">Add New Destination</h3>
      <form id="add-form">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input type="text" id="name" name="name" placeholder="Destination Name" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required>
        </div>
        <div class="mb-4">
          <label for="location" class="block text-gray-700 text-sm font-bold mb-2">Location:</label>
          <input type="text" id="location" name="location" placeholder="Location" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required>
        </div>
        <div class="mb-4">
          <label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <textarea id="description" name="description" placeholder="Description" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
        </div>
        <div class="mb-4">
          <label for="image" class="block text-gray-700 text-sm font-bold mb-2">Image URL:</label>
          <input type="url" id="image" name="image" placeholder="Image URL" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required>
        </div>
        <div class="mb-4">
          <label for="rating" class="block text-gray-700 text-sm font-bold mb-2">Rating:</label>
          <input type="number" id="rating" name="rating" placeholder="Rating" step="0.1" min="0" max="5" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 mr-2">Add Destination</button>
          <button type="button" onclick="this.closest('.fixed').remove()" class="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition duration-300">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("add-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newDestination = Object.fromEntries(formData.entries());
    newDestination.rating = parseFloat(newDestination.rating);
    newDestination.createdAt = new Date().toISOString();

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/destinations", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status === 200) {
        fetchDestinations();
        modal.remove();
      } else {
        console.error("Error adding destination:", xhr.status);
      }
    };
    xhr.send(JSON.stringify(newDestination));
  });
}

function editDestination(id) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `/api/destinations/${id}`, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const destination = JSON.parse(xhr.responseText);
      const modal = document.createElement("div");
      modal.className =
        "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center";
      modal.innerHTML = `
        <div class="bg-white p-8 rounded-lg shadow-xl w-96">
          <h3 class="text-2xl font-bold mb-6 text-gray-800">Edit Destination</h3>
          <form id="edit-form">
            <div class="mb-4">
              <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
              <input type="text" id="name" name="name" value="${destination.name}" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>
            <div class="mb-4">
              <label for="location" class="block text-gray-700 text-sm font-bold mb-2">Location:</label>
              <input type="text" id="location" name="location" value="${destination.location}" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>
            <div class="mb-4">
              <label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description:</label>
              <textarea id="description" name="description" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required>${destination.description}</textarea>
            </div>
            <div class="mb-4">
              <label for="image" class="block text-gray-700 text-sm font-bold mb-2">Image URL:</label>
              <input type="url" id="image" name="image" value="${destination.image}" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>
            <div class="mb-4">
              <label for="rating" class="block text-gray-700 text-sm font-bold mb-2">Rating:</label>
              <input type="number" id="rating" name="rating" value="${destination.rating}" step="0.1" min="0" max="5" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>
            <div class="flex justify-end">
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 mr-2">Update Destination</button>
              <button type="button" onclick="this.closest('.fixed').remove()" class="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition duration-300">Cancel</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById("edit-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedDestination = Object.fromEntries(formData.entries());
        updatedDestination.rating = parseFloat(updatedDestination.rating);

        const updateXhr = new XMLHttpRequest();
        updateXhr.open("PUT", `/api/destinations/${id}`, true);
        updateXhr.setRequestHeader("Content-Type", "application/json");
        updateXhr.onload = function () {
          if (updateXhr.status === 200) {
            fetchDestinations();
            modal.remove();
          } else {
            console.error("Error updating destination:", updateXhr.status);
          }
        };
        updateXhr.send(JSON.stringify(updatedDestination));
      });
    } else {
      console.error("Error fetching destination details:", xhr.status);
    }
  };
  xhr.send();
}

function deleteDestination(id) {
  if (confirm("Are you sure you want to delete this destination?")) {
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `/api/destinations/${id}`, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        fetchDestinations();
      } else {
        console.error("Error deleting destination:", xhr.status);
      }
    };
    xhr.send();
  }
}
