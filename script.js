const API_KEY = "16d3006785084ba0953f2d0b3d9abb68";
const baseUrl = "https://newsapi.org/v2/everything?q=";
const categories = ["sports", "finance", "business", "fashion", "politics"];
const sortBy = "publishedAt";

// Notification function to display notifications
function displayNotification(title, body) {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
        console.error("This browser does not support desktop notification");
        return;
    }

    // Check if the user has granted permission for notifications
    if (Notification.permission === "granted") {
        // If permission is granted, create and display the notification
        new Notification(title, { body: body });
    } else if (Notification.permission !== "denied") {
        // If permission is not denied, request permission from the user
        Notification.requestPermission().then(function (permission) {
            // If the user grants permission, create and display the notification
            if (permission === "granted") {
                new Notification(title, { body: body });
            }
        });
    }
}

// Function to fetch news and display notifications
async function fetchNewsAndNotify(query) {
    const promises = categories.map(category => {
        const url = `${baseUrl}${query}+${category}&apiKey=${API_KEY}&sortBy=${sortBy}`;
        return fetch(url)
            .then(response => response.json());
    });
    
    Promise.all(promises)
        .then(dataArray => {
            bindData(dataArray);

            // Example: Display notification when new articles are loaded
            displayNotification("New Articles", "New articles have been loaded!");
        })
        .catch(error => console.error('Error:', error));
}

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const promises = categories.map(category => {
        const url = `${baseUrl}${query}+${category}&apiKey=${API_KEY}&sortBy=${sortBy}`;
        return fetch(url)
            .then(response => response.json());
    });
    
    Promise.all(promises)
        .then(dataArray => {
            bindData(dataArray);
        })
        .catch(error => console.error('Error:', error));
}

function bindData(dataArray) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    dataArray.forEach(data => {
        data.articles.forEach(article => {
            if (!article.urlToImage) return;
            const cardClone = newsCardTemplate.content.cloneNode(true);
            fillDataInCard(cardClone, article);
            cardsContainer.appendChild(cardClone);
        });
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

// Fetch news and display notifications on page load
window.addEventListener("load", () => fetchNewsAndNotify("India"));
