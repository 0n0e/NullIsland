let map;

function initMap() {
  const center = { lat: 0.0000, lng: 0.0000 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 5,
    disableDefaultUI: true,
    mapTypeId: 'satellite'
  });

  // マーカー用のカスタムコンテンツを作成
  const markerContent = document.createElement('div');
  markerContent.style.cssText = `
    position: relative;
    width: 61px;
    height: 58px;
    background-image: url('common/pin.png');
    background-size: contain;
    background-repeat: no-repeat;
  `;

  // 経度緯度ラベルを作成
  const coordLabel = document.createElement('div');
  coordLabel.textContent = '0.0000, 0.0000';
  coordLabel.className = 'marker-coordinates';
  coordLabel.style.cssText = `
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-family: 'Fira Code', monospace;
    font-size: 12px;
    white-space: nowrap;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    pointer-events: none;
  `;

  markerContent.appendChild(coordLabel);

  // カスタムオーバーレイクラスを作成
  class CustomMarker extends google.maps.OverlayView {
    constructor(position, map) {
      super();
      this.position = position;
      this.setMap(map);
    }

    onAdd() {
      const pane = this.getPanes().overlayMouseTarget;
      pane.appendChild(markerContent);
    }

    draw() {
      const projection = this.getProjection();
      const position = projection.fromLatLngToDivPixel(this.position);
      
      if (position) {
        markerContent.style.left = (position.x - 30.5) + 'px';
        markerContent.style.top = (position.y - 29) + 'px';
      }
    }

    onRemove() {
      if (markerContent.parentNode) {
        markerContent.parentNode.removeChild(markerContent);
      }
    }
  }

  // カスタムマーカーを作成
  new CustomMarker(center, map);
}

const wheel = document.getElementById("wheel");
const works = [
  { title: "とおいね/しずかね/かなしいね 2025", img: "works/img/toe1.jpg", link: "works/work1.html" },
  { title: "nullisland/Dear.Media 2025", img: "works/img/null1.jpg", link: "works/work2.html" },
  { title: "7/11-VJwork 2025", img: "works/img/0711.jpg", link: "works/work3.html" },
  { title: "x4", img: "img/work4.jpg", link: "works/work4.html" },
  { title: "x5", img: "img/work5.jpg", link: "works/work5.html" },
  { title: "x6", img: "img/work6.jpg", link: "works/work6.html" },
];

// レスポンシブに対応した半径の計算
function getRadius() {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  const vmin = Math.min(vw, vh);
  
  if (vmin <= 480) {
    return 25; // スマートフォン
  } else if (vmin <= 768) {
    return 28; // タブレット
  } else {
    return 30; // デスクトップ
  }
}

let angle = 0;
let isHoveringImage = false;

const items = works.map(work => {
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `
    <a href="${work.link}">
      <img src="${work.img}" alt="${work.title}" />
      <p>${work.title}</p>
    </a>
  `;
  wheel.appendChild(div);
  return div;
});

items.forEach(el => {
  const anchor = el.querySelector("a");
  anchor.addEventListener("mouseenter", () => isHoveringImage = true);
  anchor.addEventListener("mouseleave", () => isHoveringImage = false);
});

function updatePositions() {
  const radius = getRadius();
  
  items.forEach((el, i) => {
    const theta = (angle + (360 / items.length) * i) * Math.PI / 180;
    const x = Math.cos(theta) * radius;
    const y = Math.sin(theta) * radius;
    const scale = isHoveringImage && el.querySelector('a:hover') ? 1.2 : 1;
    el.style.transform = `translate(calc(${x}vmin - 50%), calc(${y}vmin - 50%)) scale(${scale})`;
    el.style.zIndex = (isHoveringImage && el.querySelector('a:hover')) ? '2' : '1';
  });
}

function animate() {
  if (!isHoveringImage) {
    angle += 0.3;
  }
  updatePositions();
  requestAnimationFrame(animate);
}

// リサイズ時の対応
window.addEventListener('resize', updatePositions);

updatePositions();
animate();