enum Status {
    "None",
    "Not Started",
    "Dropped",
    "Paused",
    "Completed"
}

enum Platform {
    "None",
    "PC",
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

interface IFilters {
    status: Status,
    platform: Platform
}

interface ITag {
    type: string
    value: string
    color: string
}

interface ISortings extends IFilters {
    alphabet: Order
}

interface ICard {
    name: string
    image: string,
    tags: ITag[]
}

export {
    ICard,
    Status,
    Platform,
    Order,
    ITag,
    IFilters,
    ISortings,
    ViewMode
}