let mapInstance = null;
let snowInterval = null;

/* =========================
   CONFIGURAÇÃO POR MÊS
========================= */
const MONTH_CONFIG = {
  "2024-04": {
    end: [-19.92488, -43.90598],
    images: ["abril - 2024/1.jpeg", "abril - 2024/2.jpeg", "abril - 2024/3.jpeg"],
    birthdayHat: true
  },
  "2024-05": {
    end: [-19.8553, -43.9738],
    images: ["maio - 2024/1.jpeg", "maio - 2024/2.jpeg", "maio - 2024/3.jpeg"]
  },
  "2024-06": {
    end: [-19.9317, -43.9384],
    images: ["junho - 2024/1.jpeg", "junho - 2024/2.jpeg", "junho - 2024/3.jpeg"]
  },
  "2024-07": {
    end: [-19.9326, -43.9371],
    images: ["julho - 2024/1.jpeg", "julho - 2024/2.jpeg", "julho - 2024/3.jpeg"]
  },
  "2024-08": {
    end: [-19.9342, -43.9365],
    images: ["agosto - 2024/1.jpeg", "agosto - 2024/2.jpeg", "agosto - 2024/3.jpeg"]
  },
  "2024-09": {
    end: [45.8918, -123.9615], 
    images: ["setembro - 2024/1.png", "setembro - 2024/2.jpeg", "setembro - 2024/3.jpeg"],
    specialPath: true,
    quiz: true
  },

  "2024-10": {
    end: [-19.86277, -44.02076],
    images: ["outubro - 2024/1.jpeg", "outubro - 2024/2.jpeg", "outubro - 2024/3.jpeg"],
    birthdayHat: true
  },

  "2024-11": {
    end: [-23.5505, -46.6333],
    images: ["novembro - 2024/1.png", "novembro - 2024/2.jpeg", "novembro - 2024/3.jpeg"],
    specialPath: true
  },

  "2024-12": {
    end: [-19.86277, -44.02076],
    images: ["dezembro - 2024/1.jpeg", "dezembro - 2024/2.jpeg", "dezembro - 2024/3.jpeg"],
    snow: true
  },

  "2025-01": {
    end: [-19.9311, -43.9378],
    images: ["janeiro - 2025/1.jpeg", "janeiro - 2025/2.jpeg", "janeiro - 2025/3.jpeg"],
  },

  "2025-02": {
    end: [-19.9156, -43.9506],
    images: ["fevereiro - 2025/1.jpeg", "fevereiro - 2025/2.jpeg", "fevereiro - 2025/3.jpeg"],
  },

  "2025-03": {
    end: [-20.0816, -43.7879],
    images: ["marco - 2025/1.jpeg", "marco - 2025/2.jpeg", "marco - 2025/3.jpeg"],
  },

  "2025-04": {
    end: [-19.92488, -43.90598],
    images: ["abril - 2025/1.jpeg", "abril - 2025/2.jpeg", "abril - 2025/3.jpeg"],
    birthdayHat: true
  },

  "2025-05": {
    end: [-19.87525, -43.92540],
    images: ["maio - 2025/1.jpeg", "maio - 2025/2.jpeg", "maio - 2025/3.jpeg"],
  },

  "2025-06": {
    end: [-25.4296, -49.2713],
    images: ["junho-2025/1.jpeg", "junho-2025/2.jpeg", "junho-2025/3.jpeg"],
    specialPath: true
  },

  "2025-07": {
    end: [59.3293, 18.0686],
    images: ["julho - 2025/1.jpg", "julho - 2025/2.jpg", "julho - 2025/3.jpg"],
    specialPath: true
  },

  "2025-10": {
    end: [-19.86277, -44.02076],
    images: ["outubro 2025/1.jpeg", "outubro 2025/2.jpeg", "outubro 2025/3.jpeg"],
    birthdayHat: true
  },
};

/* ========================= */

function selectMonth(month) {
  document.getElementById("month-page").style.display = "none";
  document.getElementById("map-page").hidden = false;
  document.getElementById("overlay").style.display = "none";

  stopSnow();
  initMap(month);
}

