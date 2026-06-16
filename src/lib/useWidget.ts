import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import type { WidgetConfig } from './types'

export function useWidget() {
  return useQuery({
    queryKey: ['widget'],
    queryFn: () => api.get<WidgetConfig>('/api/widget'),
  })
}

export function useSaveWidget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<WidgetConfig>) => api.patch<WidgetConfig>('/api/widget', patch),
    onSuccess: (data) => qc.setQueryData(['widget'], data),
  })
}
