function addToClipboard(text) {
  const dummyElement = document.createElement("textarea");
  dummyElement.value = text;
  document.body.appendChild(dummyElement);
  dummyElement.select();
  document.execCommand("copy");
  document.body.removeChild(dummyElement);
}

window.addEventListener("load", (event) => {
  // Check if the URL matches the desired pattern
  if (
    /https:\/\/www\.prisjakt\.nu\/produkt\.php\?p=\d+/.test(
      window.location.href
    )
  ) {
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
                const cards = document.querySelectorAll(
                  'div[data-test="PriceRow"]'
                );
                // Iterate through the cards
                for (let card of cards) {
                  // Check if the 'Gå till butik' button already exists
                  let unfeaturedRow = card.querySelector(
                    'a[data-test="UnfeaturedRow"]'
                  );
                  if (unfeaturedRow && !unfeaturedRow.hasClickListener) {
                    let product_name = "";
                    let store_name = "";

                    const store_logo_text_span = unfeaturedRow.querySelector(
                      "span.StoreLogoText-sc-0-1"
                    );
                    if (store_logo_text_span) {
                      store_name = store_logo_text_span.innerHTML;
                    }

                    console.log("store_name:", store_name);
                    const whole_word_regex = /^[\w\u00C0-\u00FF]+$/; // supporting åäö
                    const url_regex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+$/;
                    let redirect_url = "google.se";
                    if (url_regex.test(store_name)) {
                      redirect_url = store_name;
                    } else if (whole_word_regex.test(store_name)) {
                      redirect_url = store_name + ".se";
                    } else {
                        product_name = store_name
                    }
                    console.log("find unfeaturedRow");
                    unfeaturedRow.addEventListener("click", function (e) {
                      const product_name_span = unfeaturedRow.querySelector(
                        "span.StyledProductName-sc-0-2"
                      );
                      if (product_name_span) {
                        product_name += product_name_span.innerHTML;
                      }
                      console.log("product_name:", product_name);
                      addToClipboard(product_name);
                      e.stopPropagation();
                      e.preventDefault();
                      window.open(`https://www.${redirect_url}/`);
                    });

                    // Mark the element as having a click listener
                    unfeaturedRow.hasClickListener = true;
                    // remove tooltip
                    let tooltip_parent = unfeaturedRow.parentNode;
                    let tooltip = tooltip_parent.querySelector(
                      ".TooltipWrapper--8hyrx8"
                    );
                    tooltip_parent.removeChild(tooltip);
                    let GoToStoreButton = unfeaturedRow.querySelector(
                      'div[data-test="GoToStoreButton"]'
                    );
                    GoToStoreButton.style.visibility = "visible";
                    let actual_btn = GoToStoreButton.firstChild;
                    actual_btn.style.backgroundColor = "palevioletred";
                    actual_btn.style.color = "white";
                  }
                }
              }, 100); // Adjust this delay as necessary
            }
          }
        }
      }
    });

    // Start observing the document with the configured parameters
    observer.observe(document, { childList: true, subtree: true });
  }
});
