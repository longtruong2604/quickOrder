import { getTableLink } from '@/lib/utils'
import QRCode from 'qrcode'
import { useEffect, useRef } from 'react'

const QRCodeComp = ({ token, tableNumber, width = 250 }: { token: string; tableNumber: number; width?: number }) => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    canvas.width = width
    canvas.height = width + 40
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.textAlign = 'center'
    ctx.fillStyle = 'black'
    ctx.font = '10px Arial'
    ctx.fillText(`Scan this QRCode to order`, canvas.width / 2, canvas.height - 30)
    ctx.font = '15px Arial'
    ctx.fillText(`Table no. ${tableNumber}`, canvas.width / 2, canvas.height - 10)
    const QRCanvas = document.createElement('canvas')
    QRCode.toCanvas(QRCanvas, getTableLink({ token, tableId: tableNumber }), { width, margin: 2 }, (error: any) => {
      if (error) console.error(error)
      ctx.drawImage(QRCanvas, 0, 0, width, width)
    })
  }, [tableNumber, token, width])

  return <canvas ref={ref}>QRCode</canvas>
}
export default QRCodeComp
