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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGxldCBjb25uZXhpb24gPSBuZXcgTW92aWVEQigpO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWUuc2VhcmNoKFwiZmljaGUtZmlsbS5odG1sXCIpKTtcclxuICAgIGlmIChkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZS5zZWFyY2goXCJmaWNoZS1maWxtLmh0bWxcIikgPiAwKSB7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IChuZXcgVVJMKGRvY3VtZW50LmxvY2F0aW9uKSkuc2VhcmNoUGFyYW1zO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKHBhcmFtcyk7XHJcblxyXG4gICAgICAgIGNvbm5leGlvbi5yZXF1ZXRlSW5mb0ZpbG0ocGFyYW1zLmdldChcImlkXCIpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29ubmV4aW9uLnJlcXVldGVEZXJuaWVyRmlsbSgpO1xyXG4gICAgICAgIGNvbm5leGlvbi5yZXF1ZXRlRmlsbXNQb3B1bGFpcmVzKCk7XHJcblxyXG4gICAgICAgIHZhciBteVN3aXBlciA9IG5ldyBTd2lwZXIoJy5jYXJyb3VzZWwnLCB7XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxyXG4gICAgICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuZXh0RWw6ICcuc3dpcGVyLWJ1dHRvbi1uZXh0JyxcclxuICAgICAgICAgICAgICAgIHByZXZFbDogJy5zd2lwZXItYnV0dG9uLXByZXYnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwYWdpbmF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBlbDogJy5zd2lwZXItcGFnaW5hdGlvbicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcblxyXG5cclxuY2xhc3MgTW92aWVEQiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ29uc3RydWN0ZXVyXCIpO1xyXG5cclxuICAgICAgICB0aGlzLkFQSUtleSA9IFwiMTk1YmU4M2FiMTM2N2I5ZmI3ZWVkNDkwOGVhMTdiNDZcIjtcclxuXHJcbiAgICAgICAgdGhpcy5sYW5nID0gXCJmci1DQVwiO1xyXG5cclxuICAgICAgICB0aGlzLmJhc2VVUkwgPSBcImh0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzNcIjtcclxuXHJcbiAgICAgICAgdGhpcy5pbWdQYXRoID0gXCJodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC9cIjtcclxuXHJcbiAgICAgICAgdGhpcy50b3RhbEZpbG1zID0gNjtcclxuXHJcbiAgICAgICAgLy90aGlzLmxhcmdldXJBZmZpY2hlID0gW1widzkwXCIsIFwidzE1NFwiLCBcIncxODVcIiwgXCJ3MzQyXCIsIFwidzUwMFwiLCBcInc3ODBcIl07XHJcbiAgICAgICAgLy90aGlzLmxhcmdldXJUZXRlQWZmaWNoZSA9IFtcInc0NVwiLCBcIncxODVcIl07XHJcbiAgICAgICAgLy90aGlzLmxhcmdldXJUb2lsZUZvbmQgPSBbXCJ3MzAwXCIsIFwidzc4MFwiLCBcIncxMjgwXCJdO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVldGVEZXJuaWVyRmlsbSgpIHtcclxuICAgICAgICAvL01ldHRyZSB1bmUgcGFnZSB3ZWIgw6Agam91ciBzYW5zIHBlcnR1cmJlciBsZXMgYWN0aW9ucyBkZSBsJ3V0aWxpc2F0ZXVyXHJcbiAgICAgICAgbGV0IHJlcXVldGVYaHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgcmVxdWV0ZVhoci5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVuZFwiLCB0aGlzLnJldG91clJlcXVldGVEZXJuaWVyRmlsbS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy9yZXF1ZXRlWGhyLm9wZW4oXCJHRVRcIiwgXCJodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL21vdmllL25vd19wbGF5aW5nP2FwaV9rZXk9MTk1YmU4M2FiMTM2N2I5ZmI3ZWVkNDkwOGVhMTdiNDYmbGFuZ3VhZ2U9ZnItQ0EmcGFnZT0xXCIpO1xyXG5cclxuICAgICAgICAvL2h0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvbW92aWUvdG9wX3JhdGVkP2FwaV9rZXk9MTk1YmU4M2FiMTM2N2I5ZmI3ZWVkNDkwOGVhMTdiNDYmbGFuZ3VhZ2U9ZnItQ0EmcGFnZT0xXHJcblxyXG4gICAgICAgIC8vSW5pdGlhbGlzZXIgbGEgcmVxdcOqdGUgcG91ciByw6ljdXDDqXJlciBsZXMgZmlsbXNcclxuICAgICAgICAvL3JlcXVldGVYaHIub3BlbihcIkdFVFwiLCB0aGlzLmJhc2VVUkwgKyBcIi9tb3ZpZS9ub3dfcGxheWluZz9hcGlfa2V5PVwiICsgdGhpcy5BUElLZXkgKyBcIiZsYW5ndWFnZT1cIiArIHRoaXMubGFuZyArIFwiJnBhZ2U9MVwiKTtcclxuICAgICAgICByZXF1ZXRlWGhyLm9wZW4oXCJHRVRcIiwgdGhpcy5iYXNlVVJMICsgXCIvbW92aWUvdG9wX3JhdGVkP2FwaV9rZXk9XCIgKyB0aGlzLkFQSUtleSArIFwiJmxhbmd1YWdlPVwiICsgdGhpcy5sYW5nICsgXCImcGFnZT0xXCIpO1xyXG5cclxuXHJcbiAgICAgICAgLy9FbnZveWVyIGxhIHJlcXXDqnRlXHJcbiAgICAgICAgcmVxdWV0ZVhoci5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0b3VyUmVxdWV0ZURlcm5pZXJGaWxtKGUpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiUmV0b3VyIGRlcm5pZXIgZmlsbVwiKTtcclxuXHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcclxuXHJcbiAgICAgICAgbGV0IGRhdGE7XHJcblxyXG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHRhcmdldC5yZXNwb25zZVRleHQpLnJlc3VsdHM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWZmaWNoZURlcm5pZXJGaWxtKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGFmZmljaGVEZXJuaWVyRmlsbShkYXRhKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvdGFsRmlsbXM7IGkrKykge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGFbaV0udGl0bGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHVuQXJ0aWNsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGVtcGxhdGU+YXJ0aWNsZS5maWxtXCIpLmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiaDJcIikuaW5uZXJIVE1MID0gZGF0YVtpXS50aXRsZTtcclxuICAgICAgICAgICAgdW5BcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJwLmRlc2NyaXB0aW9uXCIpLmlubmVySFRNTCA9IGRhdGFbaV0ub3ZlcnZpZXcgfHwgXCJEZXNjcmlwdGlvbiBub24gZGlzcG9uaWJsZVwiO1xyXG4gICAgICAgICAgICB1bkFydGljbGUucXVlcnlTZWxlY3RvcihcInAuY290ZVwiKS5pbm5lckhUTUwgPSBkYXRhW2ldLnZvdGVfYXZlcmFnZTtcclxuICAgICAgICAgICAgdW5BcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJwLmFubmVlXCIpLmlubmVySFRNTCA9IGRhdGFbaV0ucmVsZWFzZV9kYXRlO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNyYyA9IHRoaXMuaW1nUGF0aCArIFwidzE4NVwiICsgZGF0YVtpXS5wb3N0ZXJfcGF0aDtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coc3JjKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1bmVJbWFnZSA9IHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpO1xyXG4gICAgICAgICAgICB1bmVJbWFnZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgc3JjKTtcclxuICAgICAgICAgICAgdW5lSW1hZ2Uuc2V0QXR0cmlidXRlKFwiYWx0XCIsIGRhdGFbaV0udGl0bGUpO1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5saXN0ZS1maWxtcy1ub3Rlc1wiKS5hcHBlbmRDaGlsZCh1bkFydGljbGUpO1xyXG5cclxuICAgICAgICAgICAgdW5BcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJhXCIpLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCJmaWNoZS1maWxtLmh0bWw/aWQ9XCIgKyBkYXRhW2ldLmlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJlcXVldGVGaWxtc1BvcHVsYWlyZXMoKSB7XHJcbiAgICAgICAgbGV0IHJlcXVldGVYaHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgcmVxdWV0ZVhoci5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVuZFwiLCB0aGlzLnJldG91clJlcXVldGVGaWxtc1BvcHVsYWlyZXMuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgcmVxdWV0ZVhoci5vcGVuKFwiR0VUXCIsIHRoaXMuYmFzZVVSTCArIFwiL21vdmllL3BvcHVsYXI/YXBpX2tleT1cIiArIHRoaXMuQVBJS2V5ICsgXCImbGFuZ3VhZ2U9XCIgKyB0aGlzLmxhbmcgKyBcIiZwYWdlPTFcIik7XHJcbiAgICAgICAgcmVxdWV0ZVhoci5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0b3VyUmVxdWV0ZUZpbG1zUG9wdWxhaXJlcyhlKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcclxuXHJcbiAgICAgICAgbGV0IGRhdGE7XHJcblxyXG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHRhcmdldC5yZXNwb25zZVRleHQpLnJlc3VsdHM7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWZmaWNoZUZpbG1zUG9wdWxhaXJlcyhkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBhZmZpY2hlRmlsbXNQb3B1bGFpcmVzKGRhdGEpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgdW5BcnRpY2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50ZW1wbGF0ZT4ucG9wdWxhaXJlXCIpLmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2codW5BcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKSk7XHJcbiAgICAgICAgICAgIHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiaDJcIikuaW5uZXJIVE1MID0gZGF0YVtpXS50aXRsZTtcclxuICAgICAgICAgICAgdW5BcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJwLmNvdGVcIikuaW5uZXJIVE1MID0gZGF0YVtpXS52b3RlX2F2ZXJhZ2U7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3JjID0gdGhpcy5pbWdQYXRoICsgXCJ3MTg1XCIgKyBkYXRhW2ldLnBvc3Rlcl9wYXRoO1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzcmMpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHVuZUltYWdlID0gdW5BcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIik7XHJcbiAgICAgICAgICAgIHVuZUltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBzcmMpO1xyXG4gICAgICAgICAgICB1bmVJbWFnZS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgZGF0YVtpXS50aXRsZSk7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN3aXBlci13cmFwcGVyXCIpLmFwcGVuZENoaWxkKHVuQXJ0aWNsZSk7XHJcblxyXG4gICAgICAgICAgICB1bkFydGljbGUucXVlcnlTZWxlY3RvcihcImFcIikuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcImZpY2hlLWZpbG0uaHRtbD9pZD1cIiArIGRhdGFbaV0uaWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVxdWV0ZUluZm9GaWxtKG1vdmllSWQpIHtcclxuICAgICAgICAvL01ldHRyZSB1bmUgcGFnZSB3ZWIgw6Agam91ciBzYW5zIHBlcnR1cmJlciBsZXMgYWN0aW9ucyBkZSBsJ3V0aWxpc2F0ZXVyXHJcbiAgICAgICAgbGV0IHJlcXVldGVYaHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgcmVxdWV0ZVhoci5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVuZFwiLCB0aGlzLnJldG91clJlcXVldGVJbmZvRmlsbS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9tb3ZpZS97bW92aWVfaWR9P2FwaV9rZXk9MTk1YmU4M2FiMTM2N2I5ZmI3ZWVkNDkwOGVhMTdiNDYmbGFuZ3VhZ2U9ZnItQ0FcclxuXHJcbiAgICAgICAgLy9Jbml0aWFsaXNlciBsYSByZXF1w6p0ZSBwb3VyIHLDqWN1cMOpcmVyIGxlcyBmaWxtc1xyXG4gICAgICAgIHJlcXVldGVYaHIub3BlbihcIkdFVFwiLCB0aGlzLmJhc2VVUkwgKyBcIi9tb3ZpZS9cIiArIG1vdmllSWQgKyBcIj9hcGlfa2V5PVwiICsgdGhpcy5BUElLZXkgKyBcIiZsYW5ndWFnZT1cIiArIHRoaXMubGFuZyk7XHJcblxyXG4gICAgICAgIC8vRW52b3llciBsYSByZXF1w6p0ZVxyXG4gICAgICAgIHJlcXVldGVYaHIuc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldG91clJlcXVldGVJbmZvRmlsbShlKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0YXJnZXQucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGE7XHJcblxyXG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHRhcmdldC5yZXNwb25zZVRleHQpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZmZpY2hlSW5mb0ZpbG0oZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWZmaWNoZUluZm9GaWxtKGRhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhLnRpdGxlKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImgxXCIpLmlubmVySFRNTCA9IGRhdGEudGl0bGU7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInAuZGVzY3JpcHRpb25cIikuaW5uZXJIVE1MID0gZGF0YS5vdmVydmlldyB8fCBcIkRlc2NyaXB0aW9uIG5vbiBkaXNwb25pYmxlXCI7XHJcblxyXG4gICAgICAgIGxldCBzcmMgPSB0aGlzLmltZ1BhdGggKyBcIncxODVcIiArIGRhdGEuYmFja2Ryb3BfcGF0aDtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaW1nLmFmZmljaGVcIikuc2V0QXR0cmlidXRlKFwic3JjXCIsIHNyYyk7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImltZy5hZmZpY2hlXCIpLnNldEF0dHJpYnV0ZShcImFsdFwiLCBkYXRhLnRpdGxlKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coc3JjKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXF1ZXRlQWN0ZXVyKGRhdGEuaWQpO1xyXG5cclxuICAgICAgICAvKnVuZUltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBzcmMpO1xyXG4gICAgICAgIHVuZUltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBkYXRhLnRpdGxlKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5saXN0ZS1maWxtc1wiKS5hcHBlbmRDaGlsZCh1bkFydGljbGUpO1xyXG5cclxuICAgICAgICB1bkFydGljbGUucXVlcnlTZWxlY3RvcihcImFcIikuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcImZpY2hlLWZpbG0uaHRtbD9pZD1cIiArIGRhdGFbaV0uaWQpOyovXHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZXF1ZXRlQWN0ZXVyKG1vdmllSWQpIHtcclxuICAgICAgICBsZXQgcmVxdWV0ZVhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICByZXF1ZXRlWGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZW5kXCIsIHRoaXMucmV0b3VyUmVxdWV0ZUFjdGV1ci5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9tb3ZpZS97bW92aWVfaWR9L2NyZWRpdHM/YXBpX2tleT0xOTViZTgzYWIxMzY3YjlmYjdlZWQ0OTA4ZWExN2I0NiZsYW5ndWFnZT1mci1DQVxyXG4gICAgICAgIHJlcXVldGVYaHIub3BlbihcIkdFVFwiLCB0aGlzLmJhc2VVUkwgKyBcIi9tb3ZpZS9cIiArIG1vdmllSWQgKyBcIi9jcmVkaXRzP2FwaV9rZXk9XCIgKyB0aGlzLkFQSUtleSArIFwiJmxhbmd1YWdlPVwiICsgdGhpcy5sYW5nKTtcclxuXHJcbiAgICAgICAgcmVxdWV0ZVhoci5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0b3VyUmVxdWV0ZUFjdGV1cihlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXRvdXIgYWN0ZXVyc1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBhZmZpY2hlQWN0ZXVyKGRhdGEpIHtcclxuICAgICAgICAvL2xldCB1bkFjdGV1ciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGVtcGxhdGU+YXJ0aWNsZS5hY3RldXJcIikuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgfVxyXG59Il0sImZpbGUiOiJzY3JpcHQuanMifQ==
