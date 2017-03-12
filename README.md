[![mastertime](http://worn.online/timeMaster/mt-logo.jpg)](http://worn.online/)
It allows you to create timers by writing very few JavaScript code.


#### install mastertime
```html
<head>
    <script scr="mastertime-1.0.0.js">
</head>
```

#### Timers trigger.

```html
<body onload="MT.build()">
    <!--- --->
</body>
```

#### or


```js
window.addEventListener('load', function(){
    MT.build();
});
```


.
.
.
.
.
.


## Mastertime Attributes


#### mt-time
This feature is necessary to set up a counter. If not specified, it will not work.
Zero by default
```html
<div mt-time></div> <!--- output: 00:00:00 Up count --->

<div mt-time="60"></div> <!--- output: 00:00:60 Down count--->
```

#### mt-end
It is meant to indicate when the timer will stop.

Zero by default if down count,
Infinite by default if up count

```html
<div mt-time="60" mt-end="21"></div>
```


#### mt-way
It is meant to indicate what direction the timer will count.

```html
<div mt-time="0" mt-way="up"></div>
<div mt-time="60" mt-way="down"></div>
```

#### mt-show

It is to specify how the timer will be displayed.

```html
<div mt-time="60" mt-show="h:m:s"></div> <!--- output: 00:00:60 --->
<div mt-time="60" mt-show="m:s"></div>   <!--- output: 00:60 --->
<div mt-time="60" mt-show="s"></div>     <!--- output: 60 --->
```
#### mt-start
It allows you to run a function/jscode when the timer starts.

```html
<div mt-time="60" mt-start="console.log('timer start.');"></div>
```

#### mt-interval
You can run a function as long as the timer is running.

```html
<div mt-time="60" mt-interval="console.log('timer interval.');"></div>
```
#### mt-complete
You can run a function when the timer stops.

```html
<div mt-time="60" mt-complete="console.log('timer complete.');"></div>
```
#### mt-name
Your timer will give you a name. This name is a tag that timer is needed to stop from the outside.

```html
<div mt-time="60" mt-name="visitTimer" mt-complete="console.log('visit timer complete')"></div>

<button onclick="MT.destroy('visitTimer')"></button>       <!--- mt-complete will not work. --->
<button onclick="MT.destroy('visitTimer', true)"></button> <!--- mt-complete will work. --->
```

License
----

MIT
