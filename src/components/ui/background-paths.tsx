import { motion } from "framer-motion"

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5} ${216 - i * 6} ${152 - i * 5} ${343 - i * 4}C${616 - i * 5} ${470 - i * 3} ${684 - i * 5} ${875 - i * 2} ${684 - i * 5} ${875 - i * 2}`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-[#285A48]"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.08 + path.id * 0.003}
            initial={{ pathLength: 0.3, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0, 0.3 + path.id * 0.01, 0],
              pathOffset: [0, 1],
            }}
            transition={{
              duration: 20 + path.id * 0.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export function BackgroundPaths({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#091413]">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
      {children}
    </div>
  )
}
