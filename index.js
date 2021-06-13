const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const forwBtn = document.getElementById("forward");
const singerN = document.querySelector("#singer");
const songN = document.querySelector("#song");
const music = document.querySelector("audio");
const img = document.querySelector("img");
const pauseBtn = document.querySelector(".fa-pause");
const sTime = document.getElementById("stime");
const eTime = document.getElementById("etime");
const progressBar = document.querySelector(".innerbar");
const progressBarDiv = document.querySelector(".outerbar");

let isPlaying = false; //initially false not playing

let playMusic = () => {
  music.play();
  playBtn.classList.replace("fa-play", "fa-pause");
  img.classList.add("anim_rotate");
  isPlaying = true;
};

let pauseMusic = () => {
  music.pause();
  playBtn.classList.replace("fa-pause", "fa-play");
  img.classList.remove("anim_rotate");
  isPlaying = false;
};

//play pause songs
playBtn.addEventListener("click", () => {
  isPlaying ? pauseMusic() : playMusic(); //ternary operator
});

//change songs

let songs = [
  {
    name: "song1",
    singer: "loyalist",
    song: "lotus lane",
  },
  {
    name: "song2",
    singer: "aurouro",
    song: "saphiones",
  },
  { name: "song3", singer: "david guetta", song: "hit me back" },
];

//load song function which loads the title,img,audio src in the dom
let loadsongs = (song) => {
  songN.innerHTML = `${song.song}`;
  singerN.innerHTML = `${song.singer}`;
  music.src = `music/${song.name}.mp3`;
  img.src = `img/${song.name}.jpg`;
};

let songIndex = 0;

// forward music function
let forwardMusic = () => {
  songIndex++;
  songIndex = songIndex % songs.length;
  loadsongs(songs[songIndex]);
  playMusic(); //play the new music if changed while playing the previuos music//after laoding new song play that loaded song
};

// previous music music function
let previousMusic = () => {
  songIndex--;
  songIndex = (songIndex + songs.length) % songs.length;
  loadsongs(songs[songIndex]);
  playMusic();
};

forwBtn.addEventListener("click", () => {
  forwardMusic();
});

prevBtn.addEventListener("click", () => {
  previousMusic();
});

//VERSION 2(progressbar feature)

//this timeupdate event is called every minisecond the music keeps playing
music.addEventListener("timeupdate", (event) => {
  const { currentTime, duration } = event.target; //type of number

  //calculating progressbar width
  let progress_time = (currentTime / duration) * 100; //percentage of elapsed time
  progressBar.style.width = `${progress_time}%`; //width in percentage

  //converting duration and current time to min:sec and updating stime etime in DOM
  let min_duration = Math.floor(duration / 60);
  let sec_duration = Math.floor(duration % 60);
  let total_duration = `${min_duration}:${sec_duration}`;

  let min_currentTime = Math.floor(currentTime / 60);
  let sec_currentTime = Math.floor(currentTime % 60);
  if (sec_currentTime < 10) {
    var sec_currentTime_updated = "0" + sec_currentTime; //string+number=string
  } else {
    sec_currentTime_updated = sec_currentTime;
  }

  let total_currentTime = `${min_currentTime}:${sec_currentTime_updated}`;

  sTime.innerHTML = total_currentTime;
  if (duration) {
    //not show duration when its laoding next music NaN error
    eTime.innerHTML = total_duration;
  }
});

//onclick event of progressbar outerdiv to change time
progressBarDiv.addEventListener("click", (event) => {
  let current_progress_width = event.offsetX; //where the click was made
  let total_progress_width = event.target.clientWidth; //total width of outer progressbar div,event.target is outerbar
  let total_progress_time = music.duration; //total music duration
  // console.log(total_progress_time);
  // console.log(total_progress_width);
  // console.log(current_progress_width);
  console.log(event.target);

  let percentage = current_progress_width / total_progress_width; //ratio of widths
  let current_progress_time = percentage * total_progress_time; //ratio of times

  //change thre currentTime of music running to the time where bar was clicked
  //music will be auto played from thaat point
  music.currentTime = current_progress_time;
});

//play the next song after ending of current song automatically
music.addEventListener("ended", forwardMusic);

//keyboard events
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "Space":
      if (!isPlaying) {
        playMusic();
      } else {
        pauseMusic();
      }
      break;

    case "ArrowRight":
      forwardMusic(); //play next song
      break;

    case "ArrowLeft":
      previousMusic(); //play previous song
      break;
  }
});
