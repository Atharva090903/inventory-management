# Inventory Management System

## Problem Statement:
To implement an inventory management system for an e-commerce store, allowing administrators to add and remove products from inventory. Additionally, the system should support discount coupons, including percentage discounts and maximum discount caps.

## Solution Overview:
I implemented the inventory management system using Node.js for the backend, and HTML, CSS, and JavaScript for the frontend. The system includes four main APIs:

- `AddItemToInventory(productId, quantity)`
- `RemoveItemFromInventory(productId, quantity)`
- `AddItemToCart(customerId, productId, quantity)`
- `ApplyDiscountCoupon(cartValue, discountId)`

### Frontend UI:
![image](https://github.com/Atharva090903/inventory-management/assets/147313928/141ac484-1775-42ce-ac83-9b3fbd0dcaa8)

![image](https://github.com/Atharva090903/inventory-management/assets/147313928/218e5a20-d8db-4ff7-acba-6fceed3bda6c)

## Implementation Details:

### Backend (Node.js):
- The backend consists of an Express.js server handling API requests.
- Each API endpoint is implemented to perform specific tasks such as adding or removing items from inventory, adding items to the cart, and applying discounts.
- Internal data structures (JSON files) are used to store inventory, cart, and discount coupon information.

### Frontend (HTML, CSS, JavaScript):
- The frontend provides user interfaces for administrators and customers.
- For administrators, a form is provided to add or remove items from the inventory.
- For customers, a separate page displays the inventory and allows them to add items to their cart. The cart displays the selected items, and customers can apply discount coupons to get discounted prices.

## Edge Cases Covered:
- Checking if the item exists in inventory before adding it to the cart.
- Handling maximum discount caps when applying coupons.
- Error handling for invalid API requests or incorrect data.

## Full Code Explanation:
- Backend code (`server.js`): Implements API endpoints for inventory management, cart operations, and discount coupon application. Reads and writes data to JSON files.
- Frontend code (`index.html`, `cart.html`, `style.css`, `script.js`): Provides user interfaces for administrators and customers. Implements form submission, inventory display, cart management, and discount coupon application.

## Conclusion:
The implemented inventory management system provides a robust solution for managing products, cart operations, and discounts in an e-commerce store. It ensures data integrity, handles edge cases, and provides a seamless user experience for administrators and customers.
