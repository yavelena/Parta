# Parta
Electronic components inventory web app with AI-powered search, stock tracking, and location management.

### 1. Why?
This app is built to help track electronic components stored in a workshop or small warehouse.

In many teams, parts are kept in bags, boxes, or reels across different shelves, but there is no simple way to know what is available, how much is left, or where it is stored. This leads to wasted time, duplicate purchases, and slower prototyping.

The purpose of this app is to make inventory easy to search, understand, and manage. It helps users quickly check stock, find locations, and view part details. 

### 2. User
The target users are:

- engineers
- technicians
- warehouse staff
- procurement staff

These users need a simple web interface to search for components, check stock levels, and see where parts are stored. 

### 3. Data Mapping
The app needs JavaScript objects for the main inventory data:

- `partGroups` — grouped parts shown in search results
- `manufacturerParts` — exact manufacturer part numbers
- `stockLots` — physical bags, reels, or partial reels
- `locations` — rack, shelf, and bin information
- `transactions` — receive, move, consume, or adjust records
- `users` — people using the system
- `reviewItems` — unverified or low-confidence scanned items

Example fields include:

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
