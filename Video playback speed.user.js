// ==UserScript==
// @name         Change default video playback speed
// @name:vi        Thay đổi tốc độ phát video
// @namespace    http://tampermonkey.net/
// @version      29.08
// @description  Hiển thị tốc độ phát hiện tại ở góc trên bên trái trong 8 giây.
// @author       NB's
// @match        *://*/*
// @icon        https://i.postimg.cc/Gtmc4XL4/20240820-140735642.png
// @grant        none
// ==/UserScript==

(function() {
    var speed = 1.2;

    if (document.activeElement) {
        document.activeElement.blur();
    }

    setInterval(function() {
        videospeed();
    }, 6000);

    function videospeed() {
        var style = "\t<style>\t\t.speedlabel{\t\t\tposition:absolute;\t\t\tz-index:999;\t\t\twidth:30px;\t\t\tleft:10px;\t\t\ttop:10px;\t\t\ttext-align: center;\t\t\tcolor:#B3D571;\t\t\tbackground-color:rgba(0,0,0,0.3);\t\t\tfont-size:12px;\t\t}\t</style>\t";
        var videos = document.querySelectorAll("video");
        for (var i = 0; i < videos.length; i++) {
            if (videos[i] && !videos[i].paused && videos[i].readyState >= 2) { // Chỉ xử lý video đang phát
                videos[i].playbackRate = speed;
                videos[i].mozPreservesPitch = videos[i].webkitPreservesPitch = videos[i].preservePitch = true;
            
                if (!videos[i].hasAttribute("speedlabel")) {
                    videos[i].setAttribute("speedlabel", "true");
                    var speedlabel = '<div class="speedlabel">' + speed + "𝚡" + "</div>";
                    videos[i].insertAdjacentHTML("beforebegin", speedlabel + style);

                    // Tự động ẩn nhãn sau 8 giây
                    (function(video) {
                        setTimeout(function() {
                            var label = video.previousElementSibling;
                            if (label && label.classList.contains("speedlabel")) {
                                label.remove();
                            }
                            video.removeAttribute("speedlabel");
                        }, 8000);
                    })(videos[i]);
                }
            }
        }
    }
})();
