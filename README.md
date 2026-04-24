# Parta

Electronic components inventory web app with AI-powered search, stock tracking, location management, and live DigiKey component lookup.

## 1. Project Pitch

Parta is a web portal for managing electronic components in a workshop, engineering lab, or small warehouse.

Many engineering teams store parts in supplier bags, boxes, reels, and partial reels across different shelves. The information is physically available in the room, but it is hard to quickly answer simple questions:

- What parts do we have?
- How many are left?
- Where exactly are they stored?
- Can we use existing stock instead of buying more?

This creates wasted engineering time, duplicate purchases, and slower prototyping.

Parta solves this problem by providing a searchable inventory interface, stock and location views, part detail pages, and a DigiKey-powered component search page.

## 2. Problem

The main problem is that electronic components are difficult to track manually.

Components often have long manufacturer part numbers, similar values, different packages, and multiple supplier numbers. Without a searchable system, users may order parts that already exist in stock or spend too much time looking through bags and shelves.

Parta helps users search, filter, and understand the available inventory faster.

## 3. User Persona

### Primary User: Electronics Engineer

The primary user is an electronics engineer working on prototypes or production support.

They need to:

- search for components by value, package, manufacturer, or part number
- check if a part is available in stock
- find the physical storage location
- review part details before using it in a design
- search DigiKey data when a part is not yet in the local inventory

### Other Users

The app can also be useful for:

- technicians
- warehouse staff
- procurement staff
- engineering managers

These users need a simple web interface to search for components, check stock levels, and understand where parts are stored.

## 4. Main Features

- Dashboard overview with inventory statistics
- Inventory search page with dynamic filtering
- Part detail view for component information
- DigiKey Component Search page
- Custom client-side validation for the search form
- Responsive sidebar navigation
- Responsive layout that changes between desktop and mobile
- Consistent design system using CSS variables
- Dynamic data rendering from JavaScript
- Live API request using `fetch()`

## 5. Views / Pages

The project uses a multi-view architecture with separate HTML pages.

### 1. Dashboard

The dashboard gives a high-level overview of the inventory system. It includes summary cards, recent activity, review items, and navigation to the main workflows.

### 2. Inventory Search

The inventory search page displays local inventory data. JavaScript renders inventory items dynamically and allows real-time filtering based on the user's search input.

### 3. DigiKey Component Search

The DigiKey search page allows users to search for electronic components by part number, supplier number, manufacturer, or keyword.

The page sends a request to a backend API using `fetch()`. The backend is deployed on Azure and returns component data from DigiKey.

## 6. Data Mapping

The app uses JavaScript objects to represent the main inventory data.

Main data collections:

- `partGroups` - grouped parts shown in search results
- `manufacturerParts` - exact manufacturer part numbers
- `stockLots` - physical bags, reels, or partial reels
- `locations` - rack, shelf, and bin information
- `transactions` - receive, move, consume, or adjust records
- `users` - people using the system
- `reviewItems` - unverified or low-confidence scanned items

Example fields:

- `id`
- `shortName`
- `category`
- `package`
- `value`
- `totalQuantity`
- `locationId`
- `manufacturer`
- `mpn`
- `timestamp`
- `type`
- `status`

Example object:

```js
const partGroups = [
    {
        id: 1,
        shortName: "10k 0402 resistor",
        category: "Resistor",
        package: "0402",
        value: "10k",
        totalQuantity: 1250,
        locationId: "R1-S2-B4",
        status: "In Stock"
    }
];