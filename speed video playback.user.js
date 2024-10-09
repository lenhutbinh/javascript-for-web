// ==UserScript==
// @name         Customize Video Playback Speed
// @name:vi      Tùy chỉnh tốc độ phát video
// @version      09.05
// @description Displays the current playback speed in the upper left corner for 10 seconds. Allows the user to customize the video playback speed.
// @description:vi  Hiển thị tốc độ phát hiện tại ở góc trên bên trái trong 10 giây. Cho phép người dùng tùy chỉnh tốc độ phát video.
// @author       lenhutbinh
// @match        *://*/*
// @icon         https://i.postimg.cc/Gtmc4XL4/20240820-140735642.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    const savedSpeed = GM_getValue('savedSpeed', 1.2);

    GM_registerMenuCommand("Đổi tốc độ", setCustomSpeed);

    function setCustomSpeed() {
        const newSpeed = prompt("Enter the number you want ! ngăn cách bằng dấu chấm (Ex: 1.2 - 4.0)");
        if (newSpeed !== null && !isNaN(newSpeed)) {
            const speed = parseFloat(newSpeed);
            if (speed >= 0.1 && speed <= 4.0) {
                applySpeedToAllVideos(speed);
                GM_setValue('savedSpeed', speed);
                displaySpeedLabel(speed);
            } else {
                alert("Sai rồi, nhập lại đi ! Enter only numbers from 0.1 to 4.0");
            }
        }
    }

    function applySpeedToAllVideos(speed) {
        document.querySelectorAll('video').forEach(video => {
            video.playbackRate = speed;
        });
    }

    function displaySpeedLabel(speed) {
        const style = `
            <style>
                .speedlabel {
                    position: absolute;
                    z-index: 999;
                    width: 30px;
                    left: 8px;
                    top: 10px;
                    text-align: center;
                    font-size: 10px;
                    color: #E8C62B;
                    border-radius: 5px;
                    background-color: #070138;
                    opacity: 0.3
                }
            </style>
        `;
        document.head.insertAdjacentHTML("beforeend", style);

        document.querySelectorAll("video").forEach(video => {
            if (!video.hasAttribute("speedlabel")) {
                const speedLabel = document.createElement("div");
                speedLabel.className = "speedlabel";
                speedLabel.innerText = `${speed}𝚡`;
                video.insertAdjacentElement("beforebegin", speedLabel);
                video.setAttribute("speedlabel", "true");

                setTimeout(() => {
                    speedLabel.remove();
                }, 10000);
            }
        });
    }

    function init() {
        applySpeedToAllVideos(savedSpeed);
        displaySpeedLabel(savedSpeed);

        const observer = new MutationObserver(() => {
            applySpeedToAllVideos(savedSpeed);
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();