function initMap(month) {
  if (mapInstance) mapInstance.remove();

  const config = MONTH_CONFIG[month];
  if (!config) return;

  const start = [-19.8696, -43.9647] // UFMG / BH
  const zoom = config.specialPath ? 4 : 14;

  mapInstance = L.map("map").setView(start, zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(mapInstance);

  const icon = createCarIcon(config.birthdayHat)

  const marker = L.marker(start, {
    icon}
  ).addTo(mapInstance);

  if (config.snow) startSnow();

  if (config.specialPath) {
    animateMarkerSeptember(marker, start, config.end, mapInstance, () => {
      if (config.quiz) {
        showSeptemberQuiz(config.images);
      }else{
        showOverlay(config.images);
      }
    });
  } else {
    animateMarker(marker, start, config.end, mapInstance, () => {
      showOverlay(config.images);
    });
  }
}

/* =========================
   ANIMAÇÃO NORMAL
========================= */
function animateMarker(marker, start, end, map, onFinish) {
  const duration = 6000;
  const startTime = performance.now();

  function step(time) {
    const t = Math.min((time - startTime) / duration, 1);

    const lat = start[0] + (end[0] - start[0]) * t;
    const lng = start[1] + (end[1] - start[1]) * t;

    marker.setLatLng([lat, lng]);
    map.panTo([lat, lng], { animate: true, duration: 0.25 });

    t < 1 ? requestAnimationFrame(step) : onFinish();
  }

  requestAnimationFrame(step);
}

/* =========================
   ANIMAÇÃO DE SETEMBRO
========================= */
function animateMarkerSeptember(marker, start, end, map, onFinish) {
  const duration = 9000;
  const startTime = performance.now();

  function step(time) {
    const t = Math.min((time - startTime) / duration, 1);
    let progress;

    if (t < 0.5) {
      progress = t;
    } else if (t < 0.7) {
      progress = 0.5 - (t - 0.5) * 0.75;
    } else {
      progress = 0.35 + (t - 0.7) * (1 / 0.3);
    }

    progress = Math.max(0, Math.min(progress, 1));

    const lat = start[0] + (end[0] - start[0]) * progress;
    const lng = start[1] + (end[1] - start[1]) * progress;

    marker.setLatLng([lat, lng]);
    map.panTo([lat, lng], { animate: true, duration: 0.25 });

    t < 1 ? requestAnimationFrame(step) : onFinish();
  }

  requestAnimationFrame(step);
}

function animateMarkerSeptember(marker, start, end, map, onFinish) {
  const duration = 9000;
  const startTime = performance.now();

  function step(time) {
    const t = Math.min((time - startTime) / duration, 1);
    let progress;

    if (t < 0.5) {
      progress = t;
    } else if (t < 0.7) {
      progress = 0.5 - (t - 0.5) * 0.75;
    } else {
      progress = 0.35 + (t - 0.7) * (1 / 0.3);
    }

    progress = Math.max(0, Math.min(progress, 1));

    const lat = start[0] + (end[0] - start[0]) * progress;
    const lng = start[1] + (end[1] - start[1]) * progress;

    marker.setLatLng([lat, lng]);
    map.panTo([lat, lng], { animate: true, duration: 0.25 });

    t < 1 ? requestAnimationFrame(step) : onFinish();
  }

  requestAnimationFrame(step);
}


function showSeptemberQuiz() {
  const overlay = document.getElementById("overlay");

  overlay.innerHTML = `
    <div class="overlay-content">

      <div class="choices">
        <button onclick="correctChoice()">🦋 </button>
        <button onclick="wrongChoice()">🐭 </button>
        <button onclick="wrongChoice()">🦟 </button>
      </div>
    </div>
  `;

  overlay.style.display = "flex";
}

function createCarIcon(withHat = false) {
  if (!withHat) {
    return L.icon({
      iconUrl: "car.gif",
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  }

  return L.divIcon({
    html: `
      <div style="position: relative; width: 40px; height: 40px;">
        <img src="hat.png"
             style="position:absolute; top:-18px; left:5px; width:30px;">
        <img src="car.gif" style="width:40px;">
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    className: ""
  });
}

function correctChoice() {
  showOverlay(MONTH_CONFIG['2024-09'].images);
}

function wrongChoice() {
  alert("Errou (voz do faustão)");
}

/* =========================
   OVERLAY NORMAL
========================= */
function showOverlay(images) {
  const overlay = document.getElementById("overlay");

  overlay.innerHTML = `
    <div class="overlay-content">
      <div class="images"></div>
      <button onclick="goBack()">Proximo</button>
    </div>
  `;

  const imagesDiv = overlay.querySelector(".images");

  images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    imagesDiv.appendChild(img);
  });

  overlay.style.display = "flex";
}

function goBack() {
  stopSnow();
  document.getElementById("map-page").hidden = true;
  document.getElementById("month-page").style.display = "flex";
}


function startSnow() {
  stopSnow();

  snowInterval = setInterval(() => {
    const snow = document.createElement("div");
    snow.className = "snow";
    snow.style.left = Math.random() * window.innerWidth + "px";
    snow.style.animationDuration = 3 + Math.random() * 5 + "s";
    document.body.appendChild(snow);

    setTimeout(() => snow.remove(), 8000);
  }, 20);
}

function stopSnow() {
  clearInterval(snowInterval);
  document.querySelectorAll(".snow").forEach(s => s.remove());
}