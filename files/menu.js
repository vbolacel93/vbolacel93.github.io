document.addEventListener("DOMContentLoaded", function () {
    loadMenu();
});

function loadMenu() {
    fetch("files/menu.xml")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then((xmlText) => {
            console.log("XML fetched successfully");
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, "application/xml");
            displayMenuItems(xml);
        })
        .catch((error) => console.error("Error loading XML:", error));
}

function displayMenuItems(xml) {
    const mealsTable = document.getElementById("meals-table").querySelector("tbody");
    const coffeeTable = document.getElementById("coffee-table").querySelector("tbody");
    const otherBeveragesTable = document.getElementById("other-beverages-table").querySelector("tbody");

    // Get all items from XML
    const items = xml.getElementsByTagName("item");
    const beverages = xml.getElementsByTagName("beverage");

    console.log("Parsed items:", items);
    console.log("Parsed beverages:", beverages);

    // Iterate over meals and add them to the meals table
    Array.from(items).forEach((item) => {
        const name = item.getElementsByTagName("name")[0]?.textContent;
        const price = item.getElementsByTagName("price")[0]?.textContent;
        const description = item.getElementsByTagName("description")[0]?.textContent;
        const image = item.getElementsByTagName("image")[0] ? item.getElementsByTagName("image")[0].textContent : null;

        const row = document.createElement("tr");

        if (image) {  // Meals section
            row.innerHTML = `
                <td>
                    <img src="${image}" alt="${name}" style="width:392px; height:256px; border-radius: 8px;">
                    <h3>${name}</h3>
                </td>
                <td>$${price}</td>
                <td>${description}</td>
            `;
            mealsTable.appendChild(row);
        }
    });

    // Iterate over beverages and display coffee/hot chocolates
    Array.from(beverages).forEach((beverage) => {
        const beverageName = beverage.getElementsByTagName("name")[0]?.textContent;
        const options = beverage.getElementsByTagName("options")[0]?.getElementsByTagName("option");

        if (beverageName === "Coffee and Hot Chocolates") {
            const description = beverage.getElementsByTagName("description")[0]?.textContent;

            // Iterate over options for sizes and prices
            Array.from(options).forEach(option => {
                const size = option.getElementsByTagName("size")[0]?.textContent;
                const price = option.getElementsByTagName("price")[0]?.textContent;

                const coffeeRow = document.createElement("tr");
                coffeeRow.innerHTML = `
                    <td>${size}</td>
                    <td>$${price}</td>
                    <td>${description}</td>
                `;
                coffeeTable.appendChild(coffeeRow);
            });
        } else if (beverageName === "Other Beverages") {
            const options = beverage.getElementsByTagName("options")[0]?.getElementsByTagName("option");

            // Iterate over options for other beverages
            Array.from(options).forEach(option => {
                const name = option.getElementsByTagName("name")[0]?.textContent;
                const price = option.getElementsByTagName("price")[0]?.textContent;

                const otherBeverageRow = document.createElement("tr");
                otherBeverageRow.innerHTML = `
                    <td>${name}</td>
                    <td>$${price}</td>
                `;
                otherBeveragesTable.appendChild(otherBeverageRow);
            });
        }
    });
}
