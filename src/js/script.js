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

    document.querySelector(".material-icons").addEventListener("click", fScrollToTop);

    function fScrollToTop(e){
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }/**/
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

        console.log(data);

        this.afficheDernierFilm(data);
    }

    afficheDernierFilm(data) {
        for (let i = 0; i < this.totalFilms; i++) {
            //console.log(data[i].title);

            let unArticle = document.querySelector(".template>.film").cloneNode(true);

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
        for (let i = 0; i < 1; i++){
            //console.log(data[0]);
            document.querySelector("h1").innerHTML = data[0].title;
            document.querySelector("p.description").innerHTML = data[0].overview || "Description non disponible";
            document.querySelector("p.annee").innerHTML = "Année de parution : " + (data[0].release_date || "Non disponible");
            document.querySelector("p.vote").innerHTML = "Note moyenne : " + data[0].vote_average || "Non disponible";

            if(data[0].original_language === "en"){
                document.querySelector("p.lang").innerHTML = "Langue originale : Anglais";
            } else if(data[0].original_language === "fr"){
                document.querySelector("p.lang").innerHTML = "Langue originale : Français";
            } else{
                document.querySelector("p.lang").innerHTML = "Langue originale : " + (data[0].original_language || "Non disponible");
            }

            if(data[0].runtime === 0 || data[0].runtime === undefined){
                document.querySelector("p.duree").innerHTML = "Durée : Non disponible";
            } else{
                document.querySelector("p.duree").innerHTML = "Durée : " + data[0].runtime + " minutes";
            }

            if(data[0].budget === 0 || data[0].budget === undefined){
                document.querySelector("p.budget").innerHTML = "Budget : Non disponible";
            } else{
                document.querySelector("p.budget").innerHTML = "Budget : " + data[0].budget + "$";
            }

            if(data[0].revenue === 0 || data[0].revenue === undefined){
                document.querySelector("p.recette").innerHTML = "Revenus : Non disponible";
            } else{
                document.querySelector("p.recette").innerHTML = "Revenus : " + data[0].revenue + "$";
            }

            document.querySelector("p.description").innerHTML = data[0].overview || "Description non disponible";

            let src = this.imgPath + "w185" + data[0].backdrop_path;
            document.querySelector("img.affiche").setAttribute("src", src);
            document.querySelector("img.affiche").setAttribute("alt", data[0].title);

            this.requeteActeur(data[0].id);
        }
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
        let data = JSON.parse(target.responseText).cast;
        console.log(data);
        if(data === undefined){

        }else{

        }
        this.afficheActeur(data);
    }

    afficheActeur(data) {
        for (let i = 0; i < data.length; i++){
            let unActeur = document.querySelector(".template>.acteur").cloneNode(true);
            //console.log(unActeur);
            unActeur.querySelector("h3").innerHTML = data[i].original_name;

            let uneImage = unActeur.querySelector("img");
            let src = this.imgPath + "w185" + data[i].profile_path;

            if(data[i].profile_path != null){
                uneImage.setAttribute("src", src);
                uneImage.setAttribute("alt", data[i].original_name);
            } else{
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