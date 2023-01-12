// JQuery
// $(".search-button").on("click", () => {
//   $.ajax({
//     url:
//       "http://www.omdbapi.com/?apikey=f253bb46&s=" + $(".input-keyword").val(),
//     success: (results) => {
//       const movies = results.Search;
//       let cards = "";
//       movies.forEach((m) => {
//         cards += showCards(m);
//         $(".movie-container").html(cards);

//         $(".modal-detail-button").on("click", function () {
//           $.ajax({
//             url:
//               "http://www.omdbapi.com/?apikey=f253bb46&i=" +
//               $(this).data("imdbid"),
//             success: (m) => {
//               const movieDetail = showMovieDetail(m);
//               $(".modal-body").html(movieDetail);
//             },
//             error: (e) => console.log(e.responseText),
//           });
//         });
//       });
//     },
//     error: (e) => console.log(e.responseText),
//   });
// });

// Fetch
// const searchBtn = document.querySelector(".search-button");
// searchBtn.addEventListener("click", function () {
//   const inputKeyword = document.querySelector(".input-keyword");
//   fetch("http://www.omdbapi.com/?apikey=f253bb46&s=" + inputKeyword.value)
//     .then((response) => response.json())
//     .then((response) => {
//       const movies = response.Search;
//       let cards = "";
//       movies.forEach((m) => (cards += showCards(m)));
//       const movieContainer = document.querySelector(".movie-container");
//       movieContainer.innerHTML = cards;

//       const modalDetailBtn = document.querySelectorAll(".modal-detail-button");
//       modalDetailBtn.forEach((btn) => {
//         btn.addEventListener("click", function () {
//           fetch(
//             "http://www.omdbapi.com/?apikey=f253bb46&i=" + this.dataset.imdbid
//           )
//             .then((response) => response.json())
//             .then((m) => {
//               const movieDetail = showMovieDetail(m);
//               const modalBody = document.querySelector(".modal-body");
//               modalBody.innerHTML = movieDetail;
//             })
//             .catch((e) => console.log(e.responseText));
//         });
//       });
//     })
//     .catch((e) => console.log(e.responseText));
// });

const searchBtn = document.querySelector(".search-button");
const inputKeyword = document.querySelector(".input-keyword");

searchBtn.addEventListener("click", async function () {
  try {
    const movies = await getMovies(inputKeyword.value);
    updateUI(movies);
    inputKeyword.value = "";
  } catch (error) {
    alert(error.message);
  }
});

inputKeyword.addEventListener("keyup", async function (e) {
  if (e.which === 13) {
    try {
      const movies = await getMovies(inputKeyword.value);
      updateUI(movies);
      inputKeyword.value = "";
    } catch (error) {
      const showError = `<div class="row">
                          <div class="col">
                            <div class="alert alert-danger text-center" role="alert">
                              <h1>${error.message}</h1>
                            </div>
                          </div>
                        </div>`;
      const movieContainer = document.querySelector(".movie-container");
      movieContainer.innerHTML = showError;
    }
  }
});

const getMovies = (keyword) => {
  return fetch("https://www.omdbapi.com/?apikey=f253bb46&s=" + keyword)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }

      return response.Search;
    });
};

const updateUI = (movies) => {
  let cards = "";
  movies.forEach((m) => (cards += showCards(m)));
  const movieContainer = document.querySelector(".movie-container");
  movieContainer.innerHTML = cards;
};

// Event Binding
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modal-detail-button")) {
    try {
      const imdbid = e.target.dataset.imdbid;
      const movieDetail = await getMovieDetail(imdbid);
      updateUIDetail(movieDetail);
    } catch (error) {
      alert(error);
    }
  }
});

const getMovieDetail = (imdbid) => {
  return fetch("https://www.omdbapi.com/?apikey=f253bb46&i=" + imdbid)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.Error);
    })
    .then((m) => m);
};

const updateUIDetail = (m) => {
  const movieDetail = showMovieDetail(m);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = movieDetail;
};

const showCards = (m) => {
  return `<div class="col-md-3 my-3">
            <div class="card">
              <img src="${m.Poster}" class="card-img-top" alt="${m.Title}" />
              <div class="card-body">
                <h5 class="card-title">${m.Title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal"
                data-bs-target="#movieDetailModal" data-imdbid="${m.imdbID}">Show Details</a>
              </div>
            </div>
          </div>`;
};

const showMovieDetail = (m) => {
  return `<div class="container-fluid">
            <div class="row">
              <div class="col-md-3">
                <img src="${m.Poster}" alt="${m.Poster}" class="img-fluid" />
              </div>
              <div class="col-md">
                <ul class="list-group">
                  <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
                  <li class="list-group-item"><strong>Director: </strong>${m.Director}</li>
                  <li class="list-group-item"><strong>Writer: </strong>${m.Writer}</li>
                  <li class="list-group-item"><strong>Actors: </strong>${m.Actors}</li>
                  <li class="list-group-item"><strong>Plot: </strong> <br/ > ${m.Plot}</li>
                </ul>
              </div>
            </div>
          </div>`;
};
