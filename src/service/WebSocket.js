// websocket.js
class WebSocketService {
    static instance = null;
  
    static getInstance() {
      if (!this.instance) {
        this.instance = new WebSocketService();
      }
      return this.instance;
    }
  
    constructor() {
      this.socket = null;
      this.callbacks = [];
    }
  
    connect(url) {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        this.socket = new WebSocket(url);
  
        this.socket.onopen = () => {
          console.log("WebSocket connection established");
        };
  
        this.socket.onmessage = (event) => {
          this.callbacks.forEach((callback) => callback(event.data));
        };
  
        this.socket.onclose = () => {
          console.log("WebSocket connection closed");
        };
  
        this.socket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
      }
    }
  
    sendMessage(message) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(message);
      } else {
        console.error("WebSocket is not open");
      }
    }
  
    addMessageListener(callback) {
      this.callbacks.push(callback);
    }
  
    removeMessageListener(callback) {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    }
  }
  
  export default WebSocketService;
  
  