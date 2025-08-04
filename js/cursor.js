document.addEventListener("DOMContentLoaded", () => {
    // ページの階層数を取得（例: /works/index.html → 2階層）
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    
    // ベースパスを計算（階層分 ../ をつなげる）
    let basePath = "";
    for (let i = 1; i < depth; i++) {
      basePath += "../";
    }
    
    // 画像パスを決定
    const imgPath = basePath + "common/pin.png";
  
    const pin = document.createElement("img");
    pin.id = "custom-cursor";
    pin.src = imgPath;  // 動的に計算されたパスをセット
    pin.style.position = "fixed";
    pin.style.pointerEvents = "none";
    pin.style.zIndex = "9999";
    pin.style.width = "61px";
    pin.style.height = "58px";
    pin.style.left = "0px";
    pin.style.top = "0px";
    pin.style.transform = "translate(-30.5px, -29px)"; // アイコン中心合わせ
    document.body.appendChild(pin);
  
    // 元カーソルを消す
    const disableCursor = () => {
      document.body.style.cursor = "none";
      document.documentElement.style.cursor = "none";
      document.querySelectorAll("*").forEach(el => {
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
  