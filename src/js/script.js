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

            unArticle.querySelector("h2").innerHTML = data[i].title;
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
            unArticle.querySelector("h2").innerHTML = data[i].title;
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