// ==UserScript==
// @name        Tùy chỉnh tốc độ phát video
// @namespace   http://tampermonkey.net/
// @version     02.09
// @description Hiển thị tốc độ phát hiện tại ở góc trên bên trái trong 10 giây. Cho phép người dùng tùy chỉnh tốc độ phát video.
// @author      lenhutbinh
// @match       *://*/*
// @icon        https://i.postimg.cc/Gtmc4XL4/20240820-140735642.png
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// ==/UserScript==

(function() {
  'use strict';

  // Khởi tạo tốc độ tăng mặc định, tốc độ đã lưu và tốc độ mặc định
  const defaultSpeedIncrement = 0.2;
  let savedSpeed = GM_getValue('savedSpeed', 1.2); 
  
  GM_registerMenuCommand("Tốc độ tùy chỉnh", setCustomSpeed);

  // Hàm đặt tốc độ phát tùy chỉnh
  function setCustomSpeed() {
    const newSpeed = prompt("Nhập tốc độ phát, số lẻ ngăn cách bởi dấu chấm (Ex: 1.2 - 4.0)");
    if (newSpeed !== null && !isNaN(newSpeed)) {
      const speed = parseFloat(newSpeed);
      if (speed >= 0.2 && speed <= 4) {
        document.querySelectorAll('video').forEach(video => {
          video.playbackRate = speed;
        });
        GM_setValue('savedSpeed', speed);
      } else {
        alert("Tốc độ không hợp lệ. Vui lòng nhập số từ 0.2 đến 4.");
      }
    }
  }

  // Đặt tốc độ mặc định khi trang được tải
  document.querySelectorAll('video').forEach(video => {
    video.playbackRate = savedSpeed;
  });

  // Hiển thị tốc độ phát hiện tại ở góc trên bên trái
  setInterval(function() {
    videospeed();
  }, 5000);

  function videospeed() {
    var style = `
      <style>
        .speedlabel {
          position: absolute;
          z-index: 999;
          width: 30px;
          left: 8px;
          top: 10px;
          text-align: center;
          color: #B3D571;
          background-color: #B4021227;
          font-size: 12px;
          border-radius: 5px;
        }
      </style>
    `;

    var videos = document.querySelectorAll("video");
    for (var i = 0; i < videos.length; i++) {
      if (videos[i] && !videos[i].paused && videos[i].readyState >= 2) {
        // Chỉ xử lý video đang phát
        videos[i].playbackRate = savedSpeed;
        videos[i].mozPreservesPitch = videos[i].webkitPreservesPitch = videos[i].preservePitch = true;

        if (!videos[i].hasAttribute("speedlabel")) {
          videos[i].setAttribute("speedlabel", "true");
          var speedlabel = document.createElement("div");
          speedlabel.className = "speedlabel";
          speedlabel.innerText = savedSpeed + "𝚡";
          videos[i].insertAdjacentElement("beforebegin", speedlabel);
          document.head.insertAdjacentHTML("beforeend", style);

          // Tắt nhãn sau 10 giây
          setTimeout(function() {
            speedlabel.remove();
          }, 10000);
        }
      }
    }
  }
})();