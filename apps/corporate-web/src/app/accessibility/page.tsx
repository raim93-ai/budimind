import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility | BudiMind Corporate',
  description:
    'Accessibility statement for BudiMind Corporate - our commitment to digital accessibility.',
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900/40">
      <div className="container">
        <h2 className="text-3xl font-bold text-primary mb-6">Accessibility</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Our Commitment to Accessibility</h3>
          <p className="text-secondary mb-6">
            BudiMind Corporate is committed to ensuring digital accessibility for people with
            disabilities. We are continually improving the user experience for everyone and applying
            the relevant accessibility standards.
          </p>
          <div className="space-y-4 text-left">
            <div>
              <h4 className="font-medium mb-2">Web Content Accessibility Guidelines (WCAG)</h4>
              <p className="text-secondary mb-3">
                We aim to conform to{' '}
                <a
                  href="https://www.w3.org/WAI/WCAG21/quickref/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WCAG 2.1 Level AA guidelines
                </a>
                , which includes:
              </p>
              <ul className="list-disc pl-5">
                <li>Perceivable: Text alternatives, captivating content, adaptable layout</li>
                <li>Operable: Keyboard accessible, sufficient time to read and use content</li>
                <li>Understandable: Readable text, predictable navigation, error prevention</li>
                <li>
                  Robust: Compatible with current and future user tools, including assistive
                  technologies
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Features</h4>
              <ul className="list-disc pl-5">
                <li>Screen reader compatible navigation and forms</li>
                <li>Keyboard-accessible throughout the site</li>
                <li>
                  Sufficient color contrast ratios (minimum 4.5:1) — verified with{' '}
                  <a
                    href="https://webaim.org/resources/contrastchecker/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    WebAIM Contrast Checker
                  </a>
                </li>
                <li>Responsive design that works on all device sizes</li>
                <li>Clear focus indicators for interactive elements</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Getting Help</h4>
              <p className="text-secondary mb-3">
                If you experience difficulty accessing any part of BudiMind Corporate, please
                contact us:
              </p>
              <div className="mt-4">
                <a href="/contact" className="text-primary hover:underline">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
          <p className="mt-8 text-secondary text-sm">Last updated: January 2024</p>
        </div>
      </div>
    </div>
  );
}
