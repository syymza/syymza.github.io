---
layout: page
title: Welcome
tagline: The homepage
---

Work in progress...

## Recent Posts

Here's a list of my latest posts:

<ul class="posts">		
  {% for post in site.posts %}		
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>		
  {% endfor %}		
</ul>


