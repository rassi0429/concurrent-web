import { createContext, useContext, useRef, type ReactNode } from 'react'

export interface ScrollPositionData {
    scrollOffset: number
    visibleStartIndex: number
    visibleEndIndex: number
    totalCount: number
}

interface ScrollPositionState {
    saveScrollPosition: (key: string, data: ScrollPositionData) => void
    getScrollPosition: (key: string) => ScrollPositionData | null
    clearScrollPosition: (key: string) => void
}

const ScrollPositionContext = createContext<ScrollPositionState | undefined>(undefined)

interface ScrollPositionProviderProps {
    children: ReactNode
}

export const ScrollPositionProvider = ({ children }: ScrollPositionProviderProps): JSX.Element => {
    const scrollPositions = useRef<Record<string, ScrollPositionData>>({})

    const saveScrollPosition = (key: string, data: ScrollPositionData): void => {
        scrollPositions.current[key] = data
    }

    const getScrollPosition = (key: string): ScrollPositionData | null => {
        return scrollPositions.current[key] ?? null
    }

    const clearScrollPosition = (key: string): void => {
        delete scrollPositions.current[key]
    }

    return (
        <ScrollPositionContext.Provider
            value={{
                saveScrollPosition,
                getScrollPosition,
                clearScrollPosition
            }}
        >
            {children}
        </ScrollPositionContext.Provider>
    )
}

export const useScrollPosition = (): ScrollPositionState => {
    const context = useContext(ScrollPositionContext)
    if (!context) {
        throw new Error('useScrollPosition must be used within a ScrollPositionProvider')
    }
    return context
}