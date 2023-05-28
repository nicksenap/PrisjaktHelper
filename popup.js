// Load current options when the popup is opened
document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(["behavior", "color"], function (result) {
    if (result.behavior) {
      document.getElementById("behavior").value = result.behavior;
    }
    if (result.color) {
      document.getElementById("color").value = result.color;
    }
  });
});

document.getElementById("save").addEventListener("click", function () {
  const behavior = document.getElementById("behavior").value;
  const color = document.getElementById("color").value;

  chrome.storage.sync.set({ behavior: behavior, color: color }, function () {
    if (chrome.runtime.lastError) {
      // Log any errors to the console
      console.log(chrome.runtime.lastError.message);
    } else {
      // Get the paragraph element and update its text
      const confirmation = document.getElementById("confirmation");
      confirmation.textContent =
        "Settings saved! Please reload the page for changes to take effect.";

      // Clear the confirmation message after 3 seconds
      setTimeout(() => {
        confirmation.textContent = "";
        window.close(); // Close the popup
      }, 3000);
    }
  });
});
