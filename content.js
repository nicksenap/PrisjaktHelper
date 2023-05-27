window.addEventListener("load", (event) => {
    // Check if the URL matches the desired pattern
    if (/https:\/\/www\.prisjakt\.nu\/produkt\.php\?p=\d+/.test(window.location.href)) {
      // Create a new observer
      const observer = new MutationObserver((mutationsList, observer) => {
        // Look through all mutations that just occured
        for (let mutation of mutationsList) {
          // If the addedNodes property has one or more nodes
          if (mutation.addedNodes.length) {
            // Query all span elements on the page
            let spans = document.querySelectorAll("span");
  
            // Iterate through the spans
            for (let span of spans) {
              // Check if the span's text is "Visa alla"
              if (span.textContent === "Visa alla") {
                // Click the span
                span.click();
  
                // After the page has been expanded, add buttons to the new product cards
                setTimeout(() => {
                  // Get all cards
                  let cards = document.querySelectorAll(".Card--1gruvrl");
  
                  // Iterate through the cards
                  for (let card of cards) {
                    // Check if the 'Gå till butik' button already exists
                    let existingButton = card.querySelector('button[aria-label="Gå till butik"]');
                    
                    if (!existingButton) {
                      continue;  // Skip the rest of this loop iteration
                    }
  
                    // Your logic here for the cards that do have the 'Gå till butik' button.
                    // For example, if you want to change the color of these cards:
                    card.style.backgroundColor = '#a9a9a9';  // Set a color of your choice
                  }
                }, 2000); // Adjust this delay as necessary
              }
            }
          }
        }
      });
  
      // Start observing the document with the configured parameters
      observer.observe(document, { childList: true, subtree: true });
    }
  });
  