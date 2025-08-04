let map;

function initMap() {
  const center = { lat: 0.0000, lng: 0.0000 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 5,
    disableDefaultUI: true,
    mapTypeId: 'satellite'
  });

  new google.maps.Marker({
    position: center,
    map: map,
    title: "nullisland"
  });
}

const wheel = document.getElementById("wheel");
const works = [
  { title: "x1", img: "img/work1.jpg", link: "works/work1.html" },
  { title: "x2", img: "img/work2.jpg", link: "works/work2.html" },
  { title: "x3", img: "img/work3.jpg", link: "works/work3.html" },
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