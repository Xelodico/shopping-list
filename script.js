// Selecting DOM elements by their ID or query selectors
const itemForm = document.querySelector("#item-form"); // Form element
const itemInput = document.querySelector("#item-input"); // Input field for new items
const itemList = document.querySelector("#item-list"); // Unordered list to display items
const clearBtn = document.querySelector("#clear"); // Button to clear all items
const itemFilter = document.querySelector("#filter"); // Input field to filter items
const formBtn = itemForm.querySelector("button"); // Button within the form
let isEditMode = false; // Boolean to track if the form is in edit mode

/**
 * Display items from localStorage when the page loads
 */
function displayItems() {
  const itemsFromStorage = getItemsFromStorage(); // Get items from localStorage
  console.log(itemsFromStorage);

  // Add each item to the DOM
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI(); // Update UI state
}

/**
 * Handle form submission for adding a new item
 * @param {Event} e - The submit event object
 */
function onAddItemSubmit(e) {
  e.preventDefault(); // Prevent form submission

  const newItem = itemInput.value; // Get value from the input field

  // Validate input: if empty, alert the user
  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  // Check if the form is in edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode"); // Select item in edit mode
    removeItemFromStorage(itemToEdit.textContent); // Remove old item from storage
    itemToEdit.classList.remove("edit-mode"); // Remove edit mode class
    itemToEdit.remove(); // Remove item from DOM
    isEditMode = false; // Reset edit mode
  } else if (checkIfItemExists(newItem)) {
    // Check if the item already exists
    alert("Item already exists");
    return;
  }

  // Add the new item to the DOM
  addItemToDOM(newItem);

  // Add the new item to localStorage
  addItemToStorage(newItem);

  checkUI(); // Update UI state

  itemInput.value = ""; // Clear input field
}

/**
 * Add a new item to the DOM
 * @param {string} item - The item text
 */
function addItemToDOM(item) {
  // Create a list item element
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item)); // Add the item text

  // Create a remove button and append it to the list item
  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  // Add the list item to the unordered list in the DOM
  itemList.appendChild(li);
}

/**
 * Create a button element with specific classes
 * @param {string} classes - The classes to add to the button
 * @returns {HTMLElement} - The created button element
 */
function createButton(classes) {
  const button = document.createElement("button");
  button.setAttribute("class", classes); // Add classes to the button
  const icon = createIcon("fa-solid fa-xmark"); // Create an icon element
  button.appendChild(icon); // Append the icon to the button
  return button;
}

/**
 * Create an icon element with specific classes
 * @param {string} classes - The classes to add to the icon
 * @returns {HTMLElement} - The created icon element
 */
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.setAttribute("class", classes); // Add classes to the icon
  return icon;
}

/**
 * Add a new item to localStorage
 * @param {string} item - The item text to add
 */
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage(); // Get existing items from storage

  // Add the new item to the array
  itemsFromStorage.push(item);

  // Convert the array to a JSON string and save it back to localStorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

/**
 * Get items from localStorage
 * @returns {Array<string>} - An array of items from localStorage
 */
function getItemsFromStorage() {
  let itemsFromStorage;

  // If no items in localStorage, return an empty array, else parse JSON string to array
  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

/**
 * Handle click event on the item list (either remove or edit an item)
 * @param {Event} e - The click event object
 */
function onClickItem(e) {
  // If the clicked element has the class 'remove-item', remove the item
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else if (e.target.tagName === "LI") {
    // If a list item was clicked, set it to edit mode
    setItemToEdit(e.target);
  }
}

/**
 * Check if an item already exists in localStorage
 * @param {string} item - The item text to check
 * @returns {boolean} - True if the item exists, otherwise false
 */
function checkIfItemExists(item) {
  let itemsFromStorage = getItemsFromStorage(); // Get items from storage
  itemsFromStorage = itemsFromStorage.map((i) => i.toLowerCase()); // Convert to lowercase for comparison
  return itemsFromStorage.includes(item.toLowerCase()); // Check if item exists
}

/**
 * Set the selected item to edit mode
 * @param {HTMLElement} item - The list item element to edit
 */
function setItemToEdit(item) {
  isEditMode = true; // Set edit mode to true

  // Remove edit mode class from all items
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  // Add edit mode class to the selected item
  item.classList.add("edit-mode");
  formBtn.innerHTML = "<i class='fa-solid fa-pen'></i> Update Item"; // Change button text to "Update Item"
  formBtn.style.backgroundColor = "#228B22"; // Change button color
  itemInput.value = item.textContent; // Set input field value to the selected item text
}

/**
 * Remove an item from the DOM and localStorage
 * @param {HTMLElement} item - The list item element to remove
 */
function removeItem(item) {
  if (confirm("Are you sure?")) {
    // If confirmed, remove the item from the DOM
    item.remove();

    // Remove the item from localStorage
    removeItemFromStorage(item.textContent);
    checkUI(); // Update UI state
  }
}

/**
 * Remove an item from localStorage
 * @param {string} item - The item text to remove
 */
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage(); // Get items from storage

  // Filter out the item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Save the updated array back to localStorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

/**
 * Clear all items from the DOM and localStorage
 */
function clearItems() {
  while (itemList.firstChild) {
    // Remove each child element from the list
    itemList.removeChild(itemList.firstChild);
  }

  // Clear all items from localStorage
  localStorage.removeItem("items");

  checkUI(); // Update UI state
}

/**
 * Filter items based on user input
 * @param {Event} e - The input event object
 */
function filterItems(e) {
  const items = itemList.querySelectorAll("li"); // Select all list items
  const targetItem = e.target.value.toLowerCase(); // Convert user input to lowercase

  // Loop through items and show/hide based on filter input
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    item.style.display = itemName.includes(targetItem) ? "flex" : "none";
  });
}

/**
 * Check the UI state and update visibility of certain elements
 */
function checkUI() {
  itemInput.value = ""; // Clear the input field

  const items = itemList.querySelectorAll("li"); // Get all list items

  // Hide or show buttons based on the number of items in the list
  if (items.length === 0) {
    clearBtn.classList.add("hidden"); // Hide the clear button
    itemFilter.classList.add("hidden"); // Hide the filter input
  } else {
    clearBtn.classList.remove("hidden"); // Show the clear button
    itemFilter.classList.remove("hidden"); // Show the filter input
  }

  // Reset the form button to default state
  formBtn.innerHTML = "<i class='fa-solid fa-plus'></i> Add Item";
  formBtn.style.backgroundColor = "#333";
  isEditMode = false; // Reset edit mode
}

// Initialise the app on page load using an IIFE (Immediately Invoked Function Expression)
(function init() {
  // Add event listeners for various actions
  itemForm.addEventListener("submit", onAddItemSubmit); // Form submission
  itemList.addEventListener("click", onClickItem); // Click on items (edit or remove)
  clearBtn.addEventListener("click", clearItems); // Clear all items
  itemFilter.addEventListener("input", filterItems); // Filter items on input
  document.addEventListener("DOMContentLoaded", displayItems()); // Display items on page load

  checkUI(); // Initial UI check
})();
