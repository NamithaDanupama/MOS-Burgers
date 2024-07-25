// Initialize items array
let items = [];
let orders = [];
let currentOrder = [];
let orderIdCounter = 1;

// Function to handle role selection
function selectRole(role) {
    if (role === 'owner') {
        navigateToSection('ownerFunctions');
    } else if (role === 'worker') {
        navigateToSection('workerFunctions');
    }
}

// Function to navigate between sections
function navigateToSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Event listeners for forms
document.getElementById('addItemForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addItem();
});

document.getElementById('removeItemForm').addEventListener('submit', function(event) {
    event.preventDefault();
    removeItem();
});

document.getElementById('placeOrderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addToOrder();
});

document.getElementById('completeOrderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    placeOrder();
});

document.getElementById('searchOrderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    searchOrder();
});

document.getElementById('updateOrderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    updateOrder();
});

// Add new item function
function addItem() {
    const newItemId = document.getElementById('newItemId').value;
    const newItemName = document.getElementById('newItemName').value;
    const newItemPrice = parseFloat(document.getElementById('newItemPrice').value);

    const item = {
        itemId: newItemId,
        itemName: newItemName,
        itemPrice: newItemPrice,
    };

    items.push(item);
    alert('Item added successfully!');
    clearAddItemForm();
    displayItems();
}

// Clear add item form
function clearAddItemForm() {
    document.getElementById('newItemId').value = '';
    document.getElementById('newItemName').value = '';
    document.getElementById('newItemPrice').value = '';
}

// Display items
function displayItems() {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';

    if (items.length === 0) {
        itemsList.innerHTML = '<p>No items available.</p>';
        return;
    }

    const ul = document.createElement('ul');
    ul.classList.add('list-group');

    items.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `ID: ${item.itemId}, Name: ${item.itemName}, Price: $${item.itemPrice.toFixed(2)}`;
        ul.appendChild(li);
    });

    itemsList.appendChild(ul);
}

// Remove item function
function removeItem() {
    const removeItemId = document.getElementById('removeItemId').value;
    const index = items.findIndex(item => item.itemId === removeItemId);

    if (index !== -1) {
        items.splice(index, 1);
        alert('Item removed successfully!');
        displayItems();
    } else {
        alert('Item not found.');
    }

    document.getElementById('removeItemId').value = '';
}

// Order functions
function addToOrder() {
    const itemId = document.getElementById('itemId').value;
    const items = document.getElementById('items').value;
    const qty = parseInt(document.getElementById('qty').value);
    const price = parseFloat(document.getElementById('price').value);

    const item = {
        itemId,
        items,
        qty,
        price,
        totalPrice: qty * price,
    };

    currentOrder.push(item);
    updateOrderSummary();
    clearPlaceOrderForm();
}

function clearPlaceOrderForm() {
    document.getElementById('itemId').value = '';
    document.getElementById('items').value = '';
    document.getElementById('qty').value = '';
    document.getElementById('price').value = '';
}

function updateOrderSummary() {
    let totalPrice = 0;
    let noOfItems = 0;

    currentOrder.forEach(item => {
        totalPrice += item.totalPrice;
        noOfItems += item.qty;
    });

    const discount = calculateDiscount(totalPrice);
    const totalAmount = totalPrice - discount;

    document.getElementById('orderId').textContent = orderIdCounter;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    document.getElementById('noOfItems').textContent = noOfItems;
    document.getElementById('discount').textContent = discount.toFixed(2);
    document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);
}

function calculateDiscount(totalPrice) {
    if (totalPrice >= 50 && totalPrice < 100) {
        return totalPrice * 0.05;
    } else if (totalPrice >= 100 && totalPrice < 200) {
        return totalPrice * 0.1;
    } else if (totalPrice >= 200) {
        return totalPrice * 0.2;
    }
    return 0;
}

function placeOrder() {
    if (currentOrder.length === 0) {
        alert('No items to order.');
        return;
    }

    const order = {
        orderId: orderIdCounter,
        items: currentOrder,
        totalPrice: parseFloat(document.getElementById('totalPrice').textContent),
        noOfItems: parseInt(document.getElementById('noOfItems').textContent),
        discount: parseFloat(document.getElementById('discount').textContent),
        totalAmount: parseFloat(document.getElementById('totalAmount').textContent),
    };

    orders.push(order);
    orderIdCounter++;
    currentOrder = [];
    updateOrderSummary();
    alert('Order placed successfully!');
}

