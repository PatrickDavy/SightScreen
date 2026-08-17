Ink notification bar for transient results and honest failures; one sentence, says what to do next.

```jsx
<Toast tone="good" onDismiss={hide}>Saved. 14 balls measured.</Toast>
<Toast tone="over">Too shaky to read. Prop the phone on something solid and go again.</Toast>
```

Fixed-position wrapper and timing belong to the consumer.
