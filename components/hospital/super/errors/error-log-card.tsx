import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, getTimeSince } from '@/lib/utils'
import type { VetoolErrors } from '@/types'
import { ParsedError } from '@/types/hospital'
import { ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function ErrorLogCard({ errorLog }: { errorLog: VetoolErrors }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const parsedError: ParsedError = useMemo(() => {
    try {
      return JSON.parse(errorLog.error_json as string)
    } catch {
      return { message: errorLog.error_json }
    }
  }, [errorLog.error_json])

  const getStackTrace = (stack?: string) => {
    if (!stack) return []

    return stack.split('\n')
  }

  return (
    <Card className="mb-4">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge variant={errorLog.is_server ? 'destructive' : 'secondary'}>
              {errorLog.is_server ? 'Server' : 'Client'}
            </Badge>

            <CardTitle className="text-lg font-semibold">
              {errorLog.description || parsedError.message}
            </CardTitle>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {getTimeSince(errorLog.created_at)}
            </span>
            <ChevronDown
              className={cn(
                'h-5 w-5 transition-transform duration-300',
                isExpanded ? 'rotate-180' : '',
              )}
            />
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <ScrollArea className="h-full max-h-[500px] w-full">
          <CardContent>
            <div className="space-y-4">
              {parsedError.name && (
                <div>
                  <Label>에러 타입</Label>
                  <p className="mt-1">{parsedError.name}</p>
                </div>
              )}

              <div className="group relative">
                <Label>에러 메시지</Label>
                <p className="text-red-600">{parsedError.message}</p>
              </div>

              {parsedError.stack && (
                <div>
                  <Label>Stack Trace</Label>
                  <div className="mt-1 rounded-md bg-gray-100 p-3">
                    {getStackTrace(parsedError.stack).map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </div>
              )}

              {parsedError.errorUrl && (
                <div>
                  <Label>에러 발생 URL</Label>
                  <p className="mt-1 text-blue-600">{parsedError.errorUrl}</p>
                </div>
              )}

              <div className="border-t pt-2">
                <Label>에러 ID</Label>
                <p className="font-mono text-sm">{errorLog.vetool_error_id}</p>
              </div>
            </div>
          </CardContent>
        </ScrollArea>
      )}
    </Card>
  )
}
