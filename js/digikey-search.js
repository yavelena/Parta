const DIGIKEY_API_URL = 'https://parta-a2degda9hxbvaydu.canadaeast-01.azurewebsites.net/api/Parts/search';


const form = document.getElementById('digikey-search-form');

    const queryInput = document.getElementById('component-query-input');
    const qtyInput = document.getElementById('component-qty-input');
    const siteInput = document.getElementById('component-site-select');
    const languageInput = document.getElementById('component-language-select');
    const currencyInput = document.getElementById('component-currency-select');

    const loadingBlock = document.getElementById('digikey-loading-block');
    const loadingQueryValue = document.getElementById('loading-search-string-value-placeholder');

    const errorBlock = document.getElementById('digikey-loading-error-block');
    const errorMessage = document.getElementById('digikey-error-message-placeholder');

    const resultHeader = document.getElementById('search-result-header');
    const resultCountValue = document.getElementById('search-results-cnt-value-placeholder');
    // const searchStringValue = document.getElementById('search-string-value');
    const searchStringValue = document.getElementById('results-search-string-value-placeholder');
    const resultsContainer = document.getElementById('digikey-search-results-block');

    const exampleButtons = document.querySelectorAll('.btn-chip');

    exampleButtons.forEach((button) =>
    {
        button.addEventListener('click', () =>
        {
            queryInput.value = button.textContent.trim();
            queryInput.focus();
        });
    });
    
    
    
    form.addEventListener('submit', async (event) =>
    {
        event.preventDefault();

        const query = queryInput.value.trim();

        if (!query)
        {
            return;
        }

        const payload =
        {
            query: query,
            quantity: Number(qtyInput.value) || 1,
            site: siteInput.value,
            language: languageInput.value,
            currency: currencyInput.value
        };

        showLoading(query);

        try
        {
            const response = await fetch(DIGIKEY_API_URL,
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            // NOT FOUND 
            if (response.status === 404)
            {
                renderNoResults(query);
                return;
            }

            if (!response.ok)
            {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const results = normalizeResults(data);

            renderResults(query, results);
        }
        catch (error)
        {
            showError(error.message);
        }
    });

    form.addEventListener('reset', () =>
    {
        loadingBlock.hidden = true;
        errorBlock.hidden = true;
        resultHeader.hidden = true;
        resultsContainer.innerHTML = '';
    });

    function normalizeResults(data)
    {
        if (Array.isArray(data))
        {
            return data;
        }

        if (data)
        {
            return [data];
        }

        return [];
    }

    function showLoading(query)
    {
        loadingQueryValue.textContent = query;
        loadingBlock.hidden = false;
        errorBlock.hidden = true;
        resultHeader.hidden = true;
        resultsContainer.innerHTML = '';
    }

    function renderNoResults(query)
    {
        loadingBlock.hidden = true;
        errorBlock.hidden = false;
        resultHeader.hidden = true;
        resultsContainer.innerHTML = '';

        errorBlock.querySelector('.panel-title').textContent = 'No components found';
        errorMessage.textContent = `We could not find any Digi-Key components for "${query}". Try a more specific part number or another keyword.`;
    }

    function showError(message)
    {
        loadingBlock.hidden = true;
        errorBlock.hidden = false;
        errorMessage.textContent = message;
    }

    function renderResults(query, results)
    {
        loadingBlock.hidden = true;
        errorBlock.hidden = true;
        resultHeader.hidden = false;

        resultCountValue.textContent = results.length;
        searchStringValue.textContent = `"${query}"`;

        resultsContainer.innerHTML = results
            .map((part, index) => createPartCard(part, index))
            .join('');
    }

    
    

    function createPartCard(part, index)
    {
        const partNumber = part.manufacturerProductNumber || 'Unknown part number';
        const manufacturer = part.manufacturer || 'Unknown manufacturer';
        const description = part.description || 'No description';
        const detailedDescription = part.detailedDescription || description;
        const quantityAvailable = formatQuantity(part.quantityAvailable);
        const status = part.productStatus || 'Unknown';
        const source = part.source || 'DigiKey';

        return `
            <section class="component-card panel">
                
                ${createCardHeader(part, index)}

                <div class="panel-body flex-col gap-3">
                    <div class="panel-body-section row-space-between wrap">
                        <div class="flex-col gap-3">
                            <h3>${escapeHtml(partNumber)}</h3>
                            <p>${escapeHtml(description)}</p>

                            <div class="row-vertical-center wrap">
                                <span class="badge-purple">${escapeHtml(manufacturer)}</span>
                                <span class="${getStatusBadgeClass(status)}">${escapeHtml(status)}</span>
                            </div>
                        </div>

                        <div class="flex-col text-xs text-500">
                            <span>Available</span>
                            <span class="text-xl text-900 font-medium">${escapeHtml(quantityAvailable)}</span>
                            <span>units in stock</span>
                        </div>
                    </div>

                    <div class="panel-body-section flex-col gap-3">
                        <p class="panel-title">Product Description</p>
                        <p>${escapeHtml(detailedDescription)}</p>
                    </div>

                    <dl class="grid-3 gap-4">
                        <div class="spec-item">
                            <dt>Source</dt>
                            <dd>${escapeHtml(source)}</dd>
                        </div>

                        <div class="spec-item">
                            <dt>Datasheet</dt>
                            <dd>${createLink(part.datasheetUrl, 'View PDF')}</dd>
                        </div>

                        <div class="spec-item">
                            <dt>Product Page</dt>
                            <dd>${createLink(part.productUrl, 'View on DigiKey')}</dd>
                        </div>
                    </dl>
                </div>
            </section>
        `;
    }

    function createCardHeader(part, index)
    {
        const matchType = String(part.matchType || '').toLowerCase();
        const isBestMatch = matchType === 'best';

        if (isBestMatch)
        {
            return `
                <div class="panel-header">
                    <div class="row-vertical-center gap-2">
                        <svg class="icon-lg color-blue" aria-hidden="true">
                            <use href="#icon-star"></use>
                        </svg>
                        <span class="panel-title">Best Match</span>
                    </div>
                    <span class="badge-green">Exact Match</span>
                </div>
            `;
        }

        return `
            <div class="panel-header">
                <div class="row-vertical-center">
                    <span class="panel-title">Result ${index + 1}</span>
                </div>
                <span class="badge-blue">${escapeHtml(part.matchType || 'Match')}</span>
            </div>
        `;
    }


    function getStatusBadgeClass(status)
    {
        return String(status).trim().toLowerCase() === 'active'
            ? 'badge-green'
            : 'badge-red';
    }

    
    function createLink(url, text)
    {
        if (!url)
        {
            return '<span class="text-500">Not available</span>';
        }

        return `
            <a href="${escapeHtml(url)}" class="icon-link" target="_blank" rel="noopener noreferrer">
                <span>${text}</span>
                <svg class="icon-sm" aria-hidden="true">
                    <use href="#icon-external-link"></use>
                </svg>
            </a>
        `;
    }