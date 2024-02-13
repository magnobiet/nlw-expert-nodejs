import { ReadyState } from "react-use-websocket";

export function SocketStatus({
  readyState,
}: Readonly<{ readyState: ReadyState }>) {
  const connectionStatus = {
    [ReadyState.CONNECTING]: { text: "connecting", styles: "bg-lime-600" },
    [ReadyState.OPEN]: { text: "open", styles: "bg-green-600" },
    [ReadyState.CLOSING]: { text: "closing", styles: "bg-orange-600" },
    [ReadyState.CLOSED]: { text: "closed", styles: "bg-red-600" },
    [ReadyState.UNINSTANTIATED]: {
      text: "uninstantiated",
      styles: "bg-slate-600",
    },
  }[readyState];

  return (
    <p
      className={`fixed right-8 bottom-8 px-4 py-2 rounded-lg ${connectionStatus.styles}`}
    >
      WebSocket {connectionStatus.text}
    </p>
  );
}
