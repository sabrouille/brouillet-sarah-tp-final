document.addEventListener("DOMContentLoaded", function () {

    let connexion = new MovieDB();

    //console.log(document.location.pathname.search("fiche-film.html"));
    if (document.location.pathname.search("fiche-film.html") > 0) {
        let params = (new URL(document.location)).searchParams;

        //console.log(params);

        connexion.requeteInfoFilm(params.get("id"));
    } else {
        connexion.requeteDernierFilm();
        connexion.requeteFilmsPopulaires();
    }
});


class MovieDB {
    constructor() {
        //console.log("Constructeur");

        this.APIKey = "195be83ab1367b9fb7eed4908ea17b46";

        this.lang = "fr-CA";

        this.baseURL = "https://api.themoviedb.org/3";

        this.imgPath = "https://image.tmdb.org/t/p/";

        this.totalFilms = 6;

        //this.largeurAffiche = ["w90", "w154", "w185", "w342", "w500", "w780"];
        //this.largeurTeteAffiche = ["w45", "w185"];
        //this.largeurToileFond = ["w300", "w780", "w1280"];
    }

    requeteDernierFilm() {
        //Mettre une page web à jour sans perturber les actions de l'utilisateur
        let requeteXhr = new XMLHttpRequest();

        requeteXhr.addEventListener("loadend", this.retourRequeteDernierFilm.bind(this));

        //requeteXhr.open("GET", "https://api.themoviedb.org/3/movie/now_playing?api_key=195be83ab1367b9fb7eed4908ea17b46&language=fr-CA&page=1");

        //https://api.themoviedb.org/3/movie/top_rated?api_key=195be83ab1367b9fb7eed4908ea17b46&language=fr-CA&page=1

        //Initialiser la requête pour récupérer les films
        //requeteXhr.open("GET", this.baseURL + "/movie/now_playing?api_key=" + this.APIKey + "&language=" + this.lang + "&page=1");
        requeteXhr.open("GET", this.baseURL + "/movie/top_rated?api_key=" + this.APIKey + "&language=" + this.lang + "&page=1");


        //Envoyer la requête
        requeteXhr.send();
    }

    retourRequeteDernierFilm(e) {
        //console.log("Retour dernier film");

        let target = e.currentTarget;

        let data;

        data = JSON.parse(target.responseText).results;

        //console.log(data);

        this.afficheDernierFilm(data);
    }

