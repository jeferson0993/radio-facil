document.addEventListener('DOMContentLoaded', () => {
    const stations = [
        {
            "title": "CHQR News Talk (Calgary)",
            "url": "https://live.leanstream.co/CHQRAM",
            "type": "mp3"
        },
        {
            "title": "WBBR Bloomberg 1130 (New York)",
            "url": "https://playerservices.streamtheworld.com/api/livestream-redirect/WBBRAMAAC48_SC",
            "type": "aac"
        },
        {
            "title": "CKNW-AM NewsTalk 980 (Vancouver)",
            "url": "https://corus.leanstream.co/CKNWAM-MP3",
            "type": "mp3"
        },
        {
            "title": "KSFO 560 AM (San Francisco)",
            "url": "https://playerservices.streamtheworld.com/api/livestream-redirect/KSFOAMAAC_SC",
            "type": "aac"
        },
        {
            "title": "WBAP News / Talk (Texas)",
            "url": "https://playerservices.streamtheworld.com/api/livestream-redirect/WBAPAMAAC_SC",
            "type": "aac"
        },
        {
            "title": "Highland Radio (Ireland)",
            "url": "https://edge.audioxi.com/HIGHLAND",
            "type": "mp3"
        },
        {
            "title": "LBC (London)",
            "url": "https://media-ssl.musicradio.com/LBCUK",
            "type": "mp3"
        },
        {
            "title": "Cape Talk (South Africa)",
            "url": "https://playerservices.streamtheworld.com/api/livestream-redirect/CAPE_TALK_SC",
            "type": "mp3"
        },
        {
            "title": "CNA 938 (Singapore)",
            "url": "https://playerservices.streamtheworld.com/api/livestream-redirect/938NOWAAC_SC",
            "type": "aac"
        },
        {
            "title": "ABC News (Australia)",
            "url": "https://live-radio01.mediahubaustralia.com/PBW/aac/",
            "type": "aac"
        }
        ];

        const audioPlayer = document.getElementById('audio-player');
        const playPauseBtn = document.getElementById('play-pause');
        const volumeControl = document.getElementById('volume');
        const stationsList = document.getElementById('stations-list');
        const stationName = document.getElementById('station-name');
        let currentStation = null;

        function createStationButtons() {
            stations.forEach(station => {
                console.log(station);
                const button = document.createElement('button');
                button.textContent = station.title;
                button.className = 'w-full text-left px-4 py-2 bg-gray-100 hover:bg-blue-100 rounded transition-colors';
                button.addEventListener('click', () => playStation(station));
                stationsList.appendChild(button);
            });
        }

        function playStation(station) {
            if (currentStation !== station) {
                currentStation = station;
                audioPlayer.src = station.url;
                stationName.textContent = station.title;
                audioPlayer.play().catch(error => {
                    console.error('Error playing audio:', error);
                    alert('Unable to play this station. Please try another one.');
                });
                updatePlayPauseButton();
            } else {
                togglePlayPause();
            }
        }

        function togglePlayPause() {
            if (audioPlayer.paused) {
                audioPlayer.play().catch(error => {
                    console.error('Error playing audio:', error);
                    alert('Unable to play. Please try selecting a station first.');
                });
            } else {
                audioPlayer.pause();
            }
            updatePlayPauseButton();
        }

        function updatePlayPauseButton() {
            if (audioPlayer.paused) {
                playPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
                playPauseBtn.classList.remove('animate-pulse');
            } else {
                playPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
                playPauseBtn.classList.add('animate-pulse');
            }
        }

        playPauseBtn.addEventListener('click', togglePlayPause);
        volumeControl.addEventListener('input', (e) => {
            audioPlayer.volume = e.target.value;
        });

        audioPlayer.addEventListener('play', updatePlayPauseButton);
        audioPlayer.addEventListener('pause', updatePlayPauseButton);

        audioPlayer.addEventListener('canplay', () => {
            playPauseBtn.disabled = false;
        });

        audioPlayer.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            alert('Error loading audio. Please try another station.');
        });

        createStationButtons();
});

// Registro do Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then((registration) => {
                console.log('ServiceWorker registrado com sucesso:', registration);
            })
            .catch((err) => {
                console.error('Erro ao registrar o ServiceWorker:', err);
            });
    });
}
