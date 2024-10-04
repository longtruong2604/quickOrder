import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus } from 'lucide-react'

const QuantityCounter = ({ onChange, value }: { onChange: (quantity: number) => void; value: number }) => {
  return (
    <div className="flex gap-1 ">
      <Button disabled={value === 0} onClick={() => onChange(value - 1)} className="h-6 w-6 p-0">
        <Minus className="w-3 h-3" />
      </Button>
      <Input type="text" value={value} pattern="[0-9]*" inputMode="numeric" className="h-6 p-1 w-8" />
      <Button onClick={() => onChange(value + 1)} className="h-6 w-6 p-0">
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  )
}
export default QuantityCounter
