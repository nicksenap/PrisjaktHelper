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
  console.log("clicked on save");
  const behavior = document.getElementById("behavior").value;
  const color = document.getElementById("color").value;

  console.log("Saving settings", { behavior, color });

  chrome.storage.sync.set({ behavior: behavior, color: color }, function () {
    console.log("Settings saved");
  });
});
