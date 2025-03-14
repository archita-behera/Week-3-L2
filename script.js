document.addEventListener("DOMContentLoaded", function () {
    fetchImages("nature");
});

function fetchImages(query) {
    const API_KEY = "eGwF4GuYV8htzT8C7RzEMOqj8011EjwAVDYeN6dzIi4njP3RuIpIJwJa";
    const API_URL = `https://api.pexels.com/v1/search?query=${query}&per_page=9`;

    fetch(API_URL, {
        method: "GET",
        headers: {
            "Authorization": API_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        const imageSliderList = document.getElementById("imageSliderList");
        imageSliderList.innerHTML = ""; 

        if (data.photos && data.photos.length > 0) {
            data.photos.forEach(photo => {
                const li = document.createElement("li");
                li.classList.add("splide__slide");
                li.innerHTML = `
                    <img src="${photo.src.medium}" alt="Stock Image">
                    <div class="image-details">
                        <p>Photographer: ${photo.photographer}</p>
                    </div>
                `;
                imageSliderList.appendChild(li);
            });

            // Initialize Splide after images are loaded
            new Splide("#imageSlider", {
                type: "loop",
                perPage: 3,
                perMove: 1,
                gap: "1rem",
                autoplay: true,
                interval: 3000,
                breakpoints: {
                    768: { perPage: 2 },
                    480: { perPage: 1 }
                }
            }).mount();
        } else {
            imageSliderList.innerHTML = "<p>No images found.</p>";
        }
    })
    .catch(error => console.error("Error fetching data:", error));
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
