---
layout: single
title: "How to Delete a User in Deis Workflow"
date: 2016-07-19T04:29:58-07:00
author: "Garry Dolley"
excerpt: Deleting an unwanted user in Deis isn't always obvious
tags: deis
---

In the current transition from [Deis](http://deis.com) 1.x ("Deis PaaS")
to 2.x ("Deis Workflow"), some of the documentation for 2.x is currently
sparse.  I found the simple act of deleting an unwanted user to be
undocumented.

Never fear, we'll help you.

First, logout of your current session:


```sh
$ deis logout
```

Become an admin user:


```sh
$ deis login https://deis.yourdomain.com
username: admin
password:
Logged in as admin
$
```

Now delete the user you wish with the following command:

```sh
$ deis auth:cancel --username=johndoe
```

That's all there is to it!
