var posts=["posts/1e677d67.html","posts/d72de449.html","posts/3856b9e0.html","posts/ffbc14c2.html","posts/eeaf5d86.html","posts/7a6a6b5a.html","posts/cfebe72b.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };