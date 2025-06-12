import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BibleBuddy() {
  const [messages, setMessages] = useState([
    { from: "buddy", text: "Hello, friend! I'm Bible Buddy. Want to talk about Jesus or learn a Bible verse today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "buddy", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "buddy", text: "Oops! Something went wrong." }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-start p-4">
      <img src="/jesus-avatar.png" alt="Bible Buddy" className="w-24 h-24 rounded-full shadow mb-4" />
      <h1 className="text-2xl font-bold mb-2">Bible Buddy</h1>
      <Card className="w-full max-w-md bg-white shadow-xl rounded-2xl">
        <CardContent className="p-4 h-[400px] overflow-y-auto space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={\`p-2 rounded-lg max-w-[80%] \${msg.from === "user" ? "ml-auto bg-blue-200" : "mr-auto bg-yellow-100"}\`}
            >
              {msg.text}
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex mt-4 w-full max-w-md">
        <input
          type="text"
          className="flex-1 p-2 rounded-l-xl border-t border-b border-l border-gray-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask Bible Buddy..."
        />
        <Button className="rounded-r-xl" onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </Button>
      </div>
      <p className="text-sm text-gray-500 mt-2">🎙️ Voice coming soon!</p>
    </div>
  );
}