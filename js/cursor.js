document.addEventListener("DOMContentLoaded", () => {
    const pin = document.createElement("img");
    pin.id = "custom-cursor";
    pin.src = cursorImagePath; // HTML側で定義される変数を使用
  
    pin.style.position = "fixed";
    pin.style.pointerEvents = "none";
    pin.style.zIndex = "9999";
    pin.style.width = "61px";
    pin.style.height = "58px";
    pin.style.left = "0px";
    pin.style.top = "0px";
    pin.style.transform = "translate(-30.5px, -29px)"; // 中心に合わせる
    document.body.appendChild(pin);

    // 経度緯度表示用の要素を作成
    const coordinates = document.createElement("div");
    coordinates.id = "coordinates";
    coordinates.textContent = "0.0000, 0.0000";
    document.body.appendChild(coordinates);
  
    // ページ全体のカーソルを非表示にする
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

    // マップから経度緯度を取得する関数
    const getCoordinatesFromPixel = (x, y) => {
      if (typeof map !== 'undefined' && map) {
        try {
          const bounds = map.getBounds();
          const projection = map.getProjection();
          
          if (bounds && projection) {
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            
            const mapDiv = document.getElementById('map');
            const mapRect = mapDiv.getBoundingClientRect();
            
            // マップ領域内での相対位置を計算
            const relativeX = (x - mapRect.left) / mapRect.width;
            const relativeY = (y - mapRect.top) / mapRect.height;
            
            // 経度緯度を計算
            const lng = sw.lng() + (ne.lng() - sw.lng()) * relativeX;
            const lat = ne.lat() - (ne.lat() - sw.lat()) * relativeY;
            
            return { lat: lat.toFixed(4), lng: lng.toFixed(4) };
          }
        } catch (error) {
          console.log('Coordinates calculation error:', error);
        }
      }
      return { lat: "0.0000", lng: "0.0000" };
    };
  
    const movePin = (x, y) => {
      lastX = x;
      lastY = y;
      pin.style.left = `${x}px`;
      pin.style.top = `${y}px`;
      
      // 経度緯度表示も一緒に移動
      coordinates.style.left = `${x}px`;
      coordinates.style.top = `${y}px`;
      
      // 経度緯度を更新
      const coords = getCoordinatesFromPixel(x, y);
      coordinates.textContent = `${coords.lat}, ${coords.lng}`;
    };
  
    document.addEventListener("mousemove", e => {
      movePin(e.clientX, e.clientY);
    });
  
    document.addEventListener("mouseleave", () => {
      movePin(lastX, lastY);
    });
  
    document.addEventListener("touchmove", e => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        movePin(touch.clientX, touch.clientY);
      }
    });

    // マップのズームや移動時に座標を更新
    const updateCoordinatesOnMapChange = () => {
      if (typeof map !== 'undefined' && map) {
        map.addListener('bounds_changed', () => {
          const coords = getCoordinatesFromPixel(lastX, lastY);
          coordinates.textContent = `${coords.lat}, ${coords.lng}`;
        });
      }
    };

    // マップが初期化されるまで待機
    const waitForMap = () => {
      if (typeof map !== 'undefined' && map) {
        updateCoordinatesOnMapChange();
      } else {
        setTimeout(waitForMap, 100);
      }
    };
    waitForMap();
  });