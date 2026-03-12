var posts=["posts/1e677d67.html","posts/30a4ae8f.html","posts/7a6a6b5a.html","posts/cfebe72b.html","posts/d9093649.html","posts/826fa4ae.html","posts/a155555c.html","posts/a8f1c3d7.html","posts/b4d6e913.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };