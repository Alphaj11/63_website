/**
 * Bibliothèque SVG des ingrédients (dégradés + symboles).
 * Chaque symbole est centré sur (0,0) et dessiné à l'échelle ~40px.
 * Ce sont des illustrations vectorielles : elles ne prétendent pas être des photos.
 * Un `id` de préfixe permet d'avoir plusieurs scènes sur une même page.
 */
export function IngredientDefs({ p }: { p: string }) {
  const id = (s: string) => `${p}-${s}`;
  const u = (s: string) => `url(#${p}-${s})`;
  return (
    <defs>
      {/* ---------- Dégradés ---------- */}
      <radialGradient id={id('g-doner')} cx="40%" cy="35%" r="75%">
        <stop offset="0" stopColor="#b8703d" />
        <stop offset="0.45" stopColor="#8a4a22" />
        <stop offset="1" stopColor="#4a2311" />
      </radialGradient>
      <radialGradient id={id('g-chicken')} cx="40%" cy="35%" r="75%">
        <stop offset="0" stopColor="#f0c27a" />
        <stop offset="0.5" stopColor="#d18f44" />
        <stop offset="1" stopColor="#8f5122" />
      </radialGradient>
      <radialGradient id={id('g-breaded')} cx="40%" cy="30%" r="80%">
        <stop offset="0" stopColor="#f6cf85" />
        <stop offset="0.6" stopColor="#d99540" />
        <stop offset="1" stopColor="#9a5a1f" />
      </radialGradient>
      <linearGradient id={id('g-merguez')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c2512e" />
        <stop offset="0.5" stopColor="#8e2d17" />
        <stop offset="1" stopColor="#4f170c" />
      </linearGradient>
      <radialGradient id={id('g-steak')} cx="40%" cy="35%" r="75%">
        <stop offset="0" stopColor="#7a4026" />
        <stop offset="1" stopColor="#331509" />
      </radialGradient>
      <radialGradient id={id('g-lettuce')} cx="50%" cy="60%" r="70%">
        <stop offset="0" stopColor="#d9f29a" />
        <stop offset="0.55" stopColor="#7fc04a" />
        <stop offset="1" stopColor="#3d7d2a" />
      </radialGradient>
      <radialGradient id={id('g-tomato')} cx="45%" cy="40%" r="65%">
        <stop offset="0" stopColor="#ff7a5a" />
        <stop offset="0.7" stopColor="#d8301f" />
        <stop offset="1" stopColor="#8f1610" />
      </radialGradient>
      <linearGradient id={id('g-fry')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c98a2c" />
        <stop offset="0.35" stopColor="#f7d37a" />
        <stop offset="0.7" stopColor="#f0c060" />
        <stop offset="1" stopColor="#b97a24" />
      </linearGradient>
      <radialGradient id={id('g-cheddar')} cx="45%" cy="40%" r="70%">
        <stop offset="0" stopColor="#ffc657" />
        <stop offset="1" stopColor="#e38a12" />
      </radialGradient>
      <radialGradient id={id('g-cheese')} cx="50%" cy="40%" r="70%">
        <stop offset="0" stopColor="#ffe08a" />
        <stop offset="0.7" stopColor="#f5bd3c" />
        <stop offset="1" stopColor="#d9921a" />
      </radialGradient>
      <radialGradient id={id('g-yolk')} cx="40%" cy="35%" r="70%">
        <stop offset="0" stopColor="#ffd25a" />
        <stop offset="1" stopColor="#f08c0c" />
      </radialGradient>
      <radialGradient id={id('g-pickle')} cx="45%" cy="40%" r="70%">
        <stop offset="0" stopColor="#c8d97a" />
        <stop offset="1" stopColor="#5f7a24" />
      </radialGradient>
      <filter id={id('f-soft')} x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#000" floodOpacity="0.45" />
      </filter>
      <filter id={id('f-gloss')} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="0.6" />
      </filter>

      {/* ---------- Viandes ---------- */}
      <symbol id={id('doner')} overflow="visible">
        <path d="M-22,-6 C-14,-11 -4,-8 4,-10 C12,-12 20,-8 23,-3 C25,3 18,8 10,7 C2,9 -8,10 -16,8 C-24,6 -27,-2 -22,-6Z" fill={u('g-doner')} />
        <path d="M-18,-3 C-8,-6 4,-4 18,-5" stroke="#2c1208" strokeWidth="1.6" fill="none" opacity=".6" strokeLinecap="round" />
        <path d="M-15,4 C-6,2 6,4 14,2" stroke="#d9925a" strokeWidth="1.2" fill="none" opacity=".55" strokeLinecap="round" />
        <circle cx="-10" cy="1" r="1.6" fill="#2a0f05" opacity=".7" />
        <circle cx="9" cy="-1" r="1.3" fill="#2a0f05" opacity=".6" />
      </symbol>
      <symbol id={id('chicken')} overflow="visible">
        <path d="M-14,-9 C-6,-14 8,-12 14,-6 C18,0 15,9 6,11 C-3,13 -14,10 -16,3 C-18,-3 -17,-6 -14,-9Z" fill={u('g-chicken')} />
        <path d="M-10,-6 L6,8 M-4,-10 L12,3" stroke="#6b3412" strokeWidth="2" opacity=".55" strokeLinecap="round" />
        <ellipse cx="-4" cy="-4" rx="5" ry="2.4" fill="#fff4d6" opacity=".35" />
      </symbol>
      <symbol id={id('minced')} overflow="visible">
        <circle cx="-7" cy="-2" r="6" fill={u('g-steak')} />
        <circle cx="4" cy="-4" r="5" fill={u('g-doner')} />
        <circle cx="0" cy="5" r="5.5" fill={u('g-steak')} />
        <circle cx="9" cy="4" r="4" fill={u('g-doner')} />
        <circle cx="-9" cy="6" r="3.4" fill={u('g-doner')} />
        <circle cx="-2" cy="-3" r="1.2" fill="#e0a26a" opacity=".5" />
      </symbol>
      <symbol id={id('cordon')} overflow="visible">
        <rect x="-19" y="-12" width="38" height="24" rx="9" fill={u('g-breaded')} />
        <path d="M-12,0 C-4,-3 4,3 12,0" stroke="#f8e7b6" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d="M-12,0 C-4,-3 4,3 12,0" stroke="#e9a3a0" strokeWidth="1.4" fill="none" strokeLinecap="round" transform="translate(0,4)" />
        {[[-12, -7], [-4, -8], [6, -7], [13, -5], [-14, 7], [2, 8], [12, 7]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.1" fill="#8a4c16" opacity=".7" />
        ))}
      </symbol>
      <symbol id={id('tenders')} overflow="visible">
        <path d="M-22,-4 C-16,-10 12,-9 21,-5 C25,-1 23,6 16,7 C4,9 -12,9 -20,5 C-24,2 -24,-1 -22,-4Z" fill={u('g-breaded')} />
        {[[-14, -3], [-6, 2], [3, -4], [10, 3], [16, -2]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.3" fill="#9b5a1c" opacity=".65" />
        ))}
      </symbol>
      <symbol id={id('merguez')} overflow="visible">
        <rect x="-21" y="-6" width="42" height="12" rx="6" fill={u('g-merguez')} />
        <path d="M-16,-3 L16,-3" stroke="#f2a07a" strokeWidth="1.4" opacity=".55" strokeLinecap="round" />
        <path d="M-10,-6 L-6,6 M2,-6 L6,6 M12,-6 L15,4" stroke="#2b0c05" strokeWidth="1.4" opacity=".5" />
      </symbol>
      <symbol id={id('steak')} overflow="visible">
        <ellipse cx="0" cy="0" rx="22" ry="17" fill={u('g-steak')} />
        <path d="M-14,-8 L12,8 M-16,2 L4,14 M-6,-14 L18,0" stroke="#160804" strokeWidth="2.6" opacity=".7" strokeLinecap="round" />
        <ellipse cx="-6" cy="-6" rx="7" ry="3" fill="#b0704a" opacity=".3" />
      </symbol>

      {/* ---------- Légumes ---------- */}
      <symbol id={id('lettuce')} overflow="visible">
        <path d="M-20,2 C-22,-6 -14,-12 -8,-10 C-6,-16 2,-17 6,-12 C12,-16 20,-10 18,-3 C24,0 22,10 14,10 C10,15 0,15 -4,11 C-10,14 -20,10 -20,2Z" fill={u('g-lettuce')} />
        <path d="M-14,4 C-6,0 4,-2 14,-6" stroke="#eaf8c0" strokeWidth="1.4" fill="none" opacity=".8" strokeLinecap="round" />
        <path d="M-4,1 L-2,-7 M5,-2 L8,-9" stroke="#eaf8c0" strokeWidth="1" opacity=".6" strokeLinecap="round" />
      </symbol>
      <symbol id={id('tomato')} overflow="visible">
        <circle r="14" fill={u('g-tomato')} />
        <circle r="10.5" fill="none" stroke="#ff9e80" strokeWidth="1.2" opacity=".7" />
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-5.5" rx="3" ry="4.2" fill="#ffb14a" opacity=".75" transform={`rotate(${a})`} />
        ))}
        <circle r="2.4" fill="#ffd0b0" opacity=".8" />
      </symbol>
      <symbol id={id('onion')} overflow="visible">
        <circle r="12" fill="none" stroke="#f4ecdc" strokeWidth="3.2" />
        <circle r="7" fill="none" stroke="#efe3c8" strokeWidth="2.4" opacity=".9" />
      </symbol>
      <symbol id={id('redonion')} overflow="visible">
        <circle r="12" fill="none" stroke="#8d2f6a" strokeWidth="3.2" />
        <circle r="12" fill="none" stroke="#f3d6ea" strokeWidth="1" />
        <circle r="7" fill="none" stroke="#a8427f" strokeWidth="2.4" opacity=".9" />
      </symbol>
      <symbol id={id('cabbage')} overflow="visible">
        <path d="M-18,-4 C-8,-10 6,-8 18,-2" stroke="#6d2a73" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M-16,4 C-4,-1 8,2 16,6" stroke="#8e3d92" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M-10,0 C-2,-3 6,-1 12,1" stroke="#e7c7ea" strokeWidth="1" fill="none" strokeLinecap="round" />
      </symbol>
      <symbol id={id('pickle')} overflow="visible">
        <ellipse rx="10" ry="9" fill={u('g-pickle')} />
        <ellipse rx="6.5" ry="5.5" fill="#e3eba6" opacity=".6" />
        {[0, 90, 180, 270].map((a) => <circle key={a} cx="0" cy="-3" r="1" fill="#6c7d2a" transform={`rotate(${a})`} />)}
      </symbol>
      <symbol id={id('corn')} overflow="visible">
        {[[-5, -4], [3, -5], [-2, 3], [6, 3], [-8, 4]].map(([x, y], i) => (
          <rect key={i} x={x - 3} y={y - 3.5} width="6.5" height="7" rx="2.6" fill="#ffd23f" stroke="#e0a81a" strokeWidth=".8" />
        ))}
      </symbol>
      <symbol id={id('olive')} overflow="visible">
        <ellipse rx="7" ry="6" fill="none" stroke="#1d1a17" strokeWidth="4.5" />
        <path d="M-4,-4 A6,5 0 0 1 3,-5" stroke="#6a625a" strokeWidth="1.2" fill="none" />
      </symbol>
      <symbol id={id('carrot')} overflow="visible">
        <path d="M-16,-3 C-6,-7 6,-6 16,-1" stroke="#f08a24" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M-14,3 C-4,1 6,3 14,5" stroke="#e5731a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </symbol>
      <symbol id={id('pepper')} overflow="visible">
        <path d="M-18,0 C-10,-10 10,-10 18,-2 C12,-5 -10,-5 -18,0Z" fill="#c9311f" stroke="#7d160c" strokeWidth=".8" />
        <path d="M-16,6 C-6,0 8,0 16,5 C8,3 -6,3 -16,6Z" fill="#4c8a2a" stroke="#2a5216" strokeWidth=".8" />
      </symbol>

      {/* ---------- Accompagnements & extras ---------- */}
      <symbol id={id('fries')} overflow="visible">
        <rect x="-3.5" y="-20" width="7" height="40" rx="2" fill={u('g-fry')} />
        <rect x="-1" y="-17" width="1.4" height="30" fill="#fff3c4" opacity=".5" />
      </symbol>
      <symbol id={id('rice')} overflow="visible">
        {Array.from({ length: 16 }).map((_, i) => {
          const a = i * 2.399; const r = 2.4 * Math.sqrt(i + 1);
          return <ellipse key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} rx="2.6" ry="1.3" fill={i % 3 ? '#fbf7ea' : '#e9e1cb'} transform={`rotate(${(i * 47) % 180} ${Math.cos(a) * r} ${Math.sin(a) * r})`} />;
        })}
      </symbol>
      <symbol id={id('bulgur')} overflow="visible">
        {Array.from({ length: 18 }).map((_, i) => {
          const a = i * 2.399; const r = 2.3 * Math.sqrt(i + 1);
          return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r="1.6" fill={i % 2 ? '#c9954e' : '#a8742f'} />;
        })}
      </symbol>
      <symbol id={id('cheddar')} overflow="visible">
        <path d="M-14,-13 L14,-13 L15,8 C12,10 11,16 8,16 C5,16 5,10 1,11 C-3,12 -4,18 -8,17 C-11,16 -10,10 -15,9 Z" fill={u('g-cheddar')} />
        <path d="M-10,-9 L8,-9" stroke="#ffe3a0" strokeWidth="1.6" opacity=".7" strokeLinecap="round" />
      </symbol>
      <symbol id={id('grated')} overflow="visible">
        {[-8, -2, 4, 9].map((x, i) => (
          <path key={i} d={`M${x - 6},${-6 + i * 3} q6,-4 12,${2 - i}`} stroke={i % 2 ? '#f7d264' : '#fbe08a'} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        ))}
      </symbol>
      <symbol id={id('egg')} overflow="visible">
        <path d="M-20,2 C-22,-10 -6,-16 4,-13 C16,-12 22,-4 19,6 C16,15 -2,16 -10,13 C-16,11 -19,8 -20,2Z" fill="#fbf8f1" />
        <circle cx="0" cy="0" r="7.5" fill={u('g-yolk')} />
        <ellipse cx="-2.5" cy="-2.5" rx="2.4" ry="1.4" fill="#fff" opacity=".7" />
      </symbol>
      <symbol id={id('butter')} overflow="visible">
        <path d="M-14,-4 L0,-11 L14,-4 L0,3 Z" fill="#fff3b8" />
        <path d="M-14,-4 L0,3 L0,13 L-14,6 Z" fill="#f1d77a" />
        <path d="M14,-4 L0,3 L0,13 L14,6 Z" fill="#e2c35c" />
      </symbol>
    </defs>
  );
}
