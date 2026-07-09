import { Component } from 'react';

// Keeps a single page error from blanking the entire SPA (and the shared
// transition overlay / cursor). Shows a minimal fallback instead.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('Page error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: '#fff', padding: '40px', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong on this page.</h2>
          <a href="/" style={{ color: '#fff' }}>
            Return home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
