var posts=["posts/d72de449.html","posts/1e677d67.html","posts/7a6a6b5a.html","posts/30a4ae8f.html","posts/d9093649.html","posts/cfebe72b.html","posts/a8f1c3d7.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };