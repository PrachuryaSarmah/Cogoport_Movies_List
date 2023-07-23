const apiKey = "d6175b6d"; 
const itemsPerPage = 10; // Number of movies per page
const movieListContainer = document.getElementById("movieList");
const paginationContainer = document.getElementById("pagination");
const movieDetailsContainer = document.getElementById("movieDetails");
let currentPage = 1;
let searchQuery = "";

// Function to fetch movie data from the OMDB API
async function fetchMovies(page) {
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.Search || [];
}

function renderMovieCards(movies) {
    movieListContainer.innerHTML = "";
    movies.forEach((movie) => {
        const { imdbID, Poster, Title } = movie;
        const { rating, comment } = getRatingAndComment(imdbID); // Get previous rating and comment
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img src="${Poster}" alt="${Title}">
            <h2 id="title">${Title}</h2>
            <p><strong>Rating:</strong> ${rating ? rating + " stars" : "Not rated"}</p>
            <p><strong>Comment:</strong> ${comment || "No comment"}</p>
        `;
        movieCard.addEventListener("click", () => showMovieDetails(imdbID));
        movieListContainer.appendChild(movieCard);
    });
}

// Function to render pagination buttons
function renderPaginationButtons(totalResults) {
    const totalPages = Math.ceil(totalResults / itemsPerPage);
    paginationContainer.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.addEventListener("click", () => goToPage(i)); // Use i as the page number
        paginationContainer.appendChild(button);
    }
}

// Function to handle pagination navigation
function goToPage(page) {
    currentPage = page;
    fetchAndRenderMovies();
}

// Function to fetch and render movies based on the current page and search query
async function fetchAndRenderMovies() {
    const data = await fetchMovies(currentPage);
    renderMovieCards(data);
    // Fetch total results count to calculate total pages for pagination
    const totalResults = await getTotalResults();
    renderPaginationButtons(totalResults);
}

// Function to fetch total results count from the API
async function getTotalResults() {
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}`;
    const response = await fetch(url);
    const data = await response.json();
    return parseInt(data.totalResults) || 0;
}

// Function to show movie details
async function showMovieDetails(imdbID) {
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;
    const response = await fetch(url);
    const data = await response.json();
    const detailsHTML = `
        <h2 id="titlee">${data.Title}</h2>
        <p><strong>Year:</strong> ${data.Year}</p>
        <p><strong>Genre:</strong> ${data.Genre}</p>
        <p><strong>Plot:</strong> ${data.Plot}</p>
        <div class="rating-container">
            <label id= "rate" for="rating">Rate this movie:</label>
            <input type="number" id="rating" min="1" max="5">
        </div>
        <div class="comment-container">
            <label id="txtcmt" for="comment">Comment:</label>
            
        </div>
        <div><textarea id="comment" rows="3"></textarea></div>
        <button id="create" onclick="saveRatingAndComment('${imdbID}')">Save</button>
    `;
    movieDetailsContainer.innerHTML = detailsHTML;
    movieDetailsContainer.style.display = "block";
    movieDetailsContainer.scrollIntoView({ behavior: "smooth" });
}

// Function to save user rating and comment in local storage
function saveRatingAndComment(imdbID) {
    const ratingInput = document.getElementById("rating");
    const commentInput = document.getElementById("comment");
    const rating = ratingInput.value;
    const comment = commentInput.value;

    // Check if the movie already has ratings and comments in the local storage
    const existingData = JSON.parse(localStorage.getItem("movieRatingsAndComments")) || {};

    // Update the ratings and comments for the selected movie
    existingData[imdbID] = { rating, comment };

    // Save the updated data to the local storage
    localStorage.setItem("movieRatingsAndComments", JSON.stringify(existingData));

    // Clear input fields
    ratingInput.value = "";
    commentInput.value = "";

    // Refresh the movie details to display updated ratings and comments
    showMovieDetails(imdbID);
}

// Function to get user rating and comment for a movie from local storage
function getRatingAndComment(imdbID) {
    const existingData = JSON.parse(localStorage.getItem("movieRatingsAndComments")) || {};
    return existingData[imdbID] || { rating: null, comment: "" };
}


// Function to handle search input
function handleSearchInput() {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => {
        searchQuery = searchInput.value.trim();
        currentPage = 1;
        fetchAndRenderMovies();
    });
}

// Initialize the movie list application
function init() {
    fetchAndRenderMovies();
    handleSearchInput();
}

init();



        





