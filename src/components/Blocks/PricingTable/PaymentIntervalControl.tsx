'use client'

import { Fragment } from 'react'

const choices = [
  { value: 'month', label: 'Monthly' },
  { value: 'year', label: 'Yearly' }
]

export default function PaymentIntervalControl({ onChange }: { onChange: (value: string) => void }) {
  const name = 'payment-interval-control'
  return (
    <div
      className="tabs has-[input:nth-of-type(1)] relative grid h-12 auto-cols-fr grid-flow-col rounded-[10px] border-4 border-zinc-50 bg-zinc-100 transition-all
        duration-300 ease-in-out after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:top-0 after:w-[calc(100%/var(--count,3))]
        after:translate-x-[calc(var(--active,0)*100%)] after:rounded-md after:bg-white after:mix-blend-difference after:outline after:outline-2
        after:outline-transparent after:transition-[transform,outline] after:duration-200 after:content-[''] has-[:checked:nth-of-type(1)]:[--active:0]
        has-[:checked:nth-of-type(2)]:[--active:1] has-[:checked:nth-of-type(3)]:[--active:2] has-[input:nth-of-type(2)]:[--count:2]
        has-[input:nth-of-type(3)]:[--count:3] has-[:focus-visible]:after:outline-blue-500 dark:border-zinc-900 dark:bg-zinc-800">
      {choices.map((choice, ix) => (
        <Fragment key={ix}>
          <input
            type="radio"
            id={`${name}-${choice.value}`}
            name={name}
            onChange={() => onChange(choice.value)}
            value={choice.value}
            className="sr-only [&:checked+label]:[--highlight:1;] [&:not(:checked)+label:hover]:bg-[hsl(0,0%,20%)]
              [&:not(:checked)+label:hover]:[--highlight:0.35;]"
          />
          <label
            htmlFor={`${name}-${choice.value}`}
            className="grid h-full cursor-pointer place-items-center rounded-md px-[clamp(0.5rem,2vw+0.25rem,2rem)] text-center
              text-[hsla(0,0%,100%,calc(0.5+var(--highlight,0)))] transition-all duration-300 ease-in-out">
            {choice.label}
          </label>
        </Fragment>
      ))}
    </div>
  )
}
