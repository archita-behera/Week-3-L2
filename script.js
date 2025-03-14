document.addEventListener("DOMContentLoaded", function () {
    fetchImages("laptop"); // Default search term
});

let favoriteImages = [];

function fetchImages(query) {
    const API_KEY = "eGwF4GuYV8htzT8C7RzEMOqj8011EjwAVDYeN6dzIi4njP3RuIpIJwJa";
    const API_URL = `https://api.pexels.com/v1/search?query=${query}&per_page=9`;

    fetch(API_URL, {
        method: "GET",
        headers: { "Authorization": API_KEY }
    })
    .then(response => response.json())
    .then(data => {
        if (data.photos && data.photos.length > 0) {
            displaySelectedImage(data.photos[0]);
            displaySimilarResults(data.photos.slice(1));
        }
    })
    .catch(error => console.error("Error fetching data:", error));
}

function displaySelectedImage(image) {
    document.getElementById("selectedImage").src = image.src.medium;
    document.getElementById("imageTitle").textContent = image.alt;
    document.getElementById("photographerName").textContent = `Photographer: ${image.photographer}`;
}

function exploreMore() {
    const imageTitle = document.getElementById("imageTitle").textContent;
    const searchQuery = encodeURIComponent(imageTitle); 
    window.location.href = `https://www.pexels.com/search/${searchQuery}/`;
}


function displaySimilarResults(images) {
    const imageSliderList = document.getElementById("imageSliderList");
    imageSliderList.innerHTML = "";

    images.forEach(photo => {
        const li = document.createElement("li");
        li.classList.add("splide__slide");

        li.innerHTML = `
            <div class="image-card">
                <img src="${photo.src.medium}" alt="${photo.alt}">
                <button class="heart-btn" onclick='toggleFavorite(this, ${JSON.stringify(photo)})'>
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `;
        imageSliderList.appendChild(li);
    });

    new Splide("#imageSlider", {
        type: "loop",
        perPage: 3,
        perMove: 1,
        gap: "1rem",
        autoplay: true,
        interval: 3000,
        breakpoints: { 768: { perPage: 2 }, 480: { perPage: 1 } }
    }).mount();
}

function toggleFavorite(button, imageData) {
    const icon = button.querySelector("i");

    const imageIndex = favoriteImages.findIndex(fav => fav.src.medium === imageData.src.medium);

    if (imageIndex !== -1) {
        // Remove from favorites
        favoriteImages.splice(imageIndex, 1);
        icon.classList.remove("favorited");
        icon.style.color = "black"; // Change back to black
    } else {
        // Add to favorites
        favoriteImages.push(imageData);
        icon.classList.add("favorited");
        icon.style.color = "red"; // Make it red
    }

    updateFavoriteSlider();
}

let favoriteSliderInstance = null; // Store Splide instance globally

function updateFavoriteSlider() {
    const favoriteSliderList = document.getElementById("favoriteSliderList");
    favoriteSliderList.innerHTML = "";

    if (favoriteImages.length === 0) {
        favoriteSliderList.innerHTML = "<p>No favorites added yet.</p>";
        return;
    }

    favoriteImages.forEach(photo => {
        const li = document.createElement("li");
        li.classList.add("splide__slide");

        li.innerHTML = `
            <div class="image-card">
                <img src="${photo.src.medium}" alt="${photo.alt}">
                <button class="remove-btn" onclick='removeFavorite("${photo.src.medium}")'>
                     <i class="fas fa-heart"></i>
                </button>
            </div>
        `;
        favoriteSliderList.appendChild(li);
    });

    // Destroy previous Splide instance to avoid duplicates
    if (favoriteSliderInstance) {
        favoriteSliderInstance.destroy();
    }

    // Re-initialize Splide only once
    favoriteSliderInstance = new Splide("#favoriteSlider", {
        type: "loop",
        perPage: 3,
        perMove: 1,
        gap: "1rem",
        autoplay: true,
        interval: 3000,
        breakpoints: { 768: { perPage: 2 }, 480: { perPage: 1 } }
    });

    favoriteSliderInstance.mount();
}


function removeFavorite(imageSrc) {
    favoriteImages = favoriteImages.filter(img => img.src.medium !== imageSrc);
    updateFavoriteSlider();
}

function searchImages() {
    const query = document.getElementById("searchInput").value.trim();
    if (query !== "") {
        fetchImages(query);
    }
}

// Enable search on pressing Enter
document.getElementById("searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchImages();
    }
});
