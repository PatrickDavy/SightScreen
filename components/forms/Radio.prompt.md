Radio group for one-of choices too long for a SegmentedControl (bowling arm, camera position).

```jsx
<Radio name="arm" value="right" label="Right arm" checked={arm === 'right'} onChange={setArm} />
<Radio name="arm" value="left" label="Left arm" checked={arm === 'left'} onChange={setArm} />
```

Stack vertically with 10px gap.
