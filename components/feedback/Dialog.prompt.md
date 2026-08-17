Modal for one decision (delete a session, confirm over-limit bowling). Title states the decision; footer holds Buttons — cancel as secondary, confirm as primary (danger if destructive).

```jsx
<Dialog open={open} title="Delete this session?" onClose={close}
  footer={<><Button variant="secondary" onClick={close}>Keep it</Button><Button variant="danger" onClick={del}>Delete</Button></>}>
  14 balls and their measurements will be gone for good.
</Dialog>
```
