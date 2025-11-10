import React from "react";
import toast from "react-hot-toast";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("🧨 Uncaught React Error:", error, info);
    toast.error("Something went wrong. Please refresh the page.");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <h1 className="text-2xl font-bold mb-2">⚠️ Oops!</h1>
          <p className="text-gray-600">Something went wrong. Please reload.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
