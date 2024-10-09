// ==UserScript==
// @name         Twitter Video Saver
// @name:vi      Tải trực tiếp video Twitter
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Download Twitter videos easily with button open direct video link
// @description:viThêm nút tải xuống để mở link trực tiếp đến vifdeo trên Twitter
// @author       lenhutbinh
// @icon         https://i.postimg.cc/sXtc64SS/twdl.png
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
    const CONFIG = {
        selectors: {
            main: "main[role='main'] section[role='region']",
            group: "[id^='id'][role='group']"
        },
        buttonColor: '#31CD79',
        checkInterval: 2000
    };

    function createDownloadButton(videoUrl) {
        const btn = document.createElement('a');
        Object.assign(btn, {
            href: videoUrl,
            target: '_blank',
            className: 'tw-dl-btn',
            title: 'Download'
        });
        btn.style.cssText = `display:flex;place-self:center;color:${CONFIG.buttonColor}`;
        btn.innerHTML = '<svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12L12 16M12 16L16 12M12 16V6.8C12 5.4 12 4.7 11.4 3.9C11.1 3.4 10 2.8 9.4 2.7C8.5 2.6 8.1 2.8 7.4 3.1C4.2 4.8 2 8.1 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 8.3 20 5.1 17 3.3"/></svg>';
        return btn;
    }

    function getTweetInfo(main) {
        try {
            const react = Object.entries(main.parentElement).find(([key]) => key.startsWith("__reactFiber"));
            return react?.[1]?.memoizedProps?.children
                ?.filter(el => el?._owner)
                .map(el => el._owner.memoizedProps.focalTweet)
                .find(Boolean);
        } catch (error) {
            console.error('Tweet info extraction failed:', error);
            return null;
        }
    }

    const processPage = debounce(() => {
        const doc = unsafeWindow.wrappedJSObject?.document || document;
        const main = doc.querySelector(CONFIG.selectors.main);
        if (!main) return;

        const tweet = getTweetInfo(main);
        if (!tweet?.extended_entities?.media?.some(el => el.video_info)) return;

        const tweetEl = doc.querySelector(`a[href*="${tweet.id_str}"]`);
        const group = tweetEl?.closest('article')?.querySelector(CONFIG.selectors.group);
        if (!group || group.querySelector('.tw-dl-btn')) return;

        tweet.extended_entities.media
            .filter(el => el.video_info)
            .forEach(media => {
                const videoUrl = media.video_info.variants
                    .filter(v => v.content_type === "video/mp4")
                    .sort((a, b) => b.bitrate - a.bitrate)[0]?.url?.replace(/\?tag=.*/, "");
                if (videoUrl) group.appendChild(createDownloadButton(videoUrl));
            });
    }, 250);

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    new MutationObserver(processPage).observe(document.body, {
        childList: true,
        subtree: true
    });
    setInterval(processPage, CONFIG.checkInterval);
})();
