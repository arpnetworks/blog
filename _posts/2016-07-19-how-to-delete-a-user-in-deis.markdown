---
layout: post
title: "How to Delete a User in Deis Workflow"
date: 2016-07-19T04:29:58-07:00
author: "Garry Dolley"
---

In the current transition from [Deis](http://deis.com) 1.x ("Deis PaaS")
to 2.x ("Deis Workflow"), some of the documentation for 2.x is currently
sparse.  I found the simple act of deleting an unwanted user to be
undocumented.

Never fear, we'll help you.

First, logout of your current session:


```
$ deis logout
```

Become an admin user:


```
$ deis login https://deis.yourdomain.com
username: admin
password:
Logged in as admin
$
```

Now delete the user you wish:

```
$ deis auth:cancel --username=johndoe
```

That's all there is to it!
