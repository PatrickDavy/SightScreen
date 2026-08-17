The signature readout — value in condensed display type, error band and evidence in mono. Every measured number in the product goes through it.

```jsx
<Metric label="Fastest ball" value="116.2" unit="km/h" band={2.3} sample="from 26 frames" size="lg" />
<Metric label="Front knee flexion" value={38} unit="°" band={5} size="sm" range={{min:0,max:60,good:[0,20]}} />
```

`range` adds the band track: turf zone = target, ink block = your interval, cherry tick = point estimate.