    afficheDernierFilm(data) {
        for (let i = 0; i < this.totalFilms; i++) {
            //console.log(data[i].title);

            let unArticle = document.querySelector(".template>article.film").cloneNode(true);

            unArticle.querySelector("h3").innerHTML = data[i].title;
            unArticle.querySelector("p.description").innerHTML = data[i].overview || "Description non disponible";
            unArticle.querySelector("p.cote").innerHTML = data[i].vote_average;
            unArticle.querySelector("p.annee").innerHTML = data[i].release_date;

            let src = this.imgPath + "w185" + data[i].poster_path;

            //console.log(src);

            let uneImage = unArticle.querySelector("img");
            uneImage.setAttribute("src", src);
            uneImage.setAttribute("alt", data[i].title);

            document.querySelector(".liste-films-notes").appendChild(unArticle);

            unArticle.querySelector("a").setAttribute("href", "fiche-film.html?id=" + data[i].id);
        }

        var mySwiper = new Swiper('.carrousel', {
            direction: 'horizontal',
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
            },
        });
    }


    requeteFilmsPopulaires() {
        let requeteXhr = new XMLHttpRequest();

        requeteXhr.addEventListener("loadend", this.retourRequeteFilmsPopulaires.bind(this));
        requeteXhr.open("GET", this.baseURL + "/movie/popular?api_key=" + this.APIKey + "&language=" + this.lang + "&page=1");
        requeteXhr.send();
    }

    retourRequeteFilmsPopulaires(e) {
        let target = e.currentTarget;

        let data;

        data = JSON.parse(target.responseText).results;

        //console.log(data);

        this.afficheFilmsPopulaires(data);
    }

    afficheFilmsPopulaires(data) {
        for (let i = 0; i < 9; i++) {
            let unArticle = document.querySelector(".template>.populaire").cloneNode(true);

            //console.log(unArticle.querySelector("h2"));
            unArticle.querySelector("h3").innerHTML = data[i].title;
            unArticle.querySelector("p.cote").innerHTML = data[i].vote_average;

            let src = this.imgPath + "w185" + data[i].poster_path;

            //console.log(src);

            let uneImage = unArticle.querySelector("img");
            uneImage.setAttribute("src", src);
            uneImage.setAttribute("alt", data[i].title);

            document.querySelector(".swiper-wrapper").appendChild(unArticle);

            unArticle.querySelector("a").setAttribute("href", "fiche-film.html?id=" + data[i].id);
        }
    }


    requeteInfoFilm(movieId) {
        //Mettre une page web à jour sans perturber les actions de l'utilisateur
        let requeteXhr = new XMLHttpRequest();

        requeteXhr.addEventListener("loadend", this.retourRequeteInfoFilm.bind(this));

        // https://api.themoviedb.org/3/movie/{movie_id}?api_key=195be83ab1367b9fb7eed4908ea17b46&language=fr-CA

        //Initialiser la requête pour récupérer les films
        requeteXhr.open("GET", this.baseURL + "/movie/" + movieId + "?api_key=" + this.APIKey + "&language=" + this.lang);

        //Envoyer la requête
        requeteXhr.send();
    }

    retourRequeteInfoFilm(e) {
        let target = e.currentTarget;

        //console.log(target.responseText);

        let data;

        data = JSON.parse(target.responseText);

        console.log(data);

        this.afficheInfoFilm(data);
    }

    afficheInfoFilm(data) {
        console.log(data.title);

        document.querySelector("h1").innerHTML = data.title;
        document.querySelector("p.description").innerHTML = data.overview || "Description non disponible";

        let src = this.imgPath + "w185" + data.backdrop_path;
        document.querySelector("img.affiche").setAttribute("src", src);
        document.querySelector("img.affiche").setAttribute("alt", data.title);

        console.log(src);

        this.requeteActeur(data.id);

        /*uneImage.setAttribute("src", src);
        uneImage.setAttribute("alt", data.title);

        document.querySelector(".liste-films").appendChild(unArticle);

        unArticle.querySelector("a").setAttribute("href", "fiche-film.html?id=" + data[i].id);*/

    }


    requeteActeur(movieId) {
        let requeteXhr = new XMLHttpRequest();

        requeteXhr.addEventListener("loadend", this.retourRequeteActeur.bind(this));

        // https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=195be83ab1367b9fb7eed4908ea17b46&language=fr-CA
        requeteXhr.open("GET", this.baseURL + "/movie/" + movieId + "/credits?api_key=" + this.APIKey + "&language=" + this.lang);

        requeteXhr.send();
    }

    retourRequeteActeur(e) {
        console.log("Retour acteurs");
    }

    afficheActeur(data) {
        //let unActeur = document.querySelector(".template>article.acteur").cloneNode(true);
    }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGxldCBjb25uZXhpb24gPSBuZXcgTW92aWVEQigpO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWUuc2VhcmNoKFwiZmljaGUtZmlsbS5odG1sXCIpKTtcclxuICAgIGlmIChkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZS5zZWFyY2goXCJmaWNoZS1maWxtLmh0bWxcIikgPiAwKSB7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IChuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uKSkuc2VhcmNoUGFyYW1zO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKHBhcmFtcyk7XHJcblxyXG4gICAgICAgIGNvbm5leGlvbi5yZXF1ZXRlSW5mb0ZpbG0ocGFyYW1zLmdldChcImlkXCIpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29ubmV4aW9uLnJlcXVldGVEZXJuaWVyRmlsbSgpO1xyXG4gICAgICAgIGNvbm5leGlvbi5yZXF1ZXRlRmlsbXNQb3B1bGFpcmVzKCk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuXHJcbmNsYXNzIE1vdmllREIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkNvbnN0cnVjdGV1clwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5BUElLZXkgPSBcIjE5NWJlODNhYjEzNjdiOWZiN2VlZDQ5MDhlYTE3YjQ2XCI7XHJcblxyXG4gICAgICAgIHRoaXMubGFuZyA9IFwiZnItQ0FcIjtcclxuXHJcbiAgICAgICAgdGhpcy5iYXNlVVJMID0gXCJodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zXCI7XHJcblxyXG4gICAgICAgIHRoaXMuaW1nUGF0aCA9IFwiaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvXCI7XHJcblxyXG4gICAgICAgIHRoaXMudG90YWxGaWxtcyA9IDY7XHJcblxyXG4gICAgICAgIC8vdGhpcy5sYXJnZXVyQWZmaWNoZSA9IFtcInc5MFwiLCBcIncxNTRcIiwgXCJ3MTg1XCIsIFwidzM0MlwiLCBcInc1MDBcIiwgXCJ3NzgwXCJdO1xyXG4gICAgICAgIC8vdGhpcy5sYXJnZXVyVGV0ZUFmZmljaGUgPSBbXCJ3NDVcIiwgXCJ3MTg1XCJdO1xyXG4gICAgICAgIC8vdGhpcy5sYXJnZXVyVG9pbGVGb25kID0gW1widzMwMFwiLCBcInc3ODBcIiwgXCJ3MTI4MFwiXTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXRlRGVybmllckZpbG0oKSB7XHJcbiAgICAgICAgLy9NZXR0cmUgdW5lIHBhZ2Ugd2ViIMOgIGpvdXIgc2FucyBwZXJ0dXJiZXIgbGVzIGFjdGlvbnMgZGUgbCd1dGlsaXNhdGV1clxyXG4gICAgICAgIGxldCByZXF1ZXRlWGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgIHJlcXVldGVYaHIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlbmRcIiwgdGhpcy5yZXRvdXJSZXF1ZXRlRGVybmllckZpbG0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vcmVxdWV0ZVhoci5vcGVuKFwiR0VUXCIsIFwiaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9tb3ZpZS9ub3dfcGxheWluZz9hcGlfa2V5PTE5NWJlODNhYjEzNjdiOWZiN2VlZDQ5MDhlYTE3YjQ2Jmxhbmd1YWdlPWZyLUNBJnBhZ2U9MVwiKTtcclxuXHJcbiAgICAgICAgLy9odHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL21vdmllL3RvcF9yYXRlZD9hcGlfa2V5PTE5NWJlODNhYjEzNjdiOWZiN2VlZDQ5MDhlYTE3YjQ2Jmxhbmd1YWdlPWZyLUNBJnBhZ2U9MVxyXG5cclxuICAgICAgICAvL0luaXRpYWxpc2VyIGxhIHJlcXXDqnRlIHBvdXIgcsOpY3Vww6lyZXIgbGVzIGZpbG1zXHJcbiAgICAgICAgLy9yZXF1ZXRlWGhyLm9wZW4oXCJHRVRcIiwgdGhpcy5iYXNlVVJMICsgXCIvbW92aWUvbm93X3BsYXlpbmc/YXBpX2tleT1cIiArIHRoaXMuQVBJS2V5ICsgXCImbGFuZ3VhZ2U9XCIgKyB0aGlzLmxhbmcgKyBcIiZwYWdlPTFcIik7XHJcbiAgICAgICAgcmVxdWV0ZVhoci5vcGVuKFwiR0VUXCIsIHRoaXMuYmFzZVVSTCArIFwiL21vdmllL3RvcF9yYXRlZD9hcGlfa2V5PVwiICsgdGhpcy5BUElLZXkgKyBcIiZsYW5ndWFnZT1cIiArIHRoaXMubGFuZyArIFwiJnBhZ2U9MVwiKTtcclxuXHJcblxyXG4gICAgICAgIC8vRW52b3llciBsYSByZXF1w6p0ZVxyXG4gICAgICAgIHJlcXVldGVYaHIuc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldG91clJlcXVldGVEZXJuaWVyRmlsbShlKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIlJldG91ciBkZXJuaWVyIGZpbG1cIik7XHJcblxyXG4gICAgICAgIGxldCB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcblxyXG4gICAgICAgIGxldCBkYXRhO1xyXG5cclxuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZSh0YXJnZXQucmVzcG9uc2VUZXh0KS5yZXN1bHRzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICB0aGlzLmFmZmljaGVEZXJuaWVyRmlsbShkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBhZmZpY2hlRGVybmllckZpbG0oZGF0YSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b3RhbEZpbG1zOyBpKyspIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhW2ldLnRpdGxlKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1bkFydGljbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRlbXBsYXRlPmFydGljbGUuZmlsbVwiKS5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICB1bkFydGljbGUucXVlcnlTZWxlY3RvcihcImgzXCIpLmlubmVySFRNTCA9IGRhdGFbaV0udGl0bGU7XHJcbiAgICAgICAgICAgIHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwicC5kZXNjcmlwdGlvblwiKS5pbm5lckhUTUwgPSBkYXRhW2ldLm92ZXJ2aWV3IHx8IFwiRGVzY3JpcHRpb24gbm9uIGRpc3BvbmlibGVcIjtcclxuICAgICAgICAgICAgdW5BcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJwLmNvdGVcIikuaW5uZXJIVE1MID0gZGF0YVtpXS52b3RlX2F2ZXJhZ2U7XHJcbiAgICAgICAgICAgIHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwicC5hbm5lZVwiKS5pbm5lckhUTUwgPSBkYXRhW2ldLnJlbGVhc2VfZGF0ZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzcmMgPSB0aGlzLmltZ1BhdGggKyBcIncxODVcIiArIGRhdGFbaV0ucG9zdGVyX3BhdGg7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNyYyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgdW5lSW1hZ2UgPSB1bkFydGljbGUucXVlcnlTZWxlY3RvcihcImltZ1wiKTtcclxuICAgICAgICAgICAgdW5lSW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIHNyYyk7XHJcbiAgICAgICAgICAgIHVuZUltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBkYXRhW2ldLnRpdGxlKTtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGlzdGUtZmlsbXMtbm90ZXNcIikuYXBwZW5kQ2hpbGQodW5BcnRpY2xlKTtcclxuXHJcbiAgICAgICAgICAgIHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiYVwiKS5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiZmljaGUtZmlsbS5odG1sP2lkPVwiICsgZGF0YVtpXS5pZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbXlTd2lwZXIgPSBuZXcgU3dpcGVyKCcuY2Fycm91c2VsJywge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcclxuICAgICAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2aWdhdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmV4dEVsOiAnLnN3aXBlci1idXR0b24tbmV4dCcsXHJcbiAgICAgICAgICAgICAgICBwcmV2RWw6ICcuc3dpcGVyLWJ1dHRvbi1wcmV2JyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGFnaW5hdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgZWw6ICcuc3dpcGVyLXBhZ2luYXRpb24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZXF1ZXRlRmlsbXNQb3B1bGFpcmVzKCkge1xyXG4gICAgICAgIGxldCByZXF1ZXRlWGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgIHJlcXVldGVYaHIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlbmRcIiwgdGhpcy5yZXRvdXJSZXF1ZXRlRmlsbXNQb3B1bGFpcmVzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHJlcXVldGVYaHIub3BlbihcIkdFVFwiLCB0aGlzLmJhc2VVUkwgKyBcIi9tb3ZpZS9wb3B1bGFyP2FwaV9rZXk9XCIgKyB0aGlzLkFQSUtleSArIFwiJmxhbmd1YWdlPVwiICsgdGhpcy5sYW5nICsgXCImcGFnZT0xXCIpO1xyXG4gICAgICAgIHJlcXVldGVYaHIuc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldG91clJlcXVldGVGaWxtc1BvcHVsYWlyZXMoZSkge1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcblxyXG4gICAgICAgIGxldCBkYXRhO1xyXG5cclxuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZSh0YXJnZXQucmVzcG9uc2VUZXh0KS5yZXN1bHRzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICB0aGlzLmFmZmljaGVGaWxtc1BvcHVsYWlyZXMoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWZmaWNoZUZpbG1zUG9wdWxhaXJlcyhkYXRhKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHVuQXJ0aWNsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGVtcGxhdGU+LnBvcHVsYWlyZVwiKS5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiaDJcIikpO1xyXG4gICAgICAgICAgICB1bkFydGljbGUucXVlcnlTZWxlY3RvcihcImgzXCIpLmlubmVySFRNTCA9IGRhdGFbaV0udGl0bGU7XHJcbiAgICAgICAgICAgIHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwicC5jb3RlXCIpLmlubmVySFRNTCA9IGRhdGFbaV0udm90ZV9hdmVyYWdlO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNyYyA9IHRoaXMuaW1nUGF0aCArIFwidzE4NVwiICsgZGF0YVtpXS5wb3N0ZXJfcGF0aDtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc3JjKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1bmVJbWFnZSA9IHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpO1xyXG4gICAgICAgICAgICB1bmVJbWFnZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgc3JjKTtcclxuICAgICAgICAgICAgdW5lSW1hZ2Uuc2V0QXR0cmlidXRlKFwiYWx0XCIsIGRhdGFbaV0udGl0bGUpO1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zd2lwZXItd3JhcHBlclwiKS5hcHBlbmRDaGlsZCh1bkFydGljbGUpO1xyXG5cclxuICAgICAgICAgICAgdW5BcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJhXCIpLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCJmaWNoZS1maWxtLmh0bWw/aWQ9XCIgKyBkYXRhW2ldLmlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJlcXVldGVJbmZvRmlsbShtb3ZpZUlkKSB7XHJcbiAgICAgICAgLy9NZXR0cmUgdW5lIHBhZ2Ugd2ViIMOgIGpvdXIgc2FucyBwZXJ0dXJiZXIgbGVzIGFjdGlvbnMgZGUgbCd1dGlsaXNhdGV1clxyXG4gICAgICAgIGxldCByZXF1ZXRlWGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgIHJlcXVldGVYaHIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlbmRcIiwgdGhpcy5yZXRvdXJSZXF1ZXRlSW5mb0ZpbG0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvbW92aWUve21vdmllX2lkfT9hcGlfa2V5PTE5NWJlODNhYjEzNjdiOWZiN2VlZDQ5MDhlYTE3YjQ2Jmxhbmd1YWdlPWZyLUNBXHJcblxyXG4gICAgICAgIC8vSW5pdGlhbGlzZXIgbGEgcmVxdcOqdGUgcG91ciByw6ljdXDDqXJlciBsZXMgZmlsbXNcclxuICAgICAgICByZXF1ZXRlWGhyLm9wZW4oXCJHRVRcIiwgdGhpcy5iYXNlVVJMICsgXCIvbW92aWUvXCIgKyBtb3ZpZUlkICsgXCI/YXBpX2tleT1cIiArIHRoaXMuQVBJS2V5ICsgXCImbGFuZ3VhZ2U9XCIgKyB0aGlzLmxhbmcpO1xyXG5cclxuICAgICAgICAvL0Vudm95ZXIgbGEgcmVxdcOqdGVcclxuICAgICAgICByZXF1ZXRlWGhyLnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXRvdXJSZXF1ZXRlSW5mb0ZpbG0oZSkge1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2codGFyZ2V0LnJlc3BvbnNlVGV4dCk7XHJcblxyXG4gICAgICAgIGxldCBkYXRhO1xyXG5cclxuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZSh0YXJnZXQucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWZmaWNoZUluZm9GaWxtKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGFmZmljaGVJbmZvRmlsbShkYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YS50aXRsZSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMVwiKS5pbm5lckhUTUwgPSBkYXRhLnRpdGxlO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJwLmRlc2NyaXB0aW9uXCIpLmlubmVySFRNTCA9IGRhdGEub3ZlcnZpZXcgfHwgXCJEZXNjcmlwdGlvbiBub24gZGlzcG9uaWJsZVwiO1xyXG5cclxuICAgICAgICBsZXQgc3JjID0gdGhpcy5pbWdQYXRoICsgXCJ3MTg1XCIgKyBkYXRhLmJhY2tkcm9wX3BhdGg7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImltZy5hZmZpY2hlXCIpLnNldEF0dHJpYnV0ZShcInNyY1wiLCBzcmMpO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbWcuYWZmaWNoZVwiKS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgZGF0YS50aXRsZSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHNyYyk7XHJcblxyXG4gICAgICAgIHRoaXMucmVxdWV0ZUFjdGV1cihkYXRhLmlkKTtcclxuXHJcbiAgICAgICAgLyp1bmVJbWFnZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgc3JjKTtcclxuICAgICAgICB1bmVJbWFnZS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgZGF0YS50aXRsZSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGlzdGUtZmlsbXNcIikuYXBwZW5kQ2hpbGQodW5BcnRpY2xlKTtcclxuXHJcbiAgICAgICAgdW5BcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJhXCIpLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCJmaWNoZS1maWxtLmh0bWw/aWQ9XCIgKyBkYXRhW2ldLmlkKTsqL1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVxdWV0ZUFjdGV1cihtb3ZpZUlkKSB7XHJcbiAgICAgICAgbGV0IHJlcXVldGVYaHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgcmVxdWV0ZVhoci5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVuZFwiLCB0aGlzLnJldG91clJlcXVldGVBY3RldXIuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvbW92aWUve21vdmllX2lkfS9jcmVkaXRzP2FwaV9rZXk9MTk1YmU4M2FiMTM2N2I5ZmI3ZWVkNDkwOGVhMTdiNDYmbGFuZ3VhZ2U9ZnItQ0FcclxuICAgICAgICByZXF1ZXRlWGhyLm9wZW4oXCJHRVRcIiwgdGhpcy5iYXNlVVJMICsgXCIvbW92aWUvXCIgKyBtb3ZpZUlkICsgXCIvY3JlZGl0cz9hcGlfa2V5PVwiICsgdGhpcy5BUElLZXkgKyBcIiZsYW5ndWFnZT1cIiArIHRoaXMubGFuZyk7XHJcblxyXG4gICAgICAgIHJlcXVldGVYaHIuc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldG91clJlcXVldGVBY3RldXIoZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmV0b3VyIGFjdGV1cnNcIik7XHJcbiAgICB9XHJcblxyXG4gICAgYWZmaWNoZUFjdGV1cihkYXRhKSB7XHJcbiAgICAgICAgLy9sZXQgdW5BY3RldXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRlbXBsYXRlPmFydGljbGUuYWN0ZXVyXCIpLmNsb25lTm9kZSh0cnVlKTtcclxuICAgIH1cclxufSJdLCJmaWxlIjoic2NyaXB0LmpzIn0=
