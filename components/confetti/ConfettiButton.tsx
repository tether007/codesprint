// 'use client';



// // just afew import errors
// import { useRef } from 'react';
// import confetti from 'canvas-confetti';
// import type { ConfettiRef } from '../confetti
// import { Confetti } from '@/components/confetti';

// interface ConfettiButtonProps {
//   children: React.ReactNode;
//   options?: confetti.Options;
//   className?: string;
// }

// export function ConfettiButton({
//   children,
//   options = {},
//   className = '',
// }: ConfettiButtonProps) {
//   const confettiRef = useRef<ConfettiRef>(null);

//   const handleClick = () => {
//     confettiRef.current?.fire(options);
//   };

//   return (
//     <div className="relative inline-block">
//       <button onClick={handleClick} className={className}>
//         {children}
//       </button>
//       <Confetti
//         ref={confettiRef}
//         className="pointer-events-none absolute left-0 top-0 z-50 size-full"
//       />
//     </div>
//   );
// }

// // Hook version for more control
// export function useConfettiButton() {
//   const confettiRef = useRef<ConfettiRef>(null);

//   const fire = (options?: confetti.Options) => {
//     confettiRef.current?.fire(options || {});
//   };

//   const ConfettiComponent = () => (
//     <Confetti
//       ref={confettiRef}
//       className="pointer-events-none absolute left-0 top-0 z-50 size-full"
//     />
//   );

//   return { fire, ConfettiComponent };
// }