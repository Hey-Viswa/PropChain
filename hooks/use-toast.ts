import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string }

interface State {
  toasts: ToasterToast[]
}

export const toastState: State = {
  toasts: [],
}

let listeners: Array<(state: State) => void> = []

export function dispatch(action: Action) {
  switch (action.type) {
    case "ADD_TOAST":
      toastState.toasts = [action.toast, ...toastState.toasts].slice(0, TOAST_LIMIT)
      break
    case "UPDATE_TOAST":
      toastState.toasts = toastState.toasts.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t
      )
      break
    case "DISMISS_TOAST":
      toastState.toasts = toastState.toasts.filter((t) => t.id !== action.toastId)
      break
    case "REMOVE_TOAST":
      toastState.toasts = toastState.toasts.filter((t) => t.id !== action.toastId)
      break
  }
  listeners.forEach((listener) => listener(toastState))
}

export function toast(props: Omit<ToasterToast, "id">) {
  const id = genId()
  const update = (props: ToasterToast) => dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
    },
  })

  return { id, dismiss, update }
}

export function useToast() {
  const [state, setState] = React.useState<State>(toastState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}
