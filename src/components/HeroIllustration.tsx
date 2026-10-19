// איור פשוט: אדם רגיל ליד מחשב, עם כוס קפה ופתק "עוד שעה פנויה".
export function HeroIllustration() {
  return (
    <svg viewBox="0 0 420 360" role="img" aria-label="איור של אדם יושב מול מחשב נייד ועובד ברוגע" className="h-auto w-full">
      <ellipse cx="210" cy="330" rx="180" ry="18" fill="#f1dcc6" />
      <circle cx="320" cy="80" r="56" fill="#fbd7a8" />
      <rect x="70" y="250" width="290" height="16" rx="8" fill="#a35a3a" />
      <rect x="95" y="266" width="12" height="62" rx="4" fill="#a35a3a" />
      <rect x="323" y="266" width="12" height="62" rx="4" fill="#a35a3a" />
      {/* person */}
      <path d="M150 250c0-52 22-86 62-86s62 34 62 86Z" fill="#c2552d" />
      <circle cx="212" cy="122" r="34" fill="#e7a978" />
      <path d="M178 118c0-26 16-40 36-40s34 12 34 34c-12-10-34-12-48-4-8 4-16 8-22 10Z" fill="#4a2c1d" />
      <circle cx="200" cy="125" r="3" fill="#3a2418" />
      <circle cx="224" cy="125" r="3" fill="#3a2418" />
      <path d="M203 138c6 5 13 5 19 0" stroke="#3a2418" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* laptop */}
      <path d="M150 182h124l-12 68H162Z" fill="#3d3a36" />
      <rect x="120" y="244" width="184" height="8" rx="4" fill="#5b5752" />
      <circle cx="212" cy="214" r="9" fill="#f6efe6" />
      {/* coffee */}
      <rect x="318" y="222" width="26" height="28" rx="5" fill="#fffaf3" stroke="#a35a3a" strokeWidth="3" />
      <path d="M344 230c10 0 10 14 0 14" stroke="#a35a3a" strokeWidth="3" fill="none" />
      <path d="M326 212c-4-6 4-8 0-14M336 212c-4-6 4-8 0-14" stroke="#c9a68a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* note */}
      <g transform="rotate(-6 80 190)">
        <rect x="40" y="150" width="96" height="74" rx="8" fill="#fff6c9" stroke="#e5c860" strokeWidth="2" />
        <text x="88" y="182" textAnchor="middle" fontSize="15" fontWeight="700" fill="#4a2c1d">עוד שעה</text>
        <text x="88" y="204" textAnchor="middle" fontSize="15" fontWeight="700" fill="#4a2c1d">פנויה ✓</text>
      </g>
    </svg>
  );
}
