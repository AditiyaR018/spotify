let currentsong = new Audio();// hamne yha current song bnaya ab eisiko update krte rhenga(Global Variable)
let songs;
function formatTime(seconds) {
    if(isNaN(seconds) || seconds <0){
        return "00:00";
    }
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    // Ensuring two-digit format
    minutes = String(minutes).padStart(2, '0');//(padstart)eg-> if minutes=3 then it weill make it 03
    secs = String(secs).padStart(2, '0');
    return `${minutes}:${secs}`;
}
async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/spotify-main/songs/");
    const response = await a.text();// html ko string mein convert krega(as directly nhi deta)
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;//string ko html mein bdlkr now we will access the info from it
    let as = div.getElementsByTagName("a");// we would get an array of a tags
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/spotify-main/songs/")[1]);//now a tag ke andr href(link) ko access krke we are pushing it to songs array...
            // .split("")->jo bhi element eiske andr hoga voh us element ke pehla aur baad 2 array bnayaga jika ham baad waala part yaani [1]
            /// access kr rhe hain aur usko push krwa rhe hain
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track);
    currentsong.src = "/spotify-main/songs/" + track;
    if (!pause) {
        currentsong.play();
        play.src = "svg_folder/pause.svg";//it will change the icon to puase as song will start to play
    }
    currentsong.play();
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
async function main() {
    //get the list of all songs(Links honge eisme saare)
    songs = await getSongs();
    // playMusic(songs[0],true);
    let songUL = document.querySelector(".songList ul");
    // Show all the songs in the playlist
    for (let i = 0; i < songs.length; i++) {
        let songLI = document.createElement("li");
        songLI.innerHTML = `
                            <img class="invert" src="svg_Folder/music.svg" alt="">
                            <div class="info">
                                <div>${songs[i].replaceAll("_", "_")}</div>
                                <div>Aditiya</div>
                            </div>
                            <img class="invert" src="svg_Folder/play.svg" alt="play">
                            `;
        songUL.appendChild(songLI);
    }
    // attach an eventlistener to each song 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {// ye hame li element siddha de rha hain
        e.addEventListener("click", (element) => {
            playMusic(e.querySelector(".info").querySelector("div").innerHTML);
            console.log(e.querySelector(".info").querySelector("div").innerHTML);
        })

    })
    // Add an event listener to previous, play and pause
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "svg_folder/pause.svg";
        }
        else {
            currentsong.pause();
            play.src = "svg_folder/play.svg"
        }
    })
    //Listen for time update event
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    //Add an event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        //.offsetX ek mouse event property hai jo batati hai ki mouse click
        // ya movement element ke andar kaha hua hai (X-axis pe)
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        //.getBoundingClientRect() ek JavaScript method hai jo kisi element
        //ka position aur size batata hai viewport (screen) ke andar.
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })
    //Add an eventListener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0 + "%";
    })
    //Add an eventListener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = -110 + "%";
    })
    //Add an eventListener to previous and next
    previous.addEventListener("click",()=>{
        console.log(songs);
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if( (index-1)>=0 ){
            playMusic(songs[index-1]);
        }
    })
    //Add an eventListener to previous and next
    next.addEventListener("click",()=>{
        console.log(songs);
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if( (index+1) < songs.length ){//length???
            playMusic(songs[index+1]);
        }
        //split se hamne usee array mein baatkr aur slice ka use krke us array ka last part leliya
        //as .slice() hame ek naya array bnake dega, eiska size 1 hoga so index[0] tbhi use kiya hain
    })
    //Add an event to volume
    document.querySelector(".range input").addEventListener("change",(e)=>{
        console.log("Current value is : ",e.target.value);
        currentsong.volume = parseInt(e.target.value)/100;
    })
}
main();
