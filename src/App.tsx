import { useRef } from 'react'
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

const ITEM_HEIGHT = 100

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

// Immutably moves the item at `from` to index `to`
function move<T>(items: T[], from: number, to: number): T[] {
  const next = items.slice()
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

// Returns fitting styles for dragged/idle items
const styleFor =
  (order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
  (index: number) =>
    active && index === originalIndex
      ? {
          y: curIndex * ITEM_HEIGHT + y,
          scale: 1.1,
          zIndex: 1,
          shadow: 15,
          immediate: (key: string) => key === 'y' || key === 'zIndex',
        }
      : {
          y: order.indexOf(index) * ITEM_HEIGHT,
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: false,
        }

type DraggableListProps = {
  items: string[]
}

export default function DraggableList({ items }: DraggableListProps) {
  // Item order lives in a ref, so dragging animates without causing a single render
  const order = useRef(items.map((_, index) => index))
  const [springs, api] = useSprings(items.length, styleFor(order.current))

  const bind = useDrag(({ args, active, movement: [, y] }) => {
    const originalIndex = args[0] as number
    const curIndex = order.current.indexOf(originalIndex)
    const curRow = clamp(Math.round((curIndex * ITEM_HEIGHT + y) / ITEM_HEIGHT), 0, items.length - 1)
    const newOrder = move(order.current, curIndex, curRow)
    // Feed the springs new style data; they animate the view directly
    api.start(styleFor(newOrder, active, originalIndex, curIndex, y))
    if (!active) order.current = newOrder
  })

  return (
    <div className="content" style={{ height: items.length * ITEM_HEIGHT }}>
      {springs.map(({ zIndex, shadow, y, scale }, i) => (
        <animated.div
          key={i}
          {...bind(i)}
          style={{
            zIndex,
            boxShadow: shadow.to((s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
            y,
            scale,
          }}
        >
          {items[i]}
        </animated.div>
      ))}
    </div>
  )
}
