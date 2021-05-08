# SandBox Pi

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
```

Example with sensor DS18B20 (5v)

```javascript
var w1_dev = W1.getDevices(),
    sensor = W1.DS18B20(w1_dev[0].addr);
 
setInterval(function() {
    CONSOLE.log(sensor.getTemperatureC());
    CONSOLE.log(sensor.getTemperatureF());
}, 3000);
```
Example with sensor HC-SC04 (5v)

```javascript
var hc_sc04 = HC_SC04(15, 16); // wPi колонка
setInterval(function() {
    CONSOLE.log(hc_sc04.getDistanceCM());
}, 1000);
```
