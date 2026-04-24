
const menuOpen = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');

function openMenu()
{
    sidebar.classList.add('open');
    overlay.classList.add('show');
    document.body.classList.add('menu-open');
}

function closeMenu()
{
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.classList.remove('menu-open');
}

menuOpen?.addEventListener('click', openMenu);
menuClose?.addEventListener('click', closeMenu);
overlay?.addEventListener('click', closeMenu);

window.addEventListener('resize', () =>
{
    if (window.innerWidth > 768)
    {
        closeMenu();
    }
});

const ToggleButtons = document.querySelectorAll('.toggle-btn');

ToggleButtons.forEach((button) =>
{
    button.addEventListener('click', () =>
    {
        ToggleButtons.forEach((item) =>
        {
            item.classList.remove('is-active');
        });

        button.classList.add('is-active');

        const selectedView = button.dataset.view;
        console.log('Current view:', selectedView);

        // here switch table mode:
        // grouped / exact
    });
});


/*=====================  Utility Functions ==========================*/

function escapeHtml(value)
{
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}


function formatQuantity(value)
{
    const number = Number(value);

    if (!Number.isFinite(number))
    {
        return 'N/A';
    }

    return new Intl.NumberFormat('en-US').format(number);
}