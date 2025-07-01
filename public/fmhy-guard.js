(function() {
    'use strict';

    // --- Configuration ---
    const unsafeListUrl = 'https://raw.githubusercontent.com/fmhy/FMHYFilterlist/main/sitelist.txt';
    const excludedDomains = [
        'fmhy.net',
        'fmhy.pages.dev',
        'fmhy.lol',
        'fmhy.vercel.app',
        'fmhy.xyz'
    ];
    // Cache the list for 1 day (in milliseconds)
    const CACHE_DURATION = 1 * 24 * 60 * 60 * 1000;
    const CACHE_KEY = 'fmhy-unsafe-list-cache';

    // --- State ---
    const unsafeDomains = new Set();
    const processedLinks = new WeakSet(); // Keep track of links we've already checked
    const banneredDomains = new Set(); // Keep track of domains that already have a banner on the page

    /**
     * Main function to initialize the script
     */
    async function initializeFmhyGuard() {
        // Don't run on FMHY's own domains
        const currentDomain = window.location.hostname.toLowerCase();
        if (excludedDomains.some(domain => currentDomain.endsWith(domain))) {
            console.log(`[FMHY Guard] Script disabled on ${currentDomain}.`);
            return;
        }

        await loadUnsafeList();

        if (unsafeDomains.size > 0) {
            console.log(`[FMHY Guard] Initialized with ${unsafeDomains.size} unsafe domains. Scanning page.`);
            scanAndMarkLinks(document.body);
            observePageChanges();
        } else {
            console.error("[FMHY Guard] Could not load the unsafe domain list. The script will not run.");
        }
    }

    /**
     * Fetches the unsafe list from GitHub or loads it from localStorage cache.
     */
    async function loadUnsafeList() {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
        const now = Date.now();

        if (cached && (now - cached.timestamp < CACHE_DURATION)) {
            console.log("[FMHY Guard] Loading unsafe domains from cache.");
            parseDomainList(cached.data, unsafeDomains);
            return;
        }

        console.log("[FMHY Guard] Fetching fresh unsafe domain list...");
        try {
            const response = await fetch(unsafeListUrl);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.text();
            parseDomainList(data, unsafeDomains);
            // Save to cache
            localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: now, data: data }));
        } catch (error) {
            console.error("[FMHY Guard] Fetch failed. Trying to use stale cache.", error);
            // If fetch fails, use stale cache if it exists
            if (cached) {
                console.log("[FMHY Guard] Using stale cache as a fallback.");
                parseDomainList(cached.data, unsafeDomains);
            }
        }
    }

    /**
     * Parses the raw text file into a Set of domains.
     * @param {string} text - The raw text from the sitelist.
     * @param {Set<string>} targetSet - The Set to add domains to.
     */
    function parseDomainList(text, targetSet) {
        text.split('\n').forEach(line => {
            const domain = line.trim().toLowerCase();
            if (domain && !domain.startsWith('!')) {
                targetSet.add(domain);
            }
        });
    }

    /**
     * Scans a container element for links and adds warning badges if necessary.
     * @param {HTMLElement} container - The element to scan for links.
     */
    function scanAndMarkLinks(container) {
        container.querySelectorAll('a[href]').forEach(link => {
            if (processedLinks.has(link) || !link.hostname) {
                return;
            }
            processedLinks.add(link);

            const domain = normalizeDomain(link.hostname);

            // Check if the domain is in the unsafe list
            if (unsafeDomains.has(domain)) {
                // Add a banner only once per unique unsafe domain on the page to avoid clutter
                if (!banneredDomains.has(domain)) {
                    addWarningBadge(link);
                    banneredDomains.add(domain);
                }
            }
        });
    }

    /**
     * Creates and adds a warning badge after the given link element.
     * @param {HTMLAnchorElement} link - The link to add a badge to.
     */
    function addWarningBadge(link) {
        const warning = document.createElement('span');
        warning.textContent = '⚠️ FMHY Unsafe Site';
        warning.style.backgroundColor = '#ff4444';
        warning.style.color = '#fff';
        warning.style.padding = '2px 6px';
        warning.style.fontWeight = 'bold';
        warning.style.borderRadius = '4px';
        warning.style.fontSize = '12px';
        warning.style.marginLeft = '6px';
        warning.style.zIndex = '9999';
        link.after(warning);
    }

    /**
     * Watches for new elements being added to the page and scans them.
     */
    function observePageChanges() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    // We only care about element nodes
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        scanAndMarkLinks(node);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Normalizes a hostname by removing "www." from the beginning.
     * @param {string} hostname
     * @returns {string}
     */
    function normalizeDomain(hostname) {
        return hostname.replace(/^www\./, '').toLowerCase();
    }

    // Start the script
    initializeFmhyGuard();

})();