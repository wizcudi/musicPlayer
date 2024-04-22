// represents a reference to an HTML element
const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");


// An array of objects that contains all the songs I have and their information
const allSongs = [
  {
    id: 0,
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/scratching-the-surface.mp3",
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stay-down.mp3",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/still-learning.mp3",
  },
  {
    id: 3,
    title: "Cruising for a Musing",
    artist: "Quincy Larson",
    duration: "3:34",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cruising-for-a-musing.mp3",
  },
  {
    id: 4,
    title: "Never Not Favored",
    artist: "Quincy Larson",
    duration: "3:35",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/never-not-favored.mp3",
  },
  {
    id: 5,
    title: "From the Ground Up",
    artist: "Quincy Larson",
    duration: "3:12",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/from-the-ground-up.mp3",
  },
  {
    id: 6,
    title: "Walking on Air",
    artist: "Quincy Larson",
    duration: "3:25",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/walking-on-air.mp3",
  },
  {
    id: 7,
    title: "Can't Stop Me. Can't Even Slow Me Down.",
    artist: "Quincy Larson",
    duration: "3:52",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stop-me-cant-even-slow-me-down.mp3",
  },
  {
    id: 8,
    title: "The Surest Way Out is Through",
    artist: "Quincy Larson",
    duration: "3:10",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/the-surest-way-out-is-through.mp3",
  },
  {
    id: 9,
    title: "Chasing That Feeling",
    artist: "Quincy Larson",
    duration: "2:43",
    src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/chasing-that-feeling.mp3",
  },
];

// new is a keyword used to create a new instance of an object
// the Audio() object represents an audio element in the HTML docuemnt
// Used to play sounds or music on a web page
const audio = new Audio();

// an object used to track the songs a user is playing 
let userData = {
  // the spread '...' operator is used to create a new copy of allSongs array
  // Giving userData its own independent copy of the songs
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

// responsible for playing a specific song from the playlist
// in the paramater the id is the unique identifier of the song to be played
const playSong = (id) => {

  // ? symbol is part of the optional chaining operator
  // if the value before the ? is NOT null or undefined, it proceeds 
  // if the is the expresion short circuits and evaluates to undefined without attempting to access or call
  // used if you are not sure if an object or its properties exist
  // this line attempts to find the song with the provided id
  const song = userData?.songs.find((song) => song.id === id);

  // sets src of the song being played to audio element
  audio.src = song.src;

  // sets title of the song being played to audio element
  audio.title = song.title;

  // checks if there is a currently No song playing, optional chaining is used to avoid error
  // or if the currently playing song's id is different from the id of song about to be played
  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    // starts playback from beginning
    audio.currentTime = 0;
  } else {
    // resumes playback of current song to where it was paused
    audio.currentTime = userData?.songCurrentTime;
  }

  // saves song to the users current song being played
  userData.currentSong = song;

  // provides access to the list of CSS classes of element
  // add() is a method that adds the specified class
  // details for class found in styles.css
  playButton.classList.add("playing");

  // calls the respected functions defined below
  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();

  // calls built in method in JS 
  // starts playing audio from its current position
  audio.play();
};

const pauseSong = () => {
  // currentTime is a property of the HTMLMediaElement interface, which audio represents.
  // userData.songCurrentTime ensures when user pauses, the playback position is saved in the userData object.
  userData.songCurrentTime = audio.currentTime;
  
  // removes the "playing" classList from playbutton html
  playButton.classList.remove("playing");

  //pauses the audio
  audio.pause();
};

const playNextSong = () => {
  // Check if no current song is playing
  if (userData?.currentSong === null) {
    // If no current song, play first song in playlist
    playSong(userData?.songs[0].id);
  } else {
    // if there is a current song
    // Get index of current song in playlist
    const currentSongIndex = getCurrentSongIndex();
    // get next song in playlist
    const nextSong = userData?.songs[currentSongIndex + 1];

    //play the next song in playlist
    playSong(nextSong.id);
  }
};

const playPreviousSong = () =>{
    // if not current song is playing
   if (userData?.currentSong === null) return; // return exist function preventing rest of code from executing
   else {
    // if there is a current song
    // Get index of current song in playlist
    const currentSongIndex = getCurrentSongIndex();
    // get previous sonf in playlist
    const previousSong = userData?.songs[currentSongIndex - 1];

    // play the previous song in playlist
    playSong(previousSong.id);
   }
};

const shuffle = () => {
  // sorts songs in userData array using sort, math, and random methods 
  userData?.songs.sort(() => Math.random() - 0.5);
  // assign current song to no song
  userData.currentSong = null;
  // sets songs current time to zero
  userData.songCurrentTime = 0;

  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
};

