Dropdown for 4+ options (age group, club, bowling style); for 2–3 options use SegmentedControl instead.

```jsx
<Select label="Age group" options={["U13","U15","U17","U19","Open"]} value={age} onChange={e => setAge(e.target.value)} />
```
