Example with led indicator

```javascript
GPIO.mode(30, GPIO.OUTPUT);
setInterval(function() {
   var state = GPIO.read(30);
 
   if (state === GPIO.HIGH)
      GPIO.write(30, GPIO.LOW);
   else
      GPIO.write(30, GPIO.HIGH);
}, 2000);
````
