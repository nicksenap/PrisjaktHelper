// Wait for the page to fully load
window.addEventListener('load', (event) => {
    // Check if the URL matches the desired pattern
    // Check if the URL matches the desired pattern
    if (/https:\/\/www\.prisjakt\.nu\/produkt\.php\?p=\d+/.test(window.location.href)) {
        // Create a new observer
        const observer = new MutationObserver((mutationsList, observer) => {
            // Look through all mutations that just occured
            for (let mutation of mutationsList) {
                // If the addedNodes property has one or more nodes
                if (mutation.addedNodes.length) {
                    // Query all span elements on the page
                    let spans = document.querySelectorAll('span');

                    // Iterate through the spans
                    for (let span of spans) {
                        // Check if the span's text is "Visa alla"
                        if (span.textContent === 'Visa alla') {
                            // Click the span
                            span.click();
                        }
                    }
                }
            }
        });

        // Start observing the document with the configured parameters
        observer.observe(document, { childList: true, subtree: true });
    }
});