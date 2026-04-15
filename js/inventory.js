const DATA_URL = 'data/inventory.json';

const searchInput = document.getElementById('inventory-search-input');
const sortSelect = document.getElementById('sort-select');
const tableBody = document.getElementById('inventory-table-body');
const resultsCount = document.getElementById('results-count');
const filterChips = document.getElementById('filter-chips');
const clearFiltersBtn = document.getElementById('clear-filters-btn');

let inventoryItems = [];

const state =
{
    search: '',
    category: 'Resistor',
    package: '0402',
    inStock: true,
    sort: 'relevance'
};

function escapeHtml(value)
{
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function formatNumber(value)
{
    return new Intl.NumberFormat('en-US').format(value);
}

function getStatusBadgeClass(status)
{
    if (status === 'Low Stock')
    {
        return 'badge-low';
    }

    if (status === 'Critical')
    {
        return 'badge-critical';
    }

    return 'badge-green';
}

function renderTable(items)
{
    if (!items.length)
    {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-state-cell">No parts found</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = items.map((item) =>
    {
        const parametersHtml = item.parameters
            .map((parameter) => `<div>${escapeHtml(parameter)}</div>`)
            .join('');

        const manufacturersText = item.manufacturers.join(', ');
        const manufacturersDisplay = item.manufacturers.length > 2
            ? `${item.manufacturers[0]}, ${item.manufacturers[1]} +${item.manufacturers.length - 2}`
            : manufacturersText;

        return `
            <tr>
                <td>
                    <div class="table-part-name">${escapeHtml(item.name)}</div>
                    <div class="table-part-sub text-500">${item.partNumbers} part numbers</div>
                </td>
                <td>
                    <span class="table-tag">${escapeHtml(item.category)}</span>
                </td>
                <td>${escapeHtml(item.package)}</td>
                <td class="text-500">${parametersHtml}</td>
                <td class="text-900 font-semibold">${formatNumber(item.qty)}</td>
                <td>
                    <span class="table-count-badge">${item.locations}</span>
                </td>
                <td class="text-500">${escapeHtml(manufacturersDisplay)}</td>
                <td>
                    <span class="badge ${getStatusBadgeClass(item.status)}">${escapeHtml(item.status)}</span>
                </td>
                <td>
                    <a href="part-details.html?id=${item.id}" class="table-link">View Details</a>
                </td>
            </tr>
        `;
    }).join('');
}

function renderFilterChips()
{
    const chips = [];

    if (state.category)
    {
        chips.push({
            key: 'category',
            label: `Category: ${state.category}`
        });
    }

    if (state.package)
    {
        chips.push({
            key: 'package',
            label: `Package: ${state.package}`
        });
    }

    if (state.inStock)
    {
        chips.push({
            key: 'inStock',
            label: 'In Stock'
        });
    }

    filterChips.innerHTML = chips.map((chip) =>
    {
        return `
            <button class="filter-chip" type="button" data-filter-key="${chip.key}">
                ${escapeHtml(chip.label)}
                <span class="filter-chip-close">×</span>
            </button>
        `;
    }).join('');
}

function applyFilters(items)
{
    const search = state.search.trim().toLowerCase();

    let filtered = items.filter((item) =>
    {
        const haystack = [
            item.name,
            item.category,
            item.package,
            ...item.parameters,
            ...item.manufacturers
        ]
            .join(' ')
            .toLowerCase();

        const matchesSearch = !search || haystack.includes(search);
        const matchesCategory = !state.category || item.category === state.category;
        const matchesPackage = !state.package || item.package === state.package;
        const matchesStock = !state.inStock || item.inStock === true;

        return matchesSearch && matchesCategory && matchesPackage && matchesStock;
    });

    filtered = sortItems(filtered);

    return filtered;
}

function sortItems(items)
{
    const sorted = [...items];

    switch (state.sort)
    {
        case 'qty-desc':
            sorted.sort((a, b) => b.qty - a.qty);
            break;

        case 'qty-asc':
            sorted.sort((a, b) => a.qty - b.qty);
            break;

        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;

        case 'relevance':
        default:
            // Keep original order 
            break;
    }

    return sorted;
}

function render()
{
    const filteredItems = applyFilters(inventoryItems);

    renderTable(filteredItems);
    renderFilterChips();
    resultsCount.textContent = `${filteredItems.length} results`;
}

async function loadInventory()
{
    try
    {
        const response = await fetch(DATA_URL);

        if (!response.ok)
        {
            throw new Error(`HTTP ${response.status}`);
        }

        inventoryItems = await response.json();
        render();
    }
    catch (error)
    {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-state-cell">
                    Failed to load inventory data
                </td>
            </tr>
        `;
        console.error('Inventory load error:', error);
    }
}

searchInput.addEventListener('input', (event) =>
{
    state.search = event.target.value;
    render();
});

sortSelect.addEventListener('change', (event) =>
{
    state.sort = event.target.value;
    render();
});

clearFiltersBtn.addEventListener('click', () =>
{
    state.category = '';
    state.package = '';
    state.inStock = false;
    render();
});

filterChips.addEventListener('click', (event) =>
{
    const chip = event.target.closest('[data-filter-key]');

    if (!chip)
    {
        return;
    }

    const key = chip.dataset.filterKey;

    if (key === 'category')
    {
        state.category = '';
    }
    else if (key === 'package')
    {
        state.package = '';
    }
    else if (key === 'inStock')
    {
        state.inStock = false;
    }

    render();
});

loadInventory();