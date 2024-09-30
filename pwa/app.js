document.addEventListener('DOMContentLoaded', () => {
    const stationSelector = document.querySelector('#station-selector');
    const player = document.querySelector('#radio-player');
    const audioSource = document.querySelector('#audio-source');

    // Função para atualizar o player de áudio com a estação selecionada
    const updateAudioPlayer = (station) => {
        if (!station) {
            console.error('Estação inválida!');
            return;
        }

        player.style.display = 'block';         // Exibe o player
        audioSource.src = station.url;
        audioSource.type = `audio/${station.type}`;
        player.load();  // Recarrega o player com a nova fonte

        player.onerror = () => {
            M.toast({ html: 'Falha ao carregar o áudio!' });
        };

        M.toast({ html: `Tocando: ${station.title}` }); // Notificação ao trocar de estação
    };

    // Função para popular o seletor de estações
    const populateStationSelector = (stations) => {
        stationSelector.innerHTML = '';  // Limpa as opções existentes
        const firstOption = document.createElement('option');
        firstOption.value = '';
        firstOption.textContent = 'Selecione a Estação';
        stationSelector.appendChild(firstOption);

        stations.forEach((station, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${index + 1} - ${station.title.toUpperCase()}`;
            stationSelector.appendChild(option);
        });

        stationSelector.addEventListener('change', () => {
            const selectedStation = stations[stationSelector.value];
            updateAudioPlayer(selectedStation);
        });
    };

    // Função para carregar estações de rádio via JSON
    const loadStations = async () => {
        try {
            const response = await fetch('stations.json');  // Atualize o caminho do JSON
            if (!response.ok) throw new Error('Falha ao buscar estações de rádio.');

            const data = await response.json();
            const stations = data.stations;

            if (stations && stations.length) {
                populateStationSelector(stations);
                stationSelector.disabled = false;    // Habilita o seletor após carregar estações
                M.toast({ html: 'Estações de rádio carregadas com sucesso!' });
            } else {
                throw new Error('Nenhuma estação de rádio encontrada.');
            }
        } catch (error) {
            console.error('Erro ao buscar as estações de rádio:', error);
            M.toast({ html: 'Erro ao carregar estações de rádio.' });
        } finally {
            M.FormSelect.init(stationSelector);  // Re-inicializa o seletor Materialize
        }
    };

    (async () => {
        const manifest = await fetch('./manifest.json');
        const manifestJson = await manifest.json();
        if (manifestJson.version) {
            document.querySelector('#version').textContent = "v" + manifestJson.version;
        }    
    })();

    // Inicialização do carregamento de estações
    loadStations();
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