const deleteSong = (id) => {

  // checking if current song playing matches song user chooses to delete
  if (userData?.currentSong?.id === id) {
    // sets current song to no song
    userData.currentSong = null;
    // restarts current time back to zero
    userData.songCurrentTime = 0;

    pauseSong();
    setPlayerDisplay();
  }
  
  // The filter method creates a new array by filtering out the song with the provided id from the userData.songs array.
  // Each song is checked, and the filter returns true only for songs whose id does not match the provided id.
  userData.songs = userData?.songs.filter((song) => song.id !== id);

  renderSongs(userData?.songs); 
  highlightCurrentSong(); 
  setPlayButtonAccessibleText(); 

  // checks if there is no song in songs array
  if (userData?.songs.length === 0) {
    // creates the reset button in HTML document
    const resetButton = document.createElement("button");
    // creates text in HTML document
    const resetText = document.createTextNode("Reset Playlist");
    // gives resetButton the reset id
    resetButton.id = "reset";
    // give reset button a aria-label
    resetButton.ariaLabel = "Reset playlist";

    // modifies DOM structure of resetButton and playlistSongs by adding new element to node
    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);

    // listens for clicks on resestButton
    resetButton.addEventListener("click", () => {
      // spreads and assigns all songs in allSongs array to songs in userData object
      userData.songs = [...allSongs];

      renderSongs(sortSongs()); 
      setPlayButtonAccessibleText();

      // Removes the reset button from the DOM after the playlist is reset and its functionality is no longer needed.
      resetButton.remove();
    });

  }

};

const setPlayerDisplay = () => {
  // assigns id elements to a const
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");

  // assigns song Title and Artist to a const
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  // textContent is a built-in property in JS
  // updating text content of HTML represent song Title and Artist
  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

const highlightCurrentSong = () => {
  // assigns HTML id to a constant
  // the id isn't explicitly found in html document, it is rendered within renderSongs() 
  const playlistSongElements = document.querySelectorAll(".playlist-song");

  // highlights based on id of current playing song
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  // Loop through each song element in the playlist and remove the 'aria-current' attribute,
  // which highlights the currently playing song in the playlist.
  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  // If there's a song to highlight, set its 'aria-current' attribute to 'true',
  // indicating that it's the currently playing song in the playlist.
  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

const renderSongs = (array) => {
  // Map through each song in the array and create html for it
  const songsHTML = array
    .map((song)=> {
      return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li>
      `;
    })
    .join(""); // Jointhe HTML string together in one string

  // Set the innerHtml of playlistSongs element to the generated html
  playlistSongs.innerHTML = songsHTML;
};

const setPlayButtonAccessibleText = () => {
  // Get the current song from userData, or the first song if no current song is available
  const song = userData?.currentSong || userData?.songs[0];

  // Set the aria-label attribute of the playButton
  playButton.setAttribute(
    // If the song title exists, set the aria-label to "Play [song title]", otherwise set it to "Play"
    "aria-label",
    song?.title ? `Play ${song.title}` : "Play"
  );
};

const getCurrentSongIndex = () => {
  // Get the index of the current song in the userData.songs array
  // it is important to track the position of current playin song to perform various actions
  return userData?.songs.indexOf(userData?.currentSong);
}

playButton.addEventListener("click", () => {
  // if there is no current song, play the first song in playlist
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    // else play the song selected
    playSong(userData?.currentSong.id);
  }
});

pauseButton.addEventListener("click",  pauseSong);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

shuffleButton.addEventListener("click", shuffle);

// handles the "eneded" event of audio element
audio.addEventListener("ended", () => {
  // get index of current playing song
    const currentSongIndex = getCurrentSongIndex();
    // checks if next song exist in the array
    const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;
  
    // if there is a next song play it
    if (nextSongExists) {
      playNextSong();
    } else {
      // if there is not next song, reset the current song and player state
      userData.currentSong = null;
      userData.songCurrentTime = 0;
      pauseSong()
      setPlayerDisplay()
      highlightCurrentSong()
      setPlayButtonAccessibleText()
    }
});

const sortSongs = () => {
  // sort the songs array alphabetically by their titles
    userData?.songs.sort((a,b) => {
      if (a.title < b.title) {
        return -1;
      }
  
      if (a.title > b.title) {
        return 1;
      }
  
      return 0;
    });
  
    // return the sorted array
    return userData?.songs;
};
  
renderSongs(sortSongs());
setPlayButtonAccessibleText();