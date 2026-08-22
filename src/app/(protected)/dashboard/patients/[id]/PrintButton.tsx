'use client';

// Print is a browser action — must live in a client component.
export default function PrintButton() {
  return (
    <button className="button-secondary" onClick={() => window.print()}>
      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16V6a2 2 0 012-2h6a2 2 0 012 2v10m-9 4h4m-4 0l6-6m0 0l-6 6m6-6v.01" />
      </svg>
      Print Report
    </button>
  );
}
