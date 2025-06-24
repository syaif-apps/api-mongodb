const API_URL = 'http://localhost:5000/api/items';

const itemsList = document.getElementById('itemsList');
const addItemForm = document.getElementById('addItemForm');
const itemNameInput = document.getElementById('itemName');
const itemDescriptionInput = document.getElementById('itemDescription');
const itemQuantityInput = document.getElementById('itemQuantity');

// Function to fetch and display items
async function fetchItems() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        itemsList.innerHTML = '<li>Error loading items. Please check the server.</li>';
    }
}

// Function to display items in the UL
function displayItems(items) {
    itemsList.innerHTML = ''; // Clear existing items
    if (items.length === 0) {
        itemsList.innerHTML = '<li>No items yet. Add one!</li>';
        return;
    }
    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>
                <strong>${item.name}</strong> 
                ${item.description ? ` - ${item.description}` : ''}
                (Qty: ${item.quantity})
            </span>
            <button data-id="${item._id}">Delete</button>
        `;
        itemsList.appendChild(li);
    });
}

// Handle form submission to add a new item
addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const newItem = {
        name: itemNameInput.value,
        description: itemDescriptionInput.value,
        quantity: parseInt(itemQuantityInput.value)
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const addedItem = await response.json();
        console.log('Item added:', addedItem);
        
        // Clear form fields
        itemNameInput.value = '';
        itemDescriptionInput.value = '';
        itemQuantityInput.value = '0';

        // Re-fetch and display items to update the list
        fetchItems();

    } catch (error) {
        console.error('Error adding item:', error);
        alert('Failed to add item. Check console for details.');
    }
});

// Handle delete button clicks
itemsList.addEventListener('click', async (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.textContent === 'Delete') {
        const itemId = e.target.dataset.id;
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await fetch(`${API_URL}/${itemId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                console.log('Item deleted:', itemId);
                fetchItems(); // Re-fetch and display items
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Failed to delete item. Check console for details.');
            }
        }
    }
});

// Initial fetch when the page loads
document.addEventListener('DOMContentLoaded', fetchItems);