interface Props {
  title: string
  desc: string
  icon: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  disabled?: boolean
}

export const HeroCard = (props: Props) => {
  return (
    <div
      onClick={props.onClick}
      className={`rounded-xl bg-grey-800 p-4 flex gap-y-4 flex-wrap bg-hero-card shadow-xl ring-2  hover:ring-offset-blue-500  ${props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <div className='p-4 rounded-xl w-fit bg-hero-card-icon h-fit'>
        {props.icon}
      </div>
      <div className='w-full font-bold'>{props.title}</div>
      <div className='w-full font-[500] text-sm text-gray-400'>
        {props.desc}
      </div>
    </div>
  )
}
