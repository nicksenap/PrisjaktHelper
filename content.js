const wholeWordRegex = /^[\w\u00C0-\u00FF]+$/;
const urlRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+$/;

let options = {
  behavior: "store", // default behavior
  color: "palevioletred", // default color
};

chrome.runtime.sendMessage({ method: "getOptions" }, function (response) {
  options = response.options;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.options) {
    options = { ...options, ...request.options };
  }
});

const addToClipboard = (text) => {
  const dummyElement = document.createElement("textarea");
  dummyElement.value = text;
  document.body.appendChild(dummyElement);
  dummyElement.select();
  document.execCommand("copy");
  document.body.removeChild(dummyElement);
};

const getStoreAndProductName = (unfeaturedRow) => {
  let product_name = "";
  let store_name = "";

  // find the StoreLogoText and StyledProductName elements
  const allSpans = unfeaturedRow.getElementsByTagName("span");
  for (let span of allSpans) {
    const spanClasses = Array.from(span.classList);
    if (
      !store_name &&
      spanClasses.some((className) => className.startsWith("StoreLogoText"))
    ) {
      store_name = span.innerHTML;
    }
    if (
      !product_name &&
      spanClasses.some((className) => className.startsWith("StyledProductName"))
    ) {
      product_name = span.innerHTML;
    }
    if (store_name && product_name) {
      break;
    }
  }

  return { store_name, product_name };
};

const getRedirectUrl = (store_name, wholeWordRegex, urlRegex) => {
  let redirect_url = "google.se";
  if (urlRegex.test(store_name)) {
    redirect_url = store_name;
  } else if (wholeWordRegex.test(store_name)) {
    redirect_url = store_name + ".se";
  }
  return redirect_url;
};

const attachEventListener = (
  unfeaturedRow,
  store_name,
  product_name,
  redirect_url
) => {
  unfeaturedRow.addEventListener("click", function (e) {
    let clipboard_text = product_name;
    if (options.behavior === "google" || redirect_url === "google.se") {
      clipboard_text = store_name + " " + product_name;
      redirect_url = "google.se"
    }
    addToClipboard(clipboard_text);
    e.stopPropagation();
    e.preventDefault();
    window.open(`https://www.${redirect_url}/`);
  });

  unfeaturedRow.classList.add("clickListenerAdded");
};

const removeTooltipAndStyleButton = (unfeaturedRow) => {
  // remove tooltip
  let tooltip_parent = unfeaturedRow.parentNode;
  let tooltip = tooltip_parent.querySelector(".TooltipWrapper--8hyrx8");

  if (tooltip) {
    tooltip_parent.removeChild(tooltip);
  }

  let GoToStoreButton = unfeaturedRow.querySelector(
    'div[data-test="GoToStoreButton"]'
  );

  GoToStoreButton.style.visibility = "visible";
  let actual_btn = GoToStoreButton.firstChild;
  actual_btn.style.backgroundColor = options.color; // use current value of options.color
  actual_btn.style.color = "white";
};

window.addEventListener("load", () => {
  if (
    /https:\/\/www\.prisjakt\.nu\/produkt\.php\?p=\d+/.test(
      window.location.href
    )
  ) {
    const clickedSpans = new Set();

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.addedNodes.length) {
          const spans = document.querySelectorAll("span");

          for (const span of spans) {
            if (!clickedSpans.has(span)) {
              if (span.textContent === "Visa alla") {
                span.click();
                clickedSpans.add(span);
              }

              setTimeout(() => {
                const cards = document.querySelectorAll(
                  'div[data-test="PriceRow"]'
                );

                for (const card of cards) {
                  const unfeaturedRow = card.querySelector(
                    'a[data-test="UnfeaturedRow"]'
                  );
                  if (
                    unfeaturedRow &&
                    !unfeaturedRow.classList.contains("clickListenerAdded")
                  ) {
                    const { store_name, product_name } =
                      getStoreAndProductName(unfeaturedRow);
                    console.log(store_name);
                    const redirect_url = getRedirectUrl(
                      store_name,
                      wholeWordRegex,
                      urlRegex
                    );
                    attachEventListener(
                      unfeaturedRow,
                      store_name,
                      product_name,
                      redirect_url
                    );
                    removeTooltipAndStyleButton(unfeaturedRow);
                  }
                }
              }, 100);
            }
          }
        }
      }
    });

    observer.observe(document, { childList: true, subtree: true });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateOptions") {
    // Update the options in the content script.
    if (request.options.color) {
      options.color = request.options.color;
    }
    if (request.options.behavior) {
      options.behavior = request.options.behavior;
    }
    console.log(options);

    // Then, reapply your styles or re-run your code that uses these options.
    const cards = document.querySelectorAll('div[data-test="PriceRow"]');
    for (const card of cards) {
      const unfeaturedRow = card.querySelector('a[data-test="UnfeaturedRow"]');
      if (
        unfeaturedRow &&
        !unfeaturedRow.classList.contains("clickListenerAdded")
      ) {
        const { store_name, product_name } =
          getStoreAndProductName(unfeaturedRow);
        const redirect_url = getRedirectUrl(
          store_name,
          wholeWordRegex,
          urlRegex
        );
        attachEventListener(
          unfeaturedRow,
          store_name,
          product_name,
          redirect_url
        );
        removeTooltipAndStyleButton(unfeaturedRow);
      }
    }
  }
});
