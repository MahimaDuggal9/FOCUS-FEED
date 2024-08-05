const API_KEY = "16d3006785084ba0953f2d0b3d9abb68";
const baseUrl = "https://newsapi.org/v2/everything?q=";
const categories = ["sports", "finance", "business", "fashion", "politics"];
const sortBy = "publishedAt";

// Notification function to display notifications
function displayNotification(title, body) {
    if (!("Notification" in window)) {
        console.error("This browser does not support desktop notifications");
        return;
    }

    if (Notification.permission === "granted") {
        new Notification(title, { body: body });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body: body });
            }
        });
    }
}

// Function to fetch news and display notifications
async function fetchNewsAndNotify(query) {
    try {
        const promises = categories.map(category => {
            const url = `${baseUrl}${query}+${category}&apiKey=${API_KEY}&sortBy=${sortBy}`;
            console.log('Fetching URL:', url);  // Log the URL being fetched
            return fetch(url).then(response => response.json());
        });
        
        const dataArray = await Promise.all(promises);
        console.log('Fetched Data Array:', dataArray);  // Log the fetched data

        bindData(dataArray);

        // Display notification when new articles are loaded
        displayNotification("New Articles", "New articles have been loaded!");
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const promises = categories.map(category => {
            const url = `${baseUrl}${query}+${category}&apiKey=${API_KEY}&sortBy=${sortBy}`;
            console.log('Fetching URL:', url);  // Log the URL being fetched
            return fetch(url).then(response => response.json());
        });
        
        const dataArray = await Promise.all(promises);
        console.log('Fetched Data Array:', dataArray);  // Log the fetched data

        bindData(dataArray);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function bindData(dataArray) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    let hasArticles = false;

    dataArray.forEach(data => {
        if (data.articles.length === 0) {
            console.warn('No articles found for category');
        }
        
        data.articles.forEach(article => {
            if (!article.urlToImage) return;
            hasArticles = true;
            const cardClone = newsCardTemplate.content.cloneNode(true);
            fillDataInCard(cardClone, article);
            cardsContainer.appendChild(cardClone);
        });
    });

    if (!hasArticles) {
        cardsContainer.innerHTML = "<p>No articles found</p>";
    }
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
    if (curSelectedNav) curSelectedNav.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;
    fetchNews(query);
    if (curSelectedNav) curSelectedNav.classList.remove("active");
    curSelectedNav = null;
});

document.getElementById("login-text").addEventListener("click", () => {
    window.location.href = "login.html";
});

window.addEventListener("load", () => fetchNewsAndNotify("India"));
