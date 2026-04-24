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

Parta solves this problem by providing a searchable inventory interface, stock and location views, and a DigiKey-powered component search page.

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
```

## 7. Technical Requirements Covered

### Advanced Layout and Semantics

The project uses semantic HTML elements such as:

- `header`
- `nav`
- `main`
- `section`
- `aside`
- `footer`
- `form`

The layout uses CSS Grid and Flexbox for page structure, cards, forms, navigation, and responsive behavior.

### Multi-View Architecture

The project includes at least three distinct views:

- `index.html` - Dashboard
- `inventory.html` - Inventory Search
- `digikey-search.html` - DigiKey Component Search

### Responsive Design

The layout changes between desktop and mobile.

On desktop:

- fixed sidebar navigation
- two-column content layouts
- grid-based form layout

On mobile:

- sidebar becomes a slide-out menu
- page content becomes single-column
- form grid collapses into one column
- tables and complex content adapt for small screens

### Consistent Design System

The project uses CSS variables for:

- colors
- spacing
- font sizes
- border radius
- layout dimensions

This keeps the visual style consistent across all pages.

### Dynamic Data Gallery

The Inventory Search page uses a local JavaScript data array and renders inventory items dynamically.

The user can filter the displayed items in real time using a search input.

The local data gallery contains more than 6 inventory items and renders them as cards or structured result items.

### Live Widget / API Integration

The DigiKey Component Search page uses the `fetch()` API to send an asynchronous request to a deployed backend API.

The backend API is hosted on Azure and returns live component search results.

The page includes a dedicated loading state, error state, no-results state, and results state.

### Client-Side Validation

The DigiKey search form includes custom client-side validation for the search query field.

Validation rules:

- the search query cannot be empty
- the search query must contain at least 2 characters
- the page shows a custom error message
- the invalid field is visually highlighted
- the validation does not rely only on the HTML `required` attribute


## 8. Research Notes

Research and planning notes are included in:

```text
NOTES.md
```

The notes include project research, API planning, data model ideas, and implementation decisions.

## 9. Challenges & Solutions

### Challenge: Connecting the frontend to real component data

One of the biggest challenges was making the DigiKey search page work with real component data instead of only static mock data.

At first, the project used local JavaScript data for inventory pages, but the DigiKey search page required a real asynchronous workflow:

- collect form data from the user
- send a request from the frontend
- connect the frontend to a backend API
- connect the backend API to DigiKey
- handle DigiKey API authentication
- deploy the backend to Azure
- handle loading, success, empty result, and error states on the frontend

This was more complex than a normal static frontend feature because the page depended on several moving parts working together.

The DigiKey API integration was especially challenging. I had to deal with API credentials, access configuration, request format, backend environment variables, deployment settings, and differences between local development and the deployed Azure environment. I also had to contact DigiKey support to resolve access/API-related issues before the integration could work properly.

### Solution

I separated the problem into frontend and backend responsibilities.

The frontend DigiKey page only handles the user interface:

- reads the search form values
- validates the search query
- sends a `fetch()` request to my backend API
- shows a loading spinner while waiting
- renders returned component data as result cards
- displays a no-results message when nothing is found
- displays an error message when the request fails

The backend handles the DigiKey-specific logic:

- stores the DigiKey API configuration
- sends the request to DigiKey
- processes the response
- returns simplified component data to the frontend

This approach keeps the frontend cleaner and avoids exposing DigiKey credentials in browser code.

After deploying the ASP.NET Core backend to Azure, the frontend was able to call a live API endpoint and display real DigiKey component data. This made the DigiKey search page feel much closer to a real production feature instead of a static demo.

The page now handles several states:

- initial empty state
- loading state with spinner
- successful search results
- no results
- API error

This was the most difficult part of the project, but it also became the most valuable feature because it connects the frontend interface to real external component data.

## 10. Technologies Used

- HTML
- CSS
- JavaScript
- CSS Grid
- Flexbox
- Fetch API
- ASP.NET Core backend API
- Azure App Service
- DigiKey API

## 11. Deployment

Live site:

```text
https://yavelena.github.io/Parta/index.html
```

Repository:

```text
https://github.com/yavelena/Parta
```

## 12. Project Status

Current version includes:

- responsive layout
- sidebar navigation
- dashboard page
- inventory search page
- DigiKey search page
- live API request
- loading and error states
- custom form validation
- dynamic JavaScript rendering

Future improvements could include:

- user authentication
- barcode scanning
- stock transaction history
- admin tools
- AI-assisted inventory search
- BOM import from Altium or KiCad
