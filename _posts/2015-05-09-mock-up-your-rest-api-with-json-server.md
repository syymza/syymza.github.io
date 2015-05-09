---
layout: post
title: "Mock up your REST API with JSON Server"
author: Daniele Zanni
subtitle: Set up your Back End prototype in 5 minutes
description: Use JSON Server to create REST API in 5 minutes
category: Projects
header-img: "img/violet.png"
image: "img/violet.png"
tags: ['code', 'node.js', 'modules', 'back-end', 'javascript']

---
##Description

Sometimes you are hitching for starting to work on the Front End of your application (or on your new mobile app), but have to wait for your pal to finish that REST API you agreed on days ago.
You could create a static JSON file in your application, but that would be so... well.. static!

What if I told you that you can mock up that REST API you are waiting for in just 5 minutes and you can start to write your client code right now, without having to wait?
**[JSON Server](https://github.com/typicode/json-server)** is a very useful *npm module*, open source and released under the MIT licence, that allows developers to prototype their Back End quickly.
When the actual real API will be ready, it will just be a matter of switching the base URL your Front End sends requests to.

##The demo

Let's say you want to create the killer TODO app. You synchronise the list of your tasks to your Back End and you use your REST API to:
 
+ retrieve the list of tasks;
+ add a new task;
+ get the details of a specific task;
+ change the state of a task from "TO-DO" to "DONE" (and vice versa);
+ delete a task.
 
What you need is an API with an endpoint `/tasks` and the possibility to send `GET`, `POST`, `PUT`, `PATCH` and `DELETE` requests to it.
In particular:
 
+ `GET /tasks` will retrieve a list of tasks;
+ `POST /tasks` will add a task to the list of tasks;
+ `GET /tasks/:id` will retrieve a single task;
+ `PUT /tasks/:id` will edit a property of a task;
+ `DELETE /tasks/:id` will delete a task.


___________

##The tools

- **JSON Server**. The magic will happen there.
- **[Node.js](https://nodejs.org/)**. *JSON Server* is an *npm module*, hence it requires node.
- **Chrome >= v42**. Since Chrome 42, `fetch()` (*[here more](https://fetch.spec.whatwg.org/)*) is fully supported by Chrome. I can essentially send GET and POST easily for the Chrome console. Tools like **[Postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en)** are now getting dusty on my machine.

_________

##Setup

1.Install *JSON Server* as a global module:

{% highlight bash %}

$ npm install -g json-server

{% endhighlight %}

2.Create a project folder and add a file named *db.json* to it:

{% highlight bash %}

#Create the new project folder
$ mkdir json-server-api

#Enter the newly created folder
$ cd json-server-api

#Create 'db.json'
$ touch db.json

{% endhighlight %}

_________
 
##The code

There is actually no code involved. You will only have to edit your *db.json* file to specify the endpoints you want to provide.
In our case we only have a single endpoint (`/tasks`) to add, and we want to start with an empty list of tasks. Open it with your favorite editor and add the following lines:

{% highlight json %}

{
    "tasks": []
}

{% endhighlight %}

Now you can start *JSON server* and it will listen to requests on the `/tasks` endpoint and respond to them appropriately.

{% highlight bash %}

$ json-server db.json

{% endhighlight %}

That's all folks. You have your REST endpoint. Let's check with Chrome's *Developer Tools* that everything works as we expect.

__________

##Testing the endpoint

In this paragraph, I will assume you are testing on your local machine. If you are connected through `SSH` to the machine you are deploying to, I assume you will be able to change any reference to `localhost` to the IP of that machine.

By default, *JSON Server* listens to requests on the port 3000. You can verify that by going to `http://localhost:3000/` with your browser (once there you should see a nice welcome page listing the available endpoints).

Open Chrome's *Developer Tools* and go to the *Console* tab. You can easily log the list of tasks pasting the following snippet (`fetch()` uses *Javascript Promises*):

{% highlight javascript %}

fetch('http://localhost:3000/tasks/')
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json: ', json)
  }).catch(function(ex) {
    console.log('parsing failed: ', ex)
  });
      
{% endhighlight %}

Your console should at this point have logged an empty array. We do not in fact have any task yet in our *db.json*. Let's add one.
We have probably a *Model* of what a task is in our application, and we will have to serialize a JSON representation of it and send it with a `POST` to `/tasks/`.

A possible task is the following:

{% highlight json %}


{
    "title":"Add a post to the blog about Angular2",
    "dueDate": "2015-05-23T18:25:43.511Z",
    "done": false
}

{% endhighlight %}

We can post it to our `/tasks` endpoint with `fetch()` from the console:

{% highlight javascript %}

fetch('http://localhost:3000/tasks/', {
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
       "title":   "Add a blogpost about Angular2",
       "dueDate": "2015-05-23T18:25:43.511Z",
       "done": false
   })
}).then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log('parsed json: ', json)
    }).catch(function(ex) {
      console.log('parsing failed: ', ex)
    });

{% endhighlight %}

*JSON Server* will respond at this point with *201 Created* (which should be visible in the *Network* tab of the *Developer Tools*) and the newly created task with an `id` (which should be 1 since this is the first task we are adding).

<img src="{{ site.baseurl }}/img/fetch-post.png" alt="Adding the first task to our list">
<span class="caption text-muted">We have successfully added a task to the list, with id 1.</span>

We can now ask again for the list of tasks, re-sending a `GET` request to `/tasks` (this time we will see an array with a single element) or ask about a single task, sending for example a `GET` to `/tasks/1` (we should receive a single Object in the response).

Very similarly, we can now send a `PUT` on the single resource (task) request to edit the `done` property to become true:

{% highlight javascript %}

fetch('http://localhost:3000/tasks/1', {
  method: 'put',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
       "done": true
   })
}).then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log('parsed json: ', json)
    }).catch(function(ex) {
      console.log('parsing failed: ', ex)
    });
    
{% endhighlight %}
   
   
If we send another `GET` to `/task/1`,  we are going to see that the task is marked as done.

Before testing the `DELETE` request, we can also open the *db.json* file to verify that the changes are being kept up to date. You should in fact see the task you have added in the `tasks` property of the main JSON object.
*JSON Server* is using **[lowdb](https://github.com/typicode/lowdb)** under the hood to achieve the synchronization.

If you finally want to delete the task, send another request using `fetch()` passing `'delete'` in the method property:

{% highlight javascript %}

fetch('http://localhost:3000/tasks/1', {
method: 'delete'
}).then(function(response) {
   return response.json()
 }).then(function(json) {
   console.log('parsed json: ', json)
 }).catch(function(ex) {
   console.log('parsing failed: ', ex)
 });
 
{% endhighlight %}
  
Now if you fetch again the list of tasks, you should once again receive an empty array.
  
_______
  

##Conclusions

This is just a simple demo using *JSON Server* and the structure of our tasks was quite simple. You can do a lot more. For instance, you could use pagination, you can sort elements and you can make full-text searches.
Just have a look at the *JSON Server Github repository* where you will find the documentation and some examples.

More importantly, you will not have any excuse to procrastinate: you can immediately start to create a new application, even if you do not have the Back End API ready yet.