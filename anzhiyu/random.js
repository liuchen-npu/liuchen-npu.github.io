var posts=["posts/d72de449.html","posts/7a6a6b5a.html","posts/1e677d67.html","posts/eeaf5d86.html","posts/cfebe72b.html","posts/d9093649.html","posts/30a4ae8f.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };