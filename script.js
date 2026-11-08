document.addEventListener('DOMContentLoaded', () => {
  // Referencias a los elementos del DOM
  const audio = document.getElementById('radioStream');
  const mainPlayBtn = document.getElementById('mainPlayBtn');
  const mainPlayIcon = document.getElementById('mainPlayIcon');
  const bottomPlayBtn = document.getElementById('bottomPlayBtn');
  const bottomPlayIcon = document.getElementById('bottomPlayIcon');
  const centerWrapper = document.getElementById('glowRing').parentElement;
  
  const volumeSlider = document.getElementById('volumeSlider');
  const muteBtn = document.getElementById('muteBtn');
  const volumeIcon = document.getElementById('volumeIcon');
  
  const streamStatus = document.getElementById('streamStatus');
  const btnPopup = document.getElementById('btnPopup');

  // Configuración inicial de volumen
  audio.volume = parseFloat(volumeSlider.value);

  // Función común para alternar Play / Pause
  function togglePlayback() {
    if (audio.paused) {
      streamStatus.textContent = 'Conectando al stream...';
      
      // Para evitar reproducir audio en búfer viejo, refrescamos la URL
      const currentSrc = audio.querySelector('source').src.split('?')[0];
      audio.src = currentSrc + '?t=' + new Date().getTime();
      
      audio.play().then(() => {
        updatePlayState(true);
      }).catch(err => {
        console.error('Error al reproducir:', err);
        streamStatus.textContent = 'Error de conexión';
        updatePlayState(false);
      });
    } else {
      audio.pause();
      // Vaciamos src para detener la descarga de datos en segundo plano
      audio.src = '';
      updatePlayState(false);
    }
  }

  // Actualiza iconos y estados visuales
  function updatePlayState(isPlaying) {
    if (isPlaying) {
      mainPlayIcon.classList.remove('fa-play');
      mainPlayIcon.classList.add('fa-pause');
      
      bottomPlayIcon.classList.remove('fa-play');
      bottomPlayIcon.classList.add('fa-pause');
      
      centerWrapper.classList.add('playing');
      streamStatus.textContent = 'Transmitiendo en vivo';
    } else {
      mainPlayIcon.classList.remove('fa-pause');
      mainPlayIcon.classList.add('fa-play');
      
      bottomPlayIcon.classList.remove('fa-pause');
      bottomPlayIcon.classList.add('fa-play');
      
      centerWrapper.classList.remove('playing');
      streamStatus.textContent = 'En pausa';
    }
  }

  // Eventos de botones de reproducción
  mainPlayBtn.addEventListener('click', togglePlayback);
  bottomPlayBtn.addEventListener('click', togglePlayback);

  // Control deslizante de volumen
  volumeSlider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    audio.volume = vol;
    audio.muted = false;
    updateVolumeIcon(vol);
  });

  // Botón Mute
  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    if (audio.muted) {
      volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else {
      updateVolumeIcon(audio.volume);
    }
  });

  // Actualizar icono de volumen según nivel
  function updateVolumeIcon(vol) {
    if (vol === 0) {
      volumeIcon.className = 'fa-solid fa-volume-off';
    } else if (vol < 0.5) {
      volumeIcon.className = 'fa-solid fa-volume-low';
    } else {
      volumeIcon.className = 'fa-solid fa-volume-high';
    }
  }

  // Manejo de ventana emergente (Popup Player)
  btnPopup.addEventListener('click', () => {
    window.open(
      'https://radios.yanapak.org/nexusradio',
      'NexusRadioPopup',
      'width=420,height=520,menubar=no,status=no,location=no'
    );
  });

  // Manejador en caso de interrupción del servidor
  audio.addEventListener('error', () => {
    streamStatus.textContent = 'Señal no disponible';
    updatePlayState(false);
  });
});