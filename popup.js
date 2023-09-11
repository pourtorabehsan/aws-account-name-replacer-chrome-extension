chrome.storage.sync.get(["mappings"], function (result) {
  const mappings = result.mappings || [];
  const mappingList = document.getElementById("mappingList");

  if (mappings.length === 0) {
    const noMappingItem = document.createElement("li");
    noMappingItem.className = "list-group-item";
    noMappingItem.textContent = "No mappings found";
    mappingList.appendChild(noMappingItem);
    return;
  }

  mappings.forEach((mapping, index) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex align-items-center";

    const circleSpan = document.createElement("span");
    circleSpan.style.display = "inline-block";
    circleSpan.style.width = "10px"; // or the desired diameter of the circle
    circleSpan.style.height = "10px";
    circleSpan.style.borderRadius = "50%"; // this makes it a circle
    circleSpan.style.backgroundColor = mapping.color;
    listItem.appendChild(circleSpan);

    const mappingText = document.createElement("span");
    mappingText.style.marginLeft = "8px";
    mappingText.className = "flex-grow-1";
    mappingText.textContent = `${mapping.accountId} -> ${mapping.accountName}`;
    listItem.appendChild(mappingText);

    const removeButton = document.createElement("button");
    removeButton.title = "Remove";
    removeButton.className = "close text-danger";
    removeButton.innerHTML = "&times;";
    removeButton.addEventListener("click", function () {
      // Remove this mapping from storage
      mappings.splice(index, 1);
      chrome.storage.sync.set({ mappings: mappings }, function () {
        // Remove this list item from UI
        mappingList.removeChild(listItem);
      });
    });

    listItem.appendChild(removeButton);
    mappingList.appendChild(listItem);
  });
});

document.getElementById("mappingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const accountId = document.getElementById("accountId").value;
  const accountName = document.getElementById("accountName").value;
  const color = document.getElementById("color").value;

  if (accountId && accountName && color) {
    const newMapping = {
      accountId: accountId,
      accountName: accountName,
      color: color,
    };

    chrome.storage.sync.get(["mappings"], function (result) {
      let currentMappings = result.mappings || [];
      currentMappings.push(newMapping);
      chrome.storage.sync.set({ mappings: currentMappings }, function () {
        document.getElementById("accountId").value = "";
        document.getElementById("accountName").value = "";
        document.getElementById("color").value = "";

        // Add the new mapping to the displayed list (you can wrap this in a function to avoid repetition)
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex align-items-center";

        const circleSpan = document.createElement("span");
        circleSpan.style.display = "inline-block";
        circleSpan.style.width = "10px"; // or the desired diameter of the circle
        circleSpan.style.height = "10px";
        circleSpan.style.borderRadius = "50%"; // this makes it a circle
        circleSpan.style.backgroundColor = newMapping.color;
        listItem.appendChild(circleSpan);

        const mappingText = document.createElement("span");
        mappingText.style.marginLeft = "8px";
        mappingText.className = "flex-grow-1";
        mappingText.textContent = `${newMapping.accountId} -> ${newMapping.accountName}`;
        listItem.appendChild(mappingText);

        const removeButton = document.createElement("button");
        removeButton.title = "Remove";
        removeButton.className = "close text-danger";
        removeButton.innerHTML = "&times;";
        removeButton.addEventListener("click", function () {
          currentMappings.splice(currentMappings.indexOf(newMapping), 1);
          chrome.storage.sync.set({ mappings: currentMappings }, function () {
            mappingList.removeChild(listItem);
          });
        });

        listItem.appendChild(removeButton);
        mappingList.appendChild(listItem);
      });
    });
  }
});
