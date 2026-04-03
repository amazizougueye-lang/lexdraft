import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
}

export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-[0.75rem] overflow-hidden transition-all"
          style={{
            background: openIndex === i ? '#0f1f1d' : '#0a1a18',
            border: `1px solid ${openIndex === i ? '#285A48' : '#1e3b32'}`,
          }}
        >
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-left"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span
              className="font-medium text-[15px] leading-snug pr-4"
              style={{ color: '#F0F4F2' }}
            >
              {item.question}
            </span>
            <span
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
              style={{
                background: openIndex === i ? '#285A48' : '#1e3b32',
                color: '#F0F4F2',
              }}
            >
              {openIndex === i
                ? <Minus size={12} />
                : <Plus size={12} />
              }
            </span>
          </button>

          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                style={{ overflow: 'hidden' }}
              >
                <p
                  className="px-6 pb-5 text-[14px] leading-relaxed"
                  style={{ color: '#8aada4' }}
                >
                  {item.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
