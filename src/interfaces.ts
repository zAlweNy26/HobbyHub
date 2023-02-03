enum Status {
    "None",
    "Not Started",
    "Dropped",
    "Paused",
    "Completed"
}

enum Platform {
    "None",
    "Windows",
    "Nintendo Switch",
    "Xbox",
    "PlayStation"
}

enum Order {
    None,
    Ascending,
    Descending
}

enum ViewMode {
    Grid,
    Detail,
    Compact
}

interface IOption {
    value: string
    icon: string
    bg?: string
    fg?: string
}

interface ICategory {
    name: string
    icon: string
    options: IOption[]
}

interface IFilters {
    status: Status
    platform: Platform
}

interface ITag {
    type: string
    value: string
}

interface ISortings extends IFilters {
    alphabet: Order
}

interface ICard {
    name: string
    image: string
    added: number
    updated: number
    tags: ITag[]
}

export {
    ICard,
    Status,
    Platform,
    Order,
    ITag,
    ICategory,
    IOption,
    IFilters,
    ISortings,
    ViewMode
}