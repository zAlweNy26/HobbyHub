enum Status {
    Completed,
    Dropped,
    Paused,
    None
}

enum ViewMode {
    Grid,
    Detail,
    Compact
}

interface ICard {
    name: string
    image: string
}

interface IFilters {
    alphabet: boolean
    status: Status
}

export {
    ICard,
    Status,
    IFilters,
    ViewMode
}