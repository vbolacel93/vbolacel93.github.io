// contact.js

// Function to handle form submission
function handleFormSubmission(event) {
    event.preventDefault(); // Prevent actual form submission
    alert("Thank you! Your message has been sent.");
}

// Attach event listener to the form
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("enquiry-form");
    form.addEventListener("submit", handleFormSubmission);

    // Load branches data
    loadBranches();
});

// Function to load branches from XML (existing code)
async function loadBranches() {
    try {
        const response = await fetch('files/branches.xml');
        if (!response.ok) throw new Error("Network response was not ok.");
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        if (xmlDoc.getElementsByTagName("parsererror").length) {
            throw new Error("Error parsing XML.");
        }

        const branches = xmlDoc.getElementsByTagName("branch");
        const branchList = document.getElementById("branch-list");

        for (let i = 0; i < branches.length; i++) {
            const branch = branches[i];
            const address = branch.getElementsByTagName("address")[0]?.textContent || "N/A";
            const contact = branch.getElementsByTagName("contact")[0]?.textContent || "N/A";
            const openingHours = branch.getElementsByTagName("openingHours")[0]?.textContent || "N/A";
            const mapLink = branch.getElementsByTagName("mapLink")[0]?.textContent || "#";

            const row = document.createElement("tr");
            const addressCell = document.createElement("td");
            addressCell.innerHTML = `${address}<br><a href="${mapLink}" target="_blank">View on Google Maps</a>`;
            
            const contactCell = document.createElement("td");
            contactCell.textContent = contact;

            const hoursCell = document.createElement("td");
            hoursCell.innerHTML = openingHours.replace(/, /g, "<br>");

            row.appendChild(addressCell);
            row.appendChild(contactCell);
            row.appendChild(hoursCell);

            branchList.appendChild(row);
        }
    } catch (error) {
        console.error("Error loading branches:", error);
    }
}
