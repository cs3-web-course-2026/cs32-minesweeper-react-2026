+export default function GameStatus({ status, time }) {
+  let message = '';
+
+  if (status === 'win') {
+    message = `You won in ${time} seconds!`;
+  } else if (status === 'lose') {
+    message = 'Game Over! You hit a mine.';
+  }
+
+  return (
+    <div role="status" aria-live="polite">
+      {message && <h2>{message}</h2>}
+    </div>
+  );
+}
