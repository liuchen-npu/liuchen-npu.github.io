var posts=["posts/4a17b156.html","posts/hexo-tutorial.html","posts/3bf4a27.html","posts/9520.html","posts/study-methods.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };