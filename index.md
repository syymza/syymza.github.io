---
layout: page
title: Welcome
tagline: The homepage

---

##Recent Projects

<div class="row">
  <div class="col-sm-6 col-md-6">
    <div class="thumbnail">
      <a href="https://github.com/syymza/js-on-hn-emailer"><img src="resources/js-on-hn.png" alt="Javascript on Hacker News"></a>
      <div class="caption">
        <h3><a href="https://github.com/syymza/js-on-hn-emailer">Javascript on Hacker News</a></h3>
        <p><a href="https://github.com/syymza/js-on-hn-emailer">Get Notified When Someone Posts An Article From About Javascript on Hacker News Using io.js, Firebase and Email.js</a></p>
      </div>
    </div>
  </div>
</div> 

##Recent Posts

Here's a list of my latest posts:

<ul class="posts">		
  {% for post in site.posts %}		
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>		
  {% endfor %}		
</ul>


