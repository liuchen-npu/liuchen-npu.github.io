// 首页全屏视频背景加载
(function () {
  const videoConfig = {
    light: '/img/background.mp4',
    dark: '/img/background.mp4',
  };

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function injectVideo(src) {
    const old = document.getElementById('page-video-bg');
    if (old) { old.src = src; old.load(); old.play().catch(() => {}); return; }

    const video = document.createElement('video');
    video.id = 'page-video-bg';
    video.src = src;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    // 固定定位铺满整个页面，作为全局背景
    video.className = 'pl-container';
    document.body.insertBefore(video, document.body.firstChild);
    video.play().catch(() => {});
  }

  function init() {
    if (location.pathname !== '/') { removeVideo(); return; }
    const theme = getCurrentTheme();
    injectVideo(videoConfig[theme] || videoConfig.light);
  }

  function removeVideo() {
    const old = document.getElementById('page-video-bg');
    if (old) old.remove();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('pjax:complete', init);

  new MutationObserver(() => {
    if (location.pathname !== '/') return;
    const theme = getCurrentTheme();
    injectVideo(videoConfig[theme] || videoConfig.light);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

})();
