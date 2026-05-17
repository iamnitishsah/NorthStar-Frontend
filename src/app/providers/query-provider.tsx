import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60_000,
    },
  },
})

type Props = {
  children: React.ReactNode
}

export function QueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
