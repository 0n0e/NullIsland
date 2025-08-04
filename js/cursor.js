document.addEventListener("DOMContentLoaded", () => {
  // ページのパスに応じてpin画像のパスを自動設定
  let basePath = '';
  if (window.location.pathname.includes('/works/')) {
    basePath = '../common/';
  } else if (window.location.pathname.includes('/about/')) {
    basePath = '../common/';
  } else {
    basePath = 'common/';
  }

  const pin = document.createElement("img");
  pin.id = "custom-cursor";
  pin.src = basePath + "pin.png";
  pin.style.position = "fixed";
  pin.style.pointerEvents = "none";
  pin.style.zIndex = "9999";
  pin.style.width = "61px";
  pin.style.height = "58px";
  pin.style.left = "0px";
  pin.style.top = "0px";
  pin.style.transform = "translate(-30.5px, -29px)"; // アイコン中心合わせ
  document.body.appendChild(pin);

  // 全体のカーソルを非表示にする
  const disableCursor = () => {
    document.body.style.cursor = "none";
    document.documentElement.style.cursor = "none";

    // すべての要素に cursor:none を強制適用
    const all = document.querySelectorAll("*");
    all.forEach((el) => {
      el.style.cursor = "none";
    });
  };

  disableCursor();

  let lastX = window.innerWidth / 2;
  let lastY = window.innerHeight / 2;

  const movePin = (x, y) => {
    lastX = x;
    lastY = y;
    pin.style.left = `${x}px`;
    pin.style.top = `${y}px`;
  };

  document.addEventListener("mousemove", (e) => {
    movePin(e.clientX, e.clientY);
  });

  document.addEventListener("mouseleave", () => {
    movePin(lastX, lastY);
  });

  document.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      movePin(touch.clientX, touch.clientY);
    }
  });
});
 
