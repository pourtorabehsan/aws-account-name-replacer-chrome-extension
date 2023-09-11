chrome.storage.sync.get(["mappings"], function (result) {
  let retryCount = 0;
  const maxRetries = 10; // You can adjust this as needed
  const retryInterval = 500; // Half a second

  const mappings = result.mappings || [];

  const intervalId = setInterval(() => {
    console.log("Checking for element...");
    const spans = document.querySelectorAll("span");
    console.log("Found", spans.length, "spans");
    let accountIdSpan;

    for (let i = 0; i < spans.length; i++) {
      if (spans[i].textContent.includes("Account ID")) {
        accountIdSpan = spans[i].nextElementSibling;
        break;
      }
    }

    if (accountIdSpan) {
      console.log("accountIdSpan found!");
      const accountId = accountIdSpan ? accountIdSpan.textContent : null;
      console.log("Account ID:", accountId);

      const mapping = mappings.find(
        (mapping) => mapping.accountId === accountId
      );

      const button = document.querySelector(
        'button[data-testid="more-menu__awsc-nav-account-menu-button"]'
      );
      const targetSpan = button
        ? button.querySelector('span[title*="AWSReservedSSO"]')
        : null;

      if (targetSpan) {
        // Extract the role and username parts
        let parts = targetSpan.textContent.split("/");
        let username = parts.length > 1 ? parts[1] : "";

        if (mapping) {
          targetSpan.textContent = mapping.accountName + "/" + username;
          targetSpan.style.color = mapping.color;
        }
      }

      clearInterval(intervalId); // Stop checking once the element is found
    } else {
      retryCount++;
      if (retryCount >= maxRetries) {
        console.log("Max retries reached. Element not found.");
        clearInterval(intervalId); // Stop after maxRetries
      }
    }
  }, retryInterval);
});