function searchOrder() {
    const searchQuery = document.getElementById('searchQuery').value;
    const order = orders.find(o => o.orderId === parseInt(searchQuery));

    const orderDetailsDiv = document.getElementById('orderDetails');
    orderDetailsDiv.innerHTML = '';

    if (order) {
        orderDetailsDiv.innerHTML = `
            <h4>Order ID: ${order.orderId}</h4>
            <ul class="list-group">
                ${order.items.map(item => `
                    <li class="list-group-item">
                        ID: ${item.itemId}, Items: ${item.items}, Qty: ${item.qty}, Price: $${item.price.toFixed(2)}, Total: $${item.totalPrice.toFixed(2)}
                    </li>
                `).join('')}
            </ul>
            <p>Total Items: ${order.noOfItems}</p>
            <p>Total Price: $${order.totalPrice.toFixed(2)}</p>
            <p>Discount: $${order.discount.toFixed(2)}</p>
            <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
        `;
    } else {
        orderDetailsDiv.innerHTML = '<p>No order found with the provided ID.</p>';
    }
}

function viewAllOrders() {
    const allOrdersDetailsDiv = document.getElementById('allOrdersDetails');
    allOrdersDetailsDiv.innerHTML = '';

    if (orders.length === 0) {
        allOrdersDetailsDiv.innerHTML = '<p>No orders available.</p>';
        return;
    }

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.innerHTML = `
            <h4>Order ID: ${order.orderId}</h4>
            <ul class="list-group mb-3">
                ${order.items.map(item => `
                    <li class="list-group-item">
                        ID: ${item.itemId}, Items: ${item.items}, Qty: ${item.qty}, Price: $${item.price.toFixed(2)}, Total: $${item.totalPrice.toFixed(2)}
                    </li>
                `).join('')}
            </ul>
            <p>Total Items: ${order.noOfItems}</p>
            <p>Total Price: $${order.totalPrice.toFixed(2)}</p>
            <p>Discount: $${order.discount.toFixed(2)}</p>
            <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
        `;
        allOrdersDetailsDiv.appendChild(orderElement);
    });
}

function updateOrder() {
    const updateQuery = document.getElementById('updateQuery').value;
    const order = orders.find(o => o.orderId === parseInt(updateQuery));

    const updateOrderDetailsDiv = document.getElementById('updateOrderDetails');
    updateOrderDetailsDiv.innerHTML = '';

    if (order) {
        updateOrderDetailsDiv.innerHTML = `
            <h4>Order ID: ${order.orderId}</h4>
            <ul class="list-group">
                ${order.items.map((item, index) => `
                    <li class="list-group-item">
                        <input type="text" class="form-control" value="${item.itemId}" id="updateItemId${index}">
                        <input type="text" class="form-control" value="${item.items}" id="updateItems${index}">
                        <input type="number" class="form-control" value="${item.qty}" id="updateQty${index}">
                        <input type="number" class="form-control" value="${item.price.toFixed(2)}" id="updatePrice${index}">
                    </li>
                `).join('')}
            </ul>
            <button class="btn btn-success mt-3" onclick="saveUpdatedOrder(${order.orderId})">Save Changes</button>
        `;
    } else {
        updateOrderDetailsDiv.innerHTML = '<p>No order found with the provided ID.</p>';
    }
}

function saveUpdatedOrder(orderId) {
    const order = orders.find(o => o.orderId === orderId);

    if (order) {
        order.items.forEach((item, index) => {
            item.itemId = document.getElementById(`updateItemId${index}`).value;
            item.items = document.getElementById(`updateItems${index}`).value;
            item.qty = parseInt(document.getElementById(`updateQty${index}`).value);
            item.price = parseFloat(document.getElementById(`updatePrice${index}`).value);
            item.totalPrice = item.qty * item.price;
        });

        order.totalPrice = order.items.reduce((total, item) => total + item.totalPrice, 0);
        order.noOfItems = order.items.reduce((total, item) => total + item.qty, 0);
        order.discount = calculateDiscount(order.totalPrice);
        order.totalAmount = order.totalPrice - order.discount;

        alert('Order updated successfully!');
        navigateToSection('workerFunctions');
    } else {
        alert('Order not found.');
    }
}
