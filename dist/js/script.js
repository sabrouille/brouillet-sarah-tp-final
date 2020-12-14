document.addEventListener("DOMContentLoaded", function () {

    let connexion = new MovieDB();

    //console.log(document.location.pathname.search("fiche-film.html"));
    if (document.location.pathname.search("fiche-film.html") > 0) {
        let params = (new URL(document.location)).searchParams;

        //console.log(params);

        if(params.get("id") === null){
            connexion.requeteFilmRecent();
        }
        else {
            connexion.requeteInfoFilm(params.get("id"));
        }

    }
    else {
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

        var mySwiper1 = new Swiper('.carrousel', {
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

        //console.log(movieId);

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

        //console.log(data);

        this.afficheInfoFilm(data);
    }

    afficheInfoFilm(data) {
        //console.log(data.backdrop_path);

        document.querySelector("h1").innerHTML = data.title;
        document.querySelector("p.description").innerHTML = data.overview || "Description non disponible";
        document.querySelector("p.annee").innerHTML = "Année de parution : " + (data.release_date || "Non disponible");
        document.querySelector("p.vote").innerHTML = "Note moyenne : " + data.vote_average || "Non disponible";

        if(data.original_language === "en"){
            document.querySelector("p.lang").innerHTML = "Langue originale : Anglais";
        }
        else if(data.original_language === "fr"){
            document.querySelector("p.lang").innerHTML = "Langue originale : Français";
        }
        else{
            document.querySelector("p.lang").innerHTML = "Langue originale : " + (data.original_language || "Non disponible");
        }

        if(data.runtime === 0){
            document.querySelector("p.duree").innerHTML = "Durée : Non disponible";
        }
        else{
            document.querySelector("p.duree").innerHTML = "Durée : " + data.runtime + " minutes";
        }

        if(data.budget === 0){
            document.querySelector("p.budget").innerHTML = "Budget : Non disponible";
        }
        else{
            document.querySelector("p.budget").innerHTML = "Budget : " + data.budget + "$";
        }

        if(data.revenue === 0){
            document.querySelector("p.recette").innerHTML = "Revenus : Non disponible";
        }
        else{
            document.querySelector("p.recette").innerHTML = "Revenus : " + data.revenue + "$";
        }

        let src = this.imgPath + "w185" + data.backdrop_path;
        //console.log(src);
        document.querySelector("img.affiche").setAttribute("src", src);
        document.querySelector("img.affiche").setAttribute("alt", data.title);

        this.requeteActeur(data.id);

        /*uneImage.setAttribute("src", src);
        uneImage.setAttribute("alt", data.title);

        document.querySelector(".liste-films").appendChild(unArticle);

        unArticle.querySelector("a").setAttribute("href", "fiche-film.html?id=" + data[i].id);*/

    }


    requeteFilmRecent() {
        //Mettre une page web à jour sans perturber les actions de l'utilisateur
        let requeteXhr = new XMLHttpRequest();

        requeteXhr.addEventListener("loadend", this.retourRequeteFilmRecent.bind(this));

        // https://api.themoviedb.org/3/movie/upcoming?api_key=195be83ab1367b9fb7eed4908ea17b46&language=fr-CA&page=1

        //Initialiser la requête pour récupérer les films
        requeteXhr.open("GET", this.baseURL + "/movie/upcoming?api_key=" + this.APIKey + "&language=" + this.lang + "&page=1");

        //Envoyer la requête
        requeteXhr.send();
    }

    retourRequeteFilmRecent(e) {
        let target = e.currentTarget;

        //console.log(target.responseText);

        let data;

        data = JSON.parse(target.responseText).results;

        console.log(data);

        this.afficheFilmRecent(data);
    }

    afficheFilmRecent(data) {
        for (let i = 0; i < 9; i++){
            //console.log(data[i].title);
            document.querySelector("h1").innerHTML = data[0].title;
            document.querySelector("p.description").innerHTML = data[0].overview || "Description non disponible";

            let src = this.imgPath + "w185" + data[0].backdrop_path;
            document.querySelector("img.affiche").setAttribute("src", src);
            document.querySelector("img.affiche").setAttribute("alt", data[0].title);
        }

        this.requeteActeur(data.id);
    }



    requeteActeur(movieId) {
        let requeteXhr = new XMLHttpRequest();

        requeteXhr.addEventListener("loadend", this.retourRequeteActeur.bind(this));

        // https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=195be83ab1367b9fb7eed4908ea17b46&language=fr-CA
        requeteXhr.open("GET", this.baseURL + "/movie/" + movieId + "/credits?api_key=" + this.APIKey + "&language=" + this.lang);

        requeteXhr.send();
    }

    retourRequeteActeur(e) {

        let target = e.currentTarget;

        let data;

        data = JSON.parse(target.responseText).cast;
        console.log(data);

        this.afficheActeur(data);
    }

    afficheActeur(data) {
        for (let i = 0; i < data.length; i++){
            let unActeur = document.querySelector(".template>.acteur").cloneNode(true);

            unActeur.querySelector("h3").innerHTML = data[i].original_name;

            let uneImage = unActeur.querySelector("img");

            let src = this.imgPath + "w185" + data[i].profile_path;

            console.log(src);
            if(data[i].profile_path != null){
                uneImage.setAttribute("src", src);
                uneImage.setAttribute("alt", data[i].original_name);
            }
            else{
                uneImage.setAttribute("src", "../images/SansImage.jpg");
                uneImage.setAttribute("alt", "image-indisponible");
            }

            document.querySelector(".swiper-wrapper").appendChild(unActeur);
        }

        var mySwiper2 = new Swiper('.liste-acteurs', {
            direction: 'horizontal',
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGxldCBjb25uZXhpb24gPSBuZXcgTW92aWVEQigpO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWUuc2VhcmNoKFwiZmljaGUtZmlsbS5odG1sXCIpKTtcclxuICAgIGlmIChkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZS5zZWFyY2goXCJmaWNoZS1maWxtLmh0bWxcIikgPiAwKSB7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IChuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uKSkuc2VhcmNoUGFyYW1zO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKHBhcmFtcyk7XHJcblxyXG4gICAgICAgIGlmKHBhcmFtcy5nZXQoXCJpZFwiKSA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGNvbm5leGlvbi5yZXF1ZXRlRmlsbVJlY2VudCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29ubmV4aW9uLnJlcXVldGVJbmZvRmlsbShwYXJhbXMuZ2V0KFwiaWRcIikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25uZXhpb24ucmVxdWV0ZURlcm5pZXJGaWxtKCk7XHJcbiAgICAgICAgY29ubmV4aW9uLnJlcXVldGVGaWxtc1BvcHVsYWlyZXMoKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5cclxuY2xhc3MgTW92aWVEQiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ29uc3RydWN0ZXVyXCIpO1xyXG5cclxuICAgICAgICB0aGlzLkFQSUtleSA9IFwiMTk1YmU4M2FiMTM2N2I5ZmI3ZWVkNDkwOGVhMTdiNDZcIjtcclxuXHJcbiAgICAgICAgdGhpcy5sYW5nID0gXCJmci1DQVwiO1xyXG5cclxuICAgICAgICB0aGlzLmJhc2VVUkwgPSBcImh0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzNcIjtcclxuXHJcbiAgICAgICAgdGhpcy5pbWdQYXRoID0gXCJodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC9cIjtcclxuXHJcbiAgICAgICAgdGhpcy50b3RhbEZpbG1zID0gNjtcclxuXHJcbiAgICAgICAgLy90aGlzLmxhcmdldXJBZmZpY2hlID0gW1widzkwXCIsIFwidzE1NFwiLCBcIncxODVcIiwgXCJ3MzQyXCIsIFwidzUwMFwiLCBcInc3ODBcIl07XHJcbiAgICAgICAgLy90aGlzLmxhcmdldXJUZXRlQWZmaWNoZSA9IFtcInc0NVwiLCBcIncxODVcIl07XHJcbiAgICAgICAgLy90aGlzLmxhcmdldXJUb2lsZUZvbmQgPSBbXCJ3MzAwXCIsIFwidzc4MFwiLCBcIncxMjgwXCJdO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVldGVEZXJuaWVyRmlsbSgpIHtcclxuICAgICAgICAvL01ldHRyZSB1bmUgcGFnZSB3ZWIgw6Agam91ciBzYW5zIHBlcnR1cmJlciBsZXMgYWN0aW9ucyBkZSBsJ3V0aWxpc2F0ZXVyXHJcbiAgICAgICAgbGV0IHJlcXVldGVYaHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgcmVxdWV0ZVhoci5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVuZFwiLCB0aGlzLnJldG91clJlcXVldGVEZXJuaWVyRmlsbS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy9yZXF1ZXRlWGhyLm9wZW4oXCJHRVRcIiwgXCJodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL21vdmllL25vd19wbGF5aW5nP2FwaV9rZXk9MTk1YmU4M2FiMTM2N2I5ZmI3ZWVkNDkwOGVhMTdiNDYmbGFuZ3VhZ2U9ZnItQ0EmcGFnZT0xXCIpO1xyXG5cclxuICAgICAgICAvL2h0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvbW92aWUvdG9wX3JhdGVkP2FwaV9rZXk9MTk1YmU4M2FiMTM2N2I5ZmI3ZWVkNDkwOGVhMTdiNDYmbGFuZ3VhZ2U9ZnItQ0EmcGFnZT0xXHJcblxyXG4gICAgICAgIC8vSW5pdGlhbGlzZXIgbGEgcmVxdcOqdGUgcG91ciByw6ljdXDDqXJlciBsZXMgZmlsbXNcclxuICAgICAgICAvL3JlcXVldGVYaHIub3BlbihcIkdFVFwiLCB0aGlzLmJhc2VVUkwgKyBcIi9tb3ZpZS9ub3dfcGxheWluZz9hcGlfa2V5PVwiICsgdGhpcy5BUElLZXkgKyBcIiZsYW5ndWFnZT1cIiArIHRoaXMubGFuZyArIFwiJnBhZ2U9MVwiKTtcclxuICAgICAgICByZXF1ZXRlWGhyLm9wZW4oXCJHRVRcIiwgdGhpcy5iYXNlVVJMICsgXCIvbW92aWUvdG9wX3JhdGVkP2FwaV9rZXk9XCIgKyB0aGlzLkFQSUtleSArIFwiJmxhbmd1YWdlPVwiICsgdGhpcy5sYW5nICsgXCImcGFnZT0xXCIpO1xyXG5cclxuXHJcbiAgICAgICAgLy9FbnZveWVyIGxhIHJlcXXDqnRlXHJcbiAgICAgICAgcmVxdWV0ZVhoci5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0b3VyUmVxdWV0ZURlcm5pZXJGaWxtKGUpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiUmV0b3VyIGRlcm5pZXIgZmlsbVwiKTtcclxuXHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcclxuXHJcbiAgICAgICAgbGV0IGRhdGE7XHJcblxyXG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHRhcmdldC5yZXNwb25zZVRleHQpLnJlc3VsdHM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWZmaWNoZURlcm5pZXJGaWxtKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGFmZmljaGVEZXJuaWVyRmlsbShkYXRhKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvdGFsRmlsbXM7IGkrKykge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGFbaV0udGl0bGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHVuQXJ0aWNsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGVtcGxhdGU+YXJ0aWNsZS5maWxtXCIpLmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiaDNcIikuaW5uZXJIVE1MID0gZGF0YVtpXS50aXRsZTtcclxuICAgICAgICAgICAgdW5BcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJwLmRlc2NyaXB0aW9uXCIpLmlubmVySFRNTCA9IGRhdGFbaV0ub3ZlcnZpZXcgfHwgXCJEZXNjcmlwdGlvbiBub24gZGlzcG9uaWJsZVwiO1xyXG4gICAgICAgICAgICB1bkFydGljbGUucXVlcnlTZWxlY3RvcihcInAuY290ZVwiKS5pbm5lckhUTUwgPSBkYXRhW2ldLnZvdGVfYXZlcmFnZTtcclxuICAgICAgICAgICAgdW5BcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJwLmFubmVlXCIpLmlubmVySFRNTCA9IGRhdGFbaV0ucmVsZWFzZV9kYXRlO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNyYyA9IHRoaXMuaW1nUGF0aCArIFwidzE4NVwiICsgZGF0YVtpXS5wb3N0ZXJfcGF0aDtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc3JjKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1bmVJbWFnZSA9IHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpO1xyXG4gICAgICAgICAgICB1bmVJbWFnZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgc3JjKTtcclxuICAgICAgICAgICAgdW5lSW1hZ2Uuc2V0QXR0cmlidXRlKFwiYWx0XCIsIGRhdGFbaV0udGl0bGUpO1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5saXN0ZS1maWxtcy1ub3Rlc1wiKS5hcHBlbmRDaGlsZCh1bkFydGljbGUpO1xyXG5cclxuICAgICAgICAgICAgdW5BcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJhXCIpLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCJmaWNoZS1maWxtLmh0bWw/aWQ9XCIgKyBkYXRhW2ldLmlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBteVN3aXBlcjEgPSBuZXcgU3dpcGVyKCcuY2Fycm91c2VsJywge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcclxuICAgICAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2aWdhdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmV4dEVsOiAnLnN3aXBlci1idXR0b24tbmV4dCcsXHJcbiAgICAgICAgICAgICAgICBwcmV2RWw6ICcuc3dpcGVyLWJ1dHRvbi1wcmV2JyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGFnaW5hdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgZWw6ICcuc3dpcGVyLXBhZ2luYXRpb24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZXF1ZXRlRmlsbXNQb3B1bGFpcmVzKCkge1xyXG4gICAgICAgIGxldCByZXF1ZXRlWGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgIHJlcXVldGVYaHIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlbmRcIiwgdGhpcy5yZXRvdXJSZXF1ZXRlRmlsbXNQb3B1bGFpcmVzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHJlcXVldGVYaHIub3BlbihcIkdFVFwiLCB0aGlzLmJhc2VVUkwgKyBcIi9tb3ZpZS9wb3B1bGFyP2FwaV9rZXk9XCIgKyB0aGlzLkFQSUtleSArIFwiJmxhbmd1YWdlPVwiICsgdGhpcy5sYW5nICsgXCImcGFnZT0xXCIpO1xyXG4gICAgICAgIHJlcXVldGVYaHIuc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldG91clJlcXVldGVGaWxtc1BvcHVsYWlyZXMoZSkge1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcblxyXG4gICAgICAgIGxldCBkYXRhO1xyXG5cclxuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZSh0YXJnZXQucmVzcG9uc2VUZXh0KS5yZXN1bHRzO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICB0aGlzLmFmZmljaGVGaWxtc1BvcHVsYWlyZXMoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWZmaWNoZUZpbG1zUG9wdWxhaXJlcyhkYXRhKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHVuQXJ0aWNsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGVtcGxhdGU+LnBvcHVsYWlyZVwiKS5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiaDJcIikpO1xyXG4gICAgICAgICAgICB1bkFydGljbGUucXVlcnlTZWxlY3RvcihcImgzXCIpLmlubmVySFRNTCA9IGRhdGFbaV0udGl0bGU7XHJcbiAgICAgICAgICAgIHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwicC5jb3RlXCIpLmlubmVySFRNTCA9IGRhdGFbaV0udm90ZV9hdmVyYWdlO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNyYyA9IHRoaXMuaW1nUGF0aCArIFwidzE4NVwiICsgZGF0YVtpXS5wb3N0ZXJfcGF0aDtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc3JjKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1bmVJbWFnZSA9IHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpO1xyXG4gICAgICAgICAgICB1bmVJbWFnZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgc3JjKTtcclxuICAgICAgICAgICAgdW5lSW1hZ2Uuc2V0QXR0cmlidXRlKFwiYWx0XCIsIGRhdGFbaV0udGl0bGUpO1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zd2lwZXItd3JhcHBlclwiKS5hcHBlbmRDaGlsZCh1bkFydGljbGUpO1xyXG5cclxuICAgICAgICAgICAgdW5BcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJhXCIpLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCJmaWNoZS1maWxtLmh0bWw/aWQ9XCIgKyBkYXRhW2ldLmlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZXF1ZXRlSW5mb0ZpbG0obW92aWVJZCkge1xyXG4gICAgICAgIC8vTWV0dHJlIHVuZSBwYWdlIHdlYiDDoCBqb3VyIHNhbnMgcGVydHVyYmVyIGxlcyBhY3Rpb25zIGRlIGwndXRpbGlzYXRldXJcclxuICAgICAgICBsZXQgcmVxdWV0ZVhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKG1vdmllSWQpO1xyXG5cclxuICAgICAgICByZXF1ZXRlWGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZW5kXCIsIHRoaXMucmV0b3VyUmVxdWV0ZUluZm9GaWxtLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvLyBodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL21vdmllL3ttb3ZpZV9pZH0/YXBpX2tleT0xOTViZTgzYWIxMzY3YjlmYjdlZWQ0OTA4ZWExN2I0NiZsYW5ndWFnZT1mci1DQVxyXG5cclxuICAgICAgICAvL0luaXRpYWxpc2VyIGxhIHJlcXXDqnRlIHBvdXIgcsOpY3Vww6lyZXIgbGVzIGZpbG1zXHJcbiAgICAgICAgcmVxdWV0ZVhoci5vcGVuKFwiR0VUXCIsIHRoaXMuYmFzZVVSTCArIFwiL21vdmllL1wiICsgbW92aWVJZCArIFwiP2FwaV9rZXk9XCIgKyB0aGlzLkFQSUtleSArIFwiJmxhbmd1YWdlPVwiICsgdGhpcy5sYW5nKTtcclxuXHJcbiAgICAgICAgLy9FbnZveWVyIGxhIHJlcXXDqnRlXHJcbiAgICAgICAgcmVxdWV0ZVhoci5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0b3VyUmVxdWV0ZUluZm9GaWxtKGUpIHtcclxuICAgICAgICBsZXQgdGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0O1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRhcmdldC5yZXNwb25zZVRleHQpO1xyXG5cclxuICAgICAgICBsZXQgZGF0YTtcclxuXHJcbiAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UodGFyZ2V0LnJlc3BvbnNlVGV4dCk7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWZmaWNoZUluZm9GaWxtKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGFmZmljaGVJbmZvRmlsbShkYXRhKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhLmJhY2tkcm9wX3BhdGgpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIikuaW5uZXJIVE1MID0gZGF0YS50aXRsZTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwicC5kZXNjcmlwdGlvblwiKS5pbm5lckhUTUwgPSBkYXRhLm92ZXJ2aWV3IHx8IFwiRGVzY3JpcHRpb24gbm9uIGRpc3BvbmlibGVcIjtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwicC5hbm5lZVwiKS5pbm5lckhUTUwgPSBcIkFubsOpZSBkZSBwYXJ1dGlvbiA6IFwiICsgKGRhdGEucmVsZWFzZV9kYXRlIHx8IFwiTm9uIGRpc3BvbmlibGVcIik7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInAudm90ZVwiKS5pbm5lckhUTUwgPSBcIk5vdGUgbW95ZW5uZSA6IFwiICsgZGF0YS52b3RlX2F2ZXJhZ2UgfHwgXCJOb24gZGlzcG9uaWJsZVwiO1xyXG5cclxuICAgICAgICBpZihkYXRhLm9yaWdpbmFsX2xhbmd1YWdlID09PSBcImVuXCIpe1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwicC5sYW5nXCIpLmlubmVySFRNTCA9IFwiTGFuZ3VlIG9yaWdpbmFsZSA6IEFuZ2xhaXNcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihkYXRhLm9yaWdpbmFsX2xhbmd1YWdlID09PSBcImZyXCIpe1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwicC5sYW5nXCIpLmlubmVySFRNTCA9IFwiTGFuZ3VlIG9yaWdpbmFsZSA6IEZyYW7Dp2Fpc1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwicC5sYW5nXCIpLmlubmVySFRNTCA9IFwiTGFuZ3VlIG9yaWdpbmFsZSA6IFwiICsgKGRhdGEub3JpZ2luYWxfbGFuZ3VhZ2UgfHwgXCJOb24gZGlzcG9uaWJsZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGRhdGEucnVudGltZSA9PT0gMCl7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJwLmR1cmVlXCIpLmlubmVySFRNTCA9IFwiRHVyw6llIDogTm9uIGRpc3BvbmlibGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInAuZHVyZWVcIikuaW5uZXJIVE1MID0gXCJEdXLDqWUgOiBcIiArIGRhdGEucnVudGltZSArIFwiIG1pbnV0ZXNcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGRhdGEuYnVkZ2V0ID09PSAwKXtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInAuYnVkZ2V0XCIpLmlubmVySFRNTCA9IFwiQnVkZ2V0IDogTm9uIGRpc3BvbmlibGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInAuYnVkZ2V0XCIpLmlubmVySFRNTCA9IFwiQnVkZ2V0IDogXCIgKyBkYXRhLmJ1ZGdldCArIFwiJFwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoZGF0YS5yZXZlbnVlID09PSAwKXtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInAucmVjZXR0ZVwiKS5pbm5lckhUTUwgPSBcIlJldmVudXMgOiBOb24gZGlzcG9uaWJsZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwicC5yZWNldHRlXCIpLmlubmVySFRNTCA9IFwiUmV2ZW51cyA6IFwiICsgZGF0YS5yZXZlbnVlICsgXCIkXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc3JjID0gdGhpcy5pbWdQYXRoICsgXCJ3MTg1XCIgKyBkYXRhLmJhY2tkcm9wX3BhdGg7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzcmMpO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbWcuYWZmaWNoZVwiKS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgc3JjKTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaW1nLmFmZmljaGVcIikuc2V0QXR0cmlidXRlKFwiYWx0XCIsIGRhdGEudGl0bGUpO1xyXG5cclxuICAgICAgICB0aGlzLnJlcXVldGVBY3RldXIoZGF0YS5pZCk7XHJcblxyXG4gICAgICAgIC8qdW5lSW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIHNyYyk7XHJcbiAgICAgICAgdW5lSW1hZ2Uuc2V0QXR0cmlidXRlKFwiYWx0XCIsIGRhdGEudGl0bGUpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxpc3RlLWZpbG1zXCIpLmFwcGVuZENoaWxkKHVuQXJ0aWNsZSk7XHJcblxyXG4gICAgICAgIHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiYVwiKS5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiZmljaGUtZmlsbS5odG1sP2lkPVwiICsgZGF0YVtpXS5pZCk7Ki9cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJlcXVldGVGaWxtUmVjZW50KCkge1xyXG4gICAgICAgIC8vTWV0dHJlIHVuZSBwYWdlIHdlYiDDoCBqb3VyIHNhbnMgcGVydHVyYmVyIGxlcyBhY3Rpb25zIGRlIGwndXRpbGlzYXRldXJcclxuICAgICAgICBsZXQgcmVxdWV0ZVhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICByZXF1ZXRlWGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZW5kXCIsIHRoaXMucmV0b3VyUmVxdWV0ZUZpbG1SZWNlbnQuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIGh0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvbW92aWUvdXBjb21pbmc/YXBpX2tleT0xOTViZTgzYWIxMzY3YjlmYjdlZWQ0OTA4ZWExN2I0NiZsYW5ndWFnZT1mci1DQSZwYWdlPTFcclxuXHJcbiAgICAgICAgLy9Jbml0aWFsaXNlciBsYSByZXF1w6p0ZSBwb3VyIHLDqWN1cMOpcmVyIGxlcyBmaWxtc1xyXG4gICAgICAgIHJlcXVldGVYaHIub3BlbihcIkdFVFwiLCB0aGlzLmJhc2VVUkwgKyBcIi9tb3ZpZS91cGNvbWluZz9hcGlfa2V5PVwiICsgdGhpcy5BUElLZXkgKyBcIiZsYW5ndWFnZT1cIiArIHRoaXMubGFuZyArIFwiJnBhZ2U9MVwiKTtcclxuXHJcbiAgICAgICAgLy9FbnZveWVyIGxhIHJlcXXDqnRlXHJcbiAgICAgICAgcmVxdWV0ZVhoci5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0b3VyUmVxdWV0ZUZpbG1SZWNlbnQoZSkge1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2codGFyZ2V0LnJlc3BvbnNlVGV4dCk7XHJcblxyXG4gICAgICAgIGxldCBkYXRhO1xyXG5cclxuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZSh0YXJnZXQucmVzcG9uc2VUZXh0KS5yZXN1bHRzO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZmZpY2hlRmlsbVJlY2VudChkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBhZmZpY2hlRmlsbVJlY2VudChkYXRhKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspe1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGFbaV0udGl0bGUpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIikuaW5uZXJIVE1MID0gZGF0YVswXS50aXRsZTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInAuZGVzY3JpcHRpb25cIikuaW5uZXJIVE1MID0gZGF0YVswXS5vdmVydmlldyB8fCBcIkRlc2NyaXB0aW9uIG5vbiBkaXNwb25pYmxlXCI7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3JjID0gdGhpcy5pbWdQYXRoICsgXCJ3MTg1XCIgKyBkYXRhWzBdLmJhY2tkcm9wX3BhdGg7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbWcuYWZmaWNoZVwiKS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgc3JjKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImltZy5hZmZpY2hlXCIpLnNldEF0dHJpYnV0ZShcImFsdFwiLCBkYXRhWzBdLnRpdGxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVxdWV0ZUFjdGV1cihkYXRhLmlkKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlcXVldGVBY3RldXIobW92aWVJZCkge1xyXG4gICAgICAgIGxldCByZXF1ZXRlWGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgIHJlcXVldGVYaHIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlbmRcIiwgdGhpcy5yZXRvdXJSZXF1ZXRlQWN0ZXVyLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvLyBodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL21vdmllL3ttb3ZpZV9pZH0vY3JlZGl0cz9hcGlfa2V5PTE5NWJlODNhYjEzNjdiOWZiN2VlZDQ5MDhlYTE3YjQ2Jmxhbmd1YWdlPWZyLUNBXHJcbiAgICAgICAgcmVxdWV0ZVhoci5vcGVuKFwiR0VUXCIsIHRoaXMuYmFzZVVSTCArIFwiL21vdmllL1wiICsgbW92aWVJZCArIFwiL2NyZWRpdHM/YXBpX2tleT1cIiArIHRoaXMuQVBJS2V5ICsgXCImbGFuZ3VhZ2U9XCIgKyB0aGlzLmxhbmcpO1xyXG5cclxuICAgICAgICByZXF1ZXRlWGhyLnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXRvdXJSZXF1ZXRlQWN0ZXVyKGUpIHtcclxuXHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcclxuXHJcbiAgICAgICAgbGV0IGRhdGE7XHJcblxyXG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHRhcmdldC5yZXNwb25zZVRleHQpLmNhc3Q7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWZmaWNoZUFjdGV1cihkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBhZmZpY2hlQWN0ZXVyKGRhdGEpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgdW5BY3RldXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRlbXBsYXRlPi5hY3RldXJcIikuY2xvbmVOb2RlKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgdW5BY3RldXIucXVlcnlTZWxlY3RvcihcImgzXCIpLmlubmVySFRNTCA9IGRhdGFbaV0ub3JpZ2luYWxfbmFtZTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1bmVJbWFnZSA9IHVuQWN0ZXVyLnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3JjID0gdGhpcy5pbWdQYXRoICsgXCJ3MTg1XCIgKyBkYXRhW2ldLnByb2ZpbGVfcGF0aDtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNyYyk7XHJcbiAgICAgICAgICAgIGlmKGRhdGFbaV0ucHJvZmlsZV9wYXRoICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgdW5lSW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIHNyYyk7XHJcbiAgICAgICAgICAgICAgICB1bmVJbWFnZS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgZGF0YVtpXS5vcmlnaW5hbF9uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdW5lSW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiLi4vaW1hZ2VzL1NhbnNJbWFnZS5qcGdcIik7XHJcbiAgICAgICAgICAgICAgICB1bmVJbWFnZS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgXCJpbWFnZS1pbmRpc3BvbmlibGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3dpcGVyLXdyYXBwZXJcIikuYXBwZW5kQ2hpbGQodW5BY3RldXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG15U3dpcGVyMiA9IG5ldyBTd2lwZXIoJy5saXN0ZS1hY3RldXJzJywge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcclxuICAgICAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgbmF2aWdhdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmV4dEVsOiAnLnN3aXBlci1idXR0b24tbmV4dCcsXHJcbiAgICAgICAgICAgICAgICBwcmV2RWw6ICcuc3dpcGVyLWJ1dHRvbi1wcmV2JyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSJdLCJmaWxlIjoic2NyaXB0LmpzIn0=
